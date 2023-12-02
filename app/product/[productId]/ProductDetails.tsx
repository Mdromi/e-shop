"use client";

import Horizontal from "@/app/components/products/Horizontal";
import ProductImg from "@/app/components/products/ProductImg";
import ProductInCart from "@/app/components/products/ProductInCart";
import ProductNotInCart from "@/app/components/products/ProductNotInCart";
import ProductOverview from "@/app/components/products/ProductOverview";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface ProductDetailsProps {
  product: any;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImageType;
  qantity: number;
  price: number;
};

export type SelectedImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { cartProducts, handleAddProductToCart } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    qantity: 1,
    price: product.price,
  });

  const router = useRouter();

  console.log("cartProducts", cartProducts);

  useEffect(() => {
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      setIsProductInCart(existingIndex > -1);
    }
  }, [cartProducts, product.id]);

  const handleColorSelect = useCallback(
    (value: SelectedImageType) => {
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    [cartProduct.selectedImg]
  );

  const handleQtyChange = useCallback(
    (amount: number) =>
      setCartProduct((prev) => ({
        ...prev,
        qantity: Math.max(1, Math.min(prev.qantity + amount, 9)),
      })),
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImg
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <ProductOverview product={product} />
        <Horizontal />
        {isProductInCart ? (
          <ProductInCart onNavigateToCart={() => router.push("/cart")} />
        ) : (
          <ProductNotInCart
            cartProduct={cartProduct}
            images={product.images}
            handleColorSelect={handleColorSelect}
            handleQtyChange={handleQtyChange}
            handleAddToCart={() => handleAddProductToCart(cartProduct)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
