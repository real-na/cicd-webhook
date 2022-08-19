#!/bin/bash
WORK_PATH='usr/projects/vue-back' # 工作目录（服务器端）
cd $WORK_PATH
echo "先清除旧的代码"
git reset --hard origin/master # 远程代码强制覆盖本地代码
git clean -f # 把没有提交到暂存区的本地文件清除
echo "拉取最新代码"
git pull origin master
echo "开始执行构建" # 使用docker进行构建
docker build -t vue-back . # .表示当前目录，去当前目录的vue-back下找Dockerfile文件进行构建
# 会根据这个dockerfile文件去生成镜像，-t：生成的镜像名字叫vue-back
echo "构建结束要启动前端、后端服务(服务在容器里面)"
echo "先停止并删除旧容器"
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
#-p：端口映射；把宿主机的3000端口映射为容器内部的3000端口,前提是生成镜像的时候暴露了3000端口
# --name：给容器起名字
# -d：表示在后台运行，不要阻塞当前命令行的窗口
# vue-back：表示镜像的名字
#基于镜像vue-back启动一个服务，名字叫vue-back-container，在后台运行，访问宿主机的3000端口就会访问到我的3000端口
docker container run -p 3000:3000 --name vue-back-container -d vue-back