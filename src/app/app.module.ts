import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './layouts/';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './features/main';
import { JwtModule } from '@auth0/angular-jwt';
import { NotificationsModule } from './core/services/notifications/notifications.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export function tokenGetter() {
  return localStorage.getItem("token");
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7117"],
        disallowedRoutes: []
      }
    }),
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    NotificationsModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
