import React, { useContext, useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Typography,
  Form,
  Button,
  message,
  Radio,
  Switch,
} from "antd";
import * as EmailValidator from "email-validator";
import { CaretLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { AppContext } from "../../shared/contexts/app.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import { useParams, Link } from "react-router-dom";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import "./delivery.css";

const { TextArea } = Input;
const { Title } = Typography;

const DeliveryInfoComponent = () => {
  const { database } = useContext(FirebaseContext);
  const [form] = Form.useForm();
  const { id } = useParams(); // on shop/:id
  const {
    submitOrder,
    setCurrent,
    setTotalShipping,
    shopStatus,
    totalGoods,
    setTotalGoods,
    setEarnedPointsColor,
    earnedPointsColor,
    setRedeemedEarnedPoints,
    redeemedEarnedPoints,
    showShippingCharge,
  } = useContext(AppContext);
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [bankSettings, setBankSettings] = useState([]);
  const [gcashClass, setGcashClass] = useState(false);
  const [paymayaClass, setPaymayaClass] = useState(false);
  const [bankClass, setBankClass] = useState(false);
  const [codClass, setCodClass] = useState(false);
  const [screenSize, setScreenSize] = useState("");
  const [hasBanks, setHasBanks] = useState();
  const [orderType, setOrderType] = useState("regular_delivery");

  useEffect(() => {
    getPayment();
    getBankSettings();
    setOrderType(showShippingCharge ? "regular_delivery" : "pickup");
  }, [setOrderType]);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const onFinishFailed = () => {
    message.error("Please fill all the required fields");
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const { setUserEmail, userEmail } = useContext(AppContext);
  const { loggedUser } = useContext(AuthContext);
  const validateEmail = (e) => {
    const email = e.target.value;
    if (EmailValidator.validate(email)) {
      setUserEmail(email);
    } else {
      setUserEmail();
    }
  };
  useEffect(() => {
    setScreenSize(window.innerWidth);

    if (
      localStorage.getItem("edit_customer_info") !== null &&
      localStorage.getItem("edit_customer_info") !== ""
    ) {
      var cus_info = JSON.parse(localStorage.getItem("edit_customer_info"));
    }

    if (loggedUser && loggedUser.email) {
      if (cus_info) {
        setUserEmail(cus_info["user_email"]);
      } else {
        setUserEmail(loggedUser.email || "");
      }
    } else {
      if (cus_info) {
        setUserEmail(cus_info["user_email"]);
      } else {
        setUserEmail("");
      }
    }
  }, [loggedUser]);

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  const radioStylePickupLoc = {
    display: "block",
    lineHeight: "30px",
    whiteSpace: "normal",
    marginBottom: "13px",
  };

  const getPayment = () => {
    database
      .ref("bank")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setHasBanks(true);
        } else {
          setHasBanks(false);
        }
      });
  };

  const onChangeOrderType = (e) => {
    setOrderType(e.target.value);
    if (e.target.value == "pickup") {
      setTotalShipping(0);
    }
    if (e.target.value == "sameday_delivery") {
      setTotalShipping(shopStatus.del_fee + 50);
    }
    if (e.target.value == "regular_delivery") {
      setTotalShipping(shopStatus.del_fee);
    }
  };

  const saveInfo = () => {
    form.validateFields().then((data) => {
      if (!data) return;

      // add points to customer who login upon ordering
      let points_earned = 0,
        points_before = 0,
        points_total = 0;
      if (loggedUser) {
        let old_points = loggedUser.points
          ? redeemedEarnedPoints > 0
            ? 0
            : loggedUser.points
          : 0;
        let cus_points = Math.floor(totalGoods / 200);
        let total_points = parseFloat(old_points) + parseFloat(cus_points);

        points_earned = cus_points;
        points_before = old_points;
        points_total = total_points;
      }

      if ({ id } !== null && { id } !== "") {
        data.depBank = data.depBank ? data.depBank : "";
        data.full_address = data.full_address ? data.full_address : "";
        data.address_notes = data.address_notes ? data.address_notes : "";
        data.pickup_location = data.pickup_location ? data.pickup_location : "";
        data.points_earned = points_earned;
        data.points_before = points_before;
        data.points_total = points_total;

        submitOrder(data, { id });
      } else {
        data.depBank = data.depBank ? data.depBank : "";
        data.full_address = data.full_address ? data.full_address : "";
        data.address_notes = data.address_notes ? data.address_notes : "";
        data.pickup_location = data.pickup_location ? data.pickup_location : "";
        data.points_earned = points_earned;
        data.points_before = points_before;
        data.points_total = points_total;

        submitOrder(data);
      }
    });
  };

  let bankArray = [];

  const getBankSettings = () => {
    database
      .ref("bank")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setBankSettings(snapshot.val());
        }
      });

    if (bankSettings) {
      bankArray = Object.entries(bankSettings).map((item) => {
        item[1].key = item[0];
        return item[1];
      });
    }
  };

  const radiobtn = (e) => {
    // console.log("radio checked", e.target.value);

    if (e.target.value == "Gcash") {
      database
        .ref("payment")
        .once("value")
        .then((snapshot) => {
          if (snapshot.val()) {
            setPaymentSettings(snapshot.val());
          }
        });

      setGcashClass(true);
      setBankClass(false);
      setPaymayaClass(false);
      setCodClass(false);
    } else if (e.target.value == "PayMaya") {
      setGcashClass(false);
      setBankClass(false);
      setPaymayaClass(true);
      setCodClass(false);
    } else if (e.target.value == "Bank Transfer") {
      console.log(bankSettings);

      setGcashClass(false);
      setBankClass(true);
      setPaymayaClass(false);
      setCodClass(false);
    } else {
      setGcashClass(false);
      setBankClass(false);
      setPaymayaClass(false);
      setCodClass(true);
    }
  };

  let banksRadioArray = new Array();
  if (bankSettings) {
    banksRadioArray = Object.keys(bankSettings).map((e) => {
      // item[1].key = item[0];
      return (
        <Radio
          value={bankSettings[e].name + " " + bankSettings[e].account_number}
        >
          <div className="banksinglediv">
            <Title level={4}>
              <span className="cblue">{bankSettings[e].name}</span>
            </Title>
            <strong>
              Account Name:{" "}
              <span className="cblue">{bankSettings[e].account_name}</span>
            </strong>
            <br />
            <strong>
              Account Number:{" "}
              <span className="cblue">{bankSettings[e].account_number}</span>
            </strong>
            <br />
            <br />
          </div>
        </Radio>
      );
    });
  }

  if (
    localStorage.getItem("edit_customer_info") !== null &&
    localStorage.getItem("edit_customer_info") !== ""
  ) {
    var cus_info = JSON.parse(localStorage.getItem("edit_customer_info"));
  }

  console.log(cus_info);
  const cus_ordernotes = cus_info ? cus_info["order_notes"] : "";
  const cus_fullname = cus_info
    ? cus_info["full_name"]
    : loggedUser && loggedUser.displayName;
  const cus_user_email = cus_info
    ? cus_info["user_email"]
    : userEmail || (loggedUser && loggedUser.email);
  const cus_phone = cus_info
    ? cus_info["phone"]
    : loggedUser && loggedUser.phoneNumber;
  const cus_other_phone = cus_info
    ? cus_info["other_phone"]
    : loggedUser && loggedUser.otherPhone;
  const cus_full_address = cus_info
    ? cus_info["full_address"]
    : loggedUser && loggedUser.fullAddress;
  const cus_address_notes = cus_info
    ? cus_info["address_notes"]
    : loggedUser && loggedUser.addressNotes;
  const cus_codnotes = cus_info ? cus_info["cod_notes"] : "";
  // const cus_prefer_bank = cus_info ? cus_info["prefer_bank"] : "";

  const onChangeRedeem = (e) => {
    if (e === true) {
      setEarnedPointsColor("orange");
      setRedeemedEarnedPoints(loggedUser.points);
    } else {
      setEarnedPointsColor("gray");
      setRedeemedEarnedPoints(0);
    }
  };

  return (
    <Form
      form={form}
      {...layout}
      initialValues={{
        order_notes: cus_ordernotes,
        full_name: cus_fullname,
        phone: cus_phone,
        other_phone: cus_other_phone ? cus_other_phone : "",
        full_address: cus_full_address,
        address_notes: cus_address_notes,
        cod_notes: cus_codnotes,
        // prefer_bank: cus_prefer_bank,
        user_email: cus_user_email,
      }}
      onFinish={saveInfo}
      onFinishFailed={onFinishFailed}
      validateMessages={validateMessages}
    >
      <div className="notesContainer">
        <Row className="notesRow">
          <Col
            className="bordered notesCol"
            span={16}
            xl={16}
            xxl={16}
            lg={16}
            md={16}
            sm={24}
            xs={24}
          >
            <Form.Item
              labelCol={{ span: 24 }}
              name="order_notes"
              label="Order Notes"
            >
              <TextArea
                wrapperCol={{ span: 24 }}
                className="notesTextContainer"
                style={{ height: 100 }}
                autoSize
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="notesContainer infoContainer">
        <Row className="notesRow notesCol bordered">
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col
                style={{ padding: 35 }}
                span={8}
                xl={8}
                xxl={8}
                lg={8}
                md={12}
                sm={24}
                xs={24}
              >
                <Title level={4}>Personal Information</Title>
                <br />
                <Form.Item
                  name="full_name"
                  label="Full Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="user_email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input value={cus_user_email} onChange={validateEmail} />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="other_phone" label="Other phone number">
                  <Input />
                </Form.Item>
                <br />
                <strong className="text">
                  Skip the hassle. Make your own account now!{" "}
                </strong>
                <strong className="text">
                  <Link to="/login">Click Here</Link>
                </strong>
              </Col>

              <Col
                style={{ padding: 35, borderLeft: "1px solid #dedede" }}
                className="infoCol"
                span={16}
                xl={16}
                xxl={16}
                lg={16}
                md={12}
                sm={24}
                xs={24}
              >
                <Row>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                      name="order_type"
                      label="Order Type"
                      rules={[{ required: true }]}
                      style={{
                        marginBottom: "50px",
                        textAlign: "left",
                        display: "inline-block",
                      }}
                    >
                      <strong>
                        {showShippingCharge
                          ? "Regular Delivery Day"
                          : "Pick-up"}
                      </strong>
                      <Radio.Group
                        onChange={onChangeOrderType}
                        value={orderType}
                        style={{ display: "none" }}
                      >
                        <Radio style={radioStyle} value="regular_delivery">
                          Regular Delivery Day
                        </Radio>
                        {/* <Radio style={radioStyle} value="sameday_delivery">Same Day Delivery</Radio> */}
                        <Radio style={radioStyle} value="pickup">
                          Pick-up
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    {orderType === "regular_delivery" ||
                    orderType === "sameday_delivery" ? (
                      <>
                        <Title level={4}>Delivery Information</Title>
                        <br />
                        <Form.Item
                          name="full_address"
                          label="Full Address"
                          rules={[
                            {
                              required:
                                orderType === "regular_delivery" ||
                                orderType === "sameday_delivery"
                                  ? true
                                  : false,
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="address_notes"
                          rules={[
                            { required: showShippingCharge ? true : false },
                          ]}
                          label="Notes / Landmark"
                        >
                          <TextArea />
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}

                    {orderType === "pickup" ? (
                      <>
                        <Title level={4}>Pickup Information</Title>
                        <b>
                          We will contact you with further details regarding
                          your chosen pick up location.
                        </b>
                        <br />
                        <br />
                        <Form.Item
                          name="pickup_location"
                          label="Choose Pickup Location"
                          rules={[
                            { required: orderType === "pickup" ? true : false },
                          ]}
                          style={{
                            marginBottom: "50px",
                            textAlign: "left",
                            display: "inline-block",
                          }}
                        >
                          <Radio.Group className="rdgrpPickLoc">
                            <Radio
                              style={radioStylePickupLoc}
                              value="Toril: Ernesto Guadalupe Community Hospital, Jasmin St., San Nicolas, Daliao, Toril"
                            >
                              Toril: Ernesto Guadalupe Community Hospital,
                              Jasmin St., San Nicolas, Daliao, Toril
                            </Radio>
                            <Radio
                              style={radioStylePickupLoc}
                              value="Maa: #321 Rose St., Luzviminda Village"
                            >
                              Maa: #321 Rose St., Luzviminda Village
                            </Radio>
                            <Radio
                              style={radioStylePickupLoc}
                              value="Poblacion: YMCA of Davao Inc., Villamor Street, corner Emilio Jacinto Ext, Poblacion District"
                            >
                              Poblacion: YMCA of Davao Inc., Villamor Street,
                              corner Emilio Jacinto Ext, Poblacion District
                            </Radio>
                            <Radio
                              style={radioStylePickupLoc}
                              value="Buhangin: Liverpool Building (#4), Camella Northpoint"
                            >
                              Buhangin: Liverpool Building (#4), Camella
                              Northpoint
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>

                {loggedUser ? (
                  loggedUser.points ? (
                    <Row>
                      <Col lg={7} md={7} sm={7} xs={7}>
                        <h3>Redeem ({loggedUser.points}) points: </h3>
                      </Col>
                      <Col
                        style={{ textAlign: "right", paddingRight: "10px" }}
                        lg={2}
                        md={2}
                        sm={2}
                        xs={2}
                      >
                        <h3 style={{ color: earnedPointsColor }}>
                          [-{loggedUser.points}]
                        </h3>
                      </Col>
                      <Col lg={15} md={15} sm={15} xs={15}>
                        <Switch
                          checkedChildren="Yes"
                          unCheckedChildren="No"
                          onChange={onChangeRedeem}
                        />
                      </Col>
                    </Row>
                  ) : null
                ) : null}

                <Row>
                  <Col lg={6} md={6} sm={24} xs={24}>
                    <Form.Item
                      name="payment_method"
                      rules={[{ required: true }]}
                      label="Payment Method"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <Radio.Group onChange={radiobtn}>
                        <Radio style={radioStyle} value="Gcash">
                          Gcash
                        </Radio>
                        {/* <Radio style={radioStyle} value="PayMaya">PayMaya</Radio> */}
                        {hasBanks == true ? (
                          <Radio style={radioStyle} value="Bank Transfer">
                            Bank Transfer
                          </Radio>
                        ) : null}
                        <Radio style={radioStyle} value="Cash on Delivery">
                          Cash on Delivery
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col lg={6} md={6} sm={24} xs={24}></Col>
                  <Col
                    lg={12}
                    md={12}
                    sm={24}
                    xs={24}
                    style={{ marginTop: "45px" }}
                  >
                    <div className={gcashClass == false ? "hidden" : ""}>
                      <Title level={4}>
                        <span className="cblue">Gcash</span>
                      </Title>
                      <strong style={{ fontSize: 16 }}>
                        Gcash Number:{" "}
                        <span className="cblue">
                          {paymentSettings.gcashphone}
                        </span>
                      </strong>
                    </div>
                    <div className={paymayaClass == false ? "hidden" : ""}>
                      <Title level={4}>
                        <span className="cblue">PayMaya</span>
                      </Title>
                      <strong style={{ fontSize: 16 }}>
                        PayMaya Number:{" "}
                        <span className="cblue">
                          {paymentSettings.paymayaphone}
                        </span>
                      </strong>
                    </div>
                    <div className={bankClass == false ? "hidden" : "bankdiv"}>
                      <Form.Item
                        name="depBank"
                        label="Deposit to"
                        rules={[
                          { required: bankClass == false ? false : true },
                        ]}
                      >
                        <Radio.Group>{banksRadioArray}</Radio.Group>
                      </Form.Item>
                    </div>
                    <div className={codClass == false ? "hidden" : ""}>
                      <Form.Item
                        name="cod_notes"
                        label="Cash on Delivery Notes"
                      >
                        <TextArea />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                {/* <Title level={4}>If you choose Bank Transfer</Title>
                <Form.Item name="prefer_bank" label="Please provide the bank/banks you prefer:">
                  <Input />
                </Form.Item>
                <br/>
                <strong className="text">We will inform you via email or text of the details for the bank transfer.</strong> */}
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Button
                  className="shopConfirmButton"
                  htmlType="button"
                  style={{ marginTop: 30 }}
                  onClick={() => setCurrent(0)}
                >
                  <CaretLeftOutlined /> Go back shopping
                </Button>
                <Button
                  id="btn-complete-order"
                  className="shopConfirmButton"
                  htmlType="submit"
                  style={
                    screenSize < 540
                      ? { marginTop: 30 }
                      : { marginTop: 30, float: "right" }
                  }
                >
                  <CheckOutlined /> Complete Order
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default DeliveryInfoComponent;
