function myimg(className, src) {
    var r = $("<img></img>");
    r.addClass(className);
    r.attr("src", src);
    r.attr("width", "200px");
    return r;
}

function mytable(lib) {
    var tab = $("<table></table");
    tab.addClass("am-table am-table-bordered am-table-radius");
    tab.append("<thead><tr><th>提交结果</th><th>次数</th></tr></thead>");
    var body = $("<tbody></tbody>");
    //<tr><td>.am-active</td><td class="am-active">激活</td><td>td</td></tr>
    //<tr class="am-active"><td>.am-active</td><td>激活</td><td>tr</td></tr><tr><td>.am-disabled</td><td class="am-disabled">禁用</td><td>td</td></tr><tr class="am-disabled"><td>.am-disabled</td><td>禁用</td><td>tr</td></tr><tr><td class="am-primary">.am-primary</td><td>蓝色高亮</td><td>td</td></tr><tr class="am-primary"><td>.am-primary</td><td>蓝色高亮</td><td>tr</td></tr><tr><td class="am-success">.am-success</td><td>绿色高亮</td><td>td</td></tr><tr class="am-success"><td>.am-success</td><td>绿色高亮</td><td>tr</td></tr><tr><td class="am-warning">.am-warning</td><td>橙色高亮</td><td>td</td></tr><tr class="am-warning"><td>.am-warning</td><td>橙色高亮</td><td>tr</td></tr><tr><td class="am-danger">.am-danger</td><td>红色高亮</td><td>td</td></tr><tr class="am-danger"><td>.am-danger</td><td>红色高亮</td><td>tr</td></tr></tbody></table></div><h2 id="qi-ta-xiao-guo">其他效果 <a href="#qi-ta-xiao-guo" title="Heading anchor" class="doc-anchor"></a></h2><ul><li><code>.am-table-striped</code> 斑马纹效果</li><li><code>.am-table-hover</code> hover 状态</li></ul><div class="doc-example"><table class="am-table am-table-striped am-table-hover"><thead><tr><th>网站名称</th><th>网址</th><th>创建时间</th></tr></thead><tbody><tr><td>Amaze UI</td><td>http://amazeui.org</td><td>2012-10-01</td></tr><tr><td>Amaze UI</td><td>http://amazeui.org</td><td>2012-10-01</td></tr><tr><td>Amaze UI</td><td>http://amazeui.org</td><td>2012-10-01</td></tr><tr><td>Amaze UI</td><td>http://amazeui.org</td><td>2012-10-01</td></tr><tr><td>Amaze UI</td><td>http://amazeui.org</td><td>2012-10-01</td></tr></tbody></table></div><div class="doc-code demo-highlight"><pre><code class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">table</span> <span class="hljs-attribute">class</span>=<span class="hljs-value">"am-table am-table-striped am-table-hover"</span>&gt;</span>
    console.log(lib.data.submissions["Accepted"]);
    var rec = lib.data.submissions;
    for (let key in rec) {
        if (key == "Accepted") {
            var tr = $("<tr></tr>");
            tr.addClass("am-success")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
        if (key == "Compilation Error") {
            var tr = $("<tr></tr>");
            tr.addClass("am-disabled")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
        if (key == "Memory Limit Exceeded") {
            var tr = $("<tr></tr>");
            tr.addClass("am-active")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
        if (key == "Runtime Error") {
            var tr = $("<tr></tr>");
            tr.addClass("am-warning")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
        if (key == "Time Limit Exceeded") {
            var tr = $("<tr></tr>");
            tr.addClass("am-primary")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
        if (key == "Wrong Answer") {
            var tr = $("<tr></tr>");
            tr.addClass("am-danger")
            tr.append("<td>" + key + "</td>");
            tr.append("<td>" + rec[key] + "</td>");
            body.append(tr);
        }
    }
    tab.append(body);
    return tab;
}

export async function render() {
    var uid = $.app.params["uid"];
    var user = await $.app.get("/user/" + uid + "/");
    var stat = await $.app.get("/user/" + uid + "/statistics/");
    console.log(user.data);
    console.log(stat.data);

	return [
		$.app.t.header(),
        $.app.t.secondaryHeader("用户详情 - " + user.data.username),
		$.app.t.container([
			$.app.t.boxes([
				$.app.t.box(4, [
                    myimg("am-img-thumbnail am-circle am-center", user.data.avatar),
					$.app.t.tag.div("am-center am-text-xxl", user.data.username),
					$.app.t.tag.div("", "上一次访问于" + user.data.last_online_time.substring(0, 10)),
					$.app.t.tag.div("", "注册于" + user.data.registration_time.substring(0, 10)),
				]),
				$.app.t.box(8, [
                    mytable(stat),
				]),
			]),
		]),
	];
}