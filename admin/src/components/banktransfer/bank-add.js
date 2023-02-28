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
import { BankContext } from "../../shared/contexts/bank.context";


const BankAdd = () => {
  const { database, storage } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [form] = Form.useForm();
  const {
    fetchBank,
    bank,
  } = useContext(BankContext);


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  

  useEffect(() => {
    if (handleShow) {
      form.setFieldsValue();
    }
  }, [handleShow]);


  const submitForm = (bank) => {
    let updates = {};
    
    const name = bank.name.toLowerCase();
    bank.key = name.split(" ").join("_");
    // bank.key = uniqueId(`${replaced}_`);

    updates["bank/" + bank["key"]] = bank;
    database.ref().update(updates);
    form.resetFields();
    setShow(false);
    
  };

  return (
    <div>
      <button
        className="ant-btn ant-btn-primary"
        variant="primary"
        onClick={handleShow}
      >
        Add Bank
      </button>
      <div
        className="ant-divider ant-divider-horizontal"
        role="separator"
      ></div>
      <Modal
        title={"Add Bank"}
        visible={show}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleClose}
        maskClosable="false"
      >
        <Form {...layout} form={form} onFinish={submitForm}>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Account Name" name="account_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Account Number" name="account_number" rules={[{ required: true }]}>
            <Input />
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
                  Add Bank
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankAdd;
