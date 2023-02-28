import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Orders from "../orders";
import Products from "../products";
import Login from "../login";
import Logout from "../login/logout";
import { AuthContext } from "../../shared/contexts/auth.context";
import Settings from "../settings";
import Announcements from "../announcements";
import TextBoxes from "../textBoxes";
import UnitManager from "../unit";
import Category from "../category";
import Stores from '../stores';
import User from '../user';
import Account from '../account';
import Payment from '../payment';
import Pdf from '../pdf';
import Discounts from '../discounts';

const Routing = () => {
  return (
    <Switch>
      <PrivateRoute path="/orders">
        <Orders />
      </PrivateRoute>
      <PrivateRoute path="/settings">
        <Settings />
      </PrivateRoute>
      <PrivateRoute path="/payment">
        <Payment />
      </PrivateRoute>
      <PrivateRoute path="/text-boxes">
        <TextBoxes />
      </PrivateRoute>
      <PrivateRoute path="/products">
        <Products />
      </PrivateRoute>
      <PrivateRoute path="/unit">
        <UnitManager />
      </PrivateRoute>
      <PrivateRoute path="/category">
        <Category />
      </PrivateRoute>
      <PrivateRoute path="/tier-2-categories">
        <Stores />
      </PrivateRoute>
      <PrivateRoute path="/user">
        <User />
      </PrivateRoute>
      <PrivateRoute path="/edit">
        <Account />
      </PrivateRoute>
      <PrivateRoute path="/pdf">
        <Pdf />
      </PrivateRoute>
      <PrivateRoute path="/discounts">
        <Discounts />
      </PrivateRoute>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
    </Switch>
  );
};

function PrivateRoute({ children, ...rest }) {
  const { loggedUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default Routing;
