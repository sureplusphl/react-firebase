import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { AuthContext } from "./auth.context";
import { Modal, message, Tag, Button, Popconfirm } from "antd";

export const UserContext = createContext();

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key].toLowerCase();
    const y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

const UserProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isShowUserFormModal, setIsShowUserFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeCategories, setStoreCategories] = useState([]);
  const { firebase, auth } = useContext(AuthContext);

  const closeUserFormModal = () => {
    setSelectedUser({});
    setIsShowUserFormModal(false);
  };

  const showUserFormModal = () => {
    setIsShowUserFormModal(true);
  };

  const saveUser = (user) => {
    setIsLoading(true);
    let userInfo = {};
    
    userInfo[`user/${user.key}`] = {
      ...user,
      role: 'reseller',
    };
    database
      .ref()
      .update(userInfo)
      .then(() => {
        message.success("User Saved!");
      });
    setIsLoading(false);
    closeUserFormModal();
  };

  const fetchUsers = () => {
    const usersRef = database.ref("user").orderByChild("role").equalTo('reseller');
    usersRef.on("value", (snapshot) => {
      const usersObject = (snapshot && snapshot.val()) || {};

      const usersArray =
        (usersObject &&
          Object.entries(usersObject) &&
          Object.entries(usersObject).length &&
          Object.entries(usersObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];

      setUsers(sortByKey(usersArray, "name"));
      setFilteredUsers(usersArray);
    });
  };

  const editUser = (user) => {
    setSelectedUser(user);
    showUserFormModal();
  };

  const fetchStoreCategories = () => {
    const storeRef = database.ref("categories").orderByChild("name");
    storeRef.on("value", (snapshot) => {
      const storeObject = (snapshot && snapshot.val()) || {};

      const storeArray =
        (storeObject &&
          Object.keys(storeObject) &&
          Object.keys(storeObject).length &&
          Object.keys(storeObject).map((key) => {
            storeObject[key].key = key;
            delete storeObject[key].children;
            return storeObject[key];
          })) ||
        [];

      setStoreCategories(sortByKey(storeArray, "name"));
    });
  }

  const handleOnClickRow = (user, rowIndex) => ({
    onClick: () => editUser(user),
  });

  const deleteUser = (user) => {
    database
      .ref(`user/${user.key}`)
      .remove()
      .then(() => {
        message.success("User Successfully Deleted");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const cancel = (e) => {
    console.log(e);
  };

  const columns = [
    // { title: "Key", dataIndex: "key", key: "key" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Level 2 Category", dataIndex: "store_name", key: "store_name" },
    {
      key: "actions",
      render: (text, user) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editUser(user)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this user?"
              onConfirm={() => deleteUser(user)}
              onCancel={cancel}
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

  const payload = {
    isShowUserFormModal,
    closeUserFormModal,
    handleOnClickRow,
    showUserFormModal,
    filteredUsers,
    selectedUser,
    fetchUsers,
    fetchStoreCategories,
    saveUser,
    storeCategories,
    isLoading,
    users,
    columns,
  };

  return (
    <UserContext.Provider value={payload}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.defaultProps = {};

UserProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default UserProvider;
