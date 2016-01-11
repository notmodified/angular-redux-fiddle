
const directiveControllerFactory = mapper =>
  ['$ngRedux', '$scope', 'actions', function($ngRedux, $scope, actions) {
    const unsubscribe = $ngRedux.connect(mapper, actions)(this);
    $scope.$on('$destroy', unsubscribe);
  }];

const baseDirective = {
  scope: {
    'dropdownoptions': '='
  },
  bindToController: true,
  controllerAs: 'vm',
  controller: directiveControllerFactory(state => {
    return {
      currentStateName: state.router.currentState.name,
      subject: Object.assign({}, state.subject)
    }})
};

export const StepOne = () => Object.assign(Object.create(baseDirective), {
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
  `
});

export const StepTwo = () => Object.assign(Object.create(baseDirective), {
  template: `
    <form class="a-form">
      <div class="a-form__field">
        <label for="afield"">a step 2 field</label>
        <input id="afield" type="text" ng-model="vm.subject.step2field">
      </div>
      <div class="a-form__field">
        <label for="anotherfield">step 2 field 2</label>
        <input id="anotherfield" type="text" ng-model="vm.subject.anotherStep2Field">
      </div>
      <div class="a-form__field">
        <label for="dropdownfield">dropdown field</label>
        <select id="dropdownfield"
                ng-model="vm.subject.dropdown"
                ng-options="i as i.label for i in vm.dropdownoptions track by i.id"
        ></select>
      </div>
      <div class="a-form__button-bar">
        <button ng-click="vm.updateSubject(vm.subject, vm.currentStateName)">Next</button>
      </div>
    </form>
  `
});

export const StepThree = () => Object.assign(Object.create(baseDirective), {
  template: `
    <form class="a-form">
      <div class="a-form__field">
        <label for="afield"">a step 3 field</label>
        <input id="afield" type="text" ng-model="vm.subject.step3field">
      </div>
      <div class="a-form__button-bar">
        <button ng-click="vm.updateSubject(vm.subject, vm.currentStateName)">Next</button>
      </div>
    </form>
  `
});

export const StepFour = () => Object.assign(Object.create(baseDirective), {
  template: `
    <form class="a-form">
      <div class="a-form__field">
        <label for="afield"">a step 4 field</label>
        <input id="afield" type="text" ng-model="vm.subject.step4field">
      </div>
      <div class="a-form__button-bar">
        <button ng-click="vm.updateSubject(vm.subject, vm.currentStateName)">Next</button>
      </div>
    </form>
  `
});

export default {StepOne, StepTwo, StepThree, StepFour};
