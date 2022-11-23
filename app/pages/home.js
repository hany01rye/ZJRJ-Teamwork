function jump() {
	var p = $.app.t.t("p");
	var r = $.app.t.t("button");
	r.text("跳转");
	r.addClass("am-btn am-btn-danger am-btn-sm");
	r.click(() => {
		window.location.hash = "#/p/" + $("#pid").val() + "/";
	});
	p.append(r);
	return p;
}

function slider() {
	var c = $.app.t.tag.ul("am-slides");
	c.append($("<li><img src='app/asset/gallery/pic1.png' /></li>"));
	c.append($("<li><img src='app/asset/gallery/pic2.png' /></li>"));
	var r = $.app.t.tag.div("am-slider am-slider-default", c);
	r.flexslider();
	return r;
}

function calendar() {
	var r = $.app.t.tag.div("am-text-center");
	var days = 1 + moment.duration(moment("2022-12-03T13:00:00+08:00").diff(moment())).days();
	var countdown = $.app.t.tag.div("am-text-center am-text", "距 <strong>BCPC2022 决赛</strong> 还剩 <strong>" + days + " 天</strong>");
	var today = $.app.t.tag.div("calendar");
	var month = $.app.t.tag.div("calendar-month");
	var date = $.app.t.tag.div("calendar-date");
	var week = $.app.t.tag.div("calendar-week");
	// TODO
	month.text(moment().locale("zh-CN").format("MMMM"));
	date.text(moment().locale("zh-CN").format("DD"));
	week.text(moment().locale("zh-CN").format("dddd"));
	today.append(month); today.append(date); today.append(week);
	r.append(today);
	r.append(fortune());
	r.append(countdown);
	return r;
}

function fortune() {
	if (!$.app.login) {
		return $.app.t.tag.div(null);
	}
	var curDate = new Date();
	var year = curDate.getYear();
	var month = curDate.getMonth() + 1;
	var date = curDate.getDate();
	var week = curDate.getDay();

	var id;
	// TEST
	if (!$.app.user) id = 1;
	else id = $.app.user.uid;
	var op = (id * year + month * date + week) % 4;

	var r = $.app.t.tag.div(null);
	var luck = $.app.t.tag.div("fortune");
	switch (op) {
		case 0:
			luck.text("§中平§");
			luck.css("color", "green");
			break;
		case 1:
			luck.text("§小吉§");
			luck.css("color", "deeppink");
			break;
		case 2:
			luck.text("§中吉§");
			luck.css("color", "crimson");
			break;
		case 3:
			luck.text("§大吉§");
			luck.css("color", "red");
			break;
	}
	r.append(luck);
	return r;
}

export async function render() {
	var cont = $.app.t.t("div");
	cont.append($.app.t.tag.div("am-text-center", calendar()));
	// var luck_button = $.app.t.t("button");
	// luck_button.addClass("am-btn am-btn-warning");
	// luck_button.text("点击打卡");
	// TEST
	// if ($.app.user) {
	// cont.append($.app.t.tag.div("am-text-center", luck_button));
	// }

	// luck_button.click(function() {
	//	cont.empty();
	//	cont.append(fortune());
	// });
	// var rhs = $.app.t.box(4, cont);
	return [
		$.app.t.header(),
		$.app.t.container([
			$.app.t.boxes([
				$.app.t.box(8, [
					slider(),
				]),
				$.app.t.box(4, cont),
			]),
			$.app.t.boxes([
				$.app.t.box(4, [
					$.app.t.tag.div(null, "<h2>快速跳转</h2>"),
					$.app.t.tag.div("am-input-group am-input-group-primary am-input-group-sm full-width", [
						$("<input class='am-form-field' id='pid' placeholder='请输入题号'>"),
					]),
					jump(),
				]),
				$.app.t.box(4, [
					$.app.t.tag.div(null, "<h2>更多 OJ</h2>"),
					$.app.t.list([
						$.app.t.tag.a(null, "https://codeforces.com", "Codeforces"),
						$.app.t.tag.a(null, "https://atcoder.jp", "AtCoder"),
					]),
				]),
				$.app.t.box(4, [
					$.app.t.tag.div(null, "<h2>友情链接</h2>"),
					$.app.t.list([
						$.app.t.tag.a(null, "https://cvbbacm.com", "北航 ACM 竞赛"),
						$.app.t.tag.a(null, "https://accoding.buaa.edu.cn/acm/2022", "BCPC2022 赛事信息"),
					]),
				]),
			]),
		]),
	];
}