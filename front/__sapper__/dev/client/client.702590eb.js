function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function set_store_value(store, ret, value = ret) {
    store.set(value);
    return ret;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function claim_element(nodes, name, attributes, svg) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeName === name) {
            let j = 0;
            const remove = [];
            while (j < node.attributes.length) {
                const attribute = node.attributes[j++];
                if (!attributes[attribute.name]) {
                    remove.push(attribute.name);
                }
            }
            for (let k = 0; k < remove.length; k++) {
                node.removeAttribute(remove[k]);
            }
            return nodes.splice(i, 1)[0];
        }
    }
    return svg ? svg_element(name) : element(name);
}
function claim_text(nodes, data) {
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (node.nodeType === 3) {
            node.data = '' + data;
            return nodes.splice(i, 1)[0];
        }
    }
    return text(data);
}
function claim_space(nodes) {
    return claim_text(nodes, ' ');
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function query_selector_all(selector, parent = document.body) {
    return Array.from(parent.querySelectorAll(selector));
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
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
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        callbacks.slice().forEach(fn => fn(event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
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

const CONTEXT_KEY = {};

const preload = () => ({});

const stateStore = writable({ rout: "botlist", 
                                    showmenu: false,
                                    selectbotname: "",
                                    urlhost: "",
                                    darkmodestatus: true,
                                    timerId: "",
                                    timerIdlist: ""});

const authStore = writable({ status: "loading" });

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

var tslib_es6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    __extends: __extends,
    get __assign () { return __assign; },
    __rest: __rest,
    __decorate: __decorate,
    __param: __param,
    __metadata: __metadata,
    __awaiter: __awaiter,
    __generator: __generator,
    __createBinding: __createBinding,
    __exportStar: __exportStar,
    __values: __values,
    __read: __read,
    __spread: __spread,
    __spreadArrays: __spreadArrays,
    __await: __await,
    __asyncGenerator: __asyncGenerator,
    __asyncDelegator: __asyncDelegator,
    __asyncValues: __asyncValues,
    __makeTemplateObject: __makeTemplateObject,
    __importStar: __importStar,
    __importDefault: __importDefault,
    __classPrivateFieldGet: __classPrivateFieldGet,
    __classPrivateFieldSet: __classPrivateFieldSet
});

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
var empty$1 = {
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
                _this.destination = empty$1;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = empty$1;
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
            if (observerOrNext !== empty$1) {
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
        return new Subscriber(empty$1);
    }
    return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity$1(x) {
    return x;
}

/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity$1;
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
function empty$2(scheduler) {
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
        return new Observable(function (subscriber) { return scheduler.schedule(dispatch$1, 0, { error: error, subscriber: subscriber }); });
    }
}
function dispatch$1(_a) {
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
                return empty$2();
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

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop$1() { }

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
var MapOperator = /*@__PURE__*/ (function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}());
var MapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.count = 0;
        _this.thisArg = thisArg || _this;
        return _this;
    }
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber));

/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
var subscribeToPromise = function (promise) {
    return function (subscriber) {
        promise.then(function (value) {
            if (!subscriber.closed) {
                subscriber.next(value);
                subscriber.complete();
            }
        }, function (err) { return subscriber.error(err); })
            .then(null, hostReportError);
        return subscriber;
    };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
var iterator = /*@__PURE__*/ getSymbolIterator();

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
var subscribeToIterable = function (iterable) {
    return function (subscriber) {
        var iterator$1 = iterable[iterator]();
        do {
            var item = void 0;
            try {
                item = iterator$1.next();
            }
            catch (err) {
                subscriber.error(err);
                return subscriber;
            }
            if (item.done) {
                subscriber.complete();
                break;
            }
            subscriber.next(item.value);
            if (subscriber.closed) {
                break;
            }
        } while (true);
        if (typeof iterator$1.return === 'function') {
            subscriber.add(function () {
                if (iterator$1.return) {
                    iterator$1.return();
                }
            });
        }
        return subscriber;
    };
};

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
var subscribeToObservable = function (obj) {
    return function (subscriber) {
        var obs = obj[observable]();
        if (typeof obs.subscribe !== 'function') {
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        }
        else {
            return obs.subscribe(subscriber);
        }
    };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}

/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
var subscribeTo = function (result) {
    if (!!result && typeof result[observable] === 'function') {
        return subscribeToObservable(result);
    }
    else if (isArrayLike(result)) {
        return subscribeToArray(result);
    }
    else if (isPromise(result)) {
        return subscribeToPromise(result);
    }
    else if (!!result && typeof result[iterator] === 'function') {
        return subscribeToIterable(result);
    }
    else {
        var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected."
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
function scheduleObservable(input, scheduler) {
    return new Observable(function (subscriber) {
        var sub = new Subscription();
        sub.add(scheduler.schedule(function () {
            var observable$1 = input[observable]();
            sub.add(observable$1.subscribe({
                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
            }));
        }));
        return sub;
    });
}

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function schedulePromise(input, scheduler) {
    return new Observable(function (subscriber) {
        var sub = new Subscription();
        sub.add(scheduler.schedule(function () {
            return input.then(function (value) {
                sub.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                }));
            }, function (err) {
                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
            });
        }));
        return sub;
    });
}

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
function scheduleIterable(input, scheduler) {
    if (!input) {
        throw new Error('Iterable cannot be null');
    }
    return new Observable(function (subscriber) {
        var sub = new Subscription();
        var iterator$1;
        sub.add(function () {
            if (iterator$1 && typeof iterator$1.return === 'function') {
                iterator$1.return();
            }
        });
        sub.add(scheduler.schedule(function () {
            iterator$1 = input[iterator]();
            sub.add(scheduler.schedule(function () {
                if (subscriber.closed) {
                    return;
                }
                var value;
                var done;
                try {
                    var result = iterator$1.next();
                    value = result.value;
                    done = result.done;
                }
                catch (err) {
                    subscriber.error(err);
                    return;
                }
                if (done) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(value);
                    this.schedule();
                }
            }));
        }));
        return sub;
    });
}

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
function isInteropObservable(input) {
    return input && typeof input[observable] === 'function';
}

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
function isIterable(input) {
    return input && typeof input[iterator] === 'function';
}

/** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
function scheduled(input, scheduler) {
    if (input != null) {
        if (isInteropObservable(input)) {
            return scheduleObservable(input, scheduler);
        }
        else if (isPromise(input)) {
            return schedulePromise(input, scheduler);
        }
        else if (isArrayLike(input)) {
            return scheduleArray(input, scheduler);
        }
        else if (isIterable(input) || typeof input === 'string') {
            return scheduleIterable(input, scheduler);
        }
    }
    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}

/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof Observable) {
            return input;
        }
        return new Observable(subscribeTo(input));
    }
    else {
        return scheduled(input, scheduler);
    }
}

/** PURE_IMPORTS_START _Observable,_util_isArray,_operators_map,_util_isObject,_from PURE_IMPORTS_END */
function forkJoin() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    if (sources.length === 1) {
        var first_1 = sources[0];
        if (isArray(first_1)) {
            return forkJoinInternal(first_1, null);
        }
        if (isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
            var keys = Object.keys(first_1);
            return forkJoinInternal(keys.map(function (key) { return first_1[key]; }), keys);
        }
    }
    if (typeof sources[sources.length - 1] === 'function') {
        var resultSelector_1 = sources.pop();
        sources = (sources.length === 1 && isArray(sources[0])) ? sources[0] : sources;
        return forkJoinInternal(sources, null).pipe(map(function (args) { return resultSelector_1.apply(void 0, args); }));
    }
    return forkJoinInternal(sources, null);
}
function forkJoinInternal(sources, keys) {
    return new Observable(function (subscriber) {
        var len = sources.length;
        if (len === 0) {
            subscriber.complete();
            return;
        }
        var values = new Array(len);
        var completed = 0;
        var emitted = 0;
        var _loop_1 = function (i) {
            var source = from(sources[i]);
            var hasValue = false;
            subscriber.add(source.subscribe({
                next: function (value) {
                    if (!hasValue) {
                        hasValue = true;
                        emitted++;
                    }
                    values[i] = value;
                },
                error: function (err) { return subscriber.error(err); },
                complete: function () {
                    completed++;
                    if (completed === len || !hasValue) {
                        if (emitted === len) {
                            subscriber.next(keys ?
                                keys.reduce(function (result, key, i) { return (result[key] = values[i], result); }, {}) :
                                values);
                        }
                        subscriber.complete();
                    }
                }
            }));
        };
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
    });
}

/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
var DoOperator = /*@__PURE__*/ (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
var TapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = noop$1;
        _this._tapError = noop$1;
        _this._tapComplete = noop$1;
        _this._tapError = error || noop$1;
        _this._tapComplete = complete || noop$1;
        if (isFunction(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || noop$1;
            _this._tapError = observerOrNext.error || noop$1;
            _this._tapComplete = observerOrNext.complete || noop$1;
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(Subscriber));

/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Create an observable of authentication state. The observer is only
 * triggered on sign-in or sign-out.
 * @param auth firebase.auth.Auth
 */
function authState(auth) {
    return new Observable(function (subscriber) {
        var unsubscribe = auth.onAuthStateChanged(subscriber);
        return { unsubscribe: unsubscribe };
    });
}

const authListener = (firebaseApp) => {
  authState(firebaseApp.auth()).subscribe(async (user) => {
    if (user) {
      const token = await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      authStore.set({ status: "in", user, token });
      localStorage.setItem("token", token);
    }
  });
};
const signInWithGoogle = (firebaseApp) => ({ redirect = false }) => {
  firebaseApp.subscribe(async (app) => {
    const authProvider = new app.auth.GoogleAuthProvider();
    try {
      redirect === true
        ? await app.auth().signInWithRedirect(authProvider)
        : await app.auth().signInWithPopup(authProvider);
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
    }
  });
};

const signOut = (firebaseApp) => () => {
  firebaseApp.subscribe(async (app) => {
    try {
      await app.auth().signOut();
      authStore.set({ status: "out" });
      localStorage.removeItem("token");
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
    }
  });
};

const config$1 = {
  apiKey: "AIzaSyCcDULdGUq2efsIQt3UOHU0HqehbN26wO8",
    authDomain: "bbot-dccb2.firebaseapp.com",
    databaseURL: "https://bbot-dccb2.firebaseio.com",
    projectId: "bbot-dccb2",
    storageBucket: "bbot-dccb2.appspot.com",
    messagingSenderId: "970833153115",
    appId: "1:970833153115:web:0c41724a3993d11f9cc37e",
    measurementId: "G-PJ2XMD0K2K"};

function lazyLoad() {
  // create observable from dynamic import
  const firebase$ = from(import('./index.cjs.9c67b822.js').then(function (n) { return n.i; }));
  const auth$ = from(import('./index.esm.c51439de.js'));
  //const firestore$ = from(import("firebase/firestore"));

  // when all observables, e.g (firebase$, auth$), complete, give the last emitted value from each as an array
  return forkJoin(firebase$, auth$).pipe(
    // apply transform to array emitted from forkJoin to return Firebase instance
    map(([firebase$]) => {
      const firebase = firebase$.default;
      return { firebase };
    })
  );
}

// create subject to replay/emit the Firebase instance to all new subscribers
const firebaseApp$ = new ReplaySubject(1);


  lazyLoad()
    .pipe(
      // perform side-effect to initialize auth listener
      tap((load) => {
        const { firebase } = load;
        const app = firebase.initializeApp(config$1);
        authListener(app);
        //collectionListener(app);
      })
    )
    .subscribe((load) => {
      const { firebase } = load;
      firebaseApp$.next(firebase);
    });

const signInWithGoogle$1 = signInWithGoogle(firebaseApp$);
const signOut$1 = signOut(firebaseApp$);

/////////////////////////
//
// collection.js
//export const addItemToCollection = _addItemToCollection(firebaseApp$);
//
//export { firebaseApp$ };
//import { addItemToCollection as _addItemToCollection } from "./collection";

/* node_modules/smelte/src/components/Icon/Icon.svelte generated by Svelte v3.24.0 */

const file = "node_modules/smelte/src/components/Icon/Icon.svelte";

function create_fragment(ctx) {
	let i;
	let i_class_value;
	let i_style_value;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[7].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

	const block = {
		c: function create() {
			i = element("i");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			i = claim_element(nodes, "I", {
				"aria-hidden": true,
				class: true,
				style: true
			});

			var i_nodes = children(i);
			if (default_slot) default_slot.l(i_nodes);
			i_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(i, "aria-hidden", "true");
			attr_dev(i, "class", i_class_value = "material-icons icon text-xl " + /*$$props*/ ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a");
			attr_dev(i, "style", i_style_value = /*color*/ ctx[4] ? `color: ${/*color*/ ctx[4]}` : "");
			toggle_class(i, "reverse", /*reverse*/ ctx[2]);
			toggle_class(i, "tip", /*tip*/ ctx[3]);
			toggle_class(i, "text-base", /*small*/ ctx[0]);
			toggle_class(i, "text-xs", /*xs*/ ctx[1]);
			add_location(i, file, 20, 0, 273);
		},
		m: function mount(target, anchor) {
			insert_dev(target, i, anchor);

			if (default_slot) {
				default_slot.m(i, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen_dev(i, "click", /*click_handler*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 64) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
				}
			}

			if (!current || dirty & /*$$props*/ 32 && i_class_value !== (i_class_value = "material-icons icon text-xl " + /*$$props*/ ctx[5].class + " duration-200 ease-in" + " svelte-zzky5a")) {
				attr_dev(i, "class", i_class_value);
			}

			if (!current || dirty & /*color*/ 16 && i_style_value !== (i_style_value = /*color*/ ctx[4] ? `color: ${/*color*/ ctx[4]}` : "")) {
				attr_dev(i, "style", i_style_value);
			}

			if (dirty & /*$$props, reverse*/ 36) {
				toggle_class(i, "reverse", /*reverse*/ ctx[2]);
			}

			if (dirty & /*$$props, tip*/ 40) {
				toggle_class(i, "tip", /*tip*/ ctx[3]);
			}

			if (dirty & /*$$props, small*/ 33) {
				toggle_class(i, "text-base", /*small*/ ctx[0]);
			}

			if (dirty & /*$$props, xs*/ 34) {
				toggle_class(i, "text-xs", /*xs*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(i);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
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
	let { small = false } = $$props;
	let { xs = false } = $$props;
	let { reverse = false } = $$props;
	let { tip = false } = $$props;
	let { color = "default" } = $$props;
	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Icon", $$slots, ['default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("small" in $$new_props) $$invalidate(0, small = $$new_props.small);
		if ("xs" in $$new_props) $$invalidate(1, xs = $$new_props.xs);
		if ("reverse" in $$new_props) $$invalidate(2, reverse = $$new_props.reverse);
		if ("tip" in $$new_props) $$invalidate(3, tip = $$new_props.tip);
		if ("color" in $$new_props) $$invalidate(4, color = $$new_props.color);
		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({ small, xs, reverse, tip, color });

	$$self.$inject_state = $$new_props => {
		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
		if ("small" in $$props) $$invalidate(0, small = $$new_props.small);
		if ("xs" in $$props) $$invalidate(1, xs = $$new_props.xs);
		if ("reverse" in $$props) $$invalidate(2, reverse = $$new_props.reverse);
		if ("tip" in $$props) $$invalidate(3, tip = $$new_props.tip);
		if ("color" in $$props) $$invalidate(4, color = $$new_props.color);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$props = exclude_internal_props($$props);
	return [small, xs, reverse, tip, color, $$props, $$scope, $$slots, click_handler];
}

class Icon extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			small: 0,
			xs: 1,
			reverse: 2,
			tip: 3,
			color: 4
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Icon",
			options,
			id: create_fragment.name
		});
	}

	get small() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set small(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xs() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xs(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get reverse() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set reverse(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tip() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tip(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

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

// Thanks Lagden! https://svelte.dev/repl/61d9178d2b9944f2aa2bfe31612ab09f?version=3.6.7
function ripple(color, centered) {
  return function(event) {
    const target = event.currentTarget;
    const circle = document.createElement("span");
    const d = Math.max(target.clientWidth, target.clientHeight);

    const removeCircle = () => {
      circle.remove();
      circle.removeEventListener("animationend", removeCircle);
    };

    circle.addEventListener("animationend", removeCircle);
    circle.style.width = circle.style.height = `${d}px`;
    const rect = target.getBoundingClientRect();

    if (centered) {
      circle.classList.add(
        "absolute",
        "top-0",
        "left-0",
        "ripple-centered",
        `bg-${color}-transDark`
      );
    } else {
      circle.style.left = `${event.clientX - rect.left - d / 2}px`;
      circle.style.top = `${event.clientY - rect.top - d / 2}px`;

      circle.classList.add("ripple-normal", `bg-${color}-trans`);
    }

    circle.classList.add("ripple");

    target.appendChild(circle);
  };
}

function r(color = "primary", centered = false) {
  return function(node) {
    node.addEventListener("click", ripple(color, centered));

    return {
      onDestroy: () => node.removeEventListener("click")
    };
  };
}

/* node_modules/smelte/src/components/Button/Button.svelte generated by Svelte v3.24.0 */
const file$1 = "node_modules/smelte/src/components/Button/Button.svelte";

// (150:0) {:else}
function create_else_block(ctx) {
	let button;
	let t;
	let ripple_action;
	let current;
	let mounted;
	let dispose;
	let if_block = /*icon*/ ctx[3] && create_if_block_2(ctx);
	const default_slot_template = /*$$slots*/ ctx[29].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[38], null);

	let button_levels = [
		{ class: /*classes*/ ctx[1] },
		/*props*/ ctx[8],
		{ disabled: /*disabled*/ ctx[2] }
	];

	let button_data = {};

	for (let i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	const block_1 = {
		c: function create() {
			button = element("button");
			if (if_block) if_block.c();
			t = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true, disabled: true });
			var button_nodes = children(button);
			if (if_block) if_block.l(button_nodes);
			t = claim_space(button_nodes);
			if (default_slot) default_slot.l(button_nodes);
			button_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(button, button_data);
			add_location(button, file$1, 150, 2, 4051);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			if (if_block) if_block.m(button, null);
			append_dev(button, t);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(ripple_action = /*ripple*/ ctx[7].call(null, button)),
					listen_dev(button, "click", /*click_handler_3*/ ctx[37], false, false, false),
					listen_dev(button, "click", /*click_handler_1*/ ctx[33], false, false, false),
					listen_dev(button, "mouseover", /*mouseover_handler_1*/ ctx[34], false, false, false),
					listen_dev(button, "*", /*_handler_1*/ ctx[35], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*icon*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*icon*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(button, t);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (default_slot) {
				if (default_slot.p && dirty[1] & /*$$scope*/ 128) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[38], dirty, null, null);
				}
			}

			set_attributes(button, button_data = get_spread_update(button_levels, [
				(!current || dirty[0] & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
				/*props*/ ctx[8],
				(!current || dirty[0] & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] }
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_else_block.name,
		type: "else",
		source: "(150:0) {:else}",
		ctx
	});

	return block_1;
}

// (129:0) {#if href}
function create_if_block(ctx) {
	let a;
	let button;
	let t;
	let ripple_action;
	let current;
	let mounted;
	let dispose;
	let if_block = /*icon*/ ctx[3] && create_if_block_1(ctx);
	const default_slot_template = /*$$slots*/ ctx[29].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[38], null);

	let button_levels = [
		{ class: /*classes*/ ctx[1] },
		/*props*/ ctx[8],
		{ disabled: /*disabled*/ ctx[2] }
	];

	let button_data = {};

	for (let i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	let a_levels = [{ href: /*href*/ ctx[5] }, /*props*/ ctx[8]];
	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block_1 = {
		c: function create() {
			a = element("a");
			button = element("button");
			if (if_block) if_block.c();
			t = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			a = claim_element(nodes, "A", { href: true });
			var a_nodes = children(a);
			button = claim_element(a_nodes, "BUTTON", { class: true, disabled: true });
			var button_nodes = children(button);
			if (if_block) if_block.l(button_nodes);
			t = claim_space(button_nodes);
			if (default_slot) default_slot.l(button_nodes);
			button_nodes.forEach(detach_dev);
			a_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			set_attributes(button, button_data);
			add_location(button, file$1, 133, 4, 3751);
			set_attributes(a, a_data);
			add_location(a, file$1, 129, 2, 3714);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, button);
			if (if_block) if_block.m(button, null);
			append_dev(button, t);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(ripple_action = /*ripple*/ ctx[7].call(null, button)),
					listen_dev(button, "click", /*click_handler_2*/ ctx[36], false, false, false),
					listen_dev(button, "click", /*click_handler*/ ctx[30], false, false, false),
					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[31], false, false, false),
					listen_dev(button, "*", /*_handler*/ ctx[32], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*icon*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*icon*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(button, t);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (default_slot) {
				if (default_slot.p && dirty[1] & /*$$scope*/ 128) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[38], dirty, null, null);
				}
			}

			set_attributes(button, button_data = get_spread_update(button_levels, [
				(!current || dirty[0] & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
				/*props*/ ctx[8],
				(!current || dirty[0] & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] }
			]));

			set_attributes(a, a_data = get_spread_update(a_levels, [
				(!current || dirty[0] & /*href*/ 32) && { href: /*href*/ ctx[5] },
				/*props*/ ctx[8]
			]));
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block.name,
		type: "if",
		source: "(129:0) {#if href}",
		ctx
	});

	return block_1;
}

// (161:4) {#if icon}
function create_if_block_2(ctx) {
	let icon_1;
	let current;

	icon_1 = new Icon({
			props: {
				class: /*iClasses*/ ctx[6],
				small: /*small*/ ctx[4],
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block_1 = {
		c: function create() {
			create_component(icon_1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(icon_1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(icon_1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const icon_1_changes = {};
			if (dirty[0] & /*iClasses*/ 64) icon_1_changes.class = /*iClasses*/ ctx[6];
			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 128) {
				icon_1_changes.$$scope = { dirty, ctx };
			}

			icon_1.$set(icon_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(icon_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(icon_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block_2.name,
		type: "if",
		source: "(161:4) {#if icon}",
		ctx
	});

	return block_1;
}

// (162:6) <Icon class={iClasses} {small}>
function create_default_slot_1(ctx) {
	let t;

	const block_1 = {
		c: function create() {
			t = text(/*icon*/ ctx[3]);
		},
		l: function claim(nodes) {
			t = claim_text(nodes, /*icon*/ ctx[3]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(162:6) <Icon class={iClasses} {small}>",
		ctx
	});

	return block_1;
}

// (144:6) {#if icon}
function create_if_block_1(ctx) {
	let icon_1;
	let current;

	icon_1 = new Icon({
			props: {
				class: /*iClasses*/ ctx[6],
				small: /*small*/ ctx[4],
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block_1 = {
		c: function create() {
			create_component(icon_1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(icon_1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(icon_1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const icon_1_changes = {};
			if (dirty[0] & /*iClasses*/ 64) icon_1_changes.class = /*iClasses*/ ctx[6];
			if (dirty[0] & /*small*/ 16) icon_1_changes.small = /*small*/ ctx[4];

			if (dirty[0] & /*icon*/ 8 | dirty[1] & /*$$scope*/ 128) {
				icon_1_changes.$$scope = { dirty, ctx };
			}

			icon_1.$set(icon_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(icon_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(icon_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(icon_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_if_block_1.name,
		type: "if",
		source: "(144:6) {#if icon}",
		ctx
	});

	return block_1;
}

// (145:8) <Icon class={iClasses} {small}>
function create_default_slot(ctx) {
	let t;

	const block_1 = {
		c: function create() {
			t = text(/*icon*/ ctx[3]);
		},
		l: function claim(nodes) {
			t = claim_text(nodes, /*icon*/ ctx[3]);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*icon*/ 8) set_data_dev(t, /*icon*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_default_slot.name,
		type: "slot",
		source: "(145:8) <Icon class={iClasses} {small}>",
		ctx
	});

	return block_1;
}

function create_fragment$1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*href*/ ctx[5]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block_1 = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block: block_1,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block_1;
}

const classesDefault = "py-2 px-4 uppercase text-sm font-medium relative overflow-hidden";
const basicDefault = "text-white duration-200 ease-in";
const outlinedDefault = "bg-transparent border border-solid";
const textDefault = "bg-transparent border-none px-4 hover:bg-transparent";
const iconDefault = "p-4 flex items-center select-none";
const fabDefault = "hover:bg-transparent";
const smallDefault = "pt-1 pb-1 pl-2 pr-2 text-xs";
const disabledDefault = "bg-gray-300 text-gray-500 dark:bg-dark-400 elevation-none pointer-events-none hover:bg-gray-300 cursor-default";
const elevationDefault = "hover:elevation-5 elevation-3";

function instance$1($$self, $$props, $$invalidate) {
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
	let { classes = classesDefault } = $$props;
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
	let Classes = i => i;
	let iClasses = i => i;
	let shade = 0;
	const { bg, border, txt } = utils(color);
	const cb = new ClassBuilder(classes, classesDefault);
	let iconCb;

	if (icon) {
		iconCb = new ClassBuilder(iconClass);
	}

	const ripple = r(text || fab || outlined ? color : "white");

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

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Button", $$slots, ['default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	function mouseover_handler(event) {
		bubble($$self, event);
	}

	function _handler(event) {
		bubble($$self, event);
	}

	function click_handler_1(event) {
		bubble($$self, event);
	}

	function mouseover_handler_1(event) {
		bubble($$self, event);
	}

	function _handler_1(event) {
		bubble($$self, event);
	}

	const click_handler_2 = () => $$invalidate(0, value = !value);
	const click_handler_3 = () => $$invalidate(0, value = !value);

	$$self.$set = $$new_props => {
		$$invalidate(50, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
		if ("outlined" in $$new_props) $$invalidate(10, outlined = $$new_props.outlined);
		if ("text" in $$new_props) $$invalidate(11, text = $$new_props.text);
		if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
		if ("small" in $$new_props) $$invalidate(4, small = $$new_props.small);
		if ("light" in $$new_props) $$invalidate(13, light = $$new_props.light);
		if ("dark" in $$new_props) $$invalidate(14, dark = $$new_props.dark);
		if ("flat" in $$new_props) $$invalidate(15, flat = $$new_props.flat);
		if ("iconClass" in $$new_props) $$invalidate(16, iconClass = $$new_props.iconClass);
		if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
		if ("href" in $$new_props) $$invalidate(5, href = $$new_props.href);
		if ("fab" in $$new_props) $$invalidate(9, fab = $$new_props.fab);
		if ("remove" in $$new_props) $$invalidate(18, remove = $$new_props.remove);
		if ("add" in $$new_props) $$invalidate(19, add = $$new_props.add);
		if ("replace" in $$new_props) $$invalidate(20, replace = $$new_props.replace);
		if ("classes" in $$new_props) $$invalidate(1, classes = $$new_props.classes);
		if ("basicClasses" in $$new_props) $$invalidate(21, basicClasses = $$new_props.basicClasses);
		if ("outlinedClasses" in $$new_props) $$invalidate(22, outlinedClasses = $$new_props.outlinedClasses);
		if ("textClasses" in $$new_props) $$invalidate(23, textClasses = $$new_props.textClasses);
		if ("iconClasses" in $$new_props) $$invalidate(24, iconClasses = $$new_props.iconClasses);
		if ("fabClasses" in $$new_props) $$invalidate(25, fabClasses = $$new_props.fabClasses);
		if ("smallClasses" in $$new_props) $$invalidate(26, smallClasses = $$new_props.smallClasses);
		if ("disabledClasses" in $$new_props) $$invalidate(27, disabledClasses = $$new_props.disabledClasses);
		if ("elevationClasses" in $$new_props) $$invalidate(28, elevationClasses = $$new_props.elevationClasses);
		if ("$$scope" in $$new_props) $$invalidate(38, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		Icon,
		utils,
		ClassBuilder,
		filterProps,
		createRipple: r,
		value,
		outlined,
		text,
		block,
		disabled,
		icon,
		small,
		light,
		dark,
		flat,
		iconClass,
		color,
		href,
		fab,
		remove,
		add,
		replace,
		classesDefault,
		basicDefault,
		outlinedDefault,
		textDefault,
		iconDefault,
		fabDefault,
		smallDefault,
		disabledDefault,
		elevationDefault,
		classes,
		basicClasses,
		outlinedClasses,
		textClasses,
		iconClasses,
		fabClasses,
		smallClasses,
		disabledClasses,
		elevationClasses,
		basic,
		elevation,
		Classes,
		iClasses,
		shade,
		bg,
		border,
		txt,
		cb,
		iconCb,
		ripple,
		props,
		normal,
		lighter
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(50, $$props = assign(assign({}, $$props), $$new_props));
		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
		if ("outlined" in $$props) $$invalidate(10, outlined = $$new_props.outlined);
		if ("text" in $$props) $$invalidate(11, text = $$new_props.text);
		if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
		if ("small" in $$props) $$invalidate(4, small = $$new_props.small);
		if ("light" in $$props) $$invalidate(13, light = $$new_props.light);
		if ("dark" in $$props) $$invalidate(14, dark = $$new_props.dark);
		if ("flat" in $$props) $$invalidate(15, flat = $$new_props.flat);
		if ("iconClass" in $$props) $$invalidate(16, iconClass = $$new_props.iconClass);
		if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
		if ("href" in $$props) $$invalidate(5, href = $$new_props.href);
		if ("fab" in $$props) $$invalidate(9, fab = $$new_props.fab);
		if ("remove" in $$props) $$invalidate(18, remove = $$new_props.remove);
		if ("add" in $$props) $$invalidate(19, add = $$new_props.add);
		if ("replace" in $$props) $$invalidate(20, replace = $$new_props.replace);
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
		if ("basicClasses" in $$props) $$invalidate(21, basicClasses = $$new_props.basicClasses);
		if ("outlinedClasses" in $$props) $$invalidate(22, outlinedClasses = $$new_props.outlinedClasses);
		if ("textClasses" in $$props) $$invalidate(23, textClasses = $$new_props.textClasses);
		if ("iconClasses" in $$props) $$invalidate(24, iconClasses = $$new_props.iconClasses);
		if ("fabClasses" in $$props) $$invalidate(25, fabClasses = $$new_props.fabClasses);
		if ("smallClasses" in $$props) $$invalidate(26, smallClasses = $$new_props.smallClasses);
		if ("disabledClasses" in $$props) $$invalidate(27, disabledClasses = $$new_props.disabledClasses);
		if ("elevationClasses" in $$props) $$invalidate(28, elevationClasses = $$new_props.elevationClasses);
		if ("Classes" in $$props) Classes = $$new_props.Classes;
		if ("iClasses" in $$props) $$invalidate(6, iClasses = $$new_props.iClasses);
		if ("shade" in $$props) $$invalidate(39, shade = $$new_props.shade);
		if ("iconCb" in $$props) $$invalidate(40, iconCb = $$new_props.iconCb);
		if ("normal" in $$props) $$invalidate(41, normal = $$new_props.normal);
		if ("lighter" in $$props) $$invalidate(42, lighter = $$new_props.lighter);
	};

	let normal;
	let lighter;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*light, dark*/ 24576 | $$self.$$.dirty[1] & /*shade*/ 256) {
			 {
				$$invalidate(39, shade = light ? 200 : 0);
				$$invalidate(39, shade = dark ? -400 : shade);
			}
		}

		if ($$self.$$.dirty[1] & /*shade*/ 256) {
			 $$invalidate(41, normal = 500 - shade);
		}

		if ($$self.$$.dirty[1] & /*shade*/ 256) {
			 $$invalidate(42, lighter = 400 - shade);
		}

		 $$invalidate(1, classes = cb.flush().add(basicClasses, basic, basicDefault).add(`${bg(normal)} hover:${bg(lighter)}`, basic).add(elevationClasses, elevation, elevationDefault).add(outlinedClasses, outlined, outlinedDefault).add(`${border(lighter)} ${txt(normal)} hover:${bg("trans")} dark-hover:${bg("transDark")}`, outlined).add(`${txt(lighter)}`, text).add(textClasses, text, textDefault).add(iconClasses, icon, iconDefault).remove("py-2", icon).remove(txt(lighter), fab).add(disabledClasses, disabled, disabledDefault).add(smallClasses, small, smallDefault).add("flex items-center justify-center h-8 w-8", small && icon).add("border-solid", outlined).add("rounded-full", icon).add("w-full", block).add("rounded", basic || outlined || text).add("button", !icon).add(fabClasses, fab, fabDefault).add(`hover:${bg("transLight")}`, fab).add($$props.class).remove(remove).replace(replace).add(add).get());

		if ($$self.$$.dirty[0] & /*fab, iconClass*/ 66048 | $$self.$$.dirty[1] & /*iconCb*/ 512) {
			 if (iconCb) {
				$$invalidate(6, iClasses = iconCb.flush().add(txt(), fab && !iconClass).get());
			}
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		value,
		classes,
		disabled,
		icon,
		small,
		href,
		iClasses,
		ripple,
		props,
		fab,
		outlined,
		text,
		block,
		light,
		dark,
		flat,
		iconClass,
		color,
		remove,
		add,
		replace,
		basicClasses,
		outlinedClasses,
		textClasses,
		iconClasses,
		fabClasses,
		smallClasses,
		disabledClasses,
		elevationClasses,
		$$slots,
		click_handler,
		mouseover_handler,
		_handler,
		click_handler_1,
		mouseover_handler_1,
		_handler_1,
		click_handler_2,
		click_handler_3,
		$$scope
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				value: 0,
				outlined: 10,
				text: 11,
				block: 12,
				disabled: 2,
				icon: 3,
				small: 4,
				light: 13,
				dark: 14,
				flat: 15,
				iconClass: 16,
				color: 17,
				href: 5,
				fab: 9,
				remove: 18,
				add: 19,
				replace: 20,
				classes: 1,
				basicClasses: 21,
				outlinedClasses: 22,
				textClasses: 23,
				iconClasses: 24,
				fabClasses: 25,
				smallClasses: 26,
				disabledClasses: 27,
				elevationClasses: 28
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$1.name
		});
	}

	get value() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outlined() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outlined(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get text() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set text(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get block() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set block(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get icon() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set icon(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get small() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set small(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get light() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set light(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dark() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dark(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get flat() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set flat(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get iconClass() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set iconClass(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fab() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fab(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get remove() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set remove(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get add() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set add(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get replace() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set replace(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get classes() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set classes(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get basicClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set basicClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outlinedClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outlinedClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get textClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set textClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get iconClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set iconClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fabClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fabClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get smallClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set smallClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabledClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabledClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elevationClasses() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elevationClasses(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}
function quadIn(t) {
    return t * t;
}
function quadOut(t) {
    return -t * (t - 2.0);
}

/* src/components/MenuUser.svelte generated by Svelte v3.24.0 */

const file$2 = "src/components/MenuUser.svelte";
const get_activator_slot_changes = dirty => ({});
const get_activator_slot_context = ctx => ({});

// (51:2) {#if open}
function create_if_block$1(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 16) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(51:2) {#if open}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div;
	let t;
	let div_class_value;
	let current;
	let mounted;
	let dispose;
	const activator_slot_template = /*$$slots*/ ctx[5].activator;
	const activator_slot = create_slot(activator_slot_template, ctx, /*$$scope*/ ctx[4], get_activator_slot_context);
	let if_block = /*open*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (activator_slot) activator_slot.c();
			t = space();
			if (if_block) if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (activator_slot) activator_slot.l(div_nodes);
			t = claim_space(div_nodes);
			if (if_block) if_block.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*c*/ ctx[1]) + " svelte-15jeqdb"));
			add_location(div, file$2, 48, 0, 1105);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (activator_slot) {
				activator_slot.m(div, null);
			}

			append_dev(div, t);
			if (if_block) if_block.m(div, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(window, "click", /*click_handler_1*/ ctx[7], false, false, false),
					listen_dev(div, "click", stop_propagation(/*click_handler*/ ctx[6]), false, false, true)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (activator_slot) {
				if (activator_slot.p && dirty & /*$$scope*/ 16) {
					update_slot(activator_slot, activator_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_activator_slot_changes, get_activator_slot_context);
				}
			}

			if (/*open*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*open*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*c*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*c*/ ctx[1]) + " svelte-15jeqdb"))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(activator_slot, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(activator_slot, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (activator_slot) activator_slot.d(detaching);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const classesDefault$1 = "absolute cursor-pointer";
const listClassesDefault = "absolute top-3 rounded elevation-3 z-20 dark:bg-dark-500";

function instance$2($$self, $$props, $$invalidate) {
	let { open = false } = $$props;
	let { classes = classesDefault$1 } = $$props;
	let { listClasses = listClassesDefault } = $$props;
	const cb = new ClassBuilder($$props.class);
	const lcb = new ClassBuilder(listClasses, listClassesDefault);
	const dispatch = createEventDispatcher();
	const inProps = { y: 10, duration: 200, easing: quadIn };

	const outProps = {
		y: -10,
		duration: 100,
		easing: quadOut,
		delay: 100
	};

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("MenuUser", $$slots, ['activator','default']);

	function click_handler(event) {
		bubble($$self, event);
	}

	const click_handler_1 = () => $$invalidate(0, open = false);

	$$self.$set = $$new_props => {
		$$invalidate(14, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("open" in $$new_props) $$invalidate(0, open = $$new_props.open);
		if ("classes" in $$new_props) $$invalidate(2, classes = $$new_props.classes);
		if ("listClasses" in $$new_props) $$invalidate(3, listClasses = $$new_props.listClasses);
		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		quadOut,
		quadIn,
		ClassBuilder,
		classesDefault: classesDefault$1,
		listClassesDefault,
		open,
		classes,
		listClasses,
		cb,
		lcb,
		dispatch,
		inProps,
		outProps,
		c,
		l
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(14, $$props = assign(assign({}, $$props), $$new_props));
		if ("open" in $$props) $$invalidate(0, open = $$new_props.open);
		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
		if ("listClasses" in $$props) $$invalidate(3, listClasses = $$new_props.listClasses);
		if ("c" in $$props) $$invalidate(1, c = $$new_props.c);
		if ("l" in $$props) l = $$new_props.l;
	};

	let c;
	let l;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		 $$invalidate(1, c = cb.flush().add(classes, true, classesDefault$1).add($$props.class).get());
	};

	 l = lcb.flush().get();
	$$props = exclude_internal_props($$props);

	return [
		open,
		c,
		classes,
		listClasses,
		$$scope,
		$$slots,
		click_handler,
		click_handler_1
	];
}

class MenuUser extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { open: 0, classes: 2, listClasses: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "MenuUser",
			options,
			id: create_fragment$2.name
		});
	}

	get open() {
		throw new Error("<MenuUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set open(value) {
		throw new Error("<MenuUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get classes() {
		throw new Error("<MenuUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set classes(value) {
		throw new Error("<MenuUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get listClasses() {
		throw new Error("<MenuUser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set listClasses(value) {
		throw new Error("<MenuUser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/Profile.svelte generated by Svelte v3.24.0 */
const file$3 = "src/components/Profile.svelte";

// (66:4) <div slot="activator" class="my-1">
function create_activator_slot(ctx) {
	let div;
	let button;
	let svg;
	let path;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			svg = svg_element("svg");
			path = svg_element("path");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { slot: true, class: true });
			var div_nodes = children(div);
			button = claim_element(div_nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			svg = claim_element(button_nodes, "svg", { class: true, viewBox: true }, 1);
			var svg_nodes = children(svg);

			path = claim_element(
				svg_nodes,
				"path",
				{
					"fill-rule": true,
					d: true,
					"clip-rule": true
				},
				1
			);

			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			button_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$3, 68, 16, 1702);
			attr_dev(svg, "class", "fill-current w-6 h-6 svelte-1djjzqq");
			attr_dev(svg, "viewBox", "0 0 20 20");
			add_location(svg, file$3, 67, 12, 1631);
			attr_dev(button, "class", "svelte-1djjzqq");
			add_location(button, file$3, 66, 8, 1578);
			attr_dev(div, "slot", "activator");
			attr_dev(div, "class", "my-1 svelte-1djjzqq");
			add_location(div, file$3, 65, 4, 1534);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(button, svg);
			append_dev(svg, path);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_activator_slot.name,
		type: "slot",
		source: "(66:4) <div slot=\\\"activator\\\" class=\\\"my-1\\\">",
		ctx
	});

	return block;
}

// (49:0) <MenuUser bind:open>
function create_default_slot$1(ctx) {
	let div;
	let img;
	let img_src_value;
	let t0;
	let t1;
	let t2;
	let hr0;
	let t3;
	let p;
	let t4;
	let t5;
	let hr1;
	let t6;
	let a;
	let t7;
	let t8;
	let br0;
	let t9;
	let br1;
	let t10;
	let button;
	let t11;
	let t12;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			img = element("img");
			t0 = space();
			t1 = text(/*displayName*/ ctx[0]);
			t2 = space();
			hr0 = element("hr");
			t3 = space();
			p = element("p");
			t4 = text("Баланс: 100000$");
			t5 = space();
			hr1 = element("hr");
			t6 = space();
			a = element("a");
			t7 = text("Настройки");
			t8 = space();
			br0 = element("br");
			t9 = space();
			br1 = element("br");
			t10 = space();
			button = element("button");
			t11 = text("Logout");
			t12 = space();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			img = claim_element(div_nodes, "IMG", { src: true, class: true, alt: true });
			t0 = claim_space(div_nodes);
			t1 = claim_text(div_nodes, /*displayName*/ ctx[0]);
			t2 = claim_space(div_nodes);
			hr0 = claim_element(div_nodes, "HR", { class: true });
			t3 = claim_space(div_nodes);
			p = claim_element(div_nodes, "P", {});
			var p_nodes = children(p);
			t4 = claim_text(p_nodes, "Баланс: 100000$");
			p_nodes.forEach(detach_dev);
			t5 = claim_space(div_nodes);
			hr1 = claim_element(div_nodes, "HR", { class: true });
			t6 = claim_space(div_nodes);
			a = claim_element(div_nodes, "A", { href: true });
			var a_nodes = children(a);
			t7 = claim_text(a_nodes, "Настройки");
			a_nodes.forEach(detach_dev);
			t8 = claim_space(div_nodes);
			br0 = claim_element(div_nodes, "BR", {});
			t9 = claim_space(div_nodes);
			br1 = claim_element(div_nodes, "BR", {});
			t10 = claim_space(div_nodes);
			button = claim_element(div_nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			t11 = claim_text(button_nodes, "Logout");
			button_nodes.forEach(detach_dev);
			div_nodes.forEach(detach_dev);
			t12 = claim_space(nodes);
			this.h();
		},
		h: function hydrate() {
			if (img.src !== (img_src_value = /*photoURL*/ ctx[1])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", "h-10 w-10 rounded-full mx-5");
			attr_dev(img, "alt", "user avatar");
			add_location(img, file$3, 52, 8, 1102);
			attr_dev(hr0, "class", "text-dark-700 m-2");
			add_location(hr0, file$3, 54, 8, 1209);
			add_location(p, file$3, 56, 8, 1251);
			attr_dev(hr1, "class", "text-dark-700 m-2");
			add_location(hr1, file$3, 57, 8, 1282);
			attr_dev(a, "href", "settings");
			add_location(a, file$3, 58, 8, 1323);
			add_location(br0, file$3, 59, 8, 1364);
			add_location(br1, file$3, 60, 8, 1379);
			attr_dev(button, "class", "bg-primary-500 hover:bg-primary-300 rounded-lg px-4 svelte-1djjzqq");
			add_location(button, file$3, 61, 8, 1394);
			attr_dev(div, "class", "bg-dark-400 dark:bg-dark-400 menu svelte-1djjzqq");
			add_location(div, file$3, 50, 4, 1045);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, img);
			append_dev(div, t0);
			append_dev(div, t1);
			append_dev(div, t2);
			append_dev(div, hr0);
			append_dev(div, t3);
			append_dev(div, p);
			append_dev(p, t4);
			append_dev(div, t5);
			append_dev(div, hr1);
			append_dev(div, t6);
			append_dev(div, a);
			append_dev(a, t7);
			append_dev(div, t8);
			append_dev(div, br0);
			append_dev(div, t9);
			append_dev(div, br1);
			append_dev(div, t10);
			append_dev(div, button);
			append_dev(button, t11);
			insert_dev(target, t12, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", signOut$1, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*photoURL*/ 2 && img.src !== (img_src_value = /*photoURL*/ ctx[1])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*displayName*/ 1) set_data_dev(t1, /*displayName*/ ctx[0]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t12);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(49:0) <MenuUser bind:open>",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let menuuser;
	let updating_open;
	let current;

	function menuuser_open_binding(value) {
		/*menuuser_open_binding*/ ctx[4].call(null, value);
	}

	let menuuser_props = {
		$$slots: {
			default: [create_default_slot$1],
			activator: [create_activator_slot]
		},
		$$scope: { ctx }
	};

	if (/*open*/ ctx[2] !== void 0) {
		menuuser_props.open = /*open*/ ctx[2];
	}

	menuuser = new MenuUser({ props: menuuser_props, $$inline: true });
	binding_callbacks.push(() => bind(menuuser, "open", menuuser_open_binding));

	const block = {
		c: function create() {
			create_component(menuuser.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(menuuser.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(menuuser, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const menuuser_changes = {};

			if (dirty & /*$$scope, open, displayName, photoURL*/ 39) {
				menuuser_changes.$$scope = { dirty, ctx };
			}

			if (!updating_open && dirty & /*open*/ 4) {
				updating_open = true;
				menuuser_changes.open = /*open*/ ctx[2];
				add_flush_callback(() => updating_open = false);
			}

			menuuser.$set(menuuser_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(menuuser.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(menuuser.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(menuuser, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { displayName } = $$props;
	let { photoURL } = $$props;

	//export let uid;
	let open = false;

	const writable_props = ["displayName", "photoURL"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Profile", $$slots, []);
	const click_handler = () => $$invalidate(2, open = !open);

	function menuuser_open_binding(value) {
		open = value;
		$$invalidate(2, open);
	}

	$$self.$set = $$props => {
		if ("displayName" in $$props) $$invalidate(0, displayName = $$props.displayName);
		if ("photoURL" in $$props) $$invalidate(1, photoURL = $$props.photoURL);
	};

	$$self.$capture_state = () => ({
		Button,
		MenuUser,
		signOut: signOut$1,
		displayName,
		photoURL,
		open
	});

	$$self.$inject_state = $$props => {
		if ("displayName" in $$props) $$invalidate(0, displayName = $$props.displayName);
		if ("photoURL" in $$props) $$invalidate(1, photoURL = $$props.photoURL);
		if ("open" in $$props) $$invalidate(2, open = $$props.open);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [displayName, photoURL, open, click_handler, menuuser_open_binding];
}

class Profile extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { displayName: 0, photoURL: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Profile",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*displayName*/ ctx[0] === undefined && !("displayName" in props)) {
			console.warn("<Profile> was created without expected prop 'displayName'");
		}

		if (/*photoURL*/ ctx[1] === undefined && !("photoURL" in props)) {
			console.warn("<Profile> was created without expected prop 'photoURL'");
		}
	}

	get displayName() {
		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set displayName(value) {
		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get photoURL() {
		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set photoURL(value) {
		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/SignInButton.svelte generated by Svelte v3.24.0 */
const file$4 = "src/components/SignInButton.svelte";

// (9:0) {:else}
function create_else_block$1(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text("No provider was provided as a prop");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", {});
			var div_nodes = children(div);
			t = claim_text(div_nodes, "No provider was provided as a prop");
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(div, file$4, 9, 4, 258);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(9:0) {:else}",
		ctx
	});

	return block;
}

// (7:0) {#if provider === 'google'}
function create_if_block$2(ctx) {
	let button;
	let current;

	button = new Button({
			props: {
				outlined: true,
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", signInWithGoogle$1);

	const block = {
		c: function create() {
			create_component(button.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(button.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(button, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty & /*$$scope*/ 2) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(button, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(7:0) {#if provider === 'google'}",
		ctx
	});

	return block;
}

// (8:4) <Button outlined on:click={signInWithGoogle}>
function create_default_slot$2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Sign in");
		},
		l: function claim(nodes) {
			t = claim_text(nodes, "Sign in");
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
		id: create_default_slot$2.name,
		type: "slot",
		source: "(8:4) <Button outlined on:click={signInWithGoogle}>",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$2, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*provider*/ ctx[0] === "google") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { provider } = $$props;
	const writable_props = ["provider"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SignInButton> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("SignInButton", $$slots, []);

	$$self.$set = $$props => {
		if ("provider" in $$props) $$invalidate(0, provider = $$props.provider);
	};

	$$self.$capture_state = () => ({ signInWithGoogle: signInWithGoogle$1, Button, provider });

	$$self.$inject_state = $$props => {
		if ("provider" in $$props) $$invalidate(0, provider = $$props.provider);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [provider];
}

class SignInButton extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { provider: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SignInButton",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*provider*/ ctx[0] === undefined && !("provider" in props)) {
			console.warn("<SignInButton> was created without expected prop 'provider'");
		}
	}

	get provider() {
		throw new Error("<SignInButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set provider(value) {
		throw new Error("<SignInButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/Login.svelte generated by Svelte v3.24.0 */
const file$5 = "src/components/Login.svelte";

// (26:4) {:else}
function create_else_block$2(ctx) {
	let signinbutton;
	let current;

	signinbutton = new SignInButton({
			props: { provider: "google" },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(signinbutton.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(signinbutton.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(signinbutton, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(signinbutton.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(signinbutton.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(signinbutton, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(26:4) {:else}",
		ctx
	});

	return block;
}

// (22:4) {#if $authStore.status === 'in'}
function create_if_block$3(ctx) {
	let div;
	let profile;
	let current;
	const profile_spread_levels = [/*$authStore*/ ctx[0].user];
	let profile_props = {};

	for (let i = 0; i < profile_spread_levels.length; i += 1) {
		profile_props = assign(profile_props, profile_spread_levels[i]);
	}

	profile = new Profile({ props: profile_props, $$inline: true });

	const block = {
		c: function create() {
			div = element("div");
			create_component(profile.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(profile.$$.fragment, div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "mtmt svelte-155m2yj");
			add_location(div, file$5, 22, 8, 468);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(profile, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const profile_changes = (dirty & /*$authStore*/ 1)
			? get_spread_update(profile_spread_levels, [get_spread_object(/*$authStore*/ ctx[0].user)])
			: {};

			profile.$set(profile_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(profile.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(profile.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(profile);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(22:4) {#if $authStore.status === 'in'}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let section;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block$3, create_else_block$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$authStore*/ ctx[0].status === "in") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			section = element("section");
			if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			section = claim_element(nodes, "SECTION", { class: true });
			var section_nodes = children(section);
			if_block.l(section_nodes);
			section_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(section, "class", "knob svelte-155m2yj");
			add_location(section, file$5, 20, 0, 400);
		},
		m: function mount(target, anchor) {
			insert_dev(target, section, anchor);
			if_blocks[current_block_type_index].m(section, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(section, null);
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
			if (detaching) detach_dev(section);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let $authStore;
	validate_store(authStore, "authStore");
	component_subscribe($$self, authStore, $$value => $$invalidate(0, $authStore = $$value));
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Login", $$slots, []);

	$$self.$capture_state = () => ({
		signOut: signOut$1,
		authStore,
		Profile,
		SignInButton,
		$authStore
	});

	return [$authStore];
}

class Login extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Login",
			options,
			id: create_fragment$5.name
		});
	}
}

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

/* src/components/Nav.svelte generated by Svelte v3.24.0 */
const file$6 = "src/components/Nav.svelte";

// (97:20) <Button bind:value={$darkMode} outlined>
function create_default_slot_1$1(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text("◐");
			this.h();
		},
		l: function claim(nodes) {
			span = claim_element(nodes, "SPAN", { class: true });
			var span_nodes = children(span);
			t = claim_text(span_nodes, "◐");
			span_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span, "class", "text-lg leading-none");
			add_location(span, file$6, 97, 24, 3533);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$1.name,
		type: "slot",
		source: "(97:20) <Button bind:value={$darkMode} outlined>",
		ctx
	});

	return block;
}

// (101:20) <Button href="settings" outlined>
function create_default_slot$3(ctx) {
	let span;
	let t;

	const block = {
		c: function create() {
			span = element("span");
			t = text("⚙");
			this.h();
		},
		l: function claim(nodes) {
			span = claim_element(nodes, "SPAN", { class: true });
			var span_nodes = children(span);
			t = claim_text(span_nodes, "⚙");
			span_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(span, "class", "text-2xl leading-none");
			add_location(span, file$6, 101, 24, 3718);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(101:20) <Button href=\\\"settings\\\" outlined>",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let nav;
	let div0;
	let a0;
	let svg0;
	let g;
	let path0;
	let defs;
	let clipPath;
	let rect;
	let a0_aria_current_value;
	let t0;
	let div1;
	let button0;
	let svg1;
	let title;
	let t1;
	let path1;
	let t2;
	let div3;
	let ul;
	let li0;
	let a1;
	let t3;
	let a1_aria_current_value;
	let t4;
	let li1;
	let a2;
	let t5;
	let a2_aria_current_value;
	let t6;
	let li2;
	let login;
	let t7;
	let li3;
	let div2;
	let button1;
	let updating_value;
	let t8;
	let button2;
	let current;
	login = new Login({ $$inline: true });

	function button1_value_binding(value) {
		/*button1_value_binding*/ ctx[3].call(null, value);
	}

	let button1_props = {
		outlined: true,
		$$slots: { default: [create_default_slot_1$1] },
		$$scope: { ctx }
	};

	if (/*$darkMode*/ ctx[1] !== void 0) {
		button1_props.value = /*$darkMode*/ ctx[1];
	}

	button1 = new Button({ props: button1_props, $$inline: true });
	binding_callbacks.push(() => bind(button1, "value", button1_value_binding));

	button2 = new Button({
			props: {
				href: "settings",
				outlined: true,
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			nav = element("nav");
			div0 = element("div");
			a0 = element("a");
			svg0 = svg_element("svg");
			g = svg_element("g");
			path0 = svg_element("path");
			defs = svg_element("defs");
			clipPath = svg_element("clipPath");
			rect = svg_element("rect");
			t0 = space();
			div1 = element("div");
			button0 = element("button");
			svg1 = svg_element("svg");
			title = svg_element("title");
			t1 = text("Menu");
			path1 = svg_element("path");
			t2 = space();
			div3 = element("div");
			ul = element("ul");
			li0 = element("li");
			a1 = element("a");
			t3 = text("blog");
			t4 = space();
			li1 = element("li");
			a2 = element("a");
			t5 = text("about");
			t6 = space();
			li2 = element("li");
			create_component(login.$$.fragment);
			t7 = space();
			li3 = element("li");
			div2 = element("div");
			create_component(button1.$$.fragment);
			t8 = text("\n                     \n                    ");
			create_component(button2.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			nav = claim_element(nodes, "NAV", { class: true });
			var nav_nodes = children(nav);
			div0 = claim_element(nav_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			a0 = claim_element(div0_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a0_nodes = children(a0);

			svg0 = claim_element(
				a0_nodes,
				"svg",
				{
					width: true,
					height: true,
					viewBox: true,
					fill: true,
					xmlns: true
				},
				1
			);

			var svg0_nodes = children(svg0);
			g = claim_element(svg0_nodes, "g", { "clip-path": true }, 1);
			var g_nodes = children(g);

			path0 = claim_element(
				g_nodes,
				"path",
				{
					"fill-rule": true,
					"clip-rule": true,
					d: true,
					fill: true
				},
				1
			);

			children(path0).forEach(detach_dev);
			g_nodes.forEach(detach_dev);
			defs = claim_element(svg0_nodes, "defs", {}, 1);
			var defs_nodes = children(defs);
			clipPath = claim_element(defs_nodes, "clipPath", { id: true }, 1);
			var clipPath_nodes = children(clipPath);
			rect = claim_element(clipPath_nodes, "rect", { width: true, height: true, fill: true }, 1);
			children(rect).forEach(detach_dev);
			clipPath_nodes.forEach(detach_dev);
			defs_nodes.forEach(detach_dev);
			svg0_nodes.forEach(detach_dev);
			a0_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t0 = claim_space(nav_nodes);
			div1 = claim_element(nav_nodes, "DIV", { class: true, id: true });
			var div1_nodes = children(div1);
			button0 = claim_element(div1_nodes, "BUTTON", { id: true, class: true });
			var button0_nodes = children(button0);
			svg1 = claim_element(button0_nodes, "svg", { class: true, viewBox: true, xmlns: true }, 1);
			var svg1_nodes = children(svg1);
			title = claim_element(svg1_nodes, "title", {}, 1);
			var title_nodes = children(title);
			t1 = claim_text(title_nodes, "Menu");
			title_nodes.forEach(detach_dev);
			path1 = claim_element(svg1_nodes, "path", { d: true }, 1);
			children(path1).forEach(detach_dev);
			svg1_nodes.forEach(detach_dev);
			button0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			t2 = claim_space(nav_nodes);
			div3 = claim_element(nav_nodes, "DIV", { class: true, id: true });
			var div3_nodes = children(div3);
			ul = claim_element(div3_nodes, "UL", { class: true });
			var ul_nodes = children(ul);
			li0 = claim_element(ul_nodes, "LI", { class: true });
			var li0_nodes = children(li0);

			a1 = claim_element(li0_nodes, "A", {
				class: true,
				rel: true,
				"aria-current": true,
				href: true
			});

			var a1_nodes = children(a1);
			t3 = claim_text(a1_nodes, "blog");
			a1_nodes.forEach(detach_dev);
			li0_nodes.forEach(detach_dev);
			t4 = claim_space(ul_nodes);
			li1 = claim_element(ul_nodes, "LI", { class: true });
			var li1_nodes = children(li1);

			a2 = claim_element(li1_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a2_nodes = children(a2);
			t5 = claim_text(a2_nodes, "about");
			a2_nodes.forEach(detach_dev);
			li1_nodes.forEach(detach_dev);
			t6 = claim_space(ul_nodes);
			li2 = claim_element(ul_nodes, "LI", { class: true });
			var li2_nodes = children(li2);
			claim_component(login.$$.fragment, li2_nodes);
			li2_nodes.forEach(detach_dev);
			t7 = claim_space(ul_nodes);
			li3 = claim_element(ul_nodes, "LI", { class: true });
			var li3_nodes = children(li3);
			div2 = claim_element(li3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			claim_component(button1.$$.fragment, div2_nodes);
			t8 = claim_text(div2_nodes, "\n                     \n                    ");
			claim_component(button2.$$.fragment, div2_nodes);
			div2_nodes.forEach(detach_dev);
			li3_nodes.forEach(detach_dev);
			ul_nodes.forEach(detach_dev);
			div3_nodes.forEach(detach_dev);
			nav_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path0, "fill-rule", "evenodd");
			attr_dev(path0, "clip-rule", "evenodd");
			attr_dev(path0, "d", "M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631 36.3445L8.96631\n                        8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552 18.3618L35.2663\n                        18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552 22.571L30.9552\n                        29.7173C30.7305 32.6744 32.6316 34.8393 35.2663 34.9937ZM29.9591\n                        21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194 21.729L21.5194\n                        34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z");
			attr_dev(path0, "fill", "#F0B90B");
			add_location(path0, file$6, 32, 20, 946);
			attr_dev(g, "clip-path", "url(#clip0)");
			add_location(g, file$6, 31, 16, 898);
			attr_dev(rect, "width", "45");
			attr_dev(rect, "height", "45");
			attr_dev(rect, "fill", "white");
			add_location(rect, file$6, 45, 24, 1733);
			attr_dev(clipPath, "id", "clip0");
			add_location(clipPath, file$6, 44, 20, 1687);
			add_location(defs, file$6, 43, 16, 1660);
			attr_dev(svg0, "width", "45");
			attr_dev(svg0, "height", "45");
			attr_dev(svg0, "viewBox", "0 0 45 45");
			attr_dev(svg0, "fill", "none");
			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg0, file$6, 25, 12, 706);
			attr_dev(a0, "class", "text-white no-underline hover:text-white hover:no-underline");
			attr_dev(a0, "aria-current", a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined);
			attr_dev(a0, "href", ".");
			add_location(a0, file$6, 21, 8, 519);
			attr_dev(div0, "class", "flex items-center flex-shrink-0 text-white mr-6");
			add_location(div0, file$6, 19, 4, 448);
			add_location(title, file$6, 62, 16, 2273);
			attr_dev(path1, "d", "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z");
			add_location(path1, file$6, 63, 16, 2309);
			attr_dev(svg1, "class", "fill-current h-3 w-3");
			attr_dev(svg1, "viewBox", "0 0 20 20");
			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg1, file$6, 58, 12, 2119);
			attr_dev(button0, "id", "nav-toggle");
			attr_dev(button0, "class", "flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600\n            hover:text-white hover:border-white");
			add_location(button0, file$6, 54, 8, 1929);
			attr_dev(div1, "class", "lg:hidden");
			attr_dev(div1, "id", "nav-knob");
			add_location(div1, file$6, 53, 4, 1883);
			attr_dev(a1, "class", "inline-block py-2 px-4 text-white no-underline");
			attr_dev(a1, "rel", "prefetch");
			attr_dev(a1, "aria-current", a1_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a1, "href", "blog");
			add_location(a1, file$6, 74, 16, 2656);
			attr_dev(li0, "class", "mr-3");
			add_location(li0, file$6, 72, 12, 2621);
			attr_dev(a2, "class", "inline-block text-white no-underline hover:text-gray-300\n                    hover:text-underline py-2 px-4");
			attr_dev(a2, "aria-current", a2_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined);
			attr_dev(a2, "href", "about");
			add_location(a2, file$6, 83, 16, 2987);
			attr_dev(li1, "class", "mr-3");
			add_location(li1, file$6, 82, 12, 2953);
			attr_dev(li2, "class", "mr-3");
			add_location(li2, file$6, 91, 12, 3313);
			attr_dev(div2, "class", "darkmodeknob svelte-pknbhk");
			add_location(div2, file$6, 95, 16, 3421);
			attr_dev(li3, "class", "mr-3");
			add_location(li3, file$6, 94, 12, 3387);
			attr_dev(ul, "class", "list-reset lg:flex justify-end flex-1 items-center");
			add_location(ul, file$6, 71, 8, 2545);
			attr_dev(div3, "class", "w-full flex-grow lg:flex lg:items-center lg:w-auto hidden pt-6 lg:pt-0");
			attr_dev(div3, "id", "nav-content");
			add_location(div3, file$6, 68, 4, 2419);
			attr_dev(nav, "class", "flex items-center justify-between flex-wrap bg-gray-300 dark:bg-gray-800 p-1 fixed w-full\n    z-10 top-0");
			add_location(nav, file$6, 16, 0, 321);
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, div0);
			append_dev(div0, a0);
			append_dev(a0, svg0);
			append_dev(svg0, g);
			append_dev(g, path0);
			append_dev(svg0, defs);
			append_dev(defs, clipPath);
			append_dev(clipPath, rect);
			append_dev(nav, t0);
			append_dev(nav, div1);
			append_dev(div1, button0);
			append_dev(button0, svg1);
			append_dev(svg1, title);
			append_dev(title, t1);
			append_dev(svg1, path1);
			append_dev(nav, t2);
			append_dev(nav, div3);
			append_dev(div3, ul);
			append_dev(ul, li0);
			append_dev(li0, a1);
			append_dev(a1, t3);
			append_dev(ul, t4);
			append_dev(ul, li1);
			append_dev(li1, a2);
			append_dev(a2, t5);
			append_dev(ul, t6);
			append_dev(ul, li2);
			mount_component(login, li2, null);
			append_dev(ul, t7);
			append_dev(ul, li3);
			append_dev(li3, div2);
			mount_component(button1, div2, null);
			append_dev(div2, t8);
			mount_component(button2, div2, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*segment*/ 1 && a0_aria_current_value !== (a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined)) {
				attr_dev(a0, "aria-current", a0_aria_current_value);
			}

			if (!current || dirty & /*segment*/ 1 && a1_aria_current_value !== (a1_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a1, "aria-current", a1_aria_current_value);
			}

			if (!current || dirty & /*segment*/ 1 && a2_aria_current_value !== (a2_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined)) {
				attr_dev(a2, "aria-current", a2_aria_current_value);
			}

			const button1_changes = {};

			if (dirty & /*$$scope*/ 16) {
				button1_changes.$$scope = { dirty, ctx };
			}

			if (!updating_value && dirty & /*$darkMode*/ 2) {
				updating_value = true;
				button1_changes.value = /*$darkMode*/ ctx[1];
				add_flush_callback(() => updating_value = false);
			}

			button1.$set(button1_changes);
			const button2_changes = {};

			if (dirty & /*$$scope*/ 16) {
				button2_changes.$$scope = { dirty, ctx };
			}

			button2.$set(button2_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(login.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			transition_in(button2.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(login.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			transition_out(button2.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			destroy_component(login);
			destroy_component(button1);
			destroy_component(button2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let $darkMode;
	let { segment } = $$props;
	let darkMode = dark();
	validate_store(darkMode, "darkMode");
	component_subscribe($$self, darkMode, value => $$invalidate(1, $darkMode = value));
	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Nav", $$slots, []);

	function button1_value_binding(value) {
		$darkMode = value;
		darkMode.set($darkMode);
	}

	$$self.$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
	};

	$$self.$capture_state = () => ({
		segment,
		Login,
		dark,
		darkMode,
		Button,
		$darkMode
	});

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
		if ("darkMode" in $$props) $$invalidate(2, darkMode = $$props.darkMode);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [segment, $darkMode, darkMode, button1_value_binding];
}

class Nav extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Nav> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function fade(node, { delay = 0, duration = 400, easing = identity }) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        easing,
        css: t => `opacity: ${t * o}`
    };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}
function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const padding_top = parseFloat(style.paddingTop);
    const padding_bottom = parseFloat(style.paddingBottom);
    const margin_top = parseFloat(style.marginTop);
    const margin_bottom = parseFloat(style.marginBottom);
    const border_top_width = parseFloat(style.borderTopWidth);
    const border_bottom_width = parseFloat(style.borderBottomWidth);
    return {
        delay,
        duration,
        easing,
        css: t => `overflow: hidden;` +
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            `height: ${t * height}px;` +
            `padding-top: ${t * padding_top}px;` +
            `padding-bottom: ${t * padding_bottom}px;` +
            `margin-top: ${t * margin_top}px;` +
            `margin-bottom: ${t * margin_bottom}px;` +
            `border-top-width: ${t * border_top_width}px;` +
            `border-bottom-width: ${t * border_bottom_width}px;`
    };
}

/* node_modules/smelte/src/components/Util/Scrim.svelte generated by Svelte v3.24.0 */
const file$7 = "node_modules/smelte/src/components/Util/Scrim.svelte";

function create_fragment$7(ctx) {
	let div;
	let div_intro;
	let div_outro;
	let current;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true });
			children(div).forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "bg-black fixed top-0 left-0 z-10 w-full h-full");
			set_style(div, "opacity", /*opacity*/ ctx[0]);
			add_location(div, file$7, 9, 0, 262);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			current = true;

			if (!mounted) {
				dispose = listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*opacity*/ 1) {
				set_style(div, "opacity", /*opacity*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;

			add_render_callback(() => {
				if (div_outro) div_outro.end(1);
				if (!div_intro) div_intro = create_in_transition(div, fade, /*inProps*/ ctx[1]);
				div_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, fade, /*outProps*/ ctx[2]);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (detaching && div_outro) div_outro.end();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let { opacity = 0.5 } = $$props;
	let { inProps = { duration: 200, easing: quadIn } } = $$props;
	let { outProps = { duration: 200, easing: quadOut } } = $$props;
	const writable_props = ["opacity", "inProps", "outProps"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Scrim> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Scrim", $$slots, []);

	function click_handler(event) {
		bubble($$self, event);
	}

	$$self.$set = $$props => {
		if ("opacity" in $$props) $$invalidate(0, opacity = $$props.opacity);
		if ("inProps" in $$props) $$invalidate(1, inProps = $$props.inProps);
		if ("outProps" in $$props) $$invalidate(2, outProps = $$props.outProps);
	};

	$$self.$capture_state = () => ({
		fade,
		quadOut,
		quadIn,
		opacity,
		inProps,
		outProps
	});

	$$self.$inject_state = $$props => {
		if ("opacity" in $$props) $$invalidate(0, opacity = $$props.opacity);
		if ("inProps" in $$props) $$invalidate(1, inProps = $$props.inProps);
		if ("outProps" in $$props) $$invalidate(2, outProps = $$props.outProps);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [opacity, inProps, outProps, click_handler];
}

class Scrim extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { opacity: 0, inProps: 1, outProps: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Scrim",
			options,
			id: create_fragment$7.name
		});
	}

	get opacity() {
		throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set opacity(value) {
		throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inProps() {
		throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inProps(value) {
		throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get outProps() {
		throw new Error("<Scrim>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set outProps(value) {
		throw new Error("<Scrim>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

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
const file$8 = "node_modules/smelte/src/components/NavigationDrawer/NavigationDrawer.svelte";

// (70:0) {#if show}
function create_if_block$4(ctx) {
	let aside;
	let t;
	let nav;
	let div;
	let nav_class_value;
	let aside_class_value;
	let aside_transition;
	let current;
	let if_block = !/*persistent*/ ctx[0] && create_if_block_1$1(ctx);
	const default_slot_template = /*$$slots*/ ctx[12].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

	const block = {
		c: function create() {
			aside = element("aside");
			if (if_block) if_block.c();
			t = space();
			nav = element("nav");
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			aside = claim_element(nodes, "ASIDE", { class: true });
			var aside_nodes = children(aside);
			if (if_block) if_block.l(aside_nodes);
			t = claim_space(aside_nodes);
			nav = claim_element(aside_nodes, "NAV", { role: true, class: true });
			var nav_nodes = children(nav);
			div = claim_element(nav_nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach_dev);
			nav_nodes.forEach(detach_dev);
			aside_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "w-full");
			add_location(div, file$8, 81, 6, 1848);
			attr_dev(nav, "role", "navigation");
			attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(/*n*/ ctx[4]) + " svelte-6qcjcu"));
			add_location(nav, file$8, 77, 4, 1791);
			attr_dev(aside, "class", aside_class_value = "" + (null_to_empty(/*c*/ ctx[3]) + " svelte-6qcjcu"));
			add_location(aside, file$8, 70, 2, 1647);
		},
		m: function mount(target, anchor) {
			insert_dev(target, aside, anchor);
			if (if_block) if_block.m(aside, null);
			append_dev(aside, t);
			append_dev(aside, nav);
			append_dev(nav, div);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (!/*persistent*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*persistent*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(aside, t);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 2048) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
				}
			}

			if (!current || dirty & /*n*/ 16 && nav_class_value !== (nav_class_value = "" + (null_to_empty(/*n*/ ctx[4]) + " svelte-6qcjcu"))) {
				attr_dev(nav, "class", nav_class_value);
			}

			if (!current || dirty & /*c*/ 8 && aside_class_value !== (aside_class_value = "" + (null_to_empty(/*c*/ ctx[3]) + " svelte-6qcjcu"))) {
				attr_dev(aside, "class", aside_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly, /*transitionProps*/ ctx[2], true);
				aside_transition.run(1);
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			transition_out(default_slot, local);
			if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fly, /*transitionProps*/ ctx[2], false);
			aside_transition.run(0);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(aside);
			if (if_block) if_block.d();
			if (default_slot) default_slot.d(detaching);
			if (detaching && aside_transition) aside_transition.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(70:0) {#if show}",
		ctx
	});

	return block;
}

// (75:4) {#if !persistent}
function create_if_block_1$1(ctx) {
	let scrim;
	let current;
	scrim = new Scrim$1({ $$inline: true });
	scrim.$on("click", /*click_handler*/ ctx[13]);

	const block = {
		c: function create() {
			create_component(scrim.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(scrim.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(scrim, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(scrim.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(scrim.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(scrim, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(75:4) {#if !persistent}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*show*/ ctx[1] && create_if_block$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*show*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*show*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const classesDefault$2 = "fixed top-0 md:mt-16 w-auto drawer overflow-hidden h-full";

function instance$8($$self, $$props, $$invalidate) {
	let $bp;
	const bp = breakpoint();
	validate_store(bp, "bp");
	component_subscribe($$self, bp, value => $$invalidate(14, $bp = value));

	const navClassesDefault = `h-full w-full bg-white dark:bg-gray-900 dark:text-gray-200 absolute flex w-auto z-20 drawer
    pointer-events-auto overflow-y-auto`;

	let { right = false } = $$props;
	let { persistent = false } = $$props;
	let { elevation = true } = $$props;
	let { show = true } = $$props;
	let { classes = classesDefault$2 } = $$props;
	let { navClasses = navClassesDefault } = $$props;
	let { borderClasses = `border-gray-600 ${right ? "border-l" : "border-r"}` } = $$props;

	let { transitionProps = {
		duration: 200,
		x: -300,
		easing: quadIn,
		opacity: 1
	} } = $$props;

	const cb = new ClassBuilder(classes, classesDefault$2);
	if ($bp === "sm") show = false;
	const ncb = new ClassBuilder(navClasses, navClassesDefault);
	let { $$slots = {}, $$scope } = $$props;
	validate_slots("NavigationDrawer", $$slots, ['default']);
	const click_handler = () => $$invalidate(1, show = false);

	$$self.$set = $$new_props => {
		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("right" in $$new_props) $$invalidate(6, right = $$new_props.right);
		if ("persistent" in $$new_props) $$invalidate(0, persistent = $$new_props.persistent);
		if ("elevation" in $$new_props) $$invalidate(7, elevation = $$new_props.elevation);
		if ("show" in $$new_props) $$invalidate(1, show = $$new_props.show);
		if ("classes" in $$new_props) $$invalidate(8, classes = $$new_props.classes);
		if ("navClasses" in $$new_props) $$invalidate(9, navClasses = $$new_props.navClasses);
		if ("borderClasses" in $$new_props) $$invalidate(10, borderClasses = $$new_props.borderClasses);
		if ("transitionProps" in $$new_props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		fly,
		quadIn,
		Scrim: Scrim$1,
		breakpoints: breakpoint,
		ClassBuilder,
		bp,
		classesDefault: classesDefault$2,
		navClassesDefault,
		right,
		persistent,
		elevation,
		show,
		classes,
		navClasses,
		borderClasses,
		transitionProps,
		cb,
		ncb,
		$bp,
		c,
		n
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
		if ("right" in $$props) $$invalidate(6, right = $$new_props.right);
		if ("persistent" in $$props) $$invalidate(0, persistent = $$new_props.persistent);
		if ("elevation" in $$props) $$invalidate(7, elevation = $$new_props.elevation);
		if ("show" in $$props) $$invalidate(1, show = $$new_props.show);
		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
		if ("navClasses" in $$props) $$invalidate(9, navClasses = $$new_props.navClasses);
		if ("borderClasses" in $$props) $$invalidate(10, borderClasses = $$new_props.borderClasses);
		if ("transitionProps" in $$props) $$invalidate(2, transitionProps = $$new_props.transitionProps);
		if ("c" in $$props) $$invalidate(3, c = $$new_props.c);
		if ("n" in $$props) $$invalidate(4, n = $$new_props.n);
	};

	let c;
	let n;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*right*/ 64) {
			 $$invalidate(2, transitionProps.x = right ? 300 : -300, transitionProps);
		}

		if ($$self.$$.dirty & /*$bp*/ 16384) {
			 $$invalidate(0, persistent = $$invalidate(1, show = $bp !== "sm"));
		}

		 $$invalidate(3, c = cb.flush().add(classes, true, classesDefault$2).add(borderClasses, !elevation && persistent).add($$props.class).add("right-0", right).add("left-0", !right).add("pointer-events-none", persistent).add("z-50", !persistent).add("elevation-4", elevation).add("z-20", persistent).get());
	};

	 $$invalidate(4, n = ncb.flush().get());
	$$props = exclude_internal_props($$props);

	return [
		persistent,
		show,
		transitionProps,
		c,
		n,
		bp,
		right,
		elevation,
		classes,
		navClasses,
		borderClasses,
		$$scope,
		$$slots,
		click_handler
	];
}

class NavigationDrawer extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			right: 6,
			persistent: 0,
			elevation: 7,
			show: 1,
			classes: 8,
			navClasses: 9,
			borderClasses: 10,
			transitionProps: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NavigationDrawer",
			options,
			id: create_fragment$8.name
		});
	}

	get right() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set right(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get persistent() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set persistent(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elevation() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elevation(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get show() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set show(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get classes() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set classes(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get navClasses() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set navClasses(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get borderClasses() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set borderClasses(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get transitionProps() {
		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set transitionProps(value) {
		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/smelte/src/components/AppBar/AppBar.svelte generated by Svelte v3.24.0 */
const file$9 = "node_modules/smelte/src/components/AppBar/AppBar.svelte";

function create_fragment$9(ctx) {
	let header;
	let current;
	const default_slot_template = /*$$slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	const block = {
		c: function create() {
			header = element("header");
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			header = claim_element(nodes, "HEADER", { class: true });
			var header_nodes = children(header);
			if (default_slot) default_slot.l(header_nodes);
			header_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(header, "class", /*c*/ ctx[0]);
			add_location(header, file$9, 16, 0, 367);
		},
		m: function mount(target, anchor) {
			insert_dev(target, header, anchor);

			if (default_slot) {
				default_slot.m(header, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 4) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
				}
			}

			if (!current || dirty & /*c*/ 1) {
				attr_dev(header, "class", /*c*/ ctx[0]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let classesDefault = "fixed top-0 w-full items-center flex-wrap flex left-0 z-30 p-0 h-16 elevation-3 bg-primary-300 dark:bg-dark-600";
	let { classes = classesDefault } = $$props;
	const cb = new ClassBuilder(classes, classesDefault);
	let { $$slots = {}, $$scope } = $$props;
	validate_slots("AppBar", $$slots, ['default']);

	$$self.$set = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ("classes" in $$new_props) $$invalidate(1, classes = $$new_props.classes);
		if ("$$scope" in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		ClassBuilder,
		classesDefault,
		classes,
		cb,
		c
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
		if ("classesDefault" in $$props) classesDefault = $$new_props.classesDefault;
		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
		if ("c" in $$props) $$invalidate(0, c = $$new_props.c);
	};

	let c;

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		 $$invalidate(0, c = cb.flush().add($$props.class).get());
	};

	$$props = exclude_internal_props($$props);
	return [c, classes, $$scope, $$slots];
}

class AppBar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$9, safe_not_equal, { classes: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AppBar",
			options,
			id: create_fragment$9.name
		});
	}

	get classes() {
		throw new Error("<AppBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set classes(value) {
		throw new Error("<AppBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/_layout.svelte generated by Svelte v3.24.0 */
const file$a = "src/routes/_layout.svelte";

// (151:8) <Button bind:value={$darkMode} class="mr-2 ml-2">
function create_default_slot_2(ctx) {
	let svg;
	let path;

	const block = {
		c: function create() {
			svg = svg_element("svg");
			path = svg_element("path");
			this.h();
		},
		l: function claim(nodes) {
			svg = claim_element(nodes, "svg", { class: true, xmlns: true, viewBox: true }, 1);
			var svg_nodes = children(svg);

			path = claim_element(
				svg_nodes,
				"path",
				{
					"fill-rule": true,
					d: true,
					"clip-rule": true
				},
				1
			);

			children(path).forEach(detach_dev);
			svg_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018\n                    0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414\n                    1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1\n                    0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2\n                    0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414\n                    1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0\n                    011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$a, 155, 16, 4610);
			attr_dev(svg, "class", "fill-current w-6 h-6 svelte-yvhcc");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 20 20");
			add_location(svg, file$a, 151, 12, 4456);
		},
		m: function mount(target, anchor) {
			insert_dev(target, svg, anchor);
			append_dev(svg, path);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(svg);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(151:8) <Button bind:value={$darkMode} class=\\\"mr-2 ml-2\\\">",
		ctx
	});

	return block;
}

// (99:0) <AppBar class="bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0">
function create_default_slot_1$2(ctx) {
	let div0;
	let a;
	let svg0;
	let g;
	let path0;
	let defs;
	let clipPath;
	let rect;
	let a_aria_current_value;
	let t0;
	let div2;
	let div1;
	let svg1;
	let title;
	let t1;
	let path1;
	let t2;
	let div3;
	let t3_value = /*$stateStore*/ ctx[1].selectbotname + "";
	let t3;
	let t4;
	let div4;
	let login;
	let t5;
	let div5;
	let button;
	let updating_value;
	let current;
	let mounted;
	let dispose;
	login = new Login({ $$inline: true });

	function button_value_binding(value) {
		/*button_value_binding*/ ctx[11].call(null, value);
	}

	let button_props = {
		class: "mr-2 ml-2",
		$$slots: { default: [create_default_slot_2] },
		$$scope: { ctx }
	};

	if (/*$darkMode*/ ctx[3] !== void 0) {
		button_props.value = /*$darkMode*/ ctx[3];
	}

	button = new Button({ props: button_props, $$inline: true });
	binding_callbacks.push(() => bind(button, "value", button_value_binding));

	const block = {
		c: function create() {
			div0 = element("div");
			a = element("a");
			svg0 = svg_element("svg");
			g = svg_element("g");
			path0 = svg_element("path");
			defs = svg_element("defs");
			clipPath = svg_element("clipPath");
			rect = svg_element("rect");
			t0 = space();
			div2 = element("div");
			div1 = element("div");
			svg1 = svg_element("svg");
			title = svg_element("title");
			t1 = text("Menu");
			path1 = svg_element("path");
			t2 = space();
			div3 = element("div");
			t3 = text(t3_value);
			t4 = space();
			div4 = element("div");
			create_component(login.$$.fragment);
			t5 = space();
			div5 = element("div");
			create_component(button.$$.fragment);
			this.h();
		},
		l: function claim(nodes) {
			div0 = claim_element(nodes, "DIV", { class: true });
			var div0_nodes = children(div0);

			a = claim_element(div0_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a_nodes = children(a);

			svg0 = claim_element(
				a_nodes,
				"svg",
				{
					width: true,
					height: true,
					viewBox: true,
					fill: true,
					xmlns: true
				},
				1
			);

			var svg0_nodes = children(svg0);
			g = claim_element(svg0_nodes, "g", { "clip-path": true }, 1);
			var g_nodes = children(g);

			path0 = claim_element(
				g_nodes,
				"path",
				{
					"fill-rule": true,
					"clip-rule": true,
					d: true,
					fill: true
				},
				1
			);

			children(path0).forEach(detach_dev);
			g_nodes.forEach(detach_dev);
			defs = claim_element(svg0_nodes, "defs", {}, 1);
			var defs_nodes = children(defs);
			clipPath = claim_element(defs_nodes, "clipPath", { id: true }, 1);
			var clipPath_nodes = children(clipPath);
			rect = claim_element(clipPath_nodes, "rect", { width: true, height: true, fill: true }, 1);
			children(rect).forEach(detach_dev);
			clipPath_nodes.forEach(detach_dev);
			defs_nodes.forEach(detach_dev);
			svg0_nodes.forEach(detach_dev);
			a_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", {});
			var div1_nodes = children(div1);
			svg1 = claim_element(div1_nodes, "svg", { class: true, viewBox: true, xmlns: true }, 1);
			var svg1_nodes = children(svg1);
			title = claim_element(svg1_nodes, "title", {}, 1);
			var title_nodes = children(title);
			t1 = claim_text(title_nodes, "Menu");
			title_nodes.forEach(detach_dev);
			path1 = claim_element(svg1_nodes, "path", { d: true }, 1);
			children(path1).forEach(detach_dev);
			svg1_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			div3 = claim_element(nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			t3 = claim_text(div3_nodes, t3_value);
			div3_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			div4 = claim_element(nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			claim_component(login.$$.fragment, div4_nodes);
			div4_nodes.forEach(detach_dev);
			t5 = claim_space(nodes);
			div5 = claim_element(nodes, "DIV", { class: true });
			var div5_nodes = children(div5);
			claim_component(button.$$.fragment, div5_nodes);
			div5_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path0, "fill-rule", "evenodd");
			attr_dev(path0, "clip-rule", "evenodd");
			attr_dev(path0, "d", "M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631 36.3445L8.96631\n                        8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552 18.3618L35.2663\n                        18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552 22.571L30.9552\n                        29.7173C30.7305 32.6744 32.6316 34.8393 35.2663 34.9937ZM29.9591\n                        21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194 21.729L21.5194\n                        34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z");
			attr_dev(path0, "fill", "#F0B90B");
			add_location(path0, file$a, 112, 20, 2912);
			attr_dev(g, "clip-path", "url(#clip0)");
			add_location(g, file$a, 111, 16, 2864);
			attr_dev(rect, "width", "45");
			attr_dev(rect, "height", "45");
			attr_dev(rect, "fill", "white");
			add_location(rect, file$a, 125, 24, 3699);
			attr_dev(clipPath, "id", "clip0");
			add_location(clipPath, file$a, 124, 20, 3653);
			add_location(defs, file$a, 123, 16, 3626);
			attr_dev(svg0, "width", "45");
			attr_dev(svg0, "height", "45");
			attr_dev(svg0, "viewBox", "0 0 45 45");
			attr_dev(svg0, "fill", "none");
			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg0, file$a, 105, 12, 2672);
			attr_dev(a, "class", "text-white no-underline hover:text-white hover:no-underline");
			attr_dev(a, "aria-current", a_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined);
			attr_dev(a, "href", ".");
			add_location(a, file$a, 100, 8, 2455);
			attr_dev(div0, "class", "text-white flex-none");
			add_location(div0, file$a, 99, 4, 2412);
			add_location(title, file$a, 138, 16, 4078);
			attr_dev(path1, "d", "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z");
			add_location(path1, file$a, 139, 16, 4114);
			attr_dev(svg1, "class", "fill-current h-6 w-6 svelte-yvhcc");
			attr_dev(svg1, "viewBox", "0 0 20 20");
			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg1, file$a, 134, 12, 3924);
			add_location(div1, file$a, 133, 8, 3885);
			attr_dev(div2, "class", "pr-2 flex-none");
			add_location(div2, file$a, 132, 4, 3848);
			attr_dev(div3, "class", "flex-grow text-center");
			add_location(div3, file$a, 143, 4, 4220);
			attr_dev(div4, "class", "usermenu flex-none svelte-yvhcc");
			add_location(div4, file$a, 145, 4, 4295);
			attr_dev(div5, "class", "flex-none");
			add_location(div5, file$a, 149, 4, 4362);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			append_dev(div0, a);
			append_dev(a, svg0);
			append_dev(svg0, g);
			append_dev(g, path0);
			append_dev(svg0, defs);
			append_dev(defs, clipPath);
			append_dev(clipPath, rect);
			insert_dev(target, t0, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, svg1);
			append_dev(svg1, title);
			append_dev(title, t1);
			append_dev(svg1, path1);
			insert_dev(target, t2, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, t3);
			insert_dev(target, t4, anchor);
			insert_dev(target, div4, anchor);
			mount_component(login, div4, null);
			insert_dev(target, t5, anchor);
			insert_dev(target, div5, anchor);
			mount_component(button, div5, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(a, "click", /*gohome*/ ctx[9], false, false, false),
					listen_dev(div1, "click", /*showtogle*/ ctx[7], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*segment*/ 1 && a_aria_current_value !== (a_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined)) {
				attr_dev(a, "aria-current", a_aria_current_value);
			}

			if ((!current || dirty & /*$stateStore*/ 2) && t3_value !== (t3_value = /*$stateStore*/ ctx[1].selectbotname + "")) set_data_dev(t3, t3_value);
			const button_changes = {};

			if (dirty & /*$$scope*/ 8192) {
				button_changes.$$scope = { dirty, ctx };
			}

			if (!updating_value && dirty & /*$darkMode*/ 8) {
				updating_value = true;
				button_changes.value = /*$darkMode*/ ctx[3];
				add_flush_callback(() => updating_value = false);
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(login.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(login.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div2);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(div3);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(div4);
			destroy_component(login);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(div5);
			destroy_component(button);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$2.name,
		type: "slot",
		source: "(99:0) <AppBar class=\\\"bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0\\\">",
		ctx
	});

	return block;
}

// (242:8) {#if $authStore.status === 'in'}
function create_if_block_1$2(ctx) {
	let hr0;
	let t0;
	let a0;
	let t1;
	let a0_aria_current_value;
	let t2;
	let a1;
	let t3;
	let a1_aria_current_value;
	let t4;
	let hr1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			hr0 = element("hr");
			t0 = space();
			a0 = element("a");
			t1 = text("GRID LONG Бот");
			t2 = space();
			a1 = element("a");
			t3 = text("Настройки");
			t4 = space();
			hr1 = element("hr");
			this.h();
		},
		l: function claim(nodes) {
			hr0 = claim_element(nodes, "HR", {});
			t0 = claim_space(nodes);

			a0 = claim_element(nodes, "A", {
				class: true,
				rel: true,
				"aria-current": true,
				href: true
			});

			var a0_nodes = children(a0);
			t1 = claim_text(a0_nodes, "GRID LONG Бот");
			a0_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);

			a1 = claim_element(nodes, "A", {
				class: true,
				rel: true,
				"aria-current": true,
				href: true
			});

			var a1_nodes = children(a1);
			t3 = claim_text(a1_nodes, "Настройки");
			a1_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			hr1 = claim_element(nodes, "HR", {});
			this.h();
		},
		h: function hydrate() {
			add_location(hr0, file$a, 242, 12, 8379);
			attr_dev(a0, "class", "py-4 px-4 text-current flex-none svelte-yvhcc");
			attr_dev(a0, "rel", "prefetch");
			attr_dev(a0, "aria-current", a0_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a0, "href", "/");
			add_location(a0, file$a, 243, 12, 8398);
			attr_dev(a1, "class", "py-4 px-4 text-current flex-none svelte-yvhcc");
			attr_dev(a1, "rel", "prefetch");
			attr_dev(a1, "aria-current", a1_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a1, "href", "settings");
			add_location(a1, file$a, 251, 12, 8689);
			add_location(hr1, file$a, 259, 12, 8983);
		},
		m: function mount(target, anchor) {
			insert_dev(target, hr0, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, a0, anchor);
			append_dev(a0, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, a1, anchor);
			append_dev(a1, t3);
			insert_dev(target, t4, anchor);
			insert_dev(target, hr1, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(a0, "click", /*menucloseifnotsm*/ ctx[8], false, false, false),
					listen_dev(a1, "click", /*menucloseifnotsm*/ ctx[8], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*segment*/ 1 && a0_aria_current_value !== (a0_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a0, "aria-current", a0_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a1_aria_current_value !== (a1_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a1, "aria-current", a1_aria_current_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(hr0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(a0);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(a1);
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(hr1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(242:8) {#if $authStore.status === 'in'}",
		ctx
	});

	return block;
}

// (171:0) <NavigationDrawer class="bg-gray-200 dark:bg-black" bind:show={$stateStore.showmenu} {segment}>
function create_default_slot$4(ctx) {
	let div5;
	let div2;
	let a0;
	let svg0;
	let g;
	let path0;
	let defs;
	let clipPath;
	let rect;
	let a0_aria_current_value;
	let t0;
	let div1;
	let div0;
	let svg1;
	let path1;
	let t1;
	let a1;
	let t2;
	let a1_aria_current_value;
	let t3;
	let a2;
	let t4;
	let a2_aria_current_value;
	let t5;
	let a3;
	let t6;
	let a3_aria_current_value;
	let t7;
	let t8;
	let div3;
	let t9;
	let t10;
	let div4;
	let t11;
	let t12;
	let a4;
	let t13;
	let a4_aria_current_value;
	let mounted;
	let dispose;
	let if_block = /*$authStore*/ ctx[4].status === "in" && create_if_block_1$2(ctx);

	const block = {
		c: function create() {
			div5 = element("div");
			div2 = element("div");
			a0 = element("a");
			svg0 = svg_element("svg");
			g = svg_element("g");
			path0 = svg_element("path");
			defs = svg_element("defs");
			clipPath = svg_element("clipPath");
			rect = svg_element("rect");
			t0 = space();
			div1 = element("div");
			div0 = element("div");
			svg1 = svg_element("svg");
			path1 = svg_element("path");
			t1 = space();
			a1 = element("a");
			t2 = text("Главная");
			t3 = space();
			a2 = element("a");
			t4 = text("О программе");
			t5 = space();
			a3 = element("a");
			t6 = text("Блог");
			t7 = space();
			if (if_block) if_block.c();
			t8 = space();
			div3 = element("div");
			t9 = text(" ");
			t10 = space();
			div4 = element("div");
			t11 = text("Вступай в наш чат!");
			t12 = space();
			a4 = element("a");
			t13 = text("Инструкция");
			this.h();
		},
		l: function claim(nodes) {
			div5 = claim_element(nodes, "DIV", { class: true });
			var div5_nodes = children(div5);
			div2 = claim_element(div5_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);

			a0 = claim_element(div2_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a0_nodes = children(a0);

			svg0 = claim_element(
				a0_nodes,
				"svg",
				{
					width: true,
					height: true,
					viewBox: true,
					fill: true,
					xmlns: true
				},
				1
			);

			var svg0_nodes = children(svg0);
			g = claim_element(svg0_nodes, "g", { "clip-path": true }, 1);
			var g_nodes = children(g);

			path0 = claim_element(
				g_nodes,
				"path",
				{
					"fill-rule": true,
					"clip-rule": true,
					d: true,
					fill: true
				},
				1
			);

			children(path0).forEach(detach_dev);
			g_nodes.forEach(detach_dev);
			defs = claim_element(svg0_nodes, "defs", {}, 1);
			var defs_nodes = children(defs);
			clipPath = claim_element(defs_nodes, "clipPath", { id: true }, 1);
			var clipPath_nodes = children(clipPath);
			rect = claim_element(clipPath_nodes, "rect", { width: true, height: true, fill: true }, 1);
			children(rect).forEach(detach_dev);
			clipPath_nodes.forEach(detach_dev);
			defs_nodes.forEach(detach_dev);
			svg0_nodes.forEach(detach_dev);
			a0_nodes.forEach(detach_dev);
			t0 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", {});
			var div0_nodes = children(div0);
			svg1 = claim_element(div0_nodes, "svg", { class: true, viewBox: true, xmlns: true }, 1);
			var svg1_nodes = children(svg1);
			path1 = claim_element(svg1_nodes, "path", { d: true }, 1);
			children(path1).forEach(detach_dev);
			svg1_nodes.forEach(detach_dev);
			div0_nodes.forEach(detach_dev);
			div1_nodes.forEach(detach_dev);
			div2_nodes.forEach(detach_dev);
			t1 = claim_space(div5_nodes);

			a1 = claim_element(div5_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a1_nodes = children(a1);
			t2 = claim_text(a1_nodes, "Главная");
			a1_nodes.forEach(detach_dev);
			t3 = claim_space(div5_nodes);

			a2 = claim_element(div5_nodes, "A", {
				class: true,
				"aria-current": true,
				href: true
			});

			var a2_nodes = children(a2);
			t4 = claim_text(a2_nodes, "О программе");
			a2_nodes.forEach(detach_dev);
			t5 = claim_space(div5_nodes);

			a3 = claim_element(div5_nodes, "A", {
				class: true,
				rel: true,
				"aria-current": true,
				href: true
			});

			var a3_nodes = children(a3);
			t6 = claim_text(a3_nodes, "Блог");
			a3_nodes.forEach(detach_dev);
			t7 = claim_space(div5_nodes);
			if (if_block) if_block.l(div5_nodes);
			t8 = claim_space(div5_nodes);
			div3 = claim_element(div5_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			t9 = claim_text(div3_nodes, " ");
			div3_nodes.forEach(detach_dev);
			t10 = claim_space(div5_nodes);
			div4 = claim_element(div5_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			t11 = claim_text(div4_nodes, "Вступай в наш чат!");
			div4_nodes.forEach(detach_dev);
			t12 = claim_space(div5_nodes);

			a4 = claim_element(div5_nodes, "A", {
				class: true,
				rel: true,
				"aria-current": true,
				href: true
			});

			var a4_nodes = children(a4);
			t13 = claim_text(a4_nodes, "Инструкция");
			a4_nodes.forEach(detach_dev);
			div5_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(path0, "fill-rule", "evenodd");
			attr_dev(path0, "clip-rule", "evenodd");
			attr_dev(path0, "d", "M8.96631 8.65552L36.6553 8.65551L36.6553 36.3445L8.96631\n                            36.3445L8.96631 8.65552ZM35.2663 18.3618L35.2663 21.6912H30.9552L30.9552\n                            18.3618L35.2663 18.3618ZM35.2663 34.9937L35.2663 22.571L30.9552\n                            22.571L30.9552 29.7173C30.7305 32.6744 32.6316 34.8393 35.2663\n                            34.9937ZM29.9591 21.7293V18.4119L17.1564 18.4119L17.1564 21.729L21.5194\n                            21.729L21.5194 34.9937H25.8293L25.8293 21.7293L29.9591 21.7293Z");
			attr_dev(path0, "fill", "#F0B90B");
			add_location(path0, file$a, 184, 24, 6048);
			attr_dev(g, "clip-path", "url(#clip0)");
			add_location(g, file$a, 183, 20, 5996);
			attr_dev(rect, "width", "45");
			attr_dev(rect, "height", "45");
			attr_dev(rect, "fill", "white");
			add_location(rect, file$a, 197, 28, 6887);
			attr_dev(clipPath, "id", "clip0");
			add_location(clipPath, file$a, 196, 24, 6837);
			add_location(defs, file$a, 195, 20, 6806);
			attr_dev(svg0, "width", "95");
			attr_dev(svg0, "height", "95");
			attr_dev(svg0, "viewBox", "0 0 45 45");
			attr_dev(svg0, "fill", "none");
			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg0, file$a, 177, 16, 5780);
			attr_dev(a0, "class", "text-white no-underline hover:text-white hover:no-underline");
			attr_dev(a0, "aria-current", a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined);
			attr_dev(a0, "href", ".");
			add_location(a0, file$a, 173, 12, 5577);
			attr_dev(path1, "d", "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414\n                            1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z");
			add_location(path1, file$a, 209, 24, 7321);
			attr_dev(svg1, "class", "fill-current h-6 w-6 svelte-yvhcc");
			attr_dev(svg1, "viewBox", "0 0 20 20");
			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg1, file$a, 205, 20, 7135);
			add_location(div0, file$a, 204, 16, 7088);
			attr_dev(div1, "class", "backknob svelte-yvhcc");
			add_location(div1, file$a, 203, 12, 7049);
			attr_dev(div2, "class", "flex justify-between");
			add_location(div2, file$a, 172, 8, 5530);
			attr_dev(a1, "class", "text-current py-4 px-4 flex-none svelte-yvhcc");
			attr_dev(a1, "aria-current", a1_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined);
			attr_dev(a1, "href", "/");
			add_location(a1, file$a, 217, 8, 7617);
			attr_dev(a2, "class", "text-current py-4 px-4 flex-none svelte-yvhcc");
			attr_dev(a2, "aria-current", a2_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined);
			attr_dev(a2, "href", "about");
			add_location(a2, file$a, 224, 8, 7844);
			attr_dev(a3, "class", "py-4 px-4 text-current flex-none svelte-yvhcc");
			attr_dev(a3, "rel", "prefetch");
			attr_dev(a3, "aria-current", a3_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a3, "href", "blog");
			add_location(a3, file$a, 232, 8, 8080);
			attr_dev(div3, "class", "rastyazhka svelte-yvhcc");
			add_location(div3, file$a, 262, 8, 9013);
			attr_dev(div4, "class", "chatpriglos py-4 px-4 text-current flex-none svelte-yvhcc");
			add_location(div4, file$a, 263, 8, 9058);
			attr_dev(a4, "class", "menulast py-4 px-4 text-current flex-none svelte-yvhcc");
			attr_dev(a4, "rel", "prefetch");
			attr_dev(a4, "aria-current", a4_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined);
			attr_dev(a4, "href", "instruction");
			add_location(a4, file$a, 264, 8, 9149);
			attr_dev(div5, "class", "menu svelte-yvhcc");
			add_location(div5, file$a, 171, 4, 5503);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, div2);
			append_dev(div2, a0);
			append_dev(a0, svg0);
			append_dev(svg0, g);
			append_dev(g, path0);
			append_dev(svg0, defs);
			append_dev(defs, clipPath);
			append_dev(clipPath, rect);
			append_dev(div2, t0);
			append_dev(div2, div1);
			append_dev(div1, div0);
			append_dev(div0, svg1);
			append_dev(svg1, path1);
			append_dev(div5, t1);
			append_dev(div5, a1);
			append_dev(a1, t2);
			append_dev(div5, t3);
			append_dev(div5, a2);
			append_dev(a2, t4);
			append_dev(div5, t5);
			append_dev(div5, a3);
			append_dev(a3, t6);
			append_dev(div5, t7);
			if (if_block) if_block.m(div5, null);
			append_dev(div5, t8);
			append_dev(div5, div3);
			append_dev(div3, t9);
			append_dev(div5, t10);
			append_dev(div5, div4);
			append_dev(div4, t11);
			append_dev(div5, t12);
			append_dev(div5, a4);
			append_dev(a4, t13);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "click", /*showtogle*/ ctx[7], false, false, false),
					listen_dev(a1, "click", /*menucloseifnotsm*/ ctx[8], false, false, false),
					listen_dev(a2, "click", /*menucloseifnotsm*/ ctx[8], false, false, false),
					listen_dev(a3, "click", /*menucloseifnotsm*/ ctx[8], false, false, false),
					listen_dev(a4, "click", /*menucloseifnotsm*/ ctx[8], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*segment*/ 1 && a0_aria_current_value !== (a0_aria_current_value = /*segment*/ ctx[0] === undefined ? "page" : undefined)) {
				attr_dev(a0, "aria-current", a0_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a1_aria_current_value !== (a1_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined)) {
				attr_dev(a1, "aria-current", a1_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a2_aria_current_value !== (a2_aria_current_value = /*segment*/ ctx[0] === "about" ? "page" : undefined)) {
				attr_dev(a2, "aria-current", a2_aria_current_value);
			}

			if (dirty & /*segment*/ 1 && a3_aria_current_value !== (a3_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a3, "aria-current", a3_aria_current_value);
			}

			if (/*$authStore*/ ctx[4].status === "in") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					if_block.m(div5, t8);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*segment*/ 1 && a4_aria_current_value !== (a4_aria_current_value = /*segment*/ ctx[0] === "blog" ? "page" : undefined)) {
				attr_dev(a4, "aria-current", a4_aria_current_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$4.name,
		type: "slot",
		source: "(171:0) <NavigationDrawer class=\\\"bg-gray-200 dark:bg-black\\\" bind:show={$stateStore.showmenu} {segment}>",
		ctx
	});

	return block;
}

// (283:4) {:else}
function create_else_block$3(ctx) {
	let current;
	const default_slot_template = /*$$slots*/ ctx[10].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		l: function claim(nodes) {
			if (default_slot) default_slot.l(nodes);
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 8192) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(283:4) {:else}",
		ctx
	});

	return block;
}

// (279:4) {#if $stateStore.showmenu && $bp != 'sm'}
function create_if_block$5(ctx) {
	let div;
	let t0;
	let t1;
	let current;
	const default_slot_template = /*$$slots*/ ctx[10].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

	const block = {
		c: function create() {
			div = element("div");
			t0 = text(" ");
			t1 = space();
			if (default_slot) default_slot.c();
			this.h();
		},
		l: function claim(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			t0 = claim_text(div_nodes, " ");
			div_nodes.forEach(detach_dev);
			t1 = claim_space(nodes);
			if (default_slot) default_slot.l(nodes);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "zagl svelte-yvhcc");
			add_location(div, file$a, 279, 8, 9527);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t0);
			insert_dev(target, t1, anchor);

			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 8192) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (detaching) detach_dev(t1);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(279:4) {#if $stateStore.showmenu && $bp != 'sm'}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let appbar;
	let t0;
	let navigationdrawer;
	let updating_show;
	let t1;
	let div;
	let current_block_type_index;
	let if_block;
	let current;

	appbar = new AppBar({
			props: {
				class: "bg-gray-200 dark:bg-dark-500 flex p-0 fixed w-full z-10 top-0",
				$$slots: { default: [create_default_slot_1$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	function navigationdrawer_show_binding(value) {
		/*navigationdrawer_show_binding*/ ctx[12].call(null, value);
	}

	let navigationdrawer_props = {
		class: "bg-gray-200 dark:bg-black",
		segment: /*segment*/ ctx[0],
		$$slots: { default: [create_default_slot$4] },
		$$scope: { ctx }
	};

	if (/*$stateStore*/ ctx[1].showmenu !== void 0) {
		navigationdrawer_props.show = /*$stateStore*/ ctx[1].showmenu;
	}

	navigationdrawer = new NavigationDrawer({
			props: navigationdrawer_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(navigationdrawer, "show", navigationdrawer_show_binding));
	const if_block_creators = [create_if_block$5, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$stateStore*/ ctx[1].showmenu && /*$bp*/ ctx[2] != "sm") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			create_component(appbar.$$.fragment);
			t0 = space();
			create_component(navigationdrawer.$$.fragment);
			t1 = space();
			div = element("div");
			if_block.c();
			this.h();
		},
		l: function claim(nodes) {
			claim_component(appbar.$$.fragment, nodes);
			t0 = claim_space(nodes);
			claim_component(navigationdrawer.$$.fragment, nodes);
			t1 = claim_space(nodes);
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if_block.l(div_nodes);
			div_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			attr_dev(div, "class", "mainflex svelte-yvhcc");
			add_location(div, file$a, 276, 0, 9449);
		},
		m: function mount(target, anchor) {
			mount_component(appbar, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(navigationdrawer, target, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const appbar_changes = {};

			if (dirty & /*$$scope, $darkMode, $stateStore, segment*/ 8203) {
				appbar_changes.$$scope = { dirty, ctx };
			}

			appbar.$set(appbar_changes);
			const navigationdrawer_changes = {};
			if (dirty & /*segment*/ 1) navigationdrawer_changes.segment = /*segment*/ ctx[0];

			if (dirty & /*$$scope, segment, $authStore*/ 8209) {
				navigationdrawer_changes.$$scope = { dirty, ctx };
			}

			if (!updating_show && dirty & /*$stateStore*/ 2) {
				updating_show = true;
				navigationdrawer_changes.show = /*$stateStore*/ ctx[1].showmenu;
				add_flush_callback(() => updating_show = false);
			}

			navigationdrawer.$set(navigationdrawer_changes);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(appbar.$$.fragment, local);
			transition_in(navigationdrawer.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(appbar.$$.fragment, local);
			transition_out(navigationdrawer.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(appbar, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(navigationdrawer, detaching);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let $stateStore;
	let $bp;
	let $darkMode;
	let $authStore;
	validate_store(stateStore, "stateStore");
	component_subscribe($$self, stateStore, $$value => $$invalidate(1, $stateStore = $$value));
	validate_store(authStore, "authStore");
	component_subscribe($$self, authStore, $$value => $$invalidate(4, $authStore = $$value));
	let { segment } = $$props;
	const bp = breakpoint();
	validate_store(bp, "bp");
	component_subscribe($$self, bp, value => $$invalidate(2, $bp = value));
	let darkMode = dark();
	validate_store(darkMode, "darkMode");
	component_subscribe($$self, darkMode, value => $$invalidate(3, $darkMode = value));
	let showzagl;

	// export let segment;
	function showtogle() {
		set_store_value(stateStore, $stateStore.showmenu = !$stateStore.showmenu, $stateStore);

		//console.log ($stateStore.show);
		return $stateStore.showmenu;
	}

	let urlhost = "http://152.70.160.183:1880/";
	set_store_value(stateStore, $stateStore.urlhost = urlhost, $stateStore);

	//localStorage.setItem('darkmode', 'on');
	if ($bp === "sm") showzagl = false;

	function menucloseifnotsm() {
		if ($stateStore.showmenu && $bp === "sm") {
			set_store_value(stateStore, $stateStore.showmenu = false, $stateStore);
		}
	}

	function gohome() {
		set_store_value(stateStore, $stateStore.rout = "botlist", $stateStore);
	}

	const writable_props = ["segment"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Layout", $$slots, ['default']);

	function button_value_binding(value) {
		$darkMode = value;
		darkMode.set($darkMode);
	}

	function navigationdrawer_show_binding(value) {
		$stateStore.showmenu = value;
		stateStore.set($stateStore);
	}

	$$self.$set = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
		if ("$$scope" in $$props) $$invalidate(13, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		stateStore,
		authStore,
		Nav,
		Login,
		NavigationDrawer,
		AppBar,
		breakpoints: breakpoint,
		segment,
		bp,
		dark,
		darkMode,
		showzagl,
		Button,
		showtogle,
		urlhost,
		menucloseifnotsm,
		gohome,
		$stateStore,
		$bp,
		$darkMode,
		$authStore
	});

	$$self.$inject_state = $$props => {
		if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
		if ("darkMode" in $$props) $$invalidate(6, darkMode = $$props.darkMode);
		if ("showzagl" in $$props) showzagl = $$props.showzagl;
		if ("urlhost" in $$props) urlhost = $$props.urlhost;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		segment,
		$stateStore,
		$bp,
		$darkMode,
		$authStore,
		bp,
		darkMode,
		showtogle,
		menucloseifnotsm,
		gohome,
		$$slots,
		button_value_binding,
		navigationdrawer_show_binding,
		$$scope
	];
}

class Layout extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { segment: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Layout",
			options,
			id: create_fragment$a.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*segment*/ ctx[0] === undefined && !("segment" in props)) {
			console.warn("<Layout> was created without expected prop 'segment'");
		}
	}

	get segment() {
		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segment(value) {
		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/routes/_error.svelte generated by Svelte v3.24.0 */

const { Error: Error_1 } = globals;
const file$b = "src/routes/_error.svelte";

// (20:0) {#if dev && error.stack}
function create_if_block$6(ctx) {
	let pre;
	let t_value = /*error*/ ctx[1].stack + "";
	let t;

	const block = {
		c: function create() {
			pre = element("pre");
			t = text(t_value);
			this.h();
		},
		l: function claim(nodes) {
			pre = claim_element(nodes, "PRE", {});
			var pre_nodes = children(pre);
			t = claim_text(pre_nodes, t_value);
			pre_nodes.forEach(detach_dev);
			this.h();
		},
		h: function hydrate() {
			add_location(pre, file$b, 20, 2, 254);
		},
		m: function mount(target, anchor) {
			insert_dev(target, pre, anchor);
			append_dev(pre, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 2 && t_value !== (t_value = /*error*/ ctx[1].stack + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(pre);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(20:0) {#if dev && error.stack}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let title_value;
	let t0;
	let h1;
	let t1;
	let t2;
	let p;
	let t3_value = /*error*/ ctx[1].message + "";
	let t3;
	let t4;
	let if_block_anchor;
	document.title = title_value = /*status*/ ctx[0];
	let if_block = /*dev*/ ctx[2] && /*error*/ ctx[1].stack && create_if_block$6(ctx);

	const block = {
		c: function create() {
			t0 = space();
			h1 = element("h1");
			t1 = text(/*status*/ ctx[0]);
			t2 = space();
			p = element("p");
			t3 = text(t3_value);
			t4 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.h();
		},
		l: function claim(nodes) {
			const head_nodes = query_selector_all("[data-svelte=\"svelte-1moakz\"]", document.head);
			head_nodes.forEach(detach_dev);
			t0 = claim_space(nodes);
			h1 = claim_element(nodes, "H1", {});
			var h1_nodes = children(h1);
			t1 = claim_text(h1_nodes, /*status*/ ctx[0]);
			h1_nodes.forEach(detach_dev);
			t2 = claim_space(nodes);
			p = claim_element(nodes, "P", {});
			var p_nodes = children(p);
			t3 = claim_text(p_nodes, t3_value);
			p_nodes.forEach(detach_dev);
			t4 = claim_space(nodes);
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
			this.h();
		},
		h: function hydrate() {
			add_location(h1, file$b, 15, 0, 184);
			add_location(p, file$b, 17, 0, 203);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, h1, anchor);
			append_dev(h1, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, p, anchor);
			append_dev(p, t3);
			insert_dev(target, t4, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*status*/ 1 && title_value !== (title_value = /*status*/ ctx[0])) {
				document.title = title_value;
			}

			if (dirty & /*status*/ 1) set_data_dev(t1, /*status*/ ctx[0]);
			if (dirty & /*error*/ 2 && t3_value !== (t3_value = /*error*/ ctx[1].message + "")) set_data_dev(t3, t3_value);

			if (/*dev*/ ctx[2] && /*error*/ ctx[1].stack) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(p);
			if (detaching) detach_dev(t4);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let { status } = $$props;
	let { error } = $$props;
	const dev = "development" === "development";
	const writable_props = ["status", "error"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Error> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("Error", $$slots, []);

	$$self.$set = $$props => {
		if ("status" in $$props) $$invalidate(0, status = $$props.status);
		if ("error" in $$props) $$invalidate(1, error = $$props.error);
	};

	$$self.$capture_state = () => ({ status, error, dev });

	$$self.$inject_state = $$props => {
		if ("status" in $$props) $$invalidate(0, status = $$props.status);
		if ("error" in $$props) $$invalidate(1, error = $$props.error);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [status, error, dev];
}

class Error$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$b, create_fragment$b, safe_not_equal, { status: 0, error: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Error",
			options,
			id: create_fragment$b.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*status*/ ctx[0] === undefined && !("status" in props)) {
			console.warn("<Error> was created without expected prop 'status'");
		}

		if (/*error*/ ctx[1] === undefined && !("error" in props)) {
			console.warn("<Error> was created without expected prop 'error'");
		}
	}

	get status() {
		throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set status(value) {
		throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get error() {
		throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set error(value) {
		throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.24.0 */

const { Error: Error_1$1 } = globals;

// (23:1) {:else}
function create_else_block$4(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*level1*/ ctx[4].props];
	var switch_value = /*level1*/ ctx[4].component;

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*level1*/ 16)
			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*level1*/ ctx[4].props)])
			: {};

			if (switch_value !== (switch_value = /*level1*/ ctx[4].component)) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$4.name,
		type: "else",
		source: "(23:1) {:else}",
		ctx
	});

	return block;
}

// (21:1) {#if error}
function create_if_block$7(ctx) {
	let error_1;
	let current;

	error_1 = new Error$1({
			props: {
				error: /*error*/ ctx[0],
				status: /*status*/ ctx[1]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(error_1.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(error_1.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(error_1, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const error_1_changes = {};
			if (dirty & /*error*/ 1) error_1_changes.error = /*error*/ ctx[0];
			if (dirty & /*status*/ 2) error_1_changes.status = /*status*/ ctx[1];
			error_1.$set(error_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(error_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(error_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(error_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(21:1) {#if error}",
		ctx
	});

	return block;
}

// (20:0) <Layout segment="{segments[0]}" {...level0.props}>
function create_default_slot$5(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$7, create_else_block$4];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*error*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			if_block.l(nodes);
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$5.name,
		type: "slot",
		source: "(20:0) <Layout segment=\\\"{segments[0]}\\\" {...level0.props}>",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let layout;
	let current;
	const layout_spread_levels = [{ segment: /*segments*/ ctx[2][0] }, /*level0*/ ctx[3].props];

	let layout_props = {
		$$slots: { default: [create_default_slot$5] },
		$$scope: { ctx }
	};

	for (let i = 0; i < layout_spread_levels.length; i += 1) {
		layout_props = assign(layout_props, layout_spread_levels[i]);
	}

	layout = new Layout({ props: layout_props, $$inline: true });

	const block = {
		c: function create() {
			create_component(layout.$$.fragment);
		},
		l: function claim(nodes) {
			claim_component(layout.$$.fragment, nodes);
		},
		m: function mount(target, anchor) {
			mount_component(layout, target, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const layout_changes = (dirty & /*segments, level0*/ 12)
			? get_spread_update(layout_spread_levels, [
					dirty & /*segments*/ 4 && { segment: /*segments*/ ctx[2][0] },
					dirty & /*level0*/ 8 && get_spread_object(/*level0*/ ctx[3].props)
				])
			: {};

			if (dirty & /*$$scope, error, status, level1*/ 147) {
				layout_changes.$$scope = { dirty, ctx };
			}

			layout.$set(layout_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(layout.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(layout.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(layout, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { stores } = $$props;
	let { error } = $$props;
	let { status } = $$props;
	let { segments } = $$props;
	let { level0 } = $$props;
	let { level1 = null } = $$props;
	let { notify } = $$props;
	afterUpdate(notify);
	setContext(CONTEXT_KEY, stores);
	const writable_props = ["stores", "error", "status", "segments", "level0", "level1", "notify"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;
	validate_slots("App", $$slots, []);

	$$self.$set = $$props => {
		if ("stores" in $$props) $$invalidate(5, stores = $$props.stores);
		if ("error" in $$props) $$invalidate(0, error = $$props.error);
		if ("status" in $$props) $$invalidate(1, status = $$props.status);
		if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
		if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
		if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
		if ("notify" in $$props) $$invalidate(6, notify = $$props.notify);
	};

	$$self.$capture_state = () => ({
		setContext,
		afterUpdate,
		CONTEXT_KEY,
		Layout,
		Error: Error$1,
		stores,
		error,
		status,
		segments,
		level0,
		level1,
		notify
	});

	$$self.$inject_state = $$props => {
		if ("stores" in $$props) $$invalidate(5, stores = $$props.stores);
		if ("error" in $$props) $$invalidate(0, error = $$props.error);
		if ("status" in $$props) $$invalidate(1, status = $$props.status);
		if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
		if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
		if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
		if ("notify" in $$props) $$invalidate(6, notify = $$props.notify);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [error, status, segments, level0, level1, stores, notify];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			stores: 5,
			error: 0,
			status: 1,
			segments: 2,
			level0: 3,
			level1: 4,
			notify: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$c.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*stores*/ ctx[5] === undefined && !("stores" in props)) {
			console.warn("<App> was created without expected prop 'stores'");
		}

		if (/*error*/ ctx[0] === undefined && !("error" in props)) {
			console.warn("<App> was created without expected prop 'error'");
		}

		if (/*status*/ ctx[1] === undefined && !("status" in props)) {
			console.warn("<App> was created without expected prop 'status'");
		}

		if (/*segments*/ ctx[2] === undefined && !("segments" in props)) {
			console.warn("<App> was created without expected prop 'segments'");
		}

		if (/*level0*/ ctx[3] === undefined && !("level0" in props)) {
			console.warn("<App> was created without expected prop 'level0'");
		}

		if (/*notify*/ ctx[6] === undefined && !("notify" in props)) {
			console.warn("<App> was created without expected prop 'notify'");
		}
	}

	get stores() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set stores(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get error() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set error(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get status() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set status(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get segments() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set segments(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level0() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level0(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get level1() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set level1(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get notify() {
		throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set notify(value) {
		throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// This file is generated by Sapper — do not edit it!

const ignore = [/^\/blog\.json$/, /^\/blog\/([^\/]+?)\.json$/];

const components = [
	{
		js: () => import('./index.200a5559.js'),
		css: []
	},
	{
		js: () => import('./botstatuspage.2f7acee5.js'),
		css: []
	},
	{
		js: () => import('./instruction.625c0e36.js'),
		css: []
	},
	{
		js: () => import('./settings.4659a176.js'),
		css: []
	},
	{
		js: () => import('./newbot.d98e2d11.js'),
		css: []
	},
	{
		js: () => import('./about.813deb22.js'),
		css: []
	},
	{
		js: () => import('./index.a44525f2.js'),
		css: []
	},
	{
		js: () => import('./[slug].e1b6e1ad.js'),
		css: []
	}
];

const routes = (d => [
	{
		// index.svelte
		pattern: /^\/$/,
		parts: [
			{ i: 0 }
		]
	},

	{
		// botstatuspage.svelte
		pattern: /^\/botstatuspage\/?$/,
		parts: [
			{ i: 1 }
		]
	},

	{
		// instruction.svelte
		pattern: /^\/instruction\/?$/,
		parts: [
			{ i: 2 }
		]
	},

	{
		// settings.svelte
		pattern: /^\/settings\/?$/,
		parts: [
			{ i: 3 }
		]
	},

	{
		// newbot.svelte
		pattern: /^\/newbot\/?$/,
		parts: [
			{ i: 4 }
		]
	},

	{
		// about.svelte
		pattern: /^\/about\/?$/,
		parts: [
			{ i: 5 }
		]
	},

	{
		// blog/index.svelte
		pattern: /^\/blog\/?$/,
		parts: [
			{ i: 6 }
		]
	},

	{
		// blog/[slug].svelte
		pattern: /^\/blog\/([^\/]+?)\/?$/,
		parts: [
			null,
			{ i: 7, params: match => ({ slug: d(match[1]) }) }
		]
	}
])(decodeURIComponent);

if (typeof window !== 'undefined') {
	import('./sapper-dev-client.1e7a4a5e.js').then(client => {
		client.connect(10000);
	});
}

function goto(href, opts = { replaceState: false }) {
	const target = select_target(new URL(href, document.baseURI));

	if (target) {
		_history[opts.replaceState ? 'replaceState' : 'pushState']({ id: cid }, '', href);
		return navigate(target, null).then(() => {});
	}

	location.href = href;
	return new Promise(f => {}); // never resolves
}

/** Callback to inform of a value updates. */



















function page_store(value) {
	const store = writable(value);
	let ready = true;

	function notify() {
		ready = true;
		store.update(val => val);
	}

	function set(new_value) {
		ready = false;
		store.set(new_value);
	}

	function subscribe(run) {
		let old_value;
		return store.subscribe((value) => {
			if (old_value === undefined || (ready && value !== old_value)) {
				run(old_value = value);
			}
		});
	}

	return { notify, set, subscribe };
}

const initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;

let ready = false;
let root_component;
let current_token;
let root_preloaded;
let current_branch = [];
let current_query = '{}';

const stores = {
	page: page_store({}),
	preloading: writable(null),
	session: writable(initial_data && initial_data.session)
};

let $session;
let session_dirty;

stores.session.subscribe(async value => {
	$session = value;

	if (!ready) return;
	session_dirty = true;

	const target = select_target(new URL(location.href));

	const token = current_token = {};
	const { redirect, props, branch } = await hydrate_target(target);
	if (token !== current_token) return; // a secondary navigation happened while we were loading

	await render(redirect, branch, props, target.page);
});

let prefetching


 = null;
function set_prefetching(href, promise) {
	prefetching = { href, promise };
}

let target;
function set_target(element) {
	target = element;
}

let uid = 1;
function set_uid(n) {
	uid = n;
}

let cid;
function set_cid(n) {
	cid = n;
}

const _history = typeof history !== 'undefined' ? history : {
	pushState: (state, title, href) => {},
	replaceState: (state, title, href) => {},
	scrollRestoration: ''
};

const scroll_history = {};

function extract_query(search) {
	const query = Object.create(null);
	if (search.length > 0) {
		search.slice(1).split('&').forEach(searchParam => {
			let [, key, value = ''] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, ' ')));
			if (typeof query[key] === 'string') query[key] = [query[key]];
			if (typeof query[key] === 'object') (query[key] ).push(value);
			else query[key] = value;
		});
	}
	return query;
}

function select_target(url) {
	if (url.origin !== location.origin) return null;
	if (!url.pathname.startsWith(initial_data.baseUrl)) return null;

	let path = url.pathname.slice(initial_data.baseUrl.length);

	if (path === '') {
		path = '/';
	}

	// avoid accidental clashes between server routes and page routes
	if (ignore.some(pattern => pattern.test(path))) return;

	for (let i = 0; i < routes.length; i += 1) {
		const route = routes[i];

		const match = route.pattern.exec(path);

		if (match) {
			const query = extract_query(url.search);
			const part = route.parts[route.parts.length - 1];
			const params = part.params ? part.params(match) : {};

			const page = { host: location.host, path, query, params };

			return { href: url.href, route, match, page };
		}
	}
}

function handle_error(url) {
	const { host, pathname, search } = location;
	const { session, preloaded, status, error } = initial_data;

	if (!root_preloaded) {
		root_preloaded = preloaded && preloaded[0];
	}

	const props = {
		error,
		status,
		session,
		level0: {
			props: root_preloaded
		},
		level1: {
			props: {
				status,
				error
			},
			component: Error$1
		},
		segments: preloaded

	};
	const query = extract_query(search);
	render(null, [], props, { host, path: pathname, query, params: {} });
}

function scroll_state() {
	return {
		x: pageXOffset,
		y: pageYOffset
	};
}

async function navigate(target, id, noscroll, hash) {
	if (id) {
		// popstate or initial navigation
		cid = id;
	} else {
		const current_scroll = scroll_state();

		// clicked on a link. preserve scroll state
		scroll_history[cid] = current_scroll;

		id = cid = ++uid;
		scroll_history[cid] = noscroll ? current_scroll : { x: 0, y: 0 };
	}

	cid = id;

	if (root_component) stores.preloading.set(true);

	const loaded = prefetching && prefetching.href === target.href ?
		prefetching.promise :
		hydrate_target(target);

	prefetching = null;

	const token = current_token = {};
	const { redirect, props, branch } = await loaded;
	if (token !== current_token) return; // a secondary navigation happened while we were loading

	await render(redirect, branch, props, target.page);
	if (document.activeElement) document.activeElement.blur();

	if (!noscroll) {
		let scroll = scroll_history[id];

		if (hash) {
			// scroll is an element id (from a hash), we need to compute y.
			const deep_linked = document.getElementById(hash.slice(1));

			if (deep_linked) {
				scroll = {
					x: 0,
					y: deep_linked.getBoundingClientRect().top + scrollY
				};
			}
		}

		scroll_history[cid] = scroll;
		if (scroll) scrollTo(scroll.x, scroll.y);
	}
}

async function render(redirect, branch, props, page) {
	if (redirect) return goto(redirect.location, { replaceState: true });

	stores.page.set(page);
	stores.preloading.set(false);

	if (root_component) {
		root_component.$set(props);
	} else {
		props.stores = {
			page: { subscribe: stores.page.subscribe },
			preloading: { subscribe: stores.preloading.subscribe },
			session: stores.session
		};
		props.level0 = {
			props: await root_preloaded
		};
		props.notify = stores.page.notify;

		// first load — remove SSR'd <head> contents
		const start = document.querySelector('#sapper-head-start');
		const end = document.querySelector('#sapper-head-end');

		if (start && end) {
			while (start.nextSibling !== end) detach$1(start.nextSibling);
			detach$1(start);
			detach$1(end);
		}

		root_component = new App({
			target,
			props,
			hydrate: true
		});
	}

	current_branch = branch;
	current_query = JSON.stringify(page.query);
	ready = true;
	session_dirty = false;
}

function part_changed(i, segment, match, stringified_query) {
	// TODO only check query string changes for preload functions
	// that do in fact depend on it (using static analysis or
	// runtime instrumentation)
	if (stringified_query !== current_query) return true;

	const previous = current_branch[i];

	if (!previous) return false;
	if (segment !== previous.segment) return true;
	if (previous.match) {
		if (JSON.stringify(previous.match.slice(1, i + 2)) !== JSON.stringify(match.slice(1, i + 2))) {
			return true;
		}
	}
}

async function hydrate_target(target)



 {
	const { route, page } = target;
	const segments = page.path.split('/').filter(Boolean);

	let redirect = null;

	const props = { error: null, status: 200, segments: [segments[0]] };

	const preload_context = {
		fetch: (url, opts) => fetch(url, opts),
		redirect: (statusCode, location) => {
			if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
				throw new Error(`Conflicting redirects`);
			}
			redirect = { statusCode, location };
		},
		error: (status, error) => {
			props.error = typeof error === 'string' ? new Error(error) : error;
			props.status = status;
		}
	};

	if (!root_preloaded) {
		root_preloaded = initial_data.preloaded[0] || preload.call(preload_context, {
			host: page.host,
			path: page.path,
			query: page.query,
			params: {}
		}, $session);
	}

	let branch;
	let l = 1;

	try {
		const stringified_query = JSON.stringify(page.query);
		const match = route.pattern.exec(page.path);

		let segment_dirty = false;

		branch = await Promise.all(route.parts.map(async (part, i) => {
			const segment = segments[i];

			if (part_changed(i, segment, match, stringified_query)) segment_dirty = true;

			props.segments[l] = segments[i + 1]; // TODO make this less confusing
			if (!part) return { segment };

			const j = l++;

			if (!session_dirty && !segment_dirty && current_branch[i] && current_branch[i].part === part.i) {
				return current_branch[i];
			}

			segment_dirty = false;

			const { default: component, preload } = await load_component(components[part.i]);

			let preloaded;
			if (ready || !initial_data.preloaded[i + 1]) {
				preloaded = preload
					? await preload.call(preload_context, {
						host: page.host,
						path: page.path,
						query: page.query,
						params: part.params ? part.params(target.match) : {}
					}, $session)
					: {};
			} else {
				preloaded = initial_data.preloaded[i + 1];
			}

			return (props[`level${j}`] = { component, props: preloaded, segment, match, part: part.i });
		}));
	} catch (error) {
		props.error = error;
		props.status = 500;
		branch = [];
	}

	return { redirect, props, branch };
}

function load_css(chunk) {
	const href = `client/${chunk}`;
	if (document.querySelector(`link[href="${href}"]`)) return;

	return new Promise((fulfil, reject) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;

		link.onload = () => fulfil();
		link.onerror = reject;

		document.head.appendChild(link);
	});
}

function load_component(component)


 {
	// TODO this is temporary — once placeholders are
	// always rewritten, scratch the ternary
	const promises = (typeof component.css === 'string' ? [] : component.css.map(load_css));
	promises.unshift(component.js());
	return Promise.all(promises).then(values => values[0]);
}

function detach$1(node) {
	node.parentNode.removeChild(node);
}

function prefetch(href) {
	const target = select_target(new URL(href, document.baseURI));

	if (target) {
		if (!prefetching || href !== prefetching.href) {
			set_prefetching(href, hydrate_target(target));
		}

		return prefetching.promise;
	}
}

function start(opts

) {
	if ('scrollRestoration' in _history) {
		_history.scrollRestoration = 'manual';
	}
	
	// Adopted from Nuxt.js
	// Reset scrollRestoration to auto when leaving page, allowing page reload
	// and back-navigation from other pages to use the browser to restore the
	// scrolling position.
	addEventListener('beforeunload', () => {
		_history.scrollRestoration = 'auto';
	});

	// Setting scrollRestoration to manual again when returning to this page.
	addEventListener('load', () => {
		_history.scrollRestoration = 'manual';
	});

	set_target(opts.target);

	addEventListener('click', handle_click);
	addEventListener('popstate', handle_popstate);

	// prefetch
	addEventListener('touchstart', trigger_prefetch);
	addEventListener('mousemove', handle_mousemove);

	return Promise.resolve().then(() => {
		const { hash, href } = location;

		_history.replaceState({ id: uid }, '', href);

		const url = new URL(location.href);

		if (initial_data.error) return handle_error();

		const target = select_target(url);
		if (target) return navigate(target, uid, true, hash);
	});
}

let mousemove_timeout;

function handle_mousemove(event) {
	clearTimeout(mousemove_timeout);
	mousemove_timeout = setTimeout(() => {
		trigger_prefetch(event);
	}, 20);
}

function trigger_prefetch(event) {
	const a = find_anchor(event.target);
	if (!a || a.rel !== 'prefetch') return;

	prefetch(a.href);
}

function handle_click(event) {
	// Adapted from https://github.com/visionmedia/page.js
	// MIT license https://github.com/visionmedia/page.js#license
	if (which(event) !== 1) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey) return;
	if (event.defaultPrevented) return;

	const a = find_anchor(event.target);
	if (!a) return;

	if (!a.href) return;

	// check if link is inside an svg
	// in this case, both href and target are always inside an object
	const svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
	const href = String(svg ? (a).href.baseVal : a.href);

	if (href === location.href) {
		if (!location.hash) event.preventDefault();
		return;
	}

	// Ignore if tag has
	// 1. 'download' attribute
	// 2. rel='external' attribute
	if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return;

	// Ignore if <a> has a target
	if (svg ? (a).target.baseVal : a.target) return;

	const url = new URL(href);

	// Don't handle hash changes
	if (url.pathname === location.pathname && url.search === location.search) return;

	const target = select_target(url);
	if (target) {
		const noscroll = a.hasAttribute('sapper-noscroll');
		navigate(target, null, noscroll, url.hash);
		event.preventDefault();
		_history.pushState({ id: cid }, '', url.href);
	}
}

function which(event) {
	return event.which === null ? event.button : event.which;
}

function find_anchor(node) {
	while (node && node.nodeName.toUpperCase() !== 'A') node = node.parentNode; // SVG <a> elements have a lowercase name
	return node;
}

function handle_popstate(event) {
	scroll_history[cid] = scroll_state();

	if (event.state) {
		const url = new URL(location.href);
		const target = select_target(url);
		if (target) {
			navigate(target, event.state.id);
		} else {
			location.href = location.href;
		}
	} else {
		// hashchange
		set_uid(uid + 1);
		set_cid(uid);
		_history.replaceState({ id: cid }, '', location.href);
	}
}

start({
  target: document.querySelector("#sapper"),
});

export { ClassBuilder as $, create_component as A, Button as B, claim_space as C, claim_component as D, mount_component as E, listen_dev as F, set_data_dev as G, transition_in as H, transition_out as I, destroy_component as J, group_outros as K, check_outros as L, destroy_each as M, set_store_value as N, is_function as O, SignInButton as P, empty as Q, query_selector_all as R, SvelteComponentDev as S, assign as T, get_spread_update as U, get_spread_object as V, create_slot as W, exclude_internal_props as X, r as Y, action_destroyer as Z, update_slot as _, svg_element as a, set_input_value as a0, run_all as a1, bubble as a2, filterProps as a3, utils as a4, set_attributes as a5, toggle_class as a6, fly as a7, quadOut as a8, add_render_callback as a9, create_bidirectional_transition as aa, null_to_empty as ab, createEventDispatcher as ac, Icon as ad, prop_dev as ae, binding_callbacks as af, bind as ag, add_flush_callback as ah, slide as ai, children as b, claim_element as c, dispatch_dev as d, element as e, detach_dev as f, globals as g, attr_dev as h, init as i, add_location as j, set_style as k, insert_dev as l, append_dev as m, noop as n, validate_each_argument as o, validate_store as p, stateStore as q, component_subscribe as r, safe_not_equal as s, tslib_es6 as t, authStore as u, validate_slots as v, onMount as w, text as x, claim_text as y, space as z };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LjcwMjU5MGViLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2ludGVybmFsL3NoYXJlZC5tanMiLCIuLi8uLi8uLi9zcmMvc3RvcmVzL3N0YXRlYm90LmpzIiwiLi4vLi4vLi4vc3JjL3N0b3Jlcy9hdXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL2NvbmZpZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvaG9zdFJlcG9ydEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvT2JzZXJ2ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2lzQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2lzT2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC9VbnN1YnNjcmlwdGlvbkVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvU3Vic2NyaXB0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvc3ltYm9sL3J4U3Vic2NyaWJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL1N1YnNjcmliZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2NhblJlcG9ydEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC90b1N1YnNjcmliZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvaWRlbnRpdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL3BpcGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9PYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL1N1YmplY3RTdWJzY3JpcHRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9TdWJqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVyL0FjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlci9Bc3luY0FjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZUFjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL1NjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlci9Bc3luY1NjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlci9xdWV1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL29ic2VydmFibGUvZW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2lzU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC9zdWJzY3JpYmVUb0FycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21BcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL29ic2VydmFibGUvb2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9vYnNlcnZhYmxlL3Rocm93RXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9Ob3RpZmljYXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9vcGVyYXRvcnMvb2JzZXJ2ZU9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvUmVwbGF5U3ViamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvbm9vcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL29wZXJhdG9ycy9tYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL3N1YnNjcmliZVRvUHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvc3Vic2NyaWJlVG9JdGVyYWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvc3Vic2NyaWJlVG9PYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC9pc0FycmF5TGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3V0aWwvaXNQcm9taXNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvdXRpbC9zdWJzY3JpYmVUby5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZU9ic2VydmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVQcm9taXNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlSXRlcmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC91dGlsL2lzSXRlcmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtNS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTUvaW50ZXJuYWwvb2JzZXJ2YWJsZS9mb3JrSm9pbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc201L2ludGVybmFsL29wZXJhdG9ycy90YXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhmaXJlL2F1dGgvZGlzdC9pbmRleC5lc20uanMiLCIuLi8uLi8uLi9zcmMvZmlyZWJhc2UvYXV0aC5qcyIsIi4uLy4uLy4uL3NyYy9maXJlYmFzZS9jb25maWcuanMiLCIuLi8uLi8uLi9zcmMvZmlyZWJhc2UvaW5pdC5qcyIsIi4uLy4uLy4uL3NyYy9maXJlYmFzZS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zbWVsdGUvc3JjL2NvbXBvbmVudHMvSWNvbi9JY29uLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zbWVsdGUvc3JjL3V0aWxzL2NsYXNzZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc21lbHRlL3NyYy9jb21wb25lbnRzL1JpcHBsZS9yaXBwbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc21lbHRlL3NyYy9jb21wb25lbnRzL0J1dHRvbi9CdXR0b24uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N2ZWx0ZS9lYXNpbmcvaW5kZXgubWpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTWVudVVzZXIuc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvUHJvZmlsZS5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9TaWduSW5CdXR0b24uc3ZlbHRlIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvTG9naW4uc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NtZWx0ZS9zcmMvZGFyay5qcyIsIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL05hdi5zdmVsdGUiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3ZlbHRlL3RyYW5zaXRpb24vaW5kZXgubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NtZWx0ZS9zcmMvY29tcG9uZW50cy9VdGlsL1NjcmltLnN2ZWx0ZSIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zbWVsdGUvc3JjL2NvbXBvbmVudHMvVXRpbC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zbWVsdGUvc3JjL2JyZWFrcG9pbnRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NtZWx0ZS9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uRHJhd2VyL05hdmlnYXRpb25EcmF3ZXIuc3ZlbHRlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3NtZWx0ZS9zcmMvY29tcG9uZW50cy9BcHBCYXIvQXBwQmFyLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9yb3V0ZXMvX2xheW91dC5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvcm91dGVzL19lcnJvci5zdmVsdGUiLCIuLi8uLi8uLi9zcmMvbm9kZV9tb2R1bGVzL0BzYXBwZXIvaW50ZXJuYWwvQXBwLnN2ZWx0ZSIsIi4uLy4uLy4uL3NyYy9ub2RlX21vZHVsZXMvQHNhcHBlci9pbnRlcm5hbC9tYW5pZmVzdC1jbGllbnQubWpzIiwiLi4vLi4vLi4vc3JjL25vZGVfbW9kdWxlcy9Ac2FwcGVyL2FwcC5tanMiLCIuLi8uLi8uLi9zcmMvY2xpZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5vb3AoKSB7IH1cbmNvbnN0IGlkZW50aXR5ID0geCA9PiB4O1xuZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGZvciAoY29uc3QgayBpbiBzcmMpXG4gICAgICAgIHRhcltrXSA9IHNyY1trXTtcbiAgICByZXR1cm4gdGFyO1xufVxuZnVuY3Rpb24gaXNfcHJvbWlzZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gYWRkX2xvY2F0aW9uKGVsZW1lbnQsIGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhcikge1xuICAgIGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcbiAgICAgICAgbG9jOiB7IGZpbGUsIGxpbmUsIGNvbHVtbiwgY2hhciB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJ1bihmbikge1xuICAgIHJldHVybiBmbigpO1xufVxuZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKG51bGwpO1xufVxuZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcbiAgICBmbnMuZm9yRWFjaChydW4pO1xufVxuZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gc2FmZV9ub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8ICgoYSAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcpIHx8IHR5cGVvZiBhID09PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIG5vdF9lcXVhbChhLCBiKSB7XG4gICAgcmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuICAgIGlmIChzdG9yZSAhPSBudWxsICYmIHR5cGVvZiBzdG9yZS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShzdG9yZSwgLi4uY2FsbGJhY2tzKSB7XG4gICAgaWYgKHN0b3JlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIGNvbnN0IHVuc3ViID0gc3RvcmUuc3Vic2NyaWJlKC4uLmNhbGxiYWNrcyk7XG4gICAgcmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG4gICAgbGV0IHZhbHVlO1xuICAgIHN1YnNjcmliZShzdG9yZSwgXyA9PiB2YWx1ZSA9IF8pKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuICAgIGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goc3Vic2NyaWJlKHN0b3JlLCBjYWxsYmFjaykpO1xufVxuZnVuY3Rpb24gY3JlYXRlX3Nsb3QoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNsb3RfY3R4ID0gZ2V0X3Nsb3RfY29udGV4dChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKTtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuICAgIHJldHVybiBkZWZpbml0aW9uWzFdICYmIGZuXG4gICAgICAgID8gYXNzaWduKCQkc2NvcGUuY3R4LnNsaWNlKCksIGRlZmluaXRpb25bMV0oZm4oY3R4KSkpXG4gICAgICAgIDogJCRzY29wZS5jdHg7XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jaGFuZ2VzKGRlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBmbikge1xuICAgIGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG4gICAgICAgIGNvbnN0IGxldHMgPSBkZWZpbml0aW9uWzJdKGZuKGRpcnR5KSk7XG4gICAgICAgIGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsZXRzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbGV0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgbGVuID0gTWF0aC5tYXgoJCRzY29wZS5kaXJ0eS5sZW5ndGgsIGxldHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuICAgIH1cbiAgICByZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9zbG90KHNsb3QsIHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbiwgZ2V0X3Nsb3RfY29udGV4dF9mbikge1xuICAgIGNvbnN0IHNsb3RfY2hhbmdlcyA9IGdldF9zbG90X2NoYW5nZXMoc2xvdF9kZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbik7XG4gICAgaWYgKHNsb3RfY2hhbmdlcykge1xuICAgICAgICBjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbiAgICAgICAgc2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoa1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdWx0W2tdID0gcHJvcHNba107XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuICAgIGNvbnN0IHJlc3QgPSB7fTtcbiAgICBrZXlzID0gbmV3IFNldChrZXlzKTtcbiAgICBmb3IgKGNvbnN0IGsgaW4gcHJvcHMpXG4gICAgICAgIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKVxuICAgICAgICAgICAgcmVzdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN0O1xufVxuZnVuY3Rpb24gb25jZShmbikge1xuICAgIGxldCByYW4gPSBmYWxzZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHJhbilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSA9IHJldCkge1xuICAgIHN0b3JlLnNldCh2YWx1ZSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbmNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5mdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcbiAgICByZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgbm93ID0gaXNfY2xpZW50XG4gICAgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICA6ICgpID0+IERhdGUubm93KCk7XG5sZXQgcmFmID0gaXNfY2xpZW50ID8gY2IgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG4vLyB1c2VkIGludGVybmFsbHkgZm9yIHRlc3RpbmdcbmZ1bmN0aW9uIHNldF9ub3coZm4pIHtcbiAgICBub3cgPSBmbjtcbn1cbmZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcbiAgICByYWYgPSBmbjtcbn1cblxuY29uc3QgdGFza3MgPSBuZXcgU2V0KCk7XG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG4gICAgdGFza3MuZm9yRWFjaCh0YXNrID0+IHtcbiAgICAgICAgaWYgKCF0YXNrLmMobm93KSkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICAgICAgdGFzay5mKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGFza3Muc2l6ZSAhPT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG59XG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKi9cbmZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuICAgIHRhc2tzLmNsZWFyKCk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKi9cbmZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcbiAgICBsZXQgdGFzaztcbiAgICBpZiAodGFza3Muc2l6ZSA9PT0gMClcbiAgICAgICAgcmFmKHJ1bl90YXNrcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvbWlzZTogbmV3IFByb21pc2UoZnVsZmlsbCA9PiB7XG4gICAgICAgICAgICB0YXNrcy5hZGQodGFzayA9IHsgYzogY2FsbGJhY2ssIGY6IGZ1bGZpbGwgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBhYm9ydCgpIHtcbiAgICAgICAgICAgIHRhc2tzLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIG5vZGUpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xufVxuZnVuY3Rpb24gZGVzdHJveV9lYWNoKGl0ZXJhdGlvbnMsIGRldGFjaGluZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoaXRlcmF0aW9uc1tpXSlcbiAgICAgICAgICAgIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5mdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc19wcm9wKG9iaiwgaylcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICYmIGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgbmFtZSk7XG59XG5mdW5jdGlvbiB0ZXh0KGRhdGEpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5mdW5jdGlvbiBzcGFjZSgpIHtcbiAgICByZXR1cm4gdGV4dCgnICcpO1xufVxuZnVuY3Rpb24gZW1wdHkoKSB7XG4gICAgcmV0dXJuIHRleHQoJycpO1xufVxuZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc2VsZihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKVxuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuICAgIGVsc2UgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT09IHZhbHVlKVxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldF9hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhub2RlLl9fcHJvdG9fXyk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoYXR0cmlidXRlc1trZXldID09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmNzc1RleHQgPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnX192YWx1ZScpIHtcbiAgICAgICAgICAgIG5vZGUudmFsdWUgPSBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVzY3JpcHRvcnNba2V5XSAmJiBkZXNjcmlwdG9yc1trZXldLnNldCkge1xuICAgICAgICAgICAgbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3ZnX2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgYXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICBpZiAocHJvcCBpbiBub2RlKSB7XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwLCBfX3ZhbHVlLCBjaGVja2VkKSB7XG4gICAgY29uc3QgdmFsdWUgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZClcbiAgICAgICAgICAgIHZhbHVlLmFkZChncm91cFtpXS5fX3ZhbHVlKTtcbiAgICB9XG4gICAgaWYgKCFjaGVja2VkKSB7XG4gICAgICAgIHZhbHVlLmRlbGV0ZShfX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xufVxuZnVuY3Rpb24gdG9fbnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2orK107XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmUubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmVba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgel9pbmRleCA9IChwYXJzZUludChjb21wdXRlZF9zdHlsZS56SW5kZXgpIHx8IDApIC0gMTtcbiAgICBpZiAoY29tcHV0ZWRfc3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsIGBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGAgK1xuICAgICAgICBgb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogJHt6X2luZGV4fTtgKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IGBkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5gO1xuICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3Rlbih3aW5kb3csICdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBpZnJhbWUuY29udGVudFdpbmRvdylcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICBpZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUgPSBsaXN0ZW4oaWZyYW1lLmNvbnRlbnRXaW5kb3csICdyZXNpemUnLCBmbik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGFwcGVuZChub2RlLCBpZnJhbWUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChjcm9zc29yaWdpbikge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bnN1YnNjcmliZSAmJiBpZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZXRhY2goaWZyYW1lKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdG9nZ2xlX2NsYXNzKGVsZW1lbnQsIG5hbWUsIHRvZ2dsZSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0W3RvZ2dsZSA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xufVxuZnVuY3Rpb24gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UsIGRldGFpbCk7XG4gICAgcmV0dXJuIGU7XG59XG5mdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuY2xhc3MgSHRtbFRhZyB7XG4gICAgY29uc3RydWN0b3IoYW5jaG9yID0gbnVsbCkge1xuICAgICAgICB0aGlzLmEgPSBhbmNob3I7XG4gICAgICAgIHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG4gICAgfVxuICAgIG0oaHRtbCwgdGFyZ2V0LCBhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIGlmICghdGhpcy5lKSB7XG4gICAgICAgICAgICB0aGlzLmUgPSBlbGVtZW50KHRhcmdldC5ub2RlTmFtZSk7XG4gICAgICAgICAgICB0aGlzLnQgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pKGFuY2hvcik7XG4gICAgfVxuICAgIGgoaHRtbCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgdGhpcy5uID0gQXJyYXkuZnJvbSh0aGlzLmUuY2hpbGROb2Rlcyk7XG4gICAgfVxuICAgIGkoYW5jaG9yKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcChodG1sKSB7XG4gICAgICAgIHRoaXMuZCgpO1xuICAgICAgICB0aGlzLmgoaHRtbCk7XG4gICAgICAgIHRoaXMuaSh0aGlzLmEpO1xuICAgIH1cbiAgICBkKCkge1xuICAgICAgICB0aGlzLm4uZm9yRWFjaChkZXRhY2gpO1xuICAgIH1cbn1cblxuY29uc3QgYWN0aXZlX2RvY3MgPSBuZXcgU2V0KCk7XG5sZXQgYWN0aXZlID0gMDtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBsZXQgaSA9IHN0ci5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5mdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG4gICAgY29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuICAgIGxldCBrZXlmcmFtZXMgPSAne1xcbic7XG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG4gICAgICAgIGNvbnN0IHQgPSBhICsgKGIgLSBhKSAqIGVhc2UocCk7XG4gICAgICAgIGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG4gICAgfVxuICAgIGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuICAgIGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuICAgIGNvbnN0IGRvYyA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICBhY3RpdmVfZG9jcy5hZGQoZG9jKTtcbiAgICBjb25zdCBzdHlsZXNoZWV0ID0gZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQgfHwgKGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0ID0gZG9jLmhlYWQuYXBwZW5kQ2hpbGQoZWxlbWVudCgnc3R5bGUnKSkuc2hlZXQpO1xuICAgIGNvbnN0IGN1cnJlbnRfcnVsZXMgPSBkb2MuX19zdmVsdGVfcnVsZXMgfHwgKGRvYy5fX3N2ZWx0ZV9ydWxlcyA9IHt9KTtcbiAgICBpZiAoIWN1cnJlbnRfcnVsZXNbbmFtZV0pIHtcbiAgICAgICAgY3VycmVudF9ydWxlc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuICAgIG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6IGBgfSR7bmFtZX0gJHtkdXJhdGlvbn1tcyBsaW5lYXIgJHtkZWxheX1tcyAxIGJvdGhgO1xuICAgIGFjdGl2ZSArPSAxO1xuICAgIHJldHVybiBuYW1lO1xufVxuZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcbiAgICBjb25zdCBuZXh0ID0gcHJldmlvdXMuZmlsdGVyKG5hbWVcbiAgICAgICAgPyBhbmltID0+IGFuaW0uaW5kZXhPZihuYW1lKSA8IDAgLy8gcmVtb3ZlIHNwZWNpZmljIGFuaW1hdGlvblxuICAgICAgICA6IGFuaW0gPT4gYW5pbS5pbmRleE9mKCdfX3N2ZWx0ZScpID09PSAtMSAvLyByZW1vdmUgYWxsIFN2ZWx0ZSBhbmltYXRpb25zXG4gICAgKTtcbiAgICBjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG4gICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG4gICAgICAgIGFjdGl2ZSAtPSBkZWxldGVkO1xuICAgICAgICBpZiAoIWFjdGl2ZSlcbiAgICAgICAgICAgIGNsZWFyX3J1bGVzKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY2xlYXJfcnVsZXMoKSB7XG4gICAgcmFmKCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYWN0aXZlX2RvY3MuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldCA9IGRvYy5fX3N2ZWx0ZV9zdHlsZXNoZWV0O1xuICAgICAgICAgICAgbGV0IGkgPSBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pXG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKGkpO1xuICAgICAgICAgICAgZG9jLl9fc3ZlbHRlX3J1bGVzID0ge307XG4gICAgICAgIH0pO1xuICAgICAgICBhY3RpdmVfZG9jcy5jbGVhcigpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVfYW5pbWF0aW9uKG5vZGUsIGZyb20sIGZuLCBwYXJhbXMpIHtcbiAgICBpZiAoIWZyb20pXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoZnJvbS5sZWZ0ID09PSB0by5sZWZ0ICYmIGZyb20ucmlnaHQgPT09IHRvLnJpZ2h0ICYmIGZyb20udG9wID09PSB0by50b3AgJiYgZnJvbS5ib3R0b20gPT09IHRvLmJvdHRvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBzaG91bGQgdGhpcyBiZSBzZXBhcmF0ZWQgZnJvbSBkZXN0cnVjdHVyaW5nPyBPciBzdGFydC9lbmQgYWRkZWQgdG8gcHVibGljIGFwaSBhbmQgZG9jdW1lbnRhdGlvbj9cbiAgICBzdGFydDogc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXksIFxuICAgIC8vIEB0cy1pZ25vcmUgdG9kbzpcbiAgICBlbmQgPSBzdGFydF90aW1lICsgZHVyYXRpb24sIHRpY2sgPSBub29wLCBjc3MgfSA9IGZuKG5vZGUsIHsgZnJvbSwgdG8gfSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICBsZXQgbmFtZTtcbiAgICBmdW5jdGlvbiBzdGFydCgpIHtcbiAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVsYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBuYW1lKTtcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgIGlmICghc3RhcnRlZCAmJiBub3cgPj0gc3RhcnRfdGltZSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0ZWQgJiYgbm93ID49IGVuZCkge1xuICAgICAgICAgICAgdGljaygxLCAwKTtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCkge1xuICAgICAgICAgICAgY29uc3QgcCA9IG5vdyAtIHN0YXJ0X3RpbWU7XG4gICAgICAgICAgICBjb25zdCB0ID0gMCArIDEgKiBlYXNpbmcocCAvIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIHN0YXJ0KCk7XG4gICAgdGljaygwLCAxKTtcbiAgICByZXR1cm4gc3RvcDtcbn1cbmZ1bmN0aW9uIGZpeF9wb3NpdGlvbihub2RlKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGlmIChzdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJyAmJiBzdHlsZS5wb3NpdGlvbiAhPT0gJ2ZpeGVkJykge1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN0eWxlO1xuICAgICAgICBjb25zdCBhID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIG5vZGUuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICAgICAgbm9kZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkZF90cmFuc2Zvcm0obm9kZSwgYSk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkX3RyYW5zZm9ybShub2RlLCBhKSB7XG4gICAgY29uc3QgYiA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKGEubGVmdCAhPT0gYi5sZWZ0IHx8IGEudG9wICE9PSBiLnRvcCkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIG5vZGUuc3R5bGUudHJhbnNmb3JtID0gYCR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHthLmxlZnQgLSBiLmxlZnR9cHgsICR7YS50b3AgLSBiLnRvcH1weClgO1xuICAgIH1cbn1cblxubGV0IGN1cnJlbnRfY29tcG9uZW50O1xuZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgIGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuICAgIGlmICghY3VycmVudF9jb21wb25lbnQpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRnVuY3Rpb24gY2FsbGVkIG91dHNpZGUgY29tcG9uZW50IGluaXRpYWxpemF0aW9uYCk7XG4gICAgcmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYmVmb3JlX3VwZGF0ZS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fZGVzdHJveS5wdXNoKGZuKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICByZXR1cm4gKHR5cGUsIGRldGFpbCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW3R5cGVdO1xuICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG4gICAgICAgICAgICAvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbChjb21wb25lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHNldENvbnRleHQoa2V5LCBjb250ZXh0KSB7XG4gICAgZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG4gICAgcmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcbiAgICBjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNsaWNlKCkuZm9yRWFjaChmbiA9PiBmbihldmVudCkpO1xuICAgIH1cbn1cblxuY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuY29uc3QgaW50cm9zID0geyBlbmFibGVkOiBmYWxzZSB9O1xuY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcbmNvbnN0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcbmNvbnN0IGZsdXNoX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcbiAgICBpZiAoIXVwZGF0ZV9zY2hlZHVsZWQpIHtcbiAgICAgICAgdXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG4gICAgICAgIHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdGljaygpIHtcbiAgICBzY2hlZHVsZV91cGRhdGUoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcbiAgICByZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG4gICAgZmx1c2hfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxubGV0IGZsdXNoaW5nID0gZmFsc2U7XG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGlmIChmbHVzaGluZylcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICBkbyB7XG4gICAgICAgIC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcbiAgICAgICAgLy8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tpXTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgdXBkYXRlKGNvbXBvbmVudC4kJCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuICAgICAgICB3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKVxuICAgICAgICAgICAgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcbiAgICAgICAgLy8gdGhlbiwgb25jZSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBjYWxsXG4gICAgICAgIC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2VcbiAgICAgICAgLy8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSByZW5kZXJfY2FsbGJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFzZWVuX2NhbGxiYWNrcy5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgLy8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuICAgICAgICAgICAgICAgIHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG4gICAgfSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuICAgIHdoaWxlIChmbHVzaF9jYWxsYmFja3MubGVuZ3RoKSB7XG4gICAgICAgIGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuICAgIH1cbiAgICB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICBzZWVuX2NhbGxiYWNrcy5jbGVhcigpO1xufVxuZnVuY3Rpb24gdXBkYXRlKCQkKSB7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICQkLnVwZGF0ZSgpO1xuICAgICAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgICAgICBjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuICAgICAgICAkJC5kaXJ0eSA9IFstMV07XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG4gICAgICAgICQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuICAgIH1cbn1cblxubGV0IHByb21pc2U7XG5mdW5jdGlvbiB3YWl0KCkge1xuICAgIGlmICghcHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudChgJHtkaXJlY3Rpb24gPyAnaW50cm8nIDogJ291dHJvJ30ke2tpbmR9YCkpO1xufVxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5sZXQgb3V0cm9zO1xuZnVuY3Rpb24gZ3JvdXBfb3V0cm9zKCkge1xuICAgIG91dHJvcyA9IHtcbiAgICAgICAgcjogMCxcbiAgICAgICAgYzogW10sXG4gICAgICAgIHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcbiAgICB9O1xufVxuZnVuY3Rpb24gY2hlY2tfb3V0cm9zKCkge1xuICAgIGlmICghb3V0cm9zLnIpIHtcbiAgICAgICAgcnVuX2FsbChvdXRyb3MuYyk7XG4gICAgfVxuICAgIG91dHJvcyA9IG91dHJvcy5wO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2suaSkge1xuICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICBibG9jay5pKGxvY2FsKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uX291dChibG9jaywgbG9jYWwsIGRldGFjaCwgY2FsbGJhY2spIHtcbiAgICBpZiAoYmxvY2sgJiYgYmxvY2subykge1xuICAgICAgICBpZiAob3V0cm9pbmcuaGFzKGJsb2NrKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb3V0cm9pbmcuYWRkKGJsb2NrKTtcbiAgICAgICAgb3V0cm9zLmMucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFjaClcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZCgxKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2subyhsb2NhbCk7XG4gICAgfVxufVxuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGxldCB0YXNrO1xuICAgIGxldCB1aWQgPSAwO1xuICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcbiAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgY29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG4gICAgICAgIGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuICAgICAgICBpZiAodGFzaylcbiAgICAgICAgICAgIHRhc2suYWJvcnQoKTtcbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ3N0YXJ0JykpO1xuICAgICAgICB0YXNrID0gbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHRydWUsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydCgpIHtcbiAgICAgICAgICAgIGlmIChzdGFydGVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbihnbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpbnZhbGlkYXRlKCkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBlbmQoKSB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGFuaW1hdGlvbl9uYW1lO1xuICAgIGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuICAgIGdyb3VwLnIgKz0gMTtcbiAgICBmdW5jdGlvbiBnbygpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCBlYXNpbmcgPSBpZGVudGl0eSwgdGljayA9IG5vb3AsIGNzcyB9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgYWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBmYWxzZSwgJ3N0YXJ0JykpO1xuICAgICAgICBsb29wKG5vdyA9PiB7XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChub3cgPj0gZW5kX3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWdyb3VwLnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXN1bHQgaW4gYGVuZCgpYCBiZWluZyBjYWxsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBuZWVkIHRvIGNsZWFuIHVwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bl9hbGwoZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMSAtIHQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBydW5uaW5nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgd2FpdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICBnbygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdvKCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVuZChyZXNldCkge1xuICAgICAgICAgICAgaWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLnRpY2soMSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuICAgIGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgIGxldCBhbmltYXRpb25fbmFtZSA9IG51bGw7XG4gICAgZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcbiAgICAgICAgY29uc3QgZCA9IHByb2dyYW0uYiAtIHQ7XG4gICAgICAgIGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYTogdCxcbiAgICAgICAgICAgIGI6IHByb2dyYW0uYixcbiAgICAgICAgICAgIGQsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG4gICAgICAgICAgICBncm91cDogcHJvZ3JhbS5ncm91cFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBnbyhiKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGNvbnN0IHByb2dyYW0gPSB7XG4gICAgICAgICAgICBzdGFydDogbm93KCkgKyBkZWxheSxcbiAgICAgICAgICAgIGJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFiKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgcHJvZ3JhbS5ncm91cCA9IG91dHJvcztcbiAgICAgICAgICAgIG91dHJvcy5yICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgcGVuZGluZ19wcm9ncmFtID0gcHJvZ3JhbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgIC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYilcbiAgICAgICAgICAgICAgICB0aWNrKDAsIDEpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcbiAgICAgICAgICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBydW5uaW5nX3Byb2dyYW0uYiwgcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLCAwLCBlYXNpbmcsIGNvbmZpZy5jc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQgPSBydW5uaW5nX3Byb2dyYW0uYiwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdlbmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UncmUgZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRybyDigJQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvdXRybyDigJQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLXJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gISEocnVubmluZ19wcm9ncmFtIHx8IHBlbmRpbmdfcHJvZ3JhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBydW4oYikge1xuICAgICAgICAgICAgaWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICB3YWl0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgICAgIGdvKGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuZCgpIHtcbiAgICAgICAgICAgIGNsZWFyX2FuaW1hdGlvbigpO1xuICAgICAgICAgICAgcnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wcm9taXNlKHByb21pc2UsIGluZm8pIHtcbiAgICBjb25zdCB0b2tlbiA9IGluZm8udG9rZW4gPSB7fTtcbiAgICBmdW5jdGlvbiB1cGRhdGUodHlwZSwgaW5kZXgsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGluZm8udG9rZW4gIT09IHRva2VuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpbmZvLnJlc29sdmVkID0gdmFsdWU7XG4gICAgICAgIGxldCBjaGlsZF9jdHggPSBpbmZvLmN0eDtcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZF9jdHggPSBjaGlsZF9jdHguc2xpY2UoKTtcbiAgICAgICAgICAgIGNoaWxkX2N0eFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSB0eXBlICYmIChpbmZvLmN1cnJlbnQgPSB0eXBlKShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgbmVlZHNfZmx1c2ggPSBmYWxzZTtcbiAgICAgICAgaWYgKGluZm8uYmxvY2spIHtcbiAgICAgICAgICAgIGlmIChpbmZvLmJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzLmZvckVhY2goKGJsb2NrLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleCAmJiBibG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uX291dChibG9jaywgMSwgMSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm8uYmxvY2tzW2ldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tfb3V0cm9zKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZm8uYmxvY2suZCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICAgICAgYmxvY2subShpbmZvLm1vdW50KCksIGluZm8uYW5jaG9yKTtcbiAgICAgICAgICAgIG5lZWRzX2ZsdXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLmJsb2NrID0gYmxvY2s7XG4gICAgICAgIGlmIChpbmZvLmJsb2NrcylcbiAgICAgICAgICAgIGluZm8uYmxvY2tzW2luZGV4XSA9IGJsb2NrO1xuICAgICAgICBpZiAobmVlZHNfZmx1c2gpIHtcbiAgICAgICAgICAgIGZsdXNoKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgY29uc3QgY3VycmVudF9jb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChjdXJyZW50X2NvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby5jYXRjaCwgMiwgaW5mby5lcnJvciwgZXJyb3IpO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgd2UgcHJldmlvdXNseSBoYWQgYSB0aGVuL2NhdGNoIGJsb2NrLCBkZXN0cm95IGl0XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8ucGVuZGluZykge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8ucGVuZGluZywgMCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGluZm8uY3VycmVudCAhPT0gaW5mby50aGVuKSB7XG4gICAgICAgICAgICB1cGRhdGUoaW5mby50aGVuLCAxLCBpbmZvLnZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSBwcm9taXNlO1xuICAgIH1cbn1cblxuY29uc3QgZ2xvYmFscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgID8gd2luZG93XG4gICAgOiB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgPyBnbG9iYWxUaGlzXG4gICAgICAgIDogZ2xvYmFsKTtcblxuZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZCgxKTtcbiAgICBsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5mdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgdHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcbiAgICAgICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmYoKTtcbiAgICBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKG9sZF9ibG9ja3MsIGRpcnR5LCBnZXRfa2V5LCBkeW5hbWljLCBjdHgsIGxpc3QsIGxvb2t1cCwgbm9kZSwgZGVzdHJveSwgY3JlYXRlX2VhY2hfYmxvY2ssIG5leHQsIGdldF9jb250ZXh0KSB7XG4gICAgbGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcbiAgICBsZXQgbiA9IGxpc3QubGVuZ3RoO1xuICAgIGxldCBpID0gbztcbiAgICBjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIG9sZF9pbmRleGVzW29sZF9ibG9ja3NbaV0ua2V5XSA9IGk7XG4gICAgY29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuICAgIGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZGVsdGFzID0gbmV3IE1hcCgpO1xuICAgIGkgPSBuO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY29uc3QgY2hpbGRfY3R4ID0gZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKTtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShjaGlsZF9jdHgpO1xuICAgICAgICBsZXQgYmxvY2sgPSBsb29rdXAuZ2V0KGtleSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICAgIGJsb2NrID0gY3JlYXRlX2VhY2hfYmxvY2soa2V5LCBjaGlsZF9jdHgpO1xuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGR5bmFtaWMpIHtcbiAgICAgICAgICAgIGJsb2NrLnAoY2hpbGRfY3R4LCBkaXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3X2xvb2t1cC5zZXQoa2V5LCBuZXdfYmxvY2tzW2ldID0gYmxvY2spO1xuICAgICAgICBpZiAoa2V5IGluIG9sZF9pbmRleGVzKVxuICAgICAgICAgICAgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG4gICAgfVxuICAgIGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcbiAgICBmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcbiAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgIGJsb2NrLm0obm9kZSwgbmV4dCk7XG4gICAgICAgIGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG4gICAgICAgIG5leHQgPSBibG9jay5maXJzdDtcbiAgICAgICAgbi0tO1xuICAgIH1cbiAgICB3aGlsZSAobyAmJiBuKSB7XG4gICAgICAgIGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuICAgICAgICBjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW28gLSAxXTtcbiAgICAgICAgY29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG4gICAgICAgIGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuICAgICAgICBpZiAobmV3X2Jsb2NrID09PSBvbGRfYmxvY2spIHtcbiAgICAgICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIG5leHQgPSBuZXdfYmxvY2suZmlyc3Q7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgICAgICBuLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgb2xkIGJsb2NrXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG4gICAgICAgICAgICBpbnNlcnQobmV3X2Jsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWRfbW92ZS5oYXMob2xkX2tleSkpIHtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuICAgICAgICAgICAgZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuICAgICAgICAgICAgby0tO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvLS0pIHtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcbiAgICAgICAgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfYmxvY2sua2V5KSlcbiAgICAgICAgICAgIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuICAgIH1cbiAgICB3aGlsZSAobilcbiAgICAgICAgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcbiAgICByZXR1cm4gbmV3X2Jsb2Nrcztcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfa2V5cyhjdHgsIGxpc3QsIGdldF9jb250ZXh0LCBnZXRfa2V5KSB7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0X2tleShnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpKTtcbiAgICAgICAgaWYgKGtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGhhdmUgZHVwbGljYXRlIGtleXMgaW4gYSBrZXllZCBlYWNoYCk7XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5hZGQoa2V5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldF9zcHJlYWRfdXBkYXRlKGxldmVscywgdXBkYXRlcykge1xuICAgIGNvbnN0IHVwZGF0ZSA9IHt9O1xuICAgIGNvbnN0IHRvX251bGxfb3V0ID0ge307XG4gICAgY29uc3QgYWNjb3VudGVkX2ZvciA9IHsgJCRzY29wZTogMSB9O1xuICAgIGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IG8gPSBsZXZlbHNbaV07XG4gICAgICAgIGNvbnN0IG4gPSB1cGRhdGVzW2ldO1xuICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbykge1xuICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBuKSlcbiAgICAgICAgICAgICAgICAgICAgdG9fbnVsbF9vdXRba2V5XSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW2tleV0gPSBuW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWxzW2ldID0gbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB1cGRhdGUpKVxuICAgICAgICAgICAgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGU7XG59XG5mdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG5cbi8vIHNvdXJjZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sXG5jb25zdCBib29sZWFuX2F0dHJpYnV0ZXMgPSBuZXcgU2V0KFtcbiAgICAnYWxsb3dmdWxsc2NyZWVuJyxcbiAgICAnYWxsb3dwYXltZW50cmVxdWVzdCcsXG4gICAgJ2FzeW5jJyxcbiAgICAnYXV0b2ZvY3VzJyxcbiAgICAnYXV0b3BsYXknLFxuICAgICdjaGVja2VkJyxcbiAgICAnY29udHJvbHMnLFxuICAgICdkZWZhdWx0JyxcbiAgICAnZGVmZXInLFxuICAgICdkaXNhYmxlZCcsXG4gICAgJ2Zvcm1ub3ZhbGlkYXRlJyxcbiAgICAnaGlkZGVuJyxcbiAgICAnaXNtYXAnLFxuICAgICdsb29wJyxcbiAgICAnbXVsdGlwbGUnLFxuICAgICdtdXRlZCcsXG4gICAgJ25vbW9kdWxlJyxcbiAgICAnbm92YWxpZGF0ZScsXG4gICAgJ29wZW4nLFxuICAgICdwbGF5c2lubGluZScsXG4gICAgJ3JlYWRvbmx5JyxcbiAgICAncmVxdWlyZWQnLFxuICAgICdyZXZlcnNlZCcsXG4gICAgJ3NlbGVjdGVkJ1xuXSk7XG5cbmNvbnN0IGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyID0gL1tcXHMnXCI+Lz1cXHV7RkREMH0tXFx1e0ZERUZ9XFx1e0ZGRkV9XFx1e0ZGRkZ9XFx1ezFGRkZFfVxcdXsxRkZGRn1cXHV7MkZGRkV9XFx1ezJGRkZGfVxcdXszRkZGRX1cXHV7M0ZGRkZ9XFx1ezRGRkZFfVxcdXs0RkZGRn1cXHV7NUZGRkV9XFx1ezVGRkZGfVxcdXs2RkZGRX1cXHV7NkZGRkZ9XFx1ezdGRkZFfVxcdXs3RkZGRn1cXHV7OEZGRkV9XFx1ezhGRkZGfVxcdXs5RkZGRX1cXHV7OUZGRkZ9XFx1e0FGRkZFfVxcdXtBRkZGRn1cXHV7QkZGRkV9XFx1e0JGRkZGfVxcdXtDRkZGRX1cXHV7Q0ZGRkZ9XFx1e0RGRkZFfVxcdXtERkZGRn1cXHV7RUZGRkV9XFx1e0VGRkZGfVxcdXtGRkZGRX1cXHV7RkZGRkZ9XFx1ezEwRkZGRX1cXHV7MTBGRkZGfV0vdTtcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3N5bnRheC5odG1sI2F0dHJpYnV0ZXMtMlxuLy8gaHR0cHM6Ly9pbmZyYS5zcGVjLndoYXR3Zy5vcmcvI25vbmNoYXJhY3RlclxuZnVuY3Rpb24gc3ByZWFkKGFyZ3MsIGNsYXNzZXNfdG9fYWRkKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5hc3NpZ24oe30sIC4uLmFyZ3MpO1xuICAgIGlmIChjbGFzc2VzX3RvX2FkZCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5jbGFzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzID0gY2xhc3Nlc190b19hZGQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzLmNsYXNzICs9ICcgJyArIGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBzdHIgPSAnJztcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBpZiAoaW52YWxpZF9hdHRyaWJ1dGVfbmFtZV9jaGFyYWN0ZXIudGVzdChuYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICBpZiAodmFsdWUgPT09IHRydWUpXG4gICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICBlbHNlIGlmIChib29sZWFuX2F0dHJpYnV0ZXMuaGFzKG5hbWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCIgXCIgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN0ciArPSBgICR7bmFtZX09XCIke1N0cmluZyh2YWx1ZSkucmVwbGFjZSgvXCIvZywgJyYjMzQ7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgZXNjYXBlZCA9IHtcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0Oydcbn07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvW1wiJyY8Pl0vZywgbWF0Y2ggPT4gZXNjYXBlZFttYXRjaF0pO1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cykge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiBgYDtcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQgJiYgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCBwcm9wX3ZhbHVlcyA9IG9wdGlvbnMucHJvcHMgfHwge307XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQgPSB7XG4gICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICBjdHg6IG51bGwsXG4gICAgICAgIC8vIHN0YXRlXG4gICAgICAgIHByb3BzLFxuICAgICAgICB1cGRhdGU6IG5vb3AsXG4gICAgICAgIG5vdF9lcXVhbCxcbiAgICAgICAgYm91bmQ6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICAvLyBsaWZlY3ljbGVcbiAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICBvbl9kZXN0cm95OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5XG4gICAgfTtcbiAgICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgICAkJC5jdHggPSBpbnN0YW5jZVxuICAgICAgICA/IGluc3RhbmNlKGNvbXBvbmVudCwgcHJvcF92YWx1ZXMsIChpLCByZXQsIC4uLnJlc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVzdC5sZW5ndGggPyByZXN0WzBdIDogcmV0O1xuICAgICAgICAgICAgaWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAkJC5jdHhbaV0gPSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCQuYm91bmRbaV0pXG4gICAgICAgICAgICAgICAgICAgICQkLmJvdW5kW2ldKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVhZHkpXG4gICAgICAgICAgICAgICAgICAgIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG4gICAgJCQudXBkYXRlKCk7XG4gICAgcmVhZHkgPSB0cnVlO1xuICAgIHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG4gICAgLy8gYGZhbHNlYCBhcyBhIHNwZWNpYWwgY2FzZSBvZiBubyBET00gY29tcG9uZW50XG4gICAgJCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgICAgICBpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKG5vZGVzKTtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZGV0YWNoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuaW50cm8pXG4gICAgICAgICAgICB0cmFuc2l0aW9uX2luKGNvbXBvbmVudC4kJC5mcmFnbWVudCk7XG4gICAgICAgIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG4gICAgICAgIGZsdXNoKCk7XG4gICAgfVxuICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cbmxldCBTdmVsdGVFbGVtZW50O1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJC5zbG90dGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuJCQuc2xvdHRlZFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpc1thdHRyXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgICRkZXN0cm95KCkge1xuICAgICAgICAgICAgZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG4gICAgICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICAgICAgfVxuICAgICAgICAkb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgZGVsZWdhdGUgdG8gYWRkRXZlbnRMaXN0ZW5lcj9cbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgJHNldCgpIHtcbiAgICAgICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgaW5zdGFuY2UsIGlmIGl0IGhhcyBwcm9wc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hfZGV2KHR5cGUsIGRldGFpbCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIE9iamVjdC5hc3NpZ24oeyB2ZXJzaW9uOiAnMy4yNC4wJyB9LCBkZXRhaWwpKSk7XG59XG5mdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTUluc2VydFwiLCB7IHRhcmdldCwgbm9kZSB9KTtcbiAgICBhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICBkaXNwYXRjaF9kZXYoXCJTdmVsdGVET01JbnNlcnRcIiwgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlXCIsIHsgbm9kZSB9KTtcbiAgICBkZXRhY2gobm9kZSk7XG59XG5mdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcgJiYgYmVmb3JlLm5leHRTaWJsaW5nICE9PSBhZnRlcikge1xuICAgICAgICBkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2JlZm9yZV9kZXYoYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuICAgIHdoaWxlIChiZWZvcmUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpc3Rlbl9kZXYobm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMsIGhhc19wcmV2ZW50X2RlZmF1bHQsIGhhc19zdG9wX3Byb3BhZ2F0aW9uKSB7XG4gICAgY29uc3QgbW9kaWZpZXJzID0gb3B0aW9ucyA9PT0gdHJ1ZSA/IFtcImNhcHR1cmVcIl0gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcbiAgICBpZiAoaGFzX3ByZXZlbnRfZGVmYXVsdClcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goJ3ByZXZlbnREZWZhdWx0Jyk7XG4gICAgaWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKVxuICAgICAgICBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NQWRkRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lclwiLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgICAgIGRpc3Bvc2UoKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuICAgIGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcbiAgICBlbHNlXG4gICAgICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldEF0dHJpYnV0ZVwiLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldFByb3BlcnR5XCIsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgbm9kZS5kYXRhc2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldihcIlN2ZWx0ZURPTVNldERhdGFzZXRcIiwgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSkge1xuICAgIGRhdGEgPSAnJyArIGRhdGE7XG4gICAgaWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKVxuICAgICAgICByZXR1cm47XG4gICAgZGlzcGF0Y2hfZGV2KFwiU3ZlbHRlRE9NU2V0RGF0YVwiLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25gKTtcbiAgICAgICAgfVxuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuJGRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZGVzdHJveSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZGApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgJGNhcHR1cmVfc3RhdGUoKSB7IH1cbiAgICAkaW5qZWN0X3N0YXRlKCkgeyB9XG59XG5mdW5jdGlvbiBsb29wX2d1YXJkKHRpbWVvdXQpIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKERhdGUubm93KCkgLSBzdGFydCA+IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5maW5pdGUgbG9vcCBkZXRlY3RlZGApO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgSHRtbFRhZywgU3ZlbHRlQ29tcG9uZW50LCBTdmVsdGVDb21wb25lbnREZXYsIFN2ZWx0ZUVsZW1lbnQsIGFjdGlvbl9kZXN0cm95ZXIsIGFkZF9hdHRyaWJ1dGUsIGFkZF9jbGFzc2VzLCBhZGRfZmx1c2hfY2FsbGJhY2ssIGFkZF9sb2NhdGlvbiwgYWRkX3JlbmRlcl9jYWxsYmFjaywgYWRkX3Jlc2l6ZV9saXN0ZW5lciwgYWRkX3RyYW5zZm9ybSwgYWZ0ZXJVcGRhdGUsIGFwcGVuZCwgYXBwZW5kX2RldiwgYXNzaWduLCBhdHRyLCBhdHRyX2RldiwgYmVmb3JlVXBkYXRlLCBiaW5kLCBiaW5kaW5nX2NhbGxiYWNrcywgYmxhbmtfb2JqZWN0LCBidWJibGUsIGNoZWNrX291dHJvcywgY2hpbGRyZW4sIGNsYWltX2NvbXBvbmVudCwgY2xhaW1fZWxlbWVudCwgY2xhaW1fc3BhY2UsIGNsYWltX3RleHQsIGNsZWFyX2xvb3BzLCBjb21wb25lbnRfc3Vic2NyaWJlLCBjb21wdXRlX3Jlc3RfcHJvcHMsIGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciwgY3JlYXRlX2FuaW1hdGlvbiwgY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbiwgY3JlYXRlX2NvbXBvbmVudCwgY3JlYXRlX2luX3RyYW5zaXRpb24sIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbiwgY3JlYXRlX3Nsb3QsIGNyZWF0ZV9zc3JfY29tcG9uZW50LCBjdXJyZW50X2NvbXBvbmVudCwgY3VzdG9tX2V2ZW50LCBkYXRhc2V0X2RldiwgZGVidWcsIGRlc3Ryb3lfYmxvY2ssIGRlc3Ryb3lfY29tcG9uZW50LCBkZXN0cm95X2VhY2gsIGRldGFjaCwgZGV0YWNoX2FmdGVyX2RldiwgZGV0YWNoX2JlZm9yZV9kZXYsIGRldGFjaF9iZXR3ZWVuX2RldiwgZGV0YWNoX2RldiwgZGlydHlfY29tcG9uZW50cywgZGlzcGF0Y2hfZGV2LCBlYWNoLCBlbGVtZW50LCBlbGVtZW50X2lzLCBlbXB0eSwgZXNjYXBlLCBlc2NhcGVkLCBleGNsdWRlX2ludGVybmFsX3Byb3BzLCBmaXhfYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIGZpeF9wb3NpdGlvbiwgZmx1c2gsIGdldENvbnRleHQsIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlLCBnZXRfY3VycmVudF9jb21wb25lbnQsIGdldF9zbG90X2NoYW5nZXMsIGdldF9zbG90X2NvbnRleHQsIGdldF9zcHJlYWRfb2JqZWN0LCBnZXRfc3ByZWFkX3VwZGF0ZSwgZ2V0X3N0b3JlX3ZhbHVlLCBnbG9iYWxzLCBncm91cF9vdXRyb3MsIGhhbmRsZV9wcm9taXNlLCBoYXNfcHJvcCwgaWRlbnRpdHksIGluaXQsIGluc2VydCwgaW5zZXJ0X2RldiwgaW50cm9zLCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciwgaXNfY2xpZW50LCBpc19jcm9zc29yaWdpbiwgaXNfZnVuY3Rpb24sIGlzX3Byb21pc2UsIGxpc3RlbiwgbGlzdGVuX2RldiwgbG9vcCwgbG9vcF9ndWFyZCwgbWlzc2luZ19jb21wb25lbnQsIG1vdW50X2NvbXBvbmVudCwgbm9vcCwgbm90X2VxdWFsLCBub3csIG51bGxfdG9fZW1wdHksIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMsIG9uRGVzdHJveSwgb25Nb3VudCwgb25jZSwgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIHByZXZlbnRfZGVmYXVsdCwgcHJvcF9kZXYsIHF1ZXJ5X3NlbGVjdG9yX2FsbCwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3Nsb3RzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiaW1wb3J0IHsgbm9vcCwgc2FmZV9ub3RfZXF1YWwsIHN1YnNjcmliZSwgcnVuX2FsbCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5leHBvcnQgeyBnZXRfc3RvcmVfdmFsdWUgYXMgZ2V0IH0gZnJvbSAnLi4vaW50ZXJuYWwnO1xuXG5jb25zdCBzdWJzY3JpYmVyX3F1ZXVlID0gW107XG4vKipcbiAqIENyZWF0ZXMgYSBgUmVhZGFibGVgIHN0b3JlIHRoYXQgYWxsb3dzIHJlYWRpbmcgYnkgc3Vic2NyaXB0aW9uLlxuICogQHBhcmFtIHZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXJ9c3RhcnQgc3RhcnQgYW5kIHN0b3Agbm90aWZpY2F0aW9ucyBmb3Igc3Vic2NyaXB0aW9uc1xuICovXG5mdW5jdGlvbiByZWFkYWJsZSh2YWx1ZSwgc3RhcnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmU6IHdyaXRhYmxlKHZhbHVlLCBzdGFydCkuc3Vic2NyaWJlLFxuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZSBhIGBXcml0YWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgYm90aCB1cGRhdGluZyBhbmQgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0geyo9fXZhbHVlIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7U3RhcnRTdG9wTm90aWZpZXI9fXN0YXJ0IHN0YXJ0IGFuZCBzdG9wIG5vdGlmaWNhdGlvbnMgZm9yIHN1YnNjcmlwdGlvbnNcbiAqL1xuZnVuY3Rpb24gd3JpdGFibGUodmFsdWUsIHN0YXJ0ID0gbm9vcCkge1xuICAgIGxldCBzdG9wO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzID0gW107XG4gICAgZnVuY3Rpb24gc2V0KG5ld192YWx1ZSkge1xuICAgICAgICBpZiAoc2FmZV9ub3RfZXF1YWwodmFsdWUsIG5ld192YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgaWYgKHN0b3ApIHsgLy8gc3RvcmUgaXMgcmVhZHlcbiAgICAgICAgICAgICAgICBjb25zdCBydW5fcXVldWUgPSAhc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHNbMV0oKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcl9xdWV1ZS5wdXNoKHMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bl9xdWV1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJfcXVldWUubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWVbaV1bMF0oc3Vic2NyaWJlcl9xdWV1ZVtpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgICAgIHNldChmbih2YWx1ZSkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUocnVuLCBpbnZhbGlkYXRlID0gbm9vcCkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gW3J1biwgaW52YWxpZGF0ZV07XG4gICAgICAgIHN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHN0b3AgPSBzdGFydChzZXQpIHx8IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgcnVuKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICBzdG9wID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc2V0LCB1cGRhdGUsIHN1YnNjcmliZSB9O1xufVxuZnVuY3Rpb24gZGVyaXZlZChzdG9yZXMsIGZuLCBpbml0aWFsX3ZhbHVlKSB7XG4gICAgY29uc3Qgc2luZ2xlID0gIUFycmF5LmlzQXJyYXkoc3RvcmVzKTtcbiAgICBjb25zdCBzdG9yZXNfYXJyYXkgPSBzaW5nbGVcbiAgICAgICAgPyBbc3RvcmVzXVxuICAgICAgICA6IHN0b3JlcztcbiAgICBjb25zdCBhdXRvID0gZm4ubGVuZ3RoIDwgMjtcbiAgICByZXR1cm4gcmVhZGFibGUoaW5pdGlhbF92YWx1ZSwgKHNldCkgPT4ge1xuICAgICAgICBsZXQgaW5pdGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDA7XG4gICAgICAgIGxldCBjbGVhbnVwID0gbm9vcDtcbiAgICAgICAgY29uc3Qgc3luYyA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4oc2luZ2xlID8gdmFsdWVzWzBdIDogdmFsdWVzLCBzZXQpO1xuICAgICAgICAgICAgaWYgKGF1dG8pIHtcbiAgICAgICAgICAgICAgICBzZXQocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFudXAgPSBpc19mdW5jdGlvbihyZXN1bHQpID8gcmVzdWx0IDogbm9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdW5zdWJzY3JpYmVycyA9IHN0b3Jlc19hcnJheS5tYXAoKHN0b3JlLCBpKSA9PiBzdWJzY3JpYmUoc3RvcmUsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICBwZW5kaW5nICY9IH4oMSA8PCBpKTtcbiAgICAgICAgICAgIGlmIChpbml0ZWQpIHtcbiAgICAgICAgICAgICAgICBzeW5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHBlbmRpbmcgfD0gKDEgPDwgaSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgc3luYygpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgICAgIHJ1bl9hbGwodW5zdWJzY3JpYmVycyk7XG4gICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGRlcml2ZWQsIHJlYWRhYmxlLCB3cml0YWJsZSB9O1xuIiwiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuXG5leHBvcnQgY29uc3QgQ09OVEVYVF9LRVkgPSB7fTtcblxuZXhwb3J0IGNvbnN0IHByZWxvYWQgPSAoKSA9PiAoe30pOyIsImltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSBcInN2ZWx0ZS9zdG9yZVwiO1xuXG5leHBvcnQgY29uc3Qgc3RhdGVTdG9yZSA9IHdyaXRhYmxlKHsgcm91dDogXCJib3RsaXN0XCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd21lbnU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0Ym90bmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybGhvc3Q6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXJrbW9kZXN0YXR1czogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVySWQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lcklkbGlzdDogXCJcIn0pOyIsImltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSBcInN2ZWx0ZS9zdG9yZVwiO1xuXG5leHBvcnQgY29uc3QgYXV0aFN0b3JlID0gd3JpdGFibGUoeyBzdGF0dXM6IFwibG9hZGluZ1wiIH0pO1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY3JlYXRlQmluZGluZyhvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAgUFVSRV9JTVBPUlRTX0VORCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzRnVuY3Rpb24uanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG52YXIgX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzID0gZmFsc2U7XG5leHBvcnQgdmFyIGNvbmZpZyA9IHtcbiAgICBQcm9taXNlOiB1bmRlZmluZWQsXG4gICAgc2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSAvKkBfX1BVUkVfXyovIG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgLypAX19QVVJFX18qLyBjb25zb2xlLndhcm4oJ0RFUFJFQ0FURUQhIFJ4SlMgd2FzIHNldCB0byB1c2UgZGVwcmVjYXRlZCBzeW5jaHJvbm91cyBlcnJvciBoYW5kbGluZyBiZWhhdmlvciBieSBjb2RlIGF0OiBcXG4nICsgZXJyb3Iuc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncykge1xuICAgICAgICAgICAgLypAX19QVVJFX18qLyBjb25zb2xlLmxvZygnUnhKUzogQmFjayB0byBhIGJldHRlciBlcnJvciBiZWhhdmlvci4gVGhhbmsgeW91LiA8MycpO1xuICAgICAgICB9XG4gICAgICAgIF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncyA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcoKSB7XG4gICAgICAgIHJldHVybiBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3M7XG4gICAgfSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25maWcuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgZnVuY3Rpb24gaG9zdFJlcG9ydEVycm9yKGVycikge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aHJvdyBlcnI7IH0sIDApO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9zdFJlcG9ydEVycm9yLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCBfY29uZmlnLF91dGlsX2hvc3RSZXBvcnRFcnJvciBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvaG9zdFJlcG9ydEVycm9yJztcbmV4cG9ydCB2YXIgZW1wdHkgPSB7XG4gICAgY2xvc2VkOiB0cnVlLFxuICAgIG5leHQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyB9LFxuICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7IH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYnNlcnZlci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgIFBVUkVfSU1QT1JUU19FTkQgKi9cbmV4cG9ydCB2YXIgaXNBcnJheSA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uICgpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkgfHwgKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICYmIHR5cGVvZiB4Lmxlbmd0aCA9PT0gJ251bWJlcic7IH0pOyB9KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNBcnJheS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgIFBVUkVfSU1QT1JUU19FTkQgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4KSB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mIHggPT09ICdvYmplY3QnO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNPYmplY3QuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG52YXIgVW5zdWJzY3JpcHRpb25FcnJvckltcGwgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVW5zdWJzY3JpcHRpb25FcnJvckltcGwoZXJyb3JzKSB7XG4gICAgICAgIEVycm9yLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGVycm9ycyA/XG4gICAgICAgICAgICBlcnJvcnMubGVuZ3RoICsgXCIgZXJyb3JzIG9jY3VycmVkIGR1cmluZyB1bnN1YnNjcmlwdGlvbjpcXG5cIiArIGVycm9ycy5tYXAoZnVuY3Rpb24gKGVyciwgaSkgeyByZXR1cm4gaSArIDEgKyBcIikgXCIgKyBlcnIudG9TdHJpbmcoKTsgfSkuam9pbignXFxuICAnKSA6ICcnO1xuICAgICAgICB0aGlzLm5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgVW5zdWJzY3JpcHRpb25FcnJvckltcGwucHJvdG90eXBlID0gLypAX19QVVJFX18qLyBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIFVuc3Vic2NyaXB0aW9uRXJyb3JJbXBsO1xufSkoKTtcbmV4cG9ydCB2YXIgVW5zdWJzY3JpcHRpb25FcnJvciA9IFVuc3Vic2NyaXB0aW9uRXJyb3JJbXBsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VW5zdWJzY3JpcHRpb25FcnJvci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX3V0aWxfaXNBcnJheSxfdXRpbF9pc09iamVjdCxfdXRpbF9pc0Z1bmN0aW9uLF91dGlsX1Vuc3Vic2NyaXB0aW9uRXJyb3IgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi91dGlsL2lzT2JqZWN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xudmFyIFN1YnNjcmlwdGlvbiA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdWJzY3JpcHRpb24odW5zdWJzY3JpYmUpIHtcbiAgICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGFyZW50T3JQYXJlbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgICAgIGlmICh1bnN1YnNjcmliZSkge1xuICAgICAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXJyb3JzO1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSB0aGlzLCBfcGFyZW50T3JQYXJlbnRzID0gX2EuX3BhcmVudE9yUGFyZW50cywgX3Vuc3Vic2NyaWJlID0gX2EuX3Vuc3Vic2NyaWJlLCBfc3Vic2NyaXB0aW9ucyA9IF9hLl9zdWJzY3JpcHRpb25zO1xuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BhcmVudE9yUGFyZW50cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgICAgICBpZiAoX3BhcmVudE9yUGFyZW50cyBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgX3BhcmVudE9yUGFyZW50cy5yZW1vdmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoX3BhcmVudE9yUGFyZW50cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IF9wYXJlbnRPclBhcmVudHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudF8xID0gX3BhcmVudE9yUGFyZW50c1tpbmRleF07XG4gICAgICAgICAgICAgICAgcGFyZW50XzEucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKF91bnN1YnNjcmliZSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgX3Vuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9ycyA9IGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID8gZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGUuZXJyb3JzKSA6IFtlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheShfc3Vic2NyaXB0aW9ucykpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGxlbiA9IF9zdWJzY3JpcHRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YiA9IF9zdWJzY3JpcHRpb25zW2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3Qoc3ViKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycyB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQoZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGUuZXJyb3JzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpcHRpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0ZWFyZG93bikge1xuICAgICAgICB2YXIgc3Vic2NyaXB0aW9uID0gdGVhcmRvd247XG4gICAgICAgIGlmICghdGVhcmRvd24pIHtcbiAgICAgICAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdGVhcmRvd24pIHtcbiAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKHRlYXJkb3duKTtcbiAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbiA9PT0gdGhpcyB8fCBzdWJzY3JpcHRpb24uY2xvc2VkIHx8IHR5cGVvZiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCEoc3Vic2NyaXB0aW9uIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5fc3Vic2NyaXB0aW9ucyA9IFt0bXBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCB0ZWFyZG93biAnICsgdGVhcmRvd24gKyAnIGFkZGVkIHRvIFN1YnNjcmlwdGlvbi4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgX3BhcmVudE9yUGFyZW50cyA9IHN1YnNjcmlwdGlvbi5fcGFyZW50T3JQYXJlbnRzO1xuICAgICAgICBpZiAoX3BhcmVudE9yUGFyZW50cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLl9wYXJlbnRPclBhcmVudHMgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9wYXJlbnRPclBhcmVudHMgaW5zdGFuY2VvZiBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGlmIChfcGFyZW50T3JQYXJlbnRzID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5fcGFyZW50T3JQYXJlbnRzID0gW19wYXJlbnRPclBhcmVudHMsIHRoaXNdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9wYXJlbnRPclBhcmVudHMuaW5kZXhPZih0aGlzKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIF9wYXJlbnRPclBhcmVudHMucHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zO1xuICAgICAgICBpZiAoc3Vic2NyaXB0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtzdWJzY3JpcHRpb25dO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHN1YnNjcmlwdGlvbikge1xuICAgICAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmlwdGlvbnM7XG4gICAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9uSW5kZXggPSBzdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgIGlmIChzdWJzY3JpcHRpb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25zLnNwbGljZShzdWJzY3JpcHRpb25JbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmlwdGlvbi5FTVBUWSA9IChmdW5jdGlvbiAoZW1wdHkpIHtcbiAgICAgICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgIH0obmV3IFN1YnNjcmlwdGlvbigpKSk7XG4gICAgcmV0dXJuIFN1YnNjcmlwdGlvbjtcbn0oKSk7XG5leHBvcnQgeyBTdWJzY3JpcHRpb24gfTtcbmZ1bmN0aW9uIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvcnMpIHtcbiAgICByZXR1cm4gZXJyb3JzLnJlZHVjZShmdW5jdGlvbiAoZXJycywgZXJyKSB7IHJldHVybiBlcnJzLmNvbmNhdCgoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikgPyBlcnIuZXJyb3JzIDogZXJyKTsgfSwgW10pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaXB0aW9uLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAgUFVSRV9JTVBPUlRTX0VORCAqL1xuZXhwb3J0IHZhciByeFN1YnNjcmliZXIgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyAvKkBfX1BVUkVfXyovIFN5bWJvbCgncnhTdWJzY3JpYmVyJylcbiAgICAgICAgOiAnQEByeFN1YnNjcmliZXJfJyArIC8qQF9fUFVSRV9fKi8gTWF0aC5yYW5kb20oKTtcbn0pKCk7XG5leHBvcnQgdmFyICQkcnhTdWJzY3JpYmVyID0gcnhTdWJzY3JpYmVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cnhTdWJzY3JpYmVyLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCB0c2xpYixfdXRpbF9pc0Z1bmN0aW9uLF9PYnNlcnZlcixfU3Vic2NyaXB0aW9uLF9pbnRlcm5hbF9zeW1ib2xfcnhTdWJzY3JpYmVyLF9jb25maWcsX3V0aWxfaG9zdFJlcG9ydEVycm9yIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZW1wdHkgYXMgZW1wdHlPYnNlcnZlciB9IGZyb20gJy4vT2JzZXJ2ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG52YXIgU3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN1YnNjcmliZXIoZGVzdGluYXRpb25Pck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5zeW5jRXJyb3JWYWx1ZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnN5bmNFcnJvclRocm93biA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBpZiAoIWRlc3RpbmF0aW9uT3JOZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25Pck5leHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0aW5hdGlvbk9yTmV4dCBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IGRlc3RpbmF0aW9uT3JOZXh0LnN5bmNFcnJvclRocm93YWJsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb25Pck5leHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbk9yTmV4dC5hZGQoX3RoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyKF90aGlzLCBkZXN0aW5hdGlvbk9yTmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBfdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF90aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyKF90aGlzLCBkZXN0aW5hdGlvbk9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFN1YnNjcmliZXIucHJvdG90eXBlW3J4U3Vic2NyaWJlclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICAgIFN1YnNjcmliZXIuY3JlYXRlID0gZnVuY3Rpb24gKG5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IG5ldyBTdWJzY3JpYmVyKG5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIHN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlLmNhbGwodGhpcyk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5fbmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH07XG4gICAgU3Vic2NyaWJlci5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICAgIFN1YnNjcmliZXIucHJvdG90eXBlLl9jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgICBTdWJzY3JpYmVyLnByb3RvdHlwZS5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3BhcmVudE9yUGFyZW50cyA9IHRoaXMuX3BhcmVudE9yUGFyZW50cztcbiAgICAgICAgdGhpcy5fcGFyZW50T3JQYXJlbnRzID0gbnVsbDtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9wYXJlbnRPclBhcmVudHMgPSBfcGFyZW50T3JQYXJlbnRzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBTdWJzY3JpYmVyO1xufShTdWJzY3JpcHRpb24pKTtcbmV4cG9ydCB7IFN1YnNjcmliZXIgfTtcbnZhciBTYWZlU3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTYWZlU3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTYWZlU3Vic2NyaWJlcihfcGFyZW50U3Vic2NyaWJlciwgb2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5fcGFyZW50U3Vic2NyaWJlciA9IF9wYXJlbnRTdWJzY3JpYmVyO1xuICAgICAgICB2YXIgbmV4dDtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBfdGhpcztcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICAgICAgICBuZXh0ID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgICAgICAgIG5leHQgPSBvYnNlcnZlck9yTmV4dC5uZXh0O1xuICAgICAgICAgICAgZXJyb3IgPSBvYnNlcnZlck9yTmV4dC5lcnJvcjtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gb2JzZXJ2ZXJPck5leHQuY29tcGxldGU7XG4gICAgICAgICAgICBpZiAob2JzZXJ2ZXJPck5leHQgIT09IGVtcHR5T2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShvYnNlcnZlck9yTmV4dCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dC51bnN1YnNjcmliZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkKGNvbnRleHQudW5zdWJzY3JpYmUuYmluZChjb250ZXh0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQudW5zdWJzY3JpYmUgPSBfdGhpcy51bnN1YnNjcmliZS5iaW5kKF90aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIF90aGlzLl9uZXh0ID0gbmV4dDtcbiAgICAgICAgX3RoaXMuX2Vycm9yID0gZXJyb3I7XG4gICAgICAgIF90aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFNhZmVTdWJzY3JpYmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQgJiYgdGhpcy5fbmV4dCkge1xuICAgICAgICAgICAgdmFyIF9wYXJlbnRTdWJzY3JpYmVyID0gdGhpcy5fcGFyZW50U3Vic2NyaWJlcjtcbiAgICAgICAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX190cnlPclVuc3ViKHRoaXMuX25leHQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX190cnlPclNldEVycm9yKF9wYXJlbnRTdWJzY3JpYmVyLCB0aGlzLl9uZXh0LCB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNhZmVTdWJzY3JpYmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgdmFyIF9wYXJlbnRTdWJzY3JpYmVyID0gdGhpcy5fcGFyZW50U3Vic2NyaWJlcjtcbiAgICAgICAgICAgIHZhciB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nID0gY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmc7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9lcnJvciwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3RyeU9yU2V0RXJyb3IoX3BhcmVudFN1YnNjcmliZXIsIHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVmFsdWUgPSBlcnI7XG4gICAgICAgICAgICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTYWZlU3Vic2NyaWJlci5wcm90b3R5cGUuY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHZhciBfcGFyZW50U3Vic2NyaWJlciA9IHRoaXMuX3BhcmVudFN1YnNjcmliZXI7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgd3JhcHBlZENvbXBsZXRlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX2NvbXBsZXRlLmNhbGwoX3RoaXMuX2NvbnRleHQpOyB9O1xuICAgICAgICAgICAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgd3JhcHBlZENvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgU2FmZVN1YnNjcmliZXIucHJvdG90eXBlLl9fdHJ5T3JVbnN1YiA9IGZ1bmN0aW9uIChmbiwgdmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTYWZlU3Vic2NyaWJlci5wcm90b3R5cGUuX190cnlPclNldEVycm9yID0gZnVuY3Rpb24gKHBhcmVudCwgZm4sIHZhbHVlKSB7XG4gICAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYmFkIGNhbGwnKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm4uY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICAgICAgICAgIHBhcmVudC5zeW5jRXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgU2FmZVN1YnNjcmliZXIucHJvdG90eXBlLl91bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9wYXJlbnRTdWJzY3JpYmVyID0gdGhpcy5fcGFyZW50U3Vic2NyaWJlcjtcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3BhcmVudFN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICBfcGFyZW50U3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIFNhZmVTdWJzY3JpYmVyO1xufShTdWJzY3JpYmVyKSk7XG5leHBvcnQgeyBTYWZlU3Vic2NyaWJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaWJlci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX1N1YnNjcmliZXIgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGNhblJlcG9ydEVycm9yKG9ic2VydmVyKSB7XG4gICAgd2hpbGUgKG9ic2VydmVyKSB7XG4gICAgICAgIHZhciBfYSA9IG9ic2VydmVyLCBjbG9zZWRfMSA9IF9hLmNsb3NlZCwgZGVzdGluYXRpb24gPSBfYS5kZXN0aW5hdGlvbiwgaXNTdG9wcGVkID0gX2EuaXNTdG9wcGVkO1xuICAgICAgICBpZiAoY2xvc2VkXzEgfHwgaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24gaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICBvYnNlcnZlciA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FuUmVwb3J0RXJyb3IuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9TdWJzY3JpYmVyLF9zeW1ib2xfcnhTdWJzY3JpYmVyLF9PYnNlcnZlciBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyByeFN1YnNjcmliZXIgYXMgcnhTdWJzY3JpYmVyU3ltYm9sIH0gZnJvbSAnLi4vc3ltYm9sL3J4U3Vic2NyaWJlcic7XG5pbXBvcnQgeyBlbXB0eSBhcyBlbXB0eU9ic2VydmVyIH0gZnJvbSAnLi4vT2JzZXJ2ZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHRvU3Vic2NyaWJlcihuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgaWYgKG5leHRPck9ic2VydmVyKSB7XG4gICAgICAgIGlmIChuZXh0T3JPYnNlcnZlciBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0T3JPYnNlcnZlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dE9yT2JzZXJ2ZXJbcnhTdWJzY3JpYmVyU3ltYm9sXSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHRPck9ic2VydmVyW3J4U3Vic2NyaWJlclN5bWJvbF0oKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW5leHRPck9ic2VydmVyICYmICFlcnJvciAmJiAhY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpYmVyKGVtcHR5T2JzZXJ2ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFN1YnNjcmliZXIobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10b1N1YnNjcmliZXIuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgdmFyIG9ic2VydmFibGUgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnOyB9KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2YWJsZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgIFBVUkVfSU1QT1JUU19FTkQgKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eSh4KSB7XG4gICAgcmV0dXJuIHg7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pZGVudGl0eS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX2lkZW50aXR5IFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gcGlwZSgpIHtcbiAgICB2YXIgZm5zID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgZm5zW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KGZucyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheShmbnMpIHtcbiAgICBpZiAoZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmbnNbMF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gZm5zLnJlZHVjZShmdW5jdGlvbiAocHJldiwgZm4pIHsgcmV0dXJuIGZuKHByZXYpOyB9LCBpbnB1dCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGUuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF91dGlsX2NhblJlcG9ydEVycm9yLF91dGlsX3RvU3Vic2NyaWJlcixfc3ltYm9sX29ic2VydmFibGUsX3V0aWxfcGlwZSxfY29uZmlnIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IGNhblJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2NhblJlcG9ydEVycm9yJztcbmltcG9ydCB7IHRvU3Vic2NyaWJlciB9IGZyb20gJy4vdXRpbC90b1N1YnNjcmliZXInO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgcGlwZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbC9waXBlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbnZhciBPYnNlcnZhYmxlID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE9ic2VydmFibGUoc3Vic2NyaWJlKSB7XG4gICAgICAgIHRoaXMuX2lzU2NhbGFyID0gZmFsc2U7XG4gICAgICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5saWZ0ID0gZnVuY3Rpb24gKG9wZXJhdG9yKSB7XG4gICAgICAgIHZhciBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgICAgICBvYnNlcnZhYmxlLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgdmFyIG9wZXJhdG9yID0gdGhpcy5vcGVyYXRvcjtcbiAgICAgICAgdmFyIHNpbmsgPSB0b1N1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgICAgICAgc2luay5hZGQob3BlcmF0b3IuY2FsbChzaW5rLCB0aGlzLnNvdXJjZSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2luay5hZGQodGhpcy5zb3VyY2UgfHwgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nICYmICFzaW5rLnN5bmNFcnJvclRocm93YWJsZSkgP1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZShzaW5rKSA6XG4gICAgICAgICAgICAgICAgdGhpcy5fdHJ5U3Vic2NyaWJlKHNpbmspKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKHNpbmsuc3luY0Vycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IHNpbmsuc3luY0Vycm9yVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5rO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuX3RyeVN1YnNjcmliZSA9IGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHNpbmspO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzaW5rLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHNpbmspKSB7XG4gICAgICAgICAgICAgICAgc2luay5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAobmV4dCwgcHJvbWlzZUN0b3IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG4gICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IF90aGlzLnN1YnNjcmliZShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCByZWplY3QsIHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgICAgIHJldHVybiBzb3VyY2UgJiYgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9O1xuICAgIE9ic2VydmFibGUucHJvdG90eXBlW1N5bWJvbF9vYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3BlcmF0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgb3BlcmF0aW9uc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBpcGVGcm9tQXJyYXkob3BlcmF0aW9ucykodGhpcyk7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZS50b1Byb21pc2UgPSBmdW5jdGlvbiAocHJvbWlzZUN0b3IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG4gICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgX3RoaXMuc3Vic2NyaWJlKGZ1bmN0aW9uICh4KSB7IHJldHVybiB2YWx1ZSA9IHg7IH0sIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9LCBmdW5jdGlvbiAoKSB7IHJldHVybiByZXNvbHZlKHZhbHVlKTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZS5jcmVhdGUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmUpO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmFibGU7XG59KCkpO1xuZXhwb3J0IHsgT2JzZXJ2YWJsZSB9O1xuZnVuY3Rpb24gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpIHtcbiAgICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgICAgIHByb21pc2VDdG9yID0gY29uZmlnLlByb21pc2UgfHwgUHJvbWlzZTtcbiAgICB9XG4gICAgaWYgKCFwcm9taXNlQ3Rvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIFByb21pc2UgaW1wbCBmb3VuZCcpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZUN0b3I7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYnNlcnZhYmxlLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAgUFVSRV9JTVBPUlRTX0VORCAqL1xudmFyIE9iamVjdFVuc3Vic2NyaWJlZEVycm9ySW1wbCA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBPYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGwoKSB7XG4gICAgICAgIEVycm9yLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9ICdvYmplY3QgdW5zdWJzY3JpYmVkJztcbiAgICAgICAgdGhpcy5uYW1lID0gJ09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIE9iamVjdFVuc3Vic2NyaWJlZEVycm9ySW1wbC5wcm90b3R5cGUgPSAvKkBfX1BVUkVfXyovIE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICByZXR1cm4gT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JJbXBsO1xufSkoKTtcbmV4cG9ydCB2YXIgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgPSBPYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYmplY3RVbnN1YnNjcmliZWRFcnJvci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgdHNsaWIsX1N1YnNjcmlwdGlvbiBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xudmFyIFN1YmplY3RTdWJzY3JpcHRpb24gPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoU3ViamVjdFN1YnNjcmlwdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdWJqZWN0U3Vic2NyaXB0aW9uKHN1YmplY3QsIHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc3ViamVjdCA9IHN1YmplY3Q7XG4gICAgICAgIF90aGlzLnN1YnNjcmliZXIgPSBzdWJzY3JpYmVyO1xuICAgICAgICBfdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBTdWJqZWN0U3Vic2NyaXB0aW9uLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgICB2YXIgc3ViamVjdCA9IHRoaXMuc3ViamVjdDtcbiAgICAgICAgdmFyIG9ic2VydmVycyA9IHN1YmplY3Qub2JzZXJ2ZXJzO1xuICAgICAgICB0aGlzLnN1YmplY3QgPSBudWxsO1xuICAgICAgICBpZiAoIW9ic2VydmVycyB8fCBvYnNlcnZlcnMubGVuZ3RoID09PSAwIHx8IHN1YmplY3QuaXNTdG9wcGVkIHx8IHN1YmplY3QuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1YnNjcmliZXJJbmRleCA9IG9ic2VydmVycy5pbmRleE9mKHRoaXMuc3Vic2NyaWJlcik7XG4gICAgICAgIGlmIChzdWJzY3JpYmVySW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBvYnNlcnZlcnMuc3BsaWNlKHN1YnNjcmliZXJJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBTdWJqZWN0U3Vic2NyaXB0aW9uO1xufShTdWJzY3JpcHRpb24pKTtcbmV4cG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YmplY3RTdWJzY3JpcHRpb24uanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIHRzbGliLF9PYnNlcnZhYmxlLF9TdWJzY3JpYmVyLF9TdWJzY3JpcHRpb24sX3V0aWxfT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IsX1N1YmplY3RTdWJzY3JpcHRpb24sX2ludGVybmFsX3N5bWJvbF9yeFN1YnNjcmliZXIgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvcnhTdWJzY3JpYmVyJztcbnZhciBTdWJqZWN0U3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTdWJqZWN0U3Vic2NyaWJlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdWJqZWN0U3Vic2NyaWJlcihkZXN0aW5hdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gU3ViamVjdFN1YnNjcmliZXI7XG59KFN1YnNjcmliZXIpKTtcbmV4cG9ydCB7IFN1YmplY3RTdWJzY3JpYmVyIH07XG52YXIgU3ViamVjdCA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTdWJqZWN0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFN1YmplY3QoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9ic2VydmVycyA9IFtdO1xuICAgICAgICBfdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIF90aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIF90aGlzLnRocm93bkVycm9yID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBTdWJqZWN0LnByb3RvdHlwZVtyeFN1YnNjcmliZXJTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpYmVyKHRoaXMpO1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUubGlmdCA9IGZ1bmN0aW9uIChvcGVyYXRvcikge1xuICAgICAgICB2YXIgc3ViamVjdCA9IG5ldyBBbm9ueW1vdXNTdWJqZWN0KHRoaXMsIHRoaXMpO1xuICAgICAgICBzdWJqZWN0Lm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgIH07XG4gICAgU3ViamVjdC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZlcnMgPSB0aGlzLm9ic2VydmVycztcbiAgICAgICAgICAgIHZhciBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb3B5W2ldLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50aHJvd25FcnJvciA9IGVycjtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICB2YXIgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnM7XG4gICAgICAgIHZhciBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgICAgICB2YXIgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjb3B5W2ldLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdmFyIG9ic2VydmVycyA9IHRoaXMub2JzZXJ2ZXJzO1xuICAgICAgICB2YXIgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICAgICAgdmFyIGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY29weVtpXS5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLl90cnlTdWJzY3JpYmUgPSBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuX3RyeVN1YnNjcmliZS5jYWxsKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdWJqZWN0LnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN1YmplY3QucHJvdG90eXBlLmFzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH07XG4gICAgU3ViamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3QoZGVzdGluYXRpb24sIHNvdXJjZSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3ViamVjdDtcbn0oT2JzZXJ2YWJsZSkpO1xuZXhwb3J0IHsgU3ViamVjdCB9O1xudmFyIEFub255bW91c1N1YmplY3QgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoQW5vbnltb3VzU3ViamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBbm9ueW1vdXNTdWJqZWN0KGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgX3RoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLm5leHQpIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBbm9ueW1vdXNTdWJqZWN0LnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFub255bW91c1N1YmplY3QucHJvdG90eXBlLmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgICAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24uY29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQW5vbnltb3VzU3ViamVjdC5wcm90b3R5cGUuX3N1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBBbm9ueW1vdXNTdWJqZWN0O1xufShTdWJqZWN0KSk7XG5leHBvcnQgeyBBbm9ueW1vdXNTdWJqZWN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJqZWN0LmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCB0c2xpYixfU3Vic2NyaXB0aW9uIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xudmFyIEFjdGlvbiA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhBY3Rpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQWN0aW9uKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICB9XG4gICAgQWN0aW9uLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBBY3Rpb247XG59KFN1YnNjcmlwdGlvbikpO1xuZXhwb3J0IHsgQWN0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BY3Rpb24uanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIHRzbGliLF9BY3Rpb24gUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbnZhciBBc3luY0FjdGlvbiA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhBc3luY0FjdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBc3luY0FjdGlvbihzY2hlZHVsZXIsIHdvcmspIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgc2NoZWR1bGVyLCB3b3JrKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICAgIF90aGlzLndvcmsgPSB3b3JrO1xuICAgICAgICBfdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQXN5bmNBY3Rpb24ucHJvdG90eXBlLnNjaGVkdWxlID0gZnVuY3Rpb24gKHN0YXRlLCBkZWxheSkge1xuICAgICAgICBpZiAoZGVsYXkgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmlkO1xuICAgICAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCB0aGlzLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgdGhpcy5pZCwgZGVsYXkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5yZXF1ZXN0QXN5bmNJZCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIsIGlkLCBkZWxheSkge1xuICAgICAgICBpZiAoZGVsYXkgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXRJbnRlcnZhbChzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIHRoaXMpLCBkZWxheSk7XG4gICAgfTtcbiAgICBBc3luY0FjdGlvbi5wcm90b3R5cGUucmVjeWNsZUFzeW5jSWQgPSBmdW5jdGlvbiAoc2NoZWR1bGVyLCBpZCwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgdGhpcy5kZWxheSA9PT0gZGVsYXkgJiYgdGhpcy5wZW5kaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaWQpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgQXN5bmNBY3Rpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignZXhlY3V0aW5nIGEgY2FuY2VsbGVkIGFjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGVuZGluZyA9PT0gZmFsc2UgJiYgdGhpcy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZCh0aGlzLnNjaGVkdWxlciwgdGhpcy5pZCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFzeW5jQWN0aW9uLnByb3RvdHlwZS5fZXhlY3V0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgdmFyIGVycm9yZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVycm9yVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLndvcmsoc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGVycm9yVmFsdWUgPSAhIWUgJiYgZSB8fCBuZXcgRXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHJldHVybiBlcnJvclZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBc3luY0FjdGlvbi5wcm90b3R5cGUuX3Vuc3Vic2NyaWJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLmlkO1xuICAgICAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgICAgIHZhciBhY3Rpb25zID0gc2NoZWR1bGVyLmFjdGlvbnM7XG4gICAgICAgIHZhciBpbmRleCA9IGFjdGlvbnMuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgdGhpcy53b3JrID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGFjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWxheSA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gQXN5bmNBY3Rpb247XG59KEFjdGlvbikpO1xuZXhwb3J0IHsgQXN5bmNBY3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzeW5jQWN0aW9uLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCB0c2xpYixfQXN5bmNBY3Rpb24gUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG52YXIgUXVldWVBY3Rpb24gPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUXVldWVBY3Rpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUXVldWVBY3Rpb24oc2NoZWR1bGVyLCB3b3JrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHNjaGVkdWxlciwgd29yaykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICBfdGhpcy53b3JrID0gd29yaztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBRdWV1ZUFjdGlvbi5wcm90b3R5cGUuc2NoZWR1bGUgPSBmdW5jdGlvbiAoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmIChkZWxheSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkZWxheSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuc2NoZWR1bGUuY2FsbCh0aGlzLCBzdGF0ZSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLnNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBRdWV1ZUFjdGlvbi5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIChkZWxheSA+IDAgfHwgdGhpcy5jbG9zZWQpID9cbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMsIHN0YXRlLCBkZWxheSkgOlxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIH07XG4gICAgUXVldWVBY3Rpb24ucHJvdG90eXBlLnJlcXVlc3RBc3luY0lkID0gZnVuY3Rpb24gKHNjaGVkdWxlciwgaWQsIGRlbGF5KSB7XG4gICAgICAgIGlmIChkZWxheSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkZWxheSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLnJlcXVlc3RBc3luY0lkLmNhbGwodGhpcywgc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gICAgfTtcbiAgICByZXR1cm4gUXVldWVBY3Rpb247XG59KEFzeW5jQWN0aW9uKSk7XG5leHBvcnQgeyBRdWV1ZUFjdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UXVldWVBY3Rpb24uanMubWFwXG4iLCJ2YXIgU2NoZWR1bGVyID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNjaGVkdWxlcihTY2hlZHVsZXJBY3Rpb24sIG5vdykge1xuICAgICAgICBpZiAobm93ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIG5vdyA9IFNjaGVkdWxlci5ub3c7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5TY2hlZHVsZXJBY3Rpb24gPSBTY2hlZHVsZXJBY3Rpb247XG4gICAgICAgIHRoaXMubm93ID0gbm93O1xuICAgIH1cbiAgICBTY2hlZHVsZXIucHJvdG90eXBlLnNjaGVkdWxlID0gZnVuY3Rpb24gKHdvcmssIGRlbGF5LCBzdGF0ZSkge1xuICAgICAgICBpZiAoZGVsYXkgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5TY2hlZHVsZXJBY3Rpb24odGhpcywgd29yaykuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9O1xuICAgIFNjaGVkdWxlci5ub3cgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBEYXRlLm5vdygpOyB9O1xuICAgIHJldHVybiBTY2hlZHVsZXI7XG59KCkpO1xuZXhwb3J0IHsgU2NoZWR1bGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TY2hlZHVsZXIuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIHRzbGliLF9TY2hlZHVsZXIgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG52YXIgQXN5bmNTY2hlZHVsZXIgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoQXN5bmNTY2hlZHVsZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXN5bmNTY2hlZHVsZXIoU2NoZWR1bGVyQWN0aW9uLCBub3cpIHtcbiAgICAgICAgaWYgKG5vdyA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBub3cgPSBTY2hlZHVsZXIubm93O1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIFNjaGVkdWxlckFjdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICYmIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICE9PSBfdGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZS5ub3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBub3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuYWN0aW9ucyA9IFtdO1xuICAgICAgICBfdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFzeW5jU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uICh3b3JrLCBkZWxheSwgc3RhdGUpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgJiYgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZS5zY2hlZHVsZSh3b3JrLCBkZWxheSwgc3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuc2NoZWR1bGUuY2FsbCh0aGlzLCB3b3JrLCBkZWxheSwgc3RhdGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBBc3luY1NjaGVkdWxlci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHZhciBhY3Rpb25zID0gdGhpcy5hY3Rpb25zO1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKTtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEFzeW5jU2NoZWR1bGVyO1xufShTY2hlZHVsZXIpKTtcbmV4cG9ydCB7IEFzeW5jU2NoZWR1bGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc3luY1NjaGVkdWxlci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgdHNsaWIsX0FzeW5jU2NoZWR1bGVyIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xudmFyIFF1ZXVlU2NoZWR1bGVyID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHRzbGliXzEuX19leHRlbmRzKFF1ZXVlU2NoZWR1bGVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFF1ZXVlU2NoZWR1bGVyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBRdWV1ZVNjaGVkdWxlcjtcbn0oQXN5bmNTY2hlZHVsZXIpKTtcbmV4cG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1RdWV1ZVNjaGVkdWxlci5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX1F1ZXVlQWN0aW9uLF9RdWV1ZVNjaGVkdWxlciBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBRdWV1ZUFjdGlvbiB9IGZyb20gJy4vUXVldWVBY3Rpb24nO1xuaW1wb3J0IHsgUXVldWVTY2hlZHVsZXIgfSBmcm9tICcuL1F1ZXVlU2NoZWR1bGVyJztcbmV4cG9ydCB2YXIgcXVldWVTY2hlZHVsZXIgPSAvKkBfX1BVUkVfXyovIG5ldyBRdWV1ZVNjaGVkdWxlcihRdWV1ZUFjdGlvbik7XG5leHBvcnQgdmFyIHF1ZXVlID0gcXVldWVTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xdWV1ZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX09ic2VydmFibGUgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuZXhwb3J0IHZhciBFTVBUWSA9IC8qQF9fUFVSRV9fKi8gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHsgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTsgfSk7XG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIHNjaGVkdWxlciA/IGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcikgOiBFTVBUWTtcbn1cbmZ1bmN0aW9uIGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikgeyByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTsgfSk7IH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW1wdHkuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgZnVuY3Rpb24gaXNTY2hlZHVsZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnNjaGVkdWxlID09PSAnZnVuY3Rpb24nO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNTY2hlZHVsZXIuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgdmFyIHN1YnNjcmliZVRvQXJyYXkgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdWJzY3JpYmVUb0FycmF5LmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCBfT2JzZXJ2YWJsZSxfU3Vic2NyaXB0aW9uIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVBcnJheShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5wdXRbaSsrXSk7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgc3ViLmFkZCh0aGlzLnNjaGVkdWxlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZUFycmF5LmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCBfT2JzZXJ2YWJsZSxfdXRpbF9zdWJzY3JpYmVUb0FycmF5LF9zY2hlZHVsZWRfc2NoZWR1bGVBcnJheSBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb0FycmF5JztcbmltcG9ydCB7IHNjaGVkdWxlQXJyYXkgfSBmcm9tICcuLi9zY2hlZHVsZWQvc2NoZWR1bGVBcnJheSc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5KGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlVG9BcnJheShpbnB1dCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXJyYXkoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbUFycmF5LmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCBfdXRpbF9pc1NjaGVkdWxlcixfZnJvbUFycmF5LF9zY2hlZHVsZWRfc2NoZWR1bGVBcnJheSBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgc2NoZWR1bGVBcnJheSB9IGZyb20gJy4uL3NjaGVkdWxlZC9zY2hlZHVsZUFycmF5JztcbmV4cG9ydCBmdW5jdGlvbiBvZigpIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIHNjaGVkdWxlciA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICBpZiAoaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSkge1xuICAgICAgICBhcmdzLnBvcCgpO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVBcnJheShhcmdzLCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZyb21BcnJheShhcmdzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vZi5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX09ic2VydmFibGUgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3IsIHNjaGVkdWxlcikge1xuICAgIGlmICghc2NoZWR1bGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikgeyByZXR1cm4gc3Vic2NyaWJlci5lcnJvcihlcnJvcik7IH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7IHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHsgZXJyb3I6IGVycm9yLCBzdWJzY3JpYmVyOiBzdWJzY3JpYmVyIH0pOyB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBkaXNwYXRjaChfYSkge1xuICAgIHZhciBlcnJvciA9IF9hLmVycm9yLCBzdWJzY3JpYmVyID0gX2Euc3Vic2NyaWJlcjtcbiAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRocm93RXJyb3IuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9vYnNlcnZhYmxlX2VtcHR5LF9vYnNlcnZhYmxlX29mLF9vYnNlcnZhYmxlX3Rocm93RXJyb3IgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgb2YgfSBmcm9tICcuL29ic2VydmFibGUvb2YnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcbmV4cG9ydCB2YXIgTm90aWZpY2F0aW9uS2luZDtcbi8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChOb3RpZmljYXRpb25LaW5kKSB7XG4gICAgTm90aWZpY2F0aW9uS2luZFtcIk5FWFRcIl0gPSBcIk5cIjtcbiAgICBOb3RpZmljYXRpb25LaW5kW1wiRVJST1JcIl0gPSBcIkVcIjtcbiAgICBOb3RpZmljYXRpb25LaW5kW1wiQ09NUExFVEVcIl0gPSBcIkNcIjtcbn0pKE5vdGlmaWNhdGlvbktpbmQgfHwgKE5vdGlmaWNhdGlvbktpbmQgPSB7fSkpO1xudmFyIE5vdGlmaWNhdGlvbiA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOb3RpZmljYXRpb24oa2luZCwgdmFsdWUsIGVycm9yKSB7XG4gICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLmhhc1ZhbHVlID0ga2luZCA9PT0gJ04nO1xuICAgIH1cbiAgICBOb3RpZmljYXRpb24ucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuZXJyb3IgJiYgb2JzZXJ2ZXIuZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICAgICAgICBjYXNlICdDJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuY29tcGxldGUgJiYgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm90aWZpY2F0aW9uLnByb3RvdHlwZS5kbyA9IGZ1bmN0aW9uIChuZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgdmFyIGtpbmQgPSB0aGlzLmtpbmQ7XG4gICAgICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQgJiYgbmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvciAmJiBlcnJvcih0aGlzLmVycm9yKTtcbiAgICAgICAgICAgIGNhc2UgJ0MnOlxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wbGV0ZSAmJiBjb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb3RpZmljYXRpb24ucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uIChuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIGlmIChuZXh0T3JPYnNlcnZlciAmJiB0eXBlb2YgbmV4dE9yT2JzZXJ2ZXIubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZShuZXh0T3JPYnNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kbyhuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm90aWZpY2F0aW9uLnByb3RvdHlwZS50b09ic2VydmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBraW5kID0gdGhpcy5raW5kO1xuICAgICAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgICAgICAgIHJldHVybiBvZih0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgICAgICAgY2FzZSAnQyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIG5vdGlmaWNhdGlvbiBraW5kIHZhbHVlJyk7XG4gICAgfTtcbiAgICBOb3RpZmljYXRpb24uY3JlYXRlTmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5vdGlmaWNhdGlvbi51bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjtcbiAgICB9O1xuICAgIE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsIGVycik7XG4gICAgfTtcbiAgICBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBOb3RpZmljYXRpb24uY29tcGxldGVOb3RpZmljYXRpb247XG4gICAgfTtcbiAgICBOb3RpZmljYXRpb24uY29tcGxldGVOb3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKCdDJyk7XG4gICAgTm90aWZpY2F0aW9uLnVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uID0gbmV3IE5vdGlmaWNhdGlvbignTicsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbjtcbn0oKSk7XG5leHBvcnQgeyBOb3RpZmljYXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vdGlmaWNhdGlvbi5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgdHNsaWIsX1N1YnNjcmliZXIsX05vdGlmaWNhdGlvbiBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlT24oc2NoZWR1bGVyLCBkZWxheSkge1xuICAgIGlmIChkZWxheSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGRlbGF5ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9ic2VydmVPbk9wZXJhdG9yRnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgT2JzZXJ2ZU9uT3BlcmF0b3Ioc2NoZWR1bGVyLCBkZWxheSkpO1xuICAgIH07XG59XG52YXIgT2JzZXJ2ZU9uT3BlcmF0b3IgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT2JzZXJ2ZU9uT3BlcmF0b3Ioc2NoZWR1bGVyLCBkZWxheSkge1xuICAgICAgICBpZiAoZGVsYXkgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgZGVsYXkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgfVxuICAgIE9ic2VydmVPbk9wZXJhdG9yLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKHN1YnNjcmliZXIsIHNvdXJjZSkge1xuICAgICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgT2JzZXJ2ZU9uU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnNjaGVkdWxlciwgdGhpcy5kZWxheSkpO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmVPbk9wZXJhdG9yO1xufSgpKTtcbmV4cG9ydCB7IE9ic2VydmVPbk9wZXJhdG9yIH07XG52YXIgT2JzZXJ2ZU9uU3Vic2NyaWJlciA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhPYnNlcnZlT25TdWJzY3JpYmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9ic2VydmVPblN1YnNjcmliZXIoZGVzdGluYXRpb24sIHNjaGVkdWxlciwgZGVsYXkpIHtcbiAgICAgICAgaWYgKGRlbGF5ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGRlbGF5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICBfdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE9ic2VydmVPblN1YnNjcmliZXIuZGlzcGF0Y2ggPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgIHZhciBub3RpZmljYXRpb24gPSBhcmcubm90aWZpY2F0aW9uLCBkZXN0aW5hdGlvbiA9IGFyZy5kZXN0aW5hdGlvbjtcbiAgICAgICAgbm90aWZpY2F0aW9uLm9ic2VydmUoZGVzdGluYXRpb24pO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgICBPYnNlcnZlT25TdWJzY3JpYmVyLnByb3RvdHlwZS5zY2hlZHVsZU1lc3NhZ2UgPSBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgICAgIGRlc3RpbmF0aW9uLmFkZCh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShPYnNlcnZlT25TdWJzY3JpYmVyLmRpc3BhdGNoLCB0aGlzLmRlbGF5LCBuZXcgT2JzZXJ2ZU9uTWVzc2FnZShub3RpZmljYXRpb24sIHRoaXMuZGVzdGluYXRpb24pKSk7XG4gICAgfTtcbiAgICBPYnNlcnZlT25TdWJzY3JpYmVyLnByb3RvdHlwZS5fbmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlTmV4dCh2YWx1ZSkpO1xuICAgIH07XG4gICAgT2JzZXJ2ZU9uU3Vic2NyaWJlci5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSk7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICAgIE9ic2VydmVPblN1YnNjcmliZXIucHJvdG90eXBlLl9jb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU1lc3NhZ2UoTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCkpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gT2JzZXJ2ZU9uU3Vic2NyaWJlcjtcbn0oU3Vic2NyaWJlcikpO1xuZXhwb3J0IHsgT2JzZXJ2ZU9uU3Vic2NyaWJlciB9O1xudmFyIE9ic2VydmVPbk1lc3NhZ2UgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT2JzZXJ2ZU9uTWVzc2FnZShub3RpZmljYXRpb24sIGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uID0gbm90aWZpY2F0aW9uO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgfVxuICAgIHJldHVybiBPYnNlcnZlT25NZXNzYWdlO1xufSgpKTtcbmV4cG9ydCB7IE9ic2VydmVPbk1lc3NhZ2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9ic2VydmVPbi5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgdHNsaWIsX1N1YmplY3QsX3NjaGVkdWxlcl9xdWV1ZSxfU3Vic2NyaXB0aW9uLF9vcGVyYXRvcnNfb2JzZXJ2ZU9uLF91dGlsX09iamVjdFVuc3Vic2NyaWJlZEVycm9yLF9TdWJqZWN0U3Vic2NyaXB0aW9uIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IHF1ZXVlIH0gZnJvbSAnLi9zY2hlZHVsZXIvcXVldWUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2ZU9uU3Vic2NyaWJlciB9IGZyb20gJy4vb3BlcmF0b3JzL29ic2VydmVPbic7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbnZhciBSZXBsYXlTdWJqZWN0ID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHRzbGliXzEuX19leHRlbmRzKFJlcGxheVN1YmplY3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmVwbGF5U3ViamVjdChidWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzY2hlZHVsZXIpIHtcbiAgICAgICAgaWYgKGJ1ZmZlclNpemUgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgYnVmZmVyU2l6ZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93VGltZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB3aW5kb3dUaW1lID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgX3RoaXMuX2V2ZW50cyA9IFtdO1xuICAgICAgICBfdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gZmFsc2U7XG4gICAgICAgIF90aGlzLl9idWZmZXJTaXplID0gYnVmZmVyU2l6ZSA8IDEgPyAxIDogYnVmZmVyU2l6ZTtcbiAgICAgICAgX3RoaXMuX3dpbmRvd1RpbWUgPSB3aW5kb3dUaW1lIDwgMSA/IDEgOiB3aW5kb3dUaW1lO1xuICAgICAgICBpZiAod2luZG93VGltZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICAgICAgICBfdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLm5leHQgPSBfdGhpcy5uZXh0SW5maW5pdGVUaW1lV2luZG93O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMubmV4dCA9IF90aGlzLm5leHRUaW1lV2luZG93O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgUmVwbGF5U3ViamVjdC5wcm90b3R5cGUubmV4dEluZmluaXRlVGltZVdpbmRvdyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgX2V2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgICAgX2V2ZW50cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgaWYgKF9ldmVudHMubGVuZ3RoID4gdGhpcy5fYnVmZmVyU2l6ZSkge1xuICAgICAgICAgICAgX2V2ZW50cy5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUubmV4dC5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9O1xuICAgIFJlcGxheVN1YmplY3QucHJvdG90eXBlLm5leHRUaW1lV2luZG93ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50cy5wdXNoKG5ldyBSZXBsYXlFdmVudCh0aGlzLl9nZXROb3coKSwgdmFsdWUpKTtcbiAgICAgICAgdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcywgdmFsdWUpO1xuICAgIH07XG4gICAgUmVwbGF5U3ViamVjdC5wcm90b3R5cGUuX3N1YnNjcmliZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBfaW5maW5pdGVUaW1lV2luZG93ID0gdGhpcy5faW5maW5pdGVUaW1lV2luZG93O1xuICAgICAgICB2YXIgX2V2ZW50cyA9IF9pbmZpbml0ZVRpbWVXaW5kb3cgPyB0aGlzLl9ldmVudHMgOiB0aGlzLl90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpO1xuICAgICAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgICAgIHZhciBsZW4gPSBfZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCB8fCB0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlciA9IG5ldyBPYnNlcnZlT25TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHNjaGVkdWxlcikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfaW5maW5pdGVUaW1lV2luZG93KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChfZXZlbnRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KF9ldmVudHNbaV0udmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9O1xuICAgIFJlcGxheVN1YmplY3QucHJvdG90eXBlLl9nZXROb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5zY2hlZHVsZXIgfHwgcXVldWUpLm5vdygpO1xuICAgIH07XG4gICAgUmVwbGF5U3ViamVjdC5wcm90b3R5cGUuX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm93ID0gdGhpcy5fZ2V0Tm93KCk7XG4gICAgICAgIHZhciBfYnVmZmVyU2l6ZSA9IHRoaXMuX2J1ZmZlclNpemU7XG4gICAgICAgIHZhciBfd2luZG93VGltZSA9IHRoaXMuX3dpbmRvd1RpbWU7XG4gICAgICAgIHZhciBfZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgICB2YXIgZXZlbnRzQ291bnQgPSBfZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIHNwbGljZUNvdW50ID0gMDtcbiAgICAgICAgd2hpbGUgKHNwbGljZUNvdW50IDwgZXZlbnRzQ291bnQpIHtcbiAgICAgICAgICAgIGlmICgobm93IC0gX2V2ZW50c1tzcGxpY2VDb3VudF0udGltZSkgPCBfd2luZG93VGltZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BsaWNlQ291bnQrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnRzQ291bnQgPiBfYnVmZmVyU2l6ZSkge1xuICAgICAgICAgICAgc3BsaWNlQ291bnQgPSBNYXRoLm1heChzcGxpY2VDb3VudCwgZXZlbnRzQ291bnQgLSBfYnVmZmVyU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwbGljZUNvdW50ID4gMCkge1xuICAgICAgICAgICAgX2V2ZW50cy5zcGxpY2UoMCwgc3BsaWNlQ291bnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZXZlbnRzO1xuICAgIH07XG4gICAgcmV0dXJuIFJlcGxheVN1YmplY3Q7XG59KFN1YmplY3QpKTtcbmV4cG9ydCB7IFJlcGxheVN1YmplY3QgfTtcbnZhciBSZXBsYXlFdmVudCA9IC8qQF9fUFVSRV9fKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZXBsYXlFdmVudCh0aW1lLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLnRpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBSZXBsYXlFdmVudDtcbn0oKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZXBsYXlTdWJqZWN0LmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCAgUFVSRV9JTVBPUlRTX0VORCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IH1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIHRzbGliLF9TdWJzY3JpYmVyIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKHByb2plY3QsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbWFwT3BlcmF0aW9uKHNvdXJjZSkge1xuICAgICAgICBpZiAodHlwZW9mIHByb2plY3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IGlzIG5vdCBhIGZ1bmN0aW9uLiBBcmUgeW91IGxvb2tpbmcgZm9yIGBtYXBUbygpYD8nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IE1hcE9wZXJhdG9yKHByb2plY3QsIHRoaXNBcmcpKTtcbiAgICB9O1xufVxudmFyIE1hcE9wZXJhdG9yID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hcE9wZXJhdG9yKHByb2plY3QsIHRoaXNBcmcpIHtcbiAgICAgICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgdGhpcy50aGlzQXJnID0gdGhpc0FyZztcbiAgICB9XG4gICAgTWFwT3BlcmF0b3IucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoc3Vic2NyaWJlciwgc291cmNlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNYXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJvamVjdCwgdGhpcy50aGlzQXJnKSk7XG4gICAgfTtcbiAgICByZXR1cm4gTWFwT3BlcmF0b3I7XG59KCkpO1xuZXhwb3J0IHsgTWFwT3BlcmF0b3IgfTtcbnZhciBNYXBTdWJzY3JpYmVyID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHRzbGliXzEuX19leHRlbmRzKE1hcFN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWFwU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgcHJvamVjdCwgdGhpc0FyZykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIF90aGlzLmNvdW50ID0gMDtcbiAgICAgICAgX3RoaXMudGhpc0FyZyA9IHRoaXNBcmcgfHwgX3RoaXM7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgTWFwU3Vic2NyaWJlci5wcm90b3R5cGUuX25leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMucHJvamVjdC5jYWxsKHRoaXMudGhpc0FyZywgdmFsdWUsIHRoaXMuY291bnQrKyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICAgIH07XG4gICAgcmV0dXJuIE1hcFN1YnNjcmliZXI7XG59KFN1YnNjcmliZXIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX2hvc3RSZXBvcnRFcnJvciBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL2hvc3RSZXBvcnRFcnJvcic7XG5leHBvcnQgdmFyIHN1YnNjcmliZVRvUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikgeyByZXR1cm4gc3Vic2NyaWJlci5lcnJvcihlcnIpOyB9KVxuICAgICAgICAgICAgLnRoZW4obnVsbCwgaG9zdFJlcG9ydEVycm9yKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gICAgfTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdWJzY3JpYmVUb1Byb21pc2UuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sSXRlcmF0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgIVN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgICByZXR1cm4gJ0BAaXRlcmF0b3InO1xuICAgIH1cbiAgICByZXR1cm4gU3ltYm9sLml0ZXJhdG9yO1xufVxuZXhwb3J0IHZhciBpdGVyYXRvciA9IC8qQF9fUFVSRV9fKi8gZ2V0U3ltYm9sSXRlcmF0b3IoKTtcbmV4cG9ydCB2YXIgJCRpdGVyYXRvciA9IGl0ZXJhdG9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXRlcmF0b3IuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9zeW1ib2xfaXRlcmF0b3IgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmV4cG9ydCB2YXIgc3Vic2NyaWJlVG9JdGVyYWJsZSA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZVtTeW1ib2xfaXRlcmF0b3JdKCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdm9pZCAwO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmRvbmUpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlcmF0b3IucmV0dXJuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgICB9O1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1YnNjcmliZVRvSXRlcmFibGUuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9zeW1ib2xfb2JzZXJ2YWJsZSBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuZXhwb3J0IHZhciBzdWJzY3JpYmVUb09ic2VydmFibGUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBvYnMgPSBvYmpbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JzLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvdmlkZWQgb2JqZWN0IGRvZXMgbm90IGNvcnJlY3RseSBpbXBsZW1lbnQgU3ltYm9sLm9ic2VydmFibGUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYnMuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdWJzY3JpYmVUb09ic2VydmFibGUuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgdmFyIGlzQXJyYXlMaWtlID0gKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICYmIHR5cGVvZiB4Lmxlbmd0aCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHggIT09ICdmdW5jdGlvbic7IH0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNBcnJheUxpa2UuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUICBQVVJFX0lNUE9SVFNfRU5EICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzUHJvbWlzZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX3N1YnNjcmliZVRvQXJyYXksX3N1YnNjcmliZVRvUHJvbWlzZSxfc3Vic2NyaWJlVG9JdGVyYWJsZSxfc3Vic2NyaWJlVG9PYnNlcnZhYmxlLF9pc0FycmF5TGlrZSxfaXNQcm9taXNlLF9pc09iamVjdCxfc3ltYm9sX2l0ZXJhdG9yLF9zeW1ib2xfb2JzZXJ2YWJsZSBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi9zdWJzY3JpYmVUb0FycmF5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9Qcm9taXNlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4vaXNQcm9taXNlJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi9pc09iamVjdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmV4cG9ydCB2YXIgc3Vic2NyaWJlVG8gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgaWYgKCEhcmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpYmVUb09ic2VydmFibGUocmVzdWx0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNBcnJheUxpa2UocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaWJlVG9BcnJheShyZXN1bHQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1Byb21pc2UocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaWJlVG9Qcm9taXNlKHJlc3VsdCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCEhcmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX2l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gc3Vic2NyaWJlVG9JdGVyYWJsZShyZXN1bHQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXNPYmplY3QocmVzdWx0KSA/ICdhbiBpbnZhbGlkIG9iamVjdCcgOiBcIidcIiArIHJlc3VsdCArIFwiJ1wiO1xuICAgICAgICB2YXIgbXNnID0gXCJZb3UgcHJvdmlkZWQgXCIgKyB2YWx1ZSArIFwiIHdoZXJlIGEgc3RyZWFtIHdhcyBleHBlY3RlZC5cIlxuICAgICAgICAgICAgKyAnIFlvdSBjYW4gcHJvdmlkZSBhbiBPYnNlcnZhYmxlLCBQcm9taXNlLCBBcnJheSwgb3IgSXRlcmFibGUuJztcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdWJzY3JpYmVUby5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX09ic2VydmFibGUsX1N1YnNjcmlwdGlvbixfc3ltYm9sX29ic2VydmFibGUgUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVPYnNlcnZhYmxlKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9ic2VydmFibGUgPSBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgICAgICAgICAgIHN1Yi5hZGQob2JzZXJ2YWJsZS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7IHJldHVybiBzdWJzY3JpYmVyLm5leHQodmFsdWUpOyB9KSk7IH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5lcnJvcihlcnIpOyB9KSk7IH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpOyB9KSk7IH0sXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlT2JzZXJ2YWJsZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX09ic2VydmFibGUsX1N1YnNjcmlwdGlvbiBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgIHZhciBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkgeyByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpOyB9KSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN1YnNjcmliZXIuZXJyb3IoZXJyKTsgfSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlUHJvbWlzZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX09ic2VydmFibGUsX1N1YnNjcmlwdGlvbixfc3ltYm9sX2l0ZXJhdG9yIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJdGVyYWJsZSBjYW5ub3QgYmUgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgdmFyIGl0ZXJhdG9yO1xuICAgICAgICBzdWIuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRvciAmJiB0eXBlb2YgaXRlcmF0b3IucmV0dXJuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpdGVyYXRvciA9IGlucHV0W1N5bWJvbF9pdGVyYXRvcl0oKTtcbiAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIGRvbmU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUgPSByZXN1bHQuZG9uZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVJdGVyYWJsZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX3N5bWJvbF9vYnNlcnZhYmxlIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJbnRlcm9wT2JzZXJ2YWJsZS5qcy5tYXBcbiIsIi8qKiBQVVJFX0lNUE9SVFNfU1RBUlQgX3N5bWJvbF9pdGVyYXRvciBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0l0ZXJhYmxlLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCBfc2NoZWR1bGVPYnNlcnZhYmxlLF9zY2hlZHVsZVByb21pc2UsX3NjaGVkdWxlQXJyYXksX3NjaGVkdWxlSXRlcmFibGUsX3V0aWxfaXNJbnRlcm9wT2JzZXJ2YWJsZSxfdXRpbF9pc1Byb21pc2UsX3V0aWxfaXNBcnJheUxpa2UsX3V0aWxfaXNJdGVyYWJsZSBQVVJFX0lNUE9SVFNfRU5EICovXG5pbXBvcnQgeyBzY2hlZHVsZU9ic2VydmFibGUgfSBmcm9tICcuL3NjaGVkdWxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzY2hlZHVsZVByb21pc2UgfSBmcm9tICcuL3NjaGVkdWxlUHJvbWlzZSc7XG5pbXBvcnQgeyBzY2hlZHVsZUFycmF5IH0gZnJvbSAnLi9zY2hlZHVsZUFycmF5JztcbmltcG9ydCB7IHNjaGVkdWxlSXRlcmFibGUgfSBmcm9tICcuL3NjaGVkdWxlSXRlcmFibGUnO1xuaW1wb3J0IHsgaXNJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuLi91dGlsL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVkKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0FycmF5TGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZUFycmF5KGlucHV0LCBzY2hlZHVsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzSXRlcmFibGUoaW5wdXQpIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZUl0ZXJhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKGlucHV0ICE9PSBudWxsICYmIHR5cGVvZiBpbnB1dCB8fCBpbnB1dCkgKyAnIGlzIG5vdCBvYnNlcnZhYmxlJyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZWQuanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9PYnNlcnZhYmxlLF91dGlsX3N1YnNjcmliZVRvLF9zY2hlZHVsZWRfc2NoZWR1bGVkIFBVUkVfSU1QT1JUU19FTkQgKi9cbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUbyc7XG5pbXBvcnQgeyBzY2hlZHVsZWQgfSBmcm9tICcuLi9zY2hlZHVsZWQvc2NoZWR1bGVkJztcbmV4cG9ydCBmdW5jdGlvbiBmcm9tKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZVRvKGlucHV0KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVkKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZyb20uanMubWFwXG4iLCIvKiogUFVSRV9JTVBPUlRTX1NUQVJUIF9PYnNlcnZhYmxlLF91dGlsX2lzQXJyYXksX29wZXJhdG9yc19tYXAsX3V0aWxfaXNPYmplY3QsX2Zyb20gUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9pc09iamVjdCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbigpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHNvdXJjZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZhciBmaXJzdF8xID0gc291cmNlc1swXTtcbiAgICAgICAgaWYgKGlzQXJyYXkoZmlyc3RfMSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JrSm9pbkludGVybmFsKGZpcnN0XzEsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc09iamVjdChmaXJzdF8xKSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZmlyc3RfMSkgPT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZmlyc3RfMSk7XG4gICAgICAgICAgICByZXR1cm4gZm9ya0pvaW5JbnRlcm5hbChrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBmaXJzdF8xW2tleV07IH0pLCBrZXlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvdXJjZXNbc291cmNlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcmVzdWx0U2VsZWN0b3JfMSA9IHNvdXJjZXMucG9wKCk7XG4gICAgICAgIHNvdXJjZXMgPSAoc291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShzb3VyY2VzWzBdKSkgPyBzb3VyY2VzWzBdIDogc291cmNlcztcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luSW50ZXJuYWwoc291cmNlcywgbnVsbCkucGlwZShtYXAoZnVuY3Rpb24gKGFyZ3MpIHsgcmV0dXJuIHJlc3VsdFNlbGVjdG9yXzEuYXBwbHkodm9pZCAwLCBhcmdzKTsgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ya0pvaW5JbnRlcm5hbChzb3VyY2VzLCBudWxsKTtcbn1cbmZ1bmN0aW9uIGZvcmtKb2luSW50ZXJuYWwoc291cmNlcywga2V5cykge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgbGVuID0gc291cmNlcy5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICB2YXIgZW1pdHRlZCA9IDA7XG4gICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBmcm9tKHNvdXJjZXNbaV0pO1xuICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChzb3VyY2Uuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdHRlZCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIHN1YnNjcmliZXIuZXJyb3IoZXJyKTsgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQrKztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA9PT0gbGVuIHx8ICFoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVtaXR0ZWQgPT09IGxlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChrZXlzID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5LCBpKSB7IHJldHVybiAocmVzdWx0W2tleV0gPSB2YWx1ZXNbaV0sIHJlc3VsdCk7IH0sIHt9KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIF9sb29wXzEoaSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvcmtKb2luLmpzLm1hcFxuIiwiLyoqIFBVUkVfSU1QT1JUU19TVEFSVCB0c2xpYixfU3Vic2NyaWJlcixfdXRpbF9ub29wLF91dGlsX2lzRnVuY3Rpb24gUFVSRV9JTVBPUlRTX0VORCAqL1xuaW1wb3J0ICogYXMgdHNsaWJfMSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gdGFwKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdGFwT3BlcmF0b3JGdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBEb09wZXJhdG9yKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpKTtcbiAgICB9O1xufVxudmFyIERvT3BlcmF0b3IgPSAvKkBfX1BVUkVfXyovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRG9PcGVyYXRvcihuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMubmV4dE9yT2JzZXJ2ZXIgPSBuZXh0T3JPYnNlcnZlcjtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLmNvbXBsZXRlID0gY29tcGxldGU7XG4gICAgfVxuICAgIERvT3BlcmF0b3IucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoc3Vic2NyaWJlciwgc291cmNlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBUYXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMubmV4dE9yT2JzZXJ2ZXIsIHRoaXMuZXJyb3IsIHRoaXMuY29tcGxldGUpKTtcbiAgICB9O1xuICAgIHJldHVybiBEb09wZXJhdG9yO1xufSgpKTtcbnZhciBUYXBTdWJzY3JpYmVyID0gLypAX19QVVJFX18qLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHRzbGliXzEuX19leHRlbmRzKFRhcFN1YnNjcmliZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVGFwU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgb2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkZXN0aW5hdGlvbikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuX3RhcE5leHQgPSBub29wO1xuICAgICAgICBfdGhpcy5fdGFwRXJyb3IgPSBub29wO1xuICAgICAgICBfdGhpcy5fdGFwQ29tcGxldGUgPSBub29wO1xuICAgICAgICBfdGhpcy5fdGFwRXJyb3IgPSBlcnJvciB8fCBub29wO1xuICAgICAgICBfdGhpcy5fdGFwQ29tcGxldGUgPSBjb21wbGV0ZSB8fCBub29wO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkpIHtcbiAgICAgICAgICAgIF90aGlzLl9jb250ZXh0ID0gX3RoaXM7XG4gICAgICAgICAgICBfdGhpcy5fdGFwTmV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICBfdGhpcy5fY29udGV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICAgICAgX3RoaXMuX3RhcE5leHQgPSBvYnNlcnZlck9yTmV4dC5uZXh0IHx8IG5vb3A7XG4gICAgICAgICAgICBfdGhpcy5fdGFwRXJyb3IgPSBvYnNlcnZlck9yTmV4dC5lcnJvciB8fCBub29wO1xuICAgICAgICAgICAgX3RoaXMuX3RhcENvbXBsZXRlID0gb2JzZXJ2ZXJPck5leHQuY29tcGxldGUgfHwgbm9vcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFRhcFN1YnNjcmliZXIucHJvdG90eXBlLl9uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl90YXBOZXh0LmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH07XG4gICAgVGFwU3Vic2NyaWJlci5wcm90b3R5cGUuX2Vycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fdGFwRXJyb3IuY2FsbCh0aGlzLl9jb250ZXh0LCBlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfTtcbiAgICBUYXBTdWJzY3JpYmVyLnByb3RvdHlwZS5fY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl90YXBDb21wbGV0ZS5jYWxsKHRoaXMuX2NvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIFRhcFN1YnNjcmliZXI7XG59KFN1YnNjcmliZXIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhcC5qcy5tYXBcbiIsImltcG9ydCB7IE9ic2VydmFibGUsIGZyb20sIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDcmVhdGUgYW4gb2JzZXJ2YWJsZSBvZiBhdXRoZW50aWNhdGlvbiBzdGF0ZS4gVGhlIG9ic2VydmVyIGlzIG9ubHlcclxuICogdHJpZ2dlcmVkIG9uIHNpZ24taW4gb3Igc2lnbi1vdXQuXHJcbiAqIEBwYXJhbSBhdXRoIGZpcmViYXNlLmF1dGguQXV0aFxyXG4gKi9cclxuZnVuY3Rpb24gYXV0aFN0YXRlKGF1dGgpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgICAgIHZhciB1bnN1YnNjcmliZSA9IGF1dGgub25BdXRoU3RhdGVDaGFuZ2VkKHN1YnNjcmliZXIpO1xyXG4gICAgICAgIHJldHVybiB7IHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSB9O1xyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZSBhbiBvYnNlcnZhYmxlIG9mIHVzZXIgc3RhdGUuIFRoZSBvYnNlcnZlciBpcyB0cmlnZ2VyZWQgZm9yIHNpZ24taW4sXHJcbiAqIHNpZ24tb3V0LCBhbmQgdG9rZW4gcmVmcmVzaCBldmVudHNcclxuICogQHBhcmFtIGF1dGggZmlyZWJhc2UuYXV0aC5BdXRoXHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VyKGF1dGgpIHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAoc3Vic2NyaWJlcikge1xyXG4gICAgICAgIHZhciB1bnN1YnNjcmliZSA9IGF1dGgub25JZFRva2VuQ2hhbmdlZChzdWJzY3JpYmVyKTtcclxuICAgICAgICByZXR1cm4geyB1bnN1YnNjcmliZTogdW5zdWJzY3JpYmUgfTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGUgYW4gb2JzZXJ2YWJsZSBvZiBpZFRva2VuIHN0YXRlLiBUaGUgb2JzZXJ2ZXIgaXMgdHJpZ2dlcmVkIGZvciBzaWduLWluLFxyXG4gKiBzaWduLW91dCwgYW5kIHRva2VuIHJlZnJlc2ggZXZlbnRzXHJcbiAqIEBwYXJhbSBhdXRoIGZpcmViYXNlLmF1dGguQXV0aFxyXG4gKi9cclxuZnVuY3Rpb24gaWRUb2tlbihhdXRoKSB7XHJcbiAgICByZXR1cm4gdXNlcihhdXRoKS5waXBlKHN3aXRjaE1hcChmdW5jdGlvbiAodXNlcikgeyByZXR1cm4gKHVzZXIgPyBmcm9tKHVzZXIuZ2V0SWRUb2tlbigpKSA6IG9mKG51bGwpKTsgfSkpO1xyXG59XG5cbmV4cG9ydCB7IGF1dGhTdGF0ZSwgaWRUb2tlbiwgdXNlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgYXV0aFN0YXRlIH0gZnJvbSBcInJ4ZmlyZS9hdXRoXCI7XG5pbXBvcnQgeyBhdXRoU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2F1dGhcIjtcblxuZXhwb3J0IGNvbnN0IGF1dGhMaXN0ZW5lciA9IChmaXJlYmFzZUFwcCkgPT4ge1xuICBhdXRoU3RhdGUoZmlyZWJhc2VBcHAuYXV0aCgpKS5zdWJzY3JpYmUoYXN5bmMgKHVzZXIpID0+IHtcbiAgICBpZiAodXNlcikge1xuICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB1c2VyLmdldElkVG9rZW4odHJ1ZSk7XG4gICAgICBjb25zdCBpZFRva2VuUmVzdWx0ID0gYXdhaXQgdXNlci5nZXRJZFRva2VuUmVzdWx0KCk7XG4gICAgICBhdXRoU3RvcmUuc2V0KHsgc3RhdHVzOiBcImluXCIsIHVzZXIsIHRva2VuIH0pO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaWduSW5XaXRoRmFjZWJvb2sgPSAoZmlyZWJhc2VBcHApID0+ICh7IHJlZGlyZWN0ID0gZmFsc2UgfSkgPT4ge1xuICBmaXJlYmFzZUFwcC5zdWJzY3JpYmUoYXN5bmMgKGFwcCkgPT4ge1xuICAgIGNvbnN0IGF1dGhQcm92aWRlciA9IG5ldyBhcHAuYXV0aC5GYWNlYm9va0F1dGhQcm92aWRlcigpO1xuICAgIHRyeSB7XG4gICAgICByZWRpcmVjdCA9PT0gdHJ1ZVxuICAgICAgICA/IGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aFJlZGlyZWN0KGF1dGhQcm92aWRlcilcbiAgICAgICAgOiBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhQb3B1cChhdXRoUHJvdmlkZXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9KTtcbn07XG5leHBvcnQgY29uc3Qgc2lnbkluV2l0aEdvb2dsZSA9IChmaXJlYmFzZUFwcCkgPT4gKHsgcmVkaXJlY3QgPSBmYWxzZSB9KSA9PiB7XG4gIGZpcmViYXNlQXBwLnN1YnNjcmliZShhc3luYyAoYXBwKSA9PiB7XG4gICAgY29uc3QgYXV0aFByb3ZpZGVyID0gbmV3IGFwcC5hdXRoLkdvb2dsZUF1dGhQcm92aWRlcigpO1xuICAgIHRyeSB7XG4gICAgICByZWRpcmVjdCA9PT0gdHJ1ZVxuICAgICAgICA/IGF3YWl0IGFwcC5hdXRoKCkuc2lnbkluV2l0aFJlZGlyZWN0KGF1dGhQcm92aWRlcilcbiAgICAgICAgOiBhd2FpdCBhcHAuYXV0aCgpLnNpZ25JbldpdGhQb3B1cChhdXRoUHJvdmlkZXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzaWduT3V0ID0gKGZpcmViYXNlQXBwKSA9PiAoKSA9PiB7XG4gIGZpcmViYXNlQXBwLnN1YnNjcmliZShhc3luYyAoYXBwKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwcC5hdXRoKCkuc2lnbk91dCgpO1xuICAgICAgYXV0aFN0b3JlLnNldCh7IHN0YXR1czogXCJvdXRcIiB9KTtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidG9rZW5cIik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lDY0RVTGRHVXEyZWZzSVF0M1VPSFUwSHFlaGJOMjZ3TzhcIixcbiAgICBhdXRoRG9tYWluOiBcImJib3QtZGNjYjIuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9iYm90LWRjY2IyLmZpcmViYXNlaW8uY29tXCIsXG4gICAgcHJvamVjdElkOiBcImJib3QtZGNjYjJcIixcbiAgICBzdG9yYWdlQnVja2V0OiBcImJib3QtZGNjYjIuYXBwc3BvdC5jb21cIixcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCI5NzA4MzMxNTMxMTVcIixcbiAgICBhcHBJZDogXCIxOjk3MDgzMzE1MzExNTp3ZWI6MGM0MTcyNGEzOTkzZDExZjljYzM3ZVwiLFxuICAgIG1lYXN1cmVtZW50SWQ6IFwiRy1QSjJYTUQwSzJLXCJ9O1xuIiwiaW1wb3J0IHsgZnJvbSwgZm9ya0pvaW4sIFJlcGxheVN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgbWFwLCB0YXAgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcbmltcG9ydCB7IGF1dGhMaXN0ZW5lciB9IGZyb20gXCIuL2F1dGhcIjtcbi8vbXBvcnQgeyBjb2xsZWN0aW9uTGlzdGVuZXIgfSBmcm9tIFwiLi9jb2xsZWN0aW9uXCI7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGxhenlMb2FkKCkge1xuICAvLyBjcmVhdGUgb2JzZXJ2YWJsZSBmcm9tIGR5bmFtaWMgaW1wb3J0XG4gIGNvbnN0IGZpcmViYXNlJCA9IGZyb20oaW1wb3J0KFwiZmlyZWJhc2UvYXBwXCIpKTtcbiAgY29uc3QgYXV0aCQgPSBmcm9tKGltcG9ydChcImZpcmViYXNlL2F1dGhcIikpO1xuICAvL2NvbnN0IGZpcmVzdG9yZSQgPSBmcm9tKGltcG9ydChcImZpcmViYXNlL2ZpcmVzdG9yZVwiKSk7XG5cbiAgLy8gd2hlbiBhbGwgb2JzZXJ2YWJsZXMsIGUuZyAoZmlyZWJhc2UkLCBhdXRoJCksIGNvbXBsZXRlLCBnaXZlIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUgZnJvbSBlYWNoIGFzIGFuIGFycmF5XG4gIHJldHVybiBmb3JrSm9pbihmaXJlYmFzZSQsIGF1dGgkKS5waXBlKFxuICAgIC8vIGFwcGx5IHRyYW5zZm9ybSB0byBhcnJheSBlbWl0dGVkIGZyb20gZm9ya0pvaW4gdG8gcmV0dXJuIEZpcmViYXNlIGluc3RhbmNlXG4gICAgbWFwKChbZmlyZWJhc2UkXSkgPT4ge1xuICAgICAgY29uc3QgZmlyZWJhc2UgPSBmaXJlYmFzZSQuZGVmYXVsdDtcbiAgICAgIHJldHVybiB7IGZpcmViYXNlIH07XG4gICAgfSlcbiAgKTtcbn1cblxuLy8gY3JlYXRlIHN1YmplY3QgdG8gcmVwbGF5L2VtaXQgdGhlIEZpcmViYXNlIGluc3RhbmNlIHRvIGFsbCBuZXcgc3Vic2NyaWJlcnNcbmNvbnN0IGZpcmViYXNlQXBwJCA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuXG5wcm9jZXNzLmJyb3dzZXIgJiZcbiAgbGF6eUxvYWQoKVxuICAgIC5waXBlKFxuICAgICAgLy8gcGVyZm9ybSBzaWRlLWVmZmVjdCB0byBpbml0aWFsaXplIGF1dGggbGlzdGVuZXJcbiAgICAgIHRhcCgobG9hZCkgPT4ge1xuICAgICAgICBjb25zdCB7IGZpcmViYXNlIH0gPSBsb2FkO1xuICAgICAgICBjb25zdCBhcHAgPSBmaXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG4gICAgICAgIGF1dGhMaXN0ZW5lcihhcHApO1xuICAgICAgICAvL2NvbGxlY3Rpb25MaXN0ZW5lcihhcHApO1xuICAgICAgfSlcbiAgICApXG4gICAgLnN1YnNjcmliZSgobG9hZCkgPT4ge1xuICAgICAgY29uc3QgeyBmaXJlYmFzZSB9ID0gbG9hZDtcbiAgICAgIGZpcmViYXNlQXBwJC5uZXh0KGZpcmViYXNlKTtcbiAgICB9KTtcblxuZXhwb3J0IHsgZmlyZWJhc2VBcHAkIH07XG4iLCJpbXBvcnQgeyBmaXJlYmFzZUFwcCQgfSBmcm9tIFwiLi9pbml0XCI7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vXG4vLyBhdXRoLmpzXG5pbXBvcnQge1xuICBzaWduSW5XaXRoR29vZ2xlIGFzIF9zaWduSW5XaXRoR29vZ2xlLFxuICBzaWduSW5XaXRoRmFjZWJvb2sgYXMgX3NpZ25JbldpdGhGYWNlYm9vayxcbiAgc2lnbk91dCBhcyBfc2lnbk91dCxcbn0gZnJvbSBcIi4vYXV0aFwiO1xuXG5leHBvcnQgY29uc3Qgc2lnbkluV2l0aEdvb2dsZSA9IF9zaWduSW5XaXRoR29vZ2xlKGZpcmViYXNlQXBwJCk7XG5leHBvcnQgY29uc3Qgc2lnbkluV2l0aEZhY2Vib29rID0gX3NpZ25JbldpdGhGYWNlYm9vayhmaXJlYmFzZUFwcCQpO1xuZXhwb3J0IGNvbnN0IHNpZ25PdXQgPSBfc2lnbk91dChmaXJlYmFzZUFwcCQpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL1xuLy8gY29sbGVjdGlvbi5qc1xuLy9leHBvcnQgY29uc3QgYWRkSXRlbVRvQ29sbGVjdGlvbiA9IF9hZGRJdGVtVG9Db2xsZWN0aW9uKGZpcmViYXNlQXBwJCk7XG4vL1xuLy9leHBvcnQgeyBmaXJlYmFzZUFwcCQgfTtcbi8vaW1wb3J0IHsgYWRkSXRlbVRvQ29sbGVjdGlvbiBhcyBfYWRkSXRlbVRvQ29sbGVjdGlvbiB9IGZyb20gXCIuL2NvbGxlY3Rpb25cIjtcbiIsIjxzY3JpcHQ+XG5cblxuICBleHBvcnQgbGV0IHNtYWxsID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgeHMgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCByZXZlcnNlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgdGlwID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgY29sb3IgPSBcImRlZmF1bHRcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4gIC5yZXZlcnNlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG5cbiAgLnRpcCB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICB9XG48L3N0eWxlPlxuXG48aVxuICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICBjbGFzcz1cIm1hdGVyaWFsLWljb25zIGljb24gdGV4dC14bCB7JCRwcm9wcy5jbGFzc30gZHVyYXRpb24tMjAwIGVhc2UtaW5cIlxuICBjbGFzczpyZXZlcnNlXG4gIGNsYXNzOnRpcFxuICBvbjpjbGlja1xuICBjbGFzczp0ZXh0LWJhc2U9e3NtYWxsfVxuICBjbGFzczp0ZXh0LXhzPXt4c31cbiAgc3R5bGU9e2NvbG9yID8gYGNvbG9yOiAke2NvbG9yfWAgOiAnJ30+XG4gIDxzbG90IC8+XG48L2k+XG4iLCJjb25zdCBub0RlcHRoID0gW1wid2hpdGVcIiwgXCJibGFja1wiLCBcInRyYW5zcGFyZW50XCJdO1xuXG5mdW5jdGlvbiBnZXRDbGFzcyhwcm9wLCBjb2xvciwgZGVwdGgsIGRlZmF1bHREZXB0aCkge1xuICBpZiAobm9EZXB0aC5pbmNsdWRlcyhjb2xvcikpIHtcbiAgICByZXR1cm4gYCR7cHJvcH0tJHtjb2xvcn1gO1xuICB9XG4gIHJldHVybiBgJHtwcm9wfS0ke2NvbG9yfS0ke2RlcHRoIHx8IGRlZmF1bHREZXB0aH0gYDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXRpbHMoY29sb3IsIGRlZmF1bHREZXB0aCA9IDUwMCkge1xuICByZXR1cm4ge1xuICAgIGJnOiBkZXB0aCA9PiBnZXRDbGFzcyhcImJnXCIsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSxcbiAgICBib3JkZXI6IGRlcHRoID0+IGdldENsYXNzKFwiYm9yZGVyXCIsIGNvbG9yLCBkZXB0aCwgZGVmYXVsdERlcHRoKSxcbiAgICB0eHQ6IGRlcHRoID0+IGdldENsYXNzKFwidGV4dFwiLCBjb2xvciwgZGVwdGgsIGRlZmF1bHREZXB0aCksXG4gICAgY2FyZXQ6IGRlcHRoID0+IGdldENsYXNzKFwiY2FyZXRcIiwgY29sb3IsIGRlcHRoLCBkZWZhdWx0RGVwdGgpXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFzc0J1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihjbGFzc2VzLCBkZWZhdWx0Q2xhc3Nlcykge1xuICAgIHRoaXMuZGVmYXVsdHMgPVxuICAgICAgKHR5cGVvZiBjbGFzc2VzID09PSBcImZ1bmN0aW9uXCIgPyBjbGFzc2VzKGRlZmF1bHRDbGFzc2VzKSA6IGNsYXNzZXMpIHx8XG4gICAgICBkZWZhdWx0Q2xhc3NlcztcblxuICAgIHRoaXMuY2xhc3NlcyA9IHRoaXMuZGVmYXVsdHM7XG4gIH1cblxuICBmbHVzaCgpIHtcbiAgICB0aGlzLmNsYXNzZXMgPSB0aGlzLmRlZmF1bHRzO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBleHRlbmQoLi4uZm5zKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NlcztcbiAgfVxuXG4gIHJlcGxhY2UoY2xhc3NlcywgY29uZCA9IHRydWUpIHtcbiAgICBpZiAoY29uZCAmJiBjbGFzc2VzKSB7XG4gICAgICB0aGlzLmNsYXNzZXMgPSBPYmplY3Qua2V5cyhjbGFzc2VzKS5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGZyb20pID0+IGFjYy5yZXBsYWNlKG5ldyBSZWdFeHAoZnJvbSwgXCJnXCIpLCBjbGFzc2VzW2Zyb21dKSxcbiAgICAgICAgdGhpcy5jbGFzc2VzXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlKGNsYXNzZXMsIGNvbmQgPSB0cnVlKSB7XG4gICAgaWYgKGNvbmQgJiYgY2xhc3Nlcykge1xuICAgICAgdGhpcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgY3VyKSA9PiBhY2MucmVwbGFjZShuZXcgUmVnRXhwKGN1ciwgXCJnXCIpLCBcIlwiKSxcbiAgICAgICAgICB0aGlzLmNsYXNzZXNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZChjbGFzc05hbWUsIGNvbmQgPSB0cnVlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAoIWNvbmQgfHwgIWNsYXNzTmFtZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiBjbGFzc05hbWUpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuY2xhc3NlcyArPSBgICR7Y2xhc3NOYW1lfSBgO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICB0aGlzLmNsYXNzZXMgKz0gYCAke2NsYXNzTmFtZShkZWZhdWx0VmFsdWUgfHwgdGhpcy5jbGFzc2VzKX0gYDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGRlZmF1bHRSZXNlcnZlZCA9IFtcImNsYXNzXCIsIFwiYWRkXCIsIFwicmVtb3ZlXCIsIFwicmVwbGFjZVwiLCBcInZhbHVlXCJdO1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUHJvcHMocmVzZXJ2ZWQsIHByb3BzKSB7XG4gIGNvbnN0IHIgPSBbLi4ucmVzZXJ2ZWQsIC4uLmRlZmF1bHRSZXNlcnZlZF07XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UoXG4gICAgKGFjYywgY3VyKSA9PlxuICAgICAgY3VyLmluY2x1ZGVzKFwiJCRcIikgfHwgY3VyLmluY2x1ZGVzKFwiQ2xhc3NcIikgfHwgcmVzZXJ2ZWQuaW5jbHVkZXMoY3VyKVxuICAgICAgICA/IGFjY1xuICAgICAgICA6IHsgLi4uYWNjLCBbY3VyXTogcHJvcHNbY3VyXSB9LFxuICAgIHt9XG4gICk7XG59XG4iLCIvLyBUaGFua3MgTGFnZGVuISBodHRwczovL3N2ZWx0ZS5kZXYvcmVwbC82MWQ5MTc4ZDJiOTk0NGYyYWEyYmZlMzE2MTJhYjA5Zj92ZXJzaW9uPTMuNi43XG5mdW5jdGlvbiByaXBwbGUoY29sb3IsIGNlbnRlcmVkKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgY29uc3QgZCA9IE1hdGgubWF4KHRhcmdldC5jbGllbnRXaWR0aCwgdGFyZ2V0LmNsaWVudEhlaWdodCk7XG5cbiAgICBjb25zdCByZW1vdmVDaXJjbGUgPSAoKSA9PiB7XG4gICAgICBjaXJjbGUucmVtb3ZlKCk7XG4gICAgICBjaXJjbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIH07XG5cbiAgICBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCByZW1vdmVDaXJjbGUpO1xuICAgIGNpcmNsZS5zdHlsZS53aWR0aCA9IGNpcmNsZS5zdHlsZS5oZWlnaHQgPSBgJHtkfXB4YDtcbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgaWYgKGNlbnRlcmVkKSB7XG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgXCJhYnNvbHV0ZVwiLFxuICAgICAgICBcInRvcC0wXCIsXG4gICAgICAgIFwibGVmdC0wXCIsXG4gICAgICAgIFwicmlwcGxlLWNlbnRlcmVkXCIsXG4gICAgICAgIGBiZy0ke2NvbG9yfS10cmFuc0RhcmtgXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaXJjbGUuc3R5bGUubGVmdCA9IGAke2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBkIC8gMn1weGA7XG4gICAgICBjaXJjbGUuc3R5bGUudG9wID0gYCR7ZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gZCAvIDJ9cHhgO1xuXG4gICAgICBjaXJjbGUuY2xhc3NMaXN0LmFkZChcInJpcHBsZS1ub3JtYWxcIiwgYGJnLSR7Y29sb3J9LXRyYW5zYCk7XG4gICAgfVxuXG4gICAgY2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJyaXBwbGVcIik7XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcihjb2xvciA9IFwicHJpbWFyeVwiLCBjZW50ZXJlZCA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmlwcGxlKGNvbG9yLCBjZW50ZXJlZCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9uRGVzdHJveTogKCkgPT4gbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIilcbiAgICB9O1xuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb25cIjtcbiAgaW1wb3J0IHV0aWxzLCB7IENsYXNzQnVpbGRlciwgZmlsdGVyUHJvcHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2xhc3Nlcy5qc1wiO1xuICBpbXBvcnQgY3JlYXRlUmlwcGxlIGZyb20gXCIuLi9SaXBwbGUvcmlwcGxlLmpzXCI7XG5cblxuXG4gIGV4cG9ydCBsZXQgdmFsdWUgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBvdXRsaW5lZCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IHRleHQgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBibG9jayA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRpc2FibGVkID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWNvbiA9IG51bGw7XG4gIGV4cG9ydCBsZXQgc21hbGwgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBsaWdodCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGRhcmsgPSBmYWxzZTtcbiAgZXhwb3J0IGxldCBmbGF0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgaWNvbkNsYXNzID0gXCJcIjtcbiAgZXhwb3J0IGxldCBjb2xvciA9IFwicHJpbWFyeVwiO1xuICBleHBvcnQgbGV0IGhyZWYgPSBudWxsO1xuICBleHBvcnQgbGV0IGZhYiA9IGZhbHNlO1xuXG4gIGV4cG9ydCBsZXQgcmVtb3ZlID0gXCJcIjtcbiAgZXhwb3J0IGxldCBhZGQgPSBcIlwiO1xuICBleHBvcnQgbGV0IHJlcGxhY2UgPSB7fTtcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9ICdweS0yIHB4LTQgdXBwZXJjYXNlIHRleHQtc20gZm9udC1tZWRpdW0gcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuJztcbiAgY29uc3QgYmFzaWNEZWZhdWx0ID0gJ3RleHQtd2hpdGUgZHVyYXRpb24tMjAwIGVhc2UtaW4nO1xuICBjb25zdCBvdXRsaW5lZERlZmF1bHQgPSAnYmctdHJhbnNwYXJlbnQgYm9yZGVyIGJvcmRlci1zb2xpZCc7XG4gIGNvbnN0IHRleHREZWZhdWx0ID0gJ2JnLXRyYW5zcGFyZW50IGJvcmRlci1ub25lIHB4LTQgaG92ZXI6YmctdHJhbnNwYXJlbnQnO1xuICBjb25zdCBpY29uRGVmYXVsdCA9ICdwLTQgZmxleCBpdGVtcy1jZW50ZXIgc2VsZWN0LW5vbmUnO1xuICBjb25zdCBmYWJEZWZhdWx0ID0gJ2hvdmVyOmJnLXRyYW5zcGFyZW50JztcbiAgY29uc3Qgc21hbGxEZWZhdWx0ID0gJ3B0LTEgcGItMSBwbC0yIHByLTIgdGV4dC14cyc7XG4gIGNvbnN0IGRpc2FibGVkRGVmYXVsdCA9ICdiZy1ncmF5LTMwMCB0ZXh0LWdyYXktNTAwIGRhcms6YmctZGFyay00MDAgZWxldmF0aW9uLW5vbmUgcG9pbnRlci1ldmVudHMtbm9uZSBob3ZlcjpiZy1ncmF5LTMwMCBjdXJzb3ItZGVmYXVsdCc7XG4gIGNvbnN0IGVsZXZhdGlvbkRlZmF1bHQgPSAnaG92ZXI6ZWxldmF0aW9uLTUgZWxldmF0aW9uLTMnO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IGJhc2ljQ2xhc3NlcyA9IGJhc2ljRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBvdXRsaW5lZENsYXNzZXMgPSBvdXRsaW5lZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgdGV4dENsYXNzZXMgPSB0ZXh0RGVmYXVsdDtcbiAgZXhwb3J0IGxldCBpY29uQ2xhc3NlcyA9IGljb25EZWZhdWx0O1xuICBleHBvcnQgbGV0IGZhYkNsYXNzZXMgPSBmYWJEZWZhdWx0O1xuICBleHBvcnQgbGV0IHNtYWxsQ2xhc3NlcyA9IHNtYWxsRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBkaXNhYmxlZENsYXNzZXMgPSBkaXNhYmxlZERlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgZWxldmF0aW9uQ2xhc3NlcyA9IGVsZXZhdGlvbkRlZmF1bHQ7XG5cbiAgZmFiID0gZmFiIHx8ICh0ZXh0ICYmIGljb24pO1xuICBjb25zdCBiYXNpYyA9ICFvdXRsaW5lZCAmJiAhdGV4dCAmJiAhZmFiO1xuICBjb25zdCBlbGV2YXRpb24gPSAoYmFzaWMgfHwgaWNvbikgJiYgIWRpc2FibGVkICYmICFmbGF0ICYmICF0ZXh0O1xuXG4gIGxldCBDbGFzc2VzID0gaSA9PiBpO1xuICBsZXQgaUNsYXNzZXMgPSBpID0+IGk7XG4gIGxldCBzaGFkZSA9IDA7XG5cbiAgJDoge1xuICAgIHNoYWRlID0gbGlnaHQgPyAyMDAgOiAwO1xuICAgIHNoYWRlID0gZGFyayA/IC00MDAgOiBzaGFkZTtcbiAgfVxuICAkOiBub3JtYWwgPSA1MDAgLSBzaGFkZTtcbiAgJDogbGlnaHRlciA9IDQwMCAtIHNoYWRlO1xuXG4gIGNvbnN0IHtcbiAgICBiZyxcbiAgICBib3JkZXIsXG4gICAgdHh0LFxuICB9ID0gdXRpbHMoY29sb3IpO1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG4gIGxldCBpY29uQ2I7XG5cbiAgaWYgKGljb24pIHtcbiAgICBpY29uQ2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGljb25DbGFzcyk7XG4gIH1cblxuICAkOiBjbGFzc2VzID0gY2JcbiAgICAgIC5mbHVzaCgpXG4gICAgICAuYWRkKGJhc2ljQ2xhc3NlcywgYmFzaWMsIGJhc2ljRGVmYXVsdClcbiAgICAgIC5hZGQoYCR7Ymcobm9ybWFsKX0gaG92ZXI6JHtiZyhsaWdodGVyKX1gLCBiYXNpYylcbiAgICAgIC5hZGQoZWxldmF0aW9uQ2xhc3NlcywgZWxldmF0aW9uLCBlbGV2YXRpb25EZWZhdWx0KVxuICAgICAgLmFkZChvdXRsaW5lZENsYXNzZXMsIG91dGxpbmVkLCBvdXRsaW5lZERlZmF1bHQpXG4gICAgICAuYWRkKFxuICAgICAgICBgJHtib3JkZXIobGlnaHRlcil9ICR7dHh0KG5vcm1hbCl9IGhvdmVyOiR7YmcoXCJ0cmFuc1wiKX0gZGFyay1ob3Zlcjoke2JnKFwidHJhbnNEYXJrXCIpfWAsXG4gICAgICAgIG91dGxpbmVkKVxuICAgICAgLmFkZChgJHt0eHQobGlnaHRlcil9YCwgdGV4dClcbiAgICAgIC5hZGQodGV4dENsYXNzZXMsIHRleHQsIHRleHREZWZhdWx0KVxuICAgICAgLmFkZChpY29uQ2xhc3NlcywgaWNvbiwgaWNvbkRlZmF1bHQpXG4gICAgICAucmVtb3ZlKFwicHktMlwiLCBpY29uKVxuICAgICAgLnJlbW92ZSh0eHQobGlnaHRlciksIGZhYilcbiAgICAgIC5hZGQoZGlzYWJsZWRDbGFzc2VzLCBkaXNhYmxlZCwgZGlzYWJsZWREZWZhdWx0KVxuICAgICAgLmFkZChzbWFsbENsYXNzZXMsIHNtYWxsLCBzbWFsbERlZmF1bHQpXG4gICAgICAuYWRkKFwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgaC04IHctOFwiLCBzbWFsbCAmJiBpY29uKVxuICAgICAgLmFkZChcImJvcmRlci1zb2xpZFwiLCBvdXRsaW5lZClcbiAgICAgIC5hZGQoXCJyb3VuZGVkLWZ1bGxcIiwgaWNvbilcbiAgICAgIC5hZGQoXCJ3LWZ1bGxcIiwgYmxvY2spXG4gICAgICAuYWRkKFwicm91bmRlZFwiLCBiYXNpYyB8fCBvdXRsaW5lZCB8fCB0ZXh0KVxuICAgICAgLmFkZChcImJ1dHRvblwiLCAhaWNvbilcbiAgICAgIC5hZGQoZmFiQ2xhc3NlcywgZmFiLCBmYWJEZWZhdWx0KVxuICAgICAgLmFkZChgaG92ZXI6JHtiZyhcInRyYW5zTGlnaHRcIil9YCwgZmFiKVxuICAgICAgLmFkZCgkJHByb3BzLmNsYXNzKVxuICAgICAgLnJlbW92ZShyZW1vdmUpXG4gICAgICAucmVwbGFjZShyZXBsYWNlKVxuICAgICAgLmFkZChhZGQpXG4gICAgICAuZ2V0KCk7XG5cbiAgJDogaWYgKGljb25DYikge1xuICAgIGlDbGFzc2VzID0gaWNvbkNiLmZsdXNoKCkuYWRkKHR4dCgpLCBmYWIgJiYgIWljb25DbGFzcykuZ2V0KCk7XG4gIH1cblxuICBjb25zdCByaXBwbGUgPSBjcmVhdGVSaXBwbGUoKHRleHQgfHwgZmFiIHx8IG91dGxpbmVkKSA/IGNvbG9yIDogXCJ3aGl0ZVwiKTtcblxuICBjb25zdCBwcm9wcyA9IGZpbHRlclByb3BzKFtcbiAgICAnb3V0bGluZWQnLFxuICAgICd0ZXh0JyxcbiAgICAnY29sb3InLFxuICAgICdibG9jaycsXG4gICAgJ2Rpc2FibGVkJyxcbiAgICAnaWNvbicsXG4gICAgJ3NtYWxsJyxcbiAgICAnbGlnaHQnLFxuICAgICdkYXJrJyxcbiAgICAnZmxhdCcsXG4gICAgJ2FkZCcsXG4gICAgJ3JlbW92ZScsXG4gICAgJ3JlcGxhY2UnLFxuICBdLCAkJHByb3BzKTtcbjwvc2NyaXB0PlxuXG5cbnsjaWYgaHJlZn1cbiAgPGFcbiAgICB7aHJlZn1cbiAgICB7Li4ucHJvcHN9XG4gID5cbiAgICA8YnV0dG9uXG4gICAgICB1c2U6cmlwcGxlXG4gICAgICBjbGFzcz17Y2xhc3Nlc31cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIHtkaXNhYmxlZH1cbiAgICAgIG9uOmNsaWNrPXsoKSA9PiAodmFsdWUgPSAhdmFsdWUpfVxuICAgICAgb246Y2xpY2tcbiAgICAgIG9uOm1vdXNlb3ZlclxuICAgICAgb246KlxuICAgID5cbiAgICAgIHsjaWYgaWNvbn1cbiAgICAgICAgPEljb24gY2xhc3M9e2lDbGFzc2VzfSB7c21hbGx9PntpY29ufTwvSWNvbj5cbiAgICAgIHsvaWZ9XG4gICAgICA8c2xvdCAvPlxuICAgIDwvYnV0dG9uPlxuICA8L2E+XG57OmVsc2V9XG4gIDxidXR0b25cbiAgICB1c2U6cmlwcGxlXG4gICAgY2xhc3M9e2NsYXNzZXN9XG4gICAgey4uLnByb3BzfVxuICAgIHtkaXNhYmxlZH1cbiAgICBvbjpjbGljaz17KCkgPT4gKHZhbHVlID0gIXZhbHVlKX1cbiAgICBvbjpjbGlja1xuICAgIG9uOm1vdXNlb3ZlclxuICAgIG9uOipcbiAgPlxuICAgIHsjaWYgaWNvbn1cbiAgICAgIDxJY29uIGNsYXNzPXtpQ2xhc3Nlc30ge3NtYWxsfT57aWNvbn08L0ljb24+XG4gICAgey9pZn1cbiAgICA8c2xvdCAvPlxuICA8L2J1dHRvbj5cbnsvaWZ9XG4iLCJleHBvcnQgeyBpZGVudGl0eSBhcyBsaW5lYXIgfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbi8qXG5BZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdHRkZXNsXG5EaXN0cmlidXRlZCB1bmRlciBNSVQgTGljZW5zZSBodHRwczovL2dpdGh1Yi5jb20vbWF0dGRlc2wvZWFzZXMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuKi9cbmZ1bmN0aW9uIGJhY2tJbk91dCh0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTggKiAxLjUyNTtcbiAgICBpZiAoKHQgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogKHQgKiB0ICogKChzICsgMSkgKiB0IC0gcykpO1xuICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAyKTtcbn1cbmZ1bmN0aW9uIGJhY2tJbih0KSB7XG4gICAgY29uc3QgcyA9IDEuNzAxNTg7XG4gICAgcmV0dXJuIHQgKiB0ICogKChzICsgMSkgKiB0IC0gcyk7XG59XG5mdW5jdGlvbiBiYWNrT3V0KHQpIHtcbiAgICBjb25zdCBzID0gMS43MDE1ODtcbiAgICByZXR1cm4gLS10ICogdCAqICgocyArIDEpICogdCArIHMpICsgMTtcbn1cbmZ1bmN0aW9uIGJvdW5jZU91dCh0KSB7XG4gICAgY29uc3QgYSA9IDQuMCAvIDExLjA7XG4gICAgY29uc3QgYiA9IDguMCAvIDExLjA7XG4gICAgY29uc3QgYyA9IDkuMCAvIDEwLjA7XG4gICAgY29uc3QgY2EgPSA0MzU2LjAgLyAzNjEuMDtcbiAgICBjb25zdCBjYiA9IDM1NDQyLjAgLyAxODA1LjA7XG4gICAgY29uc3QgY2MgPSAxNjA2MS4wIC8gMTgwNS4wO1xuICAgIGNvbnN0IHQyID0gdCAqIHQ7XG4gICAgcmV0dXJuIHQgPCBhXG4gICAgICAgID8gNy41NjI1ICogdDJcbiAgICAgICAgOiB0IDwgYlxuICAgICAgICAgICAgPyA5LjA3NSAqIHQyIC0gOS45ICogdCArIDMuNFxuICAgICAgICAgICAgOiB0IDwgY1xuICAgICAgICAgICAgICAgID8gY2EgKiB0MiAtIGNiICogdCArIGNjXG4gICAgICAgICAgICAgICAgOiAxMC44ICogdCAqIHQgLSAyMC41MiAqIHQgKyAxMC43Mjtcbn1cbmZ1bmN0aW9uIGJvdW5jZUluT3V0KHQpIHtcbiAgICByZXR1cm4gdCA8IDAuNVxuICAgICAgICA/IDAuNSAqICgxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCAqIDIuMCkpXG4gICAgICAgIDogMC41ICogYm91bmNlT3V0KHQgKiAyLjAgLSAxLjApICsgMC41O1xufVxuZnVuY3Rpb24gYm91bmNlSW4odCkge1xuICAgIHJldHVybiAxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCk7XG59XG5mdW5jdGlvbiBjaXJjSW5PdXQodCkge1xuICAgIGlmICgodCAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAtMC41ICogKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSk7XG4gICAgcmV0dXJuIDAuNSAqIChNYXRoLnNxcnQoMSAtICh0IC09IDIpICogdCkgKyAxKTtcbn1cbmZ1bmN0aW9uIGNpcmNJbih0KSB7XG4gICAgcmV0dXJuIDEuMCAtIE1hdGguc3FydCgxLjAgLSB0ICogdCk7XG59XG5mdW5jdGlvbiBjaXJjT3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KDEgLSAtLXQgKiB0KTtcbn1cbmZ1bmN0aW9uIGN1YmljSW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41ID8gNC4wICogdCAqIHQgKiB0IDogMC41ICogTWF0aC5wb3coMi4wICogdCAtIDIuMCwgMy4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIGN1YmljSW4odCkge1xuICAgIHJldHVybiB0ICogdCAqIHQ7XG59XG5mdW5jdGlvbiBjdWJpY091dCh0KSB7XG4gICAgY29uc3QgZiA9IHQgLSAxLjA7XG4gICAgcmV0dXJuIGYgKiBmICogZiArIDEuMDtcbn1cbmZ1bmN0aW9uIGVsYXN0aWNJbk91dCh0KSB7XG4gICAgcmV0dXJuIHQgPCAwLjVcbiAgICAgICAgPyAwLjUgKlxuICAgICAgICAgICAgTWF0aC5zaW4oKCgrMTMuMCAqIE1hdGguUEkpIC8gMikgKiAyLjAgKiB0KSAqXG4gICAgICAgICAgICBNYXRoLnBvdygyLjAsIDEwLjAgKiAoMi4wICogdCAtIDEuMCkpXG4gICAgICAgIDogMC41ICpcbiAgICAgICAgICAgIE1hdGguc2luKCgoLTEzLjAgKiBNYXRoLlBJKSAvIDIpICogKDIuMCAqIHQgLSAxLjAgKyAxLjApKSAqXG4gICAgICAgICAgICBNYXRoLnBvdygyLjAsIC0xMC4wICogKDIuMCAqIHQgLSAxLjApKSArXG4gICAgICAgICAgICAxLjA7XG59XG5mdW5jdGlvbiBlbGFzdGljSW4odCkge1xuICAgIHJldHVybiBNYXRoLnNpbigoMTMuMCAqIHQgKiBNYXRoLlBJKSAvIDIpICogTWF0aC5wb3coMi4wLCAxMC4wICogKHQgLSAxLjApKTtcbn1cbmZ1bmN0aW9uIGVsYXN0aWNPdXQodCkge1xuICAgIHJldHVybiAoTWF0aC5zaW4oKC0xMy4wICogKHQgKyAxLjApICogTWF0aC5QSSkgLyAyKSAqIE1hdGgucG93KDIuMCwgLTEwLjAgKiB0KSArIDEuMCk7XG59XG5mdW5jdGlvbiBleHBvSW5PdXQodCkge1xuICAgIHJldHVybiB0ID09PSAwLjAgfHwgdCA9PT0gMS4wXG4gICAgICAgID8gdFxuICAgICAgICA6IHQgPCAwLjVcbiAgICAgICAgICAgID8gKzAuNSAqIE1hdGgucG93KDIuMCwgMjAuMCAqIHQgLSAxMC4wKVxuICAgICAgICAgICAgOiAtMC41ICogTWF0aC5wb3coMi4wLCAxMC4wIC0gdCAqIDIwLjApICsgMS4wO1xufVxuZnVuY3Rpb24gZXhwb0luKHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMC4wID8gdCA6IE1hdGgucG93KDIuMCwgMTAuMCAqICh0IC0gMS4wKSk7XG59XG5mdW5jdGlvbiBleHBvT3V0KHQpIHtcbiAgICByZXR1cm4gdCA9PT0gMS4wID8gdCA6IDEuMCAtIE1hdGgucG93KDIuMCwgLTEwLjAgKiB0KTtcbn1cbmZ1bmN0aW9uIHF1YWRJbk91dCh0KSB7XG4gICAgdCAvPSAwLjU7XG4gICAgaWYgKHQgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogdCAqIHQ7XG4gICAgdC0tO1xuICAgIHJldHVybiAtMC41ICogKHQgKiAodCAtIDIpIC0gMSk7XG59XG5mdW5jdGlvbiBxdWFkSW4odCkge1xuICAgIHJldHVybiB0ICogdDtcbn1cbmZ1bmN0aW9uIHF1YWRPdXQodCkge1xuICAgIHJldHVybiAtdCAqICh0IC0gMi4wKTtcbn1cbmZ1bmN0aW9uIHF1YXJ0SW5PdXQodCkge1xuICAgIHJldHVybiB0IDwgMC41XG4gICAgICAgID8gKzguMCAqIE1hdGgucG93KHQsIDQuMClcbiAgICAgICAgOiAtOC4wICogTWF0aC5wb3codCAtIDEuMCwgNC4wKSArIDEuMDtcbn1cbmZ1bmN0aW9uIHF1YXJ0SW4odCkge1xuICAgIHJldHVybiBNYXRoLnBvdyh0LCA0LjApO1xufVxuZnVuY3Rpb24gcXVhcnRPdXQodCkge1xuICAgIHJldHVybiBNYXRoLnBvdyh0IC0gMS4wLCAzLjApICogKDEuMCAtIHQpICsgMS4wO1xufVxuZnVuY3Rpb24gcXVpbnRJbk91dCh0KSB7XG4gICAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIDAuNSAqIHQgKiB0ICogdCAqIHQgKiB0O1xuICAgIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgKiB0ICsgMik7XG59XG5mdW5jdGlvbiBxdWludEluKHQpIHtcbiAgICByZXR1cm4gdCAqIHQgKiB0ICogdCAqIHQ7XG59XG5mdW5jdGlvbiBxdWludE91dCh0KSB7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiB0ICogdCAqIHQgKyAxO1xufVxuZnVuY3Rpb24gc2luZUluT3V0KHQpIHtcbiAgICByZXR1cm4gLTAuNSAqIChNYXRoLmNvcyhNYXRoLlBJICogdCkgLSAxKTtcbn1cbmZ1bmN0aW9uIHNpbmVJbih0KSB7XG4gICAgY29uc3QgdiA9IE1hdGguY29zKHQgKiBNYXRoLlBJICogMC41KTtcbiAgICBpZiAoTWF0aC5hYnModikgPCAxZS0xNClcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gMSAtIHY7XG59XG5mdW5jdGlvbiBzaW5lT3V0KHQpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4oKHQgKiBNYXRoLlBJKSAvIDIpO1xufVxuXG5leHBvcnQgeyBiYWNrSW4sIGJhY2tJbk91dCwgYmFja091dCwgYm91bmNlSW4sIGJvdW5jZUluT3V0LCBib3VuY2VPdXQsIGNpcmNJbiwgY2lyY0luT3V0LCBjaXJjT3V0LCBjdWJpY0luLCBjdWJpY0luT3V0LCBjdWJpY091dCwgZWxhc3RpY0luLCBlbGFzdGljSW5PdXQsIGVsYXN0aWNPdXQsIGV4cG9JbiwgZXhwb0luT3V0LCBleHBvT3V0LCBxdWFkSW4sIHF1YWRJbk91dCwgcXVhZE91dCwgcXVhcnRJbiwgcXVhcnRJbk91dCwgcXVhcnRPdXQsIHF1aW50SW4sIHF1aW50SW5PdXQsIHF1aW50T3V0LCBzaW5lSW4sIHNpbmVJbk91dCwgc2luZU91dCB9O1xuIiwiPHNjcmlwdD5cbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcbiAgLy9pbXBvcnQgeyBmbHkgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgcXVhZE91dCwgcXVhZEluIH0gZnJvbSAnc3ZlbHRlL2Vhc2luZyc7XG4gIC8vaW1wb3J0IExpc3QgZnJvbSBcIi4uL0xpc3RcIjtcbiAgLy9pbXBvcnQgVGV4dEZpZWxkIGZyb20gXCIuLi9UZXh0RmllbGRcIjtcbiAgaW1wb3J0IHsgQ2xhc3NCdWlsZGVyIH0gZnJvbSAnc21lbHRlL3NyYy91dGlscy9jbGFzc2VzLmpzJztcblxuICBjb25zdCBjbGFzc2VzRGVmYXVsdCA9IFwiYWJzb2x1dGUgY3Vyc29yLXBvaW50ZXJcIjtcbiAgY29uc3QgbGlzdENsYXNzZXNEZWZhdWx0ID0gXCJhYnNvbHV0ZSB0b3AtMyByb3VuZGVkIGVsZXZhdGlvbi0zIHotMjAgZGFyazpiZy1kYXJrLTUwMFwiO1xuXG5cbiAgZXhwb3J0IGxldCBvcGVuID0gZmFsc2U7XG5cbiAgZXhwb3J0IGxldCBjbGFzc2VzID0gY2xhc3Nlc0RlZmF1bHQ7XG4gIGV4cG9ydCBsZXQgbGlzdENsYXNzZXMgPSBsaXN0Q2xhc3Nlc0RlZmF1bHQ7XG5cblxuXG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKCQkcHJvcHMuY2xhc3MpO1xuXG4gICQ6IGMgPSBjYlxuICAgIC5mbHVzaCgpXG4gICAgLmFkZChjbGFzc2VzLCB0cnVlLCBjbGFzc2VzRGVmYXVsdClcbiAgICAuYWRkKCQkcHJvcHMuY2xhc3MpXG4gICAgLmdldCgpO1xuXG4gIGNvbnN0IGxjYiA9IG5ldyBDbGFzc0J1aWxkZXIobGlzdENsYXNzZXMsIGxpc3RDbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogbCA9IGxjYlxuICAgICAgLmZsdXNoKClcbiAgICAgIC5nZXQoKTtcblxuICBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcigpO1xuXG4gIGNvbnN0IGluUHJvcHMgPSB7IHk6IDEwLCBkdXJhdGlvbjogMjAwLCBlYXNpbmc6IHF1YWRJbiB9O1xuICBjb25zdCBvdXRQcm9wcyA9IHsgeTogLTEwLCBkdXJhdGlvbjogMTAwLCBlYXNpbmc6IHF1YWRPdXQsIGRlbGF5OiAxMDAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG4uYWJzbWVudXtcbiAgcG9zaXRpb246IGFic29sdXRlO1xufVxuPC9zdHlsZT5cblxuPHN2ZWx0ZTp3aW5kb3cgb246Y2xpY2s9eygpID0+IChvcGVuID0gZmFsc2UpfSAvPlxuXG48ZGl2IGNsYXNzPXtjfSBvbjpjbGlja3xzdG9wUHJvcGFnYXRpb24+XG4gIDxzbG90IG5hbWU9XCJhY3RpdmF0b3JcIiAvPlxuICB7I2lmIG9wZW59XG4gIDxzbG90IC8+XG5cbiAgICAgIHsvaWZ9XG48L2Rpdj5cbiIsIjxzY3JpcHQ+XG4gICAgaW1wb3J0IEJ1dHRvbiBmcm9tICdzbWVsdGUvc3JjL2NvbXBvbmVudHMvQnV0dG9uJztcbiAgICBpbXBvcnQgTWVudVVzZXIgZnJvbSAnLi9NZW51VXNlci5zdmVsdGUnO1xuICAgIGltcG9ydCB7IHNpZ25PdXQgfSBmcm9tICcuLi9maXJlYmFzZSc7XG4gICAgLy8vaW1wb3J0IExpc3QgZnJvbSAnc21lbHRlL3NyYy9jb21wb25lbnRzL0xpc3QnO1xuXG4gICAgZXhwb3J0IGxldCBkaXNwbGF5TmFtZTtcbiAgICBleHBvcnQgbGV0IHBob3RvVVJMO1xuICAgIC8vZXhwb3J0IGxldCB1aWQ7XG5cbiAgICBsZXQgb3BlbiA9IGZhbHNlO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgICBidXR0b246YWN0aXZlLFxuICAgIGJ1dHRvbjpmb2N1cyB7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgfVxuICAgIGJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lciB7XG4gICAgICAgIGJvcmRlcjogMDtcbiAgICB9XG5cbiAgICAubWVudSB7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgICAgICBtaW4td2lkdGg6IGF1dG87XG4gICAgICAgIG1heC13aWR0aDogMTRyZW07XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtMTJyZW07XG5cbiAgICAgICAgei1pbmRleDogMTAwMDtcbiAgICAgICAgcGFkZGluZzogMC41cmVtO1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICM4NTg5OGI7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCAwIHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIC1tb3otYm94LXNoYWRvdzogMCAycHggOHB4IDAgcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICAgICAgLXdlYmtpdC1ib3gtc2hhZG93OiAwIDJweCA4cHggMCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICAgICAgY29sb3I6ICNlYmViZWI7XG4gICAgfVxuICAgIC5teS0xIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICB9XG4gICAgLmZpbGwtY3VycmVudDpob3ZlciB7XG4gICAgICAgIGZpbGw6ICNmMGI5MGI7XG4gICAgfVxuPC9zdHlsZT5cblxuPE1lbnVVc2VyIGJpbmQ6b3Blbj5cblxuICAgIDxkaXYgY2xhc3M9XCJiZy1kYXJrLTQwMCBkYXJrOmJnLWRhcmstNDAwIG1lbnVcIj5cblxuICAgICAgICA8aW1nIHNyYz17cGhvdG9VUkx9IGNsYXNzPVwiaC0xMCB3LTEwIHJvdW5kZWQtZnVsbCBteC01XCIgYWx0PVwidXNlciBhdmF0YXJcIiAvPlxuICAgICAgICB7ZGlzcGxheU5hbWV9XG4gICAgICAgIDxociBjbGFzcz1cInRleHQtZGFyay03MDAgbS0yXCIgLz5cblxuICAgICAgICA8cD7QkdCw0LvQsNC90YE6IDEwMDAwMCQ8L3A+XG4gICAgICAgIDxociBjbGFzcz1cInRleHQtZGFyay03MDAgbS0yXCIgLz5cbiAgICAgICAgPGEgaHJlZj1cInNldHRpbmdzXCI+0J3QsNGB0YLRgNC+0LnQutC4PC9hPlxuICAgICAgICA8YnIgLz5cbiAgICAgICAgPGJyIC8+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJiZy1wcmltYXJ5LTUwMCBob3ZlcjpiZy1wcmltYXJ5LTMwMCByb3VuZGVkLWxnIHB4LTRcIiBvbjpjbGljaz17c2lnbk91dH0+XG4gICAgICAgICAgICBMb2dvdXRcbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBzbG90PVwiYWN0aXZhdG9yXCIgY2xhc3M9XCJteS0xXCI+XG4gICAgICAgIDxidXR0b24gb246Y2xpY2s9eygpID0+IChvcGVuID0gIW9wZW4pfT5cbiAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJmaWxsLWN1cnJlbnQgdy02IGgtNlwiIHZpZXdCb3g9XCIwIDAgMjAgMjBcIj5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgZD1cIk0xMCA5YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2em0tNyA5YTcgNyAwIDExMTQgMEgzelwiXG4gICAgICAgICAgICAgICAgICAgIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuPC9NZW51VXNlcj5cbiIsIjxzY3JpcHQ+XG4gICAgaW1wb3J0IHsgc2lnbkluV2l0aEdvb2dsZSB9IGZyb20gJy4uL2ZpcmViYXNlJztcbiAgICBpbXBvcnQgQnV0dG9uIGZyb20gJ3NtZWx0ZS9zcmMvY29tcG9uZW50cy9CdXR0b24nO1xuICAgIGV4cG9ydCBsZXQgcHJvdmlkZXI7XG48L3NjcmlwdD5cblxueyNpZiBwcm92aWRlciA9PT0gJ2dvb2dsZSd9XG4gICAgPEJ1dHRvbiBvdXRsaW5lZCBvbjpjbGljaz17c2lnbkluV2l0aEdvb2dsZX0+U2lnbiBpbjwvQnV0dG9uPlxuezplbHNlfVxuICAgIDxkaXY+Tm8gcHJvdmlkZXIgd2FzIHByb3ZpZGVkIGFzIGEgcHJvcDwvZGl2Plxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gICAgaW1wb3J0IHsgc2lnbk91dCB9IGZyb20gJy4uL2ZpcmViYXNlJztcbiAgICBpbXBvcnQgeyBhdXRoU3RvcmUgfSBmcm9tICcuLi9zdG9yZXMvYXV0aCc7XG4gICAgaW1wb3J0IFByb2ZpbGUgZnJvbSAnLi9Qcm9maWxlLnN2ZWx0ZSc7XG4gICAgaW1wb3J0IFNpZ25JbkJ1dHRvbiBmcm9tICcuL1NpZ25JbkJ1dHRvbi5zdmVsdGUnO1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgICAua25vYiB7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgfVxuICAgIC5tdG10IHtcbiAgICAgICAgbWFyZ2luLXRvcDogLTEuMXJlbTtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAycmVtO1xuICAgIH1cbjwvc3R5bGU+XG5cbjxzZWN0aW9uIGNsYXNzPVwia25vYlwiPlxuICAgIHsjaWYgJGF1dGhTdG9yZS5zdGF0dXMgPT09ICdpbid9XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtdG10XCI+XG4gICAgICAgICAgICA8UHJvZmlsZSB7Li4uJGF1dGhTdG9yZS51c2VyfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICB7OmVsc2V9XG4gICAgICAgIDxTaWduSW5CdXR0b24gcHJvdmlkZXI9eydnb29nbGUnfSAvPlxuICAgIHsvaWZ9XG48L3NlY3Rpb24+XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcblxuZXhwb3J0IGxldCBkYXJrTW9kZTtcblxuZnVuY3Rpb24gaXNEYXJrVGhlbWUoKSB7XG4gIGlmICghd2luZG93Lm1hdGNoTWVkaWEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXJrKHZhbHVlID0gZmFsc2UsIGJvZHlDbGFzc2VzID0gXCJtb2RlLWRhcmtcIikge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIHdyaXRhYmxlKHZhbHVlKTtcblxuICBpZiAoIWRhcmtNb2RlKSB7XG4gICAgZGFya01vZGUgPSB3cml0YWJsZSh2YWx1ZSB8fCBpc0RhcmtUaGVtZSgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3Vic2NyaWJlOiBkYXJrTW9kZS5zdWJzY3JpYmUsXG4gICAgc2V0OiB2ID0+IHtcbiAgICAgIGJvZHlDbGFzc2VzLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAodikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkYXJrTW9kZS5zZXQodik7XG4gICAgfVxuICB9O1xufVxuIiwiPHNjcmlwdD5cbiAgICBleHBvcnQgbGV0IHNlZ21lbnQ7XG4gICAgaW1wb3J0IExvZ2luIGZyb20gJy4uL2NvbXBvbmVudHMvTG9naW4uc3ZlbHRlJztcbiAgICBpbXBvcnQgZGFyayBmcm9tICdzbWVsdGUvc3JjL2RhcmsnO1xuXG4gICAgbGV0IGRhcmtNb2RlID0gZGFyaygpO1xuICAgIGltcG9ydCBCdXR0b24gZnJvbSAnc21lbHRlL3NyYy9jb21wb25lbnRzL0J1dHRvbic7XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAgIC5kYXJrbW9kZWtub2Ige1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgIH1cbjwvc3R5bGU+XG5cbjxuYXZcbiAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmbGV4LXdyYXAgYmctZ3JheS0zMDAgZGFyazpiZy1ncmF5LTgwMCBwLTEgZml4ZWQgdy1mdWxsXG4gICAgei0xMCB0b3AtMFwiPlxuICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBmbGV4LXNocmluay0wIHRleHQtd2hpdGUgbXItNlwiPlxuXG4gICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cInRleHQtd2hpdGUgbm8tdW5kZXJsaW5lIGhvdmVyOnRleHQtd2hpdGUgaG92ZXI6bm8tdW5kZXJsaW5lXCJcbiAgICAgICAgICAgIGFyaWEtY3VycmVudD17c2VnbWVudCA9PT0gdW5kZWZpbmVkID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgaHJlZj1cIi5cIj5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjQ1XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCI0NVwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCA0NSA0NVwiXG4gICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2NsaXAwKVwiPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJNOC45NjYzMSA4LjY1NTUyTDM2LjY1NTMgOC42NTU1MUwzNi42NTUzIDM2LjM0NDVMOC45NjYzMSAzNi4zNDQ1TDguOTY2MzFcbiAgICAgICAgICAgICAgICAgICAgICAgIDguNjU1NTJaTTM1LjI2NjMgMTguMzYxOEwzNS4yNjYzIDIxLjY5MTJIMzAuOTU1MkwzMC45NTUyIDE4LjM2MThMMzUuMjY2M1xuICAgICAgICAgICAgICAgICAgICAgICAgMTguMzYxOFpNMzUuMjY2MyAzNC45OTM3TDM1LjI2NjMgMjIuNTcxTDMwLjk1NTIgMjIuNTcxTDMwLjk1NTJcbiAgICAgICAgICAgICAgICAgICAgICAgIDI5LjcxNzNDMzAuNzMwNSAzMi42NzQ0IDMyLjYzMTYgMzQuODM5MyAzNS4yNjYzIDM0Ljk5MzdaTTI5Ljk1OTFcbiAgICAgICAgICAgICAgICAgICAgICAgIDIxLjcyOTNWMTguNDExOUwxNy4xNTY0IDE4LjQxMTlMMTcuMTU2NCAyMS43MjlMMjEuNTE5NCAyMS43MjlMMjEuNTE5NFxuICAgICAgICAgICAgICAgICAgICAgICAgMzQuOTkzN0gyNS44MjkzTDI1LjgyOTMgMjEuNzI5M0wyOS45NTkxIDIxLjcyOTNaXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjRjBCOTBCXCIgLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjQ1XCIgaGVpZ2h0PVwiNDVcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgIDwvYT5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJsZzpoaWRkZW5cIiBpZD1cIm5hdi1rbm9iXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGlkPVwibmF2LXRvZ2dsZVwiXG4gICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIHB4LTMgcHktMiBib3JkZXIgcm91bmRlZCB0ZXh0LWdyYXktNTAwIGJvcmRlci1ncmF5LTYwMFxuICAgICAgICAgICAgaG92ZXI6dGV4dC13aGl0ZSBob3Zlcjpib3JkZXItd2hpdGVcIj5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZpbGwtY3VycmVudCBoLTMgdy0zXCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgPHRpdGxlPk1lbnU8L3RpdGxlPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAzaDIwdjJIMFYzem0wIDZoMjB2MkgwVjl6bTAgNmgyMHYySDB2LTJ6XCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgZmxleC1ncm93IGxnOmZsZXggbGc6aXRlbXMtY2VudGVyIGxnOnctYXV0byBoaWRkZW4gcHQtNiBsZzpwdC0wXCJcbiAgICAgICAgaWQ9XCJuYXYtY29udGVudFwiPlxuICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXJlc2V0IGxnOmZsZXgganVzdGlmeS1lbmQgZmxleC0xIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibXItM1wiPlxuXG4gICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJpbmxpbmUtYmxvY2sgcHktMiBweC00IHRleHQtd2hpdGUgbm8tdW5kZXJsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgcmVsPVwicHJlZmV0Y2hcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e3NlZ21lbnQgPT09ICdibG9nJyA/ICdwYWdlJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICAgICAgaHJlZj1cImJsb2dcIj5cbiAgICAgICAgICAgICAgICAgICAgYmxvZ1xuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJtci0zXCI+XG4gICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJpbmxpbmUtYmxvY2sgdGV4dC13aGl0ZSBuby11bmRlcmxpbmUgaG92ZXI6dGV4dC1ncmF5LTMwMFxuICAgICAgICAgICAgICAgICAgICBob3Zlcjp0ZXh0LXVuZGVybGluZSBweS0yIHB4LTRcIlxuICAgICAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e3NlZ21lbnQgPT09ICdhYm91dCcgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgIGhyZWY9XCJhYm91dFwiPlxuICAgICAgICAgICAgICAgICAgICBhYm91dFxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJtci0zXCI+XG4gICAgICAgICAgICAgICAgPExvZ2luIC8+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibXItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkYXJrbW9kZWtub2JcIj5cbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBiaW5kOnZhbHVlPXskZGFya01vZGV9IG91dGxpbmVkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWxnIGxlYWRpbmctbm9uZVwiPiYjOTY4MDs8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBocmVmPVwic2V0dGluZ3NcIiBvdXRsaW5lZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC0yeGwgbGVhZGluZy1ub25lXCI+JiM5ODgxOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgIDwvZGl2PlxuPC9uYXY+XG4iLCJpbXBvcnQgeyBjdWJpY0luT3V0LCBsaW5lYXIsIGN1YmljT3V0IH0gZnJvbSAnLi4vZWFzaW5nJztcbmltcG9ydCB7IGlzX2Z1bmN0aW9uLCBhc3NpZ24gfSBmcm9tICcuLi9pbnRlcm5hbCc7XG5cbi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG5mdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cblxuZnVuY3Rpb24gYmx1cihub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljSW5PdXQsIGFtb3VudCA9IDUsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCBmID0gc3R5bGUuZmlsdGVyID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLmZpbHRlcjtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9OyBmaWx0ZXI6ICR7Zn0gYmx1cigke3UgKiBhbW91bnR9cHgpO2BcbiAgICB9O1xufVxuZnVuY3Rpb24gZmFkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGxpbmVhciB9KSB7XG4gICAgY29uc3QgbyA9ICtnZXRDb21wdXRlZFN0eWxlKG5vZGUpLm9wYWNpdHk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsYXksXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBlYXNpbmcsXG4gICAgICAgIGNzczogdCA9PiBgb3BhY2l0eTogJHt0ICogb31gXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGZseShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCB4ID0gMCwgeSA9IDAsIG9wYWNpdHkgPSAwIH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgIGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6ICh0LCB1KSA9PiBgXG5cdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHsoMSAtIHQpICogeH1weCwgJHsoMSAtIHQpICogeX1weCk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9YFxuICAgIH07XG59XG5mdW5jdGlvbiBzbGlkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0IH0pIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuICAgIGNvbnN0IGhlaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUuaGVpZ2h0KTtcbiAgICBjb25zdCBwYWRkaW5nX3RvcCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCk7XG4gICAgY29uc3QgcGFkZGluZ19ib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pO1xuICAgIGNvbnN0IG1hcmdpbl90b3AgPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblRvcCk7XG4gICAgY29uc3QgbWFyZ2luX2JvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKTtcbiAgICBjb25zdCBib3JkZXJfdG9wX3dpZHRoID0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCk7XG4gICAgY29uc3QgYm9yZGVyX2JvdHRvbV93aWR0aCA9IHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6IHQgPT4gYG92ZXJmbG93OiBoaWRkZW47YCArXG4gICAgICAgICAgICBgb3BhY2l0eTogJHtNYXRoLm1pbih0ICogMjAsIDEpICogb3BhY2l0eX07YCArXG4gICAgICAgICAgICBgaGVpZ2h0OiAke3QgKiBoZWlnaHR9cHg7YCArXG4gICAgICAgICAgICBgcGFkZGluZy10b3A6ICR7dCAqIHBhZGRpbmdfdG9wfXB4O2AgK1xuICAgICAgICAgICAgYHBhZGRpbmctYm90dG9tOiAke3QgKiBwYWRkaW5nX2JvdHRvbX1weDtgICtcbiAgICAgICAgICAgIGBtYXJnaW4tdG9wOiAke3QgKiBtYXJnaW5fdG9wfXB4O2AgK1xuICAgICAgICAgICAgYG1hcmdpbi1ib3R0b206ICR7dCAqIG1hcmdpbl9ib3R0b219cHg7YCArXG4gICAgICAgICAgICBgYm9yZGVyLXRvcC13aWR0aDogJHt0ICogYm9yZGVyX3RvcF93aWR0aH1weDtgICtcbiAgICAgICAgICAgIGBib3JkZXItYm90dG9tLXdpZHRoOiAke3QgKiBib3JkZXJfYm90dG9tX3dpZHRofXB4O2BcbiAgICB9O1xufVxuZnVuY3Rpb24gc2NhbGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgc3RhcnQgPSAwLCBvcGFjaXR5ID0gMCB9KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgIGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICBjb25zdCBzZCA9IDEgLSBzdGFydDtcbiAgICBjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgY3NzOiAoX3QsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHNjYWxlKCR7MSAtIChzZCAqIHUpfSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gKG9kICogdSl9XG5cdFx0YFxuICAgIH07XG59XG5mdW5jdGlvbiBkcmF3KG5vZGUsIHsgZGVsYXkgPSAwLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZyA9IGN1YmljSW5PdXQgfSkge1xuICAgIGNvbnN0IGxlbiA9IG5vZGUuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICBpZiAoZHVyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoc3BlZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSA4MDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IGxlbiAvIHNwZWVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uKGxlbik7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBjc3M6ICh0LCB1KSA9PiBgc3Ryb2tlLWRhc2hhcnJheTogJHt0ICogbGVufSAke3UgKiBsZW59YFxuICAgIH07XG59XG5mdW5jdGlvbiBjcm9zc2ZhZGUoX2EpIHtcbiAgICB2YXIgeyBmYWxsYmFjayB9ID0gX2EsIGRlZmF1bHRzID0gX19yZXN0KF9hLCBbXCJmYWxsYmFja1wiXSk7XG4gICAgY29uc3QgdG9fcmVjZWl2ZSA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCB0b19zZW5kID0gbmV3IE1hcCgpO1xuICAgIGZ1bmN0aW9uIGNyb3NzZmFkZShmcm9tLCBub2RlLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gZCA9PiBNYXRoLnNxcnQoZCkgKiAzMCwgZWFzaW5nID0gY3ViaWNPdXQgfSA9IGFzc2lnbihhc3NpZ24oe30sIGRlZmF1bHRzKSwgcGFyYW1zKTtcbiAgICAgICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBkeCA9IGZyb20ubGVmdCAtIHRvLmxlZnQ7XG4gICAgICAgIGNvbnN0IGR5ID0gZnJvbS50b3AgLSB0by50b3A7XG4gICAgICAgIGNvbnN0IGR3ID0gZnJvbS53aWR0aCAvIHRvLndpZHRoO1xuICAgICAgICBjb25zdCBkaCA9IGZyb20uaGVpZ2h0IC8gdG8uaGVpZ2h0O1xuICAgICAgICBjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICBjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZWxheSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBpc19mdW5jdGlvbihkdXJhdGlvbikgPyBkdXJhdGlvbihkKSA6IGR1cmF0aW9uLFxuICAgICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgICAgY3NzOiAodCwgdSkgPT4gYFxuXHRcdFx0XHRvcGFjaXR5OiAke3QgKiBvcGFjaXR5fTtcblx0XHRcdFx0dHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7XG5cdFx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke3UgKiBkeH1weCwke3UgKiBkeX1weCkgc2NhbGUoJHt0ICsgKDEgLSB0KSAqIGR3fSwgJHt0ICsgKDEgLSB0KSAqIGRofSk7XG5cdFx0XHRgXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyYW5zaXRpb24oaXRlbXMsIGNvdW50ZXJwYXJ0cywgaW50cm8pIHtcbiAgICAgICAgcmV0dXJuIChub2RlLCBwYXJhbXMpID0+IHtcbiAgICAgICAgICAgIGl0ZW1zLnNldChwYXJhbXMua2V5LCB7XG4gICAgICAgICAgICAgICAgcmVjdDogbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudGVycGFydHMuaGFzKHBhcmFtcy5rZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVjdCB9ID0gY291bnRlcnBhcnRzLmdldChwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgY291bnRlcnBhcnRzLmRlbGV0ZShwYXJhbXMua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyb3NzZmFkZShyZWN0LCBub2RlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbm9kZSBpcyBkaXNhcHBlYXJpbmcgYWx0b2dldGhlclxuICAgICAgICAgICAgICAgIC8vIChpLmUuIHdhc24ndCBjbGFpbWVkIGJ5IHRoZSBvdGhlciBsaXN0KVxuICAgICAgICAgICAgICAgIC8vIHRoZW4gd2UgbmVlZCB0byBzdXBwbHkgYW4gb3V0cm9cbiAgICAgICAgICAgICAgICBpdGVtcy5kZWxldGUocGFyYW1zLmtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbGxiYWNrICYmIGZhbGxiYWNrKG5vZGUsIHBhcmFtcywgaW50cm8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdHJhbnNpdGlvbih0b19zZW5kLCB0b19yZWNlaXZlLCBmYWxzZSksXG4gICAgICAgIHRyYW5zaXRpb24odG9fcmVjZWl2ZSwgdG9fc2VuZCwgdHJ1ZSlcbiAgICBdO1xufVxuXG5leHBvcnQgeyBibHVyLCBjcm9zc2ZhZGUsIGRyYXcsIGZhZGUsIGZseSwgc2NhbGUsIHNsaWRlIH07XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSBcInN2ZWx0ZS90cmFuc2l0aW9uXCI7XG4gIGltcG9ydCB7IHF1YWRPdXQsIHF1YWRJbiB9IGZyb20gXCJzdmVsdGUvZWFzaW5nXCI7XG5cbiAgZXhwb3J0IGxldCBvcGFjaXR5ID0gMC41O1xuICBleHBvcnQgbGV0IGluUHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZEluIH07XG4gIGV4cG9ydCBsZXQgb3V0UHJvcHMgPSB7IGR1cmF0aW9uOiAyMDAsIGVhc2luZzogcXVhZE91dCB9O1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJiZy1ibGFjayBmaXhlZCB0b3AtMCBsZWZ0LTAgei0xMCB3LWZ1bGwgaC1mdWxsXCJcbiAgc3R5bGU9XCJvcGFjaXR5OiB7b3BhY2l0eX1cIlxuICBpbjpmYWRlPXtpblByb3BzfVxuICBvdXQ6ZmFkZT17b3V0UHJvcHN9XG4gIG9uOmNsaWNrIC8+XG4iLCJpbXBvcnQgc2NyaW0gZnJvbSBcIi4vU2NyaW0uc3ZlbHRlXCI7XG5pbXBvcnQgc3BhY2VyIGZyb20gXCIuL1NwYWNlci5zdmVsdGVcIjtcblxuZXhwb3J0IGNvbnN0IFNjcmltID0gc2NyaW07XG5leHBvcnQgY29uc3QgU3BhY2VyID0gc3BhY2VyO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFNjcmltLFxuICBTcGFjZXJcbn07XG4iLCJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gXCJzdmVsdGUvc3RvcmVcIjtcbmltcG9ydCB7IG9uRGVzdHJveSB9IGZyb20gXCJzdmVsdGVcIjtcblxuZnVuY3Rpb24gZGVmYXVsdENhbGMod2lkdGgpIHtcbiAgaWYgKHdpZHRoID4gMTI3OSkge1xuICAgIHJldHVybiBcInhsXCI7XG4gIH1cbiAgaWYgKHdpZHRoID4gMTAyMykge1xuICAgIHJldHVybiBcImxnXCI7XG4gIH1cbiAgaWYgKHdpZHRoID4gNzY3KSB7XG4gICAgcmV0dXJuIFwibWRcIjtcbiAgfVxuICByZXR1cm4gXCJzbVwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBicmVha3BvaW50KGNhbGNCcmVha3BvaW50ID0gZGVmYXVsdENhbGMpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiB3cml0YWJsZShcInNtXCIpO1xuXG4gIGNvbnN0IHN0b3JlID0gd3JpdGFibGUoY2FsY0JyZWFrcG9pbnQod2luZG93LmlubmVyV2lkdGgpKTtcblxuICBjb25zdCBvblJlc2l6ZSA9ICh7IHRhcmdldCB9KSA9PiBzdG9yZS5zZXQoY2FsY0JyZWFrcG9pbnQodGFyZ2V0LmlubmVyV2lkdGgpKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG4gIG9uRGVzdHJveSgoKSA9PiB3aW5kb3cucmVtb3ZlTGlzdGVuZXIob25SZXNpemUpKTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3RvcmUuc3Vic2NyaWJlXG4gIH07XG59XG4iLCI8c2NyaXB0PlxuICBpbXBvcnQgeyBmbHkgfSBmcm9tIFwic3ZlbHRlL3RyYW5zaXRpb25cIjtcbiAgaW1wb3J0IHsgcXVhZEluIH0gZnJvbSBcInN2ZWx0ZS9lYXNpbmdcIjtcbiAgaW1wb3J0IHsgU2NyaW0gfSBmcm9tIFwiLi4vVXRpbFwiO1xuICBpbXBvcnQgYnJlYWtwb2ludHMgZnJvbSBcIi4uLy4uL2JyZWFrcG9pbnRzXCI7XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cbiAgY29uc3QgYnAgPSBicmVha3BvaW50cygpO1xuXG4gIGNvbnN0IGNsYXNzZXNEZWZhdWx0ID0gXCJmaXhlZCB0b3AtMCBtZDptdC0xNiB3LWF1dG8gZHJhd2VyIG92ZXJmbG93LWhpZGRlbiBoLWZ1bGxcIjtcbiAgY29uc3QgbmF2Q2xhc3Nlc0RlZmF1bHQgPSBgaC1mdWxsIHctZnVsbCBiZy13aGl0ZSBkYXJrOmJnLWdyYXktOTAwIGRhcms6dGV4dC1ncmF5LTIwMCBhYnNvbHV0ZSBmbGV4IHctYXV0byB6LTIwIGRyYXdlclxuICAgIHBvaW50ZXItZXZlbnRzLWF1dG8gb3ZlcmZsb3cteS1hdXRvYDtcblxuICBleHBvcnQgbGV0IHJpZ2h0ID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgcGVyc2lzdGVudCA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGVsZXZhdGlvbiA9IHRydWU7XG4gIGV4cG9ydCBsZXQgc2hvdyA9IHRydWU7XG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuICBleHBvcnQgbGV0IG5hdkNsYXNzZXMgPSBuYXZDbGFzc2VzRGVmYXVsdDtcbiAgZXhwb3J0IGxldCBib3JkZXJDbGFzc2VzID0gYGJvcmRlci1ncmF5LTYwMCAke3JpZ2h0ID8gXCJib3JkZXItbFwiIDogXCJib3JkZXItclwifWA7XG5cblxuXG5cbiAgZXhwb3J0IGxldCB0cmFuc2l0aW9uUHJvcHMgPSB7XG4gICAgZHVyYXRpb246IDIwMCxcbiAgICB4OiAtMzAwLFxuICAgIGVhc2luZzogcXVhZEluLFxuICAgIG9wYWNpdHk6IDEsXG4gIH07XG5cbiAgJDogdHJhbnNpdGlvblByb3BzLnggPSByaWdodCA/IDMwMCA6IC0zMDA7XG4gICQ6IHBlcnNpc3RlbnQgPSBzaG93ID0gJGJwICE9PSBcInNtXCI7XG5cbiAgY29uc3QgY2IgPSBuZXcgQ2xhc3NCdWlsZGVyKGNsYXNzZXMsIGNsYXNzZXNEZWZhdWx0KTtcblxuICBpZiAoJGJwID09PSAnc20nKSBzaG93ID0gZmFsc2U7XG5cbiAgJDogYyA9IGNiXG4gICAgLmZsdXNoKClcbiAgICAuYWRkKGNsYXNzZXMsIHRydWUsIGNsYXNzZXNEZWZhdWx0KVxuICAgIC5hZGQoYm9yZGVyQ2xhc3NlcywgIWVsZXZhdGlvbiAmJiBwZXJzaXN0ZW50KVxuICAgIC5hZGQoJCRwcm9wcy5jbGFzcylcbiAgICAuYWRkKFwicmlnaHQtMFwiLCByaWdodClcbiAgICAuYWRkKFwibGVmdC0wXCIsICFyaWdodClcbiAgICAuYWRkKFwicG9pbnRlci1ldmVudHMtbm9uZVwiLCBwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJ6LTUwXCIsICFwZXJzaXN0ZW50KVxuICAgIC5hZGQoXCJlbGV2YXRpb24tNFwiLCBlbGV2YXRpb24pXG4gICAgLmFkZChcInotMjBcIiwgcGVyc2lzdGVudClcbiAgICAuZ2V0KCk7XG5cbiAgY29uc3QgbmNiID0gbmV3IENsYXNzQnVpbGRlcihuYXZDbGFzc2VzLCBuYXZDbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogbiA9IG5jYlxuICAgIC5mbHVzaCgpXG4gICAgLmdldCgpO1xuXG48L3NjcmlwdD5cblxuPHN0eWxlPlxuICAuZHJhd2VyIHtcbiAgICBtaW4td2lkdGg6IDI1MHB4O1xuICB9XG5cbiAgYXNpZGUge1xuICAgIGhlaWdodDogMTAwdmg7XG4gIH1cbjwvc3R5bGU+XG5cbnsjaWYgc2hvd31cbiAgPGFzaWRlXG4gICAgY2xhc3M9e2N9XG4gICAgdHJhbnNpdGlvbjpmbHk9e3RyYW5zaXRpb25Qcm9wc31cbiAgPlxuICAgIHsjaWYgIXBlcnNpc3RlbnR9XG4gICAgICA8U2NyaW0gb246Y2xpY2s9eygpID0+IHNob3cgPSBmYWxzZX0gLz5cbiAgICB7L2lmfVxuICAgIDxuYXZcbiAgICAgIHJvbGU9XCJuYXZpZ2F0aW9uXCJcbiAgICAgIGNsYXNzPXtufVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3LWZ1bGxcIj5cbiAgICAgICAgPHNsb3QgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmF2PlxuICA8L2FzaWRlPlxuey9pZn1cbiIsIjxzY3JpcHQ+XG4gIGltcG9ydCB7IENsYXNzQnVpbGRlciB9IGZyb20gXCIuLi8uLi91dGlscy9jbGFzc2VzLmpzXCI7XG5cblxuXG5cbiAgbGV0IGNsYXNzZXNEZWZhdWx0ID1cbiAgICBcImZpeGVkIHRvcC0wIHctZnVsbCBpdGVtcy1jZW50ZXIgZmxleC13cmFwIGZsZXggbGVmdC0wIHotMzAgcC0wIGgtMTYgZWxldmF0aW9uLTMgYmctcHJpbWFyeS0zMDAgZGFyazpiZy1kYXJrLTYwMFwiO1xuXG4gIGV4cG9ydCBsZXQgY2xhc3NlcyA9IGNsYXNzZXNEZWZhdWx0O1xuXG4gIGNvbnN0IGNiID0gbmV3IENsYXNzQnVpbGRlcihjbGFzc2VzLCBjbGFzc2VzRGVmYXVsdCk7XG5cbiAgJDogYyA9IGNiLmZsdXNoKCkuYWRkKCQkcHJvcHMuY2xhc3MpLmdldCgpO1xuPC9zY3JpcHQ+XG5cbjxoZWFkZXIgY2xhc3M9e2N9PlxuICA8c2xvdCAvPlxuPC9oZWFkZXI+XG4iLCJcbjxzY3JpcHQ+XG5cbi8vY29uc29sZS5sb2cocHJvY2Vzcy5lbnYuU0FQUEVSX0FQUF9IT1NUSVApO1xuXG4gICAgaW1wb3J0IHsgc3RhdGVTdG9yZSB9IGZyb20gJy4uL3N0b3Jlcy9zdGF0ZWJvdC5qcyc7XG4gICAgaW1wb3J0IHsgYXV0aFN0b3JlIH0gZnJvbSAnLi4vc3RvcmVzL2F1dGgnO1xuICAgIGltcG9ydCBOYXYgZnJvbSAnLi4vY29tcG9uZW50cy9OYXYuc3ZlbHRlJztcbiAgICBpbXBvcnQgTG9naW4gZnJvbSAnLi4vY29tcG9uZW50cy9Mb2dpbi5zdmVsdGUnO1xuICAgIGltcG9ydCBOYXZpZ2F0aW9uRHJhd2VyIGZyb20gJ3NtZWx0ZS9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uRHJhd2VyJztcbiAgICBpbXBvcnQgQXBwQmFyIGZyb20gJ3NtZWx0ZS9zcmMvY29tcG9uZW50cy9BcHBCYXInO1xuICAgIGltcG9ydCBicmVha3BvaW50cyBmcm9tICdzbWVsdGUvc3JjL2JyZWFrcG9pbnRzJztcbiAgICBleHBvcnQgbGV0IHNlZ21lbnQ7XG4gICAgY29uc3QgYnAgPSBicmVha3BvaW50cygpO1xuICAgIGltcG9ydCAnc21lbHRlL3NyYy90YWlsd2luZC5jc3MnO1xuXG4gICAgaW1wb3J0IGRhcmsgZnJvbSAnc21lbHRlL3NyYy9kYXJrJztcblxuICAgIGxldCBkYXJrTW9kZSA9IGRhcmsoKTtcbiAgICBsZXQgc2hvd3phZ2w7XG4gICAgXG4gICAgaW1wb3J0IEJ1dHRvbiBmcm9tICdzbWVsdGUvc3JjL2NvbXBvbmVudHMvQnV0dG9uJztcbiAgICAvLyBleHBvcnQgbGV0IHNlZ21lbnQ7XG5cbiAgICBmdW5jdGlvbiBzaG93dG9nbGUoKSB7XG4gICAgICAgICRzdGF0ZVN0b3JlLnNob3dtZW51ID0gISRzdGF0ZVN0b3JlLnNob3dtZW51O1xuICAgICAgICAvL2NvbnNvbGUubG9nICgkc3RhdGVTdG9yZS5zaG93KTtcbiAgICAgICAgcmV0dXJuICRzdGF0ZVN0b3JlLnNob3dtZW51O1xuICAgIH1cbiAgICBsZXQgdXJsaG9zdCA9ICdodHRwOi8vMTUyLjcwLjE2MC4xODM6MTg4MC8nO1xuICAgICRzdGF0ZVN0b3JlLnVybGhvc3QgPSB1cmxob3N0O1xuICAgIC8vbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Rhcmttb2RlJywgJ29uJyk7XG4gICAgaWYgKCRicCA9PT0gJ3NtJykgc2hvd3phZ2wgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIG1lbnVjbG9zZWlmbm90c20oKSB7XG4gICAgICAgIGlmICgkc3RhdGVTdG9yZS5zaG93bWVudSAmJiAkYnAgPT09ICdzbScpIHtcbiAgICAgICAgICAgICRzdGF0ZVN0b3JlLnNob3dtZW51ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgZnVuY3Rpb24gZ29ob21lKCkge1xuICAgICAgICAgICAgJHN0YXRlU3RvcmUucm91dCA9ICdib3RsaXN0JztcbiAgICAgICAgfVxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cbiAgICAubWVudSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgaGVpZ2h0OiAxMDB2aDtcbiAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgIzg1ODk4YjtcbiAgICB9XG4gICAgLm1lbnVsYXN0IHtcbiAgICAgICAgZmxleDogbm9uZTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAycmVtO1xuICAgIH1cbiAgICAuY2hhdHByaWdsb3Mge1xuICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBmbGV4LWdyb3c6IDI7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzg1ODk4YjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICBtYXJnaW4gOiAxcmVtO1xuICAgIH1cbiAgICAudXNlcm1lbnUge1xuICAgICAgICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbiAgICB9XG4gICAgLnJhc3R5YXpoa2Ege1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1ncm93OiAyO1xuICAgIH1cbiAgICAuYmFja2tub2Ige1xuICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgfVxuXG4gICAgLnphZ2wge1xuICAgICAgICB3aWR0aDogMTZyZW07XG4gICAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgfVxuICAgIC5tYWluZmxleCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgICAgIG1hcmdpbi10b3A6IDNyZW07XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cbiAgICAuZmlsbC1jdXJyZW50OmhvdmVyIHtcbiAgICAgICAgZmlsbDogI2YwYjkwYjtcbiAgICB9XG4gICAgLnRleHQtY3VycmVudDpob3ZlciB7XG4gICAgICAgIGNvbG9yOiAjZjBiOTBiO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBiYjBiMGM7XG4gICAgfVxuPC9zdHlsZT5cblxuPEFwcEJhciBjbGFzcz1cImJnLWdyYXktMjAwIGRhcms6YmctZGFyay01MDAgZmxleCBwLTAgZml4ZWQgdy1mdWxsIHotMTAgdG9wLTBcIj5cbiAgICA8ZGl2IGNsYXNzPVwidGV4dC13aGl0ZSBmbGV4LW5vbmVcIj5cbiAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzPVwidGV4dC13aGl0ZSBuby11bmRlcmxpbmUgaG92ZXI6dGV4dC13aGl0ZSBob3Zlcjpuby11bmRlcmxpbmVcIlxuICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtzZWdtZW50ID09PSB1bmRlZmluZWQgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICBocmVmPVwiLlwiXG4gICAgICAgICAgICBvbjpjbGljaz17Z29ob21lfT5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjQ1XCJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCI0NVwiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCA0NSA0NVwiXG4gICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2NsaXAwKVwiPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJNOC45NjYzMSA4LjY1NTUyTDM2LjY1NTMgOC42NTU1MUwzNi42NTUzIDM2LjM0NDVMOC45NjYzMSAzNi4zNDQ1TDguOTY2MzFcbiAgICAgICAgICAgICAgICAgICAgICAgIDguNjU1NTJaTTM1LjI2NjMgMTguMzYxOEwzNS4yNjYzIDIxLjY5MTJIMzAuOTU1MkwzMC45NTUyIDE4LjM2MThMMzUuMjY2M1xuICAgICAgICAgICAgICAgICAgICAgICAgMTguMzYxOFpNMzUuMjY2MyAzNC45OTM3TDM1LjI2NjMgMjIuNTcxTDMwLjk1NTIgMjIuNTcxTDMwLjk1NTJcbiAgICAgICAgICAgICAgICAgICAgICAgIDI5LjcxNzNDMzAuNzMwNSAzMi42NzQ0IDMyLjYzMTYgMzQuODM5MyAzNS4yNjYzIDM0Ljk5MzdaTTI5Ljk1OTFcbiAgICAgICAgICAgICAgICAgICAgICAgIDIxLjcyOTNWMTguNDExOUwxNy4xNTY0IDE4LjQxMTlMMTcuMTU2NCAyMS43MjlMMjEuNTE5NCAyMS43MjlMMjEuNTE5NFxuICAgICAgICAgICAgICAgICAgICAgICAgMzQuOTkzN0gyNS44MjkzTDI1LjgyOTMgMjEuNzI5M0wyOS45NTkxIDIxLjcyOTNaXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjRjBCOTBCXCIgLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjQ1XCIgaGVpZ2h0PVwiNDVcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgIDwvYT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicHItMiBmbGV4LW5vbmVcIj5cbiAgICAgICAgPGRpdiBvbjpjbGljaz17c2hvd3RvZ2xlfT5cbiAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZpbGwtY3VycmVudCBoLTYgdy02XCJcbiAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgPHRpdGxlPk1lbnU8L3RpdGxlPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMCAzaDIwdjJIMFYzem0wIDZoMjB2MkgwVjl6bTAgNmgyMHYySDB2LTJ6XCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZmxleC1ncm93IHRleHQtY2VudGVyXCI+eyRzdGF0ZVN0b3JlLnNlbGVjdGJvdG5hbWV9IDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInVzZXJtZW51IGZsZXgtbm9uZVwiPlxuICAgICAgICA8TG9naW4gLz5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJmbGV4LW5vbmVcIj5cbiAgICAgICAgPEJ1dHRvbiBiaW5kOnZhbHVlPXskZGFya01vZGV9IGNsYXNzPVwibXItMiBtbC0yXCI+XG4gICAgICAgICAgICA8c3ZnXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJmaWxsLWN1cnJlbnQgdy02IGgtNlwiXG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyMCAyMFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICBkPVwiTTEwIDJhMSAxIDAgMDExIDF2MWExIDEgMCAxMS0yIDBWM2ExIDEgMCAwMTEtMXptNCA4YTQgNCAwIDExLTggMCA0IDQgMCAwMThcbiAgICAgICAgICAgICAgICAgICAgMHptLS40NjQgNC45NWwuNzA3LjcwN2ExIDEgMCAwMDEuNDE0LTEuNDE0bC0uNzA3LS43MDdhMSAxIDAgMDAtMS40MTRcbiAgICAgICAgICAgICAgICAgICAgMS40MTR6bTIuMTItMTAuNjA3YTEgMSAwIDAxMCAxLjQxNGwtLjcwNi43MDdhMSAxIDAgMTEtMS40MTQtMS40MTRsLjcwNy0uNzA3YTEgMVxuICAgICAgICAgICAgICAgICAgICAwIDAxMS40MTQgMHpNMTcgMTFhMSAxIDAgMTAwLTJoLTFhMSAxIDAgMTAwIDJoMXptLTcgNGExIDEgMCAwMTEgMXYxYTEgMSAwIDExLTJcbiAgICAgICAgICAgICAgICAgICAgMHYtMWExIDEgMCAwMTEtMXpNNS4wNSA2LjQ2NEExIDEgMCAxMDYuNDY1IDUuMDVsLS43MDgtLjcwN2ExIDEgMCAwMC0xLjQxNFxuICAgICAgICAgICAgICAgICAgICAxLjQxNGwuNzA3LjcwN3ptMS40MTQgOC40ODZsLS43MDcuNzA3YTEgMSAwIDAxLTEuNDE0LTEuNDE0bC43MDctLjcwN2ExIDEgMFxuICAgICAgICAgICAgICAgICAgICAwMTEuNDE0IDEuNDE0ek00IDExYTEgMSAwIDEwMC0ySDNhMSAxIDAgMDAwIDJoMXpcIlxuICAgICAgICAgICAgICAgICAgICBjbGlwLXJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICA8L2Rpdj5cblxuPC9BcHBCYXI+XG48TmF2aWdhdGlvbkRyYXdlciBjbGFzcz1cImJnLWdyYXktMjAwIGRhcms6YmctYmxhY2tcIiBiaW5kOnNob3c9eyRzdGF0ZVN0b3JlLnNob3dtZW51fSB7c2VnbWVudH0+XG4gICAgPGRpdiBjbGFzcz1cIm1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZsZXgganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgIGNsYXNzPVwidGV4dC13aGl0ZSBuby11bmRlcmxpbmUgaG92ZXI6dGV4dC13aGl0ZSBob3Zlcjpuby11bmRlcmxpbmVcIlxuICAgICAgICAgICAgICAgIGFyaWEtY3VycmVudD17c2VnbWVudCA9PT0gdW5kZWZpbmVkID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIGhyZWY9XCIuXCI+XG4gICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjk1XCJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiOTVcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDQ1IDQ1XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgICAgIDxnIGNsaXAtcGF0aD1cInVybCgjY2xpcDApXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXAtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ9XCJNOC45NjYzMSA4LjY1NTUyTDM2LjY1NTMgOC42NTU1MUwzNi42NTUzIDM2LjM0NDVMOC45NjYzMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDM2LjM0NDVMOC45NjYzMSA4LjY1NTUyWk0zNS4yNjYzIDE4LjM2MThMMzUuMjY2MyAyMS42OTEySDMwLjk1NTJMMzAuOTU1MlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDE4LjM2MThMMzUuMjY2MyAxOC4zNjE4Wk0zNS4yNjYzIDM0Ljk5MzdMMzUuMjY2MyAyMi41NzFMMzAuOTU1MlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDIyLjU3MUwzMC45NTUyIDI5LjcxNzNDMzAuNzMwNSAzMi42NzQ0IDMyLjYzMTYgMzQuODM5MyAzNS4yNjYzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMzQuOTkzN1pNMjkuOTU5MSAyMS43MjkzVjE4LjQxMTlMMTcuMTU2NCAxOC40MTE5TDE3LjE1NjQgMjEuNzI5TDIxLjUxOTRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyMS43MjlMMjEuNTE5NCAzNC45OTM3SDI1LjgyOTNMMjUuODI5MyAyMS43MjkzTDI5Ljk1OTEgMjEuNzI5M1pcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjRjBCOTBCXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImNsaXAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCI0NVwiIGhlaWdodD1cIjQ1XCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cblxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhY2trbm9iXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBvbjpjbGljaz17c2hvd3RvZ2xlfT5cbiAgICAgICAgICAgICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmaWxsLWN1cnJlbnQgaC02IHctNlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDIwIDIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZD1cIk05LjcwNyAxNi43MDdhMSAxIDAgMDEtMS40MTQgMGwtNi02YTEgMSAwIDAxMC0xLjQxNGw2LTZhMSAxIDAgMDExLjQxNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEuNDE0TDUuNDE0IDlIMTdhMSAxIDAgMTEwIDJINS40MTRsNC4yOTMgNC4yOTNhMSAxIDAgMDEwIDEuNDE0elwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cInRleHQtY3VycmVudCBweS00IHB4LTQgZmxleC1ub25lXCJcbiAgICAgICAgICAgIGFyaWEtY3VycmVudD17c2VnbWVudCA9PT0gJ2Fib3V0JyA/ICdwYWdlJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgIGhyZWY9XCIvXCJcbiAgICAgICAgICAgIG9uOmNsaWNrPXttZW51Y2xvc2VpZm5vdHNtfT5cbiAgICAgICAgICAgINCT0LvQsNCy0L3QsNGPXG4gICAgICAgIDwvYT5cbiAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzPVwidGV4dC1jdXJyZW50IHB5LTQgcHgtNCBmbGV4LW5vbmVcIlxuICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtzZWdtZW50ID09PSAnYWJvdXQnID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgaHJlZj1cImFib3V0XCJcbiAgICAgICAgICAgIG9uOmNsaWNrPXttZW51Y2xvc2VpZm5vdHNtfT5cbiAgICAgICAgICAgINCeINC/0YDQvtCz0YDQsNC80LzQtVxuICAgICAgICA8L2E+XG5cbiAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzPVwicHktNCBweC00IHRleHQtY3VycmVudCBmbGV4LW5vbmVcIlxuICAgICAgICAgICAgcmVsPVwicHJlZmV0Y2hcIlxuICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtzZWdtZW50ID09PSAnYmxvZycgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICBocmVmPVwiYmxvZ1wiXG4gICAgICAgICAgICBvbjpjbGljaz17bWVudWNsb3NlaWZub3RzbX0+XG4gICAgICAgICAgICDQkdC70L7Qs1xuICAgICAgICA8L2E+XG5cbiAgICAgICAgeyNpZiAkYXV0aFN0b3JlLnN0YXR1cyA9PT0gJ2luJ31cbiAgICAgICAgICAgIDxociAvPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICBjbGFzcz1cInB5LTQgcHgtNCB0ZXh0LWN1cnJlbnQgZmxleC1ub25lXCJcbiAgICAgICAgICAgICAgICByZWw9XCJwcmVmZXRjaFwiXG4gICAgICAgICAgICAgICAgYXJpYS1jdXJyZW50PXtzZWdtZW50ID09PSAnYmxvZycgPyAncGFnZScgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgaHJlZj1cIi9cIlxuICAgICAgICAgICAgICAgIG9uOmNsaWNrPXttZW51Y2xvc2VpZm5vdHNtfT5cbiAgICAgICAgICAgICAgICBHUklEIExPTkcg0JHQvtGCXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgIGNsYXNzPVwicHktNCBweC00IHRleHQtY3VycmVudCBmbGV4LW5vbmVcIlxuICAgICAgICAgICAgICAgIHJlbD1cInByZWZldGNoXCJcbiAgICAgICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e3NlZ21lbnQgPT09ICdibG9nJyA/ICdwYWdlJyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICAgICAgICBocmVmPVwic2V0dGluZ3NcIlxuICAgICAgICAgICAgICAgIG9uOmNsaWNrPXttZW51Y2xvc2VpZm5vdHNtfT5cbiAgICAgICAgICAgICAgICDQndCw0YHRgtGA0L7QudC60LhcbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxociAvPlxuICAgICAgICB7L2lmfVxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyYXN0eWF6aGthXCI+Jm5ic3A7PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGF0cHJpZ2xvcyBweS00IHB4LTQgdGV4dC1jdXJyZW50IGZsZXgtbm9uZVwiPtCS0YHRgtGD0L/QsNC5INCyINC90LDRiCDRh9Cw0YIhPC9kaXY+XG4gICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cIm1lbnVsYXN0IHB5LTQgcHgtNCB0ZXh0LWN1cnJlbnQgZmxleC1ub25lXCJcbiAgICAgICAgICAgIHJlbD1cInByZWZldGNoXCJcbiAgICAgICAgICAgIGFyaWEtY3VycmVudD17c2VnbWVudCA9PT0gJ2Jsb2cnID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgaHJlZj1cImluc3RydWN0aW9uXCJcbiAgICAgICAgICAgIG9uOmNsaWNrPXttZW51Y2xvc2VpZm5vdHNtfT5cbiAgICAgICAgICAgINCY0L3RgdGC0YDRg9C60YbQuNGPXG4gICAgICAgIDwvYT5cblxuICAgIDwvZGl2PlxuPC9OYXZpZ2F0aW9uRHJhd2VyPlxuXG48ZGl2IGNsYXNzPVwibWFpbmZsZXhcIj5cblxuICAgIHsjaWYgJHN0YXRlU3RvcmUuc2hvd21lbnUgJiYgJGJwICE9ICdzbSd9XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ6YWdsXCI+Jm5ic3A7PC9kaXY+XG5cbiAgICAgICAgPHNsb3QgLz5cbiAgICB7OmVsc2V9XG4gICAgICAgIDxzbG90IC8+XG4gICAgey9pZn1cbjwvZGl2PlxuIiwiPHNjcmlwdD5cbiAgZXhwb3J0IGxldCBzdGF0dXM7XG4gIGV4cG9ydCBsZXQgZXJyb3I7XG5cbiAgY29uc3QgZGV2ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIjtcbjwvc2NyaXB0PlxuXG48c3R5bGU+XG5cbjwvc3R5bGU+XG5cbjxzdmVsdGU6aGVhZD5cbiAgPHRpdGxlPntzdGF0dXN9PC90aXRsZT5cbjwvc3ZlbHRlOmhlYWQ+XG5cbjxoMT57c3RhdHVzfTwvaDE+XG5cbjxwPntlcnJvci5tZXNzYWdlfTwvcD5cblxueyNpZiBkZXYgJiYgZXJyb3Iuc3RhY2t9XG4gIDxwcmU+e2Vycm9yLnN0YWNrfTwvcHJlPlxuey9pZn1cbiIsIjwhLS0gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSBTYXBwZXIg4oCUIGRvIG5vdCBlZGl0IGl0ISAtLT5cbjxzY3JpcHQ+XG5cdGltcG9ydCB7IHNldENvbnRleHQsIGFmdGVyVXBkYXRlIH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IHsgQ09OVEVYVF9LRVkgfSBmcm9tICcuL3NoYXJlZCc7XG5cdGltcG9ydCBMYXlvdXQgZnJvbSAnLi4vLi4vLi4vcm91dGVzL19sYXlvdXQuc3ZlbHRlJztcblx0aW1wb3J0IEVycm9yIGZyb20gJy4uLy4uLy4uL3JvdXRlcy9fZXJyb3Iuc3ZlbHRlJztcblxuXHRleHBvcnQgbGV0IHN0b3Jlcztcblx0ZXhwb3J0IGxldCBlcnJvcjtcblx0ZXhwb3J0IGxldCBzdGF0dXM7XG5cdGV4cG9ydCBsZXQgc2VnbWVudHM7XG5cdGV4cG9ydCBsZXQgbGV2ZWwwO1xuXHRleHBvcnQgbGV0IGxldmVsMSA9IG51bGw7XG5cdGV4cG9ydCBsZXQgbm90aWZ5O1xuXG5cdGFmdGVyVXBkYXRlKG5vdGlmeSk7XG5cdHNldENvbnRleHQoQ09OVEVYVF9LRVksIHN0b3Jlcyk7XG48L3NjcmlwdD5cblxuPExheW91dCBzZWdtZW50PVwie3NlZ21lbnRzWzBdfVwiIHsuLi5sZXZlbDAucHJvcHN9PlxuXHR7I2lmIGVycm9yfVxuXHRcdDxFcnJvciB7ZXJyb3J9IHtzdGF0dXN9Lz5cblx0ezplbHNlfVxuXHRcdDxzdmVsdGU6Y29tcG9uZW50IHRoaXM9XCJ7bGV2ZWwxLmNvbXBvbmVudH1cIiB7Li4ubGV2ZWwxLnByb3BzfS8+XG5cdHsvaWZ9XG48L0xheW91dD4iLCIvLyBUaGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGJ5IFNhcHBlciDigJQgZG8gbm90IGVkaXQgaXQhXG5leHBvcnQgeyBkZWZhdWx0IGFzIFJvb3QgfSBmcm9tICcuLi8uLi8uLi9yb3V0ZXMvX2xheW91dC5zdmVsdGUnO1xuZXhwb3J0IHsgcHJlbG9hZCBhcyByb290X3ByZWxvYWQgfSBmcm9tICcuL3NoYXJlZCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vcm91dGVzL19lcnJvci5zdmVsdGUnO1xuXG5leHBvcnQgY29uc3QgaWdub3JlID0gWy9eXFwvYmxvZ1xcLmpzb24kLywgL15cXC9ibG9nXFwvKFteXFwvXSs/KVxcLmpzb24kL107XG5cbmV4cG9ydCBjb25zdCBjb21wb25lbnRzID0gW1xuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9pbmRleC5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjppbmRleC5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2JvdHN0YXR1c3BhZ2Uuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6Ym90c3RhdHVzcGFnZS5zdmVsdGVfX1wiXG5cdH0sXG5cdHtcblx0XHRqczogKCkgPT4gaW1wb3J0KFwiLi4vLi4vLi4vcm91dGVzL2luc3RydWN0aW9uLnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmluc3RydWN0aW9uLnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvc2V0dGluZ3Muc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6c2V0dGluZ3Muc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9uZXdib3Quc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6bmV3Ym90LnN2ZWx0ZV9fXCJcblx0fSxcblx0e1xuXHRcdGpzOiAoKSA9PiBpbXBvcnQoXCIuLi8uLi8uLi9yb3V0ZXMvYWJvdXQuc3ZlbHRlXCIpLFxuXHRcdGNzczogXCJfX1NBUFBFUl9DU1NfUExBQ0VIT0xERVI6YWJvdXQuc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL2luZGV4LnN2ZWx0ZVwiKSxcblx0XHRjc3M6IFwiX19TQVBQRVJfQ1NTX1BMQUNFSE9MREVSOmJsb2cvaW5kZXguc3ZlbHRlX19cIlxuXHR9LFxuXHR7XG5cdFx0anM6ICgpID0+IGltcG9ydChcIi4uLy4uLy4uL3JvdXRlcy9ibG9nL1tzbHVnXS5zdmVsdGVcIiksXG5cdFx0Y3NzOiBcIl9fU0FQUEVSX0NTU19QTEFDRUhPTERFUjpibG9nL1tzbHVnXS5zdmVsdGVfX1wiXG5cdH1cbl07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXMgPSAoZCA9PiBbXG5cdHtcblx0XHQvLyBpbmRleC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcLyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDAgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gYm90c3RhdHVzcGFnZS5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2JvdHN0YXR1c3BhZ2VcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogMSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBpbnN0cnVjdGlvbi5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL2luc3RydWN0aW9uXFwvPyQvLFxuXHRcdHBhcnRzOiBbXG5cdFx0XHR7IGk6IDIgfVxuXHRcdF1cblx0fSxcblxuXHR7XG5cdFx0Ly8gc2V0dGluZ3Muc3ZlbHRlXG5cdFx0cGF0dGVybjogL15cXC9zZXR0aW5nc1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiAzIH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIG5ld2JvdC5zdmVsdGVcblx0XHRwYXR0ZXJuOiAvXlxcL25ld2JvdFxcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA0IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGFib3V0LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYWJvdXRcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdHsgaTogNSB9XG5cdFx0XVxuXHR9LFxuXG5cdHtcblx0XHQvLyBibG9nL2luZGV4LnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLz8kLyxcblx0XHRwYXJ0czogW1xuXHRcdFx0eyBpOiA2IH1cblx0XHRdXG5cdH0sXG5cblx0e1xuXHRcdC8vIGJsb2cvW3NsdWddLnN2ZWx0ZVxuXHRcdHBhdHRlcm46IC9eXFwvYmxvZ1xcLyhbXlxcL10rPylcXC8/JC8sXG5cdFx0cGFydHM6IFtcblx0XHRcdG51bGwsXG5cdFx0XHR7IGk6IDcsIHBhcmFtczogbWF0Y2ggPT4gKHsgc2x1ZzogZChtYXRjaFsxXSkgfSkgfVxuXHRcdF1cblx0fVxuXSkoZGVjb2RlVVJJQ29tcG9uZW50KTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdGltcG9ydChcIi9ob21lL3VidW50dS90aXIyLWRldi9mcm9udC9ub2RlX21vZHVsZXMvc2FwcGVyL3NhcHBlci1kZXYtY2xpZW50LmpzXCIpLnRoZW4oY2xpZW50ID0+IHtcblx0XHRjbGllbnQuY29ubmVjdCgxMDAwMCk7XG5cdH0pO1xufSIsImltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tICdzdmVsdGUnO1xuaW1wb3J0IHsgQ09OVEVYVF9LRVkgfSBmcm9tICcuL2ludGVybmFsL3NoYXJlZCc7XG5pbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vaW50ZXJuYWwvQXBwLnN2ZWx0ZSc7XG5pbXBvcnQgeyBpZ25vcmUsIHJvdXRlcywgcm9vdF9wcmVsb2FkLCBjb21wb25lbnRzLCBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4vaW50ZXJuYWwvbWFuaWZlc3QtY2xpZW50JztcblxuZnVuY3Rpb24gZ290byhocmVmLCBvcHRzID0geyByZXBsYWNlU3RhdGU6IGZhbHNlIH0pIHtcblx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldChuZXcgVVJMKGhyZWYsIGRvY3VtZW50LmJhc2VVUkkpKTtcblxuXHRpZiAodGFyZ2V0KSB7XG5cdFx0X2hpc3Rvcnlbb3B0cy5yZXBsYWNlU3RhdGUgPyAncmVwbGFjZVN0YXRlJyA6ICdwdXNoU3RhdGUnXSh7IGlkOiBjaWQgfSwgJycsIGhyZWYpO1xuXHRcdHJldHVybiBuYXZpZ2F0ZSh0YXJnZXQsIG51bGwpLnRoZW4oKCkgPT4ge30pO1xuXHR9XG5cblx0bG9jYXRpb24uaHJlZiA9IGhyZWY7XG5cdHJldHVybiBuZXcgUHJvbWlzZShmID0+IHt9KTsgLy8gbmV2ZXIgcmVzb2x2ZXNcbn1cblxuLyoqIENhbGxiYWNrIHRvIGluZm9ybSBvZiBhIHZhbHVlIHVwZGF0ZXMuICovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbmZ1bmN0aW9uIHBhZ2Vfc3RvcmUodmFsdWUpIHtcblx0Y29uc3Qgc3RvcmUgPSB3cml0YWJsZSh2YWx1ZSk7XG5cdGxldCByZWFkeSA9IHRydWU7XG5cblx0ZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRcdHJlYWR5ID0gdHJ1ZTtcblx0XHRzdG9yZS51cGRhdGUodmFsID0+IHZhbCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG5cdFx0cmVhZHkgPSBmYWxzZTtcblx0XHRzdG9yZS5zZXQobmV3X3ZhbHVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHN1YnNjcmliZShydW4pIHtcblx0XHRsZXQgb2xkX3ZhbHVlO1xuXHRcdHJldHVybiBzdG9yZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAob2xkX3ZhbHVlID09PSB1bmRlZmluZWQgfHwgKHJlYWR5ICYmIHZhbHVlICE9PSBvbGRfdmFsdWUpKSB7XG5cdFx0XHRcdHJ1bihvbGRfdmFsdWUgPSB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4geyBub3RpZnksIHNldCwgc3Vic2NyaWJlIH07XG59XG5cbmNvbnN0IGluaXRpYWxfZGF0YSA9IHR5cGVvZiBfX1NBUFBFUl9fICE9PSAndW5kZWZpbmVkJyAmJiBfX1NBUFBFUl9fO1xuXG5sZXQgcmVhZHkgPSBmYWxzZTtcbmxldCByb290X2NvbXBvbmVudDtcbmxldCBjdXJyZW50X3Rva2VuO1xubGV0IHJvb3RfcHJlbG9hZGVkO1xubGV0IGN1cnJlbnRfYnJhbmNoID0gW107XG5sZXQgY3VycmVudF9xdWVyeSA9ICd7fSc7XG5cbmNvbnN0IHN0b3JlcyA9IHtcblx0cGFnZTogcGFnZV9zdG9yZSh7fSksXG5cdHByZWxvYWRpbmc6IHdyaXRhYmxlKG51bGwpLFxuXHRzZXNzaW9uOiB3cml0YWJsZShpbml0aWFsX2RhdGEgJiYgaW5pdGlhbF9kYXRhLnNlc3Npb24pXG59O1xuXG5sZXQgJHNlc3Npb247XG5sZXQgc2Vzc2lvbl9kaXJ0eTtcblxuc3RvcmVzLnNlc3Npb24uc3Vic2NyaWJlKGFzeW5jIHZhbHVlID0+IHtcblx0JHNlc3Npb24gPSB2YWx1ZTtcblxuXHRpZiAoIXJlYWR5KSByZXR1cm47XG5cdHNlc3Npb25fZGlydHkgPSB0cnVlO1xuXG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQobmV3IFVSTChsb2NhdGlvbi5ocmVmKSk7XG5cblx0Y29uc3QgdG9rZW4gPSBjdXJyZW50X3Rva2VuID0ge307XG5cdGNvbnN0IHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfSA9IGF3YWl0IGh5ZHJhdGVfdGFyZ2V0KHRhcmdldCk7XG5cdGlmICh0b2tlbiAhPT0gY3VycmVudF90b2tlbikgcmV0dXJuOyAvLyBhIHNlY29uZGFyeSBuYXZpZ2F0aW9uIGhhcHBlbmVkIHdoaWxlIHdlIHdlcmUgbG9hZGluZ1xuXG5cdGF3YWl0IHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgdGFyZ2V0LnBhZ2UpO1xufSk7XG5cbmxldCBwcmVmZXRjaGluZ1xuXG5cbiA9IG51bGw7XG5mdW5jdGlvbiBzZXRfcHJlZmV0Y2hpbmcoaHJlZiwgcHJvbWlzZSkge1xuXHRwcmVmZXRjaGluZyA9IHsgaHJlZiwgcHJvbWlzZSB9O1xufVxuXG5sZXQgdGFyZ2V0O1xuZnVuY3Rpb24gc2V0X3RhcmdldChlbGVtZW50KSB7XG5cdHRhcmdldCA9IGVsZW1lbnQ7XG59XG5cbmxldCB1aWQgPSAxO1xuZnVuY3Rpb24gc2V0X3VpZChuKSB7XG5cdHVpZCA9IG47XG59XG5cbmxldCBjaWQ7XG5mdW5jdGlvbiBzZXRfY2lkKG4pIHtcblx0Y2lkID0gbjtcbn1cblxuY29uc3QgX2hpc3RvcnkgPSB0eXBlb2YgaGlzdG9yeSAhPT0gJ3VuZGVmaW5lZCcgPyBoaXN0b3J5IDoge1xuXHRwdXNoU3RhdGU6IChzdGF0ZSwgdGl0bGUsIGhyZWYpID0+IHt9LFxuXHRyZXBsYWNlU3RhdGU6IChzdGF0ZSwgdGl0bGUsIGhyZWYpID0+IHt9LFxuXHRzY3JvbGxSZXN0b3JhdGlvbjogJydcbn07XG5cbmNvbnN0IHNjcm9sbF9oaXN0b3J5ID0ge307XG5cbmZ1bmN0aW9uIGV4dHJhY3RfcXVlcnkoc2VhcmNoKSB7XG5cdGNvbnN0IHF1ZXJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0aWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG5cdFx0c2VhcmNoLnNsaWNlKDEpLnNwbGl0KCcmJykuZm9yRWFjaChzZWFyY2hQYXJhbSA9PiB7XG5cdFx0XHRsZXQgWywga2V5LCB2YWx1ZSA9ICcnXSA9IC8oW149XSopKD86PSguKikpPy8uZXhlYyhkZWNvZGVVUklDb21wb25lbnQoc2VhcmNoUGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykpKTtcblx0XHRcdGlmICh0eXBlb2YgcXVlcnlba2V5XSA9PT0gJ3N0cmluZycpIHF1ZXJ5W2tleV0gPSBbcXVlcnlba2V5XV07XG5cdFx0XHRpZiAodHlwZW9mIHF1ZXJ5W2tleV0gPT09ICdvYmplY3QnKSAocXVlcnlba2V5XSApLnB1c2godmFsdWUpO1xuXHRcdFx0ZWxzZSBxdWVyeVtrZXldID0gdmFsdWU7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBzZWxlY3RfdGFyZ2V0KHVybCkge1xuXHRpZiAodXJsLm9yaWdpbiAhPT0gbG9jYXRpb24ub3JpZ2luKSByZXR1cm4gbnVsbDtcblx0aWYgKCF1cmwucGF0aG5hbWUuc3RhcnRzV2l0aChpbml0aWFsX2RhdGEuYmFzZVVybCkpIHJldHVybiBudWxsO1xuXG5cdGxldCBwYXRoID0gdXJsLnBhdGhuYW1lLnNsaWNlKGluaXRpYWxfZGF0YS5iYXNlVXJsLmxlbmd0aCk7XG5cblx0aWYgKHBhdGggPT09ICcnKSB7XG5cdFx0cGF0aCA9ICcvJztcblx0fVxuXG5cdC8vIGF2b2lkIGFjY2lkZW50YWwgY2xhc2hlcyBiZXR3ZWVuIHNlcnZlciByb3V0ZXMgYW5kIHBhZ2Ugcm91dGVzXG5cdGlmIChpZ25vcmUuc29tZShwYXR0ZXJuID0+IHBhdHRlcm4udGVzdChwYXRoKSkpIHJldHVybjtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHJvdXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGNvbnN0IHJvdXRlID0gcm91dGVzW2ldO1xuXG5cdFx0Y29uc3QgbWF0Y2ggPSByb3V0ZS5wYXR0ZXJuLmV4ZWMocGF0aCk7XG5cblx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gZXh0cmFjdF9xdWVyeSh1cmwuc2VhcmNoKTtcblx0XHRcdGNvbnN0IHBhcnQgPSByb3V0ZS5wYXJ0c1tyb3V0ZS5wYXJ0cy5sZW5ndGggLSAxXTtcblx0XHRcdGNvbnN0IHBhcmFtcyA9IHBhcnQucGFyYW1zID8gcGFydC5wYXJhbXMobWF0Y2gpIDoge307XG5cblx0XHRcdGNvbnN0IHBhZ2UgPSB7IGhvc3Q6IGxvY2F0aW9uLmhvc3QsIHBhdGgsIHF1ZXJ5LCBwYXJhbXMgfTtcblxuXHRcdFx0cmV0dXJuIHsgaHJlZjogdXJsLmhyZWYsIHJvdXRlLCBtYXRjaCwgcGFnZSB9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBoYW5kbGVfZXJyb3IodXJsKSB7XG5cdGNvbnN0IHsgaG9zdCwgcGF0aG5hbWUsIHNlYXJjaCB9ID0gbG9jYXRpb247XG5cdGNvbnN0IHsgc2Vzc2lvbiwgcHJlbG9hZGVkLCBzdGF0dXMsIGVycm9yIH0gPSBpbml0aWFsX2RhdGE7XG5cblx0aWYgKCFyb290X3ByZWxvYWRlZCkge1xuXHRcdHJvb3RfcHJlbG9hZGVkID0gcHJlbG9hZGVkICYmIHByZWxvYWRlZFswXTtcblx0fVxuXG5cdGNvbnN0IHByb3BzID0ge1xuXHRcdGVycm9yLFxuXHRcdHN0YXR1cyxcblx0XHRzZXNzaW9uLFxuXHRcdGxldmVsMDoge1xuXHRcdFx0cHJvcHM6IHJvb3RfcHJlbG9hZGVkXG5cdFx0fSxcblx0XHRsZXZlbDE6IHtcblx0XHRcdHByb3BzOiB7XG5cdFx0XHRcdHN0YXR1cyxcblx0XHRcdFx0ZXJyb3Jcblx0XHRcdH0sXG5cdFx0XHRjb21wb25lbnQ6IEVycm9yQ29tcG9uZW50XG5cdFx0fSxcblx0XHRzZWdtZW50czogcHJlbG9hZGVkXG5cblx0fTtcblx0Y29uc3QgcXVlcnkgPSBleHRyYWN0X3F1ZXJ5KHNlYXJjaCk7XG5cdHJlbmRlcihudWxsLCBbXSwgcHJvcHMsIHsgaG9zdCwgcGF0aDogcGF0aG5hbWUsIHF1ZXJ5LCBwYXJhbXM6IHt9IH0pO1xufVxuXG5mdW5jdGlvbiBzY3JvbGxfc3RhdGUoKSB7XG5cdHJldHVybiB7XG5cdFx0eDogcGFnZVhPZmZzZXQsXG5cdFx0eTogcGFnZVlPZmZzZXRcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbmF2aWdhdGUodGFyZ2V0LCBpZCwgbm9zY3JvbGwsIGhhc2gpIHtcblx0aWYgKGlkKSB7XG5cdFx0Ly8gcG9wc3RhdGUgb3IgaW5pdGlhbCBuYXZpZ2F0aW9uXG5cdFx0Y2lkID0gaWQ7XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgY3VycmVudF9zY3JvbGwgPSBzY3JvbGxfc3RhdGUoKTtcblxuXHRcdC8vIGNsaWNrZWQgb24gYSBsaW5rLiBwcmVzZXJ2ZSBzY3JvbGwgc3RhdGVcblx0XHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gY3VycmVudF9zY3JvbGw7XG5cblx0XHRpZCA9IGNpZCA9ICsrdWlkO1xuXHRcdHNjcm9sbF9oaXN0b3J5W2NpZF0gPSBub3Njcm9sbCA/IGN1cnJlbnRfc2Nyb2xsIDogeyB4OiAwLCB5OiAwIH07XG5cdH1cblxuXHRjaWQgPSBpZDtcblxuXHRpZiAocm9vdF9jb21wb25lbnQpIHN0b3Jlcy5wcmVsb2FkaW5nLnNldCh0cnVlKTtcblxuXHRjb25zdCBsb2FkZWQgPSBwcmVmZXRjaGluZyAmJiBwcmVmZXRjaGluZy5ocmVmID09PSB0YXJnZXQuaHJlZiA/XG5cdFx0cHJlZmV0Y2hpbmcucHJvbWlzZSA6XG5cdFx0aHlkcmF0ZV90YXJnZXQodGFyZ2V0KTtcblxuXHRwcmVmZXRjaGluZyA9IG51bGw7XG5cblx0Y29uc3QgdG9rZW4gPSBjdXJyZW50X3Rva2VuID0ge307XG5cdGNvbnN0IHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfSA9IGF3YWl0IGxvYWRlZDtcblx0aWYgKHRva2VuICE9PSBjdXJyZW50X3Rva2VuKSByZXR1cm47IC8vIGEgc2Vjb25kYXJ5IG5hdmlnYXRpb24gaGFwcGVuZWQgd2hpbGUgd2Ugd2VyZSBsb2FkaW5nXG5cblx0YXdhaXQgcmVuZGVyKHJlZGlyZWN0LCBicmFuY2gsIHByb3BzLCB0YXJnZXQucGFnZSk7XG5cdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblxuXHRpZiAoIW5vc2Nyb2xsKSB7XG5cdFx0bGV0IHNjcm9sbCA9IHNjcm9sbF9oaXN0b3J5W2lkXTtcblxuXHRcdGlmIChoYXNoKSB7XG5cdFx0XHQvLyBzY3JvbGwgaXMgYW4gZWxlbWVudCBpZCAoZnJvbSBhIGhhc2gpLCB3ZSBuZWVkIHRvIGNvbXB1dGUgeS5cblx0XHRcdGNvbnN0IGRlZXBfbGlua2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaC5zbGljZSgxKSk7XG5cblx0XHRcdGlmIChkZWVwX2xpbmtlZCkge1xuXHRcdFx0XHRzY3JvbGwgPSB7XG5cdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHR5OiBkZWVwX2xpbmtlZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBzY3JvbGxZXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2Nyb2xsX2hpc3RvcnlbY2lkXSA9IHNjcm9sbDtcblx0XHRpZiAoc2Nyb2xsKSBzY3JvbGxUbyhzY3JvbGwueCwgc2Nyb2xsLnkpO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlbmRlcihyZWRpcmVjdCwgYnJhbmNoLCBwcm9wcywgcGFnZSkge1xuXHRpZiAocmVkaXJlY3QpIHJldHVybiBnb3RvKHJlZGlyZWN0LmxvY2F0aW9uLCB7IHJlcGxhY2VTdGF0ZTogdHJ1ZSB9KTtcblxuXHRzdG9yZXMucGFnZS5zZXQocGFnZSk7XG5cdHN0b3Jlcy5wcmVsb2FkaW5nLnNldChmYWxzZSk7XG5cblx0aWYgKHJvb3RfY29tcG9uZW50KSB7XG5cdFx0cm9vdF9jb21wb25lbnQuJHNldChwcm9wcyk7XG5cdH0gZWxzZSB7XG5cdFx0cHJvcHMuc3RvcmVzID0ge1xuXHRcdFx0cGFnZTogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wYWdlLnN1YnNjcmliZSB9LFxuXHRcdFx0cHJlbG9hZGluZzogeyBzdWJzY3JpYmU6IHN0b3Jlcy5wcmVsb2FkaW5nLnN1YnNjcmliZSB9LFxuXHRcdFx0c2Vzc2lvbjogc3RvcmVzLnNlc3Npb25cblx0XHR9O1xuXHRcdHByb3BzLmxldmVsMCA9IHtcblx0XHRcdHByb3BzOiBhd2FpdCByb290X3ByZWxvYWRlZFxuXHRcdH07XG5cdFx0cHJvcHMubm90aWZ5ID0gc3RvcmVzLnBhZ2Uubm90aWZ5O1xuXG5cdFx0Ly8gZmlyc3QgbG9hZCDigJQgcmVtb3ZlIFNTUidkIDxoZWFkPiBjb250ZW50c1xuXHRcdGNvbnN0IHN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLXN0YXJ0Jyk7XG5cdFx0Y29uc3QgZW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhcHBlci1oZWFkLWVuZCcpO1xuXG5cdFx0aWYgKHN0YXJ0ICYmIGVuZCkge1xuXHRcdFx0d2hpbGUgKHN0YXJ0Lm5leHRTaWJsaW5nICE9PSBlbmQpIGRldGFjaChzdGFydC5uZXh0U2libGluZyk7XG5cdFx0XHRkZXRhY2goc3RhcnQpO1xuXHRcdFx0ZGV0YWNoKGVuZCk7XG5cdFx0fVxuXG5cdFx0cm9vdF9jb21wb25lbnQgPSBuZXcgQXBwKHtcblx0XHRcdHRhcmdldCxcblx0XHRcdHByb3BzLFxuXHRcdFx0aHlkcmF0ZTogdHJ1ZVxuXHRcdH0pO1xuXHR9XG5cblx0Y3VycmVudF9icmFuY2ggPSBicmFuY2g7XG5cdGN1cnJlbnRfcXVlcnkgPSBKU09OLnN0cmluZ2lmeShwYWdlLnF1ZXJ5KTtcblx0cmVhZHkgPSB0cnVlO1xuXHRzZXNzaW9uX2RpcnR5ID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHBhcnRfY2hhbmdlZChpLCBzZWdtZW50LCBtYXRjaCwgc3RyaW5naWZpZWRfcXVlcnkpIHtcblx0Ly8gVE9ETyBvbmx5IGNoZWNrIHF1ZXJ5IHN0cmluZyBjaGFuZ2VzIGZvciBwcmVsb2FkIGZ1bmN0aW9uc1xuXHQvLyB0aGF0IGRvIGluIGZhY3QgZGVwZW5kIG9uIGl0ICh1c2luZyBzdGF0aWMgYW5hbHlzaXMgb3Jcblx0Ly8gcnVudGltZSBpbnN0cnVtZW50YXRpb24pXG5cdGlmIChzdHJpbmdpZmllZF9xdWVyeSAhPT0gY3VycmVudF9xdWVyeSkgcmV0dXJuIHRydWU7XG5cblx0Y29uc3QgcHJldmlvdXMgPSBjdXJyZW50X2JyYW5jaFtpXTtcblxuXHRpZiAoIXByZXZpb3VzKSByZXR1cm4gZmFsc2U7XG5cdGlmIChzZWdtZW50ICE9PSBwcmV2aW91cy5zZWdtZW50KSByZXR1cm4gdHJ1ZTtcblx0aWYgKHByZXZpb3VzLm1hdGNoKSB7XG5cdFx0aWYgKEpTT04uc3RyaW5naWZ5KHByZXZpb3VzLm1hdGNoLnNsaWNlKDEsIGkgKyAyKSkgIT09IEpTT04uc3RyaW5naWZ5KG1hdGNoLnNsaWNlKDEsIGkgKyAyKSkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxufVxuXG5hc3luYyBmdW5jdGlvbiBoeWRyYXRlX3RhcmdldCh0YXJnZXQpXG5cblxuXG4ge1xuXHRjb25zdCB7IHJvdXRlLCBwYWdlIH0gPSB0YXJnZXQ7XG5cdGNvbnN0IHNlZ21lbnRzID0gcGFnZS5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdGxldCByZWRpcmVjdCA9IG51bGw7XG5cblx0Y29uc3QgcHJvcHMgPSB7IGVycm9yOiBudWxsLCBzdGF0dXM6IDIwMCwgc2VnbWVudHM6IFtzZWdtZW50c1swXV0gfTtcblxuXHRjb25zdCBwcmVsb2FkX2NvbnRleHQgPSB7XG5cdFx0ZmV0Y2g6ICh1cmwsIG9wdHMpID0+IGZldGNoKHVybCwgb3B0cyksXG5cdFx0cmVkaXJlY3Q6IChzdGF0dXNDb2RlLCBsb2NhdGlvbikgPT4ge1xuXHRcdFx0aWYgKHJlZGlyZWN0ICYmIChyZWRpcmVjdC5zdGF0dXNDb2RlICE9PSBzdGF0dXNDb2RlIHx8IHJlZGlyZWN0LmxvY2F0aW9uICE9PSBsb2NhdGlvbikpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb25mbGljdGluZyByZWRpcmVjdHNgKTtcblx0XHRcdH1cblx0XHRcdHJlZGlyZWN0ID0geyBzdGF0dXNDb2RlLCBsb2NhdGlvbiB9O1xuXHRcdH0sXG5cdFx0ZXJyb3I6IChzdGF0dXMsIGVycm9yKSA9PiB7XG5cdFx0XHRwcm9wcy5lcnJvciA9IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBuZXcgRXJyb3IoZXJyb3IpIDogZXJyb3I7XG5cdFx0XHRwcm9wcy5zdGF0dXMgPSBzdGF0dXM7XG5cdFx0fVxuXHR9O1xuXG5cdGlmICghcm9vdF9wcmVsb2FkZWQpIHtcblx0XHRyb290X3ByZWxvYWRlZCA9IGluaXRpYWxfZGF0YS5wcmVsb2FkZWRbMF0gfHwgcm9vdF9wcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdHBhcmFtczoge31cblx0XHR9LCAkc2Vzc2lvbik7XG5cdH1cblxuXHRsZXQgYnJhbmNoO1xuXHRsZXQgbCA9IDE7XG5cblx0dHJ5IHtcblx0XHRjb25zdCBzdHJpbmdpZmllZF9xdWVyeSA9IEpTT04uc3RyaW5naWZ5KHBhZ2UucXVlcnkpO1xuXHRcdGNvbnN0IG1hdGNoID0gcm91dGUucGF0dGVybi5leGVjKHBhZ2UucGF0aCk7XG5cblx0XHRsZXQgc2VnbWVudF9kaXJ0eSA9IGZhbHNlO1xuXG5cdFx0YnJhbmNoID0gYXdhaXQgUHJvbWlzZS5hbGwocm91dGUucGFydHMubWFwKGFzeW5jIChwYXJ0LCBpKSA9PiB7XG5cdFx0XHRjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV07XG5cblx0XHRcdGlmIChwYXJ0X2NoYW5nZWQoaSwgc2VnbWVudCwgbWF0Y2gsIHN0cmluZ2lmaWVkX3F1ZXJ5KSkgc2VnbWVudF9kaXJ0eSA9IHRydWU7XG5cblx0XHRcdHByb3BzLnNlZ21lbnRzW2xdID0gc2VnbWVudHNbaSArIDFdOyAvLyBUT0RPIG1ha2UgdGhpcyBsZXNzIGNvbmZ1c2luZ1xuXHRcdFx0aWYgKCFwYXJ0KSByZXR1cm4geyBzZWdtZW50IH07XG5cblx0XHRcdGNvbnN0IGogPSBsKys7XG5cblx0XHRcdGlmICghc2Vzc2lvbl9kaXJ0eSAmJiAhc2VnbWVudF9kaXJ0eSAmJiBjdXJyZW50X2JyYW5jaFtpXSAmJiBjdXJyZW50X2JyYW5jaFtpXS5wYXJ0ID09PSBwYXJ0LmkpIHtcblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRfYnJhbmNoW2ldO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWdtZW50X2RpcnR5ID0gZmFsc2U7XG5cblx0XHRcdGNvbnN0IHsgZGVmYXVsdDogY29tcG9uZW50LCBwcmVsb2FkIH0gPSBhd2FpdCBsb2FkX2NvbXBvbmVudChjb21wb25lbnRzW3BhcnQuaV0pO1xuXG5cdFx0XHRsZXQgcHJlbG9hZGVkO1xuXHRcdFx0aWYgKHJlYWR5IHx8ICFpbml0aWFsX2RhdGEucHJlbG9hZGVkW2kgKyAxXSkge1xuXHRcdFx0XHRwcmVsb2FkZWQgPSBwcmVsb2FkXG5cdFx0XHRcdFx0PyBhd2FpdCBwcmVsb2FkLmNhbGwocHJlbG9hZF9jb250ZXh0LCB7XG5cdFx0XHRcdFx0XHRob3N0OiBwYWdlLmhvc3QsXG5cdFx0XHRcdFx0XHRwYXRoOiBwYWdlLnBhdGgsXG5cdFx0XHRcdFx0XHRxdWVyeTogcGFnZS5xdWVyeSxcblx0XHRcdFx0XHRcdHBhcmFtczogcGFydC5wYXJhbXMgPyBwYXJ0LnBhcmFtcyh0YXJnZXQubWF0Y2gpIDoge31cblx0XHRcdFx0XHR9LCAkc2Vzc2lvbilcblx0XHRcdFx0XHQ6IHt9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJlbG9hZGVkID0gaW5pdGlhbF9kYXRhLnByZWxvYWRlZFtpICsgMV07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAocHJvcHNbYGxldmVsJHtqfWBdID0geyBjb21wb25lbnQsIHByb3BzOiBwcmVsb2FkZWQsIHNlZ21lbnQsIG1hdGNoLCBwYXJ0OiBwYXJ0LmkgfSk7XG5cdFx0fSkpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHByb3BzLmVycm9yID0gZXJyb3I7XG5cdFx0cHJvcHMuc3RhdHVzID0gNTAwO1xuXHRcdGJyYW5jaCA9IFtdO1xuXHR9XG5cblx0cmV0dXJuIHsgcmVkaXJlY3QsIHByb3BzLCBicmFuY2ggfTtcbn1cblxuZnVuY3Rpb24gbG9hZF9jc3MoY2h1bmspIHtcblx0Y29uc3QgaHJlZiA9IGBjbGllbnQvJHtjaHVua31gO1xuXHRpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbGlua1tocmVmPVwiJHtocmVmfVwiXWApKSByZXR1cm47XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWwsIHJlamVjdCkgPT4ge1xuXHRcdGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG5cdFx0bGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG5cdFx0bGluay5ocmVmID0gaHJlZjtcblxuXHRcdGxpbmsub25sb2FkID0gKCkgPT4gZnVsZmlsKCk7XG5cdFx0bGluay5vbmVycm9yID0gcmVqZWN0O1xuXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRfY29tcG9uZW50KGNvbXBvbmVudClcblxuXG4ge1xuXHQvLyBUT0RPIHRoaXMgaXMgdGVtcG9yYXJ5IOKAlCBvbmNlIHBsYWNlaG9sZGVycyBhcmVcblx0Ly8gYWx3YXlzIHJld3JpdHRlbiwgc2NyYXRjaCB0aGUgdGVybmFyeVxuXHRjb25zdCBwcm9taXNlcyA9ICh0eXBlb2YgY29tcG9uZW50LmNzcyA9PT0gJ3N0cmluZycgPyBbXSA6IGNvbXBvbmVudC5jc3MubWFwKGxvYWRfY3NzKSk7XG5cdHByb21pc2VzLnVuc2hpZnQoY29tcG9uZW50LmpzKCkpO1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4odmFsdWVzID0+IHZhbHVlc1swXSk7XG59XG5cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG5cdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2goaHJlZikge1xuXHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KG5ldyBVUkwoaHJlZiwgZG9jdW1lbnQuYmFzZVVSSSkpO1xuXG5cdGlmICh0YXJnZXQpIHtcblx0XHRpZiAoIXByZWZldGNoaW5nIHx8IGhyZWYgIT09IHByZWZldGNoaW5nLmhyZWYpIHtcblx0XHRcdHNldF9wcmVmZXRjaGluZyhocmVmLCBoeWRyYXRlX3RhcmdldCh0YXJnZXQpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJlZmV0Y2hpbmcucHJvbWlzZTtcblx0fVxufVxuXG5mdW5jdGlvbiBzdGFydChvcHRzXG5cbikge1xuXHRpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBfaGlzdG9yeSkge1xuXHRcdF9oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblx0XG5cdC8vIEFkb3B0ZWQgZnJvbSBOdXh0LmpzXG5cdC8vIFJlc2V0IHNjcm9sbFJlc3RvcmF0aW9uIHRvIGF1dG8gd2hlbiBsZWF2aW5nIHBhZ2UsIGFsbG93aW5nIHBhZ2UgcmVsb2FkXG5cdC8vIGFuZCBiYWNrLW5hdmlnYXRpb24gZnJvbSBvdGhlciBwYWdlcyB0byB1c2UgdGhlIGJyb3dzZXIgdG8gcmVzdG9yZSB0aGVcblx0Ly8gc2Nyb2xsaW5nIHBvc2l0aW9uLlxuXHRhZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCAoKSA9PiB7XG5cdFx0X2hpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnYXV0byc7XG5cdH0pO1xuXG5cdC8vIFNldHRpbmcgc2Nyb2xsUmVzdG9yYXRpb24gdG8gbWFudWFsIGFnYWluIHdoZW4gcmV0dXJuaW5nIHRvIHRoaXMgcGFnZS5cblx0YWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblx0XHRfaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9KTtcblxuXHRzZXRfdGFyZ2V0KG9wdHMudGFyZ2V0KTtcblxuXHRhZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZV9jbGljayk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlX3BvcHN0YXRlKTtcblxuXHQvLyBwcmVmZXRjaFxuXHRhZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdHJpZ2dlcl9wcmVmZXRjaCk7XG5cdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZV9tb3VzZW1vdmUpO1xuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRjb25zdCB7IGhhc2gsIGhyZWYgfSA9IGxvY2F0aW9uO1xuXG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IHVpZCB9LCAnJywgaHJlZik7XG5cblx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXG5cdFx0aWYgKGluaXRpYWxfZGF0YS5lcnJvcikgcmV0dXJuIGhhbmRsZV9lcnJvcigpO1xuXG5cdFx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0X3RhcmdldCh1cmwpO1xuXHRcdGlmICh0YXJnZXQpIHJldHVybiBuYXZpZ2F0ZSh0YXJnZXQsIHVpZCwgdHJ1ZSwgaGFzaCk7XG5cdH0pO1xufVxuXG5sZXQgbW91c2Vtb3ZlX3RpbWVvdXQ7XG5cbmZ1bmN0aW9uIGhhbmRsZV9tb3VzZW1vdmUoZXZlbnQpIHtcblx0Y2xlYXJUaW1lb3V0KG1vdXNlbW92ZV90aW1lb3V0KTtcblx0bW91c2Vtb3ZlX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHR0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KTtcblx0fSwgMjApO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyX3ByZWZldGNoKGV2ZW50KSB7XG5cdGNvbnN0IGEgPSBmaW5kX2FuY2hvcihldmVudC50YXJnZXQpO1xuXHRpZiAoIWEgfHwgYS5yZWwgIT09ICdwcmVmZXRjaCcpIHJldHVybjtcblxuXHRwcmVmZXRjaChhLmhyZWYpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVfY2xpY2soZXZlbnQpIHtcblx0Ly8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzXG5cdC8vIE1JVCBsaWNlbnNlIGh0dHBzOi8vZ2l0aHViLmNvbS92aXNpb25tZWRpYS9wYWdlLmpzI2xpY2Vuc2Vcblx0aWYgKHdoaWNoKGV2ZW50KSAhPT0gMSkgcmV0dXJuO1xuXHRpZiAoZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5KSByZXR1cm47XG5cdGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cblx0Y29uc3QgYSA9IGZpbmRfYW5jaG9yKGV2ZW50LnRhcmdldCk7XG5cdGlmICghYSkgcmV0dXJuO1xuXG5cdGlmICghYS5ocmVmKSByZXR1cm47XG5cblx0Ly8gY2hlY2sgaWYgbGluayBpcyBpbnNpZGUgYW4gc3ZnXG5cdC8vIGluIHRoaXMgY2FzZSwgYm90aCBocmVmIGFuZCB0YXJnZXQgYXJlIGFsd2F5cyBpbnNpZGUgYW4gb2JqZWN0XG5cdGNvbnN0IHN2ZyA9IHR5cGVvZiBhLmhyZWYgPT09ICdvYmplY3QnICYmIGEuaHJlZi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU1ZHQW5pbWF0ZWRTdHJpbmcnO1xuXHRjb25zdCBocmVmID0gU3RyaW5nKHN2ZyA/IChhKS5ocmVmLmJhc2VWYWwgOiBhLmhyZWYpO1xuXG5cdGlmIChocmVmID09PSBsb2NhdGlvbi5ocmVmKSB7XG5cdFx0aWYgKCFsb2NhdGlvbi5oYXNoKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIElnbm9yZSBpZiB0YWcgaGFzXG5cdC8vIDEuICdkb3dubG9hZCcgYXR0cmlidXRlXG5cdC8vIDIuIHJlbD0nZXh0ZXJuYWwnIGF0dHJpYnV0ZVxuXHRpZiAoYS5oYXNBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgYS5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSAnZXh0ZXJuYWwnKSByZXR1cm47XG5cblx0Ly8gSWdub3JlIGlmIDxhPiBoYXMgYSB0YXJnZXRcblx0aWYgKHN2ZyA/IChhKS50YXJnZXQuYmFzZVZhbCA6IGEudGFyZ2V0KSByZXR1cm47XG5cblx0Y29uc3QgdXJsID0gbmV3IFVSTChocmVmKTtcblxuXHQvLyBEb24ndCBoYW5kbGUgaGFzaCBjaGFuZ2VzXG5cdGlmICh1cmwucGF0aG5hbWUgPT09IGxvY2F0aW9uLnBhdGhuYW1lICYmIHVybC5zZWFyY2ggPT09IGxvY2F0aW9uLnNlYXJjaCkgcmV0dXJuO1xuXG5cdGNvbnN0IHRhcmdldCA9IHNlbGVjdF90YXJnZXQodXJsKTtcblx0aWYgKHRhcmdldCkge1xuXHRcdGNvbnN0IG5vc2Nyb2xsID0gYS5oYXNBdHRyaWJ1dGUoJ3NhcHBlci1ub3Njcm9sbCcpO1xuXHRcdG5hdmlnYXRlKHRhcmdldCwgbnVsbCwgbm9zY3JvbGwsIHVybC5oYXNoKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdF9oaXN0b3J5LnB1c2hTdGF0ZSh7IGlkOiBjaWQgfSwgJycsIHVybC5ocmVmKTtcblx0fVxufVxuXG5mdW5jdGlvbiB3aGljaChldmVudCkge1xuXHRyZXR1cm4gZXZlbnQud2hpY2ggPT09IG51bGwgPyBldmVudC5idXR0b24gOiBldmVudC53aGljaDtcbn1cblxuZnVuY3Rpb24gZmluZF9hbmNob3Iobm9kZSkge1xuXHR3aGlsZSAobm9kZSAmJiBub2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT09ICdBJykgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTsgLy8gU1ZHIDxhPiBlbGVtZW50cyBoYXZlIGEgbG93ZXJjYXNlIG5hbWVcblx0cmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZV9wb3BzdGF0ZShldmVudCkge1xuXHRzY3JvbGxfaGlzdG9yeVtjaWRdID0gc2Nyb2xsX3N0YXRlKCk7XG5cblx0aWYgKGV2ZW50LnN0YXRlKSB7XG5cdFx0Y29uc3QgdXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRjb25zdCB0YXJnZXQgPSBzZWxlY3RfdGFyZ2V0KHVybCk7XG5cdFx0aWYgKHRhcmdldCkge1xuXHRcdFx0bmF2aWdhdGUodGFyZ2V0LCBldmVudC5zdGF0ZS5pZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHQvLyBoYXNoY2hhbmdlXG5cdFx0c2V0X3VpZCh1aWQgKyAxKTtcblx0XHRzZXRfY2lkKHVpZCk7XG5cdFx0X2hpc3RvcnkucmVwbGFjZVN0YXRlKHsgaWQ6IGNpZCB9LCAnJywgbG9jYXRpb24uaHJlZik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJlZmV0Y2hSb3V0ZXMocGF0aG5hbWVzKSB7XG5cdHJldHVybiByb3V0ZXNcblx0XHQuZmlsdGVyKHBhdGhuYW1lc1xuXHRcdFx0PyByb3V0ZSA9PiBwYXRobmFtZXMuc29tZShwYXRobmFtZSA9PiByb3V0ZS5wYXR0ZXJuLnRlc3QocGF0aG5hbWUpKVxuXHRcdFx0OiAoKSA9PiB0cnVlXG5cdFx0KVxuXHRcdC5yZWR1Y2UoKHByb21pc2UsIHJvdXRlKSA9PiBwcm9taXNlLnRoZW4oKCkgPT4ge1xuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHJvdXRlLnBhcnRzLm1hcChwYXJ0ID0+IHBhcnQgJiYgbG9hZF9jb21wb25lbnQoY29tcG9uZW50c1twYXJ0LmldKSkpO1xuXHRcdH0pLCBQcm9taXNlLnJlc29sdmUoKSk7XG59XG5cbmNvbnN0IHN0b3JlcyQxID0gKCkgPT4gZ2V0Q29udGV4dChDT05URVhUX0tFWSk7XG5cbmV4cG9ydCB7IGdvdG8sIHByZWZldGNoLCBwcmVmZXRjaFJvdXRlcywgc3RhcnQsIHN0b3JlcyQxIGFzIHN0b3JlcyB9O1xuIiwiaW1wb3J0ICogYXMgc2FwcGVyIGZyb20gXCJAc2FwcGVyL2FwcFwiO1xuXG4vL2ltcG9ydCB7IGZpcmViYXNlQ29uZmlnIH0gZnJvbSBcIi4vZmlyZWJhc2VDb25maWdcIjtcbi8vbGV0IGFwcCA9IGZpcmViYXNlLmluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuLy93aW5kb3cuZGIgPSBhcHAuZmlyZXN0b3JlKCk7XG5cbmltcG9ydCBcIi4vZmlyZWJhc2VcIjtcblxuc2FwcGVyLnN0YXJ0KHtcbiAgdGFyZ2V0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NhcHBlclwiKSxcbn0pO1xuIl0sIm5hbWVzIjpbImVtcHR5IiwidHNsaWJfMS5fX2V4dGVuZHMiLCJlbXB0eU9ic2VydmVyIiwicnhTdWJzY3JpYmVyU3ltYm9sIiwiaWRlbnRpdHkiLCJTeW1ib2xfb2JzZXJ2YWJsZSIsImRpc3BhdGNoIiwibm9vcCIsIml0ZXJhdG9yIiwiU3ltYm9sX2l0ZXJhdG9yIiwib2JzZXJ2YWJsZSIsImNvbmZpZyIsInNpZ25JbldpdGhHb29nbGUiLCJfc2lnbkluV2l0aEdvb2dsZSIsInNpZ25PdXQiLCJfc2lnbk91dCIsImNyZWF0ZVJpcHBsZSIsImNsYXNzZXNEZWZhdWx0IiwibGluZWFyIiwiU2NyaW0iLCJzY3JpbSIsImJyZWFrcG9pbnRzIiwiRXJyb3JDb21wb25lbnQiLCJkZXRhY2giLCJyb290X3ByZWxvYWQiLCJzYXBwZXIuc3RhcnQiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVMsSUFBSSxHQUFHLEdBQUc7QUFDbkIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQzFCO0FBQ0EsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUc7QUFDdkIsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBSUQsU0FBUyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN6RCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEdBQUc7QUFDNUIsUUFBUSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFD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QUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3pGLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENB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LElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEUsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxSCxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUksSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMs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
