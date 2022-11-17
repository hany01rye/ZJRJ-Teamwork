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
		loadActiveUser();
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
		}
	},
};