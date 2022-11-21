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
		this.loadActiveUser();
		const r = await this.get("/user/login/");
		if (r.status == 401) {
			this.updateActiveUser(null, false);
		} else {
			this.updateActiveUser(r.data, true);
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
					r.html(content);
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
					r.html(content);
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
			},
		},
		auth: function () {
			if ($.app.login) {
				var logout = this.tag.a("header-link am-fr", "", "注销");
				logout.click(async () => {
					await $.app.get("/user/logout/");
            		window.location.href = "#/";
				});
				return [
					logout,
					this.tag.a("header-link am-fr", "#/u/" + $.app.user.uid + "/", $.app.user.username),
				];
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
		boxes: function (items) {
			var w = this.tag.div("am-g display-flex");
			w.append(items);
			w.children().addClass("display-flex");
			w.find("div").removeClass("single-box am-u-sm-centered");
			w.find(".am-panel").addClass("full-width");
			return w;
		},
		box: function (width, items) {
			if (width == null) {
				width = 12;
			}
			var w = this.tag.div("single-box am-u-sm-centered am-u-sm-" + width);
			var r = this.tag.div("am-panel am-panel-default");
			var c = this.tag.div("am-panel-bd am-cf");
			c.append(items);
			r.append(c);
			w.append(r);
			return w;
		},
		list: function (items) {
			var r = this.t("ul");
			r.addClass("am-list");
			for (var i = 0; i < items.length; i++) {
				var c = this.t("li");
				c.append(items[i]);
				r.append(c);
			}
			return r;
		},
	},

	problem: {
		get_problems: async function () {
			var problem_list = (await $.app.get("/problem/")).data.problems;
			var vis = new Array(problem_list.length).fill(0);
			$.app.user = (await $.app.get("/user/10/")).data; // test
			if ($.app.user) {
				var statistics_lis = (await $.app.get("/user/" + $.app.user.uid + "/statistics/")).data.accepted;
				for (var i = 0; i < statistics_lis.length; i++) {
					vis[statistics_lis[i].pid - 1] = 1;
				}
			}
			var r = $.app.t.t("table");
			r.addClass("am-table");
			r.append("<thead><tr><th>状态</th><th>题号</th><th>题目名称</th><th>通过率</th></tr></thead>");
			var body = $.app.t.t("tbody");
			for (var i = 0; i < problem_list.length; i++) {
				body.append(this.problem_row(problem_list[i], vis[i]));
			}
			r.append(body);
			return r;
		},

		problem_row: function (item, stat) {
			var r = $.app.t.t("tr");
			var td = $.app.t.t("td");
			td.css("padding-left", "14px");
			var pic = $.app.t.t("i");
			if (stat) {
				pic.addClass("fa-regular fa-check")
				pic.css("color", "green");
			} else {
				pic.addClass("fa-regular fa-minus")
				td.append(pic)
			}
			pic.css("font-style", "normal");
			td.append(pic)
			r.append(td);

			var td = $.app.t.t("td");
			td.css("padding-left", "16px");
			td.text(item.pid);
			r.append(td);

			var td = $.app.t.t("td");
			td.append($.app.t.tag.a(null, "#/p/" + item.pid, item.title));
			r.append(td);

			var td = $.app.t.t("td");
			var ratio = $.app.t.t("meter");
			ratio.attr("min", "0");
			ratio.attr("max", item.submission_count);
			ratio.attr("value", item.accepted_count);
			td.append(ratio);
			// td.text(item.accepted_count + "/" + item.submission_count);
			r.append(td);
			return r;
		},
	},
};