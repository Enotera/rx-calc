from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quitting')
def quitting():
    return render_template('quitting.html')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'manifest.json')

@app.route('/egfr')
def egfr():
    return render_template('egfr.html')


if __name__ == '__main__':
    app.run(debug=True)