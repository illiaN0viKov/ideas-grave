import React from 'react'
import type { IdeaType } from '@/lib/types/types.project'
import Idea from './Idea'
import { select } from 'framer-motion/client'

type Props = {
  ideas: IdeaType[]
    selectIdea: (idea: IdeaType | null) => void

}

const Ideas = ({ ideas,selectIdea , }: Props) => {
  return (
    <div className="grid mx-auto grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 ">
      {ideas.map((idea) => (
        <button key={idea._id.toString()} onClick={()=>selectIdea(idea)}>
        <Idea key={idea._id.toString()} idea={idea} />
        </button>
      ))}
    </div>
  )
}
export default Ideas