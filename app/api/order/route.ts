
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Prisma } from "@prisma/client";


export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.error();
    }

    const body = await request.json();
    const { id, deliveryStatus  } = body;
    

    if (!id) return NextResponse.error();

    console.log("deliveryStatus", deliveryStatus);
    

    const order = await prisma.order.update({
      where: { id: id },
      data: { deliveryStatus },
    });

    return NextResponse.json(order);
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



