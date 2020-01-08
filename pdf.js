var pre = 'wrap_';
var draghand = '<div class="draghand"><div class="close_small"></div></div>';
var draghand_height =16;

var gl_var={
	header_el:'.topbanner',//头部元素
	footer_el:'.footer',//脚部元素
	draw_el:'.main',//画板元素
	page_el:'.main_wrap',//页面元素
	page_height_el:'.page_height',//页面高度元素
	page_width_el:'.page_width',//页面宽度元素
	page_title_el:'.page_title',//页面标题元素
	style_font_size_el:'.style_font_size',//样式字体大小元素
	style_font_color_el:'.style_font_color',//样式字体颜色元素
	style_font_el:'.style_font',//样式字体元素
	unit:'mm',//尺寸单位
	unit_rate:'',//尺寸系数
	unit_fun:function(px){
		if(gl_var.unit_rate){
			return  px/gl_var.unit_rate;
		}
		//获取 1mm 转换 px 的系数
		var calcMM2PX = function(){
			var mm = 1000000;
			var $divMMHeight = $("<div id='_divMMHeight_' style='height:"+mm+"mm;display:none;'></div>").appendTo($('body'));
			var mmtoPx=$divMMHeight.height();
			$divMMHeight.remove();
			return mmtoPx/mm;
		};
		gl_var.unit_rate = calcMM2PX();
		return  px/gl_var.unit_rate;
	},//px 转换到 尺寸单位 的函数
};
gl_var.unit_fun(1);
var sid;//当前选中组件的id
var gid=0;//全局 id 自增

window.onresize=function(){
	var height = $(gl_var.header_el).height()+$(gl_var.footer_el).height();
	var width = $('.style').width();
	$(gl_var.page_el).width($(window).width()-width-13);
	$(gl_var.page_el).css("height",$(window).height()-height);
};


$(gl_var.page_el).niceScroll({
	autohidemode: false,cursorborder :"0px" ,cursorcolor:"#414141"
});


//topbanner 的鼠标移入 移出 样式
var title_map = [
	'save',
	'page',
	'form',
];

var setTitle = function (tmp_title_name){
	$(".title_"+tmp_title_name+"_img,.title_"+tmp_title_name).mouseover(function(){
		$(".title_"+tmp_title_name+"_img").addClass("title_"+tmp_title_name+"_img2");
		$(".title_"+tmp_title_name).addClass("title_"+tmp_title_name+"2");
	});

	$(".title_"+tmp_title_name+"_img,.title_"+tmp_title_name).mouseout(function(){
		$(".title_"+tmp_title_name+"_img").removeClass("title_"+tmp_title_name+"_img2");
		$(".title_"+tmp_title_name).removeClass("title_"+tmp_title_name+"2");
	});
};

for(var i in title_map){
	setTitle(title_map[i]);
}
//topbanner 的鼠标移入 移出 样式

//打开 页面的设置面板
$(".title_page_img,.title_page").click(function(){
	$(".page").slideDown("fast");
});

var savePage = function (){
	var w=$.trim($(gl_var.page_width_el).val());
	var h=$.trim($(gl_var.page_height_el).val());
	if(isNaN(w)||isNaN(h)){
		alert("宽度和高度必须为数字");
		return ;
	}

	$(gl_var.draw_el).width(w+gl_var.unit);
	$(gl_var.draw_el).height(h+gl_var.unit);
	$(gl_var.draw_el).css("background-color","#ffffff");

	var height = $(gl_var.header_el).height()+$(gl_var.footer_el).height();
	var width = $('.css').width();

	$(gl_var.page_el).width($(window).width()-width -13);
	$(gl_var.page_el).height($(window).height()-height);

	var page=
		{
			w: w,
			h: h,
			title: $(gl_var.page_title_el).val(),
			unit: gl_var.unit,
			unit_rate: gl_var.unit_rate
		};
	setPage('page',page);
	$(".page").slideUp("fast");
};

$(".page .no").click(function(){
	$(".page").slideUp("fast");
});
//打开 页面的设置面板

