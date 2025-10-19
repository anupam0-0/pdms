"use client";

import { API_PATHS } from "@/api/apiPaths";
import axiosClient from "@/api/axiosClient";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import ProductsGrid from "@/features/store/components/ProductsGrid";

const GEt_ALL_ITEMS = API_PATHS.PRODUCTS.GET_ITEMS;

const Page = () => {
  const [items, setItems] = useState<Product[]>([]);

  async function getallItems() {
    try {
      const response = await axiosClient.get(GEt_ALL_ITEMS);
      const fetchedItems = response.data.data;
      setItems(fetchedItems);
      // logger("log", fetchedItems);
    } catch (error) {
      logger("error", error);
      setItems([]); // Set to empty array on error
    }
  }
  useEffect(() => {
    getallItems();
  }, []);

  return (
    <div className="w-full" >
      <ProductsGrid items={items} />
    </div>
  );
};

export default Page;
