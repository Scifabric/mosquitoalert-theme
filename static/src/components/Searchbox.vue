<template>
    <div class="col-xs-12 col-md-4">
        <div id="tooltip-confidence" style="display:none; width:210px; text-align: left;">
            <p>{{$t('message.tooltipconfidence')}}</p>

            <p><span class="low">{{$t('message.low')}} </span>< 75% {{$t('message.participants')}} </p>
            <p><span class="high">{{$t('message.high')}}</span> > 75% {{$t('message.participants')}}</p>
        </div>

        <div class="searchpanel" :class="{'moveleft': collapse}">
            <div>
                <input :value="query" @input="updateQuery" class="searchbox" type="text" name="search" id="search" :placeholder="$t('message.placeholder')" v-on:keyup.enter="getResults" v-bind:class="{allinfo: isInfoAll, allinfo: results}">
                <span v-on:click="getResults"   class="searchbtn"><i class="fa fa-search"></i></span>
                <div v-if="isInfoAll" class="back-results">
                    <a class="back-results" v-on:click="showAll(resultShown)">{{$t('message.back')}}</a>
                </div>
            </div>
            <div v-if="searching" class="spinner"></div>
            <div v-else class="secondfold" v-bind:class="{zero: results.length === 0}">
                <div v-if="isInfoAll == false"> 
                    <div v-for="result in results" class="results-list">
                        <div v-on:click="showAll(result)" class="result-short">
                            <div class="info">
                                <p class="type">{{$t('message.' + result.info.mosquito.top)}}</p>
                                <div class="stars">
                                    <span class="label" :class="pctConfidence(result.info.mosquito_thorax)">{{pct(result.info.mosquito_thorax)}}%</span> 
                                    <span class="people">{{result.info.mosquito.count}} {{$tc('message.people', result.info.mosquito.count)}}</span>
                                </div>
                                <p class="location">{{result.info.city}}, {{result.info.country}}</p>
                            </div>
                            <div v-bind:style="cover(result)"></div>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <div class="banner" >
                        <div v-on:click="toggleModalShow" v-bind:style="isCover" class="bannerphoto">
                            <img src="/static/img/zoom-icon.svg">
                        </div>
                        <div class="info">
                            <span v-if="resultShown.info.mosquito.top === 'tiger'">{{$t("message.tiger")}}</span>
                            <span v-else>{{$t('message.yellow')}}</span>

                        </div>
                    </div>
                    <div class="extra-info">
                        <div class="datarow">
                            <span>{{$t('message.confidence')}} <img title="daniel" src="/static/img/info.svg" v-tippy data-theme="light" data-html="#tooltip-confidence" data-arrow="true"></span>
                            <span class="label" :class="pctConfidence(result.info.mosquito_thorax)"><span v-if="pct(resultShown.info.mosquito_thorax)>=75" style="font-size:15px;">HIGH</span><span v-else style="font-size:15px;">LOW</span></span> 
                        </div>
                        <div class="datarow">
                            <span>{{$t('message.identified')}}</span>
                            <span style="font-size:20px; font-weight: bold;">{{pct(resultShown.info.mosquito_thorax)}}%</span>
                        </div>
                        <div class="datarow">
                            <span>{{$t('message.classified')}}</span>
                            <span>{{resultShown.info.mosquito.count}} {{$t('message.participants')}}</span>
                        </div>
                        <div class="datarow">
                            <span>{{$t('message.found')}}</span>
                            <span>{{resultShown.info.city}}, {{resultShown.info.Country}}</span>
                        </div>
                        <div class="datarow">
                            <span>{{$t('message.uploaded')}}</span>
                            <span>{{formatDate(resultShown)}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="results.length > 0 && !searching && !isInfoAll " class="searchchart">
                <p>
                    <span class="distribution bold">{{$t('message.month')}}</span> 
                        <span v-if="query !== null" class="distribution">"{{query}}"</span>
                        <span v-else class="distribution bold">{{$t('message.noquery')}}</span> 
                    <br/><span style="font-size:12px;">{{$t('message.period')}} {{datemin}} - {{datemax}}</span></p>
                <Chart></Chart>
            </div>

            <div v-if="results.length" class="collapse-panel">
                <div v-on:click="updateSearchPanelCollapse" class="collapse-panel-label hidden-xs">
                    <i v-if="collapse" class="fa fa-caret-right"></i>
                    <i v-else class="fa fa-caret-left"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import XRegExp from 'xregexp'
import Chart from './Chart.vue'
import 'smooth-scrollbar/dist/smooth-scrollbar.css'
import Scrollbar from 'smooth-scrollbar'
import dateformat from 'dateformat'
import Vue from 'vue'
import vueTippy from 'vue-tippy'

Vue.use(vueTippy)


function formatQuery(queryData) {
    var regex_non_words = XRegExp("[^\\p{L}\\s\\d]", "g")
    queryData = XRegExp.replace(queryData, regex_non_words, " ")
    var regex_spaces = XRegExp("\\p{Z}+", "g")
    queryData = XRegExp.replace(queryData, regex_spaces, " ")
    queryData = queryData.replace(/^ /gi, "")
    queryData = queryData.replace(/ $/gi, "")
    if ((queryData.match(/ /g) || []).length >= 1) {
        var query = queryData.replace(/ /g, '%26')
    }
    else {
        var query = queryData.replace(/ /g, '');
    }
    return query
}

export default {
    components: {Chart },
    mounted(){
        console.log("HLA daiel")
    },
    computed: {
        searching() {
            return this.$store.state.searching
        },
        collapse() {
            return this.$store.state.collapse
        },
        query() {
            return this.$store.state.query
        },
        endpoint() {
            return this.$store.state.endpoint
        },
        results() {
            return this.$store.state.results
        },
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
        resultShown() {
            return this.$store.state.result
        },
        isInfoAll() {
            return this.$store.state.infoAll
        },
        isCover() {
            if (this.resultShown) {
                return {
                    'background': "url(" + this.resultShown.info.mosquito_url + ")",
                    'background-position-x': 'center',
                    'background-position-y': 'center',
                    'background-size': 'cover',
                    'width': '50%'
                }
            }
            else {
                return {
                }
            }
        },
        chartData() {
            return this.$store.state.chartData
        },
        chartOptions() {
            return this.$store.state.chartOptions
        },
        result() {
            return this.$store.state.result
        }
    },
    methods: {
        toggleModalShow(){
            this.$store.commit('toggleModal')
        },
        updateSearchPanelCollapse() {
            this.$store.commit('toggleSearchbox')
        },
        updateQuery(e){
            this.$store.commit('updateQuery', e.target.value)

        },
        showAll(result){
            this.$store.commit('toggleResultAll', {result})
        },
        removeResult(){
            this.$store.commit('removeResult')
        },
        getResults() {
            this.$store.commit('cleanMarkers')
            this.$store.dispatch('getResults', {query: formatQuery(this.query),
                                                endpoint: this.endpoint,
                                                limit: 100,
                                                offset:0,
                                                random: false,
                                                })
        },
        formatDate(result){
            var tmp_date = result.info.year + "/" + result.info.month + "/" + result.info.day + " 00:00:00"
            tmp_date = Math.round(new Date(tmp_date).getTime()/1000)
            return dateformat(tmp_date, "mmm dd, yyyy")
        },
        cover(result){
            if (result.info)
                 return {
                    'background': "url(" + result.info.mosquito_url + ")",
                    'background-position-x': 'center',
                    'background-position-y': 'center',
                    'background-size': 'cover',
                    'height': '79px',
                    'width': '79px'
                }
           
        },
        pct(data){
            return (( 100 * data.freq)/data.count).toFixed(2)
        },
        pctConfidence(data) {
            var tmp = this.pct(data)
            if (tmp < 50) {
                return "label-low"
            }
            if ((tmp >=50) && (tmp< 75)) {
                return "label-med"
            }
            if ((tmp >=75) && (tmp <= 100)) {
                return "label-high"
            }
        }
    },
    watch: {
        'query': function(val) {
            if (val === '') {
                this.$store.commit('cleanMarkers')
                this.$store.commit('cleanResults')
            }
        },
        'isInfoAll': function(val) {
            if (val) {
                this.$store.state.scroll = $(".secondfold").scrollTop()
                $(".secondfold").scrollTop(0)
            }
            else {
                console.log("subiendo")
                $(".secondfold").scrollTop(this.$store.state.scroll)
            }
        }
    }
}
</script>
<style>

.spinner {
  width: 40px;
  height: 40px;
  margin: 100px auto;
  background-color: #333;

  border-radius: 100%;  
  -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
  animation: sk-scaleout 1.0s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% { -webkit-transform: scale(0) }
  100% {
    -webkit-transform: scale(1.0);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 100% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
    opacity: 0;
  }
}

.searchpanel {
  border-radius: 1px;
  background-color: #ffffff;
  z-index: 999;
  position: absolute;
  margin-top: 10px;
  width: 383px;
  transition: margin-left 1s;
}

@media(max-width:768px) {
    .searchpanel {
        width: 333px;
    }

}

@media(max-width:320px) {
    .searchpanel {
        width: 290px;
    }

}


.searchpanel > h1 {
  height: 36px;
  font-size: 28px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  color: #111111;
}

.searchpanel.moveleft{
    margin-left: -398px;
}

.secondfold {
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}

@media(max-width:768px) {
    .secondfold {
        max-height: 300px;
    }
}

.secondfold.zero {
    height: 0;
}

.secondfold::-webkit-scrollbar{width: 5px;}

.secondfold::-webkit-scrollbar-thumb{background-color:rgb(196, 196, 196); border-radius: 0;}
.secondfold::-webkit-scrollbar-thumb:hover{background-color:rgb(196, 196, 196);}

.secondfold::-webkit-scrollbar-track{background-color:rgb(237, 237, 237);}

.secondfold > h2 {
  font-size: 18px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  color: #777777;
}

.searchbox {
  width: 100%; 
  height: 45px;
  border-radius: 1px;
  background-color: #ffffff;
  border: none;
  outline: none;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
}
.searchbox:hover,
.searchbox:focus {
  box-shadow: 0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
}

.searchbox.allinfo,
.searchbox.allinfo:hover,
.searchbox.allinfo:focus {
    box-shadow: none !important;
    border-bottom: 1px solid #d4d4d4;
}
.searchbtn {
    position: absolute;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -45px;
    margin-left: auto;
    width: 45px;
    left: 0;
    right: 19px;
}
.foundmovies {
    margin-top: 15px;
}
.item-move {
  /* applied to the element when moving */
  transition: transform .5s cubic-bezier(.55,0,.1,1);
}

.subjects {
    display: flex;
    flex-wrap: wrap;
}

.subject {
    height: 99px;
    width: 172px;
    border: 1px solid white;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: white;
    text-transform: capitalize;
    font-style: italic;
    font-size: 18px;
    text-shadow: 1px 1px black;
    padding: 40px;
    text-align: center;
}

.subject-div {
    background: #ff5555;
}

.subject:hover {
    opacity: 0.8;
    cursor: pointer;
}

.collapse-panel {
    position: absolute;
    top: 15px;
    z-index: 3;
    left: 382px;
}

.collapse-panel-label{
    width: 23px;
    height: 48px;
    cursor: pointer;
    background: white;
    //border-left: 1px solid #D4D4D4;
    //box-shadow: 0px 1px 4px rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.results-list:nth-child(n+1) {
    border-bottom: 1px solid #d4d4d4;
}

.result-short {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    height: 100px;
}

.result-short:hover {
    cursor: pointer;
    background-color: rgba(220, 220, 220, 0.8);
}

.result-short > .info {
    width: 220px;
}

.result-short .type,
.info .type {
    font-size: 14px;
    font-weight: bold;
    color: black;
    text-transform: capitalize;
    margin-top: 5px;
    margin-bottom: 5px;
}

.result-short .location,
.info .location {
    font-size: 13px;
    color: gray;
}

.result-short .stars,
.info .stars{
    display: flex;
    padding-bottom: 10px;
}
.result-short img {
    height: 79px;
}
div.back-results {
    padding-top: 5px;
    padding-bottom: 5px;
    background: white;
    padding-left: 15px;
}
.back-results a {
    font-size: 13px;
    cursor: pointer;
}

.banner {
    background: white;
    color: rgb(38, 66, 82);
    height: 140px;
    display: flex;
}


.extra-info {
}

.banner > .info {
    width: 50%;
    color: rgb(38, 66, 82);
}

.banner > .info > span {
    font-size: 24px;
    font-weight: 600;
    padding-left: 16px;
}

.banner .info .type,
.banner .info .stars,
.banner .info .location {
    color: white;
}
.searchchart {
    border-top: 1px solid #d4d4d4;
    padding: 15px;
}

.distribution {
    font-size: 14px;
}

.distribution.bold {
    font-weight: bold;
}

.banner .info .location {
    font-size: 24px;
}

.thorax, .abdomen {
    margin-right: 5px;
    padding: 2px;
    font-size: 10px;
    text-transform: uppercase;
}

.thorax.not, .abdomen.not  {
    color: gray;
}

.thorax.not.white,
.abdomen.not.white {
    color: white;
}

.result-full {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.mosquito-type {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
}


.divider {
    bottom: 30px;
    width: 50%;
    height: 1px;
    background: #a41f1b;
 }

.colors {
    align-items: center;
    justify-content: space-around;
    display: flex;
    width: 100%;
}

.colors > .column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.low, .mid, .high {
    stroke-width: 4px;
}

.low {
    stroke: red;
    fill: white;
}

.low.chosen {
    fill: red;
}

.mid {
    stroke: #ff9900;
    fill: white;
}

.mid.chosen {
    fill: #ff9900; 
}

.high {
    stroke: #94CA55;
    fill: white;
}

.high.chosen {
    fill: #94CA55;
}
.flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.label {
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  font-weight: bold;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.label-low, .label-med {
   background-color: rgb(253, 245, 190); 
   color: rgb(164, 93, 4);
}

.label-high {
   background-color: rgb(210, 255, 159);
   color: rgb(52, 100, 8);
}

.people {
    margin-left: 8px;
    color: gray;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.bannerphoto {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
}

.datarow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding-left: 17px;
    padding-right: 13px;
}

.datarow:nth-child(n+1) {
    border-bottom: 1px solid #d4d4d4;
}

.datarow .label {
}

.tippy-tooltip-content {
    font-size: 12px;
    font-color: rgb(29, 50, 64);

}

.tippy-tooltip[data-template-id="#tooltip-confidence"] {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
    width: 210px;
    padding: 5px;
}

.tippy-tooltip[data-template-id="#tooltip-confidence"] p {
    font-size: 12px;
    color: rgb(29, 50, 64);
}

.tippy-tooltip[data-template-id="#tooltip-confidence"] p > span.low {
    color: rgb(164, 93, 4);
}

.tippy-tooltip[data-template-id="#tooltip-confidence"] p > span.high{
    color: rgb(52, 100, 8);
}

</style>

