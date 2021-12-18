import type { NextApiRequest, NextApiResponse } from 'next';

const rickRollLinkPool = [
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

export default async (_: NextApiRequest, response: NextApiResponse) => {
  await new Promise((resolve) => setTimeout(resolve, 1e3 + Math.random() * 2e3));

  const redirectUrl = rickRollLinkPool[Math.floor(rickRollLinkPool.length * Math.random())];

  response.redirect(307, redirectUrl);
};
