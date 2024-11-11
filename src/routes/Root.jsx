import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import ProfileDropdown from "../components/ProfileDropdown";

const navigation = [
  { name: "Home", href: "/", icon: "house" },
  { name: "Vaccination Schedule", href: "/vaccination-schedule", icon: "vaccines" },
  { name: "Vaccination Certificate", href: "/vaccination-certificate", icon: "description" },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.clientInfo);

  const handleSidebarToggle = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/user-auth");
    }
  }, [user, navigate]);

  if (!user?.access_token) return null;

  return (
    <div>
      {/* Mobile Sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50 lg:hidden' onClose={handleSidebarClose}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900/80' />
          </Transition.Child>

          <div className='fixed inset-0 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1 bg-white'>
                <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                  <button type='button' className='-m-2.5 p-2.5' onClick={handleSidebarClose}>
                    <span className='sr-only'>Close sidebar</span>
                    <XMarkIcon className='h-6 w-6 text-white' aria-hidden='true' />
                  </button>
                </div>
                <Sidebar navigation={navigation} pathname={pathname} onLinkClick={handleSidebarClose} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
        <Sidebar navigation={navigation} pathname={pathname} />
      </div>

      {/* Header for mobile view */}
      <div className='sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden'>
        <button type='button' className='-m-2.5 p-2.5 text-gray-700' onClick={handleSidebarToggle}>
          <span className='sr-only'>Open sidebar</span>
          <Bars3Icon className='h-6 w-6' aria-hidden='true' />
        </button>
        <div className='flex-1 text-sm font-semibold leading-6 text-gray-900'>OpenCHANJO</div>
        <ProfileDropdown />
      </div>

      {/* Main content area */}
      <main className='py-10 lg:pl-72'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <NavBar />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ navigation, pathname, onLinkClick }) {
  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white'>
      <div className='grid grid-cols-8 h-28 shrink-0 auto-cols-fr items-center'>
        <div className='bg-[#163C94] col-span-7 h-full text-white text-4xl text-center pt-8'>OpenCHANJO</div>
        <div className='grid grid-cols-3 gap-1 h-full bg-white'>
          <div className='basis-1/4 bg-black'></div>
          <div className='basis-1/4 bg-[#BB0100]'></div>
          <div className='basis-1/2 bg-[#286208]'></div>
        </div>
      </div>
      <nav className='flex flex-1 flex-col px-6'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onLinkClick}
                    className={classNames(
                      pathname === item.href ? "bg-gray-50 text-indigo-600" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <span className='material-symbols-outlined'>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
