function mdEscapeChar(c) {
	if (c == "\\") {
		return "\\\\";
	}
	if (c == "_") {
		return "\\_";
	}
	if (c == "*") {
		return "\\*";
	}
	return c;
}

function mdEscape(s) {
	var t = "";
	var inMath = false;
	var tok = "", esctok = "";
	var ldelim = "";
	var newline = 0;
	for (var i = 0; i < s.length; i++) {
		if (i < s.length - 2 && s[i] == "`" && s[i + 1] == "`" && s[i + 2] == "`") {
			var linecnt = 0;
			var r = i + 1;
			while (r < s.length - 2) {
				if (s[r] == "\n") {
					linecnt++;
				}
				if (linecnt > 0 && s[r] == "`" && s[r + 1] == "`" && s[r + 2] == "`") {
					break;
				}
				r++;
			}
			if (r < s.length - 2 && linecnt > 0 && s[r] == "`" && s[r + 1] == "`" && s[r + 2] == "`") {
				if (inMath && (ldelim == "$" || ldelim == "\\(")) {
					inMath = false;
					t += ldelim + tok;
				}
				if (!inMath) {
					while (i < r) {
						t += s[i];
						i++;
					}
					while (s[i + 1] == "`") {
						t += s[i];
						i++;
					}
					t += s[i];
					continue;
				}
			}
		}
		if (!inMath) {
			if (i < s.length - 1 && s[i] == "`" && s[i + 1] != "`") {
				var r = i + 1;
				while (r < s.length && s[r] != "\n" && s[r] != "`") {
					r++;
				}
				if (r < s.length && s[r] == "`") {
					while (i < r) {
						t += s[i];
						i++;
					}
					t += s[r];
					continue;
				}
			}
			if (i < s.length - 1 && s[i] == "\\" && "[(".includes(s[i + 1])) {
				ldelim = s[i] + s[i + 1];
				i++;
				inMath = true;
				esctok = tok = "";
				newline = 0;
				continue;
			}
			if (i < s.length - 1 && s[i] == "$" && s[i + 1] == "$") {
				ldelim = s[i] + s[i + 1];
				i++;
				inMath = true;
				esctok = tok = "";
				newline = 0;
				continue;
			}
			if (s[i] == "$" && (i == 0 || s[i - 1] != "\\") && i < s.length - 1 && s[i + 1] != " " && s[i + 1] != "$") {
				ldelim = s[i];
				inMath = true;
				esctok = tok = "";
				newline = 0;
				continue;
			}
			t += s[i];
			continue;
		}
		if (s[i] == "\n") {
			newline++;
		}
		if (!" \n\r\t".includes(s[i])) {
			newline = 0;
		}
		if ((ldelim == "$" || ldelim == "\\(") && newline >= 2) {
			inMath = false;
			t += ldelim + tok + s[i];
			continue;
		}
		if (ldelim == "\\(" && i < s.length - 1 && s[i] == "\\" && s[i + 1] == ")" && s[i - 1] != "\\") {
			inMath = false;
			t += ldelim + esctok + s[i] + s[i + 1];
			i++;
			continue;
		}
		if (ldelim == "\\[" && i < s.length - 1 && s[i] == "\\" && s[i + 1] == "]" && s[i - 1] != "\\") {
			inMath = false;
			t += ldelim + esctok + s[i] + s[i + 1];
			i++;
			continue;
		}
		if (ldelim == "$$" && i < s.length - 1 && s[i] == "$" && s[i + 1] == "$" && s[i - 1] != "\\") {
			inMath = false;
			t += ldelim + esctok + s[i] + s[i + 1];
			i++;
			continue;
		}
		if (ldelim == "$" && s[i] == "$" && s[i - 1] != "\\" && s[i - 1] != " " && (i < s.length + 1 || !"0123456789".includes(s[i + 1]))) {
			inMath = false;
			t += ldelim + esctok + s[i];
			continue;
		}
		tok += s[i];
		esctok += mdEscapeChar(s[i]);
	}
	if (inMath) {
		t += ldelim + tok;
	}
	return t;
}

