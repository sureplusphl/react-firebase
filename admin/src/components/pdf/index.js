import React, { useContext, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
// import MyDocument from './pdf';
import { FirebaseContext } from "../../shared/contexts/firebase.context";

// Register font
Font.register({
  family: "CutiveMono",
  fonts: [
    { src: "/assets/fonts/CutiveMono-Regular.ttf" }, // font-style: normal, font-weight: normal
  ],
});
Font.register({
  family: "RobotoSlab",
  fonts: [{ src: "/assets/fonts/RobotoSlab-VariableFont_wght.ttf" }],
});

const img_path = "/assets/Sureplus Logo clear.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  row: {
    flexDirection: "row",
  },
  rowBorder: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    border: "1pt solid black",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionAddLeft: {
    flexGrow: 1,
    border: "1pt solid black",
    width: "285",
    padding: 5,
  },
  title: {
    fontSize: "18",
    marginBottom: 10,
  },
  titlePer: {
    fontSize: "11",
    fontFamily: "RobotoSlab",
  },
  text: {
    fontSize: "10",
    fontFamily: "CutiveMono",
  },
  image: {
    height: 50,
    width: 45,
    marginLeft: 250,
  },
  tblSection: {
    flexGrow: 1,
    border: "1pt solid black",
    padding: 5,
  },
  tblTitle: {
    fontFamily: "RobotoSlab",
    fontSize: "10",
  },
  tblText: {
    fontFamily: "CutiveMono",
    fontSize: "9",
  },
});

