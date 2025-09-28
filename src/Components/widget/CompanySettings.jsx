import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';

function CompanySettings({user}) {
  
   const [addUser, setAddUser]                                      = useState(false);
   const [isLoading, setIsLoading]                                  = useState(false);
 
   const [userAdmins, setUserAdmins]                                = useState([]);
   const [currentUserCompany, setCurrentUserCompany]                = useState(null);

   const [formAdmin, setFormAdmin]                   = useState({
         firstName: "",
         secondName: "",
         email: "",
         phone: "",
         jobTitle: "",
         idNumber: "",
         dateOfBirth: "",
         gender: "Male",
         password: "password123",
         role: "business",
         title: "",
         companyPhone: "",
         address: "",
         description: "",
   }); 
 
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
 
   const handleChange = (e) => {
     const { name, value, type, checked } = e.target;
     setFormAdmin((prev) => ({
       ...prev,
       [name]: type === "checkbox" ? checked : value,
     }));
   };
 
   const handleAddingAdmin = async (e) => {
     e.preventDefault();
 
     try{
       setIsLoading(true);
       
       const results = await axios.post(CONSTANTS.API_URL +"auth/register/v1", formAdmin);
             
       setIsLoading(false);
       if(results.status === 200){
         toast.success("User created");
         setFormAdmin({
               name: "",
               surname: "",
               email: "",
               phone: "",
               jobTitle: "",
               idNumber: "",
               dateOfBirth: "",
               gender: "Male",
               password: "password123",
               title: "",
              companyPhone: "",
              address: "",
              description: "",
           });
       }
 
     }catch(err){
       console.log(err);
       setIsLoading(false);
     }
   }
 
   return (
     <div className="widget-admin">
       <div className="row-blow">
         <button
           onClick={() => setAddUser(!addUser)}
           className={'btn btn-stripe-active' + addUser}>
             {
               addUser ? 'View Companies' : 'Add Company'
             }
         </button>
       </div>
       {
          currentUserCompany === null ?
          <>
            {
          addUser ? 
            <div className="card-block">
              <h4>Add Company</h4>
              <form onSubmit={handleAddingAdmin}>
                  <div className="row">
                      <div className="col-md-6">
                          <div className="form-group">
                            <div className="label">Name*:</div>
                            <input
                                type="text"
                                name="firstName"
                                value={formAdmin.firstName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter Name"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                          <div className="form-group mt-2">
                            <div className="label">Surname*:</div>
                            <input
                                type="text"
                                name="secondName"
                                value={formAdmin.secondName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter Surname"
                                required
                              />
                          </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                        <div className="label">Email*:</div>
                        <input
                            type="text"
                            name="email"
                            value={formAdmin.email}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter Email"
                            required
                          />
                      </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                          <div className="label">Phone:</div>
                          <input
                              type="text"
                              name="phone"
                              value={formAdmin.phone}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter Phone"
                            />
                        </div>       
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                            <div className="label">Job Title:</div>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formAdmin.jobTitle}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter Job Title"
                              />
                          </div>            
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                          <div className="label">ID Number*:</div>
                          <input
                              type="text"
                              name="idNumber"
                              value={formAdmin.idNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter id Number"
                              required
                            />
                        </div>       
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                          <div className="label">Date of birth*:</div>
                          <input
                              type="date"
                              name="dateOfBirth"
                              value={formAdmin.dateOfBirth}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter date Of Birth"
                              required
                            />
                        </div>       
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                          <div className="label">Gender:</div>
                          <select 
                                className="form-control"
                                name="gender" 
                                onChange={handleChange} 
                                defaultValue={"Male"}>
                              <option value={"Male"}>Male</option>
                              <option value={"Female"}>Female</option>
                           </select>
                        </div>
                      </div>
                      <div className="col-md-6"></div>
                      <div className="col-md-6">
                        <div className="form-group mt-2">
                          <div className="label">Company Title*:</div>
                          <input
                              type="text"
                              name="title"
                              value={formAdmin.title}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter company title"
                              required
                            />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group mt-2">
                          <div className="label">Company Telephone*:</div>
                          <input
                              type="phone"
                              name="companyPhone"
                              value={formAdmin.companyPhone}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter company phone"
                              required
                            />
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="form-group mt-2">
                          <div className="label">Company Address*:</div>
                          <input
                              type="text"
                              name="address"
                              value={formAdmin.address}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter company address"
                              required
                            />
                        </div>
                      </div>
                  </div>            
                
                <div className="form-group mt-2">
                  <button className="btn btn-main" disabled={isLoading}>
                      {isLoading ? "..." : "Submit"}                
                  </button>
                </div>
              </form>
            </div>
            :
            <div className="card-block">
              <h4>Companies</h4>
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
          }
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