import React from 'react'
import type { Idea } from '@/lib/types/types.project'

type Props = {
  idea: Idea
}

const Idea = ({ idea }: Props) => {
  const statusImages = {
    active: "/live.png",
    graved: "/died.png",
    done: "/done.png",
  };

  const radius = 90; 

  return (
    <div className="flex items-center gap-6 m-10">
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 200 200"
        >
            <defs>
            <path
                id={`circlePath-${idea.id}`}
                d={`
                M ${100 - radius}, 100
                A ${radius},${radius} 0 0,1 ${100 + radius}, 100
                `}
                fill="none"
            />
            </defs>

          <text
            fill="black"
            fontSize="16"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <textPath
              href={`#circlePath-${idea.id}`}
              startOffset="50%"
            >
              {idea.content}
            </textPath>
          </text>
        </svg>

        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md shadow-black/30 z-10">
          <img
            src={statusImages[idea.status]}
            alt="status"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div>{idea.id}</div>
    </div>
  );
};

export default Idea;