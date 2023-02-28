import React from "react";
import UserManager from "./user-manager";
import UserProvider from "../../shared/contexts/user.context";

const User = () => {
  return (
    <UserProvider>
      <UserManager />
    </UserProvider>
  );
};

export default User;
