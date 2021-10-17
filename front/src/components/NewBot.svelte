<script>
    import { onMount } from 'svelte';
    import TextField from 'smelte/src/components/TextField';
    import Switch from 'smelte/src/components/Switch';
    import Button from 'smelte/src/components/Button';
    export let urlhost;
    export let comission;

    import { authStore } from '../stores/auth';
    import { stateStore } from '../stores/statebot.js';
    let userid = $authStore.user.uid;

    let urlbotslist = urlhost + 'botslist';
    //let newbot = urlhost + 'api/newbot.php';
    let api_bots = 'http://77.87.212.38:1337/bots';
    let api_botcreate = urlhost + 'botcreate';


    let isrunning = false;
    let quotacoin;
    let basecoin;
    let digitq;
    let digitprice;
    let minprice;
    let maxprice;
    let startdepo;
    let profitproc;
    let ordersize;
    let ordersizeinquota = 0;
    $: ordersizeinquota = (((startdepo / 100) * ordersize) / minprice).toFixed(digitq);
    $: ordersizeinbase = ((startdepo / 100) * ordersize).toFixed(digitq);
    let ofsetbottom;
    let ofsettop;
    $: ofsetbottomsize = (minprice / 100) * ofsetbottom;
    $: ofsettopsize = ((minprice * (1 + profitproc / 100)) / 100) * ofsettop;
    let comment;
    let floorsvsego = 0;

    let startfloorprice = minprice;
    let heightfirstfloor = 0;
    let heightlastfloor = 0;
    let ma1 = 3;
    let ma2 = 30;
    let maxpriceforzakup;
    let minpriceforzakup;
    let floors = [];
    let curenntprice = 0;
    let priceforwake;
    let handyzapretnazakup = false;

    function getfloorsvsego(m, mx, pr, ob, ot) {
        let fv = 1;
        let height_floor = 0;

        if (m && mx && pr && ob && ot) {
            let p = parseInt(pr * 1000) / 1000;
            floors = [];
            let mnz = 10 * parseInt(digitprice);
            let startfloorprice = parseInt(m * mnz) / mnz;

            if (m && mx && p) {
                while (startfloorprice < mx) {
                    height_floor =
                        (startfloorprice * (comission + p)) / 100 +
                        (ofsetbottom * startfloorprice) / 100 +
                        (ofsettop * startfloorprice) / 100;
                    floors.push([
                        fv,
                        startfloorprice,
                        startfloorprice + height_floor,
                        startfloorprice + (ofsetbottom * startfloorprice) / 100,
                        startfloorprice +
                            (ofsetbottom * startfloorprice) / 100 +
                            (startfloorprice * comission) / 100,
                        startfloorprice +
                            (ofsetbottom * startfloorprice) / 100 +
                            (startfloorprice * comission) / 100 +
                            (ofsettop * startfloorprice) / 100,
                        startfloorprice +
                            (ofsetbottom * startfloorprice) / 100 +
                            (startfloorprice * (comission + p)) / 100,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                    ]);

                    startfloorprice = startfloorprice + height_floor;
                    fv++;
                }
                if (m < mx) {
                    heightfirstfloor = (floors[0][2] - floors[0][1]).toFixed(digitprice);
                } else {
                    heightfirstfloor = 0;
                }
                if (m < mx) {
                    heightlastfloor = (floors[fv - 2][2] - floors[fv - 2][1]).toFixed(digitprice);
                } else {
                    heightlastfloor = 0;
                }

                console.log(heightfirstfloor, heightlastfloor);
            }

            fv = fv - 1;
            return fv;
        }
    }

    $: floorsvsego = getfloorsvsego(minprice, maxprice, profitproc, ofsetbottom, ofsettop);

    let bots = [];
    onMount(async () => {
        const res = await fetch(urlbotslist);
        bots = await res.json();
    });

    function addNewBot() {
        var d = new Date();
        var ms = Date.parse(d) / 1000;
        if (bots == null) {
            bots = [];
        }
        let botname = quotacoin + basecoin + '-' + ms;
        let moneta = quotacoin + basecoin;
        bots = [...bots, [false, botname, 0, 0, 0, 0, 0, 0, userid]];

        let settings = {
            botname,
            isrunning,
            handyzapretnazakup,
            comment,
            quotacoin,
            basecoin,
            moneta,
            digitq,
            digitprice,
            minprice,
            maxprice,
            profitproc,
            ordersize,
            ofsetbottom,
            ofsettop,
            ma1,
            ma2,
            maxpriceforzakup,
            minpriceforzakup,
            priceforwake,
            userid
        };

        let finance = {
            startdepo: startdepo,
            depo: startdepo,
            quotanal: 0,
            quotainorders: 0,
            basenal: startdepo,
            baseinorders: 0,
            profittoday: 0,
        };
        let sales = { today: [], days: [], all: [] };
        let status = {
            currentprice: -1,
            lastprice: -1,
            currentfloor: -1,
            lastfloor: -1,
            sr_ma_big: -1,
            sr_ma_small: -1,
            rezhim: 'Стартовые настройки',
            updated: ms
        };
        let ttp = {
            raschstopprice: 0,
            curstop: 0,
            curorderid: 0,
            quantity: 0,
            ttpbusy: false,
            sold: false
        };
        

    fetch(api_botcreate, {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            "botname" : botname,
            "busy": false,
            "onoff": false,
            "user_id_from_google": userid,
            "settings": JSON.stringify(settings),
            "floors": JSON.stringify(floors),
            "finance" : JSON.stringify(finance),
            "sales" : JSON.stringify(sales),
            "status" : JSON.stringify(status),
            "ttp" : JSON.stringify(ttp),
            "start_set" : JSON.stringify({settings,floors,finance,sales,status,ttp})
        })
    });


        //fetch(api_botcreate, {
        //    method: 'post',
        //    headers: {
        //        Accept: 'application/json, text/plain, */*',
        //        'Content-Type': 'application/json',
        //    },
        //    body: JSON.stringify({ 
        //        "botname" : botname,
        //        "user_id_from_google": userid,
        //        "ttp" : ttp
        //    }),
        //});
       //
        //ym(65948110,'reachGoal','createbot');
        //
        //window.location = "/";
        //console.log(Object.values(bots));
    }
    //let botsettingsall = [];
