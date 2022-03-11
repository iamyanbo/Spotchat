import Link from "next/link";
import React, { FunctionComponent, ReactElement } from "react";

interface NavItemProps {
  pageName: string;
  active: boolean;
  icon: ReactElement;
  redirect: string;
}

const NavItem: FunctionComponent<NavItemProps> = ({
  pageName,
  active,
  icon,
  redirect,
}) => {
  return (
    <Link href={redirect}>
      <div className="h-full flex flex-col">
        <div
          className={`flex flex-col justify-center items-center h-full text-${
            active ? "green-500" : "slate-400"
          } hover:text-green-500 hover:cursor-pointer`}
        >
          <span className="text-2xl text-inherit">{icon}</span>

          <p className={`text-inherit text-sm xs:hidden md:block`}>
            {pageName}
          </p>
        </div>
        {active && (
          <div className="bg-green-500 w-16 h-1 justify-self-end xs:hidden md:block"></div>
        )}
      </div>
    </Link>
  );
};

export default NavItem;
