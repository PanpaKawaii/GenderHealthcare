import React from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Answered: 'bg-green-100 text-green-800',
  Closed: 'bg-red-100 text-red-800',
};

const QuestionCard = ({ question, onSelect }) => (
  <div onClick={() => onSelect(question)} className="cursor-pointer bg-white p-4 rounded shadow hover:bg-gray-100 mb-2">
    <div className="font-semibold">{question.accountId.name}</div>
    <div className="text-gray-700">{question.content.slice(0,80)}...</div>
    <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
      <span>{dayjs(question.createDate).format('DD/MM/YYYY')}</span>
      <span className={classNames("px-2 py-1 rounded", statusColor[question.status])}>
        {question.status}
      </span>
    </div>
  </div>
);

export default QuestionCard;
