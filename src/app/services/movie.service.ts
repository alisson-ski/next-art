import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom, map } from 'rxjs';
import { ArtService } from '../interfaces/art-service';
import { ArtDisplayData } from '../interfaces/art-display-data';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService implements ArtService {

  http = inject(HttpClient);
  utilityService = inject(UtilityService);

  baseUrl = 'https://api.themoviedb.org/3';
  apiKey = environment.apiKeys.movie;

  protected genreMap = new Map<number, string>([
    [28, 'Action'],
    [12, 'Adventure'],
    [16, 'Animation'],
    [35, 'Comedy'],
    [80, 'Crime'],
    [99, 'Documentary'],
    [18, 'Drama'],
    [10751, 'Family'],
    [14, 'Fantasy'],
    [36, 'History'],
    [10402, 'Music'],
    [9648, 'Mystery'],
    [10749, 'Romance'],
    [878, 'Science Fiction'],
    [10770, 'TV Movie'],
    [53, 'Thriller'],
    [10752, 'War'],
    [37, 'Western']
  ]);

  protected variableFilters = [
    {name: 'with_genres', values: Array.from(this.genreMap.keys())},
    {name: 'page', values: ['1', '2', '3']},
  ]

  constructor() { }

  getRandomArt(): Promise<ArtDisplayData> {
    const params = this.getRandomQueryParams();
    return lastValueFrom(this.http.get(`${this.baseUrl}/discover/movie`, { params }).pipe(map((res: any) => {
      const item = this.utilityService.getRandomItemFromArray(res['results']);
      return this.parseIntoArtDisplayData(item);
    })));
  }

  parseIntoArtDisplayData(movie: any): ArtDisplayData {
    return {
      title: movie.title,
      author: '',
      rating: Math.round(movie.vote_average / 2),
      year: movie.release_date.split('-')[0],
      description: movie.overview,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      tags: movie.genre_ids.map((id: number) => this.genreMap.get(id))
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
