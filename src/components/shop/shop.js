import React, { useContext, useState, useEffect, useRef } from "react";
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
} from "antd";
import ProductCard from "../product-card";
import Summary from "../summary/summary";
import OrderSummary from "../summary/OrderSummary";
import {
  AppstoreOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { AppContext } from "../../shared/contexts/app.context";
import AllProductCard from "../product-card/AllProductCard";
import Swal from "sweetalert2";
import { PlusCircleOutlined } from "@ant-design/icons";
import SummaryModalComponent from "../SummaryModalComponent";
import "./styles.css";
import LazyLoad from "react-lazyload";

const { Title } = Typography;
const { Search } = Input;
const { Link } = Anchor;
const { Header, Footer, Sider, Content } = Layout;

const Shop = (props) => {
  const {
    textBoxesSettings,
    orders,
    next,
    products,
    isLoadingProducts,
    totalKilos,
    fetchStoresCategory,
    storesCategories,
    setActiveStore,
    activeStore,
    totalGoods,
  } = useContext(AppContext);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [displayShowAll, setDisplayShowAll] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState("");
  const [searched, setSearched] = useState("");
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [productCardLimit, setProductCardLimit] = useState(0);
  const [screenSize, setScreenSize] = useState("");
  const [selectedCatKey, setSelectedCatKey] = useState();

  useEffect(() => {
    fetchStoresCategory();
    // console.log(fetchStoresCategory());
    window.addEventListener("resize", () => {
      setProductCardLimit(window.innerWidth > 1600 ? 12 : 8);
      setScreenSize(window.innerWidth);
    });
    if (!productCardLimit) {
      setProductCardLimit(window.innerWidth > 1600 ? 12 : 8);
      setScreenSize(window.innerWidth);
    }
  }, []);

  function showMore(value) {
    setSelectedCatName(value.category);
    setSelectedProductData(value.productData);
    setDisplayShowAll(true);
  }

  function scrollToProducts() {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const scrollRef = useRef(null);
  const executeScroll = () =>
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

  const searchComponent = (
    <Row justify="end" id="productsContainer">
      <Col span={24} style={{ display: "flex" }}>
        <Search
          className="searchBar"
          size="large"
          allowClear
          placeholder="Search the product here"
          onSearch={setSearched}
          prefix={<SearchOutlined />}
        />
        <p style={{ fontSize: "14px", fontWeight: "500", marginTop: "12px" }}>
          SEARCH
        </p>
      </Col>
    </Row>
  );
  const confirmOrder = () => {
    if (totalGoods >= 300) {
      next();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Cannot proceed to confirm order",
        text: "Sureplus caters to a minimum of ₱ 300.00 per order, please add more items",
        // footer: '<a href>Why do I have this issue?</a>'
      });
      // message.warning('You will need to order 5 kilos minimum')
    }
  };

  const product_data = new Array();

  // products.forEach(function (row) {
  //   if (product_data[row.product_category_name]) {
  //     product_data[row.product_category_name].push(row);
  //   } else {
  //     product_data[row.product_category_name] = [row];
  //   }
  // });

  let announcements = "";
  let announcementStyle = {};
  let showBannerImg = false;
  if (textBoxesSettings) {
    announcements = textBoxesSettings.announcements;
    if (announcements && announcements.show_image) {
      announcementStyle = {
        xxl: 14,
        xl: 14,
        lg: 12,
        md: 24,
        sm: 24,
        xs: 24,
      };

      showBannerImg = true;
    } else {
      announcementStyle = {
        xxl: 24,
        xl: 24,
        lg: 24,
        md: 24,
        sm: 24,
        xs: 24,
      };

      showBannerImg = false;
    }
  }

  if (activeStore && storesCategories && !searched) {
    products
      .filter((e) => e.store_id === activeStore && parseInt(e.price, 10))
      .forEach(function (row) {
        if (product_data[row.product_category_name]) {
          product_data[row.product_category_name].push(row);
        } else {
          product_data[row.product_category_name] = [row];
        }
      });
  }
  // else if (activeStore && storesCategories && searched) {
  //   const filteredData = products.filter(e => e.name.toString().toLowerCase().includes(searched.toLowerCase()) && e.store_id === activeStore && parseInt(e.price, 10));

  //   filteredData.forEach(function (row) {
  //     if (parseInt(row.price, 10)) {
  //       const storeName = storesCategories.filter(e => e.key === row.store_id).map(store => store.name);
  //       if (product_data[`Search Result on ${storeName}`]) {
  //         product_data[`Search Result on ${storeName}`].push(row);
  //       } else {
  //         product_data[`Search Result on ${storeName}`] = [row];
  //       }
  //     }
  //   });

  // }
  else if (searched) {
    const filteredData = products.filter(
      (e) =>
        e.name.toString().toLowerCase().includes(searched.toLowerCase()) &&
        parseInt(e.price, 10)
    );

    filteredData.forEach(function (row) {
      if (parseInt(row.price, 10)) {
        // const storeName = storesCategories.filter(e => e.key === row.store_id).map(store => store.name);
        if (product_data["Search Result"]) {
          product_data["Search Result"].push(row);
        } else {
          product_data["Search Result"] = [row];
        }
      }
    });
  } else {
    products.forEach(function (row) {
      if (parseInt(row.price, 10)) {
        const storeName = storesCategories
          .filter((e) => e.key === row.store_id)
          .map((store) => store.name);
        if (product_data[storeName]) {
          product_data[storeName].push(row);
        } else {
          product_data[storeName] = [row];
        }
      }
    });
  }

  const ArrowLeft = (
    <div className="arrow-prev">
      <CaretLeftOutlined style={{ fontSize: 50 }} />
    </div>
  );
  const ArrowRight = (
    <div className="arrow-next">
      <CaretRightOutlined style={{ fontSize: 50 }} />
    </div>
  );

  let emptyProduct = "";
  if (
    !products.filter((e) => e.store_id === activeStore && parseInt(e.price, 10))
      .length &&
    !isLoadingProducts &&
    activeStore
  ) {
    emptyProduct = (
      <Row align="center" style={{ textAlign: "center" }}>
        <Avatar
          shape="square"
          src="/assets/images/IMG_4769.JPG"
          style={{
            width: "270px",
            height: "225px",
            marginTop: "30px",
            borderRadius: "20px",
          }}
        ></Avatar>
      </Row>
    );
  }

  let categories = "";
  if (storesCategories) {
    categories = [{ name: "All", key: "" }, ...storesCategories].map(
      (e, index) => {
        let card = (
          <Col
            className=""
            id="category"
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 8 }}
            xxl={{ span: 6 }}
          >
            <Card
              key={e.key == "" ? "all" : e.key}
              style={
                e.key == ""
                  ? {
                      background: "#60B414",
                      borderColor: "#60B414",
                      cursor: "pointer",
                    }
                  : {
                      background: "#60B414",
                      borderColor: "#1C5858",
                      cursor: "pointer",
                    }
              }
              className={`storeCategoryCard ${
                activeStore === e.key ? "storeCategoryActive" : ""
              }`}
              hoverable={true}
              onClick={() => {
                setActiveStore(e.key);
                setDisplayShowAll(false);
                setSearched("");
                setSelectedCatKey("");
                scrollToProducts();
              }}
            >
              {e.key === "" ? (
                <div className="storeContainer">
                  <AppstoreOutlined
                    style={{
                      color: "#87B144",
                      fontSize: 90,
                      // padding: "0px 24px",
                      width: "101px",
                    }}
                    className="storeAvatar"
                  />
                  <strong className="storeText">ALL</strong>
                </div>
              ) : (
                <div className="storeContainer">
                  <Avatar shape="square" src={e.file} className="storeAvatar" />
                  <strong className="storeText">{e.name}</strong>
                </div>
              )}
            </Card>
          </Col>
        );

        return card;
      }
    );
  }

  return (
    <>
      {/* {announcements && announcements.status && !props.showCategoryOnly ? (
        <Row className="site-layout-background" justify="center">
          <Col
            className={
              showBannerImg
                ? "announcementsContainer"
                : "announcementsContainer noImage"
            }
            span={16}
            xxl={12}
            xl={22}
            xs={24}
            s={24}
          >
            <Row gutter={24}>
              <Col {...announcementStyle} flex>
                <p
                  style={{ marginTop: 30, textAlign: "center" }}
                  dangerouslySetInnerHTML={{ __html: announcements.message }}
                ></p>
              </Col>
              {announcements.show_image && announcements.image_url ? (
                <Col
                  span={12}
                  xxl={12}
                  xl={10}
                  lg={12}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{ textAlign: "center" }}
                >
                  <img
                    src={announcements.image_url}
                    className="announcementsImage"
                    alt="avatar"
                    style={screenSize < 540 ? { width: 50 } : null}
                  />
                </Col>
              ) : null}
            </Row>
          </Col>
        </Row>
      ) : null} */}

      <Spin spinning={isLoadingProducts}>
        <Row
          type="flex"
          justify="start"
          style={{
            // padding: 24,
            marginLeft: window.innerWidth * 0.03,
            marginRight: window.innerWidth * 0.03,
          }}
        >
          <Title level={2} className="prodcat-col productTitleText">
            <span className="storeTitle" id="categories" ref={scrollRef}>
              CATEGORIES
            </span>
          </Title>
          <div style={{ marginBottom: 30 }}>
            <Row gutter={24} justify="center">
              {categories}
            </Row>
            {/* <ScrollMenu
              alignCenter={false}
              wheel={false}
              selected={selectedCatKey}
              scrollToSelected={true}
              data={categories}
              arrowLeft={screenSize > 768 ? ArrowLeft : null}
              arrowRight={screenSize > 768 ? ArrowRight : null}
              // selected={selected}
              // onSelect={this.onSelect}
            /> */}
          </div>
        </Row>
      </Spin>
      {!displayShowAll ? (
        <Spin spinning={isLoadingProducts}>
          {products && products.length ? (
            <Row
              gutter={24}
              type="flex"
              justify="start"
              style={{
                padding: 0,
                marginBottom: 60,
                marginLeft: window.innerWidth * 0.05,
                marginRight: window.innerWidth * 0.05,
              }}
            >
              {activeStore ? (
                <div style={{ width: "100%" }}>
                  <div className="levelTwoDescription">
                    {storesCategories
                      ? storesCategories
                          .filter((e) => e.key === activeStore)
                          .map((store) =>
                            store.show_description ? (
                              <>
                                {/* <p className="descquestion">What is <strong>{store.name}?</strong></p> */}
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: store.description,
                                  }}
                                ></p>

                                <Divider />
                              </>
                            ) : null
                          )
                      : null}
                    {searchComponent}
                  </div>

                  <LazyLoad
                    height={200}
                    once
                    offset={100}
                    placeholder={
                      <img
                        src="assets/images/loading.gif"
                        style={{
                          height: "80px",
                          width: "80px",
                          position: "absolute",
                          right: "45%",
                        }}
                      />
                    }
                    debounce={500}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {Object.keys(product_data).map((prodcat, index) => (
                        <React.Fragment key={index}>
                          <Title
                            level={2}
                            className="prodcat-col productTitleText"
                          >
                            <span className="productTitle">{prodcat}</span>
                          </Title>
                          {product_data[prodcat].map((product, index) => (
                            <React.Fragment key={index}>
                              <ProductCard key={index} product={product} />
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </LazyLoad>
                </div>
              ) : (
                <div style={{ width: "100%" }}>
                  <div className="levelTwoDescription">{searchComponent}</div>

                  <LazyLoad
                    height={200}
                    once
                    offset={100}
                    placeholder={
                      <img
                        src="assets/images/loading.gif"
                        style={{
                          height: "80px",
                          width: "80px",
                          position: "absolute",
                          right: "45%",
                        }}
                      />
                    }
                    debounce={500}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Row type="flex" justify="start">
                        <Col xxl={18} xl={16} lg={12} md={24}>
                          <Row gutter={24} type="flex" justify="start">
                            {Object.keys(product_data).map((prodcat, index) => (
                              <React.Fragment key={index}>
                                <Title
                                  level={2}
                                  className="prodcat-col productTitleText"
                                >
                                  <span className="productTitle">
                                    {prodcat}
                                  </span>
                                </Title>

                                {product_data[prodcat].map(
                                  (product, index) =>
                                    index <
                                      productCardLimit -
                                        (product_data[prodcat].length >
                                        productCardLimit
                                          ? 1
                                          : 0) && (
                                      <React.Fragment key={index}>
                                        <AllProductCard
                                          key={index}
                                          product={product}
                                        />
                                      </React.Fragment>
                                    )
                                )}

                                {product_data[prodcat].length >
                                productCardLimit ? (
                                  <Col
                                    span={3}
                                    xl={3}
                                    xxl={3}
                                    lg={3}
                                    md={2}
                                    sm={24}
                                    xs={24}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div className="moreContainer">
                                      <Anchor
                                        affix={false}
                                        showInkInFixed={false}
                                      >
                                        <a href="#categories">
                                          <PlusCircleOutlined
                                            onClick={() => {
                                              setSelectedCatKey(
                                                product_data[prodcat][0]
                                                  .store_id
                                              );
                                              setActiveStore(
                                                product_data[prodcat][0]
                                                  .store_id
                                              );
                                              setDisplayShowAll(false);
                                            }}
                                            style={{
                                              color: "#87B144",
                                              fontSize: 50,
                                            }}
                                          />
                                        </a>
                                      </Anchor>
                                      <span className="moreText more">
                                        MORE
                                      </span>
                                    </div>
                                  </Col>
                                ) : null}
                              </React.Fragment>
                            ))}
                          </Row>
                        </Col>

                        <OrderSummary />
                        {/* <Col xxl={6} xl={8} lg={12} md={0}>
													<div>Test</div>
												</Col> */}
                      </Row>
                    </div>
                  </LazyLoad>
                </div>
              )}
            </Row>
          ) : (
            <Row align="center" style={{ textAlign: "center" }}>
              <Empty
                align="center"
                description="No items available for purchase"
              />
            </Row>
          )}

          {emptyProduct}
        </Spin>
      ) : (
        <Spin spinning={isLoadingProducts}>
          {products && products.length && (
            <Row
              gutter={24}
              type="flex"
              justify="start"
              style={{
                padding: 24,
                marginBottom: 60,
                marginLeft: window.innerWidth * 0.05,
                marginRight: window.innerWidth * 0.05,
              }}
            >
              <div className="lessContainer">
                <MinusCircleOutlined
                  style={{ color: "#87B144" }}
                  onClick={() => {
                    setDisplayShowAll(false);
                  }}
                />
                <span className="moreText less">LESS (GO BACK)</span>
              </div>
              <React.Fragment>
                <Title level={2} className="prodcat-col productTitleText">
                  <span className="productTitle">{selectedCatName}</span>
                </Title>

                {product_data[selectedProductData].map((product, index) => (
                  <React.Fragment key={index}>
                    <ProductCard key={index} product={product} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            </Row>
          )}
        </Spin>
      )}

      {orders && orders.length ? (
        <>
          <div className="summaryContainer">
            <Button
              className="fixedSummaryButton"
              onClick={() => setShowSummaryModal(true)}
            >
              <strong className="summaryText">Order Summary</strong>
            </Button>
          </div>
          <SummaryModalComponent
            show={showSummaryModal}
            onCancel={() => setShowSummaryModal(false)}
          />
        </>
      ) : (
        ""
      )}

      {/* <img src="assets/images/arrow-up-orange.png" alt="" className="arrowup" /> */}
      <div class="arrow" onClick={executeScroll}>
        <span></span>
        <span></span>
      </div>
      <div>
        <p
          style={{
            fontSize: "13px",
            position: "fixed",
            right: "15px",
            bottom: "1px",
          }}
        >
          Back to Top
        </p>
      </div>
    </>
  );
};

export default Shop;
