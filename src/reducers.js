
export function subject(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_SUBJECT':
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}

export function subjectLoad(state = {id: undefined, changed: false}, action) {
  switch (action.type) {
    case '@@reduxUiRouter/$stateChangeSuccess':
      if (action.payload &&
          action.payload.currentParams &&
          action.payload.currentParams.id &&
          action.payload.currentParams.id !== state.id
         ) {
        return {id: action.payload.currentParams.id, changed: true};
      } else {
        return state
      }
    case 'LOADED_SUBJECT':
      return Object.assign({}, state, {changed: false});
    default:
      return state
  };
}


export default {subject, subjectLoad};
