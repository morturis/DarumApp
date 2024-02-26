import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DarumaBodyColor, DarumaModel } from '../model/daruma-model';

const BASE_URL = 'http://34.175.64.33:3000';

@Injectable({
  providedIn: 'root',
})
/**
 * Connects to external backend
 */
export class DarumaService {
  static instance: DarumaService;

  static devValues: DarumaModel[] = [
    {
      id: 1,
      leftEye: true,
      rightEye: true,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Que me crezca un nuevo brazo',
    },
    {
      id: 2,
      leftEye: true,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Ganar la loteria',
    },
    {
      id: 3,
      leftEye: true,
      rightEye: true,
      bodyColor: DarumaBodyColor.BLUE,
      goals: ':D',
    },
    {
      id: 4,
      leftEye: false,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Que me parta un rayo',
    },
    {
      id: 5,
      leftEye: true,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'D:',
    },
    {
      id: 6,
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Ni idea bro esto es solo para dev',
    },
  ];

  constructor(private http: HttpClient) {
    DarumaService.instance = this;
  }

  get(id: number): Observable<DarumaModel> {
    // const headers = {};
    // return this.http
    //   .get<DarumaModel>(`${BASE_URL}/daruma/${id}`, {
    //     headers,
    //   })
    //   .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    const singleDaruma = DarumaService.devValues.find(
      (daruma) => daruma.id === id,
    );
    if (!singleDaruma) throw new Error('404');
    return of(singleDaruma).pipe(delay(1000));
  }

  getList(userId: number): Observable<DarumaModel[]> {
    // const headers = {};
    // return this.http
    //   .get<DarumaModel[]>(`${BASE_URL}/user/${userId}/daruma`, {
    //     headers,
    //   })
    //   .pipe(mergeMap((response) => of(this.parseDarumaList(response))));

    return of(DarumaService.devValues || []).pipe(delay(1000));
  }

  save(model: DarumaModel): Observable<DarumaModel> {
    // const headers = {};
    // return this.http
    //   .post<DarumaModel>(`${BASE_URL}/daruma`, {
    //     headers,
    //   })
    //   .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    DarumaService.devValues.push(model);
    return of(model).pipe(delay(1000));
  }
  update(model: DarumaModel): Observable<DarumaModel> {
    // const headers = {};
    // return this.http
    //   .put<DarumaModel>(`${BASE_URL}/daruma/${model.id}`, {
    //     headers,
    //   })
    //   .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    const index = DarumaService.devValues.findIndex(
      (daruma) => daruma.id === model.id,
    );
    if (!index) throw new Error('404');
    DarumaService.devValues[index] = model;
    return of(model).pipe(delay(1000));
  }

  delete(model: DarumaModel): Observable<DarumaModel> {
    // const headers = {};
    // return this.http.delete<DarumaModel>(`${BASE_URL}/daruma/${model.id}`, {
    //   headers,
    // })
    //   .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    //Keeps all except for the deleted element
    DarumaService.devValues = DarumaService.devValues.filter(
      (daruma) => daruma.id !== model.id,
    );
    return of(model).pipe(delay(1000));
  }

  /**
   * Naive implementation, assumes backend uses DarumaModel as DTO
   * @param response
   * @returns
   */
  private parseSingleDaruma(response: DarumaModel): DarumaModel {
    return response;
  }

  /**
   * Naive implementation, assumes a list is just an array
   * @param response
   * @returns
   */
  private parseDarumaList(response: DarumaModel[]): DarumaModel[] {
    return response.map(this.parseSingleDaruma);
  }
}
