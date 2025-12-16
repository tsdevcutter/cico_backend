import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function EmployeeDetails() {

  const {user}                                                        = useSelector((state) => state.auth);

  const params                                                        = useParams();
  
  const [currentUser, setCurrentUser]                                 = useState(null);
  const [processing, setProcessing]                                   = useState(false);

  const [recordList, setRecordList]                                   = useState([]);
 
  const [files, setFiles]                                             = useState([]);
  const [uploadCount, setUploadSCount]                                = useState(0);

  const [listQualification, setListQualification]                     = useState([]);
  const [listLoad, setListLoad]                                       = useState(false);
  const [isOpenCriteria, setIsOpenCriteria]                           = useState(false);

  const fileInputRef                                                  = useRef(null);

  useEffect(() => {
    collectCurrentUser();
    collectListOfQualifications();
  },[])

  useEffect(() => {
    if(currentUser){
      collectListOfDocuments();
    }    
  },[uploadCount, currentUser])

  const collectCurrentUser = async () => {
    try{
       const res = await axios.get(CONSTANTS.API_URL +"users/current/index/" + params.id, {
         headers: {
              token: 'Bearer ' + user.accessToken,
            },
        });
      
       setCurrentUser(res.data);
    }catch(err){
      console.log(err);
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
      
    }catch(err){
      console.log(err);
      setListLoad(false);
    }
  }

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
      try {
        
        const formData = new FormData();

        if(files.length !== 0){
          setProcessing(true);
          formData.append('currentUserId', currentUser._id);
          for (let i = 0; i < files.length; i++) {
            formData.append("documentRecords", files[i]); 
          }
          
          const result = await axios.post(`${CONSTANTS.API_URL}records/upload-record/v1/files`, formData, {
              headers: { 
                "Content-Type": "multipart/form-data" ,
                token: 'Bearer ' + user.accessToken,
              }
            });

          setUploadSCount(prev => prev + 1);
          setProcessing(false);
          if (fileInputRef.current) {
              fileInputRef.current.value = null; 
          }

        }else {
          toast.warning("Please select files");
        } 
      }catch(err){
        console.log(err);
        setProcessing(false);
      }
  }

  const handleFileChange = (e) => {
    setFiles(e.target.files); // FileList object
  };

  const collectListOfDocuments = async () => {
    try{

      const result = await axios.get(CONSTANTS.API_URL + "records/listing/v1/" + currentUser._id, {
            headers: {
              token: 'Bearer ' + user.accessToken,
            }
          });
        
      setRecordList(result.data);
      setFiles([]);
    }catch(err){
      console.log(err);
    }
  }

  const handleToggleCriteria = () => {
    setIsOpenCriteria(!isOpenCriteria);
  };

  const handleAddingCriteria = async (criteria) => {
    try{

      const addCriteria = {
        "qualificationId" : criteria._id,
         "userId" : currentUser._id
      }

      const result = await axios.put(CONSTANTS.API_URL + "users/qualification/update/v1/", addCriteria,  {
            headers: {
              token: 'Bearer ' + user.accessToken,
            }
          });

        toast.success(result.data.message);

    }catch(err){
      console.log(err);
      toast.error("Something went wrong, please try again later.")
    }
  }

  return (
    <div className="card-container">
      <div className="card">
         <h2 className="text-xl font-bold mb-4">Employee Details</h2>
         <div className="barrier-content">
            {
              currentUser !== null && (
                <div className="content-user pd10">
                  <div className="summary-details">
                      <table className="table">
                      <tbody>
                        <tr>
                          <td>Employee Number:</td>
                          <td>{currentUser.empnumber}</td>
                        </tr>
                        <tr>
                          <td>Name:</td>
                          <td>{currentUser.name}</td>
                        </tr>
                        <tr>
                          <td>Surname:</td>
                          <td>{currentUser.surname}</td>
                        </tr>
                        <tr>
                          <td>Phone:</td>
                          <td>{currentUser.phone}</td>
                        </tr>
                        <tr>
                          <td>Email:</td>
                          <td>{currentUser.email}</td>
                        </tr>
                        <tr>
                          <td>Gender:</td>
                          <td>{currentUser.gender}</td>
                        </tr>
                        <tr>
                            <td>Company Number:</td>
                            <td>{user.companynumber}</td>
                        </tr>
                        <tr>
                            <td>Gender:</td>
                            <td>{user.gender}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="documentation">
                    <div className="row docu-records">
                      <div className="col-md-7">
                        <div className="card">
                          <div className="record-list">
                            <h6>Qualification Documents</h6>
                            {
                              recordList.length > 0 && (
                                <table className="table table-striped">
                                  <tbody>
                                    {
                                      recordList.map((rec, index) => {
                                        return <tr key={index}>
                                                  <td>
                                                      {index + 1}
                                                  </td>
                                                  <td>:</td>
                                                  <td>
                                                    <a 
                                                        href={rec.fileUrl} 
                                                        rel="noopener noreferrer"
                                                        className="link-download"
                                                        target="_blank"
                                                      >
                                                        Download {rec.title}                                                      
                                                    </a>
                                                  </td>   
                                                  <td>
                                                    {
                                                        currentUser.assignedQualification.some
                                                        (
                                                          qualification => 
                                                          {
                                                            return qualification.recordId === rec._id
                                                          }
                                                        ) && <strong>Assigned</strong>
                                                      }
                                                  </td>  
                                              </tr>
                                      })
                                    }
                                  </tbody>
                                </table>
                              )
                            }
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="record-upload">
                           <form onSubmit={handleSubmitDocument}>
                             <div className="form-group">
                                <p>Select user records</p>
                              <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="application/pdf" 
                                ref={fileInputRef}
                                multiple 
                                required/>
                             </div>
                             <div className="form-group mt-3">
                              <button className="btn btn-warning" disabled={processing}>
                                {processing ? 'loading...' : 'Submit'}
                              </button>
                             </div>
                           </form>                                            
                        </div>
                        <div className="summary-details mt-5">
                          <h6>Add criteria to user.</h6>
                           {
                              listQualification.length > 0 && (
                                <table className="table table-striped">
                                  <tbody>
                                    {
                                      listQualification.map((criteria, index) => {
                                        return <tr key={index}>
                                                  <td><h5>{criteria.title}</h5></td>
                                                  <td>
                                                      <button
                                                        className="btn btn-main accord-box" 
                                                        onClick={handleToggleCriteria}>
                                                          {criteria.statements.length} Total Documents
                                                        </button>
                                                        {
                                                          isOpenCriteria && (
                                                            <div className="conten-criteria">
                                                                {
                                                                  criteria.statements.map((stat, index) => {
                                                                    return <div className="matter-stat" key={index}>
                                                                              {stat}
                                                                            </div>
                                                                  }) 
                                                                }
                                                            </div>
                                                          )
                                                        }
                                                  </td>
                                                  <td>
                                                    <button 
                                                      className="btn btn-warning" 
                                                      onClick={() => handleAddingCriteria(criteria)}
                                                      disabled={processing}>
                                                      +
                                                    </button>
                                                  </td>
                                              </tr>
                                            })
                                    }
                                  </tbody>
                                </table>
                              )
                            }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
         </div>
      </div>
    </div>
  )
}

export default EmployeeDetails