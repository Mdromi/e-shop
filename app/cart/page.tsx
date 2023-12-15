import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import CartClient from "./CartClient";

const Cart = async () => {
  const currrentUser = await getCurrentUser()
  return <div className="pt-8">
    <Container>
    <CartClient currrentUser={currrentUser}/>
    </Container>
  </div>;
};

export default Cart;
