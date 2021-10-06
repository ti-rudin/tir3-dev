<script>
	import { onMount } from 'svelte';
	import Switch from "smelte/src/components/Switch";
	import Button from "smelte/src/components/Button";
	import TextField from "smelte/src/components/TextField";
	import ProgressLinear from 'smelte/src/components/ProgressLinear';

	export let urlhost;
	export let selectbotname;
	export let comission;

	
	let botsettingsjson = urlhost + "api/data-settings.php";
	let botfinancejson = urlhost + "api/data-finance.php";
	let botfloorsjson = urlhost + "api/data-floors.php";
	let botsalesjson = urlhost + "api/data-sales.php";
	let botstatusjson = urlhost + "api/data-status.php";
	let changesettingsjson = urlhost + "api/changesettings.php";
	let resetsettingsjson = urlhost + "api/resetbot.php";
	let deleteboturl = urlhost + "api/deletebot.php";
	
	let botsettings = [];
	let botfinance = [];
	let botfloors = [];
	let botsales = [];
	let botstatus = [];

	let salestodayarr = [];
	let salesallarr = [];

	async function loadsettings() {

		const res = await fetch(botsettingsjson, {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(selectbotname)
		});
		botsettings = await res.json();

	}

	async function savesettings() {
		//botsettings.isrunning = !botsettings.isrunning;
		await fetch(changesettingsjson, {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(botsettings)
		});
	}

	async function resetsettings() {
		//botsettings.isrunning = !botsettings.isrunning;
		await fetch(resetsettingsjson, {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: selectbotname
		});
	}

	async function deletebot() {

		await fetch(deleteboturl, {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: selectbotname
		});
		setTimeout("window.location = '/'",500);
	}

	function sumsales(arr) {
		let sum = 0;
		arr.forEach(element => {
			sum = sum + element[5];
			
		}); 
		return sum;
	}

	async function fetch1s (){

		const res2 = await fetch(botfinancejson, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(selectbotname)
		});
		botfinance = await res2.json();

		const res3 = await fetch(botfloorsjson, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(selectbotname)
		});
		botfloors = await res3.json();

		const res4 = await fetch(botsalesjson, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(selectbotname)
		});
		botsales = await res4.json();
		salestodayarr = botsales.today;
		salesallarr = botsales.all;

		const res5 = await fetch(botstatusjson, {
			method: 'post',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(selectbotname)
		});
		botstatus = await res5.json();
		if (!botstatus) {botstatus = []; botstatus.rezhim = "Подключаемся к серверу"}

	}
	loadsettings();
	fetch1s();

	let profitsum = 0;
	let profitsumproc = 0;
	let quotasum = 0;
	let basesum = 0;
	$: profitsum = (botfinance.depo - botfinance.startdepo).toFixed(botsettings.digitprice);
	$: profitsumproc = (botfinance.depo/botfinance.startdepo*100 - 100).toFixed(2);
	$: quotasum = +botfinance.quotanal + +botfinance.quotainorders;
	$: basesum = +botfinance.basenal + +botfinance.baseinorders;
	$: profittodayproc = (salestodaysum/botfinance.startdepo*100).toFixed(2);

	setInterval(fetch1s, 1000);


	let lowq;
	let low;
	let hight;
	let floornumber, f1, f2, f3;
	let salesall;
	let salesallsum, ordersizeinquota, ordersizeinbase, progress;

	$: if (botstatus !== null) {
		lowq = botfloors[botstatus.currentfloor];
		ordersizeinquota = (botfinance.depo / 100 * botsettings.ordersize / botstatus.curenntprice).toFixed(botsettings.digitq);
		ordersizeinbase = (ordersizeinquota * botstatus.curenntprice ).toFixed(botsettings.digitprice);
		progress = (botstatus.curenntprice - low) / (hight - low) * 100;
			if (lowq) {
				floornumber = lowq[0];
				low = lowq[1].toFixed(botsettings.digitprice);
				hight = lowq[2].toFixed(botsettings.digitprice);
				f1 = lowq[3].toFixed(botsettings.digitprice);
				f2 = lowq[4].toFixed(botsettings.digitprice);
				f3 = lowq[5].toFixed(botsettings.digitprice);
			}
		};


	$: salestoday = (salestodayarr).length;
	$: salestodaysum = sumsales(salestodayarr);

	$: salesall = (salesallarr).length;
	$: salesallsum = sumsales(salesallarr);

	
	
</script>

