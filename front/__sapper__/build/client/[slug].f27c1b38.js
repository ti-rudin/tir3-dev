import{S as t,i as s,s as a,l as e,e as n,k as o,K as i,d as l,p as r,c,b as h,o as u,f as p,h as f,j as d,w as m,n as v}from"./client.ab7a9392.js";function x(t){let s,a,x,j,w,b,g=t[0].title+"",E=t[0].html+"";return document.title=s=t[0].title,{c(){a=e(),x=n("h1"),j=o(g),w=e(),b=n("div"),this.h()},l(t){i('[data-svelte="svelte-iu3vwn"]',document.head).forEach(l),a=r(t),x=c(t,"H1",{class:!0});var s=h(x);j=u(s,g),s.forEach(l),w=r(t),b=c(t,"DIV",{class:!0}),h(b).forEach(l),this.h()},h(){p(x,"class","text-2xl"),p(b,"class","content")},m(t,s){f(t,a,s),f(t,x,s),d(x,j),f(t,w,s),f(t,b,s),b.innerHTML=E},p(t,[a]){1&a&&s!==(s=t[0].title)&&(document.title=s),1&a&&g!==(g=t[0].title+"")&&m(j,g),1&a&&E!==(E=t[0].html+"")&&(b.innerHTML=E)},i:v,o:v,d(t){t&&l(a),t&&l(x),t&&l(w),t&&l(b)}}}async function j({params:t,query:s}){const a=await this.fetch(`blog/${t.slug}.json`),e=await a.json();if(200===a.status)return{post:e};this.error(a.status,e.message)}function w(t,s,a){let{post:e}=s;return t.$set=t=>{"post"in t&&a(0,e=t.post)},[e]}export default class extends t{constructor(t){super(),s(this,t,w,x,a,{post:0})}}export{j as preload};
