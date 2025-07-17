# HTML

## 谈谈对 HTML 语义化标签的理解

**语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）**。语义化标签，说白了，就是用具有语义含义的 HTML 标签来组织和结构化内容，让代码更易懂，也更利于搜索引擎优化。

1. **可读性**：语义化标签让 HTML 更容易读懂。比如，用 `<article>`、`<section>`、`<header>`等标签替代传统的 `<div>`，一眼就能看出页面的结构。
2. **文档结构清晰**：使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。
3. **搜索引擎优化**：搜索引擎爬虫也依赖于标签来理解网页的结构和内容，合适的语义化标签有助于提升网页在搜索引擎中的排名。
4. **维护成本**：当项目很大或者由多人开发时，语义化的标签可以减少沟通成本，提高开发效率。
5. **样式和行为的分离**：使用语义化标签有助于将内容的结构与样式和行为分离，符合关注点分离原则。

举个例子，以前的布局可能大量依赖于`<div>`标签和 CSS，现在我们可以使用`<nav>`、`<footer>`、`<aside>`等更具描述性的标签。

常见的语义化标签：

```html
<header></header>
头部

<nav></nav>
导航栏

<section></section>
区块（有语义化的div）

<main></main>
主要区域

<article></article>
主要内容

<aside></aside>
侧边栏

<footer></footer>
底部
```

## HTML5 新特性有些

1. **新的语义化标签**：比如`<header>`、`<nav>`、`<footer>`、`<article>`、`<section>`和`<aside>`等，这让页面结构更清晰。
2. **表单控件**：增加了很多新的表单控件，比如`email`、`url`、`number`、`date`、time、`range`,`search`和`color`
3. **图形和多媒体标签**：

-   引入了`<canvas>`标签，可以用来绘制图形。
-   `<audio>`和`<video>`标签，让音频和视频的嵌入变得更简单。

4. **DOM 查询操作**：

-   document.querySelector()
-   document.querySelectorAll()

5. **Web 存储**：

-   `localstorage`提供了一种在用户浏览器中存储大量数据的方式。
-   `sessionStorage`则提供了在同一窗口（或标签页）中跟踪会话数据的方式。

6. **离线应用**：通过应用程序缓存（ApplicationCache），可以让应用在没有网络的情况下也能运行。
7. **WebWorkers**：允许 JavaScript 脚本在后台线程中运行，不阻塞用户界面。
8. **地理定位**：通过 GeolocationAPl，可以获取用户的地理位置信息。
9. **跨文档通信（Cross-documentmessaging）**：允许来自不同源的页面间进行数据通信。
10. **服务器发送事件（Server-SentEvents，SSE）**：允许服务器向客户端推送实时消息。
11. **Web Components**：

-   自定义元素（Custom Elements）
-   影子 DOM（Shadow DOM）
-   HTML 模板（HTML Templates）

12. **拖放**：拖放是一种常见的特性，即抓取对象以后拖到另一个位置。设置元素可拖放：

-   `<img draggable="true" />`

简单来说，HTML5 带来了很多新特性，从表单控件到图形多媒体，再到存储和通信，这些都大大增强了 Web 应用的功能和用户体验。

**总结：**

（1）**新增语义化标签**：nav、header、footer、aside、section、article

（2）**音频、视频标签**：audio、video

（3）**数据存储**：localStorage、sessionStorage

（4）**canvas（画布）、Geolocation（地理定位）、websocket（通信协议）**

（5）**input 标签新增属性**：placeholder、autocomplete、autofocus、required

（6）**history API**：go、forward、back、pushstate

## 行内元素、块级元素的区别？

1. **块级元素**：

-   像`<div>`、`<section>`、`<header>`这些元素，默认是块级元素。
-   块级元素通常会以"块"的形式显示，即它会在页面上占据一整行，上下会有换行。
-   它们的高度和宽度可以通过 CSS 控制。
-   块级元素可以应用 margin 和 padding 属性。
-   块级元素内可以包含其他块级元素和行内元素。

2. **行内元素**：

-   比如`<span>`、`<a>`、`<img>`这些元素，默认是行内元素。
-   行内元素在页面上不会以块的形式显示，它们不会独占一行，多个行内元素会排成一行，直到填满整行。
-   行内元素的宽度和高度通常是由内容决定的，不过也可以用 CSS 控制。
-   行内元素内通常包含文本或其他行内元素。

**区别：**

1. **布局**：块级元素会影响布局的流，而行内元素不会。
2. **宽度和高度**：块级元素的宽度默认填满父元素，而行内元素的宽度默认是内容的宽度。
3. **换行**：块级元素前后会换行，行内元素不会。

举个例子，如果你在页面上放一个`<div>`（块级元素），它会独占一行。但如果你放一个`<span>`（行内元素），它就会和周围的内容排在同一行。

> 参考：掘金博主 CUGGZ
