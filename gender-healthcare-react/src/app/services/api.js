import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const accountAPI = {

  // login: (credentials) => api.post('/accounts/login', credentials),
  // register: (userData) => api.post('/accounts/register', userData),
  // getCurrentUser: () => api.get('/accounts/me'),
  // updateProfile: (data) => api.put('/accounts/me', data),

};

export const customerAPI = {
  getProfile: () => api.get("/customers/me"),
  updateProfile: (data) => api.put("/customers/me", data),
};

export const counselorAPI = {
  getAll: () => api.get("/counselors"),
  getById: (id) => api.get(`/counselors/${id}`),
};

export const questionAPI = {
  getAll: (params) => api.get("/questions", { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post("/questions", data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const commentAPI = {
  getByQuestionId: (questionId) => api.get(`/questions/${questionId}/comments`),
  create: ( data) => api.post(`/questions/${data.questionId}/comments`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const cycleAPI = {
  getAll: () => api.get("/cycles"),
  create: (data) => api.post("/cycles", data),
  update: (id, data) => api.put(`/cycles/${id}`, data),
  delete: (id) => api.delete(`/cycles/${id}`),
};

export const reminderAPI = {
  getAll: () => api.get("/reminders"),
  create: (data) => api.post("/reminders", data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};


export const blogAPI = {
  getAll: () => api.get('/blogs'),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),

  getById: (id) => api.get(`/blogs/${id}`), 

};


// dotor
export const doctorAPI = {
  getAll: () => api.get("/doctors"),
  create: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};


export const parameterAPI = {
  getAll: () => api.get('/parameters'),
  getById: (id) => api.get(`/parameters/${id}`), 
  create: (data) => api.post('/parameters', data),
  update: (id, data) => api.put(`/parameters/${id}`, data),
  delete: (id) => api.delete(`/parameters/${id}`),
};
// export const testbookingAPI = {
//   getAll: () => api.get('/testbookings'),
//   getById: (id) => api.get(`/testbookings/${id}`), 
//   create: (data) => api.post('/testbookings', data),
//   update: (id, data) => api.put(`/testbookings/${id}`, data),
//   delete: (id) => api.delete(`/testbookings/${id}`),
// };
export const testresultAPI = {
  getAll: () => api.get('/testresults'),
  getById: (id) => api.get(`/testresults/${id}`), 
  create: (data) => api.post('/testresults', data),
  update: (id, data) => api.put(`/testresults/${id}`, data),
  delete: (id) => api.delete(`/testresults/${id}`),
};
export const testresultdetailAPI = {
  getAll: () => api.get('/testresultdetails'),
  getById: (id) => api.get(`/testresultdetails/${id}`), 
  create: (data) => api.post('/testresultdetails', data),
  update: (id, data) => api.put(`/testresultdetails/${id}`, data),
  delete: (id) => api.delete(`/testresultdetails/${id}`),
};
// export const testserviceparameterAPI = {
//   getAll: () => api.get('/testserviceparameters'),
//   getById: (id) => api.get(`/testserviceparameters/${id}`), 
//   create: (data) => api.post('/testserviceparameters', data),
//   update: (id, data) => api.put(`/testserviceparameters/${id}`, data),
//   delete: (id) => api.delete(`/testserviceparameters/${id}`),
// };