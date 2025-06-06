require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const accountRoutes = require('./routes/account.routes');
const customerRoutes = require('./routes/customer.routes');
const counselorRoutes = require('./routes/counselor.routes');
const questionRoutes = require('./routes/question.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use('/api/accounts', accountRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API running at ${PORT}`));
