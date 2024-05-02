import { Outlet } from "react-router-dom";
import ChanjoKE from '../assets/chanjoke-img.png'

const Layout = () => {
  return (
    <div className="grid md:grid-cols-2 h-full">
      <nav className="hidden md:block">
        <img src={ChanjoKE} className="h-screen" alt="OpenCHANJO Jumbo image" />
      </nav>

      <div>
        <div className="md:collapse flex flex-wrap text-center px-4 sm:flex-nowrap sm:px-6 lg:px-8 bg-[#163C94] text-white shadow py-4">
          OpenCHANJO
        </div>

        <Outlet /> 
      </div>
    </div>
  )
};

export default Layout;