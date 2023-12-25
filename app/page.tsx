import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import { products } from "@/utils/products";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductsParams } from "@/actions/getProducts";
import NullData from "./components/NullData";

interface HomeProps {
  searchParams: IProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  
  const customProducts = await getProducts(searchParams);
  const utilsProduct = products;

  if (products.length === 0 || utilsProduct.length === 0) {
    return (
      <NullData title='Opps! No products found. Click "All" to clear filters' />
    );
  }

  function shufflenArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const shuffledProducts = shufflenArray(customProducts);

  const productClassName =
    "grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8";

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        {utilsProduct.length !== 0 && <div className="mb-4 text-lg font-bold">Featured Products</div>}
        <div className={productClassName}>
          {utilsProduct.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
        {shuffledProducts.length !== 0 && <div className="mt-8 mb-4 text-lg font-bold">New Arrivals</div>}
        <div className={productClassName}>
          {shuffledProducts.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
