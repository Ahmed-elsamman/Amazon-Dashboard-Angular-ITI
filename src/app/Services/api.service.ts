import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../Models/icategory';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
  getAllCategory(): Observable<Icategory[]> {
    return this.httpClient.get<Icategory[]>(`${environment.APIBaseURL}/category`);
  }
}
