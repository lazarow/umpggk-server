<template>
    <div class="box box--page">
        <header class="box--title">{{printPageTitleFromUrl($route.path)}}</header>
        <div class="row border--bottom" v-for="monster in monsters">
            <player_data v-bind:imagePatch="monsterImage" v-bind:name="monster.name" v-bind:details="'Age: '+ monster.age"></player_data>
            <div class="rightPart">
                <span class="strenght_info">
                    {{monster.strenght}}/100
                </span>
                <span class="text--bold text-margin">
                    Strength
                </span>
            </div>
            <div class="container--monsterStrength">
                <div class="strength--bar background">
                    <span class="strength--bar__data"  :data-strength="monster.strenght"></span>
                </div>
            </div>

        </div>
        <pagination v-on:change_page="change_page" v-bind:currentPage="currentPage"></pagination>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import player_data from './Player_data.vue';
    import pagination from './pagination.vue';
    import monsterLogo from '../assets/monsterLogo.png';

    export default {
        components: {
            player_data,
            pagination
        },
        name: 'Monsters',
        data() {
            return {
                monsterImage: monsterLogo,
                monsters:[],
                currentPage:0,
                printPageTitleFromUrl: function (url) {
                    if( url.charAt(0) === '/' ){
                        url = url.slice( 1 );
                    }
                    url = url.charAt(0).toUpperCase() + url.slice(1);
                    return url;
                },

            }
        },
        created: function () {
            this.load_monsters();
        },
        methods: {
            change_page: function (page) {
                this.currentPage = page;
                this.load_monsters();
            },
            load_monsters: function () {
                this.$http.get('api/v1/gnomes?_format=json&limit=11&offset='+this.currentPage*10)
                    .then(function (response) {
                        this.monsters = response.data;
                    })
                    .then(function () {
                        let strength_bars = document.getElementsByClassName('strength--bar__data');
                        for (let i = 0; i < strength_bars.length; i++) {
                            strength_bars[i].style.width = strength_bars[i].getAttribute('data-strength')+"%";
                        }
                    })
            }
        }
    }

</script>

<style lang="less" src="../less/monsters.less"></style>