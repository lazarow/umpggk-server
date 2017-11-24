Vue.component('player', {
    props: ['player','index'],
    template:
    '<tr><td>{{index}}</td>' +
    '<td>{{player.name}}</td>' +
    '<td>{{player.points}}</td>' +
    '<td>{{player.sos}}</td>' +
    '<td>{{player.sosos}}</td>' +
    '<td>{{player.sodos}}</td>' +
    "<td><span class='status' v-bind:class='{ playerConnected: player.connected }'></span></td></tr>",

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
  
   <div class="form-group row" >
    <label for="token-input" class="col-2 col-form-label" v-on:click="toggleTokenInput()">Token</label>
    <div class="col-12 col-lg-6" v-if="tokenInput">
    <input class="form-control" type="password" value="" id="token-input">
       <br/>
     <input type="button"  class="form-control btn btn-danger" v-on:click="setToken()" value="Set token" id="open-btn">
    </div>
   </div>
   <hr/>
   
   <div class="form-group row">
    <label for="open-btn" class="col-2 col-form-label"></label>
    <div class="col-12 col-lg-6">
    <input type="button" v-on:click="openRegistration()" class="form-control btn btn-warning" value="Open registration" id="open-btn">
        <br/>
        <br/>
     <input type="button"  class="form-control btn btn-warning" value="Start round" id="open-btn">
    </div>
   </div>

    
  </div>
  <div class="col-12 col-lg-4">
    <div class="dropdown">
      <select class="custom-select">
            <option  v-for="player in players" class="dropdown-item" value="player.name">{{player.name}}</option>
       </select>
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
        },
        startRound(){
            axios.get('http://'+location.hostname+':8001/tournament/start-next-round?token='+this.token)
                .then(function (response) {
                    console.log(response);
                    console.log('success');
                })
                .catch(function (error) {
                    console.log(error);
                    console.log('error');
                });
        },
        setToken(){
            this.tokenInput = false;
            this.token = $("#token-input").val();
        },
        toggleTokenInput(){
            this.tokenInput = !this.tokenInput;
        }
    },
    data: function () {
        return {
            token:'',
            tokenInput:true,
        };
    }

});
