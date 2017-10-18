<template>
    <div class="container border--bottom">
        <nav class="box nav">
            <a class="nav--link nav--link__logo" href="/">
                <img class="nav--logo" src="../static/images/logo.png">
            </a>
            <router-link to="/gnomes">
                <span class="nav--link">
                    Gnomes
                </span>
            </router-link>
            <router-link to="/trolls">
                <span class="nav--link">
                    Trolls
                </span>
            </router-link>
            <div class="rightPart nav--rightPart">
                <button v-on:click="emit_open_create_moncter" class="btn--jazzy text--bold nav--btn">
                    Create monster
                </button>
                <player_data v-bind:imagePatch="playerLogo" name="Robert Łabuś" details="Game master"></player_data>
            </div>
            <div class="clearfix"></div>
        </nav>
    </div>
</template>

<script>
/*
    import player_data from './Player_data.vue';
    import playerLogo from '../assets/avatar.png';

    export default {
        components: {
            player_data
        },
        name: 'Nav_menu',
        data() {
            return {
                playerLogo: playerLogo
            }
        },
        methods: {
            emit_open_create_moncter: function() {
                this.$emit('open_create_moncter');
            }
        },
    }
*/
</script>

<!--
<style lang="less" src="../less/nav_menu.less"></style>-->
