$.app = {
	APP_NAME: "STH Online Judge",
	API_URL: "http://43.140.246.28/api/",
	route: undefined,
	params: undefined,
	user: undefined,
	login: false,
	updateActiveUser: function (user, login) {
		this.user = user;
		this.login = login;
		sessionStorage["user"] = JSON.stringify(user);
		sessionStorage["login"] = login;
	},
	loadActiveUser: function () {
		if (sessionStorage["user"] != null) {
			this.user = JSON.parse(sessionStorage["user"]);
		}
		if (sessionStorage["login"] != null) {
			this.login = eval(sessionStorage["login"]);
		}
	},
	sync: async function () {
		const r = await this.get("/user/login/");
		if (r.statusCode == 401) {
			this.updateActiveUser(null);
		} else {
			this.updateActiveUser(r.data);
		}
	},
	setTitle: function (title) {
		document.title = title + " - " + this.APP_NAME;
	},
	request: async function (option) {
		option.headers = {
			"Content-Type": "application/json",
		};
		option.baseURL = this.API_URL;
		option.withCredentials = true;
		option.xsrfCookieName = "csrftoken";
		option.xsrfHeaderName = "X-CSRFToken";
		return await axios(option).catch((error) => {
			return error.response;
		});
	},
	get: async function (url, params) {
		return await this.request({
			url,
			method: 'get',
			params,
		});
	},
	post: async function (url, data) {
		return await this.request({
			url,
			method: 'post',
			data,
		});
	},
	t: {
		t: function (tagName) {
			return $("<" + tagName + "></" + tagName +">");
		},
		tag: {
			div: function (className, content) {
				var r = $("<div></div>");
				r.addClass(className);
				if (typeof(content) == "string") {
					r.text(content);
				} else {
					r.append(content);
				}
				return r;
			},
			a: function (className, href, content) {
				var r = $("<a></a>");
				r.addClass(className);
				r.attr("href", href);
				if (typeof(content) == "string") {
					r.text(content);
				} else {
					r.append(content);
				}
				return r;
			},
			img: function (className, src) {
				var r = $("<img></img>");
				r.addClass(className);
				r.attr("src", src);
				return r;
			},

			ul: function (className) {
				var r = $("<ul></ul>");
				r.addClass(className);
				return r;
			},
			li: function (className) {
				var r = $("<li></li>");
				r.addClass(className);
				return r;
			}
		},
		auth: function () {
			if ($.app.login) {
				return this.tag.a("header-link am-fr", "#/u/" + $.app.user.uid + "/", $.app.user.username);
			} else {
				return [
					this.tag.a("header-link am-fr", "#/register/", "注册"),
					this.tag.a("header-link am-fr", "#/login/", "登录"),
				];
			}
		},
		header: function (title) {
			if (title == null) {
				title = $.app.APP_NAME;
			}
			var r = this.tag.div("header");
			var c = this.tag.div("am-g am-g-fixed");
			if (typeof(title) == "string") {
				var t = this.t("h2");
				t.addClass("am-fl");
				t.text(title);
				c.append(t);
			} else {
				c.append(title);
			}
			c.append(this.auth());
			r.append(c);
			return r;
		},
		secondaryHeader: function (title) {
			var r = this.tag.div("secondary-header");
			var c = this.tag.div("am-g am-g-fixed");
			if (typeof(title) == "string") {
				var t = this.t("h1");
				t.text(title);
				c.append(t);
			} else {
				c.append(title);
			}
			r.append(c);
			return r;
		},
		container: function (items) {
			var r = this.tag.div("main-container am-container");
			r.append(items);
			return r;
		},
		box: function (width, items) {
			if (width == null) {
				width = 12;
			}
			var r = this.tag.div("am-panel am-panel-default am-u-sm-centered am-u-sm-" + width);
			var c = this.tag.div("box am-panel-bd");
			c.append(items);
			r.append(c);
			return r;
		},
	},

	problem: {
		get_problems: async function () {
			var problem_list = (await $.app.get("/problem/")).data.problems;
			var r = $.app.t.tag.div("am-list-news am-list-news-default");
			var title = $.app.t.tag.div("am-list-news-hd am-cf");
			var stat = $.app.t.t("h2");
			stat.addClass("pstatus");
			stat.text("状态")
			var pid = $.app.t.t("h2");
			pid.addClass("pid");
			pid.text("题号")
			var pname = $.app.t.t("h2");
			pname.addClass("pname");
			pname.text("题目名称")
			var ppass = $.app.t.t("h2");
			ppass.addClass("ppass");
			ppass.text("通过率");
			title.append(stat);
			title.append(pid);
			title.append(pname);
			title.append(ppass);
			r.append(title);
			var lis = $.app.t.tag.div("am-list-news-bd");
			var ul = $.app.t.tag.ul("am-list");
			for (let i = 0; i < problem_list.length; i++) {
				ul.append(this.problem_row(problem_list[i]));
			}
			lis.append(ul);
			r.append(lis);
			return r;
		},

		problem_row: function (item) {
			var r = $.app.t.tag.li("am-g am-list-item-dated");
			var info = $.app.t.tag.div("am-list-news-hd am-cf");
			var stat = $.app.t.t("h2");
			stat.addClass("pstatus");
			stat.text("0");
			var pid = $.app.t.t("h2");
			pid.addClass("pid");
			pid.text(item.pid);
			var pname = $.app.t.t("h2");
			pname.addClass("pname");
			pname.append($.app.t.tag.a("am-list-item-hd", "##", item.title));
			var ppass = $.app.t.t("h2");
			ppass.addClass("ppass");
			ppass.text("0");
			info.append(stat);
			info.append(pid);
			info.append(pname);
			info.append(ppass);
			r.append(info);
			return r;
		}
	}
};