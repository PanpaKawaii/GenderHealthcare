import React from 'react';
import dayjs from 'dayjs';

const CommentItem = ({ comment }) => (
  <div className="bg-gray-50 rounded p-3 mb-2">
    <div className="font-semibold text-sm">{comment.accountId.name} ({comment.accountId.role})</div>
    <div className="text-gray-700">{comment.content}</div>
    <div className="text-xs text-gray-500 mt-1">{dayjs(comment.createDate).format('DD/MM/YYYY HH:mm')}</div>
  </div>
);

export default CommentItem;
