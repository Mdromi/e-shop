interface Review {
  rating: number;
  // You can add other properties of a review if needed
}

interface Product {
  reviews: Review[];
  // You can add other properties of a product if needed
}

export const calculateAverageRating = (product: Product, decimalPlaces: number = 2): number => {
  if (!product.reviews || product.reviews.length === 0) {
    return 0; // Default to 0 if there are no reviews
  }

  const totalRating = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const averageRating = totalRating / product.reviews.length;

 // Round the average rating to the specified number of decimal places
 return Number(averageRating.toFixed(decimalPlaces));
};
