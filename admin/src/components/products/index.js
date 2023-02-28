import React from "react";
import ProductsTable from "./products-table";
import ProductsProvider from "../../shared/contexts/products.context";

const Products = () => {
  return (
    <ProductsProvider>
      <ProductsTable />
    </ProductsProvider>
  );
};

export default Products;
