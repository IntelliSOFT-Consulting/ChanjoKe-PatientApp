import { Menu, Transition } from "@headlessui/react";
import { Modal } from "antd";
import { Fragment, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserDetailsForm from "./UserDetailsForm";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function ProfileDropdown() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.clientInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const logUserOut = useCallback(() => {
    dispatch(logout());
    navigate("/user-auth");
  }, [dispatch, navigate]);

  return (
    <>
      {/* User Details Modal */}
      <Modal
        title="USER DETAILS"
        visible={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <UserDetailsForm />
      </Modal>

      <Menu as="div" className="relative">
        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=163C94&color=fff`}
            alt="User Avatar"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={showModal}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block w-full px-4 py-2 text-sm text-gray-700 text-left"
                  )}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logUserOut}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block w-full px-4 py-2 text-sm text-gray-700 text-left"
                  )}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
