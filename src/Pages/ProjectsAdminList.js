import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ProjectsAdminList() {
    const {user}                                                               = useSelector((state) => state.auth);
    const [events, setEvents]                                                  = useState([]);
    const [processing, setProcessing]                                          = useState(false);

        useEffect(() => {
      collectCurrentUserProject()
    }, []);

    const collectCurrentUserProject = async () => {
            
        try{

            const results = await axios.get(CONSTANTS.API_URL +"settings/company/v2/project/full", {
                        headers: {
                            token: 'Bearer ' + user.accessToken,
                        },
                    });

            //console.log(results);
            setEvents(results.data);
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
        <h2 className="text-xl font-bold mb-4">Project Admin</h2>
    
         {
                events.length > 0 && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>Title</th>
                                <th>Code</th>
                                <th>Start</th>
                                <th>Start Time</th>
                                <th>End</th>
                                <th>End Time</th>
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
                                                <td>{project.projectCode}</td>
                                                <td>{formatDateToDDMMYYYY(project.startDate)}</td>  
                                                <td>{project.setStartTime}</td> 
                                                <td>{formatDateToDDMMYYYY(project.endDate)}</td>    
                                                <td>{project.setEndTime}</td> 
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

export default ProjectsAdminList