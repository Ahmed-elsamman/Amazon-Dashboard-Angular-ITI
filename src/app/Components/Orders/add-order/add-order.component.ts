import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OrdersService } from 'src/app/Services/orders.service';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css',
})
export class AddOrderComponent {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddOrderComponent>,
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this.fb.group({
      userId: ['', Validators.required],
      items: this.fb.array([
        this.fb.group({
          productId: ['', Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
        }),
      ]),
      totalPrice: ['', [Validators.required, Validators.min(0)]],
      orderStatus: ['pending', Validators.required],
      paymentId: [''],
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = this.prepareOrderData(this.orderForm.value);

      this.ordersService
        .createOrderByAdmin(orderData)
        .pipe(
          catchError((error) => {
            console.error('Error creating order:', error);
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
}
