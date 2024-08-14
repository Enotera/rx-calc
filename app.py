from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quitting')
def quitting():
    return render_template('quitting.html')


if __name__ == '__main__':
    app.run(debug=True)