const MyDoc = (props) => {
  console.log("pdf props", props.data);

  return (
    <Document>
      {props.data
        ? props.data.map((a, index) => {
            return (
              <Page size="A4" style={styles.page}>
                <View>
                  {/* header info */}
                  <View style={styles.row}>
                    <View style={styles.section}>
                      <Text style={styles.title}>Order Form</Text>
                      <Text style={styles.titlePer}>
                        Tracking Code:{" "}
                        <Text style={styles.text}>
                          {a.tracking_code ? a.tracking_code : ""}
                        </Text>
                      </Text>
                      <Text style={styles.titlePer}>
                        Mode of Payment:{" "}
                        <Text style={styles.text}>
                          {a.payment_method ? a.payment_method : ""}
                        </Text>{" "}
                      </Text>
                    </View>
                    <View style={styles.section}>
                      <Image style={styles.image} source={`${img_path}`} />
                    </View>
                  </View>
                  {/* header info */}

                  {/* address info */}
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.sectionAddLeft,
                        { borderRight: "none", marginLeft: 10 },
                      ]}
                    >
                      <Text style={styles.titlePer}>Sold to</Text>
                      <Text style={styles.text}>
                        {a.info.full_name ? a.info.full_name : ""}
                      </Text>
                      <Text style={styles.text}>
                        {a.info.user_email ? a.info.user_email : ""}
                      </Text>
                    </View>
                    <View style={styles.sectionAddLeft}>
                      <Text style={styles.titlePer}>Delivered to</Text>
                      <Text style={styles.text}>
                        {a.info.full_address ? a.info.full_address : ""}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.sectionAddLeft,
                        { borderRight: "none", marginLeft: 10 },
                      ]}
                    >
                      <Text style={styles.titlePer}>Mobile/Landline</Text>
                      <Text style={styles.text}>
                        {a.info.phone ? a.info.phone : ""}
                      </Text>
                      <Text style={styles.text}>
                        {a.info.other_phone ? a.info.other_phone : ""}
                      </Text>
                    </View>
                    <View style={styles.sectionAddLeft}>
                      <Text style={styles.titlePer}>Address Notes</Text>
                      <Text style={styles.text}>
                        {a.info.address_notes ? a.info.address_notes : ""}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.sectionAddLeft, { marginLeft: 10 }]}>
                      <Text style={styles.titlePer}>Order Notes</Text>
                      <Text style={styles.text}>
                        {a.info.order_notes ? a.info.order_notes : ""}
                      </Text>
                    </View>
                  </View>
                  {/* address info */}

                  {/* list of orders */}
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.tblSection,
                        {
                          borderRight: "none",
                          marginLeft: 10,
                          marginTop: 20,
                          width: 20,
                        },
                      ]}
                    >
                      <Text style={styles.tblTitle}>Price/unit</Text>
                    </View>
                    <View
                      style={[
                        styles.tblSection,
                        { borderRight: "none", marginTop: 20, width: 170 },
                      ]}
                    >
                      <Text style={styles.tblTitle}>Item/Description</Text>
                    </View>
                    <View
                      style={[
                        styles.tblSection,
                        { borderRight: "none", marginTop: 20, width: 20 },
                      ]}
                    >
                      <Text style={styles.tblTitle}>Quantity</Text>
                    </View>
                    <View
                      style={[styles.tblSection, { width: 20, marginTop: 20 }]}
                    >
                      <Text style={styles.tblTitle}>Total</Text>
                    </View>
                  </View>

                  {a.items
                    ? a.items.map((e) => (
                        <View style={styles.row}>
                          <View
                            style={[
                              styles.tblSection,
                              {
                                borderRight: "none",
                                borderTop: "none",
                                marginLeft: 10,
                                width: 20,
                                marginTop: -5,
                              },
                            ]}
                          >
                            <Text style={styles.tblText}>
                              {e.price ? e.price : ""}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tblSection,
                              {
                                borderRight: "none",
                                borderTop: "none",
                                width: 170,
                                marginTop: -5,
                              },
                            ]}
                          >
                            <Text style={styles.tblText}>
                              {e.name ? e.name : ""}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tblSection,
                              {
                                borderRight: "none",
                                borderTop: "none",
                                width: 20,
                                marginTop: -5,
                              },
                            ]}
                          >
                            <Text style={styles.tblText}>
                              {e.kilo ? e.kilo : ""}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tblSection,
                              { borderTop: "none", width: 20, marginTop: -5 },
                            ]}
                          >
                            <Text style={styles.tblText}>
                              {e.subtotal ? e.subtotal : ""}
                            </Text>
                          </View>
                        </View>
                      ))
                    : ""}

                  <View style={[styles.row, { height: 20, marginTop: -15 }]}>
                    <View
                      style={[
                        styles.section,
                        { width: 360, textAlign: "right" },
                      ]}
                    >
                      <Text style={styles.tblTitle}>Goods Total</Text>
                    </View>
                    <View
                      style={[styles.section, { width: 20, textAlign: "left" }]}
                    >
                      <Text style={styles.tblTitle}>
                        {a.total_goods ? a.total_goods : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.row, { height: 20 }]}>
                    <View
                      style={[
                        styles.section,
                        { width: 360, textAlign: "right" },
                      ]}
                    >
                      <Text style={styles.tblTitle}>TOTAL WEIGHT (kgs)</Text>
                    </View>
                    <View
                      style={[styles.section, { width: 20, textAlign: "left" }]}
                    >
                      <Text style={styles.tblTitle}>
                        {a.total_kilos ? a.total_kilos : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.row, { height: 20 }]}>
                    <View
                      style={[
                        styles.section,
                        { width: 360, textAlign: "right" },
                      ]}
                    >
                      <Text style={styles.tblTitle}>PACKING FEE</Text>
                    </View>
                    <View
                      style={[styles.section, { width: 20, textAlign: "left" }]}
                    >
                      {/* <Text style={styles.tblTitle}>{parseFloat(a.total_goods) >= 1000 ? 
                  '0.00' : 
                  a.total_processFee ? a.total_processFee : 0.00}</Text> */}
                      <Text style={styles.tblTitle}>
                        {a.total_processFee ? a.total_processFee : 0.0}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.row, { height: 20 }]}>
                    <View
                      style={[
                        styles.section,
                        { width: 360, textAlign: "right" },
                      ]}
                    >
                      <Text style={styles.tblTitle}>SHIPPING CHARGE</Text>
                    </View>
                    <View
                      style={[styles.section, { width: 20, textAlign: "left" }]}
                    >
                      <Text style={styles.tblTitle}>
                        {parseFloat(a.total_goods) >= 1000
                          ? "0.00"
                          : a.total_shipping}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.row, { height: 20 }]}>
                    <View
                      style={[
                        styles.section,
                        { width: 360, textAlign: "right" },
                      ]}
                    >
                      <Text style={styles.tblTitle}>TOTAL AMOUNT DUE</Text>
                    </View>
                    <View
                      style={[styles.section, { width: 20, textAlign: "left" }]}
                    >
                      {/* <Text style={styles.tblTitle}>{parseFloat(a.total_goods) >= 1000 ? 
                  parseFloat(a.total_processFee ? a.total_processFee : 0) + parseFloat(a.total_goods) : 
                  parseFloat(a.total_processFee ? a.total_processFee : 0) + parseFloat(a.total_shipping) + parseFloat(a.total_goods)}</Text> */}
                      <Text style={styles.tblTitle}>
                        {parseFloat(
                          a.total_processFee ? a.total_processFee : 0
                        ) +
                          parseFloat(a.total_shipping) +
                          parseFloat(a.total_goods)}
                      </Text>
                    </View>
                  </View>

                  {/* list of orders */}

                  <View
                    style={[styles.row, { marginTop: 5, marginBottom: -10 }]}
                  >
                    <View style={styles.section}>
                      <Text style={styles.tblTitle}>Waiver:</Text>
                      <Text style={styles.tblText}>
                        This is to certify that the products I've received are
                        complete and in good condition
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.row, {}]}>
                    <View style={[styles.section, {}]}>
                      <Text
                        style={[
                          styles.tblText,
                          {
                            borderBottom: "1pt solid black",
                            width: 150,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {a.info.full_name ? a.info.full_name : ""}
                      </Text>
                      <Text
                        style={[
                          styles.tblTitle,
                          { width: 150, textAlign: "center" },
                        ]}
                      >
                        Buyer
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.section, {}]}>
                      <Text style={styles.tblTitle}>
                        Thank you for supporting Sureplus!
                      </Text>
                      <Text style={styles.tblText}>
                        This is to certify that the products I've received are
                        complete and in good condition
                      </Text>
                    </View>
                  </View>
                </View>
              </Page>
            );
          })
        : ""}
    </Document>
  );
};

