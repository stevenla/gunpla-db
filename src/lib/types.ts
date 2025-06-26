export type Product = {
  id: string,
  brand: string,
  partNo: string,
  releaseDate: string,
  nameJp: string,
  nameEn: string,
  series: string,
}
export type Series = {
  "slug": string,
  "nameEn": string,
  "imageIndex": string,
  "nameJp": string,
  "year": number
}