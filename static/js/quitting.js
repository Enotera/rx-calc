$(document).ready(function(){
    $('#pickyDate').datepicker({
        format: "yyyy/mm/dd",
        weekStart: 0,
        maxViewMode: 2,
        language: "zh-TW",
        todayBtn: true,
        daysOfWeekHighlighted: "0,6",
        todayHighlight: true,
        autoclose: true
    }).on('changeDate', SetDate);

    // 初始化時設置今天的日期
    var today = new Date();
    $('#pickyDate').datepicker('setDate', today);
    SetDate();

    function SetDate(){
        var value = $('#pickyDate').datepicker('getFormattedDate');
        $("#DATE").val(value);
        PLUSUP();
    }

    function dateToString(d){
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('zh-TW', options);
    }

    function PLUSUP(){
        var TODAY = new Date();
        var FIRST_VISIT = new Date($("#DATE").val());
        var NEXT = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 14);
        var LAST = new Date(FIRST_VISIT.getFullYear(), FIRST_VISIT.getMonth(), FIRST_VISIT.getDate() + 90 - 1);

        if (LAST - NEXT < 0){
            $("#BACK_DAY").val(dateToString(LAST));
        } else {
            $("#BACK_DAY").val(dateToString(NEXT));
        }

        if(TODAY.getFullYear() != LAST.getFullYear()){
            LAST = new Date(TODAY.getFullYear(), 11, 31);
        }
        
        $("#LAST_DAY").val(dateToString(LAST));
    }
});