<main>

	<div class="headblock">

		<div class="itemheadblock itemgrow">
		<span class="bg-white dark:bg-gray-900 text-black dark:text-white">{selectbotname}</span><br>
		
		</div>
	</div>
		<div class="row">
		<div class="leftitem">
			<div class="foolrow">
			<TextField label="Комментарий" outlined bind:value={botsettings.comment} />
			</div>
		</div>
	</div>
	<div class="row">
		<div class="leftitem"><label>Текущий режим</label><br>
		<strong class="bg-white dark:bg-gray-900 text-black dark:text-white">{botstatus.rezhim} {botstatus.runs}</strong>
		</div>
	</div>
	{#if (botstatus.currentfloor !== 0)}
	<div class="row">
		<div class="leftitem"><nobr><label>Этаж </label><strong>{floornumber}</strong> {low} - {hight}&nbsp;&nbsp;</nobr></div>
		<div class="rightitem" style="margin-top: 9px;height:4px; width:100%; background-color: #E9B602"><ProgressLinear {progress} /></div>
	</div>
	{/if}
	<div class="row">
		<div class="leftitem">
			<label>Цена</label><br>
			<strong class="bg-white dark:bg-gray-900 text-black dark:text-white">{botstatus.curenntprice}</strong><br>
		</div>
		<div class="rightitem rowbalance">
			<div class="rowbalanceitem"><label>Баланс</label></div>
			<div class="rowbalanceitem"><label>Старт</label><br><span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{botfinance.startdepo}</span></div>
			<div class="rowbalanceitem"><label>Сегодня</label><br><span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{botfinance.depo}</span></div>
		</div>
	</div>
	<div class="row">
		<div class="centereditem">
			<label>Прибыль / просадка</label><br>
			<span >{profitsum}</span><br>
			<span >({profitsumproc} %)</span><br>
		</div>
		<div class="centereditem">
			<label> </label><br>
			<span >{salestodaysum.toFixed(botsettings.digitprice)}</span><br>
			<span >({profittodayproc} %)</span><br>
		</div>
	</div>
	<div class="row">
		<div class="centereditem">
			<table class="bordernull">
				<tr class="bordernull">
					<td class="cellleft"><label>{botsettings.quotacoin} в наличии</label></td>
					<td class="cellleft bordernull">{botfinance.quotanal}</td>
					<td rowspan="2" class="borderbootom borderleft">{quotasum.toFixed(botsettings.digitq)}<br>({(botstatus.curenntprice * quotasum).toFixed(botsettings.digitq)} {botsettings.basecoin})</td>
				</tr>
				<tr>
					<td class="borderbootom cellleft"><label>{botsettings.quotacoin} в ордерах</label></td>
					<td class="borderbootom cellleft">{botfinance.quotainorders}</td>
				</tr>
				<tr>
					<td class="cellleft"><label>{botsettings.basecoin} в наличии</label></td>
					<td class="cellleft bordernull">{(botfinance.basenal*1).toFixed(botsettings.digitprice)}</td>
					<td rowspan="2" class="borderleft">{basesum.toFixed(botsettings.digitprice)} </td>
				</tr>
				<tr>
					<td class="cellleft"><label>{botsettings.basecoin} в ордерах</label></td>
					<td class="cellleft">{botfinance.baseinorders}</td>
				</tr>
			</table>
		</div>
	</div>
	<div class="yelowkob"><div class="row">
		<div class="leftitem">Продажи<br>Продажи сегодня<br>Ср. прибыль в сделке</div>
		<div class="rightitem">{salesall}<br><strong>{salestoday}</strong> ({salestodaysum.toFixed(botsettings.digitprice)} {botsettings.basecoin})<br>{(salesallsum/salesall).toFixed(botsettings.digitprice)} {botsettings.basecoin}</div>
		
	</div></div>
	<div class="yelowkob"><div class="row">
		<div class="leftitem">Открытых сделок<br>Средняя цена закупки</div>
		<div class="rightitem">23<br>12.53 {botsettings.basecoin}</div>
		
	</div></div>
	<br>
	<div class="row">
		<div class="leftitem">
			<label>{botsettings.isrunning ? "Включен" : "Выключен"}</label><br>
			<Switch bind:value="{botsettings.isrunning}"/>
		</div>
		<div class="rightitem">
			<label>Запрет на закуп</label><br>
			<Switch classes="inline-flex items-right mb-2 cursor-pointer z-10" bind:value="{botsettings.handyzapretnazakup}"/>
		</div>
		
	</div>
	<div class="row">
		<div class="leftitem">
				<TextField outlined bind:value={botsettings.priceforwake}/>
		</div>
		<div class="rightitemlabel">
			<label>Включить когда цена пересечет уровень</label>
		</div>
	</div>
	<div class="row">
		<div class="leftitem">
			<label>Объем ордера</label><br>
			~ {ordersizeinquota} {botsettings.quotacoin}, {ordersizeinbase} {botsettings.basecoin}
		</div>&nbsp;&nbsp;
		<div class="rightitem">
			<TextField label="% от депо" outlined bind:value={botsettings.ordersize} size="10"/>

	</div>
	</div>
	<div class="row">
		<div class="leftitem">
			<TextField label="MA1, мин" outlined bind:value={botsettings.ma1}/>	
		</div>&nbsp;&nbsp;
		<div class="rightitem">
			<TextField label="MA2, мин" outlined bind:value={botsettings.ma2}/>	
		</div>
	</div>
	<div class="row">
		<div class="leftitem padtop5">
		<label>Не закупать, если цена больше </label>
		</div>&nbsp;&nbsp;
		<div class="rightitem">
		<TextField label="" outlined bind:value={botsettings.maxpriceforzakup} size="10"/>	
		</div>
	</div>

	<div class="row">
		<div class="leftitem padtop5">
		<label>Не закупать, если цена меньше </label>
		</div>
		<div class="rightitem">
		<TextField label="" outlined bind:value={botsettings.minpriceforzakup} size="10"/>	
		</div>
	</div>
	<Button on:click={savesettings}>Сохранить</Button><br/><br/>
	<Button color="alert" on:click={resetsettings}>Сбросить к стартовым настройкам</Button>
	<Button color="alert" on:click={deletebot}>Удалить</Button>


</main>

<style type="text/scss">

	.swtch{ 
		height: 100px;
	}
	.foolrow{
		width: 400px;
	}
	.padtop5{
		padding-top: 14px;
	}
	.yelowkob{

		border: 1px solid rgba(233, 229, 132, 0.74);
		box-sizing: border-box;
		box-shadow: 0px 3px 5px rgba(209, 192, 104, 0.06);
		border-radius: 5px;
		margin-left: auto;
		margin-right: auto;
		max-width: 430px;
		line-height:1.7em;
		margin-top: 14px;
		padding-top: 5px;
	}
	.yelowkob:hover{

		cursor: pointer;
		
	}
	table{ 
		position: relative;
		width: 400px;
		border-collapse: collapse;
		border: 0px solid;
	}
	td{
		padding: 7px 7px 7px 0px;
	}
	th, td:first-child {
		border-right: 0px solid;
	}
	.cellleft{
		text-align: left;
	}
	.borderbootom{
		border-bottom: 1px solid;
	}
	.borderleft{
		border-left: 1px solid;
	}
	.bordernull{
		border: 0px solid;
	}
	.button-save{
		background: rgba(0, 255, 10, 0.1);
		border: 1px solid #00FF29;
		box-sizing: border-box;
		border-radius: 30px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.blackfont{ 
		color: rgb(36, 36, 36);
	}
	.greyfont{ 
		color : rgb(126, 126, 126);
	}
	label{
		margin-bottom : 7px;
		color : rgb(126, 126, 126);
	}
	.standartinput{
		width: 70px;
	}
	.input52{
		width: 52px;
	}
	.input88{
		width: 88px;
	}
	.foolrow{
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
	.rowbalanceitem{
		padding-left: 10px;
		text-align: center;
		
	}
	.leftitem{
		border: 0px solid;
		text-align: left;
	}
	.rightitem{
		border: 0px solid;
		text-align: right;
		
	}
	.rightitemlabel{
		border: 0px solid;
		text-align: left;
		margin-left: 10px;
    	margin-top: 5px;
		
	}
	.centereditem{
		border: 0px solid;
		text-align: center;
	}
	.headblock {
		display: flex;
		max-width: 400px;
		margin: auto;
		justify-content: flex-start;
		margin-bottom: 7px;
	}
	.itemheadblock{
		border: 0px solid;
		color: black;
	}
	.itemheadblockdark{
		border: 0px solid;
		color: red;
	}
	.itemgrow {
 		flex-grow: 2;
	}

	
	main {
		text-align: center;
		
		
		padding: 0px;
	}
	
</style>