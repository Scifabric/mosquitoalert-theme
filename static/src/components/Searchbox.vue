<template>
        <div class="col-md-4">
            <div class="searchpanel" :class="{'moveleft': collapse}">
                <h1>Search for a location</h1>
                <input :value="query" @input="updateQuery" class="searchbox" type="text" name="search" id="search" placeholder="Search" v-on:keyup.enter="getResults">
                <span v-on:click="getResults"   class="searchbtn"><i class="fa fa-search"></i></span>

                <div v-if="searching" class="spinner"></div>
                <div v-else class="secondfold">
                </div>
            <div class="collapse-panel">
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
        }
    },
    methods: {
        updateSearchPanelCollapse() {
            this.$store.commit('toggleSearchbox')
        },
        updateQuery(e){
            this.$store.commit('updateQuery', e.target.value)

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
  margin-top: 111px;
  padding: 18px;
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
  border: solid 1px #777777;
  padding: 15px;
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
</style>

