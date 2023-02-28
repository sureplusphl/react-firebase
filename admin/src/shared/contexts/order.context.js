import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Modal, message, Tag, Button } from "antd";
import moment, { now } from "moment-timezone";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { FirebaseContext } from "./firebase.context";

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState();
  const [isShowOrderFormModal, setIsShowOrderFormModal] = useState(false);
  const [batchInfo, setBatchInfo] = useState({ date: "", token: "" });
  const [selectedOrder, setSelectedOrder] = useState({});
  const [ordersForCSV, setordersForCSV] = useState();
  const editOrder = (order) => {
    setSelectedOrder(order);
    showOrderFormModal();
  };

  const showOrderFormModal = () => {
    setIsShowOrderFormModal(true);
  };

  const closeOrderFormModal = () => {
    setSelectedOrder({});
    setIsShowOrderFormModal(false);
    Modal.destroyAll();
  };

  const handleOnClickRow = (record, rowIndex) => ({
    onClick: () => editOrder(record),
  });

  const processCsvData = (data) => {
    const csvData = data.map((order) => {
      const orders = _.keyBy(
        order.items.map((item) => ({
          key: `${item.name} (Php ${item.price}/${
            item.unit === "g" ? `${item.increment}${item.unit}` : item.unit
          })`,
          unit: item.unit,
          quantity: item.quantity,
        })),
        "key"
      );

      let orderList = [];
      for (const [key, order] of Object.entries(orders)) {
        orderList[key] =
          order.unit === "g" ? order.quantity / 1000 : order.quantity;
      }

      return {
        ...{
          "Full Name": order.info.full_name.replace(/,/g, " "),
          "Mobile Number": order.info.phone.replace(/,/g, " "),
          "Other mobile number": order.info.other_phone,
          Email: order.info.user_email,
          "Payment Method": order.payment_method,
          "COD Notes": order.cod_notes,
          // "Preferred Bank": order.prefer_bank,
          "Total Goods (Php)": order.total_goods,
          "Total Weight (Kg)": order.total_kilos,
          "Delivery Cost based on weight (Php)": order.total_goods > 1000 ? 0 : order.total_shipping,
          Discount: order.total_goods < 1000 ? 0 : 0,
          "Total Cost (Php)":
            order.total_goods < 1000
              ? parseFloat(
                  parseFloat(order.total_goods) +
                    parseFloat(order.total_shipping)
                ).toFixed(2)
              : parseFloat(parseFloat(order.total_goods)).toFixed(2),
          Claimables: 0,
          "Tracking Code": order.tracking_code,
          "Order Notes": order.info.order_notes.replace(/,/g, " "),
          "Full Address": order.info.full_address.replace(/,/g, " "),
          "Address Notes": order.info.address_notes.replace(/,/g, " "),
          "Ordered at": order.ordered_at,
        },
        ...orderList,
      };
    });
    setordersForCSV(csvData);
  };

  const fetchOrders = () => {
    database.ref("orders").on("value", (snapshot) => {
      const ordersObject = (snapshot && snapshot.val()) || {};
      let ordersArray =
        (ordersObject &&
          Object.entries(ordersObject) &&
          Object.entries(ordersObject).length &&
          Object.entries(ordersObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];
      // ordersArray = _.sortBy(ordersArray, ["ordered_at"], ["desc"]);
      ordersArray = ordersArray.sort((a, b) => new Date(b.ordered_at) - new Date(a.ordered_at));
      setOrders(ordersArray);
    });
  };

  const filterProcessing = () => {
    const filtered =
      (orders &&
        orders.length &&
        orders.filter((order) => {
          return order.status === "processing";
        })) ||
      [];
    processCsvData(filtered);
    setFilteredOrders(filtered);
  };

  const filterReady = () => {
    const filtered = orders.filter((order) => order.status === "ready");
    console.log(filtered);
    processCsvData(filtered);
    setFilteredOrders(filtered);
  };

  const filterOnTransit = () => {
    const filtered =
      (orders &&
        orders.length &&
        orders.filter((order) => order.status === "on_transit")) ||
      [];
    processCsvData(filtered);
    setFilteredOrders(filtered);
  };

  const filterDelivered = () => {
    const filtered =
      (orders &&
        orders.length &&
        orders.filter((order) => order.status === "delivered")) ||
      [];
    processCsvData(filtered);
    setFilteredOrders(filtered);
  };

  const filterCancelled = () => {
    const filtered =
      (orders &&
        orders.length &&
        orders.filter((order) => order.status === "cancelled")) ||
      [];
    processCsvData(filtered);
    setFilteredOrders(filtered);
  };

  const markReadyForDelivery = (product) => {
    database
      .ref(`orders/${product.key}`)
      .update({ status: "ready" })
      .then(() => {
        message.success("Order has been moved to Ready");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const markDelivered = (product) => {
    database
      .ref(`orders/${product.key}`)
      .update({ status: "delivered" })
      .then(() => {
        message.success("Order has been moved to Delivered");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const orderListColumns = [
    {
      title: "",
      key: "number",
      dataIndex: "tracking_code",
      render: (text, index) => index,
    },
    {
      title: "Tracking Code",
      dataIndex: "tracking_code",
      key: "tracking_code",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    // {
    //   title: "Address",
    //   dataIndex: "info",
    //   key: "full_address",
    //   render: (text) => <div>{(text && text.full_address) || ""}</div>,
    // },
    {
      title: "Customer Name",
      dataIndex: "info",
      key: "full_name",
      render: (text) => <div>{(text && text.full_name) || ""}</div>,
    },
    {
      title: "Customer Phone",
      dataIndex: "info",
      key: "phone",
      render: (text) => (
        <div>
          <a href={`tel:${text.phone}`}>{(text && text.phone) || ""}</a>
        </div>
      ),
    },
    {
      title: "Date of order",
      dataIndex: "ordered_at",
      key: "ordered_at",
      sortBy: "asc",
      render: (text) => {
        return text
          ? moment(text).tz("Asia/Manila").format("MMM DD, YYYY h:mm a")
          : "";
      },
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (text, index) => text,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (text, index) => text,
    },
    {
      key: "actions",
      render: (text, product) => {
        switch (product.status) {
          case "processing":
            return (
              <Button
                type="primary"
                style={{ float: "right" }}
                onClick={() => markReadyForDelivery(product)}
              >
                For Delivery
              </Button>
            );
          case "ready":
            return (
              <Button
                type="primary"
                style={{ float: "right" }}
                onClick={() => markDelivered(product)}
              >
                Mark as Delivered
              </Button>
            );
          default:
        }
      },
    },
  ];

  const generateNewBatch = () => {
    const date = moment.tz("Asia/Manila").format().toString();
    database
      .ref(`batch`)
      .set({ token: uuidv4(), date })
      .then(() => {
        message.success("Batch token updated");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const getNewBatchInfo = () => {
    database.ref(`batch`).on("value", (snapshot) => {
      setBatchInfo(snapshot.val());
    });
  };

  const payload = {
    orderListColumns,
    handleOnClickRow,
    generateNewBatch,
    batchInfo,
    filterProcessing,
    getNewBatchInfo,
    filterDelivered,
    filterOnTransit,
    filterCancelled,
    filteredOrders,
    ordersForCSV,
    filterReady,
    fetchOrders,
    orders,
  };

  return (
    <OrderContext.Provider value={payload}>{children}</OrderContext.Provider>
  );
};

OrderProvider.defaultProps = {};

OrderProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default withRouter(OrderProvider);
