import React, { FunctionComponent, ReactElement } from "react";

interface NavItemProps {
  pageName: string;
  active: boolean;
  icon: ReactElement;
}

const NavItem: FunctionComponent<NavItemProps> = ({
  pageName,
  active,
  icon,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col justify-center items-center h-full">
        <span className={`text-${active ? "green-500" : "slate-400"} text-3xl`}>
          {icon}
        </span>

        <p className={`text-${active ? "green-500" : "slate-400"} text-sm`}>
          {pageName}
        </p>
      </div>
      {active && <div className="bg-green-500 w-16 h-1 justify-self-end"></div>}
    </div>
  );
};

export default NavItem;
