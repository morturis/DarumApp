import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, mergeMap, of } from 'rxjs';
import {
  DarumaBodyColor,
  DarumaBottomSkin,
  DarumaModel,
  DarumaTopSkin,
} from '../model/daruma-model';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.API_URL;

type BackendDarumaModel = {
  id: number;
  objetivo: string;
  color: number;
};

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
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 2,
      leftEye: true,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Ganar la loteria',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 3,
      leftEye: true,
      rightEye: true,
      bodyColor: DarumaBodyColor.BLUE,
      goals: ':D',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 4,
      leftEye: false,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Que me parta un rayo',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 5,
      leftEye: true,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Stop being sad',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 6,
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Ni idea bro esto es solo para dev',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 4,
      leftEye: false,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Que me parta un rayo',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 5,
      leftEye: true,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Stop being sad',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 6,
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Ni idea bro esto es solo para dev',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 4,
      leftEye: false,
      rightEye: true,
      bodyColor: DarumaBodyColor.RED,
      goals: 'Que me parta un rayo',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 5,
      leftEye: true,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Stop being sad',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
    {
      id: 6,
      leftEye: false,
      rightEye: false,
      bodyColor: DarumaBodyColor.BLUE,
      goals: 'Ni idea bro esto es solo para dev',
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
    },
  ];

  constructor(private http: HttpClient) {
    DarumaService.instance = this;
  }

  get(id: number): Observable<DarumaModel> {
    const headers = {};
    return this.http
      .get<BackendDarumaModel>(`${BASE_URL}/daruma/${id}`, {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    // const singleDaruma = DarumaService.devValues.find(
    //   (daruma) => daruma.id === id,
    // );
    // if (!singleDaruma) throw new Error('404');
    // return of(singleDaruma).pipe(delay(1000));
  }

  getList(userId: number): Observable<DarumaModel[]> {
    const headers = {};
    //TODO change url when Backend allows filtering by user
    return this.http
      .get<BackendDarumaModel[]>(`${BASE_URL}/daruma`, {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseDarumaList(response))));

    // return of(DarumaService.devValues || []).pipe(delay(1000));
  }

  save(model: DarumaModel): Observable<DarumaModel> {
    if (model.id) return this.update(model);

    const headers = {};
    return this.http
      .post<BackendDarumaModel>(`${BASE_URL}/daruma`, this.parseFrontToBackDaruma(model), {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    // DarumaService.devValues.push(model);
    // return of(model).pipe(delay(1000));
  }
  update(model: DarumaModel): Observable<DarumaModel> {
    const headers = {};
    return this.http
      .put<BackendDarumaModel>(`${BASE_URL}/daruma/${model.id}`, this.parseFrontToBackDaruma(model), {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    // const index = DarumaService.devValues.findIndex(
    //   (daruma) => daruma.id === model.id,
    // );
    // if (!index) throw new Error('404');
    // DarumaService.devValues[index] = model;
    // return of(model).pipe(delay(1000));
  }

  delete(model: DarumaModel): Observable<DarumaModel> {
    const headers = {};
    return this.http.delete<BackendDarumaModel>(`${BASE_URL}/daruma/${model.id}`, {
      headers,
    })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));

    //Keeps all except for the deleted element
    // DarumaService.devValues = DarumaService.devValues.filter(
    //   (daruma) => daruma.id !== model.id,
    // );
    // return of(model).pipe(delay(1000));
  }

  /**
   * Naive implementation, assumes backend uses DarumaModel as DTO
   * @param response
   * @returns
   */
  private parseSingleDaruma(response: BackendDarumaModel): DarumaModel {

    const colorMappings: Record<number, DarumaBodyColor> = {
      [1]: DarumaBodyColor.BLUE,
      [2]: DarumaBodyColor.RED,
      [3]: DarumaBodyColor.YELLOW,
      [4]: DarumaBodyColor.PINK,
    };

    const parsedDaruma: DarumaModel = {
      leftEye: false,
      rightEye: false,
      bodyColor: colorMappings[response.color],
      goals: response.objetivo,
      topSkin: DarumaTopSkin.AUREOLA,
      bottomSkin: DarumaBottomSkin.BIGOTE,
      id: response.id,
    };
    return parsedDaruma;
  }

  /**
   * Naive implementation, assumes a list is just an array
   * @param response
   * @returns
   */
  private parseDarumaList(response: BackendDarumaModel[]): DarumaModel[] {
    return response.map(this.parseSingleDaruma);
  }
  private parseFrontToBackDaruma(model: DarumaModel): BackendDarumaModel {
    const colorMappings: Record<DarumaBodyColor, number> = {
      [DarumaBodyColor.BLUE]: 1,
      [DarumaBodyColor.RED]: 2,
      [DarumaBodyColor.YELLOW]: 3,
      [DarumaBodyColor.PINK]: 4,
      [DarumaBodyColor.EMPTY_DOTTED]: 0,
    };

    const backendDaruma: BackendDarumaModel = {
      id: model.id || -1, //This should be ignored by the backend
      color: colorMappings[model.bodyColor],
      objetivo: model.goals
    };
    return backendDaruma;
  }
}
