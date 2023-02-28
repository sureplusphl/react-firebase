import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  Row,
  Button,
  Form,
  Spin,
  Input,
  Upload,
  message,
  Switch,
  Select
} from "antd";
import { CategoryContext } from "../../shared/contexts/category.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const StoresForm = () => {
  const { storage } = useContext(FirebaseContext);
  const [description, setDescription] = useState("")

  const {
    isShowCategoryFormModal,
    closeCategoryFormModal,
    selectedCategory,
    saveStoreCategory,
    isLoading,
    storeCategories,
  } = useContext(CategoryContext);

  const [form] = Form.useForm();
  const [photoUrl, setPhotoUrl] = useState();
  const [otherPrice, setOtherPrice] = useState();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  useEffect(() => {
    if (isShowCategoryFormModal) {
      if (selectedCategory) {

        if (!selectedCategory.show_description || !selectedCategory.description) {
          form.setFieldsValue({
            show_description: false,
            description: ''
          });
        }

        if (selectedCategory.description) {
          setDescription(selectedCategory.description);
        } else {
          setDescription('');
        }

        form.setFieldsValue({
          ...selectedCategory,
          statusOthersPrice: selectedCategory.statusOthersPrice === "enabled" ? true : false,
          statusKgPerUnit: selectedCategory.statusKgPerUnit === "enabled" ? true : false,
          statusRawPrice: selectedCategory.statusRawPrice === "enabled" ? true : false,
        });

        setPhotoUrl(selectedCategory.file);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "processing",
        });
      }
    }
  }, [isShowCategoryFormModal, form]);

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
  for (let i = 1; i <= storeCategories.length; i++) {
    numArrayCategories.push(<Option key={i} value={i}>{i}</Option>);
  }

  const submitForm = (store) => {

    store.description = description;

    const processForm = (photo) => {
      // const defaultFile =
      //     "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

      if (photo) {
        store.file = photo;
      }
      else {
        store.file = store.file;
      }

      store.statusOthersPrice = store.statusOthersPrice === true ? 'enabled' : 'disabled';
      store.statusKgPerUnit = store.statusKgPerUnit === true ? 'enabled' : 'disabled';
      store.statusRawPrice = store.statusRawPrice === true ? 'enabled' : 'disabled';

      saveStoreCategory(store, false);
    };

    if (store.file) {
      if (typeof (store.file) === 'object' && typeof (store.file) !== null) {
        const uploadTask = storage
          .ref(`/store/${store.file.file.name}`)
          .put(store.file.file);

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
              .child(store.file.file.name)
              .getDownloadURL()
              .then((fireBaseUrl) => {
                processForm(fireBaseUrl);
              });
          }
        );
      }
      else {
        processForm();
      }

    } else {
      processForm();
    }
  };

  return (
    <Modal
      title={`Tier 2 Category Info: ${selectedCategory.name || ""}`}
      visible={isShowCategoryFormModal}
      onOk={submitForm}
      footer={false}
      getContainer={false}
      keyboard={false}
      onCancel={closeCategoryFormModal}
      maskClosable="false"
    >
      <Form {...layout} form={form} onFinish={submitForm}>
        <Spin spinning={isLoading}>
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label="Picture"
            name="file"
          // valuePropName="fileLest"
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
            label="Show Description" MeDescssage
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
                Update Category
              </Button>
            </Row>
          </Form.Item>

        </Spin>
      </Form>
    </Modal>
  );
};

export default StoresForm;
