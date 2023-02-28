import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Input,
  Select,
} from "antd";
import { UserContext } from "../../shared/contexts/user.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";

const { Option } = Select;

const CategoryForm = () => {
  const { database, storage } = useContext(FirebaseContext);
  const [storesCategory, setStoresCategory] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  const {
    isShowUserFormModal,
    closeUserFormModal,
    selectedUser,
    saveUser,
    isLoading,
  } = useContext(UserContext);

  const [form] = Form.useForm();
  useEffect(() => {
    if (isShowUserFormModal) {
      if (selectedUser) {
        form.setFieldsValue({
          ...selectedUser,
        });
        fetchProductCategories(selectedUser);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
    getStoreCategories();
  }, [isShowUserFormModal, form]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  let storesCategoryArray = [];
  let productCategoryArray = [];

  const getStoreCategories = () => {
    database.ref("categories").on("value", (snapshot) => {
      if (snapshot.val()) {
        const categories = snapshot.val();
        setStoresCategory(categories);
      }
    });
  }

  const fetchProductCategories = (value) => {
    database.ref("categories").child(value.store_id).child("children").on("value", (snapshot) => {
      setProductCategories(snapshot.val());
    })
  }

  const handleStoreChanged = (key) => {
    form.setFieldsValue({ store_name: storesCategory[key].name });

    // if (storesCategory[key].children) {
    //   setProductCategories(storesCategory[key].children);

    //   if (selectedUser.product_category) {
    //     form.setFieldsValue({ product_category_name: selectedUser.product_category_name });
    //     form.setFieldsValue({ product_category: selectedUser.product_category });
    //   } else {
    //     form.setFieldsValue({ product_category_name: storesCategory[key].name });
    //     form.setFieldsValue({ product_category: '' });
    //   }
    // } else {
    //   setProductCategories(null);
    //   form.setFieldsValue({ product_category_name: storesCategory[key].name });
    //   form.setFieldsValue({ product_category: "" });
    // }

  }


  if (storesCategory) {
    storesCategoryArray = Object.keys(storesCategory).map((key) => {
      return <Option key={key} value={key}>{storesCategory[key].name}</Option>;
    });
  }

  if (productCategories) {
    productCategoryArray = (Object.keys(productCategories).map((id) => {
      return <Option key={id} value={id}>{productCategories[id].name}</Option>;
    }));
  }

  let productCategoryName = "";
  const handleProductCategoryChanged = (e, event) => {
    productCategoryName = e ? event.children : storesCategory[form.getFieldValue("store_id")].name;
  }


  const submitForm = (value) => {
    // if (productCategoryName) {
    //   value.product_category_name = productCategoryName;
    // }

    saveUser(value, false);
  };

  return (
    <Modal
      title={`User Info: ${selectedUser.name || ""}`}
      visible={isShowUserFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeUserFormModal}
      maskClosable="false"
    >
      <Form {...layout} form={form} onFinish={submitForm}>
        <Spin spinning={isLoading}>
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item style={{ display: "none" }} name="store_name">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true}]}>
              <Input disabled/>
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true}]}>
            <Input type="password" disabled/>
          </Form.Item>
          <Form.Item label="Level 2 Category" id="store" name="store_id" rules={[{ required: true }]}>
            <Select
              placeholder="Choose Level 2 Category"
              onChange={handleStoreChanged}
              style={{ width: '100%'}}>
                {
                  storesCategoryArray
                }
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row justify="end">
              <Button
                style={{ background: "#d86060", color: "#ffffff", marginRight: 10 }}
                htmlType="reset"
                onClick={() => form.resetFields()}
              >
                Reset
                </Button>
              <Button type="primary" htmlType="submit">
                Update User
                </Button>
            </Row>
          </Form.Item>
        </Spin>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
