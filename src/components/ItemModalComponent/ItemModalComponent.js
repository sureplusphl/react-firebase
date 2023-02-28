import React, { useContext } from "react";
import { Modal, Row, Col, Button, Tag, Avatar, Divider } from "antd";
import "./modal.css";
import { AppContext } from "../../shared/contexts/app.context";
import QuantityButton from "../product-card/quantity-button";
import CountDisplay from "../count-display";
import { FirebaseContext } from "../../shared/contexts/firebase.context";


function ItemModalComponent({ show, onCancel, itemData, addOrder }) {
  const { database } = useContext(FirebaseContext);

  const productRate = `₱ ${itemData.price} / ${
    itemData.unit === "g" ? `${itemData.increment}${itemData.unit}` : itemData.unit
    }`;


  const storeId = itemData.store_id;
  let othersPrice_status = '';
  database.ref("categories/" + storeId).on("value", (snapshot) => {
    if (snapshot.val()) {
      const keyVal = snapshot.val();
      othersPrice_status = keyVal.statusOthersPrice;
    }
  });

  const mallPriceRate = `₱ ${itemData.mall_price}`;

  const imagep =
    itemData.file.substring(0, 5) == "https" ? "" : "/assets/images/";

  return parseInt(itemData.price, 10) && (
    <>
      <Modal
        visible={show}
        // maskStyle={{ backgroundColor: "#ddd", opacity: 0.9 }}
        centered
        footer={false}
        closable={true}
        onCancel={onCancel}
        className="modalBody"
        width={876}
      >
        {/* <div className="logo">
          <div className="modalLogo">
            <img src="assets/images/processed.jpeg" alt="" width="100%" />
          </div>
        </div> */}
        <div align="center" className="categoryTitleContainer">
          <span className="categoryTitle">
            {itemData?.product_category_name}
          </span>
        </div>

        <div className="modalBodyContainer">
          <Row>
            <Col span={12} offset={1} xl={12} xxl={12} lg={12} md={12} sm={23} xs={23}>
              <div className="detailsColContainer">
                <div className="detailsContainer">
                  <h2 className="itemTitle"> {itemData.name}</h2>
                  <br />

                  {itemData.description ? (
                    <p className="itemDescription">
                      {itemData.description}
                    </p>
                  ) : null
                  }

                  <Row className="buttonContainer">
                    <div>
                      <Row>
                        <Col span={24} className="buttonCol">
                          <div className="detailsButton">
                            <Col span={12} style={{textAlign: 'left'}}>
                              SurePlus Price
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              {productRate}
                            </Col>
                          </div>
                        </Col>
                      </Row>
                      {othersPrice_status == 'enabled' ? (<Row>
                        <Col span={24} className="buttonCol">
                          <div className="detailsButton">
                            <Col span={12} style={{textAlign: 'left'}}>
                              Others' Price
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              {mallPriceRate}
                            </Col>
                          </div>
                        </Col>
                      </Row>) : null}
                      <Row>
                        <Col span={24} className="buttonCol">
                          <div className="detailsButton">
                            <Col span={12} style={{textAlign: 'left'}}>
                              Stock
                              </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              <CountDisplay
                                product={itemData}
                                count={
                                  parseInt(itemData.stock, 10) - parseInt(itemData.quantity, 10)
                                }
                              />
                            </Col>
                          </div>
                        </Col>
                      </Row>


                      <Row>
                        <Col span={24} className="buttonCol">
                          <div className="detailsButton">
                            <Col span={12} style={{textAlign: 'left'}}>
                              Subtotal
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              {
                                
                                parseInt(itemData.quantity, 10) ? (
                                  
                                  parseInt(itemData.quantity, 10)
                                    ? itemData.unit === "g"
                                      ? `₱ ${parseFloat(
                                        (itemData.price * itemData.quantity) / itemData.increment
                                      ).toFixed(2)}`
                                      : `₱ ${parseFloat(
                                        itemData.price * itemData.quantity
                                      ).toFixed(2)}`
                                    : ""
                                  
                                ) : ""
                              
                              }
                             </Col>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Row>

                  <QuantityButton
                    modalShow={true}
                    product={itemData}
                    quantityDisplay={
                      <span
                        className="quantityDisplay"
                        style={{ padding: "10px 20px 10px 20px" }}
                      >
                        {itemData.quantity}
                      </span>
                    }
                    addOrder={addOrder}
                  />

                </div>
              </div>
            </Col>
            <Col span={11} xl={11} xxl={11} lg={11} md={11} sm={24} xs={24} className="imageColContainer">
              <div className="imageModalContainer">
                <Avatar
                  shape="circle"
                  src={`${imagep}${itemData.file}`}
                  className="modalAvatar"
                >
                  <Avatar
                    shape="circle"
                    src={`${imagep}${itemData.file}`}
                    className="modalAvatar"
                  />
                </Avatar>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
}

export default ItemModalComponent;