export async function render() {
	// var title_map = new Map([['', '????????????'], ['Input', '????????????'], ['Output', '????????????']])
  var pid = $.app.params.pid;
	var problem = (await $.app.get("/problem/" + pid + "/"));
	var problem = problem.data;
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
	bt.text("????????????");
	if ($.app.user)
		bottom.append(bt);
	else
		bottom.append($.app.t.tag.div(null));

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
	pass.append($.app.t.tag.div(null, "??????"));
	pass.append($.app.t.tag.div(null, problem.submission_count));
	all.append($.app.t.tag.div(null, "??????"));
	all.append($.app.t.tag.div(null, problem.accepted_count));
	time.append($.app.t.tag.div(null, "????????????"))
	time.append($.app.t.tag.div(null, tl + " s"))
	memory.append($.app.t.tag.div(null, "????????????"))
	memory.append($.app.t.tag.div(null, ml + " MB"))
	info.append(pass); info.append(all); info.append(time); info.append(memory);
	bottom.append(info);
	wrap.append(bottom);
	hd.append(wrap);
  page.push(hd);


	main.css("padding-top", "5px");
	var p = problem.statement.sections;
	for (var i in p) {
		if (p[i].is_sample) {
			var sec = $.app.t.t("div");
			var t = $.app.t.tag.div("problem-h2", p[i].title);
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
				input.attr("id", "input" + j);
				output.attr("id", "output" + j);

				var lt = $.app.t.tag.div("sample"); var rt = $.app.t.tag.div("sample");
				lt.append($.app.t.tag.div("sample-title", "?????? #" + (parseInt(j) + 1)));
				rt.append($.app.t.tag.div("sample-title", "?????? #" + (parseInt(j) + 1)));
				var cl = $.app.t.t("button"); cl.addClass("copy-button"); cl.text("??????");
				var cr = $.app.t.t("button"); cr.addClass("copy-button"); cr.text("??????");
				cl.attr("id", j);
				cr.attr("id", j);
				cl.click(async function() {
					try {
						var it = $(this);
						var copy_text = $("#input" + it.attr("id")).text();
						if (navigator.clipboard && window.isSecureContext) {
							await navigator.clipboard.writeText(copy_text);
						} else {
							let textArea = document.createElement("textarea");
							textArea.value = copy_text;
							textArea.style.position = "fixed";
							textArea.style.left = "-999999px";
							textArea.style.top = "-999999px";
							document.body.appendChild(textArea);
							textArea.focus();
							textArea.select();
							await new Promise((res, rej) => {
									document.execCommand('copy') ? res() : rej();
									textArea.remove();
							});
						}
						it.text("????????????");
						it.css("background-color", "#0e90d2");
						it.css("color", "white");
						setTimeout(
							function() {
								it.text("??????");
								it.css("background-color", "white");
								it.css("color", "#0e90d2");
							}, 500);
					} catch (e) {
						console.log(e);
					}
				});
				cr.click(async function() {
					try {
						var it = $(this);
						var copy_text = $("#output" + it.attr("id")).text();
						if (navigator.clipboard && window.isSecureContext) {
							await navigator.clipboard.writeText(copy_text);
						} else {
							let textArea = document.createElement("textarea");
							textArea.value = copy_text;
							textArea.style.position = "fixed";
							textArea.style.left = "-999999px";
							textArea.style.top = "-999999px";
							document.body.appendChild(textArea);
							textArea.focus();
							textArea.select();
							await new Promise((res, rej) => {
									document.execCommand('copy') ? res() : rej();
									textArea.remove();
							});
						}
						it.text("????????????");
						it.css("background-color", "#0e90d2");
						it.css("color", "white");
						setTimeout(
							function() {
								it.text("??????");
								it.css("background-color", "white");
								it.css("color", "#0e90d2");
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
		var t = $.app.t.tag.div("problem-h2", p[i].title);
		var ct = $.app.t.t("div");
		ct.html(marked.parse(mdEscape(problem.statement.sections[i].content)));
		sec.append(t);
		sec.append(ct);
		main.append(sec);
	}

	sidebar.css("padding-top", "0");
	var c1 = $.app.t.tag.div();
	var auth = $.app.t.tag.div("side-row");
	auth.append($.app.t.tag.div(null, "???????????????"));
	auth.append($.app.t.tag.div(null, uName))
	c1.append(auth);
	var stat = $.app.t.tag.div("side-row");
	if ($.app.user) {
		stat.append($.app.t.tag.div(null, "????????????"));
		var path = "/submission/?submitter=" + $.app.user.uid + "&problem=" + pid + "&status=Accepted";
		var accept_check = (await $.app.get(path)).data.submissions;
		if (accept_check) {
			if (accept_check.length > 0) {
				var ac = $.app.t.tag.div(null, "Accepted");
				ac.css("color", "green");
				stat.append(ac);
			} else {
				var submit_data = (await $.app.get("/submission/?submitter=" + $.app.user.uid + "&problem=" + pid)).data.submissions;
				if (submit_data.length > 0) {
					var st = submit_data[0].status;
					var not_ac = $.app.t.tag.div(null, st);
					switch (st) {
						case "Wrong Answer":
							not_ac.css("color", "red");
							break;
						case "Compilation Error":
							not_ac.css("color", "darkgray");
							break;
						case "Runtime Error":
							not_ac.css("color", "gold");
							break;
						case "Time Limit Exceeded":
							not_ac.css("color", "darkorange");
							break;
						case "Memory Limit Exceeded":
							not_ac.css("color", "darkorange");
							break;
					}
					stat.append(not_ac);
				} else {
					var no_submission = $.app.t.tag.div(null, "????????????");
					stat.append(no_submission);
				}
			}
		} else {
			var no_submission = $.app.t.tag.div(null, "????????????");
			stat.append(no_submission);
		}
	}
	c1.append(stat);

	var c2 = $.app.t.tag.div();
	var submissionsTitle = $.app.t.tag.div("sidebar-title", "????????????");
	c2.append(submissionsTitle);
	var tb = $.app.t.t("table");
	tb.addClass("am-table am-table-centered");
	tb.append($("<thead><tr><th>ID</th><th>??????</th></tr></thead>").css("color", "darkgray"));
	c2.append(tb);
	if ($.app.user) {
		var uid = $.app.user.uid;
		var submit_data = (await $.app.get("/submission/?submitter=" + uid + "&problem=" + pid)).data.submissions;
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
		var no_data = $.app.t.tag.div(null, "????????????");
		no_data.css("text-align", "center");
		no_data.css("color", "darkgray");
		no_data.css("font-weight", "800");
		c2.append(no_data);
	}


	var b1 = $.app.t.box(null, c1);
	var b2 = $.app.t.box(null, c2);
	sidebar.append(b1);
	sidebar.append(b2);

	var page1 = $.app.t.box(null, main);
	l.append(page1);
	r.append(sidebar);
	d.append(l);
	d.append(r);
	c.append(d);
	page.push(c);

	var code = $.app.t.tag.div();
	code.append($.app.t.tag.div("problem-h2", "????????????"));
	var langChoose = $.app.t.tag.div("language-choose");
	langChoose.append($.app.t.tag.div("language-choose-son", "????????????"));
	var selector = $.app.t.t("form");
	var slt = $("<select data-am-selected></select>");
	var c_99 = $.app.t.t("option"); c_99.attr("value", "C"); c_99.text("C");
	var cpp_11 = $.app.t.t("option"); cpp_11.attr("value", "C++ 11"); cpp_11.text("C++ 11");
	var cpp_14 = $.app.t.t("option"); cpp_14.attr("value", "C++ 14"); cpp_14.text("C++ 14");
	var cpp_17 = $.app.t.t("option"); cpp_17.attr("value", "C++ 17"); cpp_17.text("C++ 17");
	var py = $.app.t.t("option"); py.attr("value", "Python 3"); py.text("Python 3");
	cpp_11.attr("selected", true);
	slt.ready(() => {
		slt.selected();
	});
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
	submit_bt.text("????????????");
	submit_bt.css("background-color", "crimson");
	submit_bt.css("color", "white");
	code.append(submit_bt);


	// change between problem and code
	var isProblem = true;
	var page2 = $.app.t.box(null, code);
	var editor;
	l.append(page2);
	page2.hide();
	bt.click(function() {
		if (isProblem) {
			bt.text("????????????");
			page2.show();
			page1.hide();
			editor = ace.edit("editor");
			editor.setTheme("ace/theme/xcode");
			editor.session.setMode("ace/mode/c_cpp");
			document.getElementById("editor").style.fontSize = '16px';
		} else {
			bt.text("????????????");
			page1.show();
			page2.hide();
		}
		isProblem = !isProblem;
	});

	slt.change(function() {
		if (slt.val() == "Python 3") {
			editor.session.setMode("ace/mode/python");
		} else {
			editor.session.setMode("ace/mode/c_cpp");
		}
	});

	submit_bt.click(async function() {
		var lang = slt.val();
		var source_code = editor.getValue();
		var r = await $.app.post("/submission/", {'problem': pid,
															 'lang': lang,
															 'source': source_code});
		window.location.hash = "#/s/" + r.data.sid + "/";
	});
	$.app.setTitle(problem.title);

  return page;
}