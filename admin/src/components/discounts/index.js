import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
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
  Select,
  InputNumber,
  Typography,
  Tabs,
  TimePicker,
  Col,
  DatePicker,
  Table,
  Popconfirm,
} from "antd";
import moment from "moment-timezone";

const { Option } = Select;


const Index = () => {
  const { database } = useContext(FirebaseContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [discountsData, setDiscountsData] = useState();
  const [showPeso, setShowPeso] = useState(false);
  const [showPesoEdit, setShowPesoEdit] = useState(false);
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { span: 24 },
  };

  const handleShow = () => {
    setModalOpen(true);
  }
  const handleHide = () => {
    setModalOpen(false);
  }

  const onFinishFailed = () => {
    message.error("Please fill all the required fields");
  };

  const onChangeType = (e) => {
    if(e === "peso") {
      setShowPeso(true);
    }
    else if(e === "percent") {
      setShowPeso(false);
    }
  }

  // add discounts
  const submitForm = (discount) => {
    discount.discount_enable = discount.discount_enable === true ? discount.discount_enable : false;
    if (discount.date_limit) {
        discount.discount_start = discount.date_limit[0].format();
        discount.discount_end = discount.date_limit[1].format();
    } else {
        discount.discount_start = "";
        discount.discount_end = "";
    }
    delete discount.date_limit;
    // discount.date_limit = discount.date_limit ? moment(discount.date_limit).format() : "";



    const discountKey = database
    .ref(
      "discounts"
    ).push(discount).key;

    // adding generated key on child
    discount.key = discountKey;
    database
      .ref(
        `discounts/${discountKey}`
      )
      .update(discount)
      .then(() => {
        message.success("Discount Created!");
      });


    form.resetFields();
    setModalOpen(false);
  }

 
  const handleHideEdit = () => {
    setModalEditOpen(false);
    formEdit.resetFields();
  }


  // discounts table
  const fetchDiscounts = () => {
    const disRef = database.ref("discounts").orderByChild("name");
    disRef.on("value", (snapshot) => {
      const disObject = (snapshot && snapshot.val()) || {};

      const disArray =
        (disObject &&
          Object.keys(disObject) &&
          Object.keys(disObject).length &&
          Object.keys(disObject).map((key) => {
            disObject[key].key = key;
            return disObject[key];
          })) ||
        [];

        console.log(disArray)

      setDiscountsData(disArray);
    });
  };


  const editDiscount = (dis) => {
    setModalEditOpen(true);
    formEdit.setFieldsValue({
      ...dis,
      // date_limit: dis.date_limit !== "" ? moment(dis.date_limit) : "",
      date_limit:
        dis.discount_start &&
        dis.discount_end
          ? [
              moment(dis.discount_start),
              moment(dis.discount_end),
            ]
          : [],
    });

    if(dis.discount_type === "peso") {
      setShowPesoEdit(true);
    }
    else if(dis.discount_type === "percent") {
      setShowPesoEdit(false);
    }
  }

  const deleteDiscount = (discount) => {
    database
      .ref(`discounts/${discount.key}`)
      .remove()
      .then(() => {
        message.success("Discount Successfully Deleted");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const discounts_columns = [
    // { title: "Key", dataIndex: "key", key: "key" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      key: "actions",
      render: (text, discount) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editDiscount(discount)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this discount?"
              onConfirm={() => deleteDiscount(discount)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" style={{ float: "right" }}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];


  const submitEdit = (discount) => {
    discount.discount_enable = discount.discount_enable === true ? discount.discount_enable : false;
    if (discount.date_limit) {
        discount.discount_start = discount.date_limit[0].format();
        discount.discount_end = discount.date_limit[1].format();
    } else {
        discount.discount_start = "";
        discount.discount_end = "";
    }
    delete discount.date_limit;
    // discount.date_limit = discount.date_limit ? moment(discount.date_limit).format() : "";


    let updates = {};
    updates["discounts/" + discount.key] = discount;
    database
      .ref()
      .update(updates)
      .then((res) => {
        message.success("Discount Updated");
      })
      .catch((error) => {
        message.error(error);
      });

    formEdit.resetFields();
    setModalEditOpen(false);
  }


  useEffect(() => {
    fetchDiscounts();
  }, [])
  


  return (
    <div>
      <button
          className="ant-btn ant-btn-primary"
          variant="primary"
          onClick={handleShow}
          style={{marginBottom:30}}
      >
        Add Discount
      </button>

      <Modal
        title='Add Discount'
        width="550px"
        visible={modalOpen}
        onOk={submitForm}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleHide}
        maskClosable="false"
      >
        <Form 
          {...layout}
          form={form} 
          onFinish={submitForm} 
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="Discount Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Discount Type" name="discount_type" rules={[{ required: true }]}>
            <Select
              placeholder="Choose Type"
              style={{ width: '100%'}}
              onChange={onChangeType}
            >
                <Option value="percent">Percent</Option>
                <Option value="peso">Peso</Option>
            </Select>
          </Form.Item>


          {showPeso ? (
            <Form.Item label="Discount Value (Peso)" name="value" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          ) : (
            <Form.Item label="Discount Value (Percent)" name="value" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          )}


          <Form.Item label="Discount Code" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Discount Counter" name="balance" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>


          <Form.Item label="Discount Date Range" name="date_limit">
            <DatePicker.RangePicker/>
          </Form.Item>


          <Form.Item
            name="discount_enable"
            valuePropName="checked"
            label="Enable Discount"
          >
            <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
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
                    Add Discount
                  </Button>
              </Row>
          </Form.Item>
        </Form>
      </Modal>


      {/* discounts tbl */}
      <Table
          columns={discounts_columns}
          dataSource={discountsData}
          pagination={{
          pageSize: 1000,
          }}
      />


      {/* edit modal */}
      <Modal
        title='Edit Discount'
        width="550px"
        visible={modalEditOpen}
        onOk={submitEdit}
        footer={false}
        getContainer={false}
        keyboard={false}
        onCancel={handleHideEdit}
        maskClosable="false"
      >
        <Form 
          {...layout}
          form={formEdit} 
          onFinish={submitEdit} 
          onFinishFailed={onFinishFailed}
        >
          <Form.Item style={{ display: "none" }} name="key">
            <Input type="hidden" />
          </Form.Item>


          <Form.Item label="Discount Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Discount Type" name="discount_type" rules={[{ required: true }]}>
            <Select
              placeholder="Choose Type"
              style={{ width: '100%'}}
              onChange={onChangeType}
            >
                <Option value="percent">Percent</Option>
                <Option value="peso">Peso</Option>
            </Select>
          </Form.Item>

          {showPesoEdit ? (
            <Form.Item label="Discount Value (Peso)" name="value" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          ) : (
            <Form.Item label="Discount Value (Percent)" name="value" rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
          )}
          


          <Form.Item label="Discount Code" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Discount Counter" name="balance" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>


          <Form.Item label="Discount Date Range" name="date_limit">
            <DatePicker.RangePicker/>
          </Form.Item>


          <Form.Item
            name="discount_enable"
            valuePropName="checked"
            label="Enable Discount"
          >
            <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
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
                    Update Discount
                  </Button>
              </Row>
          </Form.Item>
        </Form>
      </Modal>



    </div>
  )
}

export default Index;
