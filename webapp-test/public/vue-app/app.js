const router = new VueRouter({
    routes: [
        {path: '/admin', component: admin},
        {path: '/home', component: home},

    ]
});


const app = new Vue({
    router,
    data: {
        tournament: {},
        players: [],
        rounds: [],
        matches: [],
        games: []
    },
    methods: {

    },
}).$mount('#webapp');
