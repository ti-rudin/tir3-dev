
<script>

//console.log(process.env.SAPPER_APP_HOSTIP);

    import { stateStore } from '../stores/statebot.js';
    import { authStore } from '../stores/auth';
    import Nav from '../components/Nav.svelte';
    import Login from '../components/Login.svelte';
    import NavigationDrawer from 'smelte/src/components/NavigationDrawer';
    import AppBar from 'smelte/src/components/AppBar';
    import breakpoints from 'smelte/src/breakpoints';
    export let segment;
    const bp = breakpoints();
    import 'smelte/src/tailwind.css';

    import dark from 'smelte/src/dark';

    let darkMode = dark();
    let showzagl;
    
    import Button from 'smelte/src/components/Button';
    // export let segment;

    function showtogle() {
        $stateStore.showmenu = !$stateStore.showmenu;
        //console.log ($stateStore.show);
        return $stateStore.showmenu;
    }
    //console.log("s_a_hip: " + process.env.SAPPER_APP_HOSTIP);
    
 
    //localStorage.setItem('darkmode', 'on');
    if ($bp === 'sm') showzagl = false;

    function menucloseifnotsm() {
        if ($stateStore.showmenu && $bp === 'sm') {
            $stateStore.showmenu = false;
        }
    }

     function gohome() {
            $stateStore.rout = 'botlist';
        }
</script>

<style>
    .menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        border-right: 1px solid #85898b;
    }
    .menulast {
        flex: none;
        text-align: center;
        margin-bottom: 2rem;
    }
    .chatpriglos {
       display: inline-flex;
        flex-grow: 2;
        text-align: center;
        border: 1px solid #85898b;
        border-radius: 5px;
        margin : 1rem;
    }
    .usermenu {
        line-height: inherit;
    }
    .rastyazhka {
        display: inline-flex;
        flex-grow: 2;
    }
    .backknob {
        margin-top: 1rem;
        margin-right: 1rem;
    }

    .zagl {
        width: 16rem;
        height: 100vh;
    }
    .mainflex {
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-top: 3.5rem;
        justify-content: center;
    }
    .fill-current:hover {
        fill: #f0b90b;
    }
    .text-current:hover {
        color: #f0b90b;
        background-color: #f0bb0b0c;
    }
</style>

<AppBar class="bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0">
    <div class="text-white flex-none">
        <a
            class="text-white no-underline hover:text-white hover:no-underline"
            aria-current={segment === undefined ? 'page' : undefined}
            href="."
            on:click={gohome}>
            <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0)">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631 36.3445L8.96631
                        8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552 18.3618L35.2663
                        18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552 22.571L30.9552
                        29.7173C30.7305 32.6744 32.6316 34.8393 35.2663 34.9937ZM29.9591
                        21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194 21.729L21.5194
                        34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z"
                        fill="#F0B90B" />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="45" height="45" fill="white" />
                    </clipPath>
                </defs>
            </svg>

        </a>
    </div>
    <div class="pr-2 flex-none">
        <div on:click={showtogle}>
            <svg
                class="fill-current h-6 w-6"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
        </div>
    </div>
    <div class="flex-grow text-center">{$stateStore.selectbotname} </div>

    <div class="usermenu flex-none">
        <Login />
    </div>

    <div class="flex-none">
        <Button bind:value={$darkMode} class="mr-2 ml-2">
            <svg
                class="fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018
                    0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414
                    1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1
                    0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2
                    0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414
                    1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0
                    011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd" />
            </svg>
        </Button>
    </div>

</AppBar>
<NavigationDrawer class="bg-gray-200 dark:bg-black" bind:show={$stateStore.showmenu} {segment}>
    <div class="menu">
        <div class="flex justify-between">
            <a
                class="text-white no-underline hover:text-white hover:no-underline"
                aria-current={segment === undefined ? 'page' : undefined}
                href=".">
                <svg
                    width="95"
                    height="95"
                    viewBox="0 0 45 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0)">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631
                            36.3445L8.96631 8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552
                            18.3618L35.2663 18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552
                            22.571L30.9552 29.7173C30.7305 32.6744 32.6316 34.8393 35.2663
                            34.9937ZM29.9591 21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194
                            21.729L21.5194 34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z"
                            fill="#F0B90B" />
                    </g>
                    <defs>
                        <clipPath id="clip0">
                            <rect width="45" height="45" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

            </a>
            <div class="backknob">
                <div on:click={showtogle}>
                    <svg
                        class="fill-current h-6 w-6"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414
                            1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
                    </svg>
                </div>
            </div>
        </div>

        <a
            class="text-current py-4 px-4 flex-none"
            aria-current={segment === 'about' ? 'page' : undefined}
            href="/"
            on:click={menucloseifnotsm}>
            Главная
        </a>
        <a
            class="text-current py-4 px-4 flex-none"
            aria-current={segment === 'about' ? 'page' : undefined}
            href="about"
            on:click={menucloseifnotsm}>
            О программе
        </a>

        <a
            class="py-4 px-4 text-current flex-none"
            rel="prefetch"
            aria-current={segment === 'blog' ? 'page' : undefined}
            href="blog"
            on:click={menucloseifnotsm}>
            Блог
        </a>

        {#if $authStore.status === 'in'}
            <hr />
            <a
                class="py-4 px-4 text-current flex-none"
                rel="prefetch"
                aria-current={segment === 'blog' ? 'page' : undefined}
                href="/"
                on:click={menucloseifnotsm}>
                GRID LONG Бот
            </a>
            <a
                class="py-4 px-4 text-current flex-none"
                rel="prefetch"
                aria-current={segment === 'blog' ? 'page' : undefined}
                href="settings"
                on:click={menucloseifnotsm}>
                Настройки
            </a>
            <hr />
        {/if}

        <div class="rastyazhka">&nbsp;</div>
        <div class="chatpriglos py-4 px-4 text-current flex-none">Вступай в наш чат!</div>
        <a
            class="menulast py-4 px-4 text-current flex-none"
            rel="prefetch"
            aria-current={segment === 'blog' ? 'page' : undefined}
            href="instruction"
            on:click={menucloseifnotsm}>
            Инструкция
        </a>

    </div>
</NavigationDrawer>

<div class="mainflex">

    {#if $stateStore.showmenu && $bp != 'sm'}
        <div class="zagl">&nbsp;</div>

        <slot />
    {:else}
        <slot />
    {/if}
</div>
