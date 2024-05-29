import { Injectable, inject } from '@angular/core';
import { ArtDisplayData } from '../interfaces/art-display-data';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { MovieService } from './movie.service';
import { ArtService, BrandImageConfig } from '../interfaces/art-service';
import { BookService } from './book.service';
import { TvShowService } from './tv-show.service';

interface QueueItem {
  isLoading: boolean;
  data: ArtDisplayData | null;
}

interface Queues {
  [key: string]: {
    service: ArtService,
    artList: QueueItem[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class NextArtService {

  movieService = inject(MovieService);
  tvShowService = inject(TvShowService);
  bookService = inject(BookService);

  queues: Queues = {
    tvShow: {
      service: this.tvShowService,
      artList: []
    },
    movie: {
      service: this.movieService,
      artList: []
    },
    book: {
      service: this.bookService,
      artList: []
    }
  }

  private currentQueue: BehaviorSubject<string> = new BehaviorSubject<string>('tvShow');
  currentQueue$: Observable<string> = this.currentQueue.asObservable();
  
  private currentQueueItem: Subject<QueueItem> = new Subject();

  isLoading$: Observable<boolean> = this.currentQueueItem.asObservable().pipe(map(queueItem => {
    return queueItem.isLoading;
  }));

  currentArtDisplayData$: Observable<ArtDisplayData | null> = this.currentQueueItem.asObservable().pipe(map(queueItem => {
    return queueItem.data;
  }));

  currentAPIBrandImageConfig$: Observable<BrandImageConfig> = this.currentQueue$.pipe(map(queueName => {
    return this.queues[queueName].service.brandImageConfig;
  }));

  constructor() {
    this.init();
  }

  init() {
    this.currentQueue.next('movie');
    this.fillQueues();
    this.setCurrentQueueItem();
  }

  fillQueues() {
    Object.keys(this.queues).forEach(key => {
      this.fillQueue(key, 3);
    });
  }

  fillQueue(queueName: string, size: number) {
    const queue = this.queues[queueName];

    for (let i = 0; i < size; i++) {
      const queueItem: QueueItem = {
        isLoading: true,
        data: null
      };

      this.queues[queueName].service.getRandomArt().then(artDisplayData => {
        queueItem.data = artDisplayData;
        queueItem.isLoading = false;
        this.setCurrentQueueItem();
        
      }).catch((res) => {
        console.log(res);
        
        alert('Something went wrong fetching data, sorry!')
      });

      queue.artList.push(queueItem);
    }
  }

  setCurrentQueueItem() {
    const queue = this.queues[this.currentQueue.value];    
    this.currentQueueItem.next(queue.artList[0]);
  }

  next() {
    const queue = this.queues[this.currentQueue.value];
    queue.artList.shift();
    this.setCurrentQueueItem();
    this.fillQueue(this.currentQueue.value, 1);
  }

  switchQueue(queueName: string) {
    this.currentQueue.next(queueName);
    this.setCurrentQueueItem();
  }
}
