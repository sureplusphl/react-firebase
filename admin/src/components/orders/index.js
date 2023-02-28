import React from "react";
import OrderTable from "./order-table";
import OrderProvider from "../../shared/contexts/order.context";

const Orders = () => {
  return (
    <OrderProvider>
      <OrderTable />
    </OrderProvider>
  );
};

export default Orders;
