from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # 允许跨域请求


@app.route('/stock-data')
def get_stock_data():
    start = request.args.get('start')
    end = request.args.get('end')
    symbol = request.args.get('symbol')
    # 使用 yfinance 获取股票数据
    data = yf.download(symbol, start=start, end=end)

    
    # 将 Timestamp 类型的索引转换为日期字符串，并保留小数点后两位
    data.index = data.index.strftime('%Y-%m-%d')
    
    # 将 DataFrame 转换为字典
    data_dict = data.to_dict(orient='index')
    
    # 转换为最终的格式
    formatted_data = [{'Symbol': symbol, 'Date': key,
                       'Close': round(value['Close'], 2),} 
                       for key, value in data_dict.items()]
    
    # 将处理后的数据返回给前端
    return jsonify(formatted_data)

@app.route('/stock-data-compare')
def get_stock_data_compare():
    start = request.args.get('start')
    end = request.args.get('end')
    symbol1 = request.args.get('symbol1')
    symbol2 = request.args.get('symbol2')
    
    # 使用 yfinance 获取第一个股票的数据
    data1 = yf.download(symbol1, start=start, end=end)
    
    # 使用 yfinance 获取第二个股票的数据
    data2 = yf.download(symbol2, start=start, end=end)
    
    # 将 Timestamp 类型的索引转换为日期字符串，并保留小数点后两位
    data1.index = data1.index.strftime('%Y-%m-%d')
    data2.index = data2.index.strftime('%Y-%m-%d')
    
    # 将 DataFrame 转换为字典
    data_dict1 = data1.to_dict(orient='index')
    data_dict2 = data2.to_dict(orient='index')
    
    # 转换为最终的格式
    formatted_data1 = [{'Symbol': symbol1, 'Date': key,
                       'Close': round(value['Close'], 2)} 
                       for key, value in data_dict1.items()]
    
    formatted_data2 = [{'Symbol': symbol2, 'Date': key,
                       'Close': round(value['Close'], 2)} 
                       for key, value in data_dict2.items()]
    
    # 合并两个股票数据到一个数组中
    combined_data = formatted_data1 + formatted_data2
    
    # 将处理后的数据返回给前端
    return jsonify(combined_data)

if __name__ == '__main__':
    # 启动 Flask 应用
    app.run(debug=True)
