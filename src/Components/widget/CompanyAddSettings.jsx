import axios from 'axios';
import React, { useState } from 'react'
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';

function CompanyAddSettings({user}) {
    const [isLoading, setIsLoading]                                  = useState(false);
  
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
    </div>
  )
}

export default CompanyAddSettings