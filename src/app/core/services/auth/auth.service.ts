import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'environments/environment';
import { Observable, delay, shareReplay, tap } from 'rxjs';
import { LoginRequest, LoginResponse, UpdateUserInfoRequest } from '../../models/backend/auth';
import { UserProfile } from '../../models/backend/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient, private jwtHelper : JwtHelperService) { }

  login(request : LoginRequest) : Observable<LoginResponse> {
    return this.http
    .post<LoginResponse>(environment.baseUrl + "/Identity/signIn", request)
    .pipe(
      tap(this.setSession),
      shareReplay(1));
  }

  updateUserInfo(request : UpdateUserInfoRequest) {
    return this.http
    .put(environment.baseUrl + "/Identity", request)
    .pipe(
      tap(() => this.updateUserInfoLocal(request)),
      delay(2000),
      shareReplay(1)
    );
  }

  private updateUserInfoLocal(request : UpdateUserInfoRequest) {
    const profile = this.getUserProfle();
    profile.email = request.email;
    profile.fullname = request.fullname;
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }

  private setSession(loginResponse: LoginResponse) : void {
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("permissions", JSON.stringify(loginResponse.permissions));
    const userProfle : UserProfile = {
      userId: loginResponse.userId,
      role: loginResponse.role,
      email: loginResponse.email,
      fullname: loginResponse.fullname,
      isVerified: loginResponse.isVerified
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfle));
  }
  
  logOut() : void {
    localStorage.clear();
  }

  isLoggedIn() : boolean {
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserProfle() : UserProfile {
    return JSON.parse(localStorage.getItem("userProfile"));
  }
}
