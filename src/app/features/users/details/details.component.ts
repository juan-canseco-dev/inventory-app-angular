import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserDetails } from 'app/core/models/backend/users';
import { UsersService } from 'app/core/services/users';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {


  parent : FormGroup;

  private userId !: string;

  userDetails !: UserDetails;

  loading : boolean =  false;
  error : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private userService : UsersService,
    private navRouter : Router,
    private router : ActivatedRoute,
    private fb : FormBuilder) { }

  ngOnInit(): void {
    this.parent = this.fb.group({});
    this.router.params.subscribe((params : Params) => {
      this.userId = params['userId'];
      this.getUserDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  getUserDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.userService.getUserDetails(this.userId).subscribe({
        next: response => {
          this.loading = false;
          this.userDetails = response;
          console.log(this.userDetails);
        },
        error: error => {
          if (error.status === 404) {
            this.navRouter.navigateByUrl('/static/not-found');
            return;
          }
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  retry() {
    this.getUserDetails();
  }
}
