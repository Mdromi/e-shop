import getProducts from "@/actions/getProducts";
import Container from "@/app/components/Container";
import ManageProductClient from "./ManageProductClient";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const AddProducts = async () => {
  const products = await getProducts({ category: null });
  const currrentUser = await getCurrentUser();

  if (!currrentUser || currrentUser.role !== "ADMIN") {
    return <NullData title="Opps! Access denieds" />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageProductClient products={products}/>
      </Container>
    </div>
  );
};

export default AddProducts;
