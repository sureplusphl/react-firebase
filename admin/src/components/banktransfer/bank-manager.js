import React, { useEffect, useContext } from "react";
import { Table } from "antd";
import { BankContext } from "../../shared/contexts/bank.context";
import BankForm from "./bank-form";
import BankAdd from "./bank-add";

const BankManager = () => {
  const {
    filteredBank,
    columns,
    fetchBank,
    // handleOnClickRow
  } = useContext(BankContext);

  useEffect(() => {
    fetchBank();
  }, []);



  return (
    <div style={{ margin: 50, marginTop: 15}}>
      <BankForm />
      <h1>Bank List</h1>
      <BankAdd />
      <Table
        columns={columns}
        // onRow={handleOnClickRow}
        dataSource={filteredBank}
        pagination={{
          pageSize: 1000,
        }}
      />
    </div>
  );
};

export default BankManager;
