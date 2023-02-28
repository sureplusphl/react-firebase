import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { Modal, message, Tag, Button, Popconfirm } from "antd";

export const BankContext = createContext();

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key].toLowerCase();
    const y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

const BankProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);
  const [bank, setBank] = useState([]);
  const [filteredBank, setFilteredBank] = useState([]);
  const [selectedBank, setSelectedBank] = useState({});
  const [isShowBankFormModal, setIsShowBankFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeBankFormModal = () => {
    setSelectedBank({});
    setIsShowBankFormModal(false);
  };

  const showBankFormModal = () => {
    setIsShowBankFormModal(true);
  };

  const saveBank = (bank) => {
    setIsLoading(true);
    let bankInfo = {};

    const name = bank.name.toLowerCase();
    const new_key = name.split(" ").join("_");
    
    bankInfo[`bank/${bank.key}`] = {
      ...bank,
      name: bank.name,
      key: new_key,
    };
    database
      .ref()
      .update(bankInfo)
      .then(() => {
        message.success("Bank Saved!");
      });
    setIsLoading(false);
    closeBankFormModal();
  };

  const fetchBank = () => {
    const bankRef = database.ref("bank").orderByChild("name");
    bankRef.on("value", (snapshot) => {
      const bankObject = (snapshot && snapshot.val()) || {};

      const bankArray =
        (bankObject &&
          Object.entries(bankObject) &&
          Object.entries(bankObject).length &&
          Object.entries(bankObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];

      setBank(sortByKey(bankArray, "name"));
      setFilteredBank(bankArray);
    });
  };

  const editBank = (bank) => {
    setSelectedBank(bank);
    showBankFormModal();
  };

  const handleOnClickRow = (bank, rowIndex) => ({
    onClick: () => editBank(bank),
  });

  const deleteBank = (bank) => {
    database
      .ref(`bank/${bank.key}`)
      .remove()
      .then(() => {
        message.success("Bank Successfully Deleted");
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
    {
      key: "actions",
      render: (text, bank) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editBank(bank)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this bank?"
              onConfirm={() => deleteBank(bank)}
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
    isShowBankFormModal,
    closeBankFormModal,
    handleOnClickRow,
    showBankFormModal,
    filteredBank,
    selectedBank,
    fetchBank,
    saveBank,
    isLoading,
    bank,
    columns,
  };

  return (
    <BankContext.Provider value={payload}>
      {children}
    </BankContext.Provider>
  );
};

BankProvider.defaultProps = {};

BankProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default BankProvider;
