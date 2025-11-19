import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'app/core/services/products';
import { ProductDetails } from 'app/core/models/backend/products';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  private productId : number;
  product : ProductDetails;
  loading : boolean = false;
  error : boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private productService : ProductsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params : Params) => {
      this.productId = params['productId'];
      this.getProduct();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  private getProduct() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.productService.getProductDetails(this.productId).subscribe({
        next: response => {
          this.loading = false;
          this.product = response;
          console.log(this.product);
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
    this.getProduct();
  }
}
