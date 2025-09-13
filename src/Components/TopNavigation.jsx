import React from 'react'
import './layout.css';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function TopNavigation() {
  
  const {user}                                                              = useSelector((state) => state.auth);

  return (
    <div className="navigation-top align-items-center">     
        <div className="d-flex align-items-center">
          <div className="left-open"></div>
          <div className="right-open">
              <div className="notification"></div>
              <Link to={"/profile"} className="nav-link-pact">
              <div className="profile-quick">
                
                    <div className="user-image">
                      <FaUser />
                    </div>
                    <div className="user-content">
                      {user.name} {user.surname}
                    </div>               
              </div> 
               </Link>
          </div>
          
        </div>               
    </div>
  )
}

export default TopNavigation