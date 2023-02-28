import React from "react";
import BankManager from "./bank-manager";
import BankProvider from "../../shared/contexts/bank.context";

const Bank = () => {
  return (
    <BankProvider>
      <BankManager />
    </BankProvider>
  );
};

export default Bank;
