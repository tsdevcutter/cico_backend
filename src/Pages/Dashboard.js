import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavigation from '../Components/TopNavigation';
import SideNavigation from '../Components/SideNavigation';
import { useSelector } from 'react-redux';
import AccessDenied from './AccessDenied';


function Dashboard() {
    
    const navigate                    = useNavigate();
    const {user}                      = useSelector((state) => state.auth);

    useEffect(() => {

        if(!user){
            navigate("/login");
        }
    },[user, navigate])

  return (
      <div className="dashingboard-outer">   
        {
          user &&  (user.isAdmin === true && user.approve != false)  ? (
              <div className="dashingboard d-flex">
                <div className="side-dash p-3 vh-100">
                    <SideNavigation member={user} />
                </div>
                <div className="main-dash-content flex-grow-1">
                        <div className="top-nav">
                            <TopNavigation />
                        </div>
                        <div className="main-content-arena p-4">
                            <Outlet />
                        </div>
                </div>
          </div>
          )
          :
            <AccessDenied />
        }       
      </div>
  )
}

export default Dashboard