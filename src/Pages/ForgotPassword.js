import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../assets/mainlogo.png";
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";

function ForgotPassword() {
  const [isLoading, setIsLoading]                           = useState(false);
  const [formData, setFormData]                             = useState({
              empnumber: "",
              password: "",
    });
       
  const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };
  
    const onSubmit = async (e) => {
        e.preventDefault();
       try{

          const result = await axios.put(CONSTANTS.API_URL + "auth/pasword/reset/email/v3/simple", formData);
   
          toast.success(result.data.message);
       }catch(err){        
        if(err.response.status === 404){
           toast.error(err.response.data.message);
        }else {
          toast.error("Something went wrong, please try again later.");
        }
        
       }
    };
  return (
    <div
          className="log-body">        
            <div className="log-area">
                  <div className="row">
                    <div className="col-md-7">
                        <div className="form-item">
                          <form onSubmit={onSubmit}>
                              <div className="mb-4">
                                  <input
                                      type="text"
                                      placeholder="Enter Employee Number"
                                      className="form-control"
                                      name="empnumber"
                                      value={formData.empnumber}
                                      onChange={onChange}
                                      required
                                  />
                              </div>
    
                              <div className="mb-4">
                                  <input
                                      placeholder="Enter New Password"
                                      type="password"
                                      className="form-control"
                                      name="password"
                                      value={formData.password}
                                      onChange={onChange}
                                      required
                                  />
                              </div>
    
                                <div className="flexme">
                                  <div className="fg-content mt-3">
                                    <Link to={"/login"}>
                                    Want to login?
                                    </Link>
                                  </div>
                                  <div className="login-btn pd10">
                                    <button type="submit" className="btn btn-main btn-full mb-4" disabled={isLoading}>
                                        {isLoading ? "Processing..." : "Reset Password"}
                                    </button>
                                  </div>
                                </div>    
                              </form>
                        </div>
                    </div>
                    <div className="col-md-5">
                      <img src={logo} className="login-logo" />
                    </div>
                  </div>
            </div>
        </div>
  )
}

export default ForgotPassword