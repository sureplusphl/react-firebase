import React from "react";
import StoresManager from "./stores-manager";
import CategoryProvider from "../../shared/contexts/category.context";
import ProductsProvider from "../../shared/contexts/products.context";

const Stores = () => {
  return (
    <ProductsProvider>
      <CategoryProvider>
        <StoresManager />
      </CategoryProvider>
    </ProductsProvider>
  );
};

export default Stores;
