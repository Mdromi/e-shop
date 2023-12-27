import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

// cmd -> stripe listen --forward-to localhost:3000/api/stripe-webhook

const stripe = require("stripe")(process.env.STRIPE_SECRECT_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRECT!
    );
  } catch (error) {
    console.log("Error", error);
    return res.status(400).send("Webhook Error" + error);
  }

  const charge: any = event.data.object as Stripe.Charge;

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;

      if (typeof charge.payment_intent === "string") {
        const shippingAddress = charge.shipping?.address;

        await prisma?.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: {
            status: "complete",
            address: shippingAddress ?? undefined,
          },
        });
      }
      break;
    default:
      console.log("Unhandled event type: " + event.type);
  }

  res.json({ recived: true });
}
