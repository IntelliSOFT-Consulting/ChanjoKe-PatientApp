import MOHLogo from '../assets/nav-logo.png';
import { Link } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'
import { useNavigate } from 'react-router-dom'

function NavBar() {

  const navigate = useNavigate()

  const logUserOut = () => {
    localStorage.clear();
    navigate("/login")
  }

  return (
    <div className="hidden sm:block md:block">
      <div className="flex flex-wrap items-center gap-6 rounded-lg px-4 sm:flex-nowrap sm:px-6 lg:px-8 shadow py-4">
        <img
          className="h-12"
          src={MOHLogo}
          alt="Ministry of Health"/>
        <Link
          to="/"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-[#163C94] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Need Help?
        </Link>

        <ProfileDropdown />
      </div>
    </div>
  )
}

export default NavBar;
