"use client";

import { API_PATHS } from "@/api/apiPaths";
import axiosClient from "@/api/axiosClient";
import { Product } from "@/types/product";
import React, { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import ProductsGrid from "@/features/store/components/ProductsGrid";
import { useProducts } from "@/features/store/hooks/useProducts";
import Navbar from "@/components/Navbar";
import SortFilterMenu from "@/features/store/components/SortFilterMenu";
import StoreBreadcrumb from "@/features/store/components/StoreBreadcrumb";

const GEt_ALL_ITEMS = API_PATHS.PRODUCTS.GET_ITEMS;

const Page = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Failed to load products.</div>;

  return (
    <div className="w-full">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-10">
        <div className=" max-w-[90rem] mx-auto">
          <StoreBreadcrumb />
          <SortFilterMenu />
          <ProductsGrid items={products} />
        </div>
      </div>
      <footer>
        <div className="h-40">

        </div>
      </footer>
    </div>
  );
};

export default Page;
