let admin = {
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
};

Vue.component('dump-data', {
    props: ['data'],
    template: `<pre>{{data}}</pre>`,
});




let player = {
    props: ['player','index'],
    template:
    '<tr><td>{{index}}</td>' +
    '<td>{{player.name}}</td>' +
    '<td>{{player.points}}</td></tr>'
};

let home = {
    template: `
    <div class='panel panel-default'>
        <div class="panel-heading">Tablica wyników</div>
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Gracz 1</th>
                    <th>Gracz 2</th>
                    <th>Wynik</th>
                    <th>Zwycięzca</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div>{{players}}</div>
    </div>
    `,
    methods:{
        scoreboard: function (players) {
            return _.orderBy(players,['points','name'],['desc'])
        },
    },
    components: {
        player: player
    },
    data: function () {
        return {
            players: this.$parent.players
        }
    }
};

