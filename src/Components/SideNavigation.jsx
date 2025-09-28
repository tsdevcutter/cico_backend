import React from 'react'
import { FaCalendar, FaCogs, FaHome, FaPlane, FaUserAlt, FaFile } from "react-icons/fa";
import './layout.css';
import { Link } from 'react-router-dom';

function SideNavigation({member}) {
     ///console.log("SideNavigation"  );
    //console.log(member);
  return (
    <div className="navigation-side">
      <div className="center-heading fs-5 fw-bold mb-4 text-center">
         Side Title
      </div>
      <ul className="menu-list nav flex-column">
         <li className="nav-item mb-2">
          <Link to="/" className="nav-link ">           
            <span className="side-nav-icon">
              <FaHome />
            </span>
            <span className="side-nav-text">Home</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/employees" className="nav-link ">           
            <span className="side-nav-icon">
              <FaUserAlt />
            </span>
             <span className="side-nav-text">Employees </span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/projects" className="nav-link ">           
            <span className="side-nav-icon">
              <FaFile />
            </span>
            <span className="side-nav-text">Projects</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/calendar" className="nav-link ">           
            <span className="side-nav-icon">
              <FaCalendar />
            </span>
            <span className="side-nav-text">Calendar</span>
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/flights" className="nav-link ">           
            <span className="side-nav-icon">
              <FaPlane />
            </span>
            <span className="side-nav-text">Flights</span>
          </Link>
        </li>
        {
          member.role.includes('super') && (
            <li className="nav-item mb-2">
              <Link to="/settings" className="nav-link ">           
                <span className="side-nav-icon">
                  <FaCogs />
                </span>
                <span className="side-nav-text">Settings</span>
              </Link>
            </li>
          )
        }
        
      </ul>
    </div>
  )
}

export default SideNavigation