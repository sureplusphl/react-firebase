import React, { useContext, useEffect, useState } from "react";
import { Switch } from "antd";
import { Input, InputNumber } from "antd";
import { Row } from "antd";
import { Col, Form } from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { Button } from "antd";
import { message } from "antd";
import { Spin } from "antd";

const Settings = () => {
  const [shopStatus, setShopStatus] = useState({
    status: "enabled",
    message: "",
    process_fee: "",
    del_fee: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { database } = useContext(FirebaseContext);
  const getShopStatus = () => {
    setIsLoading(true);
    database
      .ref("shop_status")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setShopStatus(snapshot.val());
        }
        setIsLoading(false);
      });
  };

  const [form] = Form.useForm();

  useEffect(() => {
    getShopStatus();
  }, []);

  useEffect(() => {
    console.log(shopStatus);
    form.setFieldsValue({
      status: shopStatus.status === "enabled" ? true : false,
      message: shopStatus && shopStatus.message,
      process_fee: shopStatus && shopStatus.process_fee,
      del_fee: shopStatus && shopStatus.del_fee,
    });
  }, [shopStatus]);

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  const onFinish = (values) => {
    database
      .ref("shop_status")
      .update({
        status: values.status ? "enabled" : "disabled",
        message: values.message ? values.message : "",
        process_fee: values.process_fee ? values.process_fee : 0,
        del_fee: values.del_fee ? values.del_fee : 0,
      })
      .then((res) => {
        message.success("Settings Saved!");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      {...layout}
      initialValues={{
        status: shopStatus.status === "enabled" ? true : false,
        message: shopStatus && shopStatus.message,
        process_fee: shopStatus && shopStatus.process_fee,
        del_fee: shopStatus && shopStatus.del_fee,
      }}
      style={{ width: "100%" }}
    >
      <Spin spinning={isLoading}>
        <div style={{ margin: 50 }}>
          <Form.Item name="status" valuePropName="checked" label="Shop Status">
            <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
          </Form.Item>
          <Form.Item name="message" label="Message">
            <Input.TextArea style={{ width: "100%" }} rows={5} />
          </Form.Item>

          <Form.Item name="process_fee" label="Packing Fee">
            <InputNumber />
          </Form.Item>

          <Form.Item name="del_fee" label="Delivery Fee">
            <InputNumber />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button htmlType="submit">Save Settings</Button>
          </Form.Item>
        </div>
      </Spin>
    </Form>
  );
};

export default Settings;
