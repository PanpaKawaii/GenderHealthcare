import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions, onSelect }) => (
  <div>
    {console.log('Rendering QuestionList with questions:', questions)}
    {questions.map(q => <QuestionCard key={q._id} question={q} onSelect={onSelect} />)
   }
  </div>
);

export default QuestionList;
