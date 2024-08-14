from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta
import locale

app = Flask(__name__)

# 設置地區為繁體中文
locale.setlocale(locale.LC_TIME, 'zh_TW.UTF-8')

WEEKDAYS = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    date = request.form['date']
    days = int(request.form['days'])
    
    hospiday = datetime.strptime(date, '%Y/%m/%d')
    
    result1_start = hospiday + timedelta(days=days-10)
    result1_end = hospiday + timedelta(days=days)
    result2_start = hospiday + timedelta(days=days*2-10)
    result2_end = hospiday + timedelta(days=days*2)
    backtime = hospiday + timedelta(days=days*3)
    
    weekday = WEEKDAYS[backtime.weekday()]
    
    return jsonify({
        'result1': f"{result1_start.strftime('%m/%d')} ~ {result1_end.strftime('%m/%d')}",
        'result2': f"{result2_start.strftime('%m/%d')} ~ {result2_end.strftime('%m/%d')}",
        'backtime': f"{backtime.strftime('%Y年%m月%d日')} {weekday}"
    })

@app.route('/quitting')
def quitting():
    return render_template('quitting.html')

@app.route('/calculate_quitting', methods=['POST'])
def calculate_quitting():
    first_visit = datetime.strptime(request.form['date'], '%Y/%m/%d')
    today = datetime.now()
    
    next_visit = today + timedelta(days=14)
    last_visit = first_visit + timedelta(days=90 - 1)
    
    if last_visit < next_visit:
        next_visit = last_visit
    
    if today.year != last_visit.year:
        last_visit = datetime(today.year, 12, 31)
    
    return jsonify({
        'next_visit': format_date(next_visit),
        'last_visit': format_date(last_visit)
    })

def format_date(date):
    return f"{date.strftime('%Y年%m月%d日')} {WEEKDAYS[date.weekday()]}"

if __name__ == '__main__':
    app.run(debug=True)