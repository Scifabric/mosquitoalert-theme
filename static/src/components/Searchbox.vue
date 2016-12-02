<template>
    <div class="col-md-4">
        <div class="searchpanel" :class="{'moveleft': collapse}">
            <div v-bind:style="isCover">
                <input :value="query" @input="updateQuery" class="searchbox" type="text" name="search" id="search" placeholder="Search for a location" v-on:keyup.enter="getResults">
                <span v-on:click="getResults"   class="searchbtn"><i class="fa fa-search"></i></span>
                <div v-if="isInfoAll" class="back-results">
                    <a class="back-results" v-if="isInfoAll" v-on:click="showAll(result)">Volver a resultados</a>
                </div>
            </div>
            <div v-if="searching" class="spinner"></div>
            <div v-else class="secondfold" v-bind:class="{all: isInfoAll}">
                <div v-if="isInfoAll == false" v-for="result in results" class="results-list">
                    <div v-on:click="showAll(result)" class="result-short">
                        <div class="info">
                            <p class="type">{{result.info.mosquito.top}}</p>
                            <div class="stars">
                                <i class="fa fa-star"></i>
                                <i v-if="result.info.mosquito_thorax.top == 'yes'" class="fa fa-star"></i>
                                <i v-else class="fa fa-star-o"></i>
                                <i v-if="result.info.mosquito_abdomen.top == 'yes'" class="fa fa-star"></i>
                                <i v-else class="fa fa-star-o"></i>
                            </div>
                            <p class="location">{{result.info.display_name}}</p>
                        </div>
                        <img v-if="result.info.mosquito.top == 'tiger'" src="http://i.imgur.com/PHPuc8l.png"></img>
                        <img v-else src="http://i.imgur.com/hZlv8lr.png">
                    </div>
                </div>
                <div v-else>
                    <div class="banner">
                        <div class="info">
                            <p class="type">{{result.info.mosquito.top}}</p>
                            <div class="stars">
                                <i class="fa fa-star"></i>
                                <i v-if="result.info.mosquito_thorax.top == 'yes'" class="fa fa-star"></i>
                                <i v-else class="fa fa-star-o"></i>
                                <i v-if="result.info.mosquito_abdomen.top == 'yes'" class="fa fa-star"></i>
                                <i v-else class="fa fa-star-o"></i>
                            </div>
                            <p class="location">{{result.info.display_name}}</p>
                        </div>
                    </div>
                        <div class="extra-info">
                            <div v-if="result.all" class="result-full">
                                <p>Analizado por {{result.info.mosquito.count}} persona</p>
                                <p v-if="result.info.mosquito_thorax.top == 'yes'">Tórax identificado por {{result.info.mosquito_thorax.freq}}</p>
                                <p v-if="result.info.mosquito_abdomen.top == 'yes'">Abdomen identificado por {{result.info.mosquito_thorax.freq}}</p>
                            </div>
                        </div>

                </div>
            </div>
            <div v-if="isInfoAll" class="collapse-panel">
                <div v-on:click="updateSearchPanelCollapse" class="collapse-panel-label">
                    <i v-if="collapse" class="fa fa-caret-right"></i>
                    <i v-else class="fa fa-caret-left"></i>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import XRegExp from 'xregexp'

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
        result() {
            return this.$store.state.result
        },
        isInfoAll() {
            return this.$store.state.infoAll
        },
        isCover() {
            if (this.result) {
                return {
                    'background': "url(" + this.result.info.mosquito_url + ")",
                    'background-size': 'cover',
                    'height': '200px'
                }
            }
            else {
                return {
                }
            }
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
        getResults() {
            this.$store.commit('cleanMarkers')
            this.$store.dispatch('getResults', {query: formatQuery(this.query),
                                                endpoint: this.endpoint})
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02) !important;
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

.results-list:nth-child(even) {
    border-bottom: 2px solid gray;
}

.result-short {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    padding: 15px;
}

.result-short:hover {
    cursor: pointer;
    background-color: rgba(220, 220, 220, 0.8);
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
</style>

