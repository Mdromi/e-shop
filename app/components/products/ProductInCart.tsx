import { MdCheckCircle } from "react-icons/md";
import Button from "../Button";

// ProductInCart component
const ProductInCart: React.FC<{ onNavigateToCart: () => void }> = ({
  onNavigateToCart,
}) => (
  <>
    <p className="mb-2 text-slate-500 flex items-center gap-1">
      <MdCheckCircle className="text-teal-400" size={20} />
      <span>Product added to cart</span>
    </p>
    <div className="max-w-[300px]">
      <Button label="View Cart" outline onClick={onNavigateToCart} />
    </div>
  </>
);

export default ProductInCart;
