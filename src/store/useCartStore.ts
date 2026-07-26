import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercentage: number;
  addItem: (product: Product, selectedSize: number, quantity?: number) => void;
  removeItem: (productId: string, selectedSize: number) => void;
  updateQuantity: (productId: string, selectedSize: number, delta: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountPercentage: 0,

      addItem: (product, selectedSize, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id && item.selectedSize === selectedSize
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          }

          return {
            items: [...state.items, { product, selectedSize, quantity }],
          };
        });
      },

      removeItem: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
          ),
        }));
      },

      updateQuantity: (productId, selectedSize, delta) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.product.id === productId && item.selectedSize === selectedSize) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountPercentage: 0 });
      },

      applyDiscountCode: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === "VIPER10") {
          set({ discountCode: "VIPER10", discountPercentage: 10 });
          return true;
        } else if (cleanCode === "DOJANG20") {
          set({ discountCode: "DOJANG20", discountPercentage: 20 });
          return true;
        }
        return false;
      },

      removeDiscountCode: () => {
        set({ discountCode: null, discountPercentage: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercentage;
        return Math.round((subtotal * pct) / 100);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 999 ? 0 : 99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "viper-gears-cart-storage",
    }
  )
);
