'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sirv = _interopDefault(require('sirv'));
var polka = _interopDefault(require('polka'));
var compression = _interopDefault(require('compression'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));

// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

const posts = [
  {
    title: "25 июля 2020 16:46 Пофиксили теневое обновление статуса бота",
    slug: "bugfix",
    html: `
			<p>Когда нажимали кнопку назад к списку ботов, страница продолжала генерировать запросы на оновление поледнего открытого бота</p>
			<p>Добавили рандомную задержку в пределах полсекунды при запуске по крону</p>
		`,
  },

  {
    title: "How to use Sapper",
    slug: "how-to-use-sapper",
    html: `
			<h2>Step one</h2>
			<p>Create a new project, using <a href='https://github.com/Rich-Harris/degit'>degit</a>:</p>

			<pre><code>npx degit "sveltejs/sapper-template#rollup" my-app
			cd my-app
			npm install # or yarn!
			npm run dev
			</code></pre>

			<h2>Step two</h2>
			<p>Go to <a href='http://localhost:3000'>localhost:3000</a>. Open <code>my-app</code> in your editor. Edit the files in the <code>src/routes</code> directory or add new ones.</p>

			<h2>Step three</h2>
			<p>...</p>

			<h2>Step four</h2>
			<p>Resist overdone joke formats.</p>
		`,
  },

  {
    title: "Why the name?",
    slug: "why-the-name",
    html: `
			<p>In war, the soldiers who build bridges, repair roads, clear minefields and conduct demolitions — all under combat conditions — are known as <em>sappers</em>.</p>

			<p>For web developers, the stakes are generally lower than those for combat engineers. But we face our own hostile environment: underpowered devices, poor network connections, and the complexity inherent in front-end engineering. Sapper, which is short for <strong>S</strong>velte <strong>app</strong> mak<strong>er</strong>, is your courageous and dutiful ally.</p>
		`,
  },

  {
    title: "How is Sapper different from Next.js?",
    slug: "how-is-sapper-different-from-next",
    html: `
			<p><a href='https://github.com/zeit/next.js'>Next.js</a> is a React framework from <a href='https://vercel.com/'>Vercel</a>, and is the inspiration for Sapper. There are a few notable differences, however:</p>

			<ul>
				<li>It's powered by <a href='https://svelte.dev'>Svelte</a> instead of React, so it's faster and your apps are smaller</li>
				<li>Instead of route masking, we encode route parameters in filenames. For example, the page you're looking at right now is <code>src/routes/blog/[slug].svelte</code></li>
				<li>As well as pages (Svelte components, which render on server or client), you can create <em>server routes</em> in your <code>routes</code> directory. These are just <code>.js</code> files that export functions corresponding to HTTP methods, and receive Express <code>request</code> and <code>response</code> objects as arguments. This makes it very easy to, for example, add a JSON API such as the one <a href='blog/how-is-sapper-different-from-next.json'>powering this very page</a></li>
				<li>Links are just <code>&lt;a&gt;</code> elements, rather than framework-specific <code>&lt;Link&gt;</code> components. That means, for example, that <a href='blog/how-can-i-get-involved'>this link right here</a>, despite being inside a blob of HTML, works with the router as you'd expect.</li>
			</ul>
		`,
  },

  {
    title: "How can I get involved?",
    slug: "how-can-i-get-involved",
    html: `
			<p>We're so glad you asked! Come on over to the <a href='https://github.com/sveltejs/svelte'>Svelte</a> and <a href='https://github.com/sveltejs/sapper'>Sapper</a> repos, and join us in the <a href='https://svelte.dev/chat'>Discord chatroom</a>. Everyone is welcome, especially you!</p>
		`,
  },
];

posts.forEach((post) => {
  post.html = post.html.replace(/^\t{3}/gm, "");
});

const contents = JSON.stringify(
  posts.map((post) => {
    return {
      title: post.title,
      slug: post.slug,
    };
  })
);

function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(contents);
}

var route_0 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get
});

const lookup = new Map();
posts.forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});

function get$1(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  const { slug } = req.params;

  if (lookup.has(slug)) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(lookup.get(slug));
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}

var route_1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get$1
});

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const stateStore = writable({ rout: "botlist", 
                                    showmenu: false,
                                    selectbotname: "",
                                    urlhost: "http://dev.ti-robots.ru:1880/",
                                    darkmodestatus: true,
                                    timerId: "",
                                    timerIdlist: ""});

/* node_modules/smelte/src/components/Ripple/Ripple.svelte generated by Svelte v3.24.0 */

const css = {
	code: ".ripple.svelte-1o8z87d{position:absolute !important}",
	map: "{\"version\":3,\"file\":\"Ripple.svelte\",\"sources\":[\"Ripple.svelte\"],\"sourcesContent\":[\"<script>\\n  export let color = \\\"primary\\\";\\n  export let noHover = false;\\n  import createRipple from \\\"../Ripple/ripple.js\\\";\\n\\n  $: ripple = createRipple(color, true);\\n  $: hoverClass = `hover:bg-${color}-transLight`;\\n</script>\\n\\n<style>\\n  .ripple {\\n    position: absolute !important;\\n  }\\n</style>\\n\\n<span\\n  use:ripple\\n  class=\\\"z-40 {$$props.class} p-2 rounded-full flex items-center justify-center top-0 left-0 {noHover ? \\\"\\\" : hoverClass}\\\">\\n  <slot />\\n</span>\\n\"],\"names\":[],\"mappings\":\"AAUE,OAAO,eAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAAC,UAAU,AAC/B,CAAC\"}"
};

const Ripple = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { color = "primary" } = $$props;
	let { noHover = false } = $$props;
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.noHover === void 0 && $$bindings.noHover && noHover !== void 0) $$bindings.noHover(noHover);
	$$result.css.add(css);
	let hoverClass = `hover:bg-${color}-transLight`;
	return `<span class="${"z-40 " + escape($$props.class) + " p-2 rounded-full flex items-center justify-center top-0 left-0 " + escape(noHover ? "" : hoverClass) + " svelte-1o8z87d"}">${$$slots.default ? $$slots.default({}) : ``}</span>`;
});

const noDepth = ["white", "black", "transparent"];

function getClass(prop, color, depth, defaultDepth) {
  if (noDepth.includes(color)) {
    return `${prop}-${color}`;
  }
  return `${prop}-${color}-${depth || defaultDepth} `;
}

function utils(color, defaultDepth = 500) {
  return {
    bg: depth => getClass("bg", color, depth, defaultDepth),
    border: depth => getClass("border", color, depth, defaultDepth),
    txt: depth => getClass("text", color, depth, defaultDepth),
    caret: depth => getClass("caret", color, depth, defaultDepth)
  };
}

class ClassBuilder {
  constructor(classes, defaultClasses) {
    this.defaults =
      (typeof classes === "function" ? classes(defaultClasses) : classes) ||
      defaultClasses;

    this.classes = this.defaults;
  }

  flush() {
    this.classes = this.defaults;

    return this;
  }

  extend(...fns) {
    return this;
  }

  get() {
    return this.classes;
  }

  replace(classes, cond = true) {
    if (cond && classes) {
      this.classes = Object.keys(classes).reduce(
        (acc, from) => acc.replace(new RegExp(from, "g"), classes[from]),
        this.classes
      );
    }

    return this;
  }

  remove(classes, cond = true) {
    if (cond && classes) {
      this.classes = classes
        .split(" ")
        .reduce(
          (acc, cur) => acc.replace(new RegExp(cur, "g"), ""),
          this.classes
        );
    }

    return this;
  }

  add(className, cond = true, defaultValue) {
    if (!cond || !className) return this;

    switch (typeof className) {
      case "string":
      default:
        this.classes += ` ${className} `;
        return this;
      case "function":
        this.classes += ` ${className(defaultValue || this.classes)} `;
        return this;
    }
  }
}

function filterProps(reserved, props) {

  return Object.keys(props).reduce(
    (acc, cur) =>
      cur.includes("$$") || cur.includes("Class") || reserved.includes(cur)
        ? acc
        : { ...acc, [cur]: props[cur] },
    {}
  );
}

/* node_modules/smelte/src/components/Switch/Switch.svelte generated by Svelte v3.24.0 */
const trackClassesDefault = "relative w-10 h-auto z-0 rounded-full overflow-visible flex items-center justify-center";
const thumbClassesDefault = "rounded-full p-2 w-5 h-5 absolute elevation-3 duration-100";
const labelClassesDefault = "pl-2 cursor-pointer";

const Switch = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const classesDefault = `inline-flex items-center mb-2 cursor-pointer z-10`;
	let { value = false } = $$props;
	let { label = "" } = $$props;
	let { color = "primary" } = $$props;
	let { disabled = false } = $$props;
	let { trackClasses = trackClassesDefault } = $$props;
	let { thumbClasses = thumbClassesDefault } = $$props;
	let { labelClasses = labelClassesDefault } = $$props;
	let { classes = classesDefault } = $$props;
	const cb = new ClassBuilder(classes, classesDefault);
	const trcb = new ClassBuilder(trackClasses, trackClassesDefault);
	const thcb = new ClassBuilder(thumbClasses, thumbClassesDefault);
	const lcb = new ClassBuilder(labelClasses, labelClassesDefault);

	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.trackClasses === void 0 && $$bindings.trackClasses && trackClasses !== void 0) $$bindings.trackClasses(trackClasses);
	if ($$props.thumbClasses === void 0 && $$bindings.thumbClasses && thumbClasses !== void 0) $$bindings.thumbClasses(thumbClasses);
	if ($$props.labelClasses === void 0 && $$bindings.labelClasses && labelClasses !== void 0) $$bindings.labelClasses(labelClasses);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	let c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
	let tr = trcb.flush().add("bg-gray-700", !value).add(`bg-${color}-200`, value).add(trackClasses, true, trackClassesDefault).get();
	let th = thcb.flush().add(thumbClasses, true, thumbClassesDefault).add("bg-white left-0", !value).add(`bg-${color}-400`, value).get();
	let l = lcb.flush().add(labelClasses, true, labelClassesDefault).add("text-gray-500", disabled).add("text-gray-700", !disabled).get();

	return `<div${add_attribute("class", c, 0)}><input class="${"hidden"}" type="${"checkbox"}"${add_attribute("value", value, 1)}>
  <div${add_attribute("class", tr, 0)}><div class="${"w-full h-full absolute"}"></div>
    ${validate_component(Ripple, "Ripple").$$render(
		$$result,
		{
			color: value && !disabled ? color : "gray",
			noHover: true
		},
		{},
		{
			default: () => `<div${add_attribute("class", th, 0)}${add_attribute("style", value ? "left: 1.25rem" : "", 0)}></div>`
		}
	)}</div>
  <label aria-hidden="${"true"}"${add_attribute("class", l, 0)}>${escape(label)}</label></div>`;
});

/* node_modules/smelte/src/components/Icon/Icon.svelte generated by Svelte v3.24.0 */

const css$1 = {
	code: ".reverse.svelte-zzky5a{transform:rotate(180deg)}.tip.svelte-zzky5a{transform:rotate(90deg)}",
	map: "{\"version\":3,\"file\":\"Icon.svelte\",\"sources\":[\"Icon.svelte\"],\"sourcesContent\":[\"<script>\\n\\n\\n  export let small = false;\\n  export let xs = false;\\n  export let reverse = false;\\n  export let tip = false;\\n  export let color = \\\"default\\\";\\n</script>\\n\\n<style>\\n  .reverse {\\n    transform: rotate(180deg);\\n  }\\n\\n  .tip {\\n    transform: rotate(90deg);\\n  }\\n</style>\\n\\n<i\\n  aria-hidden=\\\"true\\\"\\n  class=\\\"material-icons icon text-xl {$$props.class} duration-200 ease-in\\\"\\n  class:reverse\\n  class:tip\\n  on:click\\n  class:text-base={small}\\n  class:text-xs={xs}\\n  style={color ? `color: ${color}` : ''}>\\n  <slot />\\n</i>\\n\"],\"names\":[],\"mappings\":\"AAWE,QAAQ,cAAC,CAAC,AACR,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,SAAS,CAAE,OAAO,KAAK,CAAC,AAC1B,CAAC\"}"
};

const Icon = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { small = false } = $$props;
	let { xs = false } = $$props;
	let { reverse = false } = $$props;
	let { tip = false } = $$props;
	let { color = "default" } = $$props;
	if ($$props.small === void 0 && $$bindings.small && small !== void 0) $$bindings.small(small);
	if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0) $$bindings.xs(xs);
	if ($$props.reverse === void 0 && $$bindings.reverse && reverse !== void 0) $$bindings.reverse(reverse);
	if ($$props.tip === void 0 && $$bindings.tip && tip !== void 0) $$bindings.tip(tip);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	$$result.css.add(css$1);

	return `<i aria-hidden="${"true"}" class="${[
		"material-icons icon text-xl " + escape($$props.class) + " duration-200 ease-in" + " svelte-zzky5a",
		(reverse ? "reverse" : "") + " " + (tip ? "tip" : "") + " " + (small ? "text-base" : "") + " " + (xs ? "text-xs" : "")
	].join(" ").trim()}"${add_attribute("style", color ? `color: ${color}` : "", 0)}>${$$slots.default ? $$slots.default({}) : ``}</i>`;
});

/* node_modules/smelte/src/components/TextField/Label.svelte generated by Svelte v3.24.0 */

const css$2 = {
	code: ".label-top.svelte-r33x2y{line-height:0.05}.label-transition.svelte-r33x2y{transition:font-size 0.05s, line-height 0.1s}label.text-xs{font-size:0.7rem}",
	map: "{\"version\":3,\"file\":\"Label.svelte\",\"sources\":[\"Label.svelte\"],\"sourcesContent\":[\"<script>\\n  import utils, { ClassBuilder, filterProps } from \\\"../../utils/classes.js\\\";\\n\\n\\n\\n  export let focused = false;\\n  export let error = false;\\n  export let outlined = false;\\n  export let labelOnTop = false;\\n  export let prepend = false;\\n  export let color = \\\"primary\\\";\\n  // for outlined button label\\n  export let bgColor = \\\"white\\\";\\n  export let dense = false;\\n\\n  let labelDefault = `pt-4 absolute top-0 label-transition block pb-2 px-4 pointer-events-none cursor-text`;\\n\\n  export let add = \\\"\\\";\\n  export let remove = \\\"\\\";\\n  export let replace = \\\"\\\";\\n\\n  export let labelClasses = labelDefault;\\n\\n  const {\\n    bg,\\n    border,\\n    txt,\\n    caret,\\n  } = utils(color);\\n\\n  const l = new ClassBuilder(labelClasses, labelDefault);\\n\\n  let lClasses = i => i;\\n\\n  $: lClasses = l\\n      .flush()\\n      .add(txt(), focused && !error)\\n      .add('text-error-500', focused && error)\\n      .add('label-top text-xs', labelOnTop)\\n      .add('text-xs', focused)\\n      .remove('pt-4 pb-2 px-4 px-1 pt-0', labelOnTop && outlined)\\n      .add(`ml-3 p-1 pt-0 mt-0 bg-${bgColor} dark:bg-dark-500`, labelOnTop && outlined)\\n      .remove('px-4', prepend)\\n      .add('pr-4 pl-10', prepend)\\n      .remove('pt-4', dense)\\n      .add('pt-3', dense)\\n      .add(add)\\n      .remove(remove)\\n      .replace(replace)\\n      .get();\\n\\n  const props = filterProps([\\n    'focused',\\n    'error',\\n    'outlined',\\n    'labelOnTop',\\n    'prepend',\\n    'color',\\n    'dense'\\n  ], $$props);\\n</script>\\n\\n<style>\\n.label-top {\\n  line-height: 0.05;\\n}\\n.label-transition {\\n  transition: font-size 0.05s, line-height 0.1s;\\n}\\n:global(label.text-xs) {\\n  font-size: 0.7rem;\\n}\\n</style>\\n\\n<label class=\\\"{lClasses} {$$props.class}\\\" {...props}>\\n  <slot />\\n</label>\\n\"],\"names\":[],\"mappings\":\"AA+DA,UAAU,cAAC,CAAC,AACV,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,iBAAiB,cAAC,CAAC,AACjB,UAAU,CAAE,SAAS,CAAC,KAAK,CAAC,CAAC,WAAW,CAAC,IAAI,AAC/C,CAAC,AACO,aAAa,AAAE,CAAC,AACtB,SAAS,CAAE,MAAM,AACnB,CAAC\"}"
};

const Label = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { focused = false } = $$props;
	let { error = false } = $$props;
	let { outlined = false } = $$props;
	let { labelOnTop = false } = $$props;
	let { prepend = false } = $$props;
	let { color = "primary" } = $$props;
	let { bgColor = "white" } = $$props;
	let { dense = false } = $$props;
	let labelDefault = `pt-4 absolute top-0 label-transition block pb-2 px-4 pointer-events-none cursor-text`;
	let { add = "" } = $$props;
	let { remove = "" } = $$props;
	let { replace = "" } = $$props;
	let { labelClasses = labelDefault } = $$props;
	const { bg, border, txt, caret } = utils(color);
	const l = new ClassBuilder(labelClasses, labelDefault);
	let lClasses = i => i;
	const props = filterProps(["focused", "error", "outlined", "labelOnTop", "prepend", "color", "dense"], $$props);
	if ($$props.focused === void 0 && $$bindings.focused && focused !== void 0) $$bindings.focused(focused);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.outlined === void 0 && $$bindings.outlined && outlined !== void 0) $$bindings.outlined(outlined);
	if ($$props.labelOnTop === void 0 && $$bindings.labelOnTop && labelOnTop !== void 0) $$bindings.labelOnTop(labelOnTop);
	if ($$props.prepend === void 0 && $$bindings.prepend && prepend !== void 0) $$bindings.prepend(prepend);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.bgColor === void 0 && $$bindings.bgColor && bgColor !== void 0) $$bindings.bgColor(bgColor);
	if ($$props.dense === void 0 && $$bindings.dense && dense !== void 0) $$bindings.dense(dense);
	if ($$props.add === void 0 && $$bindings.add && add !== void 0) $$bindings.add(add);
	if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0) $$bindings.remove(remove);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.labelClasses === void 0 && $$bindings.labelClasses && labelClasses !== void 0) $$bindings.labelClasses(labelClasses);
	$$result.css.add(css$2);
	lClasses = l.flush().add(txt(), focused && !error).add("text-error-500", focused && error).add("label-top text-xs", labelOnTop).add("text-xs", focused).remove("pt-4 pb-2 px-4 px-1 pt-0", labelOnTop && outlined).add(`ml-3 p-1 pt-0 mt-0 bg-${bgColor} dark:bg-dark-500`, labelOnTop && outlined).remove("px-4", prepend).add("pr-4 pl-10", prepend).remove("pt-4", dense).add("pt-3", dense).add(add).remove(remove).replace(replace).get();

	return `<label${spread(
		[
			{
				class: escape(lClasses) + " " + escape($$props.class)
			},
			props
		],
		"svelte-r33x2y"
	)}>${$$slots.default ? $$slots.default({}) : ``}</label>`;
});

function quadIn(t) {
    return t * t;
}
function quadOut(t) {
    return -t * (t - 2.0);
}

/* node_modules/smelte/src/components/TextField/Hint.svelte generated by Svelte v3.24.0 */
let classesDefault = "text-xs py-1 pl-4 absolute bottom-1 left-0";

const Hint = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { error = false } = $$props;
	let { hint = "" } = $$props;
	let { add = "" } = $$props;
	let { remove = "" } = $$props;
	let { replace = "" } = $$props;
	let { transitionProps = { y: -10, duration: 100, easing: quadOut } } = $$props;
	const l = new ClassBuilder($$props.class, classesDefault);
	const props = filterProps(["error", "hint"], $$props);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.hint === void 0 && $$bindings.hint && hint !== void 0) $$bindings.hint(hint);
	if ($$props.add === void 0 && $$bindings.add && add !== void 0) $$bindings.add(add);
	if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0) $$bindings.remove(remove);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.transitionProps === void 0 && $$bindings.transitionProps && transitionProps !== void 0) $$bindings.transitionProps(transitionProps);
	let classes = l.flush().add("text-error-500", error).add("text-gray-600", hint).add(add).remove(remove).replace(replace).get();

	return `<div${add_attribute("class", classes, 0)}>${escape(hint || "")}
  ${escape(error || "")}</div>`;
});

/* node_modules/smelte/src/components/TextField/Underline.svelte generated by Svelte v3.24.0 */

const css$3 = {
	code: ".line.svelte-xd9zs6{height:1px}",
	map: "{\"version\":3,\"file\":\"Underline.svelte\",\"sources\":[\"Underline.svelte\"],\"sourcesContent\":[\"<script>\\n  import utils, { ClassBuilder, filterProps } from \\\"../../utils/classes.js\\\";\\n\\n\\n\\n  export let noUnderline = false;\\n  export let outlined = false;\\n  export let focused = false;\\n  export let error = false;\\n  export let color = \\\"primary\\\";\\n\\n  let defaultClasses = `mx-auto w-0`;\\n\\n  export let add = \\\"\\\";\\n  export let remove = \\\"\\\";\\n  export let replace = \\\"\\\";\\n\\n  export let lineClasses = defaultClasses;\\n\\n  const {\\n    bg,\\n    border,\\n    txt,\\n    caret,\\n  } = utils(color);\\n\\n  const l = new ClassBuilder(lineClasses, defaultClasses);\\n\\n  let Classes = i => i;\\n\\n  $: classes = l\\n      .flush()\\n      .add(txt(), focused && !error)\\n      .add('bg-error-500', error)\\n      .add('w-full', focused || error)\\n      .add(bg(), focused)\\n      .add(add)\\n      .remove(remove)\\n      .replace(replace)\\n      .get();\\n\\n  const props = filterProps([\\n    'focused',\\n    'error',\\n    'outlined',\\n    'labelOnTop',\\n    'prepend',\\n    'bgcolor',\\n    'color'\\n  ], $$props);\\n</script>\\n\\n<style>\\n.line {\\n  height: 1px;\\n}\\n</style>\\n\\n<div\\n  class=\\\"line absolute bottom-0 left-0 w-full bg-gray-600 {$$props.class}\\\"\\n  class:hidden={noUnderline || outlined}>\\n  <div\\n    class=\\\"{classes}\\\"\\n    style=\\\"height: 2px; transition: width .2s ease\\\" />\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAqDA,KAAK,cAAC,CAAC,AACL,MAAM,CAAE,GAAG,AACb,CAAC\"}"
};

const Underline = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { noUnderline = false } = $$props;
	let { outlined = false } = $$props;
	let { focused = false } = $$props;
	let { error = false } = $$props;
	let { color = "primary" } = $$props;
	let defaultClasses = `mx-auto w-0`;
	let { add = "" } = $$props;
	let { remove = "" } = $$props;
	let { replace = "" } = $$props;
	let { lineClasses = defaultClasses } = $$props;
	const { bg, border, txt, caret } = utils(color);
	const l = new ClassBuilder(lineClasses, defaultClasses);
	const props = filterProps(["focused", "error", "outlined", "labelOnTop", "prepend", "bgcolor", "color"], $$props);
	if ($$props.noUnderline === void 0 && $$bindings.noUnderline && noUnderline !== void 0) $$bindings.noUnderline(noUnderline);
	if ($$props.outlined === void 0 && $$bindings.outlined && outlined !== void 0) $$bindings.outlined(outlined);
	if ($$props.focused === void 0 && $$bindings.focused && focused !== void 0) $$bindings.focused(focused);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.add === void 0 && $$bindings.add && add !== void 0) $$bindings.add(add);
	if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0) $$bindings.remove(remove);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.lineClasses === void 0 && $$bindings.lineClasses && lineClasses !== void 0) $$bindings.lineClasses(lineClasses);
	$$result.css.add(css$3);
	let classes = l.flush().add(txt(), focused && !error).add("bg-error-500", error).add("w-full", focused || error).add(bg(), focused).add(add).remove(remove).replace(replace).get();

	return `<div class="${[
		"line absolute bottom-0 left-0 w-full bg-gray-600 " + escape($$props.class) + " svelte-xd9zs6",
		noUnderline || outlined ? "hidden" : ""
	].join(" ").trim()}"><div class="${escape(null_to_empty(classes)) + " svelte-xd9zs6"}" style="${"height: 2px; transition: width .2s ease"}"></div></div>`;
});

/* node_modules/smelte/src/components/TextField/TextField.svelte generated by Svelte v3.24.0 */
const classesDefault$1 = "mt-2 mb-6 relative text-gray-600 dark:text-gray-100";
const appendDefault = "absolute right-0 top-0 pb-2 pr-4 pt-4 text-gray-700 z-10";
const prependDefault = "absolute left-0 top-0 pb-2 pl-2 pt-4 text-xs text-gray-700 z-10";

