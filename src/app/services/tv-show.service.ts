import { Injectable } from '@angular/core';
import { ArtDisplayData } from '../interfaces/art-display-data';
import { lastValueFrom, map } from 'rxjs';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class TvShowService extends MovieService {

  override genreMap = new Map<number, string>([
    [10759, 'Action & Adventure'],
    [16, 'Animation'],
    [35, 'Comedy'],
    [80, 'Crime'],
    [99, 'Documentary'],
    [18, 'Drama'],
    [10751, 'Family'],
    [10762, 'Kids'],
    [9648, 'Mystery'],
    [10763, 'News'],
    [10764, 'Reality'],
    [10765, 'Sci-Fi & Fantasy'],
    [10766, 'Soap'],
    [10767, 'Talk'],
    [10768, 'War & Politics'],
    [37, 'Western']
  ]);

  override variableFilters = [
    {name: 'with_genres', values: Array.from(this.genreMap.keys())},
    {name: 'page', values: ['1']},
  ]

  constructor() {
    super();
  }

  override getRandomArt(): Promise<ArtDisplayData> {
    const params = this.getRandomQueryParams();
    return lastValueFrom(this.http.get(`${this.baseUrl}/discover/tv`, { params }).pipe(map((res: any) => {
      const item = this.utilityService.getRandomItemFromArray(res['results']);
      return this.parseIntoArtDisplayData(item);
    })));
  }

  override parseIntoArtDisplayData(tvShow: any): ArtDisplayData {
    return {
      title: tvShow.name,
      author: '',
      rating: Math.round(tvShow.vote_average / 2),
      year: tvShow.first_air_date.split('-')[0],
      description: tvShow.overview,
      imageUrl: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
      tags: tvShow.genre_ids.map((id: number) => this.genreMap.get(id))
    }
  }
}
