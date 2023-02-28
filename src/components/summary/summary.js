import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Tag,
  Divider,
  Col,
  Card,
  Row,
  Form,
  Input,
  Button,
  message,
  Typography,
} from "antd";
import { AppContext } from "../../shared/contexts/app.context";
import CountDisplay from "../count-display";
import "./summary.css";
import QuantityButton from "../product-card/quantity-button";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import Swal from "sweetalert2";

const { Text } = Typography;

const Summary = (showSummaryModal) => {
  const { database } = useContext(FirebaseContext);
  const {
    addOrder,
    orders,
    totalGoods,
    totalKilos,
    textBoxesSettings,
    totalShipping,
    totalProcessFee,
    handleCartSummary,
    redeemedEarnedPoints,
    discountInfo,
    setDiscountInfo,
  } = useContext(AppContext);
  const [discountCode, setDiscountCode] = useState();
  const [discountsList, setDiscountsList] = useState([]);
  const [discountsApplied, setDiscountsApplied] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    handleCartSummary();
    getDiscountsList();
  }, []);

  const getDiscountsList = () => {
    database
      .ref("discounts")
      .once("value")
      .then((snapshot) => {
        const appLocationObject = (snapshot && snapshot.val()) || {};

        const appLocationArray =
          (appLocationObject &&
            Object.entries(appLocationObject) &&
            Object.entries(appLocationObject).length &&
            Object.entries(appLocationObject).map((item) => {
              item[1].key = item[0];
              return item[1];
            })) ||
          [];

        setDiscountsList(appLocationArray);
      });
  };

  let orderSummary = "";
  if (textBoxesSettings && textBoxesSettings.order_summary) {
    orderSummary =
      textBoxesSettings.order_summary.status && textBoxesSettings.order_summary;
  }

  const validateMessages = {
    required: "Enter a valid discount code or gift card",
  };
  const onFinish = () => {
    // const discount_code = values.code;

    const disc = discountsList.find((e) => e.code === discountCode);

    if (disc !== undefined) {
      const dateEnd = new Date(disc.discount_end);
      const dateStart = new Date(disc.discount_start);
      const today = new Date();

      const date_limit_exceed = (dateEnd, td) => dateEnd < td;
      const date_limit_not_reach = (dateStart, td) => dateStart > td;

      // if date limit exceeded (if date_limit = 10/06 === today = 10/06 returns false)
      if (date_limit_exceed(dateEnd, today)) {
        Swal.fire({
          icon: "warning",
          title: "Voucher Expired",
          text: "You cannot use expired voucher.",
        });
        form.resetFields();
      } else {
        // if date limit did not reach
        if (date_limit_not_reach(dateStart, today)) {
          Swal.fire({
            icon: "warning",
            title: "Voucher Does Not Exist Yet",
            text: "You cannot use voucher when not in its date enabled.",
          });
          form.resetFields();
        } else {
          let totalSubtotal = 0;
          orders.find((e) => {
            totalSubtotal = totalSubtotal += parseInt(e.subtotal);
          });

          // if total subtotal is lesser than voucher invalid voucher
          if (totalSubtotal < disc.value) {
            Swal.fire({
              icon: "warning",
              title: "Voucher Invalid",
              text: "Voucher is greater than your subtotal.",
            });
            form.resetFields();
          } else {
            // if discount is disabled
            if (disc.discount_enable) {
              // if discount is percent
              if (disc.discount_type === "percent") {
                let per = disc.value;
                let totalDis = (totalGoods * per) / 100;
                disc.value = totalDis;
              }

              const discAlreadyApplied = discountsApplied.find(
                (e) => e.code === disc.code
              );

              // if voucher is already applied
              if (discAlreadyApplied !== undefined) {
                Swal.fire({
                  icon: "warning",
                  title: "Voucher Already Applied",
                  text: "You already applied this voucher",
                });
              } else {
                let discApp = [...discountsApplied];
                discApp.push(disc);

                // get total discount
                let totalDis = 0;
                discApp.map((e) => {
                  totalDis = totalDis += parseFloat(e.value);
                });

                // if total discounted price is greater than the subtotal of goods
                if (totalDis > totalSubtotal) {
                  Swal.fire({
                    icon: "warning",
                    title: "Voucher Invalid",
                    text: "Total voucher is greater than your subtotal.",
                  });
                  form.resetFields();
                } else {
                  setDiscountsApplied(discApp);
                  let disInfo = {
                    total_discount_value: totalDis,
                    discount_list: discApp,
                  };

                  // console.log(disInfo)
                  setDiscountInfo(disInfo);
                  message.success("Voucher Applied!");
                }
              }
            } else {
              Swal.fire({
                icon: "warning",
                title: "Voucher Disabled",
                text: "Voucher not currently active.",
              });
              form.resetFields();
            }
          }
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Not Found",
        text: "No voucher code found",
      });
      form.resetFields();
    }
  };

  const columns = [
    {
      title: "Item/Description",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price/Unit",
      key: "price",
      dataIndex: "price",
      render: (price, record) => (
        <Tag>
          Php {parseFloat(price).toFixed(2)} /{" "}
          {record.unit === "g"
            ? `${record.increment}${record.unit}`
            : record.unit}
        </Tag>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      // width: 150,
      render: (text, record) => (
        <div>
          <QuantityButton
            summaryShow={true}
            modalShow={true}
            product={record}
            quantityDisplay={
              <span className="quantityDisplay">{record.quantity}</span>
            }
            addOrder={addOrder}
          />
        </div>
      ),
    },
    {
      title: "Subtotal",
      key: "action",
      fixed: "right",
      align: "center",

      // width: 150,
      render: (text, record) => (
        <Tag className="summaryStockTag">
          <span className="summaryStockText">
            {record.unit === "g"
              ? `Php ${parseFloat(
                  (record.price * record.quantity) / record.increment
                ).toFixed(2)}`
              : `Php ${parseFloat(record.price * record.quantity).toFixed(2)}`}
          </span>
        </Tag>
      ),
    },
  ];

  return (
    <>
      <div className="sumContainer">
        <Row className="tableContainer">
          <Card
            className={`${
              showSummaryModal ? "summaryNoBorder" : "justifyText bordered"
            }`}
          >
            <h3 className="title">Order Summary</h3>
            <div>
              <span
                className="black"
                dangerouslySetInnerHTML={{ __html: orderSummary.message }}
              ></span>
            </div>
          </Card>
        </Row>
      </div>

      <div className="summaryContainer">
        <Row className="tableContainer">
          <Col
            className="bordered tableCol"
            span={16}
            xl={16}
            xxl={16}
            lg={16}
            md={16}
            sm={24}
            xs={24}
          >
            <div>
              <Table
                columns={columns}
                scroll={{ x: 500 }}
                size="middle"
                footer={false}
                dataSource={orders}
                pagination={false}
                summary={(orders) => {
                  return (
                    <>
                      <tr>
                        <td className="ant-table-cell"></td>
                        <th
                          colSpan={2}
                          style={{ textAlign: "right" }}
                          className="ant-table-cell"
                        >
                          TOTAL
                        </th>
                        <td
                          className="ant-table-cell ant-table-cell-fix-right ant-table-cell-fix-right-first"
                          style={{ position: "sticky", right: 0 }}
                        >
                          <h3 align="center">
                            Php
                            {/* {totalGoods < 1000
                              ? parseFloat(totalGoods + totalProcessFee + totalShipping).toFixed(2)
                              : parseFloat(totalGoods).toFixed(2)} */}
                            {parseFloat(totalGoods).toFixed(2)}
                          </h3>
                        </td>
                      </tr>
                    </>
                  );
                }}
              />
            </div>
          </Col>

          <Col span={7} xl={7} xxl={7} lg={7} md={7} sm={24} xs={24}>
            <Card className="bordered" style={{ padding: 24 }}>
              <Row>
                <Col span={15}>
                  <span className="totalCard">GOODS TOTAL</span>
                </Col>
                <Col span={9}>
                  <strong>Php {parseFloat(totalGoods).toFixed(2)}</strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={15}>
                  <span className="totalCard">
                    TOTAL WEIGHT <br /> (kgs)
                  </span>
                </Col>
                <Col span={9}>
                  <strong>
                    {parseFloat(totalKilos).toFixed(2)}{" "}
                    {parseInt(totalKilos, 10) > 1 ? `kgs` : `kg`}
                  </strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={15}>
                  <span className="totalCard">PACKING FEE</span>
                </Col>
                <Col span={9}>
                  <strong>
                    Php{" "}
                    {totalGoods < 1000
                      ? parseFloat(totalProcessFee).toFixed(2)
                      : 0}
                  </strong>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={15}>
                  <span className="totalCard">SHIPPING CHARGE</span>
                </Col>
                <Col span={9}>
                  <strong>
                    Php{" "}
                    {totalGoods < 1000
                      ? parseFloat(totalShipping).toFixed(2)
                      : 0}
                  </strong>
                </Col>
              </Row>
              <br />
              {redeemedEarnedPoints !== 0 ? (
                <>
                  <Row>
                    <Col span={15}>
                      <span className="totalCard">REDEEMED POINTS</span>
                    </Col>
                    <Col span={9}>
                      <strong>Php (-{parseFloat(redeemedEarnedPoints)})</strong>
                    </Col>
                  </Row>
                  <br />
                </>
              ) : null}
              <Row>
                <Col span={15}>
                  <span className="totalCard">DISCOUNT</span>
                </Col>
                <Col span={9}>
                  <strong>
                    Php{" "}
                    {discountInfo !== undefined
                      ? discountInfo.total_discount_value
                      : 0}
                  </strong>
                </Col>
                <Col span={24}></Col>
                {discountInfo !== undefined
                  ? discountInfo.discount_list.map((e, index) => (
                      <>
                        <Col span={15}>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            {e.name}
                          </Text>
                        </Col>
                        <Col span={9}>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            Php {e.value}
                          </Text>
                        </Col>
                      </>
                    ))
                  : ""}

                <Form form={form}>
                  <div style={{ marginTop: 20 }}>
                    <Row>
                      <Col span={15}>
                        <Form.Item
                          label=""
                          name="code"
                          rules={[
                            {
                              required: true,
                              message:
                                "Enter a valid discount code or gift card",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Discount Code"
                            onChange={(e) => setDiscountCode(e.target.value)}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={9}>
                        <Form.Item>
                          <Button onClick={onFinish} htmlType="submit">
                            Apply
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Row>
              <br />
              <div className="totalAmmount">
                <h1 className="totalText">
                  Php{" "}
                  {totalGoods < 1000
                    ? discountInfo !== undefined
                      ? parseFloat(
                          totalGoods +
                            totalProcessFee +
                            totalShipping -
                            redeemedEarnedPoints -
                            discountInfo.total_discount_value
                        ).toFixed(2)
                      : parseFloat(
                          totalGoods +
                            totalProcessFee +
                            totalShipping -
                            redeemedEarnedPoints
                        ).toFixed(2)
                    : discountInfo !== undefined
                    ? parseFloat(
                        totalGoods -
                          redeemedEarnedPoints -
                          discountInfo.total_discount_value
                      ).toFixed(2)
                    : parseFloat(totalGoods - redeemedEarnedPoints).toFixed(2)}
                </h1>
                <h1 className="totalSubText">TOTAL AMOUNT DUE</h1>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Summary;
