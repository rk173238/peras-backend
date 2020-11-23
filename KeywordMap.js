function currentDate(){
    var d=new Date();
    var y=d.getFullYear();
    var m=d.getMonth()+1; if(m<10) m='0'+m;
    var dd=d.getDay();if(dd<10) d='0'+d;
    return y+'-'+m+'-'+dd;
}
var quickReplies={
    news:[]
}
var nextInput={
    'codechef-rating':'https://www.codechef.com/users/',
    'codeforces-rating':'https://codeforces.com/api/user.info?handles=',
    "news":'http://newsapi.org/v2/everything?q=',
}
var singleFetch={
    'codechef-contest':'https://www.codechef.com/contests',
    "codeforces-contest":'https://codeforces.com/api/contest.list',
    "joke":'https://official-joke-api.appspot.com/',
    "stop":'gibrish',
    'pubg-room':'https://www.youtube.com/channel/UC3DGc4vje-K9idlGl4YrFvg',
    'pipe-line':'My Creator is working on this,untill try other features and enjoy '

}
var multiFetch={
    topic:[
        {title:'news',value:'news'},
        {title:'contest',value:'contest'},
        {title:'Rating',value:'rating'},
    ],
    contest:[
        {title:'codechef-contest',value:'codechef-contest'},
        {title:'codeforces-contest',value:'codeforces-contest'},
    ],
    rating:[
        {title:'codechef-rating',value:'codechef-rating'},
        {title:'codeforces-rating',value:'codeforces-rating'},
    ],
    "full-list":[
        {title:'news',value:'news'},
        {title:'codechef-rating',value:'codechef-rating'},
        {title:'codechef-contest',value:'codechef-contest'},
        {title:'contest',value:'contest'},
        {title:'Rating',value:'rating'},
        {title:'codeforces-rating',value:'codeforces-rating'},
        {title:'codeforces-contest',value:'codeforces-contest'},
        {title:'Joke',value:'Joke'},
        {title:'PUBG Room',value:'pubg-room'},
        {title:'Sensex Live',value:'pipe-line'},
        {title:'Nifty Live',value:'pipe-line'},
        {title:'Stock',value:'pipe-line'},
        {title:'Random fun',value:'pipe-line'},
    ],
    'pipeline':[
        {title:'Sensex Live',value:'pipe-line'},
        {title:'Nifty Live',value:'pipe-line'},
        {title:'Stock',value:'pipe-line'},
        {title:'Random fun',value:'pipe-line'},
    ],
}
var qrForNextInput={
    news:[
        {title:'top stories',value:'top-stories'},
        {title:'Climate Change',value:'climate-change'},
        {title:'tech',value:'tech'},
        {title:'CP',value:'competetive-programming'},
        {title:'Anything',value:'Anything'},
    ]
}
var queryParams={
    'codechef-rating':['Enter Profile name'],
    'codeforces-rating':['User Ids Seperated with semicolon'],
    "news":['Provide a News Topic'],
    "wait":["Hold On","Wait Fetching","Please Wait","Give me a sec","Calculating for you","Hold On","Fetching","Wait"],
    "suggesion":["Did You Mean","Suggesion","Please chhose one","Still Learning","Here is some suggesion","Did you mean any of these"
                ,"What...","Presize Please","Topic Please","Hold On"],
    "rating":['choose a source'],
    "topic":['choose a topic'],
    "contest":['choose a source'],
    "full-list":["Here is the full list....Many more to come"]
}
var CommonWord={
    "wait":["Hold On","Wait Fetching","Please Wait","Give me a sec","Calculating for you","Hold On","Fetching","Wait"],
    "suggesion":["Did You Mean","Suggesion","Please chhose one","Still Learning","Here is some suggesion","Did you mean any of these"
                ,"What...","Presize Please","Topic Please","Hold On"],
}
module.exports={singleFetch,multiFetch,quickReplies,nextInput,queryParams,CommonWord,qrForNextInput}