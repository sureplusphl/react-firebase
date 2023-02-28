import React, { useEffect, useContext } from "react";
import { Table } from "antd";
import { UnitContext } from "../../shared/contexts/unit.context";
import UnitForm from "./unit-form";
import UnitAdd from "./unit-add";

const UnitManager = () => {
  const {
    filteredUnits,
    columns,
    fetchUnits,
    // handleOnClickRow
  } = useContext(UnitContext);

  useEffect(() => {
    fetchUnits();
  }, []);



  return (
    <div>
      <UnitForm />
      <h1>Unit List</h1>
      <UnitAdd />
      <Table
        columns={columns}
        // onRow={handleOnClickRow}
        dataSource={filteredUnits}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default UnitManager;
