var scotchTodo = angular.module('scotchTodo', []);

scotchTodo.controller('mainController',function($scope, $http){

    $scope.formData = {};
    $scope.dates="";
    $scope.items=[];
    $scope.selected=0;
    $scope.d=0,$scope.m=0,$scope.y=0;
    $scope.selectedMonth="";
    $scope.selectedMonthNumber=0;
    $scope.showDetails=true;
    //$scope.display=false;
    $scope.showHide=function(){
        if($scope.showDetails){
            $scope.selectedMonth="";
            $scope.dates="";
            $scope.d=0;
            $scope.currentMonth="";
        }
        $scope.showDetails=!$scope.showDetails;
    }

    $scope.incDate=function(){
        if($scope.d<$scope.endDateMonth)
            $scope.d=$scope.d+1;
    }

    $scope.decDate=function(){
        if($scope.d>1)
            $scope.d=$scope.d-1;
    }

    $scope.selectDate=function(d,m,y,i){
        //alert(i);
        if(!((i>1 && $scope.nextMonthDates.indexOf(d)!=-1) || (i==0 && $scope.lastMonthDates.indexOf(d)!=-1))){
            $scope.d=d;
            $scope.m=m;
            $scope.y=y;    
        }
        
    }

    $scope.closeMonth=function(){
        $scope.selectedMonth="";
        $scope.dates="";
        $scope.currentMonth=$scope.monthFromNumber($scope.m);
    }

    $scope.monthFromNumber=function(num){
        for(var i=0;i<$scope.monthNumbers.length;i++){
            if($scope.monthNumbers[i].monNum===num){
                return $scope.monthNumbers[i].mon;
            }
        }
    }

    $scope.days=['S','M','T','W','T','F','S'];

    function chunk(arr,size) {
        var newArr=[];
        for(var i=0;i<arr.length;i+=size){
            newArr.push(arr.slice(i,i+size));
        }
        return newArr;
    }

    function monthNumber(month,index) {
        var monthObj={
            mon:month,
            monNum:index+1
        }
        return monthObj;
    }

    function fillDates(day,last,lastMonDate) {
        var arrDates=[];
        var lastNumberDays=day-1;
        for(var j=lastMonDate-day+1;j<=lastMonDate;j++){
            arrDates.push(j);
        }
        for(var i=1;i<=last;i++){
            arrDates.push(i);
        }
        var remainingDays=7-(arrDates.length%7);
        //var remDays=35-(arrDates.length);
        if(remainingDays!=7){
            for(var k=1;k<=remainingDays;k++){
                arrDates.push(k);
            }
        }
        return arrDates;
    }
    
    function checkMonth(arrMon,mon) {
        var monthNums='',latestNums='';
        for(var i=0;i<arrMon.length;i++){
            if(arrMon[i].mon==mon){
                monthNums=arrMon[i].monNum;
                break;
            }
        }
        if(monthNums!=1){
            latestNums=Number(monthNums)-1;
        }else{
            latestNums=Number(12);
        }
        var month={
            currentMonth:Number(monthNums),
            lastMonth:latestNums
        }
        return month;
    }


    // $scope.yearsShown=$scope.years.map(function(){
    //             return false;
    //         });

    // when landing on the page, get all todos and show them
    $http.get('/api/getMonthsYear')
        .success(function(data) {
            //$scope.years = data.years;
            $scope.year = 2017;
            $scope.months = data.months;
            $scope.monthNumbers=$scope.months.map(monthNumber);
            $scope.d=Number(data.currDate);
            $scope.m=Number(data.currMonth);
            $scope.y=Number(data.currYear);
            $scope.currentMonth=$scope.monthFromNumber(Number($scope.m));
            $scope.chunkedData=chunk($scope.months,3);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.sendMonth=function(year,mon,topButtons) {
        if(topButtons){
            if(topButtons===1 && mon==="December"){
                year=year-1;
                $scope.year=$scope.year-1;
            }
            else if(topButtons===2 && mon==="January"){
                year=year+1;
                $scope.year=$scope.year+1;
            }
        }
        //alert(year+" "+mon);
        $scope.selectedMonth=mon;
        var month=checkMonth($scope.monthNumbers,mon);
        $scope.selectedMonthNumber=month.currentMonth;
        $scope.nextMonth=$scope.selectedMonthNumber===12 ? $scope.monthFromNumber(1) : $scope.monthFromNumber($scope.selectedMonthNumber+1);
        $scope.previousMonth=$scope.selectedMonthNumber===1 ? $scope.monthFromNumber(12) : $scope.monthFromNumber($scope.selectedMonthNumber-1);
        console.log($scope.nextMonth+" "+$scope.previousMonth);
        
        $scope.startObj={
            years:year,
            currentMonths:month.currentMonth,
            lastMonths:month.lastMonth
        };

        $http.post('/startDay',$scope.startObj)
            .success(function(data) {
                //alert(data);
                $scope.startEnd=data;
                $scope.endDateMonth=data.endDate;
                $scope.fillDates=fillDates(data.startDay,data.endDate,data.lastMonthEndDate);
                //console.log($scope.fillDates);
                $scope.dates=chunk($scope.fillDates,7);
                //console.log($scope.dates);
                var firstRow=$scope.dates[0];
                var lastRow=$scope.dates[$scope.dates.length-1];
                $scope.lastMonthDates=firstRow.filter(function(date){
                    return date>7 && date<32;
                });
                $scope.nextMonthDates=lastRow.filter(function(date){
                    return date<7;
                });
                console.log($scope.lastMonthDates);
                console.log($scope.nextMonthDates);
            })
            .error(function(err) {
                console.log('Error:'+err);
            });
    }
})

scotchTodo.filter('formatMonth',function(){
    return function(num){
        var str=num.toString();
        if(str.length==1)
        str="0"+str;
        return str;
    }
    
})