const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const moment = require('moment-timezone');
const { languages } = require('../public/locales/config.json');
const { createCanvas, registerFont, loadImage } = require('canvas');

console.info('Generating social previews…');

(async () => {
  const appIconSVG = await fs.realpath(path.join(__dirname, '../public/logos/app.svg'));
  const socialOutputDirectory = path.join(await fs.realpath(path.join(__dirname, '../public')), 'social');

  // Ensure output directory exists
  await fs.access(socialOutputDirectory).catch(() => fs.mkdir(socialOutputDirectory, { recursive: true }));

  const nodeModulesPath = await fs.realpath(path.join(__dirname, '../node_modules'));
  const fontPackagePath = path.join(nodeModulesPath, 'source-code-pro');
  const fontFamily = 'Source Code Pro';
  const fontStyle = 'normal';
  const fontWeight = '500';
  const fontPath = await fs.realpath(path.join(fontPackagePath, 'TTF', 'SourceCodePro-Regular.ttf'));
  registerFont(fontPath, {
    family: fontFamily,
    style: fontStyle,
    weight: fontWeight,
  });

  const jaFontPackagePath = path.join(nodeModulesPath, 'noto-sans-japanese');
  const jaFontFamily = 'NotoSansJP';
  const jaFontStyle = 'normal';
  const jaFontWeight = '600';
  const jaFontPath = await fs.realpath(path.join(jaFontPackagePath, 'fonts', 'NotoSansJP-Regular.otf'));
  registerFont(jaFontPath, {
    family: jaFontFamily,
    style: jaFontStyle,
    weight: jaFontWeight,
  });

  const koFontPackagePath = path.join(nodeModulesPath, '@kfonts', 'bm-euljiro');
  const koFontFamily = '"배달의민족 을지로체 TTF", "배달의민족을지로체TTF", "bm-euljiro"';
  const koFontStyle = 'normal';
  const koFontWeight = '600';
  const koFontPath = await fs.realpath(path.join(koFontPackagePath, 'BMEULJIROTTF.ttf'));
  registerFont(koFontPath, {
    family: koFontFamily,
    style: koFontStyle,
    weight: koFontWeight,
  });

  const thFontPackagePath = path.join(nodeModulesPath, 'addthaifont-pdfmake');
  const thFontFamily = 'Sarabun';
  const thFontStyle = 'normal';
  const thFontWeight = '600';
  const thFontPath = await fs.realpath(path.join(thFontPackagePath, 'fonts', 'ThaiFonts', 'Sarabun-Regular.ttf'));
  registerFont(thFontPath, {
    family: thFontFamily,
    style: thFontStyle,
    weight: thFontWeight,
  });

  const latestTimezoneData = require('moment-timezone/data/packed/latest.json');
  moment.tz.load(latestTimezoneData);

  const now = new Date();

  await Promise.all(
    Object.keys(languages).map(async (language) => {
      const languageConfig = languages[language];
      const momentLocale = languageConfig.momentLocale || language;
      if (language !== 'en') require(`moment/locale/${momentLocale}`);
      const outputPath = path.join(socialOutputDirectory, `${momentLocale}.png`);
      const isRtl = languageConfig.rtl === true;

      const socialCanvasWidth = 1200;
      const socialCanvasHeight = 630;
      const socialCanvas = createCanvas(socialCanvasWidth, socialCanvasHeight);
      const socialCanvasCtx = socialCanvas.getContext('2d');
      socialCanvasCtx.direction = isRtl ? 'rtl' : 'ltr';

      const appIconSize = 250;
      const appIconAsPNG = await sharp(appIconSVG, { density: 1125 }).resize(appIconSize).png().toBuffer();
      const appIconImageData = await loadImage(appIconAsPNG);

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
      let gradientColors = [
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
      socialCanvasCtx.drawImage(appIconImageData, logoX, logoY);

      // Write chat syntax example
      const exampleTimestamp = 1626299131;
      const chatSyntaxText = [
        `<t:${exampleTimestamp}:R>`,
        '⇣',
        moment(new Date(exampleTimestamp * 1e3))
          .locale(momentLocale)
          .from(now),
      ];
      const lineHeight = 80;
      const offsetLineHeight = lineHeight * 1.1;
      // socialCanvasCtx.font = `${lineHeight}px ${fontFamily}, ${jaFontFamily}, ${koFontFamily}`;
      socialCanvasCtx.font = `${lineHeight}px ${fontFamily}`;
      socialCanvasCtx.textAlign = 'center';
      socialCanvasCtx.fillStyle = '#dcddde';
      const textCenterX = Math.floor((socialCanvasWidth / 5) * (isRtl ? 2 : 3));
      const textCenterY = Math.floor(socialCanvasHeight / 2) * 1.05;
      socialCanvasCtx.fillText(chatSyntaxText[0], textCenterX, textCenterY - offsetLineHeight);
      socialCanvasCtx.fillText(chatSyntaxText[1], textCenterX, textCenterY);
      let previewOffsetMultiplier = 1;
      switch (language) {
        case 'ja':
          socialCanvasCtx.font = jaFontFamily;
          break;
        case 'ko':
          socialCanvasCtx.font = koFontFamily;
          break;
        case 'th':
          socialCanvasCtx.font = thFontFamily;
          previewOffsetMultiplier = 1.33;
          break;
      }
      socialCanvasCtx.fillText(chatSyntaxText[2], textCenterX, textCenterY + offsetLineHeight * previewOffsetMultiplier);

      await fs.writeFile(outputPath, socialCanvas.toBuffer('image/png', { compressionLevel: 9 }));

      console.info(`Generated preview for ${momentLocale} in ${outputPath}`);
    }),
  );

  console.info('Social previews have been generated successfully');
})();
