import { Injectable } from '@angular/core';
import { ModuleWithPermissions } from 'app/core/models/backend/modules';
import { Observable, delay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  constructor(private http : HttpClient) { }
  getModules() : Observable<ModuleWithPermissions[]> {
    const baseUrl = environment.baseUrl + "/Modules";
    return this.http.get<ModuleWithPermissions[]>(baseUrl).pipe(delay(2000));
  }
}
