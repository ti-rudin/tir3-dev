
<script>
    import { stateStore } from '../stores/statebot.js';
    import { onMount } from 'svelte';

    import Switch from 'smelte/src/components/Switch';
    //import "smelte/src/tailwind.css";
    import NewBot from './NewBot.svelte';
    //import BotStatus from './BotStatus.svelte';

    export let comission;
    export let show;


    //console.log(process.env.SAPPER_APP_HOSTIP);

    import Button from 'smelte/src/components/Button';
    import { authStore } from '../stores/auth';
    //import { request } from 'graphql-request';

    import IndLoad from './IndLoad.svelte';

    let urlhost = $stateStore.urlhost;


    let bots = [];
    let urlbotslist = urlhost + 'botslist';
    let newbot = urlhost + 'api/newbot.php';
    let api_bots = urlbotslist;

    let selectbot;
    /////routes
    let routIsBotList = true;
    let routIsBot = false;
    let routIsNewBot = false;

    function routBotList() {
        $stateStore.rout = 'botlist';

        $stateStore.selectbotname = '';
        routIsBotList = true;
        routIsBot = false;
        routIsNewBot = false;
    }
    function routNewBot() {
        $stateStore.rout = 'newbot';
        clearInterval($stateStore.timerIdlist);
        //ym(65948110, 'reachGoal', 'begin-createbot');
        routIsBotList = false;
        routIsBot = false;
        routIsNewBot = true;
    }
    /////end routes
    function ismybot(value) {
        return value[8] === $authStore.user.uid;
    }
    onMount(async () => {

        const res = await fetch(api_bots, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'get',
        })

        //fetch(api_bots)
        //    .then(res => res.json())
        //    .then(json => console.log(json));
        //
        ////console.log(res);

        //fetch("http://91.228.118.92:1337/graphql", {
        //    "headers": {
        //        "accept": "*/*",
        //        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        //        "content-type": "application/json"
        //    },
        //    "referrer": "http://91.228.118.92:1337/graphql",
        //    "referrerPolicy": "strict-origin-when-cross-origin",
        //    "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  bots {\\n    id\\n    botname\\n    user_id_from_google\\n    onoff\\n    settings\\n    floors\\n    finance\\n    sales\\n    status\\n  }\\n}\\n\"}",
        //    "method": "POST",
        //    "mode": "cors"
        //    })
            .then(res => res.json())
            .then(json => {
                bots = json;
                if (bots == null ) {bots=[];}
                console.log(json)
                console.log(bots);
            });
    });
    async function fetch1s() {
        const res = await fetch(urlbotslist);
        bots = (await res.json()).filter(ismybot);
    }
    function entryBot(botid) {
        console.log(botid);

        clearInterval($stateStore.timerIdlist);
        selectbot = botid;
        $stateStore.selectbotid = botid;
        $stateStore.selectbotname = botid;
        localStorage.selectbot = botid;
        $stateStore.rout = 'bot';
        
        //window.location = "/bot?selectbot="+selectbot;
    }
    function profitsumproctodaycalc(arr) {
        let sum = 0;
        arr.forEach(element => {
            sum = sum + element[5];
        });
        return sum;
    }
    function profitsumproccalc(arr) {
        let sum = 0;
        arr.forEach(element => {
            sum = sum + element[3];
        });
        return sum;
    }
    function startbalancescalc(arr) {
        let sum = 0;
        arr.forEach(element => {
            sum = sum + element[6];
        });
        return sum;
    }
    function balancescalc(arr) {
        let sum = 0;
        arr.forEach(element => {
            sum = sum + element[7];
        });
        return sum;
    }
    function vlozhcalc(arr) {
        let sum = 0;
        arr.forEach(element => {
            sum = sum + element[10];
        });
        return sum;
    }

    let selectbotname;
    $: pkg = {
        urlhost: urlhost,
        comission: comission,
        urlhost: urlhost,
        selectbotname: selectbotname,
        routIsBotList: routIsBotList,
    };
    //$: if (selectbot) {
    //    selectbotname = bots.botname;
    //}
    $: profitsumproctoday = profitsumproctodaycalc(bots).toFixed(2);
    $: profitsumproc = profitsumproccalc(bots).toFixed(2);
    $: startbalances = startbalancescalc(bots).toFixed(2);
    $: balances = balancescalc(bots).toFixed(2);
    $: sumprocvlozh = (vlozhcalc(bots) / startbalancescalc(bots)) * 100;

    //$stateStore.timerIdlist = setInterval(fetch1s, 10000);

    $: show = $stateStore.showmenu;
    $: selectbotname = $stateStore.selectbotname;
    $: urlhost = $stateStore.urlhost;

    clearInterval($stateStore.timerId);
    routBotList();
    //console.log($authStore.user);
