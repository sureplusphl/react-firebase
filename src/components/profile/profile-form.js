import React, { useContext } from "react";
import { Form, Input, Button, Select, Avatar, message, Row, Col } from "antd";
import { AuthContext } from "../../shared/contexts/auth.context";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import Swal from "sweetalert2";

const ProfileForm = () => {
  const { loggedUser, setLoggedUser } = useContext(AuthContext);
  const { database } = useContext(FirebaseContext);

  const { Option } = Select;

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    values = { ...values, photoURL: loggedUser.photoURL ? loggedUser.photoURL : "", uid: loggedUser.uid };
    setLoggedUser(values);

    if(values.phoneNumber.length == 11) {
      database
        .ref(`profiles/${loggedUser.uid}`)
        .update(values)
        .then(() => {
          message.success("You have successfully updated your profile!");
        });
    }
    else {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text:
          "Please provide valid phone number",
      });
    }

  };

  const onReset = () => {
    form.resetFields();
  };

  const emailVerified = loggedUser.emailVerified;
  let verifytext = "";
  if(emailVerified === true) {
    verifytext = (
      <span style={{color:'green'}}>Verified Email</span>
    );
  } else {
    verifytext = (
      <span style={{color:'red'}}>Email Not Verified</span>
    );
  }

  const emailVerify = () => {

    loggedUser.sendEmailVerification().then(function() {
      Swal.fire({
        icon: "success",
        title: "Email Verification Sent",
        text:
          "Kindly Check your Email",
      });
    }).catch(function(e) {
      Swal.fire({
        icon: "warning",
        title: "Email Error",
        text:
          e,
      });
    });

  }

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      initialValues={{
        displayName: loggedUser.displayName || '',
        // gender: loggedUser.gender || '',
        phoneNumber: loggedUser.phoneNumber || '',
        otherPhone: loggedUser.otherPhone || '',
        fullAddress: loggedUser.fullAddress || '',
        addressNotes: loggedUser.addressNotes || '',
        company: loggedUser.company || '',
        email: loggedUser.email,
        photoURL: loggedUser.photoURL,
      }}
    >
      <Form.Item label="">
        <Avatar shape="square" src={loggedUser.photoURL} size={80} />
      </Form.Item>

      <Row gutter={10} width="100%" align="center">
        <Col md={24} sm={24}>
          <h3>Points Available: {loggedUser ? loggedUser.points : "0"}</h3>
          <Form.Item name="displayName" label="" rules={[{ required: true }]}>
            <Input placeholder="Name" />
          </Form.Item>
        </Col>
      </Row>

      
      {/* <Form.Item name="gender" label="Gender">
        <Select placeholder="Select gender" allowClear>
          <Option value="male">male</Option>
          <Option value="female">female</Option>
        </Select>
      </Form.Item> */}
      
      <Form.Item name="company" label="">
            <Input placeholder="Company (Optional)"  />
          </Form.Item>
      <Form.Item name="phoneNumber" label="" rules={[{ required: true, message: "Phone Number is required" }]}>
            <Input placeholder="Phone"  />
          </Form.Item>
      <Form.Item name="otherPhone" label="">
        <Input placeholder="Other Phone" />
      </Form.Item>
      <Form.Item name="fullAddress" label="" rules={[{ required: true, message: "Full Address is required" }]}>
        <Input placeholder="Address" />
      </Form.Item>
      <Form.Item name="addressNotes" label="" rules={[{ required: true, message: "Address Notes is required" }]}>
        <Input placeholder="Address Notes" />
      </Form.Item>


      <Row gutter={1} width="100%" align="center">
        <Col md={24} sm={24}>
          <Form.Item
            name="email"
            label=""
          >
            <Input/>
          </Form.Item>
        </Col>
        {/* <Col md={4} sm={24}>
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => emailVerify()}
          >
            Verify Email
          </Button>
        </Col> */}
      </Row>

      {/* <p style={{textAlign:'right', marginTop:'-20px'}}>{verifytext}</p> */}
      

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>{" "}
        {/* <Button htmlType="button" onClick={onReset}>
          Reset
        </Button> */}
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
