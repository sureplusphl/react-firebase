import React, { useContext } from "react";
import { Modal, Row, Col, Button, Avatar } from "antd";
import "./modal.css";
// import Avatar from "antd/lib/avatar/avatar";
import { AppContext } from "../../shared/contexts/app.context";
import QuantityButton from "../product-card/quantity-button";
import CountDisplay from "../count-display";
import Steps from "./steps";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
function NotesModalComponent({ show, onCancel, itemData, addOrder }) {
  // const itemSteps = Steps.map((e, index) => {
  //   return (
  //     <div key={index} style={{ paddingTop: 20, paddingBottom: 20 }}>
  //       <p>Step {e.step}</p>
  //       <span>{e.text}</span>
  //     </div>
  //   );
  // });

  const { database } = useContext(FirebaseContext);
  const storeId = itemData.store_id;
  let othersPrice_status = '';
  database.ref("categories/" + storeId).on("value", (snapshot) => {
    if (snapshot.val()) {
      const keyVal = snapshot.val();
      othersPrice_status = keyVal.statusOthersPrice;
    }
  });
  const mallPriceRate = `₱ ${itemData.mall_price}`;

  return (
    parseInt(itemData.price, 10) && (
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

          <div className="notesModalBodyContainer">
            <Row>
              <Col
                span={12}
                xl={{ span: 24, order: 1 }}
              >
                <h2 className="notesItemTitle" style={{textAlign:'center'}}>
                  {itemData.name}
                </h2>
              </Col>
              
              <Col
                span={12}
                xl={{ span: 12, order: 1 }}
                xxl={{ span: 12, order: 1 }}
                lg={{ span: 12, order: 1 }}
                md={{ span: 24, order: 1 }}
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
                md={{ span: 24, order: 2 }}
                sm={{ span: 24, order: 1 }}
                xs={{ span: 24, order: 1 }}
              >
                <div className="">
                  <div className="detailsContainer">
                    <Row className="buttonContainer">
                      <Col span={24} className="buttonCol">
                        <div className="noteDetailsButton">
                          <Col span={12} style={{textAlign: 'left'}}>
                            SurePlus Price:
                          </Col>
                          <Col span={12} style={{textAlign: 'right'}}>
                            ₱ {itemData.price} / {itemData.unit}
                          </Col>
                        </div>
                      </Col>
                      {othersPrice_status == 'enabled' ? (
                        <Col span={24} className="buttonCol">
                          <div className="noteDetailsButton">
                            <Col span={12} style={{textAlign: 'left'}}>
                              Others' Price
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              {mallPriceRate}
                            </Col>
                          </div>
                        </Col>) : 
                      null}
                      <Col span={24} className="buttonCol">
                        <div className="noteDetailsButton">
                          <Col span={12} style={{textAlign: 'left'}}>
                            Stock:
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

                    <Row className="buttonContainer">
                      <Col span={20} className="buttonCol">
                        <div className="detailsButton" style={{minWidth:'250px', 
                            background:'#ffffff', boxShadow:'0px 0px 10px rgba(0, 0, 0, 0.25)', paddingLeft:20, paddingRight:20}}>
                          <Col span={12} style={{textAlign: 'left'}}>
                            Subtotal
                            </Col>
                          <Col span={12} style={{textAlign: 'right'}}>
                            {parseInt(itemData.quantity, 10)
                              ? itemData.unit === "g"
                                ? `₱ ${parseFloat(
                                  (itemData.price * itemData.quantity) / itemData.increment
                                ).toFixed(2)}`
                                : `₱ ${parseFloat(
                                  itemData.price * itemData.quantity
                                ).toFixed(2)}`
                              : ""}
                          </Col>
                        </div>
                      </Col>
                    </Row>


                    <Row className='buttonContainer notesAddMinus'>
                      <Col span={20}>
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
                      </Col>
                    </Row>
                    

                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="notesSteps">
                  <h1 className="noteStepsTitle">NOTES:</h1>
                  <span className="noteStepsSubText">
                    {itemData.notes}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    )
  );
}

export default NotesModalComponent;
