import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments }) => (
  <div className="mt-4">
    {comments.map(c => <CommentItem key={c._id} comment={c} />)}
  </div>
);

export default CommentList;