//打开 表单面板
$(".title_form_img,.title_form").click(function(){
	$(".form_dialog").slideDown("fast");
});
$(".closeImg").click(function(){
	$(".form_dialog").slideUp("fast");
});
$(".form_dialog").draggable({
	handle:".form_dialog_head",
	containment:document.body
});
//打开 表单面板

//添加  内容到样式
function getCss(){
	$(".style .css_row").hide();

	if(elements[sid].style.fontSize){
		$(gl_var.style_font_size_el).val(elements[sid].style.fontSize);
		$(gl_var.style_font_size_el).parent().show();
	}
	if(elements[sid].style.color){
		$(gl_var.style_font_color_el).val(elements[sid].style.color);
		$(gl_var.style_font_color_el).parent().show();
	}
	if(elements[sid].style.fontFamily){
		$(gl_var.style_font_el).val(elements[sid].style.fontFamily);
		$(gl_var.style_font_el).parent().show();
	}
}

$(gl_var.style_font_size_el).change(setFontSizeStyle);
$(gl_var.style_font_color_el).change(setFontColorStyle);
$(gl_var.style_font_el).change(setFontStyle);

function setFontStyle(){
	var el = elements[sid];
	switch(el.type){
		case 'font':
			var val=$.trim($(this).val());
			if(!val){
				return ;
			}
			//下面是对象处理
			styleEl(sid,'fontFamily',val);
			//下面是视觉处理
			var $dom = getDomByGid(sid);
			$dom.css("font-family",val);
			break;
	}
}

function setFontColorStyle(){
	var el = elements[sid];
	switch(el.type){
		case 'font':
			var val=$.trim($(this).val());
			if(!val){
				return ;
			}
			//下面是对象处理
			styleEl(sid,'color',val);
			//下面是视觉处理
			var $dom = getDomByGid(sid);
			$dom.css("color","#"+val);
			break;
	}
}

function setFontSizeStyle(){
	var el = elements[sid];
	switch(el.type){
		case 'font':
			var val=$.trim($(this).val());
			if(isNaN(val)){
				return ;
			}
			//下面是对象处理
			styleEl(sid,'fontSize',val);
			//下面是视觉处理
			var $dom = getDomByGid(sid);
			$dom.css("font-size",val+"px");
			break;
	}
}

function getGidByDiv($div){
	return $div.data('gid');
}

function getDomByGid(gid){
	return $("#"+gid);
}

function buildDivByElement(el,id){
	if(el === undefined){
		return false;
	}
	switch(el.type){
		case 'font':
			return buildFontDivByElement(el,id);
			break;
		case 'img':
			return buildImgDivByElement(el,id);
			break;
		case 'rect':
			return buildRectDivByElement(el,id);
			break;
	}
	return false;
}

function buildFontDivByElement(el,id){
	var style = el.style;

	var div_id = pre+id;
	var div_style = "text-align:center;position:absolute;top:"+style.y+"px;left:"+style.x+"px;cursor:default;border:dashed 1px transparent;";
	var div_gid = "data-gid='"+id+"'";

	var html = "<input id='"+id+"' data-auto='1' type='text' value='"+style.text+"' style=' font-size:"+style.fontSize+"px;color:#"+style.color+"; width:"+style.w+"px;height:"+style.h+"px;border:solid 0px #000;background-color:transparent;background-repeat:no-repeat;' />";

	var $div=$("<div id='"+div_id+"' "+div_gid+" style='"+div_style+"width:"+style.w+"px;height:"+(parseInt(style.h)+draghand_height)+"px;'>"+html+draghand+"</div>");

	$div.find("input").keyup(function(){
		styleEl($(this).attr("id"),'text',$(this).val());
	});
	return $div
}

