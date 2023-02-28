import React, { useContext } from "react";
import Summary from "../summary/summary";
import { Spin } from "antd";
import { AppContext } from "../../shared/contexts/app.context";
import Complete from "../complete";
import Delivery from "../delivery";

const Checkout = () => {
  const { isSubmitting, isOrderComplete } = useContext(AppContext);

  return (
    <React.Fragment>
      <Spin spinning={isSubmitting}>
        {isOrderComplete ? (
          <Complete />
        ) : (
          <React.Fragment>
            <Summary />
            <Delivery />
          </React.Fragment>
        )}
      </Spin>
    </React.Fragment>
  );
};

export default Checkout;
