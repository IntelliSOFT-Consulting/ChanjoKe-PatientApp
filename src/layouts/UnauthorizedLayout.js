import { Outlet } from "react-router-dom";
import ChanjoKE from '../assets/chanjoke.png'

const Layout = () => {
  return (
    <div className="grid grid-cols-2 h-full">
      <nav>
        <img src={ChanjoKE} className="h-full" />
      </nav>

      <Outlet />
    </div>
  )
};

export default Layout;