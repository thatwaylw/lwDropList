
function toggleSj(obj) {        //△▽▲▼
    var sj = obj.html();
    sj = (sj=='△') ? '▽' : '△';
    obj.html(sj);
}

function click_blank(e) {
    if(e.originalEvent.clientX == 0)    return;     // 键盘回车触发的，阻止！
    var active_dl = $(".lw_droplist:visible");
    active_dl.prev().find("span").html('▽');
    active_dl.hide();  // console.log('hide @ blank...', e.originalEvent.clientX);

    $(document).unbind("click", click_blank);       //取消bind的click事件回调函数
}

$.fn.DIVal = function(s_val) { // 仅设置和读取文本，和下拉列表无关联，不建议使用。。。
    if(typeof(s_val)!="undefined") {
        $(this).find("input").prop("value", s_val);  // 。。。input
    } else {
        return $(this).find("input").val();
    }
};

var g_lh = 24.6;      // 用于控制滚动条的行高

/* 自定义：$("#dp").setDropdown(
            // opts.dat: [{k1:v1, k2:v2, ..}, ..]
            // callback：回调函数 on_sel(id){...}，参数为选中行id
            // editable: true(可编辑，可筛选) | false；缺省false
            // iid: 初始显示第几行，缺省0
            // col: 显示每行第几列？或者是一个函数；缺省第0列
            // cmp：如果是input，定义筛选时内容匹配方法，缺省为整行所有字符串拼接后包含
            // guid: 定义区分所有lwdp控件的唯一ID（如果不用控件id区分）
        // );  */
