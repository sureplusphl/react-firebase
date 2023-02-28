import "./style.css";
import React, { useContext, useState, useEffect } from "react";
import { Card, Col, Row, Avatar, Tag } from "antd";

import { AppContext } from "../../shared/contexts/app.context";
import QuantityButton from "./quantity-button";
import CountDisplay from "../count-display";
import ItemModalComponent from "../ItemModalComponent/ItemModalComponent";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import NotesModalComponent from "../ItemModalComponent/NotesModalComponent";


const { Meta } = Card;
const imagePath = "/assets/images/";

const ProductCard = ({ product }) => {
  const { database } = useContext(FirebaseContext);
  const { 
    addOrder
  } = useContext(AppContext);


  const storeId = product.store_id;
  let othersPrice_status = '';
  database.ref("categories/" + storeId).on("value", (snapshot) => {
    if (snapshot.val()) {
      const keyVal = snapshot.val();
      othersPrice_status = keyVal.statusOthersPrice;
    }
  });

  const productRate = `P${product.price} / ${
    product.unit === "g" ? `${product.increment}${product.unit}` : product.unit
  }`;
  const mallPriceRate = `${product.mall_price}`;

  const imagep =
    product.file.substring(0, 5) == "https" ? "" : "/assets/images/";

  // if(product.file.substring(0, 5) == 'https') {
  //   console.log('yes')
  //   console.log(product.file)
  // }
  // else {
  //   console.log('no')
  //   console.log(product.file)

  // }

  const [isShowModal, setIsShowModal] = useState(false);
  const handleShowModal = (product) => {
    setIsShowModal(true);
  };
  const handleClose = () => setIsShowModal(false);

  return parseInt(product.price, 10) ? (
    <>
      {/* <ItemModalComponent show={isShowModal} onCancel={handleClose} itemData={product} addOrder={addOrder} /> */}
      {product.notes ? (
        <NotesModalComponent show={isShowModal} onCancel={handleClose} itemData={product} addOrder={addOrder} />
      ): (
        <ItemModalComponent show={isShowModal} onCancel={handleClose} itemData={product} addOrder={addOrder} />
      )}

      <Col xl={5} xxl={5} lg={8} md={12} sm={12} xs={24} style={{marginBottom: 55}}>
        <Card
          bordered={false}
          hoverable={true}
          style={{ width: "100%", maxWidth: 290, marginTop: 100, paddingBottom: 35}}
          className={`product-card cardContainer ${
            product.quantity ? "has-quantity" : ''
          } ${othersPrice_status == "disabled" ? 'no-other-price' : product.description ? 'with-description' : ''} `}
        >
          <Row className="imageCard2">
            <div className="imageContainer">
              <Avatar
                shape="square"
                src={`${imagep}${product.file}`}
                className="avatar"
                // onClick={handleShowModal}
                onClick={() => handleShowModal(product)}
              />
            </div>
          </Row>
          
          <div>
            <div className="productNameText">{product.name}</div>
            <div className="descriptionText">{product.description}</div>
            <div className="productRateText">
              <span>SurePlus Price</span><br />
              {productRate}
            </div>
            <div className="othersPrice">
              {othersPrice_status == 'enabled' && mallPriceRate !== "" ? (
                <>
                <span>Others' Price</span><br />
                P {mallPriceRate}
                </>
              ): ''}
            </div>
          </div>

          <div className="stocksLeft">
            {parseInt(product.stock, 10) > 0 ? (
              <p className="stockTag">
                Stock:{" "}
                <CountDisplay
                  product={product}
                  count={
                    parseInt(product.stock, 10) - parseInt(product.quantity, 10)
                  }
                />
              </p>
            ) : (
              <div align="center">
                <p color="red" className="soldOutText">Sold Out</p>
              </div>
            )}
          </div>

          <div style={{textAlign: 'center', height: 25}}>
            {parseInt(product.quantity, 10)
              ? product.unit === "g"
                ? `Subtotal: Php ${parseFloat(
                    (product.price * product.quantity) / product.increment
                  ).toFixed(2)}`
                : `Subtotal: Php ${parseFloat(
                    product.price * product.quantity
                  ).toFixed(2)}`
              : ""}
            </div>

          <div>
            <QuantityButton
              product={product}
              quantityDisplay={
                <span
                  className="quantityDisplay"
                  style={{ padding: "10px 20px 10px 20px" }}
                >
                  {product.quantity}
                </span>
              }
              addOrder={addOrder}
            />
          </div>
        </Card>
      </Col>
    </>
  ) : (
    ""
  );
};

export default ProductCard;
