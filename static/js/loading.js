// static/js/loading.js

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const loadingOverlay = document.getElementById('loading-overlay');

    // 函數：顯示加載動畫
    function showLoading() {
        loadingOverlay.style.display = 'block';
    }

    // 函數：隱藏加載動畫
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }

    // 為導航鏈接添加點擊事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果鏈接是指向外部網站，不顯示加載動畫
            if (this.hostname !== window.location.hostname) {
                return;
            }
            
            showLoading();
            // 不阻止默認行為，讓瀏覽器正常導航到新頁面
        });
    });

    // 處理頁面重新整理
    window.addEventListener('beforeunload', function(event) {
        showLoading();
        // 注意：某些瀏覽器可能會忽略在 beforeunload 中設置的樣式更改
    });

    // 在頁面加載完成時隱藏加載動畫
    window.addEventListener('load', hideLoading);

    // 處理從瀏覽器快取加載頁面的情況（比如使用後退按鈕）
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // 如果頁面是從 bfcache 中加載的，先顯示加載動畫
            showLoading();
            // 然後立即設置一個計時器來隱藏它，模擬頁面加載
            setTimeout(hideLoading, 300);
        }
    });

    // 添加重新整理按鈕事件（如果有的話）
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            showLoading();
            window.location.reload();
        });
    }
});