$.fn.setDropdown = function (opts0, callback0, editable0, iid0, col0, cmp0, guid0) {
    var opts, callback, editable, iid, col, cmp, guid;
    if(typeof(opts0.dat)=="object" && typeof(opts0.dat.length)=="number") {
        opts = opts0.dat;
        callback = opts0.callback;
        editable = opts0.editable;
        iid = opts0.iid;
        col = opts0.col;
        cmp = opts0.cmp;
        guid = opts0.guid;
    } else {
        opts = opts0;
    }
    if(typeof(callback0)!="undefined")  callback = callback0;
    if(typeof(editable0)!="undefined")  editable = editable0;
    if(typeof(iid0)!="undefined")  iid = iid0;
    if(typeof(col0)!="undefined")  col = col0;
    if(typeof(cmp0)!="undefined")  cmp = cmp0;
    if(guid0 !== undefined)        guid= guid0;
    
    var dp = $(this);    // 当前整个<dropdown>
    dp.html(                                           // 设置内部元素
       `<div class="lw_dropitem">
            <input class="lw_dropitem_input" type="${editable?'text' : 'button'}" value="v0">
            <span style="margin-right:5px; float: right;">▽</span>
        </div>
        <div class="lw_droplist"><table></table></div>`);
    
    dp.addClass("lw_dropdown").css("min-width","200px");      // 设置本div类别属性，缺省200px宽，可外面自定义

    opts.map((u,i)=>{
        var tr = $("<tr></tr>");
        for (k in u) {
            tr.append(`<td title="${k}">${u[k]}</td>`);    // 鼠标悬浮显示该列Key值
        }
        tr.data("lid", i);              // <tr data-lid=${自身行号}> ... </tr>
        dp.find("table").append(tr);                   // 填充droplist表格内容
    });
    var di = $(this).find(".lw_dropitem");      // 当前控件的<droptiem>
    var dl = $(this).find(".lw_droplist");      // 当前控件的<droplist>

    di.data("d_col", col);      // col(num | func) 放入控件data

    if(!iid)    iid = 0;
    di.data("dsi", iid);                 // 设置初始选择行id号

    var s_val = getShowVal(dl.find("tr").eq(iid), iid);
    di.find("input").prop("value", s_val);  // 。。。input，text或button
    
    dl.find("tr").eq(iid).addClass("s");    // 设定好初始高亮行
    dl.scrollTop(iid * g_lh - 100);         // 如果有滚动条，保证初始高亮行可见

    // ~ ~ ~ ~ ~ ~ ~ ~ - - - - - - - - ~ ~ ~ ~ ~ ~ ~ ~ - - - - - - - -
    function getShowVal(tr, s_id) {
        if(typeof(col)=="function") {
            return col(s_id);                       // 设置显示第id行在DI上的规则。。
        } else {
            if(!col)    col = 0;
            return tr.children().eq(col).text();    // 取表格当前行第col列显示
        }
    }
// ~ ~ ~ ~ ~ 每个控件各自处理自己的点击事件，因为行为可能不一样。。。 ~ ~ ~ ~ ~ 
    
    di.click(function(e) {                        // dropitem被点击。。。
        var di = $(this);         //---- 也可用全局di dl。。。但用class名批量set控件的时候，要用各自di dl
        var dl = $(this).next();        // 不用.siblings()，<dropitem>的next()就是<droplist>

        if(di.data("disabled") !== undefined)   return;

        if(e.originalEvent.clientX == 0) {         // 是按回车键进来的。。。阻止！！
            // if(dl.is(":visible"))   
                return;
        }
        e.stopPropagation();        // 这句话防止body的点击也进来
        // console.log('下拉。。', e.originalEvent.clientX, $(this).parent().index(), $(this).data("dsi"));

        var other_active_di = $(".lw_droplist:visible").prev().not(this);
        other_active_di.find("span").html('▽');
        other_active_di.next().hide();  // console.log('hide others visible ^^^');

        dl.toggle();
        toggleSj(di.find("span"));

        di.find("input").select(); // 设置文本为选中状态，也有focus()效果，这样才能收到keyup()事件

        dl.find("tr").show();           // 所有下拉选项的行恢复可见
        dl.find("tr").removeClass("s");
        var sel_id = parseInt(di.data("dsi"));
        dl.find("tr").eq(sel_id).addClass("s");
        dl.scrollTop(sel_id * g_lh - 100);  //  200/8.3 ~= 24.1 //经验公式，可能和字体大小有关！！！如需定制，可放入dl.data("scrl_step")...

        $(document).click(click_blank);     // 准备点击空白处的事件。。。完成后取消绑定
    });
    // dl.find("tr").click(function(e) {                 // droplist的某一行被点击。。。
    dl.on("click", "tr", function(e) {    // 这种写法可以捕获未来添加的<tr>
        var dl = $(this).parents(".lw_droplist"); //---- 也可用全局di dl。。。但用class名批量set控件的时候不行
        var di = dl.prev();     // 不用.siblings()，<droplist>的prev()就是<dropitem>
        // console.log('选取...', dl.parent().index(), $(this).index());
        e.stopPropagation();        // 阻止不了 $(".lw_dropitem").blur 。。。

        var s_id = $(this).index();
        di.data("dsi", s_id);               // 保存当前所选项行id
        var s_val = getShowVal($(this), s_id);
        di.find("input").prop("value", s_val);  // 显示。。。input
        di.find("input").select();              // 设置文本选中状态！

        dl.hide();  // console.log('hide @ tr.click-sel');
        di.find("span").html('▽');

        $(document).unbind("click", click_blank);       //取消bind的click事件回调函数

        if(typeof(callback)=="function") {
            if(guid === undefined)
                callback(s_id, dp);                       // 调用外面设置的回调函数，处理业务。。
            else
                callback(s_id, guid, dp);  // 其实统一3参数更好，为了外面定义函数简洁。。强迫症了。。
        }
    });

    function handle_key_sel(di, dl, keycode) {
        // if(!(keycode==38 || keycode==40 || keycode==13))     // 38：↑，40：↓，13：回车，27：ESC
        //     return;
        if(keycode == 27) {
            dl.hide();  // console.log('hide @ ESC');
            di.find("span").html('▽');
            return;
        }
        
        var tr_h = dl.find("tr.s");     // 当前高亮的tr
        var sel_id = tr_h.data("lid"); // 当前有高亮的行号（全局，包含不可见行）
        //console.log(keycode, 'kkk:', dl.is(":visible"), dl.find("tr:visible").length, sel_id, tr_h.text());

        if(keycode == 13) {
            if(!dl.is(":visible")) {
                dl.show();  // console.log('show @ enter');
                di.find("span").html('△');
                return;
            }
            di.data("dsi", sel_id);               // 保存当前所选项行id
            var s_val = getShowVal(tr_h, sel_id);
            di.find("input").prop("value", s_val);  // 显示。。。input
            di.find("input").select();              // 设置文本选中状态！
            
            dl.hide(); // console.log('hide @ enter-sel');
            di.find("span").html('▽');
            
            if(typeof(callback)=="function") {
                if(guid === undefined)
                    callback(sel_id, dp);                       // 调用外面设置的回调函数，处理业务。。
                else
                    callback(sel_id, guid, dp);
            }
            return;
        }
        if(!dl.is(":visible")) {
            dl.show();  // console.log('show @ keyup');
            di.find("span").html('△');
        }

        var trs = dl.find("tr");            // 全体 tr ...
        tr_h.removeClass("s");
        var stp = keycode==38? -1 : 1;
        // console.log('>>', sel_id, isNaN(sel_id));
        while(!isNaN(sel_id)) {
            sel_id += stp;
            if(sel_id<0) {
                dl.find("tr:visible:first").addClass("s");
                break;
            }
            if(sel_id>=trs.length) {
                dl.find("tr:visible:last").addClass("s");
                break;
            }
            if(trs.eq(sel_id).is(":visible")) {     // 小心 .eq(-1)取倒数第一个
                trs.eq(sel_id).addClass("s");
                break;
            }   
        }
        // 以下代码为了设置滚动条位置保证高亮行可见。。。
        var s_id_vsbl = 0;
        dl.find("tr:visible").each(function(index, item){
            if($(item).prop("class").indexOf("s")>=0)  // prop=""  attr=undefined...
                s_id_vsbl = index;     // 获取筛选后的行号，决定显示位置；而不是全局行号
        });
        // sel_id = parseInt(dl.find("tr.s").data("lid")); // 当前有高亮的行号，全显示的时候，筛选状态下不对
        var cur_scl = dl.scrollTop();       // 当前滚动条位置：表示上面多少px被滚掉隐藏。。。
        var max_h = parseInt(dl.css("max-height"));     // "200px" --> 200
        // console.log(cur_scl, max_h);
        if((s_id_vsbl-0.5) * g_lh < cur_scl) {
            dl.scrollTop(cur_scl - max_h*0.8);      // 往前翻0.8页 可能要while(没有露出) { 持续翻页 }？
        }
        else if((s_id_vsbl+0.5) * g_lh > cur_scl + max_h) {
            dl.scrollTop(cur_scl + max_h*0.8);      // 往后翻0.8页
        }
    }

    // $(".lw_dropitem input").change(function(e) {       // 按键不触发。。要按回车或者失去焦点（blur）才促发。。。
    di.find("input").keyup(function(e) {       // 按键不触发。。要按回车或者失去焦点（blur）才促发。。。
        // e.stopPropagation(); 没有滚动条时，上下键会让整个页面滚动。。。如何阻止？？
        var di = $(this).parents(".lw_dropitem");     //---- 也可用全局di dl。。。
        var dl = di.next();          // 但用class名批量set控件的时候，要用各自di dl

        if(di.data("disabled") !== undefined)   return;

        // console.log('keycode:', e.which);
        if(e.which==38 || e.which==40 || e.which==13 || e.which==27)    // 38：↑，40：↓，13：回车，27：ESC
        {
            handle_key_sel(di, dl, e.which);
            return;
        }
        
        if(!editable)   return;
        // 以下代码为了筛选列表显示。。。
        if(!dl.is(":visible")) {
            dl.show();
            di.find("span").html('△');
        }
        var txt = $(this).val();
        // console.log('filter...', txt);
        if(typeof(cmp)=="function") {
            dl.find("tr").each(function(idx, item){
                if(cmp(txt, idx)<0)
                    $(item).hide();     // 不能item.hide()，还不如用$(this).
                else
                    $(item).show();
            });
        } else {
            dl.find("tr").each(function(){
                if($(this).text().indexOf(txt)<0)
                    $(this).hide();
                else
                    $(this).show();
            });
        }
    });
};

