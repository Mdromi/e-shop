"use client";

import Button from "@/app/components/Button";
import ProductImg from "@/app/components/products/ProductImg";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import { calculateAverageRating } from "@/utils/calculateAverageRating";
import { Rating } from "@mui/material";
import { useCallback, useState } from "react";

interface ProductDetailsProps {
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

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
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

  const averageProductRating = calculateAverageRating(product);

  const handleColorSelect = useCallback(
    (value: SelectedImageType) => {
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    [cartProduct.selectedImg]
  );

  const handleQtyIncress = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.qantity === 9) return prev; // Prevent incrementing beyond 9
      return { ...prev, qantity: prev.qantity + 1 };
    });
  }, [setCartProduct]);

  const handleQtyDecress = useCallback(() => {
    setCartProduct((prev) => {
      if (prev.qantity === 1) return prev; // Prevent decrementing below 1
      return { ...prev, qantity: prev.qantity - 1 };
    });
  }, [setCartProduct]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImg
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h1 className="text-3xl font-medium text-slate-700">{product.name}</h1>
        <div className="flex items-center gap-2">
          <Rating value={averageProductRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY: </span>
          {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span>
          {product.brand}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In stock" : "Out of stock"}
        </div>
        <Horizontal />
        <div>
          <SetColor
            cartProduct={cartProduct}
            images={product.images}
            handleColorSelect={handleColorSelect}
          />
        </div>
        <Horizontal />
        <SetQuantity
          cartProduct={cartProduct}
          handleQtyIncress={handleQtyIncress}
          handleQtyDecress={handleQtyDecress}
        />
        <Horizontal />
        <div className="max-w-[300px]">
          <Button label="Add To Cart" onclick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;