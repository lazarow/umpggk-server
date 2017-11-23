
var router = new VueRouter({
    mode: 'history',
    routes: []
});

let app = new Vue({
    el: '#webapp',
    router: router,
    data: {
        "tournament": {},
        "players": [

        ],
        "rounds": [

        ],
        "matches": [

        ],
        "games": [

        ],
        "ui":{
            player:null,
            round:null,
            match:0,
            game:null,
        }
    },
    methods: {
        scoreboard: function (players) {
            return _.orderBy(players,['points','name'],['desc'])
        },
        roundMatches: function (roundNumber) {
            if(roundNumber !== 0){
                let round = _.find(this.rounds, function(round) { return round.roundId === roundNumber; });
                return _.filter(this.matches, function(match){
                    return  _.includes(round.matches,match.matchId)
                })
            } else {
                return this.matches
            }

        },
    },
    computed: {
        adminPanel: function () {
            return this.$route.query.adminPanel

        }
    }
});



