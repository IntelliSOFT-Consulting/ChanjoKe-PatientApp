import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Outlet, Link } from "react-router-dom";

const SideNav = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">
              Home
            </Link>
          </li>
          <li>
            <Link to="/vaccine-schedule">
              Vaccination Schedule
            </Link>
          </li>
          <li>
            <Link to="/vaccine-certificate">
              Vaccination Certificate
            </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default SideNav;