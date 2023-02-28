import React, { useContext, useEffect, useState } from "react";
import { Switch, Spin, Upload, message, Button, Input, Row, Col, Form } from "antd";
import { FirebaseContext } from "../../shared/contexts/firebase.context";
import Swal from "sweetalert2";

const EditAccount = () => {
  const [form] = Form.useForm();
  const { database, auth } = useContext(FirebaseContext);

  const onFinish = (values) => {
    // console.log(values.newpassword);

    const user = auth.currentUser;
    user.updatePassword(values.newpassword)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text:
            "Successfully Updated Password",
        });
      }).catch((e) => {
        Swal.fire({
          icon: "warning",
          title: "Password Reset Error",
          text:
            e,
        });
      })
    
  };


  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{ width: "50%" }}
    >
      <div style={{ margin: 50 }}>
        <Form.Item label="New Password" name="newpassword" rules={[{ required: true }]}>
          <Input.Password placeholder="input password" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit">Update Password</Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default EditAccount;