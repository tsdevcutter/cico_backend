import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import LoginScreen from "./Pages/LoginScreen";
import Dashboard from "./Pages/Dashboard";
import HomeScreen from "./Pages/HomeScreen";
import Employees from "./Pages/Employees";
import EmployeeDetails from "./Pages/EmployeeDetails";
import CalendarSreen from "./Pages/CalendarSreen";
import FlightsScreen from "./Pages/FlightsScreen";
import ForgotPassword from "./Pages/ForgotPassword";
import ProfileScreen from "./Pages/ProfileScreen";
import ProjectScreen from "./Pages/ProjectScreen";
import ProjectDetails from "./Pages/ProjectDetails";
import SettingsScreen from "./Pages/SettingsScreen";
import ProjectsAdminList from "./Pages/ProjectsAdminList";
import FlightsAdminScreen from "./Pages/FlightsAdminScreen";

function App() {
  return (
     <>
     <Router>
        <div className="main-container">
          <Routes>              
             <Route path="/login" element={<LoginScreen />}/>  
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route element={<Dashboard />}>
                 <Route path="/" element={<HomeScreen/>}/> 
                 <Route path="/dashboard" element={<HomeScreen/>}/> 
                 <Route path="/employees" element={<Employees/>}/>  
                 <Route path="/employee/:id" element={<EmployeeDetails/>}/>
                 <Route path="/calendar" element={<CalendarSreen/>}/>  
                 <Route path="/flights" element={<FlightsScreen/>}/>  
                 <Route path="/total-flights" element={<FlightsAdminScreen/>}/>  
                 <Route path="/projects" element={<ProjectScreen /> } />
                 <Route path="/projects-list" element={<ProjectsAdminList />} />
                 <Route path="/project-details/:id" element={<ProjectDetails /> } />
                 <Route path="/profile" element={<ProfileScreen/>}/>  
                 <Route path="/settings" element={<SettingsScreen/>}/>  
             </Route>
          </Routes>
        </div>
     </Router>
     <ToastContainer />
    </>
  );
}

export default App;
