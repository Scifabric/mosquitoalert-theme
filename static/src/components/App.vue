<template>
    <div>
        <Searchbox></Searchbox>
        <Map></Map>
        <Modal></Modal>
    </div>
</template>
<script>
import Searchbox from './Searchbox.vue'
import Map from './Map.vue'
import Modal from './Modal.vue'
export default {
    components: { Searchbox, Map, Modal },
}
</script>
