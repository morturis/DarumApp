import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DarumaBodyColor,
  DarumaBottomSkin,
  DarumaModel,
  DarumaTopSkin,
} from '../model/daruma-model';

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
  // Must be static so Phaser screens can use it. Accidentally, singleton
  static instance: DarumaService;

  constructor(private http: HttpClient) {
    if (!DarumaService.instance) DarumaService.instance = this;
    return DarumaService.instance;
  }

  get(id: number): Observable<DarumaModel> {
    const headers = {};
    return this.http
      .get<BackendDarumaModel>(`${BASE_URL}/daruma/${id}`, {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));
  }

  getList(userId: number): Observable<DarumaModel[]> {
    const headers = {};
    //TODO change url when Backend allows filtering by user
    return this.http
      .get<BackendDarumaModel[]>(`${BASE_URL}/daruma`, {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseDarumaList(response))));
  }

  save(model: DarumaModel): Observable<DarumaModel> {
    if (model.id) return this.update(model);

    const headers = {};
    return this.http
      .post<BackendDarumaModel>(
        `${BASE_URL}/daruma`,
        this.parseFrontToBackDaruma(model),
        {
          headers,
        },
      )
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));
  }
  update(model: DarumaModel): Observable<DarumaModel> {
    const headers = {};
    return this.http
      .put<BackendDarumaModel>(
        `${BASE_URL}/daruma/${model.id}`,
        this.parseFrontToBackDaruma(model),
        {
          headers,
        },
      )
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));
  }

  delete(model: DarumaModel): Observable<DarumaModel> {
    const headers = {};
    return this.http
      .delete<BackendDarumaModel>(`${BASE_URL}/daruma/${model.id}`, {
        headers,
      })
      .pipe(mergeMap((response) => of(this.parseSingleDaruma(response))));
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
      topSkin: DarumaTopSkin.NOTHING,
      bottomSkin: DarumaBottomSkin.NOTHING,
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
      objetivo: model.goals,
    };
    return backendDaruma;
  }
}
