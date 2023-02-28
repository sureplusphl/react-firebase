import React, { useContext, useEffect } from "react";
import {
  Table,
  List,
  Divider,
  Card,
  Button,
  Popconfirm,
  Spin,
  message,
} from "antd";
import { Route, withRouter, Link } from "react-router-dom";
import moment from "moment-timezone";
import { OrderContext } from "../../shared/contexts/order.context";
import CsvDownload from "react-json-to-csv";
import { FirebaseContext } from "../../shared/contexts/firebase.context";

const OrderTable = ({ location }) => {
  const { database } = useContext(FirebaseContext);
  const {
    orderListColumns,
    filteredOrders,
    fetchOrders,
    getNewBatchInfo,
    ordersForCSV,
    generateNewBatch,
    batchInfo,
    orders,
    handleOnClickRow,
    filterProcessing,
    filterReady,
    filterOnTransit,
    filterDelivered,
    filterCancelled,
  } = useContext(OrderContext);

  useEffect(() => {
    getNewBatchInfo();
    fetchOrders();
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/orders/processing":
        filterProcessing();
        break;
      case "/orders/ready":
        filterReady();
        break;
      case "/orders/on-transit":
        filterOnTransit();
        break;
      case "/orders/delivered":
        filterDelivered();
        break;
      case "/orders/cancelled":
        filterCancelled();
        break;
      default:
      //
    }
  }, [orders, location]);

  const paymentConfirmed = (product) => {
    database
      .ref(`orders/${product.key}`)
      .update({ payment_status: "Payment Confirmed" })
      .then(() => {
        message.success("Payment Confirmed on orrder");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  return (
    <div>
      <Card
        type="inner"
        style={{ marginBottom: 20, backgroundColor: "#b5ecdd" }}
      >
        {batchInfo.token ? (
          <div>
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={generateNewBatch}
            >
              <Button type="primary" style={{ float: "right" }}>
                Renew Token
              </Button>
            </Popconfirm>
            <h3>Order Batch</h3>
            <div>
              Token: <strong>{batchInfo.token}</strong>
            </div>
            <div>
              Updated at:{" "}
              <em>{moment(batchInfo.date).format("MMM DD, YYYY hh:mm a")}</em>
            </div>
          </div>
        ) : (
          <div align="center">
            <Spin />
          </div>
        )}
      </Card>

      <Divider></Divider>
      <Route exact path="/orders/processing">
        <h1>New Orders for processing</h1>
      </Route>
      <Route exact path="/orders/ready">
        <h1>Ready</h1>
      </Route>
      <Route exact path="/orders/on-transit">
        <h1>On Transit</h1>
      </Route>
      <Route exact path="/orders/delivered">
        <h1>Delivered</h1>
      </Route>
      <Route exact path="/orders/cancelled">
        <h1>Cancelled Deliveries</h1>
      </Route>
      <CsvDownload
        className="ant-btn ant-btn-primary"
        type="button"
        data={ordersForCSV}
      />
      <Button type="primary" style={{ float: "right" }}>
        <Link to="/pdf">Generate Receipts</Link>
      </Button>
      <Divider></Divider>

      <Table
        expandable={{
          expandedRowRender: (product) => {
            const col = [
              {
                title: "Item",
                dataIndex: "name",
                key: "name",
                render: (text) => <strong>{text}</strong>,
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
                render: (text, record) => {
                  return `${text} ${record.unit}`;
                },
              },
              {
                title: "Weight",
                dataIndex: "kilo",
                key: "kilo",
                render: (text) => {
                  return `${parseFloat(text).toFixed(2)}kg`;
                },
              },
              {
                title: "Sub Total",
                dataIndex: "subtotal",
                key: "subtotal",
                render: (text) => {
                  return `Php ${text}`;
                },
              },
            ];

            const summary = [
              {
                label: "Total Goods",
                value: `Php ${product.total_goods}`,
              },
              {
                label: "Total Kilos",
                value: `${product.total_kilos}kg`,
              },
              {
                label: "Packing Fee",
                value: `Php ${
                  product.total_processFee
                    ? product.total_goods < 1000
                      ? product.total_processFee
                      : "0.00"
                    : "0.00"
                }`,
              },
              {
                label: "Total Shipping",
                value: `Php ${
                  product.total_goods < 1000 ? product.total_shipping : 0
                }`,
              },
              {
                label: "Redeemed Points",
                value: `Php - ${
                  product.total_redeemedPoints
                    ? product.total_redeemedPoints
                    : 0
                }`,
              },
              {
                label: "Discount",
                value: `Php - ${
                  product.discount ? product.discount.total_discount_value : 0
                }`,
              },
              {
                label: "Total Amount",
                value: `Php ${
                  product.total_goods < 1000
                    ? parseFloat(
                        parseFloat(
                          product.total_processFee
                            ? product.total_processFee
                            : 0,
                          10
                        ) +
                          parseFloat(product.total_shipping, 10) +
                          parseFloat(product.total_goods, 10) -
                          (product.total_redeemedPoints
                            ? parseFloat(product.total_redeemedPoints)
                            : 0) -
                          (product.discount
                            ? parseFloat(product.discount.total_discount_value)
                            : 0)
                      ).toFixed(2)
                    : parseFloat(
                        parseFloat(product.total_goods, 10) -
                          (product.total_redeemedPoints
                            ? parseFloat(product.total_redeemedPoints)
                            : 0) -
                          (product.discount
                            ? parseFloat(product.discount.total_discount_value)
                            : 0)
                      ).toFixed(2)
                }`,
              },
            ];

            return (
              <div style={{ margin: 10 }}>
                <Popconfirm
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => paymentConfirmed(product)}
                >
                  <Button
                    type="primary"
                    style={{ float: "left", marginBottom: "20px" }}
                  >
                    Payment Confirmed
                  </Button>
                </Popconfirm>
                <Divider orientation="left">Order Items</Divider>
                <Table
                  dataSource={product.items}
                  columns={col}
                  pagination={false}
                  style={{ margin: 10, border: "1px solid #cccccc" }}
                />
                <Divider orientation="left">Order Summary</Divider>
                <List
                  size="small"
                  style={{ margin: 10, border: "1px solid #cccccc" }}
                  dataSource={summary}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.label}
                        description={item.value}
                      />
                    </List.Item>
                  )}
                />
                <Divider orientation="left">Order Type</Divider>
                <p>{product.info.order_type}</p>
                <Divider orientation="left">Order Notes</Divider>
                <p>{product.info.order_notes}</p>
                <Divider orientation="left">Full Address</Divider>
                <p>{product.info.full_address}</p>
                <Divider orientation="left">Address Notes</Divider>
                <p>{product.info.address_notes}</p>
                <Divider orientation="left">Pickup Location</Divider>
                <p>{product.info.pickup_location}</p>

                <Divider orientation="left">Payment Method</Divider>
                <p>{product.payment_method}</p>
                <Divider orientation="left">COD Notes</Divider>
                <p>{product.cod_notes}</p>
                {/* <Divider orientation="left">Preferred Bank (If ever Bank Transfer)</Divider>
                <p>{product.prefer_bank}</p> */}
              </div>
            );
          },
        }}
        onRow={handleOnClickRow}
        dataSource={filteredOrders}
        columns={orderListColumns}
        pagination={{
          pageSize: 20,
        }}
      />
    </div>
  );
};

export default withRouter(OrderTable);
