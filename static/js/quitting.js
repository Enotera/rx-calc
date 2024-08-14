$(document).ready(function(){
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
        calculateQuittingDates();
    });

    // 初始化時設置今天的日期
    var today = new Date();
    $('#pickyDate').datepicker('update', today);
    $("#DATE").val($('#pickyDate').datepicker('getFormattedDate'));
    calculateQuittingDates();

    function calculateQuittingDates() {
        var date = $("#DATE").val();
        
        $.ajax({
            url: '/calculate_quitting',
            method: 'POST',
            data: { date: date },
            success: function(response) {
                $('#BACK_DAY').val(response.next_visit);
                $('#LAST_DAY').val(response.last_visit);
            },
            error: function(xhr, status, error) {
                console.error("An error occurred: " + error);
                alert("計算日期時發生錯誤,請稍後再試。");
            }
        });
    }
});