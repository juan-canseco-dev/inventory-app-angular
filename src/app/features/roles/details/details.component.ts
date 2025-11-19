import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RoleDetails } from 'app/core/models/backend/roles';
import { RolesService } from 'app/core/services/roles';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  parent : FormGroup;
  
  private roleId : string;
  roleDetails : RoleDetails;
  loading : boolean = false;
  error : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private roleService : RolesService,
    private router : Router,
    private route : ActivatedRoute,
    private fb : FormBuilder) { }

  ngOnInit(): void {
    this.parent = this.fb.group({});
    this.route.params.subscribe((param : Params) => {
      this.roleId = param['roleId'];
      this.getRoleDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private getRoleDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.roleService.getRoleDetails(this.roleId).subscribe({
        next: response => {
          this.loading = false;
          this.roleDetails = response;
        },
        error: error => {
          if (error.status === 404) {
            this.router.navigateByUrl('/static/not-found');
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
    this.getRoleDetails();
  }
}
