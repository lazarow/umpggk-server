Vue.component('player', {
    props: ['player','index'],
    template:
    '<tr><td>{{index}}</td>' +
    '<td>{{player.name}}</td>' +
    '<td>{{player.points}}</td></tr>'
});


Vue.component('match', {
    props: ['match'],
    template: '<tr>' +
    '<td>{{match.matchId}}</td>' +
    '<td>{{match.red}}</td>' +
    '<td>{{match.blue}}</td>' +
    '<td>{{match.redPoints}} - {{match.bluePoints}}</td>' +
    '<td>{{winner}}</td>' +
    '</tr>',
    data: function () {
        if (this.match.redPoints > this.match.bluePoints) {
            return {winner: this.match.red}
        } else if (this.match.redPoints < this.match.bluePoints) {
            return {winner: this.match.blue}
        } else {
            return {winner: "-"}
        }
    }
});


Vue.component('game', {
    props: ['game'],
    template: '<tr><td>{{game.gameId}}</td><td>{{game.winner}}</td></tr>'
});


Vue.component('admin', {
    props: ['players'],
    template: `<div class="row admin-component">
  <div class="col">
  
   <div class="form-group row">
    <label for="token-input" class="col-2 col-form-label">Token</label>
    <div class="col-6">
    <input class="form-control" v-model="token" type="password" value="" id="token-input">
    </div>
   </div>
   
   <div class="form-group row">
    <label for="open-btn" class="col-2 col-form-label"></label>
    <div class="col-6">
    <input type="button" v-on:click="openRegistration()" class="form-control btn btn-warning" value="Open registration" id="open-btn">
    </div>
   </div>

    
  </div>
  <div class="col-6 col-md-4">
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a  v-for="player in players" class="dropdown-item" href="#">{{player.name}}</a>
      </div>
    </div>
    <br/>
    <button type="button" class="btn btn-danger">Delete player</button>
  </div>
</div>`,
    methods: {
        openRegistration(){
            axios.get('http://'+location.hostname+':8001/tournament/open-registration?token='+this.token)
                .then(function (response) {
                    console.log(response);
                    console.log('success');
                })
                .catch(function (error) {
                    console.log(error);
                    console.log('error');
                });
        }
    },
    data: function () {
        return {token:''};
    }

});
