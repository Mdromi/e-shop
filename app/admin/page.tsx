import getOrders from "@/actions/getOrders";
import Summary from "./Summary";
import getProducts from "@/actions/getProducts";
import getUsers from "@/actions/getUsers";
import Container from "../components/Container";

const Admin = async () => {
  const products = await getProducts({ category: null });
  const orders = await getOrders();
  const users = await getUsers();
  return (
    <div className="p-8">
      <Container>
        <Summary users={users} products={products} orders={orders} />
      </Container>
    </div>
  );
};

export default Admin;
