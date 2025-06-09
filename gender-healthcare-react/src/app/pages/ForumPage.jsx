// import React, { useEffect, useState } from 'react';
// import { api } from '../services/api';
// import QuestionList from '../pages/ForumPage/ForumComponents/QuestionList';
// import QuestionDetail from '../pages/ForumPage/ForumComponents/QuestionDetail';

// const ForumPage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [selected, setSelected] = useState(null);

//   useEffect(() => {
//     api.get('/questions').then(res => setQuestions(res.data));
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Diễn đàn tư vấn</h1>
//       <QuestionList questions={questions} onSelect={setSelected} />
//       {selected && <QuestionDetail question={selected} onClose={() => setSelected(null)} />}
//     </div>
//   );
// };

// export default ForumPage;
