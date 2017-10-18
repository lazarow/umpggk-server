

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: tournament },
        { path: '/players', component: players },
        { path: '/rounds', component: rounds },
        { path: '/matches', component: matches },
        { path: '/games', component: games }
    ]
});

let app = new Vue({
    router: router,
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});