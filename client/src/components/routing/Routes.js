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
                <Route component={NotFound} />
            </Switch>
        </section>
    )
}

export default Routes