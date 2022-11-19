function myform(text, id, type) {
	var r = $.app.t.tag.div("am-input-group am-center space");
	var s = $("<input></input>");
	s.attr("id", id);
	s.attr("placeholder", text);
	s.addClass("am-form-field");
	if (type == 0) s.attr("type", "username");
	else s.attr("type", "password");
	r.append(s);
	return r;
}

function mybutton(text, id) {
	var r = $.app.t.tag.div("space");
	var s = $("<button type=\"submit\" id=\" + id + \" class=\"am-btn am-btn-primary am-center am-radius\">" + text + "</button>");
	s.click(async () => {
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var res = await $.app.post("/user/login/", {username: username, password: password});
		if (res.status == 401) {
			alert("用户名或密码错误！");
		} else {
            window.location.href = "#/";
		}
	});
	r.append(s);
	return r;
}

export async function render() {
	return [
		$.app.t.header(),
		$.app.t.container([
			$.app.t.box(6, [
				$.app.t.tag.div("am-text-center", [
					$("<h1>欢迎回到 " + $.app.APP_NAME + "</h1>"),
					myform("用户名", "username", 0),
					myform("密码", "password", 1),
					mybutton("登录", "login"),
					$.app.t.tag.div("am-u-md-12 space", "没有账号？<a href=\"#/register/\">注册</a>"),
				]),
			]),
		]),
	];
}