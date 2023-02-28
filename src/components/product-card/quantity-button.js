import React from "react";
import PropTypes from "prop-types";
import { PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons";
import { message, Col, Button } from "antd";

const QuantityButton = ({ modalShow, product, addOrder, quantityDisplay, summaryShow }) => {
  const calculate = (newQuantity) => {
    const newStock = product.stock - newQuantity;

    if (parseInt(newStock, 10) < 0) {
      message.error(`${product.name} have been sold out`);
      return;
    }

    if (parseInt(product.limit, 10) < newQuantity) {
      message.error(`Order limit reached for ${product.name}`);
      return;
    }

    if (
      newQuantity >= 0 &&
      parseInt(newStock, 10) >= 0 &&
      parseInt(product.limit, 10) >= newQuantity
    )
      addOrder(product, newQuantity);
  };

  const increment = () => {
    const newQuantity = product.quantity + product.increment;
    calculate(newQuantity);
  };

  const decrement = () => {
    const newQuantity = product.quantity - product.increment;
    calculate(newQuantity);
  };

  return (
    <>
    {modalShow ? (
      <div className="counterContainer">
        <div className={`${summaryShow ? "counterSummary": "counter"}`}>
          <Col span={8} className="counterCol">
            <Button
              onClick={decrement}
              className={`${summaryShow ? "summaryBtnLeft": "counterButton"}`}
            >
              <strong>-</strong>
            </Button>
          </Col>
          <Col span={8} className="counterCol">
            {/* <Button className={`${summaryShow ? "summaryQuantityBtn": "counterButton counterValue"}`}> */}
              <strong className={`${summaryShow ? "summaryQuantity": "modalProductQuantity"}`}>
                {product.quantity}
              </strong>
            {/* </Button> */}
          </Col>
          <Col span={8} className="counterCol">
            <Button
              onClick={increment}
              className={`${summaryShow ? "summaryBtnRight" : "counterButton"}`}
            >
              <strong>+</strong>
            </Button>
          </Col>
        </div>
      </div>
    ):(
      <div style={{ fontSize: 40, lineHeight: "48px", textAlign: "center", width: '100%', position: "absolute", marginTop: 12}}>
        <MinusCircleFilled onClick={decrement} style={{ color: "#ec7c7c" }} />
        {quantityDisplay}
        <PlusCircleFilled onClick={increment} style={{ color: "#1080d0" }} />
      </div>
    )}
    
    </>


  );
};

QuantityButton.propTypes = {
  product: PropTypes.object.isRequired,
};

export default QuantityButton;
