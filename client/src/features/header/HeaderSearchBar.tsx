import React, { FunctionComponent } from "react";
import { FaSearch } from "react-icons/fa";

interface HeaderSearchBarProps {
  onUnFocused?(): any;
  autoFocus: boolean;
}

const HeaderSearchBar: FunctionComponent<HeaderSearchBarProps> = ({
  onUnFocused,
  autoFocus,
}) => {
  return (
    <div className="relative w-5/6">
      <FaSearch className="text-slate-400 text-xl absolute pointer-events-none top-1/2 transform -translate-y-1/2 left-3" />
      <input
        autoFocus={autoFocus}
        type="text"
        placeholder="Search"
        onBlur={onUnFocused}
        className="w-full border-2 border-slate-400 bg-inherit h-3/5 rounded-lg placeholder-slate-400 text-slate-400 pl-10 py-2 pr-2 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
    </div>
  );
};

export default HeaderSearchBar;