$.fn.setDpWidth = function(w1, w2) {
    $(this).css("min-width", w1);
    if(w2)
        $(this).find("input").css("width", w2);
};
$.fn.setDpHeight = function(h1) {
    $(this).find(".lw_droplist").css("max-height", h1);
};
$.fn.setDpWidth = function(w1) {
    $(this).find(".lw_droplist").css("width", w1);
};

function getShowVal_o(tr, s_id, col) {   // 外部函数，需提供col
    if(typeof(col)=="function") {
        return col(s_id);                       // 设置显示第id行在DI上的规则。。
    } else {
        if(!col)    col = 0;
        return tr.children().eq(col).text();    // 取表格当前行第col列显示
    }
}
$.fn.getSelId = function() {          // 获取当前选中行号
    return $(this).find(".lw_dropitem").data("dsi");
}
$.fn.setSelId = function(sid) {       // 设置显示第sid行
    var di = $(this).find(".lw_dropitem");      // 当前控件的<droptiem>
    var dl = $(this).find(".lw_droplist");      // 当前控件的<droplist>
    di.data("dsi", sid);

    var col = di.data("d_col");     // 取出 col，data()可以储存任意对象类型，包括函数！！
    var s_val = getShowVal_o(dl.find("tr").eq(sid), sid, col);
    di.find("input").prop("value", s_val);  // 。。。input，text或button

    dl.find("tr").eq(sid).addClass("s");    // 设定好初始高亮行
    dl.scrollTop(sid * g_lh - 100);         // 如果有滚动条，保证初始高亮行可见
}

