import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OrdersService } from 'src/app/Services/orders.service';
import { catchError, EMPTY } from 'rxjs';
import { OrderStatus } from 'src/app/Models/order.model';

@Component({
  selector: 'app-update-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css',
})
export class UpdateOrderComponent {
  orderForm: FormGroup;
  orderStatuses = Object.values(OrderStatus);
  orderDetails: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateOrderComponent>,
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderDetails = data;
    this.orderForm = this.fb.group({
      status: [data.orderStatus, Validators.required],
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.ordersService
        .changeOrderStatus(this.data._id, this.orderForm.value.status)
        .pipe(
          catchError((error) => {
            console.error('Error updating order:', error);
            return EMPTY;
          })
        )
        .subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
