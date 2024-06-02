import efinance as ef
from flask_cors import CORS
from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route('/stock-data')
def get_stock_data():
    # 获取参数
    stock_type = request.args.get('type')
    
    # 根据参数决定调用方法
    if stock_type:
        stock_data = ef.stock.get_realtime_quotes([stock_type])
    else:
        stock_data = ef.stock.get_realtime_quotes()
    
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
    
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

@app.route('/billboard')
def get_billboard():
    # 获取参数
    start_date = request.args.get('date')
    end_date = request.args.get('date')
    # 根据参数决定调用方法
    if start_date:
        stock_data = ef.stock.get_daily_billboard(start_date, end_date)
    else:
        stock_data = ef.stock.get_daily_billboard()
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
    
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

@app.route('/baseInfo')
def get_baseInfo():
    # 获取参数
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400

    try:
        # 获取股票数据
        stock_data = ef.stock.get_base_info(code)
        
        # 将获取的股票数据转换成字典格式
        if isinstance(stock_data, pd.Series):
            data_dict = stock_data.to_dict()
        else:
            data_dict = stock_data.to_dict(orient='records')
        
        # 返回 JSON 格式的数据给前端
        return jsonify(data_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/history-bill')
def get_history_bill():
    # 获取参数
    code = request.args.get('code')

    # 获取股票数据
    stock_data = ef.stock.get_history_bill(code)
    
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
        
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

@app.route('/stock-data-detail')
def get_stock_data_detail():
    # 使用 efinance 获取实时股票数据
    stock_data = ef.stock.get_latest_quote('601318')
    
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
    
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

if __name__ == '__main__':
    # 启动 Flask 应用
    app.run(debug=True)
