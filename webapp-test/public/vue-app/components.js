Vue.component('admin', {
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
    template: `<pre>{{data}}</pre>`
});
