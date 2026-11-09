import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BackPrintOption,
  CartItem,
  DEFAULT_BACK_PRINT_OPTION,
  DEFAULT_SHOULDER_FLAG_OPTION,
  isBackPrintOption,
  isShoulderFlagOption,
  Product,
  ShoulderFlagOption,
} from "@/types/product";
import { calculateShippingFee } from "@/config/commerce";

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    selectedSize: number,
    selectedBackPrint?: BackPrintOption,
    selectedShoulderFlagOrQty?: ShoulderFlagOption | number,
    quantity?: number
  ) => void;
  removeItem: (
    productId: string,
    selectedSize: number,
    selectedBackPrint?: BackPrintOption,
    selectedShoulderFlag?: ShoulderFlagOption
  ) => void;
  updateQuantity: (
    productId: string,
    selectedSize: number,
    delta: number,
    selectedBackPrint?: BackPrintOption,
    selectedShoulderFlag?: ShoulderFlagOption
  ) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const MAX_QUANTITY_PER_LINE = 10;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (
        product,
        selectedSize,
        selectedBackPrint = DEFAULT_BACK_PRINT_OPTION,
        selectedShoulderFlagOrQty = DEFAULT_SHOULDER_FLAG_OPTION,
        quantity = 1
      ) => {
        const normalizedBackPrint = isBackPrintOption(selectedBackPrint)
          ? selectedBackPrint
          : DEFAULT_BACK_PRINT_OPTION;

        let normalizedShoulderFlag: ShoulderFlagOption = DEFAULT_SHOULDER_FLAG_OPTION;
        let finalQuantity = 1;

        if (typeof selectedShoulderFlagOrQty === "number") {
          finalQuantity = selectedShoulderFlagOrQty;
        } else {
          normalizedShoulderFlag = isShoulderFlagOption(selectedShoulderFlagOrQty)
            ? selectedShoulderFlagOrQty
            : DEFAULT_SHOULDER_FLAG_OPTION;
          finalQuantity = typeof quantity === "number" ? quantity : 1;
        }

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === selectedSize &&
              (item.selectedBackPrint ?? DEFAULT_BACK_PRINT_OPTION) === normalizedBackPrint &&
              (item.selectedShoulderFlag ?? DEFAULT_SHOULDER_FLAG_OPTION) === normalizedShoulderFlag
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity = Math.min(
              MAX_QUANTITY_PER_LINE,
              updatedItems[existingIndex].quantity + finalQuantity
            );
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                selectedSize,
                selectedBackPrint: normalizedBackPrint,
                selectedShoulderFlag: normalizedShoulderFlag,
                quantity: Math.min(MAX_QUANTITY_PER_LINE, finalQuantity),
              },
            ],
          };
        });
      },

      removeItem: (
        productId,
        selectedSize,
        selectedBackPrint = DEFAULT_BACK_PRINT_OPTION,
        selectedShoulderFlag = DEFAULT_SHOULDER_FLAG_OPTION
      ) => {
        const normalizedBackPrint = isBackPrintOption(selectedBackPrint)
          ? selectedBackPrint
          : DEFAULT_BACK_PRINT_OPTION;
        const normalizedShoulderFlag = isShoulderFlagOption(selectedShoulderFlag)
          ? selectedShoulderFlag
          : DEFAULT_SHOULDER_FLAG_OPTION;

        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedSize === selectedSize &&
                (item.selectedBackPrint ?? DEFAULT_BACK_PRINT_OPTION) === normalizedBackPrint &&
                (item.selectedShoulderFlag ?? DEFAULT_SHOULDER_FLAG_OPTION) === normalizedShoulderFlag
              )
          ),
        }));
      },

      updateQuantity: (
        productId,
        selectedSize,
        delta,
        selectedBackPrint = DEFAULT_BACK_PRINT_OPTION,
        selectedShoulderFlag = DEFAULT_SHOULDER_FLAG_OPTION
      ) => {
        const normalizedBackPrint = isBackPrintOption(selectedBackPrint)
          ? selectedBackPrint
          : DEFAULT_BACK_PRINT_OPTION;
        const normalizedShoulderFlag = isShoulderFlagOption(selectedShoulderFlag)
          ? selectedShoulderFlag
          : DEFAULT_SHOULDER_FLAG_OPTION;

        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (
                item.product.id === productId &&
                item.selectedSize === selectedSize &&
                (item.selectedBackPrint ?? DEFAULT_BACK_PRINT_OPTION) === normalizedBackPrint &&
                (item.selectedShoulderFlag ?? DEFAULT_SHOULDER_FLAG_OPTION) === normalizedShoulderFlag
              ) {
                const newQty = Math.min(MAX_QUANTITY_PER_LINE, item.quantity + delta);
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShippingFee: () => {
        const items = get().items;
        if (items.length === 0) return 0;

        return calculateShippingFee(
          get().getSubtotal(),
          items.map((item) => ({
            productId: item.product.id,
            category: item.product.category,
            quantity: item.quantity,
          }))
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal + shipping);
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
