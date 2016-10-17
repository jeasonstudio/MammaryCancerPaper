// (function () {
//     $.ajax({
//         type: 'POST',
//         url: 'http://gqy.kolabao.com/smvc/MkWordService/html.json',
//         data: {
//             word: 'abandon'
//         },
//         dataType: 'jsonp',
//         success: function(data) {
//             document.write(data.body)
//             changeHTML();
//         }
//     });
// })()

var obj = {
    "word": "", // $(".keyword").innerText
    "yinbiaoEN": "", //英音音标
    "yinbiaoAM": "", //美音音标
    "shiyi": "", //多个解释意思拼接的字符串
    "resultInternet": [{
        "main": "", //翻译意思1
        "sentence": "" //内容
    }], //网络释义
    "cizuduanyu": [], //词组短语
    "resultENEN": [{
        "cixing": "", //词性1
        "sentence": "" //内容TODO
    }], //英英释义
    "KELINSIDictionary": [{
        "No": "", //序号
        "content": "", //内容
        "liju": "", //例句
        "lijufanyi": "" //例句翻译
    }], //xxx 大字典
    "examplesToggle": [{
        "sentenceEN": "", //例句
        "read": "",
        "sentenceZH": "", //例句 翻译
        "fromWhere": "" //出处
    }], //双语例句
    "originalSound": [
        {
            "sentence": "",
            "fanyi": "",
            "fromWhere": ""
        }
    ], //原声例句
    "authority": [{
            "sentence": "",
            "others": "",
            "read": ""
        }] //权威例句
}



function takeShiyi() {
    var i = 0;
    var str = ''
    while ($("#phrsListTab > .trans-container > ul > li")[i] != undefined) {
        str = str + ' ' + $("#phrsListTab > .trans-container > ul > li")[i].innerHTML;
        i++
    }
    // console.log(str)
    return str
}

function takeresultInternet() {
    var arr = [];
    for (var i = 0; i < $("#tWebTrans")[0].children.length - 1; i++) {
        arr[i] = {}
        var sss = '#tWebTrans .wt-container .title span'
        var ssss = '#tWebTrans .wt-container .collapse-content'
        arr[i].main = $(sss)[i].innerText;
        arr[i].sentence = $(ssss)[2 * i].innerHTML;
    }
    return arr
}

function takeCizuduanyu() {
    var arr = [];
    // console.log($("#webPhrase .wordGroup"))
    for (var i = 0; i < $("#webPhrase .wordGroup .contentTitle").length; i++) {
        arr[i] = $("#webPhrase .wordGroup")[i].innerText;
    }
    return arr
}

function takeresultENEN() {
    var arr = [];
    // console.log($("#tEETrans .pos")[0].nextElementSibling)
    for (var i = 0; i < $("#tEETrans .pos").length; i++) {
        arr[i] = {};
        arr[i].cixing = $("#tEETrans .pos")[i].innerText;
        arr[i].sentence = $("#tEETrans .pos")[i].nextElementSibling;
    }
    return arr
}

function takeXXXDic() {
    var arr = [];
    // console.log($("#collinsResult .ol li"))
    for (var i = 0; i < $("#collinsResult .ol li").length; i++) {
        arr[i] = {};
        arr[i].No = String(i + 1);
        arr[i].content = $("#collinsResult .ol li:eq(" + i + ") .collinsMajorTrans")[0].innerHTML;
        arr[i].liju = $("#collinsResult .ol li:eq(" + i + ") .exampleLists .examples p")[0] //TODO//接.innerHTML 报错
        arr[i].lijufanyi = $("#collinsResult .ol li:eq(" + i + ") .exampleLists .examples p")[1] //TODO//接.innerHTML 报错
    }
    return arr
}

function takeExamplesToggle() {
    var arr = [];
    // console.log($("#examplesToggle #bilingual ul li"))
    for (var i = 0; i < $("#examplesToggle #bilingual ul li").length; i++) {
        arr[i] = {};
        arr[i].sentenceEN = $("#examplesToggle #bilingual ul li")[i].firstElementChild.innerText
        arr[i].sentenceZH = $("#examplesToggle #bilingual ul li")[i].children[1].innerText
        arr[i].fromWhere = $("#examplesToggle #bilingual ul li")[i].children[2].innerText
    }
    return arr
}

function takeOriginalSound() {
    var arr = [];
    // console.log($("#originalSound ul li:eq(1) p"))
    for (var i = 0; i < $("#originalSound ul li").length; i++) {
        arr[i] = {};
        var strs = "#originalSound ul li:eq(" + i + ") p";
        if($("#originalSound ul li p").length == 2) {   //TODO
            arr[i].sentence = $(strs)[0]//接.innerHTML 报错
            arr[i].fromWhere = $(strs)[1]
        }else if ($("#originalSound ul li").length == 3) {
            arr[i].sentence = $(strs)[0]
            arr[i].fanyi = $(strs)[1]
            arr[i].fromWhere = $(strs)[2]
        }
    }
    return arr
}

function takeAuthority() {
    var arr = [];
    console.log($("#authority ul li"))
    for (var i = 0; i < $("#authority ul li").length; i++) {
        arr[i] = {}
        arr[i].sentence = $("#authority ul li:eq(" + i + ") p")[0].innerText
        arr[i].others = $("#authority ul li:eq(" + i + ") p")[1].innerText
    }
    return arr
}

(function () {
    obj.word = $(".keyword")[0].innerHTML
    obj.yinbiaoEN = $(".baav .pronounce .phonetic")[0].innerHTML;
    obj.yinbiaoAM = $(".baav .pronounce .phonetic")[1].innerHTML;
    obj.shiyi = takeShiyi();
    obj.resultInternet = takeresultInternet();
    obj.cizuduanyu = takeCizuduanyu();
    obj.resultENEN = takeresultENEN();
    obj.KELINSIDictionary = takeXXXDic();
    obj.examplesToggle = takeExamplesToggle();
    obj.originalSound = takeOriginalSound();
    obj.authority = takeAuthority();
    console.log(obj);
})()