Vue.component('player', {
    props: ['player'],
    template: '<tr><td>{{player.playerId}}</td>' +
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
    template: `
<div class="row admin-component">
  <div class="col">
    <button type="button" class="btn btn-secondary" v-on:click="openRegistration()">Open registration</button>
    <button type="button" class="btn btn-secondary">Free</button>
    <button type="button" class="btn btn-secondary">Free</button>
    <button type="button" class="btn btn-secondary">Free</button>
    <button type="button" class="btn btn-secondary">Free</button>
    <button type="button" class="btn btn-secondary">Free</button>
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
            console.log(location.hostname);
            axios.get('http://'+location.hostname+':8001/tournament/open-registration?token=replace-it')
                .then(function (response) {
                    console.log(response);
                    console.log('success');
                })
                .catch(function (error) {
                    console.log(error);
                    console.log('error');
                });
        }
    }

});
