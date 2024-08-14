$(document).ready(function(){
    const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    $('#pickyDate').datepicker({
        format: "yyyy/mm/dd",
        weekStart: 0,
        maxViewMode: 2,
        language: "zh-TW",
        todayBtn: "linked",
        daysOfWeekHighlighted: "0,6",
        todayHighlight: true,
        autoclose: true
    }).on('changeDate', function(e) {
        $("#DATE").val(e.format());
        calculateDates();
    });

    $('input[name="DAYS"]').on('change', function() {
        calculateDates();
    });

    function calculateDates() {
        const date = $("#DATE").val();
        const days = parseInt($('input[name="DAYS"]:checked').val());

        if (date && days) {
            const hospiday = new Date(date);
            
            const result1_start = addDays(hospiday, days - 10);
            const result1_end = addDays(hospiday, days);
            const result2_start = addDays(hospiday, days * 2 - 10);
            const result2_end = addDays(hospiday, days * 2);
            const backtime = addDays(hospiday, days * 3);

            $('#Result1').val(`${formatDate(result1_start)} ~ ${formatDate(result1_end)}`);
            $('#Result2').val(`${formatDate(result2_start)} ~ ${formatDate(result2_end)}`);
            $('#BACKTIME').val(`${formatDate(backtime, true)} ${WEEKDAYS[backtime.getDay()]}`);
        }
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function formatDate(date, includeYear = false) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return includeYear ? `${year}年${month}月${day}日` : `${month}/${day}`;
    }

    // 初始化日期為今天
    $('#pickyDate').datepicker('setDate', new Date());
    calculateDates();
});