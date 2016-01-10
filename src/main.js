import './main.scss';

import 'angular';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {createStore, combineReducers} from 'redux';
import ngRedux from 'ng-redux';
import uiRouter from 'angular-ui-router';
import {router} from 'redux-ui-router';
import ngReduxUiRouter from 'redux-ui-router';

import actions from './actions';
import * as reducers from './reducers';

const directiveControllerFactory = mapper =>
  ['$ngRedux', '$scope', 'actions', function($ngRedux, $scope, actions) {
    const unsubscribe = $ngRedux.connect(mapper, actions)(this);
    $scope.$on('$destroy', unsubscribe);
  }];

angular.module('app', [ngRedux, uiRouter, ngReduxUiRouter, actions])
  .run(['$ngRedux', '$rootScope', '$stateParams', 'actions',
       function ($ngRedux, $rootScope, $stateParams, actions) {

    $ngRedux.subscribe(() => {
      let state = $ngRedux.getState();
      if (state.subjectLoad.changed) {
        $ngRedux.dispatch(actions.loadSubject(state.subjectLoad.id));
      }
    });

  }])
  .config(($ngReduxProvider, $stateProvider, $urlRouterProvider) => {
    const reducer = combineReducers(Object.assign({router}, reducers));

    $ngReduxProvider.createStoreWith(reducer, [
      'ngUiRouterMiddleware',
      thunk,
      createLogger({collapsed: true})
    ]);

    $urlRouterProvider.otherwise('/app/1/one');

    const tmpl = `
      <ul class="form-steps">
        <li><a href="" ui-sref-active="form-steps--highlight" ui-sref="app.1">1</a></li>
        <li><a href="" ui-sref-active="form-steps--highlight" ui-sref="app.2">2</a></li>
        <li><a href="" ui-sref-active="form-steps--highlight" ui-sref="app.3">3</a></li>
        <li><a href="" ui-sref-active="form-steps--highlight" ui-sref="app.4">4</a></li>
      </ul>

      <div ui-view></div>

      <pre>{{vm | json}}</pre>
    `;
    const root = {
      template: tmpl,
      abstract: true,
      url: '/app/:id'
    };
    const one = {
      url: '/one',
      template: '<step-one/>'
    };
    const two = {
      url: '/two',
      template: '<step-two/>'
    };

    $stateProvider
      .state('app', root)
      .state('app.1', one)
      .state('app.2', two);
  })
  .directive('stepOne', () => ({
    template: `

      <form class="a-form">
        <div class="a-form__field">
          <label for="afield"">a field</label>
          <input id="afield" type="text" ng-model="vm.subject.afield">
        </div>
        <div class="a-form__field">
          <label for="anotherfield"">another field</label>
          <input id="anotherfield" type="text" ng-model="vm.subject.anotherfield">
        </div>
        <div class="a-form__field">
          <label for="morefield"">more field</label>
          <input id="morefield" type="text" ng-model="vm.subject.morefield">
        </div>
        <div class="a-form__button-bar">
          <button ng-click="vm.updateSubject(vm.subject, vm.currentStateName)">Next</button>
        </div>
      </form>
    `,
    bindToController: true,
    controllerAs: 'vm',
    controller: directiveControllerFactory(state => {
      return {
        currentStateName: state.router.currentState.name,
        subject: Object.assign({}, state.subject)
      }})
  }))
  .directive('stepTwo', () => ({
    template: `

      <form class="a-form">
        <div class="a-form__field">
          <label for="afield"">a step 2 field</label>
          <input id="afield" type="text" ng-model="vm.subject.step2field">
        </div>
        <div class="a-form__field">
          <label for="anotherfield"">step 2 field 2</label>
          <input id="anotherfield" type="text" ng-model="vm.subject.anotherStep2Field">
        </div>
        <div class="a-form__button-bar">
          <button ng-click="vm.updateSubject(vm.subject, vm.currentStateName)">Next</button>
        </div>
      </form>
    `,
    bindToController: true,
    controllerAs: 'vm',
    controller: directiveControllerFactory(state => {
      return {
        currentStateName: state.router.currentState.name,
        subject: Object.assign({}, state.subject)
      }})
  }));