const TextField = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { outlined = false } = $$props;
	let { value = null } = $$props;
	let { label = "" } = $$props;
	let { placeholder = "" } = $$props;
	let { hint = "" } = $$props;
	let { error = false } = $$props;
	let { append = "" } = $$props;
	let { prepend = "" } = $$props;
	let { persistentHint = false } = $$props;
	let { textarea = false } = $$props;
	let { rows = 5 } = $$props;
	let { select = false } = $$props;
	let { dense = false } = $$props;
	let { autocomplete = false } = $$props;
	let { noUnderline = false } = $$props;
	let { appendReverse = false } = $$props;
	let { prependReverse = false } = $$props;
	let { color = "primary" } = $$props;
	let { bgColor = "white" } = $$props;
	let { iconClass = "" } = $$props;
	let { disabled = false } = $$props;
	const inputDefault = `duration-200 ease-in pb-2 pt-6 px-4 rounded-t text-black dark:text-gray-100 w-full`;
	let { add = "" } = $$props;
	let { remove = "" } = $$props;
	let { replace = "" } = $$props;
	let { inputClasses = inputDefault } = $$props;
	let { classes = classesDefault$1 } = $$props;
	let { appendClasses = appendDefault } = $$props;
	let { prependClasses = prependDefault } = $$props;
	const { bg, border, txt, caret } = utils(color);
	const cb = new ClassBuilder(inputClasses, inputDefault);
	const ccb = new ClassBuilder(classes, classesDefault$1);
	const acb = new ClassBuilder(appendClasses, appendDefault);
	const pcb = new ClassBuilder(prependClasses, prependDefault);

	let { extend = () => {
		
	} } = $$props;

	let { focused = false } = $$props;
	let wClasses = i => i;
	let aClasses = i => i;
	let pClasses = i => i;

	const props = filterProps(
		[
			"outlined",
			"label",
			"placeholder",
			"hint",
			"error",
			"append",
			"prepend",
			"persistentHint",
			"textarea",
			"rows",
			"select",
			"autocomplete",
			"noUnderline",
			"appendReverse",
			"prependReverse",
			"color",
			"bgColor",
			"disabled",
			"replace",
			"remove",
			"small"
		],
		$$props
	);

	const dispatch = createEventDispatcher();
	if ($$props.outlined === void 0 && $$bindings.outlined && outlined !== void 0) $$bindings.outlined(outlined);
	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
	if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
	if ($$props.hint === void 0 && $$bindings.hint && hint !== void 0) $$bindings.hint(hint);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.append === void 0 && $$bindings.append && append !== void 0) $$bindings.append(append);
	if ($$props.prepend === void 0 && $$bindings.prepend && prepend !== void 0) $$bindings.prepend(prepend);
	if ($$props.persistentHint === void 0 && $$bindings.persistentHint && persistentHint !== void 0) $$bindings.persistentHint(persistentHint);
	if ($$props.textarea === void 0 && $$bindings.textarea && textarea !== void 0) $$bindings.textarea(textarea);
	if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0) $$bindings.rows(rows);
	if ($$props.select === void 0 && $$bindings.select && select !== void 0) $$bindings.select(select);
	if ($$props.dense === void 0 && $$bindings.dense && dense !== void 0) $$bindings.dense(dense);
	if ($$props.autocomplete === void 0 && $$bindings.autocomplete && autocomplete !== void 0) $$bindings.autocomplete(autocomplete);
	if ($$props.noUnderline === void 0 && $$bindings.noUnderline && noUnderline !== void 0) $$bindings.noUnderline(noUnderline);
	if ($$props.appendReverse === void 0 && $$bindings.appendReverse && appendReverse !== void 0) $$bindings.appendReverse(appendReverse);
	if ($$props.prependReverse === void 0 && $$bindings.prependReverse && prependReverse !== void 0) $$bindings.prependReverse(prependReverse);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.bgColor === void 0 && $$bindings.bgColor && bgColor !== void 0) $$bindings.bgColor(bgColor);
	if ($$props.iconClass === void 0 && $$bindings.iconClass && iconClass !== void 0) $$bindings.iconClass(iconClass);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.add === void 0 && $$bindings.add && add !== void 0) $$bindings.add(add);
	if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0) $$bindings.remove(remove);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.inputClasses === void 0 && $$bindings.inputClasses && inputClasses !== void 0) $$bindings.inputClasses(inputClasses);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	if ($$props.appendClasses === void 0 && $$bindings.appendClasses && appendClasses !== void 0) $$bindings.appendClasses(appendClasses);
	if ($$props.prependClasses === void 0 && $$bindings.prependClasses && prependClasses !== void 0) $$bindings.prependClasses(prependClasses);
	if ($$props.extend === void 0 && $$bindings.extend && extend !== void 0) $$bindings.extend(extend);
	if ($$props.focused === void 0 && $$bindings.focused && focused !== void 0) $$bindings.focused(focused);
	let showHint = error || (persistentHint ? hint : focused && hint);
	let labelOnTop = placeholder || focused || (value || value === 0);
	let iClasses = cb.flush().remove("pt-6 pb-2", outlined).add("border rounded bg-transparent py-4 duration-200 ease-in", outlined).add("border-error-500 caret-error-500", error).remove(caret(), error).add(caret(), !error).add(border(), focused && !error).add("border-gray-600", !error && !focused).add("bg-gray-100 dark:bg-dark-600", !outlined).add("bg-gray-300 dark:bg-dark-200", focused && !outlined).remove("px-4", prepend).add("pr-4 pl-10", prepend).add(add).remove("pt-6 pb-2", dense && !outlined).add("pt-4 pb-1", dense && !outlined).remove("bg-gray-100", disabled).add("bg-gray-50", disabled).add("cursor-pointer", select && !autocomplete).add($$props.class).remove(remove).replace(replace).extend(extend).get();
	wClasses = ccb.flush().add("select", select || autocomplete).add("dense", dense && !outlined).remove("mb-6 mt-2", dense && !outlined).add("mb-4 mt-1", dense).replace({ "text-gray-600": "text-error-500" }, error).add("text-gray-200", disabled).get();
	aClasses = acb.flush().get();
	pClasses = pcb.flush().get();

	return `<div${add_attribute("class", wClasses, 0)}>${label
	? `${$$slots.label
		? $$slots.label({})
		: `
    ${validate_component(Label, "Label").$$render(
				$$result,
				{
					labelOnTop,
					focused,
					error,
					outlined,
					prepend,
					color,
					bgColor,
					dense: dense && !outlined
				},
				{},
				{ default: () => `${escape(label)}` }
			)}
  `}`
	: ``}

  ${!textarea && !select || autocomplete
	? `<input${spread([
			{ "aria-label": escape(label) },
			props,
			{ class: escape(iClasses) },
			{ disabled: disabled || null },
			{
				placeholder: escape(!value ? placeholder : "")
			}
		])}${add_attribute("value", value, 1)}>`
	: `${textarea && !select
		? `<textarea${spread([
				{ rows: escape(rows) },
				{ class: escape(iClasses) },
				{ disabled: disabled || null },
				{ "aria-label": escape(label) },
				props,
				{
					placeholder: escape(!value ? placeholder : "")
				}
			])}>${value || ""}</textarea>`
		: `${select && !autocomplete
			? `<input readonly${add_attribute("class", iClasses, 0)} ${disabled ? "disabled" : ""}${add_attribute("value", value, 0)}>`
			: ``}`}`}

  ${append
	? `<div${add_attribute("class", aClasses, 0)}>${$$slots.append
		? $$slots.append({})
		: `
        ${validate_component(Icon, "Icon").$$render(
				$$result,
				{
					reverse: appendReverse,
					class: (focused ? txt() : "") + " " + iconClass
				},
				{},
				{ default: () => `${escape(append)}` }
			)}
      `}</div>`
	: ``}

  ${prepend
	? `<div${add_attribute("class", pClasses, 0)}>${$$slots.prepend
		? $$slots.prepend({})
		: `
        ${validate_component(Icon, "Icon").$$render(
				$$result,
				{
					reverse: prependReverse,
					class: (focused ? txt() : "") + " " + iconClass
				},
				{},
				{ default: () => `${escape(prepend)}` }
			)}
      `}</div>`
	: ``}

  ${validate_component(Underline, "Underline").$$render($$result, { noUnderline, outlined, focused, error }, {}, {})}

  ${showHint
	? `${validate_component(Hint, "Hint").$$render($$result, { error, hint }, {}, {})}`
	: ``}</div>`;
});

/* node_modules/smelte/src/components/Button/Button.svelte generated by Svelte v3.24.0 */
const classesDefault$2 = "py-2 px-4 uppercase text-sm font-medium relative overflow-hidden";
const basicDefault = "text-white duration-200 ease-in";
const outlinedDefault = "bg-transparent border border-solid";
const textDefault = "bg-transparent border-none px-4 hover:bg-transparent";
const iconDefault = "p-4 flex items-center select-none";
const fabDefault = "hover:bg-transparent";
const smallDefault = "pt-1 pb-1 pl-2 pr-2 text-xs";
const disabledDefault = "bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default";
const elevationDefault = "hover:elevation-5 elevation-3";

const Button = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { value = false } = $$props;
	let { outlined = false } = $$props;
	let { text = false } = $$props;
	let { block = false } = $$props;
	let { disabled = false } = $$props;
	let { icon = null } = $$props;
	let { small = false } = $$props;
	let { light = false } = $$props;
	let { dark = false } = $$props;
	let { flat = false } = $$props;
	let { iconClass = "" } = $$props;
	let { color = "primary" } = $$props;
	let { href = null } = $$props;
	let { fab = false } = $$props;
	let { remove = "" } = $$props;
	let { add = "" } = $$props;
	let { replace = {} } = $$props;
	let { classes = classesDefault$2 } = $$props;
	let { basicClasses = basicDefault } = $$props;
	let { outlinedClasses = outlinedDefault } = $$props;
	let { textClasses = textDefault } = $$props;
	let { iconClasses = iconDefault } = $$props;
	let { fabClasses = fabDefault } = $$props;
	let { smallClasses = smallDefault } = $$props;
	let { disabledClasses = disabledDefault } = $$props;
	let { elevationClasses = elevationDefault } = $$props;
	fab = fab || text && icon;
	const basic = !outlined && !text && !fab;
	const elevation = (basic || icon) && !disabled && !flat && !text;
	let iClasses = i => i;
	let shade = 0;
	const { bg, border, txt } = utils(color);
	const cb = new ClassBuilder(classes, classesDefault$2);
	let iconCb;

	if (icon) {
		iconCb = new ClassBuilder(iconClass);
	}

	const props = filterProps(
		[
			"outlined",
			"text",
			"color",
			"block",
			"disabled",
			"icon",
			"small",
			"light",
			"dark",
			"flat",
			"add",
			"remove",
			"replace"
		],
		$$props
	);

	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.outlined === void 0 && $$bindings.outlined && outlined !== void 0) $$bindings.outlined(outlined);
	if ($$props.text === void 0 && $$bindings.text && text !== void 0) $$bindings.text(text);
	if ($$props.block === void 0 && $$bindings.block && block !== void 0) $$bindings.block(block);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
	if ($$props.small === void 0 && $$bindings.small && small !== void 0) $$bindings.small(small);
	if ($$props.light === void 0 && $$bindings.light && light !== void 0) $$bindings.light(light);
	if ($$props.dark === void 0 && $$bindings.dark && dark !== void 0) $$bindings.dark(dark);
	if ($$props.flat === void 0 && $$bindings.flat && flat !== void 0) $$bindings.flat(flat);
	if ($$props.iconClass === void 0 && $$bindings.iconClass && iconClass !== void 0) $$bindings.iconClass(iconClass);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.href === void 0 && $$bindings.href && href !== void 0) $$bindings.href(href);
	if ($$props.fab === void 0 && $$bindings.fab && fab !== void 0) $$bindings.fab(fab);
	if ($$props.remove === void 0 && $$bindings.remove && remove !== void 0) $$bindings.remove(remove);
	if ($$props.add === void 0 && $$bindings.add && add !== void 0) $$bindings.add(add);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	if ($$props.basicClasses === void 0 && $$bindings.basicClasses && basicClasses !== void 0) $$bindings.basicClasses(basicClasses);
	if ($$props.outlinedClasses === void 0 && $$bindings.outlinedClasses && outlinedClasses !== void 0) $$bindings.outlinedClasses(outlinedClasses);
	if ($$props.textClasses === void 0 && $$bindings.textClasses && textClasses !== void 0) $$bindings.textClasses(textClasses);
	if ($$props.iconClasses === void 0 && $$bindings.iconClasses && iconClasses !== void 0) $$bindings.iconClasses(iconClasses);
	if ($$props.fabClasses === void 0 && $$bindings.fabClasses && fabClasses !== void 0) $$bindings.fabClasses(fabClasses);
	if ($$props.smallClasses === void 0 && $$bindings.smallClasses && smallClasses !== void 0) $$bindings.smallClasses(smallClasses);
	if ($$props.disabledClasses === void 0 && $$bindings.disabledClasses && disabledClasses !== void 0) $$bindings.disabledClasses(disabledClasses);
	if ($$props.elevationClasses === void 0 && $$bindings.elevationClasses && elevationClasses !== void 0) $$bindings.elevationClasses(elevationClasses);

	 {
		{
			shade = light ? 200 : 0;
			shade = dark ? -400 : shade;
		}
	}

	let normal = 500 - shade;
	let lighter = 400 - shade;
	classes = cb.flush().add(basicClasses, basic, basicDefault).add(`${bg(normal)} hover:${bg(lighter)}`, basic).add(elevationClasses, elevation, elevationDefault).add(outlinedClasses, outlined, outlinedDefault).add(`${border(lighter)} ${txt(normal)} hover:${bg("trans")} dark-hover:${bg("transDark")}`, outlined).add(`${txt(lighter)}`, text).add(textClasses, text, textDefault).add(iconClasses, icon, iconDefault).remove("py-2", icon).remove(txt(lighter), fab).add(disabledClasses, disabled, disabledDefault).add(smallClasses, small, smallDefault).add("flex items-center justify-center h-8 w-8", small && icon).add("border-solid", outlined).add("rounded-full", icon).add("w-full", block).add("rounded", basic || outlined || text).add("button", !icon).add(fabClasses, fab, fabDefault).add(`hover:${bg("transLight")}`, fab).add($$props.class).remove(remove).replace(replace).add(add).get();

	 {
		if (iconCb) {
			iClasses = iconCb.flush().add(txt(), fab && !iconClass).get();
		}
	}

	return `${href
	? `<a${spread([{ href: escape(href) }, props])}><button${spread([{ class: escape(classes) }, props, { disabled: disabled || null }])}>${icon
		? `${validate_component(Icon, "Icon").$$render($$result, { class: iClasses, small }, {}, { default: () => `${escape(icon)}` })}`
		: ``}
      ${$$slots.default ? $$slots.default({}) : ``}</button></a>`
	: `<button${spread([{ class: escape(classes) }, props, { disabled: disabled || null }])}>${icon
		? `${validate_component(Icon, "Icon").$$render($$result, { class: iClasses, small }, {}, { default: () => `${escape(icon)}` })}`
		: ``}
    ${$$slots.default ? $$slots.default({}) : ``}</button>`}`;
});

const authStore = writable({ status: "loading" });

/* src/components/NewBot.svelte generated by Svelte v3.24.0 */

const css$4 = {
	code: ".padtop5.svelte-1b158ah{padding-top:14px}.foolrow.svelte-1b158ah{width:400px}.row.svelte-1b158ah{display:flex;max-width:400px;margin-left:auto;margin-right:auto;justify-content:space-between}.leftitem.svelte-1b158ah{border:0px solid;text-align:left}.rightitem.svelte-1b158ah{border:0px solid;text-align:right}.headblock.svelte-1b158ah{display:flex;max-width:400px;margin:auto;justify-content:space-around;margin-top:7px;color:rgb(36, 36, 36)}label.svelte-1b158ah{margin-bottom:7px;color:rgb(126, 126, 126)}main.svelte-1b158ah{text-align:center;padding:0px}",
	map: "{\"version\":3,\"file\":\"NewBot.svelte\",\"sources\":[\"NewBot.svelte\"],\"sourcesContent\":[\"<script>\\n    import { onMount } from 'svelte';\\n    import TextField from 'smelte/src/components/TextField';\\n    import Switch from 'smelte/src/components/Switch';\\n    import Button from 'smelte/src/components/Button';\\n    export let urlhost;\\n    export let comission;\\n\\n    import { authStore } from '../stores/auth';\\n    import { stateStore } from '../stores/statebot.js';\\n    let userid = $authStore.user.uid;\\n\\n    let urlbotslist = urlhost + 'botslist';\\n    //let newbot = urlhost + 'api/newbot.php';\\n    let api_bots = 'http://77.87.212.38:1337/bots';\\n    let api_botcreate = urlhost + 'botcreate';\\n\\n\\n    let isrunning = false;\\n    let quotacoin;\\n    let basecoin;\\n    let digitq;\\n    let digitprice;\\n    let minprice;\\n    let maxprice;\\n    let startdepo;\\n    let profitproc;\\n    let ordersize;\\n    let ordersizeinquota = 0;\\n    $: ordersizeinquota = (((startdepo / 100) * ordersize) / minprice).toFixed(digitq);\\n    $: ordersizeinbase = ((startdepo / 100) * ordersize).toFixed(digitq);\\n    let ofsetbottom;\\n    let ofsettop;\\n    $: ofsetbottomsize = (minprice / 100) * ofsetbottom;\\n    $: ofsettopsize = ((minprice * (1 + profitproc / 100)) / 100) * ofsettop;\\n    let comment;\\n    let floorsvsego = 0;\\n\\n    let startfloorprice = minprice;\\n    let heightfirstfloor = 0;\\n    let heightlastfloor = 0;\\n    let ma1 = 3;\\n    let ma2 = 30;\\n    let maxpriceforzakup;\\n    let minpriceforzakup;\\n    let floors = [];\\n    let curenntprice = 0;\\n    let priceforwake;\\n    let handyzapretnazakup = false;\\n\\n    function getfloorsvsego(m, mx, pr, ob, ot) {\\n        let fv = 1;\\n        let height_floor = 0;\\n\\n        if (m && mx && pr && ob && ot) {\\n            let p = parseInt(pr * 1000) / 1000;\\n            floors = [];\\n            let mnz = 10 * parseInt(digitprice);\\n            let startfloorprice = parseInt(m * mnz) / mnz;\\n\\n            if (m && mx && p) {\\n                while (startfloorprice < mx) {\\n                    height_floor =\\n                        (startfloorprice * (comission + p)) / 100 +\\n                        (ofsetbottom * startfloorprice) / 100 +\\n                        (ofsettop * startfloorprice) / 100;\\n                    floors.push([\\n                        fv,\\n                        startfloorprice,\\n                        startfloorprice + height_floor,\\n                        startfloorprice + (ofsetbottom * startfloorprice) / 100,\\n                        startfloorprice +\\n                            (ofsetbottom * startfloorprice) / 100 +\\n                            (startfloorprice * comission) / 100,\\n                        startfloorprice +\\n                            (ofsetbottom * startfloorprice) / 100 +\\n                            (startfloorprice * comission) / 100 +\\n                            (ofsettop * startfloorprice) / 100,\\n                        startfloorprice +\\n                            (ofsetbottom * startfloorprice) / 100 +\\n                            (startfloorprice * (comission + p)) / 100,\\n                        0,\\n                        0,\\n                        0,\\n                        0,\\n                        0,\\n                        0,\\n                        0,\\n                        0,\\n                    ]);\\n\\n                    startfloorprice = startfloorprice + height_floor;\\n                    fv++;\\n                }\\n                if (m < mx) {\\n                    heightfirstfloor = (floors[0][2] - floors[0][1]).toFixed(digitprice);\\n                } else {\\n                    heightfirstfloor = 0;\\n                }\\n                if (m < mx) {\\n                    heightlastfloor = (floors[fv - 2][2] - floors[fv - 2][1]).toFixed(digitprice);\\n                } else {\\n                    heightlastfloor = 0;\\n                }\\n\\n                console.log(heightfirstfloor, heightlastfloor);\\n            }\\n\\n            fv = fv - 1;\\n            return fv;\\n        }\\n    }\\n\\n    $: floorsvsego = getfloorsvsego(minprice, maxprice, profitproc, ofsetbottom, ofsettop);\\n\\n    let bots = [];\\n    onMount(async () => {\\n        const res = await fetch(urlbotslist);\\n        bots = await res.json();\\n    });\\n\\n    function addNewBot() {\\n        var d = new Date();\\n        var ms = Date.parse(d) / 1000;\\n        if (bots == null) {\\n            bots = [];\\n        }\\n        let botname = quotacoin + basecoin + '-' + ms;\\n        let moneta = quotacoin + basecoin;\\n        bots = [...bots, [false, botname, 0, 0, 0, 0, 0, 0, userid]];\\n\\n        let settings = {\\n            botname,\\n            isrunning,\\n            handyzapretnazakup,\\n            comment,\\n            quotacoin,\\n            basecoin,\\n            moneta,\\n            digitq,\\n            digitprice,\\n            minprice,\\n            maxprice,\\n            profitproc,\\n            ordersize,\\n            ofsetbottom,\\n            ofsettop,\\n            ma1,\\n            ma2,\\n            maxpriceforzakup,\\n            minpriceforzakup,\\n            priceforwake,\\n            userid\\n        };\\n\\n        let finance = {\\n            startdepo: startdepo,\\n            depo: startdepo,\\n            quotanal: 0,\\n            quotainorders: 0,\\n            basenal: startdepo,\\n            baseinorders: 0,\\n            profittoday: 0,\\n        };\\n        let sales = { today: [], days: [], all: [] };\\n        let status = {\\n            currentprice: -1,\\n            lastprice: -1,\\n            currentfloor: -1,\\n            lastfloor: -1,\\n            sr_ma_big: -1,\\n            sr_ma_small: -1,\\n            rezhim: 'Стартовые настройки',\\n            updated: ms\\n        };\\n        let ttp = {\\n            raschstopprice: 0,\\n            curstop: 0,\\n            curorderid: 0,\\n            quantity: 0,\\n            ttpbusy: false,\\n            sold: false\\n        };\\n        \\n\\n    fetch(api_botcreate, {\\n        method: 'post',\\n        headers: {\\n            Accept: 'application/json, text/plain, */*',\\n            'Content-Type': 'application/json',\\n        },\\n        body: JSON.stringify({ \\n            \\\"botname\\\" : botname,\\n            \\\"busy\\\": false,\\n            \\\"onoff\\\": false,\\n            \\\"user_id_from_google\\\": userid,\\n            \\\"settings\\\": JSON.stringify(settings),\\n            \\\"floors\\\": JSON.stringify(floors),\\n            \\\"finance\\\" : JSON.stringify(finance),\\n            \\\"sales\\\" : JSON.stringify(sales),\\n            \\\"status\\\" : JSON.stringify(status),\\n            \\\"ttp\\\" : JSON.stringify(ttp),\\n            \\\"start_set\\\" : JSON.stringify({settings,floors,finance,sales,status,ttp})\\n        })\\n    });\\n\\n\\n        //fetch(api_botcreate, {\\n        //    method: 'post',\\n        //    headers: {\\n        //        Accept: 'application/json, text/plain, */*',\\n        //        'Content-Type': 'application/json',\\n        //    },\\n        //    body: JSON.stringify({ \\n        //        \\\"botname\\\" : botname,\\n        //        \\\"user_id_from_google\\\": userid,\\n        //        \\\"ttp\\\" : ttp\\n        //    }),\\n        //});\\n       //\\n        //ym(65948110,'reachGoal','createbot');\\n        //\\n        //window.location = \\\"/\\\";\\n        //console.log(Object.values(bots));\\n    }\\n    //let botsettingsall = [];\\n//\\n    //$: botsettingsall = [\\n    //    comment,\\n    //    quotacoin,\\n    //    basecoin,\\n    //    digitq,\\n    //    digitprice,\\n    //    minprice,\\n    //    maxprice,\\n    //    profitproc,\\n    //    ordersize,\\n    //    ofsetbottom,\\n    //    ofsettop,\\n    //    ma1,\\n    //    ma2,\\n    //    maxpriceforzakup,\\n    //    minpriceforzakup,\\n    //    priceforwake,\\n    //];\\n</script>\\n\\n<style type=\\\"text/scss\\\">\\n    .padtop5 {\\n        padding-top: 14px;\\n    }\\n\\n    .foolrow {\\n        width: 400px;\\n    }\\n\\n    .row {\\n        display: flex;\\n        max-width: 400px;\\n        margin-left: auto;\\n        margin-right: auto;\\n        justify-content: space-between;\\n    }\\n    .leftitem {\\n        border: 0px solid;\\n        text-align: left;\\n    }\\n    .rightitem {\\n        border: 0px solid;\\n        text-align: right;\\n    }\\n    .headblock {\\n        display: flex;\\n        max-width: 400px;\\n        margin: auto;\\n        justify-content: space-around;\\n        margin-top: 7px;\\n        color: rgb(36, 36, 36);\\n    }\\n\\n    label {\\n        margin-bottom: 7px;\\n        color: rgb(126, 126, 126);\\n    }\\n    main {\\n        text-align: center;\\n        padding: 0px;\\n    }\\n</style>\\n\\n<main>\\n    <div class=\\\"headblock\\\">\\n        <p class=\\\"text-xl text-gray-900 dark:text-gray-300\\\">Создание нового бота</p>\\n\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <div class=\\\"foolrow\\\">\\n                <TextField label=\\\"Комментарий\\\" outlined bind:value={comment} />\\n            </div>\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"Торгуемая валюта\\\" outlined bind:value={quotacoin} />\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"Базовая валюта\\\" outlined bind:value={basecoin} />\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"Округление цены\\\" outlined bind:value={digitprice} />\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"Округление объема\\\" outlined bind:value={digitq} />\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"Низ сетки\\\" outlined bind:value={minprice} />\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"Верх сетки\\\" outlined bind:value={maxprice} />\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"Стартовый депозит\\\" outlined bind:value={startdepo} />\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n\\n            <TextField label=\\\"Прибыль в сделке, %\\\" outlined bind:value={profitproc} />\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <label>Объем ордера</label>\\n            <br />\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">\\n                ~ {ordersizeinquota ? ordersizeinquota : 0} {quotacoin}, {ordersizeinbase ? ordersizeinbase : 0}\\n                {basecoin}\\n            </p>\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"% от депо\\\" outlined bind:value={ordersize} size=\\\"10\\\" />\\n\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"Отступ снизу, %\\\" outlined bind:value={ofsetbottom} />\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">\\n                ~ {ofsetbottomsize.toFixed(digitprice)} {basecoin}\\n            </p>\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"Отступ сверху, %\\\" outlined bind:value={ofsettop} />\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">\\n                ~ {ofsettopsize.toFixed(digitprice)} {basecoin}\\n            </p>\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <br />\\n            <label>Всего этажей</label>\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">{floorsvsego}</p>\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <br />\\n            <label>Высота 1-го этажа</label>\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">{heightfirstfloor} {basecoin}</p>\\n        </div>\\n        <div class=\\\"rightitem\\\">\\n            <br />\\n            <label>Высота верхнего этажа</label>\\n            <p class=\\\" text-gray-900 dark:text-gray-300\\\">{heightlastfloor} {basecoin}</p>\\n        </div>\\n    </div>\\n    <br />\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField label=\\\"MA1, мин\\\" outlined bind:value={ma1} />\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"MA2, мин\\\" outlined bind:value={ma2} />\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem padtop5\\\">\\n            <label>Не закупать, если цена больше</label>\\n        </div>\\n        &nbsp;&nbsp;\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"\\\" outlined bind:value={maxpriceforzakup} size=\\\"10\\\" />\\n        </div>\\n    </div>\\n\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem padtop5\\\">\\n            <label>Не закупать, если цена меньше</label>\\n        </div>\\n        <div class=\\\"rightitem\\\">\\n            <TextField label=\\\"\\\" outlined bind:value={minpriceforzakup} size=\\\"10\\\" />\\n        </div>\\n    </div>\\n    <br />\\n    <Button href=\\\"/\\\" on:click={addNewBot}>Создать</Button>\\n    <br />\\n    <br />\\n</main>\\n\"],\"names\":[],\"mappings\":\"AAwPI,QAAQ,eAAC,CAAC,AACN,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,QAAQ,eAAC,CAAC,AACN,KAAK,CAAE,KAAK,AAChB,CAAC,AAED,IAAI,eAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,eAAe,CAAE,aAAa,AAClC,CAAC,AACD,SAAS,eAAC,CAAC,AACP,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,IAAI,AACpB,CAAC,AACD,UAAU,eAAC,CAAC,AACR,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,KAAK,AACrB,CAAC,AACD,UAAU,eAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,YAAY,CAC7B,UAAU,CAAE,GAAG,CACf,KAAK,CAAE,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AAC1B,CAAC,AAED,KAAK,eAAC,CAAC,AACH,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAC7B,CAAC,AACD,IAAI,eAAC,CAAC,AACF,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,GAAG,AAChB,CAAC\"}"
};

