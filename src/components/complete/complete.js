import React, { useContext } from "react";
import { Layout, Divider, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { AppContext } from "../../shared/contexts/app.context";
const { Content } = Layout;

const Complete = () => {
  const { trackingCode } = useContext(AppContext);
  return (
    <Content style={{ alignContent: "center", padding: 50 }} align="center">
      <CheckCircleOutlined style={{ fontSize: 100, color: "green" }} />
      <Divider type="horizontal" />
      <p>
        Your order is being processed. Your <strong>tracking code</strong> is
        <Divider />
        <Tag color="green" style={{ fontSize: 30, padding: 20 }}>
          {trackingCode}
        </Tag>
      </p>
      <p>
        <strong>This serves as confirmation that we have received your order. Thank you for supporting Sureplus!</strong>
        {/* <strong>A supplementary email will also be sent to you within 24 hours.</strong> */}
      </p>

      <p style={{marginTop:50}}>
        <strong style={{fontSize:18}}>Continue browsing <a href="/">here</a></strong>
      </p>
    </Content>
  );
};

export default Complete;
