import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay } from 'rxjs';
import { CreateCustomerRequest, Customer, CustomerDetails, GetCustomersQueryParams, UpdateCustomerRequest } from 'app/core/models/backend/customers';
import { environment } from 'environments/environment';
import { PagedList } from 'app/core/models/backend/shared';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  
  constructor(private http : HttpClient) { }

  getAllCustomers(fullname : string | null, active : boolean | null = null) : Observable<Customer[]> {
    let baseUrl = environment.baseUrl + '/Customers/All';
    let params = new HttpParams().append("fullname", fullname);
    if (active !== null) {
      params = params.append('active', active);
    }
    return this.http.get<Customer[]>(baseUrl, {params: params});
  }

  getCustomers(queryParams : GetCustomersQueryParams) : Observable<PagedList<Customer>> {
    let baseUrl = environment.baseUrl + '/Customers';

    let params = new HttpParams()
    .append("pageNumber", queryParams.pageNumber)
    .append("pageSize", queryParams.pageSize)
    .append("orderBy", queryParams.orderBy)
    .append("sortOrder", queryParams.sortOrder)
    .append("dni", queryParams.dni)
    .append("fullname", queryParams.fullname);

    if (queryParams.active !== null) {
      params = params.append('active', queryParams.active);
    }

    return this.http.get<PagedList<Customer>>(baseUrl, {params: params});
  }

  getCustomerDetails(customerId: number) : Observable<CustomerDetails> {
    let baseUrl = `${environment.baseUrl}/Customers/${customerId}}`;
    return this.http.get<CustomerDetails>(baseUrl).pipe(delay(3000));
  }

  updateCustomer(request : UpdateCustomerRequest) {
    let baseUrl = `${environment.baseUrl}/Customers/${request.customerId}`;
    return this.http.put(baseUrl, request).pipe(delay(2000));
  }

  createCustomer(request : CreateCustomerRequest) {
    let baseUrl = `${environment.baseUrl}/Customers`;
    return this.http.post(baseUrl, request).pipe(delay(2000));
  }

  toggleActive(customerId : number) {
    let baseUrl = `${environment.baseUrl}/Customers/${customerId}}`;
    return this.http.put(baseUrl, {}).pipe(delay(2000));
  }

  deleteCustomer(customerId : number) {
    let baseUrl = `${environment.baseUrl}/Customers/${customerId}}`;
    return this.http.delete(baseUrl).pipe(delay(2000));
  }
  
}
