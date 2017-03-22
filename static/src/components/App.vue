<template>
    <div>
        <Searchbox></Searchbox>
        <Map></Map>
        <Modal></Modal>
        <Welcome></Welcome>
    </div>
</template>
<script>
import Searchbox from './Searchbox.vue'
import Map from './Map.vue'
import Modal from './Modal.vue'
import Welcome from './Welcome.vue'
export default {
    components: { Searchbox, Map, Modal, Welcome },
}
</script>
