<template>
    <div v-if="show" class="modalcontainer" v-on:click='toggleModal'>
        <div class="modalcontent">
            <i class="fa fa-times pull-right" style="align-self: flex-end;"></i>
            <div>
                <img :src="resultLargeImg">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        toggleModal() {
            this.$store.commit('toggleModal')
        }
    },
    computed: {
        show() {
            return this.$store.state.modal
        },
        resultShown() {
            return this.$store.state.result
        },
        resultLargeImg() {
            if (this.$store.state.result !== null) {
                var url = this.$store.state.result.info.mosquito_url.replace('medium', 'large')
            }
            else {
                var url = 'http://placehold.it/500x500'
            }
            return url
        }
    }
}
</script>
<style>
.modalcontainer {
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
    z-index: 9999;
}

.modalcontent {
    background: white;
    padding: 15px;
    display: flex;
    width: 80%;
    height: 80%;
    flex-direction: column;
}

.modalcontent > div {
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

}

.modalcontent > div > img {
    max-height: 100%;
    max-width: 100%;
}
</style>
