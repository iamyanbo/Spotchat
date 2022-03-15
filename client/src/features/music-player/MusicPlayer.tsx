import React, { FunctionComponent } from "react";
import { FaPauseCircle, FaStepForward, FaStepBackward } from "react-icons/fa";

const MusicPlayer: FunctionComponent = () => {
  return (
    <object className="w-1/2 flex flex-col items-center">
      <audio />
      <div className="flex gap-4 items-center">
        <button className="hover:opacity-75">
          <FaStepBackward className="text-slate-400 text-xl" />
        </button>
        <button className="hover:opacity-75">
          <FaPauseCircle className="text-yellow-50 text-2xl" />
        </button>
        <button className="hover:opacity-75">
          <FaStepForward className="text-slate-400 text-xl" />
        </button>
      </div>
      <div className="w-full flex text-yellow-50 items-center">
        <span>1:10</span>
        <div className="w-full bg-slate-700 rounded-full h-1 mx-2">
          <div
            className="bg-slate-400 h-1 rounded-full"
            style={{ width: `${50}%` }}
          ></div>
        </div>
        <span>3:10</span>
      </div>
    </object>
  );
};

export default MusicPlayer;
