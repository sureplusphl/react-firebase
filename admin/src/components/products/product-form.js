import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Input,
  Select,
  InputNumber,
  message,
  Upload,
} from "antd";
import { ProductsContext } from "../../shared/contexts/products.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { AuthContext } from "../../shared/contexts/auth.context";
import Swal from "sweetalert2";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductForm = () => {
  const { database, storage } = useContext(FirebaseContext);
  const [storesCategory, setStoresCategory] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [descriptionCount, setDescriptionCount] = useState(100);
  const [photoUrl, setPhotoUrl] = useState();
  const [statusRawPrice, setStatusRawPrice] = useState(0);
  const { userInfoStore, userInfoRole, userInfoCate } = useContext(AuthContext);

  let storesCategoryArray = [];
  let productCategoryArray = [];

  const {
    isShowProductFormModal,
    closeProductFormModal,
    selectedProduct,
    saveProduct,
    isLoading,
  } = useContext(ProductsContext);

  const [form] = Form.useForm();
  useEffect(() => {
    if (isShowProductFormModal) {
      if (
        selectedProduct &&
        Object.keys(selectedProduct) &&
        Object.keys(selectedProduct).length
      ) {

        if (!selectedProduct.description || !selectedProduct.notes) {
          form.setFieldsValue({
            description: '',
            notes: ''
          });
        }

        if(!selectedProduct.raw_price) {
          form.setFieldsValue({
            raw_price: ''
          });
        }

        form.setFieldsValue({
          ...selectedProduct,
        });
        if (selectedProduct.store_id) {

          // if(selectedProduct.file) {
          //   const imagep = selectedProduct.file.substring(0, 5) == "https" ? "" : "/assets/images/";
          //   // {`${imagep}${product.file}`}
          //   const nimg = imagep + selectedProduct.file;
          //   setPhotoUrl(nimg);
          // }

          setPhotoUrl(selectedProduct.file);
          fetchProductCategories(selectedProduct);
          fetchStatusRP(selectedProduct.store_id);
        }
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
    getStoreCategories();
  }, [isShowProductFormModal, form]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  const getStoreCategories = () => {

    if(userInfoRole == 'admin') {
      database.ref("categories").on("value", (snapshot) => {
        if (snapshot.val()) {
          const categories = snapshot.val();
          setStoresCategory(categories);
        }
      });
    }
    else {
      database.ref("categories").orderByKey().equalTo(String(userInfoStore)).on("value", (snapshot) => {
        if (snapshot.val()) {
          const categories = snapshot.val();
          setStoresCategory(categories);
        }
      })
    }
    
  }

  const fetchProductCategories = (value) => {
    database.ref("categories").child(value.store_id).child("children").on("value", (snapshot) => {
      setProductCategories(snapshot.val());
    })
  }

  let productsArray = new Array();
  database.ref("unit_type").on("value", (snapshot) => {
    if (snapshot.val()) {
      const productsObject = snapshot.val();
      productsArray = Object.entries(productsObject).map((item) => {
        item[1].key = item[0];
        // console.log(item);
        return <Select.Option key={item[0]} value={item[0]}>{item[1]['name']}</Select.Option>;
      });
    }
  });



  const fetchStatusRP = (storeID) => {
    let rawPrice_status = '';
    database.ref("categories/" + storeID).on("value", (snapshot) => {
      if (snapshot.val()) {
        const keyVal = snapshot.val();
        // console.log(keyVal);
        rawPrice_status = keyVal.statusRawPrice;
        setStatusRawPrice(rawPrice_status);
      }
    });
  }


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

  if (storesCategory) {
    storesCategoryArray = Object.keys(storesCategory).map((key) => {
      return <Option key={key} value={key}>{storesCategory[key].name}</Option>;
    });
  }

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const count = 100 - text.length;
    setDescriptionCount(count);
  }

  const handleStoreChanged = (key) => {

    form.setFieldsValue({ storecategory_order: storesCategory[key].store_category_order });

    if (storesCategory[key].children) {
      setProductCategories(storesCategory[key].children);

      if (selectedProduct.product_category) {
        form.setFieldsValue({ product_category_name: selectedProduct.product_category_name });
        form.setFieldsValue({ product_category: selectedProduct.product_category });
      } else {
        form.setFieldsValue({ product_category_name: storesCategory[key].name });
        form.setFieldsValue({ product_category: '' });
      }
    } else {
      setProductCategories(null);
      form.setFieldsValue({ product_category_name: storesCategory[key].name });
      form.setFieldsValue({ product_category: "" });
    }

    fetchStatusRP(key);
  }

  if (productCategories) {
    productCategoryArray = (Object.keys(productCategories).map((id) => {
      return <Option key={id} value={id}>{productCategories[id].name}</Option>;
    }));
  }

  let productCategoryName = "";
  const handleProductCategoryChanged = (e, event) => {
    productCategoryName = e ? event.children : storesCategory[form.getFieldValue("store_id")].name;
  }


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

  const submitForm = (order) => {
    const storageRef = storage.ref('products');

    if (productCategoryName) {
      order.product_category_name = productCategoryName;
    }

    // DELETE THIS AFTER PRODUCT UPDATE
    // database.ref('products').push(order).then(() => {
    //   form.resetFields();
    //   form.setFieldsValue({
    //     kgPerPiece: "",
    //     price: "",
    //     raw_price: "",
    //     mall_price: "",
    //     description: "",
    //     notes: "",
    //   });
    // });

    // UNCOMMENT THIS AFTER PRODUCT UPDATE

    const processForm = (photo) => {
      delete order.picture;
      // let updates = {};
      // image upload to be followed
      // const defaultFile =
      //   "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

      if (photo) {
        order.file = photo;
      } else {
        order.file = order.file;
      }

      if (order.raw_price) {
        if (order.raw_price &&
          parseFloat(order.raw_price) >= parseFloat(order.price)) {
          Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "Your RAW PRICE is higher than your SELLING PRICE",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              saveProduct(order);
            }
            else if (result.dismiss == "cancel") {
              console.log('cancelled');
            }
          });
        }
        else {
          saveProduct(order);
        }
      }
      else {
        saveProduct(order);
      }

    };

    const uploadFile = (err) => {
      
      const uploadTask = storage
        .ref(`/products/${order.file.file.name}`)
        .put(order.file.file);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
        },
        (err) => {
          message.error(err);
        },
        () => {
          storage
            .ref("products")
            .child(order.file.file.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              processForm(fireBaseUrl);
            });
        }
      );

    }

    if (order.file && typeof (order.file) === 'object') {
      storageRef.child(order.file.file.name).getDownloadURL().then(processForm, uploadFile);
    } else {
      // delete order.picture;
      processForm();
    }


  };

  return (
    <Modal
      title={`Product Info: ${selectedProduct.name || ""}`}
      visible={isShowProductFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeProductFormModal}
      maskClosable="false"
    >
      <Form {...layout} form={form} onFinish={submitForm}>
        <Spin spinning={isLoading}>
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item style={{ display: "none" }} name="product_category_name">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item style={{ display: "none" }} name="storecategory_order">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Picture"
            name="file"
          // valuePropName="fileList"
          // rules={[{ required: true }]}
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
                <div>
                  <div style={{marginBottom:'10px', border:'1px solid'}}>
                    <div className="ant-upload-text"><UploadOutlined/> Upload</div>
                  </div>
                  <img src={photoUrl} alt="avatar" style={{ width: "100%" }} />
                </div>
                
              ) : (
                  <div>
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
            </Upload>
          </Form.Item>

          <Form.Item label="Description">
            <Form.Item name="description" style={{ marginBottom: 5 }}>
              <Input.TextArea style={{ width: '100%' }} autoSize={{ minRows: "3", maxRows: "5" }} maxLength="100" onChange={handleDescriptionChange} />
            </Form.Item>
            <p style={{ fontSize: 13 }}>Limit of 100 characters. ({descriptionCount} Left)</p>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea style={{ width: '100%' }} autoSize={{ minRows: "3", maxRows: "5" }} />
          </Form.Item>

          <Form.Item
            label="Tier 2 Category"
            name="store_id"
            rules={[{ required: true }]}
          >
            <Select placeholder="Choose a tier 2 category" onChange={handleStoreChanged}>
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
              placeholder="Choose a category">
              <Option value="">None</Option>
              {productCategoryArray}
            </Select>
          </Form.Item>

          <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
            <Select>
              {productsArray}
            </Select>
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

          {
            statusRawPrice == 'enabled' ? (
              <Form.Item label="Raw Price" name="raw_price">
                <Input />
              </Form.Item>
            ) : ''
          }

          <Form.Item label="Selling Price" name="price">
            {
              selectedProduct.raw_price &&
                parseFloat(selectedProduct.raw_price) >= parseFloat(selectedProduct.price) ? (
                  <Input style={{ background: '#f34646' }} />
                ) : (
                  <Input />
                )
            }
          </Form.Item>

          <Form.Item label="Others' Price" name="mall_price">
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row justify="end">
              <Button
                style={{ background: "#d86060", color: "#ffffff", marginRight: 10 }}
                htmlType="reset"
                onClick={() =>
                  form.setFieldsValue({
                    mall_price: 0,
                    limit: 0,
                    price: 0,
                    stock: 0,
                    increment: 0,
                    kgPerPiece: 0,
                  })
                }
              >
                Reset
                </Button>
              <Button type="primary" htmlType="submit">
                Update Product
                </Button>
            </Row>
          </Form.Item>
        </Spin>
      </Form>
    </Modal >
  );
};

export default ProductForm;
