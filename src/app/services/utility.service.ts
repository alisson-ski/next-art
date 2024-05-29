import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  getRandomItemFromArray(array: any[]) {
    return array[this.getRandomNumber(0, array.length - 1)];
  }

  getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async getFileFromUrl(url: string, name: string, type: string): Promise<File> {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, { type });
  }
}
