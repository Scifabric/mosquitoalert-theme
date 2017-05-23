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
        var labels = [this.$t('message.jan'), this.$t('message.feb'), this.$t('message.mar'), this.$t('message.apr'), this.$t('message.may'), this.$t('message.jun'), this.$t('message.jul'), this.$t('message.aug'), this.$t('message.sep'), this.$t('message.oct'), this.$t('message.nov'), this.$t('message.dec')]
        this.$store.state.chartData['labels'] = labels
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

.ct-chart-bar .ct-label.ct-horizontal.ct-end {
    font-size: 10px;
}
</style>
