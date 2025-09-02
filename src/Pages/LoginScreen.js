import React, { useEffect, useState } from 'react'
import logo from '../assets/mainlogo.png';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../reduxAuth/authSlice';

function LoginScreen() {
  
    const dispatch                                              = useDispatch();
    const { isLoading, isError, isSuccess, user, message}     = useSelector((state) => state.auth);

    const navigate                                            = useNavigate();
    
    const [formData, setFormData]                             = useState({
            empnumber: "",
            password: "",
     });
  
    useEffect(() => {
        if (isError) {
            toast.error(message || "Login failed");
        }

        if (isSuccess && user) {
            toast.success("Login successful");
            navigate('/dashboard'); 
        }

        return () => dispatch(reset());
    }, [isError, isSuccess, user, message, dispatch]);


    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
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
                                  placeholder="Employee Number"
                                  className="form-control"
                                  name="empnumber"
                                  value={formData.empnumber}
                                  onChange={onChange}
                                  required
                              />
                          </div>

                          <div className="mb-4">
                              <input
                                  placeholder="Password"
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
                                 <Link to={"/forgot-password"}>
                                    Forgot your password?
                                  </Link>
                                   
                              </div>
                              <div className="login-btn pd10">
                                <button type="submit" className="btn btn-main btn-full mb-4" disabled={isLoading}>
                                    {isLoading ? "Signing in..." : "Sign in"}
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

export default LoginScreen