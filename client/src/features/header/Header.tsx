import React, { FunctionComponent } from "react";
import {
  FaSpotify,
  FaSearch,
  FaHome,
  FaUserFriends,
  FaSort,
  FaPlusSquare,
} from "react-icons/fa";
import NavItem from "./NavItem";
import UserProfilePic from "../user-profile-pic/UserProfilePic";

const Header: FunctionComponent = () => {
  return (
    <header className="h-16 bg-slate-700 flex items-center justify-between px-3">
      <div className="flex items-center w-1/3">
        <FaSpotify className="text-green-500 text-4xl mr-5" />
        <div className="relative w-full">
          <FaSearch className="text-slate-400 text-xl absolute pointer-events-none top-1/2 transform -translate-y-1/2 left-3" />
          <input
            type="text"
            placeholder="Search"
            className="border-2 border-slate-400 bg-inherit h-3/5 w-5/6 rounded-lg placeholder-slate-400 text-slate-400 pl-10 py-2 pr-2 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
      </div>
      <nav className="flex w-5/12 justify-between mr-5 h-full">
        <NavItem icon={<FaHome />} pageName="Home" active={true} />
        <NavItem icon={<FaSort />} pageName="Public" active={false} />
        <NavItem icon={<FaUserFriends />} pageName="Friends" active={false} />
        <NavItem icon={<FaPlusSquare />} pageName="Post" active={false} />
        <div className="flex flex-col justify-center items-center">
          <UserProfilePic
            imgSrc="https://randomuser.me/api/portraits/men/26.jpg"
            height={"1/2"}
          />
          <p className="text-slate-400 text-sm">Me</p>
        </div>
      </nav>
    </header>
  );
};

export default Header;
