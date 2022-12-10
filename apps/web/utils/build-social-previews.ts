import puppeteer, { Viewport } from 'puppeteer';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { languages } from '../public/locales/config.json';
import dayjs from '@hammertime/dayjs';

const previewDimensions: Viewport = {
  width: 1200,
  height: 630,
};

const exampleTimestamp = 1626299131;

const getPublicPath = async () => path.join(await fs.realpath(__dirname), '..', 'public');

const createExpressServer = async (publicPath: string) => {
  return new Promise<string>((res) => {
    console.info(`Creating express server for preview renderer`);
    const app = express();
    const port = 34567;

    app.use(express.static(publicPath));

    app.listen(port, () => {
      console.log(`Preview renderer app listening on port ${port}`);
      res(`http://127.0.0.1:${port}/social`);
    });
  });
};

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
  });
  const publicPath = await getPublicPath();
  const socialOutputDirectory = await getOutputFolder(publicPath);

  const loadPath = await createExpressServer(publicPath);
  const handleError = async <E extends Error>(e: E) => {
    console.error(e);
    await browser.close();
    process.exit();
  };

  try {
    const page = await browser.newPage();
    page.on('error', (e) => {
      void handleError(e);
    });
    page.on('pageerror', (e) => {
      void handleError(e);
    });
    await page.goto(loadPath);

    const languageKeys = (Object.keys(languages) as Array<keyof typeof languages>).sort();
    for (const language of languageKeys) {
      console.info(`language set to ${language}`);
      const languageConfig = languages[language];
      const dayjsLocale = 'dayjsLocale' in languageConfig ? languageConfig.dayjsLocale : language;
      const outputPath = path.join(socialOutputDirectory, `${dayjsLocale}.png`);
      const isRtl = 'rtl' in languageConfig && languageConfig.rtl === true;

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

          textEl.style.fontFamily = findTextFontFamily(dayjsLocale);

          // Write chat syntax example
          const chatSyntaxText = [`<t:${exampleTs}:R>`, '⇣', relativeTs];
          textCodeEl.innerText = chatSyntaxText[0];
          textExampleEl.innerText = chatSyntaxText[2];
        },
        await page.$('#text'),
        await page.$('#text-code'),
        await page.$('#text-example'),
        isRtl,
        dayjsLocale,
        exampleTimestamp,
        dayjs(new Date(exampleTimestamp * 1e3))
          .locale(dayjsLocale)
          .fromNow(),
        previewDimensions,
      );

      console.log(`Generating screenshot for ${dayjsLocale}`);
      await page.screenshot({ path: outputPath });

      console.info(`Generated preview for ${dayjsLocale} in ${outputPath}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }

  process.exit(0);
})();
