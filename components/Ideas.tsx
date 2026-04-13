import React from 'react'
import type { Idea as IdeaType } from '@/lib/types/types-ideas'
import Idea from './Idea'


type Props = {
    ideas:IdeaType[]
}

const Ideas = (props: Props) => {
  return (
    <div>
        {props.ideas.map((idea)=>{ return (
            <div key={idea.id}>
                <Idea idea={idea}/>
            </div>
        )})}
    </div>
  )
}

export default Ideas