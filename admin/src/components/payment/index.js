import React from "react";
import PaymentSettings from "./payment-settings";
import BankSettings from "../banktransfer";

const Payment = () => {
    return (
      <div>
        <PaymentSettings/>
        <BankSettings/>
      </div>
    );
  };
  
export default Payment;