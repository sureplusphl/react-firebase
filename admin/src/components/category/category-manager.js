import React, { useEffect, useContext } from "react";
import { 
  Table,
  Row,
  Col,
  Select
} from "antd";
import { CategoryContext } from "../../shared/contexts/category.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import CategoryForm from "./category-form";
import CategoryAdd from "./category-add";

const { Option } = Select;

const CategoryManager = () => {
  const {
    fetchStoreCategories,
    fetchAllProductCategories,
    fetchProductCategories,
    storeCategories,
    productColumns,
    filteredCategory,
  } = useContext(CategoryContext);
  const { userInfoStore, userInfoRole } = useContext(AuthContext);

  useEffect(() => {
    fetchStoreCategories();

    if(userInfoRole == 'admin'){
      fetchAllProductCategories();
    }
    else {
      fetchProductCategories(String(userInfoStore));
    }

  }, []);

  const handleCategoryChanged = (id) => {
    if(id) {
      fetchProductCategories(id);
    } else {
      fetchAllProductCategories();
    }
  }

  return (
    <div>
      <CategoryForm />
      <h1>Level 1 Category</h1>
      <Row gutter={10}>
        <Col>
          <CategoryAdd />
        </Col>
        <Col>

          {
            (
              userInfoRole == 'reseller' && (
                <Select style={{width: 200}} placeholder="Choose Store" onChange={handleCategoryChanged} defaultValue={String(userInfoStore)} disabled>
                  {
                    storeCategories ? storeCategories.map((e) => (
                      <Option value={e.key} key={e.key} >{e.name}</Option>
                    )) : null
                  }
                </Select>
              )
            ) || 
            (
              <Select style={{width: 200}} placeholder="Choose Store Category" onChange={handleCategoryChanged} defaultValue="All">
                <Option value="">All</Option>
                {
                  storeCategories ? storeCategories.map((e) => (
                    <Option value={e.key} key={e.key} >{e.name}</Option>
                  )) : null
                }
              </Select>
            )
          }

        </Col>
      </Row>
      <Table
        columns={productColumns}
        dataSource={filteredCategory}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default CategoryManager;
