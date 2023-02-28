import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { FirebaseContext } from "./firebase.context";
import { ProductsContext } from "../../shared/contexts/products.context";
import { Modal, message, Tag, Button, Popconfirm } from "antd";

export const CategoryContext = createContext();

const sortByKey = (array, key) =>
  array.sort((a, b) => {
    const x = a[key].toLowerCase();
    const y = b[key].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });

const sortByNumAsc = (array, key) =>
  array.sort(function(a, b) {
    return a[key] - b[key];
  });

const CategoryProvider = ({ children }) => {
  const { database } = useContext(FirebaseContext);

  const {
    updateProductCategoryName,
    updateProductStoreOrder,
  } = useContext(ProductsContext);

  const [storeCategories, setStoreCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [isShowCategoryFormModal, setIsShowCategoryFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeCategoryFormModal = () => {
    setSelectedCategory({});
    setIsShowCategoryFormModal(false);
  };

  const showCategoryFormModal = () => {
    setIsShowCategoryFormModal(true);
  };

  const saveProductCategory = (category, create = true) => {

    setIsLoading(true);

    const categoryInfo = {
      name: category.name
    };

    const dbRef = database.ref('categories').child(category.store_id).child('children');

    if (create) {
      dbRef.push(categoryInfo)
        .then(() => {
          message.success("Product category created!");
        });
    } else {
      const key = category.key;
      delete category.key;
      dbRef.child(key).update(categoryInfo)
        .then(() => {
          message.success("Product category updated!");
          updateProductCategoryName({key: key, ...category});
          closeCategoryFormModal();
        });
    }
    setIsLoading(false);
  };

  const saveCategory = (category) => {
    setIsLoading(true);
    let categoryInfo = {};

    const name = category.name.toLowerCase();
    const new_key = name.split(" ").join("_");

    categoryInfo[`products_category/${category.key}`] = {
      name: category.name,
      key: new_key,
    };
    database
      .ref()
      .update(categoryInfo)
      .then(() => {
        message.success("Category Saved!");
      });
    setIsLoading(false);
    closeCategoryFormModal();
  };

  // const fetchCategory = () => {
  //   const categoryRef = database.ref("products_category").orderByChild("name");
  //   categoryRef.on("value", (snapshot) => {
  //     const categoryObject = (snapshot && snapshot.val()) || {};

  //     const categoryArray =
  //       (categoryObject &&
  //         Object.entries(categoryObject) &&
  //         Object.entries(categoryObject).length &&
  //         Object.entries(categoryObject).map((item) => {
  //           item[1].key = item[0];
  //           return item[1];
  //         })) ||
  //       [];

  //     setCategory(sortByKey(categoryArray, "name"));
  //     setFilteredCategory(categoryArray);
  //   });
  // };

  const saveStoreCategory = (storeInfo, create = true) => {
    setIsLoading(true);

    const dbRef = database.ref('categories')

    if (create) {
      dbRef.push(storeInfo)
        .then(() => {
          message.success("Product category created!");
        });
    } else {
      const key = storeInfo.key;
      delete storeInfo.key;
      dbRef.child(key).update(storeInfo)
        .then(() => {
          message.success("Product category updated!");
          if(!storeInfo.product_category) {
            updateProductCategoryName({key: key, name: storeInfo.name});
            updateProductStoreOrder({key: key, store_category_order: storeInfo.store_category_order})
          }
          closeCategoryFormModal();
        });
    }
    setIsLoading(false);
  };

  const fetchAllProductCategories = () => {
    const categoryRef = database.ref("categories");
    categoryRef.on("value", (snapshot) => {
      const categoryObject = (snapshot && snapshot.val()) || {};

      const categoryArray =
        (categoryObject &&
          Object.keys(categoryObject) &&
          Object.keys(categoryObject).length &&
          Object.keys(categoryObject).map((key) => {
            const store_id = key;
            let category = [];

            if(categoryObject[store_id].children) {
              category = Object.keys(categoryObject[store_id].children).map((category_id) => {
                // console.log(store_id);
                categoryObject[store_id].children[category_id].store_id = store_id;
                categoryObject[store_id].children[category_id].key = category_id;
                return categoryObject[store_id].children[category_id];
                // return "Wew"
              });
            }
            
            return category
          })) ||
        [];
      setCategory(sortByKey(categoryArray.flat(), "name"));
      setFilteredCategory(categoryArray.flat());
    });
  }

  const fetchProductCategories = (store_id) => {
    const categoryRef = database.ref("categories").child(store_id).child('children').orderByChild("name");
    categoryRef.on("value", (snapshot) => {
      const categoryObject = (snapshot && snapshot.val()) || {};

      const categoryArray =
        (categoryObject &&
          Object.keys(categoryObject) &&
          Object.keys(categoryObject).length &&
          Object.keys(categoryObject).map((key) => {
            categoryObject[key].store_id = store_id;
            categoryObject[key].key = key;
            return categoryObject[key];
          })) ||
        [];

      setCategory(sortByKey(categoryArray, "name"));
      setFilteredCategory(categoryArray);
    });
  };

  const fetchStoreCategories = () => {
    const storeRef = database.ref("categories").orderByChild("name");
    storeRef.on("value", (snapshot) => {
      const storeObject = (snapshot && snapshot.val()) || {};

      const storeArray =
        (storeObject &&
          Object.keys(storeObject) &&
          Object.keys(storeObject).length &&
          Object.keys(storeObject).map((key) => {
            storeObject[key].key = key;
            delete storeObject[key].children;
            return storeObject[key];
          })) ||
        [];

      setStoreCategories(sortByKey(storeArray, "name"));
    });
  }


  const fetchStoreCategoriesByCatOrder = () => {
    const storeRef = database.ref("categories").orderByChild("name");
    storeRef.on("value", (snapshot) => {
      const storeObject = (snapshot && snapshot.val()) || {};

      const storeArray =
        (storeObject &&
          Object.keys(storeObject) &&
          Object.keys(storeObject).length &&
          Object.keys(storeObject).map((key) => {
            storeObject[key].key = key;
            delete storeObject[key].children;
            return storeObject[key];
          })) ||
        [];

      setStoreCategories(sortByNumAsc(storeArray, "store_category_order"));
    });
  }

  const editCategory = (category) => {
    setSelectedCategory(category);
    showCategoryFormModal();
  };

  const handleOnClickRow = (category, rowIndex) => ({
    onClick: () => editCategory(category),
  });

  const deleteCategory = (category, store) => {

    const dbRef = database.ref('categories');

    if (store) {
      dbRef.child(category.key).remove()
        .then(() => {
          message.success("Store Category Successfully Deleted");
        })
        .catch((error) => {
          message.error(error);
        });
    } else {
      dbRef.child(category.store_id).child('children').child(category.key).remove()
        .then(() => {
          message.success("Product Category Successfully Deleted");
        })
        .catch((error) => {
          message.error(error);
        });
    }
  };

  // const deleteCategory = (category) => {
  //   database
  //     .ref(`products_category/${category.key}`)
  //     .remove()
  //     .then(() => {
  //       message.success("Category Successfully Deleted");
  //     })
  //     .catch((error) => {
  //       message.error(error);
  //     });
  // };

  const cancel = (e) => {
    console.log(e);
  };

  const getActionButtons = (category, catType) => {
    const isStore = catType === "store" ? true : false;
    return (<div style={{ display: "inline-flex" }}>
      <Button
        type="primary"
        style={{ float: "right", marginRight: "12px" }}
        onClick={() => editCategory(category)}
      >
        Edit
    </Button>

      <Popconfirm
        title="Are you sure delete this category?"
        onConfirm={() => deleteCategory(category, isStore)}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button type="danger" style={{ float: "right" }}>
          Delete
      </Button>
      </Popconfirm>
    </div>)
  }

  const columns = [
    // { title: "Key", dataIndex: "key", key: "key" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      key: "actions",
      render: (text, category) => {
        return (
          <div style={{ display: "inline-flex" }}>
            <Button
              type="primary"
              style={{ float: "right", marginRight: "12px" }}
              onClick={() => editCategory(category)}
            >
              Edit
            </Button>

            <Popconfirm
              title="Are you sure delete this category?"
              onConfirm={() => deleteCategory(category)}
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

  const productColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      key: "actions",
      render: (text, category) => getActionButtons(category, "product")
    },
  ];

  const storeColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category Order", dataIndex: "store_category_order", key: "store_category_order" },
    {
      key: "actions",
      render: (text, category) => getActionButtons(category, "store")
    },
  ];

  const payload = {
    isShowCategoryFormModal,
    closeCategoryFormModal,
    handleOnClickRow,
    showCategoryFormModal,
    filteredCategory,
    selectedCategory,
    fetchStoreCategories,
    fetchStoreCategoriesByCatOrder,
    fetchProductCategories,
    fetchAllProductCategories,
    storeCategories,
    saveProductCategory,
    saveStoreCategory,
    saveCategory,
    isLoading,
    category,
    productColumns,
    storeColumns,
    columns,
  };

  return (
    <CategoryContext.Provider value={payload}>
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.defaultProps = {};

CategoryProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default CategoryProvider;
