```javascript
//前端发送的请求问题
{
    "userId": "",
    "paperModule":1//int
}

//后端返回的问题和选项
{
    "msg":"",//success/fail
    "errorText":"",//如果错误，这是错误原因
    "body":{
        "paperModule":1,//number
        "questions":[
            {
                "questionId": "",//char
                "questionContent": "",//char
                "questionType": 1,//number
                "options": [
                    {
                        "anwserId":"",
                        "anwserContent": ""
                    }
                ],
                "info":""//特殊类型的问题输入，比如选日期，地址等，
            }
        ],
        "isAnswered":true,//boolean
        "answered":[
            {
                "questionId":"",
                "questionType": 1,//number
                "anwserId":"",
                "others": ""//如果是输入其他，则不为空
            }
        ]
    }
}

//前端传给后台的用户答案。
{
    "userId":"",
    "paperModule":1,//
    "anwser":[
        {
            "UUID":"",
            "answerId":["",""]//单选一个，多选多个，填空就是空的，比如单选就是["1"],多选就是["1","3"]
        }
    ]
}

//传题反馈
{
    "msg":"",
    "errorText":""
}

// 注册

{
    "teleNum": "",
    "password": "",  //md5
    "roleName":""// doc 或者 patient
}

// 注册反馈
{
    "msg": "",
    "errorText": ""
}


// 登录
{
    "teleNum":"",
    "password": "",  //md5
    "roleName":"",// doctor 或者 patient
    "isRemember": true//记住密码
}
{
    "msg": true,
    "errorText": ""
}
```