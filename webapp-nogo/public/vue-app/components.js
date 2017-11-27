Vue.component('admin',{
    template: `
<div class="panel panel-warning">
    <div class="panel-heading">Panel zarządzania turniejem</div>
    <div class="panel-body">
        <button class="btn btn-default btn-xs" @click="startNextRound">
            <i class="fa fa-play" aria-hidden="true"></i> Rozpocznij kolejną rundę
        </button>
        <button class="btn btn-default btn-xs" @click="typeToken">
            <i class="fa fa-key" aria-hidden="true"></i> Wpisz token
        </button>
    </div>
</div>
    `,
    data: function () {
        return {
            token: 'replace-it'
        };
    },
    methods: {
        typeToken() {
            this.token = prompt('Wpisz token zgodny z konfiguracją serwera:');
        },
        startNextRound() {
            axios.get('http://'+location.hostname+':8001/tournament/start-next-round?token='+this.token);
        }
    }
});

Vue.component('dump-data', {
    props: ['data'],
    template: `<pre>{{data}}</pre>`,
});



Vue.component('player',{
    props: ['player','index'],
    template:`
        <tr><td>{{index}}</td>
    <td>{{player.name}}</td>
    <td>{{player.points}}</td>
    <td>{{player.sos}}</td>
    <td>{{player.sosos}}</td>
    <td>{{player.sodos}}</td>
    <td>{{player.matches.length}}</td>
    <td><span :class="[player.connected ? 'connected' : 'disconnected', 'connection']"></span></td></tr>
    `
});

Vue.component('home',{
    template: `
    <div class='panel panel-default'>
        <div class="panel-heading">Tablica wyników</div>
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Gracz</th>
                    <th>Pkt</th>
                    <th>Sos</th>
                    <th>Sosos</th>
                    <th>Sodos</th>
                    <th>L.meczy</th>
                    <th>Poł.</th>
                </tr>
            </thead>
            <tbody>
                     <tr is="player" v-for="(player, index) in scoreboard($parent.players)" :key="player.playerId" :player="player"></tr>
            </tbody>
        </table>
    </div>
    `,
    methods:{
        scoreboard: function (players) {
            return _.orderBy(players,['points','name'],['desc'])
        },
        cos: function(){
            console.log(this.$parent.tournament);
        }
    },
    components: {
        player: Vue.component('player'),
    },
    data: function () {
        return {
            players: this.$parent.players
        }
    }
});
