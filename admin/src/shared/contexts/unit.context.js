import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { Modal, message, Tag, Button, Popconfirm } from "antd";

export const UnitContext = createContext();

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key].toLowerCase();
    const y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

const UnitProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});
  const [isShowUnitFormModal, setIsShowUnitFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeUnitFormModal = () => {
    setSelectedUnit({});
    setIsShowUnitFormModal(false);
  };

  const showUnitFormModal = () => {
    setIsShowUnitFormModal(true);
  };

  const saveUnit = (unit) => {
    setIsLoading(true);
    let unitInfo = {};

    const name = unit.name.toLowerCase();
    const new_key = name.split(" ").join("_");
    
    unitInfo[`unit_type/${unit.key}`] = {
      name: unit.name,
      key: new_key,
    };
    database
      .ref()
      .update(unitInfo)
      .then(() => {
        message.success("Unit Saved!");
      });
    setIsLoading(false);
    closeUnitFormModal();
  };

  const fetchUnits = () => {
    const unitsRef = database.ref("unit_type").orderByChild("name");
    unitsRef.on("value", (snapshot) => {
      const unitsObject = (snapshot && snapshot.val()) || {};

      const unitsArray =
        (unitsObject &&
          Object.entries(unitsObject) &&
          Object.entries(unitsObject).length &&
          Object.entries(unitsObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];

      setUnits(sortByKey(unitsArray, "name"));
      setFilteredUnits(unitsArray);
    });
  };

  const editUnit = (unit) => {
    setSelectedUnit(unit);
    showUnitFormModal();
  };

  const handleOnClickRow = (unit, rowIndex) => ({
    onClick: () => editUnit(unit),
  });

  const deleteUnit = (unit) => {
    database
      .ref(`unit_type/${unit.key}`)
      .remove()
      .then(() => {
        message.success("Unit Successfully Deleted");
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
      render: (text, unit) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editUnit(unit)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this unit?"
              onConfirm={() => deleteUnit(unit)}
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
    isShowUnitFormModal,
    closeUnitFormModal,
    handleOnClickRow,
    showUnitFormModal,
    filteredUnits,
    selectedUnit,
    fetchUnits,
    saveUnit,
    isLoading,
    units,
    columns,
  };

  return (
    <UnitContext.Provider value={payload}>
      {children}
    </UnitContext.Provider>
  );
};

UnitProvider.defaultProps = {};

UnitProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default UnitProvider;
