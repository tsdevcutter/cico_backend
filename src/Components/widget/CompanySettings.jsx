import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';

function CompanySettings({user}) {
  
   const [addUser, setAddUser]                                      = useState(false);
 
   const [userAdmins, setUserAdmins]                                = useState([]);
   const [currentUserCompany, setCurrentUserCompany]                = useState(null);

 
   useEffect(() => {
     collectUsersandCompanies();
   },[])
 
   const collectUsersandCompanies = async () => {
     try{
       const results = await axios.get(CONSTANTS.API_URL +"users/company/v2/list", {
         headers: {
           token : "Bearer " + user.accessToken
         }
       });
    
       setUserAdmins(results.data);
     }catch(err){
       console.log(err);
     }
   }
 
 
   return (
     <div className="widget-admin">
       <div className="row-blow">
         <h4>Companies</h4>
       </div>
       {
          currentUserCompany === null ?
          <>
              <div className="card-block">
             
              {
                userAdmins.length > 0 && (
                  <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>  
                            <th>Surname</th>                        
                            <th>Email</th>  
                            <th>EmpNO</th>
                            <th>CONO</th>
                            <th>COTitle</th>
                            <th>Status</th>
                            <th>#</th>
                          </tr>
                    </thead>
                    <tbody>
                      {
                        userAdmins.map((admin, index ) => {
                          return  <tr key={index}>
                                    <td>{admin.name}</td>  
                                    <td>{admin.surname}</td>                                 
                                    <td>{admin.email}</td>  
                                    <td>{admin.empnumber}</td>
                                    <td>{admin.companynumber}</td>
                                    <td>{admin.companyInfo.title}</td>
                                    <td>{
                                      admin.companyInfo.approve ? 
                                      <div className="alert alert-success status-pt">On</div> : 
                                      <div className="alert alert-warning status-pt">Off</div>}
                                    </td>
                                    <td>
                                      <button className="btn" onClick={() => setCurrentUserCompany(admin)}>View</button>
                                    </td>
                                  </tr>
                        })
                      }
                    </tbody>
                  </table>
                )
              }
            </div>
          </>
          :
          <div className="user-company">
            <div className="flexme space-bet">
              <h4>Destails</h4>
              <button className="btn btn-close" onClick={() => setCurrentUserCompany(null)}></button>
            </div>
            <div className="content-body">
              <div className="section-part">
                {
                  currentUserCompany.approve ? 
                    <div className="show-alert-success float-right">Status Visible</div> 
                    : 
                    <div className="show-alert-danger float-right">Status Invisible</div>
                }
                <p>Name: {currentUserCompany.name}</p>
                <p>Surname: {currentUserCompany.surname}</p>
                <p>Email Address: {currentUserCompany.email}</p>
                <p>Phone Number: {currentUserCompany.phone}</p>
                <p>Employee Number: <strong>{currentUserCompany.empnumber}</strong></p>
                <p>Company Number: {currentUserCompany.companynumber}</p>
                <p>Role: <strong>{currentUserCompany.role[0]}</strong></p>
              </div>
              <div className="section-part">
                {
                  currentUserCompany.companyInfo.approve ? 
                  <div className="show-alert-success float-right">Status Visible</div> 
                  : 
                  <div className="show-alert-danger float-right">Status Invisible</div>
                }
                <h6> {currentUserCompany.companyInfo.title}</h6>
                <p>{currentUserCompany.companyInfo.adddress}</p>
                <p>Company Number: {currentUserCompany.companyInfo.companynumber}</p>
              </div>
            </div>
           </div>
       }
       
       
     </div>
   )
 }
 

export default CompanySettings