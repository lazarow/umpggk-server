const  socket = io();

function pushData(response){
    app[response.collection].push(response.data);
    console.log(response);
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
    app.players = response.players;
    app.tournament = response.tournament;
    app.rounds = response.rounds;
    app.matches = response.matches;
    app.games = response.games;
    console.log(response);
});