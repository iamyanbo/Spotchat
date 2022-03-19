
import React from "react";

import { FaPlay} from "react-icons/fa";
import { RiStackFill, RiPlayList2Fill } from "react-icons/ri";

import MusicItem from "../music-item/MusicItem";
import {SongInfo} from "./PostComponent"




function PlayableMusicComponent(props: SongInfo) {


            return(

                <div className="flex bg-[#1E293B] h-[125px] items-center justify-between">

                <div className="flex items-center ml-8">
                    <MusicItem name={props.name} creator={props.artistName} coverSrc={props.albumCoverPath}></MusicItem>
                </div>

                <div className="flex items-center">
                    <button> <FaPlay className="text-[#ECFCCB] mr-5 h-[20px] w-[20px]"></FaPlay></button>
                    <button><RiStackFill className="text-[#ECFCCB] mr-5 h-[20px] w-[20px]"></RiStackFill></button>
                    <button><RiPlayList2Fill className="text-[#ECFCCB] mr-5 h-[20px] w-[20px]"></RiPlayList2Fill></button>
                </div>
                 </div>

            );





}



export default PlayableMusicComponent;