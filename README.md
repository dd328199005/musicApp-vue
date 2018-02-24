# Vue Music webApp


<p align="center"><a href="https://music-vue.n-y.io" target="_blank"><img width="300"src="https://raw.githubusercontent.com/nanyang24/music-vue/master/img/Apple_Music_Blur.png"></a></p>
<p align="center">Vue 音乐App、数据抓取自QQ音乐</p>
<p align="center">
  <a href="https://github.com/nanyang24"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Vue"></a>
  <a href="https://github.com/vuejs/vue-cli"><img src="https://img.shields.io/badge/vue--cli-v2.9.2-green.svg" alt="vue-cli"></a>
  <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-v2.5.2-green.svg" alt="Vue"></a>
  <a href="https://github.com/vuejs/vuex"><img src="https://img.shields.io/badge/vuex-v3.0.1-green.svg" alt="vuex"></a>
  <a href="https://github.com/vuejs/vue-router"><img src="https://img.shields.io/badge/vue--router-v3.0.1-green.svg" alt="vue-router"></a>
  <a href="https://github.com/axios/axios"><img src="https://img.shields.io/badge/axios-v0.17.1-blue.svg" alt="axios"></a>
  <a href="https://github.com/ustbhuangyi/better-scroll"><img src="https://img.shields.io/badge/better--scroll-v1.7.2-blue.svg" alt="better-scroll"></a>
  <a href="https://github.com/hilongjw/vue-lazyload"><img src="https://img.shields.io/badge/vue--lazyload-v1.1.4-yellow.svg" alt="vue-lazyload"></a>
</p>


#### [音乐项目 music app 知识点总结](https://github.com/nanyang24/music-vue/blob/master/conclusion.md)



## 主要技术栈

【前端】

- `Vue`：用于构建用户界面的 MVVM 框架。它的核心是**响应的数据绑定**和**组系统件**
- `vue-router`：为单页面应用提供的路由系统，项目上线前使用 `Lazy Loading Routes` 来实现异步加载优化性能
- `vuex`：Vue 的集中状态管理，在多个组件共享某些状态时非常便捷，适用于中大型项目
- `vue-lazyload`：第三方图片懒加载库，优化页面加载速度
- `better-scroll`：iscroll 的优化版，使移动端滑动体验更加流畅，轮播图也是利用此制作
- `Stylus`：css 预编译处理器
- `ES6`：项目中用到的模块化、解构赋值、Promise、Class 等方法非常好用

【后端】

- `Node.js`：利用 Express 起一个本地数据抓取服务器
- `jsonp`：服务端通讯。抓取 QQ音乐(移动端)数据（后面数据改为全部用axios实现抓取）
- `axios`：服务端通讯。结合 Node.js 代理后端请求，抓取 QQ音乐(PC端)数据

【自动化构建及其他工具】

- `vue-cli`：Vue 脚手架工具，快速初始化项目代码，以及 webpack 的配置（汗颜…）
- `eslint`：代码风格检查工具，规范代码书写
- `vConsole`：移动端调试工具，在移动端输出日志
- `Charles`：方便查看移动端网络请求数据

## 实现细节
主要页面：播放器内核页、推荐页、歌单详情页、歌手页、歌手详情页、排行页、搜索页、添加歌曲页、个人中心页等。
核心页面：播放器内核页

## 项目结构
<img src="https://raw.githubusercontent.com/nanyang24/music-vue/master/img/dir.png" width="50%">


## TODO

1. 歌曲数据全部来自 QQ 音乐，接口改变了可能就要修改 `jsonp` 和 `axios` 代码

## Build Setup

``` bash
# clone the repo into your disk.
$ git clone git@github.com:nanyang24/music-vue.git

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build
```


