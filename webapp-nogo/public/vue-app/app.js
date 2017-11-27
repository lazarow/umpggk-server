const router = new VueRouter({
    routes: [
        {path: '/home', component: Vue.component('home')},
    ]
});

const app = new Vue({
    router,
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
