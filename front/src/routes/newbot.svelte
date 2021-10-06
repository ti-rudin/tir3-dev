<script>
    import { stateStore }  from "../stores/statebot.js"
        import NewBot from '../components/NewBot.svelte';
    clearInterval($stateStore.timerId);
    clearInterval($stateStore.timerIdlist);


    $: pkg = {
        urlhost: $stateStore.urlhost,
        comission: 0.15
        
    };
</script>
<svelte:head>
    <title>newbot</title>
</svelte:head>

<div class="container mx-auto">
<NewBot {...pkg}/>
</div>