const NewBot = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $authStore = get_store_value(authStore);
	let { urlhost } = $$props;
	let { comission } = $$props;
	let userid = $authStore.user.uid;
	let urlbotslist = urlhost + "botslist";
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
	let ofsetbottom;
	let ofsettop;
	let comment;
	let floorsvsego = 0;
	let heightfirstfloor = 0;
	let heightlastfloor = 0;
	let ma1 = 3;
	let ma2 = 30;
	let maxpriceforzakup;
	let minpriceforzakup;
	let floors = [];

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
					height_floor = startfloorprice * (comission + p) / 100 + ofsetbottom * startfloorprice / 100 + ofsettop * startfloorprice / 100;

					floors.push([
						fv,
						startfloorprice,
						startfloorprice + height_floor,
						startfloorprice + ofsetbottom * startfloorprice / 100,
						startfloorprice + ofsetbottom * startfloorprice / 100 + startfloorprice * comission / 100,
						startfloorprice + ofsetbottom * startfloorprice / 100 + startfloorprice * comission / 100 + ofsettop * startfloorprice / 100,
						startfloorprice + ofsetbottom * startfloorprice / 100 + startfloorprice * (comission + p) / 100,
						0,
						0,
						0,
						0,
						0,
						0,
						0,
						0
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

	let bots = [];

	onMount(async () => {
		const res = await fetch(urlbotslist);
		bots = await res.json();
	});
	//    method: 'post',

	if ($$props.urlhost === void 0 && $$bindings.urlhost && urlhost !== void 0) $$bindings.urlhost(urlhost);
	if ($$props.comission === void 0 && $$bindings.comission && comission !== void 0) $$bindings.comission(comission);
	$$result.css.add(css$4);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;
		ordersizeinquota = (startdepo / 100 * ordersize / minprice).toFixed(digitq);
		let ordersizeinbase = (startdepo / 100 * ordersize).toFixed(digitq);
		let ofsetbottomsize = minprice / 100 * ofsetbottom;
		let ofsettopsize = minprice * (1 + profitproc / 100) / 100 * ofsettop;
		floorsvsego = getfloorsvsego(minprice, maxprice, profitproc, ofsetbottom, ofsettop);

		$$rendered = `<main class="${"svelte-1b158ah"}"><div class="${"headblock svelte-1b158ah"}"><p class="${"text-xl text-gray-900 dark:text-gray-300"}">Создание нового бота</p></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}"><div class="${"foolrow svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Комментарий",
				outlined: true,
				value: comment
			},
			{
				value: $$value => {
					comment = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Торгуемая валюта",
				outlined: true,
				value: quotacoin
			},
			{
				value: $$value => {
					quotacoin = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Базовая валюта",
				outlined: true,
				value: basecoin
			},
			{
				value: $$value => {
					basecoin = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Округление цены",
				outlined: true,
				value: digitprice
			},
			{
				value: $$value => {
					digitprice = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Округление объема",
				outlined: true,
				value: digitq
			},
			{
				value: $$value => {
					digitq = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Низ сетки",
				outlined: true,
				value: minprice
			},
			{
				value: $$value => {
					minprice = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Верх сетки",
				outlined: true,
				value: maxprice
			},
			{
				value: $$value => {
					maxprice = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Стартовый депозит",
				outlined: true,
				value: startdepo
			},
			{
				value: $$value => {
					startdepo = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Прибыль в сделке, %",
				outlined: true,
				value: profitproc
			},
			{
				value: $$value => {
					profitproc = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}"><label class="${"svelte-1b158ah"}">Объем ордера</label>
            <br>
            <p class="${" text-gray-900 dark:text-gray-300"}">~ ${escape(ordersizeinquota ? ordersizeinquota : 0)} ${escape(quotacoin)}, ${escape(ordersizeinbase ? ordersizeinbase : 0)}
                ${escape(basecoin)}</p></div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "% от депо",
				outlined: true,
				size: "10",
				value: ordersize
			},
			{
				value: $$value => {
					ordersize = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Отступ снизу, %",
				outlined: true,
				value: ofsetbottom
			},
			{
				value: $$value => {
					ofsetbottom = $$value;
					$$settled = false;
				}
			},
			{}
		)}
            <p class="${" text-gray-900 dark:text-gray-300"}">~ ${escape(ofsetbottomsize.toFixed(digitprice))} ${escape(basecoin)}</p></div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Отступ сверху, %",
				outlined: true,
				value: ofsettop
			},
			{
				value: $$value => {
					ofsettop = $$value;
					$$settled = false;
				}
			},
			{}
		)}
            <p class="${" text-gray-900 dark:text-gray-300"}">~ ${escape(ofsettopsize.toFixed(digitprice))} ${escape(basecoin)}</p></div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}"><br>
            <label class="${"svelte-1b158ah"}">Всего этажей</label>
            <p class="${" text-gray-900 dark:text-gray-300"}">${escape(floorsvsego)}</p></div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}"><br>
            <label class="${"svelte-1b158ah"}">Высота 1-го этажа</label>
            <p class="${" text-gray-900 dark:text-gray-300"}">${escape(heightfirstfloor)} ${escape(basecoin)}</p></div>
        <div class="${"rightitem svelte-1b158ah"}"><br>
            <label class="${"svelte-1b158ah"}">Высота верхнего этажа</label>
            <p class="${" text-gray-900 dark:text-gray-300"}">${escape(heightlastfloor)} ${escape(basecoin)}</p></div></div>
    <br>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "MA1, мин",
				outlined: true,
				value: ma1
			},
			{
				value: $$value => {
					ma1 = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "MA2, мин",
				outlined: true,
				value: ma2
			},
			{
				value: $$value => {
					ma2 = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem padtop5 svelte-1b158ah"}"><label class="${"svelte-1b158ah"}">Не закупать, если цена больше</label></div>
          
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "",
				outlined: true,
				size: "10",
				value: maxpriceforzakup
			},
			{
				value: $$value => {
					maxpriceforzakup = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>

    <div class="${"row svelte-1b158ah"}"><div class="${"leftitem padtop5 svelte-1b158ah"}"><label class="${"svelte-1b158ah"}">Не закупать, если цена меньше</label></div>
        <div class="${"rightitem svelte-1b158ah"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "",
				outlined: true,
				size: "10",
				value: minpriceforzakup
			},
			{
				value: $$value => {
					minpriceforzakup = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
    <br>
    ${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, { default: () => `Создать` })}
    <br>
    <br></main>`;
	} while (!$$settled);

	return $$rendered;
});

/* src/components/IndLoad.svelte generated by Svelte v3.24.0 */

const css$5 = {
	code: "main.svelte-m6qgj6{width:auto}",
	map: "{\"version\":3,\"file\":\"IndLoad.svelte\",\"sources\":[\"IndLoad.svelte\"],\"sourcesContent\":[\"<script>\\n    export let procvlozh;\\n    export let id;\\n    export let prcvstr;\\n    export let onoff;\\n    $: if (procvlozh) {\\n        prcvstr = procvlozh + '%';\\n    } else {\\n        prcvstr = '0';\\n    }\\n\\n    let opacity;\\n    console.log(onoff);\\n    if (onoff == true || id == 'sumprocvlozh') {\\n        opacity = 0;\\n    } else {\\n        opacity = 1;\\n    }\\n</script>\\n\\n<style>\\n    main {\\n        width: auto;\\n    }\\n</style>\\n\\n<main>\\n    <svg\\n        width=\\\"100%\\\"\\n        height=\\\"100%\\\"\\n        viewBox=\\\"0 0 452 124\\\"\\n        fill=\\\"none\\\"\\n        xmlns=\\\"http://www.w3.org/2000/svg\\\"\\n        style=\\\"filter: grayscale({opacity})\\\">\\n\\n        <path\\n            fill-rule=\\\"evenodd\\\"\\n            clip-rule=\\\"evenodd\\\"\\n            d=\\\"M35.7223 5.77236C35.7223 2.58438 33.1379 0 29.9499 0V0C26.7619 0 24.1775 2.58437\\n            24.1775 5.77236V118.228C24.1775 121.416 26.7619 124 29.9499 124V124C33.1379 124 35.7223\\n            121.416 35.7223 118.228V5.77236ZM53.039 0C49.8511 0 47.2668 2.58431 47.2668\\n            5.77221V118.228C47.2668 121.416 49.8511 124 53.039 124V124C56.2269 124 58.8112 121.416\\n            58.8112 118.228V5.77221C58.8112 2.5843 56.2269 0 53.039 0V0ZM81.9005 118.228C81.9005\\n            121.416 79.3161 124 76.1281 124V124C72.9401 124 70.3558 121.416 70.3558\\n            118.228V5.77236C70.3558 2.58438 72.9401 0 76.1281 0V0C79.3161 0 81.9005 2.58437 81.9005\\n            5.77236V118.228ZM93.4451 118.228C93.4451 121.416 96.0294 124 99.2173 124V124C102.405 124\\n            104.989 121.416 104.989 118.228V5.7722C104.989 2.5843 102.405 0 99.2173 0V0C96.0294 0\\n            93.4451 2.5843 93.4451 5.7722V118.228ZM128.079 118.228C128.079 121.416 125.494 124\\n            122.306 124V124C119.118 124 116.534 121.416 116.534 118.228V5.77236C116.534 2.58438\\n            119.118 0 122.306 0V0C125.494 0 128.079 2.58437 128.079 5.77236V118.228ZM139.623\\n            118.228C139.623 121.416 142.208 124 145.396 124V124C148.583 124 151.168 121.416 151.168\\n            118.228V5.77221C151.168 2.58431 148.583 0 145.396 0V0C142.208 0 139.623 2.58431 139.623\\n            5.77221V118.228ZM174.257 118.228C174.257 121.416 171.673 124 168.485 124V124C165.297 124\\n            162.712 121.416 162.712 118.228V5.77237C162.712 2.58438 165.297 0 168.485 0V0C171.673 0\\n            174.257 2.58438 174.257 5.77237V118.228ZM185.802 118.228C185.802 121.416 188.386 124\\n            191.574 124V124C194.762 124 197.346 121.416 197.346 118.228V5.77221C197.346 2.58431\\n            194.762 0 191.574 0V0C188.386 0 185.802 2.58431 185.802 5.77221V118.228ZM220.435\\n            118.228C220.435 121.416 217.851 124 214.663 124V124C211.475 124 208.891 121.416 208.891\\n            118.228V5.77221C208.891 2.58431 211.475 0 214.663 0V0C217.851 0 220.435 2.58431 220.435\\n            5.77221V118.228ZM231.979 118.228C231.979 121.416 234.564 124 237.752 124V124C240.94 124\\n            243.524 121.416 243.524 118.228V5.77237C243.524 2.58438 240.94 0 237.752 0V0C234.564 0\\n            231.979 2.58438 231.979 5.77237V118.228ZM266.613 118.228C266.613 121.416 264.029 124\\n            260.841 124V124C257.653 124 255.069 121.416 255.069 118.228V5.77222C255.069 2.58431\\n            257.653 0 260.841 0V0C264.029 0 266.613 2.58431 266.613 5.77222V62V118.228ZM278.158\\n            118.228C278.158 121.416 280.742 124 283.93 124V124C287.118 124 289.702 121.416 289.702\\n            118.228V5.77237C289.702 2.58438 287.118 0 283.93 0V0C280.742 0 278.158 2.58438 278.158\\n            5.77237V118.228ZM312.791 118.228C312.791 121.416 310.207 124 307.019 124V124C303.831 124\\n            301.247 121.416 301.247 118.228V5.77219C301.247 2.5843 303.831 0 307.019 0V0C310.207 0\\n            312.791 2.5843 312.791 5.77219V118.228ZM324.336 118.228C324.336 121.416 326.92 124\\n            330.108 124V124C333.296 124 335.88 121.416 335.88 118.228V5.7722C335.88 2.5843 333.296 0\\n            330.108 0V0C326.92 0 324.336 2.58431 324.336 5.7722V118.228ZM358.97 118.228C358.97\\n            121.416 356.385 124 353.197 124V124C350.009 124 347.425 121.416 347.425\\n            118.228V5.77237C347.425 2.58438 350.009 0 353.197 0V0C356.385 0 358.97 2.58438 358.97\\n            5.77237V118.228ZM370.514 118.228C370.514 121.416 373.098 124 376.286 124V124C379.474 124\\n            382.059 121.416 382.059 118.228V5.7722C382.059 2.5843 379.474 0 376.286 0V0C373.098 0\\n            370.514 2.58431 370.514 5.7722V118.228ZM405.148 118.228C405.148 121.416 402.564 124\\n            399.376 124V124C396.188 124 393.603 121.416 393.603 118.228V5.77237C393.603 2.58438\\n            396.188 0 399.376 0V0C402.564 0 405.148 2.58438 405.148 5.77237V118.228ZM416.692\\n            118.228C416.692 121.416 419.277 124 422.465 124V124C425.653 124 428.237 121.416 428.237\\n            118.228V5.77219C428.237 2.5843 425.653 0 422.465 0V0C419.277 0 416.692 2.5843 416.692\\n            5.77219V118.228ZM451.326 118.228C451.326 121.416 448.742 124 445.554 124V124C442.366 124\\n            439.781 121.416 439.781 118.228V5.77237C439.781 2.58438 442.366 0 445.554 0V0C448.742 0\\n            451.326 2.58438 451.326 5.77237V118.228ZM1.08862 5.77218C1.08862 2.58429 3.67292 0\\n            6.8608 0V0C10.0487 0 12.633 2.5843 12.633 5.77218V118.228C12.633 121.416 10.0487 124\\n            6.8608 124V124C3.67292 124 1.08862 121.416 1.08862 118.228V5.77218Z\\\"\\n            fill=\\\"#E0294A\\\" />\\n        <mask\\n            id=\\\"mask{id}\\\"\\n            mask-type=\\\"alpha\\\"\\n            maskUnits=\\\"userSpaceOnUse\\\"\\n            x=\\\"0\\\"\\n            y=\\\"0\\\"\\n            width=\\\"100%\\\"\\n            height=\\\"100%\\\">\\n            <rect width={prcvstr} height=\\\"124\\\" fill=\\\"white\\\" />\\n        </mask>\\n        <g mask=\\\"url(#mask{id})\\\">\\n            <path\\n                fill-rule=\\\"evenodd\\\"\\n                clip-rule=\\\"evenodd\\\"\\n                d=\\\"M35.7223 5.77236C35.7223 2.58438 33.1379 0 29.9499 0V0C26.7619 0 24.1775 2.58437\\n                24.1775 5.77236V118.228C24.1775 121.416 26.7619 124 29.9499 124V124C33.1379 124\\n                35.7223 121.416 35.7223 118.228V5.77236ZM53.039 0C49.8511 0 47.2668 2.58431 47.2668\\n                5.77221V118.228C47.2668 121.416 49.8511 124 53.039 124V124C56.2269 124 58.8112\\n                121.416 58.8112 118.228V5.77221C58.8112 2.5843 56.2269 0 53.039 0V0ZM81.9005\\n                118.228C81.9005 121.416 79.3161 124 76.1281 124V124C72.9401 124 70.3558 121.416\\n                70.3558 118.228V5.77236C70.3558 2.58438 72.9401 0 76.1281 0V0C79.3161 0 81.9005\\n                2.58437 81.9005 5.77236V118.228ZM93.4451 118.228C93.4451 121.416 96.0294 124 99.2173\\n                124V124C102.405 124 104.989 121.416 104.989 118.228V5.7722C104.989 2.5843 102.405 0\\n                99.2173 0V0C96.0294 0 93.4451 2.5843 93.4451 5.7722V118.228ZM128.079 118.228C128.079\\n                121.416 125.494 124 122.306 124V124C119.118 124 116.534 121.416 116.534\\n                118.228V5.77236C116.534 2.58438 119.118 0 122.306 0V0C125.494 0 128.079 2.58437\\n                128.079 5.77236V118.228ZM139.623 118.228C139.623 121.416 142.208 124 145.396\\n                124V124C148.583 124 151.168 121.416 151.168 118.228V5.77221C151.168 2.58431 148.583\\n                0 145.396 0V0C142.208 0 139.623 2.58431 139.623 5.77221V118.228ZM174.257\\n                118.228C174.257 121.416 171.673 124 168.485 124V124C165.297 124 162.712 121.416\\n                162.712 118.228V5.77237C162.712 2.58438 165.297 0 168.485 0V0C171.673 0 174.257\\n                2.58438 174.257 5.77237V118.228ZM185.802 118.228C185.802 121.416 188.386 124 191.574\\n                124V124C194.762 124 197.346 121.416 197.346 118.228V5.77221C197.346 2.58431 194.762\\n                0 191.574 0V0C188.386 0 185.802 2.58431 185.802 5.77221V118.228ZM220.435\\n                118.228C220.435 121.416 217.851 124 214.663 124V124C211.475 124 208.891 121.416\\n                208.891 118.228V5.77221C208.891 2.58431 211.475 0 214.663 0V0C217.851 0 220.435\\n                2.58431 220.435 5.77221V118.228ZM231.979 118.228C231.979 121.416 234.564 124 237.752\\n                124V124C240.94 124 243.524 121.416 243.524 118.228V5.77237C243.524 2.58438 240.94 0\\n                237.752 0V0C234.564 0 231.979 2.58438 231.979 5.77237V118.228ZM266.613\\n                118.228C266.613 121.416 264.029 124 260.841 124V124C257.653 124 255.069 121.416\\n                255.069 118.228V5.77222C255.069 2.58431 257.653 0 260.841 0V0C264.029 0 266.613\\n                2.58432 266.613 5.77223V118.228ZM278.158 118.228C278.158 121.416 280.742 124 283.93\\n                124V124C287.118 124 289.702 121.416 289.702 118.228V5.77237C289.702 2.58438 287.118\\n                0 283.93 0V0C280.742 0 278.158 2.58438 278.158 5.77237V118.228ZM312.791\\n                118.228C312.791 121.416 310.207 124 307.019 124V124C303.831 124 301.247 121.416\\n                301.247 118.228V5.77219C301.247 2.5843 303.831 0 307.019 0V0C310.207 0 312.791\\n                2.5843 312.791 5.77219V118.228ZM324.336 118.228C324.336 121.416 326.92 124 330.108\\n                124V124C333.296 124 335.88 121.416 335.88 118.228V5.7722C335.88 2.5843 333.296 0\\n                330.108 0V0C326.92 0 324.336 2.58431 324.336 5.7722V118.228ZM358.97 118.228C358.97\\n                121.416 356.385 124 353.197 124V124C350.009 124 347.425 121.416 347.425\\n                118.228V5.77237C347.425 2.58438 350.009 0 353.197 0V0C356.385 0 358.97 2.58438\\n                358.97 5.77237V118.228ZM370.514 118.228C370.514 121.416 373.098 124 376.286\\n                124V124C379.474 124 382.059 121.416 382.059 118.228V5.7722C382.059 2.5843 379.474 0\\n                376.286 0V0C373.098 0 370.514 2.58431 370.514 5.7722V118.228ZM405.148\\n                118.228C405.148 121.416 402.564 124 399.376 124V124C396.188 124 393.603 121.416\\n                393.603 118.228V5.77237C393.603 2.58438 396.188 0 399.376 0V0C402.564 0 405.148\\n                2.58438 405.148 5.77237V118.228ZM416.692 118.228C416.692 121.416 419.277 124 422.465\\n                124V124C425.653 124 428.237 121.416 428.237 118.228V5.77219C428.237 2.5843 425.653 0\\n                422.465 0V0C419.277 0 416.692 2.5843 416.692 5.77219V118.228ZM451.326\\n                118.228C451.326 121.416 448.742 124 445.554 124V124C442.366 124 439.781 121.416\\n                439.781 118.228V5.77237C439.781 2.58438 442.366 0 445.554 0V0C448.742 0 451.326\\n                2.58438 451.326 5.77237V118.228ZM1.08862 5.77218C1.08862 2.58429 3.67292 0 6.8608\\n                0V0C10.0487 0 12.633 2.5843 12.633 5.77218V118.228C12.633 121.416 10.0487 124 6.8608\\n                124V124C3.67292 124 1.08862 121.416 1.08862 118.228V5.77218Z\\\"\\n                fill=\\\"#02C076\\\" />\\n        </g>\\n\\n    </svg>\\n\\n</main>\\n\"],\"names\":[],\"mappings\":\"AAqBI,IAAI,cAAC,CAAC,AACF,KAAK,CAAE,IAAI,AACf,CAAC\"}"
};

const IndLoad = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { procvlozh } = $$props;
	let { id } = $$props;
	let { prcvstr } = $$props;
	let { onoff } = $$props;
	let opacity;
	console.log(onoff);

	if (onoff == true || id == "sumprocvlozh") {
		opacity = 0;
	} else {
		opacity = 1;
	}

	if ($$props.procvlozh === void 0 && $$bindings.procvlozh && procvlozh !== void 0) $$bindings.procvlozh(procvlozh);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.prcvstr === void 0 && $$bindings.prcvstr && prcvstr !== void 0) $$bindings.prcvstr(prcvstr);
	if ($$props.onoff === void 0 && $$bindings.onoff && onoff !== void 0) $$bindings.onoff(onoff);
	$$result.css.add(css$5);

	 {
		if (procvlozh) {
			prcvstr = procvlozh + "%";
		} else {
			prcvstr = "0";
		}
	}

	return `<main class="${"svelte-m6qgj6"}"><svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 452 124"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" style="${"filter: grayscale(" + escape(opacity) + ")"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M35.7223 5.77236C35.7223 2.58438 33.1379 0 29.9499 0V0C26.7619 0 24.1775 2.58437\n            24.1775 5.77236V118.228C24.1775 121.416 26.7619 124 29.9499 124V124C33.1379 124 35.7223\n            121.416 35.7223 118.228V5.77236ZM53.039 0C49.8511 0 47.2668 2.58431 47.2668\n            5.77221V118.228C47.2668 121.416 49.8511 124 53.039 124V124C56.2269 124 58.8112 121.416\n            58.8112 118.228V5.77221C58.8112 2.5843 56.2269 0 53.039 0V0ZM81.9005 118.228C81.9005\n            121.416 79.3161 124 76.1281 124V124C72.9401 124 70.3558 121.416 70.3558\n            118.228V5.77236C70.3558 2.58438 72.9401 0 76.1281 0V0C79.3161 0 81.9005 2.58437 81.9005\n            5.77236V118.228ZM93.4451 118.228C93.4451 121.416 96.0294 124 99.2173 124V124C102.405 124\n            104.989 121.416 104.989 118.228V5.7722C104.989 2.5843 102.405 0 99.2173 0V0C96.0294 0\n            93.4451 2.5843 93.4451 5.7722V118.228ZM128.079 118.228C128.079 121.416 125.494 124\n            122.306 124V124C119.118 124 116.534 121.416 116.534 118.228V5.77236C116.534 2.58438\n            119.118 0 122.306 0V0C125.494 0 128.079 2.58437 128.079 5.77236V118.228ZM139.623\n            118.228C139.623 121.416 142.208 124 145.396 124V124C148.583 124 151.168 121.416 151.168\n            118.228V5.77221C151.168 2.58431 148.583 0 145.396 0V0C142.208 0 139.623 2.58431 139.623\n            5.77221V118.228ZM174.257 118.228C174.257 121.416 171.673 124 168.485 124V124C165.297 124\n            162.712 121.416 162.712 118.228V5.77237C162.712 2.58438 165.297 0 168.485 0V0C171.673 0\n            174.257 2.58438 174.257 5.77237V118.228ZM185.802 118.228C185.802 121.416 188.386 124\n            191.574 124V124C194.762 124 197.346 121.416 197.346 118.228V5.77221C197.346 2.58431\n            194.762 0 191.574 0V0C188.386 0 185.802 2.58431 185.802 5.77221V118.228ZM220.435\n            118.228C220.435 121.416 217.851 124 214.663 124V124C211.475 124 208.891 121.416 208.891\n            118.228V5.77221C208.891 2.58431 211.475 0 214.663 0V0C217.851 0 220.435 2.58431 220.435\n            5.77221V118.228ZM231.979 118.228C231.979 121.416 234.564 124 237.752 124V124C240.94 124\n            243.524 121.416 243.524 118.228V5.77237C243.524 2.58438 240.94 0 237.752 0V0C234.564 0\n            231.979 2.58438 231.979 5.77237V118.228ZM266.613 118.228C266.613 121.416 264.029 124\n            260.841 124V124C257.653 124 255.069 121.416 255.069 118.228V5.77222C255.069 2.58431\n            257.653 0 260.841 0V0C264.029 0 266.613 2.58431 266.613 5.77222V62V118.228ZM278.158\n            118.228C278.158 121.416 280.742 124 283.93 124V124C287.118 124 289.702 121.416 289.702\n            118.228V5.77237C289.702 2.58438 287.118 0 283.93 0V0C280.742 0 278.158 2.58438 278.158\n            5.77237V118.228ZM312.791 118.228C312.791 121.416 310.207 124 307.019 124V124C303.831 124\n            301.247 121.416 301.247 118.228V5.77219C301.247 2.5843 303.831 0 307.019 0V0C310.207 0\n            312.791 2.5843 312.791 5.77219V118.228ZM324.336 118.228C324.336 121.416 326.92 124\n            330.108 124V124C333.296 124 335.88 121.416 335.88 118.228V5.7722C335.88 2.5843 333.296 0\n            330.108 0V0C326.92 0 324.336 2.58431 324.336 5.7722V118.228ZM358.97 118.228C358.97\n            121.416 356.385 124 353.197 124V124C350.009 124 347.425 121.416 347.425\n            118.228V5.77237C347.425 2.58438 350.009 0 353.197 0V0C356.385 0 358.97 2.58438 358.97\n            5.77237V118.228ZM370.514 118.228C370.514 121.416 373.098 124 376.286 124V124C379.474 124\n            382.059 121.416 382.059 118.228V5.7722C382.059 2.5843 379.474 0 376.286 0V0C373.098 0\n            370.514 2.58431 370.514 5.7722V118.228ZM405.148 118.228C405.148 121.416 402.564 124\n            399.376 124V124C396.188 124 393.603 121.416 393.603 118.228V5.77237C393.603 2.58438\n            396.188 0 399.376 0V0C402.564 0 405.148 2.58438 405.148 5.77237V118.228ZM416.692\n            118.228C416.692 121.416 419.277 124 422.465 124V124C425.653 124 428.237 121.416 428.237\n            118.228V5.77219C428.237 2.5843 425.653 0 422.465 0V0C419.277 0 416.692 2.5843 416.692\n            5.77219V118.228ZM451.326 118.228C451.326 121.416 448.742 124 445.554 124V124C442.366 124\n            439.781 121.416 439.781 118.228V5.77237C439.781 2.58438 442.366 0 445.554 0V0C448.742 0\n            451.326 2.58438 451.326 5.77237V118.228ZM1.08862 5.77218C1.08862 2.58429 3.67292 0\n            6.8608 0V0C10.0487 0 12.633 2.5843 12.633 5.77218V118.228C12.633 121.416 10.0487 124\n            6.8608 124V124C3.67292 124 1.08862 121.416 1.08862 118.228V5.77218Z"}" fill="${"#E0294A"}"></path><mask id="${"mask" + escape(id)}" mask-type="${"alpha"}" maskUnits="${"userSpaceOnUse"}" x="${"0"}" y="${"0"}" width="${"100%"}" height="${"100%"}"><rect${add_attribute("width", prcvstr, 0)} height="${"124"}" fill="${"white"}"></rect></mask><g mask="${"url(#mask" + escape(id) + ")"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M35.7223 5.77236C35.7223 2.58438 33.1379 0 29.9499 0V0C26.7619 0 24.1775 2.58437\n                24.1775 5.77236V118.228C24.1775 121.416 26.7619 124 29.9499 124V124C33.1379 124\n                35.7223 121.416 35.7223 118.228V5.77236ZM53.039 0C49.8511 0 47.2668 2.58431 47.2668\n                5.77221V118.228C47.2668 121.416 49.8511 124 53.039 124V124C56.2269 124 58.8112\n                121.416 58.8112 118.228V5.77221C58.8112 2.5843 56.2269 0 53.039 0V0ZM81.9005\n                118.228C81.9005 121.416 79.3161 124 76.1281 124V124C72.9401 124 70.3558 121.416\n                70.3558 118.228V5.77236C70.3558 2.58438 72.9401 0 76.1281 0V0C79.3161 0 81.9005\n                2.58437 81.9005 5.77236V118.228ZM93.4451 118.228C93.4451 121.416 96.0294 124 99.2173\n                124V124C102.405 124 104.989 121.416 104.989 118.228V5.7722C104.989 2.5843 102.405 0\n                99.2173 0V0C96.0294 0 93.4451 2.5843 93.4451 5.7722V118.228ZM128.079 118.228C128.079\n                121.416 125.494 124 122.306 124V124C119.118 124 116.534 121.416 116.534\n                118.228V5.77236C116.534 2.58438 119.118 0 122.306 0V0C125.494 0 128.079 2.58437\n                128.079 5.77236V118.228ZM139.623 118.228C139.623 121.416 142.208 124 145.396\n                124V124C148.583 124 151.168 121.416 151.168 118.228V5.77221C151.168 2.58431 148.583\n                0 145.396 0V0C142.208 0 139.623 2.58431 139.623 5.77221V118.228ZM174.257\n                118.228C174.257 121.416 171.673 124 168.485 124V124C165.297 124 162.712 121.416\n                162.712 118.228V5.77237C162.712 2.58438 165.297 0 168.485 0V0C171.673 0 174.257\n                2.58438 174.257 5.77237V118.228ZM185.802 118.228C185.802 121.416 188.386 124 191.574\n                124V124C194.762 124 197.346 121.416 197.346 118.228V5.77221C197.346 2.58431 194.762\n                0 191.574 0V0C188.386 0 185.802 2.58431 185.802 5.77221V118.228ZM220.435\n                118.228C220.435 121.416 217.851 124 214.663 124V124C211.475 124 208.891 121.416\n                208.891 118.228V5.77221C208.891 2.58431 211.475 0 214.663 0V0C217.851 0 220.435\n                2.58431 220.435 5.77221V118.228ZM231.979 118.228C231.979 121.416 234.564 124 237.752\n                124V124C240.94 124 243.524 121.416 243.524 118.228V5.77237C243.524 2.58438 240.94 0\n                237.752 0V0C234.564 0 231.979 2.58438 231.979 5.77237V118.228ZM266.613\n                118.228C266.613 121.416 264.029 124 260.841 124V124C257.653 124 255.069 121.416\n                255.069 118.228V5.77222C255.069 2.58431 257.653 0 260.841 0V0C264.029 0 266.613\n                2.58432 266.613 5.77223V118.228ZM278.158 118.228C278.158 121.416 280.742 124 283.93\n                124V124C287.118 124 289.702 121.416 289.702 118.228V5.77237C289.702 2.58438 287.118\n                0 283.93 0V0C280.742 0 278.158 2.58438 278.158 5.77237V118.228ZM312.791\n                118.228C312.791 121.416 310.207 124 307.019 124V124C303.831 124 301.247 121.416\n                301.247 118.228V5.77219C301.247 2.5843 303.831 0 307.019 0V0C310.207 0 312.791\n                2.5843 312.791 5.77219V118.228ZM324.336 118.228C324.336 121.416 326.92 124 330.108\n                124V124C333.296 124 335.88 121.416 335.88 118.228V5.7722C335.88 2.5843 333.296 0\n                330.108 0V0C326.92 0 324.336 2.58431 324.336 5.7722V118.228ZM358.97 118.228C358.97\n                121.416 356.385 124 353.197 124V124C350.009 124 347.425 121.416 347.425\n                118.228V5.77237C347.425 2.58438 350.009 0 353.197 0V0C356.385 0 358.97 2.58438\n                358.97 5.77237V118.228ZM370.514 118.228C370.514 121.416 373.098 124 376.286\n                124V124C379.474 124 382.059 121.416 382.059 118.228V5.7722C382.059 2.5843 379.474 0\n                376.286 0V0C373.098 0 370.514 2.58431 370.514 5.7722V118.228ZM405.148\n                118.228C405.148 121.416 402.564 124 399.376 124V124C396.188 124 393.603 121.416\n                393.603 118.228V5.77237C393.603 2.58438 396.188 0 399.376 0V0C402.564 0 405.148\n                2.58438 405.148 5.77237V118.228ZM416.692 118.228C416.692 121.416 419.277 124 422.465\n                124V124C425.653 124 428.237 121.416 428.237 118.228V5.77219C428.237 2.5843 425.653 0\n                422.465 0V0C419.277 0 416.692 2.5843 416.692 5.77219V118.228ZM451.326\n                118.228C451.326 121.416 448.742 124 445.554 124V124C442.366 124 439.781 121.416\n                439.781 118.228V5.77237C439.781 2.58438 442.366 0 445.554 0V0C448.742 0 451.326\n                2.58438 451.326 5.77237V118.228ZM1.08862 5.77218C1.08862 2.58429 3.67292 0 6.8608\n                0V0C10.0487 0 12.633 2.5843 12.633 5.77218V118.228C12.633 121.416 10.0487 124 6.8608\n                124V124C3.67292 124 1.08862 121.416 1.08862 118.228V5.77218Z"}" fill="${"#02C076"}"></path></g></svg></main>`;
});

