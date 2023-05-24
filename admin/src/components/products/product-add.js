import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
} from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import Swal from "sweetalert2";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { uniqueId } from "lodash";

const { Option } = Select;

const ProductAdd = () => {
  const { database, storage } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [photoUrl, setPhotoUrl] = useState();
  const [storesCategory, setStoresCategory] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [descriptionCount, setDescriptionCount] = useState(100);
  const [form] = Form.useForm();
  const [statusRawPrice, setStatusRawPrice] = useState();
  const { userInfoStore, userInfoRole } = useContext(AuthContext);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  let storesCategoryArray = [];
  let productCategoryArray = [];

  let productsArray = new Array();
  database.ref("unit_type").on("value", (snapshot) => {
    if (snapshot.val()) {
      const productsObject = snapshot.val();
      productsArray = Object.entries(productsObject).map((item) => {
        item[1].key = item[0];
        // console.log(item);
        return (
          <Select.Option key={item[0]} value={item[0]}>
            {item[1]["name"]}
          </Select.Option>
        );
      });
    }
  });

  // let productsCategoryArray = new Array();
  // database.ref("products_category").on("value", (snapshot) => {
  //   if (snapshot.val()) {
  //     const productsObject = snapshot.val();
  //     productsCategoryArray = Object.entries(productsObject).map((item) => {
  //       item[1].key = item[0];
  //       // console.log(item);
  //       return <Select.Option key={item[0]} value={item[0]}>{item[1]['name']}</Select.Option>;
  //     });
  //   }
  // });

  useEffect(() => {
    // if (handleShow) {
    form.setFieldsValue({
      description: "",
      notes: "",
      kgPerPiece: "",
      price: "",
      raw_price: "",
      mall_price: "",
    });
    // }
  }, [form]);

  useEffect(() => {
    if (!storesCategory.length) {
      // console.log('Fetch Store cat');
      getStoreCategories();
    }
  }, []);
  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  //   if (!isJpgOrPng) {
  //     message.error("You can only upload JPG/PNG file!");
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error("Image must smaller than 2MB!");
  //   }
  //   return isJpgOrPng && isLt2M;
  // };

  const getStoreCategories = () => {
    if (userInfoRole == "admin") {
      database.ref("categories").on("value", (snapshot) => {
        if (snapshot.val()) {
          const categories = snapshot.val();
          setStoresCategory(categories);
        }
      });
    } else {
      database
        .ref("categories")
        .orderByKey()
        .equalTo(String(userInfoStore))
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            const categories = snapshot.val();
            setStoresCategory(categories);
          }
        });
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info) => {
    let photo_index = info.fileList.length - 1;

    getBase64(info.fileList[photo_index].originFileObj, (imageUrl) => {
      setPhotoUrl(imageUrl);
    });

    // if (info.file.status === "done") {
    //   getBase64(info.file.originFileObj, (imageUrl) => {
    //     console.log(imageUrl);
    //     setPhotoUrl(imageUrl);
    //   });
    // }
  };

  if (storesCategory) {
    storesCategoryArray = Object.keys(storesCategory).map((key) => {
      return (
        <Option key={key} value={key}>
          {storesCategory[key].name}
        </Option>
      );
    });
  }

  const handleStoreChanged = (key) => {
    if (storesCategory[key].children) {
      setProductCategories(storesCategory[key].children);
      form.setFieldsValue({ product_category: "" });
    } else {
      setProductCategories(null);
      productCategoryName = "";
      form.setFieldsValue({ product_category: "" });
    }

    let rawPrice_status = "";
    database.ref("categories/" + key).on("value", (snapshot) => {
      if (snapshot.val()) {
        const keyVal = snapshot.val();
        rawPrice_status = keyVal.statusRawPrice;
        setStatusRawPrice(rawPrice_status);
        // console.log(rawPrice_status);
      }
    });
  };

  if (productCategories) {
    productCategoryArray = Object.keys(productCategories).map((id) => {
      return (
        <Option key={id} value={id}>
          {productCategories[id].name}
        </Option>
      );
    });
  }

  let productCategoryName = "";
  const handleProductCategoryChanged = (e, event) => {
    productCategoryName = event.children;
  };

  const submitForm = (product) => {
    const storageRef = storage.ref("products");

    const processForm = (photo) => {
      if (product.raw_price) {
        if (
          product.raw_price &&
          parseFloat(product.raw_price) >= parseFloat(product.price)
        ) {
          Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Your RAW PRICE is higher than your SELLING PRICE",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }).then((result) => {
            if (result.value) {
              let updates = {};
              // image upload to be followed
              // const defaultFile =
              // "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

              const defaultFile =
                "https://firebasestorage.googleapis.com/v0/b/sureplusfoods-42617.appspot.com/o/products%2Flogo.png?alt=media&token=491b29c8-d9be-4703-a634-14c7d235ab19";
              product.file = photo || defaultFile;
              product.product_category_name =
                productCategoryName || storesCategory[product.store_id].name;
              product.storecategory_order =
                storesCategory[product.store_id].store_category_order;
              delete product.picture;
              // product key
              const name = product.name.toLowerCase();
              const replaced = name.split(" ").join("_");
              product.key = uniqueId(`${replaced}_`);

              database
                .ref("products")
                .push(product)
                .then(() => {
                  form.resetFields();
                  form.setFieldsValue({
                    kgPerPiece: "",
                    price: "",
                    raw_price: "",
                    mall_price: "",
                    description: "",
                    notes: "",
                  });

                  message.success("Product Added!");
                  setShow(false);
                });

              // updates["products/" + product["key"]] = product;
              // database.ref().update(updates);
              // form.resetFields();
              // setShow(false);
            } else if (result.dismiss == "cancel") {
              console.log("cancelled");
            }
          });
        } else {
          let updates = {};
          // image upload to be followed
          // const defaultFile =
          //   "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";
          const defaultFile =
            "https://firebasestorage.googleapis.com/v0/b/sureplusfoods-42617.appspot.com/o/products%2Flogo.png?alt=media&token=491b29c8-d9be-4703-a634-14c7d235ab19";

          product.file = photo || defaultFile;
          product.product_category_name =
            productCategoryName || storesCategory[product.store_id].name;
          product.storecategory_order =
            storesCategory[product.store_id].store_category_order;
          delete product.picture;
          // product key
          const name = product.name.toLowerCase();
          const replaced = name.split(" ").join("_");
          product.key = uniqueId(`${replaced}_`);

          database
            .ref("products")
            .push(product)
            .then(() => {
              form.resetFields();
              form.setFieldsValue({
                kgPerPiece: "",
                price: "",
                raw_price: "",
                mall_price: "",
                description: "",
                notes: "",
              });

              message.success("Product Added!");
              setShow(false);
            });

          // updates["products/" + product["key"]] = product;
          // database.ref().update(updates);
          // form.resetFields();
          // setShow(false);
        }
      } else {
        let updates = {};
        // image upload to be followed
        // const defaultFile =
        // "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

        const defaultFile =
          "https://firebasestorage.googleapis.com/v0/b/sureplusfoods-42617.appspot.com/o/products%2Flogo.png?alt=media&token=491b29c8-d9be-4703-a634-14c7d235ab19";

        product.file = photo || defaultFile;
        product.product_category_name =
          productCategoryName || storesCategory[product.store_id].name;
        product.storecategory_order =
          storesCategory[product.store_id].store_category_order;
        delete product.picture;
        // product key
        const name = product.name.toLowerCase();
        const replaced = name.split(" ").join("_");
        product.key = uniqueId(`${replaced}_`);

        database
          .ref("products")
          .push(product)
          .then(() => {
            form.resetFields();
            form.setFieldsValue({
              kgPerPiece: "",
              price: "",
              raw_price: "",
              mall_price: "",
              description: "",
              notes: "",
            });
            setShow(false);
          });

        message.success("Product Added!");
        setShow(false);

        // updates["products/" + product["key"]] = product;
        // database.ref().update(updates);
        // form.resetFields();
        // setShow(false);
      }
    };

    const uploadFile = (err) => {
      const uploadTask = storage
        .ref(`/products/${product.picture.file.name}`)
        .put(product.picture.file);

      uploadTask.on(
        "state_changed",
        (snapShot) => {},
        (err) => {
          message.error(err);
        },
        () => {
          storage
            .ref("products")
            .child(product.picture.file.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              processForm(fireBaseUrl);
            });
        }
      );
    };

    if (product.picture) {
      storageRef
        .child(product.picture.file.name)
        .getDownloadURL()
        .then(processForm, uploadFile);
    } else {
      processForm();
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const count = 100 - text.length;
    setDescriptionCount(count);
  };

  return (
    <div>
      <button
        className="ant-btn ant-btn-primary"
        variant="primary"
        onClick={handleShow}
      >
        Add Product
      </button>
      <Modal
        title={"Add Product"}
        visible={show}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleClose}
        maskClosable="false"
      >
        <Form {...layout} form={form} onFinish={submitForm}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Picture"
            name="picture"
            rules={[{ required: true }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                <div>
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Description">
            <Form.Item name="description" style={{ marginBottom: 5 }}>
              <Input.TextArea
                style={{ width: "100%" }}
                autoSize={{ minRows: "3", maxRows: "5" }}
                maxLength="100"
                onChange={handleDescriptionChange}
              />
            </Form.Item>
            <p style={{ fontSize: 13 }}>
              Limit of 100 characters. ({descriptionCount} Left)
            </p>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea
              style={{ width: "100%" }}
              autoSize={{ minRows: "3", maxRows: "5" }}
            />
          </Form.Item>

          <Form.Item
            label="Tier 2 Category"
            name="store_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Choose a tier 2 category"
              onChange={handleStoreChanged}
            >
              {storesCategoryArray}
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Category"
            name="product_category"
            // rules={[{ required: productCategories ? true : false }]}
          >
            <Select
              onChange={handleProductCategoryChanged}
              placeholder="Choose a category"
            >
              <Option value="">None</Option>
              {productCategoryArray}
            </Select>
          </Form.Item>

          <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
            <Select>{productsArray}</Select>
          </Form.Item>
          <Form.Item label="Kg per unit">
            <Form.Item name="kgPerPiece">
              <InputNumber min={0} />
            </Form.Item>
            <small>
              Kg per unit is applicable only for piece, tray, bundle and set
            </small>
          </Form.Item>

          <Form.Item
            label="Increment"
            name="increment"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Purchase Limit"
            name="limit"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          {statusRawPrice == "enabled" ? (
            <Form.Item
              label="Raw Price"
              name="raw_price"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          ) : (
            ""
          )}

          <Form.Item label="Selling Price" name="price">
            <Input />
          </Form.Item>

          <Form.Item label="Others' Price" name="mall_price">
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row justify="end">
              <Button
                style={{
                  background: "#d86060",
                  color: "#ffffff",
                  marginRight: 10,
                }}
                htmlType="reset"
                onClick={() => {
                  form.resetFields();
                }}
              >
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Add Product
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductAdd;
