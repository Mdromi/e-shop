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
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
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

  const handleAddProductToCart = useCallback(
    (product: CartProductType) => {
      setCartProducts((prev) => {
        const updatedCart = prev ? [...prev, product] : [product];

        // Increment cartTotalQty
        setCartTotalQty((prevQty) => prevQty + 1);

        // Only show toast if the cart is updated
        if (prev !== updatedCart) {
          toast.success("Product added to cart");
        }

        // localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));

        return updatedCart;
      });
    },
    [setCartProducts, setCartTotalQty]
  );

  const value = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
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
