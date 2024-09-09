document.addEventListener('DOMContentLoaded', function() {
    const xmlInput = document.getElementById('xmlInput');
    const convertButton = document.getElementById('convertButton');
    const result = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    // 初始狀態下禁用複製按鈕
    copyButton.disabled = true;

    convertButton.addEventListener('click', function() {
        const xmlData = xmlInput.value;
        try {
            const convertedString = convertXmlToString(xmlData);
            result.value = convertedString;
            copyButton.disabled = false;
        } catch (error) {
            console.error('Error:', error);
            result.value = '轉換過程中發生錯誤：' + error.message;
            copyButton.disabled = true;
        }
    });

    copyButton.addEventListener('click', function() {
        result.select();
        document.execCommand('copy');
        showToast('結果已複製到剪貼板');
    });

    function convertXmlToString(xmlData) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");

        const case_elem = xmlDoc.documentElement;
        const person = xmlDoc.querySelector('person');
        const insurance = xmlDoc.querySelector('insurance');
        const study = xmlDoc.querySelector('study');
        const diseases = Array.from(xmlDoc.querySelectorAll('diseases item')).map(item => item.getAttribute('code'));
        const orders = xmlDoc.querySelectorAll('orders item');
        const continous_prescription = xmlDoc.querySelector('continous_prescription');

        // 確定處方類型
        let prescriptionType = '1'; // 默認為一般處方
        if (continous_prescription) {
            const count = continous_prescription.getAttribute('count');
            const total = continous_prescription.getAttribute('total');
            if (count === '1' && total) {
                prescriptionType = '2'; // 連續處方
            }
        }

        let output = `${case_elem.getAttribute('from')};${prescriptionType};${insurance.getAttribute('case_type')};${person.getAttribute('name')};`;
        output += `${person.getAttribute('id')};${person.getAttribute('birth')};${study.getAttribute('subject')};`;
        output += `${case_elem.getAttribute('date')};${insurance.getAttribute('serial_code')};`;
        output += `${continous_prescription ? continous_prescription.getAttribute('total') : ''};`;
        output += `${insurance.getAttribute('copayment_code')};`;
        output += diseases.join('#') + '#;';
        output += `${case_elem.getAttribute('from')};;${orders[0].getAttribute('id')};`;

        for (let order of orders) {
            output += `${order.getAttribute('divided_dose')};${order.getAttribute('freq')};`;
            output += `${order.getAttribute('way')};${order.getAttribute('total_dose')};`;
        }

        return output.slice(0, -1); // 移除最後一個分號
    }

});