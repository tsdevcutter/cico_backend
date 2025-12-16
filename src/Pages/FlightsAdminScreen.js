import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import * as CONSTANTS from "../CONSTANTS";
import axios from 'axios';
import { FaPlane } from "react-icons/fa";
import { Link } from 'react-router-dom';

function FlightsAdminScreen() {
    const {user}                                                              = useSelector((state) => state.auth);
  
    const [processing, setProcessing]                                         = useState(false);
    const [ticketList, setTicketList]                                         = useState([]);

    const [page, setPage]                                                     = useState(0);
    const [limit, setLimit]                                                   = useState(30);

    const formatDate = (isoDate) => {
      const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
      return new Date(isoDate).toLocaleDateString('en-US', options).toUpperCase();
    };

    useEffect(() => {
        collectListOfTickets();
    },[])

    const collectListOfTickets = async () => {
        try{
            const results = await axios.get(CONSTANTS.API_URL +"tickets/standard-list/v2?page=" + page + "&limit=" + limit, {
              headers: {
                token: 'Bearer ' + user.accessToken,
              },
            });
        
            setTicketList(results.data.tickets);
        }catch(err){
            console.log(err);
        }
   }


  return (
    <div className="card-container">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">All Flights</h2>
          {
            ticketList.length > 0 && (
              <div className="ticket-area">
                <div className="ticket-lines">
                  {
                   ticketList.map((ticket, index) => (
                      <div className="ticket-line" key={index}>
                        <div className="ticket-head">
                          <div className="ticket-date">{formatDate(ticket.date)}</div>
                       
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

export default FlightsAdminScreen