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

  baseUrl = 'https://www.googleapis.com/books/v1';
  apiKey = environment.apiKeys.book;

  subjectNames = [
    'adventure',
    'classics',
    'fantasy',
    'horror',
    'mystery',
    'romance',
    'science fiction',
    'fiction',
  ]

  private variableFilters = [
    {name: 'list', values: this.subjectNames},
  ]

  constructor() { }

  getRandomArt(): Promise<ArtDisplayData> {
    const params = this.getRandomQueryParams();

    return lastValueFrom(this.http.get(`${this.baseUrl}/volumes`, { params }).pipe(map((res: any) => {
      const volume = this.utilityService.getRandomItemFromArray(res['items']);
      const book = volume.volumeInfo;

      book.externalThumbnail = `https://books.google.com/books/publisher/content/images/frontcover/${volume.id}?fife=w400-h600&source=gbs_api`

      return this.parseIntoArtDisplayData(book);
    })));
  }

  parseIntoArtDisplayData(book: any): ArtDisplayData {
    return {
      title: book.title,
      author: book.authors?.join(', '),
      rating: 0, //TODO: Find a way to get ratings
      year: book.publishedDate?.split('-')[0],
      description: book.description,
      imageUrl: book.imageLinks?.thumbnail ? (book.imageLinks?.thumbnail + '&fife=w800') : book.externalThumbnail,
      tags: book.categories
    }
  }

  protected getRandomQueryParams() {
    let params = this.getBaseParams()
      .set('q', 'subject:' + this.utilityService.getRandomItemFromArray(this.subjectNames));

    return params;
  }

  private getBaseParams() {
    return new HttpParams().set('key', this.apiKey)
    .set('maxResults', '40')
  }
}