/* src/components/BotsList.svelte generated by Svelte v3.24.0 */

const css$6 = {
	code: ".divhr.svelte-upqpsm{display:flex;width:400px;height:10px;margin-left:auto;margin-right:auto}.balancehead.svelte-upqpsm{padding-top:28px}.rowbalanceitem.svelte-upqpsm{padding-left:10px;text-align:center;line-height:30px}.centereditem.svelte-upqpsm{text-align:center;min-width:23%;border:0px solid}.addknob.svelte-upqpsm{display:flex;justify-content:center;margin-right:10px;margin-left:10px;margin-top:10px}main.svelte-upqpsm{text-align:center}.botslist.svelte-upqpsm{width:100%;display:grid;grid-template-columns:repeat(1, 1fr);grid-gap:1px;grid-template-rows:auto 1fr;margin:0px;padding:0px}.botitem.svelte-upqpsm{display:flex;width:400px;margin-left:auto;margin-right:auto;justify-content:space-between}.textitem.svelte-upqpsm{display:flex;width:400px;margin-left:auto;margin-right:auto;justify-content:space-between}.leftitem.svelte-upqpsm{border:0px solid;text-align:left;max-width:30%}.rightitem.svelte-upqpsm{border:0px solid;text-align:right;width:40px;display:flex;flex-grow:1;align-items:center}.botitem.svelte-upqpsm:hover{background-color:rgba(255, 228, 196, 0.342)}@media(min-width: 640px){main.svelte-upqpsm{max-width:none}}",
	map: "{\"version\":3,\"file\":\"BotsList.svelte\",\"sources\":[\"BotsList.svelte\"],\"sourcesContent\":[\"<script>\\n  import { stateStore } from \\\"../stores/statebot.js\\\";\\n  import { onMount } from \\\"svelte\\\";\\n\\n  import Switch from \\\"smelte/src/components/Switch\\\";\\n  //import \\\"smelte/src/tailwind.css\\\";\\n  import NewBot from \\\"./NewBot.svelte\\\";\\n  //import BotStatus from './BotStatus.svelte';\\n\\n  export let comission;\\n  export let show;\\n\\n  //console.log(\\\"s_a_hip: \\\" + process.env.SAPPER_APP_HOSTIP);\\n\\n  import Button from \\\"smelte/src/components/Button\\\";\\n  import { authStore } from \\\"../stores/auth\\\";\\n  //import { request } from 'graphql-request';\\n\\n  import IndLoad from \\\"./IndLoad.svelte\\\";\\n\\n  let urlhost = $stateStore.urlhost;\\n\\n  let bots = [];\\n  let urlbotslist = urlhost + \\\"botslist\\\";\\n  let leadsurl = urlhost + \\\"leads\\\";\\n  let newbot = urlhost + \\\"api/newbot.php\\\";\\n  let api_bots = urlbotslist;\\n\\n  let selectbot;\\n  let leadsdata;\\n  let kolvoleads;\\n  let sumleads;\\n  let srleads;\\n  /////routes\\n  let routIsBotList = true;\\n  let routIsBot = false;\\n  let routIsNewBot = false;\\n\\n  function routBotList() {\\n    $stateStore.rout = \\\"botlist\\\";\\n\\n    $stateStore.selectbotname = \\\"\\\";\\n    routIsBotList = true;\\n    routIsBot = false;\\n    routIsNewBot = false;\\n  }\\n  function routNewBot() {\\n    $stateStore.rout = \\\"newbot\\\";\\n    clearInterval($stateStore.timerIdlist);\\n    //ym(65948110, 'reachGoal', 'begin-createbot');\\n    routIsBotList = false;\\n    routIsBot = false;\\n    routIsNewBot = true;\\n  }\\n  /////end routes\\n  function ismybot(value) {\\n    return value[8] === $authStore.user.uid;\\n  }\\n  onMount(async () => {\\n    const res = await fetch(api_bots, {\\n      headers: {\\n        Accept: \\\"application/json\\\",\\n        \\\"Content-Type\\\": \\\"application/json\\\",\\n      },\\n      method: \\\"get\\\",\\n    })\\n      .then((res) => res.json())\\n      .then((json) => {\\n        bots = json.filter(ismybot);\\n        if (bots == null) {\\n          bots = [];\\n        }\\n        console.log(json);\\n        console.log(bots);\\n      });\\n\\n    const leads = await fetch(leadsurl, {\\n      headers: {\\n        Accept: \\\"application/json\\\",\\n        \\\"Content-Type\\\": \\\"application/json\\\",\\n      },\\n      method: \\\"get\\\",\\n    })\\n      .then((leads) => leads.json())\\n      .then((json) => {\\n        kolvoleads = json.count;\\n        sumleads = json.sum;\\n        srleads = json.sr;\\n      });\\n  });\\n  async function fetch1s() {\\n    const res = await fetch(urlbotslist);\\n    bots = (await res.json()).filter(ismybot);\\n  }\\n  function entryBot(botid) {\\n    console.log(botid);\\n\\n    clearInterval($stateStore.timerIdlist);\\n    selectbot = botid;\\n    $stateStore.selectbotid = botid;\\n    $stateStore.selectbotname = botid;\\n    localStorage.selectbot = botid;\\n    $stateStore.rout = \\\"bot\\\";\\n\\n    //window.location = \\\"/bot?selectbot=\\\"+selectbot;\\n  }\\n  function profitsumproctodaycalc(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[5];\\n    });\\n    return sum;\\n  }\\n  function profitsumproccalc(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[3];\\n    });\\n    return sum;\\n  }\\n  function startbalancescalc(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[6];\\n    });\\n    return sum;\\n  }\\n  function balancescalc(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[7];\\n    });\\n    return sum;\\n  }\\n  function vlozhcalc(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[10];\\n    });\\n    return sum;\\n  }\\n\\n  let selectbotname;\\n  $: pkg = {\\n    urlhost: urlhost,\\n    comission: comission,\\n    urlhost: urlhost,\\n    selectbotname: selectbotname,\\n    routIsBotList: routIsBotList,\\n  };\\n  //$: if (selectbot) {\\n  //    selectbotname = bots.botname;\\n  //}\\n  $: profitsumproctoday = profitsumproctodaycalc(bots).toFixed(2);\\n  $: profitsumproc = profitsumproccalc(bots).toFixed(2);\\n  $: startbalances = startbalancescalc(bots).toFixed(2);\\n  $: balances = balancescalc(bots).toFixed(2);\\n  $: sumprocvlozh = (vlozhcalc(bots) / startbalancescalc(bots)) * 100;\\n\\n  $stateStore.timerIdlist = setInterval(fetch1s, 2000);\\n\\n  $: show = $stateStore.showmenu;\\n  $: selectbotname = $stateStore.selectbotname;\\n  $: urlhost = $stateStore.urlhost;\\n\\n  clearInterval($stateStore.timerId);\\n  routBotList();\\n  //console.log($authStore.user);\\n</script>\\n\\n<main>\\n\\n  <div class=\\\"textitem px-2 py-3\\\">\\n    <div class=\\\"rowbalanceitem balancehead\\\">\\n      <label>Баланс</label>\\n\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Старт</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\\n        px-3 py-1 text-sm font-semibold text-gray-700\\\"\\n      >\\n        {startbalances}\\n      </span>\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Сегодня</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\\n        px-3 py-1 text-sm font-semibold text-gray-700\\\"\\n      >\\n        {balances}\\n      </span>\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Cальдо</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-600 rounded-full px-3 py-1\\n        text-sm font-semibold text-gray-700 dark:text-primary-700\\\"\\n      >\\n        {(balances - startbalances).toFixed(2)}\\n      </span>\\n    </div>\\n  </div>\\n  <div class=\\\"textitem px-2 py-3\\\">\\n    <div class=\\\"rowbalanceitem balancehead\\\">\\n      <label>Сделки</label>\\n\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Кол-во</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\\n        px-3 py-1 text-sm font-semibold text-gray-700\\\"\\n      >\\n        {kolvoleads}\\n      </span>\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Сумма</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\\n        px-3 py-1 text-sm font-semibold text-gray-700\\\"\\n      >\\n        {sumleads}\\n      </span>\\n    </div>\\n    <div class=\\\"rowbalanceitem\\\">\\n      <label>Среднее</label>\\n      <br />\\n      <span\\n        class=\\\"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\\n        px-3 py-1 text-sm font-semibold text-gray-700\\\"\\n      >\\n        {srleads}\\n      </span>\\n    </div>\\n  </div>\\n\\n  <div class=\\\"textitem p-2\\\">\\n    <div class=\\\"leftitem\\\">Прибыль / просадка</div>\\n    &nbsp;&nbsp;\\n    <div class=\\\"centereditem\\\">\\n      Итог\\n      <br />\\n      {profitsumproc} %\\n    </div>\\n    <div class=\\\"centereditem\\\">\\n      Сегодня\\n      <br />\\n      {profitsumproctoday} %\\n    </div>\\n    <div class=\\\"rightitem\\\">\\n      <IndLoad procvlozh={sumprocvlozh} id=\\\"sumprocvlozh\\\" />\\n\\n    </div>\\n  </div>\\n  <div class=\\\"divhr\\\">\\n    <hr width=\\\"400px\\\" />\\n  </div>\\n\\n  <div class=\\\"botslist\\\">\\n\\n    {#each Object.entries(bots) as [id, data]}\\n      <a class=\\\"botitem p-2\\\" href=\\\"botstatuspage\\\" on:click={entryBot(data[1])}>\\n        <div class=\\\"leftitem\\\">{data[1]}</div>\\n\\n        <div class=\\\"centereditem\\\">\\n          <span>{data[2]}</span>\\n          <br />\\n          <span>({data[3]} %)</span>\\n          <br />\\n        </div>\\n        <div class=\\\"centereditem\\\">\\n          <span>{data[4]}</span>\\n          <br />\\n          <span>({data[5]} %)</span>\\n          <br />\\n        </div>\\n        <div class=\\\"rightitem\\\">\\n\\n          <IndLoad procvlozh={data[9]} {id} onoff={data[0]} />\\n\\n        </div>\\n\\n      </a>\\n    {:else}\\n      <!-- этот блок отрисовывается, пока photos.length === 0 -->\\n      <p>Ни одного бота не создано</p>\\n    {/each}\\n  </div>\\n  <div class=\\\"addknob\\\">\\n    <Button href=\\\"newbot\\\" light outlined on:click={routNewBot}>\\n      &nbsp;Новый бот&nbsp;\\n    </Button>\\n  </div>\\n\\n</main>\\n\\n<style>\\n  .divhr {\\n    display: flex;\\n    width: 400px;\\n    height: 10px;\\n    margin-left: auto;\\n    margin-right: auto;\\n  }\\n  .balancehead {\\n    padding-top: 28px;\\n  }\\n  .rowbalanceitem {\\n    padding-left: 10px;\\n    text-align: center;\\n    line-height: 30px;\\n  }\\n  .centereditem {\\n    text-align: center;\\n    min-width: 23%;\\n    border: 0px solid;\\n  }\\n  .addknob {\\n    display: flex;\\n    justify-content: center;\\n    margin-right: 10px;\\n    margin-left: 10px;\\n    margin-top: 10px;\\n  }\\n  main {\\n    text-align: center;\\n  }\\n  .botslist {\\n    width: 100%;\\n    display: grid;\\n    grid-template-columns: repeat(1, 1fr);\\n    grid-gap: 1px;\\n    grid-template-rows: auto 1fr;\\n    margin: 0px;\\n    padding: 0px;\\n  }\\n  .botitem {\\n    display: flex;\\n    width: 400px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    justify-content: space-between;\\n  }\\n  .textitem {\\n    display: flex;\\n    width: 400px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    justify-content: space-between;\\n  }\\n  .leftitem {\\n    border: 0px solid;\\n    text-align: left;\\n    max-width: 30%;\\n  }\\n  .rightitem {\\n    border: 0px solid;\\n    text-align: right;\\n    width: 40px;\\n    display: flex;\\n    flex-grow: 1;\\n    align-items: center;\\n  }\\n  .botitem:hover {\\n    background-color: rgba(255, 228, 196, 0.342);\\n  }\\n  @media (min-width: 640px) {\\n    main {\\n      max-width: none;\\n    }\\n  }\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAkTE,MAAM,cAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,AACpB,CAAC,AACD,YAAY,cAAC,CAAC,AACZ,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,eAAe,cAAC,CAAC,AACf,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,aAAa,cAAC,CAAC,AACb,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,GAAG,CACd,MAAM,CAAE,GAAG,CAAC,KAAK,AACnB,CAAC,AACD,QAAQ,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,YAAY,CAAE,IAAI,CAClB,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,IAAI,cAAC,CAAC,AACJ,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,SAAS,cAAC,CAAC,AACT,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,CACrC,QAAQ,CAAE,GAAG,CACb,kBAAkB,CAAE,IAAI,CAAC,GAAG,CAC5B,MAAM,CAAE,GAAG,CACX,OAAO,CAAE,GAAG,AACd,CAAC,AACD,QAAQ,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,KAAK,CACZ,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,eAAe,CAAE,aAAa,AAChC,CAAC,AACD,SAAS,cAAC,CAAC,AACT,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,KAAK,CACZ,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,eAAe,CAAE,aAAa,AAChC,CAAC,AACD,SAAS,cAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,GAAG,AAChB,CAAC,AACD,UAAU,cAAC,CAAC,AACV,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,KAAK,CACjB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,CAAC,CACZ,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,sBAAQ,MAAM,AAAC,CAAC,AACd,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,KAAK,CAAC,AAC9C,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,IAAI,cAAC,CAAC,AACJ,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC\"}"
};

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

const BotsList = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	let $authStore = get_store_value(authStore);
	let { comission } = $$props;
	let { show } = $$props;
	let urlhost = $stateStore.urlhost;
	let bots = [];
	let urlbotslist = urlhost + "botslist";
	let leadsurl = urlhost + "leads";
	let api_bots = urlbotslist;
	let kolvoleads;
	let sumleads;
	let srleads;

	function routBotList() {
		$stateStore.rout = "botlist";
		$stateStore.selectbotname = "";
	}

	/////end routes
	function ismybot(value) {
		return value[8] === $authStore.user.uid;
	}

	onMount(async () => {
		const res = await fetch(api_bots, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			method: "get"
		}).then(res => res.json()).then(json => {
			bots = json.filter(ismybot);

			if (bots == null) {
				bots = [];
			}

			console.log(json);
			console.log(bots);
		});

		const leads = await fetch(leadsurl, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			method: "get"
		}).then(leads => leads.json()).then(json => {
			kolvoleads = json.count;
			sumleads = json.sum;
			srleads = json.sr;
		});
	});

	async function fetch1s() {
		const res = await fetch(urlbotslist);
		bots = (await res.json()).filter(ismybot);
	}

	let selectbotname;
	$stateStore.timerIdlist = setInterval(fetch1s, 2000);
	clearInterval($stateStore.timerId);
	routBotList();
	if ($$props.comission === void 0 && $$bindings.comission && comission !== void 0) $$bindings.comission(comission);
	if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
	$$result.css.add(css$6);
	urlhost = $stateStore.urlhost;
	selectbotname = $stateStore.selectbotname;

	let profitsumproctoday = profitsumproctodaycalc(bots).toFixed(2);
	let profitsumproc = profitsumproccalc(bots).toFixed(2);
	let startbalances = startbalancescalc(bots).toFixed(2);
	let balances = balancescalc(bots).toFixed(2);
	let sumprocvlozh = vlozhcalc(bots) / startbalancescalc(bots) * 100;
	show = $stateStore.showmenu;

	return `<main class="${"svelte-upqpsm"}"><div class="${"textitem px-2 py-3 svelte-upqpsm"}"><div class="${"rowbalanceitem balancehead svelte-upqpsm"}"><label>Баланс</label></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Старт</label>
      <br>
      <span class="${"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\n        px-3 py-1 text-sm font-semibold text-gray-700"}">${escape(startbalances)}</span></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Сегодня</label>
      <br>
      <span class="${"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\n        px-3 py-1 text-sm font-semibold text-gray-700"}">${escape(balances)}</span></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Cальдо</label>
      <br>
      <span class="${"border-solid border-2 border-gray-600 rounded-full px-3 py-1\n        text-sm font-semibold text-gray-700 dark:text-primary-700"}">${escape((balances - startbalances).toFixed(2))}</span></div></div>
  <div class="${"textitem px-2 py-3 svelte-upqpsm"}"><div class="${"rowbalanceitem balancehead svelte-upqpsm"}"><label>Сделки</label></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Кол-во</label>
      <br>
      <span class="${"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\n        px-3 py-1 text-sm font-semibold text-gray-700"}">${escape(kolvoleads)}</span></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Сумма</label>
      <br>
      <span class="${"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\n        px-3 py-1 text-sm font-semibold text-gray-700"}">${escape(sumleads)}</span></div>
    <div class="${"rowbalanceitem svelte-upqpsm"}"><label>Среднее</label>
      <br>
      <span class="${"border-solid border-2 border-gray-200 bg-gray-200 rounded-full\n        px-3 py-1 text-sm font-semibold text-gray-700"}">${escape(srleads)}</span></div></div>

  <div class="${"textitem p-2 svelte-upqpsm"}"><div class="${"leftitem svelte-upqpsm"}">Прибыль / просадка</div>
      
    <div class="${"centereditem svelte-upqpsm"}">Итог
      <br>
      ${escape(profitsumproc)} %
    </div>
    <div class="${"centereditem svelte-upqpsm"}">Сегодня
      <br>
      ${escape(profitsumproctoday)} %
    </div>
    <div class="${"rightitem svelte-upqpsm"}">${validate_component(IndLoad, "IndLoad").$$render(
		$$result,
		{
			procvlozh: sumprocvlozh,
			id: "sumprocvlozh"
		},
		{},
		{}
	)}</div></div>
  <div class="${"divhr svelte-upqpsm"}"><hr width="${"400px"}"></div>

  <div class="${"botslist svelte-upqpsm"}">${Object.entries(bots).length
	? each(Object.entries(bots), ([id, data]) => `<a class="${"botitem p-2 svelte-upqpsm"}" href="${"botstatuspage"}"><div class="${"leftitem svelte-upqpsm"}">${escape(data[1])}</div>

        <div class="${"centereditem svelte-upqpsm"}"><span>${escape(data[2])}</span>
          <br>
          <span>(${escape(data[3])} %)</span>
          <br></div>
        <div class="${"centereditem svelte-upqpsm"}"><span>${escape(data[4])}</span>
          <br>
          <span>(${escape(data[5])} %)</span>
          <br></div>
        <div class="${"rightitem svelte-upqpsm"}">${validate_component(IndLoad, "IndLoad").$$render($$result, { procvlozh: data[9], id, onoff: data[0] }, {}, {})}</div>

      </a>`)
	: `
      <p>Ни одного бота не создано</p>`}</div>
  <div class="${"addknob svelte-upqpsm"}">${validate_component(Button, "Button").$$render(
		$$result,
		{
			href: "newbot",
			light: true,
			outlined: true
		},
		{},
		{
			default: () => ` Новый бот 
    `
		}
	)}</div>

</main>`;
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
    return typeof x === 'function';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = /*@__PURE__*/ new Error();
            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
    setTimeout(function () { throw err; }, 0);
}

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError(err);
        }
    },
    complete: function () { }
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
    return x !== null && typeof x === 'object';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
})();
var UnsubscriptionError = UnsubscriptionErrorImpl;

/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
var Subscription = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        }
        else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
                var parent_1 = _parentOrParents[index];
                parent_1.remove(this);
            }
        }
        if (isFunction(_unsubscribe)) {
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        errors = errors || [];
                        if (e instanceof UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        var subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        var _parentOrParents = subscription._parentOrParents;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        }
        else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        }
        else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        }
        else {
            return subscription;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        }
        else {
            subscriptions.push(subscription);
        }
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = /*@__PURE__*/ (function () {
    return typeof Symbol === 'function'
        ? /*@__PURE__*/ Symbol('rxSubscriber')
        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
})();

/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = /*@__PURE__*/ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _parentOrParents = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    };
    return Subscriber;
}(Subscription));
var SafeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== empty) {
                context = Object.create(observerOrNext);
                if (isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}

/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber]) {
            return nextOrObserver[rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber(empty);
    }
    return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
    return x;
}

/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
var Observable = /*@__PURE__*/ (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor =  Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    return ObjectUnsubscribedErrorImpl;
})();
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var SubjectSubscription = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.subscriber = subscriber;
        _this.closed = false;
        return _this;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(Subscriber));
var Subject = /*@__PURE__*/ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = /*@__PURE__*/ (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
var Action = /*@__PURE__*/ (function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    Action.prototype.schedule = function (state, delay) {
        return this;
    };
    return Action;
}(Subscription));

/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
var AsyncAction = /*@__PURE__*/ (function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (this.closed) {
            return this;
        }
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        this.pending = true;
        this.delay = delay;
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        clearInterval(id);
        return undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action));

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
var QueueAction = /*@__PURE__*/ (function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction));

var Scheduler = /*@__PURE__*/ (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    Scheduler.now = function () { return Date.now(); };
    return Scheduler;
}());

/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
var AsyncScheduler = /*@__PURE__*/ (function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler(SchedulerAction, now) {
        if (now === void 0) {
            now = Scheduler.now;
        }
        var _this = _super.call(this, SchedulerAction, function () {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                return AsyncScheduler.delegate.now();
            }
            else {
                return now();
            }
        }) || this;
        _this.actions = [];
        _this.active = false;
        _this.scheduled = undefined;
        return _this;
    }
    AsyncScheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
            delay = 0;
        }
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        }
        else {
            return _super.prototype.schedule.call(this, work, delay, state);
        }
    };
    AsyncScheduler.prototype.flush = function (action) {
        var actions = this.actions;
        if (this.active) {
            actions.push(action);
            return;
        }
        var error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift());
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    return AsyncScheduler;
}(Scheduler));

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
var QueueScheduler = /*@__PURE__*/ (function (_super) {
    __extends(QueueScheduler, _super);
    function QueueScheduler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler;
}(AsyncScheduler));

/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
var queueScheduler = /*@__PURE__*/ new QueueScheduler(QueueAction);
var queue = queueScheduler;

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
function empty$1(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
    return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = function (array) {
    return function (subscriber) {
        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
            subscriber.next(array[i]);
        }
        subscriber.complete();
    };
};

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function scheduleArray(input, scheduler) {
    return new Observable(function (subscriber) {
        var sub = new Subscription();
        var i = 0;
        sub.add(scheduler.schedule(function () {
            if (i === input.length) {
                subscriber.complete();
                return;
            }
            subscriber.next(input[i++]);
            if (!subscriber.closed) {
                sub.add(this.schedule());
            }
        }));
        return sub;
    });
}

/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
function fromArray(input, scheduler) {
    if (!scheduler) {
        return new Observable(subscribeToArray(input));
    }
    else {
        return scheduleArray(input, scheduler);
    }
}

/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */
function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = args[args.length - 1];
    if (isScheduler(scheduler)) {
        args.pop();
        return scheduleArray(args, scheduler);
    }
    else {
        return fromArray(args);
    }
}

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function throwError(error, scheduler) {
    if (!scheduler) {
        return new Observable(function (subscriber) { return subscriber.error(error); });
    }
    else {
        return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
    }
}
function dispatch(_a) {
    var error = _a.error, subscriber = _a.subscriber;
    subscriber.error(error);
}

/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
var Notification = /*@__PURE__*/ (function () {
    function Notification(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return of(this.value);
            case 'E':
                return throwError(this.error);
            case 'C':
                return empty$1();
        }
        throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());

/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
        if (delay === void 0) {
            delay = 0;
        }
        var _this = _super.call(this, destination) || this;
        _this.scheduler = scheduler;
        _this.delay = delay;
        return _this;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
        var notification = arg.notification, destination = arg.destination;
        notification.observe(destination);
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
        var destination = this.destination;
        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
        this.scheduleMessage(Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
        this.scheduleMessage(Notification.createError(err));
        this.unsubscribe();
    };
    ObserveOnSubscriber.prototype._complete = function () {
        this.scheduleMessage(Notification.createComplete());
        this.unsubscribe();
    };
    return ObserveOnSubscriber;
}(Subscriber));
var ObserveOnMessage = /*@__PURE__*/ (function () {
    function ObserveOnMessage(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
    return ObserveOnMessage;
}());

/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
var ReplaySubject = /*@__PURE__*/ (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
        }
        if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
        }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        }
        else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject));
var ReplayEvent = /*@__PURE__*/ (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());

// create subject to replay/emit the Firebase instance to all new subscribers
const firebaseApp$ = new ReplaySubject(1);

/* src/components/SignInButton.svelte generated by Svelte v3.24.0 */

const SignInButton = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { provider } = $$props;
	if ($$props.provider === void 0 && $$bindings.provider && provider !== void 0) $$bindings.provider(provider);

	return `${provider === "google"
	? `${validate_component(Button, "Button").$$render($$result, { outlined: true }, {}, { default: () => `Sign in` })}`
	: `<div>No provider was provided as a prop</div>`}`;
});

/* src/routes/index.svelte generated by Svelte v3.24.0 */

const Routes = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	//  let userid = $authStore.user.uid;
	const pkg = {
		//urlhost: urlhost,
		//urlhostkeys:'https://dev.localhost/usersettings/',
		//urlhost: 'http://localhost/bbot/',
		comission: 0.15
	};

	return `${($$result.head += `${($$result.title = `<title>Ti Trading Bot v1</title>`, "")}`, "")}
  


${ `${validate_component(BotsList, "BotsList").$$render($$result, Object.assign(pkg), {}, {})}`
	}`;
});

/* src/components/Switchonoff.svelte generated by Svelte v3.24.0 */
const trackClassesDefault$1 = "relative w-10 h-auto z-0 rounded-full overflow-visible flex items-center justify-center";
const thumbClassesDefault$1 = "rounded-full p-2 w-5 h-5 absolute elevation-3 duration-100";
const labelClassesDefault$1 = "pl-2 cursor-pointer";

