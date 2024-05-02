# 使用 Node.js 官方镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖项
RUN npm install

# 将整个项目复制到工作目录
COPY . .

# 构建生产环境代码
RUN npm run build

# 暴露容器的端口（如果需要）
EXPOSE 3000

# 运行应用
CMD ["npm", "start"]
