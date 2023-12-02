"use client";

import { CartProductType } from "@/app/product/[productId]/ProductDetails";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyChange: (amount: number) => void;
}

const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyChange,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : <div className="font-semibold">QUANTITY:</div>}
      <div className="flex gap-4 items-center text-base">
        <button onClick={() => handleQtyChange(-1)} className={btnStyles}>
          -
        </button>
        <div>{cartProduct.qantity}</div>
        <button onClick={() => handleQtyChange(1)} className={btnStyles}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
