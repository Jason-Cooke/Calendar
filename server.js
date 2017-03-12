    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var moment = require('moment');
    moment().format();

    // configuration =================

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users                              // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================


    function getMonthDateRange(year,month,last,next) {
        //var month=moment().month(months).format("M");
        var startDate=moment([year,month-1]);
        var startDate2='';
        if(last==12){
            startDate2=moment([year-1,last-1]);    
        }else{
            startDate2=moment([year,last-1]);    
        }
        
        //clone the value from .endOf
        var endDates=moment(startDate).endOf('month');
        var endDate2=moment(startDate2).endOf('month');
        
        //console.log(startDate.toDate());
        //console.log(endDate.toDate());
        return { 
            startDay:startDate.weekday(),
            endDate:endDates.format('D'),
            lastMonthEndDate:endDate2.format('D')
        };

    }

    app.get('/api/getMonthsYear',function(req,res) {

        var arrYears={
            //years:[2017],
            months:['January','February','March','April','May','June','July','August',
            'September','October','November','December'],
            currDate:moment().format('D'),
            currMonth:moment().format('M'),
            currYear:moment().format('Y')
        };
        //console.log( moment().startOf('day').fromNow());
        //var check=getMonthDateRange(2014,9);
        res.json(arrYears);
    });

    app.get('*',function(req,res) {
        res.sendfile('./public/index.html');
    });

    app.post('/startDay',function(req,res) {
        var year=req.body.years;
        var month=req.body.currentMonths;
        var lastMonth=req.body.lastMonths;
        var nextMonth=req.body.nextMonths;
        var startEnd=getMonthDateRange(year,month,lastMonth,nextMonth);
        //console.log(startEnd);
        res.json(startEnd);
        
    });



    app.listen(8085);
    console.log("App listening on port 8085");