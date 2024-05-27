import { ArtDisplayData } from "./art-display-data";

export interface BrandImageConfig {
  url: string;
  height: string;
}

export interface ArtService {
  baseUrl: string;
  apiKey: string;
  brandImageConfig: BrandImageConfig

  getRandomArt(): Promise<ArtDisplayData>;
  parseIntoArtDisplayData(item: any): ArtDisplayData;
}