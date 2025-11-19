import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetProductsQueryParams, CreateProductRequest, UpdateProductRequest, Product, ProductDetails} from 'app/core/models/backend/products';
import { PagedList } from 'app/core/models/backend/shared';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  constructor(private http : HttpClient) { }

  getProducts(queryParams : GetProductsQueryParams): Observable<PagedList<Product>> {
    let baseUrl = environment.baseUrl + '/Products';

    let params = new HttpParams()
    .append("pageNumber", queryParams.pageNumber)
    .append("pageSize", queryParams.pageSize)
    .append("orderBy", queryParams.orderBy)
    .append("sortOrder", queryParams.sortOrder)
    .append("name", queryParams.name);

    if (queryParams.categoryId != null) {
      params = params.append('categoryId', queryParams.categoryId);
    }

    if (queryParams.supplierId != null) {
      params = params.append('supplierId', queryParams.supplierId);
    }

    if (queryParams.active !== null) {
      params = params.append('active', queryParams.active);
    }

    return this.http.get<PagedList<Product>>(baseUrl, {params: params});
  }

  getProductDetails(productId : number) : Observable<ProductDetails> {
    let baseUrl = `${environment.baseUrl}/Products/${productId}`;
    return this.http.get<ProductDetails>(baseUrl).pipe(delay(3000));
  }

  editProduct(request: UpdateProductRequest) {
    let baseUrl = `${environment.baseUrl}/Products/${request.productId}`;
    return this.http.put(baseUrl, request).pipe(delay(3000));
  }

  createProduct(request : CreateProductRequest) {
    let baseUrl = environment.baseUrl + '/Products';
    return this.http.post(baseUrl, request).pipe(delay(3000));
  }

  toggleActive(productId: number) {
    let baseUrl = `${environment.baseUrl}/Products/${productId}/ToggleActive`;
    return this.http.put(baseUrl, {}).pipe(delay(3000));
  }

  deleteProduct(productId: number) {
    let baseUrl = `${environment.baseUrl}/Products/${productId}`;
    return this.http.delete(baseUrl).pipe(delay(3000));
  }
}
