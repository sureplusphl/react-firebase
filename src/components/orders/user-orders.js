import React, { useState, useContext, useEffect } from "react";
import { Table, Tag, Divider, List } from "antd";
import moment from "moment-timezone";
import _ from "lodash";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import "./style.css";

const UserOrders = () => {
  const { database } = useContext(FirebaseContext);
  const { loggedUser } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {

    if(loggedUser.email) {

      database
      .ref("orders")
      .orderByChild("info/user_email")
      .equalTo(loggedUser.email)
      .on("value", (snapshot) => {
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
        ordersArray = _.sortBy(ordersArray, ["ordered_at"], ["desc"]);
        setOrders(ordersArray);
      });
      
    }
    else {
      setOrders([]);
    }
    
  };

  const orderListColumns = [
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (text) => <Tag color="green">{text}</Tag>,
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
    // {
    //   title: "Customer Name",
    //   dataIndex: "info",
    //   key: "full_name",
    //   render: (text) => <div>{(text && text.full_name) || ""}</div>,
    // },
    // {
    //   title: "Customer Phone",
    //   dataIndex: "info",
    //   key: "phone",
    //   render: (text) => (
    //     <div>
    //       <a href={`tel:${text.phone}`}>{(text && text.phone) || ""}</a>
    //     </div>
    //   ),
    // },
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
  ];
  return (
    <Table
      title={() => <h1>My Orders</h1>}
      scroll={{ x: 500 }}
      className="usertbl"
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
              label: "Total Shipping",
              value: `Php ${
                product.total_goods < 1000 ? product.total_shipping : 0
              }`,
            },
            {
              label: "Discount",
              value: `Php ${
                product.total_goods >= 1000 ? product.total_shipping : 0
              }`,
            },
            {
              label: "Total Amount",
              value: `Php ${
                product.total_goods < 1000
                  ? parseFloat(
                      parseInt(product.total_shipping, 10) +
                        parseInt(product.total_goods, 10)
                    ).toFixed(2)
                  : parseFloat(parseInt(product.total_goods, 10)).toFixed(2)
              }`,
            },
          ];

          return (
            <div style={{ margin: 10 }}>
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
              <Divider orientation="left">Order Notes</Divider>
              <p>{product.info.order_notes}</p>
              <Divider orientation="left">Address Notes</Divider>
              <p>{product.info.address_notes}</p>
            </div>
          );
        },
      }}
      dataSource={orders}
      columns={orderListColumns}
      pagination={{
        pageSize: 6,
      }}
    />
  );
};

export default UserOrders;
