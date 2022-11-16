const routes = [
    {
        path: "/",
        title: "首页",
        component: () => import("./pages/home.js"),
    },
    {
        path: "/login",
        title: "登录",
        component: () => import("./pages/login.js"),
    },
    {
        path: "/register",
        title: "注册",
        component: () => import("./pages/register.js"),
    },
    {
        path: "/p",
        title: "题目列表",
        component: () => import("./pages/problemlist.js"),
    },
    {
        path: "/p/:pid",
        component: () => import("./pages/problem.js"),
    },
    {
        path: "/s",
        title: "提交列表",
        component: () => import("./pages/submissionlist.js"),
    },
    {
        path: "/s/:sid",
        component: () => import("./pages/submission.js"),
    },
    {
        path: "/u",
        title: "用户列表",
        component: () => import("./pages/userlist.js"),
    },
    {
        path: "/u/:uid",
        component: () => import("./pages/user.js"),
    },
    {
        path: "/j",
        title: "评测机列表",
        component: () => import("./pages/judgerlist.js"),
    },
    {
        title: "错误",
        component: () => import("./pages/error.js"),
        matchAll: true,
    },
];

function render(route) {
    $.app.setTitle(route.title);
    $("#app").empty();
    route.component().then(component => {
        $("#app").append(component.render());
    });
}

function parseParam(param) {
    var params = {};
    if (param == null) {
        return params;
    }
    var items = param.split("&");
    for (var i = 0; i < items.length; i++) {
        key = items[i].split("=")[0];
        value = decodeURI(items[i].split("=")[1]);
        params[key] = value;
    }
    return params;
}

function getRoute() {
    var route = window.location.hash;
    var param = null;
    if (route.length > 0 && route[0] == "#") {
        route = route.substring(1);
    }
    if (route.indexOf("#") >= 0) {
        route = route.substring(0, route.indexOf("#"));
    }
    if (route.length > 0 && route[route.length - 1] == "/") {
        route = route.substring(0, route.length - 1);
    }
    if (route.length == 0 || route[0] != '/') {
        route = "/" + route;
    }
    if (route.indexOf("?") >= 0) {
        param = route.substring(route.indexOf("?") + 1);
        route = route.substring(0, route.indexOf("?"));
    }
    param = parseParam(param);
    $.app.route = route;
    $.app.param = param;
}

function matchRoute() {
    var route = $.app.route.split("/");
    var target = null;
    for (var i = 0; i < routes.length; i++) {
        if (routes[i].matchAll) {
            target = routes[i];
            break;
        }
        var path = routes[i].path.split("/");
        if (route.length != path.length) {
            continue;
        }
        var match = true;
        for (var j = 0; j < route.length; j++) {
            if (path[j].length > 0 && path[j][0] == ":") {
                continue;
            }
            if (route[j] != path[j]) {
                match = false;
                break;
            }
        }
        if (!match) {
            continue;
        }
        for (var j = 0; j < route.length; j++) {
            if (path[j].length > 0 && path[j][0] == ":") {
                $.app.param[path[j].substring(1)] = route[j];
            }
        }
        target = routes[i];
        break;
    }
    render(target);
}

window.addEventListener("hashchange", () => {
    getRoute();
    matchRoute();
});

window.onload = () => {
    getRoute();
    matchRoute();
};