//
    //$: botsettingsall = [
    //    comment,
    //    quotacoin,
    //    basecoin,
    //    digitq,
    //    digitprice,
    //    minprice,
    //    maxprice,
    //    profitproc,
    //    ordersize,
    //    ofsetbottom,
    //    ofsettop,
    //    ma1,
    //    ma2,
    //    maxpriceforzakup,
    //    minpriceforzakup,
    //    priceforwake,
    //];
</script>

<style type="text/scss">
    .padtop5 {
        padding-top: 14px;
    }

    .foolrow {
        width: 400px;
    }

    .row {
        display: flex;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        justify-content: space-between;
    }
    .leftitem {
        border: 0px solid;
        text-align: left;
    }
    .rightitem {
        border: 0px solid;
        text-align: right;
    }
    .headblock {
        display: flex;
        max-width: 400px;
        margin: auto;
        justify-content: space-around;
        margin-top: 7px;
        color: rgb(36, 36, 36);
    }

    label {
        margin-bottom: 7px;
        color: rgb(126, 126, 126);
    }
    main {
        text-align: center;
        padding: 0px;
    }
</style>

<main>
    <div class="headblock">
        <p class="text-xl text-gray-900 dark:text-gray-300">Создание нового бота</p>

    </div>
    <div class="row">
        <div class="leftitem">
            <div class="foolrow">
                <TextField label="Комментарий" outlined bind:value={comment} />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <TextField label="Торгуемая валюта" outlined bind:value={quotacoin} />
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="Базовая валюта" outlined bind:value={basecoin} />
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <TextField label="Округление цены" outlined bind:value={digitprice} />
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="Округление объема" outlined bind:value={digitq} />
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <TextField label="Низ сетки" outlined bind:value={minprice} />
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="Верх сетки" outlined bind:value={maxprice} />
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <TextField label="Стартовый депозит" outlined bind:value={startdepo} />
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">

            <TextField label="Прибыль в сделке, %" outlined bind:value={profitproc} />
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <label>Объем ордера</label>
            <br />
            <p class=" text-gray-900 dark:text-gray-300">
                ~ {ordersizeinquota ? ordersizeinquota : 0} {quotacoin}, {ordersizeinbase ? ordersizeinbase : 0}
                {basecoin}
            </p>
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="% от депо" outlined bind:value={ordersize} size="10" />

        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <TextField label="Отступ снизу, %" outlined bind:value={ofsetbottom} />
            <p class=" text-gray-900 dark:text-gray-300">
                ~ {ofsetbottomsize.toFixed(digitprice)} {basecoin}
            </p>
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="Отступ сверху, %" outlined bind:value={ofsettop} />
            <p class=" text-gray-900 dark:text-gray-300">
                ~ {ofsettopsize.toFixed(digitprice)} {basecoin}
            </p>
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <br />
            <label>Всего этажей</label>
            <p class=" text-gray-900 dark:text-gray-300">{floorsvsego}</p>
        </div>
    </div>
    <div class="row">
        <div class="leftitem">
            <br />
            <label>Высота 1-го этажа</label>
            <p class=" text-gray-900 dark:text-gray-300">{heightfirstfloor} {basecoin}</p>
        </div>
        <div class="rightitem">
            <br />
            <label>Высота верхнего этажа</label>
            <p class=" text-gray-900 dark:text-gray-300">{heightlastfloor} {basecoin}</p>
        </div>
    </div>
    <br />
    <div class="row">
        <div class="leftitem">
            <TextField label="MA1, мин" outlined bind:value={ma1} />
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="MA2, мин" outlined bind:value={ma2} />
        </div>
    </div>
    <div class="row">
        <div class="leftitem padtop5">
            <label>Не закупать, если цена больше</label>
        </div>
        &nbsp;&nbsp;
        <div class="rightitem">
            <TextField label="" outlined bind:value={maxpriceforzakup} size="10" />
        </div>
    </div>

    <div class="row">
        <div class="leftitem padtop5">
            <label>Не закупать, если цена меньше</label>
        </div>
        <div class="rightitem">
            <TextField label="" outlined bind:value={minpriceforzakup} size="10" />
        </div>
    </div>
    <br />
    <Button href="/" on:click={addNewBot}>Создать</Button>
    <br />
    <br />
</main>
