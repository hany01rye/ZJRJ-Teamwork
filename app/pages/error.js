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