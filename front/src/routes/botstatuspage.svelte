<script context="module">

    import { stateStore }  from "../stores/statebot.js"
    import BotStatus from '../components/BotStatus.svelte';
    import { authStore } from '../stores/auth';

    import SignInButton from '../components/SignInButton.svelte';
</script>


<style>
    .headblock {
        display: flex;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        justify-content: flex-start;
        margin-bottom: 7px;
        
    }
    .itemgrow {
        flex-grow: 2;
    }

    .mainflex {
        display: flex;
    }
</style>

<svelte:head>
    <title>Ti Trading Bot</title>
</svelte:head>

<div class="mainflex">


    <!-- {#if $authStore.status === 'in'} -->
    {#if true}
        <div class="headblock">

            <div class="itemgrow">
               <BotStatus/>
            </div>
        </div>
    {:else}
        <div class="headblock">

            <div class="itemgrow">
                Скачайте бесплатно или войдите в облако
                <br />
                <br />
                <br />
                <SignInButton provider={'google'} />
            </div>
        </div>
    {/if}
</div>
