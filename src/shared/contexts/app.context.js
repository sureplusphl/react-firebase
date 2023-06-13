import React, { createContext, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment-timezone";
import randomstring from "randomstring";
import { notification } from "antd";
import { FirebaseContext } from "./firebase.context";
import { AuthContext } from "./auth.context";
import { withRouter } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = ({ children, history, match }) => {
  const { auth, database } = useContext(FirebaseContext);
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const [current, setCurrent] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [trackingCode, setTrackingCode] = useState();
  const [mainProducts, setMainProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [areProductsLoaded, setAreProductsLoaded] = useState(false);
  const [agreement1, setAgreement1] = useState(false);
  // const [agreement2, setAgreement2] = useState(false);
  const [userEmail, setUserEmail] = useState();
  const [totalGoods, setTotalGoods] = useState(0);
  const [totalKilos, setTotalKilos] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [totalProcessFee, setTotalProcessFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [productReset, setProductReset] = useState({});
  const [batchInfo, setBatchInfo] = useState({ date: "", token: "" });
  const [shopStatus, setShopStatus] = useState();
  const [textBoxesSettings, setTextBoxesSettings] = useState([]);
  const [storeSureplus, setStoreSureplus] = useState([]);
  const [activeStore, setActiveStore] = useState("");
  const [storesCategories, setStoresCategories] = useState([]);
  const [earnedPointsColor, setEarnedPointsColor] = useState("gray");
  const [redeemedEarnedPoints, setRedeemedEarnedPoints] = useState(0);
  const [discountInfo, setDiscountInfo] = useState();
  const [discountsList, setDiscountsList] = useState([]);
  const [showShippingCharge, setShowShippingCharge] = useState(false);

  const initAuth = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        database.ref(`profiles/${user.uid}`).once("value", (snapshot) => {
          const profile = snapshot.val();
          if (profile) {
            setUserEmail(profile.email);
            setLoggedUser(profile);
            if (match.path === "/login") history.push("/profile");
          } else {
            if (match.path === "/login") history.push("/profile");
          }
        });
      }
    });
  };

  const sortByKey = (array, key) =>
    array.sort((a, b) => {
      const x = a[key].toLowerCase();
      const y = b[key].toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });

  const sortByNumAsc = (array, key) =>
    array.sort(function (a, b) {
      return a[key] - b[key];
    });

  useEffect(() => {
    initAuth();
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const fetchProducts = () => {
    setAreProductsLoaded(false);
    database.ref("products").on("value", (snapshot) => {
      if (snapshot.val()) {
        const productsObject = snapshot.val();
        let productsArray = Object.entries(productsObject).map((item) => {
          item[1].key = item[0];
          return item[1];
        });

        setMainProducts(productsArray);
        setAreProductsLoaded(true);
        setIsLoadingProducts(false);
        updateOrderStock();
      } else {
        setMainProducts([]);
        setAreProductsLoaded(true);
        setIsLoadingProducts(false);
      }
    });
  };

  useEffect(() => {
    const productsArray = mainProducts.map((product) => {
      let order = {};
      if (orders && orders.length) {
        order = _.find(orders, (order) => order.key === product.key);
      }
      product = { ...product, quantity: (order && order.quantity) || 0 };
      return product;
    });
    setProducts(sortByNumAsc(productsArray, "storecategory_order"));
  }, [orders, mainProducts]);

  useEffect(() => {
    setProductReset(products);
  }, [areProductsLoaded]);

  const updateProducts = (key, quantity) => {
    const updatedList = products.map((product) => {
      if (product.key === key) product = { ...product, quantity };
      return product;
    });
    setProducts(updatedList);
  };

  const updateProductStocks = ({ key, quantity, prevQuantity }) => {
    let productData = {};
    const product = mainProducts.find((prod) => prod.key === key);
    if (!product) return;
    productData[`products/${key}/stock`] =
      parseInt(product.stock, 10) - parseInt(quantity, 10);
    database.ref().update(productData);
  };

  const updateOrderStock = () => {
    products.map((product) => {
      const updatedOrders = orders.map((order) => {
        if (order.key === product.key) {
          order = { ...order, stock: product.stock };
        }
        return order;
      });
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return setOrders(updatedOrders);
    });
  };

  const getSubTotal = (order, quantity) => {
    switch (order.unit) {
      case "kg":
        return order.price * quantity;
      case "piece":
        return order.price * quantity;
      default:
        return (order.price * quantity) / order.increment;
    }
  };

  const addOrder = (order, quantity) => {
    if (typeof quantity !== "number") return;
    let orderList = orders;
    let selectedOrder = _.find(orders, (item) => item.key === order.key);
    const isUpdateOrderQuantity = selectedOrder && quantity;
    const isRemoveOrderQuantity = selectedOrder && quantity === 0;
    const isNewOrderQuantity = !selectedOrder && quantity;

    if (isUpdateOrderQuantity) {
      // _.remove(orderList, selectedOrder);
      selectedOrder = {
        ...selectedOrder,
        key: order.key,
        quantity,
        kilo:
          order.unit === "kg"
            ? quantity
            : order.unit === "piece" ||
              order.unit === "bundle" ||
              order.unit === "tray" ||
              order.unit === "set"
            ? order.kgPerPiece * quantity
            : quantity / 1000,

        subtotal: getSubTotal(order, quantity),
      };

      const index = orderList.findIndex((x) => x.key === order.key);

      orderList[index] = selectedOrder;
      setOrders([...orderList]);
      updateProducts(order.key, quantity);
      // updateProductStocks({ key: order.key, quantity });
    } else if (isRemoveOrderQuantity) {
      _.remove(orderList, selectedOrder);
      setOrders([...orderList]);
      updateProducts(order.key, quantity);
      // updateProductStocks({ key: order.key, quantity });
    } else if (isNewOrderQuantity) {
      orderList = [
        ...orderList,
        {
          ...order,
          key: order.key,
          quantity,
          kilo:
            order.unit === "kg"
              ? quantity
              : order.unit === "piece" ||
                order.unit === "bundle" ||
                order.unit === "tray" ||
                order.unit === "set"
              ? order.kgPerPiece * quantity
              : quantity / 1000,
          subtotal: getSubTotal(order, quantity),
        },
      ];
      setOrders([...orderList]);
      updateProducts(order.key, quantity);
      // updateProductStocks({ key: order.key, quantity });
    }

    localStorage.setItem("orders", JSON.stringify(orderList));
  };

  const getOrders = () => {
    if (localStorage.getItem("orders")) {
      setOrders(JSON.parse(localStorage.getItem("orders")));
      updateOrderStock();
    }
  };

  const copyQuantityFromOrdersToProducts = () => {
    const list = products.map((product) => {
      let order = { quantity: 0 };
      if (orders && orders.length) {
        order = _.find(orders, (order) => order.key === product.key);
      }
      product = { ...product, ...order };
      return product;
    });
    setProducts(list);
  };

  useEffect(() => {
    if (areProductsLoaded) {
      copyQuantityFromOrdersToProducts();
      handleCartSummary();
    }
  }, [orders, areProductsLoaded]);

  const handleCartSummary = () => {
    const sumGoods = _.sumBy(orders, (order) =>
      getSubTotal(order, order.quantity)
    );

    const getOrdersKPU = orders.map((order) => {
      let kgPerUnit_status = "";
      let ordersWithkg = [];
      database.ref("categories/" + order.store_id).on("value", (snapshot) => {
        if (snapshot.val()) {
          const keyVal = snapshot.val();
          kgPerUnit_status = keyVal.statusKgPerUnit;

          if (kgPerUnit_status == "enabled") {
            ordersWithkg = { ...order, statusKPU: "enabled" };
          }
        }
      });
      return ordersWithkg;
    });
    console.log(getOrdersKPU);
    const sumKilos = _.sumBy(getOrdersKPU, (order) => order.kilo);
    const final_sumKilos =
      sumKilos == null || sumKilos == undefined ? "0.00" : sumKilos;
    setTotalKilos(final_sumKilos);
    setTotalGoods(sumGoods);

    // const a = (sumKilos / 5) * 50;
    // const b = Math.ceil(sumKilos / 5) * 50;

    // if (sumKilos <= 5) {
    //   setTotalShipping(0);
    //   if (sumKilos > 0) setTotalShipping(75);
    // } else {
    //   setTotalShipping(sumKilos % 5 === 0 ? a : b);
    // }

    setTotalShipping(shopStatus.del_fee);
    setTotalProcessFee(shopStatus.process_fee);
  };

  const getBatchInfo = () => {
    database.ref(`batch`).on("value", (snapshot) => {
      setBatchInfo(snapshot.val());
    });
  };

  const getShopStatus = () => {
    database
      .ref("shop_status")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setShopStatus(snapshot.val());
        }
      });
  };

  const getShopTextBoxesSettings = () => {
    database
      .ref("text_boxes_settings")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setTextBoxesSettings(snapshot.val());
        }
      });
  };

  useEffect(() => {
    getShopStatus();
    getShopTextBoxesSettings();
    getOrders();
    fetchProducts();
    getBatchInfo();
    setTrackingCode(randomstring.generate({ length: 5, charset: "numeric" }));
    getDiscountsList();
  }, []);

  useEffect(() => {
    if (batchInfo.token) {
      const saveBatchInfo = localStorage.getItem("batchToken");
      if (!saveBatchInfo) {
        localStorage.setItem("batchToken", batchInfo.token);
        localStorage.setItem("orders", "");
      } else if (saveBatchInfo !== batchInfo.token) {
        localStorage.setItem("batchToken", batchInfo.token);
        localStorage.setItem("orders", "");
        notification.open({
          message: "We have updated the products.",
          description:
            "We have detected that the products you have are outdated. We will reload this page and reset your cart. Please select again with the available products.",
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }, [batchInfo]);

  const completeOrder = () => {
    orders.map((order) => {
      updateProductStocks({ key: order.key, quantity: order.quantity });
    });
    setIsSubmitting(false);
    setIsOrderComplete(true);
    setOrders([]);
    localStorage.removeItem("orders");
    next();
  };

  const calculateProductStocks = () => {};

  const fetchStoresCategory = () => {
    const dbRef = database.ref("categories");
    dbRef.on("value", (snapshot) => {
      const result = snapshot.val();

      const response = Object.keys(result).map((e, index) => {
        if (index === 0) {
          // setActiveStore(e);
          setActiveStore("");
        }
        result[e].key = e;
        return result[e];
      });

      setStoresCategories(sortByNumAsc(response, "store_category_order"));
      // setStoresCategories(sortByKey(response, "name"));
    });
  };

  const fetchStoreSureplus = () => {
    database
      .ref("categories")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setStoreSureplus(snapshot.val());
        }
      });
  };

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

  const submitOrder = (deliveryData) => {
    setIsSubmitting(true);

    // set customer info regardless if he/she is logged in
    let customer_info = { ...deliveryData, user_email: userEmail };
    localStorage.setItem("edit_customer_info", JSON.stringify(customer_info));

    const newList = {
      tracking_code: trackingCode,
      status: "processing",
      items: orders,
      total_goods: parseFloat(totalGoods).toFixed(2),
      total_processFee: parseFloat(totalProcessFee).toFixed(2),
      total_shipping: parseFloat(totalShipping).toFixed(2),
      total_redeemedPoints: parseFloat(redeemedEarnedPoints).toFixed(2),
      total_kilos: parseFloat(totalKilos).toFixed(2),
      info: { ...deliveryData, user_email: userEmail },
      ordered_at: moment().tz("Asia/Manila").format("MMM DD, YYYY h:mm a"),
      payment_method: deliveryData.payment_method,
      cod_notes: deliveryData.cod_notes,
      discount: discountInfo ? discountInfo : "",
      // prefer_bank: deliveryData.prefer_bank,
    };
    calculateProductStocks();

    const orderKey = database.ref().child("orders").push().key;

    //***************************************
    //  if redeemed points
    if (loggedUser && redeemedEarnedPoints > 0) {
      let key = loggedUser.uid;
      let newPoints =
        parseFloat(loggedUser.points) - parseFloat(redeemedEarnedPoints);

      let user_points_hist = new Array();
      user_points_hist = loggedUser.points_history
        ? loggedUser.points_history
        : [];
      let hist = {
        points_redeemed: redeemedEarnedPoints,
        points_total: newPoints,
        date: moment().tz("Asia/Manila").format("MMM DD, YYYY h:mm a"),
        order_id: orderKey,
      };
      user_points_hist.push(hist);

      loggedUser.points = newPoints;
      loggedUser.points_history = user_points_hist;

      let userInfo = {};
      userInfo[`profiles/${key}`] = loggedUser;
      database.ref().update(userInfo);
    }
    // ************************************

    let orderInfo = {};
    orderInfo[`orders/${orderKey}`] = newList;
    database
      .ref()
      .update(orderInfo)
      .then(() => {
        if (loggedUser) {
          let userInfo = {};

          if (loggedUser.$) {
            let key = loggedUser.uid;

            let loggedUser_notReg = {};
            let user_points_hist = new Array();
            user_points_hist = loggedUser_notReg.points_history
              ? loggedUser_notReg.points_history
              : [];
            let hist = {
              points_earned: deliveryData.points_earned,
              points_total: deliveryData.points_total,
              date: moment().tz("Asia/Manila").format("MMM DD, YYYY h:mm a"),
              order_id: orderKey,
            };
            user_points_hist.push(hist);

            loggedUser_notReg.points = deliveryData.points_total;
            loggedUser_notReg.points_history = user_points_hist;
            loggedUser_notReg.uid = key;
            loggedUser_notReg.email = loggedUser.email;

            userInfo[`profiles/${key}`] = loggedUser_notReg;
          } else {
            let key = loggedUser.uid;
            let user_points_hist = new Array();
            user_points_hist = loggedUser.points_history
              ? loggedUser.points_history
              : [];
            let hist = {
              points_earned: deliveryData.points_earned,
              points_total: deliveryData.points_total,
              date: moment().tz("Asia/Manila").format("MMM DD, YYYY h:mm a"),
              order_id: orderKey,
            };
            user_points_hist.push(hist);

            loggedUser.points = deliveryData.points_total;
            loggedUser.points_history = user_points_hist;

            userInfo[`profiles/${key}`] = loggedUser;
          }

          database
            .ref()
            .update(userInfo)
            .then(() => {
              if (discountInfo) {
                discountInfo.discount_list.map((dis, index) => {
                  const listDis = discountsList.find((e) => e.key === dis.key);

                  // deduct 1 on balance per discount
                  listDis.balance = parseInt(listDis.balance - 1);
                  let updates = {};
                  updates["discounts/" + listDis.key] = listDis;

                  database
                    .ref()
                    .update(updates)
                    .then(() => {
                      completeOrder();
                    });
                });
              } else {
                completeOrder();
              }
            });
        } else {
          if (discountInfo) {
            discountInfo.discount_list.map((dis, index) => {
              const listDis = discountsList.find((e) => e.key === dis.key);

              // deduct 1 on balance per discount
              listDis.balance = parseInt(listDis.balance - 1);
              let updates = {};
              updates["discounts/" + listDis.key] = listDis;

              database
                .ref()
                .update(updates)
                .then(() => {
                  completeOrder();
                });
            });
          } else {
            completeOrder();
          }
        }
      });
  };

  const payload = {
    handleCartSummary,
    isLoadingProducts,
    isOrderComplete,
    setAgreement1,
    totalProcessFee,
    totalShipping,
    textBoxesSettings,
    // setAgreement2,
    isSubmitting,
    setUserEmail,
    trackingCode,
    submitOrder,
    agreement1,
    totalGoods,
    setTotalGoods,
    totalKilos,
    // agreement2,
    setCurrent,
    userEmail,
    shopStatus,
    addOrder,
    products,
    current,
    orders,
    fetchStoreSureplus,
    storeSureplus,
    fetchStoresCategory,
    storesCategories,
    activeStore,
    setActiveStore,
    next,
    prev,
    setTotalShipping,
    setEarnedPointsColor,
    earnedPointsColor,
    setRedeemedEarnedPoints,
    redeemedEarnedPoints,
    discountInfo,
    setDiscountInfo,
    showShippingCharge,
    setShowShippingCharge,
  };

  return <AppContext.Provider value={payload}>{children}</AppContext.Provider>;
};

AppProvider.defaultProps = {};

AppProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default withRouter(AppProvider);