const Switchonoff = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	const classesDefault = `inline-flex items-center mb-2 cursor-pointer z-10`;
	let { value = false } = $$props;
	let { label = "" } = $$props;
	let { color = "primary" } = $$props;
	let { disabled = false } = $$props;
	let { trackClasses = trackClassesDefault$1 } = $$props;
	let { thumbClasses = thumbClassesDefault$1 } = $$props;
	let { labelClasses = labelClassesDefault$1 } = $$props;
	let { classes = classesDefault } = $$props;
	const cb = new ClassBuilder(classes, classesDefault);
	const trcb = new ClassBuilder(trackClasses, trackClassesDefault$1);
	const thcb = new ClassBuilder(thumbClasses, thumbClassesDefault$1);
	const lcb = new ClassBuilder(labelClasses, labelClassesDefault$1);

	if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
	if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
	if ($$props.trackClasses === void 0 && $$bindings.trackClasses && trackClasses !== void 0) $$bindings.trackClasses(trackClasses);
	if ($$props.thumbClasses === void 0 && $$bindings.thumbClasses && thumbClasses !== void 0) $$bindings.thumbClasses(thumbClasses);
	if ($$props.labelClasses === void 0 && $$bindings.labelClasses && labelClasses !== void 0) $$bindings.labelClasses(labelClasses);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	let c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
	let tr = trcb.flush().add("bg-gray-700", !value).add(`bg-${color}-200`, value).add(trackClasses, true, trackClassesDefault$1).get();
	let th = thcb.flush().add(thumbClasses, true, thumbClassesDefault$1).add("bg-white left-0", !value).add(`bg-${color}-400`, value).get();
	let l = lcb.flush().add(labelClasses, true, labelClassesDefault$1).add("text-gray-500", disabled).add("text-gray-700", !disabled).get();

	return `<div${add_attribute("class", c, 0)}><input class="${"hidden"}" type="${"checkbox"}"${add_attribute("value", value, 1)}>
  <div${add_attribute("class", tr, 0)}><div class="${"w-full h-full absolute"}"></div>
    ${validate_component(Ripple, "Ripple").$$render(
		$$result,
		{
			color: value && !disabled ? color : "gray",
			noHover: true
		},
		{},
		{
			default: () => `<div${add_attribute("class", th, 0)}${add_attribute("style", value ? "left: 1.25rem" : "", 0)}></div>`
		}
	)}</div>
  <label aria-hidden="${"true"}"${add_attribute("class", l, 0)}>${escape(label)}</label></div>`;
});

/* node_modules/smelte/src/components/ProgressLinear/ProgressLinear.svelte generated by Svelte v3.24.0 */

const css$7 = {
	code: ".inc.svelte-mguqwa{animation:svelte-mguqwa-increase 2s ease-in-out infinite}.dec.svelte-mguqwa{animation:svelte-mguqwa-decrease 2s 0.9s ease-in-out infinite}@keyframes svelte-mguqwa-increase{from{left:-5%;width:5%}to{left:130%;width:150%}}@keyframes svelte-mguqwa-decrease{from{left:-90%;width:90%}to{left:110%;width:10%}}",
	map: "{\"version\":3,\"file\":\"ProgressLinear.svelte\",\"sources\":[\"ProgressLinear.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from \\\"svelte\\\";\\n  import { slide } from \\\"svelte/transition\\\";\\n\\n  export let app = false;\\n  export let progress = 0;\\n  export let color = \\\"primary\\\";\\n\\n  let initialized = false;\\n\\n  onMount(() => {\\n    if (!app) return;\\n\\n    setTimeout(() => {\\n      initialized = true;\\n    }, 200);\\n  });\\n</script>\\n\\n<style>\\n  /* kudos https://codepen.io/shalimano/pen/wBmNGJ */\\n  .inc {\\n    animation: increase 2s ease-in-out infinite;\\n  }\\n  .dec {\\n    animation: decrease 2s 0.9s ease-in-out infinite;\\n  }\\n\\n  @keyframes increase {\\n    from {\\n      left: -5%;\\n      width: 5%;\\n    }\\n    to {\\n      left: 130%;\\n      width: 150%;\\n    }\\n  }\\n  @keyframes decrease {\\n    from {\\n      left: -90%;\\n      width: 90%;\\n    }\\n    to {\\n      left: 110%;\\n      width: 10%;\\n    }\\n  }\\n</style>\\n\\n<div\\n  class:fixed={app}\\n  class:z-50={app}\\n  class=\\\"top-0 left-0 w-full h-1 bg-{color}-100 overflow-hidden relative\\\"\\n  class:hidden={app && !initialized}\\n  transition:slide={{ duration: 300 }}>\\n  <div\\n    class=\\\"bg-{color}-500 h-1 absolute\\\"\\n    class:inc={!progress}\\n    class:transition={progress}\\n    style={progress ? `width: ${progress}%` : \\\"\\\"} />\\n  <div class=\\\"bg-{color}-500 h-1 absolute dec\\\" class:hidden={progress} />\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAqBE,IAAI,cAAC,CAAC,AACJ,SAAS,CAAE,sBAAQ,CAAC,EAAE,CAAC,WAAW,CAAC,QAAQ,AAC7C,CAAC,AACD,IAAI,cAAC,CAAC,AACJ,SAAS,CAAE,sBAAQ,CAAC,EAAE,CAAC,IAAI,CAAC,WAAW,CAAC,QAAQ,AAClD,CAAC,AAED,WAAW,sBAAS,CAAC,AACnB,IAAI,AAAC,CAAC,AACJ,IAAI,CAAE,GAAG,CACT,KAAK,CAAE,EAAE,AACX,CAAC,AACD,EAAE,AAAC,CAAC,AACF,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,AACb,CAAC,AACH,CAAC,AACD,WAAW,sBAAS,CAAC,AACnB,IAAI,AAAC,CAAC,AACJ,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,GAAG,AACZ,CAAC,AACD,EAAE,AAAC,CAAC,AACF,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,GAAG,AACZ,CAAC,AACH,CAAC\"}"
};

const ProgressLinear = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { app = false } = $$props;
	let { progress = 0 } = $$props;
	let { color = "primary" } = $$props;
	let initialized = false;

	onMount(() => {
		if (!app) return;

		setTimeout(
			() => {
				initialized = true;
			},
			200
		);
	});

	if ($$props.app === void 0 && $$bindings.app && app !== void 0) $$bindings.app(app);
	if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0) $$bindings.progress(progress);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	$$result.css.add(css$7);

	return `<div class="${[
		"top-0 left-0 w-full h-1 bg-" + escape(color) + "-100 overflow-hidden relative" + " svelte-mguqwa",
		(app ? "fixed" : "") + " " + (app ? "z-50" : "") + " " + (app && !initialized ? "hidden" : "")
	].join(" ").trim()}"><div class="${[
		"bg-" + escape(color) + "-500 h-1 absolute" + " svelte-mguqwa",
		(!progress ? "inc" : "") + " " + (progress ? "transition" : "")
	].join(" ").trim()}"${add_attribute("style", progress ? `width: ${progress}%` : "", 0)}></div>
  <div class="${[
		"bg-" + escape(color) + "-500 h-1 absolute dec" + " svelte-mguqwa",
		progress ? "hidden" : ""
	].join(" ").trim()}"></div></div>`;
});

/* src/components/BotStatus.svelte generated by Svelte v3.24.0 */

const css$8 = {
	code: ".foolrow.svelte-1atyj0m{width:400px}.padtop5.svelte-1atyj0m{padding-top:14px}.yelowkob.svelte-1atyj0m{border:1px solid rgba(233, 229, 132, 0.74);box-sizing:border-box;box-shadow:0px 3px 5px rgba(209, 192, 104, 0.06);border-radius:5px;margin-left:auto;margin-right:auto;max-width:430px;line-height:1.7em;margin-top:14px;padding-top:5px;padding-left:7px;padding-right:7px}.yelowkob.svelte-1atyj0m:hover{cursor:pointer}table.svelte-1atyj0m{position:relative;width:400px;border-collapse:collapse;border:0px solid;margin-top:14px}td.svelte-1atyj0m{padding:7px 7px 7px 0px}td.svelte-1atyj0m:first-child{border-right:0px solid}.cellleft.svelte-1atyj0m{text-align:left}.borderbootom.svelte-1atyj0m{border-bottom:1px solid}.borderleft.svelte-1atyj0m{border-left:1px solid}.bordernull.svelte-1atyj0m{border:0px solid}label.svelte-1atyj0m{margin-bottom:7px;color:rgb(126, 126, 126)}.foolrow.svelte-1atyj0m{width:400px}.row.svelte-1atyj0m{display:flex;max-width:400px;margin:auto;justify-content:space-between;margin-bottom:5px}.rowbalance.svelte-1atyj0m{display:flex;max-width:400px;margin-left:auto;justify-content:space-between;align-items:flex-end}.rowbalanceitem.svelte-1atyj0m{padding-left:10px;text-align:center}.leftitem.svelte-1atyj0m{border:0px solid;text-align:left}.rightitem.svelte-1atyj0m{border:0px solid;text-align:right}.centereditem.svelte-1atyj0m{border:0px solid;text-align:center}main.svelte-1atyj0m{text-align:center;padding:0px}",
	map: "{\"version\":3,\"file\":\"BotStatus.svelte\",\"sources\":[\"BotStatus.svelte\"],\"sourcesContent\":[\"<script>\\n  import { onMount } from \\\"svelte\\\";\\n  import Switchonoff from \\\"./Switchonoff.svelte\\\";\\n  import Switch from \\\"smelte/src/components/Switch\\\";\\n  import Button from \\\"smelte/src/components/Button\\\";\\n  import TextField from \\\"smelte/src/components/TextField\\\";\\n  import ProgressLinear from \\\"smelte/src/components/ProgressLinear\\\";\\n  import { stateStore } from \\\"../stores/statebot.js\\\";\\n  import { authStore } from \\\"../stores/auth\\\";\\n\\n  var selectbotname = $stateStore.selectbotname;\\n  let urlhost = $stateStore.urlhost;\\n  let userid = $authStore.user.uid;\\n\\n  let botsettingsjson = urlhost + \\\"bot_settings\\\";\\n  let botonoffjson = urlhost + \\\"bot_onoff\\\";\\n  let botonoffjson_togle = urlhost + \\\"bot_onoff_togle\\\";\\n  //let botfinancejson = urlhost + \\\"api/data-finance.php\\\";\\n  //let botfloorsjson = urlhost + \\\"api/data-floors.php\\\";\\n  //let botsalesjson = urlhost + \\\"api/data-sales.php\\\";\\n  let botstatusjson = urlhost + \\\"bot_full\\\";\\n  let changesettingsjson = urlhost + \\\"api/changesettings.php\\\";\\n  let resetsettingsjson = urlhost + \\\"bot_reset\\\";\\n  let deleteboturl = urlhost + \\\"bot_delete\\\";\\n  //let botfullstatusurl = urlhost + \\\"api/data-fullstatus.php\\\";\\n  let panicsaleurl = urlhost + \\\"bot_panic\\\";\\n\\n  let botfullstatus = [];\\n  let botsettings = [];\\n  let botfinance = [];\\n  let botfloors = [];\\n  let botsales = [];\\n  let botstatus = [];\\n  let botonoff = [];\\n  let last_price = 0;\\n\\n  let salestodayarr = [];\\n  let salesallarr = [];\\n\\n  function loadsettings(selectbotid) {\\n    let myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    let raw = JSON.stringify({ botname: selectbotid });\\n\\n    let requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n\\n    fetch(botsettingsjson, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n\\n        botsettings = result;\\n      })\\n      .catch((error) => console.log(\\\"error\\\", error));\\n  }\\n\\n  function getonoff(selectbotid) {\\n    let myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    let raw = JSON.stringify({ botname: selectbotid });\\n\\n    let requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n\\n    fetch(botonoffjson, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n\\n        botonoff = result;\\n      })\\n      .catch((error) => console.log(\\\"error\\\", error));\\n  }\\n\\n  function savesettings() {\\n    //botsettings.isrunning = !botsettings.isrunning;\\n    fetch(changesettingsjson, {\\n      method: \\\"post\\\",\\n      headers: {\\n        Accept: \\\"application/json, text/plain, */*\\\",\\n        \\\"Content-Type\\\": \\\"application/json\\\",\\n      },\\n      body: JSON.stringify(botsettings),\\n    });\\n\\n    function goback() {\\n      selectbotname = \\\"\\\";\\n      $stateStore.rout = \\\"botlist\\\";\\n    }\\n    setTimeout(goback, 1000);\\n  }\\n\\n  function resetsettings() {\\n    var myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    var raw = JSON.stringify({ botname: selectbotname });\\n    var requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n    fetch(resetsettingsjson, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n      });\\n\\n    function goback() {\\n      selectbotname = \\\"\\\";\\n      $stateStore.rout = \\\"botlist\\\";\\n    }\\n    setTimeout(goback, 1000);\\n  }\\n\\n  function deletebot() {\\n    var myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    var raw = JSON.stringify({\\n      botname: selectbotname,\\n      user_id_from_google: userid,\\n    });\\n    var requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n    fetch(deleteboturl, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n      });\\n    //$stateStore.rout = \\\"botlist\\\";\\n    //window.location = \\\"/\\\";\\n    function goback() {\\n      selectbotname = \\\"\\\";\\n      $stateStore.rout = \\\"botlist\\\";\\n    }\\n    setTimeout(goback, 1000);\\n  }\\n\\n  function panicsale() {\\n    var myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    var raw = JSON.stringify({ botname: selectbotname });\\n    var requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n    fetch(panicsaleurl, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n      });\\n\\n    function goback() {\\n      selectbotname = \\\"\\\";\\n      $stateStore.rout = \\\"botlist\\\";\\n    }\\n    setTimeout(goback, 1000);\\n  }\\n\\n\\n  function sumsales(arr) {\\n    let sum = 0;\\n    arr.forEach((element) => {\\n      sum = sum + element[5];\\n    });\\n    return sum;\\n  }\\n  let bot;\\n  function fetchfullstatus(selectbotid) {\\n    console.log(\\\"selectbotid:\\\" + selectbotid);\\n\\n    let myHeaders2 = new Headers();\\n    myHeaders2.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    let raw2 = JSON.stringify({ botname: selectbotid });\\n\\n    let requestOptions2 = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders2,\\n      body: raw2,\\n      redirect: \\\"follow\\\",\\n    };\\n\\n    fetch(botstatusjson, requestOptions2)\\n      .then((response) => response.json())\\n      .then((result) => {\\n        console.log(result);\\n        last_price = Number(result.status.currentprice);\\n        botstatus = result.status;\\n        //botsettings = result.settings;\\n        botfinance = result.finance;\\n        botfloors = result.floors;\\n        botsales = result.sales;\\n        salestodayarr = botsales.today;\\n        salesallarr = botsales.all;\\n        //botonoff = result.onoff;\\n      })\\n      .catch((error) => console.log(\\\"error\\\", error));\\n  }\\n\\n  function onofftogle() {\\n\\n    var myHeaders = new Headers();\\n    myHeaders.append(\\\"Content-Type\\\", \\\"application/json\\\");\\n\\n    var raw = JSON.stringify({ botname: selectbotname });\\n    var requestOptions = {\\n      method: \\\"POST\\\",\\n      headers: myHeaders,\\n      body: raw,\\n      redirect: \\\"follow\\\",\\n    };\\n    fetch(botonoffjson_togle, requestOptions)\\n      .then((response) => response.json())\\n      .then((result) => {});\\n  }\\n\\n  loadsettings(selectbotname);\\n  //fetch1s();\\n  fetchfullstatus(selectbotname);\\n  getonoff(selectbotname);\\n  const timerId = setInterval(fetchfullstatus, 1000, selectbotname);\\n  $stateStore.timerId = timerId;\\n\\n  $: if (!botstatus) {\\n    botstatus = [];\\n    botstatus.rezhim = \\\"Подключаемся к серверу\\\";\\n  }\\n  let profitsum = 0;\\n  let profitsumproc = 0;\\n  let quotasum = 0;\\n  let basesum = 0;\\n  $: profitsum = (botfinance.depo - botfinance.startdepo).toFixed(\\n    botsettings.digitprice\\n  );\\n  $: profitsumproc = (\\n    (botfinance.depo / botfinance.startdepo) * 100 -\\n    100\\n  ).toFixed(2);\\n  $: quotasum = +botfinance.quotanal + +botfinance.quotainorders;\\n  $: basesum = +botfinance.basenal + +botfinance.baseinorders;\\n  $: profittodayproc = ((salestodaysum / botfinance.startdepo) * 100).toFixed(\\n    2\\n  );\\n\\n  //setInterval(fetch1s, 1000);\\n\\n  let lowq;\\n  let low;\\n  let hight;\\n  let floornumber, f1, f2, f3;\\n  let salesall;\\n  let salesallsum, ordersizeinquota, ordersizeinbase, progress;\\n\\n  $: if (botstatus !== null) {\\n    lowq = botfloors[botstatus.currentfloor - 1];\\n    ordersizeinquota = (\\n      ((botfinance.depo / 100) * botsettings.ordersize) /\\n      botstatus.currentprice\\n    ).toFixed(botsettings.digitq);\\n    ordersizeinbase = (ordersizeinquota * botstatus.currentprice).toFixed(\\n      botsettings.digitprice\\n    );\\n    progress = ((botstatus.currentprice - low) / (hight - low)) * 100;\\n    if (lowq) {\\n      floornumber = lowq[0];\\n      low = lowq[1].toFixed(botsettings.digitprice);\\n      hight = lowq[2].toFixed(botsettings.digitprice);\\n      f1 = lowq[3].toFixed(botsettings.digitprice);\\n      f2 = lowq[4].toFixed(botsettings.digitprice);\\n      f3 = lowq[5].toFixed(botsettings.digitprice);\\n    }\\n  }\\n\\n  $: salestoday = salestodayarr.length;\\n  $: salestodaysum = sumsales(salestodayarr);\\n\\n  $: salesall = salesallarr.length;\\n  $: salesallsum = sumsales(salesallarr);\\n\\n  let openfloors;\\n\\n  function openfloorscalc(floors) {\\n    let count = 0;\\n    let srprice = 0;\\n    let sum = 0;\\n    let res;\\n    floors.forEach(function (item, i, floors) {\\n      if (item[7] === 2 || item[7] === 3) {\\n        count = count + 1;\\n        sum = Number(sum + Number(item[10]));\\n      }\\n    });\\n    if (count > 0) {\\n      srprice = (sum / count).toFixed(botsettings.digitprice);\\n      res = { count: count, sprice: srprice };\\n    } else {\\n      res = { count: count, sprice: srprice };\\n    }\\n\\n    return res;\\n  }\\n  $: openfloors = openfloorscalc(botfloors);\\n</script>\\n\\n<main>\\n\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\">\\n      <div class=\\\"foolrow\\\">\\n        <TextField\\n          label=\\\"Комментарий\\\"\\n          outlined\\n          bind:value={botsettings.comment}\\n        />\\n      </div>\\n    </div>\\n  </div>\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\">\\n      <label>Текущий режим</label>\\n      <br />\\n      <strong class=\\\"bg-white dark:bg-gray-900 text-black dark:text-white\\\">\\n        {botstatus.rezhim}\\n      </strong>\\n    </div>\\n  </div>\\n  {#if botstatus.currentfloor !== 0}\\n    <div class=\\\"row\\\">\\n      <div class=\\\"leftitem\\\">\\n        <nobr>\\n          <label>Этаж</label>\\n          <strong>{floornumber}</strong>\\n          {low} - {hight}&nbsp;&nbsp;\\n        </nobr>\\n      </div>\\n      <div\\n        class=\\\"rightitem\\\"\\n        style=\\\"margin-top: 9px;height:4px; width:100%; background-color: #f5ce54\\\"\\n      >\\n        <ProgressLinear {progress} />\\n      </div>\\n    </div>\\n  {/if}\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\">\\n      <label>Цена</label>\\n      <br />\\n      <span\\n        class=\\\"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-bold\\n        text-gray-800\\\"\\n      >\\n        {last_price}\\n      </span>\\n      <br />\\n    </div>\\n    <div class=\\\"rightitem rowbalance\\\">\\n      <div class=\\\"rowbalanceitem\\\">\\n        <label>Баланс</label>\\n      </div>\\n      <div class=\\\"rowbalanceitem\\\">\\n        <label>Старт</label>\\n        <br />\\n        <span\\n          class=\\\"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm\\n          font-semibold text-gray-700\\\"\\n        >\\n          {botfinance.startdepo}\\n        </span>\\n      </div>\\n      <div class=\\\"rowbalanceitem\\\">\\n        <label>Сегодня</label>\\n        <br />\\n        <span\\n          class=\\\"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm\\n          font-semibold text-gray-700\\\"\\n        >\\n          {botfinance.depo}\\n        </span>\\n      </div>\\n    </div>\\n  </div>\\n  <div class=\\\"yelowkob\\\">\\n    <div class=\\\"row\\\">\\n      <div class=\\\"centereditem\\\">\\n        <label>Прибыль всего</label>\\n        <br />\\n        <span>{profitsum}</span>\\n        <br />\\n        <span>({profitsumproc} %)</span>\\n        <br />\\n      </div>\\n      <div class=\\\"centereditem\\\">\\n        <label>Прибыль сегодня</label>\\n        <br />\\n        <span>{salestodaysum.toFixed(botsettings.digitprice)}</span>\\n        <br />\\n        <span>({profittodayproc} %)</span>\\n        <br />\\n      </div>\\n    </div>\\n  </div>\\n  <div class=\\\"row\\\">\\n    <div class=\\\"centereditem\\\">\\n      <table class=\\\"bordernull\\\">\\n        <tr class=\\\"bordernull\\\">\\n          <td class=\\\"cellleft\\\">\\n            <label>{botsettings.quotacoin} в наличии</label>\\n          </td>\\n          <td class=\\\"cellleft bordernull\\\">{botfinance.quotanal}</td>\\n          <td rowspan=\\\"2\\\" class=\\\"borderbootom borderleft\\\">\\n            {quotasum.toFixed(botsettings.digitq)}\\n            <br />\\n            ({(last_price * quotasum).toFixed(botsettings.digitq)} {botsettings.basecoin})\\n          </td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"borderbootom cellleft\\\">\\n            <label>{botsettings.quotacoin} в ордерах</label>\\n          </td>\\n          <td class=\\\"borderbootom cellleft\\\">{botfinance.quotainorders}</td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"cellleft\\\">\\n            <label>{botsettings.basecoin} в наличии</label>\\n          </td>\\n          <td class=\\\"cellleft bordernull\\\">\\n            {(botfinance.basenal * 1).toFixed(botsettings.digitprice)}\\n          </td>\\n          <td rowspan=\\\"2\\\" class=\\\"borderleft\\\">\\n            {basesum.toFixed(botsettings.digitprice)}\\n          </td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"cellleft\\\">\\n            <label>{botsettings.basecoin} в ордерах</label>\\n          </td>\\n          <td class=\\\"cellleft\\\">{botfinance.baseinorders}</td>\\n        </tr>\\n      </table>\\n    </div>\\n  </div>\\n  <div class=\\\"yelowkob\\\">\\n    <div class=\\\"row\\\">\\n      <div class=\\\"leftitem\\\">\\n        <label>Продажи</label>\\n        <br />\\n        <label>Продажи сегодня</label>\\n        <br />\\n        <label>Ср. прибыль в сделке</label>\\n      </div>\\n      <div class=\\\"rightitem\\\">\\n        {salesall}\\n        <br />\\n        <strong>{salestoday}</strong>\\n        ({salestodaysum.toFixed(botsettings.digitprice)} {botsettings.basecoin})\\n        <br />\\n        {(salesallsum / salesall || 0).toFixed(botsettings.digitprice)}\\n        {botsettings.basecoin}\\n      </div>\\n\\n    </div>\\n  </div>\\n  <div class=\\\"yelowkob\\\">\\n    <div class=\\\"row\\\">\\n      <div class=\\\"leftitem\\\">\\n        <label>Открытых сделок</label>\\n        <br />\\n        <label>Средняя цена закупки</label>\\n      </div>\\n      <div class=\\\"rightitem\\\">\\n        {openfloors.count}\\n        <br />\\n        {openfloors.sprice} {botsettings.basecoin}\\n      </div>\\n\\n    </div>\\n  </div>\\n  <br />\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\" >\\n      <label>{botonoff ? 'Включен' : 'Выключен'}</label>\\n      <br />\\n      <span on:click={onofftogle}><Switchonoff  bind:value={botonoff} /></span>\\n    </div>\\n    <div class=\\\"rightitem\\\">\\n      <label>Запрет на закуп</label>\\n      <br />\\n      <Switch\\n        classes=\\\"inline-flex items-right mb-2 cursor-pointer z-10\\\"\\n        bind:value={botsettings.handyzapretnazakup}\\n      />\\n    </div>\\n\\n  </div>\\n\\n  <!--     <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <TextField outlined bind:value={botsettings.priceforwake} />\\n        </div>\\n        <div class=\\\"rightitemlabel\\\">\\n            <label>Включить когда цена пересечет уровень</label>\\n        </div>\\n    </div> -->\\n\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\">\\n      <label>Объем ордера</label>\\n      <br />\\n      ~ {ordersizeinquota} {botsettings.quotacoin}, {ordersizeinbase} {botsettings.basecoin}\\n    </div>\\n    &nbsp;&nbsp;\\n    <div class=\\\"rightitem\\\">\\n      <TextField\\n        label=\\\"% от депо\\\"\\n        outlined\\n        bind:value={botsettings.ordersize}\\n        size=\\\"10\\\"\\n      />\\n\\n    </div>\\n  </div>\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem\\\">\\n      <TextField label=\\\"MA1, мин\\\" outlined bind:value={botsettings.ma1} />\\n    </div>\\n    &nbsp;&nbsp;\\n    <div class=\\\"rightitem\\\">\\n      <TextField label=\\\"MA2, мин\\\" outlined bind:value={botsettings.ma2} />\\n    </div>\\n  </div>\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem padtop5\\\">\\n      <label>Не закупать, если цена больше</label>\\n    </div>\\n    &nbsp;&nbsp;\\n    <div class=\\\"rightitem\\\">\\n      <TextField\\n        label=\\\"\\\"\\n        outlined\\n        bind:value={botsettings.maxpriceforzakup}\\n        size=\\\"10\\\"\\n      />\\n    </div>\\n  </div>\\n\\n  <div class=\\\"row\\\">\\n    <div class=\\\"leftitem padtop5\\\">\\n      <label>Не закупать, если цена меньше</label>\\n    </div>\\n    <div class=\\\"rightitem\\\">\\n      <TextField\\n        label=\\\"\\\"\\n        outlined\\n        bind:value={botsettings.minpriceforzakup}\\n        size=\\\"10\\\"\\n      />\\n    </div>\\n  </div>\\n\\n  <Button on:click={savesettings} href=\\\"/\\\">Сохранить</Button>\\n  <br />\\n  <br />\\n  <Button color=\\\"alert\\\" on:click={panicsale}>PANICSALE</Button>\\n  <br />\\n  <br />\\n  <Button color=\\\"alert\\\" on:click={resetsettings}>\\n    Сбросить к стартовым настройкам\\n  </Button>\\n  <br />\\n  <br />\\n  <Button color=\\\"alert\\\" on:click={deletebot} href=\\\"/\\\">Удалить</Button>\\n\\n</main>\\n\\n<style type=\\\"text/scss\\\">\\n  .foolrow {\\n    width: 400px;\\n  }\\n  .padtop5 {\\n    padding-top: 14px;\\n  }\\n  .yelowkob {\\n    border: 1px solid rgba(233, 229, 132, 0.74);\\n    box-sizing: border-box;\\n    box-shadow: 0px 3px 5px rgba(209, 192, 104, 0.06);\\n    border-radius: 5px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    max-width: 430px;\\n    line-height: 1.7em;\\n    margin-top: 14px;\\n    padding-top: 5px;\\n    padding-left: 7px;\\n    padding-right: 7px;\\n  }\\n  .yelowkob:hover {\\n    cursor: pointer;\\n  }\\n  table {\\n    position: relative;\\n    width: 400px;\\n    border-collapse: collapse;\\n    border: 0px solid;\\n    margin-top: 14px;\\n  }\\n  td {\\n    padding: 7px 7px 7px 0px;\\n  }\\n  td:first-child {\\n    border-right: 0px solid;\\n  }\\n  .cellleft {\\n    text-align: left;\\n  }\\n  .borderbootom {\\n    border-bottom: 1px solid;\\n  }\\n  .borderleft {\\n    border-left: 1px solid;\\n  }\\n  .bordernull {\\n    border: 0px solid;\\n  }\\n  label {\\n    margin-bottom: 7px;\\n    color: rgb(126, 126, 126);\\n  }\\n  .foolrow {\\n    width: 400px;\\n  }\\n\\n  .row {\\n    display: flex;\\n    max-width: 400px;\\n    margin: auto;\\n    justify-content: space-between;\\n    margin-bottom: 5px;\\n  }\\n  .rowbalance {\\n    display: flex;\\n    max-width: 400px;\\n    margin-left: auto;\\n    justify-content: space-between;\\n    align-items: flex-end;\\n  }\\n  .rowbalanceitem {\\n    padding-left: 10px;\\n    text-align: center;\\n  }\\n  .leftitem {\\n    border: 0px solid;\\n    text-align: left;\\n  }\\n  .rightitem {\\n    border: 0px solid;\\n    text-align: right;\\n  }\\n  .centereditem {\\n    border: 0px solid;\\n    text-align: center;\\n  }\\n  main {\\n    text-align: center;\\n    padding: 0px;\\n  }\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAolBE,QAAQ,eAAC,CAAC,AACR,KAAK,CAAE,KAAK,AACd,CAAC,AACD,QAAQ,eAAC,CAAC,AACR,WAAW,CAAE,IAAI,AACnB,CAAC,AACD,SAAS,eAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CAC3C,UAAU,CAAE,UAAU,CACtB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,CACjD,aAAa,CAAE,GAAG,CAClB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,KAAK,CAClB,UAAU,CAAE,IAAI,CAChB,WAAW,CAAE,GAAG,CAChB,YAAY,CAAE,GAAG,CACjB,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,wBAAS,MAAM,AAAC,CAAC,AACf,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,KAAK,eAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,KAAK,CACZ,eAAe,CAAE,QAAQ,CACzB,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,EAAE,eAAC,CAAC,AACF,OAAO,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,AAC1B,CAAC,AACD,iBAAE,YAAY,AAAC,CAAC,AACd,YAAY,CAAE,GAAG,CAAC,KAAK,AACzB,CAAC,AACD,SAAS,eAAC,CAAC,AACT,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,aAAa,eAAC,CAAC,AACb,aAAa,CAAE,GAAG,CAAC,KAAK,AAC1B,CAAC,AACD,WAAW,eAAC,CAAC,AACX,WAAW,CAAE,GAAG,CAAC,KAAK,AACxB,CAAC,AACD,WAAW,eAAC,CAAC,AACX,MAAM,CAAE,GAAG,CAAC,KAAK,AACnB,CAAC,AACD,KAAK,eAAC,CAAC,AACL,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAC3B,CAAC,AACD,QAAQ,eAAC,CAAC,AACR,KAAK,CAAE,KAAK,AACd,CAAC,AAED,IAAI,eAAC,CAAC,AACJ,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,aAAa,CAC9B,aAAa,CAAE,GAAG,AACpB,CAAC,AACD,WAAW,eAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,IAAI,CACjB,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,QAAQ,AACvB,CAAC,AACD,eAAe,eAAC,CAAC,AACf,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,SAAS,eAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,UAAU,eAAC,CAAC,AACV,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,KAAK,AACnB,CAAC,AACD,aAAa,eAAC,CAAC,AACb,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,IAAI,eAAC,CAAC,AACJ,UAAU,CAAE,MAAM,CAClB,OAAO,CAAE,GAAG,AACd,CAAC\"}"
};

