# lwDropList
增强HTML自带Select功能：下拉支持多列富媒体显示，支持快速筛选。

# 基本使用方法
* HTML里插入一个div，推荐用id标识：

<code>&lt;div id="drpdn0"&gt;&lt;/div&gt;</code>

* js部分，必须引入jQuery库，然后用jQuery选择器语法：

<code>$("#drpdn0").setDropdown(opt0, 0, false, 0, 1);</code>

然后页面上就可见此控件了，并且可以操作交互。

# 进阶使用示例
<pre>
【html】: &lt;div id="drpdn1"&gt;&lt;/div&gt;
【js】: 
var dp1 = $("#drpdn1");
dp1.setDropdown({      // 用json传递参数
    dat: opt1,              // 下拉列表数据，json数组
    callback: func_on_sel,  // 回调函数，可省略
    editable: true,         // 是否可编辑筛选？省略则为false
    iid: 8,                 // 初始选择dat中第几行？缺省为0
    col: func_col,          // 完成选取后如何显示某个option？col为数字时表示取列表第几列，缺省值0；也可以为自定义函数！
    cmp: func_cmp,          // 在editable状态下，键入文字如何筛选列表数据？为自定义函数，省略则为整行文本之间匹配。
    guid: 2,        // 区分所有lwdp控件的唯一ID（如不用控件id区分），可省略（则回调函数只有(sid, obj)两个参数）
});
dp1.setDpWidth("280px", "88%");    // 按需自己微调控件宽度、输入框宽度(比例)

【下拉列表data是json数组】：
var opt1 = [
    {id:1, name:'班级1', '人数': 10, addr:'地址1'}, 
    {id:2, name:'班级2', '人数': 15, addr:'地址2'}, 
    ...
];

【回调函数示例】：
var func_on_sel = function(sid, guid, obj) {   // 自定义选项改变时的回调函数，后两参数如不需可省略……
    // alert('选中的行号是：' + sid);   // guid为设置控件时传入值（如果有），obj为目标控件<div>
    $("#s1").html('选中：' + func_col(sid));
}
【自定义显示函数示例】：
var func_col = function(iid) {      // 自定义顶端怎么显示选中的行。。。
    return (`${opt1[iid].id} - ${opt1[iid].name} (${opt1[iid].addr})`);
}
【自定义筛选函数示例】：
var func_cmp = function(txt, iid) { // 自定义如何按键入内容筛选每行，<0为内容不匹配，隐藏此行
    var lin = iid%2==0?'a':'b';     // demo：键入a/b快速筛选偶数行/奇数行
    lin += (iid+1) + opt1[iid].name.toLowerCase();  // demo：同时可按name筛选，忽略大小写
    return (lin.indexOf(txt));
}
【其他API函数】：
var txt = $("#dp").DIVal();     // 获取控件上的文本
$("#dp").DIVal('new text');     // 直接设置控件上的文本（可能和下拉列表内容不符，不建议直接使用）
// 控件宽度初始缺省宽度200px；
$("#dp").setDpWidth('280px', '250px'); // 重设宽度；第二个参数为内部文本区宽度（也可是比例'85%'）
$("#dp").setDpHeight('200px');  // 设置下拉列表最大高度（缺省300px）；超出则出现滚动条
//2019-10-23 新增：
$("#dp").getSelId();     // 获取当前选中行号
$("#dp").setSelId(3);    // 更改选中项为第3行（同时更改显示）
$("#dp").setData(new_opt1, 0);   // 更改下拉表格数据，参数二为初始显示行号
</pre>
