---
layout: article
title: 批量打开网址脚本
description: 一个简单脚本，让你从文本文件中读取网址，然后批量打开网址。
icon: batch_open_url.svg
tags:
  - Windows
  - 脚本
id: 203ae23b4d64bfe8a7d3a3b012d02434
---

## 前言

一个简单脚本，让你从文本文件中读取网址，然后批量打开网址。

## 步骤

1. 创建一个文本文件，例如 `urls.txt`，内容如下：
```txt
# 一行一个网址，可以使用注释行（以 # 开头）忽略
https://www.example.com
https://www.google.com
https://www.github.com

# https://www.example.com
```
2. 同目录下创建一个批处理文件，例如 `batch_open_urls.bat`，内容如下：
```shell
@echo off
setlocal enabledelayedexpansion
for /f "eol=#" %%i in (urls.txt) do (
    start "" "%%i"
)
endlocal
```
3. 双击运行 `batch_open_urls.bat`，即可批量打开网址。
