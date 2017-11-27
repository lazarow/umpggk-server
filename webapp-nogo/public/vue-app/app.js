const router = new VueRouter({
    routes: [
        {path: '/admin', component: Vue.component('admin')},
        {path: '/home', component: Vue.component('home')},

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
