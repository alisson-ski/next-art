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
export class BookService implements ArtService {

  http = inject(HttpClient);
  utilityService = inject(UtilityService);

  baseUrl = 'https://api.nytimes.com/svc/books/v3/lists';
  apiKey = environment.apiKeys.book;

  listNames = [
    'hardcover-fiction',
    'trade-fiction-paperback',
    'hardcover-graphic-books',
    'paperback-graphic-books',
    'manga',
    'combined-print-fiction',
    'young-adult',
    'animals',
    'culture',
    'graphic-books-and-manga',
    'young-adult-paperback-monthly'
  ]

  // years = Array.from({length: 100}, (v, k) => k + 1920).map(String);

  private variableFilters = [
    {name: 'list', values: this.listNames},
    {name: 'data', values: ['current']}, //TODO: Find a way to get random dates
  ]

  constructor() { }

  getRandomArt(): Promise<ArtDisplayData> {
    const params = this.getBaseParams();

    const list = this.utilityService.getRandomItemFromArray(this.listNames);

    return lastValueFrom(this.http.get(`${this.baseUrl}/current/${list}.json`, { params }).pipe(map((res: any) => {
      const item = this.utilityService.getRandomItemFromArray(res['results']['books']);
      return this.parseIntoArtDisplayData(item);
    })));
  }

  parseIntoArtDisplayData(book: any): ArtDisplayData {
    return {
      title: book.title,
      author: book.author,
      rating: 0, //TODO: Find a way to get ratings
      year: '1326', //TODO: Find a way to get years
      description: book.description,
      imageUrl: book.book_image,
      tags: [] //TODO: Find a way to get tags
    }
  }

  private getBaseParams() {
    return new HttpParams().set('api-key', this.apiKey)
      .set('offset', 40);
  }
}
