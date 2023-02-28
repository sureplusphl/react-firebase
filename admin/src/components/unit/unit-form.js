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
import { UnitContext } from "../../shared/contexts/unit.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";

const UnitForm = () => {
  const { database, storage } = useContext(FirebaseContext);
  
  const {
    isShowUnitFormModal,
    closeUnitFormModal,
    selectedUnit,
    saveUnit,
    isLoading,
  } = useContext(UnitContext);

  const [form] = Form.useForm();
  useEffect(() => {
    if (isShowUnitFormModal) {
      if (
        selectedUnit &&
        Object.keys(selectedUnit) &&
        Object.keys(selectedUnit).length
      ) {
        form.setFieldsValue({
          ...selectedUnit,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
  }, [isShowUnitFormModal, form]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  const submitForm = (order) => {
    saveUnit(order);
  };

  return (
    <Modal
      title={`Unit Info: ${selectedUnit.name || ""}`}
      visible={isShowUnitFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeUnitFormModal}
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
                  Update Unit
                </Button>
              </Col>
            </Row>
          </Form.Item>

        </Spin>
      </Form>
    </Modal>
  );
};

export default UnitForm;
