import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  Typography,
  Divider,
  Row,
  Col,
  Input,
  message,
  Button,
} from "antd";
import * as EmailValidator from "email-validator";
import { AppContext } from "../../shared/contexts/app.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import "./confirmOrder.css";
import { CaretLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;

const Agreement = () => {
  const {
    textBoxesSettings,
    setAgreement1,
    setAgreement2,
    agreement1,
    setUserEmail,
    userEmail,
    agreement2,
    current,
		next,
		prev,
  } = useContext(AppContext);

  const [screenSize, setScreenSize] = useState("");

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
    if (loggedUser && loggedUser.email) setUserEmail(loggedUser.email || "");
    setScreenSize(window.innerWidth);
  }, [loggedUser]);

  let confirmation = "";
  if(textBoxesSettings && textBoxesSettings.confirmation) {
    confirmation = textBoxesSettings.confirmation.status && textBoxesSettings.confirmation;
  }

  return (
    <>
      <div className="container">
        <Row className="agreementRow">
          <Col span={14} xxl={14} xl={14} lg={16} md={20} sm={24} xs={24} className="agreementContainer">
          <Card className="justifyText">
            <h3 className="title">Confirm your order</h3>
            <p style={{marginTop: 40}}>To practice contactless delivery, we encourage you to pay via Gcash or bank transfer. If via cash, please pay the exact amount as much as possible.</p>
            <p
              style={{marginTop: 30}}
              dangerouslySetInnerHTML={{__html: confirmation.message}}
            >
            </p>
            <Divider type="horizontal" />
            <Checkbox
              defaultChecked={agreement1}
              onChange={(e) => setAgreement1(e.target.checked)}
            >
              I have read and understood the statements above and will proceed
              with the order.
            </Checkbox>
            <br/>
            <br/>
            <br/>
            <Button className="shopConfirmButton" style={{ marginTop: 30 }} onClick={prev}><CaretLeftOutlined /> Go back shopping</Button>
            <Button className="shopConfirmButton" id="btn-checkout" style={screenSize < 540 ? { marginTop: 30 } : { marginTop: 30, float: "right" }} onClick={next} disabled={!agreement1 }><ShoppingCartOutlined /> Checkout</Button>
          </Card>
          </Col>

        </Row>
      </div>
    </>
  );
};

export default Agreement;
