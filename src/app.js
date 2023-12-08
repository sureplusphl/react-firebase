import "antd/dist/antd.css";
import React, { useContext, useState, useEffect } from "react";
import "./index.css";
import { Layout, Menu, Steps, Modal, Typography, Button, Col, Row } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import {
  SettingOutlined,
  HomeOutlined,
  ShopOutlined,
  ApiFilled,
  ApiOutlined,
  TeamOutlined,
  HomeFilled,
  ShopFilled,
  SettingFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Routing from "./shared/routing";
import { AuthContext } from "./shared/contexts/auth.context";
import { AppContext } from "./shared/contexts/app.context";
const { Header, Content, Footer } = Layout;
const { Step } = Steps;
const { SubMenu } = Menu;

const { Paragraph, Title, Text } = Typography;

function App() {
  const { loggedUser } = useContext(AuthContext);
  const [active, setActive] = useState();
  const [theme, setTheme] = useState("dark");
  const [showModal, setShowModal] = useState(false);
  const modalClose = () => setShowModal(false);
  const modalShow = () => setShowModal(true);
  useEffect(() => {
    const activePage = window.location.pathname.replace("/", "");
    setActive(activePage ? activePage : "home");
  }, []);

  const handleOnChange = ({ key }) => {
    setActive(key);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu
          className="headerMenu"
          mode="horizontal"
          selectedKeys={[active]}
          selectable="false"
          onClick={handleOnChange}
          style={{ backgroundColor: "#60B414" }}
        >
          <Menu.Item key="home">
            <Link to="/">
              {active === "home" ? <HomeFilled /> : <HomeOutlined />} Home
            </Link>
          </Menu.Item>

          <Menu.Item key="shop">
            <Link to="/shop">
              {active === "shop" ? <ShopFilled /> : <ShopOutlined />} Shop
            </Link>
          </Menu.Item>

          <Menu.Item key="about">
            <Link to="/about">
              {active === "about" ? <TeamOutlined /> : <TeamOutlined />} About
            </Link>
          </Menu.Item>

          {loggedUser ? (
            <SubMenu
              title={
                <>
                  {active === "my-orders" ||
                  active === "my-orders" ||
                  active === "my-orders" ? (
                    <SettingFilled />
                  ) : (
                    <SettingOutlined />
                  )}
                  <a>
                    <span>Account</span>
                  </a>
                </>
              }
              // style={{ float: "right" }}
            >
              <Menu.Item key="my-orders">
                <Link to="/my-orders">My Orders</Link>
              </Menu.Item>
              <Menu.Item key="profile">
                <Link to="/profile">My Profile</Link>
              </Menu.Item>
              <Menu.Item key="logout">
                <Link to="/logout">Logout</Link>
              </Menu.Item>
            </SubMenu>
          ) : (
            <Menu.Item className="loginBtn" key="login">
              <Link to="/login">
                {active === "login" ? <ApiFilled /> : <ApiOutlined />} Login
              </Link>
            </Menu.Item>
          )}

          {!loggedUser ? (
            <Menu.Item
              key="signin"
              // style={{ float: "right" }}
            >
              <Link to="/signup">
                {active === "signin" ? <ApiFilled /> : <ApiOutlined />} Signup
              </Link>
            </Menu.Item>
          ) : null}

          <Menu.Item className="searchIcon" key="search">
            <Link to="/shop">
              <SearchOutlined />
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0 10px", marginTop: 64 }}
      >
        <Routing />
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#60B414",
          bottom: 0,
          paddingTop: 100,
          marginTop: 100,
        }}
      >
        <Content>
          <Row gutter={[16, 16]} className="footerRow">
            <Col
              span={24}
              style={{
                textAlign: "center",
                marginBottom: "145px",
                fontFamily: "Montserrat",
                color: "#FFFFFF",
              }}
            >
              <Title
                level={2}
                style={{
                  fontSize: 45,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  lineHeight: "72px",
                  letterSpacing: "-0.015em",
                }}
              >
                CONTACT US
              </Title>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  color: "white",
                  marginRight: "10%",
                  marginLeft: "10%",
                  marginTop: "50px",
                }}
              >
                <Paragraph
                  style={{
                    color: "white",
                    fontSize: "25px",
                  }}
                >
                  <PhoneOutlined />{" "}
                  <a
                    href="tel:+639626216453"
                    style={{
                      color: "white",
                    }}
                  >
                    {" "}
                    +63 (962) 621 6453
                  </a>
                </Paragraph>
                <Paragraph
                  style={{
                    color: "white",
                    fontSize: "25px",
                  }}
                >
                  <MailOutlined />{" "}
                  <a
                    href="mailto:admin@sureplus.org"
                    style={{ color: "white" }}
                  >
                    admin@sureplus.org
                  </a>
                </Paragraph>
                <Paragraph
                  style={{
                    color: "white",
                    fontSize: "25px",
                  }}
                >
                  <InstagramOutlined />{" "}
                  <a
                    href="https://www.instagram.com/sureplus_food/"
                    style={{ color: "white" }}
                  >
                    sureplus_food
                  </a>
                </Paragraph>
                <Paragraph
                  style={{
                    color: "white",
                    fontSize: "25px",
                  }}
                >
                  <FacebookOutlined />{" "}
                  <a
                    href="https://web.facebook.com/sureplusfoods/"
                    style={{ color: "white" }}
                  >
                    sureplus
                  </a>
                </Paragraph>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginBottom: "80px" }}>
              <div style={{ textAlign: "center" }}>
                <Button
                  className="footerBtn"
                  type="primary"
                  // shape="round"
                  size="large"
                  onClick={modalShow}
                  style={{
                    background: "#fe6902",
                    borderColor: "#fe6902",
                    borderRadius: 6,
                  }}
                >
                  BE OUR CHARITY OR BUSINESS PARTNER!
                </Button>
              </div>
            </Col>
          </Row>
          <Modal
            className="footerModal"
            title="Be our Charity or Business Partners"
            visible={showModal}
            maskStyle={{ backgroundColor: "#ddd", opacity: 0.9 }}
            onCancel={modalClose}
            onOk={modalClose}
            footer={``}
          >
            <Title level={3}>PROPOSAL</Title>
            <ul>
              <li>
                During the partnership (at least one month long), your
                institution will enjoy the following:
              </li>
              <li>Free delivery of your orders</li>
              <li>Get discount on bulk orders</li>
              <li>
                Be the recipient of food donations gathered internationally
              </li>
              <li>
                Be able to participate in initiatives targeting on minimizing
                food waste and undernutrition
              </li>
              <li>Be actively promoted on all our social media platforms</li>
            </ul>
            <Text className="partnerList">
              {" "}
              After the duration of the partnership, your institution will enjoy
              the following:
            </Text>{" "}
            <br></br>
            <ul>
              <li>Get discount on delivery fees</li>
              <li>Get discount on bulk orders</li>
              <li>
                Be able to participate in initiatives targeting on minimizing
                food waste and undernutrition
              </li>
              <li>Be visible in all our social media platforms</li>
            </ul>
            <Title level={3}>WHAT WE ONLY ASK FROM YOU</Title>
            <ul>
              <li>Avail of our products regularly</li>
              <li>
                Help Sureplus in our call for donations for our partner
                charities/institutions
              </li>
              <li>
                Promote Sureplus as your partner in all your social media
                platforms and other engagements
              </li>
              <li>
                Provide tokens of appreciations to donors e.g. sample products
                (optional)
              </li>
            </ul>
            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
                marginBottom: "30px",
              }}
            >
              <Button
                type="link"
                href="mailto:admin@sureplus.net"
                shape="round"
                size="large"
                style={{
                  background: "#fe6902",
                  color: "#000000",
                  padding: "0",
                  width: "200px",
                  color: "#fff",
                }}
              >
                EMAIL US NOW
              </Button>
            </div>
          </Modal>
          <Paragraph
            style={{
              color: "white",
              fontSize: "16px",
            }}
          >
            SurePlus ©2020
          </Paragraph>
        </Content>
      </Footer>
    </Layout>
  );
}

export default App;
