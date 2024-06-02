# 使用官方 Node.js 镜像作为构建环境
FROM node:18 AS build

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制应用代码并构建
COPY . .
RUN npm run build

# 使用 Nginx 作为生产环境服务器
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 复制自定义 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
