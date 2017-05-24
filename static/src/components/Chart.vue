<template>
<div class="distribution">
    <canvas id="myChart" width="350" height="100"></canvas>
</div>
</template>
<script>
import Chart from 'chart.js'
import dateformat from 'dateformat'
import { pad } from '../helpers.js'

export default {
    mounted() {
        var labels = [this.$t('message.s01'), this.$t('message.s02'), this.$t('message.s03'), this.$t('message.s04'), this.$t('message.s05'), this.$t('message.s06'), this.$t('message.s07'), this.$t('message.s08'), this.$t('message.s09'), this.$t('message.s10'), this.$t('message.s11'), this.$t('message.s12')]
        var tooltiplabel = this.$t('message.tooltiplabel')
        var tooltipperiod = this.$t('message.tooltipperiod')
        var tooltipto = this.$t('message.tooltipto')
        this.$store.state.chartData.labels = labels
        //this.$store.state.chartOptions['plugins'] = [ Chartist.plugins.tooltip()]
        //var tmp = new Chartist.Bar('.ct-chart', this.$store.state.chartData, this.$store.state.chartOptions)
        //this.$store.state.chartist = tmp
        var self = this
        var options = {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{display: false, gridLines: {display: false}}],
                xAxes: [{gridLines: {display: false}}]
            },
            tooltips: {
                displayColors: false,
                bodySpacing: 4,
                caretSize: 0,
                callbacks: {
                    label: function(item, data) {
                        var month = self.$t('message.l' + pad(item.index +1, 2))
                            var txt = [item.yLabel + " " + tooltiplabel + " " + month, tooltipperiod + " " + self.datemin + " " + tooltipto + " " + self.datemax]
                        return txt
                             
                        },
                    title: function(){
                        return ""
                    }

                }
            }
        }
        var ctx = document.getElementById("myChart")
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: this.$store.state.chartData,
            options: options
        });

    },
    computed: {
        datemin() {
            var month = dateformat(this.$store.state.datemin, "mm").toLowerCase()
            month = this.$t('message.l' + month )
            return month + dateformat(this.$store.state.datemin, ' yyyy')
        },
        datemax() {
            var month = dateformat(this.$store.state.datemax, "mm").toLowerCase()
            month = this.$t('message.l' + month)
            return month + dateformat(this.$store.state.datemax, ' yyyy')

        },
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

.ct-tooltip {
  position: absolute;
  display: inline-block;
  opacity: 0;
  min-width: 5em;
  padding: .5em;
  background: #F4C63D;
  color: red;
  font-family: Oxygen,Helvetica,Arial,sans-serif;
  font-weight: 700;
  text-align: center;
  pointer-events: none;
  z-index: 1;
  -webkit-transition: opacity .2s linear;
  -moz-transition: opacity .2s linear;
  -o-transition: opacity .2s linear;
  transition: opacity .2s linear; }
  .chartist-tooltip:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -15px;
    border: 15px solid transparent;
    border-top-color: #F4C63D; }
  .chartist-tooltip.tooltip-show {
    opacity: 1; }

.ct-area, .ct-line {
  pointer-events: none; }

  .ct-chart {
      height: 100px;
  }
</style>
