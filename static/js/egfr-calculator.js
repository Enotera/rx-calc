document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('egfrForm');
    const resultDiv = document.getElementById('result');
    const egfrValueDiv = document.getElementById('egfr-value');
    const egfrInterpretationDiv = document.getElementById('egfr-interpretation');
    const genderButtons = document.querySelectorAll('#genderButtons .btn');
    const genderInput = document.getElementById('genderInput');

    // 性别选择逻辑
    genderButtons.forEach(button => {
        button.addEventListener('click', function() {
            genderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            genderInput.value = this.getAttribute('data-gender');
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const creatinineInput = document.getElementById('creatinine');
        const ageInput = document.getElementById('age');

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
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const creatinine = parseFloat(document.getElementById('creatinine').value);
        const age = parseInt(document.getElementById('age').value);
        const gender = genderInput.value;

        if (!gender) {
            alert('请选择性别');
            return;
        }

        const egfr = calculateEGFR(creatinine, age, gender);
        displayResult(egfr);
    });

    function calculateEGFR(creatinine, age, gender) {
        // MDRD公式
        let egfr = 186 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
        if (gender === 'female') {
            egfr *= 0.742;
        }
        return egfr.toFixed(2);
    }

    function displayResult(egfr) {
        egfrValueDiv.textContent = `估算的 eGFR 值為: ${egfr} (mL/min/1.73m²)`;
        let interpretationText = '';
        let colorClass = '';

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

        egfrInterpretationDiv.textContent = interpretationText;
        resultDiv.className = `mt-4 alert ${colorClass}`;
        resultDiv.style.display = 'block';
        resultDiv.classList.add('fade-in');
        setTimeout(() => resultDiv.classList.remove('fade-in'), 500);
    }
});