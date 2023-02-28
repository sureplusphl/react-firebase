import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
} from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { CategoryContext } from "../../shared/contexts/category.context";
import { AuthContext } from "../../shared/contexts/auth.context";

const { Option } = Select;

const CategoryAdd = (props) => {
  const { database } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const [parentCat, setParentCat] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [form] = Form.useForm();
  const { userInfoStore, userInfoRole } = useContext(AuthContext);

  const {
    fetchStoreCategories,
    storeCategories,
    saveProductCategory,
  } = useContext(CategoryContext);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  useEffect(() => {
    fetchStoreCategories();
  }, []);

  const submitForm = (value) => {
    if (userInfoRole == 'reseller') {
      value.store_id = String(userInfoStore);
    }

    saveProductCategory(value, true);
    handleClose();
  };

  return (
    <div>
      <button
        className="ant-btn ant-btn-primary"
        variant="primary"
        onClick={handleShow}
      >
        Add Level 1 Category
      </button>
      <div
        className="ant-divider ant-divider-horizontal"
        role="separator"
      ></div>
      <Modal
        title={"Add Category"}
        visible={show}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleClose}
        maskClosable="false"
      >
        <Form {...layout} form={form} onFinish={submitForm}>
          <Form.Item label="Tier 2 Category" id="store" name="store_id">
            
            {
              (
                userInfoRole == 'reseller' && (
                  <Select
                    defaultValue={String(userInfoStore)} disabled
                    placeholder="Choose Tier 2 Category"
                    style={{ width: '100%'}}>
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
                  style={{ width: '100%'}}>
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
                Add Category
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryAdd;
