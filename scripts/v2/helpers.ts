import repeat from 'lodash/repeat';
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

/**
 * Gets the SHA-256 digest from `message` as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('sha-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

let indentLevel = 0;
export async function block<T>(msg: string, cb: () => Promise<T> | T) {
  log(`${msg} ...`)
  indentLevel++;
  const res = await cb()
  indentLevel--;
  log(`Done! (${msg})`)
  return res
}

export function log(msg: string) {
  console.log(repeat('  ', indentLevel) + msg)
}

export function error(msg: string) {
  console.error(repeat('  ', indentLevel) + msg)
}

export function filterNull<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter(x => x != null)
}

export function parseJpy(price: string): number | undefined {
  // const taxIncluded = price.includes('(税10%込)')
  const priceSubstr = price.slice(0, price.indexOf('円')).replaceAll(',', '')
  const priceNumber = Number(priceSubstr)
  if (Number.isNaN(priceNumber)) {
    return undefined
  }
  return priceNumber
  // return taxIncluded ? priceNumber * .9 : priceNumber;
}


export function translateDate(jp: string): string {
  const match = jp.match(/(\d+)年(\d+)月(\d+)?日?/);
  if (match) {
    const [, y, m, d] = match;
    const year = y.padStart(4, '0');
    const month = m.padStart(2, '0');
    if (d) {
      return `${year}-${month}-${d.padStart(2, '0')}`
    } else {
      return `${year}-${month}`
    }
  }
  return "N/A"
}