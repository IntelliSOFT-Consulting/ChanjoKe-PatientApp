import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        ChanjoKE
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;