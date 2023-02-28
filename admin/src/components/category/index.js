import React from "react";
import CategoryManager from "./category-manager";
import CategoryProvider from "../../shared/contexts/category.context";
import ProductsProvider from "../../shared/contexts/products.context";

const Category = () => {
  return (
    <ProductsProvider>
      <CategoryProvider>
        <CategoryManager />
      </CategoryProvider>
    </ProductsProvider>
  );
};

export default Category;
