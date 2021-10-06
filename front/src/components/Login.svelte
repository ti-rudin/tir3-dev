<script>
    import { signOut } from '../firebase';
    import { authStore } from '../stores/auth';
    import Profile from './Profile.svelte';
    import SignInButton from './SignInButton.svelte';
</script>

<style>
    .knob {
        width: auto;

        display: flex;
        justify-content: flex-end;
    }
    .mtmt {
        margin-top: -1.1rem;
        margin-right: 2rem;
    }
</style>

<section class="knob">
    {#if $authStore.status === 'in'}
        <div class="mtmt">
            <Profile {...$authStore.user} />
        </div>
    {:else}
        <SignInButton provider={'google'} />
    {/if}
</section>
