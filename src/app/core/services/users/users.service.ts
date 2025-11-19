import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedList } from '../../models/backend/shared';
import { User } from '../../models/backend/users';
import { environment } from 'environments/environment';
import { Observable, delay} from 'rxjs';
import { CreateUserRequest, EditUserRequest, UserDetails } from '../../models/backend/users';

export class GetUsersQueryParams {
  pageNumber : number;
  pageSize : number;
  orderBy : string;
  sortOrder : string;
  name : string;
  roleId : string;
  active : boolean | null;
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  getUsers(params : GetUsersQueryParams) : Observable<PagedList<User>> {
    
    let url = environment.baseUrl + "/users";
    
    let queryParams = new HttpParams()
    .append("pageNumber", params.pageNumber)
    .append("pageSize", params.pageSize)
    .append("orderBy", params.orderBy)
    .append("sortOrder", params.sortOrder)
    .append("name", params.name)
    .append("roleId", params.roleId);
    
    if (params.active != null) {
      queryParams = queryParams.append('active', params.active);
    }

    return this.http.get<PagedList<User>>(url, {params: queryParams});
  }

  getUserDetails(userId : string) : Observable<UserDetails> {
    var url = `${environment.baseUrl}/users/${userId}`;
    return this.http.get<UserDetails>(url).pipe(delay(2000));
  }

  createUser(request : CreateUserRequest) {
    var url = `${environment.baseUrl}/users`;
    return this.http.post(url, request).pipe(delay(2000));
  }

  deleteUser(userId : string) {
    var url = `${environment.baseUrl}/users/${userId}`;
    return this.http.delete(url).pipe(delay(2000));
  }

  enableUser(userId : string, enable : boolean) {
    const action = enable? 'disable' : 'enable'; 
    var url = `${environment.baseUrl}/users/${userId}/${action}`;
    return this.http.put(url, {}).pipe(delay(2000));
  }
  
  editUser(request : EditUserRequest) {
    var url = `${environment.baseUrl}/users/${request.userId}`;
    return this.http.put(url, request).pipe(delay(2000));
  }

}
