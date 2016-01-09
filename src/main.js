import 'angular';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, combineReducers } from 'redux';
import ngRedux from 'ng-redux';
import uiRouter from 'angular-ui-router';
import { stateGo, router } from 'redux-ui-router';
import ngReduxUiRouter from 'redux-ui-router';

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const actions = {
  inc: () => dispatch => {
    setTimeout(() => dispatch({type: 'INCREMENT'}), 10000);
  },
  dec() { return { type: 'DECREMENT' } },
  stateGo
};

angular.module('app', [ngRedux, uiRouter, ngReduxUiRouter])
  .config(($ngReduxProvider, $stateProvider, $urlRouterProvider) => {
    const reducer = combineReducers({router, counter});

    $ngReduxProvider.createStoreWith(reducer, [
      createLogger({collapsed: true}),
      'ngUiRouterMiddleware',
      thunk
    ]);

    $urlRouterProvider.otherwise('/app1');

    const tmpl = n => `<h1>app${n}</h1><pre>{{ vm | json }}</pre><div a-directive></div>`;
    const url = u => `/app${u}:id`;
    const one = {url: url(1), template: tmpl(1)};
    const two = {url: url(2), template: tmpl(2)};

    $stateProvider
      .state('app1', one)
      .state('app2', two);
  })
  .directive('aDirective', () => ({
    template: `
    <h1>#{{vm.counter}}</h1>
    <button ng-click="vm.inc()">inc</button>
    <button ng-click="vm.dec()">dec</button>
    <button ng-click="vm.stateGo('app1', {id: 1})">app1</button>
    <button ng-click="vm.stateGo('app2', {id: 2})">app2</button>
    `,
    bindToController: true,
    controllerAs: 'vm',
    controller: ['$ngRedux', '$scope', function($ngRedux, $scope) {
      const mapState = (state) => ({
        counter: state.counter,
        router: state.router
      });

      const unsubscribe = $ngRedux.connect(mapState, actions)(this);
      $scope.$on('$destroy', unsubscribe);
    }]
  }));
