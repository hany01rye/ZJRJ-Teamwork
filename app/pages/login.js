export async function render() {
	return [
		$.app.t.header(),
		$.app.t.container([
			$.app.t.box(6, [
				$.app.t.tag.div("am-text-center full-width", [
					$("<h2>欢迎回到 " + $.app.APP_NAME + "</h2>"),
				]),
			]),
		]),
	];
}