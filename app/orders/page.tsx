import Container from "@/app/components/Container";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";
import ManageOrdersClient from "./OrdersClient";
import getOrdersByUserId from "@/actions/getOrdersByUserId";

const Orders = async () => {
  const currrentUser = await getCurrentUser();

  if (!currrentUser) {
    return <NullData title="Opps! Access denieds" />;
  }

  const orders = await getOrdersByUserId(currrentUser.id);
  if (!orders) {
    return <NullData title="No orders yet..." />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageOrdersClient orders={orders} />
      </Container>
    </div>
  );
};

export default Orders;
