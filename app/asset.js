$.app = {
	APP_NAME: "Online Judge",
	API_URL: "http://43.140.246.28/api/",
	route: undefined,
	param: undefined,
	user: undefined,
	login: false,
	setTitle: function (title) {
		document.title = title + " - " + this.APP_NAME;
	},
};