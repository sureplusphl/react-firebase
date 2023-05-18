import React, { useEffect, useContext, useState } from "react";
import { Table, Row, Col, Select, Form, Input, Button } from "antd";
import { ProductsContext } from "../../shared/contexts/products.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import ProductForm from "./product-form";
import ProductAdd from "./product-add";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const OrderTable = () => {
  const [storesCategory, setStoresCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form] = Form.useForm();
  const { userInfoStore, userInfoRole } = useContext(AuthContext);

  const { database } = useContext(FirebaseContext);
  const {
    fetchProductsByStoreId,
    fetchProductsByName,
    filteredProducts,
    columns,
    fetchProducts,
    // handleOnClickRow
  } = useContext(ProductsContext);
  const searchStyle = {
    display: "flex",
    width: "100%",
    margin: "auto 0",
    justifyContent: "flex-end",
  };
  useEffect(() => {
    fetchCategories();
    fetchProducts();

    if (userInfoRole == "reseller") {
      fetchProductsByStoreId(String(userInfoStore));
    }
  }, []);

  const fetchCategories = () => {
    const dbRef = database.ref("categories");

    if (userInfoRole == "admin") {
      dbRef.on("value", (snapshot) => {
        setStoresCategory(snapshot.val());
      });
    } else {
      dbRef
        .orderByKey()
        .equalTo(String(userInfoStore))
        .on("value", (snapshot) => {
          setStoresCategory(snapshot.val());
        });
    }
  };

  // UNCOMMENT AFTER PRODUCT UPDATE
  const handleCategoryChanged = (id) => {
    setSelectedCategory(id);
    if (id) {
      fetchProductsByStoreId(id);
    } else {
      fetchProducts();
    }
  };

  const searchForm = (prod) => {
    if (prod.name) {
      fetchProductsByName(prod.name, selectedCategory);
    } else {
      if (selectedCategory) {
        fetchProductsByStoreId(selectedCategory);
      } else {
        fetchProducts();
      }
    }
  };

  return (
    <div>
      <ProductForm />
      <h1>Product List</h1>
      <Row gutter={[8, 16]}>
        <Col xs={12} sm={12} md={12} lg={9} xl={9}>
          <ProductAdd />
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
          {(userInfoRole == "reseller" && (
            <Select
              style={{ width: "100%" }}
              placeholder="Choose Store"
              onChange={handleCategoryChanged}
              defaultValue={String(userInfoStore)}
              disabled
            >
              {storesCategory
                ? Object.keys(storesCategory).map((e) => (
                    <Option value={e} key={e}>
                      {storesCategory[e].name}
                    </Option>
                  ))
                : null}
            </Select>
          )) || (
            <Select
              style={{ width: "100%" }}
              placeholder="Choose Store"
              onChange={handleCategoryChanged}
              defaultValue="All"
            >
              <Option value="">All</Option>
              {storesCategory
                ? Object.keys(storesCategory).map((e) => (
                    <Option value={e} key={e}>
                      {storesCategory[e].name}
                    </Option>
                  ))
                : null}
            </Select>
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <Form style={searchStyle} form={form} onFinish={searchForm}>
            <Form.Item name="name" style={{ width: "100%" }}>
              <Input placeholder="Product Name" />
            </Form.Item>
            <Form.Item name="name">
              <Button type="primary" htmlType="submit">
                <SearchOutlined />
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <div
          className="ant-divider ant-divider-horizontal"
          role="separator"
        ></div>
      </Row>

      <Table
        columns={columns}
        rowClassName={(record, index) =>
          record.price == null || record.price == 0 || record.price == ""
            ? ""
            : "table-row-green"
        }
        // onRow={handleOnClickRow}
        dataSource={filteredProducts}
        scroll={{ x: 500 }}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default OrderTable;
