<template>
    <div>
        <Searchbox></Searchbox>
        <Map></Map>
    </div>
</template>
<script>
import Searchbox from './Searchbox.vue'
import Map from './Map.vue'
export default {
    components: { Searchbox, Map },
}
</script>
