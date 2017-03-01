<template>
    <div class="col-md-12">
        hola
    </div>
</template>
<script>
export default {
    computed: {
        results() {
            return this.$store.state.results
        },
    },
    methods: {
        getResults() {
            this.$store.commit('cleanMarkers')
            this.$store.dispatch('getResults', {query: formatQuery(this.query),
                                                endpoint: this.endpoint,
                                                limit: 100,
                                                offset:0
                                                })
        }
    },
}
</script>
<style>

</style>

