import { S as SvelteComponentDev, i as init, d as dispatch_dev, s as safe_not_equal, p as validate_store, r as component_subscribe, v as validate_slots, q as stateStore, z as space, e as element, x as text, R as query_selector_all, f as detach_dev, C as claim_space, c as claim_element, b as children, y as claim_text, h as attr_dev, j as add_location, l as insert_dev, m as append_dev, n as noop } from './client.ee409cf1.js';

/* src/routes/instruction.svelte generated by Svelte v3.24.0 */
const file = "src/routes/instruction.svelte";

function create_fragment(ctx) {
	let t0;
	let div;
	let h1;
	let t1;
	let t2;
	let p;
	let t3;

	const block = {
		c: function create() {
			t0 = space();
			div = element("div");
			h1 = element("h1");
			t1 = text("Инструкция");
			t2 = space();
			p = element("p");
			t3 = text("This is the 'about' page. There's not much here.");
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1ltnyc1\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			div = claim_element(nodes, "DIV", {});
			var div_nodes = children(div);
			h1 = claim_element(div_nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, "Инструкция");
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(div_nodes);
			p = claim_element(div_nodes, "P", { class: true });
			var p_nodes = children(p);
			t3 = claim_text(p_nodes, "This is the 'about' page. There's not much here.");
			p_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			document.title = "Инструкция";
			attr_dev(h1, "class", "text-2xl text-center mb-4");
			add_location(h1, file, 14, 4, 248);
			attr_dev(p, "class", "text-center");
			add_location(p, file, 16, 4, 307);
			add_location(div, file, 13, 0, 238);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, h1);
			append_dev(h1, t1);
			append_dev(div, t2);
			append_dev(div, p);
			append_dev(p, t3);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div);
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
	component_subscribe($$self, stateStore, $$value => $$invalidate(0, $stateStore = $$value));
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Instruction> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Instruction", $$slots, []);
	$$self.$capture_state = () => ({ stateStore, $stateStore });
	return [];
}

class Instruction extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Instruction",
			options,
			id: create_fragment.name
		});
	}
}

export default Instruction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb24uYmJiZDUwY2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvaW5zdHJ1Y3Rpb24uc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gICAgaW1wb3J0IHsgc3RhdGVTdG9yZSB9IGZyb20gJy4uL3N0b3Jlcy9zdGF0ZWJvdC5qcyc7XG4gICAgY2xlYXJJbnRlcnZhbCgkc3RhdGVTdG9yZS50aW1lcklkKTtcbiAgICBjbGVhckludGVydmFsKCRzdGF0ZVN0b3JlLnRpbWVySWRsaXN0KTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG5cbjwvc3R5bGU+XG5cbjxzdmVsdGU6aGVhZD5cbiAgICA8dGl0bGU+0JjQvdGB0YLRgNGD0LrRhtC40Y88L3RpdGxlPlxuPC9zdmVsdGU6aGVhZD5cbjxkaXY+XG4gICAgPGgxIGNsYXNzPVwidGV4dC0yeGwgdGV4dC1jZW50ZXIgbWItNFwiPtCY0L3RgdGC0YDRg9C60YbQuNGPPC9oMT5cblxuICAgIDxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5UaGlzIGlzIHRoZSAnYWJvdXQnIHBhZ2UuIFRoZXJlJ3Mgbm90IG11Y2ggaGVyZS48L3A+XG48L2Rpdj5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FFSSxhQUFhLENBQUMsV0FBVyxDQUFDLE9BQU87Q0FDakMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
