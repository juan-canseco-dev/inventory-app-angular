import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSupplierRequest, EditSupplierRequest, Supplier, SupplierDetails } from 'app/core/models/backend/suppliers';
import { PagedList } from 'app/core/models/backend/shared';
import { Observable, delay } from 'rxjs';
import { environment } from 'environments/environment';

export interface GetSuppliersQueryParams {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  sortOrder: string;
  companyName: string;
  contactName : string;
  active : boolean | null;
};

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  constructor(private http : HttpClient) { }
  

  getAllSuppliers(name: string | null, active : boolean | null = null) : Observable<Supplier[]> {
    let baseUrl = environment.baseUrl + '/Suppliers/All';
    
    let params = new HttpParams()
    .append("companyName", name);

    if (active !== null) {
      params = params.append('active', active);
    }
    
    return this.http.get<Supplier[]>(baseUrl, {params:  params});
  };

  getSuppliers(queryParams : GetSuppliersQueryParams) : Observable<PagedList<Supplier>> {

    let baseUrl = environment.baseUrl + '/Suppliers';
    
    let params = new HttpParams()
    .append("pageNumber", queryParams.pageNumber)
    .append("pageSize", queryParams.pageSize)
    .append("orderBy", queryParams.orderBy)
    .append("sortOrder", queryParams.sortOrder)
    .append("companyName", queryParams.companyName)
    .append("contactName", queryParams.contactName);
    
    if (queryParams.active !== null) {
      params = params.append('active', queryParams.active);
    }

    return this.http.get<PagedList<Supplier>>(baseUrl, {params: params});
  }
  
  getSupplierDetails(supplierId : number) : Observable<SupplierDetails> {
    let baseUrl = `${environment.baseUrl}/Suppliers/${supplierId}`; 
    return this.http.get<SupplierDetails>(baseUrl).pipe(delay(3000));
  }

  editSupplier(request : EditSupplierRequest)  {
    let baseUrl = `${environment.baseUrl}/Suppliers/${request.supplierId}`;
    return this.http.put(baseUrl, request).pipe(delay(3000)); 
  }

  createSupplier(request : CreateSupplierRequest) {
    let baseUrl = environment.baseUrl + '/Suppliers'; 
    return this.http.post(baseUrl, request).pipe(delay(2000));
  }
  
  toggleActive(supplierId : number) {
    let baseUrl = `${environment.baseUrl}/Suppliers/${supplierId}/ToggleActive`;
    return this.http.put(baseUrl, {}).pipe(delay(2000));
  }

  deleteSupplier(supplierId : number) {
    let baseUrl = `${environment.baseUrl}/Suppliers/${supplierId}`;
    return this.http.delete(baseUrl).pipe(delay(2000));
  }
}
