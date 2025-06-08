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
const consultationBookingRoutes = require('./routes/consultationBooking.route')
const consultationScheduleRoutes = require('./routes/consultationSchedule.routes');
const blog = require('./routes/blog.routes');


const parameterRoutes = require('./routes/parameter.routes');
const testBookingRoutes = require('./routes/testbooking.routes');
const testResultRoutes = require('./routes/testresult.routes');
const testResultDetailRoutes = require('./routes/testresultdetail.routes');
const testServiceParameterRoutes = require('./routes/testserviceparameter.routes');

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
app.use('/api/consultationbooking',consultationBookingRoutes )
app.use('/api/schedules', consultationScheduleRoutes);
app.use('/api/blogs', blog);


app.use('/api/parameters', parameterRoutes);
app.use('/api/testbookings', testBookingRoutes);
app.use('/api/testresults', testResultRoutes);
app.use('/api/testresultdetails', testResultDetailRoutes);
app.use('/api/testserviceparameters', testServiceParameterRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API runninng at http://localhost:${PORT}`));
