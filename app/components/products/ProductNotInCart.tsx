import {
  CartProductType,
  SelectedImageType,
} from "@/app/product/[productId]/ProductDetails";
import SetColor from "./SetColor";
import Horizontal from "./Horizontal";
import SetQuantity from "./SetQuantity";
import Button from "../Button";

// ProductNotInCart component
const ProductNotInCart: React.FC<{
  cartProduct: CartProductType;
  images: SelectedImageType[];
  handleColorSelect: (value: SelectedImageType) => void;
  handleQtyChange: (amount: number) => void;
  handleAddToCart: () => void;
}> = ({
  cartProduct,
  images,
  handleQtyChange,
  handleColorSelect,
  handleAddToCart,
}) => (
  <>
    <div>
      <SetColor
        cartProduct={cartProduct}
        images={images}
        handleColorSelect={handleColorSelect}
      />
    </div>
    <Horizontal />
    <SetQuantity cartProduct={cartProduct} handleQtyChange={handleQtyChange} />
    <Horizontal />
    <div className="max-w-[300px]">
      <Button label="Add To Cart" onClick={handleAddToCart} />
    </div>
  </>
);

export default ProductNotInCart;
