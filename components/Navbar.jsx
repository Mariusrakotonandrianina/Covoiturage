import React, { useState, useEffect } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onSearch, searchTerm }) => {
  const router = useRouter();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [utilisateurEmail, setUtilisateurEmail] = useState('');

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('utilisateurEmail');
    if (storedEmail) {
      setIsLoggedIn(true);
      setUtilisateurEmail(storedEmail);
    }
  }, [utilisateurEmail]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (value === '') {
      onSearch('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('utilisateurEmail');
    setIsLoggedIn(false);
    setUtilisateurEmail('');
    router.push('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const isActive = (pathname) => {
    return router.pathname === pathname ? 'text-blue-600 underline' : 'text-gray-600';
  };

  const isHomePage = router.pathname === '/';

  return (
    <nav className="w-full bg-white border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-1">
      <div className="flex flex-wrap items-center justify-between text-gray-600">
        <div className="flex items-center">
          <div className="mr-2">
            <img src="/images/logo.jpg" alt="Logo" className="w-20 h-20 rounded-full" />
          </div>
          <div>
            <h1 className="block cursor-pointer py-1.5 font-sans text-base font-bold leading-relaxed tracking-normal text-gray-600 antialiased">
              Atero aho
            </h1>
          </div>
        </div>
        {!isHomePage && (
          <div className="items-center hidden gap-x-2 lg:flex">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full gap-2 md:w-max ml-20">
              <input
                type="search"
                placeholder="Recherche"
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="peer h-full w-72 rounded-[7px] border border-blue-gray-300 border-t-transparent !border-t-blue-gray-300 bg-transparent px-3 py-2.5 pl-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder:text-blue-gray-300 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:!border-blue-gray-300 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 text-black"
              />
              <SearchIcon className="absolute left-3 top-[13px] w-6 h-6 text-blue-400" />
              <button
                type="submit"
                className="select-none rounded-lg bg-gray-300 py-2 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-300/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                <span className="text-gray-600">Rechercher</span>
              </button>
            </form>
          </div>
        )}

        <div className="hidden lg:block">
          <ul className="flex flex-col gap-2 my-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 mr-5">
            <li className={`text-lg hover:text-blue-700 ${isActive('/')}`}>
              <Link href="/" passHref>
                <span className="flex items-center transition-colors">
                  Accueil
                </span>
              </Link>
            </li>
            <li className={`text-lg hover:text-blue-700 ${isActive('/Trajet/MesTrajets')}`}>
              <Link href="/Trajet/MesTrajets" passHref>
                <span className="flex items-center transition-colors">
                  Mes trajets
                </span>
              </Link>
            </li>
            <li className={`text-lg hover:text-blue-700 ${isActive('/ReservationPage/Location')}`}>
              <Link href="/ReservationPage/Location" passHref>
                <span className="flex items-center transition-colors">
                  Location
                </span>
              </Link>
            </li>
            <li className="text-lg hover:text-blue-700">
              <div className="relative">
                <button onClick={toggleDropdown} className="rounded-full border border-gray-300 p-1">
                  <FontAwesomeIcon icon={faUserCircle} className="text-lg mr-1" />
                  <span className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {utilisateurEmail}
                  </span>
                </button>
                {isDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-600 divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <Link
                          href="/ReservationPage/historiqueReservation"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Historique
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/ReservationPage/historiqueLocationReservation"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Location effectué
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white focus:outline-none"
                        >
                          Se déconnecter
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
           </ul>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
