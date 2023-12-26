import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import { products } from "@/utils/products";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface IPrams {
  productId?: string;
}

const Product = async ({ params }: { params: IPrams }) => {
  // Ensure params.productId is a valid string
  if (!params.productId) {
    return <NullData title="Opps! Product ID is missing" />;
  }

  const currentUser = await getCurrentUser()
  const customProduct = await getProductById(params);
  const utilsProduct = products.find((item) => item.id === params.productId);

  // Check if either customProduct or utilsProduct is found
  if (customProduct || utilsProduct) {
    const product = {
      ...customProduct,
      ...utilsProduct,
    };

    return (
      <div className="p-8">
        <Container>
          <ProductDetails product={product} />
          <div className="flex flex-col mt-20 gap-4">
           <AddRating product={customProduct} user={currentUser}/>
            <ListRating product={product} />
          </div>
        </Container>
      </div>
    );
  }

  // If neither customProduct nor utilsProduct is found
  return <NullData title="Opps! Product with the given id does not exist" />;
};

export default Product;
