import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AddProductForm from "./AddProductForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const ManageProducts = async () => {
  const currrentUser = await getCurrentUser();
  console.log("currrentUser.role", currrentUser?.role);
  

  if (!currrentUser || currrentUser.role !== "ADMIN") {
    return <NullData title="Opps! Access denieds" />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default ManageProducts;