function sumsales(arr) {
	let sum = 0;

	arr.forEach(element => {
		sum = sum + element[5];
	});

	return sum;
}

const BotStatus = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	let $authStore = get_store_value(authStore);
	var selectbotname = $stateStore.selectbotname;
	let urlhost = $stateStore.urlhost;
	let userid = $authStore.user.uid;
	let botsettingsjson = urlhost + "bot_settings";
	let botonoffjson = urlhost + "bot_onoff";

	//let botfinancejson = urlhost + "api/data-finance.php";
	//let botfloorsjson = urlhost + "api/data-floors.php";
	//let botsalesjson = urlhost + "api/data-sales.php";
	let botstatusjson = urlhost + "bot_full";
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
			redirect: "follow"
		};

		fetch(botsettingsjson, requestOptions).then(response => response.json()).then(result => {
			console.log(result);
			botsettings = result;
		}).catch(error => console.log("error", error));
	}

	function getonoff(selectbotid) {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		let raw = JSON.stringify({ botname: selectbotid });

		let requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(botonoffjson, requestOptions).then(response => response.json()).then(result => {
			console.log(result);
			botonoff = result;
		}).catch(error => console.log("error", error));
	}

	function fetchfullstatus(selectbotid) {
		console.log("selectbotid:" + selectbotid);
		let myHeaders2 = new Headers();
		myHeaders2.append("Content-Type", "application/json");
		let raw2 = JSON.stringify({ botname: selectbotid });

		let requestOptions2 = {
			method: "POST",
			headers: myHeaders2,
			body: raw2,
			redirect: "follow"
		};

		fetch(botstatusjson, requestOptions2).then(response => response.json()).then(result => {
			console.log(result);
			last_price = Number(result.status.currentprice);
			botstatus = result.status;

			//botsettings = result.settings;
			botfinance = result.finance;

			botfloors = result.floors;
			botsales = result.sales;
			salestodayarr = botsales.today;
			salesallarr = botsales.all;
		}).catch(error => console.log("error", error)); //botonoff = result.onoff;
	}

	loadsettings(selectbotname);

	//fetch1s();
	fetchfullstatus(selectbotname);

	getonoff(selectbotname);
	const timerId = setInterval(fetchfullstatus, 1000, selectbotname);
	$stateStore.timerId = timerId;
	let profitsum = 0;
	let profitsumproc = 0;
	let quotasum = 0;
	let basesum = 0;

	//setInterval(fetch1s, 1000);
	let lowq;

	let low;
	let hight;
	let floornumber, f1, f2, f3;
	let salesall;
	let salesallsum, ordersizeinquota, ordersizeinbase, progress;
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
			res = { count, sprice: srprice };
		} else {
			res = { count, sprice: srprice };
		}

		return res;
	}

	$$result.css.add(css$8);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;

		 {
			if (!botstatus) {
				botstatus = [];
				botstatus.rezhim = "Подключаемся к серверу";
			}
		}

		profitsum = (botfinance.depo - botfinance.startdepo).toFixed(botsettings.digitprice);
		profitsumproc = (botfinance.depo / botfinance.startdepo * 100 - 100).toFixed(2);
		quotasum = +botfinance.quotanal + +botfinance.quotainorders;
		basesum = +botfinance.basenal + +botfinance.baseinorders;
		let salestodaysum = sumsales(salestodayarr);
		let profittodayproc = (salestodaysum / botfinance.startdepo * 100).toFixed(2);

		 {
			if (botstatus !== null) {
				lowq = botfloors[botstatus.currentfloor - 1];
				ordersizeinquota = (botfinance.depo / 100 * botsettings.ordersize / botstatus.currentprice).toFixed(botsettings.digitq);
				ordersizeinbase = (ordersizeinquota * botstatus.currentprice).toFixed(botsettings.digitprice);
				progress = (botstatus.currentprice - low) / (hight - low) * 100;

				if (lowq) {
					floornumber = lowq[0];
					low = lowq[1].toFixed(botsettings.digitprice);
					hight = lowq[2].toFixed(botsettings.digitprice);
					f1 = lowq[3].toFixed(botsettings.digitprice);
					f2 = lowq[4].toFixed(botsettings.digitprice);
					f3 = lowq[5].toFixed(botsettings.digitprice);
				}
			}
		}

		let salestoday = salestodayarr.length;
		salesall = salesallarr.length;
		salesallsum = sumsales(salesallarr);
		openfloors = openfloorscalc(botfloors);

		$$rendered = `<main class="${"svelte-1atyj0m"}"><div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><div class="${"foolrow svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Комментарий",
				outlined: true,
				value: botsettings.comment
			},
			{
				value: $$value => {
					botsettings.comment = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div></div>
  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Текущий режим</label>
      <br>
      <strong class="${"bg-white dark:bg-gray-900 text-black dark:text-white"}">${escape(botstatus.rezhim)}</strong></div></div>
  ${botstatus.currentfloor !== 0
		? `<div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><nobr><label class="${"svelte-1atyj0m"}">Этаж</label>
          <strong>${escape(floornumber)}</strong>
          ${escape(low)} - ${escape(hight)}  
        </nobr></div>
      <div class="${"rightitem svelte-1atyj0m"}" style="${"margin-top: 9px;height:4px; width:100%; background-color: #f5ce54"}">${validate_component(ProgressLinear, "ProgressLinear").$$render($$result, { progress }, {}, {})}</div></div>`
		: ``}
  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Цена</label>
      <br>
      <span class="${"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-bold\n        text-gray-800"}">${escape(last_price)}</span>
      <br></div>
    <div class="${"rightitem rowbalance svelte-1atyj0m"}"><div class="${"rowbalanceitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Баланс</label></div>
      <div class="${"rowbalanceitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Старт</label>
        <br>
        <span class="${"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm\n          font-semibold text-gray-700"}">${escape(botfinance.startdepo)}</span></div>
      <div class="${"rowbalanceitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Сегодня</label>
        <br>
        <span class="${"inline-block bg-gray-200 rounded-full px-3 py-1 text-sm\n          font-semibold text-gray-700"}">${escape(botfinance.depo)}</span></div></div></div>
  <div class="${"yelowkob svelte-1atyj0m"}"><div class="${"row svelte-1atyj0m"}"><div class="${"centereditem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Прибыль всего</label>
        <br>
        <span>${escape(profitsum)}</span>
        <br>
        <span>(${escape(profitsumproc)} %)</span>
        <br></div>
      <div class="${"centereditem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Прибыль сегодня</label>
        <br>
        <span>${escape(salestodaysum.toFixed(botsettings.digitprice))}</span>
        <br>
        <span>(${escape(profittodayproc)} %)</span>
        <br></div></div></div>
  <div class="${"row svelte-1atyj0m"}"><div class="${"centereditem svelte-1atyj0m"}"><table class="${"bordernull svelte-1atyj0m"}"><tr class="${"bordernull svelte-1atyj0m"}"><td class="${"cellleft svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">${escape(botsettings.quotacoin)} в наличии</label></td>
          <td class="${"cellleft bordernull svelte-1atyj0m"}">${escape(botfinance.quotanal)}</td>
          <td rowspan="${"2"}" class="${"borderbootom borderleft svelte-1atyj0m"}">${escape(quotasum.toFixed(botsettings.digitq))}
            <br>
            (${escape((last_price * quotasum).toFixed(botsettings.digitq))} ${escape(botsettings.basecoin)})
          </td></tr>
        <tr><td class="${"borderbootom cellleft svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">${escape(botsettings.quotacoin)} в ордерах</label></td>
          <td class="${"borderbootom cellleft svelte-1atyj0m"}">${escape(botfinance.quotainorders)}</td></tr>
        <tr><td class="${"cellleft svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">${escape(botsettings.basecoin)} в наличии</label></td>
          <td class="${"cellleft bordernull svelte-1atyj0m"}">${escape((botfinance.basenal * 1).toFixed(botsettings.digitprice))}</td>
          <td rowspan="${"2"}" class="${"borderleft svelte-1atyj0m"}">${escape(basesum.toFixed(botsettings.digitprice))}</td></tr>
        <tr><td class="${"cellleft svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">${escape(botsettings.basecoin)} в ордерах</label></td>
          <td class="${"cellleft svelte-1atyj0m"}">${escape(botfinance.baseinorders)}</td></tr></table></div></div>
  <div class="${"yelowkob svelte-1atyj0m"}"><div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Продажи</label>
        <br>
        <label class="${"svelte-1atyj0m"}">Продажи сегодня</label>
        <br>
        <label class="${"svelte-1atyj0m"}">Ср. прибыль в сделке</label></div>
      <div class="${"rightitem svelte-1atyj0m"}">${escape(salesall)}
        <br>
        <strong>${escape(salestoday)}</strong>
        (${escape(salestodaysum.toFixed(botsettings.digitprice))} ${escape(botsettings.basecoin)})
        <br>
        ${escape((salesallsum / salesall || 0).toFixed(botsettings.digitprice))}
        ${escape(botsettings.basecoin)}</div></div></div>
  <div class="${"yelowkob svelte-1atyj0m"}"><div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Открытых сделок</label>
        <br>
        <label class="${"svelte-1atyj0m"}">Средняя цена закупки</label></div>
      <div class="${"rightitem svelte-1atyj0m"}">${escape(openfloors.count)}
        <br>
        ${escape(openfloors.sprice)} ${escape(botsettings.basecoin)}</div></div></div>
  <br>
  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">${escape(botonoff ? "Включен" : "Выключен")}</label>
      <br>
      <span>${validate_component(Switchonoff, "Switchonoff").$$render(
			$$result,
			{ value: botonoff },
			{
				value: $$value => {
					botonoff = $$value;
					$$settled = false;
				}
			},
			{}
		)}</span></div>
    <div class="${"rightitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Запрет на закуп</label>
      <br>
      ${validate_component(Switch, "Switch").$$render(
			$$result,
			{
				classes: "inline-flex items-right mb-2 cursor-pointer z-10",
				value: botsettings.handyzapretnazakup
			},
			{
				value: $$value => {
					botsettings.handyzapretnazakup = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>

  

  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Объем ордера</label>
      <br>
      ~ ${escape(ordersizeinquota)} ${escape(botsettings.quotacoin)}, ${escape(ordersizeinbase)} ${escape(botsettings.basecoin)}</div>
      
    <div class="${"rightitem svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "% от депо",
				outlined: true,
				size: "10",
				value: botsettings.ordersize
			},
			{
				value: $$value => {
					botsettings.ordersize = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "MA1, мин",
				outlined: true,
				value: botsettings.ma1
			},
			{
				value: $$value => {
					botsettings.ma1 = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>
      
    <div class="${"rightitem svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "MA2, мин",
				outlined: true,
				value: botsettings.ma2
			},
			{
				value: $$value => {
					botsettings.ma2 = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>
  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem padtop5 svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Не закупать, если цена больше</label></div>
      
    <div class="${"rightitem svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "",
				outlined: true,
				size: "10",
				value: botsettings.maxpriceforzakup
			},
			{
				value: $$value => {
					botsettings.maxpriceforzakup = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>

  <div class="${"row svelte-1atyj0m"}"><div class="${"leftitem padtop5 svelte-1atyj0m"}"><label class="${"svelte-1atyj0m"}">Не закупать, если цена меньше</label></div>
    <div class="${"rightitem svelte-1atyj0m"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "",
				outlined: true,
				size: "10",
				value: botsettings.minpriceforzakup
			},
			{
				value: $$value => {
					botsettings.minpriceforzakup = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div>

  ${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, { default: () => `Сохранить` })}
  <br>
  <br>
  ${validate_component(Button, "Button").$$render($$result, { color: "alert" }, {}, { default: () => `PANICSALE` })}
  <br>
  <br>
  ${validate_component(Button, "Button").$$render($$result, { color: "alert" }, {}, {
			default: () => `Сбросить к стартовым настройкам
  `
		})}
  <br>
  <br>
  ${validate_component(Button, "Button").$$render($$result, { color: "alert", href: "/" }, {}, { default: () => `Удалить` })}

</main>`;
	} while (!$$settled);

	return $$rendered;
});

/* src/routes/botstatuspage.svelte generated by Svelte v3.24.0 */

const css$9 = {
	code: ".headblock.svelte-15qh2zc{display:flex;max-width:400px;margin-left:auto;margin-right:auto;justify-content:flex-start;margin-bottom:7px}.itemgrow.svelte-15qh2zc{flex-grow:2}.mainflex.svelte-15qh2zc{display:flex}",
	map: "{\"version\":3,\"file\":\"botstatuspage.svelte\",\"sources\":[\"botstatuspage.svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\n\\n    import { stateStore }  from \\\"../stores/statebot.js\\\"\\n    import BotStatus from '../components/BotStatus.svelte';\\n    import { authStore } from '../stores/auth';\\n\\n    import SignInButton from '../components/SignInButton.svelte';\\n</script>\\n\\n\\n<style>\\n    .headblock {\\n        display: flex;\\n        max-width: 400px;\\n        margin-left: auto;\\n        margin-right: auto;\\n        justify-content: flex-start;\\n        margin-bottom: 7px;\\n        \\n    }\\n    .itemgrow {\\n        flex-grow: 2;\\n    }\\n\\n    .mainflex {\\n        display: flex;\\n    }\\n</style>\\n\\n<svelte:head>\\n    <title>Ti Trading Bot</title>\\n</svelte:head>\\n\\n<div class=\\\"mainflex\\\">\\n\\n\\n    <!-- {#if $authStore.status === 'in'} -->\\n    {#if true}\\n        <div class=\\\"headblock\\\">\\n\\n            <div class=\\\"itemgrow\\\">\\n               <BotStatus/>\\n            </div>\\n        </div>\\n    {:else}\\n        <div class=\\\"headblock\\\">\\n\\n            <div class=\\\"itemgrow\\\">\\n                Скачайте бесплатно или войдите в облако\\n                <br />\\n                <br />\\n                <br />\\n                <SignInButton provider={'google'} />\\n            </div>\\n        </div>\\n    {/if}\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAWI,UAAU,eAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,eAAe,CAAE,UAAU,CAC3B,aAAa,CAAE,GAAG,AAEtB,CAAC,AACD,SAAS,eAAC,CAAC,AACP,SAAS,CAAE,CAAC,AAChB,CAAC,AAED,SAAS,eAAC,CAAC,AACP,OAAO,CAAE,IAAI,AACjB,CAAC\"}"
};

const Botstatuspage = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$9);

	return `${($$result.head += `${($$result.title = `<title>Ti Trading Bot</title>`, "")}`, "")}

<div class="${"mainflex svelte-15qh2zc"}">
    ${ `<div class="${"headblock svelte-15qh2zc"}"><div class="${"itemgrow svelte-15qh2zc"}">${validate_component(BotStatus, "BotStatus").$$render($$result, {}, {}, {})}</div></div>`
	}</div>`;
});

/* src/routes/instruction.svelte generated by Svelte v3.24.0 */

const Instruction = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	return `${($$result.head += `${($$result.title = `<title>Инструкция</title>`, "")}`, "")}
<div><h1 class="${"text-2xl text-center mb-4"}">Инструкция</h1>

    <p class="${"text-center"}">This is the &#39;about&#39; page. There&#39;s not much here.</p></div>`;
});

/* src/components/Sett.svelte generated by Svelte v3.24.0 */

const css$a = {
	code: "main.svelte-2uud3p{text-align:center;padding:0px}.foolrow.svelte-2uud3p{width:400px}.row.svelte-2uud3p{display:flex;max-width:400px;margin:auto;justify-content:space-between;margin-bottom:5px}.leftitem.svelte-2uud3p{border:0px solid;text-align:left}.headblock.svelte-2uud3p{display:flex;max-width:400px;margin:auto;justify-content:flex-start;margin-bottom:7px}",
	map: "{\"version\":3,\"file\":\"Sett.svelte\",\"sources\":[\"Sett.svelte\"],\"sourcesContent\":[\"<script>\\n    import { onMount } from 'svelte';\\n    import Switch from 'smelte/src/components/Switch';\\n    import Button from 'smelte/src/components/Button';\\n    import TextField from 'smelte/src/components/TextField';\\n    import { authStore } from '../stores/auth';\\n    //import \\\"smelte/src/tailwind.css\\\";\\n    export let urlhost;\\n\\n    let usersettings = [];\\n    let binancekey, binancesecret, comission;\\n    let getusset = urlhost + 'api/getusersettings.php';\\n    let setusset = urlhost + 'api/setusersettings.php';\\n\\n    console.log(getusset);\\n    onMount(async () => {\\n        let au = $authStore.user.uid;\\n        const res = await fetch(getusset, {\\n            method: 'post',\\n            body: JSON.stringify({ au }),\\n            headers: {\\n                Accept: 'application/json, text/plain, */*',\\n                'Content-Type': 'application/json',\\n                'Access-Control-Allow-Origin': '*',\\n                'Access-Control-Allow-Headers': '*',\\n            },\\n        });\\n        usersettings = await res.json();\\n        console.log(usersettings);\\n        binancekey = usersettings[1];\\n        binancesecret = usersettings[2];\\n        comission = usersettings[3];\\n    });\\n\\n    async function saveSettings() {\\n        await fetch(setusset, {\\n            method: 'post',\\n            headers: {\\n                Accept: 'application/json, text/plain, */*',\\n                'Content-Type': 'application/json',\\n            },\\n            body: JSON.stringify(usersettings),\\n        });\\n        console.log(usersettings, setusset);\\n    }\\n    $: usersettings = [$authStore.user.uid, binancekey, binancesecret, comission];\\n</script>\\n\\n<style type=\\\"text/scss\\\">\\n    main {\\n        text-align: center;\\n\\n        padding: 0px;\\n    }\\n    .foolrow {\\n        width: 400px;\\n    }\\n\\n    .row {\\n        display: flex;\\n        max-width: 400px;\\n        margin: auto;\\n        justify-content: space-between;\\n        margin-bottom: 5px;\\n    }\\n\\n    .leftitem {\\n        border: 0px solid;\\n        text-align: left;\\n    }\\n\\n    .headblock {\\n        display: flex;\\n        max-width: 400px;\\n        margin: auto;\\n        justify-content: flex-start;\\n        margin-bottom: 7px;\\n    }\\n</style>\\n\\n<main>\\n    <br />\\n    <p class=\\\"text-2xl\\\">Настройки</p>\\n    <br />\\n    <div class=\\\"headblock\\\">\\n        <p>Binance API keys</p>\\n        <br />\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <div class=\\\"foolrow\\\">\\n                <TextField label=\\\"Key\\\" outlined bind:value={binancekey} />\\n            </div>\\n        </div>\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <div class=\\\"foolrow\\\">\\n                <TextField bind:value={binancesecret} label=\\\"Secret\\\" outlined />\\n            </div>\\n        </div>\\n    </div>\\n    <div class=\\\"headblock\\\">\\n        <p>Прочие</p>\\n        <br />\\n    </div>\\n    <div class=\\\"row\\\">\\n        <div class=\\\"leftitem\\\">\\n            <div class=\\\"foolrow\\\">\\n                <TextField label=\\\"Comission\\\" outlined bind:value={comission} />\\n            </div>\\n        </div>\\n    </div>\\n    <Button on:click={saveSettings}>Сохранить</Button>\\n</main>\\n\"],\"names\":[],\"mappings\":\"AAiDI,IAAI,cAAC,CAAC,AACF,UAAU,CAAE,MAAM,CAElB,OAAO,CAAE,GAAG,AAChB,CAAC,AACD,QAAQ,cAAC,CAAC,AACN,KAAK,CAAE,KAAK,AAChB,CAAC,AAED,IAAI,cAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,aAAa,CAC9B,aAAa,CAAE,GAAG,AACtB,CAAC,AAED,SAAS,cAAC,CAAC,AACP,MAAM,CAAE,GAAG,CAAC,KAAK,CACjB,UAAU,CAAE,IAAI,AACpB,CAAC,AAED,UAAU,cAAC,CAAC,AACR,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,IAAI,CACZ,eAAe,CAAE,UAAU,CAC3B,aAAa,CAAE,GAAG,AACtB,CAAC\"}"
};

const Sett = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $authStore = get_store_value(authStore);
	let { urlhost } = $$props;
	let usersettings = [];
	let binancekey, binancesecret, comission;
	let getusset = urlhost + "api/getusersettings.php";
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
		binancekey = usersettings[1];
		binancesecret = usersettings[2];
		comission = usersettings[3];
	});

	if ($$props.urlhost === void 0 && $$bindings.urlhost && urlhost !== void 0) $$bindings.urlhost(urlhost);
	$$result.css.add(css$a);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;
		usersettings = [$authStore.user.uid, binancekey, binancesecret, comission];

		$$rendered = `<main class="${"svelte-2uud3p"}"><br>
    <p class="${"text-2xl"}">Настройки</p>
    <br>
    <div class="${"headblock svelte-2uud3p"}"><p>Binance API keys</p>
        <br></div>
    <div class="${"row svelte-2uud3p"}"><div class="${"leftitem svelte-2uud3p"}"><div class="${"foolrow svelte-2uud3p"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Key",
				outlined: true,
				value: binancekey
			},
			{
				value: $$value => {
					binancekey = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div></div>
    <div class="${"row svelte-2uud3p"}"><div class="${"leftitem svelte-2uud3p"}"><div class="${"foolrow svelte-2uud3p"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Secret",
				outlined: true,
				value: binancesecret
			},
			{
				value: $$value => {
					binancesecret = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div></div>
    <div class="${"headblock svelte-2uud3p"}"><p>Прочие</p>
        <br></div>
    <div class="${"row svelte-2uud3p"}"><div class="${"leftitem svelte-2uud3p"}"><div class="${"foolrow svelte-2uud3p"}">${validate_component(TextField, "TextField").$$render(
			$$result,
			{
				label: "Comission",
				outlined: true,
				value: comission
			},
			{
				value: $$value => {
					comission = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div></div></div>
    ${validate_component(Button, "Button").$$render($$result, {}, {}, { default: () => `Сохранить` })}</main>`;
	} while (!$$settled);

	return $$rendered;
});

/* src/routes/settings.svelte generated by Svelte v3.24.0 */

const Settings = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	let $authStore = get_store_value(authStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	const pkg = {
		urlhost: "https://91.228.118.92/back/",
		urlhostkeys: "https://91.228.118.92/usersettings/"
	};

	return `${($$result.head += `${($$result.title = `<title>Настройки</title>`, "")}`, "")}

${$authStore.status === "in"
	? `${validate_component(Sett, "Sett").$$render($$result, Object.assign(pkg), {}, {})}`
	: ``}`;
});

/* src/routes/newbot.svelte generated by Svelte v3.24.0 */

const Newbot = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	let pkg = {
		urlhost: $stateStore.urlhost,
		comission: 0.15
	};

	return `${($$result.head += `${($$result.title = `<title>newbot</title>`, "")}`, "")}

<div class="${"container mx-auto"}">${validate_component(NewBot, "NewBot").$$render($$result, Object.assign(pkg), {}, {})}</div>`;
});

/* src/routes/about.svelte generated by Svelte v3.24.0 */

const About = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);

	return `${($$result.head += `${($$result.title = `<title>About</title>`, "")}`, "")}
<div><h1 class="${"text-2xl text-center mb-4"}">About this site</h1>

    <p class="${"text-center"}">This is the &#39;about&#39; page. There&#39;s not much here.</p></div>`;
});

/* src/routes/blog/index.svelte generated by Svelte v3.24.0 */

const css$b = {
	code: "ul.svelte-1hkq7r7{margin:0 0 1em 0;line-height:1.5}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\n    export function preload({ params, query }) {\\n        return this.fetch(`blog.json`)\\n            .then(r => r.json())\\n            .then(posts => {\\n                return { posts };\\n            });\\n    }\\n</script>\\n\\n<script>\\n    import { stateStore } from '../../stores/statebot.js';\\n    clearInterval($stateStore.timerId);\\n    clearInterval($stateStore.timerIdlist);\\n    \\n    export let posts;\\n</script>\\n\\n<style>\\n    ul {\\n        margin: 0 0 1em 0;\\n        line-height: 1.5;\\n    }\\n</style>\\n\\n<svelte:head>\\n    <title>Blog</title>\\n</svelte:head>\\n\\n<div class=\\\"container mx-auto\\\">\\n    <h1 class=\\\"text-2xl text-center mb-4\\\">Recent posts</h1>\\n\\n    <ul class=\\\"text-center\\\">\\n        {#each posts as post}\\n            <!-- we're using the non-standard `rel=prefetch` attribute to\\ntell Sapper to load the data for the page as soon as\\nthe user hovers over the link or taps it, instead of\\nwaiting for the 'click' event -->\\n            <li>\\n                <a rel=\\\"prefetch\\\" href=\\\"blog/{post.slug}\\\">{post.title}</a>\\n            </li>\\n        {/each}\\n    </ul>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAmBI,EAAE,eAAC,CAAC,AACA,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CACjB,WAAW,CAAE,GAAG,AACpB,CAAC\"}"
};

