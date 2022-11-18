export async function render() {
	return [
		$.app.t.header(),
		$.app.t.secondaryHeader("题目列表"),
		$.app.t.container([
			$.app.t.box(null, await $.app.problem.get_problems()),
		]),
	];
}