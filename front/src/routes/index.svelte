
<script>
    import { stateStore } from '../stores/statebot.js';

    clearInterval($stateStore.timerId);
    clearInterval($stateStore.timerIdlist);
    

    import BotsList from '../components/BotsList.svelte';
    import { authStore } from '../stores/auth';

    import SignInButton from '../components/SignInButton.svelte';
    //  let userid = $authStore.user.uid;
    const pkg = {
        //urlhost: urlhost,
        //urlhostkeys:'https://dev.localhost/usersettings/',
        //urlhost: 'http://localhost/bbot/',

        comission: 0.15,
    };

    // This is an example script - don't forget to change it!

    //if ($authStore.status === 'in') {
    //    
    //    LogRocket.identify($authStore.user.uid, {
    //        name: $authStore.user.displayName,
    //        email: $authStore.user.email,
    //        uid: $authStore.user.uid
    //    });
//
    //} 
</script>

<style>

</style>

<svelte:head>
    <title>Ti Trading Bot v1</title>
</svelte:head>
  
<!-- {#if $authStore.status === 'in'}-->

{#if true}
    <BotsList {...pkg} />
{:else}
    <div>
        <p>Скачайте бесплатно или войдите в облако</p>

        <br />
        <br />
        <br />
        <SignInButton provider={'google'} />
    </div>
{/if}
