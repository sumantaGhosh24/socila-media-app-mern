import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {FaBars, FaTimes} from "react-icons/fa";
import {useSelector} from "react-redux";

import {Search, AvatarDropdown, UserCard} from "./";
import {useAuth} from "../hooks";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {id} = useAuth();
  const {searchUsers} = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    {label: "Home", path: "/"},
    {label: "Discover", path: "/discover"},
  ];

  const {pathname} = useLocation();

  const isActive = (pn) => {
    if (pn === pathname) return "bg-gray-700 text-white";
  };

  return (
    <>
      <nav className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="h-8 w-8"
                  src="/logo-big.png"
                  alt="Logo"
                  onClick={() => window.scrollTo({top: 0})}
                />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="px-2 pt-2 pb-3 space-y-1 flex items-center sm:px-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 mx-2 py-2 rounded-md text-base font-medium ${isActive(
                      link.path
                    )}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <AvatarDropdown id={id} />
              </div>
            </div>
            <div className="hidden md:block">
              <Search search={search} setSearch={setSearch} />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-900"
                aria-expanded={isMenuOpen ? "true" : "false"}
              >
                <span className="sr-only">Open menu</span>
                {!isMenuOpen ? (
                  <FaBars size={24} color="white" />
                ) : (
                  <FaTimes size={24} color="white" />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 mx-2 py-2 rounded-md text-base font-medium ${isActive(
                      link.path
                    )}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-3">
                  <AvatarDropdown id={id} />
                  <Search search={search} setSearch={setSearch} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="fixed top-20 right-5 max-h-[80vh] overflow-y-scroll shadow-lg rounded-lg">
        {search &&
          searchUsers &&
          searchUsers.map((user) => <UserCard key={user._id} user={user} />)}
      </div>
    </>
  );
};

export default Header;
