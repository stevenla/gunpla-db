import{a as d,t as m,b as o,d as c,f as v,e as b}from"../chunks/disclose-version.BEcgwQF8.js";import{n as a,f as h,b as $,g as x,U as f,s as l,m as I,p as y,t as E,h as N}from"../chunks/runtime.4-Z9LHwi.js";import{i as U}from"../chunks/lifecycle.B9btnZfI.js";import{s as k}from"../chunks/entry.LfajCsV5.js";function w(s,t,n){if(s==null)return t(void 0),a;const e=s.subscribe(t,n);return e.unsubscribe?()=>e.unsubscribe():e}function A(s,t,n){let e=n[t];const r=e===void 0;r&&(e={store:null,last_value:null,value:I(f),unsubscribe:a},n[t]=e),(r||e.store!==s)&&(e.unsubscribe(),e.store=s??null,e.unsubscribe=D(s,e.value));const u=x(e.value);return u===f?e.last_value:u}function D(s,t){return s==null?(l(t,void 0),a):w(s,n=>l(t,n))}function L(s){S(()=>{let t;for(t in s)s[t].unsubscribe()})}function S(s){h(()=>()=>$(s))}const T=()=>{const s=k;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},Z={subscribe(s){return T().page.subscribe(s)}};var j=m("<h1> </h1> <p> </p>",1);function F(s,t){y(t,!1);const n={};L(n);const e=()=>A(Z,"$page",n);U();var r=j(),u=v(r),p=c(u),g=b(b(u,!0)),_=c(g);E(()=>{var i;o(p,e().status),o(_,(i=e().error)==null?void 0:i.message)}),d(s,r),N()}export{F as component};