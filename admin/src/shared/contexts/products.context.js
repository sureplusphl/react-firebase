import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { Modal, message, Tag, Button, Popconfirm } from "antd";

export const ProductsContext = createContext();

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key].toLowerCase();
    const y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

const ProductsProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isShowProductFormModal, setIsShowProductFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeProductFormModal = () => {
    setSelectedProduct({});
    setIsShowProductFormModal(false);
  };

  const showProductFormModal = () => {
    setIsShowProductFormModal(true);
  };

  const saveProduct = (product) => {
    setIsLoading(true);
    let productInfo = {};
    productInfo[`products/${product.key}`] = {
      ...product,
      kgPerPiece: (product.kgPerPiece == null || product.kgPerPiece == 0 || product.kgPerPiece == '') ? '' :  product.kgPerPiece,
      // file: selectedProduct.file,
    };
    database
      .ref()
      .update(productInfo)
      .then(() => {
        message.success("Product Saved!");
      });
    setIsLoading(false);
    closeProductFormModal();
  };

  const updateProductCategoryName = (category) => {
    const productsRef = database.ref('products');

    const updateCategoryName = (id, product) => {
      let response = true;
      productsRef.child(id).update(product)
      .then(() => {
        // None
      }).catch((err) => {
        message.error(err.message);
        response = false;
      });

      return response;
    }

    productsRef.once("value", (snapshot) => {
      const response = (snapshot && snapshot.val()) || {};
      let prods = [];

      if(category.store_id) {
        prods = Object.entries(response)
        .filter(e => e[1].product_category === category.key)
      } else {
        prods = Object.entries(response)
        .filter(e => !e[1].product_category && e[1].store_id === category.key);
      }
      
      prods.map(prod => {
          prod[1].product_category_name = category.name;
          updateCategoryName(prod[0], prod[1]);
        }
      );
    });
  }

  const updateProductStoreOrder = (category) => {
    const productsRef = database.ref('products');

    const updateStoreCategoryOrder = (id, product) => {
      let response = true;
      productsRef.child(id).update(product)
      .then(() => {
        // None
      }).catch((err) => {
        message.error(err.message);
        response = false;
      });

      return response;
    }

    productsRef.once("value", (snapshot) => {
      const response = (snapshot && snapshot.val()) || {};
      let prods = [];

      if(category.store_id) {
        prods = Object.entries(response)
        .filter(e => e[1].product_category === category.key)
      } else {
        prods = Object.entries(response)
        .filter(e => !e[1].product_category && e[1].store_id === category.key);
      }
      
      prods.map(prod => {
          prod[1].storecategory_order = category.store_category_order;
          updateStoreCategoryOrder(prod[0], prod[1]);
        }
      );
    });
  }

  const fetchProducts = () => {
    const productsRef = database.ref("products").orderByChild("name");
    productsRef.on("value", (snapshot) => {
      const productsObject = (snapshot && snapshot.val()) || {};

      const productsArray =
        (productsObject &&
          Object.entries(productsObject) &&
          Object.entries(productsObject).length &&
          Object.entries(productsObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];

      setProducts(sortByKey(productsArray, "name"));
      setFilteredProducts(productsArray);
    });
  };

  const fetchProductsByStoreId = (id) => {
    const productsRef = database.ref('products');
    productsRef.orderByChild("store_id").equalTo(id).on("value", (snapshot) => {
      const productsObject = (snapshot && snapshot.val()) || {};

      const productsArray =
        (productsObject &&
          Object.entries(productsObject) &&
          Object.entries(productsObject).length &&
          Object.entries(productsObject).map((item) => {
            item[1].key = item[0];
            return item[1];
          })) ||
        [];

      setProducts(sortByKey(productsArray, "name"));
      setFilteredProducts(productsArray);
    });
  }


  const fetchProductsByName = (name, category_id) => {
    let searchedProducts = ""; 
    
    if(category_id) {
      searchedProducts = products.filter(e => e.store_id === category_id && e.name.toLowerCase().includes(name.toLowerCase()));
    } else {
      searchedProducts = products.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
    }
    setFilteredProducts(searchedProducts);
    // const productsRef = database.ref('products');
    // productsRef.orderByChild("name").equalTo(name).on("value", (snapshot) => {
    //   const productsObject = (snapshot && snapshot.val()) || {};

    //   const productsArray =
    //     (productsObject &&
    //       Object.entries(productsObject) &&
    //       Object.entries(productsObject).length &&
    //       Object.entries(productsObject).map((item) => {
    //         item[1].key = item[0];
    //         return item[1];
    //       })) ||
    //     [];

    //   setProducts(sortByKey(productsArray, "name"));
    //   setFilteredProducts(productsArray);
    // });
  }


  const editProduct = (product) => {
    setSelectedProduct(product);
    showProductFormModal();
  };

  const handleOnClickRow = (product, rowIndex) => ({
    onClick: () => editProduct(product),
  });

  const deleteProduct = (product) => {
    database
      .ref(`products/${product.key}`)
      .remove()
      .then(() => {
        message.success("Product Successfully Deleted");
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const cancel = (e) => {
    // console.log(e);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Category",
      dataIndex: "product_category_name",
      key: "product_category_name",
      render: (text, product) => {
        return product.product_category_name ? product.product_category_name : product.product_category;
      }
    },
    { title: "Increment", dataIndex: "increment", key: "increment" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Purchase Limit", dataIndex: "limit", key: "limit" },
    { title: "Price (Php)", dataIndex: "price", key: "price" },
    { title: "Mall Price (Php)", dataIndex: "mall_price", key: "mall_price" },
    {
      key: "actions",
      render: (text, product) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editProduct(product)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this product?"
              onConfirm={() => deleteProduct(product)}
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
    isShowProductFormModal,
    closeProductFormModal,
    handleOnClickRow,
    showProductFormModal,
    updateProductCategoryName,
    updateProductStoreOrder,
    filteredProducts,
    selectedProduct,
    fetchProducts,
    fetchProductsByStoreId,
    fetchProductsByName,
    saveProduct,
    isLoading,
    products,
    columns,
  };

  return (
    <ProductsContext.Provider value={payload}>
      {children}
    </ProductsContext.Provider>
  );
};

ProductsProvider.defaultProps = {};

ProductsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ProductsProvider;
