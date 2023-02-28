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
    Collapse,
    Upload
  } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons'
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import Swal from "sweetalert2";

const { Panel } = Collapse;
const { Content } = Layout;

const PaymentSettings = () => {
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const [form] = Form.useForm();
  const { database, auth } = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentSettings, setPaymentSettings] = useState([]);


  const fetchPayment = () => {
    setIsLoading(true);
    database
      .ref("payment")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          console.log(snapshot.val())
          setPaymentSettings(snapshot.val());
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (paymentSettings) {
      form.setFieldsValue(paymentSettings);
    } else {
      form.resetFields();
    }
  }, [paymentSettings])

  useEffect(() => {
    fetchPayment();
  }, []);

  const onFinish = (values) => {
    
    database
      .ref("payment")
      .update(values)
      .then((res) => {
        message.success("Payment settings saved!");
      })
      .catch((error) => {
        message.error(error);
      });
    
  };

  const handleThemeOptionIcon = (options) => {
    let panelIcon = <PlusSquareOutlined />;

    if (options.isActive) {
      panelIcon = <MinusSquareOutlined />;
    }

    return panelIcon;
  }


  return (
    <Content style={{ display: "flex", width: "100%" }}>
      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Spin spinning={isLoading}>
          <div style={{ margin: 50 }}>
            <Collapse expandIcon={handleThemeOptionIcon} ghost defaultActiveKey="1" style={{ marginBottom: 15 }}>
              <Panel header="GCASH / PAYMAYA" key="1">
                <div>
                  <Form.Item label="Gcash Number" name="gcashphone">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Paymaya Number" name="paymayaphone">
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button htmlType="submit">Save Settings</Button>
                </Form.Item>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </Form>
    </Content>
  );
};

export default PaymentSettings;
