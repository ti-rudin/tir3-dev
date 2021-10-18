<script>
  import { onMount } from "svelte";
  import Switchonoff from "./Switchonoff.svelte";
  import Switch from "smelte/src/components/Switch";
  import Button from "smelte/src/components/Button";
  import TextField from "smelte/src/components/TextField";
  import ProgressLinear from "smelte/src/components/ProgressLinear";
  import { stateStore } from "../stores/statebot.js";
  import { authStore } from "../stores/auth";

  var selectbotname = $stateStore.selectbotname;
  let urlhost = $stateStore.urlhost;
  let userid = $authStore.user.uid;

  let botsettingsjson = urlhost + "bot_settings";
  let botonoffjson = urlhost + "bot_onoff";
  let botonoffjson_togle = urlhost + "bot_onoff_togle";
  //let botfinancejson = urlhost + "api/data-finance.php";
  //let botfloorsjson = urlhost + "api/data-floors.php";
  //let botsalesjson = urlhost + "api/data-sales.php";
  let botstatusjson = urlhost + "bot_full";
  let changesettingsjson = urlhost + "api/changesettings.php";
  let resetsettingsjson = urlhost + "bot_reset";
  let deleteboturl = urlhost + "bot_delete";
  //let botfullstatusurl = urlhost + "api/data-fullstatus.php";
  let panicsaleurl = urlhost + "bot_panic";

  let botfullstatus = [];
  let botsettings = [];
  let botfinance = [];
  let botfloors = [];
  let botsales = [];
  let botstatus = [];
  let botonoff = [];
  let last_price = 0;

  let salestodayarr = [];
  let salesallarr = [];

  function loadsettings(selectbotid) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({ botname: selectbotid });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(botsettingsjson, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        botsettings = result;
      })
      .catch((error) => console.log("error", error));
  }

  function getonoff(selectbotid) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({ botname: selectbotid });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(botonoffjson, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        botonoff = result;
      })
      .catch((error) => console.log("error", error));
  }

  function savesettings() {
    //botsettings.isrunning = !botsettings.isrunning;
    fetch(changesettingsjson, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(botsettings),
    });

    function goback() {
      selectbotname = "";
      $stateStore.rout = "botlist";
    }
    setTimeout(goback, 1000);
  }

  function resetsettings() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ botname: selectbotname });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(resetsettingsjson, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });

    function goback() {
      selectbotname = "";
      $stateStore.rout = "botlist";
    }
    setTimeout(goback, 1000);
  }

  function deletebot() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      botname: selectbotname,
      user_id_from_google: userid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(deleteboturl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
    //$stateStore.rout = "botlist";
    //window.location = "/";
    function goback() {
      selectbotname = "";
      $stateStore.rout = "botlist";
    }
    setTimeout(goback, 1000);
  }

  function panicsale() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ botname: selectbotname });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(panicsaleurl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });

    function goback() {
      selectbotname = "";
      $stateStore.rout = "botlist";
    }
    setTimeout(goback, 1000);
  }


  function sumsales(arr) {
    let sum = 0;
    arr.forEach((element) => {
      sum = sum + element[5];
    });
    return sum;
  }
  let bot;
  function fetchfullstatus(selectbotid) {
    console.log("selectbotid:" + selectbotid);

    let myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");

    let raw2 = JSON.stringify({ botname: selectbotid });

    let requestOptions2 = {
      method: "POST",
      headers: myHeaders2,
      body: raw2,
      redirect: "follow",
    };

    fetch(botstatusjson, requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        last_price = Number(result.status.currentprice);
        botstatus = result.status;
        //botsettings = result.settings;
        botfinance = result.finance;
        botfloors = result.floors;
        botsales = result.sales;
        salestodayarr = botsales.today;
        salesallarr = botsales.all;
        //botonoff = result.onoff;
      })
      .catch((error) => console.log("error", error));
  }

  function onofftogle() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ botname: selectbotname });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(botonoffjson_togle, requestOptions)
      .then((response) => response.json())
      .then((result) => {});
  }

  loadsettings(selectbotname);
  //fetch1s();
  fetchfullstatus(selectbotname);
  getonoff(selectbotname);
  const timerId = setInterval(fetchfullstatus, 1000, selectbotname);
  $stateStore.timerId = timerId;

  $: if (!botstatus) {
    botstatus = [];
    botstatus.rezhim = "Подключаемся к серверу";
  }
  let profitsum = 0;
  let profitsumproc = 0;
  let quotasum = 0;
  let basesum = 0;
  $: profitsum = (botfinance.depo - botfinance.startdepo).toFixed(
    botsettings.digitprice
  );
  $: profitsumproc = (
    (botfinance.depo / botfinance.startdepo) * 100 -
    100
  ).toFixed(2);
  $: quotasum = +botfinance.quotanal + +botfinance.quotainorders;
  $: basesum = +botfinance.basenal + +botfinance.baseinorders;
  $: profittodayproc = ((salestodaysum / botfinance.startdepo) * 100).toFixed(
    2
  );

  //setInterval(fetch1s, 1000);

  let lowq;
  let low;
  let hight;
  let floornumber, f1, f2, f3;
  let salesall;
  let salesallsum, ordersizeinquota, ordersizeinbase, progress;

  $: if (botstatus !== null) {
    lowq = botfloors[botstatus.currentfloor - 1];
    ordersizeinquota = (
      ((botfinance.depo / 100) * botsettings.ordersize) /
      botstatus.currentprice
    ).toFixed(botsettings.digitq);
    ordersizeinbase = (ordersizeinquota * botstatus.currentprice).toFixed(
      botsettings.digitprice
    );
    progress = ((botstatus.currentprice - low) / (hight - low)) * 100;
    if (lowq) {
      floornumber = lowq[0];
      low = lowq[1].toFixed(botsettings.digitprice);
      hight = lowq[2].toFixed(botsettings.digitprice);
      f1 = lowq[3].toFixed(botsettings.digitprice);
      f2 = lowq[4].toFixed(botsettings.digitprice);
      f3 = lowq[5].toFixed(botsettings.digitprice);
    }
  }

  $: salestoday = salestodayarr.length;
  $: salestodaysum = sumsales(salestodayarr);

  $: salesall = salesallarr.length;
  $: salesallsum = sumsales(salesallarr);

  let openfloors;

  function openfloorscalc(floors) {
    let count = 0;
    let srprice = 0;
    let sum = 0;
    let res;
    floors.forEach(function (item, i, floors) {
      if (item[7] === 2 || item[7] === 3) {
        count = count + 1;
        sum = Number(sum + Number(item[10]));
      }
    });
    if (count > 0) {
      srprice = (sum / count).toFixed(botsettings.digitprice);
      res = { count: count, sprice: srprice };
    } else {
      res = { count: count, sprice: srprice };
    }

    return res;
  }
  $: openfloors = openfloorscalc(botfloors);
