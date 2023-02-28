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
import { CategoryContext } from "../../shared/contexts/category.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { AuthContext } from "../../shared/contexts/auth.context";

const { Option } = Select;

const CategoryForm = () => {
  const { database, storage } = useContext(FirebaseContext);
  const {
    fetchStoreCategories,
    storeCategories,
    isShowCategoryFormModal,
    closeCategoryFormModal,
    selectedCategory,
    saveProductCategory,
    isLoading,
  } = useContext(CategoryContext);
  const { userInfoStore, userInfoRole } = useContext(AuthContext);

  const [form] = Form.useForm();
  useEffect(() => {
    if (isShowCategoryFormModal) {
      if (selectedCategory) {
        form.setFieldsValue({
          ...selectedCategory,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
    fetchStoreCategories();
  }, [isShowCategoryFormModal, form]);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  const submitForm = (value) => {
    saveProductCategory(value, false);
  };

  return (
    <Modal
      title={`Category Info: ${selectedCategory.name || ""}`}
      visible={isShowCategoryFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeCategoryFormModal}
      maskClosable="false"
    >
      <Form {...layout} form={form} onFinish={submitForm}>
        <Spin spinning={isLoading}>
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="Tier 2 Category" id="store" name="store_id" rules={[{ required: true }]}>
            {
              (
                userInfoRole == 'reseller' && (
                  <Select
                    defaultValue={String(userInfoStore)} disabled
                    placeholder="Choose Tier 2 Category"
                    style={{ width: '100%' }}>
                    {
                      storeCategories ? storeCategories.map(e => (
                        <Option value={e.key} key={e.key}>{e.name}</Option>
                      )) : null
                    }
                  </Select>
                )
              ) ||
              (
                <Select
                  placeholder="Choose Tier 2 Category"
                  style={{ width: '100%' }}>
                  {
                    storeCategories ? storeCategories.map(e => (
                      <Option value={e.key} key={e.key}>{e.name}</Option>
                    )) : null
                  }
                </Select>
              )
            }
            
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
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
                Update Category
                </Button>
            </Row>
          </Form.Item>
        </Spin>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
