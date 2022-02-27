import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import {
  FaSearch,
  FaSpotify,
  FaHome,
  FaUserFriends,
  FaSort,
  FaPlusSquare,
} from "react-icons/fa";
import NavItem from "./NavItem";
import UserProfileNavItem from "./UserProfileNavItem";

interface NavProps {
  onSearchClick(): any;
}

const Nav: FunctionComponent<NavProps> = ({ onSearchClick }) => {
  const router = useRouter();
  return (
    <nav className="flex md:w-5/12 justify-between mx-3 h-full sm:w-full xs:w-full">
      <FaSpotify className="text-green-500 text-4xl mr-5 xs:block md:hidden self-center" />
      <div className="xs:block md:hidden" onClick={onSearchClick}>
        <NavItem
          icon={<FaSearch />}
          pageName="Search"
          redirect="/"
          active={false}
        />
      </div>
      <NavItem
        icon={<FaHome />}
        pageName="Home"
        redirect="/"
        active={router.pathname === "/"}
      />
      <NavItem
        icon={<FaSort />}
        pageName="Public"
        active={router.pathname === "/public"}
        redirect="/public"
      />
      <NavItem
        icon={<FaUserFriends />}
        pageName="Friends"
        active={router.pathname === "/friends"}
        redirect="/friends"
      />
      <NavItem
        icon={<FaPlusSquare />}
        pageName="Post"
        active={
          router.pathname === "/create-post/choose-song" ||
          router.pathname === "/create-post/description"
        }
        redirect="/create-post/choose-song"
      />
      <UserProfileNavItem active={router.pathname === "/user-profile"} />
    </nav>
  );
};

export default Nav;
