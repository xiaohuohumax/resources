---
layout: article
title: 让你的电脑半夜起来干活
description: 一个成熟的电脑应该自己半夜爬起来干活，在你进入梦乡时继续发光发热。
icon: midnight_tasker_rtc.png
tags:
  - 自动化
  - Windows
id: 8c5a3d784b6673881311c50475bd65a2
---

## 前言

一个成熟的电脑应该自己半夜爬起来干活，在你进入梦乡时继续发光发热。

## 原理

+ BIOS RTC 唤醒功能可以设置定时开机。
+ schtasks（Windows 系统的计划任务，其他系统也有类似的工具）可以设置定时任务，可以设置任务的执行时间。

## 示例

例如：每天凌晨 2 点半，执行脚本 `D:\Scripts\backup.bat` 备份数据。

1. 打开 BIOS RTC 相关设置。并设置时间为凌晨 2 点 27 分自动唤醒。各系统的设置方法可能不同，请自行查找。
2. 打开命令提示符，输入以下创建计划任务。
```shell
# 创建计划任务
schtasks /create /tn "Backup Data" ^
/tr "D:\Scripts\backup.bat" ^
/st 02:30:00 ^
/sc daily ^
/ru "Administrator" ^
/rl highest ^
/f

# 删除计划任务
schtasks /delete /tn "Backup Data" /f
```
