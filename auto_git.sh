#!/bin/bash

# token
git_token=""
# username
user_name="0fengzi0"
# email
user_email="1209711408@qq.com"
# path
root_path="/home/git/"
# repo
repo_name="vocaltts-html"
# dist_repo_name
dist_repo_name="VOCALTTS-dist"

git config --global user.email "$user_email"
git config --global user.name "$user_name"

# 克隆储存库
cd $root_path
git clone "https://$git_token@github.com/$user_name/$repo_name.git"

# 清理、还原、同步本地分支
cd $root_path/$repo_name
git fetch --all
git reset --hard origin/master
git pull origin master

# 安装并编译本地代码
cd $root_path/$repo_name
yarn
yarn run build

# 提交储存库
cd $root_path/$repo_name/dist
git init
git add -A
git commit -m "auto_git脚本自动编译并提交"
git remote add origin "https://$git_token@github.com/$user_name/$dist_repo_name.git"
git push --force --quiet origin master