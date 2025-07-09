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
  const { Id, Token, Role, IsLogIn } = UserAuth();
  console.log("Id", Id);
  console.log("Token", Token);
  console.log("Role", Role);
  console.log("IsLogIn", IsLogIn);

  // Sau này sẽ thêm AdminRoutes và DoctorRoutes
  if (Role == "Counselor") {
    return <CounselorRoutes />;
  } else if (Role == "Customer") {
    return <CustomerRoutes />;
  } else if (Role == 'Admin') {
    return <AdminRoutes />;
  }else if (Role == 'Doctor') {
    return <DoctorRoutes/>;
  }  
  else return <MainRoutes />;
}
