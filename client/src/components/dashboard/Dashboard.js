import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardAction from './DashboardAction';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);
    return (
        loading && profile == null ? <Spinner /> :
            <Fragment>
                <h1 className="large text-primary">Dashboard</h1>
                <p className="lead"><i className="fas fa-user"> Welcome {user && user.name}</i></p>
                {profile != null ? <Fragment><DashboardAction /></Fragment> :
                    <Fragment>
                        <p>
                            You have not yet setup a profile, please add some info.
                        </p>
                        <Link to='/createProfile' className='btn btn-primary my-1'>Create Profile</Link>
                    </Fragment>
                }
            </Fragment>
    )
};

Dashboard.propsTypes = {
    getCurrentProfile: PropsTypes.func.isRequired,
    auth: PropsTypes.object.isRequired,
    profile: PropsTypes.object.isRequired
};

const mapsStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapsStateToProps, { getCurrentProfile })(Dashboard);