import MOHLogo from "../assets/nav-logo.png";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useEffect, useState } from "react";
import { useApiRequest } from "../api/useApi";
import { writeAge, calculateAges } from "../utils/methods";

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [age, setAge] = useState("");

  const { get } = useApiRequest();

  const fetchUserData = async () => {
    const response = await get(`/chanjo-hapi/fhir/Patient/${user?.fhirPatientId}`);
    const age = calculateAges(response?.birthDate);
    localStorage.setItem("userDetails", JSON.stringify(response));
    setAge(writeAge(age));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className='hidden lg:block'>
      <div className='flex flex-wrap items-center gap-6 rounded-lg px-4 sm:flex-nowrap sm:px-6 lg:px-8 shadow py-4'>
        <img className='h-12' src={MOHLogo} alt='Ministry of Health' />

        <div className='ml-auto flex gap-x-1'>
          <span className='font-bold'>AGE:</span> {age}
        </div>
        <Link
          to='faqs'
          className='ml-auto flex items-center rounded-md bg-[#163C94] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          FAQs
        </Link>

        <ProfileDropdown />
      </div>
    </div>
  );
}

export default NavBar;
