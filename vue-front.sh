#!/bin/bash
WORK_PATH='D:\work\code\08nginxdockercicd\cicd-vue-front' # 工作目录（服务器端）
cd $WORK_PATH
echo "先清除旧的代码"
git reset --hard origin/main # 远程代码强制覆盖本地代码
git clean -f # 把没有提交到暂存区的本地文件清除
echo "拉取最新代码"
git pull origin main
echo "编译" # 前端代码需要build
npm run build
echo "开始执行构建" # 使用docker进行构建
docker build -t vue-front:1.0 . # .表示当前目录(上面定义的WORK_PATH)
# 去当前目录的vue-front下找Dockerfile文件进行构建
# 会根据这个dockerfile文件去生成镜像，-t：生成的镜像名字叫vue-front:1.0
# 不加1.0每次就都是laster
echo "构建结束要启动前端、后端服务(服务在容器里面)"
echo "先停止并删除旧容器"
docker stop vue-front-container
docker rm vue-front-container
echo "启动新容器"
#-p：端口映射；把宿主机的80端口映射为容器内部的80端口,前提是生成镜像的时候暴露了80端口
# --name：给容器起名字
# -d：表示在后台运行，不要阻塞当前命令行的窗口
# vue-front：表示镜像的名字
#基于镜像vue-front启动一个服务，名字叫vue-front-container，在后台运行，访问宿主机的80端口就会访问到我的80端口
# 因为里面是nginx容器，所以用80端口
docker container run -p 80:80 --name vue-front-container -d vue-front:1.0