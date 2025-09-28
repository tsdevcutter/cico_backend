import axios from 'axios';
import React, { useEffect, useState } from 'react'
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';

function AdminsSettings({user}) {

  const [addUser, setAddUser]                       = useState(false);
  const [isLoading, setIsLoading]                   = useState(false);

  const [userAdmins, setUserAdmins]                 = useState([]);

  const [formAdmin, setFormAdmin]                   = useState({
        name: "",
        surname: "",
        email: "",
        phone: "",
        jobTitle: "",
        idNumber: "",
        dateOfBirth: "",
        password: "password123"
  });

  useEffect(() => {
    collectSuperUsers();
  },[])

  const collectSuperUsers = async () => {
    try{
      const results = await axios.get(CONSTANTS.API_URL +"users/admins/users/v1", {
        headers: {
          token : "Bearer " + user.accessToken
        }
      });
      
      setUserAdmins(results.data);
    }catch(err){
      console.log(err);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormAdmin((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddingAdmin = async (e) => {
    e.preventDefault();

    try{
      setIsLoading(true);
      
      const results = await axios.post(CONSTANTS.API_URL +"auth/register", formAdmin);
            
      setIsLoading(false);
      if(results.status === 200){
        toast.success("User created");
        setFormAdmin({
              name: "",
              surname: "",
              email: "",
              phone: "",
              jobTitle: "",
              idNumber: "",
              dateOfBirth: "",
              password: "password123"
          });
      }

    }catch(err){
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <div className="widget-admin">
      <div className="row-blow">
        <button
          onClick={() => setAddUser(!addUser)}
          className={'btn btn-stripe-active' + addUser}>
            {
              addUser ? 'View Admins' : 'Add Admin'
            }
        </button>
      </div>
      {
        addUser ? 
        <div className="card-block">
          <h4>Add Admins</h4>
          <form onSubmit={handleAddingAdmin}>
            <div className="form-group">
              <div className="label">Name*:</div>
              <input
                  type="text"
                  name="name"
                  value={formAdmin.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Name"
                  required
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">Surname*:</div>
              <input
                  type="text"
                  name="surname"
                  value={formAdmin.surname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Surname"
                  required
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">Email*:</div>
              <input
                  type="text"
                  name="email"
                  value={formAdmin.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Email"
                  required
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">Phone:</div>
              <input
                  type="text"
                  name="phone"
                  value={formAdmin.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Phone"
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">Job Title:</div>
              <input
                  type="text"
                  name="jobTitle"
                  value={formAdmin.jobTitle}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Job Title"
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">ID Number*:</div>
              <input
                  type="text"
                  name="idNumber"
                  value={formAdmin.idNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter id Number"
                  required
                />
            </div>
            <div className="form-group mt-2">
              <div className="label">Date of birth*:</div>
              <input
                  type="date"
                  name="dateOfBirth"
                  value={formAdmin.dateOfBirth}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter date Of Birth"
                  required
                />
            </div>
            <div className="form-group mt-2">
              <button className="btn btn-main" disabled={isLoading}>
                  {isLoading ? "..." : "Submit"}                
              </button>
            </div>
          </form>
        </div>
        :
        <div className="card-block">
          <h4>Admins</h4>
          {
            userAdmins.length > 0 && (
              <table className="table table-striped">
                <tbody>
                  {
                    userAdmins.map((admin, index ) => {
                      return  <tr key={index}>
                                <td>{admin.name}</td>  
                                <td>{admin.surname}</td>
                                <td>{admin.jobTitle}</td>
                                <td>{admin.email}</td>  
                                <td>{admin.phone}</td>
                                <td>{admin.idNumber}</td>
                              </tr>
                    })
                  }
                </tbody>
              </table>
            )
          }
        </div>
      }
    </div>
  )
}

export default AdminsSettings