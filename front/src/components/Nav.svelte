<script>
    export let segment;
    import Login from '../components/Login.svelte';
    import dark from 'smelte/src/dark';

    let darkMode = dark();
    import Button from 'smelte/src/components/Button';
</script>

<style>
    .darkmodeknob {
        display: flex;
        justify-content: flex-end;
    }
</style>

<nav
    class="flex items-center justify-between flex-wrap bg-gray-300 dark:bg-gray-800 p-1 fixed w-full
    z-10 top-0">
    <div class="flex items-center flex-shrink-0 text-white mr-6">

        <a
            class="text-white no-underline hover:text-white hover:no-underline"
            aria-current={segment === undefined ? 'page' : undefined}
            href=".">
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

    <div class="lg:hidden" id="nav-knob">
        <button
            id="nav-toggle"
            class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600
            hover:text-white hover:border-white">
            <svg
                class="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
        </button>
    </div>

    <div
        class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden pt-6 lg:pt-0"
        id="nav-content">
        <ul class="list-reset lg:flex justify-end flex-1 items-center">
            <li class="mr-3">

                <a
                    class="inline-block py-2 px-4 text-white no-underline"
                    rel="prefetch"
                    aria-current={segment === 'blog' ? 'page' : undefined}
                    href="blog">
                    blog
                </a>
            </li>
            <li class="mr-3">
                <a
                    class="inline-block text-white no-underline hover:text-gray-300
                    hover:text-underline py-2 px-4"
                    aria-current={segment === 'about' ? 'page' : undefined}
                    href="about">
                    about
                </a>
            </li>
            <li class="mr-3">
                <Login />
            </li>
            <li class="mr-3">
                <div class="darkmodeknob">
                    <Button bind:value={$darkMode} outlined>
                        <span class="text-lg leading-none">&#9680;</span>
                    </Button>
                    &nbsp;
                    <Button href="settings" outlined>
                        <span class="text-2xl leading-none">&#9881;</span>
                    </Button>
                </div>
            </li>
        </ul>
    </div>
</nav>