function preload({ params, query }) {
	return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
		return { posts };
	});
}

const Blog = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	clearInterval($stateStore.timerId);
	clearInterval($stateStore.timerIdlist);
	let { posts } = $$props;
	if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0) $$bindings.posts(posts);
	$$result.css.add(css$b);

	return `${($$result.head += `${($$result.title = `<title>Blog</title>`, "")}`, "")}

<div class="${"container mx-auto"}"><h1 class="${"text-2xl text-center mb-4"}">Recent posts</h1>

    <ul class="${"text-center svelte-1hkq7r7"}">${each(posts, post => `
            <li><a rel="${"prefetch"}" href="${"blog/" + escape(post.slug)}">${escape(post.title)}</a>
            </li>`)}</ul></div>`;
});

/* src/routes/blog/[slug].svelte generated by Svelte v3.24.0 */

async function preload$1({ params, query }) {
	// the `slug` parameter is available because
	// this file is called [slug].svelte
	const res = await this.fetch(`blog/${params.slug}.json`);

	const data = await res.json();

	if (res.status === 200) {
		return { post: data };
	} else {
		this.error(res.status, data.message);
	}
}

const U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { post } = $$props;
	if ($$props.post === void 0 && $$bindings.post && post !== void 0) $$bindings.post(post);

	return `${($$result.head += `${($$result.title = `<title>${escape(post.title)}</title>`, "")}`, "")}

<h1 class="${"text-2xl"}">${escape(post.title)}</h1>

<div class="${"content"}">${post.html}</div>`;
});

/* src/components/MenuUser.svelte generated by Svelte v3.24.0 */

const css$c = {
	code: ".absmenu.svelte-15jeqdb{position:absolute}",
	map: "{\"version\":3,\"file\":\"MenuUser.svelte\",\"sources\":[\"MenuUser.svelte\"],\"sourcesContent\":[\"<script>\\n  import { createEventDispatcher } from 'svelte';\\n  //import { fly } from \\\"svelte/transition\\\";\\n  import { quadOut, quadIn } from 'svelte/easing';\\n  //import List from \\\"../List\\\";\\n  //import TextField from \\\"../TextField\\\";\\n  import { ClassBuilder } from 'smelte/src/utils/classes.js';\\n\\n  const classesDefault = \\\"absolute cursor-pointer\\\";\\n  const listClassesDefault = \\\"absolute top-3 rounded elevation-3 z-20 dark:bg-dark-500\\\";\\n\\n\\n  export let open = false;\\n\\n  export let classes = classesDefault;\\n  export let listClasses = listClassesDefault;\\n\\n\\n\\n\\n  const cb = new ClassBuilder($$props.class);\\n\\n  $: c = cb\\n    .flush()\\n    .add(classes, true, classesDefault)\\n    .add($$props.class)\\n    .get();\\n\\n  const lcb = new ClassBuilder(listClasses, listClassesDefault);\\n\\n  $: l = lcb\\n      .flush()\\n      .get();\\n\\n  const dispatch = createEventDispatcher();\\n\\n  const inProps = { y: 10, duration: 200, easing: quadIn };\\n  const outProps = { y: -10, duration: 100, easing: quadOut, delay: 100 };\\n</script>\\n\\n<style>\\n.absmenu{\\n  position: absolute;\\n}\\n</style>\\n\\n<svelte:window on:click={() => (open = false)} />\\n\\n<div class={c} on:click|stopPropagation>\\n  <slot name=\\\"activator\\\" />\\n  {#if open}\\n  <slot />\\n\\n      {/if}\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAyCA,uBAAQ,CAAC,AACP,QAAQ,CAAE,QAAQ,AACpB,CAAC\"}"
};

const classesDefault$3 = "absolute cursor-pointer";
const listClassesDefault = "absolute top-3 rounded elevation-3 z-20 dark:bg-dark-500";

const MenuUser = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { open = false } = $$props;
	let { classes = classesDefault$3 } = $$props;
	let { listClasses = listClassesDefault } = $$props;
	const cb = new ClassBuilder($$props.class);
	const lcb = new ClassBuilder(listClasses, listClassesDefault);
	const dispatch = createEventDispatcher();

	if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	if ($$props.listClasses === void 0 && $$bindings.listClasses && listClasses !== void 0) $$bindings.listClasses(listClasses);
	$$result.css.add(css$c);
	let c = cb.flush().add(classes, true, classesDefault$3).add($$props.class).get();
	let l = lcb.flush().get();

	return `

<div class="${escape(null_to_empty(c)) + " svelte-15jeqdb"}">${$$slots.activator ? $$slots.activator({}) : ``}
  ${open
	? `${$$slots.default ? $$slots.default({}) : ``}`
	: ``}</div>`;
});

/* src/components/Profile.svelte generated by Svelte v3.24.0 */

const css$d = {
	code: "button.svelte-1djjzqq:active,button.svelte-1djjzqq:focus{outline:none}button.svelte-1djjzqq::-moz-focus-inner{border:0}.menu.svelte-1djjzqq{width:auto;min-width:auto;max-width:14rem;margin-left:-12rem;z-index:1000;padding:0.5rem;border:1px solid #85898b;box-shadow:0 2px 8px 0 rgba(0, 0, 0, 0.15);-moz-box-shadow:0 2px 8px 0 rgba(0, 0, 0, 0.15);-webkit-box-shadow:0 2px 8px 0 rgba(0, 0, 0, 0.15);border-radius:5px;color:#ebebeb}.my-1.svelte-1djjzqq{display:flex;justify-content:flex-end}.fill-current.svelte-1djjzqq:hover{fill:#f0b90b}",
	map: "{\"version\":3,\"file\":\"Profile.svelte\",\"sources\":[\"Profile.svelte\"],\"sourcesContent\":[\"<script>\\n    import Button from 'smelte/src/components/Button';\\n    import MenuUser from './MenuUser.svelte';\\n    import { signOut } from '../firebase';\\n    ///import List from 'smelte/src/components/List';\\n\\n    export let displayName;\\n    export let photoURL;\\n    //export let uid;\\n\\n    let open = false;\\n</script>\\n\\n<style>\\n    button:active,\\n    button:focus {\\n        outline: none;\\n    }\\n    button::-moz-focus-inner {\\n        border: 0;\\n    }\\n\\n    .menu {\\n        width: auto;\\n        min-width: auto;\\n        max-width: 14rem;\\n        margin-left: -12rem;\\n\\n        z-index: 1000;\\n        padding: 0.5rem;\\n\\n        border: 1px solid #85898b;\\n        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\\n        -moz-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\\n        -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\\n\\n        border-radius: 5px;\\n        color: #ebebeb;\\n    }\\n    .my-1 {\\n        display: flex;\\n        justify-content: flex-end;\\n    }\\n    .fill-current:hover {\\n        fill: #f0b90b;\\n    }\\n</style>\\n\\n<MenuUser bind:open>\\n\\n    <div class=\\\"bg-dark-400 dark:bg-dark-400 menu\\\">\\n\\n        <img src={photoURL} class=\\\"h-10 w-10 rounded-full mx-5\\\" alt=\\\"user avatar\\\" />\\n        {displayName}\\n        <hr class=\\\"text-dark-700 m-2\\\" />\\n\\n        <p>Баланс: 100000$</p>\\n        <hr class=\\\"text-dark-700 m-2\\\" />\\n        <a href=\\\"settings\\\">Настройки</a>\\n        <br />\\n        <br />\\n        <button class=\\\"bg-primary-500 hover:bg-primary-300 rounded-lg px-4\\\" on:click={signOut}>\\n            Logout\\n        </button>\\n    </div>\\n    <div slot=\\\"activator\\\" class=\\\"my-1\\\">\\n        <button on:click={() => (open = !open)}>\\n            <svg class=\\\"fill-current w-6 h-6\\\" viewBox=\\\"0 0 20 20\\\">\\n                <path\\n                    fill-rule=\\\"evenodd\\\"\\n                    d=\\\"M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z\\\"\\n                    clip-rule=\\\"evenodd\\\" />\\n            </svg>\\n        </button>\\n    </div>\\n</MenuUser>\\n\"],\"names\":[],\"mappings\":\"AAcI,qBAAM,OAAO,CACb,qBAAM,MAAM,AAAC,CAAC,AACV,OAAO,CAAE,IAAI,AACjB,CAAC,AACD,qBAAM,kBAAkB,AAAC,CAAC,AACtB,MAAM,CAAE,CAAC,AACb,CAAC,AAED,KAAK,eAAC,CAAC,AACH,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,MAAM,CAEnB,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,MAAM,CAEf,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAC3C,eAAe,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAChD,kBAAkB,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAEnD,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,OAAO,AAClB,CAAC,AACD,KAAK,eAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,QAAQ,AAC7B,CAAC,AACD,4BAAa,MAAM,AAAC,CAAC,AACjB,IAAI,CAAE,OAAO,AACjB,CAAC\"}"
};

const Profile = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { displayName } = $$props;
	let { photoURL } = $$props;

	//export let uid;
	let open = false;

	if ($$props.displayName === void 0 && $$bindings.displayName && displayName !== void 0) $$bindings.displayName(displayName);
	if ($$props.photoURL === void 0 && $$bindings.photoURL && photoURL !== void 0) $$bindings.photoURL(photoURL);
	$$result.css.add(css$d);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;

		$$rendered = `${validate_component(MenuUser, "MenuUser").$$render(
			$$result,
			{ open },
			{
				open: $$value => {
					open = $$value;
					$$settled = false;
				}
			},
			{
				activator: () => `<div slot="${"activator"}" class="${"my-1 svelte-1djjzqq"}"><button class="${"svelte-1djjzqq"}"><svg class="${"fill-current w-6 h-6 svelte-1djjzqq"}" viewBox="${"0 0 20 20"}"><path fill-rule="${"evenodd"}" d="${"M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"}" clip-rule="${"evenodd"}"></path></svg></button></div>`,
				default: () => `<div class="${"bg-dark-400 dark:bg-dark-400 menu svelte-1djjzqq"}"><img${add_attribute("src", photoURL, 0)} class="${"h-10 w-10 rounded-full mx-5"}" alt="${"user avatar"}">
        ${escape(displayName)}
        <hr class="${"text-dark-700 m-2"}">

        <p>Баланс: 100000$</p>
        <hr class="${"text-dark-700 m-2"}">
        <a href="${"settings"}">Настройки</a>
        <br>
        <br>
        <button class="${"bg-primary-500 hover:bg-primary-300 rounded-lg px-4 svelte-1djjzqq"}">Logout
        </button></div>
    `
			}
		)}`;
	} while (!$$settled);

	return $$rendered;
});

/* src/components/Login.svelte generated by Svelte v3.24.0 */

const css$e = {
	code: ".knob.svelte-155m2yj{width:auto;display:flex;justify-content:flex-end}.mtmt.svelte-155m2yj{margin-top:-1.1rem;margin-right:2rem}",
	map: "{\"version\":3,\"file\":\"Login.svelte\",\"sources\":[\"Login.svelte\"],\"sourcesContent\":[\"<script>\\n    import { signOut } from '../firebase';\\n    import { authStore } from '../stores/auth';\\n    import Profile from './Profile.svelte';\\n    import SignInButton from './SignInButton.svelte';\\n</script>\\n\\n<style>\\n    .knob {\\n        width: auto;\\n\\n        display: flex;\\n        justify-content: flex-end;\\n    }\\n    .mtmt {\\n        margin-top: -1.1rem;\\n        margin-right: 2rem;\\n    }\\n</style>\\n\\n<section class=\\\"knob\\\">\\n    {#if $authStore.status === 'in'}\\n        <div class=\\\"mtmt\\\">\\n            <Profile {...$authStore.user} />\\n        </div>\\n    {:else}\\n        <SignInButton provider={'google'} />\\n    {/if}\\n</section>\\n\"],\"names\":[],\"mappings\":\"AAQI,KAAK,eAAC,CAAC,AACH,KAAK,CAAE,IAAI,CAEX,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,QAAQ,AAC7B,CAAC,AACD,KAAK,eAAC,CAAC,AACH,UAAU,CAAE,OAAO,CACnB,YAAY,CAAE,IAAI,AACtB,CAAC\"}"
};

const Login = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $authStore = get_store_value(authStore);
	$$result.css.add(css$e);

	return `<section class="${"knob svelte-155m2yj"}">${$authStore.status === "in"
	? `<div class="${"mtmt svelte-155m2yj"}">${validate_component(Profile, "Profile").$$render($$result, Object.assign($authStore.user), {}, {})}</div>`
	: `${validate_component(SignInButton, "SignInButton").$$render($$result, { provider: "google" }, {}, {})}`}</section>`;
});

let darkMode;

function isDarkTheme() {
  if (!window.matchMedia) {
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return true;
  }
}

function dark(value = false, bodyClasses = "mode-dark") {
  if (typeof window === "undefined") return writable(value);

  if (!darkMode) {
    darkMode = writable(value || isDarkTheme());
  }

  return {
    subscribe: darkMode.subscribe,
    set: v => {
      bodyClasses.split(" ").forEach(c => {
        if (v) {
          document.body.classList.add(c);
        } else {
          document.body.classList.remove(c);
        }
      });

      darkMode.set(v);
    }
  };
}

/* node_modules/smelte/src/components/Util/Scrim.svelte generated by Svelte v3.24.0 */

const Scrim = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { opacity = 0.5 } = $$props;
	let { inProps = { duration: 200, easing: quadIn } } = $$props;
	let { outProps = { duration: 200, easing: quadOut } } = $$props;
	if ($$props.opacity === void 0 && $$bindings.opacity && opacity !== void 0) $$bindings.opacity(opacity);
	if ($$props.inProps === void 0 && $$bindings.inProps && inProps !== void 0) $$bindings.inProps(inProps);
	if ($$props.outProps === void 0 && $$bindings.outProps && outProps !== void 0) $$bindings.outProps(outProps);
	return `<div class="${"bg-black fixed top-0 left-0 z-10 w-full h-full"}" style="${"opacity: " + escape(opacity)}"></div>`;
});

const Scrim$1 = Scrim;

function defaultCalc(width) {
  if (width > 1279) {
    return "xl";
  }
  if (width > 1023) {
    return "lg";
  }
  if (width > 767) {
    return "md";
  }
  return "sm";
}

function breakpoint(calcBreakpoint = defaultCalc) {
  if (typeof window === "undefined") return writable("sm");

  const store = writable(calcBreakpoint(window.innerWidth));

  const onResize = ({ target }) => store.set(calcBreakpoint(target.innerWidth));

  window.addEventListener("resize", onResize);
  onDestroy(() => window.removeListener(onResize));

  return {
    subscribe: store.subscribe
  };
}

/* node_modules/smelte/src/components/NavigationDrawer/NavigationDrawer.svelte generated by Svelte v3.24.0 */

const css$f = {
	code: ".drawer.svelte-6qcjcu{min-width:250px}aside.svelte-6qcjcu{height:100vh}",
	map: "{\"version\":3,\"file\":\"NavigationDrawer.svelte\",\"sources\":[\"NavigationDrawer.svelte\"],\"sourcesContent\":[\"<script>\\n  import { fly } from \\\"svelte/transition\\\";\\n  import { quadIn } from \\\"svelte/easing\\\";\\n  import { Scrim } from \\\"../Util\\\";\\n  import breakpoints from \\\"../../breakpoints\\\";\\n  import { ClassBuilder } from \\\"../../utils/classes.js\\\";\\n\\n  const bp = breakpoints();\\n\\n  const classesDefault = \\\"fixed top-0 md:mt-16 w-auto drawer overflow-hidden h-full\\\";\\n  const navClassesDefault = `h-full w-full bg-white dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer\\n    pointer-events-auto overflow-y-auto`;\\n\\n  export let right = false;\\n  export let persistent = false;\\n  export let elevation = true;\\n  export let show = true;\\n  export let classes = classesDefault;\\n  export let navClasses = navClassesDefault;\\n  export let borderClasses = `border-gray-600 ${right ? \\\"border-l\\\" : \\\"border-r\\\"}`;\\n\\n\\n\\n\\n  export let transitionProps = {\\n    duration: 200,\\n    x: -300,\\n    easing: quadIn,\\n    opacity: 1,\\n  };\\n\\n  $: transitionProps.x = right ? 300 : -300;\\n  $: persistent = show = $bp !== \\\"sm\\\";\\n\\n  const cb = new ClassBuilder(classes, classesDefault);\\n\\n  if ($bp === 'sm') show = false;\\n\\n  $: c = cb\\n    .flush()\\n    .add(classes, true, classesDefault)\\n    .add(borderClasses, !elevation && persistent)\\n    .add($$props.class)\\n    .add(\\\"right-0\\\", right)\\n    .add(\\\"left-0\\\", !right)\\n    .add(\\\"pointer-events-none\\\", persistent)\\n    .add(\\\"z-50\\\", !persistent)\\n    .add(\\\"elevation-4\\\", elevation)\\n    .add(\\\"z-20\\\", persistent)\\n    .get();\\n\\n  const ncb = new ClassBuilder(navClasses, navClassesDefault);\\n\\n  $: n = ncb\\n    .flush()\\n    .get();\\n\\n</script>\\n\\n<style>\\n  .drawer {\\n    min-width: 250px;\\n  }\\n\\n  aside {\\n    height: 100vh;\\n  }\\n</style>\\n\\n{#if show}\\n  <aside\\n    class={c}\\n    transition:fly={transitionProps}\\n  >\\n    {#if !persistent}\\n      <Scrim on:click={() => show = false} />\\n    {/if}\\n    <nav\\n      role=\\\"navigation\\\"\\n      class={n}\\n    >\\n      <div class=\\\"w-full\\\">\\n        <slot />\\n      </div>\\n    </nav>\\n  </aside>\\n{/if}\\n\"],\"names\":[],\"mappings\":\"AA4DE,OAAO,cAAC,CAAC,AACP,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,KAAK,cAAC,CAAC,AACL,MAAM,CAAE,KAAK,AACf,CAAC\"}"
};

const classesDefault$4 = "fixed top-0 md:mt-16 w-auto drawer overflow-hidden h-full";

const NavigationDrawer = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $bp;
	const bp = breakpoint();
	$bp = get_store_value(bp);

	const navClassesDefault = `h-full w-full bg-white dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer
    pointer-events-auto overflow-y-auto`;

	let { right = false } = $$props;
	let { persistent = false } = $$props;
	let { elevation = true } = $$props;
	let { show = true } = $$props;
	let { classes = classesDefault$4 } = $$props;
	let { navClasses = navClassesDefault } = $$props;
	let { borderClasses = `border-gray-600 ${right ? "border-l" : "border-r"}` } = $$props;

	let { transitionProps = {
		duration: 200,
		x: -300,
		easing: quadIn,
		opacity: 1
	} } = $$props;

	const cb = new ClassBuilder(classes, classesDefault$4);
	if ($bp === "sm") show = false;
	const ncb = new ClassBuilder(navClasses, navClassesDefault);
	if ($$props.right === void 0 && $$bindings.right && right !== void 0) $$bindings.right(right);
	if ($$props.persistent === void 0 && $$bindings.persistent && persistent !== void 0) $$bindings.persistent(persistent);
	if ($$props.elevation === void 0 && $$bindings.elevation && elevation !== void 0) $$bindings.elevation(elevation);
	if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	if ($$props.navClasses === void 0 && $$bindings.navClasses && navClasses !== void 0) $$bindings.navClasses(navClasses);
	if ($$props.borderClasses === void 0 && $$bindings.borderClasses && borderClasses !== void 0) $$bindings.borderClasses(borderClasses);
	if ($$props.transitionProps === void 0 && $$bindings.transitionProps && transitionProps !== void 0) $$bindings.transitionProps(transitionProps);
	$$result.css.add(css$f);
	$bp = get_store_value(bp);
	transitionProps.x = right ? 300 : -300;
	persistent = show = $bp !== "sm";
	let c = cb.flush().add(classes, true, classesDefault$4).add(borderClasses, !elevation && persistent).add($$props.class).add("right-0", right).add("left-0", !right).add("pointer-events-none", persistent).add("z-50", !persistent).add("elevation-4", elevation).add("z-20", persistent).get();
	let n = ncb.flush().get();

	return `${show
	? `<aside class="${escape(null_to_empty(c)) + " svelte-6qcjcu"}">${!persistent
		? `${validate_component(Scrim$1, "Scrim").$$render($$result, {}, {}, {})}`
		: ``}
    <nav role="${"navigation"}" class="${escape(null_to_empty(n)) + " svelte-6qcjcu"}"><div class="${"w-full"}">${$$slots.default ? $$slots.default({}) : ``}</div></nav></aside>`
	: ``}`;
});

/* node_modules/smelte/src/components/AppBar/AppBar.svelte generated by Svelte v3.24.0 */
let classesDefault$5 = "fixed top-0 w-full items-center flex-wrap flex left-0 z-30 p-0 h-16 elevation-3 bg-primary-300 dark:bg-dark-600";

const AppBar = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { classes = classesDefault$5 } = $$props;
	const cb = new ClassBuilder(classes, classesDefault$5);
	if ($$props.classes === void 0 && $$bindings.classes && classes !== void 0) $$bindings.classes(classes);
	let c = cb.flush().add($$props.class).get();
	return `<header${add_attribute("class", c, 0)}>${$$slots.default ? $$slots.default({}) : ``}</header>`;
});

/* src/routes/_layout.svelte generated by Svelte v3.24.0 */

const css$g = {
	code: ".menu.svelte-1fao8wd{display:flex;flex-direction:column;justify-content:space-between;height:100vh;border-right:1px solid #85898b}.menulast.svelte-1fao8wd{flex:none;text-align:center;margin-bottom:2rem}.chatpriglos.svelte-1fao8wd{display:inline-flex;flex-grow:2;text-align:center;border:1px solid #85898b;border-radius:5px;margin:1rem}.usermenu.svelte-1fao8wd{line-height:inherit}.rastyazhka.svelte-1fao8wd{display:inline-flex;flex-grow:2}.backknob.svelte-1fao8wd{margin-top:1rem;margin-right:1rem}.zagl.svelte-1fao8wd{width:16rem;height:100vh}.mainflex.svelte-1fao8wd{display:flex;margin-left:auto;margin-right:auto;margin-top:3.5rem;justify-content:center}.fill-current.svelte-1fao8wd:hover{fill:#f0b90b}.text-current.svelte-1fao8wd:hover{color:#f0b90b;background-color:#f0bb0b0c}",
	map: "{\"version\":3,\"file\":\"_layout.svelte\",\"sources\":[\"_layout.svelte\"],\"sourcesContent\":[\"\\n<script>\\n\\n//console.log(process.env.SAPPER_APP_HOSTIP);\\n\\n    import { stateStore } from '../stores/statebot.js';\\n    import { authStore } from '../stores/auth';\\n    import Nav from '../components/Nav.svelte';\\n    import Login from '../components/Login.svelte';\\n    import NavigationDrawer from 'smelte/src/components/NavigationDrawer';\\n    import AppBar from 'smelte/src/components/AppBar';\\n    import breakpoints from 'smelte/src/breakpoints';\\n    export let segment;\\n    const bp = breakpoints();\\n    import 'smelte/src/tailwind.css';\\n\\n    import dark from 'smelte/src/dark';\\n\\n    let darkMode = dark();\\n    let showzagl;\\n    \\n    import Button from 'smelte/src/components/Button';\\n    // export let segment;\\n\\n    function showtogle() {\\n        $stateStore.showmenu = !$stateStore.showmenu;\\n        //console.log ($stateStore.show);\\n        return $stateStore.showmenu;\\n    }\\n    //console.log(\\\"s_a_hip: \\\" + process.env.SAPPER_APP_HOSTIP);\\n    \\n \\n    //localStorage.setItem('darkmode', 'on');\\n    if ($bp === 'sm') showzagl = false;\\n\\n    function menucloseifnotsm() {\\n        if ($stateStore.showmenu && $bp === 'sm') {\\n            $stateStore.showmenu = false;\\n        }\\n    }\\n\\n     function gohome() {\\n            $stateStore.rout = 'botlist';\\n        }\\n</script>\\n\\n<style>\\n    .menu {\\n        display: flex;\\n        flex-direction: column;\\n        justify-content: space-between;\\n        height: 100vh;\\n        border-right: 1px solid #85898b;\\n    }\\n    .menulast {\\n        flex: none;\\n        text-align: center;\\n        margin-bottom: 2rem;\\n    }\\n    .chatpriglos {\\n       display: inline-flex;\\n        flex-grow: 2;\\n        text-align: center;\\n        border: 1px solid #85898b;\\n        border-radius: 5px;\\n        margin : 1rem;\\n    }\\n    .usermenu {\\n        line-height: inherit;\\n    }\\n    .rastyazhka {\\n        display: inline-flex;\\n        flex-grow: 2;\\n    }\\n    .backknob {\\n        margin-top: 1rem;\\n        margin-right: 1rem;\\n    }\\n\\n    .zagl {\\n        width: 16rem;\\n        height: 100vh;\\n    }\\n    .mainflex {\\n        display: flex;\\n        margin-left: auto;\\n        margin-right: auto;\\n        margin-top: 3.5rem;\\n        justify-content: center;\\n    }\\n    .fill-current:hover {\\n        fill: #f0b90b;\\n    }\\n    .text-current:hover {\\n        color: #f0b90b;\\n        background-color: #f0bb0b0c;\\n    }\\n</style>\\n\\n<AppBar class=\\\"bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0\\\">\\n    <div class=\\\"text-white flex-none\\\">\\n        <a\\n            class=\\\"text-white no-underline hover:text-white hover:no-underline\\\"\\n            aria-current={segment === undefined ? 'page' : undefined}\\n            href=\\\".\\\"\\n            on:click={gohome}>\\n            <svg\\n                width=\\\"45\\\"\\n                height=\\\"45\\\"\\n                viewBox=\\\"0 0 45 45\\\"\\n                fill=\\\"none\\\"\\n                xmlns=\\\"http://www.w3.org/2000/svg\\\">\\n                <g clip-path=\\\"url(#clip0)\\\">\\n                    <path\\n                        fill-rule=\\\"evenodd\\\"\\n                        clip-rule=\\\"evenodd\\\"\\n                        d=\\\"M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631 36.3445L8.96631\\n                        8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552 18.3618L35.2663\\n                        18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552 22.571L30.9552\\n                        29.7173C30.7305 32.6744 32.6316 34.8393 35.2663 34.9937ZM29.9591\\n                        21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194 21.729L21.5194\\n                        34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z\\\"\\n                        fill=\\\"#F0B90B\\\" />\\n                </g>\\n                <defs>\\n                    <clipPath id=\\\"clip0\\\">\\n                        <rect width=\\\"45\\\" height=\\\"45\\\" fill=\\\"white\\\" />\\n                    </clipPath>\\n                </defs>\\n            </svg>\\n\\n        </a>\\n    </div>\\n    <div class=\\\"pr-2 flex-none\\\">\\n        <div on:click={showtogle}>\\n            <svg\\n                class=\\\"fill-current h-6 w-6\\\"\\n                viewBox=\\\"0 0 20 20\\\"\\n                xmlns=\\\"http://www.w3.org/2000/svg\\\">\\n                <title>Menu</title>\\n                <path d=\\\"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z\\\" />\\n            </svg>\\n        </div>\\n    </div>\\n    <div class=\\\"flex-grow text-center\\\">{$stateStore.selectbotname} </div>\\n\\n    <div class=\\\"usermenu flex-none\\\">\\n        <Login />\\n    </div>\\n\\n    <div class=\\\"flex-none\\\">\\n        <Button bind:value={$darkMode} class=\\\"mr-2 ml-2\\\">\\n            <svg\\n                class=\\\"fill-current w-6 h-6\\\"\\n                xmlns=\\\"http://www.w3.org/2000/svg\\\"\\n                viewBox=\\\"0 0 20 20\\\">\\n                <path\\n                    fill-rule=\\\"evenodd\\\"\\n                    d=\\\"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018\\n                    0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414\\n                    1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1\\n                    0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2\\n                    0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414\\n                    1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0\\n                    011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z\\\"\\n                    clip-rule=\\\"evenodd\\\" />\\n            </svg>\\n        </Button>\\n    </div>\\n\\n</AppBar>\\n<NavigationDrawer class=\\\"bg-gray-200 dark:bg-black\\\" bind:show={$stateStore.showmenu} {segment}>\\n    <div class=\\\"menu\\\">\\n        <div class=\\\"flex justify-between\\\">\\n            <a\\n                class=\\\"text-white no-underline hover:text-white hover:no-underline\\\"\\n                aria-current={segment === undefined ? 'page' : undefined}\\n                href=\\\".\\\">\\n                <svg\\n                    width=\\\"95\\\"\\n                    height=\\\"95\\\"\\n                    viewBox=\\\"0 0 45 45\\\"\\n                    fill=\\\"none\\\"\\n                    xmlns=\\\"http://www.w3.org/2000/svg\\\">\\n                    <g clip-path=\\\"url(#clip0)\\\">\\n                        <path\\n                            fill-rule=\\\"evenodd\\\"\\n                            clip-rule=\\\"evenodd\\\"\\n                            d=\\\"M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631\\n                            36.3445L8.96631 8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552\\n                            18.3618L35.2663 18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552\\n                            22.571L30.9552 29.7173C30.7305 32.6744 32.6316 34.8393 35.2663\\n                            34.9937ZM29.9591 21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194\\n                            21.729L21.5194 34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z\\\"\\n                            fill=\\\"#F0B90B\\\" />\\n                    </g>\\n                    <defs>\\n                        <clipPath id=\\\"clip0\\\">\\n                            <rect width=\\\"45\\\" height=\\\"45\\\" fill=\\\"white\\\" />\\n                        </clipPath>\\n                    </defs>\\n                </svg>\\n\\n            </a>\\n            <div class=\\\"backknob\\\">\\n                <div on:click={showtogle}>\\n                    <svg\\n                        class=\\\"fill-current h-6 w-6\\\"\\n                        viewBox=\\\"0 0 20 20\\\"\\n                        xmlns=\\\"http://www.w3.org/2000/svg\\\">\\n                        <path\\n                            d=\\\"M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414\\n                            1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z\\\" />\\n                    </svg>\\n                </div>\\n            </div>\\n        </div>\\n\\n        <a\\n            class=\\\"text-current py-4 px-4 flex-none\\\"\\n            aria-current={segment === 'about' ? 'page' : undefined}\\n            href=\\\"/\\\"\\n            on:click={menucloseifnotsm}>\\n            Главная\\n        </a>\\n        <a\\n            class=\\\"text-current py-4 px-4 flex-none\\\"\\n            aria-current={segment === 'about' ? 'page' : undefined}\\n            href=\\\"about\\\"\\n            on:click={menucloseifnotsm}>\\n            О программе\\n        </a>\\n\\n        <a\\n            class=\\\"py-4 px-4 text-current flex-none\\\"\\n            rel=\\\"prefetch\\\"\\n            aria-current={segment === 'blog' ? 'page' : undefined}\\n            href=\\\"blog\\\"\\n            on:click={menucloseifnotsm}>\\n            Блог\\n        </a>\\n\\n        {#if $authStore.status === 'in'}\\n            <hr />\\n            <a\\n                class=\\\"py-4 px-4 text-current flex-none\\\"\\n                rel=\\\"prefetch\\\"\\n                aria-current={segment === 'blog' ? 'page' : undefined}\\n                href=\\\"/\\\"\\n                on:click={menucloseifnotsm}>\\n                GRID LONG Бот\\n            </a>\\n            <a\\n                class=\\\"py-4 px-4 text-current flex-none\\\"\\n                rel=\\\"prefetch\\\"\\n                aria-current={segment === 'blog' ? 'page' : undefined}\\n                href=\\\"settings\\\"\\n                on:click={menucloseifnotsm}>\\n                Настройки\\n            </a>\\n            <hr />\\n        {/if}\\n\\n        <div class=\\\"rastyazhka\\\">&nbsp;</div>\\n        <div class=\\\"chatpriglos py-4 px-4 text-current flex-none\\\">Вступай в наш чат!</div>\\n        <a\\n            class=\\\"menulast py-4 px-4 text-current flex-none\\\"\\n            rel=\\\"prefetch\\\"\\n            aria-current={segment === 'blog' ? 'page' : undefined}\\n            href=\\\"instruction\\\"\\n            on:click={menucloseifnotsm}>\\n            Инструкция\\n        </a>\\n\\n    </div>\\n</NavigationDrawer>\\n\\n<div class=\\\"mainflex\\\">\\n\\n    {#if $stateStore.showmenu && $bp != 'sm'}\\n        <div class=\\\"zagl\\\">&nbsp;</div>\\n\\n        <slot />\\n    {:else}\\n        <slot />\\n    {/if}\\n</div>\\n\"],\"names\":[],\"mappings\":\"AA+CI,KAAK,eAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,KAAK,CACb,YAAY,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,AACnC,CAAC,AACD,SAAS,eAAC,CAAC,AACP,IAAI,CAAE,IAAI,CACV,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,AACvB,CAAC,AACD,YAAY,eAAC,CAAC,AACX,OAAO,CAAE,WAAW,CACnB,SAAS,CAAE,CAAC,CACZ,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAG,IAAI,AACjB,CAAC,AACD,SAAS,eAAC,CAAC,AACP,WAAW,CAAE,OAAO,AACxB,CAAC,AACD,WAAW,eAAC,CAAC,AACT,OAAO,CAAE,WAAW,CACpB,SAAS,CAAE,CAAC,AAChB,CAAC,AACD,SAAS,eAAC,CAAC,AACP,UAAU,CAAE,IAAI,CAChB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,KAAK,eAAC,CAAC,AACH,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,AACjB,CAAC,AACD,SAAS,eAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAAI,CAClB,UAAU,CAAE,MAAM,CAClB,eAAe,CAAE,MAAM,AAC3B,CAAC,AACD,4BAAa,MAAM,AAAC,CAAC,AACjB,IAAI,CAAE,OAAO,AACjB,CAAC,AACD,4BAAa,MAAM,AAAC,CAAC,AACjB,KAAK,CAAE,OAAO,CACd,gBAAgB,CAAE,SAAS,AAC/B,CAAC\"}"
};

