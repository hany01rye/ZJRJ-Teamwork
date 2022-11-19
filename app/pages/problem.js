export async function render() {
  var pid = $.app.params.pid;
	var problem = (await $.app.get("/problem/" + pid + "/"));
	if (problem.status != 200) {
		import("./pages/error.js");		// bug
		return;
	}
	var problem = problem.data;
	console.log(problem);
  var page = [];

	page.push($.app.t.header());
	var hd = $.app.t.tag.div("problem-head");
	var wrap = $.app.t.tag.div("am-g am-g-fixed problem-head-wrap");
	wrap.append($.app.t.tag.div("problem-head-title", problem.title));
	var tl = problem.judge_info.time_limit / 1000;
	var ml = problem.judge_info.memory_limit / 1024;
	wrap.append($.app.t.tag.div("problem-head-sub", "Time Limit: " + tl + " s"));
	wrap.append($.app.t.tag.div("problem-head-sub", "Memory Limit: " + ml + " MiB"));
	hd.append(wrap);
  page.push(hd);

	var c = $.app.t.container();
	var d = $.app.t.tag.div("am-g");
	var l = $.app.t.tag.div("am-u-sm-8");
	l.css("padding-right", "0.5rem");
	var r = $.app.t.tag.div("am-u-sm-4");
	r.css("padding-left", "0.5rem");

	var main = $.app.t.container();
	var p = problem.statement.sections;
	console.log(p);
	for (var i in p) {
		if (p[i].is_sample) {
			var sec = $.app.t.t("div");
			var t = $.app.t.tag.div("problem-h2", "Sample");
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
				lt.append($.app.t.tag.div("sample-title", "Input #" + (parseInt(j) + 1)));
				rt.append($.app.t.tag.div("sample-title", "Output #" + (parseInt(j) + 1)));
				var cl = $.app.t.t("button"); cl.addClass("copy-button"); cl.text("Copy")
				var cr = $.app.t.t("button"); cr.addClass("copy-button"); cr.text("Copy")
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
		ct.html(marked.parse(problem.statement.sections[i].content));
		sec.append(t);
		sec.append(ct);
		main.append(sec);
	}

	var sidebar = $.app.t.container();
	sidebar.css("padding-top", "0");
	var c1 = $.app.t.container();
	c1.css("padding", "5px");
	var statisticsTitle = $.app.t.tag.div("sidebar-title", "Statistics");
	c1.append(statisticsTitle);
	var statisticRow = $.app.t.tag.div("am-g");
	statisticRow.css("padding-top", "8px");
	var solved = $.app.t.tag.div("am-u-sm-4");
	var all = $.app.t.tag.div("am-u-sm-4");
	var ratio = $.app.t.tag.div("am-u-sm-4");
	solved.css("text-align", "center");
	all.css("text-align", "center");
	ratio.css("text-align", "center");
	solved.append($.app.t.tag.div("statistic-num", "0"));
	solved.append($.app.t.tag.div("statistic-son", "Solved"));
	all.append($.app.t.tag.div("statistic-num", "0"));
	all.append($.app.t.tag.div("statistic-son", "All"));
	ratio.append($.app.t.tag.div("statistic-num", "0"));
	ratio.append($.app.t.tag.div("statistic-son", "Ratio"));
	statisticRow.append(solved);
	statisticRow.append(all);
	statisticRow.append(ratio);
	c1.append(statisticRow);

	var c2 = $.app.t.container();
	c2.css("padding", "5px");
	var submissionsTitle = $.app.t.tag.div("sidebar-title", "Submissions");
	c2.append(submissionsTitle);
	var tb = $.app.t.t("table");
	tb.addClass("am-table am-table-centered");
	tb.append($("<thead><tr><th>ID</th><th>Result</th></tr></thead>").css("color", "darkgray"));

	c2.append(tb);

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

  return page;
}