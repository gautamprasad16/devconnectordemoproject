import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const DashboardAction = () => {
    return (
        <Fragment>
            <div className="dash-buttons">
                <Link to="/editProfile" className="btn btn-light">
                    <i className="fas fa-user-circle text-primary"></i> Edit Profile
                </Link>
                <Link to="/addExperience" className="btn btn-light">
                    <i className="fab fa-black-tie text-primary"></i> Add Experience
                </Link>
                <Link to="/addEducation" className="btn btn-light">
                    <i className="fas fa-graduation-cap text-primary"></i> Add Education
                </Link>
            </div>
        </Fragment>
    )
}

export default DashboardAction;