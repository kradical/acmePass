(function () {
    'use strict';

    angular
        .module('acmeApp')
        .controller('ACMEPassPwdGenController', ACMEPassPwdGenController);

    ACMEPassPwdGenController.$inject = ['$timeout', '$scope', '$uibModalInstance'];

    function ACMEPassPwdGenController($timeout, $scope, $uibModalInstance) {
        var vm = this;

        vm.clear = clear;
        vm.generate = generate;
        vm.save = save;
        vm.checkImpossible = checkImpossible;

        vm.genOptions = {
            length: 8,
            lower: true,
            upper: true,
            digits: true,
            special: true,
            repetition: false
        };

        vm.chars = {
            lower: "qwertyuiopasdfghjklzxcvbnm",
            upper: "QWERTYUIOPASDFGHJKLZXCVBNM",
            digits: "0123456789",
            special: "!@#$%-_"
        };

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function generate() {
            let possible = "";
            possible += vm.genOptions.lower ? vm.chars.lower : ""
            possible += vm.genOptions.upper ? vm.chars.upper : ""
            possible += vm.genOptions.digits ? vm.chars.digits : ""
            possible += vm.genOptions.special ? vm.chars.special : ""

            const notEnoughCharacters = vm.genOptions.repetition && vm.genOptions.length > possible.length;
            const zeroCharacters = possible.length === 0;

            if (zeroCharacters || notEnoughCharacters) {
                console.log("error");
                return;
            }

            vm.password = "";

            for (let i = 0; i < vm.genOptions.length; i++) {
                const position = Math.floor(Math.random() * possible.length);
                const newChar = possible[position];
                vm.password += newChar;

                if (vm.genOptions.repetition) {
                    possible = possible.split(newChar).join('');
                }
            }
        }

        function checkImpossible() {
            let possible = "";
            possible += vm.genOptions.lower ? vm.chars.lower : ""
            possible += vm.genOptions.upper ? vm.chars.upper : ""
            possible += vm.genOptions.digits ? vm.chars.digits : ""
            possible += vm.genOptions.special ? vm.chars.special : ""

            const notEnoughCharacters = vm.genOptions.repetition && vm.genOptions.length > possible.length;
            const zeroCharacters = possible.length === 0;

            return zeroCharacters || notEnoughCharacters;
        }


        function save() {
            $scope.$emit('acmeApp:ACMEPassPwdGen', vm.password);
            $uibModalInstance.close(vm.password);
        }
    }
})();