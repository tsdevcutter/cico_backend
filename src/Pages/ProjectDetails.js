import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";

function ProjectDetails() {
    
  const {user}                                                                    = useSelector((state) => state.auth);

  const params                                                                    = useParams();
  
  const [totalSearchable, setTotalSearchable]                                     = useState(0);
  const [currentProject, setCurrentProject]                                       = useState(null);
  const [userEmployeeNumbers, setUserEmployeeNumbers]                             = useState([]);

  const [companyUsers, setCompanyUsers]                                           = useState([]);
  const [cULoading, setCULoading]                                                 = useState(false);

  const [searchUserList, setSearchUserList]                                       = useState([]);
  const [searchUser, setSearchUser]                                               = useState("");
  const [searchProcess, setSearchProcess]                                         = useState(false);

  const [processing, setProcessing]                                               = useState(false);
  
  const [clockMeta, setClockMeta]                                                 = useState([]);

  useEffect(() => {
    collectCurrentProjectDetails();
    getTotalUsersCount();
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

  const getTotalUsersCount = async () => {
    try{
       const results = await axios.get(CONSTANTS.API_URL +"users/employees/options/" + user.companynumber, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
            
            if(results.data.total > 0){
              setTotalSearchable(results.data.total);
            }
            
    }catch(err) {
      console.log(err)
    }
  }

  const collectCompanyUserList = async () => {
      try{
            setCULoading(true);
          const results = await axios.get(CONSTANTS.API_URL +"users/company/short-list/v2/project/" + currentProject._id, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

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

        setSearchUserList([]);
        setSearchUser("");
      }catch(err){
        console.log(err);
         setProcessing(false);
      }
  }

  const handleSearchFromInput = async () => {
    try{

        if(searchUser.length > 2){
          setSearchProcess(true);

          const newObject = {
            "search"  : searchUser,
            "companynumber" : user.companynumber
          }
          //console.log(newObject);

          const results = await axios.put(CONSTANTS.API_URL +"users/short-list/v1/assigners", newObject, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

            setSearchUserList(results.data);
          setSearchProcess(false);
        }else {
          toast.warning("More than two characters are required for search.")
        }
    }catch(err){
      console.log(err);
      setSearchProcess(false);
    }
  }

  const handleViewSummary = async (selectedDate, personEmpNo) => {
    try{
           const data = {
            personId: personEmpNo,
            date: selectedDate,
            projectId: currentProject._id
          };
        
          console.log(data);
          console.log("Up is the post object");
        const results = await axios.put(CONSTANTS.API_URL +"users/clocking-details/v1/summary/tracking", data, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

            console.log("))))  (((((");
            console.log(results);
            setClockMeta(prevClockMeta => [...prevClockMeta, results.data]);
    }catch(err){
      console.log(err);
    }
  }

  const formatTime = (timeString) => {
      if (!timeString) {
        return null; // Return null if the string is empty or falsy
      }

      // Use a dummy date to parse the time string reliably.
      // We prepend a standard date ("2000-01-01") to the time string.
      const dateWithTime = new Date(`2000-01-01T${timeString}`);
      
      // Check if the resulting date is valid
      if (isNaN(dateWithTime)) {
        return timeString; // Return original string if parsing failed
      }

      // Determine the format based on whether seconds are present in the original string
      const hasSeconds = timeString.split(':').length === 3;
      
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', // Force 24-hour format
      };

      if (hasSeconds) {
        options.second = '2-digit';
      }

      // Format the time
      return new Intl.DateTimeFormat('en-GB', options).format(dateWithTime);
    };
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
                                          <div className="user-modal-list full-campus">
                                            {cULoading && 'loading...'}
                                            {
                                                companyUsers.length > 0 && (
                                                  <div className="scroll-list">
                                                      {
                                                        companyUsers.map((person, index) => {
                                                          const isIncluded = currentProject.users?.includes(person.empnumber);
                                                          // Get today's date in YYYY-MM-DD format
                                                          const today = new Date().toISOString().split("T")[0];
                                                          const matchingEntry = clockMeta.find(entry => entry.empnumber === person.empnumber);

                                                          return <div className="item-person" key={index}>
                                                                      <div  
                                                                      className={`card-part btn-project-standard ${isIncluded ? "btn-included" : ""}`}
                                                                      >
                                                                        <strong>{person.empnumber}</strong>  
                                                                        <div className="person-info">
                                                                            <span>{person.name}</span>
                                                                            <span>{person.surname}</span>
                                                                        </div>
                                                                        <div className="secondary-info-summary pd5">
                                                                           <div className="lane-summary flexme">
                                                                             <input 
                                                                                type="date" 
                                                                                className="form-control"
                                                                                defaultValue={today} 
                                                                              />
                                                                              <button 
                                                                                  className="btn btn-main" 
                                                                                  onClick={() => handleViewSummary(today, person.empnumber)}                                                                             
                                                                                >
                                                                                  View
                                                                              </button>
                                                                              <div className="clock-view-short">
                                                                                  {
                                                                                    matchingEntry && (
                                                                                      <div className="rule-view">
                                                                                        <div className="rl-message">
                                                                                          {matchingEntry.message} 
                                                                                        </div>
                                                                                        <div className="rl-in">
                                                                                          {formatTime(matchingEntry.clockin)} 
                                                                                        </div>
                                                                                        <div className="rl-out">
                                                                                          {formatTime(matchingEntry.clockout)} 
                                                                                        </div>
                                                                                      </div>
                                                                                    )
                                                                                  }
                                                                              </div>
                                                                           </div>
                                                                        </div>
                                                                      </div>
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
                                              <p>Search from up to {totalSearchable} user to add to this project</p>
                                              <div className="search-box">
                                                
                                                  <div className="src-flex">
                                                    <input type="text" 
                                                      className="form-control srch-size1" 
                                                      placeholder="Search by EmpNo, Name"
                                                      onChange={(e) => setSearchUser(e.target.value)} 
                                                      value={searchUser}
                                                      />
                                                      <button className="btn btn-main mt-3"
                                                        onClick={handleSearchFromInput}
                                                      >
                                                      <FaSearch />
                                                    </button>
                                                  </div>
                                                  {
                                                    searchUserList.length > 0 &&(
                                                      <div className="auto-comps-block">
                                                        {
                                                          searchUserList.map((search, index) => {
                                                            return <div className="person-item" key={index}
                                                                    onClick={() => handleTogglePersonProject(search.empnumber)}>
                                                                      <span>{search.empnumber}</span>
                                                                      <span>{search.name}</span>
                                                                      <span>{search.surname}</span>
                                                                    </div>
                                                          })
                                                        }
                                                      </div>
                                                    )
                                                  }
                                                

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