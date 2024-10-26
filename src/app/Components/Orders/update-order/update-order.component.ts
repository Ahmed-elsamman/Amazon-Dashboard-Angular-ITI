import { Component, Inject, Pipe, PipeTransform } from '@angular/core';
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
  orderStatuses = ['pending', 'processing', 'completed', 'cancelled'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateOrderComponent>,
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      userId: [data.userId, Validators.required],
      items: this.fb.array([
        this.fb.group({
          productId: [data.items[0]?.productId || '', Validators.required],
          quantity: [
            data.items[0]?.quantity || 1,
            [Validators.required, Validators.min(1)],
          ],
        }),
      ]),
      totalPrice: [data.totalPrice, [Validators.required, Validators.min(0)]],
      orderStatus: [data.orderStatus, Validators.required],
      paymentId: [data.paymentId],
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = this.prepareOrderData(this.orderForm.value);

      this.ordersService
        .updateOrder(this.data._id, orderData)
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

  private prepareOrderData(formValue: any): any {
    return {
      ...formValue,
      totalPrice: Number(formValue.totalPrice),
      items: formValue.items.map((item: any) => ({
        ...item,
        quantity: Number(item.quantity),
      })),
    };
  }

  onCancel() {
    this.dialogRef.close();
  }
}
