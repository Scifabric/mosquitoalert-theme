<template>
    <div class="col-xs-12 col-md-4">
        <div class="searchpanel" :class="{'moveleft': collapse}">
            <div v-bind:style="isCover">
                <input :value="query" @input="updateQuery" class="searchbox" type="text" name="search" id="search" placeholder="Search for a location" v-on:keyup.enter="getResults" v-bind:class="{allinfo: isInfoAll, allinfo: results}">
                <span v-on:click="getResults"   class="searchbtn"><i class="fa fa-search"></i></span>
                <div v-if="isInfoAll" class="back-results">
                    <a class="back-results" v-on:click="showAll(resultShown)">Volver a resultados</a>
                </div>
            </div>
            <div v-if="searching" class="spinner"></div>
            <div v-else class="secondfold" v-bind:class="{zero: results.length === 0}">
                <div v-if="isInfoAll == false"> 
                    <div v-for="result in results" class="results-list">
                        <div v-on:click="showAll(result)" class="result-short">
                            <div class="info">
                                <p class="type">{{result.info.mosquito.top}}</p>
                                <div class="stars">
                                    <span v-if="result.info.mosquito_thorax.top == 'yes'" class="thorax"><i class="fa fa-check-square-o"></i> Thorax</span>
                                    <span v-else class="thorax not"><i class="fa fa-square-o"></i> Thorax</span>
                                    <span v-if="result.info.mosquito_abdomen.top == 'yes'" class="abdomen"><i class="fa fa-check-square-o"></i> Abdomen</span>
                                    <span v-else class="abdomen not"><i class="fa fa-square-o"></i> Abdomen</span>
                                </div>
                                <p class="location">{{result.info.display_name}}</p>
                            </div>
                            <div v-bind:style="cover(result)">
                            </div>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <div class="banner">
                        <div class="info">
                            <p class="type">{{resultShown.info.mosquito.top}}</p>
                            <div class="stars">
                                    <span v-if="result.info.mosquito_thorax.top == 'yes'" class="thorax"><i class="fa fa-check-square-o"></i> Thorax</span>
                                    <span v-else class="thorax not white"><i class="fa fa-square-o"></i> Thorax</span>
                                    <span v-if="result.info.mosquito_abdomen.top == 'yes'" class="abdomen"><i class="fa fa-check-square-o"></i> Abdomen</span>
                                    <span v-else class="abdomen not white"><i class="fa fa-square-o"></i> Abdomen</span>
                            </div>
                            <p class="location">{{resultShown.info.display_name}}</p>
                        </div>
                    </div>
                    <div class="extra-info">
                        <div class="result-full">
                            <p>Clasificado como</p>
                            <p class="mosquito-type">
                                <span v-if="resultShown.info.mosquito.top === 'tiger'">Mosquito Tiger</span>
                                <span v-else>Yellow fever</span>
                            </p>
                            <p>Por el</p>
                            <p class="mosquito-type">{{pct(resultShown.info.mosquito)}}%</p>
                            <p>de los usuarios</p>
                            <p class="divider"></p>


                            <p class="mosquito-type">
                                <span>Thorax identificado</span>
                            </p>
                            <p>Por el</p>
                            <p class="mosquito-type">{{pct(resultShown.info.mosquito_thorax)}}%</p>
                            <p>de los usuarios</p>
                            <p class="divider"></p>

                            <p class="mosquito-type">
                                <span>Abdomen identificado</span>
                            </p>
                            <p>Por el</p>
                            <p class="mosquito-type">{{pct(resultShown.info.mosquito_abdomen)}}%</p>
                            <p>de los usuarios</p>
                            <p class="divider"></p>



                            <p>Clasificación hecha por</p>
                            <p class="mosquito-type">{{resultShown.info.mosquito.count}} personas</p>
                            <p class="divider"></p>


                            <p>Nivel de confianza</p>
                            <div class="colors">
                                <div class="column">
                                    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                        <rect class="low" v-bind:class="{chosen: resultShown.info.mosquito.count < 30}" x="0" y="0" width="30" height="30"></rect>
                                    </svg>
                                    <p class="small">BAJO</p>
                                    <p class="small number">&lt;30</p>
                            </div>
                            <div class="column">
                                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                    <rect class="mid" v-bind:class="{chosen: resultShown.info.mosquito.count >= 30 && resultShown.info.mosquito.count < 70}" x="0" y="0" width="30" height="30"></rect>
                                </svg>
                                <p class="small">MEDIO</p><p class="small number">30 - 70</p>
                            </div>
                            <div class="column">
                                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                    <rect class="high"  v-bind:class="{chosen: resultShown.info.mosquito.count >= 70}" x="0" y="0" width="30" height="30"></rect>
                                </svg>
                                <p class="small">ALTO</p><p class="small number">&gt;70</p>
                            </div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="results.length > 0 && !searching && !isInfoAll " class="searchchart">
                <p>Distribución por meses</p>
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
    components: {Chart},
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
                    'background-position-y': '45px',
                    'height': '300px'
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
                                                offset:0
                                                })
        },
        cover(result){
            if (result.info)
                 return {
                    'background': "url(" + result.info.mosquito_url + ")",
                    'background-position-x': 'center',
                    'background-position-y': 'center',
                    'background-size': 'cover',
                    'height': '85px',
                    'width': '85px'
                }
           
        },
        pct(data){
            return (( 100 * data.freq)/data.count)
        },
    },
    watch: {
        'query': function(val) {
            if (val === '') {
                this.$store.commit('cleanMarkers')
                this.$store.commit('cleanResults')
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
  max-height: 340px;
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

.results-list:nth-child(n+2) {
    margin-top: 5px;
    border-bottom: 1px solid #d4d4d4;
}

.result-short {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
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
    font-size: 15px;
    font-weight: bold;
    color: black;
    text-transform: capitalize;
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
    height: 85px;
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
    background: #a41f1b;
    color: white;
    height: 110px;
    padding: 16px 24px 20px;
}


.extra-info {
    padding: 16px 24px 20px;
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

</style>

