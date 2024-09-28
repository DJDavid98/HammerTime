import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import puppeteer, { Viewport } from 'puppeteer';
import { dynamicImport } from 'tsimportlib';
import localeConfig from '../public/locales/config.json';
import dayjs from '../src/dayjs';

const previewDimensions: Viewport = {
  width: 1200,
  height: 630,
};

const exampleTimestamp = 1626299131;

const getPublicPath = async () => path.join(await fs.realpath(__dirname), '..', 'public');

/* eslint-disable no-console */

const createExpressServer = async (publicPath: string) =>
  new Promise<string>((res) => {
    console.info(`Creating express server for preview renderer`);
    const app = express();
    const port = 34567;

    app.use(express.static(publicPath));

    app.listen(port, () => {
      console.log(`Preview renderer app listening on port ${port}`);
      res(`http://127.0.0.1:${port}/social`);
    });
  });

const getOutputFolder = async (publicPath: string) => {
  const socialOutputDirectory = path.join(publicPath, 'social', 'preview');
  // Ensure output directory exists
  try {
    await fs.access(socialOutputDirectory);
  } catch {
    await fs.mkdir(socialOutputDirectory, { recursive: true });
  }
  return socialOutputDirectory;
};

void (async () => {
  const browser = await puppeteer.launch({
    defaultViewport: previewDimensions,
    dumpio: true,
    headless: true,
  });
  const publicPath = await getPublicPath();
  const socialOutputDirectory = await getOutputFolder(publicPath);

  const loadPath = await createExpressServer(publicPath);
  const handleError = async <E extends Error>(e: E) => {
    console.error(e);
    await browser.close();
    process.exit();
  };

  const { default: imagemin } = (await dynamicImport('imagemin', module)) as typeof import('imagemin');
  const { default: imageminPngquant } = (await dynamicImport('imagemin-pngquant', module)) as typeof import('imagemin-pngquant');

  try {
    const page = await browser.newPage();
    page.on('error', (e) => {
      void handleError(e);
    });
    page.on('pageerror', (e) => {
      void handleError(e);
    });
    await page.goto(loadPath);

    const languageKeys = (Object.keys(localeConfig.languages) as Array<keyof typeof localeConfig.languages & string>).sort();
    // eslint-disable-next-line no-restricted-syntax
    for (const language of languageKeys) {
      console.info(`language set to ${language}`);
      const languageConfig = localeConfig.languages[language];
      const dayjsLocaleOuter = 'dayjsLocale' in languageConfig ? languageConfig.dayjsLocale : language;
      const outputPath = path.join(socialOutputDirectory, `${dayjsLocaleOuter}.png`);
      const isRtlOuter = 'rtl' in languageConfig && languageConfig.rtl === true;

      console.info('Running canvas render script');

      await page.waitForNetworkIdle({
        idleTime: 1000,
      });

      await page.evaluate(
        (
          textEl: Element | null,
          textCodeEl: Element | null,
          textExampleEl: Element | null,
          isRtl: boolean,
          dayjsLocale: string,
          exampleTs: number,
          relativeTs: string,
          dimensions: Viewport,
        ) => {
          if (!document.documentElement.hasAttribute('style')) {
            document.documentElement.style.setProperty('--width', `${dimensions.width}px`);
            document.documentElement.style.setProperty('--height', `${dimensions.height}px`);
          }
          document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

          if (
            !(textEl && textEl instanceof HTMLElement) ||
            !(textCodeEl && textCodeEl instanceof HTMLElement) ||
            !(textExampleEl && textExampleEl instanceof HTMLElement)
          ) {
            throw new Error('Missing HTML elements on the page');
          }

          const findTextFontFamily = (locale: string): string => {
            const el = document.querySelector(`.local-text[lang="${locale}"]`);
            if (!el) {
              return '';
            }

            return window.getComputedStyle(el).fontFamily;
          };

          /* eslint-disable no-param-reassign */
          textEl.style.fontFamily = findTextFontFamily(dayjsLocale);

          // Write chat syntax example
          const chatSyntaxText = [`<t:${exampleTs}:R>`, '⇣', relativeTs];
          textCodeEl.innerText = chatSyntaxText[0];
          textExampleEl.innerText = chatSyntaxText[2];
          /* eslint-enable no-param-reassign */
        },
        await page.$('#text'),
        await page.$('#text-code'),
        await page.$('#text-example'),
        isRtlOuter,
        dayjsLocaleOuter,
        exampleTimestamp,
        dayjs(new Date(exampleTimestamp * 1e3))
          .locale(dayjsLocaleOuter)
          .fromNow(),
        previewDimensions,
      );

      console.log(`Generating screenshot for ${dayjsLocaleOuter}`);
      await page.screenshot({ path: outputPath });

      console.info(`Generated preview for ${dayjsLocaleOuter} in ${outputPath}`);
    }

    console.log('Optimizing images…');
    await imagemin([`${socialOutputDirectory}/*.png`], {
      destination: socialOutputDirectory,
      plugins: [
        imageminPngquant({
          dithering: false,
        }),
      ],
    });

    console.log('Images optimized');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }

  process.exit(0);
})();
