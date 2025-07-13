import "./App.css";
import MainRoutes from "./app/routes/MainRoutes";
import CounselorRoutes from "./app/routes/CounselorRoutes";
import DoctorRoutes from "./app/routes/DoctorRoutes.jsx"
import CustomerRoutes from "./app/routes/CustomerRoutes.jsx";
import AdminRoutes from './app/routes/AdminRoutes.jsx';
import { UserAuth } from "./app/hooks/Context/AuthContext.jsx";
import { useEffect } from "react";
import { initAuth, setupAxiosInterceptors } from "./app/services/authService";

export default function App() {
  // Setup authentication on app load
  useEffect(() => {
    // Initialize auth token from localStorage
    initAuth();
    
    // Setup interceptors to handle expired tokens
    setupAxiosInterceptors();
  }, []);
  const { Id, token, UserRole, IsLogIn } = UserAuth();
  console.log("Id", Id);
  console.log("token", token);
  console.log("UserRole", UserRole);
  console.log("IsLogIn", IsLogIn);

  // Sau này sẽ thêm AdminRoutes và DoctorRoutes
  if (UserRole == "Counselor") {
    return <CounselorRoutes />;
  } else if (UserRole == "Customer") {
    return <CustomerRoutes />;
  } else if (UserRole == 'Admin') {
    return <AdminRoutes />;
  }else if (UserRole == 'Doctor') {
    return <DoctorRoutes/>;
  }  
  else return <MainRoutes />;
}
