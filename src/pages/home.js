import "./home.css";
import React, { useContext, useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Col,
  Row,
  Modal,
  Alert,
  Carousel,
  Button,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  InstagramOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { AppContext } from "../shared/contexts/app.context";
import video from "../static/images/What_Sureplus_Does.mp4";
import "./video-react.css";
import { Player } from "video-react";
import home_logo from "../static/images/home-logo.png";
import HomeCarousel from "../components/carousel/HomeCarousel.js";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { Paragraph, Title, Text } = Typography;

const Home = () => {
  const { current, shopStatus, announcements } = useContext(AppContext);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const modalClose = () => setShowModal(false);
  const modalShow = () => setShowModal(true);

  useEffect(() => {
    setShowAnnouncement(announcements && announcements.status === "enabled");
    // console.log({
    //   announcements,
    //   enabled: announcements && announcements.status === "enabled",
    // });
  }, [announcements]);

  return (
    <Layout className="layoutContent">
      <Content className="homeContent">
        <Row justify="center" className="homeRow">
          <Col className="homeLeft" xs={24} md={11}>
            <Title className="homeTitle" level={2}>
              <span>Save More, Waste Less</span>
            </Title>

            <Text className="homeSubtitle">
              <span>
                For faster shopping, make your own account now and earn points!
              </span>
            </Text>
            <div className="homeTitleButtons">
              <Button type="primary" className="homeTitleButton">
                <Link to="/shop">SHOP NOW</Link>
              </Button>
              <Button className="homeTitleButton" type="primary">
                <Link to="/shop">DONATE</Link>
              </Button>
            </div>
          </Col>
          <Col className="homeRight" span={8}>
            <img src={home_logo} alt="" />
          </Col>
        </Row>
      </Content>
      <HomeCarousel isLoggedIn={false} />
      {/* <Carousel autoplay style={{ width: "100%" }}> */}
      {/* <Col span={24}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200320_171424.jpg?alt=media&token=e287767b-3e69-406e-8005-d5a5737758ab"
            alt=""
            width="100%"
          />
        </Col> */}

      {/* <Col span={24}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2Fedit2.jpg?alt=media&token=94721bb4-dd43-4738-a4a2-caed9f7f9b12"
            alt=""
            width="100%"
          />
        </Col> */}

      {/* <Col span={24}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200416_164858.jpg?alt=media&token=f68fce44-8916-4c46-80a6-e2884450a867"
            alt=""
            width="100%"
          />
        </Col>
        <Col span={24}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200416_170408.jpg?alt=media&token=2083b8e0-0db0-4811-863d-be1735a362a9"
            alt=""
            width="100%"
          />
        </Col>
        <Col span={24}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200417_094834.jpg?alt=media&token=0498fca8-9905-4284-9459-0b4ea90493b7"
            alt=""
            width="100%"
          />
        </Col> */}
      {/* </Carousel> */}

      <div className="vidPlayer homeRowVid">
        <div className="vidPlayerLeft">
          Sureplus is a social enterprise that resells, repurposes & reallocates
          surplus food in order to minimize food wastage & hunger in Davao City.
        </div>
        {/* <Player
          className="vidPlayerRight"
          autoPlay
          loop
          muted
          poster="/assets/foodWaste.PNG"
          
        > */}
        {/* width="385" height="657" */}
        <video className="vidPlayerRight" controls>
          <source src={video} type="video/mp4" />
        </video>
        {/* </Player> */}
      </div>

      {/* <Row gutter={[12, 12]} align="top" className="homePictures">
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/1.jpg" alt="1" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/2.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/3.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/4.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/5.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/6.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/7.jpg" />
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 1 }}
          md={{ span: 1 }}
          lg={{ span: 1 }}
        >
          <div></div>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <div>
            <img src="/assets/images/homePic/8.jpg" />
          </div>
        </Col>
      </Row> */}
      <div className="gallery">
        <figure className="gallery__item gallery__item--1">
          <img
            src="/assets/images/homePic/1.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
        <figure className="gallery__item gallery__item--2">
          <img
            src="/assets/images/homePic/2.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
        <figure className="gallery__item gallery__item--3">
          <img
            src="/assets/images/homePic/3.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
        <figure className="gallery__item gallery__item--4">
          <img
            src="/assets/images/homePic/4.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
        <figure className="gallery__item gallery__item--5">
          <img
            src="/assets/images/homePic/5.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
        <figure className="gallery__item gallery__item--6">
          <img
            src="/assets/images/homePic/6.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>

        <figure className="gallery__item gallery__item--8">
          <img
            src="/assets/images/homePic/8.jpg"
            className="gallery__img"
            alt=""
          />
        </figure>
      </div>

      {/* <div class="row">
        <div class="column">
          <img src="/assets/images/homePic/1.jpg" />
        </div>

        <div class="column">
          <img src="/assets/images/homePic/2.jpg" />
        </div>
        <div class="column">
          <img src="/assets/images/homePic/3.jpg" />
          <img src="/assets/images/homePic/4.jpg" />
          <img src="/assets/images/homePic/5.jpg" />
          <img src="/assets/images/homePic/6.jpg" />
          <img src="/assets/images/homePic/7.jpg" />
          <img src="/assets/images/homePic/8.jpg" />
        </div>
        <div class="column"></div>
      </div> */}
      {/* <Content
        style={{
          padding: "0 50px",
          margin: "64px auto",
          maxWidth: "1024px",
          marginBottom: "25px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title style={{ textAlign: "center" }} level={2}>
              For faster shopping, make your own account now and earn points!
            </Title>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <Button
                type="link"
                href="/login"
                shape="round"
                size="large"
                style={{
                  background: "#fe6902",
                  color: "#000000",
                  padding: "0",
                  width: "300px",
                  color: "#fff",
                }}
              >
                CREATE ACCOUNT NOW
              </Button>
            </div>
          </Col>
        </Row>
      </Content> */}

      {/* <Carousel autoplay style={{ width: "35%", margin: "0 auto", marginBottom: "60px" }}>
          <Col span={24}>
            <Button type="link" href="/shop" style={{height: "auto"}}>
              <img
                src="assets/images/charity/gawadkalinga1.png"
                alt=""
                width="100%"
              />
            </Button>
          </Col>
          <Col span={24}>
            <Button type="link" href="/shop" style={{height: "auto"}}>
              <img
                src="assets/images/charity/gawadkalinga2.png"
                alt=""
                width="100%"
              />
            </Button>
          </Col>
          <Col span={24}>
            <Button type="link" href="/shop" style={{height: "auto"}}>
              <img
                src="assets/images/charity/gawadkalinga3.png"
                alt=""
                width="100%"
              />
            </Button>
          </Col>
        </Carousel> */}

      <Content>
        {/* <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: "45px" }}>
            <Title level={2}>ABOUT SUREPLUS</Title>
            <Paragraph>
              Sureplus is a social enterprise that resells, repurposes &amp;
              reallocates
            </Paragraph>
            <Paragraph>
              surplus food in order to minimize food wastage &amp; hunger in
              Davao City.
            </Paragraph>

            <Title level={2}>PROBLEM</Title>
            <Paragraph>
              Globally, one third of food is wasted while 820 million people are
              malnourished. In the Philippines,
            </Paragraph>
            <Paragraph>
              it is estimated that more than 13 million Filipinos can't afford
              three meals a day.
            </Paragraph>
            <Paragraph>
              This is sad and ironic considering that Filipinos also waste about
              308,000 tons of food every year.
            </Paragraph>

            <Title level={2}>SOLUTION</Title>
            <Paragraph>
              Sureplus is resells, repurposes and reallocates surplus food for
              those
            </Paragraph>
            <Paragraph>
              looking for more affordable food.Specifically, through real-time
              updates
            </Paragraph>
            <Paragraph>
              and easy communication from using our website and mobile app, food
              businesses
            </Paragraph>
            <Paragraph>
              can easily reach customers looking for more affordable food. Those
              that are not sold
            </Paragraph>
            <Paragraph>
              are repurposed into value-added products. After these, all
              remaining food are reallocated to
            </Paragraph>
            <Paragraph>
              the needy thru our existing feeding programs and future food bank.
            </Paragraph>

            <Title level={2}>CONTACT US</Title>
            <Paragraph>
              <PhoneOutlined /> <a href="tel:09171540515">0917 1540 515</a>
            </Paragraph>
            <Paragraph>
              <MailOutlined />{" "}
              <a href="mailto:admin@sureplus.org">admin@sureplus.org</a>
            </Paragraph>
            <Paragraph>
              <InstagramOutlined />{" "}
              <a href="https://www.instagram.com/sureplus_food/">
                sureplus_food
              </a>
            </Paragraph>
            <Paragraph>
              <FacebookOutlined />{" "}
              <a href="https://web.facebook.com/sureplusfoods/">sureplus</a>
            </Paragraph>
          </Col>
        </Row> */}

        {/* <Row gutter={[16, 16]}>
          <Col span={24} style={{ marginBottom: "80px" }}>
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={modalShow}
                style={{ background: "#fe6902", borderColor: "#fe6902" }}
              >
                BE OUR CHARITY OR BUSINESS PARTNER!
              </Button>
            </div>
          </Col>
        </Row>

        <Modal
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
              During the partnership (at least one month long), your institution
              will enjoy the following:
            </li>
            <li>Free delivery of your orders</li>
            <li>Get discount on bulk orders</li>
            <li>Be the recipient of food donations gathered internationally</li>
            <li>
              Be able to participate in initiatives targeting on minimizing food
              waste and undernutrition
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
              Be able to participate in initiatives targeting on minimizing food
              waste and undernutrition
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
        </Modal> */}

        <Row gutter={[16, 16]} className="footerImages">
          <Col span={24}>
            <Paragraph
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "#000000",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: "72px",
              }}
            >
              This project is funded by the YSEALI Seeds for Future Grant
            </Paragraph>
          </Col>
          <Col span={4}></Col>
          <Col span={5}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2FCopy%20of%20USEMBASSY_flag.png?alt=media&token=e1e99691-1c44-4415-a752-999449667add"
              alt=""
              width="100%"
            />
          </Col>
          <Col span={7}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2FCopy%20of%202016-yseali-seeds.png?alt=media&token=168603a5-9fe6-4189-9f28-d705d35d4da7"
              alt=""
              width="100%"
            />
          </Col>
          <Col span={4}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2FCopy%20of%20cv_blue.png?alt=media&token=b5501925-3a23-4768-9113-7c6bf9a8ddf3"
              alt=""
              width="100%"
            />
          </Col>
          <Col span={4}></Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
