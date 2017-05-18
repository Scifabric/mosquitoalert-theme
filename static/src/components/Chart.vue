<template>
<div class="distribution">
    <div class="ct-chart"></div>
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
<style>
.ct-series-a .ct-bar,
.ct-series-b .ct-bar,
.ct-series-c .ct-bar,
.ct-series-d .ct-bar,
.ct-series-e .ct-bar,
.ct-series-f .ct-bar,
.ct-series-g .ct-bar,
.ct-series-h .ct-bar,
.ct-series-i .ct-bar,
.ct-series-j .ct-bar,
.ct-series-k .ct-bar,
.ct-series-l .ct-bar{
    stroke: rgb(220, 220, 220) !important;
}

.ct-label {
    font-size: 10px;
}
</style>
