import React, { useEffect, useState } from 'react'
import { logout } from '../reduxAuth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

function HomeScreen() {

  const {user}                                                        = useSelector((state) => state.auth);

  const [businessShortList, setBusinessShortList]                     = useState(null);
  const [mainShortList, setMainShortList]                             = useState(null);

  const dispatch                                                      = useDispatch();

  useEffect(() => {
    collectMainAdminstrator();
    collectBusinssAdministrator();
  },[])

  const collectMainAdminstrator = async () => {
    try{
      if(user.isAdmin && user.role.includes("super")){
        
        const results = await axios.get(CONSTANTS.API_URL +"settings/home/details/v1/main", {
          headers: {
            token: "Bearer " + user.accessToken
          }
        });

        setMainShortList(results.data);
      }
    
    }catch(err){
      console.log(err);
        if(err.status === 403 && err.response.data === "Token is not valid!"){
           console.log("log user out");
            dispatch(logout());
        }
    }
  }

  const collectBusinssAdministrator = async () => {
    try{

      if(user.isAdmin && user.role.includes("business")){

        const results = await axios.get(CONSTANTS.API_URL +"settings/home/details/v1/business/" + user.companynumber, {
          headers: {
            token: "Bearer " + user.accessToken
          }
        });
        setBusinessShortList(results.data);
      }
    }catch(err){
      console.log(err);
      if(err.status === 403 && err.response.data === "Token is not valid!"){
          console.log("log user out");
            dispatch(logout());
        }
    }
  }
  return (
    <div className="card-container">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <div className="sub-title-text">
          Plan, prioritize and accomplish the most from your projects
          <div className="content">
             {
              mainShortList && (
                <div className="row">
                  <div className="col-md-3">
                     <div className="card-box color-card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Total Projects</div>
                             <Link
                              to={'/projects'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {mainShortList.totalProjects}
                          </div>
                     </div>
                  </div>

                  <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Running Projects</div>
                             <Link
                              to={'/projects'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {mainShortList.runningProjects}
                          </div>
                     </div>
                  </div>

                  <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Employees</div>
                             <Link to={'/employees'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {mainShortList.totalEmployees}
                          </div>
                     </div>
                  </div>
                   <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Flights</div>
                             <Link
                              to={'/flights'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {mainShortList.totalFlights}
                          </div>
                     </div>
                  </div>

                </div>
              )
             }

             {
              businessShortList && (
                <div className="row">
                  <div className="col-md-3">
                     <div className="card-box color-card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Total Projects</div>
                             <Link
                              to={'/projects'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {businessShortList.totalProjects}
                          </div>
                     </div>
                  </div>

                  <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Running Projects</div>
                             <Link
                              to={'/projects'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {businessShortList.runningProjects}
                          </div>
                     </div>
                  </div>

                  <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Employees</div>
                             <Link to={'/employees'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {businessShortList.totalProjectEmployees} / {businessShortList.totalEmployees}
                          </div>
                     </div>
                  </div>
                   <div className="col-md-3">
                     <div className="card-box">
                          <div className="line-one-card-bx flexme space-apart">
                             <div className="title-line-bx">Flights</div>
                             <Link
                              to={'/flights'} className="btn btn-dash-bx">
                               <div className="acute-rotate"><FaLongArrowAltRight /></div>
                             </Link>
                          </div>
                          <div className="title-bx-figure">
                            {businessShortList.totalFlights}
                          </div>
                     </div>
                  </div>

                </div>
              )
             }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen