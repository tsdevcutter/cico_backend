import React from 'react'
import './layout.css';

function TopNavigation() {
  return (
    <div className="navigation-top d-flex align-items-center">     
        <div className="d-flex align-items-center">
          <div className="left-open"></div>
          <div className="notification"></div>
          <div className="profile-quick"></div> 
        </div>               
    </div>
  )
}

export default TopNavigation