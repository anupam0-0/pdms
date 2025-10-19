import { Product } from "@/types/product";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const ProductCard = (item: Product) => {
  // Use imageUrls from Product. Use first image or a placeholder.
  const imageUrl =
    Array.isArray(item.imageUrls) &&
    item.imageUrls.length > 0 &&
    item.imageUrls[0]
      ? item.imageUrls[0]
      : "https://placehold.co/400";

  // Stock display logic using the correct Product fields
  // Product has 'stock' not 'quantity'
  const hasStock = typeof item.stock === "number";

  return (
    <Card className="w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="">
        <div className="flex justify-center items-center mb-2">
          <Image
            src={imageUrl}
            alt={item.name}
            width={400}
            height={400}
            className="object-cover rounded-md bg-gray-50"
          />
        </div>
        <CardTitle className="truncate text-2xl capitalize font-semibold">
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-primary/80 mb-3 min-h-[40px] line-clamp-2 text-sm">
          {item.description ?? "No description available."}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary text-lg">
            {item.price
              ? `Rs. ${item.price.toLocaleString()} / -`
              : "Price on Request"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between">
          <Button variant={`outline`} size={`icon`} className="hover:text-pink-600">
            <Heart />
          </Button>
          <Button variant={`outline`} className="w-[40%]">
            Buy Now
          </Button>
          <Button className="w-[40%] ">Add to Cart</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
