<script>
	import { onMount } from "svelte";
	import Switch from "smelte/src/components/Switch";
	import "smelte/src/tailwind.css";
	//import NewBot from './NewBot.svelte';
	import BotStatus from '../components/BotStatus.svelte';
	export let urlhost = "http://152.70.160.183:1880/";  
	export let comission;
	import dark from "./dark";
	
	let darkMode = dark();
	
	//import Button from "smelte/src/components/Button";



	let bots = [];
	let urlbotslist = urlhost + "api/data-bots.php";
	let newbot = urlhost + "api/newbot.php";
	let selectbot;
	/////routes
	let routIsBotList = true;
	let routIsBot = false;
	let routIsNewBot = false;

	function routBotList(){
		routIsBotList = true;
	 	routIsBot = false;
		routIsNewBot = false;
	}
	function routBot(){
		routIsBotList = false;
	 	routIsBot = true;
		routIsNewBot = false;
	}
	function routNewBot(){
		routIsBotList = false;
	 	routIsBot = false;
		routIsNewBot = true;
	}
	/////end routes
	onMount(async () => {
		const res = await fetch(urlbotslist);
		bots = await res.json();

		
	});	
	async function fetch1s(){
		const res = await fetch(urlbotslist);
		bots = await res.json();

	}
	function entryBot(botid){
		console.log(botid);
		routBot();
		
		selectbot = botid;
		
	}
	function profitsumproctodaycalc(arr){
			
		let sum = 0;
		arr.forEach(element => {
			sum = sum + element[5];
			
		}); 
		return sum;
	

	}
	function profitsumproccalc(arr){

		let sum = 0;
		arr.forEach(element => {
			sum = sum + element[3];
			
		}); 
		return sum;

	}

	function startbalancescalc(arr){

				let sum = 0;
		arr.forEach(element => {
			sum = sum + element[6];
			
		}); 
		return sum;

	}

	

	function balancescalc(arr){

				let sum = 0;
		arr.forEach(element => {
			sum = sum + element[7];
			
		}); 
		return sum;

	}

	let selectbotname;
	$: pkg = {
		urlhost: urlhost,
		comission: comission,
		urlhost: urlhost,
		selectbotname: selectbotname
	};
	$: if (selectbot) {selectbotname = bots[selectbot][1]};
	$: profitsumproctoday = profitsumproctodaycalc(bots).toFixed(2);
	$: profitsumproc = profitsumproccalc(bots).toFixed(2);
	$: startbalances = startbalancescalc(bots).toFixed(2);
	$: balances = balancescalc(bots).toFixed(2);

	setInterval(fetch1s, 3000);

</script>


<main>
{#if routIsBotList}
	<div class="darkmodeknob">
<button on:click={$darkMode} light outlined>button</button>

<button class="bg-blue-500 dark:text-gray-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>
	</div>
		<div class="textitem px-2">
			<div class="rowbalanceitem balancehead"><label>Баланс</label></div>
			<div class="rowbalanceitem"><label>Старт</label><br><span class="border-solid border-2 border-gray-200 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{startbalances}</span></div>
			<div class="rowbalanceitem"><label>Сегодня</label><br><span class="border-solid border-2 border-gray-200 bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{balances}</span></div>
			<div class="rowbalanceitem"><label>Cальдо</label><br><span class="border-solid border-2 border-gray-600 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{(balances - startbalances).toFixed(2)}</span></div>
		</div>
	<div class="textitem p-4">
		<div class="leftitem">
				Прибыль / просадка
			</div>&nbsp;&nbsp;


		<div class="centereditem">
			Всего<br>{profitsumproc} %
		</div>
		<div class="centereditem">
			Сегодня<br>
			{profitsumproctoday} %
		</div>
			<div class="rightitem">
				&nbsp;
				
			</div>
	</div>
	
	<div class="botslist">

		{#each Object.entries(bots) as [id, name]}
			
		<div class="botitem p-4" on:click = {entryBot(id)}>
			<div class="leftitem">
				{name[1]}
			</div>&nbsp;&nbsp;


		<div class="centereditem">
			<span >{name[2]}</span><br>
			<span >({name[3]} %)</span><br>
		</div>
		<div class="centereditem">
			<span >{name[4]}</span><br>
			<span >({name[5]} %)</span><br>
		</div>
			<div class="rightitem">
			<Switch/>
				
			</div>

		</div>
		{:else}
			<!-- этот блок отрисовывается, пока photos.length === 0 -->
			<p>Ни одного бота не создано</p>
		{/each}
	</div>
	<div class="addknob">
	
	</div>
	
{/if}
{#if routIsBot}
<div class="back">
<button on:click={routBotList} outlined>&#5130;</button>

<button on:value={$darkMode} outlined >
	&#9680;
</button>
</div>
<BotStatus {...pkg}/>
{/if}

</main>

<style>
  .btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover {
    @apply bg-blue-700;
  }

	.balancehead{

		padding-top: 28px;
	}
	.rowbalanceitem{
		padding-left: 10px;
		text-align: center;
		line-height: 30px;
		
	}
	.centereditem{
		text-align: center;
		width: 100px;
		border: 0px solid;
	}
	.darkmodeknob{
		display: flex;
		justify-content: flex-end;
		margin-right: 10px;
		margin-left: 10px;
		margin-top: 10px;
	}
	.addknob{
		display: flex;
		justify-content: center;
		margin-right: 10px;
		margin-left: 10px;
		margin-top: 10px;
	}
	.back{
		display: flex;
		justify-content: space-between;
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 10px;
	}
	main {
		text-align: center;
		
		
		padding: 0px;
	}
	.botslist {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		grid-gap: 1px;
		grid-template-rows:  auto 1fr;
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
	.leftitem{
		border: 0px solid;
		text-align: left;
		flex-grow: 1;
	}
	.rightitem{
		border: 0px solid;
		text-align: right;
		width: 40px;
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