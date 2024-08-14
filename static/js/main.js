$(document).ready(function(){
    $('#pickyDate').datepicker({
        format: "yyyy/mm/dd",
        weekStart: 0,
        maxViewMode: 2,
        language: "zh-TW",
        todayBtn: true,
        daysOfWeekHighlighted: "0,6",
        todayHighlight: true
    }).on('changeDate', function(e) {
        $("#DATE").val(e.format());
        calculateDates();
    });

    $('.btn-group').on('click', '.btn', function() {
        $(this).addClass('active').siblings().removeClass('active');
        calculateDates();
    });

    function calculateDates() {
        var date = $("#DATE").val();
        var days = $('.btn-group > .btn.active input').val();

        if (date && days) {
            $.ajax({
                url: '/calculate',
                method: 'POST',
                data: { date: date, days: days },
                success: function(response) {
                    $('#Result1').val(response.result1);
                    $('#Result2').val(response.result2);
                    $('#BACKTIME').val(response.backtime);
                }
            });
        }
    }
});