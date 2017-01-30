<template>
<div class="distribution">
    <div class="ct-chart ct-perfect-fourth"></div>
</div>
</template>
<script>
import 'chartist/dist/chartist.css'
import Chartist from "chartist"

export default {
    mounted() {
        var tmp = new Chartist.Bar('.ct-chart', this.$store.state.chartData, this.$store.state.chartOptions)
        this.$store.state.chartist = tmp

    },
    computed: {
        series() {
            return this.$store.state.chartData.series
        }
    },
    watch: {
        'series': function(val) {
            this.$store.state.chartist.detach()
            var tmp = new Chartist.Bar('.ct-chart', this.$store.state.chartData, this.$store.state.chartOptions)
            this.$store.state.chartist = tmp


        }
    }
}
</script>
