import { getCurrentUser } from "@/actions/getCurrentUser";
import { Prisma, Review } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();
    const { comment, rating, product, userId } = body;

    const deliveredOrder = currentUser.orders.some(
      (order) =>
        order.products.some((item) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
    );

    // Use optional chaining to prevent potential errors if product is null
    const userReview = product?.reviews.some(
      (review: Review) => review.userId === currentUser.id
    );

    if (userReview || !deliveredOrder) {
      return NextResponse.error();
    }

    // Use optional chaining to prevent potential errors if prisma is null
    const review = await prisma?.review.create({
      data: {
        comment,
        rating,
        productId: product.id,
        userId,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Error in PUT request:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.error();
    }

    // For unknown errors, return a generic 500 Internal Server Error response
    return NextResponse.error();
  }
}
