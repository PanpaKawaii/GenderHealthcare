require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const accountRoutes = require('./routes/account.routes');
const customerRoutes = require('./routes/customer.routes');
const counselorRoutes = require('./routes/counselor.routes');
const questionRoutes = require('./routes/question.routes');
const commentRoutes = require('./routes/comment.routes');
const cycleRoutes = require('./routes/cycle.routes');
const reminderRoutes = require('./routes/reminder.routes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));


app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use('/api/accounts', accountRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/reminders', reminderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API runninng at http://localhost:${PORT}`));
