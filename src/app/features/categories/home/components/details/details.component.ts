import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'app/core/services/categories';
import { Category } from 'app/core/models/backend/categories';

export interface DetailsDialogData {
  categoryId: number;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  category : Category;
  
  loading: boolean = false;
  error: boolean = false;

  private subscriptions$ = new Subscription();

  constructor(
    public dialogRef : MatDialogRef<DetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data : DetailsDialogData,
    private categoryService : CategoriesService) { }

  ngOnInit(): void {
    this.getCategoryDetails();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  retry() {
    this.getCategoryDetails();
  }

  getCategoryDetails() {
    this.loading = true;
    this.error = false;
    this.subscriptions$.add(
      this.categoryService.getCategoryDetails(this.data.categoryId).subscribe({
        next: result =>  {
          this.loading = false;
          this.category = result;
        },
        error: error => {
          this.loading = false;
          this.error = true;
          console.log(error);
        }
      })
    );
  }

  onCancelClick() {
    if (this.loading) {
      this.subscriptions$.unsubscribe();
    }
    this.dialogRef.close();
  }

}
