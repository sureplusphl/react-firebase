import React, { useContext } from "react";
import { Modal, Button } from "antd";
import Summary from '../summary/summary';
import { UpOutlined } from "@ant-design/icons";
import { AppContext } from "../../shared/contexts/app.context";
import Swal from "sweetalert2";
import "./modal.css";

function SummaryModalComponent({ show, onCancel }) {
  const { next, totalGoods } = useContext(AppContext);

  const confirmOrder = () => {
    // if (totalGoods >= 300) {
    //   next();
    // } else {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Cannot proceed to confirm order",
    //     text:
    //       "Sureplus caters to a minimum of ₱ 300.00 per order, please add more items",
    //     // footer: '<a href>Why do I have this issue?</a>'
    //   });
    //   // message.warning('You will need to order 5 kilos minimum')
    // }
    next();
  };

  return (
    <>
      <Modal
        visible={show}
        // maskStyle={{ backgroundColor: "#ddd", opacity: 0.9 }}
        centered
        footer={false}
        closable={false}
        className="modalBody"
        width={"90%"}
      >
        <div className="summaryModalContainer">
          <UpOutlined style={{ fontSize: "40px" }} onClick={onCancel} />
          Hide / Close
        </div>
        <Summary showSummaryModal={show}/>

        <div className="summaryModalButtonConfirm">
          <Button className="shopConfirmButton" id="btn-confirm" onClick={confirmOrder}>
            Confirm Order
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default SummaryModalComponent;
