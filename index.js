const express = require('express');
const socketIO = require('socket.io');

// const io=require('socket.io')();
const api=require('axios')
const singleFetch=require('./KeywordMap')
const multiFetch=require('./KeywordMap')
const fetchApi=require('./FetchApi');
const nextInput=require('./KeywordMap')
const queryParams=require('./KeywordMap')
const CommonWord=require('./KeywordMap')
const KeywordMap=require('./KeywordMap')

var i=0;
var socketUserMap={};
var currentMessageId=1;
var allUser={};
var takingInput=false;
var inputFor='';
var inputUrl=''
// console.log("listining to ")
// io.listen(3001);
const PORT = process.env.PORT || 3000;
const INDEX = './index.html';
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    io.sockets.sockets[socket.id].emit('connected','')
    messageHandler(socket);
    userHandler(socket);
    socketHandler(socket);
    socket.on('disconnect', () => console.log('Client disconnected'));
});
setInterval(() =>{
    console.log('awake')
    io.emit('awake')}, 
10000);
  
// io.on("connection",(socket)=>{
//     messageHandler(socket);
//     userHandler(socket);
//     socketHandler(socket);  
// })

function socketHandler(socket){
    socket.on('storeSocket',payload=>{
        socketUserMap[socket.id]=payload.userId;
        allUser[payload.userId]={};
        allUser[payload.userId]['socketId']=socket.id;
        allUser[payload.userId]['userName']=payload.userName
    })
}
function userHandler(socket){
    socket.on('validateUser',(request)=>{
        var user={}
        if(allUser.hasOwnProperty(request.userId)&&allUser[request.userId]['userName']===request.userName){
            allUser[request.userId]['socketId']=socket.id;
            // io.sockets.sockets[socket.id].emit('validatedUser',{newUser:false})
            io.emit('validatedUser',{newUser:false})
        }
        else{
            allUser[request.userId]={};
            allUser[request.userId]['socketId']=socket.id
            allUser[request.userId]['userName']=request.userName
            io.emit('validatedUser',{newUser:true})
        }
    })
}
function messageHandler(socket){
    
    socket.on('sendToServer',(request)=>{
        console.log(socket.id)
        console.log(request)
        // if(takingInput===true) fetchWithParams(socket,request,inputFor)
        whatToDo(socket,request)
    })
}
function whatToDo(socket,request){
    if(takingInput){
        fetchWithParams(socket,inputUrl,inputFor,request.toLowerCase())
        takingInput=false;return;
    }
    var keys=request.toLowerCase().split(' ');
    var check=true;
    var quickMessage=''
    var quickReplies=[]
    keys.map(key=>{
        if(singleFetch.singleFetch.hasOwnProperty(key)){
            fetchAndEmit(socket,singleFetch.singleFetch[key],key);
            check=false;return;
        }
        if(nextInput.nextInput.hasOwnProperty(key)){
            takeInputAndEmit(socket,nextInput.nextInput[key],key);
            check=false;return;
        }
        if(multiFetch.multiFetch.hasOwnProperty(key)){
            quickMessage=queryParams.queryParams[key]
            quickMessage=quickMessage[Math.floor(Math.random() * (quickMessage).length)]
            multiFetch.multiFetch[key].map((qr,i)=>{
                    quickReplies.push(qr);
            })
        }
    })
    if(quickReplies.length===0&&check){
        var suggesion=queryParams.queryParams['suggesion'][Math.floor(Math.random() * (queryParams.queryParams['suggesion'].length))]
        quickMessage=suggesion;
        var unique={}
        Object.keys(multiFetch.multiFetch).map(topic=>{
            multiFetch.multiFetch[topic].map((d,i)=>{
                if(!unique[d.value])quickReplies.push(d);
                unique[d.value]=true;
            })
        })
        quickReplies= shuffle(quickReplies).slice(0,5);
        console.log(quickReplies)
        quickReplies.push({title:'Full List',value:'full-list'})
        // quickReplies.push({title:'PUBG Room',value:'pubg-room'})
        io.sockets.sockets[socket.id].emit('sendToClient',makeMessage(quickMessage,quickReplies));
        return;
    }
    if(check){
        io.sockets.sockets[socket.id].emit('sendToClient',makeMessage(quickMessage,quickReplies));
    }
}
function fetchAndEmit(socket,url,type){
    var wait=queryParams.queryParams['wait'][Math.floor(Math.random() * (queryParams.queryParams['wait'].length))]
    io.sockets.sockets[socket.id].emit('sendToClient',makeMessage(wait,[]))
    fetchApi.fetchData(url,type,currentMessageId++).then(res=>{
        res.map(msg=>{
            currentMessageId++;
            io.sockets.sockets[socket.id].emit('sendToClient',msg);
        })
    })
}
function takeInputAndEmit(socket,url,type){

    takingInput =true;
    inputUrl=url;
    inputFor=type;
    var wait=queryParams.queryParams[type][Math.floor(Math.random() * (queryParams.queryParams[type].length))]
    var quickReplies=[];
    if(KeywordMap.qrForNextInput.hasOwnProperty(type)){
        KeywordMap.qrForNextInput[type].map((d,i)=>{
            quickReplies.push(d);
        })
    }
    quickReplies.slice(0,10);
    io.sockets.sockets[socket.id].emit('sendToClient',makeMessage(wait,quickReplies));
}
function fetchWithParams(socket,url,type,param){
    takingInput=false;
    var wait=queryParams.queryParams['wait'][Math.floor(Math.random() * (queryParams.queryParams['wait'].length))]
    io.sockets.sockets[socket.id].emit('sendToClient',makeMessage(wait,[]))
    fetchApi.fetchDataWithParams(url,type,currentMessageId++,param).then(res=>{
        res.map(msg=>{
            currentMessageId++;
            io.sockets.sockets[socket.id].emit('sendToClient',msg);
        })
    })
}
const makeMessage=(message,quickReplies,image='')=>{
    return{
        _id:currentMessageId++,
        text:message,
        createdAt:new Date(),
        quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values:quickReplies,
        },
        user:{
            _id:'server',
            name:'server',
        },
        image:image,
    }
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
