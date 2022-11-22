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
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		var repeat = document.getElementById("repeat").value;
        if (password != repeat) {
            alert("前后密码不一致！");
            return;
        }
		var res = await $.app.post("/user/", {username: username, email: email, password: password, repeat: repeat});
        console.log(res);
        if (res != 201) {
            for (let key in res.data) {
                alert("Error with " + key + ": " + res.data[key][0]);
                break;
            }
        } else {
            alert("注册成功");
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
					$("<h1>欢迎加入 " + $.app.APP_NAME + "</h1>"),
					myform("用户名", "username", 0),
					myform("邮箱地址", "email", 0),
					myform("密码", "password", 1),
					myform("重复密码", "repeat", 1),
					mybutton("注册", "register"),
					$.app.t.tag.div("am-u-md-12 space", [
                        $("<span>已有账号？<span>"),
                        $("<a href=\"#/login/\">登录</a>")]
                        ),
				]),
			]),
		]),
	];
}