$.fn.setData = function(dat, iid) {         // 更新下拉列表表格数据
    var di = $(this).find(".lw_dropitem");      // 当前控件的<droptiem>
    var dl = $(this).find(".lw_droplist");      // 当前控件的<droplist>
    dl.find("table").empty();      // 先清空表格

    dat.map((u,i)=>{
        var tr = $("<tr></tr>");
        for (k in u) {
            tr.append(`<td title="${k}">${u[k]}</td>`);
        }
        tr.data("lid", i);              // <tr data-lid=${自身行号}> ... </tr>
        dl.find("table").append(tr);       // 填充droplist表格内容
    });
    if(!iid)    iid = 0;
    di.data("dsi", iid);                 // 设置初始选择行id号

    var col = di.data("d_col");     // 取出 col，data()可以储存任意对象类型，包括函数！！
    var s_val = getShowVal_o(dl.find("tr").eq(iid), iid, col);
    di.find("input").prop("value", s_val);  // 。。。input，text或button
    
    dl.find("tr").eq(iid).addClass("s");    // 设定好初始高亮行
    dl.scrollTop(iid * g_lh - 100);         // 如果有滚动条，保证初始高亮行可见
}

$.fn.setEnable = function(flag) {
    var di = $(this).find(".lw_dropitem");      // 当前控件的<droptiem>
    if(!flag) {
        di.data("disabled", true);
        di.addClass("lw_di_disabled");
    } else {
        di.removeData("disabled");
        di.removeClass("lw_di_disabled");
    }
}
$.fn.getEnable = function(flag) {
    var di = $(this).find(".lw_dropitem");      // 当前控件的<droptiem>
    return (di.data("disabled") === undefined);
}