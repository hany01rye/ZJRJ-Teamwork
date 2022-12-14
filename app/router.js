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
        title: "提交详情",
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

async function render(route) {
    NProgress.start();
    await $.app.sync();
    if (route.title) {
        $.app.setTitle(route.title);
    }
    const component = await route.component();
    const r = await component.render();
    $("#app").empty();
    $("html, body").prop("scrollTop", 0);
    $("#app").append(r);
    MathJax.Hub.Typeset();
    NProgress.done();
}

function parseParams(param) {
    var params = {};
    if (param == null) {
        return params;
    }
    var items = param.split("&");
    for (var i = 0; i < items.length; i++) {
        var key = items[i].split("=")[0];
        var value = decodeURI(items[i].split("=")[1]);
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
    if (route.indexOf("?") >= 0) {
        param = route.substring(route.indexOf("?") + 1);
        route = route.substring(0, route.indexOf("?"));
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
    param = parseParams(param);
    $.app.route = route;
    $.app.params = param;
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
                $.app.params[path[j].substring(1)] = route[j];
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
    $.app.loadActiveUser();
    getRoute();
    matchRoute();
};