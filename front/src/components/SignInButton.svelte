<script>
    import { signInWithGoogle } from '../firebase';
    import Button from 'smelte/src/components/Button';
    export let provider;
</script>

{#if provider === 'google'}
    <Button outlined on:click={signInWithGoogle}>Sign in</Button>
{:else}
    <div>No provider was provided as a prop</div>
{/if}
