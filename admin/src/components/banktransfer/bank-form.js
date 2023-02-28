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
  InputNumber,
} from "antd";
import { BankContext } from "../../shared/contexts/bank.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";

const BankForm = () => {
  const { database, storage } = useContext(FirebaseContext);
  
  const {
    isShowBankFormModal,
    closeBankFormModal,
    selectedBank,
    saveBank,
    isLoading,
  } = useContext(BankContext);

  const [form] = Form.useForm();
  useEffect(() => {
    if (isShowBankFormModal) {
      if (
        selectedBank &&
        Object.keys(selectedBank) &&
        Object.keys(selectedBank).length
      ) {
        form.setFieldsValue({
          ...selectedBank,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
  }, [isShowBankFormModal, form]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  const submitForm = (bank) => {
    console.log(bank);
    saveBank(bank);
  };

  return (
    <Modal
      title={`Bank Info: ${selectedBank.name || ""}`}
      visible={isShowBankFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeBankFormModal}
      maskClosable="false"
    >
      <Form {...layout} form={form} onFinish={submitForm}>
        <Spin spinning={isLoading}>
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>

          {/* <Form.Item label="Key" name="key" rules={[{ required: true }]}>
            <Input />
          </Form.Item> */}

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
                  Update Bank
                </Button>
              </Col>
            </Row>
          </Form.Item>

        </Spin>
      </Form>
    </Modal>
  );
};

export default BankForm;
