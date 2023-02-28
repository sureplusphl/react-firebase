import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import {
  Button,
  Row,
  Spin,
  Empty,
  Alert,
  Typography,
  Layout,
  Col,
  Card,
  Divider,
  Avatar,
  Anchor,
  Input,
  Carousel,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppContext } from "../../shared//contexts/app.context";
import React, { useContext, useState } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./homeCarousel.css";

const { Title } = Typography;

export default function HomeCarousel(props) {
  const { products } = useContext(AppContext);
  const { Meta } = Card;
  // let categories = [
  //   {
  //     key: 1,
  //     title: "white onion",
  //     price: "40",
  //     image: require("../../static/images/white_onion.webp"),
  //   },
  //   {
  //     key: 2,
  //     title: "upo",
  //     price: "40",
  //     image: require("../../static/images/upo.jpg"),
  //   },
  //   {
  //     key: 3,
  //     title: "ubod",
  //     price: "40",
  //     image: require("../../static/images/ubod.jpg"),
  //   },
  //   {
  //     key: 4,
  //     title: "ube",
  //     price: "40",
  //     image: require("../../static/images/ube.jpg"),
  //   },
  //   {
  //     key: 5,
  //     title: "tundan",
  //     price: "40",
  //     image: require("../../static/images/tundan.jpg"),
  //   },
  //   {
  //     key: 6,
  //     title: "tofu",
  //     price: "40",
  //     image: require("../../static/images/tofu.jpg"),
  //   },
  //   {
  //     key: 7,
  //     title: "tinangkong",
  //     price: "40",
  //     image: require("../../static/images/tinangkong.jpg"),
  //   },
  // ];

  let categories = [];
  if (products) {
    products.map((productItem, index) => {
      if (productItem.product_category_name === "Bagsak Presyo")
        categories.push({
          key: productItem.key,
          title: productItem.name,
          price: productItem.raw_price,
          image: productItem.file,
        });
    });
  }

  // const [items, setItems] = useState(categories);
  const [selected, setSelected] = useState(0);

  const Arrow = (props) => {
    return <div className="arrow">{props.text}</div>;
  };
  const ArrowLeft = Arrow({ text: <LeftOutlined />, className: "arrow-prev" });
  const ArrowRight = Arrow({
    text: <RightOutlined />,
    className: "arrow-next",
  });

  const Item = (items) =>
    items.map((item) => (
      <Col span={24}>
        <CardItem
          title={item.title}
          price={item.price}
          image={item.image}
          key={item.key}
        />
      </Col>
    ));

  const CardItem = ({ selected, title, price, image }) => {
    return (
      <Card
        hoverable
        cover={<img src={image} alt={title} className="cardImg" />}
        className="card"
        // onClick={() => {
        //   alert(title);
        // }}
      >
        <div className="cardDescription">
          <div>{title}</div>
          <div>P{price}</div>
        </div>

        <div></div>
      </Card>
    );
  };
  const cat = Item(categories, selected);
  const onSelect = (key) => {
    setSelected(key);
  };

  // return (
  //   <div className="content">
  //     <div className="container">
  //       <div className="storeTitle">
  //         {props.isLoggedIn
  //           ? "Recently Purchased Products:"
  //           : "Best Selling Products:"}
  //       </div>
  //       <div className="homeCarousel">
  //         {props.isLoggedIn ? (
  //           <ScrollMenu
  //             data={cat}
  //             arrowLeft={ArrowLeft}
  //             arrowRight={ArrowRight}
  //             selected={selected}
  //             onSelect={onSelect}
  //           ></ScrollMenu>
  //         ) : (
  //           <ScrollMenu
  //             data={cat}
  //             arrowLeft={ArrowLeft}
  //             arrowRight={ArrowRight}
  //             selected={selected}
  //             onSelect={onSelect}
  //           ></ScrollMenu>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    draggable: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1324,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="content">
      <div className="container">
        <div className="storeTitle">
          {props.isLoggedIn
            ? "Recently Purchased Products:"
            : "Best Selling Products:"}
        </div>
        <div className="homeCarousel">
          {props.isLoggedIn ? (
            <Carousel autoplay style={{ width: "100%" }} {...settings}>
              <Col span={24}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200320_171424.jpg?alt=media&token=e287767b-3e69-406e-8005-d5a5737758ab"
                  alt=""
                  width="100%"
                />
              </Col>
              <Col span={24}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/images%2Fbanners%2F20200320_171424.jpg?alt=media&token=e287767b-3e69-406e-8005-d5a5737758ab"
                  alt=""
                  width="100%"
                />
              </Col>
            </Carousel>
          ) : (
            <Carousel
              // autoplay
              // style={{ width: "100%" }}
              // draggable={true}
              // slidesPerRow={3}
              {...settings}
            >
              {cat}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
