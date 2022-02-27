import React, { FunctionComponent } from "react";

interface UserProfilePicProps {
  imgSrc: string;
  height: string;
  hoverEffect: boolean;
  hovering?: boolean;
}

const UserProfilePic: FunctionComponent<UserProfilePicProps> = ({
  imgSrc,
  height,
  hoverEffect,
  hovering,
}) => {
  return (
    <img
      src={imgSrc}
      alt="User Profile"
      className={`rounded-full ${
        hoverEffect && hovering ? "border-2 border-green-500" : ""
      }`}
      style={{ height }}
    />
  );
};

export default UserProfilePic;
