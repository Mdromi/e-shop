import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import toast from "react-hot-toast";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleQtyChange: (product: CartProductType, amount: number) => void;
  handleClearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmmount, setCartTotalAmmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

  useEffect(() => {
    const cartItems = localStorage.getItem("eShopCartItems");
    if (cartItems) {
      const cProducts: CartProductType[] = JSON.parse(cartItems);
      setCartProducts(cProducts);
    }
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;

            acc.total += itemTotal;
            acc.qty += item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmmount(total);
      }
    };
    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback(
    (product: CartProductType) => {
      setCartProducts((prev) => {
        const updatedCart = prev ? [...prev, product] : [product];
        // Only show toast if the cart is updated
        if (prev !== updatedCart) {
          toast.success("Product added to cart");
        }

        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));

        return updatedCart;
      });
    },
    [setCartProducts, setCartTotalQty]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem("eShopCartItems", JSON.stringify(null));
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id !== product.id;
        });
        setCartProducts(filteredProducts);
        toast.success("Product removed");
        localStorage.setItem(
          "eShopCartItems",
          JSON.stringify(filteredProducts)
        );
      }
    },
    [cartProducts]
  );

  const handleQtyChange = useCallback(
    (product: CartProductType, amount: number) => {
      setCartProducts((prevCart) => {
        if (!prevCart) return [];

        const updatedCart = [...prevCart];
        const existingItem = updatedCart.find((item) => item.id === product.id);

        if (existingItem) {
          const newQuantity = Math.max(
            1,
            Math.min(existingItem.quantity + amount, 9)
          );
          existingItem.quantity = newQuantity;

          const isMinimumReached = amount === -1 && newQuantity === 1;
          const isMaximumReached = amount === 1 && newQuantity >= 9;

          if (isMinimumReached) toast.error("Oops! Minimum reached");
          else if (isMaximumReached) toast.error("Oops! Maximum reached");

          localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
        }

        return updatedCart;
      });
    },
    [setCartProducts]
  );

  const value = {
    cartTotalQty,
    cartTotalAmmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleQtyChange,
    handleClearCart,
  };
  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
