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
		<button class="btn btn-default btn-xs" @click="restartLastRound">
            <i class="fa fa-refresh" aria-hidden="true"></i> Zresetuj ostatnią rundę
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
        },
		restartLastRound() {
			axios.get('http://'+location.hostname+':8001/tournament/restart-last-round?token='+this.token);
		}
    }
});

Vue.component('scoreboard', {
	props: ['players'],
    template: `
<div class="panel panel-default">
    <div class="panel-heading">Lista graczy</div>
	<table class="table">
		<thead>
			<tr>
				<th>Pozycja</th>
				<th>Nazwa gracza</th>
				<th class="text-right">L. punktów</th>
				<th class="text-right">SOS</th>
				<th class="text-right">SOSOS</th>
				<th class="text-right">SODOS</th>
				<th class="text-right">L. meczy</th>
				<th class="text-center">Połączenie</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(player, index) in sorted">
				<td>{{index + 1}}</td>
				<td>{{player.name}}</td>
				<td class="text-right">{{player.points}}</td>
				<td class="text-right">{{player.sos}}</td>
				<td class="text-right">{{player.sosos}}</td>
				<td class="text-right">{{player.sodos}}</td>
				<td class="text-right">{{player.matches.length}}</td>
				<td class="text-center">
					<i class="glyphicon glyphicon-ok text-success" v-if="player.connected"></i>
					<i class="glyphicon glyphicon-flash text-danger" v-else></i>
				</td>
			</tr>
		</tbody>
	</table>
</div>
    `,
    computed: {
		sorted: function () {
			return this.players.sort(function(a, b) {
				if (b.points == a.points) {
					if (b.sos == a.sos) {
						if (b.sosos == a.sosos) {
							return b.sodos - a.sodos;
						}
						return b.sosos - a.sosos;
					}
					return b.sos - a.sos;
				}
				return b.points - a.points;
			});
		}
	}
});

Vue.component('games', {
	props: ['games'],
    template: `
<div class="panel panel-default">
    <div class="panel-heading">Lista rozegranych gier</div>
	<table class="table">
		<thead>
			<tr>
				<th class="text-center" style="width: 1%;">#ID</th>
				<th class="text-center" style="width: 1%;">#ID&nbsp;meczu</th>
				<th class="text-left" style="width: 20%;">Gracz czarny</th>
				<th class="text-left" style="width: 20%;">Gracz biały</th>
				<th class="text-left" style="width: 20%;">Zwycięzca</th>
				<th class="text-left" style="width: 30%;">Wynik</th>
				<th class="text-right" style="width: 8%;">Czas</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="game in games">
				<td class="text-right">{{game.id + 1}}</td>
				<td class="text-right">{{game.matchId + 1}}</td>
				<td class="text-left">{{game.black}}</td>
				<td class="text-left">{{game.white}}</td>
				<td class="text-left">{{game.winner}}</td>
				<td class="text-left">{{game.wonBy}}</td>
				<td class="text-right">{{game.duration}}</td>
			</tr>
		</tbody>
	</table>
</div>
    `
});

Vue.component('round', {
	props: ['round', 'matches', 'title', 'color'],
    template: `
<div :class="'panel panel-' + color">
    <div class="panel-heading">{{title}} #{{round.id + 1}}</div>
	<table class="table">
		<thead>
			<tr>
				<th class="text-center" style="width: 1%;">#ID</th>
				<th class="text-right" style="width: 49%;">Gracz czerwony</th>
				<th class="text-center" style="width: 1%;">Wynik</th>
				<th class="text-left" style="width: 49%;">Gracz niebieski</th>
				<th class="text-center" style="width: 1%;"></th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="match in matchesInRound">
				<td class="text-right">{{match.id + 1}}</td>
				<td class="text-right">{{match.red}}</td>
				<td class="text-center">{{match.redPoints}} : {{match.bluePoints}}</td>
				<td class="text-left">{{match.blue}}</td>
				<td class="text-center">
					<i class="glyphicon glyphicon-ok text-success" v-if="match.finishedAt != null"></i>
					<i class="glyphicon glyphicon-hourglass text-warning" v-else></i>
				</td>
			</tr>
		</tbody>
	</table>
</div>
    `,
    computed: {
		matchesInRound: function () {
			const round = this.round;
			return this.matches.filter(function (match) {
				return match.roundId == round.id;
			});
		}
	}
});

Vue.component('dump-data', {
    props: ['data'],
    template: `<pre>{{data}}</pre>`,
});
