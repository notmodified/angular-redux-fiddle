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

import {StepOne, StepTwo, StepThree, StepFour} from './steps';
import rootLayout from './root.layout';

angular.module('app', [ngRedux, uiRouter, ngReduxUiRouter, actions])
  .config(($ngReduxProvider, $stateProvider, $urlRouterProvider) => {
    const reducer = combineReducers(Object.assign({router}, reducers));

    $ngReduxProvider.createStoreWith(reducer, [
      'ngUiRouterMiddleware',
      thunk,
      createLogger({collapsed: true})
    ]);

    $urlRouterProvider.otherwise('/app/1/one');

    const root = {
      template: rootLayout,
      abstract: true,
      resolve: {
        dropdownoptions: () => ([
          { id: 1, label: "one" },
          { id: 2, label: "two" },
          { id: 3, label: "three" },
          { id: 4, label: "four" },
          { id: 5, label: "five" },
        ])
      },
      url: '/app/:id'
    };
    const stepFactory = (name) => ({
      url: `/${name}`,
      template: `<step-${name} dropdownoptions="vm.dropdownoptions"/>`,
      controllerAs: 'vm',
      controller: ['dropdownoptions', function(dropdownoptions) {
        this.dropdownoptions = dropdownoptions;
      }]
    });

    $stateProvider
      .state('app', root);

    ['one', 'two', 'three', 'four'].forEach(
      s => $stateProvider.state(`app.${s}`, stepFactory(s))
    )

  })
  .run(['$ngRedux', '$rootScope', '$stateParams', 'actions',
       function ($ngRedux, $rootScope, $stateParams, actions) {

    $ngRedux.subscribe(() => {
      let state = $ngRedux.getState();
      if (state.subjectLoad.changed) {
        $ngRedux.dispatch(actions.loadSubject(state.subjectLoad.id));
      }
    });

    $rootScope.$on('$stateChangeSuccess', () => {
      $ngRedux.dispatch(actions.stateChangeSuccess($stateParams.id));
    });

  }])
  .directive('stepOne', StepOne)
  .directive('stepTwo', StepTwo)
  .directive('stepThree', StepThree)
  .directive('stepFour', StepFour)
  ;
