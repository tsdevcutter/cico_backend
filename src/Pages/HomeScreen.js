import React from 'react'
import { logout } from '../reduxAuth/authSlice';
import { useDispatch } from 'react-redux';

function HomeScreen() {
  const dispatch                                                      = useDispatch();
  return (
    <div className="card-container">
      <div className="card">
        HomeScreen

      </div>
    </div>
  )
}

export default HomeScreen