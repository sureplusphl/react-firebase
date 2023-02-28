import React from "react";

const CountDisplay = ({ product, count }) => {
  const checkPlural = (count) => {
    switch (product.unit) {
      case "piece":
        return parseInt(count, 10) > 1 ? "pcs" : "pc";
      case "set":
        return parseInt(count, 10) > 1 ? "sets" : "set";
      case "bundle":
        return parseInt(count, 10) > 1 ? "bundles" : "bundle";
      case "tray":
        return parseInt(count, 10) > 1 ? "trays" : "tray";
      default:
        return parseInt(count, 10) > 1 ? "kgs" : "kg";
    }
  };

  const convertToKg = () => {
    switch (product.unit) {
      case "kg":
        const inKilos = count || 0;
        return `${parseFloat(inKilos).toFixed(2)} ${checkPlural(inKilos)}`;
      case "g":
        const inKilograms = count;
        return `${parseFloat(inKilograms / 1000).toFixed(2) || 0} ${checkPlural(
          inKilograms / 1000
        )}`;
      case "piece":
        const inPieces = count;
        return `${inPieces || 0} ${checkPlural(inPieces)}`;

      case "bundle":
        const inBundles = count;
        return `${inBundles || 0} ${checkPlural(inBundles)}`;

      case "tray":
        const inTrays = count;
        return `${inTrays || 0} ${checkPlural(inTrays)}`;

      case "set":
        const inSets = count;
        return `${inSets || 0} ${checkPlural(inSets)}`;

      default:
    }
  };

  return <React.Fragment>{convertToKg()}</React.Fragment>;
};

export default CountDisplay;
