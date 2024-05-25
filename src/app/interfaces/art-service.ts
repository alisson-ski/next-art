import { ArtDisplayData } from "./art-display-data";

export interface ArtService {
  baseUrl: string;
  apiKey: string;

  getRandomArt(): Promise<ArtDisplayData>;
  parseIntoArtDisplayData(item: any): ArtDisplayData;
}