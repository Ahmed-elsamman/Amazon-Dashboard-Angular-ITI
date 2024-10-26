export enum IOrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus: IOrderStatus;
  shippingAddress: string;
  paymentId: string | null;
  orderDate?: Date;
}
