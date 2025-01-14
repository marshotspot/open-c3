(function () {
    'use strict';
    angular
        .module('openc3')
        .controller('SmallApplicationCreateController', SmallApplicationCreateController);

    function SmallApplicationCreateController( $state, $http, ngTableParams, $uibModalInstance, $scope, resoureceService, $injector, treeid, reload ) {

        var vm = this;

        var toastr = toastr || $injector.get('toastr');

        vm.postdata = { "parameter" : ""};

        vm.cancel = function(){ $uibModalInstance.dismiss()};

        vm.add = function(){
            vm.postdata.jobid = $scope.choiceJob.id
            $http.post('/api/job/smallapplication', vm.postdata ).success(function(data){
                    if(data.stat == true) {
                        vm.cancel();
                        reload();
                    } else { swal({ title: "创建失败!", text: data.info, type:'error' }); }

            });
        };


        $scope.allJobs = [];        // 保存所有项目下的作业

        vm.getAllJob = function () {
            vm.ciinfo = {}

            $http.get('/api/ci/group/' + treeid).success(function(data){
                if(data.stat)
                {
                    angular.forEach(data.data, function (value, key) {
                        vm.ciinfo['_ci_'+value.id+'_'] = value.name
                        vm.ciinfo['_ci_test_'+value.id+'_'] = value.name + ':测试'
                        vm.ciinfo['_ci_online_'+value.id+'_'] = value.name + ':线上'
                    });

                    $http.get('/api/job/jobs/' + treeid).then(
                        function successCallback(response) {
                            if (response.data.stat){
                                $scope.allJobs = response.data.data
                                angular.forEach($scope.allJobs, function (value, key) {
                                    if(vm.ciinfo[value.name])
                                    {
                                        value.alias = '(流水线:' + vm.ciinfo[value.name] +')'
                                    }else{
                                        value.alias = value.name
                                    }
                                });
                            }else {
                                toastr.error( "获取项目机器信息失败："+response.data.info )
                            }
                        },
                        function errorCallback (response ){
                            toastr.error( "获取项目机器信息失败："+response.status )
                        });
                }
                else
                {
                    toastr.error( "加载流水线名称失败:" + data.info )
                }
            });
        };

        vm.getAllJob();
    }
})();

