import 'angular';
import {stateGo} from 'redux-ui-router';
import validate from './validators';

const nextState = (current) => {
    const steps = ['app.one','app.two','app.three','app.four'];
    return steps[(steps.indexOf(current) + 1) % steps.length];
};

const loadSubject = id => dispatch => {
  const data = {afield: 'some server data ' + id , id};

  setTimeout(() => {
    dispatch({type: 'LOADED_SUBJECT'});
    dispatch({
      type: 'UPDATE_SUBJECT',
      data
    });
    dispatch(validateSubject(data));
  }, 1000);
};

const updateSubject = (data, currentState) => dispatch => {
  dispatch({
    type: 'UPDATE_SUBJECT',
    data
  });

  dispatch(validateSubject(data));
  dispatch(stateGo(nextState(currentState)));
};

const validateSubject = subject => dispatch => {

  const all = validate(subject).errors;
  const required = all.filter(e => e.name === "required");
  const recommended = all.filter(e => e.name === "recommended");

  dispatch({
    type: 'VALIDATION_COMPLETE',
    payload: {required, recommended}
  })
};

const stateChangeSuccess = id => ({type: 'STATE_CHANGE', id});

export default angular.module('app.actions', [])
  .service('actions', ($injector) => ({
    validateSubject,
    stateGo,
    stateChangeSuccess,
    updateSubject,
    loadSubject
  }))
  .name;
