import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import Swal from "sweetalert2";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { uniqueId } from "lodash";
import { UserContext } from "../../shared/contexts/user.context";
import { AuthContext } from "../../shared/contexts/auth.context";

const { Option } = Select;


const UserAdd = () => {
  const { database, storage } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [photoUrl, setPhotoUrl] = useState();
  const [form] = Form.useForm();
  // const {
  //   fetchStoreCategories,
  //   storeCategories,
  // } = useContext(UserContext);
  const { postLogin, firebase, auth } = useContext(AuthContext);

  const [storesCategory, setStoresCategory] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  let storesCategoryArray = [];
  let productCategoryArray = [];

  useEffect(() => {
    if (!storesCategory.length) {
      // console.log('Fetch Store cat');
      getStoreCategories();
    }
  }, []);

  useEffect(() => {
    if (handleShow) {
      form.setFieldsValue();
    }
  }, [handleShow]);

  if (storesCategory) {
    storesCategoryArray = Object.keys(storesCategory).map((key) => {
      return <Option key={key} value={key}>{storesCategory[key].name}</Option>;
    });
  }

  const getStoreCategories = () => {
    database.ref("categories").on("value", (snapshot) => {
      if (snapshot.val()) {
        const categories = snapshot.val();
        setStoresCategory(categories);
      }
    });
  }

  const handleStoreChanged = (key) => {
    if (storesCategory[key].children) {
      setProductCategories(storesCategory[key].children);
      // form.setFieldsValue({ product_category: '' });
    } else {
      setProductCategories(null);
      productCategoryName = "";
      // form.setFieldsValue({ product_category: "" });
    }
  }


  if (productCategories) {
    productCategoryArray = (Object.keys(productCategories).map((id) => {
      return <Option key={id} value={id}>{productCategories[id].name}</Option>;
    }));
  }

  let productCategoryName = "";
  const handleProductCategoryChanged = (e, event) => {
    productCategoryName = event.children;
  }


  const submitForm = (user) => {
    let updates = {};

    const useremail = user.email;
    const userpword = user.password;

    // user.product_category_name = productCategoryName || storesCategory[user.store_id].name;
    user.store_name = storesCategory[user.store_id].name;
    
    auth.createUserWithEmailAndPassword(useremail, userpword)
      .then(function (setuser) {

        const name = user.name.toLowerCase();
        const replaced = name.split(" ").join("_");
        user.key = uniqueId(`${replaced}_`);

        updates["user/" + user.key] = {
          ...user,
          role: 'reseller',
        };
        database.ref().update(updates);

        form.resetFields();
        message.success("User Added!");
        setShow(false);

      }).catch(function (e) {
        // console.log(e)
        Swal.fire({
          icon: "warning",
          title: "User Error",
          text:
            e,
        });
      });

    
  };

  return (
    <div>
      <button
        className="ant-btn ant-btn-primary"
        variant="primary"
        onClick={handleShow}
      >
        Add User
      </button>
      <div
        className="ant-divider ant-divider-horizontal"
        role="separator"
      ></div>
      <Modal
        title={"Add User"}
        visible={show}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleClose}
        maskClosable="false"
      >
        <Form {...layout} form={form} onFinish={submitForm}>
          {/* <Form.Item label="Key" name="key" rules={[{ required: true }]}>
            <Input />
          </Form.Item> */}

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true}]}>
              <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true}]}>
            <Input type="password" />
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
            <Row>
              <Col span={12}>
                <Button
                  style={{ background: "#d86060", color: "#ffffff" }}
                  htmlType="reset"
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  Add User
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAdd;
