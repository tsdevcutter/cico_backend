import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import { toast } from 'react-toastify';

function ProjectDetails() {
    
  const {user}                                                                    = useSelector((state) => state.auth);

  const params                                                                    = useParams();
  
  const [currentProject, setCurrentProject]                                       = useState(null);
  const [userEmployeeNumbers, setUserEmployeeNumbers]                             = useState([]);

  const [companyUsers, setCompanyUsers]                                           = useState([]);
  const [cULoading, setCULoading]                                                 = useState(false);

  const [processing, setProcessing]                                               = useState(false);
  
  useEffect(() => {
    collectCurrentProjectDetails();
  },[])

  useEffect(() => {
      if(userEmployeeNumbers.length > 0){
        collectCompanyUserList();
      }
  },[userEmployeeNumbers])

  const collectCurrentProjectDetails = async () => {
    try{
        
       const res = await axios.get(CONSTANTS.API_URL +"projects/single/v1/details/" + params.id, {
         headers: {
              token: 'Bearer ' + user.accessToken,
            },
        });
        
        console.log(res.data);
       setCurrentProject(res.data);
       if(res.data.users.length > 0){
        setUserEmployeeNumbers(res.data.users);
       }
    }catch(err){
      console.log(err);
    }
  }

  const collectCompanyUserList = async () => {
      try{
            setCULoading(true);
          const results = await axios.get(CONSTANTS.API_URL +"users/company/short-list/" + user.companynumber, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
            console.log("____________");
            console.log(results.data);
            console.log("____________");
            setCULoading(false);
            setCompanyUsers(results.data);
      }catch(err){
        console.log(err);
        setCULoading(false);
      }
    }

    function formatDateToDDMMYYYY(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
    
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Get the abbreviated month name using the month index (0-11)
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    }
    const handleTogglePersonProject = async (empNumber) => {
    
    const newObject = {
        "projectId"   : currentProject._id,
        "empnumber" : empNumber
      }

      try{
        
        setProcessing(true);
        const results = await axios.put(CONSTANTS.API_URL +"settings/toggle/v1/project-users", newObject, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

        toast.success(results.data.message);
        setCurrentProject(results.data.newProject)
        setProcessing(false);

      }catch(err){
        console.log(err);
      }
  }

  return (
     <div className="card-container">
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            
          
                {
                    currentProject && (
                          <div className="barrier-content">
                            <h4>{currentProject.title}</h4>
                                <div className="section-part">
                                    <h5>General</h5>
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="details-spot">
                                                <div className="desc-area">
                                                    {currentProject.description}
                                                </div>
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>Date to Begin:</td>
                                                            <td>{formatDateToDDMMYYYY(currentProject.startDate)}</td>   
                                                        </tr>
                                                        <tr>
                                                            <td>Date to End:</td>
                                                            <td>{formatDateToDDMMYYYY(currentProject.endDate)}</td>   
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="details-spot"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-part">
                                    <h5>Users</h5>
                                    <div className="row">
                                        <div className="col-md-8">
                                          <div className="user-modal-list">
                                            {cULoading && 'loading...'}
                                            {
                                                companyUsers.length > 0 && (
                                                <div className="scroll-list">
                                                    {
                                                    companyUsers.map((person, index) => {
                                                        const isIncluded = currentProject.users?.includes(person.empnumber);
                                                        return <div className="item-person" key={index}>
                                                                    <button 
                                                                    className={`btn btn-project-standard ${isIncluded ? "btn-included" : ""}`}
                                                                    onClick={() => handleTogglePersonProject(person.empnumber)}>
                                                                    <strong>{person.empnumber}</strong>  
                                                                    <div className="person-info">
                                                                        <span>{person.name}</span>
                                                                        <span>{person.surname}</span>
                                                                    </div>
                                                                    </button>
                                                                </div>
                                                        })
                                                    }
                                                </div>
                                                )
                                            }
                                        </div>
                                        </div>
                                        <div className="col-md-4">
                                           <div className="user-check">
                                              <h4>Search</h4>
                                              <p>Search for the user you want to add</p>
                                              <div className="search-box">
                                                <input type="text" className="form-control" placeholder="Search by EmpNo, Name" />
                                                <button className="btn btn-main mt-3">Search</button>
                                              </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                          </div>
                    )
                }
        </div>
    </div>    
  )
}

export default ProjectDetails