import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as CONSTANTS from "../CONSTANTS";
import axios from 'axios';
import ModalPopUp from '../Components/modals/ModalPopUp';
import { toast } from 'react-toastify';
import { FaEdit, FaPlane } from "react-icons/fa";

let typingTimeout;

function FlightsScreen() {

    const {user}                                                              = useSelector((state) => state.auth);

    const [formData, setFormData]                                             = useState({
            airline: '',
            class: 'Economic',
            userId: '',
            date: '',
            time: '',
            depature: '',
            arrival: '',
            status: 'Draft' 
        });

    const [showModalEditFlight, setShowModalEditFlight]                       = useState(false);
    const [selectedEditTicket, setSelectedEditTicket]                         = useState(null);

    const [processing, setProcessing]                                         = useState(false);
    const [showModalAdd, setShowModalAdd]                                     = useState(false);
    const [ticketList, setTicketList]                                         = useState([]);

    const [fileTicket, setFileTicket]                                                     = useState(null);

    const [page, setPage]                                                     = useState(0);
    const [limit, setLimit]                                                   = useState(30);
    const [autoComps,setAutoComps]                                            = useState([]);
    const [selectedUser, setSelectedUser]                                     = useState(null);
    const [searchTerm, setSearchTerm]                                         = useState("");

    const [formEditFlight, setFormEditFlight]             = useState({
      airline: "",
      class: "",
      departureDate: "",
      departureTime: "",
      departureLocation: "",
      arrivalLocation: "",
    });

    const [editTicketId, setEditTicketId]                           = useState("");
    const [activeEditTab, setActiveEditTab]                         = useState("edit-details");
    //edit-details
    //edit-status
    //edit-user
    const [flightUpdate, setFlightUpdate]                           = useState(0);

    useEffect(() => {
        collectListOfTickets();
    },[flightUpdate])

    const collectListOfTickets = async () => {
        try{
            const results = await axios.get(CONSTANTS.API_URL +"tickets/standard-list/v1?page=" + page + "&limit=" + limit + "&companynumber=" + user.companynumber, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        
            setTicketList(results.data.tickets);
        }catch(err){
            console.log(err);
        }
    }
      
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try{
       
        if(fileTicket){
            if((formData.status === "Draft" && selectedUser === null) ||  (formData.status === "Published" && selectedUser !== null)){
            
                  const formFormatData = new FormData();
                  formFormatData.append("ticketfile", fileTicket);
                  formFormatData.append("airline", formData.airline);
                  formFormatData.append("class", formData.class);
                  formFormatData.append("date", formData.date);
                  formFormatData.append("time", formData.time);
                  formFormatData.append("depature", formData.depature);
                  formFormatData.append("arrival", formData.arrival);
                  formFormatData.append("empnumber", formData.status === "Published" ? selectedUser.empnumber : "");
                  formFormatData.append("status", formData.status === "Published" ? true : false);
                  formFormatData.append('companynumber', user.companynumber);

                  setProcessing(true);
                  const result = await axios.post(`${CONSTANTS.API_URL}tickets/upload-ticket/v1/file`, formFormatData, {
                        headers: { 
                          "Content-Type": "multipart/form-data" ,
                          token: 'Bearer ' + user.accessToken,
                        }
                      });

                 
                  toast.success("Ticket has been created");
                  setProcessing(false);
                   setFormData({
                          airline: '',
                          class: 'Economic',
                          userId: '',
                          date: '',
                          time: '',
                          depature: '',
                          arrival: '',
                          status: 'Draft' 
                      });
                    setSelectedUser(null);
                    setFlightUpdate(prev => prev + 1);
            }else {
              toast.warning("Only tickets that don't have a user are drafted. Published tickets must have a user.")
            }
        }else{
          toast.warning("Please select ticket for upload");
        }
                
      }catch(err){
        console.log(err);
        toast.error("Something went wrong, please try again later.")
        setProcessing(false);
      }
    }

  const handleFileChange = (e) => {
    setFileTicket(e.target.files[0]); // FileList object
  };

  const handleSearchEmployee        = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // wait 500ms after user stops typing
    typingTimeout = setTimeout(async () => {
      if (!value.trim()) {
        setAutoComps([]); // reset if empty
        return;
      }

      try {
        const compNumber = user.companynumber;
        const searcher = {
          "company" : compNumber,
          "search"  : value
        }

        const results = await axios.put(CONSTANTS.API_URL +"users/list/auto/" , searcher,
          {
            headers: {
              token: "Bearer " + user.accessToken,
            },
          }
        );
       
        setAutoComps(results.data);
      } catch (err) {
        console.log(err);
      }
    }, 500);
  }, [user]);

  const formatDate = (isoDate) => {
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    return new Date(isoDate).toLocaleDateString('en-US', options).toUpperCase();
  };

  const handleEditFlight = async (e) => {
    e.preventDefault();
    try{
        setProcessing(true);
        const updateTicket = {
          "ticketId" : editTicketId,
          "data" : {
            "airline": formEditFlight.airline,
            "class": formEditFlight.class,
            "date": formEditFlight.departureDate,
            "time": formEditFlight.departureTime,
            "departure": formEditFlight.departureLocation,
            "arrival" : formEditFlight.arrivalLocation
          }
        }
      
        const results = await axios.put(CONSTANTS.API_URL +"tickets/edit/flight/v1/" , updateTicket, {
            headers: {
              token: "Bearer " + user.accessToken,
            },
          }
        );
        setFlightUpdate(prev => prev + 1);
        setProcessing(false);
        toast.success(results.data.message);
    }catch(err){
      toast.error("Something went wrong, please try again later.");
      setProcessing(false);
    }
  }

  const editDateFormat = (isoDateString) =>{
      const date = new Date(isoDateString);

      // Extract components (Note: getMonth() returns 0-11, so we add 1)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad with '0' if single digit
      const day = String(date.getDate()).padStart(2, '0'); // Pad with '0' if single digit

      return`${year}-${month}-${day}`;
  }
  return (
    <div className="card-container">
       <div className="card">
          <div className="content-row">
            <button className="btn btn-main" onClick={() => setShowModalAdd(true)}>
              Add Flight
            </button>
          </div>
          <ModalPopUp
              show={showModalAdd}
              handleClose={() => setShowModalAdd(false)}
              title="Add Ticket"
            >
              <div className="body-modal-area">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Airline</div>
                          <input 
                                type="text" 
                                className="form-control" 
                                name="airline" 
                                value={formData.airline} 
                                onChange={handleChange} 
                                placeholder="Enter Airline"                                
                              />
                        </div>
                      </div>
                       <div className="col-md-6">
                        <div className="form-group mb-3">  
                          <div className="label-small">Class*</div>                  
                           <select 
                                className="form-control"
                                name="class" 
                                onChange={handleChange} 
                                defaultValue={"Economic"}>
                                <option value={"Economic"}>Economic</option>
                                <option value={"Premium Economic"}>Premium Economic</option>
                                <option value={"Business"}>Business</option>
                                <option value={"First"}>First</option>
                           </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Depature Date*</div>
                            <input 
                                type="date" 
                                className="form-control" 
                                name="date" 
                                value={formData.date} 
                                onChange={handleChange} 
                                placeholder="Enter Date*"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Depature Time*</div>
                            <input 
                                type="time" 
                                className="form-control" 
                                name="time" 
                                value={formData.time} 
                                onChange={handleChange} 
                                placeholder="Enter Time*"
                                required
                              />
                        </div>    
                      </div>                    
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Depature*</div>
                          <input 
                                type="text" 
                                className="form-control" 
                                name="depature" 
                                value={formData.depature} 
                                onChange={handleChange} 
                                placeholder="Enter Depature*"
                                required
                              />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <div className="label-small">Arrival*</div>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="arrival" 
                                value={formData.arrival} 
                                onChange={handleChange} 
                                placeholder="Enter Arrival*"
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                            <div className="label-small">Ticket*</div>
                            <input 
                                type="file" 
                                className="form-control"  
                                onChange={handleFileChange}
                                required
                              />
                        </div>    
                      </div>
                      <div className="col-md-6">
                        <div className="label-small">Status*</div>
                          <div className="form-check form-check-inline">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="status" 
                              id="draft" 
                              value="Draft"
                              checked={formData.status === "Draft"}
                              onChange={handleChange} 
                            />
                            <label className="form-check-label" htmlFor="draft">Draft</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input 
                              className="form-check-input" 
                              type="radio" 
                              name="status" 
                              id="published" 
                              value="Published"
                              checked={formData.status === "Published"}
                              onChange={handleChange} 
                            />
                            <label className="form-check-label" htmlFor="published">Published</label>
                          </div>
                      </div>
                      {formData.status === "Published" && (
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <div className="label-small">Employee Number*</div>
                          <input 
                            type="text" 
                            className="form-control" 
                            onChange={handleSearchEmployee} 
                            value={searchTerm}
                            placeholder="Search user..." 
                          />
                          {
                            autoComps.length > 0 && (
                               <div className="auto-comps-block">
                                {
                                  autoComps.map((person, index) => {
                                    return <div className="person-item" key={index}
                                              onClick={() => {
                                                setSelectedUser(person);
                                                setAutoComps([]);
                                                setSearchTerm("");
                                                
                                              }}>
                                              <span>{person.empnumber}</span>
                                              <span>{person.name}</span>
                                              <span>{person.surname}</span>
                                           </div>
                                  })
                                }
                               </div>
                            )
                          }
                        </div>
                      </div>
                    )}
                      <div className="col-md-6">
                        {
                          selectedUser && <div className="searched-person">
                                            <span>{selectedUser.empnumber}</span>  
                                            <span>{selectedUser.name}</span>  
                                            <span>{selectedUser.surname}</span>                
                                          </div>
                        }
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
              show={showModalEditFlight}
              handleClose={() => setShowModalEditFlight(false)}
              title="Edit Project"
            >
              <div className="body-modal-area">
                  <div className="tab-container">
                    <ul className="nav">
                          <li className="nav-item">
                            <button
                              className={`nav-link ${activeEditTab === 'edit-details' ? 'active' : ''}`} 
                              onClick={() => setActiveEditTab('edit-details')}>
                              Edit Details
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${activeEditTab === 'edit-status' ? 'active' : ''}`}
                              onClick={() => setActiveEditTab('edit-status')}>
                              Edit Status
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${activeEditTab === 'edit-user' ? 'active' : ''}`}
                              onClick={() => setActiveEditTab('edit-user')}>
                              Edit User
                            </button>
                          </li>
                        </ul>
                     {
                       activeEditTab === "edit-details" && (
                        <div className="tab-box-item">
                          <form onSubmit={handleEditFlight}>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Airline*</div>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={formEditFlight.airline}
                                      onChange={e =>
                                        setFormEditFlight({ ...formEditFlight, airline: e.target.value })
                                      }
                                      required
                                    />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Class</div>
                                  <select
                                      className="form-control"
                                      value={formEditFlight.class}
                                      onChange={e =>
                                        setFormEditFlight({ ...formEditFlight, class: e.target.value })
                                      }
                                    >
                                      <option value="Economic">Economic</option>
                                      <option value="Premium Economic">Premium Economic</option>
                                      <option value="Business">Business</option>
                                      <option value="First">First</option>
                                    </select>
                                
                                </div>
                              </div>
                            
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Departure Date*</div>
                                  <input
                                        type="date"
                                        className="form-control"
                                        value={formEditFlight.departureDate}
                                        onChange={e =>
                                          setFormEditFlight({ ...formEditFlight, departureDate: e.target.value })
                                        }
                                      required
                                    /> 

                                </div>    
                              </div>
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Departure Time*</div>
                                  <input
                                      type="time"
                                      className="form-control"
                                      value={formEditFlight.departureTime}
                                      onChange={e =>
                                        setFormEditFlight({ ...formEditFlight, departureTime: e.target.value })
                                      }
                                      required
                                    />      

                                </div>    
                              </div>
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Departure Location*</div>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={formEditFlight.departureLocation}
                                      onChange={e =>
                                        setFormEditFlight({ ...formEditFlight, departureLocation: e.target.value })
                                      }
                                      required
                                    />

                                </div>    
                              </div>
                              <div className="col-md-6">
                                <div className="form-group mb-3">
                                  <div className="label-small">Arrival Location*</div>
                                  <input
                                        type="text"
                                        className="form-control"
                                        value={formEditFlight.arrivalLocation}
                                        onChange={e =>
                                          setFormEditFlight({ ...formEditFlight, arrivalLocation: e.target.value })
                                        }
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
                       )
                     }
                      
                    {
                        activeEditTab == "edit-status" && (
                        <div className="tab-box-item">X status</div>
                        )
                    }
                    
                    {
                      activeEditTab == "edit-user" && (
                        <div className="tab-box-item">X user</div>
                        )
                    }
                    

                  </div>
              </div>
          </ModalPopUp>
          <h2 className="text-xl font-bold mb-4">Flights</h2>
          {
            ticketList.length > 0 && (
              <div className="ticket-area">
                <div className="ticket-lines">
                  {
                   ticketList.map((ticket, index) => (
                      <div className="ticket-line" key={index}>
                        <div className="ticket-head">
                          <div className="ticket-date">{formatDate(ticket.date)}</div>
                          <button 
                            className="btn btn-small btn-float-right"
                            onClick={() => {
                                    setSelectedEditTicket(ticket);
                                    setFormEditFlight({
                                      airline: ticket.airline,
                                      class: ticket.class,
                                      departureDate: editDateFormat(ticket.date),
                                      departureTime: ticket.time,
                                      departureLocation: ticket.depature,
                                      arrivalLocation: ticket.arrival,
                                    });
                                  
                                    setEditTicketId(ticket._id);
                                    setShowModalEditFlight(true);
                                    
                                  }
                            }>
                              <FaEdit />
                          </button>
                        </div>
                        <div className="ticket-row">
                            <div className="block-a">
                              <p>{ticket.airline}</p>
                              <div className="class-type">
                                <span className="label-copy-g">Class</span> {ticket.class}
                              </div>
                            </div>
                            <div className="block-b">
                              <div className="flight-snip">
                                <div className="top">
                                  {ticket.time}
                                </div>
                                <div className="bottom label-copy-g">
                                  {ticket.depature}
                                </div>
                                <div className="tiny-label">FROM</div>
                              </div>
                            </div>
                            <div className="block-c">
                              <div className="plein-area">
                                <div className="plane-item">
                                  <FaPlane />
                                </div>
                              </div>
                            </div>
                            <div className="block-d">
                              <div className="flight-snip">
                                <div className="flight-snip">
                                  <div className="top"></div>
                                  <div className="bottom label-copy-g">
                                    {ticket.arrival}
                                  </div>
                                  <div className="tiny-label">TO</div>
                                </div>
                              </div>
                            </div>
                            <div className="block-e">
                              <Link to={ticket.fileUrl} className="btn btn-main" download={true} target="_blank">Download</Link>
                            </div>
                        </div>
                      </div>
                    ))
                    }
                </div>
              </div>
            )
          }
          {/* Tickets List */}       
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
      </div>
    </div>
  )
}

export default FlightsScreen