"use client";

import { useCart } from "@/hooks/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";
import axios from "axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        if (!cartProducts) return;

        setLoading(true);
        setError(false);

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartProducts,
            payment_intent_id: paymentIntent,
          }),
        });

        setLoading(false);

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();

        setClientSecret(data.paymentIntent.client_secret);
        handleSetPaymentIntent(data.paymentIntent.id);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error("Error:", error);
        toast.error("Something went wrong");
      }
    };

    createPaymentIntent();
  }, [cartProducts, handleSetPaymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback(
    async (value: boolean) => {
      setPaymentSuccess(value);

      if (value && paymentIntent != null) {
        // No need to check value again here, it's already true
        await axios.put("/api/order/payment-update", {
          paymentIntentId: paymentIntent,
          status: "complete", 
        });
      }
    },
    [paymentIntent]
  );

  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-500">Something want wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500 text-center">Payment Success</div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Yours Orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
