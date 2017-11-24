const  socket = io();

function pushData(response){
    console.log(app);
    console.log(response.collection);
    app[response.collection].push(response.data);
}

function updateDate(response,key,value){
    _.assign(_.find(app[response.collection],[key,value]),response.data);
}

socket.on('games',function(response){
    if(response.action === 'insert'){
        pushData(response);
    } else {
        updateDate(response,'id',response.data.id);
    }
});
socket.on('matches',function(response){
    if(response.action === 'insert'){
        pushData(response);
    } else {
        updateDate(response,'id',response.data.id);
    }
});
socket.on('players',function(response){

    if(response.action === 'insert'){
        pushData(response);
    } else {
        updateDate(response,'name',response.data.name);
    }
});
socket.on('rounds',function(response){
    if(response.action === 'insert'){
        pushData(response);
    } else {
        updateDate(response,'id',response.data.id);
    }
});
socket.on('database',function(response){
    app.data = response;
});