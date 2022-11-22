function icon(name) {
	var icon = $.app.t.t("span");
	icon.addClass("am-icon-" + name);
	return icon;
}

function pagelink(page) {
	var url = "#/s/?page=" + page;
	if ($.app.params["problem"]) {
		url = url + "&problem=" + $.app.params["problem"];
	}
	if ($.app.params["submitter"]) {
		url = url + "&submitter=" + $.app.params["submitter"];
	}
	if ($.app.params["status"]) {
		url = url + "&status=" + $.app.params["status"];
	}
	return url;
}

function dropdown(name, selected, options) {
	var r = $.app.t.t("select");
	r.attr("id", name);
	for (var i in options) {
		var o = $.app.t.t("option");
		o.attr("value", i);
		o.text(options[i]);
		if (i == selected) {
			o.attr("selected", true);
		}
		r.append(o);
	}
	r.ready(() => {
		r.selected();
	});
	return r;
}

function filter(s) {
	var label = (className, name) => $("<label class=\"am-form-label " + (className ? className : "") + "\">" + name + "</label>");
	var input = (type, id, val, placeholder) => {
		var r = $("<input type=\"" + type + "\" id=\"" + id + "\" placeholder=\"" + placeholder + "\" />");
		r.val(val);
		return r;
	};

	var submit = $.app.t.t("button");
	submit.addClass("am-btn am-btn-primary");
	submit.text("筛选记录");
	submit.click(() => {
		window.location.hash = "#/s/?problem=" + $("#problem").val() + "&submitter=" + $("#submitter").val() + "&status=" + ($("#status").val() == "null" ? "" : $("#status").val());
	});

	var form = $.app.t.t("div");
	form.addClass("am-form am-form-horizontal");
	form.append([
		$.app.t.tag.div("am-form-group", [
			$.app.t.tag.div("am-u-sm-3", [
				input("number", "problem", $.app.params["problem"], "题目编号"),
			]),
			$.app.t.tag.div("am-u-sm-3", [
				input("number", "submitter", $.app.params["submitter"], "用户编号"),
			]),
			$.app.t.tag.div("am-u-sm-3", [
				dropdown("status", $.app.params["status"], {
					null: "所有状态",
					"Accepted": "Accepted",
					"Wrong Answer": "Wrong Answer",
					"Runtime Error": "Runtime Error",
					"Time Limit Exceeded": "Time Limit Exceeded",
					"Memory Limit Exceeded": "Memory Limit Exceeded",
					"Compilation Error": "Compilation Error",
				}),
			]),
			$.app.t.tag.div("am-u-sm-3", [
				submit,
			]),
		]),
	]);
	return [
		$("<h2>查找记录</h2>"),
		form,
		$.app.t.tag.div(null, "共计 " + s.total + " 条结果"),
	];
}

function td(content, className) {
	var r = $.app.t.t("td");
	r.append(content);
	r.addClass(className);
	return r;
}

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
	var icon = $.app.t.t("span");
	icon.addClass("am-icon-clock-o submission-info-icon");
	var r = $.app.t.t("span");
	if (!tl) {
		r.text("N / A");
	} else {
		r.text(tl + " ms");
	}
	return [icon, r];
}
function ml_formatter(ml) {
	var icon = $.app.t.t("span");
	icon.addClass("am-icon-file-text-o submission-info-icon");
	var r = $.app.t.t("span");
	if (!ml) {
		r.text("N / A");
	} else if (ml <= 1024) {
		r.text(ml + " KiB");
	} else {
		r.text((ml / 1024).toFixed(2) + " MiB");
	}
	return [icon, r];
}
function lang_formatter(lang) {
	var icon = $.app.t.t("span");
	icon.addClass("am-icon-code submission-info-icon");
	var r = $.app.t.t("span");
	r.text(lang);
	return [icon, r];
}

function getrow(s) {
	var r = $.app.t.t("tr");
	r.addClass("submission-row");
	var imgurl = s.submitter.avatar;
	if (!imgurl) {
		imgurl = "app/asset/otter/icecream.png";
	}
	r.append(td($.app.t.tag.div(null, $.app.t.tag.img("submission-avatar", imgurl)), "submission-avatar-container"));
	r.append(td($.app.t.tag.div(null, [
		$.app.t.tag.div("submission-user", [
			$.app.t.tag.a(null, "#/u/" + s.submitter.uid + "/", s.submitter.username),
		]),
		$.app.t.tag.div("am-text-sm submission-info", moment(s.submit_time).format("YYYY/MM/DD kk:mm:ss")),
	])));
	r.append(td($.app.t.tag.div(null, [
		$.app.t.tag.a(null, "#/s/" + s.sid + "/", colorize(s.status)),
	])));
	r.append(td($.app.t.tag.div(null, [
		$.app.t.tag.a(null, "#/p/" + s.problem.pid + "/", s.problem.title),
	])));
	r.append(td($.app.t.tag.div("am-text-sm submission-info", tl_formatter(s.time_used))));
	r.append(td($.app.t.tag.div("am-text-sm submission-info", ml_formatter(s.memory_used))));
	r.append(td($.app.t.tag.div("am-text-sm submission-info", lang_formatter(s.lang))));
	return r;
}

export async function render() {
	var page = 1;
	if ($.app.params["page"]) {
		page = parseInt($.app.params["page"]);
	}
	var params = {
		skip: (page - 1) * 15,
		count: 15,
		problem: $.app.params["problem"],
		submitter: $.app.params["submitter"],
		status: $.app.params["status"],
	};
	var r = await $.app.get("/submission/", params);
	var data = r.data;

	var form = filter(data);

	var table = $.app.t.t("table");
	table.addClass("submission-table");
	var tbody = $.app.t.t("tbody");
	for (var id in data.submissions) {
		tbody.append(getrow(data.submissions[id]));
	}
	table.append(tbody);

	var pagination = $.app.t.tag.ul("am-pagination am-pagination-right");
	var maxpage = Math.ceil(data.total / 15);

	var r = $.app.t.tag.li(page == 1 ? "am-disabled" : null);
	r.append($.app.t.tag.a(null, pagelink(1), icon("angle-double-left")));
	pagination.append(r);
	var r = $.app.t.tag.li(page - 1 < 1 ? "am-disabled" : null);
	r.append($.app.t.tag.a(null, pagelink(page - 1), icon("angle-left")));
	pagination.append(r);
	for (var i = page - 5; i <= page + 5; i++) {
		if (1 <= i && i <= maxpage) {
			var r = $.app.t.tag.li(i == page ? "am-active" : null);
			r.append($.app.t.tag.a(null, pagelink(i), i));
			pagination.append(r);
		}
	}
	var r = $.app.t.tag.li(page + 1 > maxpage ? "am-disabled" : null);
	r.append($.app.t.tag.a(null, pagelink(page + 1), icon("angle-right")));
	pagination.append(r);
	var r = $.app.t.tag.li(page == maxpage ? "am-disabled" : null);
	r.append($.app.t.tag.a(null, pagelink(maxpage), icon("angle-double-right")));
	pagination.append(r);

	return [
		$.app.t.header(),
		$.app.t.secondaryHeader("提交列表"),
		$.app.t.container([
			$.app.t.box(null, form),
			$.app.t.box(null, [
				table,
				pagination,
			]),
		]),
	];
}