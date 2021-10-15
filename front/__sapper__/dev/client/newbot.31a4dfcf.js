import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, T as assign, p as validate_store, r as component_subscribe, v as validate_slots, q as stateStore, z as space, e as element, A as create_component, R as query_selector_all, f as detach_dev, C as claim_space, c as claim_element, b as children, D as claim_component, h as attr_dev, j as add_location, l as insert_dev, E as mount_component, U as get_spread_update, V as get_spread_object, H as transition_in, I as transition_out, J as destroy_component } from './client.7517dff1.js';
import './TextField.f0421d27.js';
import { N as NewBot } from './NewBot.5d37c10c.js';

/* src/routes/newbot.svelte generated by Svelte v3.24.0 */
const file = "src/routes/newbot.svelte";

function create_fragment(ctx) {
	let t;
	let div;
	let newbot;
	let current;
	const newbot_spread_levels = [/*pkg*/ ctx[0]];
	let newbot_props = {};

	for (let i = 0; i < newbot_spread_levels.length; i += 1) {
		newbot_props = assign(newbot_props, newbot_spread_levels[i]);
	}

	newbot = new NewBot({ props: newbot_props, $$inline: true });

	const block = {
		c: function create() {
			t = space();
			div = element("div");
			create_component(newbot.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1y8z7i8\"]", document.head);
			head_nodes.forEach(detach_dev);
			t = claim_space(nodes);
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(newbot.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			document.title = "newbot";
			attr_dev(div, "class", "container mx-auto");
			add_location(div, file, 17, 0, 368);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
			insert_dev(target, div, anchor);
			mount_component(newbot, div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const newbot_changes = (dirty & /*pkg*/ 1)
			? get_spread_update(newbot_spread_levels, [get_spread_object(/*pkg*/ ctx[0])])
			: {};

			newbot.$set(newbot_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(newbot.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(newbot.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div);
			destroy_component(newbot);
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
	let $stateStore;
	validate_store(stateStore, "stateStore");
	component_subscribe($$self, stateStore, $$value => $$invalidate(1, $stateStore = $$value));
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Newbot> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Newbot", $$slots, []);
	$$self.$capture_state = () => ({ stateStore, NewBot, $stateStore, pkg });

	$$self.$inject_state = $$props => {
		if ("pkg" in $$props) $$invalidate(0, pkg = $$props.pkg);
	};

	let pkg;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$stateStore*/ 2) {
			 $$invalidate(0, pkg = {
				urlhost: $stateStore.urlhost,
				comission: 0.15
			});
		}
	};

	return [pkg];
}

class Newbot extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Newbot",
			options,
			id: create_fragment.name
		});
	}
}

export default Newbot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3Ym90LjMxYTRkZmNmLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL25ld2JvdC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgICBpbXBvcnQgeyBzdGF0ZVN0b3JlIH0gIGZyb20gXCIuLi9zdG9yZXMvc3RhdGVib3QuanNcIlxuICAgICAgICBpbXBvcnQgTmV3Qm90IGZyb20gJy4uL2NvbXBvbmVudHMvTmV3Qm90LnN2ZWx0ZSc7XG4gICAgY2xlYXJJbnRlcnZhbCgkc3RhdGVTdG9yZS50aW1lcklkKTtcbiAgICBjbGVhckludGVydmFsKCRzdGF0ZVN0b3JlLnRpbWVySWRsaXN0KTtcblxuXG4gICAgJDogcGtnID0ge1xuICAgICAgICB1cmxob3N0OiAkc3RhdGVTdG9yZS51cmxob3N0LFxuICAgICAgICBjb21pc3Npb246IDAuMTVcbiAgICAgICAgXG4gICAgfTtcbjwvc2NyaXB0PlxuPHN2ZWx0ZTpoZWFkPlxuICAgIDx0aXRsZT5uZXdib3Q8L3RpdGxlPlxuPC9zdmVsdGU6aGVhZD5cblxuPGRpdiBjbGFzcz1cImNvbnRhaW5lciBteC1hdXRvXCI+XG48TmV3Qm90IHsuLi5wa2d9Lz5cbjwvZGl2PlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozt1Q0FrQlksR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dFQUFILEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWZYLGFBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTztDQUNqQyxhQUFhLENBQUMsV0FBVyxDQUFDLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUdsQyxHQUFHO0lBQ0YsT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPO0lBQzVCLFNBQVMsRUFBRSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
