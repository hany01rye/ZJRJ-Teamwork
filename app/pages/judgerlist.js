function getrow(j) {
	var r = $.app.t.t("tr");
    const lasttime = moment(j.user.last_online_time);
    const last_online_time = lasttime.fromNow();
	var online = moment.duration(moment().diff(lasttime)).asMinutes() <= 1;
	r.append($.app.t.t("td").text(j.jid));
	r.append($.app.t.t("td").text(online ? "在线" : "离线"));
	r.append($.app.t.t("td").text(j.info));
	r.append($.app.t.t("td").text(moment(j.user.registration_time).format("YYYY/MM/DD kk:mm:ss")));
	return r;
}

function judger(j) {
	var table = $.app.t.t("table").addClass("am-table");
	var thead = $.app.t.t("thead").append([
		$.app.t.t("tr").append([
			$.app.t.t("th").text("#"),
			$.app.t.t("th").text("状态"),
			$.app.t.t("th").text("名称"),
			$.app.t.t("th").text("启用时间"),
		]),
	]);
	var tbody = $.app.t.t("tbody");
	for (var id in j) {
		tbody.append(getrow(j[id]));
	}
	table.append([thead, tbody]);
	return table;
}

export async function render() {
	var r = await $.app.get("/judger/");
	var data = r.data;

	return [
		$.app.t.header(),
		$.app.t.secondaryHeader("评测机列表"),
		$.app.t.container([
			$.app.t.box(null, judger(data.judgers)),
		]),
	];
}