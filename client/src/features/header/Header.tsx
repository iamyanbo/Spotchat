import React, { FunctionComponent } from "react";
import { FaSpotify } from "react-icons/fa";
import HeaderSearchBar from "./HeaderSearchBar";
import { useState } from "react";
import useWindowSize from "../../hooks/useWindowDimensions";
import Nav from "../nav/Nav";

const Header: FunctionComponent = () => {
  const [showSearch, setShowSearch] = useState(false);
  const windowSize = useWindowSize();

  return (
    <header className="h-16 bg-slate-700 flex items-center justify-between px-3 fixed w-screen top-0">
      {(showSearch || (windowSize.width && windowSize.width >= 768)) && (
        <div className="flex items-center md:w-1/3 xs:w-full xs:justify-evenly md:justify-between">
          <FaSpotify className="text-green-500 text-4xl" />
          <HeaderSearchBar
            onUnFocused={() => setShowSearch(false)}
            autoFocus={showSearch}
          />
        </div>
      )}
      {(!showSearch || (windowSize.width && windowSize.width >= 768)) && (
        <Nav onSearchClick={() => setShowSearch(true)} />
      )}
    </header>
  );
};

export default Header;
