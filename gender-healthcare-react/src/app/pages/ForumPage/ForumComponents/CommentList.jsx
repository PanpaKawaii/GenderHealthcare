import React from 'react';
import CommentForm from './CommentForm';

const Comment = ({ comment, level = 0, onReply, replyingTo, cancelReply, refreshComments }) => {
  const isReplying = replyingTo === comment._id;
  
  return (
    <div className={`mb-4 ${level > 0 ? 'ml-6 pl-3 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-600 mb-1">
          {comment.accountId?.name || 'Anonymous'} · {new Date(comment.createDate).toLocaleDateString()}
        </div>
        <p className="text-gray-800">{comment.content}</p>
        <div className="mt-2 flex justify-end">
          <button 
            onClick={() => onReply(comment._id)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reply
          </button>
        </div>
      </div>
      
      {isReplying && (
        <div className="mt-2 ml-6">
          <CommentForm 
            questionId={comment.questionId} 
            parentCommentId={comment._id}
            refreshComments={refreshComments} 
            onCancel={cancelReply}
          />
        </div>
      )}
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <Comment
              key={reply._id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              replyingTo={replyingTo}
              cancelReply={cancelReply}
              refreshComments={refreshComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments, onReply, replyingTo, cancelReply, refreshComments }) => {
  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <Comment 
          key={comment._id} 
          comment={comment}
          onReply={onReply}
          replyingTo={replyingTo}
          cancelReply={cancelReply}
          refreshComments={refreshComments}
        />
      ))}
    </div>
  );
};

export default CommentList;