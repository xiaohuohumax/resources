---
# https://vitepress.dev/reference/default-theme-home-page
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
      link: /software/pc/required
    - theme: brand
      text: 必备App
      link: /software/mobile/required
    - theme: alt
      text: Github
      link: https://github.com/xiaohuohumax/resources

features:
  - title: 软件资源
    icon: 📦
    details: 收录各种常用软件、工具、插件等资源
  - title: 娱乐影音
    icon: 🎉
    details: 收录各种视频、游戏、音乐等资源
  - title: 文章文档(施工中🚧)
    icon: 📖
    details: 收录各种文章、教程、文档等资源
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #85FFBD 50%, #FFFB7D);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #74EBD5 50%, #9FACE6 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>