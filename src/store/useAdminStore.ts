import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { PRODUCTS as INITIAL_PRODUCTS } from "@/data/products";

interface AdminState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,

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
    }),
    {
      name: "viper_admin_storage",
    }
  )
);