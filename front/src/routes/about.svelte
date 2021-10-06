<script>
    import { stateStore } from '../stores/statebot.js';
    clearInterval($stateStore.timerId);
    clearInterval($stateStore.timerIdlist);
</script>

<style>

</style>

<svelte:head>
    <title>About</title>
</svelte:head>
<div>
    <h1 class="text-2xl text-center mb-4">About this site</h1>

    <p class="text-center">This is the 'about' page. There's not much here.</p>
</div>
