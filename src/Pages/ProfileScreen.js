import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../reduxAuth/authSlice';
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";

function ProfileScreen() {
  
  const {user}                                                        = useSelector((state) => state.auth);
  
  const [currentCompany, setCurrentCompany]                           = useState(null);

  const navigate                                                      = useNavigate();
  const dispatch                                                      = useDispatch();

  useEffect(() => {
    if(user.companynumber.length > 1){
      getTheCurrentCompany()
    }
  },[])

  const onLogOut = () => {
        dispatch(logout());
        navigate("/");
   }

  const getTheCurrentCompany = async () => {
    try{

      const results = await axios.get(CONSTANTS.API_URL +"users/company/details/v1/" + user.companynumber, {
          headers: {
            token: "Bearer " + user.accessToken
          }
        });

        setCurrentCompany(results.data);
   
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="card-container">
      <div className="card">
        <h4>Profile</h4>
        <div className="section-part">
          <div className="row">
              <div className="col-md-9">
                User
                <table className="table table-striped mt-3">
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>:</td>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <td>Surname</td>
                      <td>:</td>
                      <td>{user.surname}</td>
                    </tr>
                    <tr>
                      <td>Employee Number</td>
                      <td>:</td>
                      <td>{user.empnumber}</td>
                    </tr>
                    <tr>
                      <td>Company Number</td>
                      <td>:</td>
                      <td>{user.companynumber}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>:</td>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>:</td>
                      <td>{user.phone}</td>
                    </tr>
                    <tr>
                      <td>Title</td>
                      <td>:</td>
                      <td>{user.jobTitle}</td>
                    </tr>
                    <tr>
                      <td>ID</td>
                      <td>:</td>
                      <td>{user.idNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-3">
                <div className="profile-extras">
                    <div className="profile-image"></div>
                    <div className="edit-block"></div>
                </div>
              </div>
            </div>
        </div>
        
          {
            currentCompany !== null && (
              <div className="section-part">
                Company
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <td>Title</td>
                      <td>:</td>
                      <td>{currentCompany.title}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>:</td>
                      <td>{currentCompany.address}</td>
                    </tr>
                    <tr>
                      <td>Company Number</td>
                      <td>:</td>
                      <td>{currentCompany.companynumber}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>:</td>
                      <td>{currentCompany.phone}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>:</td>
                      <td>{currentCompany.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          }        
       <div className="mt-3 log-view">
            <button className="btn btn-danger" onClick={onLogOut}>Logout</button>
        </div>
      </div>       
    </div>
  )
}

export default ProfileScreen