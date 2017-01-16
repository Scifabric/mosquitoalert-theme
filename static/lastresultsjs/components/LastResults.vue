<template>
    <div class="col-md-12">
        <div class="swiper-container">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper"></div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>
            
            <!-- If we need navigation buttons -->
            <!--<div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>-->
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        results() {
            return this.$store.state.results
        },
    },
    methods: {
        getResults() {
            this.$store.dispatch('getResults', {endpoint: this.$store.state.endpoint,
                                                limit: 100,
                                                offset:0
                                                })
        }
    },
    mounted() {
        this.getResults()
        this.$store.commit('addSwiper')
    }
}
</script>
<style>
    .swiper-container {
        width: 100%;
        height: 250px;
    }
    @media(max-width: 360px) {

       .swiper-container {
        width: 100%;
        height: 165px;
        }
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        height: 100%;
        width: 60%;
        box-shadow: 0 6px 10px rgba(18, 42, 68, 0.06);
        border-radius: 2px;
        transition: box-shadow 0.15s, border-color 0.15s;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .swiper-slide:nth-child(2n) {
        width: 40%;
    }
    .swiper-slide:nth-child(3n) {
        width: 20%;
    }

    .type, .location {
        text-transform: capitalize;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
        color: white;
        font-weight: bold;
    }
.swiper-pagination-bullet-active {
    opacity: 1;
    background: #a41f1b !important;
}
</style>


