import axios from 'axios';
import React, { useEffect, useState } from 'react'
import * as CONSTANTS from "../CONSTANTS";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ModalPopUp from '../Components/modals/ModalPopUp';
import { toast } from 'react-toastify';
import { logout } from '../reduxAuth/authSlice';

function Employees() {

  const {user}                                                              = useSelector((state) => state.auth);

  const [formData, setFormData]                                             = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        email: '',
        dateOfBirth: '',
        jobTitle: '',
        phone: '',
        gender: 'Male',
        role: 'business'
  });

  const [titleQualification, setTitleQualification]                         = useState("");
  const [statements, setStatements]                                         = useState([]);
  const [statementText, setStatementText]                                   = useState();

  const [usersUpdate, setUsersUpdate]                                       = useState(0);
  const [processing, setProcessing]                                         = useState(false);

  const [showModalAdd, setShowModalAdd]                                           = useState(false);
  const [showModalQualificationFrame, setShowModalQualificationFrame]             = useState(false);
  const [showModalQualificationView, setShowModalQualificationView ]              = useState(false);

  const [employeeList, setEmployeeList]                                      = useState([]);
  const [listQualification, setListQualification]                            = useState([]);
  const [listLoad, setListLoad]                                              = useState(false);

  const [page, setPage]                                               = useState(0);
  const [limit, setLimit]                                             = useState(30);
  const [maximumDate, setMaximumDate]                                 = useState();

  const dispatch                                                      = useDispatch();

  useEffect(() => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const year = maxDate.getFullYear();
    const month = String(maxDate.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() is 0-indexed
    const day = String(maxDate.getDate()).padStart(2, '0');

    const formattedMaxDate = `${year}-${month}-${day}`;
    setMaximumDate(formattedMaxDate);
  },[])

  useEffect(() => {
      collectListOfUsers();
  }, [page, limit, usersUpdate])
  
  useEffect(() => {
    if(showModalQualificationView) {
      collectListOfQualifications()
    }
  }, [showModalQualificationView])

  const collectListOfUsers = async () => {
    try
      {
      
        const results = await axios.get(CONSTANTS.API_URL +"users/employee-list?page=" + page + "&limit=" + limit + "&comp=" + user.companynumber, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        
       setEmployeeList(results.data.users);

    }catch(err){
      console.log(err);

      if(err.status === 403 && err.response.data === "Token is not valid!"){
          console.log("log user out");
           dispatch(logout());
        }
    }
  }

  const collectListOfQualifications = async () => {
      try
      {
      
        setListLoad(true);
        const results = await axios.get(CONSTANTS.API_URL +"users/qualification/criteria/v1/list/" + user.companynumber , {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        
       setListQualification(results.data);
       setListLoad(false);
    }catch(err){
      console.log(err);
      setListLoad(false);
    }
  }
  
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      const postData = {
        ...formData,
        isAdmin: false,
       companynumber: user.companynumber
    }; 

    try {
 
        setProcessing(true);
          const resData = await axios.post(CONSTANTS.API_URL + 'auth/register/v2', postData, {
                    headers: {
                      token: 'Bearer ' + user.accessToken,
                    },
                  }
                );      
       
        toast.success(resData.data.message);
        setProcessing(false);
        
        setFormData({
              firstName: '',
              lastName: '',
              idNumber: '',
              email: '',
              role: 'business',
              dateOfBirth: '',
              jobTitle: '',
              gender: 'Male',
              phone: '',
          })
       setUsersUpdate(prev => prev + 1);
        
    } catch (error) {
      toast.error("Failed to create Employee");
      setProcessing(false);
      console.error(error);
    }
  };

  const handleSubmitQualification = async (e) => {
    e.preventDefault();

    try{
        const qualifyCriteria = {
          companynumber: user.companynumber,
          title: titleQualification,
          statements: statements
        }
        setProcessing(true);

        if(statements.length > 0 && titleQualification.length > 0) {
            const results = await axios.post(CONSTANTS.API_URL +"users/qualificaton/criteria/v1/creation", qualifyCriteria, {
                  headers: {
                    token: 'Bearer ' + user.accessToken,
                  },
                });
            
              setProcessing(false);
              toast.success(results.message.data);
              setTitleQualification("");
              setStatements([]);
          }else {
            toast.warning("Please add statements and title");
          }
            
    }catch(err){
      console.log(err);
      toast.error("Something went wrong, please try again later.");
      setProcessing(false);
    }
  }

  const addStatement = () => {
    setStatements([...statements, statementText]);
    setStatementText("");
  };

  const removeStatement = (index) => {
    const updatedStatements = statements.filter((_, i) => i !== index);
    setStatements(updatedStatements);
  };

  return (
    <div className="card-container">
      <div className="card">
          <div className="content-row">
            <button className="btn btn-main mg-r-3" onClick={() => setShowModalAdd(true)}>
              Add Employee
            </button>

            <button className="btn btn-main mg-r-3" onClick={() => setShowModalQualificationFrame(true)}>
              Add Qualification Framework
            </button>

            <button className="btn btn-main mg-r-3" onClick={() => setShowModalQualificationView(true)}>
              View Qualifications
            </button>

          </div>

          <ModalPopUp
              show={showModalAdd}
              handleClose={() => setShowModalAdd(false)}
              title="Add Employee"
            >
              <div className="body-modal-area">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <input 
                                type="text" 
                                className="form-control" 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                placeholder="Enter First Name"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handleChange} 
                                placeholder="Enter Last Name"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <input 
                                type="text" 
                                className="form-control" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Enter Email Address"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="Enter Phone Number"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <input 
                                type="text" 
                                className="form-control" 
                                name="jobTitle" 
                                value={formData.jobTitle} 
                                onChange={handleChange} 
                                placeholder="Enter Job Title"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="idNumber" 
                                value={formData.idNumber} 
                                onChange={handleChange} 
                                placeholder="Enter Id Number"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">                    
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
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <input 
                                type="date" 
                                className="form-control" 
                                name="dateOfBirth" 
                                value={formData.dateOfBirth} 
                                onChange={handleChange} 
                                max={maximumDate}
                                placeholder="Enter Date of birth"
                                required
                              />
                        </div>    
                      </div>
                    </div>
                    <div className="form-group ">
                      <button className="btn btn-main" disabled={processing}>
                        Submit
                      </button>
                    </div>                    
                  </form>
              </div>
          </ModalPopUp>
          
          <ModalPopUp
              show={showModalQualificationFrame}
              handleClose={() => setShowModalQualificationFrame(false)}
              title="Add Employee"
            >
              <div className="body-modal-area">
                  <form onSubmit={handleSubmitQualification}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <div className="label-small">Title</div>
                          <input 
                                type="text" 
                                className="form-control"  
                                onChange={(e) => setTitleQualification(e.target.value)} 
                                placeholder="Enter Title"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                            <div className="label-small">Statement List</div>
                            <div className="d-flex">
                            
                               <input
                                      type="text"
                                      className="form-control me-2"
                                      placeholder="Required statement"
                                      value={statementText}
                                      onChange={(e) => setStatementText(e.target.value)}
                                    />
                               <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm mt-2"
                                  onClick={addStatement}
                                >
                                  + Add
                                </button>
                            </div>
                            <div className="statement-listing-options">
                            {
                                statements.map((statement, index) => (
                                  <div key={index} className="state-box d-flex mb-2">
                                      <div className="state">
                                          {statement}
                                      </div>                                    
                                      <button
                                        type="button"
                                        className="btn btn-cl-1"
                                        onClick={() => removeStatement(index)}
                                      >
                                        ×
                                      </button>
                                    
                                  </div>
                                ))
                              }
                                </div>                      
                        </div>    
                      </div>

                    </div>
                    <div className="form-group ">
                      <button className="btn btn-main" disabled={processing}>
                        Submit
                      </button>
                    </div>                    
                  </form>
              </div>
          </ModalPopUp>

          <ModalPopUp
              show={showModalQualificationView}
              handleClose={() => setShowModalQualificationView(false)}
              title="View Qualification"
            >
              <div className="body-modal-area">
                 {
                  listLoad && <div className="">
                    Loading...
                  </div>
                 }
                 {
                   listQualification.length > 0 && (
                    <table className="table table-striped">
                      <tbody>
                        {
                          listQualification.map((criteria, index) => {
                            return <tr key={index}>
                                      <td>{criteria.title}</td>
                                      <td>{criteria.statements.length}</td>
                                  </tr>
                                })
                        }
                      </tbody>
                    </table>
                   )
                 }
              </div>
          </ModalPopUp>

          <h2 className="text-xl font-bold mb-4">Employees</h2>
          {
            employeeList.length > 0 && (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                      <th>NO</th>
                      <th>Employee No</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {
                   employeeList.map((emp, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{emp.empnumber}</td>
                        <td>{emp.name}</td>
                        <td>{emp.surname}</td>
                        <td>{emp.phone}</td>
                        <td>{emp.email}</td>
                        <td><Link to={`/employee/${emp._id}`}>View</Link></td>
                      </tr>
                    ))
                    }
                </tbody>
              </table>
            )
          }
           {/* Employee List */}   
          {
            employeeList.length > 30 && (
               <div className="foot-pagination flexme space-apart mt-4">
                  <div className="flex items-center justify-between mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        disabled={page === 0}
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                      >
                      Previous
                    </button>

                    <span>Page {page + 1}</span>

                    <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => setPage(prev => prev + 1)}
                      >
                        Next
                    </button>
                  </div>        
                  <div className="mt-3">
                    <label htmlFor="limit" className="mr-2">Items per page:</label>
                    <select
                      id="limit"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="border px-2 py-1 rounded"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
              </div>
            )
          }
             
         
        
      </div>
    </div>
  )
}

export default Employees