# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 启动项目, 开始 demo 使用

git clone 本项目后,执行 
### `dsds`  依赖安装
`yarn` 或  `npm i`

### 启动项目
`yarn start`

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 主要功能

在 slate 框架基础上进行日常富文本编辑的功能

1. 日常文本编辑, 回车自动换行处理并格式化, 默认为段落;
2. 支持图片复制粘贴(但未支持移动及拖拽图片);
3. 支持超大文档 word、excel 列表复制粘贴, 进行了一些性能优化处理;
4. 支持超链接基础功能, 无需定义协议, 会自动识别 http 或 https 进行跳转;
5. 数据为 Node 特殊的 json 解构, 可与后端点对点进行修改文件, 也可直接存储全量 json;
6. 可与任何一种 html 文本进行复制粘贴(部分解析文本可能未处理到)

## 可拓展未实现功能

1. 基础颜色配置、文字对齐、排布等;
2. 代码块功能, 流程图, 思维导图, 媒体文件(可参考语雀、阿里云效);
3. 支持 markdown 文本与 html 解析;
4. 支持 word, pdf, html 文件导入导出;
