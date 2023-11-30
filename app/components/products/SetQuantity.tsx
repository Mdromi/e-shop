"use client";

import { CartProductType } from "@/app/product/[productId]/ProductDetails";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncress: () => void;
  handleQtyDecress: () => void;
}

const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded"

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyIncress,
  handleQtyDecress,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : <div className="font-semibold">QUANTITY:</div>}
      <div className="flex gap-4 items-center text-base">
        <button onClick={handleQtyDecress} className={btnStyles}>-</button>
        <div>{cartProduct.qantity}</div>
        <button onClick={handleQtyIncress} className={btnStyles}>+</button>
      </div>
    </div>
  );
};

export default SetQuantity;
