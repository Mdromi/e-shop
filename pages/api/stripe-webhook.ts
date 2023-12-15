import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  switch (event.type) {
    case "charge.succeeded":
      const charge: any = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        await prisma?.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: { status: "complete", address: charge.shipping?.address },
        });
      }
      break;
    default:
      console.log("Unhandled event type: " + event.type);
  }

  res.json({ recived: true });
}