function buildImgDivByElement(el,id){
	var style = el.style;

	var div_id = pre+id;
	var div_style = "text-align:center;position:absolute;top:"+style.y+"px;left:"+style.x+"px;cursor:default;border:dashed 1px transparent;";
	var div_gid = "data-gid='"+id+"'";


	var html = "<form method='post' enctype='multipart/form-data'><input id='img_"+id+"' data-auto='1' type='file' style='position: absolute;top:0px ;left:0px ;opacity:0;filter:alpha(opacity=0);'></form>";
	var $div=$("<div id='"+div_id+"' "+div_gid+" style='"+div_style+"width:"+style.w+"px;height:"+(parseInt(style.h)+draghand_height)+"px;'><img src='"+style.src+"' style='border:solid 0px' data-auto='1'>"+draghand+html+"</div>");
	$div.find("img,input").css("height",style.h+"px");
	$div.find("img,input").css("width",style.w+"px");


	$div.find('[type=file]').change(function(){
		var imgPath = $(this).val();
		if (imgPath == "")   return;

		var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1);
		if (strExtension != 'jpg' && strExtension != 'gif'
			&& strExtension != 'png' && strExtension != 'bmp') {
			alert("请选择图片文件类型:jpg,gif,png,bmp");
			return;
		}
		/*转换base64*/
		var img = document.getElementById($(this).attr('id'));
		var imgFile = new FileReader();


		imgFile.onload = function () {
			var img_data = this.result;//base64数据
			$div.find('img').attr("src",img_data);
			styleEl(id,'src',img_data);

			var $img = $("<img id='_imgWidthHeight_"+id+"' src='"+img_data+"' style='display:none;'>").appendTo($('body'));
			$img[0].onload = function(){
				var height=$img.height();
				var width=$img.width();
				$div.find("img,input").css("width",width+"px");
				$div.find("img,input").css("height",height+"px");

				$div.css("width",width+"px");
				$div.css("height",(height+draghand_height)+"px");

				styleEl(id,'w',width);
				styleEl(id,'h',height);
				$img.remove();
			};
		};
		imgFile.readAsDataURL(img.files[0]);
	});
	return $div
}

function buildRectDivByElement(el,id){
	var style = el.style;

	var div_id = pre+id;
	var div_style = "text-align:center;position:absolute;top:"+style.y+"px;left:"+style.x+"px;cursor:default;border:dashed 1px transparent;";
	var div_gid = "data-gid='"+id+"'";

	var html = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: '+style.w+'px;height: '+style.h+'px;" data-auto="1">' +
		'<rect x="0" y="0" width="100%" height="100%" stroke="#'+style.borderColor+'" stroke-width="'+style.borderWidth+'" fill="none" fill-opacity="0"/>' +
		'</svg>';
	var $div=$("<div id='"+div_id+"' "+div_gid+" style='"+div_style+"width:"+style.w+"px;height:"+(parseInt(style.h)+draghand_height)+"px;'>"+html+draghand+"</div>");

	return $div
}

