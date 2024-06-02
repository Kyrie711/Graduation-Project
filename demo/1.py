import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import LSTM, Dense # type: ignore

# 将数据转换为 DataFrame 格式
data = [
  {
    "Close": 173.5,
    "Date": "2023-05-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.77,
    "Date": "2023-05-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.56,
    "Date": "2023-05-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.75,
    "Date": "2023-05-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.57,
    "Date": "2023-05-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.07,
    "Date": "2023-05-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.07,
    "Date": "2023-05-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.69,
    "Date": "2023-05-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.05,
    "Date": "2023-05-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.16,
    "Date": "2023-05-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 174.2,
    "Date": "2023-05-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.56,
    "Date": "2023-05-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.84,
    "Date": "2023-05-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.99,
    "Date": "2023-05-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.43,
    "Date": "2023-05-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.3,
    "Date": "2023-05-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.25,
    "Date": "2023-05-31",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.09,
    "Date": "2023-06-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.95,
    "Date": "2023-06-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.58,
    "Date": "2023-06-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.21,
    "Date": "2023-06-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.82,
    "Date": "2023-06-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.57,
    "Date": "2023-06-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.96,
    "Date": "2023-06-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.79,
    "Date": "2023-06-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.31,
    "Date": "2023-06-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.95,
    "Date": "2023-06-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 186.01,
    "Date": "2023-06-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.92,
    "Date": "2023-06-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.01,
    "Date": "2023-06-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.96,
    "Date": "2023-06-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 187,
    "Date": "2023-06-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 186.68,
    "Date": "2023-06-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.27,
    "Date": "2023-06-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.06,
    "Date": "2023-06-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.25,
    "Date": "2023-06-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.59,
    "Date": "2023-06-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.97,
    "Date": "2023-06-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.46,
    "Date": "2023-07-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.33,
    "Date": "2023-07-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.81,
    "Date": "2023-07-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 190.68,
    "Date": "2023-07-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.61,
    "Date": "2023-07-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.08,
    "Date": "2023-07-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.77,
    "Date": "2023-07-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 190.54,
    "Date": "2023-07-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 190.69,
    "Date": "2023-07-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.99,
    "Date": "2023-07-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.73,
    "Date": "2023-07-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.1,
    "Date": "2023-07-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.13,
    "Date": "2023-07-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.94,
    "Date": "2023-07-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.75,
    "Date": "2023-07-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.62,
    "Date": "2023-07-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.5,
    "Date": "2023-07-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.22,
    "Date": "2023-07-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.83,
    "Date": "2023-07-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 196.45,
    "Date": "2023-07-31",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.61,
    "Date": "2023-08-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.58,
    "Date": "2023-08-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.17,
    "Date": "2023-08-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.99,
    "Date": "2023-08-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.85,
    "Date": "2023-08-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.8,
    "Date": "2023-08-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.19,
    "Date": "2023-08-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.97,
    "Date": "2023-08-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.79,
    "Date": "2023-08-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.46,
    "Date": "2023-08-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.45,
    "Date": "2023-08-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.57,
    "Date": "2023-08-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 174,
    "Date": "2023-08-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 174.49,
    "Date": "2023-08-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.84,
    "Date": "2023-08-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.23,
    "Date": "2023-08-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.12,
    "Date": "2023-08-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.38,
    "Date": "2023-08-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.61,
    "Date": "2023-08-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.19,
    "Date": "2023-08-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.12,
    "Date": "2023-08-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 187.65,
    "Date": "2023-08-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 187.87,
    "Date": "2023-08-31",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.46,
    "Date": "2023-09-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.7,
    "Date": "2023-09-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.91,
    "Date": "2023-09-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.56,
    "Date": "2023-09-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.18,
    "Date": "2023-09-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.36,
    "Date": "2023-09-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.3,
    "Date": "2023-09-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 174.21,
    "Date": "2023-09-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.74,
    "Date": "2023-09-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.01,
    "Date": "2023-09-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.97,
    "Date": "2023-09-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.07,
    "Date": "2023-09-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.49,
    "Date": "2023-09-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.93,
    "Date": "2023-09-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 174.79,
    "Date": "2023-09-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.08,
    "Date": "2023-09-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.96,
    "Date": "2023-09-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.43,
    "Date": "2023-09-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.69,
    "Date": "2023-09-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.21,
    "Date": "2023-09-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.75,
    "Date": "2023-10-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.4,
    "Date": "2023-10-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.66,
    "Date": "2023-10-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 174.91,
    "Date": "2023-10-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.49,
    "Date": "2023-10-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.99,
    "Date": "2023-10-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.39,
    "Date": "2023-10-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.8,
    "Date": "2023-10-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.71,
    "Date": "2023-10-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.85,
    "Date": "2023-10-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.72,
    "Date": "2023-10-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.15,
    "Date": "2023-10-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.84,
    "Date": "2023-10-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.46,
    "Date": "2023-10-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.88,
    "Date": "2023-10-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 173,
    "Date": "2023-10-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.44,
    "Date": "2023-10-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.1,
    "Date": "2023-10-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 166.89,
    "Date": "2023-10-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 168.22,
    "Date": "2023-10-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.29,
    "Date": "2023-10-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.77,
    "Date": "2023-10-31",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.97,
    "Date": "2023-11-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 177.57,
    "Date": "2023-11-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.65,
    "Date": "2023-11-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.23,
    "Date": "2023-11-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.82,
    "Date": "2023-11-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.89,
    "Date": "2023-11-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.41,
    "Date": "2023-11-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 186.4,
    "Date": "2023-11-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.8,
    "Date": "2023-11-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 187.44,
    "Date": "2023-11-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.01,
    "Date": "2023-11-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.71,
    "Date": "2023-11-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.69,
    "Date": "2023-11-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.45,
    "Date": "2023-11-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 190.64,
    "Date": "2023-11-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.31,
    "Date": "2023-11-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.97,
    "Date": "2023-11-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.79,
    "Date": "2023-11-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 190.4,
    "Date": "2023-11-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.37,
    "Date": "2023-11-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.95,
    "Date": "2023-11-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.24,
    "Date": "2023-12-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.43,
    "Date": "2023-12-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.42,
    "Date": "2023-12-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.32,
    "Date": "2023-12-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.27,
    "Date": "2023-12-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.71,
    "Date": "2023-12-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.18,
    "Date": "2023-12-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.71,
    "Date": "2023-12-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 197.96,
    "Date": "2023-12-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 198.11,
    "Date": "2023-12-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 197.57,
    "Date": "2023-12-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.89,
    "Date": "2023-12-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 196.94,
    "Date": "2023-12-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.83,
    "Date": "2023-12-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.68,
    "Date": "2023-12-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.6,
    "Date": "2023-12-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.05,
    "Date": "2023-12-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.15,
    "Date": "2023-12-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.58,
    "Date": "2023-12-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.53,
    "Date": "2023-12-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.64,
    "Date": "2024-01-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.25,
    "Date": "2024-01-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.91,
    "Date": "2024-01-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.18,
    "Date": "2024-01-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.56,
    "Date": "2024-01-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.14,
    "Date": "2024-01-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 186.19,
    "Date": "2024-01-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.59,
    "Date": "2024-01-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.92,
    "Date": "2024-01-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.63,
    "Date": "2024-01-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.68,
    "Date": "2024-01-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.63,
    "Date": "2024-01-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.56,
    "Date": "2024-01-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 193.89,
    "Date": "2024-01-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 195.18,
    "Date": "2024-01-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.5,
    "Date": "2024-01-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 194.17,
    "Date": "2024-01-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 192.42,
    "Date": "2024-01-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 191.73,
    "Date": "2024-01-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.04,
    "Date": "2024-01-30",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.4,
    "Date": "2024-01-31",
    "Symbol": "AAPL"
  },
  {
    "Close": 186.86,
    "Date": "2024-02-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.85,
    "Date": "2024-02-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 187.68,
    "Date": "2024-02-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.3,
    "Date": "2024-02-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 189.41,
    "Date": "2024-02-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.32,
    "Date": "2024-02-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 188.85,
    "Date": "2024-02-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 187.15,
    "Date": "2024-02-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 185.04,
    "Date": "2024-02-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.15,
    "Date": "2024-02-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 183.86,
    "Date": "2024-02-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.31,
    "Date": "2024-02-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.56,
    "Date": "2024-02-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.32,
    "Date": "2024-02-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 184.37,
    "Date": "2024-02-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.52,
    "Date": "2024-02-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.16,
    "Date": "2024-02-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 182.63,
    "Date": "2024-02-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 181.42,
    "Date": "2024-02-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 180.75,
    "Date": "2024-02-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 179.66,
    "Date": "2024-03-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.1,
    "Date": "2024-03-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.12,
    "Date": "2024-03-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.12,
    "Date": "2024-03-06",
    "Symbol": "AAPL"
  },
  {
    "Close": 169,
    "Date": "2024-03-07",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.73,
    "Date": "2024-03-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.75,
    "Date": "2024-03-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.23,
    "Date": "2024-03-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.13,
    "Date": "2024-03-13",
    "Symbol": "AAPL"
  },
  {
    "Close": 173,
    "Date": "2024-03-14",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.62,
    "Date": "2024-03-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.72,
    "Date": "2024-03-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.08,
    "Date": "2024-03-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 178.67,
    "Date": "2024-03-20",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.37,
    "Date": "2024-03-21",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.28,
    "Date": "2024-03-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.85,
    "Date": "2024-03-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.71,
    "Date": "2024-03-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.31,
    "Date": "2024-03-27",
    "Symbol": "AAPL"
  },
  {
    "Close": 171.48,
    "Date": "2024-03-28",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.03,
    "Date": "2024-04-01",
    "Symbol": "AAPL"
  },
  {
    "Close": 168.84,
    "Date": "2024-04-02",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.65,
    "Date": "2024-04-03",
    "Symbol": "AAPL"
  },
  {
    "Close": 168.82,
    "Date": "2024-04-04",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.58,
    "Date": "2024-04-05",
    "Symbol": "AAPL"
  },
  {
    "Close": 168.45,
    "Date": "2024-04-08",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.67,
    "Date": "2024-04-09",
    "Symbol": "AAPL"
  },
  {
    "Close": 167.78,
    "Date": "2024-04-10",
    "Symbol": "AAPL"
  },
  {
    "Close": 175.04,
    "Date": "2024-04-11",
    "Symbol": "AAPL"
  },
  {
    "Close": 176.55,
    "Date": "2024-04-12",
    "Symbol": "AAPL"
  },
  {
    "Close": 172.69,
    "Date": "2024-04-15",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.38,
    "Date": "2024-04-16",
    "Symbol": "AAPL"
  },
  {
    "Close": 168,
    "Date": "2024-04-17",
    "Symbol": "AAPL"
  },
  {
    "Close": 167.04,
    "Date": "2024-04-18",
    "Symbol": "AAPL"
  },
  {
    "Close": 165,
    "Date": "2024-04-19",
    "Symbol": "AAPL"
  },
  {
    "Close": 165.84,
    "Date": "2024-04-22",
    "Symbol": "AAPL"
  },
  {
    "Close": 166.9,
    "Date": "2024-04-23",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.02,
    "Date": "2024-04-24",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.89,
    "Date": "2024-04-25",
    "Symbol": "AAPL"
  },
  {
    "Close": 169.3,
    "Date": "2024-04-26",
    "Symbol": "AAPL"
  },
  {
    "Close": 173.5,
    "Date": "2024-04-29",
    "Symbol": "AAPL"
  },
  {
    "Close": 170.33,
    "Date": "2024-04-30",
    "Symbol": "AAPL"
  },
  
]

df = pd.DataFrame(data)

# 将日期转换为 datetime 类型
df['Date'] = pd.to_datetime(df['Date'])

# 按日期升序排序
df = df.sort_values(by='Date')

# 将日期设置为索引
df.set_index('Date', inplace=True)

# 构造特征和标签
def create_dataset(data, window_size):
    X, y = [], []
    for i in range(len(data) - window_size):
        X.append(data[i:(i + window_size)])
        y.append(data[i + window_size])
    return np.array(X), np.array(y)

# 定义窗口大小
window_size = 1

# 构造特征和标签
X, y = create_dataset(df['Close'].values, window_size)

# 调整输入特征的形状
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# 构建 LSTM 模型
model = Sequential([
    LSTM(50, input_shape=(window_size, 1)),
    Dense(1)
])

# 编译模型
model.compile(optimizer='adam', loss='mse')

# 训练模型
model.fit(X, y, epochs=100, batch_size=1, verbose=1)

# 对最后一个窗口进行预测
last_window = df['Close'].values[-window_size:]
last_window = np.reshape(last_window, (1, window_size, 1))
predicted_price = model.predict(last_window)

print("预测的下一天的收盘价为:", predicted_price[0][0])
print(123)
