## 项目前言
投顾基金
## 项目技术栈

react@18.1.0 + react-router-dom@6.3.0 + react-dom@18.1.0 + antd-mobile@5.13.1 + webpack@5.73.0 + typescript@4.7.3
### 准备开发环境

-   我们强烈推荐您使用 mac 系统并使用 Visual Stduio Code 进行该应用的开发工作。
-   本应用使用的 node 及 npm 版本必须满足 "node": ">=14", "npm": ">=6.14"。推荐使
    用 "node": "=16.8.0", "npm": "=8.5.0" 以减少由于 node 版本而引发的 bug。

## 项目运行
```
cd 项目目录

npm install or yarn (安装依赖包)

npm start (启动服务)

npm run build (正式环境的打包部署)

根据不同环境进行打包 eg: npm run build:release

```
## 项目目录结构

```
├─config                    webpack config 配置 
├─src                     
├   ├─api                   接口名字(每个模块属于每个模块的接口)
├   ├─assets                项目资源（图片 & css样式）
├   ├─components            功能组件，页面中可达到复用
├   ├─pages                 项目中的所有页面
├   ├─routes                路由配置
├   ├─services              request请求的封装
├   ├─utils                 全局的公共工具
├   ├─global.d              全局的ts类型，当前项目都可使用
├   ├─index.css             全局的公共css
├   ├─index.html            页面的主入口 html
├   ├─index.tsx             React App主入口
├─.babelrc                  配置babel，按需引入等
├─postcss.config            配置postcss的plugin
├─tsconfig.json             ts 配置
├─webpack.config.js         不区分环境的webpack共有配置
```

## 项目注意事项
### 1.  pages & common & components 目录下面的文件必须以大写开头,看具体文件实现
### 2.  class类名必须见名识意，不得出现大小写，多个单词可用-进行连接
```
import S from './index.module.css';

 ✅ <div className={S['box-title']}></div> 
 ❌ <div className={S.boxTitle}></div>
```
### 3.  页面引入顺序： 第三方库 -> 本身项目与的组件 -> type.d.ts -> style.module.css
```
import React, { FC } from 'react';
import { Loading } from '@components'
import { Answer } from './type'
import styles from './style.module.css'
```
### 4. 页面中的 全局变量 / 定时器等在组件卸载的时候都必须及时清除，以免造成内存泄露
```
import React, { useEffect } from 'react';
let timer = null // 定时器
const App = () => {
  useEffect(() => {
    return () => {
      timer = null // 干掉
    }
  }, [])
}
```
## 项目使用介绍
### 页面的ts设置
每个页面下都具备一个 <font color="#dd0000">type.d.ts</font>，将本页面写入的ts放置该文件中
### 页面router的配置
路由配置的url链接 需与 文件名一致。
eg： 路由为/home, 则相应/pages应具备Home文件夹，一一对应关系！
在routes目录下的index 进行配置。 eg 如下
```
  {
    path: "/home", // 页面路径
    element: lazy(() => import("@pages/Home")), // pages后面跟随文件夹的名称
  },
```