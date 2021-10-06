<script>
    import Button from 'smelte/src/components/Button';
    import MenuUser from './MenuUser.svelte';
    import { signOut } from '../firebase';
    ///import List from 'smelte/src/components/List';

    export let displayName;
    export let photoURL;
    //export let uid;

    let open = false;
</script>

<style>
    button:active,
    button:focus {
        outline: none;
    }
    button::-moz-focus-inner {
        border: 0;
    }

    .menu {
        width: auto;
        min-width: auto;
        max-width: 14rem;
        margin-left: -12rem;

        z-index: 1000;
        padding: 0.5rem;

        border: 1px solid #85898b;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
        -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

        border-radius: 5px;
        color: #ebebeb;
    }
    .my-1 {
        display: flex;
        justify-content: flex-end;
    }
    .fill-current:hover {
        fill: #f0b90b;
    }
</style>

<MenuUser bind:open>

    <div class="bg-dark-400 dark:bg-dark-400 menu">

        <img src={photoURL} class="h-10 w-10 rounded-full mx-5" alt="user avatar" />
        {displayName}
        <hr class="text-dark-700 m-2" />

        <p>Баланс: 100000$</p>
        <hr class="text-dark-700 m-2" />
        <a href="settings">Настройки</a>
        <br />
        <br />
        <button class="bg-primary-500 hover:bg-primary-300 rounded-lg px-4" on:click={signOut}>
            Logout
        </button>
    </div>
    <div slot="activator" class="my-1">
        <button on:click={() => (open = !open)}>
            <svg class="fill-current w-6 h-6" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</MenuUser>
