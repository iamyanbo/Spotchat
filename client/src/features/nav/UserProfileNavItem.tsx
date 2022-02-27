import Link from "next/link";
import React, { FunctionComponent, useState } from "react";
import UserProfilePic from "../user-profile-pic/UserProfilePic";

interface UserProfileNavItemProps {
  active: boolean;
}

const UserProfileNavItem: FunctionComponent<UserProfileNavItemProps> = ({
  active,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Link href="/user-profile">
      <div
        className="flex flex-col justify-center items-center hover:cursor-pointer"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <UserProfilePic
          imgSrc="https://randomuser.me/api/portraits/men/26.jpg"
          height={"24px"}
          hoverEffect={true}
          hovering={hover || active}
        />
        <p
          className={`text-${
            hover || active ? "green-500" : "slate-400"
          } text-sm xs:hidden md:block`}
        >
          Me
        </p>
      </div>
    </Link>
  );
};

export default UserProfileNavItem;
