import React from 'react'
import type { IdeaType } from '@/lib/types/types.project'


type Props = {
  idea: IdeaType;
};

const Idea = ({ idea }: Props) => {

  const statusImages = {
    active: "/live.png",
    abandoned: "/died.png",
    done: "/done.png",
  };

const radius = 86;

return (
  <div className="flex items-center justify-center ">
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
      
      <svg className="absolute w-full h-full" viewBox="0 0 200 200">
        <defs>
          <path
            id={`circlePath-${idea._id.toString()}`}
            d={`
              M ${100 - radius}, 100
              A ${radius},${radius} 0 0,1 ${100 + radius}, 100
            `}
            fill="none"
          />
        </defs>

        <text
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[20px] sm:text-[20px] md:text-[17px] lg:text-[17px]"
        >
          <textPath
            href={`#circlePath-${idea._id.toString()}`}
            startOffset="50%"
          >
            {idea.title}
          </textPath>
        </text>
      </svg>

      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-md shadow-black/30 z-10">
        <img
          src={statusImages[idea.status]}
          alt="status"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
);
};

export default Idea;