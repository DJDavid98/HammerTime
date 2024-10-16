/* eslint-disable no-console */

interface CrowdinApiRequestParams {
  path: string;
  crowdinApiKey: string;
  method?: string;
  body?: RequestInit['body'];
  headers?: Record<string, string>;
}

export const crowdinApiRequestRaw = ({
  path,
  crowdinApiKey,
  method = 'GET',
  body,
  headers,
}: CrowdinApiRequestParams): Promise<Response> => {
  const url = `https://api.crowdin.com/api/v2${path}`;
  console.info(`Crowdin API ${method} ${url}`);
  return fetch(url, {
    method,
    body,
    headers: {
      ...headers,
      Authorization: `Bearer ${crowdinApiKey}`,
    },
  });
};

export const crowdinApiRequest = <Result>(params: CrowdinApiRequestParams): Promise<Result> =>
  crowdinApiRequestRaw(params).then((r) => r.json() as Promise<Result>);
