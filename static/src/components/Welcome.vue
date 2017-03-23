<template>
    <div v-if="show" class="welcomecontainer" v-on:click='toggleModal'>
        <div class="welcomecontent">
            <i class="closeme fa fa-times pull-right" style="align-self: flex-end;"></i>
            <div class="text" v-html="$t('message.welcome')"></div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        toggleModal() {
            this.$store.commit('toggleWelcome')
        }
    },
    computed: {
        show() {
            return this.$store.state.welcome
        },
    }
}
</script>
<style>
.closeme {
    cursor: pointer;
}
.welcomecontainer {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-content: center;
    align-items: center;
    z-index: 1000;
}

.welcomecontent {
    background: white;
    padding: 30px;
    display: flex;
    width: 80%;
    height: 80%;
    overflow-y: scroll;
    flex-direction: column;
}

.welcomecontent .text > h1,
.welcomecontent .text > h2 {
    color: #a41f1b;
}


.welcomecontent > p,
.welcomecontent > ol {
    color: black;
}

.welcomecontent .text {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: black;
}

.welcomecontent .flexcentered img {
    max-height: 60px;
    cursor: pointer;
}
</style>
