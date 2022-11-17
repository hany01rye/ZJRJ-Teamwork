# ZJRJ-Teamwork
走进软件小组作业

---

### Readme from Serval

#### 前情提要

##### 0. 本地怎么打开它呢？

由于网站使用了 ajax，本地不能直接打开（因为安全原因 files 协议好像默认不能用 ajax？），一般来说需要 http 协议，所以一般来说可能需要在本地配置服务器，例如 Apache 或是 Nginx。

但是可能可以通过浏览器设置规避掉这一限制，例如对于 Firefox 浏览器，可以参见 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp，在首选项中关闭 `privacy.file_unique_origin` 选项。

Project 的代码结构如下：

```
+-- index.html           // main page
+-- asset
|   +-- css              // third-party style files
|   |   +-- ...
|   +-- js               // third-party javascript files
|   |   +-- ...
|   +-- fonts            // third-party fonts files
|       +-- ...
+-- app                  // project
    +-- asset
    |   +-- otter        // otter images
    |   |   +-- ...
    |   +-- main.css     // style file
    +-- main.js          // entrance
    +-- router.js        // router
    +-- asset.js         // variables & functions
    +-- pages
        +-- home.js      // home page
        +-- login.js     // login page
        +-- ...
```

`index.html` 页面里包含侧栏和底部，其余的部分需要在 `#app` 里用 javascript 渲染。

简单来说，只需要写一堆 javascript 让 `/app/pages/xxx.js` 返回对应页面的内容就可以了。QAQ

为了方便，我在 `/app/asset.js` 里定义了一些可能会用到的方法，具体内容会在后文介绍。

##### 1. 我需要哪些技能呢？

##### 1.0 web

GET / POST，HTTP status code（200 / 400 / 401 / 403 / 404）

##### 1.1 DOM Tree

首先大家应该对 HTML 有一定的了解。整个 HTML 对应一棵树（DOM Tree），一个 `<div></div>` 之类的标签可以视作树上的结点（当然，它有一堆儿子，比如 `<div><a></a><p></p></div>` 中的 `div` 这个结点就有 `a` 和 `p` 这俩儿子）。这些结点可以作为 javascript 的对象，是不是很神奇！

##### 1.2 jQuery

为了生成这些结点，可能需要用到 jQuery 等工具。简单来说，jQuery 会给你一个可以用的函数 `$(...)`，用法包括但不限于：

+ 可以把这个函数当成选择器。例如：`$("div")` 会返回页面里所有 `div` 标签，`$(".classname")` 会返回页面里所有包含 `classname` 类的标签，和 CSS 里的几乎一样对不对！

+ 可以用这个函数生成新标签。例如：`$("<div><a>test</a></div>")` 就会生成一个 `div` 标签包着一个 `a` 标签，我们把它存进变量 `r` 里之后再 `$("#app").append(r)` 就能把它插进页面里了！

一些细节的用法可以参见 jQuery 的文档。常用的函数有：`text()`，`css()`，`attr()`，`addClass()`，`append()`，`prepend()` 等等。

##### 1.3 API

为了调用 API 接口获取数据，需要异步操作（记得要 `await`，所在的函数要 `async`！），相关函数已经被封装进 `$.app.get()` 与 `$.app.post()` 里了，只需要调用就能拿到 API 的返回值了！例如以下代码可以将 API 返回的数据扔进控制台：

```javascript
async function () {
	const r = await $.app.get("/submission/", {
		skip: 5,
		count: 10,
	});
	console.log(r.data);
}
```

一些错误处理可能需要看 `r.statusCode` 之类的值。

##### 1.4 UI

Project 使用（实际就是抄）的是洛谷用的 UI 框架：amaze UI。可以从官方的文档里找想要的示例，把对应的类名抄进代码里就行了（嗯！

+ CSS：http://amazeui.shopxo.net/css/

+ JS 插件：http://amazeui.shopxo.net/javascript/

+ Web 组件：http://amazeui.shopxo.net/widgets/

如果想加 css 的话在 `/app/asset/main.css` 里加上就行了。QAQ

#### 有啥现成的可以用的东西吗

除了引入的 jQuery，KaTeX，markdown-it，highlight.js 等等第三方库以外，还有 `$.app` 可以用。

这里边有一些变量可以调用：

+ `$.app.APP_NAME`：应用名称（STH Online Judge）
+ `$.app.params`：如果页面有参数（GET 的参数或是路径中的参数）的话，`params` 会是一个放着参数的 object
+ $.app.`login`：用户是否登录，登录了就是 `true`，不然是 `false`
+ $.app.`user`：如果登录了的话，`user` 是一个放着用户信息的 object

还有一些函数可以调用：

+ `$.app.setTitle(title)`：设置页面标题为 `title`，后面会自动补上 app name

+ `$.app.get(url, [params])`：向 `url` 发起参数为 `params` 的 GET 请求，`params` 是一个 object

+ `$.app.post(url, [data])`：向 `url` 发起参数为 `data` 的 POST 请求，`data` 是一个 object

还有一些模板可以调用，这些模板放在 `$.app.t` 里：

+ `$.app.t.header(title)`：`title` 可以是字符串，也可以是结点列表；返回值是一个结点，对应页面最上面的那一栏

+ `$.app.t.secondaryHeader(title)`：`title` 可以是字符串，也可以是结点列表；返回值是一个结点，对应页面的标题（例如出错啦）

+ `$.app.t.container(items)`：`items` 是结点列表；返回值是一个包含 `items` 里的结点的一个页面内容的 `container`

+ `$.app.t.box(width, items)`：`width` 对应 amaze UI 的网格宽度，可以填 1~12 或是 `null`（`null -> 12`）；`items` 是结点列表；返回值是一个包含 `items` 里的结点的一个 `box`，也就是那个白色的框框

当然，开发的时候可以往这里面多扔点模板，欢迎补充上表。

还有一些创建标签的函数可以调用，这些函数放在 `$.app.t.tag` 里：

+ `$.app.t.t(tagName)`：返回一个新的 `tagName` 标签

+ `$.app.t.tag.div(className, content)`：`className` 是类名（例如 `am-g am-g-fixed`）；`content` 是 `div` 标签里的东西，可以是字符串也可以是结点列表

+ `$.app.t.tag.a(className, href, content)`：`href` 是链接地址，其余同上

+ `$.app.t.tag.img(className, src)`：`src` 是图片地址，`className` 同上

当然，开发的时候可以往这里面多扔点函数，欢迎补充上表。

最后只要能跑就行……用不用这些功能无所谓 qwq


#### 我需要干什么

只需要让页面对应的 js 文件中的 `render` 函数返回 `#app` 的儿子列表就可以了，剩下的操作代码应该会自动完成的。

例如 `error.js` 实现了出错页面，它的代码如下：

```javascript
export async function render() {
	return [
		$.app.t.header(),
		$.app.t.secondaryHeader("出错啦！"),
		$.app.t.container([
			$.app.t.box(null, [
				$.app.t.tag.img("am-align-left", "app/asset/otter/oops.png"),
				$.app.t.tag.div(null, [
					$("<h1 style='font-size: 2.6em;'>404</h1>"),
					$("<h2>你似乎来到了没有知识存在的荒原</h2>"),
					$("<br/>"),
					$.app.t.tag.a(null, "javascript:history.go(-1);", "返回上一页"),
				]),
			]),
		]),
	];
}
```

一个 `.js` 文件里可以有其他函数，怎么方便怎么来就行……QAQ

有问题直接联系我 QAQ
