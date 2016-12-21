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
        new Chartist.Bar('.ct-chart', this.$store.state.chartData, this.$store.state.chartOptions)

    },
}
</script>
