import React, { FunctionComponent } from "react";

interface UserProfilePicProps {
  imgSrc: string;
  height: string;
}

const UserProfilePic: FunctionComponent<UserProfilePicProps> = ({
  imgSrc,
  height,
}) => {
  return (
    <img src={imgSrc} alt="User Profile" className={`rounded-full h-1/2`} />
  );
};

export default UserProfilePic;
