import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from 'environments/environment';
import { Category, CreateCategoryRequest, EditCategoryRequest, GetCategoriesQueryParams } from 'app/core/models/backend/categories';
import { Observable, delay } from 'rxjs';
import { PagedList } from 'app/core/models/backend/shared';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
  constructor(private http : HttpClient) { }

  getAllCategories(name: string | null, active : boolean | null = null) : Observable<Category[]> {
    let baseUrl = environment.baseUrl + '/Categories/All';
    let params = new HttpParams()
    .append("name", name);

    if (active !== null) {
      params = params.append('active', active);
    }
    return this.http.get<Category[]>(baseUrl, {params: params});
  }

  getCategories(queryParams : GetCategoriesQueryParams) : Observable<PagedList<Category>> {
    
    let baseUrl = environment.baseUrl + '/Categories';
    
    let params = new HttpParams()
    .append("pageNumber", queryParams.pageNumber)
    .append("pageSize", queryParams.pageSize)
    .append("orderBy", queryParams.orderBy)
    .append("sortOrder", queryParams.sortOrder)
    .append("name", queryParams.name);

    if (queryParams.active !== null) {
      params = params.append('active', queryParams.active);
    }
    return this.http.get<PagedList<Category>>(baseUrl, {params: params});
  }

  getCategoryDetails(categoryId: number) : Observable<Category> {
    let baseUrl = `${environment.baseUrl}/Categories/${categoryId}`;
    return this.http.get<Category>(baseUrl).pipe(delay(3000));
  }

  editCategory(request: EditCategoryRequest) {
    let baseUrl = `${environment.baseUrl}/Categories/${request.categoryId}`;
    return this.http.put(baseUrl, request).pipe(delay(2000));
  }

  createCategory(request: CreateCategoryRequest) {
    let baseUrl = environment.baseUrl + '/Categories';
    return this.http.post(baseUrl, request).pipe(delay(2000));
  }

  toggleActive(categoryId: number) {
    let baseUrl = `${environment.baseUrl}/Categories/${categoryId}/ToggleActive`;
    return this.http.put(baseUrl, {}).pipe(delay(2000));
  }

  deleteCategory(categoryId: number) {
    let baseUrl = `${environment.baseUrl}/Categories/${categoryId}`;
    return this.http.delete(baseUrl).pipe(delay(2000));
  }
}

