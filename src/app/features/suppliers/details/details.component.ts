import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SupplierDetails } from 'app/core/models/backend/suppliers';
import { SuppliersService } from 'app/core/services/suppliers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  private supplierId : number;
  supplierDetails : SupplierDetails;

  loading : boolean = false;
  error : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private suppliersService : SuppliersService,
    private router: Router,
    private activatedRoute : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params : Params) => {
      this.supplierId = params['supplierId'];
      this.getSupplierDetails();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }


  getSupplierDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.suppliersService.getSupplierDetails(this.supplierId).subscribe({
        next: result => {
          this.loading = false;
          this.supplierDetails = result;
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
    this.getSupplierDetails();
  }

}
