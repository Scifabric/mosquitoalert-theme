<template>
    <div id="mosquitomap" class="mosquitomap"></div>
</template>
<script>
export default {
    mounted(){
        // create the tile layer with correct attribution
        this.$store.commit('addMap')
        this.populateMap()

    },
    computed: {
        results() {
            return this.$store.state.results
        }
    },
    methods: {
        populateMap() {
            this.$store.commit('cleanMarkers')
            var limit = 100
            this.$store.dispatch('getResults', {query: null,
                                                endpoint: this.$store.state.endpoint,
                                                limit: limit,
                                                offset: Math.floor(Math.random() * limit) + 1,
                                                random: true,
                                                })

        },

    },
    watch: {
        'results': function(val) {
            if (val !== null && val.length > 0) {
                this.$store.commit('addMarkers')
            }
        }
    }
}
</script>
<style>
.mosquitomap{
    width: 100%;
    height: 740px;
}

.controls {
  margin-top: 17px;
  margin-left: 20px;
  border: 1px solid transparent;
  border-radius: 2px 0 0 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  height: 32px;
  outline: none;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);*/
}

#pac-input {
  background-color: #fff;
  font-size: 15px;
  font-weight: 300;
  margin-left: 20px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 300px;
}

#pac-input {
  width: 300px;
  height: 45px;
  border-radius: 1px;
  background-color: #ffffff;
  border: solid 1px #777777;
}

#pac-input:focus {
  border-color: #4d90fe;
}

.pac-container {
  font-family: Roboto;
}

#type-selector {
  color: #fff;
  background-color: #4d90fe;
  padding: 5px 11px 0px 11px;
}

#type-selector label {
  font-size: 13px;
  font-weight: 300;
}
#target {
  width: 345px;
}

.videomap-container {
    height: 900px;
}
</style>
