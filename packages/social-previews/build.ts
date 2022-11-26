import puppeteer, { Viewport } from 'puppeteer';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { languages } from '@hammertime/locales/config.json';
import dayjs from '@hammertime/dayjs';

const pathPackageMap: Record<string, string> = {
  '/logos': path.dirname(require.resolve('@hammertime/logos')),
};

const previewDimensions: Viewport = {
  width: 1200,
  height: 630,
};

const exampleTimestamp = 1626299131;

const createExpressServer = async () => {
  return new Promise<string>((res) => {
    console.info(`Creating express server for preview renderer`);
    const app = express();
    const port = 34567;

    console.info(`Path mappings: ${JSON.stringify(pathPackageMap, null, 2)}`);
    for (const [path, filesystemPath] of Object.entries(pathPackageMap)) {
      app.use(path, express.static(filesystemPath));
    }
    app.use(express.static('static'));

    app.listen(port, () => {
      console.log(`Preview renderer app listening on port ${port}`);
      res(`http://127.0.0.1:${port}`);
    });
  });
};

const getOutputFolder = async () => {
  const socialOutputDirectory = path.join(await fs.realpath(__dirname), 'dist');
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
  const socialOutputDirectory = await getOutputFolder();

  const loadPath = await createExpressServer();
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

    const languageKeys = Object.keys(languages) as Array<keyof typeof languages>;
    for (const language of languageKeys) {
      console.info(`language set to ${language}`);
      const languageConfig = languages[language];
      const momentLocale = 'momentLocale' in languageConfig ? languageConfig.momentLocale : language;
      const outputPath = path.join(socialOutputDirectory, `${momentLocale}.png`);
      const isRtl = 'rtl' in languageConfig && languageConfig.rtl === true;

      console.info('Running canvas render script');

      await page.waitForNetworkIdle();

      await page.evaluate(
        (
          socialCanvas: HTMLCanvasElement | null,
          appIconImage: HTMLImageElement | null,
          isRtl: boolean,
          momentLocale: string,
          exampleTs: number,
          relativeTs: string,
          dimensions: Viewport,
        ) => {
          if (!socialCanvas) {
            throw new Error('Could not find canvas element');
          }
          if (!appIconImage) {
            throw new Error('Could not find app logo element');
          }

          const socialCanvasWidth = dimensions.width;
          const socialCanvasHeight = dimensions.height;
          socialCanvas.width = socialCanvasWidth;
          socialCanvas.height = socialCanvasHeight;
          const socialCanvasCtx = socialCanvas.getContext('2d');
          if (socialCanvasCtx === null) {
            throw new Error('Failed to get socialCanvas 2D context');
          }
          socialCanvasCtx.direction = isRtl ? 'rtl' : 'ltr';

          const appIconSize = 250;

          // Solid background
          socialCanvasCtx.fillStyle = '#000';
          socialCanvasCtx.fillRect(0, 0, socialCanvasWidth, socialCanvasHeight);

          // Gradient pass
          const gradientStartXOffset = 0.33;
          const gradientEndXOffset = 0.66;
          const gradientStartX = socialCanvasWidth * (isRtl ? gradientEndXOffset : gradientStartXOffset);
          const gradientEndX = socialCanvasWidth * (isRtl ? gradientStartXOffset : gradientEndXOffset);
          const gradient = socialCanvasCtx.createLinearGradient(gradientStartX, 0, gradientEndX, socialCanvasHeight);
          const gradientOpacity = 0.25;
          const gradientColors = [
            `rgba(88, 94, 242, ${gradientOpacity})`,
            `rgba(88, 101, 242, ${gradientOpacity})`,
            `rgba(165, 94, 165, ${gradientOpacity})`,
          ];
          if (isRtl) gradientColors.reverse();
          gradientColors.forEach((color, i, arr) => {
            const pos = i / (arr.length - 1);
            gradient.addColorStop(isRtl ? 1 - pos : pos, color);
          });
          socialCanvasCtx.fillStyle = gradient;
          socialCanvasCtx.fillRect(0, 0, socialCanvasWidth, socialCanvasHeight);

          // Place logo
          const logoLeftOffset = 33;
          const logoX = isRtl ? socialCanvasWidth - appIconSize - logoLeftOffset : logoLeftOffset;
          const logoY = Math.floor((socialCanvasHeight - appIconSize) / 2);
          socialCanvasCtx.drawImage(appIconImage, logoX, logoY, appIconSize, appIconSize);

          const findTextFontFamily = (id: string): string => {
            const el = document.getElementById(id);
            if (!el) {
              const errorMessage = `Could not find text element by ID ${id}`;
              console.error(errorMessage);
              throw new Error(errorMessage);
            }

            return window.getComputedStyle(el).fontFamily;
          };

          const monospaceFontFamily = findTextFontFamily('mono-text');
          const jaFontFamily = findTextFontFamily('ja-text');
          const koFontFamily = findTextFontFamily('ko-text');

          const getFontProperty = (fontFamily: string): string => `${lineHeight}px ${fontFamily}`;

          // Write chat syntax example
          const chatSyntaxText = [`<t:${exampleTs}:R>`, '⇣', relativeTs];
          const lineHeight = 80;
          const offsetLineHeight = lineHeight * 1.1;
          socialCanvasCtx.font = getFontProperty(monospaceFontFamily);
          socialCanvasCtx.textAlign = 'center';
          socialCanvasCtx.fillStyle = '#dcddde';
          const textCenterX = Math.floor((socialCanvasWidth / 5) * (isRtl ? 2 : 3));
          const textCenterY = Math.floor(socialCanvasHeight / 2) * 1.05;
          socialCanvasCtx.fillText(chatSyntaxText[0], textCenterX, textCenterY - offsetLineHeight);
          socialCanvasCtx.fillText(chatSyntaxText[1], textCenterX, textCenterY);
          switch (momentLocale) {
            case 'ja':
              socialCanvasCtx.font = getFontProperty(jaFontFamily);
              break;
            case 'ko':
              socialCanvasCtx.font = getFontProperty(koFontFamily);
              break;
          }
          socialCanvasCtx.fillText(chatSyntaxText[2], textCenterX, textCenterY + offsetLineHeight);
        },
        await page.$('canvas'),
        await page.$('img'),
        isRtl,
        momentLocale,
        exampleTimestamp,
        dayjs(new Date(exampleTimestamp * 1e3))
          .locale(momentLocale)
          .fromNow(),
        previewDimensions,
      );

      console.log(`Generating screenshot for ${momentLocale}`);
      await page.screenshot({ path: outputPath });

      console.info(`Generated preview for ${momentLocale} in ${outputPath}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }

  process.exit(0);
})();
