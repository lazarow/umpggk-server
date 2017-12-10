const app = new Vue({
    data: {
        displayAdmin: /[?&]admin=/.test(location.search),
        tournament: {},
        players: [],
        rounds: [],
        matches: [],
        games: []
    },
    methods: {}
}).$mount('#webapp');
