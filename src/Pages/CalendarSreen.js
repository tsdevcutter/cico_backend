import React, { useCallback, useEffect, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import { Link } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import axios from 'axios';
import ModalPopUp from '../Components/modals/ModalPopUp';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


function CalendarSreen() {
  
  const {user}                                                              = useSelector((state) => state.auth);

  const [formData, setFormData]                                             = useState({
              title: '',
              description: '',
              startDate: '',
              endDate: '',
              address: ''
          });
      
    const [processing, setProcessing]                                               = useState(false);
    const [showModalAdd, setShowModalAdd]                                           = useState(false);
    const [showProModalAdd, setShowProModalAdd]                                     = useState(false);
    const [projectList, setProjectList]                                             = useState([]);
    const [newProjects, setNewProjects]                                             = useState([]);
    const [selectedEvent, setSelectedEvent]                                         = useState(null);
    const [companyUsers, setCompanyUsers]                                           = useState([]);
    const [cULoading, setCULoading]                                                = useState(false);

    useEffect(() => {
        collectListOfProjects();
    },[])

    useEffect(() => {
      if(showProModalAdd){
        collectCompanyUserList();
      }
    }, [showProModalAdd]);

    const collectListOfProjects = async () => {
        try{
          
            const results = await axios.get(CONSTANTS.API_URL +"settings/list/v1/projects/" + user.companynumber, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        
            console.log(results.data)
            setProjectList(results.data);
            if(results.data.length > 0){
                
                const formattedEvents = formatProjects(results.data);
                setNewProjects(formattedEvents);
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
            console.log(results.data);
            setCULoading(false);
            setCompanyUsers(results.data);
      }catch(err){
        console.log(err);
        setCULoading(false);
      }
  }
  
  const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try{

       const projectContent = {
        ...formData,
        companynumber:user.companynumber
       };
       
       const startDate = new Date(formData.startDate);
       const endDate = new Date(formData.endDate);
        if (endDate < startDate) {
          // If the end date is before the start date, handle the error
          toast.warning("The end date cannot be before the start date. Please select a valid date range.");
          return; // Stop the function from proceeding
        } 
       
        setProcessing(true);
        const results = await axios.post(CONSTANTS.API_URL +"settings/create/v1/project", projectContent, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        toast.success(results.data.message);
        setProcessing(false);
        setFormData({
              title: '',
              description: '',
              startDate: '',
              endDate: '',
              address: ''
          });

      }catch(err){
        console.log(err);
        toast.error("Something went wrong, please try again later.")
        setProcessing(false);
      }
  }

   const formatProjects = (projects) => {
      return projects.map(project => ({
        id: project._id,
        title: project.title,
        start: project.startDate,
        end: project.endDate,
        backgroundColor: getRandomDarkColor(),
        borderColor: getRandomDarkColor(),
      }));
   };

  const handleDateSelect = (selectInfo) => {
        
      const filteredProjects = newProjects.filter(event => event.startDate === selectInfo.startStr);

      if(filteredProjects.length > 0){
          setShowProModalAdd(true);
          const current = projectList.filter(selected => selected._id === filteredProjects[0].id);
       
        setSelectedEvent(current[0]);
    } 
  
  };

  function getRandomDarkColor() {
      const getLowValue = () => Math.floor(Math.random() * 100); // Keep values below 100
      
      const r = getLowValue().toString(16).padStart(2, '0');
      const g = getLowValue().toString(16).padStart(2, '0');
      const b = getLowValue().toString(16).padStart(2, '0');
      
      return `#${r}${g}${b}`;
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const handleTogglePersonProject = async (empNumber) => {
    
    const newObject = {
        "projectId"   : selectedEvent._id,
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
    
        setSelectedEvent(results.data.newProject)
        setProcessing(false);

      }catch(err){
        console.log(err);
      }
  }
  return (
    <div className="card-container">
       <div className="card">
          <div className="content-row">
            <button className="btn btn-main" onClick={() => setShowModalAdd(true)}>
              Add Project
            </button>
          </div>
          <ModalPopUp
              show={showModalAdd}
              handleClose={() => setShowModalAdd(false)}
              title="Add Project"
            >
              <div className="body-modal-area">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Title*</div>
                          <input 
                                type="text" 
                                className="form-control" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                placeholder="Enter Project Title"   
                                required                             
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Address</div>
                          <input 
                                type="text" 
                                className="form-control" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                placeholder="Enter Project Address"   
                                required                             
                              />
                        </div>
                      </div>
                    
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Start*</div>
                            <input 
                                type="date" 
                                className="form-control" 
                                name="startDate" 
                                value={formData.startDate} 
                                onChange={handleChange} 
                                placeholder="Enter Starting Date*"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">End*</div>
                            <input 
                                type="date" 
                                className="form-control" 
                                name="endDate" 
                                value={formData.endDate} 
                                onChange={handleChange} 
                                placeholder="Enter Ending Date*"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-12">
                        <div className="form-group mb-3">
                          <div className="label-small">Description</div>
                            <textarea 
                                className="form-control" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder="Enter the description"
                              ></textarea>
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
            show={showProModalAdd}
            handleClose={() => setShowProModalAdd(false)}
            title="Project Details">
              <div className="body-modal-area">
                <div className="flexme">
                    <div className="project-modal-details">
                      {
                        selectedEvent !== null && (
                          <>
                            <h3>{selectedEvent?.title}</h3>
                            <div className="content-info">
                              {selectedEvent?.description}
                            </div>
                            <div className="dt-list">
                                <span>{formatDate(selectedEvent?.startDate)}</span> - 
                                <span>{formatDate(selectedEvent?.endDate)}</span>
                            </div>
                          </>
                        )
                      }
                      
                    </div>
                    <div className="user-modal-list">
                      {cULoading && 'loading...'}
                      {
                        companyUsers.length > 0 && (
                          <div className="scroll-list">
                            {
                              companyUsers.map((person, index) => {
                                const isIncluded = selectedEvent.users?.includes(person.empnumber);
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
              </div>
          </ModalPopUp>

          <h2 className="text-xl font-bold mb-4">Projects</h2>
           <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]} // Add interactionPlugin
                initialView="dayGridMonth"
                events={newProjects}
                height="auto"
                selectable={true} // Enable selecting dates
                select={handleDateSelect} // Handle date selection
                eventClick={handleDateSelect} 
              />
        </div>
      </div>
  )
}

export default CalendarSreen