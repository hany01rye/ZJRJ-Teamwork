export async function render() {
    var res = [];
    res.push($.app.t.header());
    res.push($.app.t.secondaryHeader("用户列表"));


    var r = $("<table></table>");
    r.addClass("am-table");
    r.append("<thead><tr><th>#</th><th>用户名</th><th>通过数</th><th>提交数</th></tr></thead>");
    const sheet = await $.app.get("/user/");
    var body = $("<tbody></tbody>");
    for (var i = 0; i < sheet.data.length; i ++) {
        var item = await $.app.get("/user/" + sheet.data[i].uid + "/statistics/");
        var tr = $("<tr></tr>");
        var td = $("<td></td>");
        td.text(i + 1);
        tr.append(td);
        var td = $("<td></td>");
        td.append($.app.t.tag.a(null, "#/u/" + sheet.data[i].uid, sheet.data[i].username));
        tr.append(td);
        td = $("<td></td>")
        td.text(item.data.accepted.length);
        tr.append(td);
        td = $("<td></td>")
        var rec = item.data.submissions;
        var sum = 0;
        for (let key in rec) {
            sum = sum + rec[key];
        }
        td.text(sum);
        tr.append(td);
        body.append(tr);
    }
    r.append(body);


    res.push($.app.t.container([$.app.t.box(null, r)]));
    return res;
}