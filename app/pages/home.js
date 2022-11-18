//export async function render() {
//	return $.app.t.header();
//}

export async function render() {
	return [
		$.app.t.header(),
		$.app.t.tag.div(null,
      	$("<div class=\"index-content am-center\"> <div class=\"am-g\"> <div class=\"am-u-md-12\"> <div class=\"article\"> <div class=\"am-g\"> <div class=\"am-u-md-8\"> <div class=\"am-slider am-slider-default\" data-am-flexslider> <ul class=\"am-slides\"> <li><img src=\"app/asset/gallery/pic1.png\" /></li> <li><img src=\"app/asset/gallery/pic2.png\" /></li> </ul> </div> </div> <div class=\"am-u-md-4 am-text-center\"> <div class=\"punch-padding am-show-lg\"></div> <h2>今日运势</h2> <br> <div class=\"index-calendar fg-red\"> <span class=\"punch-big\">§ 大吉 §</span> </div> <div class=\"am-g\"> <div class=\"am-u-sm-12 smallsize\"> 距 <strong>BCPC2022决赛</strong> 还剩 <strong>15 天</strong><br> </div> </div> </div> </div> </div> </div> </div> </div> <div class=\"am-g index-content\"> <div class=\"am-u-md-3\"> <div class=\"article index-stat\"> <h2>快速跳转</h2> <br> <div class=\"am-input-group am-input-group-primary am-input-group-sm\"> <input type=\"text\" class=\"am-form-field\" placeholder=\"请输入题号\" name=\"toproblem\"> </div> <p> <button class=\"am-btn am-btn-danger am-btn-sm am-round\" name=\"goto\">跳转</button> </p> </div> </div> <div class=\"am-u-md-4\"> <h2>更多OJ</h2> <ul class=\"am-list\"> <li><a href=\"https://codeforces.com\">Codeforces</a></li> <li><a href=\"https://atcoder.jp\">AtCoder</a></li> <li><a href=\"http://luogu.com.cn\">Luogu</a></li> </ul> </div> <div class=\"am-u-md-4\"> <h2>友情链接</h2> <ul class=\"am-list\"> <li><a href=\"https://cvbbacm.com\">北航ACM竞赛</a></li> <li><a href=\"https://accoding.buaa.edu.cn/acm/2022\">BCPC2022赛事信息</a></li> </ul> </div> </div>\""),
		),
	];
}