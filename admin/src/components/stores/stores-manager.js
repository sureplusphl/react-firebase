import React, { useEffect, useContext } from "react";
import { Table } from "antd";
import { CategoryContext } from "../../shared/contexts/category.context";
import StoresForm from "./stores-form";
import StoresAdd from "./stores-add";

const StoresManager = () => {
  const {
    fetchStoreCategoriesByCatOrder,
    storeCategories,
    storeColumns,
  } = useContext(CategoryContext);

  useEffect(() => {
    fetchStoreCategoriesByCatOrder();
  }, []);

  return (
    <div>
      <StoresForm />
      <h1>Level 2 Category</h1>
      <StoresAdd/>
      <Table
        columns={storeColumns}
        // onRow={handleOnClickRow}
        dataSource={storeCategories}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default StoresManager;
