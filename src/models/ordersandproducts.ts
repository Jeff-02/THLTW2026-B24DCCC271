import { useState, useEffect } from 'react';

export namespace OrderAndProduct {
  export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }

  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }

  export interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    products: OrderItem[];
    totalAmount: number;
    status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
    createdAt: string;
  }

  export interface FilterState {
    searchText: string;
    category?: string;
    priceRange?: [number, number];
    status?: string;
  }
}

const INITIAL_PRODUCTS: OrderAndProduct.Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const INITIAL_ORDERS: OrderAndProduct.Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 },
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

export default () => {
  const [products, setProducts] = useState<OrderAndProduct.Product[]>([]);
  const [orders, setOrders] = useState<OrderAndProduct.Order[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedOrders = localStorage.getItem('orders');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

 
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

 
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  const updateProduct = (id: number, updatedProduct: Partial<OrderAndProduct.Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const addOrder = (order: OrderAndProduct.Order) => {
    setOrders([order, ...orders]);
  };

  const updateOrder = (id: string, updatedOrder: Partial<OrderAndProduct.Order>) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  return {
    products,
    setProducts,
    orders,
    setOrders,
    loading,
    setLoading,
    updateProduct,
    addOrder,
    updateOrder,
    deleteProduct,
    getProductById,
  };
};
