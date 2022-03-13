import React, { FunctionComponent } from "react";

interface MusicItemProps {
  name: string;
  creator: string;
  coverSrc: string;
  coverHeightClass?: string;
  nameFontSize?: string;
  creatorFontSize?: string;
  creatorTextClasses?: string;
  nameTextClasses?: string;
}

const MusicItem: FunctionComponent<MusicItemProps> = ({
  name,
  creator,
  coverSrc,
  coverHeightClass = "h-16",
  creatorTextClasses = "text-sm text-yellow-50",
  nameTextClasses = "text-sm text-yellow-50 font-semibold",
}) => {
  return (
    <article className="flex items-center gap-2">
      <img
        className={`rounded-lg ${coverHeightClass}`}
        src={coverSrc}
        alt={`Cover of ${name} by ${creator}`}
      />
      <section>
        <h1 className={nameTextClasses}>{name}</h1>
        <p className={creatorTextClasses}>{creator}</p>
      </section>
    </article>
  );
};

export default MusicItem;
