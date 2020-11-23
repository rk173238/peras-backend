const api=require('axios')
const keyWord=require('./KeywordMap')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function fetchDataWithParams(url,type,currentMessageId,param){
    if(type==='codechef-rating')
        return fetchCodeChefRating(url,currentMessageId,param)
    if(type==='codeforces-rating')
        return fetchCodeforcesRating(url,currentMessageId,param)
    if(type==='news')
        return fetchNewsWithTopic(url,currentMessageId,param)
    return Promise.resolve([makeMessage(currentMessageId,'404 Not Found')])

}
function fetchData(url,type,currentMessageId){
    type=type.toLowerCase();
    if(['tech','top-stories','competetive-programming','climate-change'].includes(type))
        return fetchNewsApi(url,currentMessageId).then(res=>res)
    if(type==='codechef-contest')
        return fetchCodeChefContest(url,currentMessageId).then(res=>res)
    if(type==='codeforces-contest')
        return fetchCodeforcesContest(url,currentMessageId).then(res=>res)
    if(type==='joke')
        return fetchJoke(url,currentMessageId).then(res=>res)
    if(type==='stop')
        return Promise.resolve([makeMessage(currentMessageId,'Okay,Okay My Bad ')])
    if(type==='pubg-room')
        return Promise.resolve([makeMessage(currentMessageId,'Join 2PM or 10PM here Link:'+url)])
    if(type==='pipe-line')
        return Promise.resolve([makeMessage(currentMessageId,url)])

    return Promise.resolve([makeMessage(currentMessageId,'404 Not Found')])
}
function fetchNewsApi(url,currentMessageId){
    return api.get(url).then(res=>{
        try {
            var articles=res.data.articles;
            var ind=Math.floor(Math.random() * (articles.length));
            var msg=[makeMessage(currentMessageId++,articles[ind].title+'\n'+articles[ind].description+" Link:"+articles[ind].url,articles[ind].urlToImage)]
            return [...msg];
        }catch(error) {
            return [makeMessage(currentMessageId++,'Erorr 404 Article not found')]
        }
        
    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
function fetchJoke(url,currentMessageId){
    var ran=Math.floor(Math.random() * 10)%2
    url=ran?url+'jokes/programming/random':url+'jokes/random'
    return api.get(url).then(res=>{
        try {
            var data=[],setup='l',punch='a';
            if(ran){
                setup=res.data[0].setup;
                punch=res.data[0].punchline
                data.push(makeMessage(currentMessageId++,'Here is a Programming Joke'))
            }
            else{
                setup=res.data.setup;
                punch=res.data.punchline
            }
            data.push(makeMessage(currentMessageId++,setup))
            data.push(makeMessage(currentMessageId++,punch))
            var ha=['ha ha ha ha','hee hee hee hee','ha ha very funny',]
            ha=ha[Math.floor(Math.random()*ha.length)]
            data.push(makeMessage(currentMessageId++,ha))
            // console.log(setup,punch,url)
            return data;
        } catch (error) {
            return [makeMessage(currentMessageId++,'Erorr 404 Joke not found Ha ha ha')]
        }
    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
function fetchCodeChefContest(url,currentMessageId){
    return api.get(url).then(res=>{
        res=res.data
        const { document } = (new JSDOM(res)).window;
        var presentContest=[],futureContest=[];
        var present=document.getElementsByClassName('dataTable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')
        var future=document.getElementsByClassName('dataTable')[1].getElementsByTagName('tbody')[0].getElementsByTagName('tr')
        Array.from(present).forEach((el) => {
            var row=el.getElementsByTagName('td');
            var code=row[0].textContent;
            var name=row[1].textContent;
            var start=row[2].textContent;
            var end=row[3].textContent;
            presentContest.push(makeMessage(currentMessageId++,code+' '+start+ ' Link:'+'https://www.codechef.com/'+code));
        });
        Array.from(future).forEach((el) => {
            var row=el.getElementsByTagName('td');
            var code=row[0].textContent;
            var name=row[1].textContent;
            var start=row[2].textContent;
            var end=row[3].textContent;
            futureContest.push(makeMessage(currentMessageId++,code+' '+start+ ' Link:'+'https://www.codechef.com/'+code));
        });
        var p=[makeMessage(currentMessageId++,'Present Contest')]
        var f=[makeMessage(currentMessageId++,'Future Contest')]
        return [...p,...presentContest,...f,...futureContest];        
    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
function fetchCodeforcesContest(url,currentMessageId){
    return api.get('https://codeforces.com/api/contest.list').then(res=>{
        try{
            res=res.data.result;
            res=res.filter(d=>d.phase==='BEFORE'); 
            data=[];
            res.map(contest=>{
                var name=contest.name,id=contest.id,duration=(contest.durationSeconds)/3600;
                var startingIn=0-((contest.relativeTimeSeconds)/3600).toFixed(3);
                var startTime=new Date((new Date(1970, 0, 1)).setSeconds(contest.startTimeSeconds)).toDateString();
                data.push(makeMessage(currentMessageId++,'Contest Id:'+id+"\nName:"+name+'\nStartTime:'+startTime
                +'\nWith Duration '+duration+' hours'
                +'\nAnd Starting in '+startingIn+' hours'))
            })
            return data.reverse();
        }catch (error) {
            return [makeMessage(currentMessageId++,'Erorr 404 Page not found')]
        }

    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
///for input functions
function fetchNewsWithTopic(url,currentMessageId,param){
    url=url+param+'&'+currentDate()+'&sortBy=publishedAt&apiKey=3c9aab978b0d488690b02d207d158ce1';
    console.log(url)
    return fetchNewsApi(url,currentMessageId).then(res=>res)
}
function fetchCodeChefRating(url,currentMessageId,param){
    console.log(url)
    url=url+param
    return api.get(url).then(res=>{
        try {
            res=res.data
            const { document } = (new JSDOM(res)).window;
            var name=document.getElementsByClassName('user-details-container')[0].getElementsByTagName('header')[0].getElementsByTagName('h2')[0].textContent
            var rating=document.getElementsByClassName('rating-number')[0].textContent;
            var highestRating=document.getElementsByClassName('rating-header')[0].getElementsByTagName('small')[0].textContent
            var eachStar=document.getElementsByClassName('rating-star')[0].getElementsByTagName('span')
            var star='';
            Array.from(eachStar).forEach((span)=>{
                star+='*'
            })
            console.log(name,rating,highestRating,star)
            name=[makeMessage(currentMessageId++,'Hi '+name+`\nYour current rating is`+rating)]
            star=[makeMessage(currentMessageId++,"Current star:"+star)]
            highestRating=[makeMessage(currentMessageId++,highestRating)]
            var data=[...name,...star,...highestRating]
            return data
        }catch(error) {
            return [makeMessage(currentMessageId++,'Erorr 404 Page not found')]
        }
    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
function fetchCodeforcesRating(url,currentMessageId,param){
    url=url+param;
    return api.get(url).then(res=>{
        try {
            res=res.data.result;
            var data=[]
            console.log(res)
            res.map(profile=>{
                var country=(profile.country)?'\nCountry:'+profile.country:'',image=profile.titlePhoto;
                var rating=profile.rating,rank=profile.rank;
                var name=(!profile.firstName||!profile.lastName)?profile.handle:profile.firstName+' '+profile.lastName;
                data.push(makeMessage(currentMessageId++,'Hi '+name+"\nYour Rating is:"+rating+"\nRank is:"+rank+
                country,'http:'+image))
            })
            // console.log(data)
            return data
        } catch (error) {
            return [makeMessage(currentMessageId++,'Erorr 404 Page not found')]
        }
    },e=>[makeMessage(currentMessageId++,'Erorr 404 Page not found')])
}
const makeMessage=(currentMessageId,message,image='')=>{
    return{
        _id:currentMessageId,
        text:message,
        createdAt:new Date(),
        user:{
            _id:'server',
            name:'server',
        },
        image:image,
    }
}
function currentDate(){
    var d=new Date();
    console.log(d)
    var y=d.getFullYear();
    var m=d.getMonth()+1; if(m<10) m='0'+m;
    var dd=d.getDate();if(dd<10) d='0'+d;
    return y+'-'+m+'-'+dd;
}
module.exports={fetchData,fetchDataWithParams}