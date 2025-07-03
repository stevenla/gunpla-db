import { default as nodeFetch, RequestInfo, RequestInit } from 'node-fetch';

export const fetch = (url: RequestInfo, { headers, ...options }: RequestInit = {}) => {
  return nodeFetch(url, {
    headers: {
      "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0',
      ...headers,
    },
    ...options,
  });
};