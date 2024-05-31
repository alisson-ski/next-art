import { Injectable, inject } from '@angular/core';
import { ArtDisplayData } from '../interfaces/art-display-data';
import { lastValueFrom, map } from 'rxjs';
import { MovieService } from './movie.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvShowService {

  http = inject(HttpClient);
  utilityService = inject(UtilityService);

  baseUrl = 'https://api.themoviedb.org/3';
  apiKey = environment.apiKeys.movie;
  brandImageConfig = {
    url: 'assets/api-brands/tmdb.svg',
    height: '0.7rem'
  };

  genreMap = new Map<number, string>([
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
  
  variableFilters = [
    {name: 'with_genres', values: Array.from(this.genreMap.keys())},
    {name: 'page', values: ['1']},
  ]

  constructor() { }

  getRandomArt(): Promise<ArtDisplayData> {
    const params = this.getRandomQueryParams();
    return lastValueFrom(this.http.get(`${this.baseUrl}/discover/tv`, { params }).pipe(map((res: any) => {
      const item = this.utilityService.getRandomItemFromArray(res['results']);
      return this.parseIntoArtDisplayData(item);
    })));
  }

  parseIntoArtDisplayData(tvShow: any): ArtDisplayData {
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

  protected getRandomQueryParams() {
    let params = this.getBaseParams()
      .set('include_adult', 'true')
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US')

    this.variableFilters.forEach(filter => {
      const value = this.utilityService.getRandomItemFromArray(filter.values);
      params = params.set(filter.name, value);
    });

    return params;
  }

  private getBaseParams() {
    return new HttpParams().set('api_key', this.apiKey);
  }
}
