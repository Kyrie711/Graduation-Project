import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler # type: ignore
from keras.models import Sequential # type: ignore
from keras.layers import LSTM, Dense # type: ignore
# 计算均方误差
import math
from sklearn.metrics import mean_squared_error # type: ignore

import efinance as ef
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)  # 允许跨域请求



@app.route('/stock-data')
def get_stock_data():
    # # 获取参数
    # stock_type = request.args.get('type')

    # 获取参数
    stock_type = request.args.getlist('type')
    
    # 如果只获取到了一个值，将其作为列表处理
    if len(stock_type) == 1 and ',' in stock_type[0]:
        stock_type = stock_type[0].split(',')

    
    # 根据参数决定调用方法
    if stock_type:
        stock_data = ef.stock.get_realtime_quotes(stock_type)
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

@app.route('/recommend')
def get_recommend():
    # 获取参数
    code = request.args.get('code')

    # 获取股票数据
    df = ef.stock.get_history_bill(code)

    # 只保留收盘价和需要的特征列
    df = df[['收盘价', '中单净流入', '主力净流入', '大单净流入', '小单净流入', '超大单净流入']]

    # 数据归一化
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df.values)

    # 定义函数将数据转换成适合LSTM的格式
    def create_dataset(data, time_step):
        X, y = [], []
        for i in range(len(data) - time_step):
            X.append(data[i:(i + time_step), :])
            y.append(data[i + time_step, 0])  # 使用收盘价作为预测目标
        return np.array(X), np.array(y)

    # 设置时间步数
    time_step = 10

    # 创建训练集和测试集
    X, y = create_dataset(scaled_data, time_step)
    X_train, X_test = X[:int(len(X)*0.99)], X[int(len(X)*0.99):]
    y_train, y_test = y[:int(len(y)*0.99)], y[int(len(y)*0.99):]

    # 创建并训练LSTM模型
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=100, batch_size=32)

    # 预测测试集
    predictions = model.predict(X_test)

    # 反归一化
    predictions = scaler.inverse_transform(np.concatenate((predictions, np.zeros((len(predictions), 5))), axis=1))[:, 0]
    y_test = scaler.inverse_transform(np.concatenate((y_test.reshape(-1, 1), np.zeros((len(y_test), 5))), axis=1))[:, 0]

    # 添加预测下一天收盘价的方法
    def predict_next_day(data, model, scaler, time_step):
        # 获取最近的时间步数据
        last_sequence = data[-time_step:]
        last_sequence_scaled = scaler.transform(last_sequence)

        # 重塑数据为适合LSTM输入的形状
        X_last = np.array([last_sequence_scaled])
        
        # 使用模型进行预测
        predicted_scaled = model.predict(X_last)
        
        # 反归一化
        predicted = scaler.inverse_transform(np.concatenate((predicted_scaled, np.zeros((1, 5))), axis=1))[:, 0]
        return predicted[0]

    # 使用最新的数据预测下一天的收盘价
    next_day_prediction = predict_next_day(df.values, model, scaler, time_step)
    print(f"Predicted next day closing price: {next_day_prediction}")
    return jsonify(next_day_prediction)

@app.route('/stock-data-real')
def get_stock_data_real():
    # 获取参数
    code = request.args.get('code')
    # 使用 efinance 获取实时股票数据
    stock_data = ef.stock.get_latest_quote(code)
    
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
    
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

@app.route('/get_quote_history')
def get_quote_history():
    # 获取参数
    code = request.args.get('code')

    # 使用 efinance 获取历史股票数据
    # stock_data = ef.stock.get_quote_history(code)
    # # 获取参数
    # code = request.args.get('code')
    beg = request.args.get('beg')
    end = request.args.get('end')
    klt = request.args.get('klt')
    # # 使用 efinance 获取历史股票数据
    stock_data = ef.stock.get_quote_history(code, beg, end, klt)
    
    # 将获取的股票数据转换成字典格式
    data_dict = stock_data.to_dict(orient='records')
    
    # 返回 JSON 格式的数据给前端
    return jsonify(data_dict)

if __name__ == '__main__':
    # 启动 Flask 应用
    app.run(debug=True)