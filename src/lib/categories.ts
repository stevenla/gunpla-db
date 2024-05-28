import brandsTranslations from './data/brands.json';
import seriesTranslations from './data/series.json';

type BrandInfo = {
  nameEn: string,
  nameJp: string,
  imageIndex?: string,
}

type SeriesInfo = {
  nameEn: string,
  nameJp: string,
  imageIndex?: string,
}

export const ALL_BRANDS = Object.values<BrandInfo>(brandsTranslations as any).sort((a, b) => {
  return a.nameEn.localeCompare(b.nameEn)
});

export const ALL_SERIES = Object.values<SeriesInfo>(seriesTranslations as any).sort((a, b) => {
  return a.nameEn.localeCompare(b.nameEn)
});

export function translateBrand(str: string): BrandInfo {
  const found = brandsTranslations[str];
  if (found) return found;
  console.error('brand translation not found', str)
  return { nameEn: str, nameJp: str };
}

export function translateSeries(str: string): SeriesInfo {
  const found = seriesTranslations[str];
  if (found) return found;
  console.error('series translation not found', str)
  return { nameEn: str, nameJp: str };
}