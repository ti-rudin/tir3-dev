import { S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, af as binding_callbacks, ag as bind, B as Button, p as validate_store, u as authStore, r as component_subscribe, w as onMount, v as validate_slots, e as element, z as space, x as text, A as create_component, c as claim_element, b as children, C as claim_space, y as claim_text, f as detach_dev, D as claim_component, j as add_location, h as attr_dev, l as insert_dev, m as append_dev, E as mount_component, ah as add_flush_callback, H as transition_in, I as transition_out, J as destroy_component, q as stateStore, T as assign, U as get_spread_update, V as get_spread_object, Q as empty, R as query_selector_all, L as check_outros, K as group_outros } from './client.e969b9c0.js';
import { T as TextField, S as Switch } from './TextField.fd59dbc4.js';

/* src/components/Sett.svelte generated by Svelte v3.24.0 */

const { console: console_1 } = globals;
const file = "src/components/Sett.svelte";

// (114:4) <Button on:click={saveSettings}>
function create_default_slot(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Сохранить");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Сохранить");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(114:4) <Button on:click={saveSettings}>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let main;
	let br0;
	let t0;
	let p0;
	let t1;
	let t2;
	let br1;
	let t3;
	let div0;
	let p1;
	let t4;
	let t5;
	let br2;
	let t6;
	let div3;
	let div2;
	let div1;
	let textfield0;
	let updating_value;
	let t7;
	let div6;
	let div5;
	let div4;
	let textfield1;
	let updating_value_1;
	let t8;
	let div7;
	let p2;
	let t9;
	let t10;
	let br3;
	let t11;
	let div10;
	let div9;
	let div8;
	let textfield2;
	let updating_value_2;
	let t12;
	let button;
	let current;

	function textfield0_value_binding(value) {
		/*textfield0_value_binding*/ ctx[5].call(null, value);
	}

	let textfield0_props = { label: "Key", outlined: true };

	if (/*binancekey*/ ctx[0] !== void 0) {
		textfield0_props.value = /*binancekey*/ ctx[0];
	}

	textfield0 = new TextField({ props: textfield0_props, $$inline: true });
	binding_callbacks.push(() => bind(textfield0, "value", textfield0_value_binding));

	function textfield1_value_binding(value) {
		/*textfield1_value_binding*/ ctx[6].call(null, value);
	}

	let textfield1_props = { label: "Secret", outlined: true };

	if (/*binancesecret*/ ctx[1] !== void 0) {
		textfield1_props.value = /*binancesecret*/ ctx[1];
	}

	textfield1 = new TextField({ props: textfield1_props, $$inline: true });
	binding_callbacks.push(() => bind(textfield1, "value", textfield1_value_binding));

	function textfield2_value_binding(value) {
		/*textfield2_value_binding*/ ctx[7].call(null, value);
	}

	let textfield2_props = { label: "Comission", outlined: true };

	if (/*comission*/ ctx[2] !== void 0) {
		textfield2_props.value = /*comission*/ ctx[2];
	}

	textfield2 = new TextField({ props: textfield2_props, $$inline: true });
	binding_callbacks.push(() => bind(textfield2, "value", textfield2_value_binding));

	button = new Button({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*saveSettings*/ ctx[3]);

	const block = {
		c: function create() {
			main = element("main");
			br0 = element("br");
			t0 = space();
			p0 = element("p");
			t1 = text("Настройки");
			t2 = space();
			br1 = element("br");
			t3 = space();
			div0 = element("div");
			p1 = element("p");
			t4 = text("Binance API keys");
			t5 = space();
			br2 = element("br");
			t6 = space();
			div3 = element("div");
			div2 = element("div");
			div1 = element("div");
			create_component(textfield0.$$.fragment);
			t7 = space();
			div6 = element("div");
			div5 = element("div");
			div4 = element("div");
			create_component(textfield1.$$.fragment);
			t8 = space();
			div7 = element("div");
			p2 = element("p");
			t9 = text("Прочие");
			t10 = space();
			br3 = element("br");
			t11 = space();
			div10 = element("div");
			div9 = element("div");
			div8 = element("div");
			create_component(textfield2.$$.fragment);
			t12 = space();
			create_component(button.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			main = claim_element(nodes, "MAIN", { class: true });
			var main_nodes = children(main);
			br0 = claim_element(main_nodes, "BR", {});
			t0 = claim_space(main_nodes);
			p0 = claim_element(main_nodes, "P", { class: true });
			var p0_nodes = children(p0);
			t1 = claim_text(p0_nodes, "Настройки");
			p0_nodes.forEach(detach_dev);
			t2 = claim_space(main_nodes);
			br1 = claim_element(main_nodes, "BR", {});
			t3 = claim_space(main_nodes);
			div0 = claim_element(main_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			p1 = claim_element(div0_nodes, "P", {});
			var p1_nodes = children(p1);
			t4 = claim_text(p1_nodes, "Binance API keys");
			p1_nodes.forEach(detach_dev);
			t5 = claim_space(div0_nodes);
			br2 = claim_element(div0_nodes, "BR", {});
			div0_nodes.forEach(detach_dev);
			t6 = claim_space(main_nodes);
			div3 = claim_element(main_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			claim_component(textfield0.$$.fragment, div1_nodes);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			t7 = claim_space(main_nodes);
			div6 = claim_element(main_nodes, "DIV", { class: true });
			var div6_nodes = children(div6);
			div5 = claim_element(div6_nodes, "DIV", { class: true });
			var div5_nodes = children(div5);
			div4 = claim_element(div5_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			claim_component(textfield1.$$.fragment, div4_nodes);
			div4_nodes.forEach(detach_dev);
			div5_nodes.forEach(detach_dev);
			div6_nodes.forEach(detach_dev);
			t8 = claim_space(main_nodes);
			div7 = claim_element(main_nodes, "DIV", { class: true });
			var div7_nodes = children(div7);
			p2 = claim_element(div7_nodes, "P", {});
			var p2_nodes = children(p2);
			t9 = claim_text(p2_nodes, "Прочие");
			p2_nodes.forEach(detach_dev);
			t10 = claim_space(div7_nodes);
			br3 = claim_element(div7_nodes, "BR", {});
			div7_nodes.forEach(detach_dev);
			t11 = claim_space(main_nodes);
			div10 = claim_element(main_nodes, "DIV", { class: true });
			var div10_nodes = children(div10);
			div9 = claim_element(div10_nodes, "DIV", { class: true });
			var div9_nodes = children(div9);
			div8 = claim_element(div9_nodes, "DIV", { class: true });
			var div8_nodes = children(div8);
			claim_component(textfield2.$$.fragment, div8_nodes);
			div8_nodes.forEach(detach_dev);
			div9_nodes.forEach(detach_dev);
			div10_nodes.forEach(detach_dev);
			t12 = claim_space(main_nodes);
			claim_component(button.$$.fragment, main_nodes);
			main_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(br0, file, 81, 4, 2193);
			attr_dev(p0, "class", "text-2xl");
			add_location(p0, file, 82, 4, 2204);
			add_location(br1, file, 83, 4, 2242);
			add_location(p1, file, 85, 8, 2285);
			add_location(br2, file, 86, 8, 2317);
			attr_dev(div0, "class", "headblock svelte-2uud3p");
			add_location(div0, file, 84, 4, 2253);
			attr_dev(div1, "class", "foolrow svelte-2uud3p");
			add_location(div1, file, 90, 12, 2400);
			attr_dev(div2, "class", "leftitem svelte-2uud3p");
			add_location(div2, file, 89, 8, 2365);
			attr_dev(div3, "class", "row svelte-2uud3p");
			add_location(div3, file, 88, 4, 2339);
			attr_dev(div4, "class", "foolrow svelte-2uud3p");
			add_location(div4, file, 97, 12, 2607);
			attr_dev(div5, "class", "leftitem svelte-2uud3p");
			add_location(div5, file, 96, 8, 2572);
			attr_dev(div6, "class", "row svelte-2uud3p");
			add_location(div6, file, 95, 4, 2546);
			add_location(p2, file, 103, 8, 2791);
			add_location(br3, file, 104, 8, 2813);
			attr_dev(div7, "class", "headblock svelte-2uud3p");
			add_location(div7, file, 102, 4, 2759);
			attr_dev(div8, "class", "foolrow svelte-2uud3p");
			add_location(div8, file, 108, 12, 2896);
			attr_dev(div9, "class", "leftitem svelte-2uud3p");
			add_location(div9, file, 107, 8, 2861);
			attr_dev(div10, "class", "row svelte-2uud3p");
			add_location(div10, file, 106, 4, 2835);
			attr_dev(main, "class", "svelte-2uud3p");
			add_location(main, file, 80, 0, 2182);
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, br0);
			append_dev(main, t0);
			append_dev(main, p0);
			append_dev(p0, t1);
			append_dev(main, t2);
			append_dev(main, br1);
			append_dev(main, t3);
			append_dev(main, div0);
			append_dev(div0, p1);
			append_dev(p1, t4);
			append_dev(div0, t5);
			append_dev(div0, br2);
			append_dev(main, t6);
			append_dev(main, div3);
			append_dev(div3, div2);
			append_dev(div2, div1);
			mount_component(textfield0, div1, null);
			append_dev(main, t7);
			append_dev(main, div6);
			append_dev(div6, div5);
			append_dev(div5, div4);
			mount_component(textfield1, div4, null);
			append_dev(main, t8);
			append_dev(main, div7);
			append_dev(div7, p2);
			append_dev(p2, t9);
			append_dev(div7, t10);
			append_dev(div7, br3);
			append_dev(main, t11);
			append_dev(main, div10);
			append_dev(div10, div9);
			append_dev(div9, div8);
			mount_component(textfield2, div8, null);
			append_dev(main, t12);
			mount_component(button, main, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const textfield0_changes = {};

			if (!updating_value && dirty & /*binancekey*/ 1) {
				updating_value = true;
				textfield0_changes.value = /*binancekey*/ ctx[0];
				add_flush_callback(() => updating_value = false);
			}

			textfield0.$set(textfield0_changes);
			const textfield1_changes = {};

			if (!updating_value_1 && dirty & /*binancesecret*/ 2) {
				updating_value_1 = true;
				textfield1_changes.value = /*binancesecret*/ ctx[1];
				add_flush_callback(() => updating_value_1 = false);
			}

			textfield1.$set(textfield1_changes);
			const textfield2_changes = {};

			if (!updating_value_2 && dirty & /*comission*/ 4) {
				updating_value_2 = true;
				textfield2_changes.value = /*comission*/ ctx[2];
				add_flush_callback(() => updating_value_2 = false);
			}

			textfield2.$set(textfield2_changes);
			const button_changes = {};

			if (dirty & /*$$scope*/ 4096) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(textfield0.$$.fragment, local);
			transition_in(textfield1.$$.fragment, local);
			transition_in(textfield2.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(textfield0.$$.fragment, local);
			transition_out(textfield1.$$.fragment, local);
			transition_out(textfield2.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(textfield0);
			destroy_component(textfield1);
			destroy_component(textfield2);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $authStore;
	validate_store(authStore, "authStore");
	component_subscribe($$self, authStore, $$value => $$invalidate(9, $authStore = $$value));
	let { urlhost } = $$props;
	let usersettings = [];
	let binancekey, binancesecret, comission;
	let getusset = urlhost + "api/getusersettings.php";
	let setusset = urlhost + "api/setusersettings.php";
	console.log(getusset);

	onMount(async () => {
		let au = $authStore.user.uid;

		const res = await fetch(getusset, {
			method: "post",
			body: JSON.stringify({ au }),
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*"
			}
		});

		usersettings = await res.json();
		console.log(usersettings);
		$$invalidate(0, binancekey = usersettings[1]);
		$$invalidate(1, binancesecret = usersettings[2]);
		$$invalidate(2, comission = usersettings[3]);
	});

	async function saveSettings() {
		await fetch(setusset, {
			method: "post",
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usersettings)
		});

		console.log(usersettings, setusset);
	}

	const writable_props = ["urlhost"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Sett> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Sett", $$slots, []);

	function textfield0_value_binding(value) {
		binancekey = value;
		$$invalidate(0, binancekey);
	}

	function textfield1_value_binding(value) {
		binancesecret = value;
		$$invalidate(1, binancesecret);
	}

	function textfield2_value_binding(value) {
		comission = value;
		$$invalidate(2, comission);
	}

	$$self.$set = $$props => {
		if ("urlhost" in $$props) $$invalidate(4, urlhost = $$props.urlhost);
	};

	$$self.$capture_state = () => ({
		onMount,
		Switch,
		Button,
		TextField,
		authStore,
		urlhost,
		usersettings,
		binancekey,
		binancesecret,
		comission,
		getusset,
		setusset,
		saveSettings,
		$authStore
	});

	$$self.$inject_state = $$props => {
		if ("urlhost" in $$props) $$invalidate(4, urlhost = $$props.urlhost);
		if ("usersettings" in $$props) usersettings = $$props.usersettings;
		if ("binancekey" in $$props) $$invalidate(0, binancekey = $$props.binancekey);
		if ("binancesecret" in $$props) $$invalidate(1, binancesecret = $$props.binancesecret);
		if ("comission" in $$props) $$invalidate(2, comission = $$props.comission);
		if ("getusset" in $$props) getusset = $$props.getusset;
		if ("setusset" in $$props) setusset = $$props.setusset;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$authStore, binancekey, binancesecret, comission*/ 519) {
			 usersettings = [$authStore.user.uid, binancekey, binancesecret, comission];
		}
	};

	return [
		binancekey,
		binancesecret,
		comission,
		saveSettings,
		urlhost,
		textfield0_value_binding,
		textfield1_value_binding,
		textfield2_value_binding
	];
}

class Sett extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { urlhost: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Sett",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*urlhost*/ ctx[4] === undefined && !("urlhost" in props)) {
			console_1.warn("<Sett> was created without expected prop 'urlhost'");
		}
	}

	get urlhost() {
		throw new Error("<Sett>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set urlhost(value) {
		throw new Error("<Sett>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/settings.svelte generated by Svelte v3.24.0 */

// (23:0) {#if $authStore.status === 'in'}
function create_if_block(ctx) {
	let sett;
	let current;
	const sett_spread_levels = [/*pkg*/ ctx[1]];
	let sett_props = {};

	for (let i = 0; i < sett_spread_levels.length; i += 1) {
		sett_props = assign(sett_props, sett_spread_levels[i]);
	}

	sett = new Sett({ props: sett_props, $$inline: true });

	const block = {
		c: function create() {
			create_component(sett.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(sett.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(sett, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const sett_changes = (dirty & /*pkg*/ 2)
			? get_spread_update(sett_spread_levels, [get_spread_object(/*pkg*/ ctx[1])])
			: {};

			sett.$set(sett_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(sett.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(sett.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(sett, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(23:0) {#if $authStore.status === 'in'}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let t;
	let if_block_anchor;
	let current;
	let if_block = /*$authStore*/ ctx[0].status === "in" && create_if_block(ctx);

	const block = {
		c: function create() {
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-y60w54\"]", document.head);
			head_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
			this.h();
		},
		h: function hydrate() {
			document.title = "Настройки";
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$authStore*/ ctx[0].status === "in") {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$authStore*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let $stateStore;
	let $authStore;
	validate_store(stateStore, "stateStore");
	component_subscribe($$self, stateStore, $$value => $$invalidate(2, $stateStore = $$value));
	validate_store(authStore, "authStore");
	component_subscribe($$self, authStore, $$value => $$invalidate(0, $authStore = $$value));
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	const pkg = {
		urlhost: "https://91.228.118.92/back/",
		urlhostkeys: "https://91.228.118.92/usersettings/"
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Settings> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Settings", $$slots, []);

	$$self.$capture_state = () => ({
		stateStore,
		Sett,
		authStore,
		pkg,
		$stateStore,
		$authStore
	});

	return [$authStore, pkg];
}

class Settings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Settings",
			options,
			id: create_fragment$1.name
		});
	}
}

export default Settings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuZDFmOTYzMGEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1NldHQuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL3JvdXRlcy9zZXR0aW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcbiAgICBpbXBvcnQgU3dpdGNoIGZyb20gJ3NtZWx0ZS9zcmMvY29tcG9uZW50cy9Td2l0Y2gnO1xuICAgIGltcG9ydCBCdXR0b24gZnJvbSAnc21lbHRlL3NyYy9jb21wb25lbnRzL0J1dHRvbic7XG4gICAgaW1wb3J0IFRleHRGaWVsZCBmcm9tICdzbWVsdGUvc3JjL2NvbXBvbmVudHMvVGV4dEZpZWxkJztcbiAgICBpbXBvcnQgeyBhdXRoU3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvYXV0aCc7XG4gICAgLy9pbXBvcnQgXCJzbWVsdGUvc3JjL3RhaWx3aW5kLmNzc1wiO1xuICAgIGV4cG9ydCBsZXQgdXJsaG9zdDtcblxuICAgIGxldCB1c2Vyc2V0dGluZ3MgPSBbXTtcbiAgICBsZXQgYmluYW5jZWtleSwgYmluYW5jZXNlY3JldCwgY29taXNzaW9uO1xuICAgIGxldCBnZXR1c3NldCA9IHVybGhvc3QgKyAnYXBpL2dldHVzZXJzZXR0aW5ncy5waHAnO1xuICAgIGxldCBzZXR1c3NldCA9IHVybGhvc3QgKyAnYXBpL3NldHVzZXJzZXR0aW5ncy5waHAnO1xuXG4gICAgY29uc29sZS5sb2coZ2V0dXNzZXQpO1xuICAgIG9uTW91bnQoYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgYXUgPSAkYXV0aFN0b3JlLnVzZXIudWlkO1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChnZXR1c3NldCwge1xuICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGF1IH0pLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJzZXR0aW5ncyA9IGF3YWl0IHJlcy5qc29uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHVzZXJzZXR0aW5ncyk7XG4gICAgICAgIGJpbmFuY2VrZXkgPSB1c2Vyc2V0dGluZ3NbMV07XG4gICAgICAgIGJpbmFuY2VzZWNyZXQgPSB1c2Vyc2V0dGluZ3NbMl07XG4gICAgICAgIGNvbWlzc2lvbiA9IHVzZXJzZXR0aW5nc1szXTtcbiAgICB9KTtcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHNhdmVTZXR0aW5ncygpIHtcbiAgICAgICAgYXdhaXQgZmV0Y2goc2V0dXNzZXQsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh1c2Vyc2V0dGluZ3MpLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2codXNlcnNldHRpbmdzLCBzZXR1c3NldCk7XG4gICAgfVxuICAgICQ6IHVzZXJzZXR0aW5ncyA9IFskYXV0aFN0b3JlLnVzZXIudWlkLCBiaW5hbmNla2V5LCBiaW5hbmNlc2VjcmV0LCBjb21pc3Npb25dO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZSB0eXBlPVwidGV4dC9zY3NzXCI+XG4gICAgbWFpbiB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcblxuICAgICAgICBwYWRkaW5nOiAwcHg7XG4gICAgfVxuICAgIC5mb29scm93IHtcbiAgICAgICAgd2lkdGg6IDQwMHB4O1xuICAgIH1cblxuICAgIC5yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgIC5sZWZ0aXRlbSB7XG4gICAgICAgIGJvcmRlcjogMHB4IHNvbGlkO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIH1cblxuICAgIC5oZWFkYmxvY2sge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogN3B4O1xuICAgIH1cbjwvc3R5bGU+XG5cbjxtYWluPlxuICAgIDxiciAvPlxuICAgIDxwIGNsYXNzPVwidGV4dC0yeGxcIj7QndCw0YHRgtGA0L7QudC60Lg8L3A+XG4gICAgPGJyIC8+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRibG9ja1wiPlxuICAgICAgICA8cD5CaW5hbmNlIEFQSSBrZXlzPC9wPlxuICAgICAgICA8YnIgLz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0aXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb2xyb3dcIj5cbiAgICAgICAgICAgICAgICA8VGV4dEZpZWxkIGxhYmVsPVwiS2V5XCIgb3V0bGluZWQgYmluZDp2YWx1ZT17YmluYW5jZWtleX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0aXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvb2xyb3dcIj5cbiAgICAgICAgICAgICAgICA8VGV4dEZpZWxkIGJpbmQ6dmFsdWU9e2JpbmFuY2VzZWNyZXR9IGxhYmVsPVwiU2VjcmV0XCIgb3V0bGluZWQgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiaGVhZGJsb2NrXCI+XG4gICAgICAgIDxwPtCf0YDQvtGH0LjQtTwvcD5cbiAgICAgICAgPGJyIC8+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdGl0ZW1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb29scm93XCI+XG4gICAgICAgICAgICAgICAgPFRleHRGaWVsZCBsYWJlbD1cIkNvbWlzc2lvblwiIG91dGxpbmVkIGJpbmQ6dmFsdWU9e2NvbWlzc2lvbn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8QnV0dG9uIG9uOmNsaWNrPXtzYXZlU2V0dGluZ3N9PtCh0L7RhdGA0LDQvdC40YLRjDwvQnV0dG9uPlxuPC9tYWluPlxuIiwiPHNjcmlwdD5cbiAgICBpbXBvcnQgeyBzdGF0ZVN0b3JlIH0gZnJvbSAnLi4vc3RvcmVzL3N0YXRlYm90LmpzJztcbiAgICBjbGVhckludGVydmFsKCRzdGF0ZVN0b3JlLnRpbWVySWQpO1xuICAgIGNsZWFySW50ZXJ2YWwoJHN0YXRlU3RvcmUudGltZXJJZGxpc3QpO1xuICAgIGltcG9ydCBTZXR0IGZyb20gJy4uL2NvbXBvbmVudHMvU2V0dC5zdmVsdGUnO1xuICAgIGltcG9ydCB7IGF1dGhTdG9yZSB9IGZyb20gJy4uL3N0b3Jlcy9hdXRoJztcbiAgICBjb25zdCBwa2cgPSB7XG4gICAgICAgIHVybGhvc3Q6ICdodHRwczovLzkxLjIyOC4xMTguOTIvYmFjay8nLFxuICAgICAgICB1cmxob3N0a2V5czogJ2h0dHBzOi8vOTEuMjI4LjExOC45Mi91c2Vyc2V0dGluZ3MvJyxcbiAgICB9O1xuXG5cbjwvc2NyaXB0PlxuXG48c3R5bGU+XG5cbjwvc3R5bGU+XG5cbjxzdmVsdGU6aGVhZD5cbiAgICA8dGl0bGU+0J3QsNGB0YLRgNC+0LnQutC4PC90aXRsZT5cbjwvc3ZlbHRlOmhlYWQ+XG5cbnsjaWYgJGF1dGhTdG9yZS5zdGF0dXMgPT09ICdpbid9XG4gICAgPFNldHQgey4uLnBrZ30gLz5cbnsvaWZ9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBMkY0RCxHQUFVOzBDQUFWLEdBQVU7Ozs7Ozs7Ozs7Ozt1QkFPL0IsR0FBYTs2Q0FBYixHQUFhOzs7Ozs7Ozs7Ozs7bUJBV2MsR0FBUzt5Q0FBVCxHQUFTOzs7Ozs7Ozs7Ozs7OztzQ0FJckQsR0FBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhDQXRCMEIsR0FBVTs7Ozs7Ozs7O2lEQU8vQixHQUFhOzs7Ozs7Ozs7NkNBV2MsR0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXRHNUQsT0FBTztLQUVkLFlBQVk7S0FDWixVQUFVLEVBQUUsYUFBYSxFQUFFLFNBQVM7S0FDcEMsUUFBUSxHQUFHLE9BQU8sR0FBRyx5QkFBeUI7S0FDOUMsUUFBUSxHQUFHLE9BQU8sR0FBRyx5QkFBeUI7Q0FFbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFROztDQUNwQixPQUFPO01BQ0MsRUFBRSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRzs7UUFDdEIsR0FBRyxTQUFTLEtBQUssQ0FBQyxRQUFRO0dBQzVCLE1BQU0sRUFBRSxNQUFNO0dBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtHQUN6QixPQUFPO0lBQ0gsTUFBTSxFQUFFLG1DQUFtQztJQUMzQyxjQUFjLEVBQUUsa0JBQWtCO0lBQ2xDLDZCQUE2QixFQUFFLEdBQUc7SUFDbEMsOEJBQThCLEVBQUUsR0FBRzs7OztFQUczQyxZQUFZLFNBQVMsR0FBRyxDQUFDLElBQUk7RUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZO2tCQUN4QixVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUM7a0JBQzNCLGFBQWEsR0FBRyxZQUFZLENBQUMsQ0FBQztrQkFDOUIsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDOzs7Z0JBR2YsWUFBWTtRQUNqQixLQUFLLENBQUMsUUFBUTtHQUNoQixNQUFNLEVBQUUsTUFBTTtHQUNkLE9BQU87SUFDSCxNQUFNLEVBQUUsbUNBQW1DO0lBQzNDLGNBQWMsRUFBRSxrQkFBa0I7O0dBRXRDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVk7OztFQUVyQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxRQUFROzs7Ozs7Ozs7Ozs7O0VBZ0RrQixVQUFVOzs7OztFQU8vQixhQUFhOzs7OztFQVdjLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaEVwRSxZQUFZLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNDdEJsRSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NFQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBRFosR0FBVSxJQUFDLE1BQU0sS0FBSyxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTFCLEdBQVUsSUFBQyxNQUFNLEtBQUssSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBcEIzQixhQUFhLENBQUMsV0FBVyxDQUFDLE9BQU87Q0FDakMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxXQUFXOztPQUcvQixHQUFHO0VBQ0wsT0FBTyxFQUFFLDZCQUE2QjtFQUN0QyxXQUFXLEVBQUUscUNBQXFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
