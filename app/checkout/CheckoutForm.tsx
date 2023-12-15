"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../components/products/Heading";
import Button from "../components/Button";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const { cartTotalAmmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const formatedPrice = formatPrice(cartTotalAmmount);

  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;
  }, [stripe, clientSecret]);

  const handlePaymentIntent = () => {
    if (stripe && clientSecret) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
          if (paymentIntent) {
            switch (paymentIntent.status) {
              case "succeeded":
                // Remove eShopPaymentIntent from localStorage
                localStorage.removeItem("eShopPaymentIntent");
                toast.success("Checkout Success");
                break;
              case "processing":
                toast.loading("Your payment is processing.");
                break;
              case "requires_payment_method":
                toast.error(
                  "Your payment was not successful, please try again."
                );
                break;
              default:
                toast.error("Something went wrong.");
                break;
            }
          }
        })
        .catch(() => toast.error("Unable to retrieve payment status."));
    }
  };

  const handlePaymentSuccess = () => {
    handleClearCart();
    handleSetPaymentSuccess(true);
    handleSetPaymentIntent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      console.log("result-2", result);

      if (!result.error) {
        handlePaymentSuccess();
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Something went wrong during payment confirmation");
    } finally {
      setIsLoading(false);
      handlePaymentIntent()
    }
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>
      <h2 className="font-semibold mb-2">Address Information</h2>
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["US", "BD"],
        }}
      />
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total: {formatedPrice}
      </div>
      <Button
        label={isLoading ? "Processing" : "Pay Now"}
        disabled={isLoading || !stripe || !elements}
        onClick={() => {}}
      />
    </form>
  );
};

export default CheckoutForm;