const Pdf = () => {
  const { database } = useContext(FirebaseContext);
  const [fetchOrders, setOrder] = useState([]);
  const [open, setOpen] = useState(false);

  let orderfilter = new Array();
  const getOrder = () => {
    database.ref("orders").on("value", (snapshot) => {
      const ordersObject = (snapshot && snapshot.val()) || {};

      let ordersArray =
        (ordersObject &&
          Object.entries(ordersObject) &&
          Object.entries(ordersObject).length &&
          Object.entries(ordersObject).map((item) => {
            if (item[1].status == "processing") {
              item[1].key = item[0];
              return item[1];
            }
          })) ||
        [];

      const filtered = ordersArray.filter(function (el) {
        return el != null;
      });
      orderfilter = filtered;
      // ordersArray = _.sortBy(ordersArray, ["ordered_at"], ["asc"]);
      setOrder(orderfilter);
    });
  };

  useEffect(() => {
    getOrder();
    setOpen(true);
  }, []);

  return (
    <>
      {open && (
        <PDFDownloadLink
          document={<MyDoc data={fetchOrders} />}
          fileName="orderList.pdf"
          style={{
            textDecoration: "none",
            padding: "20px 100px",
            position: "absolute",
            left: "50%",
            top: "30%",
            color: "#fff",
            backgroundColor: "#096dd9",
            border: "1px solid ##096dd9",
            boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Click to Download Pdf"
          }
        </PDFDownloadLink>
      )}
    </>
  );
};

export default Pdf;
