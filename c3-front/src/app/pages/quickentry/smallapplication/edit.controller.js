(function() {
    'use strict';

    angular
        .module('openc3')
        .controller('SmallApplicationEditController', SmallApplicationEditController);

    /** @ngInject */
    function SmallApplicationEditController( $state, $http, $scope, $uibModal, ngTableParams ) {

        var vm = this;
        vm.treeid = $state.params.treeid;

        vm.reload = function () {
            vm.loadover = false
            $http.get('/api/job/smallapplication').then(
                function successCallback(response) {
                    if (response.data.stat){
                        vm.dataTable = new ngTableParams({count:100}, {counts:[],data:response.data.data});
                        vm.loadover = true
                    }else {
                        swal('获取信息失败', response.data.info, 'error' );
                    }
                },
                function errorCallback (response ){
                    swal('获取信息失败', response.status, 'error' );
                });
        };

        vm.reload()

        vm.createSmallApplication = function () {
            $uibModal.open({
                templateUrl: 'app/pages/quickentry/smallapplication/create.html',
                controller: 'SmallApplicationCreateController',
                controllerAs: 'smallapplicationcreate',
                backdrop: 'static',
                size: 'lg',
                keyboard: false,
                bindToController: true,
                resolve: {
                    treeid: function () { return vm.treeid},
                    reload : function () { return vm.reload}
                }
            });
        };

       vm.deleteSmallApplication = function(id) {
          swal({
            title: "删除轻应用",
            text: "删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            closeOnConfirm: true
          }, function(){
            $http.delete('/api/job/smallapplication/' + id ).success(function(data){
                if(data.stat == true) {
                    swal({ title: "删除成功!", type:'success' });
                    vm.reload();
                } else {
                    swal({ title: "删除失败!", text: data.info, type:'error' });
                }
            });
          });
        }

    }

})();
