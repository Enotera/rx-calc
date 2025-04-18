$(document).ready(function () {
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
    }).on('changeDate', function (e) {
        $("#DATE").val(e.format());
        calculateDates();
    });

    $('input[name="DAYS"]').on('change', function () {
        calculateDates();
    });

    // 複製按鈕事件處理
    $('#copyResult1Btn').on('click', function () {
        copyToClipboard($('#Result1ROC').val(), $(this));
    });

    $('#copyResult2Btn').on('click', function () {
        copyToClipboard($('#Result2ROC').val(), $(this));
    });

    function copyToClipboard(text, button) {
        if (!text) return;

        // 建立一個臨時的textarea元素
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        const icon = button.find('i');

        try {
            // 執行複製命令
            document.execCommand('copy');

            // 變更按鈕和圖標樣式
            button.addClass('success-state');
            icon.removeClass('bi-copy').addClass('bi-check-lg');

            // 顯示提示
            button.tooltip('dispose').attr('title', '已複製: ' + text).tooltip({
                trigger: 'manual',
                placement: 'top'
            }).tooltip('show');

            // 2秒後恢復原始樣式
            setTimeout(function () {
                button.tooltip('hide');
                button.removeClass('success-state');
                icon.removeClass('bi-check-lg').addClass('bi-copy');
                button.attr('title', '複製民國年月日').tooltip('dispose');

                // 重新初始化tooltip
                button.tooltip({
                    trigger: 'hover',
                    placement: 'top'
                });
            }, 2000);

        } catch (err) {
            console.error('複製失敗:', err);

            // 顯示錯誤提示
            button.tooltip('dispose').attr('title', '複製失敗').tooltip({
                trigger: 'manual',
                placement: 'top'
            }).tooltip('show');

            setTimeout(function () {
                button.tooltip('hide');
                button.attr('title', '複製民國年月日').tooltip({
                    trigger: 'hover',
                    placement: 'top'
                });
            }, 2000);
        } finally {
            // 移除臨時元素
            document.body.removeChild(textarea);
        }
    }

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

            // 儲存民國年月日格式以供複製 - 使用開始日期而非結束日期
            $('#Result1ROC').val(formatDateROC(result1_start));
            $('#Result2ROC').val(formatDateROC(result2_start));
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

    // 新增民國年月日格式化函數
    function formatDateROC(date) {
        const year = date.getFullYear() - 1911; // 西元年轉民國年
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // 初始化日期為今天
    $('#pickyDate').datepicker('setDate', new Date());
    calculateDates();

    // 初始化所有工具提示
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
        placement: 'top'
    });
});