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

  baseUrl = 'https://openlibrary.org';
  apiKey = environment.apiKeys.book;
  brandImageConfig = {
    url: 'assets/api-brands/open-library.svg',
    height: '1.4rem'
  };

  subjectNames = [
    'fairy tales',
    'fiction',
    'fantasy',
    'romance',
  ]

  private variableFilters = [
    {name: 'list', values: this.subjectNames},
    {name: 'offset', values: Array.from({length: 300}, (_, i) => i.toString())},
  ]

  constructor() { }

  async getRandomArt(): Promise<ArtDisplayData> {
    let work: any = {};

    while (!work.cover_edition_key) {
      const params = this.getRandomQueryParams();
      const response = await lastValueFrom(this.http.get<any>(`${this.baseUrl}/search.json`, { params }));
      work = response['docs'][0];

      if (!work.cover_edition_key) {
        console.log('Retrying book search...');
      }
    }  

    const artDisplayData = await this.parseIntoArtDisplayData(work);
    return artDisplayData;
  }

  async parseIntoArtDisplayData(work: any): Promise<ArtDisplayData> {
    let description = '';
    let isbn = null;

    if (work.isbn) {
      isbn = work.isbn[0];
    } 
    else if (Array.isArray(work.editions?.docs)) {
      isbn = work.editions.docs[0].isbn?.[0];
    }

    if (isbn) {
      const synopsis = await this.getBookSynopsis(isbn);
      description = synopsis;
    }    
    
    if (!description && work.first_sentence) {
      description = 'First sentence of the book: ' + work.first_sentence[0] + '.';
    }

    return {
      title: work.title,
      author: work.author_name?.join(', '),
      rating: Math.round(work.ratings_average),
      year: work.first_publish_year,
      description: description || 'Description not found',
      imageUrl: `https://covers.openlibrary.org/b/olid/${work.cover_edition_key}-L.jpg`,
      tags: work.subject.filter((s: string) => s.length < 16).slice(0, 5),
    }
  }

  async getBookSynopsis(isbn: string): Promise<string> {
    const synopsis = await lastValueFrom(
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${this.apiKey}`)
        .pipe(map((res: any) => {
            if (res.items) {
              return res.items[0]?.volumeInfo?.description;
            } else {
              return null;
            }
        }))
    );
  
    return synopsis;
  }

  protected getRandomQueryParams() {
    let params = this.getBaseParams()
      .set('q', 'subject:' + this.utilityService.getRandomItemFromArray(this.subjectNames))
      .set('offset', this.utilityService.getRandomItemFromArray(this.variableFilters[1].values));

    return params;
  }

  private getBaseParams() {
    return new HttpParams().set('lang', 'en')
    .set('fields', 'key,title,author_name,editions,ratings_average,synopsis,first_publish_year,cover_edition_key,subject,isbn')
    .set('limit', '1');
  }
}
