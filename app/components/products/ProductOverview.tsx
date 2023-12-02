import { ProductDetailsProps } from "@/app/product/[productId]/ProductDetails";
import { calculateAverageRating } from "@/utils/calculateAverageRating";
import { Rating } from "@mui/material";
import Horizontal from "./Horizontal";

const ProductOverview: React.FC<ProductDetailsProps> = ({ product }) => {
  const averageProductRating = calculateAverageRating(product);

  return (
    <>
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
    </>
  );
};

export default ProductOverview;
