import React from 'react';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import CreateProfile from '../profile/CreateProfile';
import NotFound from '../layout/NotFound';
import PrivateRoute from './PrivateRoute';
import { Route, Switch } from 'react-router-dom';
import EditProfile from '../profile/EditProfile';
import AddExperience from '../profile/AddExperience';
import AddEducation from '../profile/AddEducation';

const Routes = () => {
    return (
        <section className="container">
            <Alert />
            <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute exact path='/createProfile' component={CreateProfile} />
                <PrivateRoute exact path='/editProfile' component={EditProfile} />
                <PrivateRoute exact path='/addExperience' component={AddExperience} />
                <PrivateRoute exact path='/addEducation' component={AddEducation} />
                <Route component={NotFound} />
            </Switch>
        </section>
    )
}

export default Routes