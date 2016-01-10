import 'angular';
import {stateGo} from 'redux-ui-router';

const nextState = (current) => {
  switch (current) {
    case 'app.1':
      return 'app.2';
    case 'app.2':
      return 'app.3';
    default:
      return 'app.1';
  }
};

const loadSubject = id => dispatch =>
  setTimeout(() => {
    dispatch({type: 'LOADED_SUBJECT'});
    dispatch({type: 'UPDATE_SUBJECT', data: {afield: 'some server data', id}});
  }, 1000);

const updateSubject = (data, currentState) => dispatch => {
  dispatch({
    type: 'UPDATE_SUBJECT',
    data
  });

  dispatch(stateGo(nextState(currentState)));
};

export default angular.module('app.actions', [])
  .service('actions', ($injector) => ({
    stateGo,
    updateSubject,
    loadSubject
  }))
  .name;
