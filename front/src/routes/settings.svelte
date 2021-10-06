<script>
    import { stateStore } from '../stores/statebot.js';
    clearInterval($stateStore.timerId);
    clearInterval($stateStore.timerIdlist);
    import Sett from '../components/Sett.svelte';
    import { authStore } from '../stores/auth';
    const pkg = {
        urlhost: 'https://91.228.118.92/back/',
        urlhostkeys: 'https://91.228.118.92/usersettings/',
    };


</script>

<style>

</style>

<svelte:head>
    <title>Настройки</title>
</svelte:head>

{#if $authStore.status === 'in'}
    <Sett {...pkg} />
{/if}
