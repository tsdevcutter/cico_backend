import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import AdminsSettings from '../Components/widget/AdminsSettings';
import CompanySettings from '../Components/widget/CompanySettings';
import CompanyAddSettings from '../Components/widget/CompanyAddSettings';

function SettingsScreen() {
    const {user}                            = useSelector((state) => state.auth);
    const [activeTab, setActiveTab]         = useState("admins");
    
    const renderTab = () => {
        switch (activeTab) {
            case "admins":
                return <AdminsSettings user={user}  />;
            case "company":
                return <CompanySettings user={user}  />;
            case "companyadd":
                return <CompanyAddSettings user={user}  />;
            default:
                return null;
        }
    };

  return (
    <div className="card-container">
      <div className="card">
        <div className="flexme settings-box">
              <div className="nav-sides-set">
                <ul className="nav nav-side">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "admins" ? "active" : ""}`}
                        onClick={() => setActiveTab("admins")}
                      >
                        Administrators
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "company" ? "active" : ""}`}
                        onClick={() => setActiveTab("company")}
                      >
                        Companies
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "companyadd" ? "active" : ""}`}
                        onClick={() => setActiveTab("companyadd")}
                      >
                        Add Company
                      </button>
                    </li>
                   
                </ul>
              </div>
              <div className="body-sides-set">
                 {/* Tab Content */}
                  <div className="mt-3">
                    {renderTab()}
                  </div>   
              </div>
            </div>
        </div>  
    </div>
  )
}

export default SettingsScreen