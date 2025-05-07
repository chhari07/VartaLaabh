// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../Firebase/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedProfileOption, setSelectedProfileOption] = useState("Profile");
  const profileRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsProfileOpen(false);
    setSelectedProfileOption("Profile");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/Features" },
    { name: "Contact", path: "/Contactus" },
    { name: "About", path: "/aboutus" },
    { name: "Our Vision", path: "/ourvision" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 shadow-md z-50 rounded-4xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-4xl text-[#0C1B33]"># वार्ता-लाप</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `text-lg font-medium px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-[#0C1B33] hover:text-white"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="text-sm hover:bg-[#0C1B33] hover:text-white font-medium px-3 py-1 rounded-full transition"
              >
                {selectedProfileOption}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    to="/Dashboard"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setSelectedProfileOption("Dashboard");
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setSelectedProfileOption("View Profile");
                    }}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setSelectedProfileOption("Settings");
                    }}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#0C1B33] hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600 font-medium">
                Login
              </Link>
              <Link to="/signup" className="text-sm text-black font-medium">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t rounded-b-2xl px-4 py-2">
          {navItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-md text-black hover:rounded-4xl hover:bg-[#0C1B33] hover:text-white"
            >
              {name}
            </NavLink>
          ))}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
              >
                {selectedProfileOption}
              </button>
              {isProfileOpen && (
                <div className="mt-2 w-full bg-white border rounded-md shadow-lg z-50">
                  <Link
                    to="/Dashboard"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setSelectedProfileOption("Dashboard");
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsOpen(false);
                      setSelectedProfileOption("View Profile");
                    }}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-black hover:bg-[#0C1B33] hover:text-white"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsOpen(false);
                      setSelectedProfileOption("Settings");
                    }}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#0C1B33] hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-black"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
