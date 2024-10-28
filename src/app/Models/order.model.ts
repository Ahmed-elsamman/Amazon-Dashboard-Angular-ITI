export enum OrderStatus {
  PENDING = 'pending',

  DELIVERED = 'delivered',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IOrder {
  _id: string;
  userId: string;
  orderStatus: OrderStatus;
  totalPrice: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
