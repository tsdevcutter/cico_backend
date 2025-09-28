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

  useEffect(() => {
    collectCurrentUser();
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
                        <div className="record-list">
                          {
                            recordList.length > 0 && (
                              <table className="table table-striped">
                                <tbody>
                                  {
                                    recordList.map((rec, index) => {
                                      return <tr key={index}>
                                                <td>
                                                  <a 
                                                    href={rec.fileUrl} 
                                                    rel="noopener noreferrer"
                                                    className="link-download"
                                                    target="_blank"
                                                  >
                                                    {index + 1} - Download {rec.title}
                                                  </a>
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
                      <div className="col-md-5">
                        <div className="record-upload">
                           <form onSubmit={handleSubmitDocument}>
                             <div className="form-group">
                                <p>Select user records</p>
                              <input type="file" onChange={handleFileChange} accept="application/pdf" multiple required/>
                             </div>
                             <div className="form-group mt-3">
                              <button className="btn btn-warning" disabled={processing}>
                                {processing ? 'loading...' : 'Submit'}
                              </button>
                             </div>
                           </form>                                            
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