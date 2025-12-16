import React from 'react'
import { FaCalendar, FaCogs, FaHome, FaPlane, FaUserAlt, FaFile, FaCopy } from "react-icons/fa";
import './layout.css';
import logo from '../assets/halflogo.png';
import { NavLink } from 'react-router-dom';

function SideNavigation({member}) {

  return (
    <div className="navigation-side">
        <div className="box-head-logo">
          <img src={logo} className="side-bar-head" />
        </div>
        <div className="center-heading fs-5 fw-bold mb-4 text-center">
          CICO
        </div>
          <ul className="menu-list nav flex-column">
            <li className="nav-item mb-2">
              {/* Use NavLink and the 'className' function to add 'active' class */}
              <NavLink 
              to="/" 
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              end 
            >
              <span className="side-nav-icon">
              <FaHome />
              </span>
              <span className="side-nav-text">Home</span>
            </NavLink>
            </li>
            {
            member.role.includes('business') && (
              <li className="nav-item mb-2">
              <NavLink 
                to="/employees" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >      
                <span className="side-nav-icon">
                <FaUserAlt />
                </span>
                <span className="side-nav-text">Employees </span>
              </NavLink>
              </li>
            )
            }
            {
            member.role.includes('super') ? (
              <li className="nav-item mb-2">
              <NavLink 
                to="/projects-list" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >      
                <span className="side-nav-icon">
                <FaCopy />
                </span>
                <span className="side-nav-text">Projects</span>
              </NavLink>
              </li>
            )
            :
            <li className="nav-item mb-2">
              <NavLink 
                to="/projects" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >      
                <span className="side-nav-icon">
                <FaFile />
                </span>
                <span className="side-nav-text">Projects</span>
              </NavLink>
              </li>
            }
          
            <li className="nav-item mb-2">
            <NavLink 
              to="/calendar" 
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >      
              <span className="side-nav-icon">
              <FaCalendar />
              </span>
              <span className="side-nav-text">Calendar</span>
            </NavLink>
            </li>
            
            {
            member.role.includes('super') ? (
              <li className="nav-item mb-2">
              <NavLink 
                to="/total-flights" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >      
                <span className="side-nav-icon">
                <FaPlane />
                </span>
                <span className="side-nav-text">Total Flights</span>
              </NavLink>
              </li>
            )
            :
              <li className="nav-item mb-2">
              <NavLink 
                to="/flights" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >      
                <span className="side-nav-icon">
                <FaPlane />
                </span>
                <span className="side-nav-text">Flights</span>
              </NavLink>
              </li>
            }
            {
            member.role.includes('super') && (
              <li className="nav-item mb-2">
              <NavLink 
                to="/settings" 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              >  
                <span className="side-nav-icon">
                <FaCogs />
                </span>
                <span className="side-nav-text">Settings</span>
              </NavLink>
              </li>
            )
            }
          </ul>
  </div>
  )
}

export default SideNavigation