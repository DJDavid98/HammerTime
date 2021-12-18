import type { NextApiRequest, NextApiResponse } from 'next';
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

export default async (_: NextApiRequest, response: NextApiResponse<NftStatus>) => {
  await new Promise((resolve) => setTimeout(resolve, 750 + Math.random() * 1000));

  const offset = oneDayInMilliseconds;
  const currentPrice = getPrice();
  const previousPrice = getPrice(-offset);

  response.status(200).json({
    currentPrice,
    previousPrice,
    nextUpdate: getUpdateTime(offset).toISOString(),
  });
};
