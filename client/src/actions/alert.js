import { SET_ALERT, REMOVE_ALERT } from './actionsConst';
import uuid from 'uuid';

export const setAlert = (msg, alertType, timeOut = 4000) => dispatch => {
    const id = uuid.v4();

    dispatch({
        type: SET_ALERT,
        payload: {
            id,
            msg,
            alertType
        }
    });


    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeOut)
}