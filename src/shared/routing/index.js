import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "../../pages/login-page";
import SignUpPage from "../../pages/signup-page";
import LogoutPage from "../../pages/logout-page";
import ShopPage from "../../pages/shop-page";
import ForgetPage from "../../pages/forgetpassword-page";
import { AuthContext } from "../contexts/auth.context";
import ProfilePage from "../../pages/profile-page";
import OrdersPage from "../../pages/orders-page";
import HomePage from "../../pages/home";
import AboutPage from "../../pages/about";

const Routing = () => {
  return (
    <Switch>
      <PrivateRoute path="/profile">
        <ProfilePage />
      </PrivateRoute>
      <PrivateRoute path="/my-orders">
        <OrdersPage />
      </PrivateRoute>

      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/signup">
        <SignUpPage />
      </Route>
      <Route path="/forgetpassword">
        <ForgetPage />
      </Route>
      <Route path="/logout">
        <LogoutPage />
      </Route>
      <Route path="/shop">
        <ShopPage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route path="/">
        <HomePage />
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
