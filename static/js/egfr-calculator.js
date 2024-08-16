document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('egfrForm');
    const resultDiv = document.getElementById('result');
    const egfrValueDiv = document.getElementById('egfr-value');
    const egfrInterpretationDiv = document.getElementById('egfr-interpretation');
    const genderButtons = document.querySelectorAll('#genderButtons .btn');
    const genderInput = document.getElementById('genderInput');
    const calculationMethod = document.getElementById('calculationMethod');
    const weightGroup = document.getElementById('weightGroup');

    // 監聽計算方法的變化
    calculationMethod.addEventListener('change', function() {
        if (this.value === 'cg') {
            weightGroup.style.display = 'block';
        } else {
            weightGroup.style.display = 'none';
        }
    });

    // 性別選擇邏輯
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            genderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            genderInput.value = this.getAttribute('data-gender');
        });
    });

    // 輸入範圍限制
    const creatinineInput = document.getElementById('creatinine');
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');

    creatinineInput.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 0) this.value = 0;
        if (value > 30) this.value = 30;
    });

    ageInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 0) this.value = 0;
        if (value > 120) this.value = 120;
    });

    weightInput.addEventListener('input', function() {
        let value = parseFloat(this.value);
        if (value < 0) this.value = 0;
        if (value > 500) this.value = 500;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const creatinine = parseFloat(creatinineInput.value);
        const age = parseInt(ageInput.value);
        const gender = genderInput.value;
        const weight = parseFloat(weightInput.value);
        const method = calculationMethod.value;

        if (!gender) {
            alert('請選擇性別');
            return;
        }

        let egfr;
        switch(method) {
            case 'mdrd':
                egfr = calculateMDRD(creatinine, age, gender);
                break;
            case 'ckd-epi':
                egfr = calculateCKDEPI(creatinine, age, gender);
                break;
            case 'cg':
                if (isNaN(weight)) {
                    alert('請輸入體重');
                    return;
                }
                egfr = calculateCG(creatinine, age, gender, weight);
                break;
        }

        displayResult(egfr, method);
    });

    function calculateMDRD(creatinine, age, gender) {
        let egfr = 186 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
        if (gender === 'female') {
            egfr *= 0.742;
        }
        return egfr.toFixed(2);
    }

    function calculateCKDEPI(creatinine, age, gender) {
        let k = gender === 'female' ? 0.7 : 0.9;
        let a = gender === 'female' ? -0.329 : -0.411;
        let egfr = 141 * Math.min(creatinine/k, 1)**a * Math.max(creatinine/k, 1)**-1.209 * 0.993**age;
        if (gender === 'female') {
            egfr *= 1.018;
        }
        return egfr.toFixed(2);
    }

    function calculateCG(creatinine, age, gender, weight) {
        let egfr = ((140 - age) * weight) / (72 * creatinine);
        if (gender === 'female') {
            egfr *= 0.85;
        }
        return egfr.toFixed(2);
    }

    function displayResult(egfr, method) {
        egfrValueDiv.textContent = `估算的 eGFR 值為: ${egfr} ${method === 'cg' ? '(mL/min)' : '(mL/min/1.73m²)'}`;
        let interpretationText = '';
        let colorClass = '';

        if (method !== 'cg') {
            if (egfr >= 90) {
                interpretationText = '腎功能正常或輕度下降';
                colorClass = 'alert-success';
            } else if (egfr >= 60) {
                interpretationText = '輕度至中度下降';
                colorClass = 'alert-success';
            } else if (egfr >= 30) {
                interpretationText = '中度至重度下降';
                colorClass = 'alert-warning';
            } else if (egfr >= 15) {
                interpretationText = '重度下降';
                colorClass = 'alert-danger';
            } else {
                interpretationText = '腎衰竭';
                colorClass = 'alert-danger';
            }
        } else {
            interpretationText = 'Cockcroft-Gault 公式結果僅供參考，不適用於 CKD 分期。';
            colorClass = 'alert-info';
        }

        egfrInterpretationDiv.textContent = interpretationText;
        resultDiv.className = `mt-4 alert ${colorClass}`;
        resultDiv.style.display = 'block';
        resultDiv.classList.add('fade-in');
        setTimeout(() => resultDiv.classList.remove('fade-in'), 500);
    }
});