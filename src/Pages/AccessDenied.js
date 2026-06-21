import React from 'react'
import { MdOutlineDoNotDisturbOn } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reduxAuth/authSlice';
import { useNavigate } from 'react-router-dom';

function AccessDenied() {
   const {user}                                                  = useSelector((state) => state.auth);
  const navigate                                                      = useNavigate();
  const dispatch                                                      = useDispatch();
  
  const handleGoHome = () => {
       dispatch(logout());
        navigate("/");
  };

  return (
    <div className="access-denied-container d-flex align-items-center justify-content-center p-3">
      <div className="card-custom text-center JSON">
        
        {/* Icon Header */}
        <div className="icon-wrapper mx-auto">
          <MdOutlineDoNotDisturbOn size={48} />
        </div>

        {/* Text Content */}
        <h1 className="fw-bold mb-2" style={{ color: 'var(--black-color)' }}>
          Access Denied
        </h1>
        <h5 className="text-muted mb-3">Error 403</h5>
        
        <p className="mb-4 text-secondary">
          Oops! You don't have permission to view this page. Please check your credentials or contact an administrator if you think this is a mistake.
        </p>

        {/* Action Buttons */}
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
         
          <button 
            onClick={handleGoHome}
            className="btn btn-main px-4 py-2"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default AccessDenied