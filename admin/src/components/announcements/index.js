import React, { useContext, useEffect, useState } from "react";
import {
  Switch,
  Input,
  Row,
  Col,
  Form,
  Button,
  message,
  Spin,
  Layout,
} from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";

const { Content } = Layout;
const { TextArea } = Input;
const Announcements = () => {
  const [shopStatus, setShopStatus] = useState({
    status: "enabled",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { database } = useContext(FirebaseContext);
  const getShopStatus = () => {
    setIsLoading(true);
    database
      .ref("announcements")
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
    });
  }, [shopStatus]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = (values) => {
    database
      .ref("announcements")
      .update({
        status: values.status ? "enabled" : "disabled",
        message: values.message,
      })
      .then((res) => {
        message.success("Announcement Saved!");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  return (
    <Content style={{ display: "flex", width: "100%" }}>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          status: shopStatus.status === "enabled" ? true : false,
          message: shopStatus && shopStatus.message,
        }}
        style={{ width: "100%" }}
      >
        <Spin spinning={isLoading}>
          <div style={{ margin: 50 }}>
            <Form.Item
              name="status"
              valuePropName="checked"
              label="Announcement"
            >
              <Switch
                checkedChildren="Enabled"
                unCheckedChildren="Disabled"
              />
            </Form.Item>
            <Form.Item name="message" label="Message">
              <TextArea style={{ width: '100%' }} rows={5} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Save Settings</Button>
            </Form.Item>
          </div>
        </Spin>
      </Form>
    </Content>
  );
};

export default Announcements;