</script>

<main>

  <div class="row">
    <div class="leftitem">
      <div class="foolrow">
        <TextField
          label="Комментарий"
          outlined
          bind:value={botsettings.comment}
        />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="leftitem">
      <label>Текущий режим</label>
      <br />
      <strong class="bg-white dark:bg-gray-900 text-black dark:text-white">
        {botstatus.rezhim}
      </strong>
    </div>
  </div>
  {#if botstatus.currentfloor !== 0}
    <div class="row">
      <div class="leftitem">
        <nobr>
          <label>Этаж</label>
          <strong>{floornumber}</strong>
          {low} - {hight}&nbsp;&nbsp;
        </nobr>
      </div>
      <div
        class="rightitem"
        style="margin-top: 9px;height:4px; width:100%; background-color: #f5ce54"
      >
        <ProgressLinear {progress} />
      </div>
    </div>
  {/if}
  <div class="row">
    <div class="leftitem">
      <label>Цена</label>
      <br />
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-bold
        text-gray-800"
      >
        {last_price}
      </span>
      <br />
    </div>
    <div class="rightitem rowbalance">
      <div class="rowbalanceitem">
        <label>Баланс</label>
      </div>
      <div class="rowbalanceitem">
        <label>Старт</label>
        <br />
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm
          font-semibold text-gray-700"
        >
          {botfinance.startdepo}
        </span>
      </div>
      <div class="rowbalanceitem">
        <label>Сегодня</label>
        <br />
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm
          font-semibold text-gray-700"
        >
          {botfinance.depo}
        </span>
      </div>
    </div>
  </div>
  <div class="yelowkob">
    <div class="row">
      <div class="centereditem">
        <label>Прибыль всего</label>
        <br />
        <span>{profitsum}</span>
        <br />
        <span>({profitsumproc} %)</span>
        <br />
      </div>
      <div class="centereditem">
        <label>Прибыль сегодня</label>
        <br />
        <span>{salestodaysum.toFixed(botsettings.digitprice)}</span>
        <br />
        <span>({profittodayproc} %)</span>
        <br />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="centereditem">
      <table class="bordernull">
        <tr class="bordernull">
          <td class="cellleft">
            <label>{botsettings.quotacoin} в наличии</label>
          </td>
          <td class="cellleft bordernull">{botfinance.quotanal}</td>
          <td rowspan="2" class="borderbootom borderleft">
            {quotasum.toFixed(botsettings.digitq)}
            <br />
            ({(last_price * quotasum).toFixed(botsettings.digitq)} {botsettings.basecoin})
          </td>
        </tr>
        <tr>
          <td class="borderbootom cellleft">
            <label>{botsettings.quotacoin} в ордерах</label>
          </td>
          <td class="borderbootom cellleft">{botfinance.quotainorders}</td>
        </tr>
        <tr>
          <td class="cellleft">
            <label>{botsettings.basecoin} в наличии</label>
          </td>
          <td class="cellleft bordernull">
            {(botfinance.basenal * 1).toFixed(botsettings.digitprice)}
          </td>
          <td rowspan="2" class="borderleft">
            {basesum.toFixed(botsettings.digitprice)}
          </td>
        </tr>
        <tr>
          <td class="cellleft">
            <label>{botsettings.basecoin} в ордерах</label>
          </td>
          <td class="cellleft">{botfinance.baseinorders}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="yelowkob">
    <div class="row">
      <div class="leftitem">
        <label>Продажи</label>
        <br />
        <label>Продажи сегодня</label>
        <br />
        <label>Ср. прибыль в сделке</label>
      </div>
      <div class="rightitem">
        {salesall}
        <br />
        <strong>{salestoday}</strong>
        ({salestodaysum.toFixed(botsettings.digitprice)} {botsettings.basecoin})
        <br />
        {(salesallsum / salesall || 0).toFixed(botsettings.digitprice)}
        {botsettings.basecoin}
      </div>

    </div>
  </div>
  <div class="yelowkob">
    <div class="row">
      <div class="leftitem">
        <label>Открытых сделок</label>
        <br />
        <label>Средняя цена закупки</label>
      </div>
      <div class="rightitem">
        {openfloors.count}
        <br />
        {openfloors.sprice} {botsettings.basecoin}
      </div>

    </div>
  </div>
  <br />
  <div class="row">
    <div class="leftitem" >
      <label>{botonoff ? 'Включен' : 'Выключен'}</label>
      <br />
      <span on:click={onofftogle}><Switchonoff  bind:value={botonoff} /></span>
    </div>
    <div class="rightitem">
      <label>Запрет на закуп</label>
      <br />
      <Switch
        classes="inline-flex items-right mb-2 cursor-pointer z-10"
        bind:value={botsettings.handyzapretnazakup}
      />
    </div>

  </div>

  <!--     <div class="row">
        <div class="leftitem">
            <TextField outlined bind:value={botsettings.priceforwake} />
        </div>
        <div class="rightitemlabel">
            <label>Включить когда цена пересечет уровень</label>
        </div>
    </div> -->

  <div class="row">
    <div class="leftitem">
      <label>Объем ордера</label>
      <br />
      ~ {ordersizeinquota} {botsettings.quotacoin}, {ordersizeinbase} {botsettings.basecoin}
    </div>
    &nbsp;&nbsp;
    <div class="rightitem">
      <TextField
        label="% от депо"
        outlined
        bind:value={botsettings.ordersize}
        size="10"
      />

    </div>
  </div>
  <div class="row">
    <div class="leftitem">
      <TextField label="MA1, мин" outlined bind:value={botsettings.ma1} />
    </div>
    &nbsp;&nbsp;
    <div class="rightitem">
      <TextField label="MA2, мин" outlined bind:value={botsettings.ma2} />
    </div>
  </div>
  <div class="row">
    <div class="leftitem padtop5">
      <label>Не закупать, если цена больше</label>
    </div>
    &nbsp;&nbsp;
    <div class="rightitem">
      <TextField
        label=""
        outlined
        bind:value={botsettings.maxpriceforzakup}
        size="10"
      />
    </div>
  </div>

  <div class="row">
    <div class="leftitem padtop5">
      <label>Не закупать, если цена меньше</label>
    </div>
    <div class="rightitem">
      <TextField
        label=""
        outlined
        bind:value={botsettings.minpriceforzakup}
        size="10"
      />
    </div>
  </div>

  <Button on:click={savesettings} href="/">Сохранить</Button>
  <br />
  <br />
  <Button color="alert" on:click={panicsale}>PANICSALE</Button>
  <br />
  <br />
  <Button color="alert" on:click={resetsettings}>
    Сбросить к стартовым настройкам
  </Button>
  <br />
  <br />
  <Button color="alert" on:click={deletebot} href="/">Удалить</Button>

</main>

<style type="text/scss">
  .foolrow {
    width: 400px;
  }
  .padtop5 {
    padding-top: 14px;
  }
  .yelowkob {
    border: 1px solid rgba(233, 229, 132, 0.74);
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(209, 192, 104, 0.06);
    border-radius: 5px;
    margin-left: auto;
    margin-right: auto;
    max-width: 430px;
    line-height: 1.7em;
    margin-top: 14px;
    padding-top: 5px;
    padding-left: 7px;
    padding-right: 7px;
  }
  .yelowkob:hover {
    cursor: pointer;
  }
  table {
    position: relative;
    width: 400px;
    border-collapse: collapse;
    border: 0px solid;
    margin-top: 14px;
  }
  td {
    padding: 7px 7px 7px 0px;
  }
  td:first-child {
    border-right: 0px solid;
  }
  .cellleft {
    text-align: left;
  }
  .borderbootom {
    border-bottom: 1px solid;
  }
  .borderleft {
    border-left: 1px solid;
  }
  .bordernull {
    border: 0px solid;
  }
  label {
    margin-bottom: 7px;
    color: rgb(126, 126, 126);
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
  .rowbalance {
    display: flex;
    max-width: 400px;
    margin-left: auto;
    justify-content: space-between;
    align-items: flex-end;
  }
  .rowbalanceitem {
    padding-left: 10px;
    text-align: center;
  }
  .leftitem {
    border: 0px solid;
    text-align: left;
  }
  .rightitem {
    border: 0px solid;
    text-align: right;
  }
  .centereditem {
    border: 0px solid;
    text-align: center;
  }
  main {
    text-align: center;
    padding: 0px;
  }
</style>
