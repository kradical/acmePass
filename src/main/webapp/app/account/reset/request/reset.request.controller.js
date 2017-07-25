(function () {
	'use strict';

	angular
		.module('acmeApp')
		.controller('RequestResetController', RequestResetController);

	RequestResetController.$inject = ['$timeout', 'Auth'];

	function RequestResetController($timeout, Auth) {
		var vm = this;

		vm.error = null;
		vm.errorEmailNotExists = null;
		vm.requestReset = requestReset;
		vm.resetAccount = {};
		vm.success = null;

		$timeout(function () {
			angular.element('#email').focus();
		});

		function requestReset() {

			vm.error = null;
			vm.errorEmailNotExists = null;

			Auth.resetPasswordInit(vm.resetAccount.email).then(function () {
				vm.success = 'OK';
			}).catch(function (response) {
				vm.success = 'OK';
			});
		}
	}
})();