const Layout = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $stateStore = get_store_value(stateStore);
	let $bp;
	let $darkMode;
	let $authStore = get_store_value(authStore);
	let { segment } = $$props;
	const bp = breakpoint();
	$bp = get_store_value(bp);
	let darkMode = dark();
	$darkMode = get_store_value(darkMode);

	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);
	$$result.css.add(css$g);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;
		$bp = get_store_value(bp);
		$darkMode = get_store_value(darkMode);

		$$rendered = `${validate_component(AppBar, "AppBar").$$render(
			$$result,
			{
				class: "bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0"
			},
			{},
			{
				default: () => `<div class="${"text-white flex-none"}"><a class="${"text-white no-underline hover:text-white hover:no-underline"}"${add_attribute("aria-current", segment === undefined ? "page" : undefined, 0)} href="${"."}"><svg width="${"45"}" height="${"45"}" viewBox="${"0 0 45 45"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><g clip-path="${"url(#clip0)"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631 36.3445L8.96631\n                        8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552 18.3618L35.2663\n                        18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552 22.571L30.9552\n                        29.7173C30.7305 32.6744 32.6316 34.8393 35.2663 34.9937ZM29.9591\n                        21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194 21.729L21.5194\n                        34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z"}" fill="${"#F0B90B"}"></path></g><defs><clipPath id="${"clip0"}"><rect width="${"45"}" height="${"45"}" fill="${"white"}"></rect></clipPath></defs></svg></a></div>
    <div class="${"pr-2 flex-none"}"><div><svg class="${"fill-current h-6 w-6 svelte-1fao8wd"}" viewBox="${"0 0 20 20"}" xmlns="${"http://www.w3.org/2000/svg"}"><title>Menu</title><path d="${"M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"}"></path></svg></div></div>
    <div class="${"flex-grow text-center"}">${escape($stateStore.selectbotname)}</div>

    <div class="${"usermenu flex-none svelte-1fao8wd"}">${validate_component(Login, "Login").$$render($$result, {}, {}, {})}</div>

    <div class="${"flex-none"}">${validate_component(Button, "Button").$$render(
					$$result,
					{ class: "mr-2 ml-2", value: $darkMode },
					{
						value: $$value => {
							$darkMode = $$value;
							$$settled = false;
						}
					},
					{
						default: () => `<svg class="${"fill-current w-6 h-6 svelte-1fao8wd"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path fill-rule="${"evenodd"}" d="${"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018\n                    0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414\n                    1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1\n                    0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2\n                    0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414\n                    1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0\n                    011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"}" clip-rule="${"evenodd"}"></path></svg>`
					}
				)}</div>`
			}
		)}
${validate_component(NavigationDrawer, "NavigationDrawer").$$render(
			$$result,
			{
				class: "bg-gray-200 dark:bg-black",
				segment,
				show: $stateStore.showmenu
			},
			{
				show: $$value => {
					$stateStore.showmenu = $$value;
					$$settled = false;
				}
			},
			{
				default: () => `<div class="${"menu svelte-1fao8wd"}"><div class="${"flex justify-between"}"><a class="${"text-white no-underline hover:text-white hover:no-underline"}"${add_attribute("aria-current", segment === undefined ? "page" : undefined, 0)} href="${"."}"><svg width="${"95"}" height="${"95"}" viewBox="${"0 0 45 45"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><g clip-path="${"url(#clip0)"}"><path fill-rule="${"evenodd"}" clip-rule="${"evenodd"}" d="${"M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631\n                            36.3445L8.96631 8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552\n                            18.3618L35.2663 18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552\n                            22.571L30.9552 29.7173C30.7305 32.6744 32.6316 34.8393 35.2663\n                            34.9937ZM29.9591 21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194\n                            21.729L21.5194 34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z"}" fill="${"#F0B90B"}"></path></g><defs><clipPath id="${"clip0"}"><rect width="${"45"}" height="${"45"}" fill="${"white"}"></rect></clipPath></defs></svg></a>
            <div class="${"backknob svelte-1fao8wd"}"><div><svg class="${"fill-current h-6 w-6 svelte-1fao8wd"}" viewBox="${"0 0 20 20"}" xmlns="${"http://www.w3.org/2000/svg"}"><path d="${"M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414\n                            1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"}"></path></svg></div></div></div>

        <a class="${"text-current py-4 px-4 flex-none svelte-1fao8wd"}"${add_attribute("aria-current", segment === "about" ? "page" : undefined, 0)} href="${"/"}">Главная
        </a>
        <a class="${"text-current py-4 px-4 flex-none svelte-1fao8wd"}"${add_attribute("aria-current", segment === "about" ? "page" : undefined, 0)} href="${"about"}">О программе
        </a>

        <a class="${"py-4 px-4 text-current flex-none svelte-1fao8wd"}" rel="${"prefetch"}"${add_attribute("aria-current", segment === "blog" ? "page" : undefined, 0)} href="${"blog"}">Блог
        </a>

        ${$authStore.status === "in"
				? `<hr>
            <a class="${"py-4 px-4 text-current flex-none svelte-1fao8wd"}" rel="${"prefetch"}"${add_attribute("aria-current", segment === "blog" ? "page" : undefined, 0)} href="${"/"}">GRID LONG Бот
            </a>
            <a class="${"py-4 px-4 text-current flex-none svelte-1fao8wd"}" rel="${"prefetch"}"${add_attribute("aria-current", segment === "blog" ? "page" : undefined, 0)} href="${"settings"}">Настройки
            </a>
            <hr>`
				: ``}

        <div class="${"rastyazhka svelte-1fao8wd"}"> </div>
        <div class="${"chatpriglos py-4 px-4 text-current flex-none svelte-1fao8wd"}">Вступай в наш чат!</div>
        <a class="${"menulast py-4 px-4 text-current flex-none svelte-1fao8wd"}" rel="${"prefetch"}"${add_attribute("aria-current", segment === "blog" ? "page" : undefined, 0)} href="${"instruction"}">Инструкция
        </a></div>`
			}
		)}

<div class="${"mainflex svelte-1fao8wd"}">${$stateStore.showmenu && $bp != "sm"
		? `<div class="${"zagl svelte-1fao8wd"}"> </div>

        ${$$slots.default ? $$slots.default({}) : ``}`
		: `${$$slots.default ? $$slots.default({}) : ``}`}</div>`;
	} while (!$$settled);

	return $$rendered;
});

/* src/routes/_error.svelte generated by Svelte v3.24.0 */

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { status } = $$props;
	let { error } = $$props;
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);

	return `${($$result.head += `${($$result.title = `<title>${escape(status)}</title>`, "")}`, "")}

<h1>${escape(status)}</h1>

<p>${escape(error.message)}</p>

${ ``}`;
});

// This file is generated by Sapper — do not edit it!

const d = decodeURIComponent;

const manifest = {
	server_routes: [
		{
			// blog/index.json.js
			pattern: /^\/blog\.json$/,
			handlers: route_0,
			params: () => ({})
		},

		{
			// blog/[slug].json.js
			pattern: /^\/blog\/([^\/]+?)\.json$/,
			handlers: route_1,
			params: match => ({ slug: d(match[1]) })
		}
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: Routes }
			]
		},

		{
			// botstatuspage.svelte
			pattern: /^\/botstatuspage\/?$/,
			parts: [
				{ name: "botstatuspage", file: "botstatuspage.svelte", component: Botstatuspage }
			]
		},

		{
			// instruction.svelte
			pattern: /^\/instruction\/?$/,
			parts: [
				{ name: "instruction", file: "instruction.svelte", component: Instruction }
			]
		},

		{
			// settings.svelte
			pattern: /^\/settings\/?$/,
			parts: [
				{ name: "settings", file: "settings.svelte", component: Settings }
			]
		},

		{
			// newbot.svelte
			pattern: /^\/newbot\/?$/,
			parts: [
				{ name: "newbot", file: "newbot.svelte", component: Newbot }
			]
		},

		{
			// about.svelte
			pattern: /^\/about\/?$/,
			parts: [
				{ name: "about", file: "about.svelte", component: About }
			]
		},

		{
			// blog/index.svelte
			pattern: /^\/blog\/?$/,
			parts: [
				{ name: "blog", file: "blog/index.svelte", component: Blog, preload: preload }
			]
		},

		{
			// blog/[slug].svelte
			pattern: /^\/blog\/([^\/]+?)\/?$/,
			parts: [
				null,
				{ name: "blog_$slug", file: "blog/[slug].svelte", component: U5Bslugu5D, preload: preload$1, params: match => ({ slug: d(match[1]) }) }
			]
		}
	],

	root: Layout,
	root_preload: () => {},
	error: Error$1
};

const build_dir = "__sapper__/build";

const CONTEXT_KEY = {};

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.24.0 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { notify } = $$props;
	afterUpdate(notify);
	setContext(CONTEXT_KEY, stores);
	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);
	if ($$props.notify === void 0 && $$bindings.notify && notify !== void 0) $$bindings.notify(notify);

	return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `${error
		? `${validate_component(Error$1, "Error").$$render($$result, { error, status }, {}, {})}`
		: `${validate_component(level1.component || missing_component, "svelte:component").$$render($$result, Object.assign(level1.props), {}, {})}`}`
	})}`;
});

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var lite = new Mime_1(standard);

function get_server_route_handler(routes) {
	async function handle_route(route, req, res, next) {
		req.params = route.params(route.pattern.exec(req.path));

		const method = req.method.toLowerCase();
		// 'delete' cannot be exported from a module because it is a keyword,
		// so check for 'del' instead
		const method_export = method === 'delete' ? 'del' : method;
		const handle_method = route.handlers[method_export];
		if (handle_method) {
			if (process.env.SAPPER_EXPORT) {
				const { write, end, setHeader } = res;
				const chunks = [];
				const headers = {};

				// intercept data so that it can be exported
				res.write = function(chunk) {
					chunks.push(Buffer.from(chunk));
					write.apply(res, arguments);
				};

				res.setHeader = function(name, value) {
					headers[name.toLowerCase()] = value;
					setHeader.apply(res, arguments);
				};

				res.end = function(chunk) {
					if (chunk) chunks.push(Buffer.from(chunk));
					end.apply(res, arguments);

					process.send({
						__sapper__: true,
						event: 'file',
						url: req.url,
						method: req.method,
						status: res.statusCode,
						type: headers['content-type'],
						body: Buffer.concat(chunks).toString()
					});
				};
			}

			const handle_next = (err) => {
				if (err) {
					res.statusCode = 500;
					res.end(err.message);
				} else {
					process.nextTick(next);
				}
			};

			try {
				await handle_method(req, res, handle_next);
			} catch (err) {
				console.error(err);
				handle_next(err);
			}
		} else {
			// no matching handler for method
			process.nextTick(next);
		}
	}

	return function find_route(req, res, next) {
		for (const route of routes) {
			if (route.pattern.test(req.path)) {
				handle_route(route, req, res, next);
				return;
			}
		}

		next();
	};
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers$1 {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers$1) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers$1.prototype.entries = Headers$1.prototype[Symbol.iterator];

Object.defineProperty(Headers$1.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers$1.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers$1();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers$1(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers$1(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers$1(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch$1(url, opts) {

	// allow custom promise
	if (!fetch$1.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch$1.Promise;

	// wrap http.request into fetch
	return new fetch$1.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch$1.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers$1(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch$1(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch$1.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch$1.Promise = global.Promise;

function get_page_handler(
	manifest,
	session_getter
) {
	const get_build_info =  (assets => () => assets)(JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8')));

	const template =  (str => () => str)(read_template(build_dir));

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  'Internal server error';

		res.statusCode = 500;
		res.end(`<pre>${message}</pre>`);
	}

	function handle_error(req, res, statusCode, error) {
		handle_page({
			pattern: null,
			parts: [
				{ name: null, component: error_route }
			]
		}, req, res, statusCode, error || new Error('Unknown error in preload function'));
	}

	async function handle_page(page, req, res, status = 200, error = null) {
		const is_service_worker_index = req.path === '/service-worker-index.html';
		const build_info




 = get_build_info();

		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control',  'max-age=600');

		// preload main.js and current route
		// TODO detect other stuff we can preload? images, CSS, fonts?
		let preloaded_chunks = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
		if (!error && !is_service_worker_index) {
			page.parts.forEach(part => {
				if (!part) return;

				// using concat because it could be a string or an array. thanks webpack!
				preloaded_chunks = preloaded_chunks.concat(build_info.assets[part.name]);
			});
		}

		if (build_info.bundler === 'rollup') {
			// TODO add dependencies and CSS
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map(file => `<${req.baseUrl}/client/${file}>;rel="modulepreload"`)
				.join(', ');

			res.setHeader('Link', link);
		} else {
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map((file) => {
					const as = /\.css$/.test(file) ? 'style' : 'script';
					return `<${req.baseUrl}/client/${file}>;rel="preload";as="${as}"`;
				})
				.join(', ');

			res.setHeader('Link', link);
		}

		let session;
		try {
			session = await session_getter(req, res);
		} catch (err) {
			return bail(req, res, err);
		}

		let redirect;
		let preload_error;

		const preload_context = {
			redirect: (statusCode, location) => {
				if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
					throw new Error(`Conflicting redirects`);
				}
				location = location.replace(/^\//g, ''); // leading slash (only)
				redirect = { statusCode, location };
			},
			error: (statusCode, message) => {
				preload_error = { statusCode, message };
			},
			fetch: (url, opts) => {
				const parsed = new Url.URL(url, `http://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' :''}`);

				opts = Object.assign({}, opts);

				const include_credentials = (
					opts.credentials === 'include' ||
					opts.credentials !== 'omit' && parsed.origin === `http://127.0.0.1:${process.env.PORT}`
				);

				if (include_credentials) {
					opts.headers = Object.assign({}, opts.headers);

					const cookies = Object.assign(
						{},
						cookie.parse(req.headers.cookie || ''),
						cookie.parse(opts.headers.cookie || '')
					);

					const set_cookie = res.getHeader('Set-Cookie');
					(Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(str => {
						const match = /([^=]+)=([^;]+)/.exec(str);
						if (match) cookies[match[1]] = match[2];
					});

					const str = Object.keys(cookies)
						.map(key => `${key}=${cookies[key]}`)
						.join('; ');

					opts.headers.cookie = str;

					if (!opts.headers.authorization && req.headers.authorization) {
						opts.headers.authorization = req.headers.authorization;
					}
				}

				return fetch$1(parsed.href, opts);
			}
		};

		let preloaded;
		let match;
		let params;

		try {
			const root_preloaded = manifest.root_preload
				? manifest.root_preload.call(preload_context, {
					host: req.headers.host,
					path: req.path,
					query: req.query,
					params: {}
				}, session)
				: {};

			match = error ? null : page.pattern.exec(req.path);


			let toPreload = [root_preloaded];
			if (!is_service_worker_index) {
				toPreload = toPreload.concat(page.parts.map(part => {
					if (!part) return null;

					// the deepest level is used below, to initialise the store
					params = part.params ? part.params(match) : {};

					return part.preload
						? part.preload.call(preload_context, {
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}, session)
						: {};
				}));
			}

			preloaded = await Promise.all(toPreload);
		} catch (err) {
			if (error) {
				return bail(req, res, err)
			}

			preload_error = { statusCode: 500, message: err };
			preloaded = []; // appease TypeScript
		}

		try {
			if (redirect) {
				const location = Url.resolve((req.baseUrl || '') + '/', redirect.location);

				res.statusCode = redirect.statusCode;
				res.setHeader('Location', location);
				res.end();

				return;
			}

			if (preload_error) {
				handle_error(req, res, preload_error.statusCode, preload_error.message);
				return;
			}

			const segments = req.path.split('/').filter(Boolean);

			// TODO make this less confusing
			const layout_segments = [segments[0]];
			let l = 1;

			page.parts.forEach((part, i) => {
				layout_segments[l] = segments[i + 1];
				if (!part) return null;
				l++;
			});

			const props = {
				stores: {
					page: {
						subscribe: writable({
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}).subscribe
					},
					preloading: {
						subscribe: writable(null).subscribe
					},
					session: writable(session)
				},
				segments: layout_segments,
				status: error ? status : 200,
				error: error ? error instanceof Error ? error : { message: error } : null,
				level0: {
					props: preloaded[0]
				},
				level1: {
					segment: segments[0],
					props: {}
				}
			};

			if (!is_service_worker_index) {
				let l = 1;
				for (let i = 0; i < page.parts.length; i += 1) {
					const part = page.parts[i];
					if (!part) continue;

					props[`level${l++}`] = {
						component: part.component,
						props: preloaded[i + 1] || {},
						segment: segments[i]
					};
				}
			}

			const { html, head, css } = App.render(props);

			const serialized = {
				preloaded: `[${preloaded.map(data => try_serialize(data)).join(',')}]`,
				session: session && try_serialize(session, err => {
					throw new Error(`Failed to serialize session data: ${err.message}`);
				}),
				error: error && serialize_error(props.error)
			};

			let script = `__SAPPER__={${[
				error && `error:${serialized.error},status:${status}`,
				`baseUrl:"${req.baseUrl}"`,
				serialized.preloaded && `preloaded:${serialized.preloaded}`,
				serialized.session && `session:${serialized.session}`
			].filter(Boolean).join(',')}};`;

			if (has_service_worker) {
				script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
			}

			const file = [].concat(build_info.assets.main).filter(file => file && /\.js$/.test(file))[0];
			const main = `${req.baseUrl}/client/${file}`;

			if (build_info.bundler === 'rollup') {
				if (build_info.legacy_assets) {
					const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
					script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
				} else {
					script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
				}
			} else {
				script += `</script><script src="${main}">`;
			}

			let styles;

			// TODO make this consistent across apps
			// TODO embed build_info in placeholder.ts
			if (build_info.css && build_info.css.main) {
				const css_chunks = new Set();
				if (build_info.css.main) css_chunks.add(build_info.css.main);
				page.parts.forEach(part => {
					if (!part) return;
					const css_chunks_for_part = build_info.css.chunks[part.file];

					if (css_chunks_for_part) {
						css_chunks_for_part.forEach(file => {
							css_chunks.add(file);
						});
					}
				});

				styles = Array.from(css_chunks)
					.map(href => `<link rel="stylesheet" href="client/${href}">`)
					.join('');
			} else {
				styles = (css && css.code ? `<style>${css.code}</style>` : '');
			}

			// users can set a CSP nonce using res.locals.nonce
			const nonce_attr = (res.locals && res.locals.nonce) ? ` nonce="${res.locals.nonce}"` : '';

			const body = template()
				.replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
				.replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
				.replace('%sapper.html%', () => html)
				.replace('%sapper.head%', () => `<noscript id='sapper-head-start'></noscript>${head}<noscript id='sapper-head-end'></noscript>`)
				.replace('%sapper.styles%', () => styles);

			res.statusCode = status;
			res.end(body);
		} catch(err) {
			if (error) {
				bail(req, res, err);
			} else {
				handle_error(req, res, 500, err);
			}
		}
	}

	return function find_route(req, res, next) {
		if (req.path === '/service-worker-index.html') {
			const homePage = pages.find(page => page.pattern.test('/'));
			handle_page(homePage, req, res);
			return;
		}

		for (const page of pages) {
			if (page.pattern.test(req.path)) {
				handle_page(page, req, res);
				return;
			}
		}

		handle_error(req, res, 404, 'Not found');
	};
}

function read_template(dir = build_dir) {
	return fs.readFileSync(`${dir}/template.html`, 'utf-8');
}

function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}

// Ensure we return something truthy so the client will not re-render the page over the error
function serialize_error(error) {
	if (!error) return null;
	let serialized = try_serialize(error);
	if (!serialized) {
		const { name, message, stack } = error ;
		serialized = try_serialize({ name, message, stack });
	}
	if (!serialized) {
		serialized = '{}';
	}
	return serialized;
}

function middleware(opts


 = {}) {
	const { session, ignore } = opts;

	let emitted_basepath = false;

	return compose_handlers(ignore, [
		(req, res, next) => {
			if (req.baseUrl === undefined) {
				let { originalUrl } = req;
				if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
					originalUrl += '/';
				}

				req.baseUrl = originalUrl
					? originalUrl.slice(0, -req.url.length)
					: '';
			}

			if (!emitted_basepath && process.send) {
				process.send({
					__sapper__: true,
					event: 'basepath',
					basepath: req.baseUrl
				});

				emitted_basepath = true;
			}

			if (req.path === undefined) {
				req.path = req.url.replace(/\?.*/, '');
			}

			next();
		},

		fs.existsSync(path.join(build_dir, 'service-worker.js')) && serve({
			pathname: '/service-worker.js',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		fs.existsSync(path.join(build_dir, 'service-worker.js.map')) && serve({
			pathname: '/service-worker.js.map',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		serve({
			prefix: '/client/',
			cache_control:  'max-age=31536000, immutable'
		}),

		get_server_route_handler(manifest.server_routes),

		get_page_handler(manifest, session || noop$1)
	].filter(Boolean));
}

function compose_handlers(ignore, handlers) {
	const total = handlers.length;

	function nth_handler(n, req, res, next) {
		if (n >= total) {
			return next();
		}

		handlers[n](req, res, () => nth_handler(n+1, req, res, next));
	}

	return !ignore
		? (req, res, next) => nth_handler(0, req, res, next)
		: (req, res, next) => {
			if (should_ignore(req.path, ignore)) {
				next();
			} else {
				nth_handler(0, req, res, next);
			}
		};
}

function should_ignore(uri, val) {
	if (Array.isArray(val)) return val.some(x => should_ignore(uri, x));
	if (val instanceof RegExp) return val.test(uri);
	if (typeof val === 'function') return val(uri);
	return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}

function serve({ prefix, pathname, cache_control }



) {
	const filter = pathname
		? (req) => req.path === pathname
		: (req) => req.path.startsWith(prefix);

	const cache = new Map();

	const read =  (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.join(build_dir, file)))).get(file);

	return (req, res, next) => {
		if (filter(req)) {
			const type = lite.getType(req.path);

			try {
				const file = path.posix.normalize(decodeURIComponent(req.path));
				const data = read(file);

				res.setHeader('Content-Type', type);
				res.setHeader('Cache-Control', cache_control);
				res.end(data);
			} catch (err) {
				res.statusCode = 404;
				res.end('not found');
			}
		} else {
			next();
		}
	};
}

function noop$1(){}

const { PORT, NODE_ENV, SAPPER_APP_HOSTIP} = process.env;
const dev = NODE_ENV === "development";

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		middleware({
			session: req => ({
				env: { SAPPER_APP_HOSTIP }
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
