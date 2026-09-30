import { Navigate, Outlet } from "react-router";

import Cookies from "js-cookie";

/*! An <Outlet> should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered. It will either load child routes if the user is Authitecated or will force the user to Navigate to the login page */
const PrivateRoutes = () => {
  const token = Cookies.get("token");
  const user = token ? JSON.parse(Cookies.get("user")) : null;
  //console.log(token);
  if (!token) return <Navigate to="/login" />;

  return token ? <Outlet context={{ user }} /> : <Navigate to="/" />;
};

export default PrivateRoutes;
