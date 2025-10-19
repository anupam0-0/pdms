import React from "react";
import ProductCard from "./ProductCard";
import { logger } from "@/lib/logger";
import { Product } from "@/types/product";

const ProductsGrid = ({ items }: { items: Product[] }) => {
  logger("log", items);
  return (
    <div className="w-full">
      <div className="grid max-w-[90rem] mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-y-6">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, i) => (
            <div key={i}>
              <ProductCard {...item} />
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