function formFactory(type,left,top){
	var e;
	if(type=="font"){
		e =
			{
				type: type,
				style:
					{
						w: 50,
						h: 25,
						x: left,
						y: top,
						text: "文字",
						fontSize: "13",
						color: "747474",
						fontFamily: "微软雅黑",
					}
			};
	}

	if(type=="img"){
		var default_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAADyUlEQVR42u2cv2sUURDHD7SwUBCNP7HQ+KsRUVAQYnGFKJG4XPZ2YxCE/AkWKUOusLQIJlEUTS65y93tbhBLbSRFGrsUBpNwl+zt21gJWkSwsNA30UjUeNy+fe9us/f9whAuJA92Pjezb+bNbiIBQRAEQRAEQRAEQRAEQRDUSHXnKueMkpuEbW2pgnshmZnZqRxEj+XdMx221jO9+h1W20ybfTUdfyT5aH63EhiGxQbgaAGz2Xgyk5EbLans3F4eGd/gYDHrLi5flQpEL3jX4NgQxlO9VCDpopuCY8XNsP0MgAAIDEAABAYgAAIgkQeil9y+lml58ALYcJgrsxAGkOAQPqdL1X6ttHypLzOzi66ZftJnKuoMm31EympYOmETuuV11L7+6kXTZk8QIaphOH4+UIPV8R8gQtTdaN9qxZXzQfxwK7d4gkN5jQhRYPQlEzoTmnKvIELkHx590sYWjwqfDTnsHYDI3VXNhjo5dZiFlNXEm/k/QOzV+4gQqTd070U4IN4wgMg9515ImOYOUX+YFnuDlCXZOqfKx0R8QeM9NFGCCJG+06oOCfnC8gax7VXTMvmil/w7wTKFp/Ho+IDCUNlui7k0ZViPD3qzC8fp3oPWifoi0Tcdf1DPvz+y1bV3jC3uSdusn/9NuWWai9T+jgYYNk1teMPyutbb7rxeCQNiWwLhFzz7azJyGieGTU5ZHMbLjRy+DsVmQwDSJCCbYfwxQxxDKJEHshWMOEOJNJBaMOIKJbJA6oERRyiRBBIERtygRG7bS1tb0Ue71pt5irfEquugSAEJA6MRUBpRB0UmZYmkqUamL+6oopZfOUvra89WDnEoj2MLRCYMJVAcv5Cyls9sXv96rnIwbcmH0vSUxb9pc6oeB5aRvmqlURXpsfkR4rBsQqFCRYrtT3UVKqdrrd85Xj7AnTgKIIqhUPdWy1dO1bN+V3GpzbDZKIAogmLYXt0wfkN5utRmOt4IgMiG4rBcaqJ8UmT97smF/TzNDQOIJCj895N6wWsPs/6N5/P7gs5itTSQ/0H5CWOpXcb6BIU79uH2rNSbAOTvLauMDoGsLXHLAtlwmmFVB9TWQf4rpKwIiQYgAARAAARAAARAAARAAARAAARAAARAAARABHtZ1Nij/4mr0QAHnqDC5CKAAAiAAAiAAAiAAAhMLRDDcnvh2AgBuW2xy3CsuOkl7670dgFNtMO5Yk9n3czOH5YOhOZi6WUtcHIgGGuibz+tSzQdSO8CoeYhrLbRbBi9QSgBQRAEQRAEQRAEQRAEQRAEtZh+ACjYYPRkOxmmAAAAAElFTkSuQmCC';
		e =
			{
				type: type,
				style:
					{
						w: 100,
						h: 100,
						x: left,
						y: top,
						src: default_img
					}
			};
	}
	if(type=="rect"){
		e =
			{
				type: type,
				style:
					{
						w: 100,
						h: 100,
						x: left,
						y: top,
						borderWidth: "1",
						borderColor: "000",
					}
			};
	}
	if(e === undefined){
		return;
	}
	var $div = buildDivByElement(e,gid);
	initEl(gid,e);
	$div.resizable({
		containment:gl_var.draw_el ,
		alsoResize:$div.find('[data-auto=1]'),
		stop:function(e,ui){
			styleEl(getGidByDiv($(this)),'w',parseInt(ui.size.width));
			styleEl(getGidByDiv($(this)),'h',parseInt(ui.size.height)-draghand_height);
			$(this).find('.draghand').css('width',parseInt($(this).width())+2*(draghand_height+1));
		}
	});

	$(gl_var.draw_el).append($div);

	gid++;

	sid=getGidByDiv($div);

	getCss();

	$div.mousedown(function(){
		sid=getGidByDiv($div);
	});
	$div.mouseover(function(){
		$(this).css("border-color","#a2a2a2");
		$(this).find('.draghand').css("background-color","#efefef");
		//保证div 被缩小 还能拖动
		$(this).find('.draghand').css('width',parseInt($(this).width())+2*(draghand_height+1));
		$(this).find(".close_small").show();
	});

	$div.mouseout(function(){
		$(this).css("border-color","transparent");
		$(this).find('.draghand').css("background-color","transparent");
		$(this).find(".close_small").hide();
	});
	$div.click(function(){
		sid=getGidByDiv($div);
		getCss();
	});

	$div.draggable({
		containment:gl_var.draw_el,
		handle:".draghand",
		start:function(){
			$("div[id^='tip_']").remove();
		},
		stop:function(e,ui){
			//自动对齐 top 和 left
			var left,top;
			$("div[id^='"+pre+"']").each(function(){
				//排除自己
				if($(this).is($div)){
					return;
				}
				if(Math.abs(parseInt($(this).css("left"))-ui.position.left)<5){
					left = $(this).css("left");
				}
				if(Math.abs(parseInt($(this).css("top"))-ui.position.top)<5){
					top = $(this).css("top");
				}
			});

			var gid = getGidByDiv($div);
			if(left){
				$div.css("left",left);
			}
			styleEl(gid,'x',$(this).css("left").replace('px',''));
			if(top){
				$div.css("top",top);
			}
			styleEl(gid,'y',$(this).css("top").replace('px',''));
		}
	});
	$div.zIndex(getGidByDiv($div));
	$div.find(".close_small").click(function(){
		sid=getGidByDiv($div);
		deleteEl(sid);
		$div.remove();
	});
}

