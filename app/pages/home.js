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

function calendar() {
	return $.app.t.tag.div("am-text-center am-text-sm", "距 <strong>BCPC2022 决赛</strong> 还剩 <strong>15 天</strong>");
}

export async function render() {
	return [
		$.app.t.header(),
		$.app.t.container([
			$.app.t.boxes([
				$.app.t.box(8, [
					$.app.t.tag.div("am-slider am-slider-default", [

					]),
				]),
				$.app.t.box(4, [
					$.app.t.tag.div("am-text-center", [
						calendar(),
					]),
				]),
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