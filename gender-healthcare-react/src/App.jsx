import './App.css';
import MainRoutes from './app/routes/MainRoutes';
import CounselorRoutes from './app/routes/CounselorRoutes';
import CustomerRoutes from './app/routes/CustomerRoutes.jsx';
import { UserAuth } from './app/hooks/Context/AuthContext.jsx';
import AdminRoutes from './app/routes/AdminRoutes.jsx';

export default function App() {
  const { Id, Token, Role, IsLogIn } = UserAuth();
  console.log('Id', Id);
  console.log('Token', Token);
  console.log('Role', Role);
  console.log('IsLogIn', IsLogIn);

  // Sau này sẽ thêm AdminRoutes và DoctorRoutes
  if (Role == 'Counselor') {
    return <CounselorRoutes />;
  } else if (Role == 'Customer') {
    return <CustomerRoutes />;
  }
  else if (Role == 'Admin') {
    return <AdminRoutes />;
  } else return <MainRoutes />;
}


