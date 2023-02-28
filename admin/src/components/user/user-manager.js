import React, { useEffect, useContext } from "react";
import { Table } from "antd";
import { UserContext } from "../../shared/contexts/user.context";
import UserForm from "./user-form";
import UserAdd from "./user-add";

const UserManager = () => {
  const {
    filteredUsers,
    columns,
    fetchUsers,
    // handleOnClickRow
  } = useContext(UserContext);

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <div>
      <UserForm />
      <h1>User List</h1>
      <UserAdd />
      <Table
        columns={columns}
        // onRow={handleOnClickRow}
        dataSource={filteredUsers}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default UserManager;
