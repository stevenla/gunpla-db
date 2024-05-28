import brandsTranslations from './data/brands.json';
import seriesTranslations from './data/series.json';

type BrandInfo = {
  nameEn: string,
  imageIndex?: string,
}

type SeriesInfo = {
  nameEn: string,
  imageIndex?: string,
}

export function translateBrand(str: string): BrandInfo {
  const found = brandsTranslations[str];
  if (found) return found;
  console.error('brand translation not found', str)
  return { nameEn: str };
}

export function translateSeries(str: string): SeriesInfo {
  const found = seriesTranslations[str];
  if (found) return found;
  console.error('series translation not found', str)
  return { nameEn: str };
}