import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import { toast } from 'react-toastify';
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import ModalPopUp from '../Components/modals/ModalPopUp';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

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
  
  const [showSat, setShowSat] = useState(true);
  const [showSun, setShowSun] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(null);
  //validates if this date is on or off  that has been selected.
  const [selectedDActiveDate, setSelectedDActiveDate]                             = useState(false);

  const [isDeleting, setIsDeleting]                                               = useState(false);
  const [totalWorkingDays, setTotalWorkingDays]                                   = useState(0);

  const [selectedSearchPerson, setSelectedSearchPerson]                                 = useState(null);
  const [showModalAddToProject, setShowModalAddToProject]                               = useState(false);
  const [showModalEditedPeriod, setShowModalEditedPeriod]                               = useState(false);

  const [enableDelete, setEnableDelete]                                                 = useState(false);
  
  const [selectedShiftDates, setSelectedShiftDates]                                     = useState([]);
  const [viewMyShifts, setViewMyShifts]                                                 = useState([]);

  const [addWorkDate, setAddWorkDate]                                                   = useState(0);
  const [removeShiftDate, setRemoveShiftDate]                                           = useState(null);

  const [showModalDeleteUserConfirm, setShowModalDeleteUserConfirm]                    = useState(false);
  const [deletePerson, setDeletePerson]                                                = useState(null);

  const [showModalSearchUser, setShowModalSearchUser]                                  = useState(false);

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

  useEffect(() => {
    if(selectedSearchPerson){
      setShowModalAddToProject(true);
    }
  },[selectedSearchPerson])

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

        const periods = res.data;
        
       setPeriodDay(periods);
       setTotalWorkingDays(periods.length)
       ////////))))))))))))))))))))))))))))))))))))))))
        const hasSaturday = periods.some(item => new Date(item.dateTask).getDay() === 6);
        // Check if any date in the array falls on a Sunday (0)
        const hasSunday = periods.some(item => new Date(item.dateTask).getDay() === 0);
       
        // If it exists, we hide the toggle/option (setting it to false)
        //if (hasSaturday) {setShowSat(true)} else {setShowSat(false)};
        setShowSat(hasSaturday)
        //if (hasSunday) setShowSun(true);
        setShowSun(hasSunday);
        
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
  //Add the person to project or Remove them
  const handleConfirmDeletePersonProject = async (person) => {
    
        const newObject = {
            "projectId"   : currentProject._id,
            "person" : person,           
        }
        
      setDeletePerson(newObject);  
      setShowModalDeleteUserConfirm(true);
  }

  const handleDeleteuserFromProject = async () => {
    try{

        setProcessing(true);
        const results = await axios.put(CONSTANTS.API_URL +"projects/confirm/remove/user/from-project/v1/" , deletePerson, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

        toast.success(results.data.message);
        setProcessing(false);
        ///////
        setShowModalDeleteUserConfirm(false);
        setDeletePerson(null);
        collectCurrentProjectDetails();
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
            "companynumber" : user.companynumber,
            "projectId" : currentProject._id
          }
        
          const results = await axios.put(CONSTANTS.API_URL +"users/short-list/v2/assigners", newObject, {
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
        
        setViewMyShifts([]);
        //console.log(person);
        const payLoad = {
          "projectCode" : currentProject.projectCode,
          "empNumber" : person.empnumber
        }
        
        setProcessing(true);
        const results = await axios.put(CONSTANTS.API_URL +"projects/user/summary/shifts/v1", payLoad, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
          setProcessing(false);
          //console.log(results.data)
          setViewMyShifts(results.data);
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
      toast.error("Something went wrong, please try again later.")
      setProcessing(false);
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

  const handleDeleteThisProject = async () => {
    try{

      setProcessing(true);
      const response = await axios.delete(CONSTANTS.API_URL + `projects/remove/current/v1/${currentProject.projectCode}`, {
            headers: { token: "Bearer " + user.accessToken },
          }
        );

         setProcessing(false);
        if(response.status === 200){
          toast.warning(response.data.message);

          window.location.href = "/projects"
        }
    }catch(err){
      console.log(err);
      setProcessing(false);
    }
  }

  const getDayCellClass = (arg) => {
    // Format the cell date to YYYY-MM-DD to match common data formats
    const dateStr = arg.date.toISOString().split('T')[0];
    
    // Check if any item in your periodDay collection matches this date
    const isActive = periodDays.some(item => {
        const itemDate = new Date(item.dateTask).toISOString().split('T')[0];
        return itemDate === dateStr;
    });

    return isActive ? 'work-active-day' : '';
  };

  const handleToggleDay = async (dayIndex, currentStatus, setStatus) => {
      
      const newStatus = !currentStatus;
      setStatus(newStatus);

      // If we are turning the day OFF (e.g., hiding Saturdays)
      if (newStatus === false) {
        console.log("TURN OFF");
        //turn off
        // 1. Find all records in your collection that fall on that day (0=Sun, 6=Sat)
        const datesToDelete = periodDays.filter(item => {
          const d = new Date(item.dateTask);
          return !isNaN(d.getTime()) && d.getDay() === dayIndex;
        });

        if (datesToDelete.length > 0) {
          const idsToDelete = datesToDelete.map(item => item._id); // Or item.id
          
          try {
            setIsDeleting(true);
            setProcessing(true);
            // 2. Make the backend request
            // Replace with your actual API call: axios.post('/api/delete-dates', { ids: idsToDelete })
            const response = await axios.post(CONSTANTS.API_URL + "projects/weekend/remove/data/v1/", {ids: idsToDelete}, 
                {
                  headers: { token: "Bearer " + user.accessToken },
                });
            
            if (response.status === 200) {
                // 3. SUCCESS: Update local state to remove the class/events
                const updatedCollection = periodDays.filter(
                  item => !idsToDelete.includes(item._id)
                );
          
              setPeriodDay(updatedCollection); // This triggers a re-render and removes the class
              setTotalWorkingDays(updatedCollection.length)
              toast.success(response.data.message);
            }
          } catch (error) {
            toast.error("Something went wrong, please try again later.");
            // Optional: Revert the toggle if the delete fails
            setStatus(true);
          } finally {
            setIsDeleting(false);
            setProcessing(false);
          }          
        }

      }else {
        console.log("TURN ON");
        //turn on
        const start = new Date(currentProject.startDate); // Use the main project start
        const end = new Date(currentProject.endDate);     // Use the main project end
        const datesToAdd = [];

        let current = new Date(start);
        while (current <= end) {
          // If the current day matches the toggle (Sat/Sun) 
          // AND it's not already in our collection
          if (current.getDay() === dayIndex) {
            const dateStr = current.toISOString().split('T')[0];
            const exists = periodDays.some(item => 
              new Date(item.dateTask).toISOString().split('T')[0] === dateStr
            );

            if (!exists) {
              datesToAdd.push({
                dateTask: new Date(current),
                taskNote: "",
                projectCode: currentProject.projectCode,
                setStartTime: currentProject.setStartTime,
                setEndTime: currentProject.setEndTime,
                clockId: []
              });
            }
          }
          current.setDate(current.getDate() + 1);
        }
        
        if (datesToAdd.length > 0) {
          try {
            setIsDeleting(true); // Re-use loading state
            setProcessing(true);
            // 1. Backend Request to Create
            const response = await axios.post(CONSTANTS.API_URL + "projects/weekend/add/data/v1/",{datesToAdd:datesToAdd}, 
                {
                  headers: { token: "Bearer " + user.accessToken },
                });
            
            if (response.status === 200 || response.status === 201) {
              // 2. SUCCESS: Add the newly created items to local state
              // response.data should return the array of new objects with MongoDB _ids
              const updatedPeriods = [...periodDays, ...response.data];
              setPeriodDay(updatedPeriods);
              setTotalWorkingDays(updatedPeriods.length)
              toast.success("Thank you for adding.");
            }
            
          } catch (error) {
            console.error("Failed to add dates:", error);
            setStatus(false); // Revert toggle on error
          } finally {
            setIsDeleting(false);
            setProcessing(false);
          }
        }        
      }
  };

  const getWeekendClass = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDay();

      if (day === 6) return "weekend c-sat";
      if (day === 0) return "weekend c-sun";
      return "";
  };

  const handleCalendarDateClick = (info) => {
      const selectedDate = new Date(info.dateStr);
      const start = new Date(currentProject.startDate);
      const end = new Date(currentProject.endDate);

      // Normalize dates to midnight to avoid time-comparison issues
      selectedDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (selectedDate < start || selectedDate > end) {
        toast.warning("Sorry cannot select out of scope of project");
        return; // Stop the execution
      }

      const existingPeriod = periodDays.find(p => {
        return new Date(p.dateTask).toISOString().split('T')[0] === info.dateStr;
      });

      // 3. Set State with Fallback Logic
      // Use existing period times OR project default times
      setSelectedDate({
        date: info.dateStr,
        startTime: existingPeriod?.setStartTime || currentProject.setStartTime || "",
        endTime: existingPeriod?.setEndTime || currentProject.setEndTime || "",
        taskNote: existingPeriod?.taskNote || ""
      });

      setSelectedDActiveDate(!!existingPeriod);
  };

  const handleSaveDayDetails = async () => {
      try{

         setProcessing(true);
          const payload = {
            "mendtype" : selectedDActiveDate,
            "selected": {
              "dateTask": selectedDate.date ,
              "projectCode": currentProject.projectCode,
              "setStartTime":selectedDate.startTime, 
              "setEndTime": selectedDate.endTime,
              "taskNote" : selectedDate.taskNote,
            }
          }
                    
          const res = await axios.post(CONSTANTS.API_URL +"settings/project/period/calendar/create", payload, {
            headers: {
                  token: 'Bearer ' + user.accessToken,
                },
            });    

          console.log(res);
          toast.success(res.data.message);
          collectCurrentProjectPeriodDays();
          setProcessing(false);
      }catch(err){
        console.log(err);
        setProcessing(false);
      }
  }

  const handleDateShiftToggle = (date) => {
      if (selectedShiftDates.includes(date)) {
        // If already selected, remove it
        setSelectedShiftDates(selectedShiftDates.filter(d => d !== date));
      } else {
        // If not selected, add it
        setSelectedShiftDates([...selectedShiftDates, date]);
      }
  };

  const handleSaveShifts = async () => {
      if (selectedShiftDates.length === 0) {
        toast.warning("Please select at least one date.");
        return;
      }

      const payload = {
        empNumber: selectedSearchPerson.empnumber,
        dates: selectedShiftDates // Array of selected dates
      };
    
    try {

          setProcessing(true);
          const response = await axios.post(CONSTANTS.API_URL +'projects/period/update/bulk-shifts/v1/', payload, {
                        headers: {
                            token: 'Bearer ' + user.accessToken,
                        },
                    });

      //'Shifts saved successfully!'
      toast.success(response.data.message);
      // Optionally clear selection
      setSelectedShiftDates([]);
      setProcessing(false);
      setShowModalAddToProject(false);
      collectCurrentProjectDetails();
    } catch (error) {
      toast.error('Failed to save shifts.');
      setProcessing(false);
    }    
  };

  const handleAddWorkDate = async (e) => {
    const selectedDateStr = e.target.value;
    if (!selectedDateStr) return;

    // --- Validation Logic ---
    const selectedTime = new Date(selectedDateStr).setHours(0,0,0,0);
    const startTime = new Date(currentProject.startDate).setHours(0,0,0,0);
    const endTime = new Date(currentProject.endDate).setHours(0,0,0,0);

    //Check out of range
    if (selectedTime < startTime || selectedTime > endTime) {
      toast("Out of project range");
      e.target.value = "";
      setAddWorkDate(0);
      return;
    }

    //Check if not in current shift list xxxx
    // 2. Check if a shift already exists on this date
    const isDateAlreadyShifted = viewMyShifts.some(shift => {
      // Normalize the existing shift date to midnight for an accurate comparison
      const shiftTime = new Date(shift.setDate).setHours(0,0,0,0);
      return shiftTime === selectedTime;
    });

    if (isDateAlreadyShifted) {
      toast("You already have a shift scheduled for this date");
      e.target.value = "";
      setAddWorkDate(0);
      return;
   }

  setAddWorkDate(selectedTime); 
  };

  const handleSavingAddingWorkDate = async () => {
    try{

      const dateObject = new Date(addWorkDate);
      // Use the 'en-CA' (English Canada) locale because its default format is YYYY-MM-DD
      const formattedDate = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(dateObject);
    
      const bobRes = {
        "periodId"      : currentProject._id,
        "projectCode"   : currentProject.projectCode,
        "userEmpNumber" : currentUserShow.empnumber,
        "setDate": formattedDate
      }

      setProcessing(true);
      
      const theShift = await axios.post(CONSTANTS.API_URL + "projects/user/single/shift/v1/", bobRes, 
            {
              headers: { 
                token: "Bearer " + user.accessToken 
            },
      });
       
      const payLoad = {
          "projectCode" : currentProject.projectCode,
          "empNumber" : currentUserShow.empnumber
        }
        
        const results = await axios.put(CONSTANTS.API_URL +"projects/user/summary/shifts/v1", payLoad, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });

        setAddWorkDate(0);
        toast.success(theShift.data.message); 
        setViewMyShifts(results.data);
      setProcessing(false);
    }catch(err){
      console.log(err);
      toast.error("Something went wrong, please try again later.");
      setProcessing(false);
    }
  }

  // 2. DELETE Request: Remove Shift from Server
  const handleRemoveShiftDate = async (dateStr, shift) => {
    setRemoveShiftDate(shift);
  };

  const handleCompleteRemoveDate = async () => {
    try{
      setProcessing(true);
       
       const unShift = await axios.put(CONSTANTS.API_URL + "projects/user/single/un-shift/v1/", removeShiftDate, 
            {
              headers: { 
                token: "Bearer " + user.accessToken 
            },
      });
      
       toast.success(unShift.data.message);
       const payLoad = {
          "projectCode" : currentProject.projectCode,
          "empNumber" : currentUserShow.empnumber
        }
        
        const results = await axios.put(CONSTANTS.API_URL +"projects/user/summary/shifts/v1", payLoad, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
            setRemoveShiftDate(null);
            setViewMyShifts(results.data);
      setProcessing(false);
    }catch(err){
      console.log(err);
      toast.error("Something went wrong, please try again later.");
      setProcessing(false);
    }
  }

  const handleToggleAllShiftDates = () => {
    // Check if all period days are already selected
    const allSelected = periodDays.every(day => selectedShiftDates.includes(day));

    if (allSelected) {
      // If all are selected, deselect them all (clear them out)
      setSelectedShiftDates([]);
    } else {
      // Otherwise, select all dates from periodDays
      setSelectedShiftDates([...periodDays]);
    }
  };

  return (
     <div className="card-container mod-x-pop">
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
          
            <ModalPopUp
              show={showModalUsers}
              handleClose={() => setShowModalUsers(false)}
              title="User Information"
              wrapclass="normal"
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
                         <div className="list-date-periods">
                            <h4>Work Dates</h4>
                           {viewMyShifts && viewMyShifts.map((date, index) => {
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  className="btn btn-outline mb-2 me-2"
                                  onClick={() => handleRemoveShiftDate(date.setDate, date)}
                                >
                                  {/* Format your date here if needed */}
                                  {new Date(date.setDate).toLocaleDateString()} 
                                </button>
                              );
                            })}
                         </div> 
                         <div className="edit-work-dates">
                            <div className="d-flex">
                               <div className="w-50 text-center">
                                 <small className="text-muted">💡 Click any date badge above to remove it.</small>
                                  {
                                    removeShiftDate !== null &&  <h3 className="mt-3">{formatDateToDDMMYYYY(removeShiftDate?.setDate)}</h3>
                                  }
                                  
                                  {
                                    removeShiftDate !== null && 
                                     (<div className="d-flex p-2 justify-content-between">
                                        <div className="w-50 p-3">
                                          <button
                                            className="btn btn-light btn-small"
                                            onClick={() => {
                                              setRemoveShiftDate(null);
                                            }}>
                                              Cancel
                                          </button>
                                        </div>
                                        <div className="w-50 p-3">
                                          <button
                                            className="btn btn-main btn-small"
                                            onClick={handleCompleteRemoveDate}>
                                              Confirm
                                          </button>
                                        </div>
                                      </div>)
                                  }
                                 
                               </div>
                               <div className="w-50">
                                 <div className="shade-a1-back">
                                    <h5>Add Date</h5>
                                    <input 
                                        type="date" 
                                        className="form-control"
                                        min={currentProject?.startDate}
                                        max={currentProject?.endDate}
                                        onChange={handleAddWorkDate} 
                                      />
                                      
                                      {
                                        addWorkDate > 2 && 
                                          <button
                                            className="mt-3 btn btn-main"
                                            onClick={handleSavingAddingWorkDate}>
                                            Save Adding Date
                                          </button>
                                      }
                                 </div>
                               </div>
                            </div>
                         </div>
                   </div>
                 </div>
              </div>
            </ModalPopUp>
            <ModalPopUp
                show={showModalAddToProject}
                handleClose={() => setShowModalAddToProject(false)}
                title="Add User to Project"
                wrapclass="normal"
              >
                <div className="body-modal-area">
                  {
                    selectedSearchPerson && (
                      <div className="select-date-person">
                        <div className="d-flex justify-content-around mb-2">
                              <div><strong>{selectedSearchPerson.empnumber}</strong></div>
                              <div>{selectedSearchPerson.name}</div>
                              <div>{selectedSearchPerson.surname}</div>
                              <div>{selectedSearchPerson.email}</div>
                              <div>{selectedSearchPerson.phone}</div>
                              <div>{selectedSearchPerson.gender}</div>
                              <div>{selectedSearchPerson.jobTitle}</div>
                        </div>                        
                        <hr/>
                        <div className="d-flex justify-content-between">
                        <h6>You have selected :{selectedShiftDates.length} shifts</h6>
                        {periodDays && periodDays.length > 0 && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input 
                              type="checkbox"
                              checked={periodDays.every(day => selectedShiftDates.includes(day))}
                              onChange={handleToggleAllShiftDates}
                              style={{ cursor: 'pointer' }}
                            />
                            {periodDays.every(day => selectedShiftDates.includes(day)) ? "Deselect All" : "Select All"}
                          </label>
                        )}   
                        </div>                    
                         <div className="list-date-periods">
                            
                           {periodDays && periodDays.map((date, index) => {
                              const isSelected = selectedShiftDates.includes(date);
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleDateShiftToggle(date)}
                                  className="date-shift"
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: isSelected ? '#e37995' : '#f0f0f0',
                                    color: isSelected ? '#fff' : '#333',
                                    border: '1px solid #ccc',                                    
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {/* Format your date here if needed */}
                                  {new Date(date.dateTask).toLocaleDateString()} 
                                </button>
                              );
                            })}
                         </div>
                         {
                          selectedShiftDates.length > 0 && <button 
                                                            onClick={handleSaveShifts}
                                                            className="mt-3"
                                                            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                          >
                                                            Save Shifts
                                                          </button>
                         }
                         
                    </div>)
                  }
                </div>
            </ModalPopUp>
           
            <ModalPopUp
                show={showModalDeleteUserConfirm}
                handleClose={() => 
                  {
                      setShowModalDeleteUserConfirm(false);
                       setDeletePerson(null);
                  }
                }
                title="Confirm Delete user"
                wrapclass="normal"
              >
                <div className="body-modal-area">
                    {
                      deletePerson && <div className="section-part text-center">
                                          <h4>Please confirm to remove the user:  </h4>
                                          <h3>{deletePerson.person.name} {deletePerson.person.surname} </h3>
                                          
                                          <div className="d-flex p-2 justify-content-between">
                                            <div className="w-50 p-3">
                                              <button className="btn btn-light btn-small"
                                                onClick={() => {
                                                  setDeletePerson(null);
                                                  setShowModalDeleteUserConfirm(false);
                                                }}>Cancel</button>
                                            </div>
                                            
                                            <div className="w-50 p-3">
                                              <button className="btn btn-main btn-small"
                                                onClick={handleDeleteuserFromProject}>Confirm</button>
                                            </div>
                                          </div>
                                      </div>
                    }
                </div>
            </ModalPopUp>
            
            <ModalPopUp
                show={showModalEditedPeriod}
                handleClose={() => setShowModalEditedPeriod(false)}
                title="Edit Project Period"
              >
                <div className="body-modal-area body-eighty">
                  
                  <div className="d-flex gap-4 mb-3 p-2 border-bottom">
                  
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="toggleSat"
                        checked={showSat} 
                        disabled={isDeleting}
                        onChange={() => handleToggleDay(6, showSat, setShowSat)}
                      />
                      <label className="form-check-label" htmlFor="toggleSat">Saturday</label>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="toggleSun"
                        checked={showSun} 
                        disabled={isDeleting}
                        onChange={() => handleToggleDay(0, showSun, setShowSun)}
                      />
                      <label className="form-check-label" htmlFor="toggleSun">Sunday</label>
                    </div>
                  </div>

                  <div className="d-flex">
                    {/* 80% Calendar Area */}
                    <div className="calender-phase-view" style={{ flex: '0 0 80%', paddingRight: '20px' }}>
                      <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        timeZone="UTC"
                        initialView="dayGridMonth"                       
                        dayCellClassNames={getDayCellClass}
                        dateClick={handleCalendarDateClick}
                        events={periodDays} 
                        height="450px"
                      />
                    </div>

                    {/* 20% Info Area */}
                    <div style={{ flex: '0 0 20%', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                      <h6>Day Details</h6>
                      {
                        selectedDate ? (
                          <div className="small">
                            {
                              !selectedDActiveDate && <strong>This day is off, do you want to include it?</strong>
                            }
                            {/* Display the date string from the object */}
                            <p className="text-primary fw-bold">{selectedDate.date}</p>
                            
                            <div className="mb-2">
                              <label className="d-block">Start Time</label>
                              <input 
                                type="time" 
                                className="form-control form-control-sm" 
                                value={selectedDate.startTime}
                                onChange={(e) => setSelectedDate({ ...selectedDate, startTime: e.target.value })}
                              />
                            </div>
                            
                            <div className="mb-3">
                              <label className="d-block">End Time</label>
                              <input 
                                type="time" 
                                className="form-control form-control-sm" 
                                value={selectedDate.endTime}
                                onChange={(e) => setSelectedDate({ ...selectedDate, endTime: e.target.value })}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="d-block">Notes</label>
                              <textarea
                                className="form-control form-control-sm" 
                                value={selectedDate.taskNote}
                                onChange={(e) => setSelectedDate({ ...selectedDate, taskNote: e.target.value })}
                              ></textarea>
                            </div>
                            
                            <button 
                              className="btn btn-success btn-sm w-100"
                              onClick={handleSaveDayDetails} // You'll need to define this function to sync with DB
                            >
                              Save Changes
                            </button>
                          </div>
                        ) : (
                          <p className="text-muted small">Select a date to edit times.</p>
                        )
                      }
                    </div>
                  </div>

                </div>
            </ModalPopUp>
            
            <ModalPopUp
                show={showModalSearchUser}
                handleClose={() => setShowModalSearchUser(false)}
                title="Search user to add"
                wrapclass="md-slim"
              >
                <div className="body-modal-area">
                      <h3>Welcome, pleaese search for user.</h3>
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
                                            onClick={() => {
                                                  setSelectedSearchPerson(search);
                                                  setSearchUserList([]);
                                                  setSearchUser("");
                                                  setShowModalSearchUser(false);
                                                }
                                              }>
                                              <strong>{search.empnumber}</strong>
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
                                                                        <div className="lab-text">Employee No:</div>
                                                                        <strong>{person.empnumber}</strong> 
                                                                      </td> 
                                                                      <td className="person-info">
                                                                          <div className="lab-text">Name:</div>
                                                                          {person.name}
                                                                      </td>

                                                                      <td className="person-info">
                                                                        <div className="lab-text">Surname:</div>
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
                                                                          onClick={() => handleConfirmDeletePersonProject(person)}>
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
                                            <button
                                              className="btn btn-main"
                                              onClick={() => setShowModalSearchUser(true)}>
                                              Add user to project
                                            </button>                               
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="section-part">
                                
                                  <h6 className="coach">Periods</h6>
                                  <div className="row content-container-box ">
                                    <h2>Project Periods</h2>
                                    {periodDays.length === 0 ? (
                                      <p>No period data available.</p>
                                    ) : (
                                      <div className="period-container">
                                        
                                        <div className="content-list d-flex justify-content-between">
                                          <button className="btn btn-outline-primary mt-1 mb-2" onClick={() => setShowModalEditedPeriod(true)} >
                                            Edit Period
                                          </button>
                                          <div className="weekend-info-detail">
                                            <span className="box-s sat-box"></span> Sat
                                            <span className="box-s sun-box ms-2"></span> Sun
                                          </div>
                                          <div className="size-total">
                                            Total {totalWorkingDays}
                                          </div>
                                        </div>
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
                                            <tr key={index} className={getWeekendClass(period.dateTask)}>
                                              <td>
                                                <div className="mt-3">
                                                  {new Date(period.dateTask).toISOString().split("T")[0]}
                                                </div>
                                                {
                                                  /*
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
                                                  */
                                                }
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
                                      </div>
                                    )}
                                  </div>
                                
                              </div>
                              <div className="section-part">                                                                
                                  <h6 className="coach">Delete</h6>
                                  <div className="content-container-box row">
                                    <div className="col-md-6">
                                      Proceed with extreme caution. Deleting a project is a permanent action that cannot be undone. Once confirmed:
                                      <ul>
                                      <li>The project will be permanently removed from your dashboard.</li>
                                      <li>All <strong>affiliated scheduled times and data</strong> will be lost forever.</li>
                                      <li>There is no way to recover or "roll back" this deletion.</li>
                                      </ul>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="card">
                                        <div className="card-body">
                                          <h4>To confirm deletion, please type the name of the project in the box below:</h4>
                                          <input 
                                              type="text" 
                                              className="form-control" placeholder="Project Name" 
                                              onChange={(e) => {
                                                if(e.target.value === currentProject.title){
                                                  setEnableDelete(true);
                                                }else {
                                                  setEnableDelete(false)
                                                }
                                              }}
                                              />

                                            {
                                              enableDelete && <button className="btn btn-danger mt-3" onClick={() => handleDeleteThisProject()}>Delete Project</button>
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