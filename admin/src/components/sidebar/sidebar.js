import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import {
  ShoppingCartOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/contexts/auth.context";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const { loggedUser, userInfoRole } = useContext(AuthContext);

  return loggedUser ? (
    // <Sider className="site-layout-background" width={200}>
    <Menu
      mode="inline"
      // inlineCollapsed="collapsed"
      // openKeys={["orders", "products", "customers", "my-account"]}
      defaultSelectedKeys={["order-processing"]}
      defaultOpenKeys={["orders"]}
      style={{ height: "100%" }}
    >
      {(userInfoRole == "admin" && (
        <SubMenu
          key="main-settings"
          title={
            <span>
              <SettingOutlined />
              Settings
            </span>
          }
        >
          <Menu.Item key="settings">
            <Link to="/settings">Shop</Link>
          </Menu.Item>

          <Menu.Item key="payment-settings">
            <Link to="/payment">Payment</Link>
          </Menu.Item>

          <Menu.Item key="discounts">
            <Link to="/discounts">Discounts</Link>
          </Menu.Item>
        </SubMenu>
      )) ||
        null}

      {(userInfoRole == "admin" && (
        <Menu.Item key="text-boxes">
          <Link to="/text-boxes">
            <FormOutlined />
            Text Boxes
          </Link>
        </Menu.Item>
      )) ||
        null}

      <SubMenu
        key="orders"
        title={
          <span>
            <ShoppingCartOutlined />
            Orders
          </span>
        }
      >
        <Menu.Item key="order-processing">
          <Link to="/orders/processing">New Orders</Link>
        </Menu.Item>
        <Menu.Item key="order-ready">
          <Link to="/orders/ready">Ready</Link>
        </Menu.Item>
        <Menu.Item key="order-on-transit">
          <Link to="/orders/on-transit">On Transit</Link>
        </Menu.Item>
        <Menu.Item key="order-delivered">
          <Link to="/orders/delivered">Delivered</Link>
        </Menu.Item>
        <Menu.Item key="order-cancelled">
          <Link to="/orders/cancelled">Cancelled</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="products"
        title={
          <span>
            <TagsOutlined />
            Products
          </span>
        }
      >
        <Menu.Item key="product-list">
          <Link to="/products">Items Displayed</Link>
        </Menu.Item>
        <Menu.Item key="">Item Statistics</Menu.Item>
      </SubMenu>

      {(userInfoRole == "admin" && (
        <SubMenu
          key="manager"
          title={
            <span>
              <SettingOutlined />
              Manager
            </span>
          }
        >
          <Menu.Item key="unit-manager">
            <Link to="/unit">Unit</Link>
          </Menu.Item>
          <Menu.Item key="category">
            <Link to="/category">Level 1 Category</Link>
          </Menu.Item>
          <Menu.Item key="tier-2-categories">
            <Link to="/tier-2-categories">Level 2 Category</Link>
          </Menu.Item>
          <Menu.Item key="user">
            <Link to="/user">User Manager</Link>
          </Menu.Item>
        </SubMenu>
      )) || (
        <SubMenu
          key="manager"
          title={
            <span>
              <SettingOutlined />
              Manager
            </span>
          }
        >
          <Menu.Item key="category">
            <Link to="/category">Level 1 Category</Link>
          </Menu.Item>
        </SubMenu>
      )}

      {/* <SubMenu
          key="customers"
          title={
            <span>
              <SolutionOutlined />
              Customers
            </span>
          }
        >
          <Menu.Item key="customer-list">List</Menu.Item>
        </SubMenu> */}

      <SubMenu
        key="my-account"
        title={
          <span>
            <UserOutlined />
            My Account
          </span>
        }
      >
        <Menu.Item key="edit-my-account">
          <Link to="/edit">Edit</Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/logout">Logout</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  ) : (
    // </Sider>
    ""
  );
};

export default Sidebar;
