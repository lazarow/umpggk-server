const  socket = io();

function pushData(response){
    app[response.namespace].push(response.data);
}

function updateDate(response,key,value){
    _.assign(_.find(app[response.namespace],[key,value]),response.data);
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
socket.on('tournament',function(response){
});