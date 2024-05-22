import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = 'https://api.themoviedb.org/3';
  private apiKey = environment.apiKeys.movie;

  private variableFilters = [
    {name: 'with_genres', values: ['28', '12', '16', '35', '80', '99', '18', '10751', '14', '36', '10402', '9648', '10749', '878', '10770', '53', '10752', '37']},
    {name: 'page', values: ['1', '2', '3']},
  ]

  constructor(private httpClient: HttpClient) { }

  getRandomMovie() {
    const params = this.getRandomQueryParams();
    return this.httpClient.get(`${this.baseUrl}/discover/movie`, { params }).pipe(map((res: any) => {
      return this.getRandomItemFromArray(res['results']);
    }));
  }

  private getRandomQueryParams() {
    let params = this.getBaseParams()
      .set('include_adult', 'true')
      .set('sort_by', 'popularity.desc')
      .set('language', 'en-US')

    this.variableFilters.forEach(filter => {
      const value = this.getRandomItemFromArray(filter.values);
      params = params.set(filter.name, value);
    });

    return params;
  }

  private getBaseParams() {
    return new HttpParams().set('api_key', this.apiKey);
  }

  //TODO - move this to a utility service
  private getRandomItemFromArray(array: any[]) {
    return array[this.getRandomNumber(0, array.length - 1)];
  }

  private getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
