"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const router = useRouter();
  useEffect(() => {
    // create a paymentintent as soon as the page loads
    if (cartProducts) {
      setLoading(true);
      setError(false);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: handleSetPaymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            return router.push("/login");
          }
          res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.clientSecret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch((error) => {
          setError(true);
          console.error("Error:", error);
          toast.error("Something went wrong");
        });
    }
  }, [cartProducts, handleSetPaymentIntent]);

  return <div>Checkout</div>;
};

export default CheckoutClient;
