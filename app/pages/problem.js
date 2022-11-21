export async function render() {
	var title_map = new Map([['', '题目描述'], ['Input', '输入格式'], ['Output', '输出格式']])
  var pid = $.app.params.pid;
	var problem = (await $.app.get("/problem/" + pid + "/"));
	var problem = problem.data;
	console.log(problem);
	var uid = problem.author_uid;
	var u = (await $.app.get("/user/" + uid + "/"));
	var uName = u.data.username;
  var page = [];
	var hd = $.app.t.tag.div("problem-head");
	var c = $.app.t.container();
	var d = $.app.t.tag.div("am-g");
	var l = $.app.t.tag.div("am-u-sm-8");
	l.css("padding-right", "0.5rem");
	var r = $.app.t.tag.div("am-u-sm-4");
	r.css("padding-left", "0.5rem");
	var main = $.app.t.container();
	var sidebar = $.app.t.container();

	page.push($.app.t.header());
	var wrap = $.app.t.tag.div("am-g am-g-fixed problem-head-wrap");
	wrap.append($.app.t.tag.div("problem-head-title", problem.title));
	var bottom = $.app.t.tag.div("problem-head-btm");
	var bt = $.app.t.t("button");
	bt.addClass("submit-btn")
	bt.text("提交答案");
	bottom.append(bt);

	var tl = problem.judge_info.time_limit / 1000;
	var ml = problem.judge_info.memory_limit / 1024;
	var info = $.app.t.tag.div("am-g");
	info.css("width", "34rem");
	info.css("padding-right", "1.5rem");
	info.css("text-align", "center");
	info.css("font-size", "14px");
	info.css("font-weight", "700");
	var pass = $.app.t.tag.div("am-u-sm-3");
	var all = $.app.t.tag.div("am-u-sm-3");
	var time = $.app.t.tag.div("am-u-sm-3");
	var memory = $.app.t.tag.div("am-u-sm-3");
	pass.css("padding", "1px");
	all.css("padding", "1px");
	time.css("padding", "1px");
	memory.css("padding", "1px");
	all.css("border-left", "solid 1px darkgray");
	time.css("border-left", "solid 1px darkgray");
	memory.css("border-left", "solid 1px darkgray");
	pass.append($.app.t.tag.div(null, "提交"));
	pass.append($.app.t.tag.div(null, problem.submission_count));
	all.append($.app.t.tag.div(null, "通过"));
	all.append($.app.t.tag.div(null, problem.accepted_count));
	time.append($.app.t.tag.div(null, "时间限制"))
	time.append($.app.t.tag.div(null, tl + " s"))
	memory.append($.app.t.tag.div(null, "空间限制"))
	memory.append($.app.t.tag.div(null, ml + " MB"))
	info.append(pass); info.append(all); info.append(time); info.append(memory);
	bottom.append(info);
	wrap.append(bottom);
	hd.append(wrap);
  page.push(hd);


	main.css("padding-top", "5px");
	var p = problem.statement.sections;
	console.log(p);
	for (var i in p) {
		if (p[i].is_sample) {
			var sec = $.app.t.t("div");
			var t = $.app.t.tag.div("problem-h2", "输入输出样例");
			sec.append(t);

			var s = $.app.t.tag.div("sample-wrap", null);
			var sps = p[i].samples;
			for (var j in sps) {
				var row = $.app.t.tag.div("am-g");
				var lft = $.app.t.tag.div("am-u-sm-6"); var rht = $.app.t.tag.div("am-u-sm-6");
				lft.css("padding-right", "0.5rem"); rht.css("padding-left", "0.5rem");
				var sp = sps[j];
				var input = $.app.t.t("pre"); var output = $.app.t.t("pre");
				input.css("border-radius", "3px"); output.css("border-radius", "3px");
				input.text(sp.input); output.text(sp.output);

				var lt = $.app.t.tag.div("sample"); var rt = $.app.t.tag.div("sample");
				lt.append($.app.t.tag.div("sample-title", "输入 #" + (parseInt(j) + 1)));
				rt.append($.app.t.tag.div("sample-title", "输出 #" + (parseInt(j) + 1)));
				var cl = $.app.t.t("button"); cl.addClass("copy-button"); cl.text("复制");
				var cr = $.app.t.t("button"); cr.addClass("copy-button"); cr.text("复制");
				cl.click(async function() {
					try {
						await navigator.clipboard.writeText(input.text());
						cl.text("复制成功");
						cl.css("background-color", "#0e90d2");
						cl.css("color", "white");
						setTimeout(
							function() {
								cl.text("复制");
								cl.css("background-color", "white");
								cl.css("color", "#0e90d2");
							}, 500);
					} catch (e) {
						console.log(e);
					}
				});
				cr.click(async function() {
					try {
						await navigator.clipboard.writeText(output.text());
						cr.text("复制成功");
						cr.css("background-color", "#0e90d2");
						cr.css("color", "white");
						setTimeout(
							function() {
								cr.text("复制");
								cr.css("background-color", "white");
								cr.css("color", "#0e90d2");
							}, 500);
					} catch (e) {
						console.log(e);
					}
				});
				lt.append(cl); rt.append(cr);

				lft.append(lt); rht.append(rt);
				lft.append(input); rht.append(output);
				row.append(lft); row.append(rht);
				s.append(row);
			}
			sec.append(s);
			main.append(sec);
			continue;
		}
		var sec = $.app.t.t("div");
		var t = $.app.t.tag.div("problem-h2", title_map.get(p[i].title));
		var ct = $.app.t.t("div");
		ct.html(marked.parse(problem.statement.sections[i].content));
		sec.append(t);
		sec.append(ct);
		main.append(sec);
	}

	sidebar.css("padding-top", "0");
	var c1 = $.app.t.container();
	c1.css("padding", "5px");
	var auth = $.app.t.tag.div("side-row");
	auth.append($.app.t.tag.div(null, "题目提供者"));
	auth.append($.app.t.tag.div(null, uName))
	c1.append(auth);
	var stat = $.app.t.tag.div("side-row");
	stat.append($.app.t.tag.div(null, "历史状态"));
	stat.append($.app.t.tag.div(null, "0"));
	c1.append(stat);

	var c2 = $.app.t.container();
	c2.css("padding", "5px");
	var submissionsTitle = $.app.t.tag.div("sidebar-title", "提交记录");
	c2.append(submissionsTitle);
	var tb = $.app.t.t("table");
	tb.addClass("am-table am-table-centered");
	tb.append($("<thead><tr><th>ID</th><th>结果</th></tr></thead>").css("color", "darkgray"));
	var uid = $.app.user.uid;
	c2.append(tb);
	uid = 1;				// test
	if (uid) {
		var submit_data = (await $.app.get("/submission/?submitter=" + uid + "&problem=" + pid)).data.submissions;
		console.log(submit_data);
		var t_body = $.app.t.t("tbody");
		for (var i = 0; i < submit_data.length && i < 5; i++) {
			var sd = submit_data[i];
			var tr = $.app.t.t("tr");
			tr.css("text-align", "center");
			var tdl = $.app.t.t("td"); tdl.text(sd.sid);
			tdl.css("color", "darkgray");
			var tdr = $.app.t.t("td"); tdr.text(sd.status);
			tdr.css("font-weight", "bolder");
			switch (sd.status) {
				case "Accepted":
					tdr.css("color", "green");
					break;
				case "Wrong Answer":
					tdr.css("color", "red");
					break;
				case "Compilation Error":
					tdr.css("color", "darkgray");
					break;
				case "Runtime Error":
					tdr.css("color", "gold");
					break;
				case "Time Limit Exceeded":
					tdr.css("color", "darkorange");
					break;
				case "Memory Limit Exceeded":
					tdr.css("color", "darkorange");
					break;
			}
			tr.append(tdl); tr.append(tdr);
			t_body.append(tr);
		}
		tb.append(t_body);
	} else {
		var no_data = $.app.t.tag.div(null, "暂无数据");
		no_data.css("text-align", "center");
		no_data.css("color", "darkgray");
		no_data.css("font-weight", "800");
		c2.append(no_data);
	}


	var b1 = $.app.t.box(null, c1);
	var b2 = $.app.t.box(null, c2);
	sidebar.append(b1);
	sidebar.append(b2);

	l.append($.app.t.box(null, main));
	r.append(sidebar);
	d.append(l);
	d.append(r);
	c.append(d);
	page.push(c);

	var code = $.app.t.container();
	code.css("padding-top", "5px");
	code.append($.app.t.tag.div("problem-h2", "提交代码"));
	var langChoose = $.app.t.tag.div("language-choose");
	langChoose.append($.app.t.tag.div("language-choose-son", "选择语言"));
	var selector = $.app.t.t("form");
	var slt = $.app.t.t("select");
	var c_99 = $.app.t.t("option"); c_99.attr("value", "C"); c_99.text("C");
	var cpp_11 = $.app.t.t("option"); cpp_11.attr("value", "C++ 11"); cpp_11.text("C++ 11");
	var cpp_14 = $.app.t.t("option"); cpp_14.attr("value", "C++ 14"); cpp_14.text("C++ 14");
	var cpp_17 = $.app.t.t("option"); cpp_17.attr("value", "C++ 17"); cpp_17.text("C++ 17");
	var py = $.app.t.t("option"); py.attr("value", "Python 3"); py.text("Python 3");
	cpp_11.attr("selected", "selected");
	slt.append(c_99);
	slt.append(cpp_11);
	slt.append(cpp_14);
	slt.append(cpp_17);
	slt.append(py);
	selector.append(slt);
	langChoose.append(selector);
	code.append(langChoose);
	var ce = $.app.t.tag.div("code-editor");
	ce.attr("id", "editor");
	code.append(ce);
	var submit_bt = $.app.t.t("button");
	submit_bt.addClass("submit-btn")
	submit_bt.text("提交测评");
	submit_bt.css("background-color", "crimson");
	submit_bt.css("color", "white");
	code.append(submit_bt);


	// change between problem and code
	var isProblem = true;
	var editor;
	bt.click(function() {
		l.empty();
		if (isProblem) {
			bt.text("返回题目");
			l.append($.app.t.box(null, code));
			editor = ace.edit("editor");
			editor.setTheme("ace/theme/xcode");
			editor.session.setMode("ace/mode/c_cpp");
			document.getElementById("editor").style.fontSize = '16px';
		} else {
			bt.text("提交答案");
			l.append($.app.t.box(null, main));
		}
		isProblem = !isProblem;
	});

	slt.change(function() {
		console.log(slt.val());
		if (slt.val() == "Python3") {
			editor.session.setMode("ace/mode/python");
		} else {
			editor.session.setMode("ace/mode/c_cpp");
		}
	});

	submit_bt.click(function() {
		var lang = slt.val();
		var source_code = editor.getValue();
		$.app.post("/submission/", {'problem': pid,
															 'lang': lang,
															 'source': source_code});
	});

  return page;
}