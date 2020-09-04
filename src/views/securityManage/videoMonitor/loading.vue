<template>
    <div class="loading"></div>
</template>

<script>
    export default {
        name: "loading"
    }
</script>

<style scoped>
    .loading {
        position: absolute;
        left: -24%;
        top: 20%;
        width: 40vw;
        height: 30vh;
        background: url('../../../assets/img/loading.gif') center center no-repeat ;
    }

</style>