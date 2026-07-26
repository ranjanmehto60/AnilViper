import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/data/products";

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  itemsSummary: string;
  totalAmount: number;
  paymentStatus: "PAID" | "PENDING";
  orderStatus: "Processing" | "Shipped" | "Delivered";
  date: string;
  awbNumber?: string;
}

interface AdminState {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  products: Product[];
  orders: OrderItem[];
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderItem["orderStatus"], awbNumber?: string) => void;
}

const INITIAL_MOCK_ORDERS: OrderItem[] = [
  {
    id: "ORD_VIPER_948102",
    customerName: "Vikram Sharma",
    phone: "+91-9871674886",
    address: "House 42, Ward 3, Main Market, Chattarpur, Delhi - 110074",
    itemsSummary: "KPNP Competition Taekwondo Dobok – India Edition (170cm) x 1",
    totalAmount: 2999,
    paymentStatus: "PAID",
    orderStatus: "Shipped",
    date: "26 Jul 2026",
    awbNumber: "DLV9817264821",
  },
  {
    id: "ORD_VIPER_884192",
    customerName: "Rahul Verma (Dojang Master)",
    phone: "+91-9810293847",
    address: "Delhi Taekwondo Academy, Saket, Delhi - 110017",
    itemsSummary: "KPNP Junior Competition Taekwondo Dobok (140cm) x 5",
    totalAmount: 9995,
    paymentStatus: "PAID",
    orderStatus: "Processing",
    date: "26 Jul 2026",
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminEmail: null,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_MOCK_ORDERS,

      loginAdmin: (email: string) =>
        set({ isAdminLoggedIn: true, adminEmail: email }),

      logoutAdmin: () => set({ isAdminLoggedIn: false, adminEmail: null }),

      addProduct: (newProduct: Product) =>
        set((state) => ({ products: [newProduct, ...state.products] })),

      updateProduct: (id: string, updatedFields: Partial<Product>) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedFields } : p
          ),
        })),

      deleteProduct: (id: string) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      toggleStock: (id: string) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, inStock: !p.inStock } : p
          ),
        })),

      updateOrderStatus: (orderId: string, status: OrderItem["orderStatus"], awbNumber?: string) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, orderStatus: status, awbNumber: awbNumber || o.awbNumber }
              : o
          ),
        })),
    }),
    {
      name: "viper_admin_storage",
    }
  )
);
