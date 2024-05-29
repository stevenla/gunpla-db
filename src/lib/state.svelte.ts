import { browser } from '$app/environment'

export type RuneRef<T> = { current: T };

function getSearch(): string | undefined {
  if (browser) {
    return window.location.search
  } else {
    return undefined;
  }
}

function setSearch(value: string) {
  if (browser) {
    const baseurl = window.location.host + window.location.pathname;
    const query = value.length > 0 ? '?' + value : ''
    window.history.replaceState({}, window.document.title, `//${baseurl}${query}`);
  }
}

export function createQueryParamState(name: string, defaultValue: string): RuneRef<string> {
  const paramsOnLoad = new URLSearchParams(getSearch());
  let state = $state(paramsOnLoad.get(name) ?? defaultValue);
  $effect(() => {
    const paramsInEffect = new URLSearchParams(getSearch());
    if (paramsInEffect.get(name) !== state) {
      if (state === defaultValue) {
        paramsInEffect.delete(name);
      } else {
        paramsInEffect.set(name, state);
      }
      setSearch(paramsInEffect.toString());
    }
  });
  return {
    get current() {
      return state;
    },
    set current(value: string) {
      state = value;
    }
  }
}

export function createCsvQueryParamState(name: string, defaultValue: string[]): RuneRef<string[]> {
  const toString = (value: string[]) => value.join(',');
  const fromString = (value: string) => value === '' ? [] : value.split(',');
  let raw = createQueryParamState(name, toString(defaultValue));
  return {
    get current() {
      return fromString(raw.current);
    },
    set current(value: string[]) {
      raw.current = toString(value);
    }
  }
}
