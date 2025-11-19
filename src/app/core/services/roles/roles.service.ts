import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { CreateRoleRequest, EditModuleWithPermissionsRequest, EditRoleRequest, Role, RoleDetails } from '../../models/backend/roles';
import { PagedList } from '../../models/backend/shared';
import { environment } from 'environments/environment';

export interface GetRolesQueryParams {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  sortOrder: string;
  name: string;
  active : boolean | null;
};

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http : HttpClient) { }

  getRoles(queryParams : GetRolesQueryParams) : Observable<PagedList<Role>> {
    let baseUrl = environment.baseUrl + '/roles';
    let params = new HttpParams()
    .append("pageNumber", queryParams.pageNumber)
    .append("pageSize", queryParams.pageSize)
    .append("orderBy", queryParams.orderBy)
    .append("sortOrder", queryParams.sortOrder)
    .append("name", queryParams.name);
    
    if (queryParams.active !== null) {
      params = params.append('active', queryParams.active);
    }

    return this.http.get<PagedList<Role>>(baseUrl, {params: params});
  }
  
  getAllRoles(name : string | null, active : boolean | null) : Observable<Role[]> {
    let baseUrl = environment.baseUrl + '/roles/all';
    
    let params = new HttpParams()
    .append("name", name);

    if (active !== null) {
      params = params.append('active', active);
    }
    
    return this.http.get<Role[]>(baseUrl, {params:  params});
  }

  getRoleDetails(roleId : string) : Observable<RoleDetails> {
    let baseUrl = `${environment.baseUrl}/roles/${roleId}`;
    return this.http.get<RoleDetails>(baseUrl).pipe(delay(2000));
  }
  
  createRole(request : CreateRoleRequest) {
    let baseUrl = `${environment.baseUrl}/roles`;
    return this.http.post(baseUrl, request).pipe(delay(2000));
  } 

  deleteRole(roleId : string) {
    var url = `${environment.baseUrl}/roles/${roleId}`;
    return this.http.delete(url).pipe(delay(2000));
  }
  
  enableRole(roleId : string, enable : boolean) {
    const action = enable? 'disable' : 'enable'; 
    var url = `${environment.baseUrl}/roles/${roleId}/${action}`;
    return this.http.put(url, {}).pipe(delay(2000));
  }
  
  editRole(request : EditRoleRequest) {
    let baseUrl = `${environment.baseUrl}/roles/${request.roleId}`;
    return this.http.put(baseUrl, request).pipe(delay(2000));
  }
}
