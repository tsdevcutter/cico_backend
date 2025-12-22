import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import { toast } from 'react-toastify';
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import ModalPopUp from '../Components/modals/ModalPopUp';


function ProjectDetails() {
    
  const {user}                                                                    = useSelector((state) => state.auth);

  const params                                                                    = useParams();
  
  const [totalSearchable, setTotalSearchable]                                     = useState(0);
  const [currentProject, setCurrentProject]                                       = useState(null);
  const [userEmployeeNumbers, setUserEmployeeNumbers]                             = useState([]);
  const [periodDays, setPeriodDay]                                                = useState([]);

  const [companyUsers, setCompanyUsers]                                           = useState([]);
  const [cULoading, setCULoading]                                                 = useState(false);

  const [searchUserList, setSearchUserList]                                       = useState([]);
  const [searchUser, setSearchUser]                                               = useState("");
  const [searchProcess, setSearchProcess]                                         = useState(false);

  const [processing, setProcessing]                                               = useState(false);
  
  const [clockMeta, setClockMeta]                                                 = useState([]);

  const [showModalUsers, setShowModalUsers]                                       = useState(false);
  const [currentUserShow, setCurrentUserShow]                                     = useState(null);
  const [projUserCount, setProjUserCount]                                         = useState(0);

  useEffect(() => {
    collectCurrentProjectDetails();
    getTotalUsersCount();
  },[])

  
  useEffect(() => {
      if(userEmployeeNumbers.length > 0){
        collectCompanyUserList();
      }
  },[userEmployeeNumbers])


  useEffect(() => {
    if(currentProject){
      collectCurrentProjectPeriodDays();
    }
    
  },[currentProject])

  const collectCurrentProjectDetails = async () => {
    try{
        
       const res = await axios.get(CONSTANTS.API_URL +"projects/single/v1/details/" + params.id, {
         headers: {
              token: 'Bearer ' + user.accessToken,
            },
        });
        
       setCurrentProject(res.data);
       if(res.data.users.length > 0){
        setUserEmployeeNumbers(res.data.users);
       }
    }catch(err){
      console.log(err);
    }
  }
    
  const collectCurrentProjectPeriodDays = async () => {
    try{  

       const res = await axios.get(CONSTANTS.API_URL +"projects/single/period/v2/details/" + currentProject.projectCode, {
         headers: {
              token: 'Bearer ' + user.accessToken,
            },
        });

       setPeriodDay(res.data);

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

  const handleTogglePersonProject = async (empNumber, option) => {
    
        const newObject = {
            "projectId"   : currentProject._id,
            "empnumber" : empNumber,
            "option": option
          }

      try{

        if(option === 1){
          const exists = userEmployeeNumbers.includes(empNumber);
  
           if(exists){
            toast.warning("User already exists");
            return;
           }
        }

        
        setProcessing(true);
        const results = await axios.put(CONSTANTS.API_URL +"settings/toggle/v2/project-users", newObject, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

        toast.success(results.data.message);
        setCurrentProject(results.data.updatedProject);

         setUserEmployeeNumbers(results.data.updatedProject.users);
        setProcessing(false);

        setSearchUserList([]);
        setSearchUser("");
        
      }catch(err){
        toast.error(err.response.data.message)
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
         
          const results = await axios.put(CONSTANTS.API_URL +"users/short-list/v1/assigners", newObject, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

            setSearchUserList(results.data);
            setSearchProcess(false);

            if(results.data.length === 0){
              toast.warning("User not found");
            }
        }else {
          toast.warning("More than two characters are required for search.")
        }
    }catch(err){
      console.log(err);
      setSearchProcess(false);
    }
  }

  const handleViewSummary = async (selectedDate, personEmpNo, person) => {
    try{
        //open a pop up modal
        //display all clock in data.
        setShowModalUsers(true);
        setCurrentUserShow(person);
        console.log(person);
        /****
           const data = {
            personId: personEmpNo,
            date: selectedDate,
            projectId: currentProject._id
          };
        
        const results = await axios.put(CONSTANTS.API_URL +"users/clocking-details/v1/summary/tracking", data, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

          setClockMeta(prevClockMeta => [...prevClockMeta, results.data]);
          */
    }catch(err){
      console.log(err);
    }
  }

  const handleClearSearch = () => {
    try{
    
        setSearchUser("");

        setSearchUserList([]);
        setSearchUser("");
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

  // Handle local edits
  const handleChangePeriod = (index, field, value) => {
    const updated = [...periodDays];
    updated[index][field] = value;
    setPeriodDay(updated);
  };

  // Example: Save changes for one record
  const handleSavePeriod = async (index) => {
    const updatedItem = periodDays[index];
    try {

        const response = await axios.put(CONSTANTS.API_URL + `projects/periods/v1/update/${updatedItem._id}`, updatedItem, {
            headers: { token: "Bearer " + user.accessToken },
          }
        );
      toast.success(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error updating period");
    }
  };

  return (
     <div className="card-container">
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
          
           <ModalPopUp
              show={showModalUsers}
              handleClose={() => setShowModalUsers(false)}
              title="User Information"
            >
              <div className="body-modal-area">
                 <div className="flexme">
                   <div className="info-user">
                     {
                      currentUserShow && (
                        <table className="table table-striped">
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>:</td>
                              <td>{currentUserShow.name}</td>
                            </tr>
                            <tr>
                              <td>Surname</td>
                              <td>:</td>
                              <td>{currentUserShow.surname}</td>
                            </tr>
                            <tr>
                              <td>Emp Number</td>
                              <td>:</td>
                              <td>{currentUserShow.empnumber}</td>
                            </tr>
                            <tr>
                              <td>Job Title</td>
                              <td>:</td>
                              <td>{currentUserShow.jobTitle}</td>
                            </tr>
                            <tr>
                              <td>ID Number</td>
                              <td>:</td>
                              <td>{currentUserShow.idNumber}</td>
                            </tr>
                            <tr>
                              <td>Gender</td>
                              <td>:</td>
                              <td>{currentUserShow.gender}</td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>:</td>
                              <td>{currentUserShow.email}</td>
                            </tr>
                            <tr>
                              <td>Phone</td>
                              <td>:</td>
                              <td>{currentUserShow.phone}</td>
                            </tr>
                            
                          </tbody>
                        </table>
                      )
                     }
                   </div>
                   <div className="inf-details p-3">
                  
                   </div>
                 </div>
              </div>
          </ModalPopUp>

                {
                    currentProject && (
                          <div className="barrier-content">
                            <h4>{currentProject.title}</h4>
                                <div className="section-part">
                                 
                                    <h6 className="coach">General</h6>
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
                                   
                                    <h6 className="coach">User</h6>
                                    <div className="row">
                                        <div className="col-md-8">
                                          <div className="user-modal-list full-campus">
                                            {cULoading && 'loading...'}
                                            {
                                                companyUsers.length > 0 && (
                                                  <div className="scroll-list">
                                                     <table className="table table-striped">
                                                        <tbody>
                                                          {
                                                        companyUsers.map((person, index) => {
                                                          const isIncluded = currentProject.users?.includes(person.empnumber);
                                                          // Get today's date in YYYY-MM-DD format
                                                          const today = new Date().toISOString().split("T")[0];
                                                          const matchingEntry = clockMeta.find(entry => entry.empnumber === person.empnumber);

                                                          return <tr className={`item-person btn-project-standard ${isIncluded ? "btn-included" : ""}`} key={index}>
                                                                     
                                                                        <td>
                                                                          <div className="alphabet-items">
                                                                            {person.name[0]}{person.surname[0]}
                                                                          </div>
                                                                        </td>
                                                                        <td>
                                                                          <strong>{person.empnumber}</strong> 
                                                                        </td> 
                                                                        <td className="person-info">
                                                                            {person.name}
                                                                        </td>

                                                                        <td className="person-info">
                                                                           {person.surname}
                                                                        </td>
                                                                        <td>
                                                                          <button 
                                                                              className="btn btn-main" 
                                                                              onClick={() => handleViewSummary(today, person.empnumber, person)}                                                                             
                                                                            >
                                                                              View
                                                                          </button>
                                                                        </td>   
                                                                        <td>
                                                                          <div className="trash-action"
                                                                           onClick={() => handleTogglePersonProject(person.empnumber, 0)}>
                                                                            <FaTrashAlt />
                                                                          </div>
                                                                        </td>                                                                   
                                                                  </tr>
                                                          })
                                                        }
                                                        </tbody>
                                                     </table>                                                      
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
                                                          <button
                                                            className="btn btn-close bt-search-dialogue"
                                                            onClick={() => handleClearSearch()}
                                                            >

                                                          </button>
                                                        {
                                                          searchUserList.map((search, index) => {
                                                            return <div className="person-item" key={index}
                                                                    onClick={() => handleTogglePersonProject(search.empnumber, 1)}>
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
                                <div className="section-part">
                                  <div className="row">
                                   
                                    <h6 className="coach">Periods</h6>
                                    <div className="period-container">
                                      <h2>Project Periods</h2>
                                      {periodDays.length === 0 ? (
                                        <p>No period data available.</p>
                                      ) : (
                                        <table className="table period-table">
                                          <thead>
                                            <tr>
                                              <th>Date Task</th>
                                              <th>Task Note</th>
                                              <th>Start Time</th>
                                              <th>End Time</th>
                                              <th>Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {periodDays.map((period, index) => (
                                              <tr key={period._id || index}>
                                                <td>
                                                  <input
                                                    type="date"
                                                    value={
                                                      period.dateTask
                                                        ? new Date(period.dateTask).toISOString().split("T")[0]
                                                        : ""
                                                    }
                                                    onChange={(e) =>
                                                      handleChangePeriod(index, "dateTask", e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <input
                                                    type="text"
                                                    value={period.taskNote || ""}
                                                    className="form-control"
                                                    onChange={(e) =>
                                                      handleChangePeriod(index, "taskNote", e.target.value)
                                                    }
                                                    placeholder="Enter task note"
                                                  />
                                                </td>
                                                <td>
                                                  <input
                                                    type="time"
                                                    value={period.setStartTime || ""}
                                                    className="form-control frm-time"
                                                    onChange={(e) =>
                                                      handleChangePeriod(index, "setStartTime", e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <input
                                                    type="time"
                                                    value={period.setEndTime || ""}
                                                    className="form-control frm-time"
                                                    onChange={(e) =>
                                                      handleChangePeriod(index, "setEndTime", e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <button
                                                    className="btn btn-main"
                                                    onClick={() => handleSavePeriod(index)}
                                                  >
                                                    Save
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      )}
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