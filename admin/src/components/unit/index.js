import React from "react";
import UnitManager from "./unit-manager";
import UnitProvider from "../../shared/contexts/unit.context";

const Unit = () => {
  return (
    <UnitProvider>
      <UnitManager />
    </UnitProvider>
  );
};

export default Unit;
