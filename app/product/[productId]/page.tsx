import { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating, { AddRatingProps, ProductWithReviews, UserWithOrders } from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Product, User } from "@prisma/client";

interface IParams {
  productId?: string;
}

const Product = ({ params }: { params: IParams }) => {
  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [currentUser, setCurrentUser] = useState<UserWithOrders | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.productId) {
        return;
      }

      try {
        const fetchedProduct = await getProductById(params);
        const user = await getCurrentUser();

        setProduct(fetchedProduct);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching product or user:", error);
      }
    };

    fetchData();
  }, [params.productId]);

  if (!params.productId) {
    return <NullData title="Oops! Product ID is missing" />;
  }

  if (!product) {
    return <div>Loading...</div>; // You might want to replace this with a loading spinner or a more user-friendly loading message.
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={currentUser} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
