import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  try {
    const body = await request.json();
    const { name, description, price, brand, category, inStock, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        brand,
        category,
        inStock,
        images,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in product creation:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.error();
    }

    const body = await request.json();
    const { id, inStock } = body;
    

    if (!id) return NextResponse.error();

    const product = await prisma.product.update({
      where: { id: id },
      data: { inStock },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error in PUT request:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors with specific responses
      if (error.code === "P2025") {
        return NextResponse.error();
      }
      // Add more specific error handling as needed
    }

    // For unknown errors, return a generic 500 Internal Server Error response
    return NextResponse.error();
  }
}

