import{i as Y,S as c,o as j,j as z,k as B,l as S,q as C,s as d,v as w,m as A,g as _,U as h,w as F,b,x as K,y as G,H,z as Z,A as N,B as x,C as L,E as p,f as J,D as Q,F as V,G as W,I as X,L as $,P as ee,J as te,K as ne,M as se,N as q,O as re,Q as ie,c as I,a as ae}from"./runtime.4-Z9LHwi.js";import{h as fe,g as M,i as ue}from"./disclose-version.CkE9boUo.js";function P(e,t=!0,s=null){if(typeof e=="object"&&e!=null&&!Y(e)){if(c in e){const n=e[c];if(n.t===e||n.p===e)return n.p}const r=K(e);if(r===j||r===z){const n=new Proxy(e,le);return B(e,c,{value:{s:new Map,v:S(0),a:C(e),i:t,p:n,t:e},writable:!0,enumerable:!1}),n}}return e}function U(e,t=1){d(e,e.v+t)}const le={defineProperty(e,t,s){if(s.value){const r=e[c],n=r.s.get(t);n!==void 0&&d(n,P(s.value,r.i,r))}return Reflect.defineProperty(e,t,s)},deleteProperty(e,t){const s=e[c],r=s.s.get(t),n=s.a,i=delete e[t];if(n&&i){const a=s.s.get("length"),l=e.length-1;a!==void 0&&a.v!==l&&d(a,l)}return r!==void 0&&d(r,h),i&&U(s.v),i},get(e,t,s){var i;if(t===c)return Reflect.get(e,c);const r=e[c];let n=r.s.get(t);if(n===void 0&&(!(t in e)||(i=w(e,t))!=null&&i.writable)&&(n=(r.i?S:A)(P(e[t],r.i,r)),r.s.set(t,n)),n!==void 0){const a=_(n);return a===h?void 0:a}return Reflect.get(e,t,s)},getOwnPropertyDescriptor(e,t){const s=Reflect.getOwnPropertyDescriptor(e,t);if(s&&"value"in s){const n=e[c].s.get(t);n&&(s.value=_(n))}return s},has(e,t){var i;if(t===c)return!0;const s=e[c],r=Reflect.has(e,t);let n=s.s.get(t);return(n!==void 0||F!==null&&(!r||(i=w(e,t))!=null&&i.writable))&&(n===void 0&&(n=(s.i?S:A)(r?P(e[t],s.i,s):h),s.s.set(t,n)),_(n)===h)?!1:r},set(e,t,s,r){const n=e[c];let i=n.s.get(t);i===void 0&&(b(()=>r[t]),i=n.s.get(t)),i!==void 0&&d(i,P(s,n.i,n));const a=n.a,l=!(t in e);if(a&&t==="length")for(let f=s;f<e.length;f+=1){const o=n.s.get(f+"");o!==void 0&&d(o,h)}if(e[t]=s,l){if(a){const f=n.s.get("length"),o=e.length;f!==void 0&&f.v!==o&&d(f,o)}U(n.v)}return!0},ownKeys(e){const t=e[c];return _(t.v),Reflect.ownKeys(e)}};function ce(e){throw new Error("lifecycle_outside_component")}function ve(e,t,s,r=null,n=!1){var i=null,a=null,l=null,f=n?p:0;G(()=>{if(l===(l=!!t()))return;let o=!1;if(fe){const v=e.data===H;l===v&&(Z(ue),M(!1),o=!0)}l?(i?N(i):i=x(()=>s(e)),a&&L(a,()=>{a=null})):(a?N(a):r&&(a=x(()=>r(e))),i&&L(i,()=>{i=null})),o&&M(!0)},f)}function k(e,t){var r;var s=e&&((r=e[c])==null?void 0:r.t);return e===t||s===t}function ye(e,t,s,r){J(()=>{var n,i;return Q(()=>{n=i,i=[],b(()=>{e!==s(...i)&&V(()=>{t(e,...i),n&&k(s(...n),e)&&t(null,...n)})})}),()=>{W(()=>{i&&k(s(...i),e)&&t(null,...i)})}})}function he(e,t,s,r){var T;var n=(s&ne)!==0,i=(s&se)!==0,a=(s&ie)!==0,l=e[t],f=(T=w(e,t))==null?void 0:T.set,o=r,v=!0,D=()=>(a&&v&&(v=!1,o=b(r)),o);l===void 0&&r!==void 0&&(f&&i&&X(),l=D(),f&&f(l));var y;if(i)y=()=>{var u=e[t];return u===void 0?D():(v=!0,u)};else{var O=(n?q:re)(()=>e[t]);O.f|=$,y=()=>{var u=_(O);return u!==void 0&&(o=void 0),u===void 0?o:u}}if(!(s&ee))return y;if(f)return function(u){return arguments.length===1?(f(u),u):y()};var E=!1,R=A(l),m=q(()=>{var u=y(),g=_(R);return E?(E=!1,g):R.v=u});return n||(m.equals=te),function(u){var g=_(m);return arguments.length>0?(m.equals(u)||(E=!0,d(R,u),_(m)),u):g}}function me(e){I===null&&ce(),I.l!==null?oe(I).m.push(e):ae(()=>{const t=b(e);if(typeof t=="function")return t})}function oe(e){var t=e.l;return t.u??(t.u={a:[],b:[],m:[]})}export{he as a,ye as b,ve as i,me as o,P as p};