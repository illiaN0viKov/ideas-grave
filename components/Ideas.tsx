import React from 'react'
import type { IdeaType } from '@/lib/types/types.project'
import Idea from './Idea'

type Props = {
  ideas: IdeaType[]
}

const Ideas = ({ ideas }: Props) => {
  return (
    <div className="grid mx-auto grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 ">
      {ideas.map((idea) => (
        <Idea key={idea._id.toString()} idea={idea} />
      ))}
    </div>
  )
}
export default Ideas