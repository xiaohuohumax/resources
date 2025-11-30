---
layout: home
hero:
  name: Resources
  text: 资源仓库
  tagline: 收录各种常用资源地址(软件、配置、文档等)
  image:
    src: /logo.svg
    alt: Resources
  actions:
    - theme: brand
      text: 装机必备
      link: /software/pc/required/
    - theme: brand
      text: 手机必备
      link: /software/mobile/required
    - theme: alt
      text: 项目源码
      link: 'https://github.com/xiaohuohumax/resources'
    - theme: alt
      text: 下载书签
      link: /bookmark.html
features:
  - title: 软件
    icon: 📦
    details: 收录各种常用软件、工具、插件等资源
  - title: 娱乐
    icon: 🎉
    details: 收录各种视频、游戏、音乐等资源
  - title: 文档
    icon: 📖
    details: 收录各种文章、教程、文档等资源
---

<script setup lang="ts">
import { withBase, useData } from 'vitepress';
import { onMounted } from 'vue';

const { site } = useData();

onMounted(() => {
  // Download bookmark link
  const downloadLink = document.querySelectorAll('.VPHero a.VPButton.alt')[1];
  if (!downloadLink) return;

  const a = downloadLink.cloneNode(true);
  a.download = site.value.title + '.html';

  downloadLink.parentNode.replaceChild(a, downloadLink);
});
</script>
