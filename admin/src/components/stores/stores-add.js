import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Upload,
  message,
  Switch,
  Select
} from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import { CategoryContext } from "../../shared/contexts/category.context";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const StoresAdd = () => {
  const { storage, database } = useContext(FirebaseContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [photoUrl, setPhotoUrl] = useState();
  const [description, setDescription] = useState("")
  const [form] = Form.useForm();

  const {
    saveStoreCategory,
    storeCategories
  } = useContext(CategoryContext);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  useEffect(() => {
    if (handleShow) {
      form.setFieldsValue({
        show_description: false
      });
    }
  }, []);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info) => {
    console.log({ info });

    let photo_index = info.fileList.length - 1;

    getBase64(info.fileList[photo_index].originFileObj, (imageUrl) => {
      console.log(imageUrl);
      setPhotoUrl(imageUrl);
    });

    // if (info.file.status === "done") {
    //   getBase64(info.file.originFileObj, (imageUrl) => {
    //     console.log(imageUrl);
    //     setPhotoUrl(imageUrl);
    //   });
    // }

  };

  // count store category for 'product order' column
  let numArrayCategories = [];
  for (let i = 1; i <= storeCategories.length + 1; i++) {
    numArrayCategories.push(<Option key={i} value={i}>{i}</Option>);
  }

  const submitForm = (store) => {

    store.description = description;

    const processForm = (photo) => {
      const defaultFile =
          "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

      store.file = photo || defaultFile;
      delete store.picture;

      store.statusOthersPrice = store.statusOthersPrice === true ? 'enabled': 'disabled';
      store.statusKgPerUnit = store.statusKgPerUnit === true ? 'enabled': 'disabled';
      store.statusRawPrice = store.statusRawPrice === true ? 'enabled': 'disabled';


      saveStoreCategory(store, true);
      handleClose();
    };

    if (store.picture) {
      const uploadTask = storage
        .ref(`/store/${store.picture.file.name}`)
        .put(store.picture.file);

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          console.log(snapShot);
        },
        (err) => {
          message.error(err);
        },
        () => {
          storage
            .ref("store")
            .child(store.picture.file.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              processForm(fireBaseUrl);
            });
        }
      );
    } else {
      processForm();
    }
  };

  return (
    <div>
      <button
          className="ant-btn ant-btn-primary"
          variant="primary"
          onClick={handleShow}
        >
          Add Level 2 Category
        </button>
      <div
        className="ant-divider ant-divider-horizontal"
        role="separator"
      ></div>
      <Modal
        title={"Add Tier 2 Category"}
        visible={show}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleClose}
        maskClosable="false"
      >
        <Form {...layout} form={form} onFinish={submitForm}>
          <Form.Item
            label="Picture"
            name="picture"
            valuePropName="fileLest"
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

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Category Order"
            name="store_category_order"
            rules={[{ required: true }]}
          >
            <Select placeholder="Choose a number" >
              {numArrayCategories}
            </Select>
          </Form.Item>

          <Form.Item
            name="show_description"
            valuePropName="checked"
            label="Show Description"MeDescssage
          >
            <Switch
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Form.Item label="Description">
            {/* <Input.TextArea style={{ width: '100%' }} autoSize={{minRows:"3", maxRows:"5"}} /> */}
            <ReactQuill theme="snow" value={description} onChange={setDescription} />
          </Form.Item>

          <Form.Item
            name="statusOthersPrice"
            valuePropName="checked"
            label="Other's Price"
          >
            <Switch
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Form.Item
            name="statusKgPerUnit"
            valuePropName="checked"
            label="Kg Per Unit"
          >
            <Switch
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>


          <Form.Item
            name="statusRawPrice"
            valuePropName="checked"
            label="Raw Price"
          >
            <Switch
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row justify="end">
              <Button
                style={{ background: "#d86060", color: "#ffffff", marginRight: 10 }}
                htmlType="reset"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Add Category
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoresAdd;
