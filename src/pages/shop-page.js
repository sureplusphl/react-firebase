import React, { useContext, useEffect } from "react";
import { Steps, Modal, Typography, Alert } from "antd";
import { AppContext } from "../shared/contexts/app.context";
import ConfirmOrder from "../components/confirm-order";
import Checkout from "../components/checkout";
import Complete from "../components/complete";
import Shop from "../components/shop";
import "./shopPage.css";

const ShopPage = () => {
  const { Step } = Steps;
  const { Title } = Typography;

  const { current, shopStatus, announcements } = useContext(AppContext);

  useEffect(() => {
    // window.scrollTo(0, 0);
    const stepsElement = document.getElementById("stepsContent");
    stepsElement.scrollIntoView();
  }, [current]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 380, marginTop: 64 }}
    >
      <Modal
        title=""
        visible={shopStatus && shopStatus.status === "disabled"}
        maskStyle={{ backgroundColor: "#ddd", opacity: 0.9 }}
        centered
        footer={``}
        closable={false}
      >
        <div align="center" style={{ paddingTop: "20px" }}>
          <img src={`/android-icon-192x192.png`} alt="" />
        </div>
        <Title
          level={3}
          style={{
            textAlign: "center",
            color: "#333",
            marginTop: 20,
            padding: 20,
          }}
        >
          {shopStatus && shopStatus.message}
        </Title>
      </Modal>
      <div className="heroDiv">
        <img
          className="hero-image"
          src="/assets/images/shopPage/heroImage.png"
          alt="1"
        />
        <div className="hero-text">
          <h1>FEATURED POST</h1>
        </div>
      </div>

      <Steps
        current={current}
        style={{ marginBottom: "15px", marginTop: "15px" }}
        id="stepsContent"
      >
        <Step title="Shop" description="Select items" />
        <Step title="Confirm" description="Confirm your order" />
        <Step title="Checkout" description="Summary and Delivery" />
      </Steps>

      {current === 0 ? <Shop /> : ""}
      {current === 1 ? <ConfirmOrder /> : ""}
      {current === 2 ? <Checkout /> : ""}
      {current === 3 ? <Complete /> : ""}
    </div>
  );
};

export default ShopPage;
