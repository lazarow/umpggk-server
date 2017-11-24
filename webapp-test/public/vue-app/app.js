const app = new Vue({
    el: '#webapp',
    data: {
        displayAdmin: /[?&]admin=/.test(location.search),
        tournament: {},
        players: [],
        rounds: [],
        matches: [],
        games: []
    }
});
