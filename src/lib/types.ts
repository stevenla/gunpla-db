export type BandaiManualProductOld = {
	id: string;
	brand: string;
	partNo: string;
	releaseDate: string;
	nameJp: string;
	nameEn: string;
	series: string;
};
export type BandaiManualSeriesOld = {
	slug: string;
	nameEn: string;
	imageIndex: string;
	nameJp: string;
	year: number;
};

export type BandaiManualItem = {
	itemUrl: string;
	nameJp: string;
	nameEn: string;
	thumbnailUrl: string;
	releaseDate: string;
	categoryId: string;
	titleId: string;
};

export type BandaiHobbyItem = {
	itemUrl: string;
	nameJp: string;
	thumbnailUrl?: string;
	msrpJpy?: number;
	releaseDate?: string;
	tags: string[];
};

type BandaiHobbyCategoryKind = 'brand' | 'series';

export type BandaiHobbyCategory = {
	kind: BandaiHobbyCategoryKind;
	slug: string;
	nameJp: string;
	nameEn?: string;
};

export type BandaiHobbyCategoryItems = {
	kind: BandaiHobbyCategoryKind;
	slug: string;
	thumbnailUrl?: string;
	itemUrls: string[];
};
