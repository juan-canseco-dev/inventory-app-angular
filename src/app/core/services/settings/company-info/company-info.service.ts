import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CompanyInfo } from 'app/core/models/backend/settings';
import { UpdateCompanyInfo } from 'app/core/models/backend/settings';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {
  
  constructor(private http : HttpClient) { }

  getInfo() : Observable<CompanyInfo> {
    const baseUrl = `${environment.baseUrl}/Settings/CompanyInfo`;
    return this.http.get<CompanyInfo>(baseUrl).pipe(delay(2000));
  }

  updateInfo(request : UpdateCompanyInfo) {
    
    const baseUrl = `${environment.baseUrl}/Settings/CompanyInfo`;
    const formData = new FormData();
    
    formData.append('name', request.name);
    formData.append('phone', request.phone);
    formData.append('country', request.country);
    formData.append('state', request.state);
    formData.append('city', request.city);
    formData.append('zip', request.zip);
    formData.append('line1', request.line1);
    formData.append('line2', request.line2);

    if (request.photo !== null) {
      formData.append('photo', request.photo);
    }
    return this.http.post(baseUrl, formData).pipe(delay(3000));
  }
}
