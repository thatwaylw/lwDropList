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
dp1.setDropdown({                 // 用json传递参数
    dat: opt1,                    // 下拉列表数据，json数组
    callback: func_on_sel,        // 回调函数，可省略
    editable: true,               // 是否可编辑筛选？省略则为false
    iid: 8,                       // 初始选择dat中第几行？缺省为0
    col: func_col,                // 完成选取后如何显示某个option？col为数字时表示取列表第几列，缺省值0；也可以为自定义函数！
    cmp: func_cmp                 // 在editable状态下，键入文字如何筛选列表数据？为自定义函数，省略则为整行文本之间匹配。
});
dp1.setDpWidth("280px", "88%");    // 按需自己微调输入框宽度比例，免得把▽挤到下一行。。

【下拉列表data是json数组】：
var opt1 = [
    {id:1, name:'班级1', '人数': 10, addr:'地址1'}, 
    {id:2, name:'班级2', '人数': 10, addr:'地址2'}, 
    ...
];
</pre>