</script>

<style>
    .divhr {
        display: flex;
        width: 400px;
        height: 10px;
        margin-left: auto;
        margin-right: auto;
    }
    .balancehead {
        padding-top: 28px;
    }
    .rowbalanceitem {
        padding-left: 10px;
        text-align: center;
        line-height: 30px;
    }
    .centereditem {
        text-align: center;
        min-width: 23%;
        border: 0px solid;
    }
    .addknob {
        display: flex;
        justify-content: center;
        margin-right: 10px;
        margin-left: 10px;
        margin-top: 10px;
    }
    main {
        text-align: center;
    }
    .botslist {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 1px;
        grid-template-rows: auto 1fr;
        margin: 0px;
        padding: 0px;
    }
    .botitem {
        display: flex;
        width: 400px;
        margin-left: auto;
        margin-right: auto;
        justify-content: space-between;
    }
    .textitem {
        display: flex;
        width: 400px;
        margin-left: auto;
        margin-right: auto;
        justify-content: space-between;
    }
    .leftitem {
        border: 0px solid;
        text-align: left;
        max-width: 30%;
    }
    .rightitem {
        border: 0px solid;
        text-align: right;
        width: 40px;
        display: flex;
        flex-grow: 1;
        align-items: center;
    }
    .botitem:hover {
        background-color: rgba(255, 228, 196, 0.342);
    }
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

<main>

    <div class="textitem px-2 py-3">
        <div class="rowbalanceitem balancehead">
            <label>Баланс</label>

        </div>
        <div class="rowbalanceitem">
            <label>Старт</label>
            <br />
            <span
                class="border-solid border-2 border-gray-200 bg-gray-200 rounded-full px-3 py-1
                text-sm font-semibold text-gray-700">
                {startbalances}
            </span>
        </div>
        <div class="rowbalanceitem">
            <label>Сегодня</label>
            <br />
            <span
                class="border-solid border-2 border-gray-200 bg-gray-200 rounded-full px-3 py-1
                text-sm font-semibold text-gray-700">
                {balances}
            </span>
        </div>
        <div class="rowbalanceitem">
            <label>Cальдо</label>
            <br />
            <span
                class="border-solid border-2 border-gray-600 rounded-full px-3 py-1 text-sm
                font-semibold text-gray-700 dark:text-primary-700">
                {(balances - startbalances).toFixed(2)}
            </span>
        </div>
    </div>

    <div class="textitem p-2">
        <div class="leftitem">Прибыль / просадка</div>
        &nbsp;&nbsp;
        <div class="centereditem">
            Всего
            <br />
            {profitsumproc} %
        </div>
        <div class="centereditem">
            Сегодня
            <br />
            {profitsumproctoday} %
        </div>
        <div class="rightitem">
            <IndLoad procvlozh={sumprocvlozh} id="sumprocvlozh" />

        </div>
    </div>
    <div class="divhr">
        <hr width="400px" />
    </div>

    <div class="botslist">

        {#each Object.entries(bots) as [id, data]}
            <a class="botitem p-2" href="botstatuspage" on:click={entryBot(data[1])}>
                <div class="leftitem">{data[1]}</div>

                <div class="centereditem">
                    <span>{data[2]}</span>
                    <br />
                    <span>({data[3]} %)</span>
                    <br />
                </div>
                <div class="centereditem">
                    <span>{data[4]}</span>
                    <br />
                    <span>({data[5]} %)</span>
                    <br />
                </div>
                <div class="rightitem">

                    <IndLoad procvlozh={data[9]} {id} onoff={data[0]} />

                </div>

            </a>
        {:else}
            <!-- этот блок отрисовывается, пока photos.length === 0 -->
            <p>Ни одного бота не создано</p>
        {/each}
    </div>
    <div class="addknob">
        <Button href="newbot" light outlined on:click={routNewBot}>&nbsp;Новый бот&nbsp;</Button>
    </div>

</main>
