import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { useSelector } from 'react-redux';
import ModalPopUp from '../Components/modals/ModalPopUp';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ProjectScreen() {
      const {user}                                                  = useSelector((state) => state.auth);

      const [showModalAdd, setShowModalAdd]                                      = useState(false);
      const [events, setEvents]                                                  = useState([]);
      const [processing, setProcessing]                                          = useState(false);

      const [formData, setFormData]                                              = useState({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            address: ''
        });

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

      useEffect(() => {
        collectCurrentUserProject()
      }, []);

     const collectCurrentUserProject = async () => {
            
        try{

            const results = await axios.get(CONSTANTS.API_URL +"settings/company/v1/project/"+ user.companynumber, {
                        headers: {
                            token: 'Bearer ' + user.accessToken,
                        },
                    });

                               
                    if(results.data.notempty){
                        setEvents(results.data.response);
                    }
        }catch(err){
            console.log(err);
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
          {
                events.length > 0 && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>Title</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Users</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                events.map((project, index) => {
                                    return <tr key={index}>
                                                <td>{index + 1}</td>  
                                                <td>{project.title}</td>   
                                                <td>{formatDateToDDMMYYYY(project.startDate)}</td>   
                                                <td>{formatDateToDDMMYYYY(project.endDate)}</td>    
                                                <td>{project.users.length}</td>     
                                                <td>
                                                    <Link to={"/project-details/" + project._id}>View</Link>
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
  )
}

export default ProjectScreen