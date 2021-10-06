<script>
    import { onMount } from 'svelte';
    import Switch from 'smelte/src/components/Switch';
    import Button from 'smelte/src/components/Button';
    import TextField from 'smelte/src/components/TextField';
    import { authStore } from '../stores/auth';
    //import "smelte/src/tailwind.css";
    export let urlhost;

    let usersettings = [];
    let binancekey, binancesecret, comission;
    let getusset = urlhost + 'api/getusersettings.php';
    let setusset = urlhost + 'api/setusersettings.php';

    console.log(getusset);
    onMount(async () => {
        let au = $authStore.user.uid;
        const res = await fetch(getusset, {
            method: 'post',
            body: JSON.stringify({ au }),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
        });
        usersettings = await res.json();
        console.log(usersettings);
        binancekey = usersettings[1];
        binancesecret = usersettings[2];
        comission = usersettings[3];
    });

    async function saveSettings() {
        await fetch(setusset, {
            method: 'post',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usersettings),
        });
        console.log(usersettings, setusset);
    }
    $: usersettings = [$authStore.user.uid, binancekey, binancesecret, comission];
</script>

<style type="text/scss">
    main {
        text-align: center;

        padding: 0px;
    }
    .foolrow {
        width: 400px;
    }

    .row {
        display: flex;
        max-width: 400px;
        margin: auto;
        justify-content: space-between;
        margin-bottom: 5px;
    }

    .leftitem {
        border: 0px solid;
        text-align: left;
    }

    .headblock {
        display: flex;
        max-width: 400px;
        margin: auto;
        justify-content: flex-start;
        margin-bottom: 7px;
    }
</style>

<main>
    <br />
    <p class="text-2xl">Настройки</p>
    <br />
    <div class="headblock">
        <p>Binance API keys</p>
        <br />
    </div>
    <div class="row">
        <div class="leftitem">
            <div class="foolrow">
                <TextField label="Key" outlined bind:value={binancekey} />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <div class="foolrow">
                <TextField bind:value={binancesecret} label="Secret" outlined />
            </div>
        </div>
    </div>
    <div class="headblock">
        <p>Прочие</p>
        <br />
    </div>
    <div class="row">
        <div class="leftitem">
            <div class="foolrow">
                <TextField label="Comission" outlined bind:value={comission} />
            </div>
        </div>
    </div>
    <Button on:click={saveSettings}>Сохранить</Button>
</main>
