export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
