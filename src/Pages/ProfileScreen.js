import React from 'react'
import { useSelector } from 'react-redux';

function ProfileScreen() {
   const {user}                                                        = useSelector((state) => state.auth);
   
  return (
    <div className="card-container">
      <div className="card">ProfileScreen
       <div className="row">
        <div className="col-md-9">
           <table className="table table-striped mt-3">
            <tbody>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>Surname</td>
                <td>:</td>
                <td>{user.surname}</td>
              </tr>
              <tr>
                <td>Employee Number</td>
                <td>:</td>
                <td>{user.empnumber}</td>
              </tr>
              <tr>
                <td>Company Number</td>
                <td>:</td>
                <td>{user.companynumber}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>:</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>:</td>
                <td>{user.phone}</td>
              </tr>
              <tr>
                <td>Title</td>
                <td>:</td>
                <td>{user.jobTitle}</td>
              </tr>
              <tr>
                <td>ID</td>
                <td>:</td>
                <td>{user.idNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-3">
          <div className="profile-extras">
              <div className="profile-image"></div>
              <div className="edit-block"></div>
          </div>
        </div>
       </div>
      </div>
    </div>
  )
}

export default ProfileScreen