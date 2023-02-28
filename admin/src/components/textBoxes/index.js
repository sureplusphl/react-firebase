import React, { useContext, useEffect, useState } from "react";
import {
  Switch,
  Input,
  Row,
  Col,
  Form,
  Button,
  message,
  Spin,
  Layout,
  Collapse,
  Upload
} from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons'
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./styles.css";

const { Panel } = Collapse;

const { Content } = Layout;
const { TextArea } = Input;
const TextBoxes = () => {
  const [textBoxesSettings, setTextBoxesSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const [announcementMessage, setAnnouncementMessage] = useState("")

  const { database, storage } = useContext(FirebaseContext);

  const confirmationRef = React.createRef();
  const summaryRef = React.createRef();
  const announcementRef = React.createRef();

  const fetchTextBoxesSettings = () => {
    setIsLoading(true);
    database
      .ref("text_boxes_settings")
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          setTextBoxesSettings(snapshot.val());
        }
        setIsLoading(false);
      });
  };

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTextBoxesSettings();
  }, []);

  // useEffect(() => {

  // }, [announcementMessage])

  useEffect(() => {
    if (textBoxesSettings) {
      form.setFieldsValue(textBoxesSettings);
      if (textBoxesSettings.announcements && !textBoxesSettings.announcements.image_url) {
        form.setFieldsValue({
          announcements: {
            image_url: "",
            show_image: ''
          }
        });
      }
      setImageUrl(textBoxesSettings.announcements && textBoxesSettings.announcements.image_url)
      setAnnouncementMessage(textBoxesSettings.announcements && textBoxesSettings.announcements.message ? textBoxesSettings.announcements.message : '');
    } else {
      form.setFieldsValue({
        announcements: {
          status: "",
          message: "",
          image_url: "",
          show_image: ''
        },
        order_summary: {
          status: "",
          message: ""
        },
        confirmation: {
          status: "",
          message: ""
        }
      });
    }
  }, [textBoxesSettings])

  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  const onFinish = (values) => {

    const storageRef = storage.ref('announcements');

    values.announcements.message = announcementMessage;
    values.confirmation.message = confirmationRef.current.innerHTML;
    values.order_summary.message = summaryRef.current.innerHTML;

    const processForm = (photo) => {
      // const defaultFile =
      //     "https://firebasestorage.googleapis.com/v0/b/buyanihanph.appspot.com/o/products%2Flogo.png?alt=media&token=ccc39378-3e77-4764-b38d-ea0258d27e29";

      // values.announcements.image_url = photo || defaultFile;
      delete values.announcements.image;

      if (photo) {
        values.announcements.image_url = photo;
      }
      else {
        values.announcements.image_url = values.announcements.image_url;
      }


      database
        .ref("text_boxes_settings")
        .update(values)
        .then((res) => {
          message.success("Text boxes settings saved!");
        })
        .catch((error) => {
          message.error(error);
        });
    };


    const uploadFile = (err) => {
      const uploadTask = storage
        .ref(`/announcements/${values.announcements.image_url.file.name}`)
        .put(values.announcements.image_url.file);

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
            .child(values.announcements.image_url.file.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              processForm(fireBaseUrl);
            });
        }
      );
    }

    if (values.announcements.image_url && typeof (values.announcements.image_url) === 'object') {
      storageRef.child(values.announcements.image_url.file.name).getDownloadURL().then(processForm, uploadFile);
    } else {
      processForm();
    }
  };

  const handleThemeOptionIcon = (options) => {
    let panelIcon = <PlusSquareOutlined />;

    if (options.isActive) {
      panelIcon = <MinusSquareOutlined />;
    }

    return panelIcon;
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleImageChange = (info) => {
    let photo_index = info.fileList.length - 1;
    getBase64(info.fileList[photo_index].originFileObj, (imageUrl) => {
      setImageUrl(imageUrl);
    });
  };

  return (
    <Content style={{ display: "flex", width: "100%" }}>
      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Spin spinning={isLoading}>
          <div style={{ margin: 50 }}>
            <Collapse expandIcon={handleThemeOptionIcon} ghost defaultActiveKey="1" style={{ marginBottom: 15 }}>
              <Panel header="Announcements" key="1">
                <div>
                  <Form.Item
                    name={["announcements", "status"]}
                    valuePropName={"checked"}
                    label="Show"
                  >
                    <Switch
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                    />
                  </Form.Item>
                  <Form.Item label="Message">
                    <ReactQuill theme="snow" value={announcementMessage} onChange={setAnnouncementMessage} />
                    {/* <div
                    dangerouslySetInnerHTML={{ __html: textBoxesSettings && textBoxesSettings?.announcements?.message }}
                    contentEditable="true"
                    className="editableDiv"
                    ref={announcementRef}>
                  </div> */}
                  </Form.Item>
                  {/* <Form.Item name={["announcements", "message"]} label="Message">
                    <TextArea style={{ width: '100%' }} autoSize={{ minRows: "3", maxRows: "5" }} />
                  </Form.Item> */}
                  <Form.Item
                    name={["announcements", "show_image"]}
                    valuePropName={"checked"}
                    label="Show Picture"
                  >
                    <Switch
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Picture"
                    name={["announcements", "image_url"]}
                    valuePropName="fileLest"
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      onChange={handleImageChange}
                      beforeUpload={() => false}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                      ) : (
                          <div>
                            <div className="ant-upload-text">Upload</div>
                          </div>
                        )}
                    </Upload>
                  </Form.Item>
                  
                </div>
              </Panel>
              <Panel header="Order Summary" key="2" forceRender>
                <div>
                  <Form.Item
                    name={["order_summary", "status"]}
                    valuePropName="checked"
                    label="Show"
                  >
                    <Switch
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                    />
                  </Form.Item>
                  <Form.Item label="Message">
                    {/* <TextArea style={{ width: '100%' }} autoSize={{minRows:"5", maxRows:"7"}} /> */}
                    <div
                      dangerouslySetInnerHTML={{ __html: textBoxesSettings && textBoxesSettings?.order_summary?.message }}
                      contentEditable="true"
                      className="editableDiv"
                      ref={summaryRef}>
                    </div>
                  </Form.Item>
                </div>
              </Panel>
              <Panel header="Confirmation Page" key="3" forceRender>
                <div>
                  <Form.Item
                    name={["confirmation", "status"]}
                    valuePropName="checked"
                    label="Show"
                  >
                    <Switch
                      checkedChildren="Enabled"
                      unCheckedChildren="Disabled"
                    />
                  </Form.Item>
                  <Form.Item label="Message">
                    {/* <TextArea style={{ width: '100%' }} autoSize={{minRows:"5", maxRows:"7"}} /> */}
                    <div
                      dangerouslySetInnerHTML={{ __html: textBoxesSettings && textBoxesSettings?.confirmation?.message }}
                      contentEditable="true"
                      className="editableDiv"
                      ref={confirmationRef}>
                    </div>
                  </Form.Item>
                </div>
              </Panel>
            </Collapse>
            <Form.Item>
              <Button htmlType="submit">Save Settings</Button>
            </Form.Item>
          </div>
        </Spin>
      </Form>
    </Content>
  );
};

export default TextBoxes;
