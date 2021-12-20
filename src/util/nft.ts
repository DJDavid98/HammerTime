import { mulberry32 } from 'src/util/random';

export interface NftStatus {
  currentPrice: number;
  previousPrice: number;
  nextUpdate: string;
}

const getUpdateTime = (offset?: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  if (offset) {
    date.setTime(date.getTime() + offset);
  }
  return date;
};

const getPrice = (offset?: number) => {
  const today = getUpdateTime(offset);
  const randomizer = mulberry32(today.getTime());
  return 0.2 + randomizer() * 0.2;
};

const oneDayInMilliseconds = 1e3 * 60 * 60 * 24;

export const getNftData = async (): Promise<NftStatus> => {
  await new Promise((resolve) => setTimeout(resolve, 750 + Math.random() * 1000));

  const offset = oneDayInMilliseconds;
  const currentPrice = getPrice();
  const previousPrice = getPrice(-offset);

  return {
    currentPrice,
    previousPrice,
    nextUpdate: getUpdateTime(offset).toISOString(),
  };
};

export const rickRollLinkPool = [
  // The original, truly a masterpiece
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  // Russian version
  'https://www.youtube.com/watch?v=LNME_sRbJJU&t=4s',
  // "dorime. ameno. Rick Astley FULL VERSION"
  'https://www.youtube.com/watch?v=h2a6YvNdliI',
  // "AVICII & RICK ASTLEY - Never Gonna Wake You Up (NilsOfficial Mashup)"
  'https://www.youtube.com/watch?v=oT3mCybbhf0',
  // "Rick Astley - Never Gonna Coffin You Up"
  'https://www.youtube.com/watch?v=FpFztrJbksg&t=8s',
  // "Never Gonna Give You Up MA E' BLUE - Rick Astley and Eiffel65 [Mashup Lol]"
  'https://www.youtube.com/watch?v=3MKBDIbydZo',
  // "Never Gonna Give Together Forever Up [Rick Astley mash-up]"
  'https://www.youtube.com/watch?v=gQfGgHfQgv0',
];
