import 'angular';
import {stateGo} from 'redux-ui-router';

const nextState = (current) => {
    const steps = ['app.one','app.two','app.three','app.four'];
    return steps[(steps.indexOf(current) + 1) % steps.length];
};

const loadSubject = id => dispatch =>
  setTimeout(() => {
    dispatch({type: 'LOADED_SUBJECT'});
    dispatch({
      type: 'UPDATE_SUBJECT',
      data: {afield: 'some server data ' + id , id}
    });
  }, 1000);

const updateSubject = (data, currentState) => dispatch => {
  dispatch({
    type: 'UPDATE_SUBJECT',
    data
  });

  dispatch(stateGo(nextState(currentState)));
};

const stateChangeSuccess = id => ({type: 'STATE_CHANGE', id});

export default angular.module('app.actions', [])
  .service('actions', ($injector) => ({
    stateGo,
    stateChangeSuccess,
    updateSubject,
    loadSubject
  }))
  .name;
