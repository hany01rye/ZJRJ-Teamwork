function colorize(s) {
	var c = {
		"Accepted": "am-badge-success",
		"Wrong Answer": "am-badge-danger",
		"Runtime Error": "am-badge-warning",
		"Time Limit Exceeded": "am-badge-warning",
		"Memory Limit Exceeded": "am-badge-warning",
		"Waiting": "am-badge-primary",
		"Compiling": "am-badge-primary",
	};
	var r = $.app.t.t("span");
	r.addClass("am-badge am-text-sm submission-status");
	r.addClass(c[s]);
	r.text(s);
	return r;
}

function tl_formatter(tl) {
	var r = $.app.t.t("span");
	if (!tl) {
		r.text("N / A");
	} else {
		r.text(tl + " ms");
	}
	return r;
}
function ml_formatter(ml) {
	var r = $.app.t.t("span");
	if (!ml) {
		r.text("N / A");
	} else if (ml <= 1024) {
		r.text(ml + " KiB");
	} else {
		r.text((ml / 1024).toFixed(2) + " MiB");
	}
	return r;
}

function testcase(id, t) {
	var info = (t) => {
		if (t.time_header && t.memory_header) {
			return t.time_header + " / " + t.memory_header;
		}
		return "";
	};
	var s = {
		"Accepted": "AC",
		"Wrong Answer": "WA",
		"Runtime Error": "RE",
		"Time Limit Exceeded": "TLE",
		"Memory Limit Exceeded": "MLE",
		"Skipped": "SKIP",
	};
	var r = $.app.t.tag.div("test-case test-case-" + s[t.result_header], [
		$.app.t.tag.div("test-case-id", "#" + id),
		$.app.t.tag.div("test-case-status", s[t.result_header]),
		$.app.t.tag.div("test-case-info", info(t)),
	]);
	return r;
}

function testcases(s) {
	var r = [];

	if (s.test_cases.Compilation) {
		r.push($("<h2>编译信息</h2>"));
		r.push($.app.t.t("pre").text(s.test_cases.Compilation["Compiler Message"]));
		return r;
	}

	r.push($("<h2>测试点信息</h2>"));
	var i = 0;
	for (var id in s.test_cases) {
		r.push(testcase(++i, s.test_cases[id]));
	}
	return r;
}

function source(s) {
	var lang = {
		"C": "c",
		"C++ 11": "cpp",
		"C++ 14": "cpp",
		"C++ 17": "cpp",
		"Python 3": "py",
	}
	var r = $.app.t.t("pre").html(
		hljs.highlight(s.source, {
			language: lang[s.lang],
		}).value
	);
	return r;
}

export async function render() {
	var r = await $.app.get("/submission/" + $.app.params["sid"] + "/");
	var data = r.data;

	return [
		$.app.t.header(),
		$.app.t.secondaryHeader("提交详情"),
		$.app.t.container([
			$.app.t.tag.div("am-g", [
				$.app.t.tag.div("am-u-sm-8", [
					$.app.t.box(null, testcases(data)),
					$.app.t.box(null, [
						$("<h2>源代码</h2>"),
						source(data),
					]),
				]),
				$.app.t.tag.div("am-u-sm-4", [
					$.app.t.box(null, [
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "提交者"),
							$.app.t.tag.div(null, [
								$.app.t.tag.a(null, "#/u/" + data.submitter.uid + "/", data.submitter.username),
							]),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "所属题目"),
							$.app.t.tag.a(null, "#/p/" + data.problem.pid + "/", data.problem.title),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "提交时间"),
							$.app.t.tag.div(null, moment(data.submit_time).format("YYYY/MM/DD kk:mm:ss")),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "评测状态"),
							$.app.t.tag.div(null, colorize(data.status)),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "用时"),
							$.app.t.tag.div(null, tl_formatter(data.time_used)),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "内存"),
							$.app.t.tag.div(null, ml_formatter(data.memory_used)),
						]),
						$.app.t.tag.div("side-row", [
							$.app.t.tag.div(null, "编程语言"),
							$.app.t.tag.div(null, data.lang),
						]),
					]),
				]),
			]),
		]),
	];
}