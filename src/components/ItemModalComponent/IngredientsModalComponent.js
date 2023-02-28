import React, { useContext } from "react";
import { Modal, Row, Col, Button } from "antd";
import "./modal.css";
import Avatar from "antd/lib/avatar/avatar";
import { AppContext } from "../../shared/contexts/app.context";
import QuantityButton from "../product-card/quantity-button";
import CountDisplay from "../count-display";
import Steps from "./steps";
function IngredientsModalComponent({ show, onCancel, itemData, addOrder }) {
  const itemSteps = Steps.map((e, index) => {
    return (
      <div key={index} style={{ paddingTop: 20, paddingBottom: 20 }}>
        <p>Step {e.step}</p>
        <span>{e.text}</span>
      </div>
    );
  });

  return (
    parseInt(itemData.price, 10) && (
      <>
        <Modal
          visible={show}
          maskStyle={{ backgroundColor: "#ddd", opacity: 0.9 }}
          centered
          footer={false}
          closable={true}
          onCancel={onCancel}
          className="modalBody"
          width={876}
        >
          <div className="logo">
            <div className="notesModalLogo">
              <img src="assets/images/processed.jpeg" alt="" width="100%" />
            </div>
          </div>
          <div align="center" className="categoryTitleContainer">
            <span className="categoryTitle">
              {itemData?.product_category_name}
            </span>
          </div>

          <div className="notesModalBodyContainer">
            <Row>
              <Col
                span={12}
                xl={{ span: 12, order: 1 }}
                xxl={{ span: 12, order: 1 }}
                lg={{ span: 12, order: 1 }}
                md={{ span: 12, order: 1 }}
                sm={{ span: 24, order: 2 }}
                xs={{ span: 24, order: 2, height: 350 }}
                className="notesImageColContainer"
              >
                <div className="notesImageModalContainer">
                  <Avatar
                    shape="circle"
                    src={itemData.file}
                    className="modalAvatar"
                  >
                    <Avatar
                      shape="circle"
                      src={itemData.file}
                      className="modalAvatar"
                    />
                  </Avatar>
                </div>
              </Col>
              <Col
                span={12}
                xl={{ span: 12, order: 2 }}
                xxl={{ span: 12, order: 2 }}
                lg={{ span: 12, order: 2 }}
                md={{ span: 12, order: 2 }}
                sm={{ span: 24, order: 1 }}
                xs={{ span: 24, order: 1 }}
              >
                <div className="">
                  <div className="detailsContainer">
                    <h2 className="notesItemTitle" align="right">
                      {itemData.name}
                    </h2>
                    <br />
                    <span className="notesItemDescription">
                      {itemData.description}
                    </span>

                    <Row className="buttonContainer">
                      <Col span={12} className="buttonCol">
                        <div className="noteDetailsButton">
                          Stock: {itemData.stock}
                        </div>
                      </Col>
                      <Col span={12} className="buttonCol">
                        <div className="noteDetailsButton">
                          ₱ {itemData.price} / {itemData.unit}
                        </div>
                      </Col>
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
            </Row>
          </div>
          <div className="notesModalBodyContainer" >
            <Row className="ingNotesSteps">
                <Col
                  span={12}
                  offset={1}
                  xl={12}
                  xxl={12}
                  lg={12}
                  md={23}
                  sm={23}
                  xs={23}
                >
                  <div className="">
                    <h1 className="noteStepsTitle">How did we make it?</h1>
                    <span className="noteStepsSubText">
                      Steps to our delicious {itemData.name}
                    </span>
                    <br />
                    {itemSteps}
                  </div>
                </Col>
                <Col
                  span={11}
                  xl={11}
                  xxl={11}
                  lg={11}
                  md={24}
                  sm={24}
                  xs={24}
                  className="ingColContainer"
                >
                  <div className="ingContainer">

                  </div>



                </Col>
            </Row>
          </div>
        </Modal>
      </>
    )
  );
}

export default IngredientsModalComponent;
