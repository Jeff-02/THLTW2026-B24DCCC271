import { OrderAndProduct } from '@/models/ordersandproducts';

export const generateOrderId = (): string => {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DH${timestamp}${random}`;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^0\d{9,10}$/;
  return phoneRegex.test(phone);
};

export const calculateProductStatus = (quantity: number): string => {
  if (quantity > 10) return 'Còn hàng';
  if (quantity > 0) return 'Sắp hết';
  return 'Hết hàng';
};

export const calculateTotalInventoryValue = (products: OrderAndProduct.Product[]): number => {
  return products.reduce((total, p) => total + p.price * p.quantity, 0);
};

export const calculateTotalRevenue = (orders: OrderAndProduct.Order[]): number => {
  return orders
    .filter(o => o.status === 'Hoàn thành')
    .reduce((total, o) => total + o.totalAmount, 0);
};

export const getOrdersByStatus = (orders: OrderAndProduct.Order[], status: string) => {
  return orders.filter(o => o.status === status).length;
};
