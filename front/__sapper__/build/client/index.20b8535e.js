import{S as t,i as e,s,e as l,k as a,l as r,c as n,b as o,o as c,d as h,p as i,f,h as u,j as p,w as g,K as d,n as m,D as v,E as x,F as E}from"./client.ab7a9392.js";function b(t,e,s){const l=t.slice();return l[2]=e[s],l}function I(t){let e,s,d,m,v,x=t[2].title+"";return{c(){e=l("li"),s=l("a"),d=a(x),v=r(),this.h()},l(t){e=n(t,"LI",{});var l=o(e);s=n(l,"A",{rel:!0,href:!0});var a=o(s);d=c(a,x),a.forEach(h),v=i(l),l.forEach(h),this.h()},h(){f(s,"rel","prefetch"),f(s,"href",m="blog/"+t[2].slug)},m(t,l){u(t,e,l),p(e,s),p(s,d),p(e,v)},p(t,e){1&e&&x!==(x=t[2].title+"")&&g(d,x),1&e&&m!==(m="blog/"+t[2].slug)&&f(s,"href",m)},d(t){t&&h(e)}}}function j(t){let e,s,g,x,E,j,k=t[0],q=[];for(let e=0;e<k.length;e+=1)q[e]=I(b(t,k,e));return{c(){e=r(),s=l("div"),g=l("h1"),x=a("Recent posts"),E=r(),j=l("ul");for(let t=0;t<q.length;t+=1)q[t].c();this.h()},l(t){d('[data-svelte="svelte-1w74l05"]',document.head).forEach(h),e=i(t),s=n(t,"DIV",{class:!0});var l=o(s);g=n(l,"H1",{class:!0});var a=o(g);x=c(a,"Recent posts"),a.forEach(h),E=i(l),j=n(l,"UL",{class:!0});var r=o(j);for(let t=0;t<q.length;t+=1)q[t].l(r);r.forEach(h),l.forEach(h),this.h()},h(){document.title="Blog",f(g,"class","text-2xl text-center mb-4"),f(j,"class","text-center svelte-1hkq7r7"),f(s,"class","container mx-auto")},m(t,l){u(t,e,l),u(t,s,l),p(s,g),p(g,x),p(s,E),p(s,j);for(let t=0;t<q.length;t+=1)q[t].m(j,null)},p(t,[e]){if(1&e){let s;for(k=t[0],s=0;s<k.length;s+=1){const l=b(t,k,s);q[s]?q[s].p(l,e):(q[s]=I(l),q[s].c(),q[s].m(j,null))}for(;s<q.length;s+=1)q[s].d(1);q.length=k.length}},i:m,o:m,d(t){t&&h(e),t&&h(s),v(q,t)}}}function k({params:t,query:e}){return this.fetch("blog.json").then(t=>t.json()).then(t=>({posts:t}))}function q(t,e,s){let l;x(t,E,t=>s(1,l=t)),clearInterval(l.timerId),clearInterval(l.timerIdlist);let{posts:a}=e;return t.$set=t=>{"posts"in t&&s(0,a=t.posts)},[a]}export default class extends t{constructor(t){super(),e(this,t,q,j,s,{posts:0})}}export{k as preload};