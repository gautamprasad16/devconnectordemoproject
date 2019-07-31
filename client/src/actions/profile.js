import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT } from "./actionsConst";

//Get Current users Profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

//Create or update user profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(
            setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
        );
        if (!edit) {
            history.push('/dashboard');
        }
    } catch (erro) {
        const errors = erro.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: erro.response.statusText, status: erro.response.status }
        });
    }
}

/**
 * Add Experience
 */
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(
            setAlert('Experience Added', 'success')
        );
        history.push('/dashboard');
    } catch (erro) {
        const errors = erro.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: erro.response.statusText, status: erro.response.status }
        });
    }
}


/**
 * Add Education
 */
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(
            setAlert('Education Added', 'success')
        );
        history.push('/dashboard');
    } catch (erro) {
        const errors = erro.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: erro.response.statusText, status: erro.response.status }
        });
    }
}

/**
 * Delete Experience
 */
export const deleteExperience = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(
            setAlert('Experience Deleted', 'success')
        )
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}


/**
 * Delete Education
 */
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(
            setAlert('Education Deleted', 'success')
        )
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

/**
 * Delete Account
 */
export const deleteAccount = () => async dispatch => {
    if (window.confirm("Are you sure? This cannot be undone!!"))
        try {
            const res = await axios.delete(`/api/profile`);

            dispatch({
                type: CLEAR_PROFILE
            })

            dispatch({
                type: DELETE_ACCOUNT
            })

            dispatch('Your account has been deleted!!!');
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
        }
} 