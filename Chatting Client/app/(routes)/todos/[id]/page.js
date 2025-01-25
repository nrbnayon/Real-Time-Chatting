import ProductDetailContent from "@/components/ProductDetailContent";
import { ProductCardSkeleton } from "@/components/Skeleton/ProductCardSk";
import { Suspense } from "react";

async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const { id: productId } = resolvedParams;

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-[1439px] mx-auto'>
        <div className='max-w-[1200px] mx-auto px-4 py-8'>
          <Suspense
            fallback={
              <div className='min-h-screen w-full bg-gray-50 py-12 md:py-20 flex flex-col items-center justify-center'>
                <div className='text-xl md:text-2xl text-gray-700 mb-6'>
                  Loading...
                </div>

                <ProductCardSkeleton />
              </div>
            }
          >
            <ProductDetailContent id={productId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
