"use client";

import Button from "@/app/components/Button";
import NullData from "@/app/components/NullData";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/products/Heading";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Product, Review, Order } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation"; // Correct import
import { useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form"; // Correct import
import { toast } from "react-hot-toast";

interface ProductWithReviews extends Product {
  reviews: Review[];
}

interface AddRatingProps {
  product: ProductWithReviews | null;
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}
const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Move the conditional checks outside the component
  if (!user || !product) {
    return <NullData title="Product not available" />;
  }

  const deliveredOrder = user.orders.some(
    (order) =>
      order.products.some((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  const userReview = product?.reviews.some(
    (review: Review) => review.userId === user.id
  );

  if (userReview || !deliveredOrder) {
    return null;
  }

  // Call useForm unconditionally at the top level
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("No rating selected");
    }

    const ratingData = { ...data, userId: user.id, product };

    try {
      await axios.post("/api/rating", ratingData);
      toast.success("Rating Submitted");
      router.refresh();
      reset();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate This Product" />
      <Rating
        onChange={(event, newValue) => {
          setCustomValue("rating", newValue);
        }}
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading" : "Rate Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};


export default AddRating;