$(gl_var.draw_el).click(function(e){
	if($("#tip").css("display")=="none") return ;
	$("#tip").hide();
	$("#tip").css("top","0px");
	$("#tip").css("left","0px");
	$(gl_var.draw_el).unbind("mousemove");
	var left = e.clientX-parseInt($(gl_var.draw_el).offset().left);
	var top = e.clientY-parseInt($(gl_var.header_el).height())+parseInt($(gl_var.page_el).scrollTop());

	formFactory($("#tip").attr("class").replace("tip_",""),left,top);
});

$(".form_dialog>div:gt(0)").click(function(e){
	$("#tip").attr("class","tip_"+$(this).attr("class"));
	$("#tip").show();
	$(gl_var.draw_el).bind("mousemove",function(e){
		$("#tip").css("top",e.clientY-30);
		$("#tip").css("left",e.clientX);
	});

});
//添加  内容到画板

// 命令 存储 播放 可以用于操作的后退和前进 或者 画板重放
var cmd_arr = new Array();
var elements=new Object();
function cmd(c,i,m='',n=''){
	var o = {
		c:c,
		i:i,
		m:m,
		n:n,
	};
	//记录命令
	cmd_arr.push(o);
	return doCmd(o);
}

function initEl(id,value){
	return cmd('init',id,value);
}

function styleEl(id,field,value){
	return cmd('style',id,field,value);
}

function deleteEl(id){
	return cmd('delete',id);
}

function setPage(id,value){
	return cmd('page',id,value);
}

function doCmd(o){
	var c = o.c;
	var i = o.i;
	var m = o.m;
	var n = o.n;
	switch(c){
		case 'init'://初始化
			elements[i] = m;
			//同时生成 div
			return true;
		case 'style'://style 设置
			if(elements[i] == undefined){
				return false
			}
			if(elements[i][c] == undefined){
				return false
			}
			elements[i][c][m] = n;
			return true;
		case 'delete'://删除el
			delete  elements[i];
			return true;
		case 'page'://设置页面属性
			elements[i] = m;
			return true;
	}
}
// 命令 存储 播放


//保存 html 和 elements数据
$(".title_save_img,title_save").click(function(){
	//dom 可以用 html to pdf 功能生成pdf
	var clone = $(gl_var.draw_el).clone();
	//移除没用的dom
	clone.find('.ui-draggable-handle,form,.ui-resizable-handle').remove();
	//todo 匹配 px并转换到mm
	var dom = clone.prop("outerHTML");
	var mm_dom = dom.replace(/([0-9]*)px/g, function(w,px){
		return gl_var.unit_fun(px)+'mm';
	});
	//根据每个元素 对pdf 进行绘制
	var el_json = JSON.stringify(elements);
	//保存命令列表 用于回退和重放
	var cmd_json = JSON.stringify(cmd_arr);
	//保存到后台
	debugger;
});
//保存 html 和 elements数据
