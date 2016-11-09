# MammaryCancerPaper

与疾控中心合作的问卷系统前端 & 北京科技大学本科生创新创业训练项目（SRTP）

[相关项目申报书点我](MammaryCancerPaper/doc/立项申报书.md)


## 文件树：

```java
|-- /
    |-- dist     // 生产目录
        |-- js
        |-- css
        |-- fonts
        |-- images
    |-- html     // html 文件放这里，注意，引用 dist 而不是 src
    |-- src      // 开发目录
        |-- js
        |-- css
        |-- fonts
        |-- images
    |-- doc    // 项目前期申请文案 & api 接口约定文档
        |-- apis 
        |-- files
    |-- 配置文件    //（新需要的模块添加在 package,json 中）
    |-- index.html    //页面入口

```

package.json 为 npm 配置文件

gulpfiles.js 为 gulp 配置文件

注意：请先安装 Nodejs 和 npm，添加 npm 的环境变量。

在终端中打开根目录，`npm install`，安装 node_modules。

如果太慢可以改用淘宝的镜像，自行google

## 开发

终端打开根目录，`npm run start` 为开发环境命令。不压缩混淆。

`npm run build` 为生产环境命令，压缩且代码混淆，无法调试。


## 开发进度

 - v 0.0.1 初建项目
 - v 0.0.2 引入 angularJS Swiper underscore jQuery 等库
 - v 0.1.0 使用 gulp 成功跑起来
 - v 0.1.5 解决 rootScope 的问题。。。跳坑
 - v 0.1.6 正式立项 SRTP
 - v 0.2.0 启动机器学习 or 数据挖掘方向侧重