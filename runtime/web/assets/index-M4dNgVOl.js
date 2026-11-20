var k0=Object.defineProperty;var z0=(t,e,n)=>e in t?k0(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Cn=(t,e,n)=>z0(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();/**
* @vue/shared v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Yu(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const It={},As=[],di=()=>{},pm=()=>!1,cl=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),ul=t=>t.startsWith("onUpdate:"),Yt=Object.assign,$u=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},H0=Object.prototype.hasOwnProperty,bt=(t,e)=>H0.call(t,e),Ze=Array.isArray,as=t=>Ro(t)==="[object Map]",zi=t=>Ro(t)==="[object Set]",pd=t=>Ro(t)==="[object Date]",st=t=>typeof t=="function",Bt=t=>typeof t=="string",pi=t=>typeof t=="symbol",Rt=t=>t!==null&&typeof t=="object",mm=t=>(Rt(t)||st(t))&&st(t.then)&&st(t.catch),gm=Object.prototype.toString,Ro=t=>gm.call(t),W0=t=>Ro(t).slice(8,-1),_m=t=>Ro(t)==="[object Object]",Ku=t=>Bt(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,Xr=Yu(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),fl=t=>{const e=Object.create(null);return(n=>e[n]||(e[n]=t(n)))},X0=/-\w/g,$n=fl(t=>t.replace(X0,e=>e.slice(1).toUpperCase())),Y0=/\B([A-Z])/g,ps=fl(t=>t.replace(Y0,"-$1").toLowerCase()),vm=fl(t=>t.charAt(0).toUpperCase()+t.slice(1)),Ul=fl(t=>t?`on${vm(t)}`:""),ai=(t,e)=>!Object.is(t,e),Aa=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},bm=(t,e,n,i=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:i,value:n})},No=t=>{const e=parseFloat(t);return isNaN(e)?t:e};let md;const dl=()=>md||(md=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function hl(t){if(Ze(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],s=Bt(i)?J0(i):hl(i);if(s)for(const r in s)e[r]=s[r]}return e}else if(Bt(t)||Rt(t))return t}const $0=/;(?![^(]*\))/g,K0=/:([^]+)/,Z0=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function J0(t){const e={};return t.replace(Z0,n=>n.startsWith("/*")?"":n).split($0).forEach(n=>{if(n){const i=n.split(K0);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function ct(t){let e="";if(Bt(t))e=t;else if(Ze(t))for(let n=0;n<t.length;n++){const i=ct(t[n]);i&&(e+=i+" ")}else if(Rt(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const q0="itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly",j0=Yu(q0);function Sm(t){return!!t||t===""}function Q0(t,e,n){if(t.length!==e.length)return!1;let i=!0;for(let s=0;i&&s<t.length;s++)i=Hi(t[s],e[s],n);return i}function gd(t,e,n){if(t.size!==e.size)return!1;const i=Array.from(e),s=new Uint8Array(i.length);for(const r of t){let o=-1;for(let a=0;a<i.length;a++)if(!s[a]&&Hi(r,i[a],n)){o=a;break}if(o<0)return!1;s[o]=1}return!0}function ev(t,e,n){let i=as(t),s=as(e);if(i||s||(i=zi(t),s=zi(e),i||s))return i&&s?gd(t,e,n):!1;const r=Object.keys(t).length,o=Object.keys(e).length;if(r!==o)return!1;for(const a in t){const l=t.hasOwnProperty(a),c=e.hasOwnProperty(a);if(l&&!c||!l&&c||!Hi(t[a],e[a],n))return!1}return String(t)===String(e)}function _d(t,e,n,i){n||(n=[new Map,new Map]);const[s,r]=n;if(s.has(t)||r.has(e))return s.get(t)===e&&r.get(e)===t;s.set(t,e),r.set(e,t);const o=i(t,e,n);return s.delete(t),r.delete(e),o}function Hi(t,e,n){if(t===e)return!0;let i=pd(t),s=pd(e);return i||s?i&&s?t.getTime()===e.getTime():!1:(i=pi(t),s=pi(e),i||s?t===e:(i=Ze(t),s=Ze(e),i||s?i&&s?_d(t,e,n,Q0):!1:(i=Rt(t),s=Rt(e),i||s?!i||!s?!1:_d(t,e,n,ev):String(t)===String(e))))}function Zu(t,e){return t.findIndex(n=>Hi(n,e))}const xm=t=>!!(t&&t.__v_isRef===!0),Ce=t=>Bt(t)?t:t==null?"":Ze(t)||Rt(t)&&(t.toString===gm||!st(t.toString))?xm(t)?Ce(t.value):JSON.stringify(t,ym,2):String(t),ym=(t,e)=>xm(e)?ym(t,e.value):as(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,s],r)=>(n[Ol(i,r)+" =>"]=s,n),{})}:zi(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Ol(n))}:pi(e)?Ol(e):Rt(e)&&!Ze(e)&&!_m(e)?String(e):e,Ol=(t,e="")=>{var n;return pi(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Qt;class tv{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&Qt&&(Qt.active?(this.parent=Qt,this.index=(Qt.scopes||(Qt.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes){const i=this.scopes.slice();for(e=0,n=i.length;e<n;e++)i[e].pause()}for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes){const s=this.scopes.slice();for(e=0,n=s.length;e<n;e++)s[e].resume()}const i=this.effects.slice();for(e=0,n=i.length;e<n;e++)i[e].resume()}}run(e){if(this._active){const n=Qt;try{return Qt=this,e()}finally{Qt=n}}}on(){++this._on===1&&(this.prevScope=Qt,Qt=this)}off(){if(this._on>0&&--this._on===0){if(Qt===this)Qt=this.prevScope;else{let e=Qt;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){const s=this.scopes.slice();for(n=0,i=s.length;n<i;n++)s[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function nv(){return Qt}let Lt;const Fl=new WeakSet;class Em{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Qt&&(Qt.active?Qt.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Fl.has(this)&&(Fl.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Tm(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,vd(this),Am(this);const e=Lt,n=Kn;Lt=this,Kn=!0;try{return this.fn()}finally{wm(this),Lt=e,Kn=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)ju(e);this.deps=this.depsTail=void 0,vd(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Fl.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Lc(this)&&this.run()}get dirty(){return Lc(this)}}let Mm=0,Yr,$r;function Tm(t,e=!1){if(t.flags|=8,e){t.next=$r,$r=t;return}t.next=Yr,Yr=t}function Ju(){Mm++}function qu(){if(--Mm>0)return;if($r){let e=$r;for($r=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;Yr;){let e=Yr;for(Yr=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){t||(t=i)}e=n}}if(t)throw t}function Am(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function wm(t){let e,n=t.depsTail,i=n;for(;i;){const s=i.prevDep;i.version===-1?(i===n&&(n=s),ju(i),iv(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=s}t.deps=e,t.depsTail=n}function Lc(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(Rm(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function Rm(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===ro)||(t.globalVersion=ro,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!Lc(t))))return;t.flags|=2;const e=t.dep,n=Lt,i=Kn;Lt=t,Kn=!0;try{Am(t);const s=t.fn(t._value);(e.version===0||ai(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{Lt=n,Kn=i,wm(t),t.flags&=-3}}function ju(t,e=!1){const{dep:n,prevSub:i,nextSub:s}=t;if(i&&(i.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=i,t.nextSub=void 0),n.subs===t&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let r=n.computed.deps;r;r=r.nextDep)ju(r,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function iv(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let Kn=!0;const Nm=[];function mi(){Nm.push(Kn),Kn=!1}function gi(){const t=Nm.pop();Kn=t===void 0?!0:t}function vd(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=Lt;Lt=void 0;try{e()}finally{Lt=n}}}let ro=0;class sv{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Qu{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Lt||!Kn||Lt===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==Lt)n=this.activeLink=new sv(Lt,this),Lt.deps?(n.prevDep=Lt.depsTail,Lt.depsTail.nextDep=n,Lt.depsTail=n):Lt.deps=Lt.depsTail=n,Im(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=Lt.depsTail,n.nextDep=void 0,Lt.depsTail.nextDep=n,Lt.depsTail=n,Lt.deps===n&&(Lt.deps=i)}return n}trigger(e){this.version++,ro++,this.notify(e)}notify(e){Ju();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{qu()}}}function Im(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)Im(i)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const Pc=new WeakMap,Ns=Symbol(""),Dc=Symbol(""),oo=Symbol("");function ln(t,e,n){if(Kn&&Lt){let i=Pc.get(t);i||Pc.set(t,i=new Map);let s=i.get(n);s||(i.set(n,s=new Qu),s.map=i,s.key=n),s.track()}}function Di(t,e,n,i,s,r){const o=Pc.get(t);if(!o){ro++;return}const a=l=>{l&&l.trigger()};if(Ju(),e==="clear")o.forEach(a);else{const l=Ze(t),c=l&&Ku(n);if(l&&n==="length"){const u=Number(i);o.forEach((f,h)=>{(h==="length"||h===oo||!pi(h)&&h>=u)&&a(f)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(oo)),e){case"add":l?c&&a(o.get("length")):(a(o.get(Ns)),as(t)&&a(o.get(Dc)));break;case"delete":l||(a(o.get(Ns)),as(t)&&a(o.get(Dc)));break;case"set":as(t)&&a(o.get(Ns));break}}qu()}function Os(t){const e=xt(t);return e===t||(ln(e,"iterate",oo),Fn(t))?e:_i(t)?ls(t)?e.map(n=>us(Bn(n))):e.map(us):e.map(Bn)}function pl(t){return ln(t=xt(t),"iterate",oo),t}function ii(t,e){return _i(t)?us(ls(t)?Bn(e):e):Bn(e)}const rv={__proto__:null,[Symbol.iterator](){return Bl(this,Symbol.iterator,t=>ii(this,t))},concat(...t){return Os(this).concat(...t.map(e=>Ze(e)?Os(e):e))},entries(){return Bl(this,"entries",t=>(t[1]=ii(this,t[1]),t))},every(t,e){return Ei(this,"every",t,e,void 0,arguments)},filter(t,e){return Ei(this,"filter",t,e,n=>n.map(i=>ii(this,i)),arguments)},find(t,e){return Ei(this,"find",t,e,n=>ii(this,n),arguments)},findIndex(t,e){return Ei(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Ei(this,"findLast",t,e,n=>ii(this,n),arguments)},findLastIndex(t,e){return Ei(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Ei(this,"forEach",t,e,void 0,arguments)},includes(...t){return Vl(this,"includes",t)},indexOf(...t){return Vl(this,"indexOf",t)},join(t){return Os(this).join(t)},lastIndexOf(...t){return Vl(this,"lastIndexOf",t)},map(t,e){return Ei(this,"map",t,e,void 0,arguments)},pop(){return Ar(this,"pop")},push(...t){return Ar(this,"push",t)},reduce(t,...e){return Sd(this,"reduce",t,e)},reduceRight(t,...e){return Sd(this,"reduceRight",t,e)},shift(){return Ar(this,"shift")},some(t,e){return Ei(this,"some",t,e,void 0,arguments)},splice(...t){return Ar(this,"splice",t)},toReversed(){return Os(this).toReversed()},toSorted(t){return Os(this).toSorted(t)},toSpliced(...t){return Os(this).toSpliced(...t)},unshift(...t){return Ar(this,"unshift",t)},values(){return Bl(this,"values",t=>ii(this,t))}};function Bl(t,e,n){const i=pl(t),s=i[e],r=s.call(i);if(i!==t&&!Fn(t)){if(r[Symbol.toStringTag]==="Array Iterator"){const o=Object.create(Object.getPrototypeOf(r));return o.next=()=>bd(r.next(),n),s!==Cm[e]&&Object.defineProperties(o,{return:{get(){const a=r.return;return typeof a=="function"?a.bind(r):a}},throw:{get(){const a=r.throw;return typeof a=="function"?a.bind(r):a}}}),o}r._next=r.next,r.next=()=>bd(r._next(),n)}return r}function bd(t,e){return t.done||(t.value=e(t.value)),t}const Cm=Array.prototype;function Ei(t,e,n,i,s,r){const o=pl(t),a=o!==t&&!Fn(t),l=o[e];if(l!==Cm[e]){const f=l.apply(t,r);return a?Bn(f):f}let c=n;o!==t&&(a?c=function(f,h){return n.call(this,ii(t,f),h,t)}:n.length>2&&(c=function(f,h){return n.call(this,f,h,t)}));const u=l.call(o,c,i);return a&&s?s(u):u}function Sd(t,e,n,i){const s=pl(t),r=s!==t&&!Fn(t);let o=n,a=!1;s!==t&&(r?(a=i.length===0,o=function(c,u,f){return a&&(a=!1,c=ii(t,c)),n.call(this,c,ii(t,u),f,t)}):n.length>3&&(o=function(c,u,f){return n.call(this,c,u,f,t)}));const l=s[e](o,...i);return a?ii(t,l):l}function Vl(t,e,n){const i=xt(t);ln(i,"iterate",oo);const s=i[e](...n);return(s===-1||s===!1)&&sf(n[0])?(n[0]=xt(n[0]),i[e](...n)):s}function Ar(t,e,n=[]){mi(),Ju();const i=xt(t)[e].apply(t,n);return qu(),gi(),i}const ov=Yu("__proto__,__v_isRef,__isVue"),Lm=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(pi));function av(t){pi(t)||(t=String(t));const e=xt(this);return ln(e,"has",t),e.hasOwnProperty(t)}class Pm{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,i){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,r=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return r;if(n==="__v_raw")return i===(s?r?_v:Fm:r?Om:Um).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=Ze(e);if(!s){let l;if(o&&(l=rv[n]))return l;if(n==="hasOwnProperty")return av}const a=Reflect.get(e,n,cn(e)?e:i);if((pi(n)?Lm.has(n):ov(n))||(s||ln(e,"get",n),r))return a;if(cn(a)){const l=o&&Ku(n)?a:a.value;return s&&Rt(l)?Oc(l):l}return Rt(a)?s?Oc(a):tf(a):a}}class Dm extends Pm{constructor(e=!1){super(!1,e)}set(e,n,i,s){let r=e[n];const o=Ze(e)&&Ku(n);if(!this._isShallow){const c=_i(r);if(!Fn(i)&&!_i(i)&&(r=xt(r),i=xt(i)),!o&&cn(r)&&!cn(i))return c||(r.value=i),!0}const a=o?Number(n)<e.length:bt(e,n),l=Reflect.set(e,n,i,cn(e)?e:s);return e===xt(s)&&l&&(a?ai(i,r)&&Di(e,"set",n,i):Di(e,"add",n,i)),l}deleteProperty(e,n){const i=bt(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&i&&Di(e,"delete",n,void 0),s}has(e,n){const i=Reflect.has(e,n);return(!pi(n)||!Lm.has(n))&&ln(e,"has",n),i}ownKeys(e){return ln(e,"iterate",Ze(e)?"length":Ns),Reflect.ownKeys(e)}}class lv extends Pm{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const cv=new Dm,uv=new lv,fv=new Dm(!0);const Uc=t=>t,Go=t=>Reflect.getPrototypeOf(t);function dv(t,e,n){return function(...i){const s=this.__v_raw,r=xt(s),o=as(r),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=s[t](...i),u=n?Uc:e?us:Bn;return!e&&ln(r,"iterate",l?Dc:Ns),Yt(Object.create(c),{next(){const{value:f,done:h}=c.next();return h?{value:f,done:h}:{value:a?[u(f[0]),u(f[1])]:u(f),done:h}}})}}function ko(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function hv(t,e){const n={get(s){const r=this.__v_raw,o=xt(r),a=xt(s);t||(ai(s,a)&&ln(o,"get",s),ln(o,"get",a));const{has:l}=Go(o),c=e?Uc:t?us:Bn;if(l.call(o,s))return c(r.get(s));if(l.call(o,a))return c(r.get(a));r!==o&&r.get(s)},get size(){const s=this.__v_raw;return!t&&ln(xt(s),"iterate",Ns),s.size},has(s){const r=this.__v_raw,o=xt(r),a=xt(s);return t||(ai(s,a)&&ln(o,"has",s),ln(o,"has",a)),s===a?r.has(s):r.has(s)||r.has(a)},forEach(s,r){const o=this,a=o.__v_raw,l=xt(a),c=e?Uc:t?us:Bn;return!t&&ln(l,"iterate",Ns),a.forEach((u,f)=>s.call(r,c(u),c(f),o))}};return Yt(n,t?{add:ko("add"),set:ko("set"),delete:ko("delete"),clear:ko("clear")}:{add(s){const r=xt(this),o=Go(r),a=xt(s),l=!e&&!Fn(s)&&!_i(s)?a:s;return o.has.call(r,l)||ai(s,l)&&o.has.call(r,s)||ai(a,l)&&o.has.call(r,a)||(r.add(l),Di(r,"add",l,l)),this},set(s,r){!e&&!Fn(r)&&!_i(r)&&(r=xt(r));const o=xt(this),{has:a,get:l}=Go(o);let c=a.call(o,s);c||(s=xt(s),c=a.call(o,s));const u=l.call(o,s);return o.set(s,r),c?ai(r,u)&&Di(o,"set",s,r):Di(o,"add",s,r),this},delete(s){const r=xt(this),{has:o,get:a}=Go(r);let l=o.call(r,s);l||(s=xt(s),l=o.call(r,s)),a&&a.call(r,s);const c=r.delete(s);return l&&Di(r,"delete",s,void 0),c},clear(){const s=xt(this),r=s.size!==0,o=s.clear();return r&&Di(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=dv(s,t,e)}),n}function ef(t,e){const n=hv(t,e);return(i,s,r)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_isShallow"?e:s==="__v_raw"?i:Reflect.get(bt(n,s)&&s in i?n:i,s,r)}const pv={get:ef(!1,!1)},mv={get:ef(!1,!0)},gv={get:ef(!0,!1)};const Um=new WeakMap,Om=new WeakMap,Fm=new WeakMap,_v=new WeakMap;function vv(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function tf(t){return _i(t)?t:nf(t,!1,cv,pv,Um)}function bv(t){return nf(t,!1,fv,mv,Om)}function Oc(t){return nf(t,!0,uv,gv,Fm)}function nf(t,e,n,i,s){if(!Rt(t)||t.__v_raw&&!(e&&t.__v_isReactive)||t.__v_skip||!Object.isExtensible(t))return t;const r=s.get(t);if(r)return r;const o=vv(W0(t));if(o===0)return t;const a=new Proxy(t,o===2?i:n);return s.set(t,a),a}function ls(t){return _i(t)?ls(t.__v_raw):!!(t&&t.__v_isReactive)}function _i(t){return!!(t&&t.__v_isReadonly)}function Fn(t){return!!(t&&t.__v_isShallow)}function sf(t){return t?!!t.__v_raw:!1}function xt(t){const e=t&&t.__v_raw;return e?xt(e):t}function Sv(t){return!bt(t,"__v_skip")&&Object.isExtensible(t)&&bm(t,"__v_skip",!0),t}const Bn=t=>Rt(t)?tf(t):t,us=t=>Rt(t)?Oc(t):t;function cn(t){return t?t.__v_isRef===!0:!1}function Qe(t){return xv(t,!1)}function xv(t,e){return cn(t)?t:new yv(t,e)}class yv{constructor(e,n){this.dep=new Qu,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:xt(e),this._value=n?e:Bn(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,i=this.__v_isShallow||Fn(e)||_i(e);e=i?e:xt(e),ai(e,n)&&(this._rawValue=e,this._value=i?e:Bn(e),this.dep.trigger())}}function Ev(t){return cn(t)?t.value:t}const Mv={get:(t,e,n)=>e==="__v_raw"?t:Ev(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const s=t[e];return cn(s)&&!cn(n)?(s.value=n,!0):Reflect.set(t,e,n,i)}};function Bm(t){return ls(t)?t:new Proxy(t,Mv)}class Tv{constructor(e,n,i){this.fn=e,this.setter=n,this._value=void 0,this.dep=new Qu(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=ro-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&Lt!==this)return Tm(this,!0),!0}get value(){const e=this.dep.track();return Rm(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Av(t,e,n=!1){let i,s;return st(t)?i=t:(i=t.get,s=t.set),new Tv(i,s,n)}const zo={},ka=new WeakMap;let Ts;function wv(t,e=!1,n=Ts){if(n){let i=ka.get(n);i||ka.set(n,i=[]),i.push(t)}}function Rv(t,e,n=It){const{immediate:i,deep:s,once:r,scheduler:o,augmentJob:a,call:l}=n,c=y=>s?y:Fn(y)||s===!1||s===0?Ui(y,1):Ui(y);let u,f,h,d,m=!1,v=!1;if(cn(t)?(f=()=>t.value,m=Fn(t)):ls(t)?(f=()=>c(t),m=!0):Ze(t)?(v=!0,m=t.some(y=>ls(y)||Fn(y)),f=()=>t.map(y=>{if(cn(y))return y.value;if(ls(y))return c(y);if(st(y))return l?l(y,2):y()})):st(t)?e?f=l?()=>l(t,2):t:f=()=>{if(h){mi();try{h()}finally{gi()}}const y=Ts;Ts=u;try{return l?l(t,3,[d]):t(d)}finally{Ts=y}}:f=di,e&&s){const y=f,w=s===!0?1/0:s;f=()=>Ui(y(),w)}const g=nv(),p=()=>{u.stop(),g&&g.active&&$u(g.effects,u)};if(r&&e){const y=e;e=(...w)=>{try{return y(...w)}finally{p()}}}let b=v?new Array(t.length).fill(zo):zo;const A=y=>{if(!(!(u.flags&1)||!u.dirty&&!y))if(e){const w=u.run();if(y||s||m||(v?w.some((M,_)=>ai(M,b[_])):ai(w,b))){const M=Ts;mi();try{h&&h(),Ts=u;const _=[w,b===zo?void 0:v&&b[0]===zo?[]:b,d];b=w,l?l(e,3,_):e(..._)}finally{Ts=M,gi()}}}else u.run()};return a&&a(A),u=new Em(f),u.scheduler=o?()=>o(A,!1):A,d=y=>wv(y,!1,u),h=u.onStop=()=>{const y=ka.get(u);if(y){if(l)l(y,4);else for(const w of y)w();ka.delete(u)}},e?i?A(!0):b=u.run():o?o(A.bind(null,!0),!0):u.run(),p.pause=u.pause.bind(u),p.resume=u.resume.bind(u),p.stop=p,p}function Ui(t,e=1/0,n){if(e<=0||!Rt(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,cn(t))Ui(t.value,e,n);else if(Ze(t))for(let i=0;i<t.length;i++)Ui(t[i],e,n);else if(zi(t)||as(t))t.forEach(i=>{Ui(i,e,n)});else if(_m(t)){for(const i in t)Ui(t[i],e,n);for(const i of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,i)&&Ui(t[i],e,n)}return t}/**
* @vue/runtime-core v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Io(t,e,n,i){try{return i?t(...i):t()}catch(s){ml(s,e,n)}}function Zn(t,e,n,i){if(st(t)){const s=Io(t,e,n,i);return s&&mm(s)&&s.catch(r=>{ml(r,e,n,void 0,!0)}),s}if(Ze(t)){const s=[];for(let r=0;r<t.length;r++)s.push(Zn(t[r],e,n,i));return s}}function ml(t,e,n,i=!0,s=!1){const r=e?e.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:a}=e&&e.appContext.config||It;if(e){let l=e.parent;const c=e.proxy,u=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const f=l.ec;if(f&&!l.isUnmounted&&(!s||l.scope.active)){for(let h=0;h<f.length;h++)if(f[h](t,c,u)===!1)return}l=l.parent}if(o){mi(),Io(o,null,10,[t,c,u]),gi();return}}Nv(t,n,r,i,a)}function Nv(t,e,n,i=!0,s=!1){if(s)throw t;console.error(t)}const pn=[];let Hn=-1;const si=[];let ns=null,qs=0;const Vm=Promise.resolve();let za=null;function ao(t){const e=za||Vm;return t?e.then(this?t.bind(this):t):e}function Iv(t){let e=Hn+1,n=pn.length;for(;e<n;){const i=e+n>>>1,s=pn[i],r=lo(s);r<t||r===t&&s.flags&2?e=i+1:n=i}return e}function rf(t){if(!(t.flags&1)){const e=lo(t),n=pn[pn.length-1];!n||!(t.flags&2)&&e>=lo(n)?pn.push(t):pn.splice(Iv(e),0,t),t.flags|=1,Gm()}}function Gm(){za||(za=Vm.then(Hm))}function Cv(t){if(!Ze(t))ns&&t.id===-1?ns.splice(qs+1,0,t):t.flags&1||(si.push(t),t.flags|=1);else for(let e=0;e<t.length;e++)si.push(t[e]);Gm()}function km(t,e,n,i=Hn+1){for(;i<pn.length;i++){const s=pn[i];if(s&&s.flags&2){if(t&&s.id!==t.uid||e!==void 0&&!(s.id>=e))continue;pn.splice(i,1),i=t?i-1:Hn,s.flags&4&&(s.flags&=-2),s(),s.flags&4||(s.flags&=-2)}}}function zm(t,e,n=0){if(si.length){let i=si,s=0;if(e){i=[];for(let o=0;o<si.length;o++){const a=si[o];(a.i!==void 0?!a.i||a.i.uid<n:e.has(a))?si[s++]=a:i.push(a)}}const r=[...new Set(i)].sort((o,a)=>lo(o)-lo(a));if(si.length=s,ns){for(let o=0;o<r.length;o++)ns.push(r[o]);return}for(ns=r,qs=0;qs<ns.length;qs++){const o=ns[qs];o.flags&4&&(o.flags&=-2),o.flags&8||o(),o.flags&=-2}ns=null,qs=0}}let Gl=!1;function Lv(t,e){if(Gl){t();return}const n=e===void 0?void 0:new Set(si);t(),Gl=!0;try{km(void 0,e),zm(void 0,n,e)}finally{Gl=!1}}const lo=t=>t.id==null?t.flags&2?-1:1/0:t.id;function Hm(t){try{for(Hn=0;Hn<pn.length;Hn++){const e=pn[Hn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Io(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Hn<pn.length;Hn++){const e=pn[Hn];e&&(e.flags&=-2)}Hn=-1,pn.length=0,zm(),za=null,(pn.length||si.length)&&Hm()}}let On=null,Wm=null;function Ha(t){const e=On;return On=t,Wm=t&&t.type.__scopeId||null,e}function Pv(t,e=On,n){if(!e||t._n)return t;const i=(...s)=>{i._d&&Cd(-1);const r=Ha(e),o=Is.length;let a;try{a=t(...s)}finally{for(let l=Is.length;l>o;l--)hg();Ha(r),i._d&&Cd(1)}return a};return i._n=!0,i._c=!0,i._d=!0,i}function yn(t,e){if(On===null)return t;const n=bl(On),i=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[r,o,a,l=It]=e[s];r&&(st(r)&&(r={mounted:r,updated:r}),r.deep&&Ui(o),i.push({dir:r,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function bs(t,e,n,i){let s=t;if(i==="beforeMount")t._mount=t;else if(i==="beforeUpdate"){const a=e&&e._mount;a&&(a._latest=t,t._mount=a)}else if(i==="mounted"){const a=t._latest;t._mount=t._latest=void 0,a&&(s=a,a._mount=void 0)}const r=s.dirs,o=e&&e.dirs;for(let a=0;a<r.length;a++){let l=r[a];o?l.oldValue=o[a].value:i==="mounted"&&l.oldValue!==void 0&&(l=Yt({},l,{oldValue:void 0}));let c=l.dir[i];c&&(mi(),Zn(c,n,8,[t.el,l,s,e]),gi())}}function Dv(t,e){if(gn){let n=gn.provides;const i=gn.parent&&gn.parent.provides;i===n&&(n=gn.provides=Object.create(i)),n[t]=e}}function wa(t,e,n=!1){const i=Pb();if(i||nr){let s=nr?nr._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&st(e)?e.call(i&&i.proxy):e}}const Uv=Symbol.for("v-scx"),Ov=()=>wa(Uv);function Bi(t,e,n){return Xm(t,e,n)}function Xm(t,e,n=It){const{immediate:i,deep:s,flush:r,once:o}=n,a=Yt({},n),l=e&&i||!e&&r!=="post";let c;if(ho){if(r==="sync"){const d=Ov();c=d.__watcherHandles||(d.__watcherHandles=[])}else if(!l){const d=()=>{};return d.stop=di,d.resume=di,d.pause=di,d}}const u=gn;a.call=(d,m,v)=>Zn(d,u,m,v);let f=!1;r==="post"?a.scheduler=d=>{d.i=u,dn(d,u&&u.suspense)}:r!=="sync"&&(f=!0,a.scheduler=(d,m)=>{m?d():rf(d)}),a.augmentJob=d=>{e&&(d.flags|=4),f&&(d.flags|=2,u&&(d.id=u.uid,d.i=u))};const h=Rv(t,e,a);return ho&&(c?c.push(h):l&&h()),h}function Fv(t,e,n){const i=this.proxy,s=Bt(t)?t.includes(".")?Ym(i,t):()=>i[t]:t.bind(i,i);let r;st(e)?r=e:(r=e.handler,n=e);const o=Lo(this),a=Xm(s,r.bind(i),n);return o(),a}function Ym(t,e){const n=e.split(".");return()=>{let i=t;for(let s=0;s<n.length&&i;s++)i=i[n[s]];return i}}const Bv=Symbol("_vte"),gl=t=>t.__isTeleport,kl=Symbol("_leaveCb");function Vv(t){let e=t[0];if(t.length>1){for(const n of t)if(n.type!==Jn){e=n;break}}return e}function $m(t){if(!of(t))return gl(t.type)&&t.children?Vv(t.children):t;if(t.component)return t.component.subTree;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&st(n.default))return n.default()}}function Kr(t,e){if(t.shapeFlag&6&&t.component){t.transition=e;const n=t.component.subTree;Kr(gl(n.type)&&$m(n)||n,e)}else if(t.shapeFlag&128){const n=t.suspense;if(n){const i=n.isHydrating?n.pendingBranch:n.activeBranch;i&&Kr(i,e.clone(i))}else t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)}else if(t.transition=e,t.type===Pt&&Ze(t.children)){const n=eg(t.children,!1);n&&Kr(n,e)}}function Fc(t){if(t.component)return Fc(t.component.subTree);if(t.type===Pt){const e=Ze(t.children)&&eg(t.children,!1);return e?Fc(e):void 0}if(t.type!==Jn)return t}function vr(t,e){return st(t)?Yt({name:t.name},e,{setup:t}):t}function Km(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function xd(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const Wa=new WeakMap;function Zr(t,e,n,i,s=!1){if(Ze(t)){t.forEach((v,g)=>Zr(v,e&&(Ze(e)?e[g]:e),n,i,s));return}if(Jr(i)&&!s){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&Zr(t,e,n,i.component.subTree);return}const r=i.shapeFlag&4?bl(i.component):i.el,o=s?null:r,{i:a,r:l}=t,c=e&&e.r,u=a.refs===It?a.refs={}:a.refs,f=a.setupState,h=xt(f),d=f===It?pm:v=>xd(u,v)?!1:bt(h,v),m=(v,g)=>!(g&&xd(u,g));if(c!=null&&c!==l){if(yd(e),Bt(c))u[c]=null,d(c)&&(f[c]=null);else if(cn(c)){const v=e;m(c,v.k)&&(c.value=null),v.k&&(u[v.k]=null)}}if(st(l))Io(l,a,12,[o,u]);else{const v=Bt(l),g=cn(l);if(v||g){const p=()=>{if(t.f){const b=v?d(l)?f[l]:u[l]:m()||!t.k?l.value:u[t.k];if(s)Ze(b)&&$u(b,r);else if(Ze(b))b.includes(r)||b.push(r);else if(v)u[l]=[r],d(l)&&(f[l]=u[l]);else{const A=[r];m(l,t.k)&&(l.value=A),t.k&&(u[t.k]=A)}}else v?(u[l]=o,d(l)&&(f[l]=o)):g&&(m(l,t.k)&&(l.value=o),t.k&&(u[t.k]=o))};if(o){const b=()=>{p(),Wa.delete(t)};b.id=-1,Wa.set(t,b),dn(b,n)}else yd(t),p()}}}function yd(t){const e=Wa.get(t);e&&(e.flags|=8,Wa.delete(t))}dl().requestIdleCallback;dl().cancelIdleCallback;const Jr=t=>!!t.type.__asyncLoader,of=t=>t.type.__isKeepAlive;function Gv(t,e){Zm(t,"a",e)}function kv(t,e){Zm(t,"da",e)}function Zm(t,e,n=gn){const i=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(co(e,i,n),n){let s=n.parent;for(;s&&s.parent;)of(s.parent.vnode)&&zv(i,e,n,s),s=s.parent}}function zv(t,e,n,i){const s=co(e,t,i,!0),r=co("um",()=>$u(i[e],s),n);r.flags=16}function co(t,e,n=gn,i=!1){if(n){const s=n[t]||(n[t]=[]),r=e.__weh||(e.__weh=(...o)=>{mi();const a=Lo(n),l=Zn(e,n,t,o);return a(),gi(),l});return i?s.unshift(r):s.push(r),r}}const $i=t=>(e,n=gn)=>{(!ho||t==="sp")&&co(t,(...i)=>e(...i),n)},Hv=$i("bm"),br=$i("m"),Wv=$i("bu"),Xv=$i("u"),Co=$i("bum"),Yv=$i("um"),$v=$i("sp"),Kv=$i("rtg"),Zv=$i("rtc");function Jv(t,e=gn){co("ec",t,e)}const qv=Symbol.for("v-ndc");function xn(t,e,n,i){let s;const r=n,o=Ze(t);if(o||Bt(t)){const a=o&&ls(t);let l=!1,c=!1;a&&(l=!Fn(t),c=_i(t),t=pl(t)),s=new Array(t.length);for(let u=0,f=t.length;u<f;u++)s[u]=e(l?c?us(Bn(t[u])):Bn(t[u]):t[u],u,void 0,r)}else if(typeof t=="number")if(!Number.isInteger(t)||t<0)s=[];else{s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,r)}else if(Rt(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,r));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];s[l]=e(t[u],u,l,r)}}else s=[];return s}const Bc=t=>t?_g(t)?bl(t):Bc(t.parent):null,qr=Yt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Bc(t.parent),$root:t=>Bc(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>qm(t),$forceUpdate:t=>t.f||(t.f=()=>{rf(t.update)}),$nextTick:t=>t.n||(t.n=ao.bind(t.proxy)),$watch:t=>Fv.bind(t)}),zl=(t,e)=>t!==It&&!t.__isScriptSetup&&bt(t,e),jv={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:i,data:s,props:r,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const h=o[e];if(h!==void 0)switch(h){case 1:return i[e];case 2:return s[e];case 4:return n[e];case 3:return r[e]}else{if(zl(i,e))return o[e]=1,i[e];if(s!==It&&bt(s,e))return o[e]=2,s[e];if(bt(r,e))return o[e]=3,r[e];if(n!==It&&bt(n,e))return o[e]=4,n[e];Vc&&(o[e]=0)}}const c=qr[e];let u,f;if(c)return e==="$attrs"&&ln(t.attrs,"get",""),c(t);if((u=a.__cssModules)&&(u=u[e]))return u;if(n!==It&&bt(n,e))return o[e]=4,n[e];if(f=l.config.globalProperties,bt(f,e))return f[e]},set({_:t},e,n){const{data:i,setupState:s,ctx:r}=t;return zl(s,e)?(s[e]=n,!0):i!==It&&bt(i,e)?(i[e]=n,!0):bt(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(r[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:s,props:r,type:o}},a){let l;return!!(n[a]||t!==It&&a[0]!=="$"&&bt(t,a)||zl(e,a)||bt(r,a)||bt(i,a)||bt(qr,a)||bt(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:bt(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Ed(t){return Ze(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Vc=!0;function Qv(t){const e=qm(t),n=t.proxy,i=t.ctx;Vc=!1,e.beforeCreate&&Md(e.beforeCreate,t,"bc");const{data:s,computed:r,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:f,mounted:h,beforeUpdate:d,updated:m,activated:v,deactivated:g,beforeDestroy:p,beforeUnmount:b,destroyed:A,unmounted:y,render:w,renderTracked:M,renderTriggered:_,errorCaptured:x,serverPrefetch:I,expose:N,inheritAttrs:B,components:G,directives:J,filters:O}=e;if(c&&eb(c,i,null),o)for(const z in o){const ae=o[z];st(ae)&&(i[z]=ae.bind(n))}if(s){const z=s.call(n,n);Rt(z)&&(t.data=tf(z))}if(Vc=!0,r)for(const z in r){const ae=r[z],q=st(ae)?ae.bind(n,n):st(ae.get)?ae.get.bind(n,n):di,le=!st(ae)&&st(ae.set)?ae.set.bind(n):di,de=Vt({get:q,set:le});Object.defineProperty(i,z,{enumerable:!0,configurable:!0,get:()=>de.value,set:Le=>de.value=Le})}if(a)for(const z in a)Jm(a[z],i,n,z);if(l){const z=st(l)?l.call(n):l;Reflect.ownKeys(z).forEach(ae=>{Dv(ae,z[ae])})}u&&Md(u,t,"c");function Q(z,ae){Ze(ae)?ae.forEach(q=>z(q.bind(n))):ae&&z(ae.bind(n))}if(Q(Hv,f),Q(br,h),Q(Wv,d),Q(Xv,m),Q(Gv,v),Q(kv,g),Q(Jv,x),Q(Zv,M),Q(Kv,_),Q(Co,b),Q(Yv,y),Q($v,I),Ze(N))if(N.length){const z=t.exposed||(t.exposed={});N.forEach(ae=>{Object.defineProperty(z,ae,{get:()=>n[ae],set:q=>n[ae]=q,enumerable:!0})})}else t.exposed||(t.exposed={});w&&t.render===di&&(t.render=w),B!=null&&(t.inheritAttrs=B),G&&(t.components=G),J&&(t.directives=J),I&&Km(t)}function eb(t,e,n=di){Ze(t)&&(t=Gc(t));for(const i in t){const s=t[i];let r;Rt(s)?"default"in s?r=wa(s.from||i,s.default,!0):r=wa(s.from||i):r=wa(s),cn(r)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>r.value,set:o=>r.value=o}):e[i]=r}}function Md(t,e,n){Zn(Ze(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function Jm(t,e,n,i){let s=i.includes(".")?Ym(n,i):()=>n[i];if(Bt(t)){const r=e[t];st(r)&&Bi(s,r)}else if(st(t))Bi(s,t.bind(n));else if(Rt(t))if(Ze(t))t.forEach(r=>Jm(r,e,n,i));else{const r=st(t.handler)?t.handler.bind(n):e[t.handler];st(r)&&Bi(s,r,t)}}function qm(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:s,optionsCache:r,config:{optionMergeStrategies:o}}=t.appContext,a=r.get(e);let l;return a?l=a:!s.length&&!n&&!i?l=e:(l={},s.length&&s.forEach(c=>Xa(l,c,o,!0)),Xa(l,e,o)),Rt(e)&&r.set(e,l),l}function Xa(t,e,n,i=!1){const{mixins:s,extends:r}=e;r&&Xa(t,r,n,!0),s&&s.forEach(o=>Xa(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=tb[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const tb={data:Td,props:Ad,emits:Ad,methods:Br,computed:Br,beforeCreate:fn,created:fn,beforeMount:fn,mounted:fn,beforeUpdate:fn,updated:fn,beforeDestroy:fn,beforeUnmount:fn,destroyed:fn,unmounted:fn,activated:fn,deactivated:fn,errorCaptured:fn,serverPrefetch:fn,components:Br,directives:Br,watch:ib,provide:Td,inject:nb};function Td(t,e){return e?t?function(){return Yt(st(t)?t.call(this,this):t,st(e)?e.call(this,this):e)}:e:t}function nb(t,e){return Br(Gc(t),Gc(e))}function Gc(t){if(Ze(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function fn(t,e){return t?[...new Set([].concat(t,e))]:e}function Br(t,e){return t?Yt(Object.create(null),t,e):e}function Ad(t,e){return t?Ze(t)&&Ze(e)?[...new Set([...t,...e])]:Yt(Object.create(null),Ed(t),Ed(e??{})):e}function ib(t,e){if(!t)return e;if(!e)return t;const n=Yt(Object.create(null),t);for(const i in e)n[i]=fn(t[i],e[i]);return n}function jm(){return{app:null,config:{isNativeTag:pm,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let sb=0;function rb(t,e){return function(i,s=null){st(i)||(i=Yt({},i)),s!=null&&!Rt(s)&&(s=null);const r=jm(),o=new WeakSet,a=[];let l=!1;const c=r.app={_uid:sb++,_component:i,_props:s,_container:null,_context:r,_instance:null,version:Vb,get config(){return r.config},set config(u){},use(u,...f){return o.has(u)||(u&&st(u.install)?(o.add(u),u.install(c,...f)):st(u)&&(o.add(u),u(c,...f))),c},mixin(u){return r.mixins.includes(u)||r.mixins.push(u),c},component(u,f){return f?(r.components[u]=f,c):r.components[u]},directive(u,f){return f?(r.directives[u]=f,c):r.directives[u]},mount(u,f,h){if(!l){const d=c._ceVNode||mn(i,s);return d.appContext=r,h===!0?h="svg":h===!1&&(h=void 0),t(d,u,h),l=!0,c._container=u,u.__vue_app__=c,bl(d.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Zn(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(u,f){return r.provides[u]=f,c},runWithContext(u){const f=nr;nr=c;try{return u()}finally{nr=f}}};return c}}let nr=null;const ob=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${$n(e)}Modifiers`]||t[`${ps(e)}Modifiers`];function ab(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||It;let s=n;const r=e.startsWith("update:"),o=r&&ob(i,e.slice(7));o&&(o.trim&&(s=n.map(u=>Bt(u)?u.trim():u)),o.number&&(s=s.map(No)));let a,l=i[a=Ul(e)]||i[a=Ul($n(e))];!l&&r&&(l=i[a=Ul(ps(e))]),l&&Zn(l,t,6,s);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,Zn(c,t,6,s)}}const lb=new WeakMap;function Qm(t,e,n=!1){const i=n?lb:e.emitsCache,s=i.get(t);if(s!==void 0)return s;const r=t.emits;let o={},a=!1;if(!st(t)){const l=c=>{const u=Qm(c,e,!0);u&&(a=!0,Yt(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!r&&!a?(Rt(t)&&i.set(t,null),null):(Ze(r)?r.forEach(l=>o[l]=null):Yt(o,r),Rt(t)&&i.set(t,o),o)}function _l(t,e){return!t||!cl(e)?!1:(e=e.slice(2),e=e==="Once"?e:e.replace(/Once$/,""),bt(t,e[0].toLowerCase()+e.slice(1))||bt(t,ps(e))||bt(t,e))}function wd(t){const{type:e,vnode:n,proxy:i,withProxy:s,propsOptions:[r],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:f,data:h,setupState:d,ctx:m,inheritAttrs:v}=t,g=Ha(t);let p,b;try{if(n.shapeFlag&4){const y=s||i,w=y;p=ri(c.call(w,y,u,f,d,h,m)),b=a}else{const y=e;p=ri(y.length>1?y(f,{attrs:a,slots:o,emit:l}):y(f,null)),b=e.props?a:cb(a)}}catch(y){Is.length=0,ml(y,t,1),p=mn(Jn)}let A=p;if(b&&v!==!1){const y=Object.keys(b),{shapeFlag:w}=A;y.length&&w&7&&(r&&y.some(ul)&&(b=ub(b,r)),A=ar(A,b,!1,!0))}if(n.dirs&&(A=ar(A,null,!1,!0),A.dirs=A.dirs?A.dirs.concat(n.dirs):n.dirs),n.transition){const y=gl(A.type)&&$m(A)||A;Kr(y,n.transition)}return p=A,Ha(g),p}function eg(t,e=!0){let n;for(let i=0;i<t.length;i++){const s=t[i];if(cf(s)){if(s.type!==Jn||s.children==="v-if"){if(n)return;n=s}}else return}return n}const cb=t=>{let e;for(const n in t)(n==="class"||n==="style"||cl(n))&&((e||(e={}))[n]=t[n]);return e},ub=(t,e)=>{const n={};for(const i in t)(!ul(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function fb(t,e,n){const{props:i,children:s,component:r}=t,{props:o,children:a,patchFlag:l}=e,c=r.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?Rd(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let f=0;f<u.length;f++){const h=u[f];if(tg(o,i,h)&&!_l(c,h))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?Rd(i,o,c):!0:!!o;return!1}function Rd(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let s=0;s<i.length;s++){const r=i[s];if(!bt(t,r)||tg(e,t,r)&&!_l(n,r))return!0}return!1}function tg(t,e,n){const i=t[n],s=e[n];return n==="style"&&Rt(i)&&Rt(s)?!Hi(i,s):i!==s}function db({vnode:t,parent:e,suspense:n},i){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=i,t=s),s===t)(t=e.vnode).el=i,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=i)}const ng={},ig=()=>Object.create(ng),sg=t=>Object.getPrototypeOf(t)===ng;function hb(t,e,n,i=!1){const s={},r=ig();t.propsDefaults=Object.create(null),rg(t,e,s,r);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=i?s:bv(s):t.type.props?t.props=s:t.props=r,t.attrs=r}function pb(t,e,n,i){const{props:s,attrs:r,vnode:{patchFlag:o}}=t,a=xt(s),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let f=0;f<u.length;f++){let h=u[f];if(_l(t.emitsOptions,h))continue;const d=e[h];if(l)if(bt(r,h))d!==r[h]&&(r[h]=d,c=!0);else{const m=$n(h);s[m]=kc(l,a,m,d,t,!1)}else d!==r[h]&&(r[h]=d,c=!0)}}}else{rg(t,e,s,r)&&(c=!0);let u;for(const f in a)(!e||!bt(e,f)&&((u=ps(f))===f||!bt(e,u)))&&(l?n&&(n[f]!==void 0||n[u]!==void 0)&&(s[f]=kc(l,a,f,void 0,t,!0)):delete s[f]);if(r!==a)for(const f in r)(!e||!bt(e,f))&&(delete r[f],c=!0)}c&&Di(t.attrs,"set","")}function rg(t,e,n,i){const[s,r]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(Xr(l))continue;const c=e[l];let u;s&&bt(s,u=$n(l))?!r||!r.includes(u)?n[u]=c:(a||(a={}))[u]=c:_l(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(r){const l=xt(n),c=a||It;for(let u=0;u<r.length;u++){const f=r[u];n[f]=kc(s,l,f,c[f],t,!bt(c,f))}}return o}function kc(t,e,n,i,s,r){const o=t[n];if(o!=null){const a=bt(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&st(l)){const{propsDefaults:c}=s;if(n in c)i=c[n];else{const u=Lo(s);i=c[n]=l.call(null,e),u()}}else i=l;s.ce&&s.ce._setProp(n,i)}o[0]&&(r&&!a?i=!1:o[1]&&(i===""||i===ps(n))&&(i=!0))}return i}const mb=new WeakMap;function og(t,e,n=!1){const i=n?mb:e.propsCache,s=i.get(t);if(s)return s;const r=t.props,o={},a=[];let l=!1;if(!st(t)){const u=f=>{l=!0;const[h,d]=og(f,e,!0);Yt(o,h),d&&a.push(...d)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!r&&!l)return Rt(t)&&i.set(t,As),As;if(Ze(r))for(let u=0;u<r.length;u++){const f=$n(r[u]);Nd(f)&&(o[f]=It)}else if(r)for(const u in r){const f=$n(u);if(Nd(f)){const h=r[u],d=o[f]=Ze(h)||st(h)?{type:h}:Yt({},h),m=d.type;let v=!1,g=!0;if(Ze(m))for(let p=0;p<m.length;++p){const b=m[p],A=st(b)&&b.name;if(A==="Boolean"){v=!0;break}else A==="String"&&(g=!1)}else v=st(m)&&m.name==="Boolean";d[0]=v,d[1]=g,(v||bt(d,"default"))&&a.push(f)}}const c=[o,a];return Rt(t)&&i.set(t,c),c}function Nd(t){return t[0]!=="$"&&!Xr(t)}const af=t=>t==="_"||t==="_ctx"||t==="$stable",lf=t=>Ze(t)?t.map(ri):[ri(t)],gb=(t,e,n)=>{if(e._n)return e;const i=Pv((...s)=>lf(e(...s)),n);return i._c=!1,i},ag=(t,e,n)=>{const i=t._ctx;for(const s in t){if(af(s))continue;const r=t[s];if(st(r))e[s]=gb(s,r,i);else if(r!=null){const o=lf(r);e[s]=()=>o}}},lg=(t,e)=>{const n=lf(e);t.slots.default=()=>n},cg=(t,e,n)=>{for(const i in e)(n||!af(i))&&(t[i]=e[i])},_b=(t,e,n)=>{const i=t.slots=ig();if(t.vnode.shapeFlag&32){const s=e._;s?(cg(i,e,n),n&&bm(i,"_",s,!0)):ag(e,i)}else e&&lg(t,e)},vb=(t,e,n)=>{const{vnode:i,slots:s}=t;let r=!0,o=It;if(i.shapeFlag&32){const a=e._;a?n&&a===1?r=!1:cg(s,e,n):(r=!e.$stable,ag(e,s)),o=e}else e&&(lg(t,e),o={default:1});if(r)for(const a in s)!af(a)&&o[a]==null&&delete s[a]},dn=Mb;function bb(t){return Sb(t)}function Sb(t,e){const n=dl();n.__VUE__=!0;const{insert:i,remove:s,patchProp:r,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:f,nextSibling:h,setScopeId:d=di,insertStaticContent:m}=t,v=(R,L,X,ee=null,ie=null,se=null,be=void 0,pe=null,ve=!!L.dynamicChildren)=>{if(R===L)return;R&&!wr(R,L)&&(ee=ge(R),Le(R,ie,se,!0),R=null),L.patchFlag===-2&&(ve=!1,L.dynamicChildren=null),L.dynamicChildren&&R&&R.dynamicChildren&&R.dynamicChildren.hasOnce&&(L.dynamicChildren===As&&(L.dynamicChildren=[]),L.dynamicChildren.hasOnce=!0);const{type:re,ref:Fe,shapeFlag:xe}=L;switch(re){case vl:g(R,L,X,ee);break;case Jn:p(R,L,X,ee);break;case Ra:R==null&&b(L,X,ee,be);break;case Pt:G(R,L,X,ee,ie,se,be,pe,ve);break;default:xe&1?w(R,L,X,ee,ie,se,be,pe,ve):xe&6?J(R,L,X,ee,ie,se,be,pe,ve):(xe&64||xe&128)&&re.process(R,L,X,ee,ie,se,be,pe,ve,we)}Fe!=null&&ie?Zr(Fe,R&&R.ref,se,L||R,!L):Fe==null&&R&&R.ref!=null&&Zr(R.ref,null,se,R,!0)},g=(R,L,X,ee)=>{if(R==null)i(L.el=a(L.children),X,ee);else{const ie=L.el=R.el;L.children!==R.children&&c(ie,L.children)}},p=(R,L,X,ee)=>{R==null?i(L.el=l(L.children||""),X,ee):L.el=R.el},b=(R,L,X,ee)=>{[R.el,R.anchor]=m(R.children,L,X,ee,R.el,R.anchor)},A=({el:R,anchor:L},X,ee)=>{let ie;for(;R&&R!==L;)ie=h(R),i(R,X,ee),R=ie;i(L,X,ee)},y=({el:R,anchor:L})=>{let X;for(;R&&R!==L;)X=h(R),s(R),R=X;s(L)},w=(R,L,X,ee,ie,se,be,pe,ve)=>{if(L.type==="svg"?be="svg":L.type==="math"&&(be="mathml"),R==null)M(L,X,ee,ie,se,be,pe,ve);else{const re=R.el&&R.el._isVueCE?R.el:null;try{re&&re._beginPatch(),I(R,L,ie,se,be,pe,ve)}finally{re&&re._endPatch()}}},M=(R,L,X,ee,ie,se,be,pe)=>{let ve,re;const{props:Fe,shapeFlag:xe,transition:De,dirs:C}=R;if(ve=R.el=o(R.type,se,Fe&&Fe.is,Fe),xe&8?u(ve,R.children):xe&16&&x(R.children,ve,null,ee,ie,Hl(R,se),be,pe),C&&bs(R,null,ee,"created"),_(ve,R,R.scopeId,be,ee),Fe){for(const Ye in Fe)Ye!=="value"&&!Xr(Ye)&&r(ve,Ye,null,Fe[Ye],se,ee);"value"in Fe&&r(ve,"value",null,Fe.value,se),(re=Fe.onVnodeBeforeMount)&&Qn(re,ee,R)}C&&bs(R,null,ee,"beforeMount");const Je=xb(ie,De);Je?De.beforeEnter(ve):De&&!De.persisted&&(ve[Eb]=!0),i(ve,L,X),((re=Fe&&Fe.onVnodeMounted)||Je||C)&&dn(()=>{try{re&&Qn(re,ee,R),Je&&De.enter(ve),C&&bs(R,null,ee,"mounted")}finally{}},ie)},_=(R,L,X,ee,ie)=>{if(X&&d(R,X),ee)for(let se=0;se<ee.length;se++)d(R,ee[se]);if(ie){let se=ie.subTree;if(L===se||dg(se.type)&&(se.ssContent===L||se.ssFallback===L)){const be=ie.vnode;_(R,be,be.scopeId,be.slotScopeIds,ie.parent)}}},x=(R,L,X,ee,ie,se,be,pe,ve=0)=>{for(let re=ve;re<R.length;re++){const Fe=R[re]=pe?Li(R[re]):ri(R[re]);v(null,Fe,L,X,ee,ie,se,be,pe)}},I=(R,L,X,ee,ie,se,be)=>{const pe=L.el=R.el;let{patchFlag:ve,dynamicChildren:re,dirs:Fe}=L;ve|=R.patchFlag&16;const xe=R.props||It,De=L.props||It;let C;if(X&&Ss(X,!1),(C=De.onVnodeBeforeUpdate)&&Qn(C,X,L,R),Fe&&bs(L,R,X,"beforeUpdate"),X&&Ss(X,!0),re&&(!R.dynamicChildren||R.dynamicChildren.length!==re.length)&&(ve=0,be=!1,re=null),(xe.innerHTML&&De.innerHTML==null||xe.textContent&&De.textContent==null)&&u(pe,""),re?N(R.dynamicChildren,re,pe,X,ee,Hl(L,ie),se):be||ae(R,L,pe,null,X,ee,Hl(L,ie),se,!1),ve>0){if(ve&16)B(pe,xe,De,X,ie);else if(ve&2&&xe.class!==De.class&&r(pe,"class",null,De.class,ie),ve&4&&r(pe,"style",xe.style,De.style,ie),ve&8){const Je=L.dynamicProps;for(let Ye=0;Ye<Je.length;Ye++){const We=Je[Ye],_e=xe[We],ot=De[We];(ot!==_e||We==="value")&&r(pe,We,_e,ot,ie,X)}}ve&1&&R.children!==L.children&&u(pe,L.children)}else!be&&re==null&&B(pe,xe,De,X,ie);((C=De.onVnodeUpdated)||Fe)&&dn(()=>{C&&Qn(C,X,L,R),Fe&&bs(L,R,X,"updated")},ee)},N=(R,L,X,ee,ie,se,be)=>{for(let pe=0;pe<L.length;pe++){const ve=R[pe],re=L[pe],Fe=ve.el||jr(ve),xe=Fe&&(ve.type===Pt||!wr(ve,re)||ve.shapeFlag&198)?f(Fe):X;v(ve,re,xe,null,ee,ie,se,be,!0)}},B=(R,L,X,ee,ie)=>{if(L!==X){if(L!==It)for(const se in L)!Xr(se)&&!(se in X)&&r(R,se,L[se],null,ie,ee);for(const se in X){if(Xr(se))continue;const be=X[se],pe=L[se];be!==pe&&se!=="value"&&r(R,se,pe,be,ie,ee)}"value"in X&&r(R,"value",L.value,X.value,ie)}},G=(R,L,X,ee,ie,se,be,pe,ve)=>{const re=L.el=R?R.el:a(""),Fe=L.anchor=R?R.anchor:a("");let{patchFlag:xe,dynamicChildren:De,slotScopeIds:C}=L;C&&(pe=pe?pe.concat(C):C),R==null?(i(re,X,ee),i(Fe,X,ee),x(L.children||[],X,Fe,ie,se,be,pe,ve)):xe>0&&xe&64&&De&&R.dynamicChildren&&R.dynamicChildren.length===De.length?(N(R.dynamicChildren,De,X,ie,se,be,pe),(L.key!=null||ie&&L===ie.subTree)&&ug(R,L,!0)):ae(R,L,X,Fe,ie,se,be,pe,ve)},J=(R,L,X,ee,ie,se,be,pe,ve)=>{L.slotScopeIds=pe,R==null?L.shapeFlag&512?ie.ctx.activate(L,X,ee,be,ve):O(L,X,ee,ie,se,be,ve):K(R,L,ve)},O=(R,L,X,ee,ie,se,be)=>{const pe=R.component=Lb(R,ee,ie);if(of(R)&&(pe.ctx.renderer=we),Db(pe,!1,be),pe.asyncDep){if(ie&&ie.registerDep(pe,Q,be,se),!R.el){const ve=pe.subTree=mn(Jn);p(null,ve,L,X),R.placeholder=ve.el}}else Q(pe,R,L,X,ie,se,be)},K=(R,L,X)=>{const ee=L.component=R.component;if(fb(R,L,X))if(ee.asyncDep&&!ee.asyncResolved){L.el=R.el,L.placeholder=R.placeholder,z(ee,L,X);return}else ee.next=L,ee.update();else L.el=R.el,L.placeholder=R.placeholder,ee.vnode=L},Q=(R,L,X,ee,ie,se,be)=>{const pe=()=>{if(R.isMounted){let{next:xe,bu:De,u:C,parent:Je,vnode:Ye}=R;{const Ve=fg(R);if(Ve){xe&&(xe.el=Ye.el,z(R,xe,be)),Ve.asyncDep.then(()=>{const T=()=>{R.job.flags&8||(ie&&ie.pendingBranch?dn(T,ie):re())};T.flags=48,dn(T,ie)});return}}let We=xe,_e;Ss(R,!1),xe?(xe.el=Ye.el,z(R,xe,be)):xe=Ye,De&&Aa(De),(_e=xe.props&&xe.props.onVnodeBeforeUpdate)&&Qn(_e,Je,xe,Ye),Ss(R,!0);const ot=wd(R),Pe=R.subTree;R.subTree=ot,v(Pe,ot,f(Pe.el||jr(Pe)),ge(Pe),R,ie,se),xe.el=ot.el,We===null&&db(R,ot.el),C&&dn(C,ie),(_e=xe.props&&xe.props.onVnodeUpdated)&&dn(()=>Qn(_e,Je,xe,Ye),ie)}else{let xe;const{el:De,props:C}=L,{bm:Je,m:Ye,parent:We,root:_e,type:ot}=R,Pe=Jr(L);Ss(R,!1),Je&&Aa(Je),!Pe&&(xe=C&&C.onVnodeBeforeMount)&&Qn(xe,We,L),Ss(R,!0);{_e.ce&&_e.ce._hasShadowRoot()&&_e.ce._injectChildStyle(ot,R.parent?R.parent.type:void 0);const Ve=R.subTree=wd(R);v(null,Ve,X,ee,R,ie,se),L.el=Ve.el}if(Ye&&dn(Ye,ie),!Pe&&(xe=C&&C.onVnodeMounted)){const Ve=L;dn(()=>Qn(xe,We,Ve),ie)}(L.shapeFlag&256||We&&Jr(We.vnode)&&We.vnode.shapeFlag&256)&&R.a&&dn(R.a,ie),R.isMounted=!0,L=X=ee=null}};R.scope.on();const ve=R.effect=new Em(pe);R.scope.off();const re=R.update=ve.run.bind(ve),Fe=R.job=ve.runIfDirty.bind(ve);Fe.i=R,Fe.id=R.uid,ve.scheduler=()=>rf(Fe),Ss(R,!0),re()},z=(R,L,X)=>{L.component=R;const ee=R.vnode.props;R.vnode=L,R.next=null,pb(R,L.props,ee,X),vb(R,L.children,X),mi(),km(R),gi()},ae=(R,L,X,ee,ie,se,be,pe,ve=!1)=>{const re=R&&R.children,Fe=R?R.shapeFlag:0,xe=L.children,{patchFlag:De,shapeFlag:C}=L;if(De>0){if(De&128){le(re,xe,X,ee,ie,se,be,pe,ve);return}else if(De&256){q(re,xe,X,ee,ie,se,be,pe,ve);return}}C&8?(Fe&16&&Z(re,ie,se),xe!==re&&u(X,xe)):Fe&16?C&16?le(re,xe,X,ee,ie,se,be,pe,ve):Z(re,ie,se,!0):(Fe&8&&u(X,""),C&16&&x(xe,X,ee,ie,se,be,pe,ve))},q=(R,L,X,ee,ie,se,be,pe,ve)=>{R=R||As,L=L||As;const re=R.length,Fe=L.length,xe=Math.min(re,Fe);let De;for(De=0;De<xe;De++){const C=L[De]=ve?Li(L[De]):ri(L[De]);v(R[De],C,X,null,ie,se,be,pe,ve)}re>Fe?Z(R,ie,se,!0,!1,xe):x(L,X,ee,ie,se,be,pe,ve,xe)},le=(R,L,X,ee,ie,se,be,pe,ve)=>{let re=0;const Fe=L.length;let xe=R.length-1,De=Fe-1;for(;re<=xe&&re<=De;){const C=R[re],Je=L[re]=ve?Li(L[re]):ri(L[re]);if(wr(C,Je))v(C,Je,X,null,ie,se,be,pe,ve);else break;re++}for(;re<=xe&&re<=De;){const C=R[xe],Je=L[De]=ve?Li(L[De]):ri(L[De]);if(wr(C,Je))v(C,Je,X,null,ie,se,be,pe,ve);else break;xe--,De--}if(re>xe){if(re<=De){const C=De+1,Je=C<Fe?L[C].el:ee;for(;re<=De;)v(null,L[re]=ve?Li(L[re]):ri(L[re]),X,Je,ie,se,be,pe,ve),re++}}else if(re>De)for(;re<=xe;)Le(R[re],ie,se,!0),re++;else{const C=re,Je=re,Ye=new Map;for(re=Je;re<=De;re++){const W=L[re]=ve?Li(L[re]):ri(L[re]);W.key!=null&&Ye.set(W.key,re)}let We,_e=0;const ot=De-Je+1;let Pe=!1,Ve=0;const T=new Array(ot);for(re=0;re<ot;re++)T[re]=0;for(re=C;re<=xe;re++){const W=R[re];if(_e>=ot){Le(W,ie,se,!0);continue}let me;if(W.key!=null)me=Ye.get(W.key);else for(We=Je;We<=De;We++)if(T[We-Je]===0&&wr(W,L[We])){me=We;break}me===void 0?Le(W,ie,se,!0):(T[me-Je]=re+1,me>=Ve?Ve=me:Pe=!0,v(W,L[me],X,null,ie,se,be,pe,ve),_e++)}const S=Pe?yb(T):As;for(We=S.length-1,re=ot-1;re>=0;re--){const W=Je+re,me=L[W],fe=L[W+1],Ee=W+1<Fe?fe.el||jr(fe):ee;T[re]===0?v(null,me,X,Ee,ie,se,be,pe,ve):Pe&&(We<0||re!==S[We]?de(me,X,Ee,2):We--)}}},de=(R,L,X,ee,ie=null)=>{const{el:se,type:be,transition:pe,children:ve,shapeFlag:re}=R;if(re&6){de(R.component.subTree,L,X,ee);return}if(re&128){R.suspense.move(L,X,ee);return}if(re&64){be.move(R,L,X,we);return}if(be===Pt){i(se,L,X);for(let xe=0;xe<ve.length;xe++)de(ve[xe],L,X,ee);i(R.anchor,L,X);return}if(be===Ra){A(R,L,X);return}if(ee!==2&&re&1&&pe)if(ee===0)pe.persisted&&!se[kl]?i(se,L,X):(pe.beforeEnter(se),i(se,L,X),dn(()=>pe.enter(se),ie));else{const{leave:xe,delayLeave:De,afterLeave:C}=pe,Je=()=>{R.ctx.isUnmounted?s(se):i(se,L,X)},Ye=()=>{const We=se._isLeaving||!!se[kl];se._isLeaving&&se[kl](!0),pe.persisted&&!We?Je():xe(se,()=>{Je(),C&&C()})};De?De(se,Je,Ye):Ye()}else i(se,L,X)},Le=(R,L,X,ee=!1,ie=!1)=>{const{type:se,props:be,ref:pe,children:ve,dynamicChildren:re,shapeFlag:Fe,patchFlag:xe,dirs:De,cacheIndex:C,memo:Je}=R;if((xe===-2||re&&re.hasOnce)&&(ie=!1),pe!=null&&(mi(),Zr(pe,null,X,R,!0),gi()),C!=null&&(!R.ctx||R.ctx===L)&&(L.renderCache[C]=void 0),Fe&256&&L.ctx.deactivate(R))return;const Ye=Fe&1&&De,We=!Jr(R);let _e;if(We&&(_e=be&&be.onVnodeBeforeUnmount)&&Qn(_e,L,R),Fe&6)k(R.component,X,ee);else{if(Fe&128){R.suspense.unmount(X,ee);return}Ye&&bs(R,null,L,"beforeUnmount"),Fe&64?R.type.remove(R,L,X,we,ee):re&&!re.hasOnce&&(se!==Pt||xe>0&&xe&64)?Z(re,L,X,!1,!0):(se===Pt&&xe&384||!ie&&Fe&16)&&Z(ve,L,X),ee&&he(R)}const ot=Je!=null&&C==null;(We&&(_e=be&&be.onVnodeUnmounted)||Ye||ot)&&dn(()=>{_e&&Qn(_e,L,R),Ye&&bs(R,null,L,"unmounted"),ot&&(R.el=null)},X)},he=R=>{const{type:L,el:X,anchor:ee,transition:ie}=R,se=L===Pt;if(se&&!ie){U(X,ee);return}if(L===Ra){y(R),ie&&!ie.persisted&&ie.afterLeave&&ie.afterLeave();return}const be=se?Fc(R):R,pe=()=>{se?f(X)&&U(X,ee):s(X),ie&&!ie.persisted&&ie.afterLeave&&ie.afterLeave()};if(be&&be.shapeFlag&1&&ie&&!ie.persisted){const{leave:ve,delayLeave:re}=ie,Fe=be.el,xe=()=>ve(Fe,pe);re?re(Fe,pe,xe):xe()}else pe()},U=(R,L)=>{let X;for(;R!==L;)X=h(R),s(R),R=X;s(L)},k=(R,L,X)=>{const{bum:ee,scope:ie,job:se,subTree:be,um:pe,m:ve,a:re}=R;Id(ve),Id(re),ee&&Aa(ee),ie.stop(),se?(se.flags|=8,Le(be,R,L,X)):be&&(be.transition=R.vnode.transition,Le(be,R,L,X)),pe&&dn(pe,L);const Fe=()=>{R.isUnmounted=!0};Fe.flags=16,dn(Fe,L)},Z=(R,L,X,ee=!1,ie=!1,se=0)=>{for(let be=se;be<R.length;be++)Le(R[be],L,X,ee,ie)},ge=R=>{if(R.shapeFlag&6)return ge(R.component.subTree);if(R.shapeFlag&128)return R.suspense.next();const L=h(R.anchor||R.el),X=L&&L[Bv];return X?h(X):L},te=(R,L,X)=>{const ee=R&&L._vnode?void 0:R&&R.component?R.component.uid:Cb();Lv(()=>{R==null?L._vnode&&Le(L._vnode,null,null,!0):v(L._vnode||null,R,L,null,null,null,X),L._vnode=R},ee)},we={p:v,um:Le,m:de,r:he,mt:O,mc:x,pc:ae,pbc:N,n:ge,o:t};return{render:te,hydrate:void 0,createApp:rb(te)}}function Hl({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function Ss({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function xb(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function ug(t,e,n=!1){const i=t.children,s=e.children;if(Ze(i)&&Ze(s))for(let r=0;r<i.length;r++){const o=i[r];let a=s[r];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[r]=Li(s[r]),a.el=o.el),!n&&a.patchFlag!==-2&&ug(o,a)),a.type===vl&&(a.patchFlag===-1&&(a=s[r]=Li(a)),a.el=o.el),a.type===Jn&&!a.el&&(a.el=o.el)}}function yb(t){const e=t.slice(),n=[0];let i,s,r,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(s=n[n.length-1],t[s]<c){e[i]=s,n.push(i);continue}for(r=0,o=n.length-1;r<o;)a=r+o>>1,t[n[a]]<c?r=a+1:o=a;c<t[n[r]]&&(r>0&&(e[i]=n[r-1]),n[r]=i)}}for(r=n.length,o=n[r-1];r-- >0;)n[r]=o,o=e[o];return n}function fg(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:fg(e)}function Id(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function jr(t){if(t.placeholder)return t.placeholder;const e=t.component;if(e)return jr(e.subTree);const n=t.suspense;return n&&n.activeBranch?jr(n.activeBranch):null}const dg=t=>t.__isSuspense,Eb=Symbol("_deferredEnter");function Mb(t,e){e&&e.pendingBranch?Ze(t)?e.effects.push(...t):e.effects.push(t):Cv(t)}const Pt=Symbol.for("v-fgt"),vl=Symbol.for("v-txt"),Jn=Symbol.for("v-cmt"),Ra=Symbol.for("v-stc"),Is=[];let Nn=null;function Ke(t=!1){Is.push(Nn=t?null:[])}function hg(){Is.pop(),Nn=Is[Is.length-1]||null}let uo=1;function Cd(t,e=!1){uo+=t,t<0&&Nn&&e&&(Nn.hasOnce=!0)}function pg(t){return t.dynamicChildren=uo>0?Nn||As:null,hg(),uo>0&&Nn&&Nn.push(t),t}function qe(t,e,n,i,s,r){return pg(D(t,e,n,i,s,r,!0))}function Tb(t,e,n,i,s){return pg(mn(t,e,n,i,s,!0))}function cf(t){return t?t.__v_isVNode===!0:!1}function wr(t,e){return t.type===e.type&&t.key===e.key}const mg=({key:t})=>t??null,Na=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?Bt(t)||cn(t)||st(t)?{i:On,r:t,k:e,f:!!n}:t:null);function D(t,e=null,n=null,i=0,s=null,r=t===Pt?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&mg(e),ref:e&&Na(e),scopeId:Wm,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:r,patchFlag:i,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:On};return a?(Ya(l,n),r&128&&t.normalize(l)):n&&(l.shapeFlag|=Bt(n)?8:16),uo>0&&!o&&Nn&&(l.patchFlag>0||r&6)&&l.patchFlag!==32&&Nn.push(l),l}const mn=Ab;function Ab(t,e=null,n=null,i=0,s=null,r=!1){if((!t||t===qv)&&(t=Jn),cf(t)){const a=ar(t,e,!0);return n&&Ya(a,n),uo>0&&!r&&Nn&&(a.shapeFlag&6?Nn[Nn.indexOf(t)]=a:Nn.push(a)),a.patchFlag=-2,a}if(Bb(t)&&(t=t.__vccOpts),e){e=wb(e);let{class:a,style:l}=e;a&&!Bt(a)&&(e.class=ct(a)),Rt(l)&&(sf(l)&&!Ze(l)&&(l=Yt({},l)),e.style=hl(l))}const o=Bt(t)?1:dg(t)?128:gl(t)?64:Rt(t)?4:st(t)?2:0;return D(t,e,n,i,s,o,r,!0)}function wb(t){return t?sf(t)?Yt({},t):sg(t)?Yt({},t[bg]||t):t:null}function ar(t,e,n=!1,i=!1){const{props:s,ref:r,patchFlag:o,children:a,transition:l}=t,c=e?Nb(s||{},e):s,u={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&mg(c),ref:e&&e.ref?n&&r?Ze(r)?r.concat(Na(e)):[r,Na(e)]:Na(e):r,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Pt?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&ar(t.ssContent),ssFallback:t.ssFallback&&ar(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce,cacheIndex:t.cacheIndex};return l&&i&&Kr(u,l.clone(u)),u}function Vr(t=" ",e=0){return mn(vl,null,t,e)}function Rb(t,e){const n=mn(Ra,null,t);return n.staticCount=e,n}function Dn(t="",e=!1){return e?(Ke(),Tb(Jn,null,t)):mn(Jn,null,t)}function ri(t){return t==null||typeof t=="boolean"?mn(Jn):Ze(t)?mn(Pt,null,t.slice()):cf(t)?Li(t):mn(vl,null,String(t))}function Li(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:ar(t)}function Ya(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(Ze(e))n=16;else if(typeof e=="object")if(i&65){const s=e.default;s&&(s._c&&(s._d=!1),Ya(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!sg(e)?e._ctx=On:s===3&&On&&(On.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else if(st(e)){if(i&65){Ya(t,{default:e});return}e={default:e,_ctx:On},n=32}else e=String(e),i&64?(n=16,e=[Vr(e)]):n=8;t.children=e,t.shapeFlag|=n}function Nb(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const s in i)if(s==="class")e.class!==i.class&&(e.class=ct([e.class,i.class]));else if(s==="style")e.style=hl([e.style,i.style]);else if(cl(s)){const r=e[s],o=i[s];o&&r!==o&&!(Ze(r)&&r.includes(o))?e[s]=r?[].concat(r,o):o:o==null&&r==null&&!ul(s)&&(e[s]=o)}else s!==""&&(e[s]=i[s])}return e}function Qn(t,e,n,i=null){Zn(t,e,7,[n,i])}const Ib=jm();let gg=0;function Cb(){return gg}function Lb(t,e,n){const i=t.type,s=(e?e.appContext:t.appContext)||Ib,r={uid:gg++,vnode:t,type:i,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new tv(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:og(i,s),emitsOptions:Qm(i,s),emit:null,emitted:null,propsDefaults:It,inheritAttrs:i.inheritAttrs,ctx:It,data:It,props:It,attrs:It,slots:It,refs:It,setupState:It,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return r.ctx={_:r},r.root=e?e.root:r,r.emit=ab.bind(null,r),t.ce&&t.ce(r),r}let gn=null;const Pb=()=>gn||On;let $a,fo;{const t=dl(),e=(n,i)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(i),r=>{s.length>1?s.forEach(o=>o(r)):s[0](r)}};$a=e("__VUE_INSTANCE_SETTERS__",n=>gn=n),fo=e("__VUE_SSR_SETTERS__",n=>ho=n)}const Lo=t=>{const e=gn;return $a(t),t.scope.on(),()=>{t.scope.off(),$a(e)}},Ld=()=>{gn&&gn.scope.off(),$a(null)};function _g(t){return t.vnode.shapeFlag&4}let ho=!1;function Db(t,e=!1,n=!1){e&&fo(e);const{props:i,children:s}=t.vnode,r=_g(t);hb(t,i,r,e),_b(t,s,n||e);const o=r?Ub(t,e):void 0;return e&&fo(!1),o}function Ub(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,jv);const{setup:i}=n;if(i){mi();const s=t.setupContext=i.length>1?Fb(t):null,r=Lo(t),o=Io(i,t,0,[t.props,s]),a=mm(o);if(gi(),r(),(a||t.sp)&&!Jr(t)&&Km(t),a){if(o.then(Ld,Ld),e)return o.then(l=>{fo(!0);try{Pd(t,l,e)}finally{fo(!1)}}).catch(l=>{ml(l,t,0,void 0,!0),t.ssrRender=(c,u)=>u("<!---->")});t.asyncDep=o}else Pd(t,o)}else vg(t)}function Pd(t,e,n){st(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:Rt(e)&&(t.setupState=Bm(e)),vg(t)}function vg(t,e,n){const i=t.type;t.render||(t.render=i.render||di);{const s=Lo(t);mi();try{Qv(t)}finally{gi(),s()}}}const bg=Symbol(),Ob={get(t,e){return ln(t,"get",""),e===bg?t:t[e]}};function Fb(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Ob),slots:t.slots,emit:t.emit,expose:e}}function bl(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(Bm(Sv(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in qr)return qr[n](t)},has(e,n){return n in e||n in qr}})):t.proxy}function Bb(t){return st(t)&&"__vccOpts"in t}const Vt=(t,e)=>Av(t,e,ho),Vb="3.5.45";/**
* @vue/runtime-dom v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let zc;const Dd=typeof window<"u"&&window.trustedTypes;if(Dd)try{zc=Dd.createPolicy("vue",{createHTML:t=>t})}catch{}const Sg=zc?t=>zc.createHTML(t):t=>t,Gb="http://www.w3.org/2000/svg",kb="http://www.w3.org/1998/Math/MathML",Ii=typeof document<"u"?document:null,Ud=Ii&&Ii.createElement("template"),zb={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const s=e==="svg"?Ii.createElementNS(Gb,t):e==="mathml"?Ii.createElementNS(kb,t):n?Ii.createElement(t,{is:n}):Ii.createElement(t);return t==="select"&&i&&i.multiple!=null&&s.setAttribute("multiple",i.multiple),s},createText:t=>Ii.createTextNode(t),createComment:t=>Ii.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Ii.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,s,r){const o=n?n.previousSibling:e.lastChild;if(s&&(s===r||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===r||!(s=s.nextSibling)););else{Ud.innerHTML=Sg(i==="svg"?`<svg>${t}</svg>`:i==="mathml"?`<math>${t}</math>`:t);const a=Ud.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Hb=Symbol("_vtc");function Wb(t,e,n){const i=t[Hb];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const Ka=Symbol("_vod"),xg=Symbol("_vsh"),Ho={name:"show",beforeMount(t,{value:e},{transition:n}){t[Ka]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):Rr(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:i}){!e!=!n&&(i?e?(i.beforeEnter(t),Rr(t,!0),i.enter(t)):i.leave(t,()=>{Rr(t,!1)}):Rr(t,e))},beforeUnmount(t,{value:e}){Rr(t,e)}};function Rr(t,e){t.style.display=e?t[Ka]:"none",t[xg]=!e}const Xb=Symbol(""),Yb=/(?:^|;)\s*display\s*:/;function $b(t,e,n){const i=t.style,s=Bt(n);let r=!1;if(n&&!s){if(e)if(Bt(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Gr(i,a,"")}else for(const o in e)n[o]==null&&Gr(i,o,"");for(const o in n){o==="display"&&(r=!0);const a=n[o];a!=null?Zb(t,o,!Bt(e)&&e?e[o]:void 0,a)||Gr(i,o,a):Gr(i,o,"")}}else if(s){if(e!==n){const o=i[Xb];o&&(n+=";"+o),i.cssText=n,r=Yb.test(n)}}else e&&t.removeAttribute("style");Ka in t&&((!s||e!==n)&&(t[Ka]=r?i.display:""),t[xg]&&(i.display="none"))}const Wo=/\s*!important$/;function Gr(t,e,n){if(Ze(n))n.forEach(i=>Gr(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))Wo.test(n)?t.setProperty(e,n.replace(Wo,""),"important"):t.setProperty(e,n);else{const i=Kb(t,e);Wo.test(n)?t.setProperty(ps(i),n.replace(Wo,""),"important"):t[i]=n}}const Od=["Webkit","Moz","ms"],Wl={};function Kb(t,e){const n=Wl[e];if(n)return n;let i=$n(e);if(i!=="filter"&&i in t)return Wl[e]=i;i=vm(i);for(let s=0;s<Od.length;s++){const r=Od[s]+i;if(r in t)return Wl[e]=r}return e}function Zb(t,e,n,i){return t.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&Bt(i)&&n===i}const Fd="http://www.w3.org/1999/xlink";function Bd(t,e,n,i,s,r=j0(e)){i&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Fd,e.slice(6,e.length)):t.setAttributeNS(Fd,e,n):n==null||r&&!Sm(n)?t.removeAttribute(e):t.setAttribute(e,r?"":pi(n)?String(n):n)}function Vd(t,e,n,i,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?Sg(n):n);return}const r=t.tagName;if(e==="value"&&r!=="PROGRESS"&&!r.includes("-")){const a=r==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=Sm(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function is(t,e,n,i){t.addEventListener(e,n,i)}function Jb(t,e,n,i){t.removeEventListener(e,n,i)}const Gd=Symbol("_vei");function qb(t,e,n,i,s=null){const r=t[Gd]||(t[Gd]={}),o=r[e];if(i&&o)o.value=i;else{const[a,l]=eS(e);if(i){const c=r[e]=iS(i,s);is(t,a,c,l)}else o&&(Jb(t,a,o,l),r[e]=void 0)}}const jb=/(Once|Passive|Capture)$/,Qb=/^on:?(?:Once|Passive|Capture)$/;function eS(t){let e,n;for(;(n=t.match(jb))&&!Qb.test(t);)e||(e={}),t=t.slice(0,t.length-n[1].length),e[n[1].toLowerCase()]=!0;return[t[2]===":"?t.slice(3):ps(t.slice(2)),e]}let Xl=0;const tS=Promise.resolve(),nS=()=>Xl||(tS.then(()=>Xl=0),Xl=Date.now());function iS(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;const s=n.value;if(Ze(s)){const r=i.stopImmediatePropagation;i.stopImmediatePropagation=()=>{r.call(i),i._stopped=!0};const o=s.slice(),a=[i];for(let l=0;l<o.length&&!i._stopped;l++){const c=o[l];c&&Zn(c,e,5,a)}}else Zn(s,e,5,[i])};return n.value=t,n.attached=nS(),n}const kd=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,sS=(t,e,n,i,s,r)=>{const o=s==="svg";e==="class"?Wb(t,i,o):e==="style"?$b(t,n,i):cl(e)?ul(e)||qb(t,e,n,i,r):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):rS(t,e,i,o))?(Vd(t,e,i),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Bd(t,e,i,o,r,e!=="value")):t._isVueCE&&(oS(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!Bt(i)))?Vd(t,$n(e),i,r,e):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),Bd(t,e,i,o))};function rS(t,e,n,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in t&&kd(e)&&st(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return kd(e)&&Bt(n)?!1:e in t}function oS(t,e){const n=t._def.props;if(!n)return!1;const i=$n(e);return Array.isArray(n)?n.some(s=>$n(s)===i):Object.keys(n).some(s=>$n(s)===i)}const lr=t=>{const e=t.props["onUpdate:modelValue"]||!1;return Ze(e)?n=>Aa(e,n):e};function aS(t){t.target.composing=!0}function zd(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const ci=Symbol("_assign"),Xo=Symbol("_initialValue");function Yl(t,e,n){return e&&(t=t.trim()),n&&(t=No(t)),t}const Hc={created(t,{modifiers:{lazy:e,trim:n,number:i}},s){t.parentNode&&(t.type==="text"?t[Xo]=t.defaultValue.replace(/[\r\n]/g,""):t.type==="textarea"&&(t[Xo]=t.defaultValue.replace(/\r\n?/g,`
`))),t[ci]=lr(s);const r=i||s.props&&s.props.type==="number";is(t,e?"change":"input",o=>{o.target.composing||t[ci](Yl(t.value,n,r))}),(n||r)&&is(t,"change",()=>{t.value=Yl(t.value,n,r)}),e||(is(t,"compositionstart",aS),is(t,"compositionend",zd),is(t,"change",zd))},mounted(t,{value:e,modifiers:{trim:n,number:i}}){const s=e??"",r=t[Xo];delete t[Xo],r!==void 0&&(t.type==="text"||t.type==="textarea")&&t.value!==r?t[ci](Yl(t.value,n,i)):t.value=s},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:i,trim:s,number:r}},o){if(t[ci]=lr(o),t.composing)return;const a=(r||t.type==="number")&&!/^0\d/.test(t.value)?No(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(i&&e===n||s&&t.value.trim()===l)||(t.value=l)}},Za={deep:!0,created(t,e,n){t[ci]=lr(n),is(t,"change",()=>{const i=t._modelValue,s=po(t),r=t.checked,o=t[ci];if(Ze(i)){const a=Zu(i,s),l=a!==-1;if(r&&!l)o(i.concat(s));else if(!r&&l){const c=[...i];c.splice(a,1),o(c)}}else if(zi(i)){const a=new Set(i);r?a.add(s):a.delete(s),o(a)}else o(yg(t,r))})},mounted:Hd,beforeUpdate(t,e,n){t[ci]=lr(n),Hd(t,e,n)}};function Hd(t,{value:e,oldValue:n},i){t._modelValue=e;let s;if(Ze(e))s=Zu(e,i.props.value)>-1;else if(zi(e))s=e.has(i.props.value);else{if(e===n)return;s=Hi(e,yg(t,!0))}t.checked!==s&&(t.checked=s)}const Wc={deep:!0,created(t,{value:e,modifiers:{number:n}},i){t._modelValue=e,is(t,"change",()=>{const s=Array.prototype.filter.call(t.options,l=>l.selected).map(l=>n?No(po(l)):po(l)),r=t.multiple,o=r?zi(t._modelValue)?new Set(s):s:s[0],a=t._pendingValue=[r,r?Ze(o)?s.slice():s:o];try{t[ci](o)}finally{ao(()=>{t._pendingValue===a&&(t._pendingValue=void 0)})}}),t[ci]=lr(i)},mounted(t,{value:e,modifiers:{number:n}}){Wd(t,e,n)},beforeUpdate(t,{value:e},n){t._modelValue=e,t[ci]=lr(n)},updated(t,{value:e,modifiers:{number:n}}){const i=t._pendingValue;t._pendingValue=void 0,(!i||i[0]!==t.multiple||!lS(e,i[1],i[0]))&&Wd(t,e,n)}};function lS(t,e,n){if(!n||Ze(t))return Hi(t,e);if(zi(t)){if(t.size!==e.length)return!1;for(const i of e)if(!t.has(i))return!1;return!0}return!1}function Wd(t,e,n=!1){const i=t.multiple,s=Ze(e);if(!(i&&!s&&!zi(e))){for(let r=0,o=t.options.length;r<o;r++){const a=t.options[r],l=po(a);if(i)if(s){const c=typeof l;c==="string"||c==="number"?a.selected=e.some(u=>String(u)===String(l)):a.selected=Zu(e,l)>-1}else a.selected=e.has(l)||n&&typeof l=="string"&&e.has(No(l));else if(Hi(po(a),e)){t.selectedIndex!==r&&(t.selectedIndex=r);return}}!i&&t.selectedIndex!==-1&&(t.selectedIndex=-1)}}function po(t){return"_value"in t?t._value:t.value}function yg(t,e){const n=e?"_trueValue":"_falseValue";return n in t?t[n]:e}const cS={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Xc=(t,e)=>{const n=t._withKeys||(t._withKeys={}),i=e.join(".");return n[i]||(n[i]=(s=>{if(!("key"in s))return;const r=ps(s.key);if(e.some(o=>o===r||cS[o]===r))return t(s)}))},uS=Yt({patchProp:sS},zb);let Xd;function fS(){return Xd||(Xd=bb(uS))}const dS=((...t)=>{const e=fS().createApp(...t),{mount:n}=e;return e.mount=i=>{const s=pS(i);if(!s)return;const r=e._component;!st(r)&&!r.render&&!r.template&&(r.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,hS(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e});function hS(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function pS(t){return Bt(t)?document.querySelector(t):t}var pt;(function(t){t[t.Canceled=1]="Canceled",t[t.Unknown=2]="Unknown",t[t.InvalidArgument=3]="InvalidArgument",t[t.DeadlineExceeded=4]="DeadlineExceeded",t[t.NotFound=5]="NotFound",t[t.AlreadyExists=6]="AlreadyExists",t[t.PermissionDenied=7]="PermissionDenied",t[t.ResourceExhausted=8]="ResourceExhausted",t[t.FailedPrecondition=9]="FailedPrecondition",t[t.Aborted=10]="Aborted",t[t.OutOfRange=11]="OutOfRange",t[t.Unimplemented=12]="Unimplemented",t[t.Internal=13]="Internal",t[t.Unavailable=14]="Unavailable",t[t.DataLoss=15]="DataLoss",t[t.Unauthenticated=16]="Unauthenticated"})(pt||(pt={}));function uf(t,e){return t!==null&&typeof t=="object"&&"$typeName"in t&&typeof t.$typeName=="string"?e===void 0?!0:e.typeName===t.$typeName:!1}var V;(function(t){t[t.DOUBLE=1]="DOUBLE",t[t.FLOAT=2]="FLOAT",t[t.INT64=3]="INT64",t[t.UINT64=4]="UINT64",t[t.INT32=5]="INT32",t[t.FIXED64=6]="FIXED64",t[t.FIXED32=7]="FIXED32",t[t.BOOL=8]="BOOL",t[t.STRING=9]="STRING",t[t.BYTES=12]="BYTES",t[t.UINT32=13]="UINT32",t[t.SFIXED32=15]="SFIXED32",t[t.SFIXED64=16]="SFIXED64",t[t.SINT32=17]="SINT32",t[t.SINT64=18]="SINT64"})(V||(V={}));function mS(){const t=this.buf;let e=this.pos,n=0,i=0;for(let r=0;r<28;r+=7){const o=t[e++];if(n|=(o&127)<<r,(o&128)==0){this.pos=e,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=i;return}}const s=t[e++];if(n|=(s&15)<<28,i=(s&112)>>4,(s&128)==0){this.pos=e,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=i;return}for(let r=3;r<=31;r+=7){const o=t[e++];if(i|=(o&127)<<r,(o&128)==0){this.pos=e,this.assertBounds(),this.varint64Lo=n,this.varint64Hi=i;return}}throw new Error("invalid varint")}const Ia=4294967296;function Yd(t){const e=t[0]==="-";e&&(t=t.slice(1));const n=1e6;let i=0,s=0;function r(o,a){const l=Number(t.slice(o,a));s*=n,i=i*n+l,i>=Ia&&(s=s+(i/Ia|0),i=i%Ia)}return r(-24,-18),r(-18,-12),r(-12,-6),r(-6),e?Mg(i,s):ff(i,s)}function gS(t,e){let n=ff(t,e);const i=n.hi&2147483648;i&&(n=Mg(n.lo,n.hi));const s=Eg(n.lo,n.hi);return i?"-"+s:s}function Eg(t,e){if({lo:t,hi:e}=_S(t,e),e<=2097151)return String(Ia*e+t);const n=t&16777215,i=(t>>>24|e<<8)&16777215,s=e>>16&65535;let r=n+i*6777216+s*6710656,o=i+s*8147497,a=s*2;const l=1e7;return r>=l&&(o+=Math.floor(r/l),r%=l),o>=l&&(a+=Math.floor(o/l),o%=l),a.toString()+$d(o)+$d(r)}function _S(t,e){return{lo:t>>>0,hi:e>>>0}}function ff(t,e){return{lo:t|0,hi:e|0}}function Mg(t,e){return e=~e,t?t=~t+1:e+=1,ff(t,e)}const $d=t=>{const e=String(t);return"0000000".slice(e.length)+e};function vS(t,e){if(t>>>0<128){e.push(t);return}if(t>=0){for(;t>127;)e.push(t&127|128),t=t>>>7;e.push(t)}else{for(let n=0;n<9;n++)e.push(t&127|128),t=t>>7;e.push(1)}}function bS(){let t=this.buf[this.pos++];if((t&128)===0)return this.assertBounds(),t;let e=t&127;if(t=this.buf[this.pos++],e|=(t&127)<<7,(t&128)===0)return this.assertBounds(),e;if(t=this.buf[this.pos++],e|=(t&127)<<14,(t&128)===0)return this.assertBounds(),e;if(t=this.buf[this.pos++],e|=(t&127)<<21,(t&128)===0)return this.assertBounds(),e;t=this.buf[this.pos++],e|=(t&15)<<28;for(let n=5;(t&128)!==0&&n<10;n++)t=this.buf[this.pos++];if((t&128)!==0)throw new Error("invalid varint");return this.assertBounds(),e>>>0}var Kd={};const At=SS();function SS(){const t=new DataView(new ArrayBuffer(8));if(typeof BigInt=="function"&&typeof t.getBigInt64=="function"&&typeof t.getBigUint64=="function"&&typeof t.setBigInt64=="function"&&typeof t.setBigUint64=="function"&&(!!globalThis.Deno||!!globalThis.Bun||typeof process!="object"||typeof Kd!="object"||Kd.BUF_BIGINT_DISABLE!=="1")){const n=BigInt("-9223372036854775808"),i=BigInt("9223372036854775807"),s=BigInt("0"),r=BigInt("18446744073709551615");return{zero:BigInt(0),supported:!0,parse(o){const a=typeof o=="bigint"?o:BigInt(o);if(a>i||a<n)throw new Error(`invalid int64: ${o}`);return a},uParse(o){const a=typeof o=="bigint"?o:BigInt(o);if(a>r||a<s)throw new Error(`invalid uint64: ${o}`);return a},enc(o){return t.setBigInt64(0,this.parse(o),!0),{lo:t.getInt32(0,!0),hi:t.getInt32(4,!0)}},uEnc(o){return t.setBigInt64(0,this.uParse(o),!0),{lo:t.getInt32(0,!0),hi:t.getInt32(4,!0)}},dec(o,a){return t.setInt32(0,o,!0),t.setInt32(4,a,!0),t.getBigInt64(0,!0)},uDec(o,a){return t.setInt32(0,o,!0),t.setInt32(4,a,!0),t.getBigUint64(0,!0)}}}return{zero:"0",supported:!1,parse(n){return typeof n!="string"&&(n=n.toString()),Zd(n),n},uParse(n){return typeof n!="string"&&(n=n.toString()),Jd(n),n},enc(n){return typeof n!="string"&&(n=n.toString()),Zd(n),Yd(n)},uEnc(n){return typeof n!="string"&&(n=n.toString()),Jd(n),Yd(n)},dec(n,i){return gS(n,i)},uDec(n,i){return Eg(n,i)}}}function Zd(t){if(!/^-?[0-9]+$/.test(t))throw new Error("invalid int64: "+t)}function Jd(t){if(!/^[0-9]+$/.test(t))throw new Error("invalid uint64: "+t)}function Wi(t,e){switch(t){case V.STRING:return"";case V.BOOL:return!1;case V.DOUBLE:case V.FLOAT:return 0;case V.INT64:case V.UINT64:case V.SFIXED64:case V.FIXED64:case V.SINT64:return e?"0":At.zero;case V.BYTES:return new Uint8Array(0);default:return 0}}function xS(t,e){switch(t){case V.BOOL:return e===!1;case V.STRING:return e==="";case V.BYTES:return e instanceof Uint8Array&&!e.byteLength;case V.DOUBLE:case V.FLOAT:return Object.is(e,0);default:return e==0}}const Tg=2,In=Symbol.for("reflect unsafe local");function yS(t,e){const n=t[e.localName].case;return n===void 0?n:e.fields.find(i=>i.localName===n)}function ES(t,e){const n=e.localName;if(e.oneof)return t[e.oneof.localName].case===n;if(e.presence!=Tg)return t[n]!==void 0&&Object.prototype.hasOwnProperty.call(t,n);switch(e.fieldKind){case"list":return t[n].length>0;case"map":return Object.keys(t[n]).length>0;case"scalar":return!xS(e.scalar,t[n]);case"enum":return t[n]!==e.enum.values[0].number}throw new Error("message field with implicit presence")}function mo(t,e){return Object.prototype.hasOwnProperty.call(t,e)&&t[e]!==void 0}function MS(t,e){if(e.oneof){const n=t[e.oneof.localName];return n.case===e.localName?n.value:void 0}return t[e.localName]}function TS(t,e,n){e.oneof?t[e.oneof.localName]={case:e.localName,value:n}:t[e.localName]=n}function jn(t,e,n){e==="__proto__"?Object.defineProperty(t,"__proto__",{value:n,writable:!0,enumerable:!0,configurable:!0}):t[e]=n}function AS(t,e){return Object.prototype.hasOwnProperty.call(t,e)?t[e]:void 0}function wS(t,e){const n=e.localName;if(e.oneof){const i=e.oneof.localName;t[i].case===n&&(t[i]={case:void 0})}else if(e.presence!=Tg)delete t[n];else switch(e.fieldKind){case"map":t[n]={};break;case"list":t[n]=[];break;case"enum":t[n]=e.enum.values[0].number;break;case"scalar":t[n]=Wi(e.scalar,e.longAsString);break}}function fs(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function df(t,e){var n,i,s,r;if(fs(t)&&In in t&&"add"in t&&"field"in t&&typeof t.field=="function"){if(e!==void 0){const o=e,a=t.field();return o.listKind==a.listKind&&o.scalar===a.scalar&&((n=o.message)===null||n===void 0?void 0:n.typeName)===((i=a.message)===null||i===void 0?void 0:i.typeName)&&((s=o.enum)===null||s===void 0?void 0:s.typeName)===((r=a.enum)===null||r===void 0?void 0:r.typeName)}return!0}return!1}function hf(t,e){var n,i,s,r;if(fs(t)&&In in t&&"has"in t&&"field"in t&&typeof t.field=="function"){if(e!==void 0){const o=e,a=t.field();return o.mapKey===a.mapKey&&o.mapKind==a.mapKind&&o.scalar===a.scalar&&((n=o.message)===null||n===void 0?void 0:n.typeName)===((i=a.message)===null||i===void 0?void 0:i.typeName)&&((s=o.enum)===null||s===void 0?void 0:s.typeName)===((r=a.enum)===null||r===void 0?void 0:r.typeName)}return!0}return!1}function pf(t,e){return fs(t)&&In in t&&"desc"in t&&fs(t.desc)&&t.desc.kind==="message"&&(e===void 0||t.desc.typeName==e.typeName)}function RS(t){return wg(t.$typeName)}function Us(t){const e=t.fields[0];return wg(t.typeName)&&e!==void 0&&e.fieldKind=="scalar"&&e.name=="value"&&e.number==1}function Ag(t){switch(t.typeName){case"google.protobuf.Any":case"google.protobuf.Timestamp":case"google.protobuf.Duration":case"google.protobuf.FieldMask":case"google.protobuf.Struct":case"google.protobuf.Value":case"google.protobuf.ListValue":return!0;default:return Us(t)}}const NS=new Set(["google.protobuf.DoubleValue","google.protobuf.FloatValue","google.protobuf.Int64Value","google.protobuf.UInt64Value","google.protobuf.Int32Value","google.protobuf.UInt32Value","google.protobuf.BoolValue","google.protobuf.StringValue","google.protobuf.BytesValue"]);function wg(t){return NS.has(t)}const IS=999,CS=998,Rg=2;function vn(t,e){return uf(e,t)?e:Ng(t)(e)}const qd=new WeakMap;function Ng(t){let e=qd.get(t);return e===void 0&&(e=LS(t),qd.set(t,e)),e}const Yc=0,Ig=1,Cg=2,Lg=3;function LS(t){const e=t.typeName,{properties:n,prototype:i}=PS(t);return s=>{let r;i!==void 0?(r=Object.create(i),r.$typeName=e):r={$typeName:e};for(let o=0;o<n.length;o++){const a=n[o],l=a.name,c=s==null?void 0:s[l];switch(a.kind){case Yc:c!=null?r[l]=a.convert!==void 0?a.convert(c):c:a.constant!==void 0&&(r[l]=a.constant);break;case Ig:r[l]=a.convert!==void 0&&Array.isArray(c)?c.map(a.convert):c??[];break;case Cg:if(a.convert===void 0||!fs(c))r[l]=c??{};else{const u={},f=Object.keys(c);for(let h=0;h<f.length;h++)jn(u,f[h],a.convert(c[f[h]]));r[l]=u}break;case Lg:{const u=c;if((u==null?void 0:u.case)!=null){const f=a.convert.get(u.case);if(f!==void 0){r[l]={case:u.case,value:f(u.value)};break}}r[l]={case:void 0};break}}}return r}}function PS(t){var e,n;const i=[],s={},r=US(t);for(const o of t.members){const a=o.localName;if(o.kind=="oneof"){i.push({name:a,kind:Lg,constant:void 0,convert:DS(o)});continue}switch(o.fieldKind){case"message":{i.push({name:a,kind:Yc,constant:void 0,convert:Ca(o)});break}case"list":{i.push({name:a,kind:Ig,constant:void 0,convert:o.listKind=="message"?(e=Ca(o))!==null&&e!==void 0?e:(l=>l):o.scalar==V.BYTES?Qr:void 0});break}case"map":{i.push({name:a,kind:Cg,constant:void 0,convert:o.mapKind=="message"?(n=Ca(o))!==null&&n!==void 0?n:(l=>l):o.scalar==V.BYTES?Qr:void 0});break}default:{const l=OS(o);i.push({name:a,kind:Yc,constant:o.presence==Rg?l:void 0,convert:o.fieldKind=="scalar"&&o.scalar==V.BYTES?Qr:void 0}),r&&(s[a]=l);break}}}return{properties:i,prototype:r?s:void 0}}function DS(t){const e=new Map;for(const n of t.fields){let i;n.fieldKind=="message"?i=Ca(n):n.fieldKind=="scalar"&&n.scalar==V.BYTES&&(i=Qr),e.set(n.localName,i??(s=>s))}return e}function Ca(t){if(t.fieldKind=="message"&&!t.oneof&&Us(t.message))return t.message.fields[0].scalar==V.BYTES?Qr:void 0;if(t.message.typeName=="google.protobuf.Struct"&&t.parent.typeName!=="google.protobuf.Value")return;const e=t.message;let n;return i=>!fs(i)||uf(i,e)?i:(n??(n=Ng(e)),n(i))}function Qr(t){return Array.isArray(t)?new Uint8Array(t):t}function US(t){switch(t.file.edition){case IS:return!1;case CS:return!0;default:return t.fields.some(e=>e.presence!=Rg&&e.fieldKind!="message"&&!e.oneof)}}function OS(t){const e=t.getDefaultValue();return e!==void 0?t.fieldKind=="scalar"&&t.longAsString?e.toString():e:t.fieldKind=="scalar"?Wi(t.scalar,t.longAsString):t.enum.values[0].number}const FS=["FieldValueInvalidError","FieldListRangeError","ForeignFieldError"];class wt extends Error{constructor(e,n,i="FieldValueInvalidError"){super(n),this.name=i,this.field=()=>e}}function BS(t){return t instanceof Error&&FS.includes(t.name)&&"field"in t&&typeof t.field=="function"}let $c;function VS(t){var e;$c=Object.assign(Object.assign({},t),{encodeUtf8Into:(e=t.encodeUtf8Into)!==null&&e!==void 0?e:Pg(t.encodeUtf8.bind(t))})}function mf(){if(!$c){const t=globalThis;if(!t.TextEncoder||!t.TextDecoder)throw new Error("encoding API missing: install TextEncoder and TextDecoder on globalThis");const e=new t.TextEncoder,n=new t.TextDecoder("utf-8",{ignoreBOM:!0});let i;const s={encodeUtf8(o){return e.encode(o)},decodeUtf8(o,a){return a?(i||(i=new t.TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0})),i.decode(o)):n.decode(o)},checkUtf8(o){try{return encodeURIComponent(o),!0}catch{return!1}}};e.encodeInto&&(s.encodeUtf8Into=e.encodeInto.bind(e));const r=String.prototype.isWellFormed;r&&(s.checkUtf8=o=>r.call(o)),VS(s)}return $c}function Pg(t){return(e,n)=>{const i=t(e);return n.set(i),{written:i.byteLength}}}var Ut;(function(t){t[t.Varint=0]="Varint",t[t.Bit64=1]="Bit64",t[t.LengthDelimited=2]="LengthDelimited",t[t.StartGroup=3]="StartGroup",t[t.EndGroup=4]="EndGroup",t[t.Bit32=5]="Bit32"})(Ut||(Ut={}));const Dg=4294967295,Ug=2147483647,Og=-2147483648;class Fg{constructor(e){this.stackPos=[],this.encodeUtf8Into=e?Pg(e):mf().encodeUtf8Into,this.buffer=Bg,this.viewCache=kS,this.pos=0}ensureCapacity(e){const n=this.pos+e;if(n>this.buffer.length){let i=this.buffer.length||GS;for(;i<n;)i*=2;const s=new Uint8Array(i);this.pos>0&&s.set(this.buffer),this.buffer=s}}view(){const e=this.buffer,n=this.viewCache;if(n.byteLength===e.byteLength)return n;const i=new DataView(e.buffer);return this.viewCache=i,i}finish(){const e=this.buffer.slice(0,this.pos);return this.pos=0,this.stackPos=[],e}fork(){return this.stackPos.push(this.pos),this.ensureCapacity(Nr),this.buffer[this.pos++]=0,this}join(){const e=this.stackPos.pop();if(e===void 0)throw new Error("invalid state, fork stack empty");const n=this.pos-e-Nr,i=$l(n);return i>Nr&&(this.ensureCapacity(i-Nr),this.buffer.copyWithin(e+i,e+Nr,this.pos)),this.pos=e,this.uint32(n),this.pos+=n,this}tag(e,n){return this.uint32((e<<3|n)>>>0)}raw(e){return this.ensureCapacity(e.length),this.buffer.set(e,this.pos),this.pos+=e.length,this}uint32(e){if(jd(e),this.ensureCapacity(5),e<128)return this.buffer[this.pos++]=e,this;for(;e>127;)this.buffer[this.pos++]=e&127|128,e>>>=7;return this.buffer[this.pos++]=e,this}int32(e){if(Kl(e),e>=0)return this.uint32(e);this.ensureCapacity(10);for(let n=0;n<9;n++)this.buffer[this.pos++]=e&127|128,e>>=7;return this.buffer[this.pos++]=1,this}bool(e){return this.ensureCapacity(1),this.buffer[this.pos++]=e?1:0,this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){typeof e!="string"&&(e=String(e));const n=e.length;if(n<=Vg){this.ensureCapacity(n+1);const l=this.buffer;let c=this.pos;l[c++]=n;let u=0;for(;u<n;u++){const f=e.charCodeAt(u);if(f>127)break;l[c++]=f}if(u==n)return this.pos=c,this}this.ensureCapacity(n*3+5);const i=$l(n),s=this.buffer,r=this.pos,{written:o}=this.encodeUtf8Into(e,s.subarray(r+i)),a=$l(o);return a!=i&&s.copyWithin(r+a,r+i,r+i+o),this.uint32(o),this.pos+=o,this}float(e){return zS(e),this.ensureCapacity(4),this.view().setFloat32(this.pos,e,!0),this.pos+=4,this}double(e){return this.ensureCapacity(8),this.view().setFloat64(this.pos,e,!0),this.pos+=8,this}fixed32(e){return jd(e),this.ensureCapacity(4),this.view().setUint32(this.pos,e,!0),this.pos+=4,this}sfixed32(e){return Kl(e),this.ensureCapacity(4),this.view().setInt32(this.pos,e,!0),this.pos+=4,this}sint32(e){return Kl(e),this.uint32((e<<1^e>>31)>>>0)}sfixed64(e){const n=At.enc(e);this.ensureCapacity(8);const i=this.view();return i.setInt32(this.pos,n.lo,!0),i.setInt32(this.pos+4,n.hi,!0),this.pos+=8,this}fixed64(e){const n=At.uEnc(e);this.ensureCapacity(8);const i=this.view();return i.setInt32(this.pos,n.lo,!0),i.setInt32(this.pos+4,n.hi,!0),this.pos+=8,this}int64(e){const n=At.enc(e);return this.writeVarint64(n.lo,n.hi)}sint64(e){const n=At.enc(e),i=n.hi>>31,s=n.lo<<1^i,r=(n.hi<<1|n.lo>>>31)^i;return this.writeVarint64(s,r)}uint64(e){const n=At.uEnc(e);return this.writeVarint64(n.lo,n.hi)}writeVarint64(e,n){this.ensureCapacity(10);const i=this.buffer;let s=this.pos;for(let a=0;a<28;a=a+7){const l=e>>>a,c=!(!(l>>>7)&&n==0);if(i[s++]=(c?l|128:l)&255,!c)return this.pos=s,this}const r=e>>>28&15|(n&7)<<4,o=n>>3!=0;if(i[s++]=(o?r|128:r)&255,!o)return this.pos=s,this;for(let a=3;a<31;a=a+7){const l=n>>>a,c=!!(l>>>7);if(i[s++]=(c?l|128:l)&255,!c)return this.pos=s,this}return i[s++]=n>>>31&1,this.pos=s,this}}const GS=128,Nr=1,Bg=new Uint8Array(0),kS=new DataView(Bg.buffer),Vg=32;function $l(t){return t<128?1:t<16384?2:t<2097152?3:t<268435456?4:5}class go{constructor(e,n=mf().decodeUtf8){this.decodeUtf8=n,this.varint64Lo=0,this.varint64Hi=0,this.varint64=mS,this.uint32=bS,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength)}tag(){const e=this.pos,n=this.uint32(),i=this.pos-e;if(i>5||i==5&&this.buf[this.pos-1]>15)throw new Error("illegal tag: varint overflows uint32");const s=n>>>3,r=n&7;if(s<=0||r>5)throw new Error("illegal tag: field no "+s+" wire type "+r);return[s,r]}skip(e,n,i=100){let s=this.pos;switch(e){case Ut.Varint:for(;this.buf[this.pos++]&128;);break;case Ut.Bit64:this.pos+=4;case Ut.Bit32:this.pos+=4;break;case Ut.LengthDelimited:let r=this.uint32();this.pos+=r;break;case Ut.StartGroup:if(i<=0)throw new Error("maximum recursion depth reached");for(;;){const[o,a]=this.tag();if(a===Ut.EndGroup){if(n!==void 0&&o!==n)throw new Error("invalid end group tag");break}this.skip(a,o,i-1)}break;default:throw new Error("cant skip wire type "+e)}return this.assertBounds(),this.buf.subarray(s,this.pos)}assertBounds(){if(this.pos>this.len)throw new RangeError("premature EOF")}int32(){return this.uint32()|0}sint32(){let e=this.uint32();return e>>>1^-(e&1)}int64(){return this.varint64(),At.dec(this.varint64Lo,this.varint64Hi)}uint64(){return this.varint64(),At.uDec(this.varint64Lo,this.varint64Hi)}sint64(){this.varint64();let e=this.varint64Lo,n=this.varint64Hi,i=-(e&1);return e=(e>>>1|(n&1)<<31)^i,n=n>>>1^i,At.dec(e,n)}bool(){const e=this.buf[this.pos];return e<128?(this.pos++,e!==0):(this.varint64(),this.varint64Lo!==0||this.varint64Hi!==0)}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return At.uDec(this.sfixed32(),this.sfixed32())}sfixed64(){return At.dec(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){let e=this.uint32(),n=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(n,n+e)}string(e){const n=this.uint32(),i=this.pos;this.pos+=n,this.assertBounds();const s=this.buf;if(n<=Vg){const r=new Array(n);for(let o=0;o<n;o++){const a=s[i+o];if(a>127)return this.decodeUtf8(s.subarray(i,this.pos),e);r[o]=a}return String.fromCharCode.apply(String,r)}return this.decodeUtf8(s.subarray(i,this.pos),e)}}function Kl(t){if(typeof t=="string")t=Number(t);else if(typeof t!="number")throw new Error("invalid int32: "+typeof t);if(!Number.isInteger(t)||t>Ug||t<Og)throw new Error("invalid int32: "+t)}function jd(t){if(typeof t=="string")t=Number(t);else if(typeof t!="number")throw new Error("invalid uint32: "+typeof t);if(!Number.isInteger(t)||t>Dg||t<0)throw new Error("invalid uint32: "+t)}function zS(t){if(typeof t=="string"){const e=t;if(t=Number(t),Number.isNaN(t)&&e!=="NaN")throw new Error("invalid float32: "+e)}else if(typeof t!="number")throw new Error("invalid float32: "+typeof t);if(!Number.isFinite(Math.fround(t))&&Number.isFinite(t))throw new Error("invalid float32: "+t)}function Gg(t,e){const n=t.fieldKind=="list"?df(e,t):t.fieldKind=="map"?hf(e,t):gf(t,e);if(n===!0)return;let i;switch(t.fieldKind){case"list":i=`expected ${zg(t)}, got ${Wt(e)}`;break;case"map":i=`expected ${Hg(t)}, got ${Wt(e)}`;break;default:i=qn(t,e,n)}return new wt(t,i)}function Qd(t,e,n){const i=gf(t,n);if(i!==!0)return new wt(t,`list item #${e+1}: ${qn(t,n,i)}`)}function HS(t,e,n){const i=ds(t.mapKey)(e);if(i!==!0)return new wt(t,`invalid map key: ${qn({scalar:t.mapKey},e,i)}`);const s=gf(t,n);if(s!==!0)return new wt(t,`map entry ${Wt(e)}: ${qn(t,n,s)}`)}function gf(t,e){return t.scalar!==void 0?ds(t.scalar)(e):t.enum!==void 0?t.enum.open?ds(V.INT32)(e):t.enum.values.some(n=>n.number===e):pf(e,t.message)}function ds(t){switch(t){case V.DOUBLE:return e=>typeof e=="number";case V.FLOAT:return e=>typeof e!="number"?!1:!Number.isFinite(Math.fround(e))&&Number.isFinite(e)?`${e.toFixed()} out of range`:!0;case V.INT32:case V.SFIXED32:case V.SINT32:return e=>typeof e!="number"||!Number.isInteger(e)?!1:e>Ug||e<Og?`${e.toFixed()} out of range`:!0;case V.FIXED32:case V.UINT32:return e=>typeof e!="number"||!Number.isInteger(e)?!1:e>Dg||e<0?`${e.toFixed()} out of range`:!0;case V.BOOL:return e=>typeof e=="boolean";case V.STRING:return e=>typeof e!="string"?!1:mf().checkUtf8(e)||"invalid UTF8";case V.BYTES:return e=>e instanceof Uint8Array;case V.INT64:case V.SFIXED64:case V.SINT64:return e=>{if(typeof e=="bigint"||typeof e=="number"||typeof e=="string"&&e.length>0)try{return At.parse(e),!0}catch{return`${e} out of range`}return!1};case V.FIXED64:case V.UINT64:return e=>{if(typeof e=="bigint"||typeof e=="number"||typeof e=="string"&&e.length>0)try{return At.uParse(e),!0}catch{return`${e} out of range`}return!1}}}function qn(t,e,n){return n=typeof n=="string"?`: ${n}`:`, got ${Wt(e)}`,t.scalar!==void 0?`expected ${WS(t.scalar)}`+n:t.enum!==void 0?`expected ${t.enum.toString()}`+n:`expected ${kg(t.message)}`+n}function Wt(t){switch(typeof t){case"object":return t===null?"null":t instanceof Uint8Array?`Uint8Array(${t.length})`:Array.isArray(t)?`Array(${t.length})`:df(t)?zg(t.field()):hf(t)?Hg(t.field()):pf(t)?kg(t.desc):uf(t)?`message ${t.$typeName}`:"object";case"string":return t.length>30?"string":`"${t.split('"').join('\\"')}"`;case"boolean":return String(t);case"number":return String(t);case"bigint":return String(t)+"n";default:return typeof t}}function kg(t){return`ReflectMessage (${t.typeName})`}function zg(t){switch(t.listKind){case"message":return`ReflectList (${t.message.toString()})`;case"enum":return`ReflectList (${t.enum.toString()})`;case"scalar":return`ReflectList (${V[t.scalar]})`}}function Hg(t){switch(t.mapKind){case"message":return`ReflectMap (${V[t.mapKey]}, ${t.message.toString()})`;case"enum":return`ReflectMap (${V[t.mapKey]}, ${t.enum.toString()})`;case"scalar":return`ReflectMap (${V[t.mapKey]}, ${V[t.scalar]})`}}function WS(t){switch(t){case V.STRING:return"string";case V.BOOL:return"boolean";case V.INT64:case V.SINT64:case V.SFIXED64:return"bigint (int64)";case V.UINT64:case V.FIXED64:return"bigint (uint64)";case V.BYTES:return"Uint8Array";case V.DOUBLE:return"number (float64)";case V.FLOAT:return"number (float32)";case V.FIXED32:case V.UINT32:return"number (uint32)";case V.INT32:case V.SFIXED32:case V.SINT32:return"number (int32)"}}const XS=0;function xi(t){if(YS(t))return{toMessage:n=>_f(n),toLocal:n=>vf(n)};if(t.fieldKind=="message"&&!t.oneof&&Us(t.message)){const n=t.message,i=n.fields[0].localName;return{toMessage:s=>{const r=vn(n);return s!==void 0&&(r[i]=s),r},toLocal:s=>s[i]}}const e=t.message;return{toMessage:n=>n===void 0?vn(e):n,toLocal:n=>n}}function YS(t){return t.message.typeName=="google.protobuf.Struct"&&t.parent.typeName!="google.protobuf.Value"}function _f(t){const e={$typeName:"google.protobuf.Struct",fields:{}};if(fs(t))for(const n of Object.keys(t))jn(e.fields,n,Xg(t[n]));return e}function vf(t){const e={};for(const n of Object.keys(t.fields))jn(e,n,Wg(t.fields[n]));return e}function Wg(t){switch(t.kind.case){case"structValue":return vf(t.kind.value);case"listValue":return t.kind.value.values.map(Wg);case"nullValue":case void 0:return null;default:return t.kind.value}}function Xg(t){const e={$typeName:"google.protobuf.Value",kind:{case:void 0}};switch(typeof t){case"number":e.kind={case:"numberValue",value:t};break;case"string":e.kind={case:"stringValue",value:t};break;case"boolean":e.kind={case:"boolValue",value:t};break;case"object":if(t===null)e.kind={case:"nullValue",value:XS};else if(Array.isArray(t)){const n={$typeName:"google.protobuf.ListValue",values:[]};if(Array.isArray(t))for(const i of t)n.values.push(Xg(i));e.kind={case:"listValue",value:n}}else e.kind={case:"structValue",value:_f(t)};break}return e}function $S(t,e,n=!0){return new Yg(t,e,n)}const eh=new WeakMap;class Yg{get sortedFields(){const e=eh.get(this.desc);if(e)return e;const n=this.desc.fields.concat().sort((i,s)=>i.number-s.number);return eh.set(this.desc,n),n}constructor(e,n,i=!0){this.lists=new Map,this.maps=new Map,this.check=i,this.desc=e,this.message=this[In]=n??vn(e),this.fields=e.fields,this.oneofs=e.oneofs,this.members=e.members}findNumber(e){return this._fieldsByNumber||(this._fieldsByNumber=new Map(this.desc.fields.map(n=>[n.number,n]))),this._fieldsByNumber.get(e)}oneofCase(e){return Ir(this.message,e),yS(this.message,e)}isSet(e){return Ir(this.message,e),ES(this.message,e)}clear(e){Ir(this.message,e),wS(this.message,e)}get(e){Ir(this.message,e);const n=MS(this.message,e);switch(e.fieldKind){case"list":let i=this.lists.get(e);return(!i||i[In]!==n)&&this.lists.set(e,i=new KS(e,n,this.check)),i;case"map":let s=this.maps.get(e);return(!s||s[In]!==n)&&this.maps.set(e,s=new ZS(e,n,this.check)),s;case"message":return Sf(e,n,this.check);case"scalar":return n===void 0?Wi(e.scalar,!1):xf(e,n);case"enum":return n??e.enum.values[0].number}}set(e,n){if(Ir(this.message,e),this.check){const s=Gg(e,n);if(s)throw s}let i;e.fieldKind=="message"?i=bf(e,n):hf(n)||df(n)?i=n[In]:i=yf(e,n),TS(this.message,e,i)}getUnknown(){return this.message.$unknown}setUnknown(e){this.message.$unknown=e}}function Ir(t,e){if(e.parent.typeName!==t.$typeName)throw new wt(e,`cannot use ${e.toString()} with message ${t.$typeName}`,"ForeignFieldError")}class KS{field(){return this._field}get size(){return this._arr.length}constructor(e,n,i){this._field=e,this._arr=this[In]=n,this.check=i}get(e){const n=this._arr[e];return n===void 0?void 0:Zl(this._field,n,this.check)}set(e,n){if(e<0||e>=this._arr.length)throw new wt(this._field,`list item #${e+1}: out of range`);if(this.check){const i=Qd(this._field,e,n);if(i)throw i}this._arr[e]=th(this._field,n)}add(e){if(this.check){const n=Qd(this._field,this._arr.length,e);if(n)throw n}this._arr.push(th(this._field,e))}clear(){this._arr.splice(0,this._arr.length)}[Symbol.iterator](){return this.values()}keys(){return this._arr.keys()}*values(){for(const e of this._arr)yield Zl(this._field,e,this.check)}*entries(){for(let e=0;e<this._arr.length;e++)yield[e,Zl(this._field,this._arr[e],this.check)]}}class ZS{constructor(e,n,i=!0){this.obj=this[In]=n??{},this.check=i,this._field=e}field(){return this._field}set(e,n){if(this.check){const i=HS(this._field,e,n);if(i)throw i}return jn(this.obj,Yo(e),JS(this._field,n)),this}delete(e){const n=Yo(e),i=Object.prototype.hasOwnProperty.call(this.obj,n);return i&&delete this.obj[n],i}clear(){for(const e of Object.keys(this.obj))delete this.obj[e]}get(e){let n=AS(this.obj,Yo(e));return n!==void 0&&(n=Jl(this._field,n,this.check)),n}has(e){return Object.prototype.hasOwnProperty.call(this.obj,Yo(e))}*keys(){for(const e of Object.keys(this.obj))yield nh(e,this._field.mapKey)}*entries(){for(const e of Object.entries(this.obj))yield[nh(e[0],this._field.mapKey),Jl(this._field,e[1],this.check)]}[Symbol.iterator](){return this.entries()}get size(){return Object.keys(this.obj).length}*values(){for(const e of Object.values(this.obj))yield Jl(this._field,e,this.check)}forEach(e,n){for(const i of this.entries())e.call(n,i[1],i[0],this)}}function bf(t,e){return pf(e)?RS(e.message)&&!t.oneof&&t.fieldKind=="message"?e.message.value:e.desc.typeName=="google.protobuf.Struct"&&t.parent.typeName!="google.protobuf.Value"?vf(e.message):e.message:e}function Sf(t,e,n){return e!==void 0&&(Us(t.message)&&!t.oneof&&t.fieldKind=="message"?e={$typeName:t.message.typeName,value:xf(t.message.fields[0],e)}:t.message.typeName=="google.protobuf.Struct"&&t.parent.typeName!="google.protobuf.Value"&&fs(e)&&(e=_f(e))),new Yg(t.message,e,n)}function th(t,e){return t.listKind=="message"?bf(t,e):yf(t,e)}function Zl(t,e,n){return t.listKind=="message"?Sf(t,e,n):xf(t,e)}function JS(t,e){return t.mapKind=="message"?bf(t,e):yf(t,e)}function Jl(t,e,n){return t.mapKind=="message"?Sf(t,e,n):e}function Yo(t){return typeof t=="string"||typeof t=="number"?t:String(t)}function nh(t,e){switch(e){case V.STRING:return t;case V.INT32:case V.FIXED32:case V.UINT32:case V.SFIXED32:case V.SINT32:{const n=Number.parseInt(t);if(Number.isFinite(n))return n;break}case V.BOOL:switch(t){case"true":return!0;case"false":return!1}break;case V.UINT64:case V.FIXED64:try{return At.uParse(t)}catch{}break;default:try{return At.parse(t)}catch{}break}return t}function xf(t,e){switch(t.scalar){case V.INT64:case V.SFIXED64:case V.SINT64:"longAsString"in t&&t.longAsString&&typeof e=="string"&&(e=At.parse(e));break;case V.FIXED64:case V.UINT64:"longAsString"in t&&t.longAsString&&typeof e=="string"&&(e=At.uParse(e));break}return e}function yf(t,e){switch(t.scalar){case V.INT64:case V.SFIXED64:case V.SINT64:"longAsString"in t&&t.longAsString?e=String(e):(typeof e=="string"||typeof e=="number")&&(e=At.parse(e));break;case V.FIXED64:case V.UINT64:"longAsString"in t&&t.longAsString?e=String(e):(typeof e=="string"||typeof e=="number")&&(e=At.uParse(e));break}return e}const ih=Uint8Array.prototype.setFromBase64;function Ef(t){const e=t.length;let n=e-(e+3>>2);(e&3)==0&&t[e-1]=="="&&(n-=t[e-2]=="="?2:1);const i=new Uint8Array(n);let s=-1;if(ih)try{const r=ih.call(i,t);r.read==e&&(s=r.written)}catch{}return s<0&&(s=qS(i,t)),s==n?i:i.subarray(0,s)}function qS(t,e){const n=ex();let i=0,s=0,r,o=0;for(let a=0;a<e.length;a++){if(r=n[e.charCodeAt(a)],r===void 0)switch(e[a]){case"=":s=0;case`
`:case"\r":case"	":case" ":continue;default:throw Error("invalid base64 string")}switch(s){case 0:o=r,s=1;break;case 1:t[i++]=o<<2|(r&48)>>4,o=r,s=2;break;case 2:t[i++]=(o&15)<<4|(r&60)>>2,o=r,s=3;break;case 3:t[i++]=(o&3)<<6|r,s=0;break}}if(s==1)throw Error("invalid base64 string");return i}const sh=Uint8Array.prototype.toBase64,jS={std:{alphabet:"base64",omitPadding:!1},std_raw:{alphabet:"base64",omitPadding:!0},url:{alphabet:"base64url",omitPadding:!0}};function QS(t,e="std"){if(sh)return sh.call(t,jS[e]);const n=$g(e),i=e=="std";let s="",r=0,o,a=0;for(let l=0;l<t.length;l++)switch(o=t[l],r){case 0:s+=n[o>>2],a=(o&3)<<4,r=1;break;case 1:s+=n[a|o>>4],a=(o&15)<<2,r=2;break;case 2:s+=n[a|o>>6],s+=n[o&63],r=0;break}return r&&(s+=n[a],i&&(s+="=",r==1&&(s+="="))),s}let $o,rh,Fs;function $g(t){return $o||($o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),rh=$o.slice(0,-2).concat("-","_")),t=="url"?rh:$o}function ex(){if(!Fs){Fs=[];const t=$g("std");for(let e=0;e<t.length;e++)Fs[t[e].charCodeAt(0)]=e;Fs[45]=t.indexOf("+"),Fs[95]=t.indexOf("/")}return Fs}function cr(t){let e=!1;const n=[];for(let i=0;i<t.length;i++){let s=t.charAt(i);switch(s){case"_":e=!0;break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":n.push(s),e=!1;break;default:e&&(e=!1,s=s.toUpperCase()),n.push(s);break}}return n.join("")}function Kg(t){return t.replace(/[A-Z]/g,e=>"_"+e.toLowerCase())}const tx=new Set(["constructor","toString","toJSON","valueOf"]);function _o(t){return tx.has(t)?t+"$":t}function Mf(t){for(const e of t.field)mo(e,"jsonName")||(e.jsonName=cr(e.name));t.nestedType.forEach(Mf)}function nx(t,e){const n=t.values.find(i=>i.name===e);if(!n)throw new Error(`cannot parse ${t} default value: ${e}`);return n.number}function ix(t,e){switch(t){case V.STRING:return e;case V.BYTES:{const n=sx(e);if(n===!1)throw new Error(`cannot parse ${V[t]} default value: ${e}`);return n}case V.INT64:case V.SFIXED64:case V.SINT64:return At.parse(e);case V.UINT64:case V.FIXED64:return At.uParse(e);case V.DOUBLE:case V.FLOAT:switch(e){case"inf":return Number.POSITIVE_INFINITY;case"-inf":return Number.NEGATIVE_INFINITY;case"nan":return Number.NaN;default:return parseFloat(e)}case V.BOOL:return e==="true";case V.INT32:case V.UINT32:case V.SINT32:case V.FIXED32:case V.SFIXED32:return parseInt(e,10)}}function sx(t){const e=[],n={tail:t,c:"",next(){return this.tail.length==0?!1:(this.c=this.tail[0],this.tail=this.tail.substring(1),!0)},take(i){if(this.tail.length>=i){const s=this.tail.substring(0,i);return this.tail=this.tail.substring(i),s}return!1}};for(;n.next();)switch(n.c){case"\\":if(n.next())switch(n.c){case"\\":e.push(n.c.charCodeAt(0));break;case"b":e.push(8);break;case"f":e.push(12);break;case"n":e.push(10);break;case"r":e.push(13);break;case"t":e.push(9);break;case"v":e.push(11);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":{const i=n.c,s=n.take(2);if(s===!1)return!1;const r=parseInt(i+s,8);if(Number.isNaN(r))return!1;e.push(r);break}case"x":{const i=n.c,s=n.take(2);if(s===!1)return!1;const r=parseInt(i+s,16);if(Number.isNaN(r))return!1;e.push(r);break}case"u":{const i=n.c,s=n.take(4);if(s===!1)return!1;const r=parseInt(i+s,16);if(Number.isNaN(r))return!1;const o=new Uint8Array(4);new DataView(o.buffer).setInt32(0,r,!0),e.push(o[0],o[1],o[2],o[3]);break}case"U":{const i=n.c,s=n.take(8);if(s===!1)return!1;const r=At.uEnc(i+s),o=new Uint8Array(8),a=new DataView(o.buffer);a.setInt32(0,r.lo,!0),a.setInt32(4,r.hi,!0),e.push(o[0],o[1],o[2],o[3],o[4],o[5],o[6],o[7]);break}}break;default:e.push(n.c.charCodeAt(0))}return new Uint8Array(e)}function*Kc(t){switch(t.kind){case"file":for(const e of t.messages)yield e,yield*Kc(e);yield*t.enums,yield*t.services,yield*t.extensions;break;case"message":for(const e of t.nestedMessages)yield e,yield*Kc(e);yield*t.nestedEnums,yield*t.nestedExtensions;break}}function Zg(t,e){return rx([t,e])}function rx(t,e){const n=ox();if(!t.length)return n;if("$typeName"in t[0]&&t[0].$typeName=="google.protobuf.FileDescriptorSet"){for(const s of t[0].file)ch(s,n);return n}if("$typeName"in t[0]){let a=function(l){const c=[];for(const u of l.dependency){if(n.getFile(u)!=null||o.has(u))continue;const f=r(u);if(!f)throw new Error(`Unable to resolve ${u}, imported by ${l.name}`);"kind"in f?n.addFile(f,!1,!0):(o.add(f.name),c.push(f))}return c.concat(...c.map(a))};var i=a;const s=t[0],r=t[1],o=new Set;for(const l of[s,...a(s)].reverse())ch(l,n)}else for(const s of t)for(const r of s.files)n.addFile(r);return n}function ox(){const t=new Map,e=new Map,n=new Map;return{kind:"registry",types:t,extendees:e,[Symbol.iterator](){return t.values()},get files(){return n.values()},addFile(i,s,r){if(n.set(i.proto.name,i),!s)for(const o of Kc(i))this.add(o);if(r)for(const o of i.dependencies)this.addFile(o,s,r)},add(i){if(i.kind=="extension"){let s=e.get(i.extendee.typeName);s||e.set(i.extendee.typeName,s=new Map),s.set(i.number,i)}t.set(i.typeName,i)},get(i){return t.get(i)},getFile(i){return n.get(i)},getMessage(i){const s=t.get(i);return(s==null?void 0:s.kind)=="message"?s:void 0},getEnum(i){const s=t.get(i);return(s==null?void 0:s.kind)=="enum"?s:void 0},getExtension(i){const s=t.get(i);return(s==null?void 0:s.kind)=="extension"?s:void 0},getExtensionFor(i,s){var r;return(r=e.get(i.typeName))===null||r===void 0?void 0:r.get(s)},getService(i){const s=t.get(i);return(s==null?void 0:s.kind)=="service"?s:void 0}}}const ax=998,lx=999,cx=9999,ux=9,vo=10,eo=11,fx=12,oh=14,Tf=3,dx=2,ah=1,hx=0,ql=1,lh=2,px=3,mx=1,gx=2,_x=1,vx=2,bx=1002,Jg={998:{fieldPresence:1,enumType:2,repeatedFieldEncoding:2,utf8Validation:3,messageEncoding:1,jsonFormat:2,enforceNamingStyle:2,defaultSymbolVisibility:1,enforceProtoLimits:1},999:{fieldPresence:2,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:2,defaultSymbolVisibility:1,enforceProtoLimits:1},1e3:{fieldPresence:1,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:2,defaultSymbolVisibility:1,enforceProtoLimits:1},1001:{fieldPresence:1,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:1,defaultSymbolVisibility:2,enforceProtoLimits:1},1002:{fieldPresence:1,enumType:1,repeatedFieldEncoding:1,utf8Validation:2,messageEncoding:1,jsonFormat:1,enforceNamingStyle:3,defaultSymbolVisibility:4,enforceProtoLimits:2}};function ch(t,e){var n,i;const s={kind:"file",proto:t,deprecated:(i=(n=t.options)===null||n===void 0?void 0:n.deprecated)!==null&&i!==void 0?i:!1,edition:Ex(t),name:t.name.replace(/\.proto$/,""),dependencies:Mx(t,e),enums:[],messages:[],extensions:[],services:[],toString(){return`file ${t.name}`}},r=new Map,o={get(a){return r.get(a)},add(a){var l;Wn(((l=a.proto.options)===null||l===void 0?void 0:l.mapEntry)===!0),r.set(a.typeName,a)}};for(const a of t.enumType)qg(a,s,void 0,e);for(const a of t.messageType)jg(a,s,void 0,e,o);for(const a of t.service)Sx(a,s,e);Zc(s,e);for(const a of r.values())Jc(a,e,o);for(const a of s.messages)Jc(a,e,o),Zc(a,e);e.addFile(s,!0)}function Zc(t,e){switch(t.kind){case"file":for(const n of t.proto.extension){const i=qc(n,t,e);t.extensions.push(i),e.add(i)}break;case"message":for(const n of t.proto.extension){const i=qc(n,t,e);t.nestedExtensions.push(i),e.add(i)}for(const n of t.nestedMessages)Zc(n,e);break}}function Jc(t,e,n){const i=t.proto.oneofDecl.map(r=>yx(r,t)),s=new Set;for(const r of t.proto.field){const o=Rx(r,i),a=qc(r,t,e,o,n);t.fields.push(a),t.field[a.localName]=a,o===void 0?t.members.push(a):(o.fields.push(a),s.has(o)||(s.add(o),t.members.push(o)))}for(const r of i.filter(o=>s.has(o)))t.oneofs.push(r);for(const r of t.nestedMessages)Jc(r,e,n)}function qg(t,e,n,i){var s,r,o,a,l,c,u,f,h;const d=Tx(t.name,t.value),m={kind:"enum",proto:t,deprecated:(r=(s=t.options)===null||s===void 0?void 0:s.deprecated)!==null&&r!==void 0?r:!1,file:e,parent:n,open:!0,name:t.name,typeName:Sl(t,n,e),value:{},values:[],sharedPrefix:d,toString(){return`enum ${this.typeName}`}};m.open=Lx(m),i.add(m);for(const v of t.value){const g=v.name,p={kind:"enum_value",proto:v,deprecated:(a=(o=v.options)===null||o===void 0?void 0:o.deprecated)!==null&&a!==void 0?a:!1,parent:m,name:g,localName:_o(d==null?g:g.substring(d.length)),number:v.number,jsonName:(l=Ax(v))!==null&&l!==void 0?l:g,toString(){return`enum value ${m.typeName}.${g}`}};m.values.push(p),(c=(f=m.value)[h=v.number])!==null&&c!==void 0||(f[h]=p)}((u=n==null?void 0:n.nestedEnums)!==null&&u!==void 0?u:e.enums).push(m)}function jg(t,e,n,i,s){var r,o,a,l;const c={kind:"message",proto:t,deprecated:(o=(r=t.options)===null||r===void 0?void 0:r.deprecated)!==null&&o!==void 0?o:!1,file:e,parent:n,name:t.name,typeName:Sl(t,n,e),fields:[],field:{},oneofs:[],members:[],nestedEnums:[],nestedMessages:[],nestedExtensions:[],toString(){return`message ${this.typeName}`}};((a=t.options)===null||a===void 0?void 0:a.mapEntry)===!0?s.add(c):(((l=n==null?void 0:n.nestedMessages)!==null&&l!==void 0?l:e.messages).push(c),i.add(c));for(const u of t.enumType)qg(u,e,c,i);for(const u of t.nestedType)jg(u,e,c,i,s)}function Sx(t,e,n){var i,s;const r={kind:"service",proto:t,deprecated:(s=(i=t.options)===null||i===void 0?void 0:i.deprecated)!==null&&s!==void 0?s:!1,file:e,name:t.name,typeName:Sl(t,void 0,e),methods:[],method:{},toString(){return`service ${this.typeName}`}};e.services.push(r),n.add(r);for(const o of t.method){const a=xx(o,r,n);r.methods.push(a),r.method[a.localName]=a}}function xx(t,e,n){var i,s,r,o;let a;t.clientStreaming&&t.serverStreaming?a="bidi_streaming":t.clientStreaming?a="client_streaming":t.serverStreaming?a="server_streaming":a="unary";const l=n.getMessage(Ci(t.inputType)),c=n.getMessage(Ci(t.outputType));Wn(l,`invalid MethodDescriptorProto: input_type ${t.inputType} not found`),Wn(c,`invalid MethodDescriptorProto: output_type ${t.inputType} not found`);const u=t.name;return{kind:"rpc",proto:t,deprecated:(s=(i=t.options)===null||i===void 0?void 0:i.deprecated)!==null&&s!==void 0?s:!1,parent:e,name:u,localName:_o(u.length?_o(u[0].toLowerCase()+u.substring(1)):u),methodKind:a,input:l,output:c,idempotency:(o=(r=t.options)===null||r===void 0?void 0:r.idempotencyLevel)!==null&&o!==void 0?o:hx,toString(){return`rpc ${e.typeName}.${u}`}}}function yx(t,e){return{kind:"oneof",proto:t,deprecated:!1,parent:e,fields:[],name:t.name,localName:_o(cr(t.name)),toString(){return`oneof ${e.typeName}.${this.name}`}}}function qc(t,e,n,i,s){var r,o,a;const l=s===void 0,c={kind:"field",proto:t,deprecated:(o=(r=t.options)===null||r===void 0?void 0:r.deprecated)!==null&&o!==void 0?o:!1,name:t.name,number:t.number,scalar:void 0,message:void 0,enum:void 0,presence:Nx(t,i,l,e),utf8Validation:Px(t,e),listKind:void 0,mapKind:void 0,mapKey:void 0,delimitedEncoding:void 0,packed:void 0,longAsString:!1,getDefaultValue:void 0};let u;if(l){const m=e.kind=="file"?e:e.file,v=e.kind=="file"?void 0:e,g=Sl(t,v,m);c.kind="extension",c.file=m,c.parent=v,c.oneof=void 0,c.typeName=g,c.jsonName=`[${g}]`,u=()=>`extension ${g}`;const p=n.getMessage(Ci(t.extendee));Wn(p,`invalid FieldDescriptorProto: extendee ${t.extendee} not found`),c.extendee=p}else{const m=e;Wn(m.kind=="message"),c.parent=m,c.oneof=i,c.localName=i?cr(t.name):_o(cr(t.name)),c.jsonName=t.jsonName,u=()=>`field ${m.typeName}.${t.name}`}Object.defineProperty(c,"toString",{value:u,writable:!0,enumerable:!0,configurable:!0});const f=t.label,h=t.type,d=(a=t.options)===null||a===void 0?void 0:a.jstype;if(f===Tf){const m=h==eo?s==null?void 0:s.get(Ci(t.typeName)):void 0;if(m){c.fieldKind="map";const{key:v,value:g}=Cx(m);return c.mapKey=v.scalar,c.mapKind=g.fieldKind,c.message=g.message,c.delimitedEncoding=!1,c.enum=g.enum,c.scalar=g.scalar,c}switch(c.fieldKind="list",h){case eo:case vo:c.listKind="message",c.message=n.getMessage(Ci(t.typeName)),Wn(c.message),c.delimitedEncoding=uh(t,e);break;case oh:c.listKind="enum",c.enum=n.getEnum(Ci(t.typeName)),Wn(c.enum);break;default:c.listKind="scalar",c.scalar=h,c.longAsString=d==ah;break}return c.packed=Ix(t,e),c}switch(h){case eo:case vo:c.fieldKind="message",c.message=n.getMessage(Ci(t.typeName)),Wn(c.message,`invalid FieldDescriptorProto: type_name ${t.typeName} not found`),c.delimitedEncoding=uh(t,e),c.getDefaultValue=()=>{};break;case oh:{const m=n.getEnum(Ci(t.typeName));Wn(m!==void 0,`invalid FieldDescriptorProto: type_name ${t.typeName} not found`),c.fieldKind="enum",c.enum=n.getEnum(Ci(t.typeName)),c.getDefaultValue=()=>mo(t,"defaultValue")?nx(m,t.defaultValue):void 0;break}default:{c.fieldKind="scalar",c.scalar=h,c.longAsString=d==ah,c.getDefaultValue=()=>mo(t,"defaultValue")?ix(h,t.defaultValue):void 0;break}}return c}function Ex(t){switch(t.syntax){case"":case"proto2":return ax;case"proto3":return lx;case"editions":if(t.edition===cx)return bx;if(t.edition in Jg)return t.edition;throw new Error(`${t.name}: unsupported edition`);default:throw new Error(`${t.name}: unsupported syntax "${t.syntax}"`)}}function Mx(t,e){return t.dependency.map(n=>{const i=e.getFile(n);if(!i)throw new Error(`Cannot find ${n}, imported by ${t.name}`);return i})}function Tx(t,e){const n=wx(t)+"_";for(const i of e){if(!i.name.toLowerCase().startsWith(n))return;const s=i.name.substring(n.length);if(s.length==0||/^\d/.test(s))return}return n}function Ax(t){var e,n;let r;for(const o of(n=(e=t.options)===null||e===void 0?void 0:e.$unknown)!==null&&n!==void 0?n:[]){if(o.no!==998||o.wireType!==Ut.LengthDelimited)continue;const a=new go(new go(o.data).bytes());for(;a.pos<a.len;){const[l,c]=a.tag();l===1&&c===Ut.LengthDelimited?r=a.string():a.skip(c,l)}}return r}function wx(t){return(t.substring(0,1)+t.substring(1).replace(/[A-Z]/g,e=>"_"+e)).toLowerCase()}function Sl(t,e,n){let i;return e?i=`${e.typeName}.${t.name}`:n.proto.package.length>0?i=`${n.proto.package}.${t.name}`:i=`${t.name}`,i}function Ci(t){return t.startsWith(".")?t.substring(1):t}function Rx(t,e){if(!mo(t,"oneofIndex")||t.proto3Optional)return;const n=e[t.oneofIndex];return Wn(n,`invalid FieldDescriptorProto: oneof #${t.oneofIndex} for field #${t.number} not found`),n}function Nx(t,e,n,i){if(t.label==dx)return px;if(t.label==Tf)return lh;if(e||t.proto3Optional||n)return ql;const s=Cs("fieldPresence",{proto:t,parent:i});return s==lh&&(t.type==eo||t.type==vo)?ql:s}function Ix(t,e){if(t.label!=Tf)return!1;switch(t.type){case ux:case fx:case vo:case eo:return!1}const n=t.options;return n&&mo(n,"packed")?n.packed:mx==Cs("repeatedFieldEncoding",{proto:t,parent:e})}function Cx(t){const e=t.fields.find(i=>i.number===1),n=t.fields.find(i=>i.number===2);return Wn(e&&e.fieldKind=="scalar"&&e.scalar!=V.BYTES&&e.scalar!=V.FLOAT&&e.scalar!=V.DOUBLE&&n&&n.fieldKind!="list"&&n.fieldKind!="map"),{key:e,value:n}}function Lx(t){var e;return _x==Cs("enumType",{proto:t.proto,parent:(e=t.parent)!==null&&e!==void 0?e:t.file})}function uh(t,e){return t.type==vo?!0:gx==Cs("messageEncoding",{proto:t,parent:e})}function Px(t,e){return vx==Cs("utf8Validation",{proto:t,parent:e})}function Cs(t,e){var n,i;const s=(n=e.proto.options)===null||n===void 0?void 0:n.features;if(s){const r=s[t];if(r!=0)return r}if("kind"in e){if(e.kind=="message")return Cs(t,(i=e.parent)!==null&&i!==void 0?i:e.file);const r=Jg[e.edition];if(!r)throw new Error(`feature default for edition ${e.edition} not found`);return r[t]}return Cs(t,e.parent)}function Wn(t,e){if(!t)throw new Error(e)}function Dx(t){const e=Ux(t);return e.messageType.forEach(Mf),Zg(e,()=>{}).getFile(e.name)}function Ux(t){return Object.assign(Object.create({syntax:"",edition:0}),Object.assign(Object.assign({$typeName:"google.protobuf.FileDescriptorProto",dependency:[],publicDependency:[],weakDependency:[],optionDependency:[],service:[],extension:[]},t),{messageType:t.messageType.map(Qg),enumType:t.enumType.map(e_)}))}function Qg(t){var e,n,i,s,r,o,a,l;return Object.assign(Object.create({visibility:0}),{$typeName:"google.protobuf.DescriptorProto",name:t.name,field:(n=(e=t.field)===null||e===void 0?void 0:e.map(Ox))!==null&&n!==void 0?n:[],extension:[],nestedType:(s=(i=t.nestedType)===null||i===void 0?void 0:i.map(Qg))!==null&&s!==void 0?s:[],enumType:(o=(r=t.enumType)===null||r===void 0?void 0:r.map(e_))!==null&&o!==void 0?o:[],extensionRange:(l=(a=t.extensionRange)===null||a===void 0?void 0:a.map(u=>Object.assign({$typeName:"google.protobuf.DescriptorProto.ExtensionRange"},u)))!==null&&l!==void 0?l:[],oneofDecl:[],reservedRange:[],reservedName:[]})}function Ox(t){return Object.assign(Object.create({label:1,typeName:"",extendee:"",defaultValue:"",oneofIndex:0,jsonName:"",proto3Optional:!1}),Object.assign(Object.assign({$typeName:"google.protobuf.FieldDescriptorProto"},t),{options:t.options?Fx(t.options):void 0}))}function Fx(t){var e,n,i;return Object.assign(Object.create({ctype:0,packed:!1,jstype:0,lazy:!1,unverifiedLazy:!1,deprecated:!1,weak:!1,debugRedact:!1,retention:0}),Object.assign(Object.assign({$typeName:"google.protobuf.FieldOptions"},t),{targets:(e=t.targets)!==null&&e!==void 0?e:[],editionDefaults:(i=(n=t.editionDefaults)===null||n===void 0?void 0:n.map(r=>Object.assign({$typeName:"google.protobuf.FieldOptions.EditionDefault"},r)))!==null&&i!==void 0?i:[],uninterpretedOption:[]}))}function e_(t){return Object.assign(Object.create({visibility:0}),{$typeName:"google.protobuf.EnumDescriptorProto",name:t.name,reservedName:[],reservedRange:[],value:t.value.map(n=>Object.assign({$typeName:"google.protobuf.EnumValueDescriptorProto"},n))})}function Sr(t,e,...n){return n.reduce((i,s)=>i.nestedMessages[s],t.messages[e])}const Bx=Dx({name:"google/protobuf/descriptor.proto",package:"google.protobuf",messageType:[{name:"FileDescriptorSet",field:[{name:"file",number:1,type:11,label:3,typeName:".google.protobuf.FileDescriptorProto"}],extensionRange:[{start:536e6,end:536000001}]},{name:"FileDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"package",number:2,type:9,label:1},{name:"dependency",number:3,type:9,label:3},{name:"public_dependency",number:10,type:5,label:3},{name:"weak_dependency",number:11,type:5,label:3},{name:"option_dependency",number:15,type:9,label:3},{name:"message_type",number:4,type:11,label:3,typeName:".google.protobuf.DescriptorProto"},{name:"enum_type",number:5,type:11,label:3,typeName:".google.protobuf.EnumDescriptorProto"},{name:"service",number:6,type:11,label:3,typeName:".google.protobuf.ServiceDescriptorProto"},{name:"extension",number:7,type:11,label:3,typeName:".google.protobuf.FieldDescriptorProto"},{name:"options",number:8,type:11,label:1,typeName:".google.protobuf.FileOptions"},{name:"source_code_info",number:9,type:11,label:1,typeName:".google.protobuf.SourceCodeInfo"},{name:"syntax",number:12,type:9,label:1},{name:"edition",number:14,type:14,label:1,typeName:".google.protobuf.Edition"}]},{name:"DescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"field",number:2,type:11,label:3,typeName:".google.protobuf.FieldDescriptorProto"},{name:"extension",number:6,type:11,label:3,typeName:".google.protobuf.FieldDescriptorProto"},{name:"nested_type",number:3,type:11,label:3,typeName:".google.protobuf.DescriptorProto"},{name:"enum_type",number:4,type:11,label:3,typeName:".google.protobuf.EnumDescriptorProto"},{name:"extension_range",number:5,type:11,label:3,typeName:".google.protobuf.DescriptorProto.ExtensionRange"},{name:"oneof_decl",number:8,type:11,label:3,typeName:".google.protobuf.OneofDescriptorProto"},{name:"options",number:7,type:11,label:1,typeName:".google.protobuf.MessageOptions"},{name:"reserved_range",number:9,type:11,label:3,typeName:".google.protobuf.DescriptorProto.ReservedRange"},{name:"reserved_name",number:10,type:9,label:3},{name:"visibility",number:11,type:14,label:1,typeName:".google.protobuf.SymbolVisibility"}],nestedType:[{name:"ExtensionRange",field:[{name:"start",number:1,type:5,label:1},{name:"end",number:2,type:5,label:1},{name:"options",number:3,type:11,label:1,typeName:".google.protobuf.ExtensionRangeOptions"}]},{name:"ReservedRange",field:[{name:"start",number:1,type:5,label:1},{name:"end",number:2,type:5,label:1}]}]},{name:"ExtensionRangeOptions",field:[{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"},{name:"declaration",number:2,type:11,label:3,typeName:".google.protobuf.ExtensionRangeOptions.Declaration",options:{retention:2}},{name:"features",number:50,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"verification",number:3,type:14,label:1,typeName:".google.protobuf.ExtensionRangeOptions.VerificationState",defaultValue:"UNVERIFIED",options:{retention:2}}],nestedType:[{name:"Declaration",field:[{name:"number",number:1,type:5,label:1},{name:"full_name",number:2,type:9,label:1},{name:"type",number:3,type:9,label:1},{name:"reserved",number:5,type:8,label:1},{name:"repeated",number:6,type:8,label:1}]}],enumType:[{name:"VerificationState",value:[{name:"DECLARATION",number:0},{name:"UNVERIFIED",number:1}]}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"FieldDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"number",number:3,type:5,label:1},{name:"label",number:4,type:14,label:1,typeName:".google.protobuf.FieldDescriptorProto.Label"},{name:"type",number:5,type:14,label:1,typeName:".google.protobuf.FieldDescriptorProto.Type"},{name:"type_name",number:6,type:9,label:1},{name:"extendee",number:2,type:9,label:1},{name:"default_value",number:7,type:9,label:1},{name:"oneof_index",number:9,type:5,label:1},{name:"json_name",number:10,type:9,label:1},{name:"options",number:8,type:11,label:1,typeName:".google.protobuf.FieldOptions"},{name:"proto3_optional",number:17,type:8,label:1}],enumType:[{name:"Type",value:[{name:"TYPE_DOUBLE",number:1},{name:"TYPE_FLOAT",number:2},{name:"TYPE_INT64",number:3},{name:"TYPE_UINT64",number:4},{name:"TYPE_INT32",number:5},{name:"TYPE_FIXED64",number:6},{name:"TYPE_FIXED32",number:7},{name:"TYPE_BOOL",number:8},{name:"TYPE_STRING",number:9},{name:"TYPE_GROUP",number:10},{name:"TYPE_MESSAGE",number:11},{name:"TYPE_BYTES",number:12},{name:"TYPE_UINT32",number:13},{name:"TYPE_ENUM",number:14},{name:"TYPE_SFIXED32",number:15},{name:"TYPE_SFIXED64",number:16},{name:"TYPE_SINT32",number:17},{name:"TYPE_SINT64",number:18}]},{name:"Label",value:[{name:"LABEL_OPTIONAL",number:1},{name:"LABEL_REPEATED",number:3},{name:"LABEL_REQUIRED",number:2}]}]},{name:"OneofDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"options",number:2,type:11,label:1,typeName:".google.protobuf.OneofOptions"}]},{name:"EnumDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"value",number:2,type:11,label:3,typeName:".google.protobuf.EnumValueDescriptorProto"},{name:"options",number:3,type:11,label:1,typeName:".google.protobuf.EnumOptions"},{name:"reserved_range",number:4,type:11,label:3,typeName:".google.protobuf.EnumDescriptorProto.EnumReservedRange"},{name:"reserved_name",number:5,type:9,label:3},{name:"visibility",number:6,type:14,label:1,typeName:".google.protobuf.SymbolVisibility"}],nestedType:[{name:"EnumReservedRange",field:[{name:"start",number:1,type:5,label:1},{name:"end",number:2,type:5,label:1}]}]},{name:"EnumValueDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"number",number:2,type:5,label:1},{name:"options",number:3,type:11,label:1,typeName:".google.protobuf.EnumValueOptions"}]},{name:"ServiceDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"method",number:2,type:11,label:3,typeName:".google.protobuf.MethodDescriptorProto"},{name:"options",number:3,type:11,label:1,typeName:".google.protobuf.ServiceOptions"}]},{name:"MethodDescriptorProto",field:[{name:"name",number:1,type:9,label:1},{name:"input_type",number:2,type:9,label:1},{name:"output_type",number:3,type:9,label:1},{name:"options",number:4,type:11,label:1,typeName:".google.protobuf.MethodOptions"},{name:"client_streaming",number:5,type:8,label:1,defaultValue:"false"},{name:"server_streaming",number:6,type:8,label:1,defaultValue:"false"}]},{name:"FileOptions",field:[{name:"java_package",number:1,type:9,label:1},{name:"java_outer_classname",number:8,type:9,label:1},{name:"java_multiple_files",number:10,type:8,label:1,defaultValue:"false",options:{}},{name:"java_generate_equals_and_hash",number:20,type:8,label:1,options:{deprecated:!0}},{name:"java_string_check_utf8",number:27,type:8,label:1,defaultValue:"false"},{name:"optimize_for",number:9,type:14,label:1,typeName:".google.protobuf.FileOptions.OptimizeMode",defaultValue:"SPEED"},{name:"go_package",number:11,type:9,label:1},{name:"cc_generic_services",number:16,type:8,label:1,defaultValue:"false"},{name:"java_generic_services",number:17,type:8,label:1,defaultValue:"false"},{name:"py_generic_services",number:18,type:8,label:1,defaultValue:"false"},{name:"deprecated",number:23,type:8,label:1,defaultValue:"false"},{name:"cc_enable_arenas",number:31,type:8,label:1,defaultValue:"true",options:{}},{name:"objc_class_prefix",number:36,type:9,label:1},{name:"csharp_namespace",number:37,type:9,label:1},{name:"swift_prefix",number:39,type:9,label:1},{name:"php_class_prefix",number:40,type:9,label:1},{name:"php_namespace",number:41,type:9,label:1},{name:"php_metadata_namespace",number:44,type:9,label:1},{name:"ruby_package",number:45,type:9,label:1},{name:"features",number:50,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],enumType:[{name:"OptimizeMode",value:[{name:"SPEED",number:1},{name:"CODE_SIZE",number:2},{name:"LITE_RUNTIME",number:3}]}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"MessageOptions",field:[{name:"message_set_wire_format",number:1,type:8,label:1,defaultValue:"false"},{name:"no_standard_descriptor_accessor",number:2,type:8,label:1,defaultValue:"false"},{name:"deprecated",number:3,type:8,label:1,defaultValue:"false"},{name:"map_entry",number:7,type:8,label:1},{name:"deprecated_legacy_json_field_conflicts",number:11,type:8,label:1,options:{deprecated:!0}},{name:"features",number:12,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"FieldOptions",field:[{name:"ctype",number:1,type:14,label:1,typeName:".google.protobuf.FieldOptions.CType",defaultValue:"STRING"},{name:"packed",number:2,type:8,label:1},{name:"jstype",number:6,type:14,label:1,typeName:".google.protobuf.FieldOptions.JSType",defaultValue:"JS_NORMAL"},{name:"lazy",number:5,type:8,label:1,defaultValue:"false"},{name:"unverified_lazy",number:15,type:8,label:1,defaultValue:"false"},{name:"deprecated",number:3,type:8,label:1,defaultValue:"false"},{name:"weak",number:10,type:8,label:1,defaultValue:"false",options:{deprecated:!0}},{name:"debug_redact",number:16,type:8,label:1,defaultValue:"false"},{name:"retention",number:17,type:14,label:1,typeName:".google.protobuf.FieldOptions.OptionRetention"},{name:"targets",number:19,type:14,label:3,typeName:".google.protobuf.FieldOptions.OptionTargetType"},{name:"edition_defaults",number:20,type:11,label:3,typeName:".google.protobuf.FieldOptions.EditionDefault"},{name:"features",number:21,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"feature_support",number:22,type:11,label:1,typeName:".google.protobuf.FieldOptions.FeatureSupport"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],nestedType:[{name:"EditionDefault",field:[{name:"edition",number:3,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"value",number:2,type:9,label:1}]},{name:"FeatureSupport",field:[{name:"edition_introduced",number:1,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"edition_deprecated",number:2,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"deprecation_warning",number:3,type:9,label:1},{name:"edition_removed",number:4,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"removal_error",number:5,type:9,label:1}]}],enumType:[{name:"CType",value:[{name:"STRING",number:0},{name:"CORD",number:1},{name:"STRING_PIECE",number:2}]},{name:"JSType",value:[{name:"JS_NORMAL",number:0},{name:"JS_STRING",number:1},{name:"JS_NUMBER",number:2}]},{name:"OptionRetention",value:[{name:"RETENTION_UNKNOWN",number:0},{name:"RETENTION_RUNTIME",number:1},{name:"RETENTION_SOURCE",number:2}]},{name:"OptionTargetType",value:[{name:"TARGET_TYPE_UNKNOWN",number:0},{name:"TARGET_TYPE_FILE",number:1},{name:"TARGET_TYPE_EXTENSION_RANGE",number:2},{name:"TARGET_TYPE_MESSAGE",number:3},{name:"TARGET_TYPE_FIELD",number:4},{name:"TARGET_TYPE_ONEOF",number:5},{name:"TARGET_TYPE_ENUM",number:6},{name:"TARGET_TYPE_ENUM_ENTRY",number:7},{name:"TARGET_TYPE_SERVICE",number:8},{name:"TARGET_TYPE_METHOD",number:9}]}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"OneofOptions",field:[{name:"features",number:1,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"EnumOptions",field:[{name:"allow_alias",number:2,type:8,label:1},{name:"deprecated",number:3,type:8,label:1,defaultValue:"false"},{name:"deprecated_legacy_json_field_conflicts",number:6,type:8,label:1,options:{deprecated:!0}},{name:"features",number:7,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"EnumValueOptions",field:[{name:"deprecated",number:1,type:8,label:1,defaultValue:"false"},{name:"features",number:2,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"debug_redact",number:3,type:8,label:1,defaultValue:"false"},{name:"feature_support",number:4,type:11,label:1,typeName:".google.protobuf.FieldOptions.FeatureSupport"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"ServiceOptions",field:[{name:"features",number:34,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"deprecated",number:33,type:8,label:1,defaultValue:"false"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"MethodOptions",field:[{name:"deprecated",number:33,type:8,label:1,defaultValue:"false"},{name:"idempotency_level",number:34,type:14,label:1,typeName:".google.protobuf.MethodOptions.IdempotencyLevel",defaultValue:"IDEMPOTENCY_UNKNOWN"},{name:"features",number:35,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"uninterpreted_option",number:999,type:11,label:3,typeName:".google.protobuf.UninterpretedOption"}],enumType:[{name:"IdempotencyLevel",value:[{name:"IDEMPOTENCY_UNKNOWN",number:0},{name:"NO_SIDE_EFFECTS",number:1},{name:"IDEMPOTENT",number:2}]}],extensionRange:[{start:990,end:999},{start:1e3,end:536870912}]},{name:"UninterpretedOption",field:[{name:"name",number:2,type:11,label:3,typeName:".google.protobuf.UninterpretedOption.NamePart"},{name:"identifier_value",number:3,type:9,label:1},{name:"positive_int_value",number:4,type:4,label:1},{name:"negative_int_value",number:5,type:3,label:1},{name:"double_value",number:6,type:1,label:1},{name:"string_value",number:7,type:12,label:1},{name:"aggregate_value",number:8,type:9,label:1}],nestedType:[{name:"NamePart",field:[{name:"name_part",number:1,type:9,label:2},{name:"is_extension",number:2,type:8,label:2}]}]},{name:"FeatureSet",field:[{name:"field_presence",number:1,type:14,label:1,typeName:".google.protobuf.FeatureSet.FieldPresence",options:{retention:1,targets:[4,1],editionDefaults:[{value:"EXPLICIT",edition:900},{value:"IMPLICIT",edition:999},{value:"EXPLICIT",edition:1e3}]}},{name:"enum_type",number:2,type:14,label:1,typeName:".google.protobuf.FeatureSet.EnumType",options:{retention:1,targets:[6,1],editionDefaults:[{value:"CLOSED",edition:900},{value:"OPEN",edition:999}]}},{name:"repeated_field_encoding",number:3,type:14,label:1,typeName:".google.protobuf.FeatureSet.RepeatedFieldEncoding",options:{retention:1,targets:[4,1],editionDefaults:[{value:"EXPANDED",edition:900},{value:"PACKED",edition:999}]}},{name:"utf8_validation",number:4,type:14,label:1,typeName:".google.protobuf.FeatureSet.Utf8Validation",options:{retention:1,targets:[4,1],editionDefaults:[{value:"NONE",edition:900},{value:"VERIFY",edition:999}]}},{name:"message_encoding",number:5,type:14,label:1,typeName:".google.protobuf.FeatureSet.MessageEncoding",options:{retention:1,targets:[4,1],editionDefaults:[{value:"LENGTH_PREFIXED",edition:900}]}},{name:"json_format",number:6,type:14,label:1,typeName:".google.protobuf.FeatureSet.JsonFormat",options:{retention:1,targets:[3,6,1],editionDefaults:[{value:"LEGACY_BEST_EFFORT",edition:900},{value:"ALLOW",edition:999}]}},{name:"enforce_naming_style",number:7,type:14,label:1,typeName:".google.protobuf.FeatureSet.EnforceNamingStyle",options:{retention:2,targets:[1,2,3,4,5,6,7,8,9],editionDefaults:[{value:"STYLE_LEGACY",edition:900},{value:"STYLE2024",edition:1001},{value:"STYLE2026",edition:1002}]}},{name:"default_symbol_visibility",number:8,type:14,label:1,typeName:".google.protobuf.FeatureSet.VisibilityFeature.DefaultSymbolVisibility",options:{retention:2,targets:[1],editionDefaults:[{value:"EXPORT_ALL",edition:900},{value:"EXPORT_TOP_LEVEL",edition:1001},{value:"STRICT",edition:1002}]}},{name:"enforce_proto_limits",number:9,type:14,label:1,typeName:".google.protobuf.FeatureSet.ProtoLimitsFeature.EnforceProtoLimits",options:{retention:2,targets:[6,3,4,5],editionDefaults:[{value:"LEGACY_NO_EXPLICIT_LIMITS",edition:900},{value:"PROTO_LIMITS2026",edition:1002}]}}],nestedType:[{name:"VisibilityFeature",enumType:[{name:"DefaultSymbolVisibility",value:[{name:"DEFAULT_SYMBOL_VISIBILITY_UNKNOWN",number:0},{name:"EXPORT_ALL",number:1},{name:"EXPORT_TOP_LEVEL",number:2},{name:"LOCAL_ALL",number:3},{name:"STRICT",number:4}]}]},{name:"ProtoLimitsFeature",enumType:[{name:"EnforceProtoLimits",value:[{name:"PROTO_LIMITS_UNKNOWN",number:0},{name:"LEGACY_NO_EXPLICIT_LIMITS",number:1},{name:"PROTO_LIMITS2026",number:2}]}]}],enumType:[{name:"FieldPresence",value:[{name:"FIELD_PRESENCE_UNKNOWN",number:0},{name:"EXPLICIT",number:1},{name:"IMPLICIT",number:2},{name:"LEGACY_REQUIRED",number:3}]},{name:"EnumType",value:[{name:"ENUM_TYPE_UNKNOWN",number:0},{name:"OPEN",number:1},{name:"CLOSED",number:2}]},{name:"RepeatedFieldEncoding",value:[{name:"REPEATED_FIELD_ENCODING_UNKNOWN",number:0},{name:"PACKED",number:1},{name:"EXPANDED",number:2}]},{name:"Utf8Validation",value:[{name:"UTF8_VALIDATION_UNKNOWN",number:0},{name:"VERIFY",number:2},{name:"NONE",number:3}]},{name:"MessageEncoding",value:[{name:"MESSAGE_ENCODING_UNKNOWN",number:0},{name:"LENGTH_PREFIXED",number:1},{name:"DELIMITED",number:2}]},{name:"JsonFormat",value:[{name:"JSON_FORMAT_UNKNOWN",number:0},{name:"ALLOW",number:1},{name:"LEGACY_BEST_EFFORT",number:2}]},{name:"EnforceNamingStyle",value:[{name:"ENFORCE_NAMING_STYLE_UNKNOWN",number:0},{name:"STYLE2024",number:1},{name:"STYLE_LEGACY",number:2},{name:"STYLE2026",number:3}]}],extensionRange:[{start:1e3,end:9995},{start:9995,end:1e4},{start:1e4,end:10001}]},{name:"FeatureSetDefaults",field:[{name:"defaults",number:1,type:11,label:3,typeName:".google.protobuf.FeatureSetDefaults.FeatureSetEditionDefault"},{name:"minimum_edition",number:4,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"maximum_edition",number:5,type:14,label:1,typeName:".google.protobuf.Edition"}],nestedType:[{name:"FeatureSetEditionDefault",field:[{name:"edition",number:3,type:14,label:1,typeName:".google.protobuf.Edition"},{name:"overridable_features",number:4,type:11,label:1,typeName:".google.protobuf.FeatureSet"},{name:"fixed_features",number:5,type:11,label:1,typeName:".google.protobuf.FeatureSet"}]}]},{name:"SourceCodeInfo",field:[{name:"location",number:1,type:11,label:3,typeName:".google.protobuf.SourceCodeInfo.Location"}],nestedType:[{name:"Location",field:[{name:"path",number:1,type:5,label:3,options:{packed:!0}},{name:"span",number:2,type:5,label:3,options:{packed:!0}},{name:"leading_comments",number:3,type:9,label:1},{name:"trailing_comments",number:4,type:9,label:1},{name:"leading_detached_comments",number:6,type:9,label:3}]}],extensionRange:[{start:536e6,end:536000001}]},{name:"GeneratedCodeInfo",field:[{name:"annotation",number:1,type:11,label:3,typeName:".google.protobuf.GeneratedCodeInfo.Annotation"}],nestedType:[{name:"Annotation",field:[{name:"path",number:1,type:5,label:3,options:{packed:!0}},{name:"source_file",number:2,type:9,label:1},{name:"begin",number:3,type:5,label:1},{name:"end",number:4,type:5,label:1},{name:"semantic",number:5,type:14,label:1,typeName:".google.protobuf.GeneratedCodeInfo.Annotation.Semantic"}],enumType:[{name:"Semantic",value:[{name:"NONE",number:0},{name:"SET",number:1},{name:"ALIAS",number:2}]}]}]}],enumType:[{name:"Edition",value:[{name:"EDITION_UNKNOWN",number:0},{name:"EDITION_LEGACY",number:900},{name:"EDITION_PROTO2",number:998},{name:"EDITION_PROTO3",number:999},{name:"EDITION_2023",number:1e3},{name:"EDITION_2024",number:1001},{name:"EDITION_2026",number:1002},{name:"EDITION_UNSTABLE",number:9999},{name:"EDITION_1_TEST_ONLY",number:1},{name:"EDITION_2_TEST_ONLY",number:2},{name:"EDITION_99997_TEST_ONLY",number:99997},{name:"EDITION_99998_TEST_ONLY",number:99998},{name:"EDITION_99999_TEST_ONLY",number:99999},{name:"EDITION_MAX",number:2147483647}]},{name:"SymbolVisibility",value:[{name:"VISIBILITY_UNSET",number:0},{name:"VISIBILITY_LOCAL",number:1},{name:"VISIBILITY_EXPORT",number:2}]}]}),Vx=Sr(Bx,1);var fh;(function(t){t[t.DECLARATION=0]="DECLARATION",t[t.UNVERIFIED=1]="UNVERIFIED"})(fh||(fh={}));var dh;(function(t){t[t.DOUBLE=1]="DOUBLE",t[t.FLOAT=2]="FLOAT",t[t.INT64=3]="INT64",t[t.UINT64=4]="UINT64",t[t.INT32=5]="INT32",t[t.FIXED64=6]="FIXED64",t[t.FIXED32=7]="FIXED32",t[t.BOOL=8]="BOOL",t[t.STRING=9]="STRING",t[t.GROUP=10]="GROUP",t[t.MESSAGE=11]="MESSAGE",t[t.BYTES=12]="BYTES",t[t.UINT32=13]="UINT32",t[t.ENUM=14]="ENUM",t[t.SFIXED32=15]="SFIXED32",t[t.SFIXED64=16]="SFIXED64",t[t.SINT32=17]="SINT32",t[t.SINT64=18]="SINT64"})(dh||(dh={}));var hh;(function(t){t[t.OPTIONAL=1]="OPTIONAL",t[t.REPEATED=3]="REPEATED",t[t.REQUIRED=2]="REQUIRED"})(hh||(hh={}));var ph;(function(t){t[t.SPEED=1]="SPEED",t[t.CODE_SIZE=2]="CODE_SIZE",t[t.LITE_RUNTIME=3]="LITE_RUNTIME"})(ph||(ph={}));var mh;(function(t){t[t.STRING=0]="STRING",t[t.CORD=1]="CORD",t[t.STRING_PIECE=2]="STRING_PIECE"})(mh||(mh={}));var gh;(function(t){t[t.JS_NORMAL=0]="JS_NORMAL",t[t.JS_STRING=1]="JS_STRING",t[t.JS_NUMBER=2]="JS_NUMBER"})(gh||(gh={}));var _h;(function(t){t[t.RETENTION_UNKNOWN=0]="RETENTION_UNKNOWN",t[t.RETENTION_RUNTIME=1]="RETENTION_RUNTIME",t[t.RETENTION_SOURCE=2]="RETENTION_SOURCE"})(_h||(_h={}));var vh;(function(t){t[t.TARGET_TYPE_UNKNOWN=0]="TARGET_TYPE_UNKNOWN",t[t.TARGET_TYPE_FILE=1]="TARGET_TYPE_FILE",t[t.TARGET_TYPE_EXTENSION_RANGE=2]="TARGET_TYPE_EXTENSION_RANGE",t[t.TARGET_TYPE_MESSAGE=3]="TARGET_TYPE_MESSAGE",t[t.TARGET_TYPE_FIELD=4]="TARGET_TYPE_FIELD",t[t.TARGET_TYPE_ONEOF=5]="TARGET_TYPE_ONEOF",t[t.TARGET_TYPE_ENUM=6]="TARGET_TYPE_ENUM",t[t.TARGET_TYPE_ENUM_ENTRY=7]="TARGET_TYPE_ENUM_ENTRY",t[t.TARGET_TYPE_SERVICE=8]="TARGET_TYPE_SERVICE",t[t.TARGET_TYPE_METHOD=9]="TARGET_TYPE_METHOD"})(vh||(vh={}));var bh;(function(t){t[t.IDEMPOTENCY_UNKNOWN=0]="IDEMPOTENCY_UNKNOWN",t[t.NO_SIDE_EFFECTS=1]="NO_SIDE_EFFECTS",t[t.IDEMPOTENT=2]="IDEMPOTENT"})(bh||(bh={}));var Sh;(function(t){t[t.DEFAULT_SYMBOL_VISIBILITY_UNKNOWN=0]="DEFAULT_SYMBOL_VISIBILITY_UNKNOWN",t[t.EXPORT_ALL=1]="EXPORT_ALL",t[t.EXPORT_TOP_LEVEL=2]="EXPORT_TOP_LEVEL",t[t.LOCAL_ALL=3]="LOCAL_ALL",t[t.STRICT=4]="STRICT"})(Sh||(Sh={}));var xh;(function(t){t[t.PROTO_LIMITS_UNKNOWN=0]="PROTO_LIMITS_UNKNOWN",t[t.LEGACY_NO_EXPLICIT_LIMITS=1]="LEGACY_NO_EXPLICIT_LIMITS",t[t.PROTO_LIMITS2026=2]="PROTO_LIMITS2026"})(xh||(xh={}));var yh;(function(t){t[t.FIELD_PRESENCE_UNKNOWN=0]="FIELD_PRESENCE_UNKNOWN",t[t.EXPLICIT=1]="EXPLICIT",t[t.IMPLICIT=2]="IMPLICIT",t[t.LEGACY_REQUIRED=3]="LEGACY_REQUIRED"})(yh||(yh={}));var Eh;(function(t){t[t.ENUM_TYPE_UNKNOWN=0]="ENUM_TYPE_UNKNOWN",t[t.OPEN=1]="OPEN",t[t.CLOSED=2]="CLOSED"})(Eh||(Eh={}));var Mh;(function(t){t[t.REPEATED_FIELD_ENCODING_UNKNOWN=0]="REPEATED_FIELD_ENCODING_UNKNOWN",t[t.PACKED=1]="PACKED",t[t.EXPANDED=2]="EXPANDED"})(Mh||(Mh={}));var Th;(function(t){t[t.UTF8_VALIDATION_UNKNOWN=0]="UTF8_VALIDATION_UNKNOWN",t[t.VERIFY=2]="VERIFY",t[t.NONE=3]="NONE"})(Th||(Th={}));var Ah;(function(t){t[t.MESSAGE_ENCODING_UNKNOWN=0]="MESSAGE_ENCODING_UNKNOWN",t[t.LENGTH_PREFIXED=1]="LENGTH_PREFIXED",t[t.DELIMITED=2]="DELIMITED"})(Ah||(Ah={}));var wh;(function(t){t[t.JSON_FORMAT_UNKNOWN=0]="JSON_FORMAT_UNKNOWN",t[t.ALLOW=1]="ALLOW",t[t.LEGACY_BEST_EFFORT=2]="LEGACY_BEST_EFFORT"})(wh||(wh={}));var Rh;(function(t){t[t.ENFORCE_NAMING_STYLE_UNKNOWN=0]="ENFORCE_NAMING_STYLE_UNKNOWN",t[t.STYLE2024=1]="STYLE2024",t[t.STYLE_LEGACY=2]="STYLE_LEGACY",t[t.STYLE2026=3]="STYLE2026"})(Rh||(Rh={}));var Nh;(function(t){t[t.NONE=0]="NONE",t[t.SET=1]="SET",t[t.ALIAS=2]="ALIAS"})(Nh||(Nh={}));var Ih;(function(t){t[t.EDITION_UNKNOWN=0]="EDITION_UNKNOWN",t[t.EDITION_LEGACY=900]="EDITION_LEGACY",t[t.EDITION_PROTO2=998]="EDITION_PROTO2",t[t.EDITION_PROTO3=999]="EDITION_PROTO3",t[t.EDITION_2023=1e3]="EDITION_2023",t[t.EDITION_2024=1001]="EDITION_2024",t[t.EDITION_2026=1002]="EDITION_2026",t[t.EDITION_UNSTABLE=9999]="EDITION_UNSTABLE",t[t.EDITION_1_TEST_ONLY=1]="EDITION_1_TEST_ONLY",t[t.EDITION_2_TEST_ONLY=2]="EDITION_2_TEST_ONLY",t[t.EDITION_99997_TEST_ONLY=99997]="EDITION_99997_TEST_ONLY",t[t.EDITION_99998_TEST_ONLY=99998]="EDITION_99998_TEST_ONLY",t[t.EDITION_99999_TEST_ONLY=99999]="EDITION_99999_TEST_ONLY",t[t.EDITION_MAX=2147483647]="EDITION_MAX"})(Ih||(Ih={}));var Ch;(function(t){t[t.VISIBILITY_UNSET=0]="VISIBILITY_UNSET",t[t.VISIBILITY_LOCAL=1]="VISIBILITY_LOCAL",t[t.VISIBILITY_EXPORT=2]="VISIBILITY_EXPORT"})(Ch||(Ch={}));function t_(t){return Object.assign(Object.assign({readUnknownFields:!0,recursionLimit:100},t),{depth:0})}function Po(t,e,n){const i=vn(t);return Af(t).read(i,new go(e),t_(n),e.byteLength),i}const n_=new WeakMap;function Af(t){let e=n_.get(t);return e===void 0&&(e=Gx(t)),e}function Gx(t){const e=String(t),n=new Map,i={read:kx(e,n),readGroup:zx(e,n)};n_.set(t,i);for(const s of t.fields)n.set(s.number,i_(s));return i}function kx(t,e){return(n,i,s,r)=>{var o;if(++s.depth>s.recursionLimit)throw new Error(`cannot decode ${t} from binary: maximum recursion depth of ${s.recursionLimit} reached`);const a=i.pos+r,l=(o=n.$unknown)!==null&&o!==void 0?o:[];for(;i.pos<a;){const[c,u]=i.tag(),f=e.get(c);if(f===void 0){const h=i.skip(u,c,s.recursionLimit-s.depth);s.readUnknownFields&&l.push({no:c,wireType:u,data:h});continue}f(n,i,s,u)}l.length>0&&(n.$unknown=l),s.depth--}}function zx(t,e){return(n,i,s,r)=>{var o;if(++s.depth>s.recursionLimit)throw new Error(`cannot decode ${t} from binary: maximum recursion depth of ${s.recursionLimit} reached`);let a,l;const c=(o=n.$unknown)!==null&&o!==void 0?o:[];for(;i.pos<i.len&&([a,l]=i.tag(),l!=Ut.EndGroup);){const u=e.get(a);if(u===void 0){const f=i.skip(l,a,s.recursionLimit-s.depth);s.readUnknownFields&&c.push({no:a,wireType:l,data:f});continue}u(n,i,s,l)}if(l!=Ut.EndGroup||a!==r)throw new Error("invalid end group tag");c.length>0&&(n.$unknown=c),s.depth--}}function Hx(t,e,n,i,s){i_(n)(t[In],e,s,i)}function i_(t){switch(t.fieldKind){case"scalar":return Wx(t);case"enum":return Xx(t);case"message":return Yx(t);case"list":return $x(t);case"map":return Kx(t)}}function Wx(t){const e=Ja(t.scalar,t.utf8Validation,t.longAsString),n=t.localName;if(t.oneof){const i=t.oneof.localName;return(s,r)=>{s[i]={case:n,value:e(r)}}}return(i,s)=>{i[n]=e(s)}}function Xx(t){var e;const n=t.localName,i=(e=t.oneof)===null||e===void 0?void 0:e.localName;if(t.enum.open)return i!==void 0?(o,a)=>{o[i]={case:n,value:a.int32()}}:(o,a)=>{o[n]=a.int32()};const s=t.enum.values,r=t.number;return(o,a,l,c)=>{var u;const f=a.int32();if(s.some(h=>h.number===f))i!==void 0?o[i]={case:n,value:f}:o[n]=f;else if(l.readUnknownFields){const h=[];vS(f,h);const d=(u=o.$unknown)!==null&&u!==void 0?u:[];d.push({no:r,wireType:c,data:new Uint8Array(h)}),o.$unknown=d}}}function Yx(t){const e=t.localName,{toMessage:n,toLocal:i}=xi(t),s=s_(t);if(t.oneof){const r=t.oneof.localName;return(o,a,l)=>{const c=o[r],u=n(c.case===e?c.value:void 0);s(u,a,l),o[r]={case:e,value:i(u)}}}return(r,o,a)=>{const l=n(r[e]);s(l,o,a),r[e]=i(l)}}function s_(t){const e=Af(t.message);if(t.delimitedEncoding){const n=t.number;return(i,s,r)=>e.readGroup(i,s,r,n)}return(n,i,s)=>e.read(n,i,s,i.uint32())}function $x(t){const e=t.localName;if(t.listKind=="message"){const{toMessage:o,toLocal:a}=xi(t),l=s_(t);return(c,u,f)=>{const h=o(void 0);l(h,u,f),c[e].push(a(h))}}const n=t.listKind=="enum"?V.INT32:t.scalar,i=t.listKind=="scalar"?t.longAsString:!1,s=Ja(n,t.utf8Validation,i),r=n!=V.STRING&&n!=V.BYTES;return(o,a,l,c)=>{const u=o[e];if(c==Ut.LengthDelimited&&r){const f=a.uint32()+a.pos;for(;a.pos<f;)u.push(s(a))}else u.push(s(a))}}function Kx(t){const e=t.localName,n=Ja(t.mapKey,t.utf8Validation,!1),i=Wi(t.mapKey,!1);let s,r;switch(t.mapKind){case"scalar":{const o=t.scalar,a=Ja(o,t.utf8Validation,!1);if(s=l=>a(l),o==V.BYTES)r=()=>new Uint8Array(0);else{const l=Wi(o,!1);r=()=>l}break}case"enum":{const o=t.enum.values[0].number;s=a=>a.int32(),r=()=>o;break}case"message":{const{toMessage:o,toLocal:a}=xi(t),l=Af(t.message).read;s=(c,u,f)=>{const h=o(f);return l(h,c,u,c.uint32()),a(h)},r=()=>a(o(void 0));break}}return(o,a,l)=>{const c=o[e];let u,f;const h=a.uint32(),d=a.pos+h;for(;a.pos<d;){const[m,v]=a.tag();switch(m){case 1:u=n(a);break;case 2:f=s(a,l,f);break;default:a.skip(v,m,l.recursionLimit-l.depth)}}u===void 0&&(u=i),f===void 0&&(f=r()),jn(c,u,f)}}function Ja(t,e,n){switch(t){case V.STRING:return i=>i.string(e);case V.BOOL:return i=>i.bool();case V.DOUBLE:return i=>i.double();case V.FLOAT:return i=>i.float();case V.INT32:return i=>i.int32();case V.INT64:return n?i=>String(i.int64()):i=>i.int64();case V.UINT64:return n?i=>String(i.uint64()):i=>i.uint64();case V.FIXED64:return n?i=>String(i.fixed64()):i=>i.fixed64();case V.BYTES:return i=>i.bytes();case V.FIXED32:return i=>i.fixed32();case V.SFIXED32:return i=>i.sfixed32();case V.SFIXED64:return n?i=>String(i.sfixed64()):i=>i.sfixed64();case V.SINT64:return n?i=>String(i.sint64()):i=>i.sint64();case V.UINT32:return i=>i.uint32();case V.SINT32:return i=>i.sint32()}}function xl(t,e){var n;const i=Po(Vx,Ef(t));return i.messageType.forEach(Mf),i.dependency=(n=e==null?void 0:e.map(r=>r.proto.name))!==null&&n!==void 0?n:[],Zg(i,r=>e==null?void 0:e.find(o=>o.proto.name===r)).getFile(i.name)}const r_=xl("Chlnb29nbGUvcHJvdG9idWYvYW55LnByb3RvEg9nb29nbGUucHJvdG9idWYiJgoDQW55EhAKCHR5cGVfdXJsGAEgASgJEg0KBXZhbHVlGAIgASgMQnYKE2NvbS5nb29nbGUucHJvdG9idWZCCEFueVByb3RvUAFaLGdvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL2FueXBiogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM"),Zx=Sr(r_,0),Jx=2,qx=3,Lh={writeUnknownFields:!0};function jx(t){return t?Object.assign(Object.assign({},Lh),t):Lh}function o_(t,e,n){const i=new Fg;return wf(t)(i,jx(n),e),i.finish()}const a_=new WeakMap;function wf(t){let e=a_.get(t);return e===void 0&&(e=Qx(t)),e}function Qx(t){const e=t.typeName,n=t.fields.concat().sort((o,a)=>o.number-a.number),i=n[0],s=[],r=(o,a,l)=>{if(l.$typeName!==e&&i!==void 0)throw new wt(i,`cannot use ${i} with message ${l.$typeName}`,"ForeignFieldError");for(let u=0;u<s.length;u++)s[u](o,a,l);const c=l.$unknown;if(c!==void 0&&a.writeUnknownFields)for(let u=0;u<c.length;u++){const{no:f,wireType:h,data:d}=c[u];o.tag(f,h).raw(d)}};a_.set(t,r);for(const o of n)s.push(l_(o));return r}function l_(t){switch(t.fieldKind){case"message":case"scalar":case"enum":return ey(t);case"list":return ny(t);case"map":return iy(t)}}function ey(t){const e=ty(t),n=t.localName;if(t.oneof){const i=t.oneof.localName;return(s,r,o)=>{const a=o[i];a.case===n&&e(s,r,a.value)}}if(t.presence!=Jx){const i=t.presence==qx?`cannot encode ${t} to binary: required field not set`:void 0;return(s,r,o)=>{const a=o[n];if(a!==void 0&&Object.prototype.hasOwnProperty.call(o,n))e(s,r,a);else if(i!==void 0)throw new Error(i)}}if(t.fieldKind=="enum"){const i=t.enum.values[0].number;return(s,r,o)=>{const a=o[n];a!==i&&e(s,r,a)}}switch(t.scalar){case V.BOOL:return(i,s,r)=>{const o=r[n];o!==!1&&e(i,s,o)};case V.STRING:return(i,s,r)=>{const o=r[n];o!==""&&e(i,s,o)};case V.BYTES:return(i,s,r)=>{const o=r[n];(!(o instanceof Uint8Array)||o.byteLength>0)&&e(i,s,o)};case V.DOUBLE:case V.FLOAT:return(i,s,r)=>{const o=r[n];Object.is(o,0)||e(i,s,o)};default:return(i,s,r)=>{const o=r[n];o!=0&&e(i,s,o)}}}function ty(t){switch(t.fieldKind){case"message":{const{toMessage:e}=xi(t),n=c_(t);return(i,s,r)=>{n(i,s,e(r))}}case"scalar":case"enum":{const e=t.fieldKind=="enum"?V.INT32:t.scalar,n=t.number,i=El(e),s=yl(e,t.parent.typeName,t.name);return(r,o,a)=>{r.tag(n,i),s(r,a)}}}}function ny(t){const e=t.localName,n=t.number;switch(t.listKind){case"message":{const{toMessage:i}=xi(t),s=c_(t);return(r,o,a)=>{const l=a[e];for(let c=0;c<l.length;c++)s(r,o,i(l[c]))}}case"scalar":case"enum":{const i=t.listKind=="enum"?V.INT32:t.scalar,s=yl(i,t.parent.typeName,t.name);if(t.packed)return(o,a,l)=>{const c=l[e];if(c.length!=0){o.tag(n,Ut.LengthDelimited).fork();for(let u=0;u<c.length;u++)s(o,c[u]);o.join()}};const r=El(i);return(o,a,l)=>{const c=l[e];for(let u=0;u<c.length;u++)o.tag(n,r),s(o,c[u])}}}}function iy(t){const e=t.localName,n=t.number,i=sy(t);if(t.mapKind=="message"){const{toMessage:a}=xi(t),l=wf(t.message);return(c,u,f)=>{const h=f[e],d=Object.keys(h);for(let m=0;m<d.length;m++){const v=d[m];c.tag(n,Ut.LengthDelimited).fork(),i(c,v),c.tag(2,Ut.LengthDelimited).fork(),l(c,u,a(h[v])),c.join(),c.join()}}}const s=t.mapKind=="enum"?V.INT32:t.scalar,r=El(s),o=yl(s,t.parent.typeName,t.name);return(a,l,c)=>{const u=c[e],f=Object.keys(u);for(let h=0;h<f.length;h++){const d=f[h];a.tag(n,Ut.LengthDelimited).fork(),i(a,d),a.tag(2,r),o(a,u[d]),a.join()}}}function sy(t){const e=El(t.mapKey),n=yl(t.mapKey,t.parent.typeName,t.name),i=ry(t.mapKey);return(s,r)=>{s.tag(1,e),n(s,i(r))}}function ry(t){switch(t){case V.STRING:return e=>e;case V.BOOL:return e=>e==="true"?!0:e==="false"?!1:e;case V.UINT64:case V.FIXED64:return e=>{try{return At.uParse(e)}catch{return e}};case V.INT64:case V.SFIXED64:case V.SINT64:return e=>{try{return At.parse(e)}catch{return e}};default:return e=>{const n=Number.parseInt(e);return Number.isFinite(n)?n:e}}}function yl(t,e,n){const i=oy(t);return(s,r)=>{try{i(s,r)}catch(o){throw o instanceof Error?new Error(`cannot encode field ${e}.${n} to binary: ${o.message}`):o}}}function oy(t){switch(t){case V.STRING:return(e,n)=>e.string(n);case V.BOOL:return(e,n)=>e.bool(n);case V.DOUBLE:return(e,n)=>e.double(n);case V.FLOAT:return(e,n)=>e.float(n);case V.INT32:return(e,n)=>e.int32(n);case V.INT64:return(e,n)=>e.int64(n);case V.UINT64:return(e,n)=>e.uint64(n);case V.FIXED64:return(e,n)=>e.fixed64(n);case V.BYTES:return(e,n)=>e.bytes(n);case V.FIXED32:return(e,n)=>e.fixed32(n);case V.SFIXED32:return(e,n)=>e.sfixed32(n);case V.SFIXED64:return(e,n)=>e.sfixed64(n);case V.SINT64:return(e,n)=>e.sint64(n);case V.UINT32:return(e,n)=>e.uint32(n);case V.SINT32:return(e,n)=>e.sint32(n)}}function ay(t,e,n,i){l_(i)(t,e,n[In])}function c_(t){const e=t.number,n=wf(t.message);return t.delimitedEncoding?(i,s,r)=>{i.tag(e,Ut.StartGroup),n(i,s,r),i.tag(e,Ut.EndGroup)}:(i,s,r)=>{i.tag(e,Ut.LengthDelimited).fork(),n(i,s,r),i.join()}}function El(t){switch(t){case V.BYTES:case V.STRING:return Ut.LengthDelimited;case V.DOUBLE:case V.FIXED64:case V.SFIXED64:return Ut.Bit64;case V.FIXED32:case V.SFIXED32:case V.FLOAT:return Ut.Bit32;default:return Ut.Varint}}function ly(t,e,n){let i=!1;return n||(n=vn(Zx),i=!0),n.value=o_(t,e),n.typeUrl=fy(e.$typeName),i?n:void 0}function cy(t,e){if(t.typeUrl==="")return!1;const n=typeof e=="string"?e:e.typeName,i=u_(t.typeUrl);return n===i}function uy(t,e){if(t.typeUrl==="")return;const n=e.kind=="message"?e:e.getMessage(u_(t.typeUrl));if(!(!n||!cy(t,n)))return Po(n,t.value)}function fy(t){return`type.googleapis.com/${t}`}function u_(t){const e=t.lastIndexOf("/"),n=e>=0?t.substring(e+1):t;if(!n.length)throw new Error(`invalid type url: ${t}`);return n}const Rf=xl("Chxnb29nbGUvcHJvdG9idWYvc3RydWN0LnByb3RvEg9nb29nbGUucHJvdG9idWYihAEKBlN0cnVjdBIzCgZmaWVsZHMYASADKAsyIy5nb29nbGUucHJvdG9idWYuU3RydWN0LkZpZWxkc0VudHJ5GkUKC0ZpZWxkc0VudHJ5EgsKA2tleRgBIAEoCRIlCgV2YWx1ZRgCIAEoCzIWLmdvb2dsZS5wcm90b2J1Zi5WYWx1ZToCOAEi6gEKBVZhbHVlEjAKCm51bGxfdmFsdWUYASABKA4yGi5nb29nbGUucHJvdG9idWYuTnVsbFZhbHVlSAASFgoMbnVtYmVyX3ZhbHVlGAIgASgBSAASFgoMc3RyaW5nX3ZhbHVlGAMgASgJSAASFAoKYm9vbF92YWx1ZRgEIAEoCEgAEi8KDHN0cnVjdF92YWx1ZRgFIAEoCzIXLmdvb2dsZS5wcm90b2J1Zi5TdHJ1Y3RIABIwCgpsaXN0X3ZhbHVlGAYgASgLMhouZ29vZ2xlLnByb3RvYnVmLkxpc3RWYWx1ZUgAQgYKBGtpbmQiMwoJTGlzdFZhbHVlEiYKBnZhbHVlcxgBIAMoCzIWLmdvb2dsZS5wcm90b2J1Zi5WYWx1ZSobCglOdWxsVmFsdWUSDgoKTlVMTF9WQUxVRRAAQn8KE2NvbS5nb29nbGUucHJvdG9idWZCC1N0cnVjdFByb3RvUAFaL2dvb2dsZS5nb2xhbmcub3JnL3Byb3RvYnVmL3R5cGVzL2tub3duL3N0cnVjdHBi+AEBogIDR1BCqgIeR29vZ2xlLlByb3RvYnVmLldlbGxLbm93blR5cGVzYgZwcm90bzM"),dy=Sr(Rf,0),f_=Sr(Rf,1),hy=Sr(Rf,2);var jc;(function(t){t[t.NULL_VALUE=0]="NULL_VALUE"})(jc||(jc={}));function py(t,e,n){d_(e,t);const i=gy(t.$unknown,e),[s,r,o]=Ml(e),a=t_(n);for(const l of i)Hx(s,new go(l.data),r,l.wireType,a);return o()}function my(t,e,n){var i;d_(e,t);const s=((i=t.$unknown)!==null&&i!==void 0?i:[]).filter(c=>c.no!==e.number),[r,o]=Ml(e,n),a=new Fg;ay(a,{writeUnknownFields:!0},r,o);const l=new go(a.finish());for(;l.pos<l.len;){const[c,u]=l.tag(),f=l.skip(u,c);s.push({no:c,wireType:u,data:f})}t.$unknown=s}function gy(t,e){if(t===void 0)return[];if(e.fieldKind==="enum"||e.fieldKind==="scalar"){for(let n=t.length-1;n>=0;--n)if(t[n].no==e.number)return[t[n]];return[]}return t.filter(n=>n.no===e.number)}function Ml(t,e){const n=t.typeName,i=Object.assign(Object.assign({},t),{kind:"field",parent:t.extendee,localName:n}),s=Object.assign(Object.assign({},t.extendee),{fields:[i],members:[i],oneofs:[]}),r=vn(s,e!==void 0?{[n]:e}:void 0);return[$S(s,r),i,()=>{const o=r[n];if(o===void 0){const a=t.message;return Us(a)?Wi(a.fields[0].scalar,a.fields[0].longAsString):vn(a)}return o}]}function d_(t,e){if(t.extendee.typeName!=e.$typeName)throw new Error(`extension ${t.typeName} can only be applied to message ${t.extendee.typeName}`)}const h_=Date.parse("0001-01-01T00:00:00Z"),p_=Date.parse("9999-12-31T23:59:59Z"),m_=-315576e6,g_=315576e6,_y=3,vy=2,Ph={alwaysEmitImplicit:!1,enumAsInteger:!1,useProtoFieldName:!1};function by(t){return t?Object.assign(Object.assign({},Ph),t):Ph}function Sy(t,e,n){return qa(t)(by(n),e)}function xy(t,e,n){var i;const s=Sy(t,e,n);return JSON.stringify(s,null,(i=n==null?void 0:n.prettySpaces)!==null&&i!==void 0?i:0)}const Qc=new WeakMap;function qa(t){let e=Qc.get(t);return e===void 0&&(e=yy(t)),e}function yy(t){const e=t.typeName,n=My(t);if(n!==void 0){const a=t.fields[0],l=(c,u)=>{if(u.$typeName!==e&&a!==void 0)throw new wt(a,`cannot use ${a} with message ${u.$typeName}`,"ForeignFieldError");return n(c,u)};return Qc.set(t,l),l}const i=t.fields.concat().sort((a,l)=>a.number-l.number),s=i[0],r=[],o=(a,l)=>{if(l.$typeName!==e&&s!==void 0)throw new wt(s,`cannot use ${s} with message ${l.$typeName}`,"ForeignFieldError");const c={};for(let u=0;u<r.length;u++)r[u](a,l,c);return a.registry&&Iy(c,a,a.registry,l,t),c};Qc.set(t,o);for(const a of i){const l=Ty(a);r.push(a.jsonName==="__proto__"||a.name==="__proto__"?Ey(l):l)}return o}function Ey(t){return(e,n,i)=>{const s=Object.create(null);t(e,n,s);for(const r of Object.keys(s))jn(i,r,s[r])}}function My(t){if(t.typeName.startsWith("google.protobuf."))switch(t.typeName){case"google.protobuf.Any":return(e,n)=>Cy(n,e);case"google.protobuf.Timestamp":return(e,n)=>Dy(n);case"google.protobuf.Duration":return(e,n)=>Ly(n);case"google.protobuf.FieldMask":return(e,n)=>Py(n);case"google.protobuf.Struct":return(e,n)=>S_(n);case"google.protobuf.Value":return(e,n)=>Cf(n);case"google.protobuf.ListValue":return(e,n)=>x_(n);default:if(Us(t)){const e=t.fields[0],n=e.localName,i=Wi(e.scalar,!1),s=Tl(e);return(r,o)=>{const a=o[n];return s(r,a===void 0?i:a)}}return}}function Ty(t){switch(t.fieldKind){case"scalar":case"enum":case"message":return Ay(t);case"list":case"map":{const e=t.fieldKind=="list"?v_(t):b_(t),n=t.name,i=t.jsonName,s=t.localName;return(r,o,a)=>{const l=e(r,o[s]);l!==void 0&&(a[r.useProtoFieldName?n:i]=l)}}}}function Ay(t){const e=__(t),n=t.name,i=t.jsonName,s=t.localName;if(t.oneof){const r=t.oneof.localName;return(o,a,l)=>{const c=a[r];c.case===s&&(l[o.useProtoFieldName?n:i]=e(o,c.value))}}if(t.presence!=vy){const r=t.presence==_y?`cannot encode ${t} to JSON: required field not set`:void 0;return(o,a,l)=>{const c=a[s];if(c!==void 0&&Object.prototype.hasOwnProperty.call(a,s))l[o.useProtoFieldName?n:i]=e(o,c);else if(r!==void 0)throw new Error(r)}}if(t.fieldKind=="enum"){const r=t.enum.values[0].number;return(o,a,l)=>{const c=a[s];(c!==r||o.alwaysEmitImplicit)&&(l[o.useProtoFieldName?n:i]=e(o,c))}}switch(t.scalar){case V.BOOL:return(r,o,a)=>{const l=o[s];(l!==!1||r.alwaysEmitImplicit)&&(a[r.useProtoFieldName?n:i]=e(r,l))};case V.STRING:return(r,o,a)=>{const l=o[s];(l!==""||r.alwaysEmitImplicit)&&(a[r.useProtoFieldName?n:i]=e(r,l))};case V.BYTES:return(r,o,a)=>{const l=o[s];(!(l instanceof Uint8Array)||l.byteLength>0||r.alwaysEmitImplicit)&&(a[r.useProtoFieldName?n:i]=e(r,l))};case V.DOUBLE:case V.FLOAT:return(r,o,a)=>{const l=o[s];(!Object.is(l,0)||r.alwaysEmitImplicit)&&(a[r.useProtoFieldName?n:i]=e(r,l))};default:return(r,o,a)=>{const l=o[s];(l!=0||r.alwaysEmitImplicit)&&(a[r.useProtoFieldName?n:i]=e(r,l))}}}function wy(t){switch(t.fieldKind){case"scalar":case"enum":case"message":return __(t);case"list":return v_(t);case"map":return b_(t)}}function __(t){switch(t.fieldKind){case"scalar":return Tl(t);case"enum":return If(t);case"message":return Nf(t)}}function Nf(t){const{toMessage:e}=xi(t),n=qa(t.message);return(i,s)=>n(i,e(s))}function v_(t){const e=Ry(t);return(n,i)=>{const s=i;if(s.length==0&&!n.alwaysEmitImplicit)return;const r=[];for(let o=0;o<s.length;o++)r.push(e(n,s[o]));return r}}function Ry(t){switch(t.listKind){case"scalar":return Tl(t);case"enum":return If(t);case"message":return Nf(t)}}function b_(t){const e=Ny(t);return(n,i)=>{const s=i,r=Object.keys(s);if(r.length==0&&!n.alwaysEmitImplicit)return;const o={};for(let a=0;a<r.length;a++){const l=r[a];jn(o,l,e(n,s[l]))}return o}}function Ny(t){switch(t.mapKind){case"scalar":return Tl(t);case"enum":return If(t);case"message":return Nf(t)}}function If(t){const e=t.enum;return e.typeName=="google.protobuf.NullValue"?(n,i)=>{if(typeof i!="number")throw Dh(e,i);return null}:(n,i)=>{var s,r;if(typeof i!="number")throw Dh(e,i);return n.enumAsInteger?i:(r=(s=e.value[i])===null||s===void 0?void 0:s.jsonName)!==null&&r!==void 0?r:i}}function Dh(t,e){return new Error(`cannot encode ${t} to JSON: expected number, got ${Wt(e)}`)}function Tl(t){switch(t.scalar){case V.INT32:case V.SFIXED32:case V.SINT32:case V.FIXED32:case V.UINT32:return(e,n)=>{if(typeof n!="number")throw Bs(t,n);return n};case V.FLOAT:case V.DOUBLE:return(e,n)=>{if(typeof n!="number")throw Bs(t,n);return Number.isNaN(n)?"NaN":n===Number.POSITIVE_INFINITY?"Infinity":n===Number.NEGATIVE_INFINITY?"-Infinity":n};case V.STRING:return(e,n)=>{if(typeof n!="string")throw Bs(t,n);return n};case V.BOOL:return(e,n)=>{if(typeof n!="boolean")throw Bs(t,n);return n};case V.UINT64:case V.FIXED64:case V.INT64:case V.SFIXED64:case V.SINT64:return(e,n)=>{if(typeof n=="bigint"||typeof n=="string"||typeof n=="number"&&Number.isInteger(n))return n.toString();throw Bs(t,n)};case V.BYTES:return(e,n)=>{if(n instanceof Uint8Array)return QS(n);throw Bs(t,n)}}}function Bs(t,e){var n;return new Error(`cannot encode ${t} to JSON: ${(n=Gg(t,e))===null||n===void 0?void 0:n.message}`)}function Iy(t,e,n,i,s){const r=i.$unknown;if(r===void 0)return;const o=new Set;for(let a=0;a<r.length;a++){const{no:l}=r[a];if(!o.has(l)){o.add(l);const c=n.getExtensionFor(s,l);if(!c)continue;const u=py(i,c),[f,h]=Ml(c,u),d=f[In],m=wy(h)(e,d[h.localName]);m!==void 0&&(t[c.jsonName]=m)}}}function Cy(t,e){if(t.typeUrl==="")return{};const{registry:n}=e;let i,s;if(n&&(i=uy(t,n),i&&(s=n.getMessage(i.$typeName))),!s||!i)throw new Error(`cannot encode message ${t.$typeName} to JSON: "${t.typeUrl}" is not in the type registry`);const r=Ag(s)?{value:qa(s)(e,i)}:qa(s)(e,i);return r["@type"]=t.typeUrl,r}function Ly(t){const e=Number(t.seconds),n=t.nanos;if(e>g_||e<m_)throw new Error(`cannot encode message ${t.$typeName} to JSON: value out of range`);if(e>0&&n<0||e<0&&n>0)throw new Error(`cannot encode message ${t.$typeName} to JSON: nanos sign must match seconds sign`);let i=t.seconds.toString();if(n!==0){let s=Math.abs(n).toString();s="0".repeat(9-s.length)+s,s.substring(3)==="000000"?s=s.substring(0,3):s.substring(6)==="000"&&(s=s.substring(0,6)),i+="."+s,n<0&&e==0&&(i="-"+i)}return i+"s"}function Py(t){return t.paths.map(e=>{if(Kg(cr(e))!==e)throw new Error(`cannot encode message ${t.$typeName} to JSON: lowerCamelCase of path name "${e}" is irreversible`);return cr(e)}).join(",")}function S_(t){const e={},n=Object.keys(t.fields);for(let i=0;i<n.length;i++){const s=n[i];jn(e,s,Cf(t.fields[s]))}return e}function Cf(t){switch(t.kind.case){case"nullValue":return null;case"numberValue":if(!Number.isFinite(t.kind.value))throw new Error(`${t.$typeName} cannot be NaN or Infinity`);return t.kind.value;case"boolValue":return t.kind.value;case"stringValue":return t.kind.value;case"structValue":return S_(t.kind.value);case"listValue":return x_(t.kind.value);default:throw new Error(`${t.$typeName} must have a value`)}}function x_(t){return t.values.map(Cf)}function Dy(t){const e=Number(t.seconds)*1e3;if(e<h_||e>p_)throw new Error(`cannot encode message ${t.$typeName} to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);if(t.nanos<0)throw new Error(`cannot encode message ${t.$typeName} to JSON: nanos must not be negative`);if(t.nanos>999999999)throw new Error(`cannot encode message ${t.$typeName} to JSON: nanos must not be greater than 999999999`);let n="Z";if(t.nanos>0){const i=(t.nanos+1e9).toString().substring(1);i.substring(3)==="000000"?n="."+i.substring(0,3)+"Z":i.substring(6)==="000"?n="."+i.substring(0,6)+"Z":n="."+i+"Z"}return new Date(e).toISOString().replace(".000Z",n)}const Uy=2;function Oy(t){return Object.assign(Object.assign({ignoreUnknownFields:!1,recursionLimit:100},t),{depth:0})}function Fy(t,e,n){return By(t,Zy(e,t.typeName),n)}function By(t,e,n){const i=vn(t);return Vy(t,i,e,n),i}function Vy(t,e,n,i){try{ur(t)(e,n,Oy(i))}catch(s){throw BS(s)?new Error(`cannot decode ${s.field()} from JSON: ${s.message}`,{cause:s}):s}}const eu=new WeakMap;function ur(t){let e=eu.get(t);return e===void 0&&(e=Gy(t)),e}function Gy(t){const e=String(t),n=ky(t);if(n!==void 0){const o=(a,l,c)=>{if(++c.depth>c.recursionLimit)throw new Error(`cannot decode ${e} from JSON: maximum recursion depth of ${c.recursionLimit} reached`);n(a,l,c),c.depth--};return eu.set(t,o),o}const i=t.typeName,s=new Map,r=(o,a,l)=>{var c;if(++l.depth>l.recursionLimit)throw new Error(`cannot decode ${e} from JSON: maximum recursion depth of ${l.recursionLimit} reached`);if(a==null||Array.isArray(a)||typeof a!="object")throw new Error(`cannot decode ${e} from JSON: ${Wt(a)}`);const u=new Map,f=new Set,h=Object.keys(a);for(let d=0;d<h.length;d++){const m=h[d],v=a[m],g=s.get(m);if(g!==void 0){const p=g.field;if(f.has(p))throw new wt(p,"set multiple times");if(f.add(p),g.oneofScalarNullSkip&&v===null)continue;if(g.oneof){const b=u.get(g.oneof);if(b!==void 0)throw new wt(g.oneof,`oneof set multiple times by ${b.name} and ${p.name}`);u.set(g.oneof,p)}g.read(o,v,l)}else{const p=m.startsWith("[")&&m.endsWith("]")?(c=l.registry)===null||c===void 0?void 0:c.getExtension(m.substring(1,m.length-1)):void 0;if((p==null?void 0:p.extendee.typeName)==i){const[b,A,y]=Ml(p);Uh(A)(b[In],v,l),my(o,p,y())}if(p===void 0&&!l.ignoreUnknownFields)throw new Error(`cannot decode ${e} from JSON: key "${m}" is unknown`)}}l.depth--};eu.set(t,r);for(const o of t.fields){const a={read:Uh(o),field:o,oneof:o.oneof,oneofScalarNullSkip:o.oneof!==void 0&&o.fieldKind=="scalar"};s.set(o.name,a).set(o.jsonName,a)}return r}function ky(t){if(t.typeName.startsWith("google.protobuf."))switch(t.typeName){case"google.protobuf.Any":return(e,n,i)=>qy(e,n,i);case"google.protobuf.Timestamp":return(e,n)=>jy(e,n);case"google.protobuf.Duration":return(e,n)=>Qy(e,n);case"google.protobuf.FieldMask":return(e,n)=>eE(e,n);case"google.protobuf.Struct":return(e,n,i)=>T_(e,n,i);case"google.protobuf.Value":return(e,n,i)=>Of(e,n,i);case"google.protobuf.ListValue":return(e,n,i)=>A_(e,n,i);default:if(Us(t)){const e=t.fields[0],n=e.localName,i=e.scalar,s=e.longAsString,r=E_(e);return(o,a)=>{a===null?o[n]=Wi(i,s):o[n]=r(a)}}return}}function Uh(t){switch(t.fieldKind){case"scalar":return zy(t);case"enum":return Hy(t);case"message":return Wy(t);case"list":return Xy(t);case"map":return $y(t)}}function zy(t){const e=E_(t),n=t.localName;if(t.oneof){const s=t.oneof.localName;return(r,o)=>{r[s]={case:n,value:e(o)}}}const i=y_(t);return(s,r)=>{r===null?i(s):s[n]=e(r)}}function y_(t){const e=t.localName;if(t.presence!=Uy)return s=>{delete s[e]};if(t.fieldKind=="enum"){const s=t.enum.values[0].number;return r=>{r[e]=s}}const n=t.scalar,i=t.longAsString;return s=>{s[e]=Wi(n,i)}}function Hy(t){const e=Lf(t.enum),n=Pf(t.enum),i=t.localName,s=t.enum.typeName!="google.protobuf.NullValue";if(t.oneof){const o=t.oneof.localName;return(a,l,c)=>{if(l===null&&s){a[o].case===i&&(a[o]={case:void 0});return}const u=e(l,c.ignoreUnknownFields);if(u===fr)return;const f=n(u);if(f!==!0)throw new wt(t,qn(t,u,f));a[o]={case:i,value:u}}}const r=y_(t);return(o,a,l)=>{if(a===null&&s){r(o);return}const c=e(a,l.ignoreUnknownFields);if(c===fr)return;const u=n(c);if(u!==!0)throw new wt(t,qn(t,c,u));o[i]=c}}function Wy(t){const e=t.localName,{toMessage:n,toLocal:i}=xi(t),s=ur(t.message),r=t.message.typeName!="google.protobuf.Value";if(t.oneof){const o=t.oneof.localName;return(a,l,c)=>{const u=a[o];if(l===null&&r){u.case===e&&(a[o]={case:void 0});return}const f=n(u.case===e?u.value:void 0);s(f,l,c),a[o]={case:e,value:i(f)}}}return(o,a,l)=>{if(a===null&&r){delete o[e];return}const c=n(o[e]);s(c,a,l),o[e]=i(c)}}function Xy(t){const e=t.localName,n=Yy(t);return(i,s,r)=>{if(s===null)return;if(!Array.isArray(s))throw new wt(t,"expected Array, got "+Wt(s));const o=i[e];for(let a=0;a<s.length;a++){const l=n(s[a],r,o.length);l!==fr&&o.push(l)}}}function Yy(t){switch(t.listKind){case"scalar":{const e=Df(t),n=ds(t.scalar),i=Uf(t);return(s,r,o)=>{if(s===null)throw new wt(t,"list item must not be null");const a=e(s),l=n(a);if(l!==!0)throw new wt(t,`list item #${o+1}: ${qn(t,a,l)}`);return i(a)}}case"enum":{const e=Lf(t.enum),n=Pf(t.enum),i=t.enum.typeName!="google.protobuf.NullValue";return(s,r,o)=>{if(s===null&&i)throw new wt(t,"list item must not be null");const a=e(s,r.ignoreUnknownFields);if(a===fr)return a;const l=n(a);if(l!==!0)throw new wt(t,`list item #${o+1}: ${qn(t,a,l)}`);return a}}case"message":{const{toMessage:e,toLocal:n}=xi(t),i=ur(t.message),s=t.message.typeName!="google.protobuf.Value";return(r,o)=>{if(r===null&&s)throw new wt(t,"list item must not be null");const a=e(void 0);return i(a,r,o),n(a)}}}}function $y(t){const e=t.localName,n=t.mapKey,i=Ky(n),s=ds(n);let r,o,a=c=>c,l=!0;switch(t.mapKind){case"scalar":{r=Df(t),o=ds(t.scalar),a=Uf(t);break}case"enum":{const c=Lf(t.enum);r=(u,f)=>c(u,f.ignoreUnknownFields),o=Pf(t.enum),l=t.enum.typeName!="google.protobuf.NullValue";break}case"message":{const{toMessage:c,toLocal:u}=xi(t),f=ur(t.message);l=t.message.typeName!="google.protobuf.Value",r=(h,d)=>{const m=c(void 0);return f(m,h,d),u(m)};break}}return(c,u,f)=>{if(u===null)return;if(typeof u!="object"||Array.isArray(u))throw new wt(t,"expected object, got "+Wt(u));const h=c[e],d=new Set,m=Object.keys(u);for(let v=0;v<m.length;v++){const g=m[v],p=u[g],b=i(g);if(d.has(b))throw new wt(t,`duplicate map key "${g}"`);if(d.add(b),p===null&&l)throw new wt(t,"map value must not be null");const A=r(p,f);if(A===fr)continue;const y=s(b);if(y!==!0)throw new wt(t,`invalid map key: ${qn({scalar:n},b,y)}`);if(o!==void 0){const w=o(A);if(w!==!0)throw new wt(t,`map entry ${Wt(b)}: ${qn(t,A,w)}`)}jn(h,b,a(A))}}}const fr=Symbol();function Lf(t){const e=t.values[0].number,n=new Map;for(const i of t.values)n.set(i.jsonName,i.number);for(const i of t.values)n.set(i.name,i.number);return(i,s)=>{if(i===null)return e;switch(typeof i){case"number":if(Number.isInteger(i))return i;break;case"string":{const r=n.get(i);if(r!==void 0)return r;if(s)return fr;break}}throw new Error(`cannot decode ${t} from JSON: ${Wt(i)}`)}}function Pf(t){if(t.open)return ds(V.INT32);const e=t.values;return n=>e.some(i=>i.number===n)}function E_(t){const e=Df(t),n=ds(t.scalar),i=Uf(t);return s=>{const r=e(s),o=n(r);if(o!==!0)throw new wt(t,qn(t,r,o));return i(r)}}function Df(t){switch(t.scalar){case V.DOUBLE:case V.FLOAT:return e=>{if(e==="NaN")return NaN;if(e==="Infinity")return Number.POSITIVE_INFINITY;if(e==="-Infinity")return Number.NEGATIVE_INFINITY;if(typeof e=="number"){if(Number.isNaN(e))throw new wt(t,"unexpected NaN number");if(!Number.isFinite(e))throw new wt(t,"unexpected infinite number");return e}if(typeof e=="string"){if(e===""||e.trim().length!==e.length)return e;const n=Number(e);return Number.isFinite(n)?n:e}return e};case V.INT32:case V.FIXED32:case V.SFIXED32:case V.SINT32:case V.UINT32:return M_;case V.BYTES:return e=>{if(typeof e=="string"){if(e==="")return new Uint8Array(0);try{return Ef(e)}catch(n){const i=n instanceof Error?n.message:String(n);throw new wt(t,i)}}return e};default:return e=>e}}function Uf(t){const e=t.fieldKind!=="map"&&t.longAsString;switch(t.scalar){case V.INT64:case V.SFIXED64:case V.SINT64:return e?n=>String(n):n=>typeof n=="string"||typeof n=="number"?At.parse(n):n;case V.FIXED64:case V.UINT64:return e?n=>String(n):n=>typeof n=="string"||typeof n=="number"?At.uParse(n):n;default:return n=>n}}function Ky(t){switch(t){case V.BOOL:return e=>{switch(e){case"true":return!0;case"false":return!1}return e};case V.INT32:case V.FIXED32:case V.UINT32:case V.SFIXED32:case V.SINT32:return M_;case V.INT64:case V.SINT64:case V.SFIXED64:case V.UINT64:case V.FIXED64:return e=>/^-?0+$/.test(e)?"0":e.replace(/^(-?)0+(?=\d)/,"$1");default:return e=>e}}function M_(t){if(typeof t=="string"){if(t===""||t.trim().length!==t.length)return t;const e=Number(t);return Number.isNaN(e)?t:e}return t}function Zy(t,e){let n;try{n=JSON.parse(t)}catch(i){const s=i instanceof Error?i.message:String(i);throw new Error(`cannot decode message ${e} from JSON: ${s}`,{cause:i})}return Jy(t,e),n}function Jy(t,e){const n=[];let i=!1,s=0;for(;s<t.length;)switch(t[s]){case"{":n.push(new Set),i=!0,s++;break;case"[":n.push(null),i=!1,s++;break;case"}":case"]":n.pop(),i=!1,s++;break;case",":i=n[n.length-1]!=null,s++;break;case":":i=!1,s++;break;case'"':{const r=s++;let o=!1;for(;s<t.length;){if(t[s]=="\\"){o=!0,s+=2;continue}if(t[s]=='"')break;s++}const a=s++,l=n[n.length-1];if(i&&l){const c=o?JSON.parse(t.substring(r,a+1)):t.substring(r+1,a);if(l.has(c))throw new Error(`cannot decode message ${e} from JSON: duplicate object key "${c}"`);l.add(c)}i=!1;break}default:s++;break}}function qy(t,e,n){var i;if(e===null||Array.isArray(e)||typeof e!="object")throw new Error(`cannot decode message ${t.$typeName} from JSON: expected object but got ${Wt(e)}`);if(Object.keys(e).length==0)return;const s=e["@type"];if(typeof s!="string"||s=="")throw new Error(`cannot decode message ${t.$typeName} from JSON: "@type" is empty`);const r=s.includes("/")?s.substring(s.lastIndexOf("/")+1):s;if(!r.length)throw new Error(`cannot decode message ${t.$typeName} from JSON: "@type" is invalid`);const o=(i=n.registry)===null||i===void 0?void 0:i.getMessage(r);if(!o)throw new Error(`cannot decode message ${t.$typeName} from JSON: ${s} is not in the type registry`);const a=vn(o);if(Ag(o)&&Object.prototype.hasOwnProperty.call(e,"value"))ur(o)(a,e.value,n);else{const l={};for(const c of Object.keys(e))c!=="@type"&&jn(l,c,e[c]);ur(o)(a,l,n)}ly(o,a,t)}function jy(t,e){if(typeof e!="string")throw new Error(`cannot decode message ${t.$typeName} from JSON: ${Wt(e)}`);const n=e.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.([0-9]{1,9}))?(?:Z|([+-][0-9][0-9]:[0-9][0-9]))$/);if(!n)throw new Error(`cannot decode message ${t.$typeName} from JSON: invalid RFC 3339 string`);const i=Date.parse(n[1]+"-"+n[2]+"-"+n[3]+"T"+n[4]+":"+n[5]+":"+n[6]+(n[8]?n[8]:"Z"));if(Number.isNaN(i))throw new Error(`cannot decode message ${t.$typeName} from JSON: invalid RFC 3339 string`);if(i<h_||i>p_)throw new Error(`cannot decode message ${t.$typeName} from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive`);t.seconds=At.parse(i/1e3),t.nanos=0,n[7]&&(t.nanos=parseInt("1"+n[7]+"0".repeat(9-n[7].length))-1e9)}function Qy(t,e){if(typeof e!="string")throw new Error(`cannot decode message ${t.$typeName} from JSON: ${Wt(e)}`);const n=e.match(/^(-?[0-9]+)(?:\.([0-9]+))?s/);if(n===null)throw new Error(`cannot decode message ${t.$typeName} from JSON: ${Wt(e)}`);const i=Number(n[1]);if(i>g_||i<m_)throw new Error(`cannot decode message ${t.$typeName} from JSON: ${Wt(e)}`);if(t.seconds=At.parse(i),typeof n[2]!="string")return;const s=n[2]+"0".repeat(9-n[2].length);t.nanos=parseInt(s),(i<0||Object.is(i,-0))&&(t.nanos=-t.nanos)}function eE(t,e){if(typeof e!="string")throw new Error(`cannot decode message ${t.$typeName} from JSON: ${Wt(e)}`);e!==""&&(t.paths=e.split(",").map(n=>{if(n.includes("_"))throw new Error(`cannot decode message ${t.$typeName} from JSON: path names must be lowerCamelCase`);return Kg(n)}))}function T_(t,e,n){if(typeof e!="object"||e==null||Array.isArray(e))throw new Error(`cannot decode message ${t.$typeName} from JSON ${Wt(e)}`);const i=Object.keys(e);for(let s=0;s<i.length;s++){const r=i[s],o=vn(f_);Of(o,e[r],n),jn(t.fields,r,o)}}function Of(t,e,n){if(++n.depth>n.recursionLimit)throw new Error(`cannot decode ${t.$typeName} from JSON: maximum recursion depth of ${n.recursionLimit} reached`);switch(typeof e){case"number":t.kind={case:"numberValue",value:e};break;case"string":t.kind={case:"stringValue",value:e};break;case"boolean":t.kind={case:"boolValue",value:e};break;case"object":if(e===null)t.kind={case:"nullValue",value:jc.NULL_VALUE};else if(Array.isArray(e)){const i=vn(hy);A_(i,e,n),t.kind={case:"listValue",value:i}}else{const i=vn(dy);T_(i,e,n),t.kind={case:"structValue",value:i}}break;default:throw new Error(`cannot decode message ${t.$typeName} from JSON ${Wt(e)}`)}return n.depth--,t}function A_(t,e,n){if(!Array.isArray(e))throw new Error(`cannot decode message ${t.$typeName} from JSON ${Wt(e)}`);for(let i=0;i<e.length;i++){const s=vn(f_);Of(s,e[i],n),t.values.push(s)}}function Oh(t){const e=pt[t];return typeof e!="string"?t.toString():e[0].toLowerCase()+e.substring(1).replace(/[A-Z]/g,n=>"_"+n.toLowerCase())}class Mt extends Error{constructor(e,n=pt.Unknown,i,s,r){super(tE(e,n)),this.name="ConnectError",this.isWireError=!1,Object.setPrototypeOf(this,new.target.prototype),this.rawMessage=e,this.code=n,this.metadata=new Headers(i??{}),this.details=s??[],this.cause=r}static from(e,n=pt.Unknown){return e instanceof Mt?e:e instanceof Error?e.name=="AbortError"||e.name=="TimeoutError"?new Mt(e.message,pt.Canceled):new Mt(e.message,n,void 0,void 0,e):new Mt(String(e),n,void 0,void 0,e)}static[Symbol.hasInstance](e){return e instanceof Error?Object.getPrototypeOf(e)===Mt.prototype?!0:e.name==="ConnectError"&&"code"in e&&typeof e.code=="number"&&"metadata"in e&&"details"in e&&Array.isArray(e.details)&&"rawMessage"in e&&typeof e.rawMessage=="string"&&"cause"in e:!1}findDetails(e){const n=e.kind==="message"?{getMessage:s=>s===e.typeName?e:void 0}:e,i=[];for(const s of this.details){if("desc"in s){n.getMessage(s.desc.typeName)&&i.push(vn(s.desc,s.value));continue}const r=n.getMessage(s.type);if(r)try{i.push(Po(r,s.value))}catch{}}return i}}function tE(t,e){return t.length?`[${Oh(e)}] ${t}`:`[${Oh(e)}]`}function nE(t,e,n){try{const i=Ef(t);return e?Po(e,i,n):i}catch(i){throw Mt.from(i,pt.DataLoss)}}function iE(t,e){const n={};for(const i of t.methods){const s=e(i);s!=null&&(n[i.localName]=s)}return n}const Fh=1;function sE(t,e,n=!1){if(e>t){let i=`message size is larger than configured readMaxBytes ${t}`;throw n&&(i=`message size ${e} is larger than configured readMaxBytes ${t}`),new Mt(i,pt.ResourceExhausted)}}function rE(t){return new oE(t)}class oE{constructor(e){this.readMaxBytes=e,this.header=new Uint8Array(5),this.headerView=new DataView(this.header.buffer),this.buf=[]}get byteLength(){return this.buf.reduce((e,n)=>e+n.byteLength,0)}decode(e){this.buf.push(e);const n=[];for(;;){let i=this.pop();if(!i)break;n.push(i)}return n}pop(){if(!(!this.env&&(this.env=this.head(),!this.env))&&this.cons(this.env.data)){const e=this.env;return this.env=void 0,e}}head(){if(!this.cons(this.header))return;const e=this.headerView.getUint8(0),n=this.headerView.getUint32(1);return sE(this.readMaxBytes,n,!0),{flags:e,data:new Uint8Array(n)}}cons(e){const n=e.byteLength;if(this.byteLength<n)return!1;let i=0;for(;i<n;){const s=this.buf.shift();s.byteLength>n-i?(e.set(s.subarray(0,n-i),i),this.buf.unshift(s.subarray(n-i)),i+=n-i):(e.set(s,i),i+=s.byteLength)}return!0}}function Bh(t){let e;const n=rE(4294967295);return new ReadableStream({start(){e=t.getReader()},async pull(i){let s=!1;for(;!s;){const r=await e.read();if(r.done)n.byteLength>0&&i.error(new Mt("protocol error: incomplete envelope",pt.InvalidArgument)),i.close();else for(const o of n.decode(r.value))i.enqueue(o),s=!0}}})}function Vh(t,e){const n=new Uint8Array(e.length+5);n.set(e,5);const i=new DataView(n.buffer,n.byteOffset,n.byteLength);return i.setUint8(0,t),i.setUint32(1,e.length),n}var aE=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],n;return e?e.call(t):(t=typeof __values=="function"?__values(t):t[Symbol.iterator](),n={},i("next"),i("throw"),i("return"),n[Symbol.asyncIterator]=function(){return this},n);function i(r){n[r]=t[r]&&function(o){return new Promise(function(a,l){o=t[r](o),s(a,l,o.done,o.value)})}}function s(r,o,a,l){Promise.resolve(l).then(function(c){r({value:c,done:a})},o)}},bo=function(t){return this instanceof bo?(this.v=t,this):new bo(t)},lE=function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=n.apply(t,e||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",o),s[Symbol.asyncIterator]=function(){return this},s;function o(d){return function(m){return Promise.resolve(m).then(d,f)}}function a(d,m){i[d]&&(s[d]=function(v){return new Promise(function(g,p){r.push([d,v,g,p])>1||l(d,v)})},m&&(s[d]=m(s[d])))}function l(d,m){try{c(i[d](m))}catch(v){h(r[0][3],v)}}function c(d){d.value instanceof bo?Promise.resolve(d.value.v).then(u,f):h(r[0][2],d)}function u(d){l("next",d)}function f(d){l("throw",d)}function h(d,m){d(m),r.shift(),r.length&&l(r[0][0],r[0][1])}},cE=function(t){var e,n;return e={},i("next"),i("throw",function(s){throw s}),i("return"),e[Symbol.iterator]=function(){return this},e;function i(s,r){e[s]=t[s]?function(o){return(n=!n)?{value:bo(t[s](o)),done:!1}:r?r(o):o}:r}};function uE(t){return lE(this,arguments,function*(){yield bo(yield*cE(aE(t)))})}var w_=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],n;return e?e.call(t):(t=typeof __values=="function"?__values(t):t[Symbol.iterator](),n={},i("next"),i("throw"),i("return"),n[Symbol.asyncIterator]=function(){return this},n);function i(r){n[r]=t[r]&&function(o){return new Promise(function(a,l){o=t[r](o),s(a,l,o.done,o.value)})}}function s(r,o,a,l){Promise.resolve(l).then(function(c){r({value:c,done:a})},o)}},dr=function(t){return this instanceof dr?(this.v=t,this):new dr(t)},fE=function(t){var e,n;return e={},i("next"),i("throw",function(s){throw s}),i("return"),e[Symbol.iterator]=function(){return this},e;function i(s,r){e[s]=t[s]?function(o){return(n=!n)?{value:dr(t[s](o)),done:!1}:r?r(o):o}:r}},dE=function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=n.apply(t,e||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",o),s[Symbol.asyncIterator]=function(){return this},s;function o(d){return function(m){return Promise.resolve(m).then(d,f)}}function a(d,m){i[d]&&(s[d]=function(v){return new Promise(function(g,p){r.push([d,v,g,p])>1||l(d,v)})},m&&(s[d]=m(s[d])))}function l(d,m){try{c(i[d](m))}catch(v){h(r[0][3],v)}}function c(d){d.value instanceof dr?Promise.resolve(d.value.v).then(u,f):h(r[0][2],d)}function u(d){l("next",d)}function f(d){l("throw",d)}function h(d,m){d(m),r.shift(),r.length&&l(r[0][0],r[0][1])}};function Al(t,e){return iE(t,n=>{switch(n.methodKind){case"unary":return hE(e,n);case"server_streaming":return pE(e,n);case"client_streaming":return mE(e,n);case"bidi_streaming":return gE(e,n);default:return null}})}function hE(t,e){return async(n,i)=>{var s,r;const o=await t.unary(e,i==null?void 0:i.signal,i==null?void 0:i.timeoutMs,i==null?void 0:i.headers,n,i==null?void 0:i.contextValues);return(s=i==null?void 0:i.onHeader)===null||s===void 0||s.call(i,o.header),(r=i==null?void 0:i.onTrailer)===null||r===void 0||r.call(i,o.trailer),o.message}}function pE(t,e){return(n,i)=>R_(t.stream(e,i==null?void 0:i.signal,i==null?void 0:i.timeoutMs,i==null?void 0:i.headers,uE([n]),i==null?void 0:i.contextValues),i)}function mE(t,e){return async(n,i)=>{var s,r,o,a,l,c;const u=await t.stream(e,i==null?void 0:i.signal,i==null?void 0:i.timeoutMs,i==null?void 0:i.headers,n,i==null?void 0:i.contextValues);(l=i==null?void 0:i.onHeader)===null||l===void 0||l.call(i,u.header);let f,h=0;try{for(var d=!0,m=w_(u.message),v;v=await m.next(),s=v.done,!s;d=!0)a=v.value,d=!1,f=a,h++}catch(g){r={error:g}}finally{try{!d&&!s&&(o=m.return)&&await o.call(m)}finally{if(r)throw r.error}}if(!f)throw new Mt("protocol error: missing response message",pt.Unimplemented);if(h>1)throw new Mt("protocol error: received extra messages for client streaming method",pt.Unimplemented);return(c=i==null?void 0:i.onTrailer)===null||c===void 0||c.call(i,u.trailer),f}}function gE(t,e){return(n,i)=>R_(t.stream(e,i==null?void 0:i.signal,i==null?void 0:i.timeoutMs,i==null?void 0:i.headers,n,i==null?void 0:i.contextValues),i)}function R_(t,e){return(function(){return dE(this,arguments,function*(){var n,i;const s=yield dr(t);(n=e==null?void 0:e.onHeader)===null||n===void 0||n.call(e,s.header),yield dr(yield*fE(w_(s.message))),(i=e==null?void 0:e.onTrailer)===null||i===void 0||i.call(e,s.trailer)})})()}function _E(...t){const e=new AbortController,n=t.filter(s=>s!==void 0).concat(e.signal);for(const s of n){if(s.aborted){i.apply(s);break}s.addEventListener("abort",i)}function i(){e.signal.aborted||e.abort(to(this));for(const s of n)s.removeEventListener("abort",i)}return e}function vE(t){const e=new AbortController,n=()=>{e.abort(new Mt("the operation timed out",pt.DeadlineExceeded))};let i;return t!==void 0&&(t<=0?n():i=setTimeout(n,t)),{signal:e.signal,cleanup:()=>clearTimeout(i)}}function to(t){if(!t.aborted)return;if(t.reason!==void 0)return t.reason;const e=new Error("This operation was aborted");return e.name="AbortError",e}function Gh(){return{get(t){return t.id in this?this[t.id]:t.defaultValue},set(t,e){return this[t.id]=e,this},delete(t){return delete this[t.id],this}}}const jl=128;function kh(t){const e=new Headers,n=new TextDecoder().decode(t).split(`\r
`);for(const i of n){if(i==="")continue;const s=i.indexOf(":");if(s>0){const r=i.substring(0,s).trim(),o=i.substring(s+1).trim();e.append(r,o)}}return e}const bE="Content-Type",SE="Grpc-Timeout",hr="Grpc-Status",N_="Grpc-Message",xE="Grpc-Status-Details-Bin",yE="User-Agent",zh="X-User-Agent",EE="X-Grpc-Web",ME="application/grpc-web+proto",TE="application/grpc-web+json";function wl(t,e,...n){if(n.length>0)throw new Error;return t.services[e]}const AE=xl("CgxzdGF0dXMucHJvdG8SCmdvb2dsZS5ycGMiTgoGU3RhdHVzEgwKBGNvZGUYASABKAUSDwoHbWVzc2FnZRgCIAEoCRIlCgdkZXRhaWxzGAMgAygLMhQuZ29vZ2xlLnByb3RvYnVmLkFueUJeCg5jb20uZ29vZ2xlLnJwY0ILU3RhdHVzUHJvdG9QAVo3Z29vZ2xlLmdvbGFuZy5vcmcvZ2VucHJvdG8vZ29vZ2xlYXBpcy9ycGMvc3RhdHVzO3N0YXR1c6ICA1JQQ2IGcHJvdG8z",[r_]),wE=Sr(AE,0),RE="0";function I_(t){var e;const n=t.get(xE);if(n!=null){const s=nE(n,wE);if(s.code==0)return;const r=new Mt(s.message,s.code,t);return r.details=s.details.map(o=>({type:o.typeUrl.substring(o.typeUrl.lastIndexOf("/")+1),value:o.value})),r.isWireError=!0,r}const i=t.get(hr);if(i!=null){if(i===RE)return;const s=parseInt(i,10);let r;return s in pt?r=new Mt(decodeURIComponent((e=t.get(N_))!==null&&e!==void 0?e:""),s,t):r=new Mt(`invalid grpc-status: ${i}`,pt.Internal,t),r.isWireError=!0,r}}function Hh(t,e){return t.toString().replace(/\/?$/,`/${e.parent.typeName}/${e.name}`)}function C_(t,e){return vn(t,e)}function NE(t,e){function n(i){return i.done===!0?i:{done:i.done,value:C_(t,i.value)}}return{[Symbol.asyncIterator](){const i=e[Symbol.asyncIterator](),s={next:()=>i.next().then(n)};return i.throw!==void 0&&(s.throw=r=>i.throw(r).then(n)),i.return!==void 0&&(s.return=r=>i.return(r).then(n)),s}}}function L_(t,e){if(!e)return t;for(const n of e.concat().reverse())t=n(t);return t}function IE(t){var e;const n=Object.assign({},t);return(e=n.ignoreUnknownFields)!==null&&e!==void 0||(n.ignoreUnknownFields=!0),n}function Wh(t,e,n,i){const s=e?Xh(t.input,i):Yh(t.input,n);return{parse:(e?Xh(t.output,i):Yh(t.output,n)).parse,serialize:s.serialize}}function Xh(t,e){return{parse(n){try{return Po(t,n,e)}catch(i){const s=i instanceof Error?i.message:String(i);throw new Mt(`parse binary: ${s}`,pt.Internal)}},serialize(n){try{return o_(t,n,e)}catch(i){const s=i instanceof Error?i.message:String(i);throw new Mt(`serialize binary: ${s}`,pt.Internal)}}}}function Yh(t,e){var n,i;const s=(n=e==null?void 0:e.textEncoder)!==null&&n!==void 0?n:new TextEncoder,r=(i=e==null?void 0:e.textDecoder)!==null&&i!==void 0?i:new TextDecoder,o=IE(e);return{parse(a){try{const l=r.decode(a);return Fy(t,l,o)}catch(l){throw Mt.from(l,pt.InvalidArgument)}},serialize(a){try{const l=xy(t,a,o);return s.encode(l)}catch(l){throw Mt.from(l,pt.Internal)}}}}function CE(t){const e=L_(t.next,t.interceptors),[n,i,s]=P_(t),r=Object.assign(Object.assign({},t.req),{message:C_(t.req.method.input,t.req.message),signal:n});return e(r).then(o=>(s(),o),i)}function LE(t){const[e,n,i]=P_(t);let s=!1;const r=new Promise(l=>{e.aborted?l():e.addEventListener("abort",()=>l())});r.then(()=>{var l,c;const u=t.req.message[Symbol.asyncIterator]();if(!s){const f=Mt.from(to(e),pt.Canceled);(l=u.throw)===null||l===void 0||l.call(u,f).catch(()=>{})}(c=u.return)===null||c===void 0||c.call(u).catch(()=>{})});const o=L_(async l=>{const c=await t.next(l),u=c.message[Symbol.asyncIterator]();return r.then(()=>{var f;return(f=u.return)===null||f===void 0?void 0:f.call(u).catch(()=>{})}),Object.assign(Object.assign({},c),{message:{[Symbol.asyncIterator]:()=>({next:async()=>{const f=e.aborted?void 0:await Promise.race([u.next(),r]);return f!==void 0?f:s?{done:!0,value:void 0}:n(to(e))}})}})},t.interceptors),a=Object.assign(Object.assign({},t.req),{message:NE(t.req.method.input,t.req.message),signal:e});return o(a).then(l=>{const c=l.message[Symbol.asyncIterator](),u=r.then(async()=>{try{for(;(await c.next()).done!==!0;);}catch{}});return Object.assign(Object.assign({},l),{message:{[Symbol.asyncIterator]:()=>({async next(){if(e.aborted)return await u,s?{done:!0,value:void 0}:n(to(e));try{const f=await c.next();return f.done===!0&&(s=!0,i()),f}catch(f){return n(f)}},async return(f){return e.aborted||(s=!0,i()),await u,{done:!0,value:f}},async throw(f){if(s)throw Mt.from(f);try{return await n(f)}finally{await u}}})}})},n)}function P_(t){const{signal:e,cleanup:n}=vE(t.timeoutMs),i=_E(t.signal,e);return[i.signal,function(r){const o=i.signal.aborted?Mt.from(to(i.signal),pt.Canceled):Mt.from(r);return i.abort(o),n(),Promise.reject(o)},function(){n(),i.abort()}]}function PE(){try{new Headers}catch{throw new Error("connect-web requires the fetch API. Are you running on an old version of Node.js?")}}function $h(t,e){const n=I_(t);if(n)throw e.forEach((i,s)=>{n.metadata.append(s,i)}),n;if(!e.has(hr)&&!t.has(hr))throw new Mt("protocol error: missing status",pt.Internal)}function Kh(t,e,n,i){var s,r;const o=new Headers(n??{});o.set(bE,t?ME:TE),o.set(EE,"1");const a=(r=(s=o.get(yE))!==null&&s!==void 0?s:o.get(zh))!==null&&r!==void 0?r:"connect-es/2.3.0";return o.set(zh,a),e!==void 0&&o.set(SE,`${e}m`),o}function DE(t){switch(t){case 400:return pt.Internal;case 401:return pt.Unauthenticated;case 403:return pt.PermissionDenied;case 404:return pt.Unimplemented;case 429:return pt.Unavailable;case 502:return pt.Unavailable;case 503:return pt.Unavailable;case 504:return pt.Unavailable;default:return pt.Unknown}}function Zh(t,e){var n;if(t>=200&&t<300)return{foundStatus:e.has(hr),headerError:I_(e)};throw new Mt(decodeURIComponent((n=e.get(N_))!==null&&n!==void 0?n:`HTTP ${t}`),DE(t),e)}var ws=function(t){return this instanceof ws?(this.v=t,this):new ws(t)},UE=function(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i=n.apply(t,e||[]),s,r=[];return s=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",o),s[Symbol.asyncIterator]=function(){return this},s;function o(d){return function(m){return Promise.resolve(m).then(d,f)}}function a(d,m){i[d]&&(s[d]=function(v){return new Promise(function(g,p){r.push([d,v,g,p])>1||l(d,v)})},m&&(s[d]=m(s[d])))}function l(d,m){try{c(i[d](m))}catch(v){h(r[0][3],v)}}function c(d){d.value instanceof ws?Promise.resolve(d.value.v).then(u,f):h(r[0][2],d)}function u(d){l("next",d)}function f(d){l("throw",d)}function h(d,m){d(m),r.shift(),r.length&&l(r[0][0],r[0][1])}};const Jh={redirect:"error"};function OE(t){var e;PE();const n=(e=t.useBinaryFormat)!==null&&e!==void 0?e:!0;return{async unary(i,s,r,o,a,l){const{serialize:c,parse:u}=Wh(i,n,t.jsonOptions,t.binaryOptions);return r=r===void 0?t.defaultTimeoutMs:r<=0?void 0:r,await CE({interceptors:t.interceptors,signal:s,timeoutMs:r,req:{stream:!1,service:i.parent,method:i,requestMethod:"POST",url:Hh(t.baseUrl,i),header:Kh(n,r,o),contextValues:l??Gh(),message:a},next:async f=>{var h;const m=await((h=t.fetch)!==null&&h!==void 0?h:globalThis.fetch)(f.url,Object.assign(Object.assign({},Jh),{method:f.requestMethod,headers:f.header,signal:f.signal,body:Vh(0,c(f.message))})),{headerError:v}=Zh(m.status,m.headers);if(!m.body)throw v!==void 0?v:"missing response body";const g=Bh(m.body).getReader();let p,b;for(;;){const A=await g.read();if(A.done)break;const{flags:y,data:w}=A.value;if((y&Fh)===Fh)throw new Mt("protocol error: received unsupported compressed output",pt.Internal);if(y===jl){if(p!==void 0)throw"extra trailer";p=kh(w);continue}if(b!==void 0)throw new Mt("extra message",pt.Unimplemented);b=u(w)}if(p===void 0)throw v!==void 0?v:new Mt("missing trailer",m.headers.has(hr)?pt.Unimplemented:pt.Unknown);if($h(p,m.headers),b===void 0)throw new Mt("missing message",p.has(hr)?pt.Unimplemented:pt.Unknown);return{stream:!1,service:i.parent,method:i,header:m.headers,message:b,trailer:p}}})},async stream(i,s,r,o,a,l){const{serialize:c,parse:u}=Wh(i,n,t.jsonOptions,t.binaryOptions);function f(d,m,v,g,p){return UE(this,arguments,function*(){const A=Bh(d).getReader();if(m){if(!(yield ws(A.read())).done)throw"extra data for trailers-only";return yield ws(void 0)}let y=!1;for(;;){const w=yield ws(A.read());if(w.done)break;const{flags:M,data:_}=w.value;if((M&jl)===jl){if(y)throw"extra trailer";y=!0;const x=kh(_);$h(x,g),x.forEach((I,N)=>v.set(N,I));continue}if(y)throw"extra message";yield yield ws(u(_))}if(!y)throw"missing trailer"})}async function h(d){if(i.methodKind!="server_streaming")throw"The fetch API does not support streaming request bodies";const m=await d[Symbol.asyncIterator]().next();if(m.done==!0)throw"missing request message";return Vh(0,c(m.value))}return r=r===void 0?t.defaultTimeoutMs:r<=0?void 0:r,LE({interceptors:t.interceptors,signal:s,timeoutMs:r,req:{stream:!0,service:i.parent,method:i,requestMethod:"POST",url:Hh(t.baseUrl,i),header:Kh(n,r,o),contextValues:l??Gh(),message:a},next:async d=>{var m;const g=await((m=t.fetch)!==null&&m!==void 0?m:globalThis.fetch)(d.url,Object.assign(Object.assign({},Jh),{method:d.requestMethod,headers:d.header,signal:d.signal,body:await h(d.message)})),{foundStatus:p,headerError:b}=Zh(g.status,g.headers);if(b!=null)throw b;if(!g.body)throw"missing response body";const A=new Headers;return Object.assign(Object.assign({},d),{header:g.headers,trailer:A,message:f(g.body,p,A,g.headers,d.signal)})}})}}}const Rl=xl("ChViYXNzX2NvbnRyb2xsZXIucHJvdG8SEmJhc3MuY29udHJvbGxlci52MSJKCgZQb3NlNkQSCQoBeBgBIAEoARIJCgF5GAIgASgBEgkKAXoYAyABKAESCQoBYRgEIAEoARIJCgFiGAUgASgBEgkKAWMYBiABKAEiGgoISm9pbnRzNkQSDgoGdmFsdWVzGAEgAygBIoEEChJSb2JvdFN0YXRlU25hcHNob3QSKwoHb3BfbW9kZRgBIAEoDjIaLmJhc3MuY29udHJvbGxlci52MS5PcE1vZGUSEQoJZHJpdmVzX29uGAIgASgIEhYKDmVtZXJnZW5jeV9zdG9wGAMgASgIEhYKDnNwZWVkX292ZXJyaWRlGAQgASgNEj8KEWludGVycHJldGVyX3N0YXRlGAUgASgOMiQuYmFzcy5jb250cm9sbGVyLnYxLkludGVycHJldGVyU3RhdGUSNQoMbW90aW9uX3N0YXRlGAYgASgOMh8uYmFzcy5jb250cm9sbGVyLnYxLk1vdGlvblN0YXRlEhYKDmFjdGl2ZV9wcm9ncmFtGAcgASgJEhQKDGN1cnJlbnRfbGluZRgIIAEoDRIUCgxqb2ludF9hY3R1YWwYCSADKAESFAoMam9pbnRfdG9ycXVlGAogAygBEi8KC2NhcnRfYWN0dWFsGAsgASgLMhouYmFzcy5jb250cm9sbGVyLnYxLlBvc2U2RBITCgtkaWdpdGFsX291dBgMIAMoCBIUCgxwbGFudF9vbmxpbmUYDSABKAgSDgoGcnR0X21zGA4gASgBEhMKC2N5Y2xlX2NvdW50GA8gASgEEhAKCHNpbV90aWNrGBAgASgEEhYKDnN0YXR1c19tZXNzYWdlGBEgASgJIisKDlNpbXBsZVJlc3BvbnNlEgoKAm9rGAEgASgIEg0KBWVycm9yGAIgASgJIhEKD0dldFN0YXRlUmVxdWVzdCIwChlTdWJzY3JpYmVUZWxlbWV0cnlSZXF1ZXN0EhMKC2ludGVydmFsX21zGAEgASgNIjoKDlNldE1vZGVSZXF1ZXN0EigKBG1vZGUYASABKA4yGi5iYXNzLmNvbnRyb2xsZXIudjEuT3BNb2RlIlYKD1NldE1vZGVSZXNwb25zZRIKCgJvaxgBIAEoCBIoCgRtb2RlGAIgASgOMhouYmFzcy5jb250cm9sbGVyLnYxLk9wTW9kZRINCgVlcnJvchgDIAEoCSIqChVTZXREcml2ZXNQb3dlclJlcXVlc3QSEQoJZHJpdmVzX29uGAEgASgIIkYKFlNldERyaXZlc1Bvd2VyUmVzcG9uc2USCgoCb2sYASABKAgSEQoJZHJpdmVzX29uGAIgASgIEg0KBWVycm9yGAMgASgJIjEKF1NldEVtZXJnZW5jeVN0b3BSZXF1ZXN0EhYKDmVtZXJnZW5jeV9zdG9wGAEgASgIIk0KGFNldEVtZXJnZW5jeVN0b3BSZXNwb25zZRIKCgJvaxgBIAEoCBIWCg5lbWVyZ2VuY3lfc3RvcBgCIAEoCBINCgVlcnJvchgDIAEoCSIxChdTZXRTcGVlZE92ZXJyaWRlUmVxdWVzdBIWCg5zcGVlZF9vdmVycmlkZRgBIAEoDSJNChhTZXRTcGVlZE92ZXJyaWRlUmVzcG9uc2USCgoCb2sYASABKAgSFgoOc3BlZWRfb3ZlcnJpZGUYAiABKA0SDQoFZXJyb3IYAyABKAkiMgoUU2V0RGlnaXRhbE91dFJlcXVlc3QSCwoDcGluGAEgASgNEg0KBXN0YXRlGAIgASgIIkcKFVNldERpZ2l0YWxPdXRSZXNwb25zZRIKCgJvaxgBIAEoCBITCgtkaWdpdGFsX291dBgCIAMoCBINCgVlcnJvchgDIAEoCSJ3CgpKb2dDb21tYW5kEjUKDGNvb3JkX3N5c3RlbRgBIAEoDjIfLmJhc3MuY29udHJvbGxlci52MS5Db29yZFN5c3RlbRIMCgRheGlzGAIgASgJEhEKCWRpcmVjdGlvbhgDIAEoARIRCglzdGVwX3NpemUYBCABKAEiEAoOSm9nU3RvcFJlcXVlc3QiFQoTTGlzdFByb2dyYW1zUmVxdWVzdCIoChRMaXN0UHJvZ3JhbXNSZXNwb25zZRIQCghwcm9ncmFtcxgBIAMoCSIhChFHZXRQcm9ncmFtUmVxdWVzdBIMCgRuYW1lGAEgASgJIksKEkdldFByb2dyYW1SZXNwb25zZRIKCgJvaxgBIAEoCBIMCgRuYW1lGAIgASgJEgwKBGNvZGUYAyABKAkSDQoFZXJyb3IYBCABKAkirQEKEUNvbXBpbGVEaWFnbm9zdGljEjgKCHNldmVyaXR5GAEgASgOMiYuYmFzcy5jb250cm9sbGVyLnYxLkRpYWdub3N0aWNTZXZlcml0eRIvCgVzdGFnZRgCIAEoDjIgLmJhc3MuY29udHJvbGxlci52MS5Db21waWxlU3RhZ2USDAoEbGluZRgDIAEoDRIOCgZjb2x1bW4YBCABKA0SDwoHbWVzc2FnZRgFIAEoCSJMCg1Jckluc3RydWN0aW9uEgsKA3NlcRgBIAEoDRIMCgRsaW5lGAIgASgNEg8KB3N1bW1hcnkYAyABKAkSDwoHb3BfanNvbhgEIAEoCSKSAQoHSXJTdGF0cxIaChJ0b3RhbF9pbnN0cnVjdGlvbnMYASABKA0SFAoMbW90aW9uX2NvdW50GAIgASgNEhAKCGlvX2NvdW50GAMgASgNEhIKCndhaXRfY291bnQYBCABKA0SGQoRc3RhdGljX2lrX2NoZWNrZWQYBSABKA0SFAoMc3ltYm9sX2NvdW50GAYgASgNIqABCg5Sb2JvdFByb2dyYW1JUhIUCgxwcm9ncmFtX25hbWUYASABKAkSEwoLc291cmNlX2hhc2gYAiABKAkSNwoMaW5zdHJ1Y3Rpb25zGAMgAygLMiEuYmFzcy5jb250cm9sbGVyLnYxLklySW5zdHJ1Y3Rpb24SKgoFc3RhdHMYBCABKAsyGy5iYXNzLmNvbnRyb2xsZXIudjEuSXJTdGF0cyKyAQoNQ29tcGlsZVJlcG9ydBIKCgJvaxgBIAEoCBIUCgxwcm9ncmFtX25hbWUYAiABKAkSEwoLc291cmNlX2hhc2gYAyABKAkSOgoLZGlhZ25vc3RpY3MYBCADKAsyJS5iYXNzLmNvbnRyb2xsZXIudjEuQ29tcGlsZURpYWdub3N0aWMSLgoCaXIYBSABKAsyIi5iYXNzLmNvbnRyb2xsZXIudjEuUm9ib3RQcm9ncmFtSVIiMAoSU2F2ZVByb2dyYW1SZXF1ZXN0EgwKBG5hbWUYASABKAkSDAoEY29kZRgCIAEoCSJ/ChNTYXZlUHJvZ3JhbVJlc3BvbnNlEgoKAm9rGAEgASgIEhIKCmVycm9yX2xpbmUYAiABKA0SFQoNZXJyb3JfbWVzc2FnZRgDIAEoCRIxCgZyZXBvcnQYBCABKAsyIS5iYXNzLmNvbnRyb2xsZXIudjEuQ29tcGlsZVJlcG9ydCJBChVDb21waWxlUHJvZ3JhbVJlcXVlc3QSDAoEbmFtZRgBIAEoCRIRCgRjb2RlGAIgASgJSACIAQFCBwoFX2NvZGUiYwoSQ29udHJvbFRhc2tSZXF1ZXN0EjcKB2NvbW1hbmQYASABKA4yJi5iYXNzLmNvbnRyb2xsZXIudjEuVGFza0NvbnRyb2xDb21tYW5kEhQKDHByb2dyYW1fbmFtZRgCIAEoCSLEAQoITG9nRW50cnkSCgoCaWQYASABKAQSFAoMdGltZXN0YW1wX21zGAIgASgEEhUKDXRpbWVzdGFtcF9pc28YAyABKAkSKwoFbGV2ZWwYBCABKA4yHC5iYXNzLmNvbnRyb2xsZXIudjEuTG9nTGV2ZWwSMQoIY2F0ZWdvcnkYBSABKA4yHy5iYXNzLmNvbnRyb2xsZXIudjEuTG9nQ2F0ZWdvcnkSDgoGc291cmNlGAYgASgJEg8KB21lc3NhZ2UYByABKAkivwEKEFF1ZXJ5TG9nc1JlcXVlc3QSKwoFbGV2ZWwYASABKA4yHC5iYXNzLmNvbnRyb2xsZXIudjEuTG9nTGV2ZWwSMQoIY2F0ZWdvcnkYAiABKA4yHy5iYXNzLmNvbnRyb2xsZXIudjEuTG9nQ2F0ZWdvcnkSCQoBcRgDIAEoCRIVCghhZnRlcl9pZBgEIAEoBEgAiAEBEhIKBWxpbWl0GAUgASgNSAGIAQFCCwoJX2FmdGVyX2lkQggKBl9saW1pdCJ/ChFRdWVyeUxvZ3NSZXNwb25zZRIKCgJvaxgBIAEoCBIRCglsYXRlc3RfaWQYAiABKAQSDQoFdG90YWwYAyABKA0SLQoHZW50cmllcxgEIAMoCzIcLmJhc3MuY29udHJvbGxlci52MS5Mb2dFbnRyeRINCgVlcnJvchgFIAEoCSKzAQoRRXhwb3J0TG9nc1JlcXVlc3QSKwoFbGV2ZWwYASABKA4yHC5iYXNzLmNvbnRyb2xsZXIudjEuTG9nTGV2ZWwSMQoIY2F0ZWdvcnkYAiABKA4yHy5iYXNzLmNvbnRyb2xsZXIudjEuTG9nQ2F0ZWdvcnkSCQoBcRgDIAEoCRIzCgZmb3JtYXQYBCABKA4yIy5iYXNzLmNvbnRyb2xsZXIudjEuTG9nRXhwb3J0Rm9ybWF0ImgKEkV4cG9ydExvZ3NSZXNwb25zZRIKCgJvaxgBIAEoCBIQCghmaWxlbmFtZRgCIAEoCRIUCgxjb250ZW50X3R5cGUYAyABKAkSDwoHY29udGVudBgEIAEoCRINCgVlcnJvchgFIAEoCSISChBDbGVhckxvZ3NSZXF1ZXN0IoUECg9Nb3Rpb25UZWxlbWV0cnkSFgoOZHJpdmVzX2VuYWJsZWQYASABKAgSFAoMZXN0b3BfYWN0aXZlGAIgASgIEhYKDnNwZWVkX292ZXJyaWRlGAMgASgNEjUKDG1vdGlvbl9zdGF0ZRgEIAEoDjIfLmJhc3MuY29udHJvbGxlci52MS5Nb3Rpb25TdGF0ZRIOCgZwYXVzZWQYBSABKAgSHQoQYWN0aXZlX21vdGlvbl9pZBgGIAEoBEgAiAEBEhQKDGpvaW50X2FjdHVhbBgHIAMoARIRCglqb2ludF9jbWQYCCADKAESFgoOam9pbnRfdmVsb2NpdHkYCSADKAESFAoMam9pbnRfdG9ycXVlGAogAygBEi8KC2NhcnRfYWN0dWFsGAsgASgLMhouYmFzcy5jb250cm9sbGVyLnYxLlBvc2U2RBITCgtkaWdpdGFsX291dBgMIAMoCBISCgpkaWdpdGFsX2luGA0gASgNEhQKDHBsYW50X29ubGluZRgOIAEoCBIaChJwbGFudF9mYXVsdF9hY3RpdmUYDyABKAgSFwoPbGFzdF9mYXVsdF9jb2RlGBAgASgNEg4KBnJ0dF9tcxgRIAEoARITCgtjeWNsZV9jb3VudBgSIAEoBBIQCghzaW1fdGljaxgTIAEoBEITChFfYWN0aXZlX21vdGlvbl9pZCK6AQoLTW90aW9uRXZlbnQSNwoKZXZlbnRfdHlwZRgBIAEoDjIjLmJhc3MuY29udHJvbGxlci52MS5Nb3Rpb25FdmVudFR5cGUSEQoJbW90aW9uX2lkGAIgASgEEg8KB21lc3NhZ2UYAyABKAkSEgoKZmF1bHRfY29kZRgEIAEoDRISCgp3YXNfbW92aW5nGAUgASgIEhQKDHBsYW50X29ubGluZRgGIAEoCBIQCghzaW1fdGljaxgHIAEoBCIbChlHZXRNb3Rpb25UZWxlbWV0cnlSZXF1ZXN0Ih4KHFN1YnNjcmliZU1vdGlvbkV2ZW50c1JlcXVlc3QiaQoMTW92ZUxSZXF1ZXN0EioKBnRhcmdldBgBIAEoCzIaLmJhc3MuY29udHJvbGxlci52MS5Qb3NlNkQSEAoIdmVsX21tX3MYAiABKAESGwoTd2FpdF9mb3JfY29tcGxldGlvbhgDIAEoCCKkAQoMTW92ZUpSZXF1ZXN0EioKBHBvc2UYASABKAsyGi5iYXNzLmNvbnRyb2xsZXIudjEuUG9zZTZESAASLgoGam9pbnRzGAIgASgLMhwuYmFzcy5jb250cm9sbGVyLnYxLkpvaW50czZESAASEQoJdmVsX2RlZ19zGAMgASgBEhsKE3dhaXRfZm9yX2NvbXBsZXRpb24YBCABKAhCCAoGdGFyZ2V0IjwKDE1vdmVSZXNwb25zZRIKCgJvaxgBIAEoCBIRCgltb3Rpb25faWQYAiABKAQSDQoFZXJyb3IYAyABKAkiKAoWU2V0TW90aW9uUGF1c2VkUmVxdWVzdBIOCgZwYXVzZWQYASABKAgiEwoRU3RvcE1vdGlvblJlcXVlc3QiEwoRQ2xlYXJGYXVsdFJlcXVlc3QqRwoGT3BNb2RlEhcKE09QX01PREVfVU5TUEVDSUZJRUQQABISCg5PUF9NT0RFX01BTlVBTBABEhAKDE9QX01PREVfQVVUTxACKukBChBJbnRlcnByZXRlclN0YXRlEiEKHUlOVEVSUFJFVEVSX1NUQVRFX1VOU1BFQ0lGSUVEEAASGgoWSU5URVJQUkVURVJfU1RBVEVfSURMRRABEhsKF0lOVEVSUFJFVEVSX1NUQVRFX1JFQURZEAISHQoZSU5URVJQUkVURVJfU1RBVEVfUlVOTklORxADEhwKGElOVEVSUFJFVEVSX1NUQVRFX1BBVVNFRBAEEh8KG0lOVEVSUFJFVEVSX1NUQVRFX0NPTVBMRVRFRBAFEhsKF0lOVEVSUFJFVEVSX1NUQVRFX0VSUk9SEAYqiAEKC01vdGlvblN0YXRlEhwKGE1PVElPTl9TVEFURV9VTlNQRUNJRklFRBAAEhUKEU1PVElPTl9TVEFURV9JRExFEAESFgoSTU9USU9OX1NUQVRFX01PVkVMEAISFgoSTU9USU9OX1NUQVRFX01PVkVKEAMSFAoQTU9USU9OX1NUQVRFX0pPRxAEKl8KC0Nvb3JkU3lzdGVtEhwKGENPT1JEX1NZU1RFTV9VTlNQRUNJRklFRBAAEhoKFkNPT1JEX1NZU1RFTV9DQVJURVNJQU4QARIWChJDT09SRF9TWVNURU1fSk9JTlQQAiq3AQoSVGFza0NvbnRyb2xDb21tYW5kEiQKIFRBU0tfQ09OVFJPTF9DT01NQU5EX1VOU1BFQ0lGSUVEEAASHAoYVEFTS19DT05UUk9MX0NPTU1BTkRfUlVOEAESHQoZVEFTS19DT05UUk9MX0NPTU1BTkRfU1RFUBACEh4KGlRBU0tfQ09OVFJPTF9DT01NQU5EX1BBVVNFEAMSHgoaVEFTS19DT05UUk9MX0NPTU1BTkRfUkVTRVQQBCqXAQoSRGlhZ25vc3RpY1NldmVyaXR5EiMKH0RJQUdOT1NUSUNfU0VWRVJJVFlfVU5TUEVDSUZJRUQQABIcChhESUFHTk9TVElDX1NFVkVSSVRZX0lORk8QARIfChtESUFHTk9TVElDX1NFVkVSSVRZX1dBUk5JTkcQAhIdChlESUFHTk9TVElDX1NFVkVSSVRZX0VSUk9SEAMqmgEKDENvbXBpbGVTdGFnZRIdChlDT01QSUxFX1NUQUdFX1VOU1BFQ0lGSUVEEAASGAoUQ09NUElMRV9TVEFHRV9TWU5UQVgQARIaChZDT01QSUxFX1NUQUdFX1NFTUFOVElDEAISGgoWQ09NUElMRV9TVEFHRV9MT1dFUklORxADEhkKFUNPTVBJTEVfU1RBR0VfQ09ERUdFThAEKmIKCExvZ0xldmVsEhkKFUxPR19MRVZFTF9VTlNQRUNJRklFRBAAEhIKDkxPR19MRVZFTF9JTkZPEAESEgoOTE9HX0xFVkVMX1dBUk4QAhITCg9MT0dfTEVWRUxfRVJST1IQAyrFAQoLTG9nQ2F0ZWdvcnkSHAoYTE9HX0NBVEVHT1JZX1VOU1BFQ0lGSUVEEAASFwoTTE9HX0NBVEVHT1JZX1NZU1RFTRABEhcKE0xPR19DQVRFR09SWV9TQUZFVFkQAhIXChNMT0dfQ0FURUdPUllfTU9USU9OEAMSGQoVTE9HX0NBVEVHT1JZX0ZJRUxEQlVTEAQSGQoVTE9HX0NBVEVHT1JZX0NPTVBJTEVSEAUSFwoTTE9HX0NBVEVHT1JZX1NDUklQVBAGKm0KD0xvZ0V4cG9ydEZvcm1hdBIhCh1MT0dfRVhQT1JUX0ZPUk1BVF9VTlNQRUNJRklFRBAAEhsKF0xPR19FWFBPUlRfRk9STUFUX0pTT05MEAESGgoWTE9HX0VYUE9SVF9GT1JNQVRfVEVYVBACKuoBCg9Nb3Rpb25FdmVudFR5cGUSIQodTU9USU9OX0VWRU5UX1RZUEVfVU5TUEVDSUZJRUQQABIfChtNT1RJT05fRVZFTlRfVFlQRV9DT01QTEVURUQQARIcChhNT1RJT05fRVZFTlRfVFlQRV9GQUlMRUQQAhIkCiBNT1RJT05fRVZFTlRfVFlQRV9TQUZFVFlfVFJJUFBFRBADEioKJk1PVElPTl9FVkVOVF9UWVBFX1BMQU5UX09OTElORV9DSEFOR0VEEAQSIwofTU9USU9OX0VWRU5UX1RZUEVfRkFVTFRfQ0xFQVJFRBAFMs0HChFDb250cm9sbGVyU2VydmljZRJXCghHZXRTdGF0ZRIjLmJhc3MuY29udHJvbGxlci52MS5HZXRTdGF0ZVJlcXVlc3QaJi5iYXNzLmNvbnRyb2xsZXIudjEuUm9ib3RTdGF0ZVNuYXBzaG90Em0KElN1YnNjcmliZVRlbGVtZXRyeRItLmJhc3MuY29udHJvbGxlci52MS5TdWJzY3JpYmVUZWxlbWV0cnlSZXF1ZXN0GiYuYmFzcy5jb250cm9sbGVyLnYxLlJvYm90U3RhdGVTbmFwc2hvdDABElIKB1NldE1vZGUSIi5iYXNzLmNvbnRyb2xsZXIudjEuU2V0TW9kZVJlcXVlc3QaIy5iYXNzLmNvbnRyb2xsZXIudjEuU2V0TW9kZVJlc3BvbnNlEmcKDlNldERyaXZlc1Bvd2VyEikuYmFzcy5jb250cm9sbGVyLnYxLlNldERyaXZlc1Bvd2VyUmVxdWVzdBoqLmJhc3MuY29udHJvbGxlci52MS5TZXREcml2ZXNQb3dlclJlc3BvbnNlEm0KEFNldEVtZXJnZW5jeVN0b3ASKy5iYXNzLmNvbnRyb2xsZXIudjEuU2V0RW1lcmdlbmN5U3RvcFJlcXVlc3QaLC5iYXNzLmNvbnRyb2xsZXIudjEuU2V0RW1lcmdlbmN5U3RvcFJlc3BvbnNlEm0KEFNldFNwZWVkT3ZlcnJpZGUSKy5iYXNzLmNvbnRyb2xsZXIudjEuU2V0U3BlZWRPdmVycmlkZVJlcXVlc3QaLC5iYXNzLmNvbnRyb2xsZXIudjEuU2V0U3BlZWRPdmVycmlkZVJlc3BvbnNlEmQKDVNldERpZ2l0YWxPdXQSKC5iYXNzLmNvbnRyb2xsZXIudjEuU2V0RGlnaXRhbE91dFJlcXVlc3QaKS5iYXNzLmNvbnRyb2xsZXIudjEuU2V0RGlnaXRhbE91dFJlc3BvbnNlEk0KB0pvZ1N0ZXASHi5iYXNzLmNvbnRyb2xsZXIudjEuSm9nQ29tbWFuZBoiLmJhc3MuY29udHJvbGxlci52MS5TaW1wbGVSZXNwb25zZRJNCgdKb2dIb2xkEh4uYmFzcy5jb250cm9sbGVyLnYxLkpvZ0NvbW1hbmQaIi5iYXNzLmNvbnRyb2xsZXIudjEuU2ltcGxlUmVzcG9uc2USUQoHSm9nU3RvcBIiLmJhc3MuY29udHJvbGxlci52MS5Kb2dTdG9wUmVxdWVzdBoiLmJhc3MuY29udHJvbGxlci52MS5TaW1wbGVSZXNwb25zZTLoAwoLVGFza1NlcnZpY2USYQoMTGlzdFByb2dyYW1zEicuYmFzcy5jb250cm9sbGVyLnYxLkxpc3RQcm9ncmFtc1JlcXVlc3QaKC5iYXNzLmNvbnRyb2xsZXIudjEuTGlzdFByb2dyYW1zUmVzcG9uc2USWwoKR2V0UHJvZ3JhbRIlLmJhc3MuY29udHJvbGxlci52MS5HZXRQcm9ncmFtUmVxdWVzdBomLmJhc3MuY29udHJvbGxlci52MS5HZXRQcm9ncmFtUmVzcG9uc2USXgoLU2F2ZVByb2dyYW0SJi5iYXNzLmNvbnRyb2xsZXIudjEuU2F2ZVByb2dyYW1SZXF1ZXN0GicuYmFzcy5jb250cm9sbGVyLnYxLlNhdmVQcm9ncmFtUmVzcG9uc2USXgoOQ29tcGlsZVByb2dyYW0SKS5iYXNzLmNvbnRyb2xsZXIudjEuQ29tcGlsZVByb2dyYW1SZXF1ZXN0GiEuYmFzcy5jb250cm9sbGVyLnYxLkNvbXBpbGVSZXBvcnQSWQoLQ29udHJvbFRhc2sSJi5iYXNzLmNvbnRyb2xsZXIudjEuQ29udHJvbFRhc2tSZXF1ZXN0GiIuYmFzcy5jb250cm9sbGVyLnYxLlNpbXBsZVJlc3BvbnNlMpoCCgpMb2dTZXJ2aWNlElgKCVF1ZXJ5TG9ncxIkLmJhc3MuY29udHJvbGxlci52MS5RdWVyeUxvZ3NSZXF1ZXN0GiUuYmFzcy5jb250cm9sbGVyLnYxLlF1ZXJ5TG9nc1Jlc3BvbnNlElsKCkV4cG9ydExvZ3MSJS5iYXNzLmNvbnRyb2xsZXIudjEuRXhwb3J0TG9nc1JlcXVlc3QaJi5iYXNzLmNvbnRyb2xsZXIudjEuRXhwb3J0TG9nc1Jlc3BvbnNlElUKCUNsZWFyTG9ncxIkLmJhc3MuY29udHJvbGxlci52MS5DbGVhckxvZ3NSZXF1ZXN0GiIuYmFzcy5jb250cm9sbGVyLnYxLlNpbXBsZVJlc3BvbnNlMvcHCg1Nb3Rpb25TZXJ2aWNlEmgKEkdldE1vdGlvblRlbGVtZXRyeRItLmJhc3MuY29udHJvbGxlci52MS5HZXRNb3Rpb25UZWxlbWV0cnlSZXF1ZXN0GiMuYmFzcy5jb250cm9sbGVyLnYxLk1vdGlvblRlbGVtZXRyeRJwChhTdWJzY3JpYmVNb3Rpb25UZWxlbWV0cnkSLS5iYXNzLmNvbnRyb2xsZXIudjEuU3Vic2NyaWJlVGVsZW1ldHJ5UmVxdWVzdBojLmJhc3MuY29udHJvbGxlci52MS5Nb3Rpb25UZWxlbWV0cnkwARJsChVTdWJzY3JpYmVNb3Rpb25FdmVudHMSMC5iYXNzLmNvbnRyb2xsZXIudjEuU3Vic2NyaWJlTW90aW9uRXZlbnRzUmVxdWVzdBofLmJhc3MuY29udHJvbGxlci52MS5Nb3Rpb25FdmVudDABEksKBU1vdmVMEiAuYmFzcy5jb250cm9sbGVyLnYxLk1vdmVMUmVxdWVzdBogLmJhc3MuY29udHJvbGxlci52MS5Nb3ZlUmVzcG9uc2USSwoFTW92ZUoSIC5iYXNzLmNvbnRyb2xsZXIudjEuTW92ZUpSZXF1ZXN0GiAuYmFzcy5jb250cm9sbGVyLnYxLk1vdmVSZXNwb25zZRJLCgdKb2dTdGVwEh4uYmFzcy5jb250cm9sbGVyLnYxLkpvZ0NvbW1hbmQaIC5iYXNzLmNvbnRyb2xsZXIudjEuTW92ZVJlc3BvbnNlEk0KB0pvZ0hvbGQSHi5iYXNzLmNvbnRyb2xsZXIudjEuSm9nQ29tbWFuZBoiLmJhc3MuY29udHJvbGxlci52MS5TaW1wbGVSZXNwb25zZRJRCgdKb2dTdG9wEiIuYmFzcy5jb250cm9sbGVyLnYxLkpvZ1N0b3BSZXF1ZXN0GiIuYmFzcy5jb250cm9sbGVyLnYxLlNpbXBsZVJlc3BvbnNlEmEKD1NldE1vdGlvblBhdXNlZBIqLmJhc3MuY29udHJvbGxlci52MS5TZXRNb3Rpb25QYXVzZWRSZXF1ZXN0GiIuYmFzcy5jb250cm9sbGVyLnYxLlNpbXBsZVJlc3BvbnNlElcKClN0b3BNb3Rpb24SJS5iYXNzLmNvbnRyb2xsZXIudjEuU3RvcE1vdGlvblJlcXVlc3QaIi5iYXNzLmNvbnRyb2xsZXIudjEuU2ltcGxlUmVzcG9uc2USVwoKQ2xlYXJGYXVsdBIlLmJhc3MuY29udHJvbGxlci52MS5DbGVhckZhdWx0UmVxdWVzdBoiLmJhc3MuY29udHJvbGxlci52MS5TaW1wbGVSZXNwb25zZWIGcHJvdG8z");var ja=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.MANUAL=1]="MANUAL",t[t.AUTO=2]="AUTO",t))(ja||{}),js=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.IDLE=1]="IDLE",t[t.READY=2]="READY",t[t.RUNNING=3]="RUNNING",t[t.PAUSED=4]="PAUSED",t[t.COMPLETED=5]="COMPLETED",t[t.ERROR=6]="ERROR",t))(js||{}),La=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.IDLE=1]="IDLE",t[t.MOVEL=2]="MOVEL",t[t.MOVEJ=3]="MOVEJ",t[t.JOG=4]="JOG",t))(La||{}),tu=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.CARTESIAN=1]="CARTESIAN",t[t.JOINT=2]="JOINT",t))(tu||{}),kr=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.RUN=1]="RUN",t[t.STEP=2]="STEP",t[t.PAUSE=3]="PAUSE",t[t.RESET=4]="RESET",t))(kr||{}),nu=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.INFO=1]="INFO",t[t.WARNING=2]="WARNING",t[t.ERROR=3]="ERROR",t))(nu||{}),Pa=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.SYNTAX=1]="SYNTAX",t[t.SEMANTIC=2]="SEMANTIC",t[t.LOWERING=3]="LOWERING",t[t.CODEGEN=4]="CODEGEN",t))(Pa||{}),Rs=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.INFO=1]="INFO",t[t.WARN=2]="WARN",t[t.ERROR=3]="ERROR",t))(Rs||{}),wn=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.SYSTEM=1]="SYSTEM",t[t.SAFETY=2]="SAFETY",t[t.MOTION=3]="MOTION",t[t.FIELDBUS=4]="FIELDBUS",t[t.COMPILER=5]="COMPILER",t[t.SCRIPT=6]="SCRIPT",t))(wn||{}),iu=(t=>(t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.JSONL=1]="JSONL",t[t.TEXT=2]="TEXT",t))(iu||{});const FE=wl(Rl,0),BE=wl(Rl,1),VE=wl(Rl,2),GE=wl(Rl,3);var hm;const kE=typeof window<"u"&&((hm=window.location)!=null&&hm.origin)?window.location.origin:"/",Nl=OE({baseUrl:kE,useBinaryFormat:!0}),ni=Al(FE,Nl),Cr=Al(BE,Nl),Ql=Al(VE,Nl),D_=Al(GE,Nl);function U_(t){return t===ja.AUTO?"AUTO":"MANUAL"}function zE(t){return t==="AUTO"?ja.AUTO:ja.MANUAL}function HE(t){switch(t){case js.READY:return"READY";case js.RUNNING:return"RUNNING";case js.PAUSED:return"PAUSED";case js.COMPLETED:return"COMPLETED";case js.ERROR:return"ERROR";default:return"IDLE"}}function O_(t){switch(t){case La.MOVEL:return"MOVEL";case La.MOVEJ:return"MOVEJ";case La.JOG:return"JOG";default:return"IDLE"}}function er(t){return[t[0]??0,t[1]??0,t[2]??0,t[3]??0,t[4]??0,t[5]??0]}function Ff(t){return[!!t[0],!!t[1],!!t[2],!!t[3],!!t[4],!!t[5],!!t[6],!!t[7]]}function F_(t){const e=t.cartActual;return{op_mode:U_(t.opMode),drives_on:t.drivesOn,emergency_stop:t.emergencyStop,speed_override:t.speedOverride,interpreter_state:HE(t.interpreterState),motion_state:O_(t.motionState),active_program:t.activeProgram,current_line:t.currentLine,joint_actual:er(t.jointActual),joint_torque:er(t.jointTorque),cart_actual:{x:(e==null?void 0:e.x)??0,y:(e==null?void 0:e.y)??0,z:(e==null?void 0:e.z)??0,a:(e==null?void 0:e.a)??0,b:(e==null?void 0:e.b)??0,c:(e==null?void 0:e.c)??0},digital_out:Ff(t.digitalOut),plant_online:t.plantOnline,rtt_ms:t.rttMs,cycle_count:Number(t.cycleCount),sim_tick:Number(t.simTick),status_message:t.statusMessage}}function B_(t){const e=t.cartActual;return{drives_enabled:t.drivesEnabled,estop_active:t.estopActive,speed_override:t.speedOverride,motion_state:O_(t.motionState),paused:t.paused,active_motion_id:t.activeMotionId!==void 0?Number(t.activeMotionId):null,joint_actual:er(t.jointActual),joint_cmd:er(t.jointCmd),joint_velocity:er(t.jointVelocity),joint_torque:er(t.jointTorque),cart_actual:{x:(e==null?void 0:e.x)??0,y:(e==null?void 0:e.y)??0,z:(e==null?void 0:e.z)??0,a:(e==null?void 0:e.a)??0,b:(e==null?void 0:e.b)??0,c:(e==null?void 0:e.c)??0},digital_out:Ff(t.digitalOut),digital_in:t.digitalIn,plant_online:t.plantOnline,plant_fault_active:t.plantFaultActive,last_fault_code:t.lastFaultCode,rtt_ms:t.rttMs,cycle_count:Number(t.cycleCount),sim_tick:Number(t.simTick)}}function WE(t){switch(t){case nu.INFO:return"INFO";case nu.WARNING:return"WARNING";default:return"ERROR"}}function XE(t){switch(t){case Pa.SEMANTIC:return"SEMANTIC";case Pa.LOWERING:return"LOWERING";case Pa.CODEGEN:return"CODEGEN";default:return"SYNTAX"}}function qh(t){const e=t.diagnostics.map(i=>({severity:WE(i.severity),stage:XE(i.stage),line:i.line,column:i.column,message:i.message}));let n=null;if(t.ir){const i=t.ir.instructions.map(r=>{let o={};if(r.opJson)try{o=JSON.parse(r.opJson)}catch{o={}}return{seq:r.seq,line:r.line,op:o,summary:r.summary}}),s=t.ir.stats;n={program_name:t.ir.programName,source_hash:t.ir.sourceHash,instructions:i,stats:{total_instructions:(s==null?void 0:s.totalInstructions)??0,motion_count:(s==null?void 0:s.motionCount)??0,io_count:(s==null?void 0:s.ioCount)??0,wait_count:(s==null?void 0:s.waitCount)??0,static_ik_checked:(s==null?void 0:s.staticIkChecked)??0,symbol_count:(s==null?void 0:s.symbolCount)??0}}}return{ok:t.ok,program_name:t.programName,source_hash:t.sourceHash,diagnostics:e,ir:n}}function jh(t){switch((t||"").toUpperCase()){case"INFO":return Rs.INFO;case"WARN":return Rs.WARN;case"ERROR":return Rs.ERROR;default:return Rs.UNSPECIFIED}}function YE(t){switch(t){case Rs.WARN:return"WARN";case Rs.ERROR:return"ERROR";default:return"INFO"}}function Qh(t){switch((t||"").toUpperCase()){case"SYSTEM":return wn.SYSTEM;case"SAFETY":return wn.SAFETY;case"MOTION":return wn.MOTION;case"FIELDBUS":return wn.FIELDBUS;case"COMPILER":return wn.COMPILER;case"SCRIPT":return wn.SCRIPT;default:return wn.UNSPECIFIED}}function $E(t){switch(t){case wn.SAFETY:return"SAFETY";case wn.MOTION:return"MOTION";case wn.FIELDBUS:return"FIELDBUS";case wn.COMPILER:return"COMPILER";case wn.SCRIPT:return"SCRIPT";default:return"SYSTEM"}}function KE(t){return{id:Number(t.id),timestamp_ms:Number(t.timestampMs),timestamp_iso:t.timestampIso,level:YE(t.level),category:$E(t.category),source:t.source,message:t.message}}function ep(t){return{coordSystem:t.coord_system==="JOINT"?tu.JOINT:tu.CARTESIAN,axis:t.axis,direction:t.direction,stepSize:t.step_size}}function ZE(t){switch(t){case"RUN":return kr.RUN;case"STEP":return kr.STEP;case"PAUSE":return kr.PAUSE;case"RESET":return kr.RESET}}const Gt={async fetchState(){const t=await ni.getState({});return F_(t)},async setMode(t){const e=await ni.setMode({mode:zE(t)});return{ok:e.ok,mode:U_(e.mode)}},async setPower(t){const e=await ni.setDrivesPower({drivesOn:t});return{ok:e.ok,drives_on:e.drivesOn,error:e.error||void 0}},async setEstop(t){const e=await ni.setEmergencyStop({emergencyStop:t});return{ok:e.ok,emergency_stop:e.emergencyStop}},async setOverride(t){const e=await ni.setSpeedOverride({speedOverride:t});return{ok:e.ok,speed_override:e.speedOverride}},async setDout(t,e){const n=await ni.setDigitalOut({pin:t,state:e});return{ok:n.ok,digital_out:n.ok?Ff(n.digitalOut):void 0,error:n.error||void 0}},async fetchPrograms(){return(await Cr.listPrograms({})).programs},async fetchProgram(t){const e=await Cr.getProgram({name:t});if(!e.ok)throw new Error(e.error||`读取程序 ${t} 失败`);return{ok:e.ok,name:e.name,code:e.code}},async saveProgram(t,e){const n=await Cr.saveProgram({name:t,code:e}),i=n.report?qh(n.report):void 0;return n.ok?{ok:!0,report:i}:{ok:!1,line:n.errorLine||1,message:n.errorMessage||"编译保存失败",diagnostics:(i==null?void 0:i.diagnostics)??[],report:i}},async compileProgram(t,e){const n=await Cr.compileProgram(e!==void 0?{name:t,code:e}:{name:t});return qh(n)},async programControl(t,e){const n=await Cr.controlTask({command:ZE(t),programName:e??""});return{ok:n.ok,error:n.error||void 0}},async jogStep(t){const e=await ni.jogStep(ep(t));return{ok:e.ok,error:e.error||void 0}},async jogHold(t){const e=await ni.jogHold(ep(t));return{ok:e.ok,error:e.error||void 0}},async jogStop(){const t=await ni.jogStop({});return{ok:t.ok,error:t.error||void 0}},async fetchLogs(t){var n;const e=await Ql.queryLogs({level:jh(t==null?void 0:t.level),category:Qh(t==null?void 0:t.category),q:((n=t==null?void 0:t.q)==null?void 0:n.trim())??"",afterId:(t==null?void 0:t.after_id)!==void 0?BigInt(t.after_id):void 0,limit:t==null?void 0:t.limit});return{ok:e.ok,latest_id:Number(e.latestId),total:e.total,entries:e.entries.map(KE)}},async exportLogs(t){var n;const e=await Ql.exportLogs({level:jh(t==null?void 0:t.level),category:Qh(t==null?void 0:t.category),q:((n=t==null?void 0:t.q)==null?void 0:n.trim())??"",format:(t==null?void 0:t.format)==="text"?iu.TEXT:iu.JSONL});return{ok:e.ok,filename:e.filename,contentType:e.contentType,content:e.content,error:e.error||void 0}},async clearLogs(){const t=await Ql.clearLogs({});return{ok:t.ok,error:t.error||void 0}},async fetchMotionTelemetry(){const t=await D_.getMotionTelemetry({});return B_(t)},async fetchRobotModelConfig(){const t=await fetch("/robot-assets/config/robot_model.json");if(!t.ok)throw new Error(`加载机器人 3D 模型配置失败 (HTTP ${t.status})`);return await t.json()}};class JE{constructor(e,n){Cn(this,"abortCtrl",null);Cn(this,"shouldReconnect",!0);Cn(this,"reconnectTimer",null);Cn(this,"onSnapshotCb");Cn(this,"onStatusCb");this.onSnapshotCb=e,this.onStatusCb=n}connect(){this.shouldReconnect=!0,this.startStream()}async startStream(){var i,s,r;this.abortCtrl&&(this.abortCtrl.abort(),this.abortCtrl=null);const e=new AbortController;this.abortCtrl=e;let n=!1;try{const o=ni.subscribeTelemetry({intervalMs:40},{signal:e.signal});for await(const a of o){if(e.signal.aborted)break;n||(n=!0,(i=this.onStatusCb)==null||i.call(this,!0)),(s=this.onSnapshotCb)==null||s.call(this,F_(a))}}catch{}finally{this.abortCtrl===e&&(this.abortCtrl=null),(r=this.onStatusCb)==null||r.call(this,!1),this.shouldReconnect&&!e.signal.aborted&&this.scheduleReconnect()}}scheduleReconnect(){!this.shouldReconnect||this.reconnectTimer!==null||(this.reconnectTimer=window.setTimeout(()=>{this.reconnectTimer=null,this.shouldReconnect&&this.startStream()},1500))}disconnect(){var e;this.shouldReconnect=!1,this.reconnectTimer!==null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.abortCtrl&&(this.abortCtrl.abort(),this.abortCtrl=null),(e=this.onStatusCb)==null||e.call(this,!1)}}class qE{constructor(e,n,i=25){Cn(this,"abortCtrl",null);Cn(this,"shouldReconnect",!0);Cn(this,"reconnectTimer",null);Cn(this,"onTelemetryCb");Cn(this,"onStatusCb");Cn(this,"intervalMs");this.onTelemetryCb=e,this.onStatusCb=n,this.intervalMs=i}connect(){this.shouldReconnect=!0,this.startStream()}async startStream(){var i,s,r;this.abortCtrl&&(this.abortCtrl.abort(),this.abortCtrl=null);const e=new AbortController;this.abortCtrl=e;let n=!1;try{const o=D_.subscribeMotionTelemetry({intervalMs:this.intervalMs},{signal:e.signal});for await(const a of o){if(e.signal.aborted)break;n||(n=!0,(i=this.onStatusCb)==null||i.call(this,!0)),(s=this.onTelemetryCb)==null||s.call(this,B_(a))}}catch{}finally{this.abortCtrl===e&&(this.abortCtrl=null),(r=this.onStatusCb)==null||r.call(this,!1),this.shouldReconnect&&!e.signal.aborted&&this.scheduleReconnect()}}scheduleReconnect(){!this.shouldReconnect||this.reconnectTimer!==null||(this.reconnectTimer=window.setTimeout(()=>{this.reconnectTimer=null,this.shouldReconnect&&this.startStream()},1500))}disconnect(){var e;this.shouldReconnect=!1,this.reconnectTimer!==null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),this.abortCtrl&&(this.abortCtrl.abort(),this.abortCtrl=null),(e=this.onStatusCb)==null||e.call(this,!1)}}const jE={class:"top-status-bar"},QE={class:"status-group"},eM=["title"],tM={class:"badge-text"},nM={key:0,class:"badge-sub"},iM={class:"badge-value"},sM={class:"badge-value"},rM={class:"controls-group"},oM={class:"mode-switch"},aM=["disabled"],lM=["disabled"],cM=["disabled","title"],uM={class:"override-box",title:"速度倍率 Speed Override"},fM=["value"],dM={class:"override-val"},hM={class:"estop-wrapper"},pM=["title"],mM={class:"estop-text"},gM=vr({__name:"TopStatusBar",props:{snapshot:{}},emits:["update:override","action-error"],setup(t,{emit:e}){const n=t,i=e,s=Qe(!1),r=Vt(()=>n.snapshot.plant_online),o=Vt(()=>n.snapshot.drives_on),a=Vt(()=>n.snapshot.emergency_stop),l=Vt(()=>n.snapshot.op_mode),c=Vt(()=>n.snapshot.interpreter_state),u=Vt(()=>n.snapshot.motion_state);function f(g,p){const b=g instanceof Error?g.message:p;i("action-error",b||p)}async function h(g){if(n.snapshot.op_mode!==g){s.value=!0;try{await Gt.setMode(g)}catch(p){f(p,"切换操作模式失败")}finally{s.value=!1}}}async function d(){if(!a.value){s.value=!0;try{const g=await Gt.setPower(!o.value);g.ok||i("action-error",g.error||"伺服上电/下电操作被拒绝")}catch(g){f(g,"伺服电源控制请求失败")}finally{s.value=!1}}}async function m(){s.value=!0;try{await Gt.setEstop(!a.value)}catch(g){f(g,"急停切换请求失败")}finally{s.value=!1}}async function v(g){const p=g.target,b=parseInt(p.value,10);if(!isNaN(b)){i("update:override",b);try{await Gt.setOverride(b)}catch(A){f(A,"设置速度倍率失败")}}}return(g,p)=>(Ke(),qe("header",jE,[p[8]||(p[8]=Rb('<div class="brand-section" data-v-cf62085c><div class="brand-logo" data-v-cf62085c><span class="logo-icon" data-v-cf62085c>⚡</span><span class="logo-title" data-v-cf62085c>BASS <span class="logo-version" data-v-cf62085c>1.1</span></span></div><span class="brand-tag" data-v-cf62085c>TEACH PENDANT</span></div>',1)),D("div",QE,[D("div",{class:ct(["badge status-badge",r.value?"online":"offline"]),title:r.value?`往返时延: ${t.snapshot.rtt_ms.toFixed(1)}ms | 步数: ${t.snapshot.sim_tick}`:"物理被控对象已离线"},[p[2]||(p[2]=D("span",{class:"indicator-dot"},null,-1)),D("span",tM,Ce(r.value?"PLANT ONLINE":"PLANT OFFLINE"),1),r.value?(Ke(),qe("span",nM,Ce(t.snapshot.rtt_ms.toFixed(1))+"ms ",1)):Dn("",!0)],10,eM),D("div",{class:ct(["badge state-badge",c.value.toLowerCase()])},[p[3]||(p[3]=D("span",{class:"badge-label"},"EXEC",-1)),D("span",iM,Ce(c.value),1)],2),D("div",{class:ct(["badge motion-badge",u.value.toLowerCase()])},[p[4]||(p[4]=D("span",{class:"badge-label"},"MOT",-1)),D("span",sM,Ce(u.value),1)],2)]),D("div",rM,[D("div",oM,[D("button",{type:"button",class:ct(["mode-btn",{active:l.value==="MANUAL"}]),disabled:s.value,onClick:p[0]||(p[0]=b=>h("MANUAL"))}," MANUAL ",10,aM),D("button",{type:"button",class:ct(["mode-btn",{active:l.value==="AUTO"}]),disabled:s.value,onClick:p[1]||(p[1]=b=>h("AUTO"))}," AUTO ",10,lM)]),D("button",{type:"button",class:ct(["drives-btn",{on:o.value,disabled:a.value}]),disabled:a.value||s.value,title:a.value?"急停已触发，必须先复位急停":"切换伺服驱动上电/抱闸使能",onClick:d},[p[5]||(p[5]=D("span",{class:"power-icon"},"⚡",-1)),D("span",null,Ce(o.value?"DRIVES ON":"DRIVES OFF"),1)],10,cM),D("div",uM,[p[6]||(p[6]=D("span",{class:"override-label"},"OVR",-1)),D("input",{type:"range",min:"5",max:"100",step:"5",value:t.snapshot.speed_override,class:"override-slider",onChange:v},null,40,fM),D("span",dM,Ce(t.snapshot.speed_override)+"%",1)])]),D("div",hM,[D("button",{type:"button",class:ct(["estop-btn",{active:a.value}]),title:a.value?"点击解除并复位急停":"紧急停止机械臂运动",onClick:m},[p[7]||(p[7]=D("span",{class:"estop-symbol"},"🛑",-1)),D("span",mM,Ce(a.value?"急停已按下 (复位)":"E-STOP 急停"),1)],10,pM)])]))}}),xr=(t,e)=>{const n=t.__vccOpts||t;for(const[i,s]of e)n[i]=s;return n},_M=xr(gM,[["__scopeId","data-v-cf62085c"]]),vM={class:"program-editor-panel"},bM={class:"editor-header"},SM={class:"file-select-group"},xM=["disabled"],yM=["value"],EM={class:"actions-group"},MM=["disabled"],TM=["disabled"],AM={key:0,class:"modal-overlay"},wM={class:"modal-card"},RM={class:"banner-text"},NM={class:"editor-body"},IM={key:1,class:"arrow-err"},CM={class:"num-text"},LM={class:"code-stage"},PM={key:2,class:"compile-drawer"},DM={class:"drawer-header"},UM={class:"drawer-tabs"},OM={key:0,class:"drawer-body"},FM={key:0,class:"drawer-empty"},BM=["onClick"],VM={class:"diag-sev"},GM={class:"diag-stage"},kM={class:"diag-loc"},zM={class:"diag-msg"},HM={key:1,class:"drawer-body"},WM={key:0,class:"drawer-empty"},XM={class:"ir-stats-row"},YM=["onClick"],$M={class:"ir-seq"},KM={class:"ir-line"},ZM={class:"ir-summary"},JM={class:"editor-footer"},qM={class:"active-prog-hint"},jM={class:"hint-name"},QM={key:0,class:"dirty-dot",title:"未保存修改"},eT={key:0,class:"hint-line"},tT={class:"control-btn-group"},nT=["disabled","title"],iT=["disabled"],sT=["disabled"],rT=vr({__name:"ProgramEditor",props:{snapshot:{}},setup(t){const e=t,n=Qe(""),i=Qe([]),s=Qe(""),r=Qe(""),o=Qe(""),a=Qe(!1),l=Qe(!1),c=Qe(!1),u=Qe(null),f=Qe(null),h=Qe([]),d=Qe(null),m=Qe(!1),v=Qe("diag"),g=Qe(!1),p=Qe(""),b=Qe(null),A=Qe(null),y=Qe(null),w=Vt(()=>r.value.split(`
`).length),M=Vt(()=>r.value!==o.value),_=Vt(()=>e.snapshot.interpreter_state),x=Vt(()=>e.snapshot.active_program===s.value&&e.snapshot.interpreter_state!=="IDLE"&&e.snapshot.current_line>0?e.snapshot.current_line:null);function I(he){const U=x.value===he,k=_.value;return{"is-running":U&&k==="RUNNING","is-paused":U&&k==="PAUSED","is-completed":U&&k==="COMPLETED","is-error":f.value===he||U&&k==="ERROR"}}async function N(he){try{const U=await Gt.fetchPrograms();i.value=U,U.length>0?(he&&U.includes(he)?s.value=he:(!s.value||!U.includes(s.value))&&(s.value=U.includes("MoveSquare.rhai")?"MoveSquare.rhai":U[0]),await B(s.value)):(s.value="",r.value="")}catch(U){u.value={type:"error",text:`加载程序列表失败: ${U.message}`}}}async function B(he){if(he){a.value=!0,u.value=null,f.value=null,h.value=[],d.value=null;try{const U=await Gt.fetchProgram(he);r.value=U.code,o.value=U.code,n.value=he}catch(U){u.value={type:"error",text:`读取程序失败: ${U.message}`}}finally{a.value=!1}}}async function G(){if(M.value&&n.value&&n.value!==s.value&&!window.confirm(`当前程序 ${n.value} 有未保存的修改，是否放弃修改并切换到 ${s.value}？`)){s.value=n.value;return}await B(s.value)}function J(){p.value="",g.value=!0}function O(){g.value=!1}async function K(){let he=p.value.trim();if(!he)return;he.endsWith(".rhai")||(he+=".rhai"),g.value=!1;const U=`// Bass 1.1 (UR5e) 工业机器人程序: ${he}
Log("程序启动: ${he}");
MoveJ(HOME, #{ vel: 50 });
Wait(0.5);

// 示教点位示例 (UR5e 笛卡尔空间)
let p1 = Pose(-134.00, 492.00, 380.00, 0.00, 0.00, 180.00);
MoveL(p1, #{ vel: 100 });
Wait(0.2);
MoveJ(HOME, #{ vel: 50 });

Log("程序执行完毕");
`;try{const k=await Gt.saveProgram(he,U);k.ok?(await N(he),u.value={type:"success",text:`成功创建程序 ${he}`}):u.value={type:"error",text:k.message||"新建程序失败"}}catch(k){u.value={type:"error",text:`新建程序失败: ${k.message}`}}}async function Q(){var he;if(s.value){c.value=!0,u.value=null,f.value=null;try{const U=await Gt.compileProgram(s.value,r.value);if(d.value=U,h.value=U.diagnostics??[],U.ok){const k=(he=U.ir)==null?void 0:he.stats,Z=k?`IR ${k.total_instructions} 条指令 · 运动 ${k.motion_count} · 静态IK ${k.static_ik_checked}`:"编译通过";u.value={type:"success",text:`⚙ 编译检查通过 (${Z})`},m.value=!0,v.value=U.diagnostics.length>0?"diag":"ir"}else{const k=U.diagnostics.find(Z=>Z.severity==="ERROR")??U.diagnostics[0];f.value=(k==null?void 0:k.line)||null,u.value={type:"error",text:`❌ 第 ${(k==null?void 0:k.line)||"?"} 行 [${(k==null?void 0:k.stage)||"COMPILER"}]: ${(k==null?void 0:k.message)||"编译失败"}`},m.value=!0,v.value="diag"}}catch(U){u.value={type:"error",text:`编译检查请求失败: ${U.message}`}}finally{c.value=!1}}}async function z(){var he,U,k;if(!s.value)return!1;l.value=!0,u.value=null,f.value=null;try{const Z=await Gt.saveProgram(s.value,r.value);if(Z.ok){o.value=r.value,d.value=Z.report??null,h.value=((he=Z.report)==null?void 0:he.diagnostics)??[];const ge=((k=(U=Z.report)==null?void 0:U.ir)==null?void 0:k.stats.total_instructions)??0;return u.value={type:"success",text:`✅ 编译校验通过并已保存 (生成 IR ${ge} 条指令)`},f.value=null,h.value.length>0&&(m.value=!0,v.value="diag"),!0}else return f.value=Z.line??null,h.value=Z.diagnostics??[],Z.diagnostics&&Z.diagnostics.length>0&&(m.value=!0,v.value="diag"),u.value={type:"error",text:`❌ 第 ${Z.line||"?"} 行编译错误: ${Z.message||"未知错误"}`},!1}catch(Z){return u.value={type:"error",text:`保存请求失败: ${Z.message}`},!1}finally{l.value=!1}}function ae(he){const U=b.value;if(!U||he<=0)return;const k=r.value.split(`
`);let Z=0;for(let ge=0;ge<Math.min(he-1,k.length);ge++)Z+=k[ge].length+1;U.focus(),U.setSelectionRange(Z,Z),U.scrollTop=Math.max(0,(he-4)*22),le()}function q(){var L;const he=b.value;if(!he)return;const U=e.snapshot.cart_actual,k=`Pose(${U.x.toFixed(2)}, ${U.y.toFixed(2)}, ${U.z.toFixed(2)}, ${U.a.toFixed(2)}, ${U.b.toFixed(2)}, ${U.c.toFixed(2)})`,Z=he.selectionStart,ge=r.value.substring(0,Z),te=r.value.split(`
`),we=ge.split(`
`).length-1,ft=te[we]??"",R=/Pose\s*\([^\)]*\)/;if(R.test(ft))te[we]=ft.replace(R,k),u.value={type:"info",text:`🎯 已更新第 ${we+1} 行点位为当前 TCP: ${k}`};else{const X=((L=ft.match(/^\s*/))==null?void 0:L[0])||"";ft.trim()===""?te[we]=`${X}let p_teach = ${k};`:te.splice(we,0,`${X}let p_teach = ${k};`),u.value={type:"info",text:`🎯 已在第 ${we+1} 行示教插入当前 TCP: ${k}`}}r.value=te.join(`
`),ao(()=>{he.focus()})}function le(){const he=b.value;he&&(A.value&&(A.value.scrollTop=he.scrollTop),y.value&&(y.value.scrollTop=he.scrollTop))}function de(he){const U=b.value;if(!U||he<=0)return;const k=22,ge=10+(he-1)*k,te=ge+k,we=U.scrollTop,ft=we+U.clientHeight;ge<we+k?(U.scrollTop=Math.max(0,ge-k*3),le()):te>ft-k&&(U.scrollTop=Math.max(0,te-U.clientHeight+k*3),le())}async function Le(he){if(u.value=null,!((he==="RUN"||he==="STEP")&&M.value&&s.value&&!await z()))try{const U=await Gt.programControl(he,s.value);U.ok||(u.value={type:"error",text:`控制指令 [${he}] 失败: ${U.error}`})}catch(U){u.value={type:"error",text:`控制请求异常: ${U.message}`}}}return br(()=>{N()}),Bi(()=>e.snapshot.active_program,he=>{if(!(!he||he===s.value||!i.value.includes(he))){if(M.value){u.value={type:"info",text:`提示：控制器当前活动程序为 ${he}；因编辑器有未保存修改，已保留当前编辑内容。`};return}s.value=he,B(he)}}),Bi(x,he=>{he!==null&&ao(()=>de(he))}),(he,U)=>{var k,Z,ge;return Ke(),qe("div",vM,[D("div",bM,[D("div",SM,[U[11]||(U[11]=D("label",{class:"section-label"},"程序",-1)),yn(D("select",{"onUpdate:modelValue":U[0]||(U[0]=te=>s.value=te),class:"program-select",disabled:a.value||l.value||c.value,onChange:G},[(Ke(!0),qe(Pt,null,xn(i.value,te=>(Ke(),qe("option",{key:te,value:te},Ce(te),9,yM))),128))],40,xM),[[Wc,s.value]]),D("button",{type:"button",class:"action-btn new-btn",onClick:J}," + 新建 ")]),D("div",EM,[D("button",{type:"button",class:"action-btn teach-btn",title:"将当前机械臂末端 TCP 位姿写入或替换到光标所在行",onClick:q},[...U[12]||(U[12]=[D("span",{class:"btn-icon"},"📍",-1),Vr(" 示教记录 ",-1)])]),D("button",{type:"button",class:"action-btn compile-btn",disabled:c.value||a.value||!s.value,title:"运行 4 阶段编译器校验语法/语义/可达性并预览 IR",onClick:Q},[U[13]||(U[13]=D("span",{class:"btn-icon"},"⚙",-1)),Vr(" "+Ce(c.value?"编译中...":"编译 / IR"),1)],8,MM),D("button",{type:"button",class:"action-btn save-btn",disabled:l.value||a.value||!s.value,onClick:z},[U[14]||(U[14]=D("span",{class:"btn-icon"},"💾",-1)),Vr(" "+Ce(l.value?"校验中...":"保存并编译校验"),1)],8,TM)])]),g.value?(Ke(),qe("div",AM,[D("div",wM,[U[15]||(U[15]=D("div",{class:"modal-title"},"新建 Rhai 机器人程序",-1)),yn(D("input",{"onUpdate:modelValue":U[1]||(U[1]=te=>p.value=te),type:"text",class:"modal-input",placeholder:"例如: Task1 或 MoveWeld.rhai",autofocus:"",onKeyup:[Xc(K,["enter"]),Xc(O,["esc"])]},null,544),[[Hc,p.value]]),D("div",{class:"modal-actions"},[D("button",{type:"button",class:"modal-btn cancel",onClick:O},"取消"),D("button",{type:"button",class:"modal-btn confirm",onClick:K},"确定创建")])])])):Dn("",!0),u.value?(Ke(),qe("div",{key:1,class:ct(["banner",u.value.type])},[D("span",RM,Ce(u.value.text),1),D("button",{type:"button",class:"banner-close",onClick:U[2]||(U[2]=te=>u.value=null)},"✕")],2)):Dn("",!0),D("div",NM,[D("div",{ref_key:"gutterRef",ref:A,class:"line-gutter"},[(Ke(!0),qe(Pt,null,xn(w.value,te=>(Ke(),qe("div",{key:te,class:ct(["line-number",I(te)])},[x.value===te?(Ke(),qe("span",{key:0,class:ct(["arrow-exec",{"is-pulsing":_.value==="RUNNING"}])},"▶",2)):f.value===te?(Ke(),qe("span",IM,"⚠")):Dn("",!0),D("span",CM,Ce(te),1)],2))),128))],512),D("div",LM,[D("div",{ref_key:"backdropRef",ref:y,class:"code-backdrop","aria-hidden":"true"},[(Ke(!0),qe(Pt,null,xn(w.value,te=>(Ke(),qe("div",{key:te,class:ct(["backdrop-line",I(te)])},null,2))),128))],512),yn(D("textarea",{ref_key:"textareaRef",ref:b,"onUpdate:modelValue":U[3]||(U[3]=te=>r.value=te),class:"code-textarea",spellcheck:"false",placeholder:"// 在此编写或编辑 Rhai 机器人运动控制脚本...",onScroll:le},null,544),[[Hc,r.value]])])]),m.value&&(d.value||h.value.length>0)?(Ke(),qe("div",PM,[D("div",DM,[D("div",UM,[D("button",{type:"button",class:ct(["drawer-tab",{active:v.value==="diag"}]),onClick:U[4]||(U[4]=te=>v.value="diag")}," 诊断信息 ("+Ce(h.value.length)+") ",3),D("button",{type:"button",class:ct(["drawer-tab",{active:v.value==="ir"}]),onClick:U[5]||(U[5]=te=>v.value="ir")}," IR 中间表示 ("+Ce(((Z=(k=d.value)==null?void 0:k.ir)==null?void 0:Z.stats.total_instructions)??0)+") ",3)]),D("button",{type:"button",class:"drawer-close",onClick:U[6]||(U[6]=te=>m.value=!1)},"收起 ▾")]),v.value==="diag"?(Ke(),qe("div",OM,[h.value.length===0?(Ke(),qe("div",FM," ✅ 语法检查、语义检查与静态运动学预校验零告警通过 ")):Dn("",!0),(Ke(!0),qe(Pt,null,xn(h.value,(te,we)=>(Ke(),qe("button",{key:we,type:"button",class:ct(["diag-item",te.severity.toLowerCase()]),onClick:ft=>ae(te.line)},[D("span",VM,Ce(te.severity),1),D("span",GM,"["+Ce(te.stage)+"]",1),D("span",kM,"L"+Ce(te.line)+":"+Ce(te.column),1),D("span",zM,Ce(te.message),1)],10,BM))),128))])):(Ke(),qe("div",HM,[(ge=d.value)!=null&&ge.ir?(Ke(),qe(Pt,{key:1},[D("div",XM,[D("span",null,"总指令: "+Ce(d.value.ir.stats.total_instructions),1),D("span",null,"运动: "+Ce(d.value.ir.stats.motion_count),1),D("span",null,"IO: "+Ce(d.value.ir.stats.io_count),1),D("span",null,"延时: "+Ce(d.value.ir.stats.wait_count),1),D("span",null,"IK预检: "+Ce(d.value.ir.stats.static_ik_checked),1),D("span",null,"Hash: "+Ce(d.value.ir.source_hash.slice(0,12)),1)]),(Ke(!0),qe(Pt,null,xn(d.value.ir.instructions,te=>(Ke(),qe("div",{key:te.seq,class:"ir-row",onClick:we=>ae(te.line)},[D("span",$M,"#"+Ce(te.seq),1),D("span",KM,"L"+Ce(te.line),1),D("span",ZM,Ce(te.summary),1)],8,YM))),128))],64)):(Ke(),qe("div",WM," 当前代码编译未通过，修复错误后可预览降级 IR 指令流 "))]))])):Dn("",!0),D("div",JM,[D("div",qM,[D("span",{class:ct(["state-pill",`state-${_.value.toLowerCase()}`])},Ce(_.value),3),D("span",jM,[Vr(Ce(s.value||"未选择"),1),M.value?(Ke(),qe("span",QM,"*")):Dn("",!0)]),x.value?(Ke(),qe("span",eT," ▶ 第 "+Ce(x.value)+" 行",1)):Dn("",!0)]),D("div",tT,[D("button",{type:"button",class:"ctrl-btn run-btn",disabled:!s.value||t.snapshot.emergency_stop||!t.snapshot.drives_on||t.snapshot.op_mode!=="AUTO",title:t.snapshot.op_mode!=="AUTO"?"连续 RUN 需先在顶栏切换为 AUTO 模式":"运行当前选中的 Rhai 程序",onClick:U[7]||(U[7]=te=>Le("RUN"))}," ▶ RUN ",8,nT),D("button",{type:"button",class:"ctrl-btn step-btn",disabled:!s.value||t.snapshot.emergency_stop||!t.snapshot.drives_on,title:"单步推进单条运动或逻辑指令",onClick:U[8]||(U[8]=te=>Le("STEP"))}," ⏭ STEP ",8,iT),D("button",{type:"button",class:"ctrl-btn pause-btn",disabled:t.snapshot.interpreter_state!=="RUNNING",title:"暂停当前程序的执行",onClick:U[9]||(U[9]=te=>Le("PAUSE"))}," ⏸ PAUSE ",8,sT),D("button",{type:"button",class:"ctrl-btn reset-btn",title:"复位解释器状态回 IDLE",onClick:U[10]||(U[10]=te=>Le("RESET"))}," ⏹ RESET ")])])])}}}),oT=xr(rT,[["__scopeId","data-v-a628495f"]]);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Bf="187",ir={ROTATE:0,DOLLY:1,PAN:2},tr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},aT=0,tp=1,lT=2,Da=1,V_=2,zr=3,Ls=0,Mn=1,Oi=2,sr=0,no=1,np=2,ip=3,sp=4,cT=5,Qs=100,uT=101,fT=102,dT=103,hT=104,pT=200,mT=201,gT=202,_T=203,G_=204,k_=205,vT=206,bT=207,ST=208,xT=209,yT=210,ET=211,MT=212,TT=213,AT=214,su=0,ru=1,ou=2,So=3,au=4,lu=5,cu=6,uu=7,Vf=0,wT=1,RT=2,Vi=0,z_=1,H_=2,W_=3,X_=4,Y_=5,$_=6,K_=7,Z_=300,pr=301,xo=302,ec=303,tc=304,fu=1e3,Fi=1001,du=1002,en=1003,NT=1004,Ko=1005,En=1006,nc=1007,rs=1008,Rn=1009,J_=1010,q_=1011,yo=1012,Gf=1013,vi=1014,ui=1015,bi=1016,kf=1017,zf=1018,mr=1020,j_=35902,Q_=35899,e0=1021,t0=1022,fi=1023,hs=1026,os=1027,n0=1028,Hf=1029,Ps=1030,Wf=1031,Xf=1033,Ua=33776,Oa=33777,Fa=33778,Ba=33779,hu=35840,pu=35841,mu=35842,gu=35843,_u=36196,vu=37492,bu=37496,Su=37488,xu=37489,Qa=37490,yu=37491,Eu=37808,Mu=37809,Tu=37810,Au=37811,wu=37812,Ru=37813,Nu=37814,Iu=37815,Cu=37816,Lu=37817,Pu=37818,Du=37819,Uu=37820,Ou=37821,Fu=36492,Bu=36494,Vu=36495,Gu=36283,ku=36284,el=36285,zu=36286,IT=3200,tl=0,CT=1,ss="",Sn="srgb",Eo="srgb-linear",nl="linear",Et="srgb",ic=7680,LT=519,PT=512,DT=513,UT=514,i0=515,OT=516,FT=517,s0=518,r0=519,BT=35044,rp="300 es",Yn=2e3,Mo=2001;function VT(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function il(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function GT(){const t=il("canvas");return t.style.display="block",t}const op={};function ap(...t){const e="THREE."+t.shift();console.log(e,...t)}function o0(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function je(...t){t=o0(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function vt(...t){t=o0(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Va(...t){const e=t.join(" ");e in op||(op[e]=!0,je(...t))}function kT(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const zT={[su]:su,[ou]:cu,[au]:au,[So]:lu,[ru]:ru,[cu]:ou,[uu]:uu,[lu]:So};class ms{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let lp=1234567;const rr=Math.PI/180,To=180/Math.PI;function yr(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(rn[t&255]+rn[t>>8&255]+rn[t>>16&255]+rn[t>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[n&63|128]+rn[n>>8&255]+"-"+rn[n>>16&255]+rn[n>>24&255]+rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]).toLowerCase()}function ut(t,e,n){return Math.max(e,Math.min(n,t))}function Yf(t,e){return(t%e+e)%e}function HT(t,e,n,i,s){return i+(t-e)*(s-i)/(n-e)}function WT(t,e,n){return t!==e?(n-t)/(e-t):0}function io(t,e,n){return(1-n)*t+n*e}function XT(t,e,n,i){return io(t,e,1-Math.exp(-n*i))}function YT(t,e=1){return e-Math.abs(Yf(t,e*2)-e)}function $T(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function KT(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function ZT(t,e){return t+Math.floor(Math.random()*(e-t+1))}function JT(t,e){return t+Math.random()*(e-t)}function qT(t){return t*(.5-Math.random())}function jT(t){t!==void 0&&(lp=t);let e=lp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function QT(t){return t*rr}function eA(t){return t*To}function tA(t){return t>0&&Number.isInteger(t)&&2**Math.round(Math.log2(t))===t}function nA(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function a0(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function iA(t,e,n,i,s){const r=Math.cos,o=Math.sin,a=r(n/2),l=o(n/2),c=r((e+i)/2),u=o((e+i)/2),f=r((e-i)/2),h=o((e-i)/2),d=r((i-e)/2),m=o((i-e)/2);switch(s){case"XYX":t.set(a*u,l*f,l*h,a*c);break;case"YZY":t.set(l*h,a*u,l*f,a*c);break;case"ZXZ":t.set(l*f,l*h,a*u,a*c);break;case"XZX":t.set(a*u,l*m,l*d,a*c);break;case"YXY":t.set(l*d,a*u,l*m,a*c);break;case"ZYZ":t.set(l*m,l*d,a*u,a*c);break;default:je("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $f(t){switch(t.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function l0(t,e){if(e.constructor===Float32Array)return t;const n=$f(e);if(n===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(t/n,-1)}function c0(t,e){if(e.constructor===Float32Array)return t;const n=$f(e);if(n===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(t*n)}const u0={DEG2RAD:rr,RAD2DEG:To,generateUUID:yr,clamp:ut,euclideanModulo:Yf,mapLinear:HT,inverseLerp:WT,lerp:io,damp:XT,pingpong:YT,smoothstep:$T,smootherstep:KT,randInt:ZT,randFloat:JT,randFloatSpread:qT,seededRandom:jT,degToRad:QT,radToDeg:eA,isPowerOfTwo:tA,ceilPowerOfTwo:nA,floorPowerOfTwo:a0,setQuaternionFromProperEuler:iA,normalize:c0,denormalize:l0},Qf=class Qf{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Qf.prototype.isVector2=!0;let et=Qf;class Xi{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3],h=r[o+0],d=r[o+1],m=r[o+2],v=r[o+3];if(f!==v||l!==h||c!==d||u!==m){let g=l*h+c*d+u*m+f*v;g<0&&(h=-h,d=-d,m=-m,v=-v,g=-g);let p=1-a;if(g<.9995){const b=Math.acos(g),A=Math.sin(b);p=Math.sin(p*b)/A,a=Math.sin(a*b)/A,l=l*p+h*a,c=c*p+d*a,u=u*p+m*a,f=f*p+v*a}else{l=l*p+h*a,c=c*p+d*a,u=u*p+m*a,f=f*p+v*a;const b=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=b,c*=b,u*=b,f*=b}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,s,r,o){const a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=r[o],h=r[o+1],d=r[o+2],m=r[o+3];return e[n]=a*m+u*f+l*d-c*h,e[n+1]=l*m+u*h+c*f-a*d,e[n+2]=c*m+u*d+a*h-l*f,e[n+3]=u*m-a*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),f=a(r/2),h=l(i/2),d=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"YXZ":this._x=h*u*f+c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"ZXY":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f-h*d*m;break;case"ZYX":this._x=h*u*f-c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f+h*d*m;break;case"YZX":this._x=h*u*f+c*d*m,this._y=c*d*f+h*u*m,this._z=c*u*m-h*d*f,this._w=c*u*f-h*d*m;break;case"XZY":this._x=h*u*f-c*d*m,this._y=c*d*f-h*u*m,this._z=c*u*m+h*d*f,this._w=c*u*f+h*d*m;break;default:je("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(i>a&&i>f){const d=2*Math.sqrt(1+i-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-i-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-i-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ut(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-n;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+r*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+s*n,this._z=this._z*l+r*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ed=class ed{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(cp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(cp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),u=2*(a*n-r*s),f=2*(r*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-r*f,this.z=s+l*f+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this.z=ut(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this.z=ut(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,o=n.x,a=n.y,l=n.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return sc.copy(this).projectOnVector(e),this.sub(sc)}reflect(e){return this.sub(sc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(ut(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ed.prototype.isVector3=!0;let H=ed;const sc=new H,cp=new Xi,td=class td{constructor(e,n,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,a,l,c)}set(e,n,i,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=n,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],m=i[8],v=s[0],g=s[3],p=s[6],b=s[1],A=s[4],y=s[7],w=s[2],M=s[5],_=s[8];return r[0]=o*v+a*b+l*w,r[3]=o*g+a*A+l*M,r[6]=o*p+a*y+l*_,r[1]=c*v+u*b+f*w,r[4]=c*g+u*A+f*M,r[7]=c*p+u*y+f*_,r[2]=h*v+d*b+m*w,r[5]=h*g+d*A+m*M,r[8]=h*p+d*y+m*_,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*r,d=c*r-o*l,m=n*f+i*h+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=f*v,e[1]=(s*c-u*i)*v,e[2]=(a*i-s*o)*v,e[3]=h*v,e[4]=(u*n-s*l)*v,e[5]=(s*r-a*n)*v,e[6]=d*v,e[7]=(i*l-c*n)*v,e[8]=(o*n-i*r)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return Va("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(rc.makeScale(e,n)),this}rotate(e){return Va("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(rc.makeRotation(-e)),this}translate(e,n){return Va("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(rc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};td.prototype.isMatrix3=!0;let tt=td;const rc=new tt,up=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fp=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sA(){const t={enabled:!0,workingColorSpace:Eo,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Et&&(s.r=Gi(s.r),s.g=Gi(s.g),s.b=Gi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Et&&(s.r=or(s.r),s.g=or(s.g),s.b=or(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ss?nl:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Eo]:{primaries:e,whitePoint:i,transfer:nl,toXYZ:up,fromXYZ:fp,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Sn},outputColorSpaceConfig:{drawingBufferColorSpace:Sn}},[Sn]:{primaries:e,whitePoint:i,transfer:Et,toXYZ:up,fromXYZ:fp,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Sn}}}),t}const mt=sA();function Gi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function or(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Vs;class rA{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Vs===void 0&&(Vs=il("canvas")),Vs.width=e.width,Vs.height=e.height;const s=Vs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Vs}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=il("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Gi(r[o]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Gi(n[i]/255)*255):n[i]=Gi(n[i]);return{data:n,width:e.width,height:e.height}}else return je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let oA=0;class Kf{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:oA++}),this.uuid=yr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width||0,n.height||0,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(oc(s[o].image)):r.push(oc(s[o]))}else r=oc(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function oc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?rA.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(je("Texture: Unable to serialize Texture."),{})}let aA=0;const ac=new H;class _n extends ms{constructor(e=_n.DEFAULT_IMAGE,n=_n.DEFAULT_MAPPING,i=Fi,s=Fi,r=En,o=rs,a=fi,l=Rn,c=_n.DEFAULT_ANISOTROPY,u=ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:aA++}),this.uuid=yr(),this.name="",this.source=new Kf(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new et(0,0),this.repeat=new et(1,1),this.center=new et(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ac).x}get height(){return this.source.getSize(ac).y}get depth(){return this.source.getSize(ac).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){je(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){je(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Z_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fu:e.x=e.x-Math.floor(e.x);break;case Fi:e.x=e.x<0?0:1;break;case du:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fu:e.y=e.y-Math.floor(e.y);break;case Fi:e.y=e.y<0?0:1;break;case du:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}_n.DEFAULT_IMAGE=null;_n.DEFAULT_MAPPING=Z_;_n.DEFAULT_ANISOTROPY=1;const nd=class nd{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*n+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*n+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*n+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const A=(c+1)/2,y=(d+1)/2,w=(p+1)/2,M=(u+h)/4,_=(f+v)/4,x=(m+g)/4;return A>y&&A>w?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=M/i,r=_/i):y>w?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=M/s,r=x/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=_/r,s=x/r),this.set(i,s,r,n),this}let b=Math.sqrt((g-m)*(g-m)+(f-v)*(f-v)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(g-m)/b,this.y=(f-v)/b,this.z=(h-u)/b,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=ut(this.x,e.x,n.x),this.y=ut(this.y,e.y,n.y),this.z=ut(this.z,e.z,n.z),this.w=ut(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=ut(this.x,e,n),this.y=ut(this.y,e,n),this.z=ut(this.z,e,n),this.w=ut(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ut(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};nd.prototype.isVector4=!0;let Ft=nd;class lA extends ms{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Ft(0,0,e,n),this.scissorTest=!1,this.viewport=new Ft(0,0,e,n),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new _n({width:e,height:n,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(n.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new Kf(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hi extends lA{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class f0 extends _n{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=Fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class cA extends _n{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=en,this.minFilter=en,this.wrapR=Fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const ll=class ll{constructor(e,n,i,s,r,o,a,l,c,u,f,h,d,m,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,a,l,c,u,f,h,d,m,v,g)}set(e,n,i,s,r,o,a,l,c,u,f,h,d,m,v,g){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ll().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,s=1/Gs.setFromMatrixColumn(e,0).length(),r=1/Gs.setFromMatrixColumn(e,1).length(),o=1/Gs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const h=o*u,d=o*f,m=a*u,v=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+m*c,n[5]=h-v*c,n[9]=-a*l,n[2]=v-h*c,n[6]=m+d*c,n[10]=o*l}else if(e.order==="YXZ"){const h=l*u,d=l*f,m=c*u,v=c*f;n[0]=h+v*a,n[4]=m*a-d,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=d*a-m,n[6]=v+h*a,n[10]=o*l}else if(e.order==="ZXY"){const h=l*u,d=l*f,m=c*u,v=c*f;n[0]=h-v*a,n[4]=-o*f,n[8]=m+d*a,n[1]=d+m*a,n[5]=o*u,n[9]=v-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const h=o*u,d=o*f,m=a*u,v=a*f;n[0]=l*u,n[4]=m*c-d,n[8]=h*c+v,n[1]=l*f,n[5]=v*c+h,n[9]=d*c-m,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const h=o*l,d=o*c,m=a*l,v=a*c;n[0]=l*u,n[4]=v-h*f,n[8]=m*f+d,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=d*f+m,n[10]=h-v*f}else if(e.order==="XZY"){const h=o*l,d=o*c,m=a*l,v=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+v,n[5]=o*u,n[9]=d*f-m,n[2]=m*f-d,n[6]=a*u,n[10]=v*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(uA,e,fA)}lookAt(e,n,i){const s=this.elements;return Tn.subVectors(e,n),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),Ji.crossVectors(i,Tn),Ji.lengthSq()===0&&(Math.abs(i.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),Ji.crossVectors(i,Tn)),Ji.normalize(),Zo.crossVectors(Tn,Ji),s[0]=Ji.x,s[4]=Zo.x,s[8]=Tn.x,s[1]=Ji.y,s[5]=Zo.y,s[9]=Tn.y,s[2]=Ji.z,s[6]=Zo.z,s[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],m=i[2],v=i[6],g=i[10],p=i[14],b=i[3],A=i[7],y=i[11],w=i[15],M=s[0],_=s[4],x=s[8],I=s[12],N=s[1],B=s[5],G=s[9],J=s[13],O=s[2],K=s[6],Q=s[10],z=s[14],ae=s[3],q=s[7],le=s[11],de=s[15];return r[0]=o*M+a*N+l*O+c*ae,r[4]=o*_+a*B+l*K+c*q,r[8]=o*x+a*G+l*Q+c*le,r[12]=o*I+a*J+l*z+c*de,r[1]=u*M+f*N+h*O+d*ae,r[5]=u*_+f*B+h*K+d*q,r[9]=u*x+f*G+h*Q+d*le,r[13]=u*I+f*J+h*z+d*de,r[2]=m*M+v*N+g*O+p*ae,r[6]=m*_+v*B+g*K+p*q,r[10]=m*x+v*G+g*Q+p*le,r[14]=m*I+v*J+g*z+p*de,r[3]=b*M+A*N+y*O+w*ae,r[7]=b*_+A*B+y*K+w*q,r[11]=b*x+A*G+y*Q+w*le,r[15]=b*I+A*J+y*z+w*de,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],m=e[3],v=e[7],g=e[11],p=e[15],b=l*d-c*h,A=a*d-c*f,y=a*h-l*f,w=o*d-c*u,M=o*h-l*u,_=o*f-a*u;return n*(v*b-g*A+p*y)-i*(m*b-g*w+p*M)+s*(m*A-v*w+p*_)-r*(m*y-v*M+g*_)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return n*(o*u-a*c)-i*(r*u-a*l)+s*(r*c-o*l)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],m=e[12],v=e[13],g=e[14],p=e[15],b=n*a-i*o,A=n*l-s*o,y=n*c-r*o,w=i*l-s*a,M=i*c-r*a,_=s*c-r*l,x=u*v-f*m,I=u*g-h*m,N=u*p-d*m,B=f*g-h*v,G=f*p-d*v,J=h*p-d*g,O=b*J-A*G+y*B+w*N-M*I+_*x;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const K=1/O;return e[0]=(a*J-l*G+c*B)*K,e[1]=(s*G-i*J-r*B)*K,e[2]=(v*_-g*M+p*w)*K,e[3]=(h*M-f*_-d*w)*K,e[4]=(l*N-o*J-c*I)*K,e[5]=(n*J-s*N+r*I)*K,e[6]=(g*y-m*_-p*A)*K,e[7]=(u*_-h*y+d*A)*K,e[8]=(o*G-a*N+c*x)*K,e[9]=(i*N-n*G-r*x)*K,e[10]=(m*M-v*y+p*b)*K,e[11]=(f*y-u*M-d*b)*K,e[12]=(a*I-o*B-l*x)*K,e[13]=(n*B-i*I+s*x)*K,e[14]=(v*A-m*w-g*b)*K,e[15]=(u*w-f*A+h*b)*K,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,o=n._y,a=n._z,l=n._w,c=r+r,u=o+o,f=a+a,h=r*c,d=r*u,m=r*f,v=o*u,g=o*f,p=a*f,b=l*c,A=l*u,y=l*f,w=i.x,M=i.y,_=i.z;return s[0]=(1-(v+p))*w,s[1]=(d+y)*w,s[2]=(m-A)*w,s[3]=0,s[4]=(d-y)*M,s[5]=(1-(h+p))*M,s[6]=(g+b)*M,s[7]=0,s[8]=(m+A)*_,s[9]=(g-b)*_,s[10]=(1-(h+v))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),n.identity(),this;let o=Gs.set(s[0],s[1],s[2]).length();const a=Gs.set(s[4],s[5],s[6]).length(),l=Gs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Gn.copy(this);const c=1/o,u=1/a,f=1/l;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=u,Gn.elements[5]*=u,Gn.elements[6]*=u,Gn.elements[8]*=f,Gn.elements[9]*=f,Gn.elements[10]*=f,n.setFromRotationMatrix(Gn),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,s,r,o,a=Yn,l=!1){const c=this.elements,u=2*r/(n-e),f=2*r/(i-s),h=(n+e)/(n-e),d=(i+s)/(i-s);let m,v;if(l)m=r/(o-r),v=o*r/(o-r);else if(a===Yn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Mo)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,s,r,o,a=Yn,l=!1){const c=this.elements,u=2/(n-e),f=2/(i-s),h=-(n+e)/(n-e),d=-(i+s)/(i-s);let m,v;if(l)m=1/(o-r),v=o/(o-r);else if(a===Yn)m=-2/(o-r),v=-(o+r)/(o-r);else if(a===Mo)m=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};ll.prototype.isMatrix4=!0;let Dt=ll;const Gs=new H,Gn=new Dt,uA=new H(0,0,0),fA=new H(1,1,1),Ji=new H,Zo=new H,Tn=new H,dp=new Dt,hp=new Xi;class Yi{constructor(e=0,n=0,i=0,s=Yi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(n){case"XYZ":this._y=Math.asin(ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ut(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:je("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return dp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return hp.setFromEuler(this),this.setFromQuaternion(hp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yi.DEFAULT_ORDER="XYZ";class d0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let dA=0;const pp=new H,ks=new Xi,Mi=new Dt,Jo=new H,Lr=new H,hA=new H,pA=new Xi,mp=new H(1,0,0),gp=new H(0,1,0),_p=new H(0,0,1),vp={type:"added"},mA={type:"removed"},zs={type:"childadded",child:null},lc={type:"childremoved",child:null};class Xt extends ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dA++}),this.uuid=yr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new H,n=new Yi,i=new Xi,s=new H(1,1,1);function r(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Dt},normalMatrix:{value:new tt}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new d0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ks.setFromAxisAngle(e,n),this.quaternion.multiply(ks),this}rotateOnWorldAxis(e,n){return ks.setFromAxisAngle(e,n),this.quaternion.premultiply(ks),this}rotateX(e){return this.rotateOnAxis(mp,e)}rotateY(e){return this.rotateOnAxis(gp,e)}rotateZ(e){return this.rotateOnAxis(_p,e)}translateOnAxis(e,n){return pp.copy(e).applyQuaternion(this.quaternion),this.position.add(pp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(mp,e)}translateY(e){return this.translateOnAxis(gp,e)}translateZ(e){return this.translateOnAxis(_p,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Jo.copy(e):Jo.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mi.lookAt(Lr,Jo,this.up):Mi.lookAt(Jo,Lr,this.up),this.quaternion.setFromRotationMatrix(Mi),s&&(Mi.extractRotation(s.matrixWorld),ks.setFromRotationMatrix(Mi),this.quaternion.premultiply(ks.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(vt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vp),zs.child=e,this.dispatchEvent(zs),zs.child=null):vt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(mA),lc.child=e,this.dispatchEvent(lc),lc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vp),zs.child=e,this.dispatchEvent(zs),zs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Lr,e,hA),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Lr,pA,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),d=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Xt.DEFAULT_UP=new H(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class li extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gA={type:"move"};class cc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new li,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new li,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new li,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const g=n.getJointPose(v,i),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&h>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(gA)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new li;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const h0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},qo={h:0,s:0,l:0};function uc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class nt{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,mt.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=mt.workingColorSpace){return this.r=e,this.g=n,this.b=i,mt.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=mt.workingColorSpace){if(e=Yf(e,1),n=ut(n,0,1),i=ut(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,o=2*i-r;this.r=uc(o,r,e+1/3),this.g=uc(o,r,e),this.b=uc(o,r,e-1/3)}return mt.colorSpaceToWorking(this,s),this}setStyle(e,n=Sn){function i(r){r!==void 0&&parseFloat(r)<1&&je("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,n);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:je("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(r,16),n);je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Sn){const i=h0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}copyLinearToSRGB(e){return this.r=or(e.r),this.g=or(e.g),this.b=or(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Sn){return mt.workingToColorSpace(on.copy(this),e),Math.round(ut(on.r*255,0,255))*65536+Math.round(ut(on.g*255,0,255))*256+Math.round(ut(on.b*255,0,255))}getHexString(e=Sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=mt.workingColorSpace){mt.workingToColorSpace(on.copy(this),n);const i=on.r,s=on.g,r=on.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=mt.workingColorSpace){return mt.workingToColorSpace(on.copy(this),n),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=Sn){mt.workingToColorSpace(on.copy(this),e);const n=on.r,i=on.g,s=on.b;return e!==Sn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(qi),this.setHSL(qi.h+e,qi.s+n,qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(qi),e.getHSL(qo);const i=io(qi.h,qo.h,n),s=io(qi.s,qo.s,n),r=io(qi.l,qo.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new nt;nt.NAMES=h0;class _A extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yi,this.environmentIntensity=1,this.environmentRotation=new Yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}}const kn=new H,Ti=new H,fc=new H,Ai=new H,Hs=new H,Ws=new H,bp=new H,dc=new H,hc=new H,pc=new H,mc=new Ft,gc=new Ft,_c=new Ft;class Un{constructor(e=new H,n=new H,i=new H){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),kn.subVectors(e,n),s.cross(kn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){kn.subVectors(s,n),Ti.subVectors(i,n),fc.subVectors(e,n);const o=kn.dot(kn),a=kn.dot(Ti),l=kn.dot(fc),c=Ti.dot(Ti),u=Ti.dot(fc),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;const h=1/f,d=(c*l-a*u)*h,m=(o*u-a*l)*h;return r.set(1-d-m,m,d)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(e,n,i,s,r,o,a,l){return this.getBarycoord(e,n,i,s,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(a,Ai.z),l)}static getInterpolatedAttribute(e,n,i,s,r,o){return mc.setScalar(0),gc.setScalar(0),_c.setScalar(0),mc.fromBufferAttribute(e,n),gc.fromBufferAttribute(e,i),_c.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(mc,r.x),o.addScaledVector(gc,r.y),o.addScaledVector(_c,r.z),o}static isFrontFacing(e,n,i,s){return kn.subVectors(i,n),Ti.subVectors(e,n),kn.cross(Ti).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),kn.cross(Ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Un.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return Un.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return Un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let o,a;Hs.subVectors(s,i),Ws.subVectors(r,i),dc.subVectors(e,i);const l=Hs.dot(dc),c=Ws.dot(dc);if(l<=0&&c<=0)return n.copy(i);hc.subVectors(e,s);const u=Hs.dot(hc),f=Ws.dot(hc);if(u>=0&&f<=u)return n.copy(s);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0&&l-u>0)return o=l/(l-u),n.copy(i).addScaledVector(Hs,o);pc.subVectors(e,r);const d=Hs.dot(pc),m=Ws.dot(pc);if(m>=0&&d<=m)return n.copy(r);const v=d*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),n.copy(i).addScaledVector(Ws,a);const g=u*m-d*f;if(g<=0&&f-u>=0&&d-m>=0)return bp.subVectors(r,s),a=(f-u)/(f-u+(d-m)),n.copy(s).addScaledVector(bp,a);const p=1/(g+v+h);return o=v*p,a=h*p,n.copy(i).addScaledVector(Hs,o).addScaledVector(Ws,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Do{constructor(e=new H(1/0,1/0,1/0),n=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(zn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(zn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=zn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,zn):zn.fromBufferAttribute(r,o),zn.applyMatrix4(e.matrixWorld),this.expandByPoint(zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),jo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),jo.copy(i.boundingBox)),jo.applyMatrix4(e.matrixWorld),this.union(jo)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zn),zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pr),Qo.subVectors(this.max,Pr),Xs.subVectors(e.a,Pr),Ys.subVectors(e.b,Pr),$s.subVectors(e.c,Pr),ji.subVectors(Ys,Xs),Qi.subVectors($s,Ys),xs.subVectors(Xs,$s);let n=[0,-ji.z,ji.y,0,-Qi.z,Qi.y,0,-xs.z,xs.y,ji.z,0,-ji.x,Qi.z,0,-Qi.x,xs.z,0,-xs.x,-ji.y,ji.x,0,-Qi.y,Qi.x,0,-xs.y,xs.x,0];return!vc(n,Xs,Ys,$s,Qo)||(n=[1,0,0,0,1,0,0,0,1],!vc(n,Xs,Ys,$s,Qo))?!1:(ea.crossVectors(ji,Qi),n=[ea.x,ea.y,ea.z],vc(n,Xs,Ys,$s,Qo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const wi=[new H,new H,new H,new H,new H,new H,new H,new H],zn=new H,jo=new Do,Xs=new H,Ys=new H,$s=new H,ji=new H,Qi=new H,xs=new H,Pr=new H,Qo=new H,ea=new H,ys=new H;function vc(t,e,n,i,s){for(let r=0,o=t.length-3;r<=o;r+=3){ys.fromArray(t,r);const a=s.x*Math.abs(ys.x)+s.y*Math.abs(ys.y)+s.z*Math.abs(ys.z),l=e.dot(ys),c=n.dot(ys),u=i.dot(ys);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const zt=new H,ta=new et;let vA=0;class ki extends ms{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:vA++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=BT,this.updateRanges=[],this.gpuType=ui,this.version=0,this._normalizationScale=e!==void 0?$f(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ta.fromBufferAttribute(this,n),ta.applyMatrix3(e),this.setXY(n,ta.x,ta.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)zt.fromBufferAttribute(this,n),zt.applyMatrix3(e),this.setXYZ(n,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)zt.fromBufferAttribute(this,n),zt.applyMatrix4(e),this.setXYZ(n,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)zt.fromBufferAttribute(this,n),zt.applyNormalMatrix(e),this.setXYZ(n,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)zt.fromBufferAttribute(this,n),zt.transformDirection(e),this.setXYZ(n,zt.x,zt.y,zt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,n,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=this._denormalize(n)),n}setX(e,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=this._denormalize(n)),n}setY(e,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=this._denormalize(n)),n}setZ(e,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=this._denormalize(n)),n}setW(e,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=this._normalize(n),i=this._normalize(i)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=this._normalize(n),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=this._normalize(n),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const n=this._normalizationScale;return n!==void 0?Math.max(e/n,-1):l0(e,this.array)}_normalize(e){const n=this._normalizationScale;return n!==void 0?Math.round(e*n):c0(e,this.array)}}class p0 extends ki{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class m0 extends ki{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Tt extends ki{constructor(e,n,i){super(new Float32Array(e),n,i)}}const bA=new Do,Dr=new H,bc=new H;class Uo{constructor(e=new H,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):bA.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Dr.subVectors(e,this.center);const n=Dr.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Dr,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Dr.copy(e.center).add(bc)),this.expandByPoint(Dr.copy(e.center).sub(bc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let SA=0;const Ln=new Dt,Sc=new Xt,Ks=new H,An=new Do,Ur=new Do,qt=new H;class tn extends ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:SA++}),this.uuid=yr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(VT(e)?m0:p0)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new tt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ln.makeRotationFromQuaternion(e),this.applyMatrix4(Ln),this}rotateX(e){return Ln.makeRotationX(e),this.applyMatrix4(Ln),this}rotateY(e){return Ln.makeRotationY(e),this.applyMatrix4(Ln),this}rotateZ(e){return Ln.makeRotationZ(e),this.applyMatrix4(Ln),this}translate(e,n,i){return Ln.makeTranslation(e,n,i),this.applyMatrix4(Ln),this}scale(e,n,i){return Ln.makeScale(e,n,i),this.applyMatrix4(Ln),this}lookAt(e){return Sc.lookAt(e),Sc.updateMatrix(),this.applyMatrix4(Sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ks).negate(),this.translate(Ks.x,Ks.y,Ks.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Tt(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Do);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];An.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&vt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Uo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(An.setFromBufferAttribute(e),n)for(let r=0,o=n.length;r<o;r++){const a=n[r];Ur.setFromBufferAttribute(a),this.morphTargetsRelative?(qt.addVectors(An.min,Ur.min),An.expandByPoint(qt),qt.addVectors(An.max,Ur.max),An.expandByPoint(qt)):(An.expandByPoint(Ur.min),An.expandByPoint(Ur.max))}An.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(qt));if(n)for(let r=0,o=n.length;r<o;r++){const a=n[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)qt.fromBufferAttribute(a,c),l&&(Ks.fromBufferAttribute(e,c),qt.add(Ks)),s=Math.max(s,i.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&vt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){vt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new ki(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const a=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)a[I]=new H,l[I]=new H;const u=new H,f=new H,h=new H,d=new et,m=new et,v=new et,g=new H,p=new H;function b(I,N,B){c[I]=c[N]=c[B]=1,u.fromBufferAttribute(i,I),f.fromBufferAttribute(i,N),h.fromBufferAttribute(i,B),d.fromBufferAttribute(r,I),m.fromBufferAttribute(r,N),v.fromBufferAttribute(r,B),f.sub(u),h.sub(u),m.sub(d),v.sub(d);const G=1/(m.x*v.y-v.x*m.y);isFinite(G)&&(g.copy(f).multiplyScalar(v.y).addScaledVector(h,-m.y).multiplyScalar(G),p.copy(h).multiplyScalar(m.x).addScaledVector(f,-v.x).multiplyScalar(G),a[I].add(g),a[N].add(g),a[B].add(g),l[I].add(p),l[N].add(p),l[B].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let I=0,N=A.length;I<N;++I){const B=A[I],G=B.start,J=B.count;for(let O=G,K=G+J;O<K;O+=3)b(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const y=new H,w=new H,M=new H,_=new H;function x(I){M.fromBufferAttribute(s,I),_.copy(M);const N=a[I];y.copy(N),y.sub(M.multiplyScalar(M.dot(N))).normalize(),w.crossVectors(_,N);const G=w.dot(l[I])<0?-1:1;o.setXYZW(I,y.x,y.y,y.z,G)}for(let I=0,N=i.count;I<N;++I)c[I]&&x(I);this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new ki(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);const s=new H,r=new H,o=new H,a=new H,l=new H,c=new H,u=new H,f=new H;if(e)for(let h=0,d=e.count;h<d;h+=3){const m=e.getX(h+0),v=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(n,m),r.fromBufferAttribute(n,v),o.fromBufferAttribute(n,g),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),a.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),a.add(u),l.add(u),c.add(u),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)s.fromBufferAttribute(n,h+0),r.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)qt.fromBufferAttribute(e,n),qt.normalize(),e.setXYZ(n,qt.x,qt.y,qt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let d=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*u;for(let p=0;p<u;p++)h[m++]=c[d++]}return new ki(h,u,f)}if(this.index===null)return je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new tn,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,i);n.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=e(h,i);l.push(d)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(n))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xc=new H,xA=new H,yA=new tt;class Pi{constructor(e=new H(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=xc.subVectors(i,n).cross(xA.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(xc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||yA.getNormalMatrix(e),s=this.coplanarPoint(xc).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let EA=0;class Si extends ms{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:EA++}),this.uuid=yr(),this.name="",this.type="Material",this.blending=no,this.side=Ls,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=G_,this.blendDst=k_,this.blendEquation=Qs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new nt(0,0,0),this.blendAlpha=0,this.depthFunc=So,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=LT,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ic,this.stencilZFail=ic,this.stencilZPass=ic,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){je(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){je(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(n){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new nt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Pi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new et().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new et().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=n[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ri=new H,yc=new H,na=new H,ia=new H;class Il{constructor(e=new H,n=new H(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ri)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Ri.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Ri.copy(this.origin).addScaledVector(this.direction,n),Ri.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){yc.copy(e).add(n).multiplyScalar(.5),na.copy(n).sub(e).normalize(),ia.copy(this.origin).sub(yc);const r=e.distanceTo(n)*.5,o=-this.direction.dot(na),a=ia.dot(this.direction),l=-ia.dot(na),c=ia.lengthSq(),u=Math.abs(1-o*o);let f,h,d,m;if(u>0)if(f=o*l-a,h=o*a-l,m=r*u,f>=0)if(h>=-m)if(h<=m){const v=1/u;f*=v,h*=v,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-m?(f=Math.max(0,-(-o*r+a)),h=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c):h<=m?(f=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(f=Math.max(0,-(o*r+a)),h=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c);else h=o>0?-r:r,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(yc).addScaledVector(na,h),d}intersectSphere(e,n){if(e.radius<0)return null;Ri.subVectors(e.center,this.origin);const i=Ri.dot(this.direction),s=Ri.dot(Ri)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,Ri)!==null}intersectTriangle(e,n,i,s,r){const o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,f=e.x-o.x,h=e.y-o.y,d=e.z-o.z,m=n.x-o.x,v=n.y-o.y,g=n.z-o.z,p=i.x-o.x,b=i.y-o.y,A=i.z-o.z,y=Math.abs(l),w=Math.abs(c),M=Math.abs(u);let _,x,I,N,B,G,J,O,K,Q,z,ae;if(y>=w&&y>=M?(I=l,G=f,K=m,ae=p,l>=0?(_=c,x=u,N=h,B=d,J=v,O=g,Q=b,z=A):(_=u,x=c,N=d,B=h,J=g,O=v,Q=A,z=b)):w>=M?(I=c,G=h,K=v,ae=b,c>=0?(_=u,x=l,N=d,B=f,J=g,O=m,Q=A,z=p):(_=l,x=u,N=f,B=d,J=m,O=g,Q=p,z=A)):(I=u,G=d,K=g,ae=A,u>=0?(_=l,x=c,N=f,B=h,J=m,O=v,Q=p,z=b):(_=c,x=l,N=h,B=f,J=v,O=m,Q=b,z=p)),I===0)return null;const q=_/I,le=x/I,de=1/I,Le=N-q*G,he=B-le*G,U=J-q*K,k=O-le*K,Z=Q-q*ae,ge=z-le*ae,te=Z*k-ge*U,we=Le*ge-he*Z,ft=U*he-k*Le;if(s){if(te<0||we<0||ft<0)return null}else if((te<0||we<0||ft<0)&&(te>0||we>0||ft>0))return null;const R=te+we+ft;if(R===0)return null;const L=de*(te*G+we*K+ft*ae);return(R>0?L<0:L>0)?null:this.at(L/R,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class MA extends Si{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=Vf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Sp=new Dt,Es=new Il,sa=new Uo,xp=new H,ra=new H,oa=new H,aa=new H,Ec=new H,la=new H,yp=new H,ca=new H;class an extends Xt{constructor(e=new tn,n=new MA){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){la.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],f=r[l];u!==0&&(Ec.fromBufferAttribute(f,e),o?la.addScaledVector(Ec,u):la.addScaledVector(Ec.sub(n),u))}n.add(la)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),sa.copy(i.boundingSphere),sa.applyMatrix4(r),Es.copy(e.ray).recast(e.near),!(sa.containsPoint(Es.origin)===!1&&(Es.intersectSphere(sa,xp)===null||Es.origin.distanceToSquared(xp)>(e.far-e.near)**2))&&(Sp.copy(r).invert(),Es.copy(e.ray).applyMatrix4(Sp),!(i.boundingBox!==null&&Es.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Es)))}_computeIntersections(e,n,i){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],b=Math.max(g.start,d.start),A=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let y=b,w=A;y<w;y+=3){const M=a.getX(y),_=a.getX(y+1),x=a.getX(y+2);s=ua(this,p,e,i,c,u,f,M,_,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const b=a.getX(g),A=a.getX(g+1),y=a.getX(g+2);s=ua(this,o,e,i,c,u,f,b,A,y),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=h.length;m<v;m++){const g=h[m],p=o[g.materialIndex],b=Math.max(g.start,d.start),A=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let y=b,w=A;y<w;y+=3){const M=y,_=y+1,x=y+2;s=ua(this,p,e,i,c,u,f,M,_,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,n.push(s))}}else{const m=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let g=m,p=v;g<p;g+=3){const b=g,A=g+1,y=g+2;s=ua(this,o,e,i,c,u,f,b,A,y),s&&(s.faceIndex=Math.floor(g/3),n.push(s))}}}}function TA(t,e,n,i,s,r,o,a){let l;if(e.side===Mn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Ls,a),l===null)return null;ca.copy(a),ca.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(ca);return c<n.near||c>n.far?null:{distance:c,point:ca.clone(),object:t}}function ua(t,e,n,i,s,r,o,a,l,c){t.getVertexPosition(a,ra),t.getVertexPosition(l,oa),t.getVertexPosition(c,aa);const u=TA(t,e,n,i,ra,oa,aa,yp);if(u){const f=new H;Un.getBarycoord(yp,ra,oa,aa,f),s&&(u.uv=Un.getInterpolatedAttribute(s,a,l,c,f,new et)),r&&(u.uv1=Un.getInterpolatedAttribute(r,a,l,c,f,new et)),o&&(u.normal=Un.getInterpolatedAttribute(o,a,l,c,f,new H),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new H,materialIndex:0};Un.getNormal(ra,oa,aa,h.normal),u.face=h,u.barycoord=f}return u}class AA extends _n{constructor(e=null,n=1,i=1,s,r,o,a,l,c=en,u=en,f,h){super(null,o,a,l,c,u,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ms=new Uo,wA=new et(.5,.5),fa=new H;class Ao{constructor(e=new Pi,n=new Pi,i=new Pi,s=new Pi,r=new Pi,o=new Pi){this.planes=[e,n,i,s,r,o]}set(e,n,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Yn,i=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],f=r[5],h=r[6],d=r[7],m=r[8],v=r[9],g=r[10],p=r[11],b=r[12],A=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-o,d-u,p-m,w-b).normalize(),s[1].setComponents(c+o,d+u,p+m,w+b).normalize(),s[2].setComponents(c+a,d+f,p+v,w+A).normalize(),s[3].setComponents(c-a,d-f,p-v,w-A).normalize(),i)s[4].setComponents(l,h,g,y).normalize(),s[5].setComponents(c-l,d-h,p-g,w-y).normalize();else if(s[4].setComponents(c-l,d-h,p-g,w-y).normalize(),n===Yn)s[5].setComponents(c+l,d+h,p+g,w+y).normalize();else if(n===Mo)s[5].setComponents(l,h,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ms.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Ms.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ms)}intersectsSprite(e){Ms.center.set(0,0,0);const n=wA.distanceTo(e.center);return Ms.radius=.7071067811865476+n,Ms.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ms)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(fa.x=s.normal.x>0?e.max.x:e.min.x,fa.y=s.normal.y>0?e.max.y:e.min.y,fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(fa)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Ep=new Dt;class Zf{constructor(){this.coordinateSystem=Yn,this._frustums=[],this._count=0}setFromArrayCamera(e){const n=e.cameras,i=this._frustums;for(let s=0;s<n.length;s++){const r=n[s];Ep.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ao),i[s].setFromProjectionMatrix(Ep,r.coordinateSystem,r.reversedDepth)}return this._count=n.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const n=this._frustums;for(let i=0;i<this._count;i++)if(n[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const n=this._frustums;for(let i=0;i<this._count;i++)if(n[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const n=this._frustums;for(let i=0;i<this._count;i++)if(n[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const n=this._frustums;for(let i=0;i<this._count;i++)if(n[i].intersectsBox(e))return!0;return!1}containsPoint(e){const n=this._frustums;for(let i=0;i<this._count;i++)if(n[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const n=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)n[s]===void 0&&(n[s]=new Ao),n[s].copy(i[s]);return this._count=e._count,this}clone(){return new Zf().copy(this)}}class cs extends Si{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const sl=new H,rl=new H,Mp=new Dt,Or=new Il,da=new Uo,Mc=new H,Tp=new H;class g0 extends Xt{constructor(e=new tn,n=new cs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let s=1,r=n.count;s<r;s++)sl.fromBufferAttribute(n,s-1),rl.fromBufferAttribute(n,s),i[s]=i[s-1],i[s]+=sl.distanceTo(rl);e.setAttribute("lineDistance",new Tt(i,1))}else je("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),da.copy(i.boundingSphere),da.applyMatrix4(s),da.radius+=r,e.ray.intersectsSphere(da)===!1)return;Mp.copy(s).invert(),Or.copy(e.ray).applyMatrix4(Mp);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let v=d,g=m-1;v<g;v+=c){const p=u.getX(v),b=u.getX(v+1),A=ha(this,e,Or,l,p,b,v);A&&n.push(A)}if(this.isLineLoop){const v=u.getX(m-1),g=u.getX(d),p=ha(this,e,Or,l,v,g,m-1);p&&n.push(p)}}else{const d=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=d,g=m-1;v<g;v+=c){const p=ha(this,e,Or,l,v,v+1,v);p&&n.push(p)}if(this.isLineLoop){const v=ha(this,e,Or,l,m-1,d,m-1);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ha(t,e,n,i,s,r,o){const a=t.geometry.attributes.position;if(sl.fromBufferAttribute(a,s),rl.fromBufferAttribute(a,r),n.distanceSqToSegment(sl,rl,Mc,Tp)>i)return;Mc.applyMatrix4(t.matrixWorld);const c=e.ray.origin.distanceTo(Mc);if(!(c<e.near||c>e.far))return{distance:c,point:Tp.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const Ap=new H,wp=new H;class wo extends g0{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let s=0,r=n.count;s<r;s+=2)Ap.fromBufferAttribute(n,s),wp.fromBufferAttribute(n,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ap.distanceTo(wp);e.setAttribute("lineDistance",new Tt(i,1))}else je("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hr extends Si{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Rp=new Dt,Hu=new Il,pa=new Uo,ma=new H;class Tc extends Xt{constructor(e=new tn,n=new Hr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),pa.copy(i.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,e.ray.intersectsSphere(pa)===!1)return;Rp.copy(s).invert(),Hu.copy(e.ray).applyMatrix4(Rp);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){const h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let m=h,v=d;m<v;m++){const g=c.getX(m);ma.fromBufferAttribute(f,g),Np(ma,g,l,s,e,n,this)}}else{const h=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let m=h,v=d;m<v;m++)ma.fromBufferAttribute(f,m),Np(ma,m,l,s,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Np(t,e,n,i,s,r,o){const a=Hu.distanceSqToPoint(t);if(a<n){const l=new H;Hu.closestPointToPoint(t,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class _0 extends _n{constructor(e=[],n=pr,i,s,r,o,a,l,c,u){super(e,n,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gr extends _n{constructor(e,n,i=vi,s,r,o,a=en,l=en,c,u=hs,f=1){if(u!==hs&&u!==os)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:n,depth:f};super(h,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Kf(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}}class v0 extends gr{constructor(e,n=vi,i=pr,s,r,o=en,a=en,l,c=hs){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class b0 extends _n{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Er extends tn{constructor(e=1,n=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,d=0;m("z","y","x",-1,-1,i,n,e,o,r,0),m("z","y","x",1,-1,i,n,-e,o,r,1),m("x","z","y",1,1,e,i,n,s,o,2),m("x","z","y",1,-1,e,i,-n,s,o,3),m("x","y","z",1,-1,e,n,i,s,r,4),m("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Tt(c,3)),this.setAttribute("normal",new Tt(u,3)),this.setAttribute("uv",new Tt(f,2));function m(v,g,p,b,A,y,w,M,_,x,I){const N=y/_,B=w/x,G=y/2,J=w/2,O=M/2,K=_+1,Q=x+1;let z=0,ae=0;const q=new H;for(let le=0;le<Q;le++){const de=le*B-J;for(let Le=0;Le<K;Le++){const he=Le*N-G;q[v]=he*b,q[g]=de*A,q[p]=O,c.push(q.x,q.y,q.z),q[v]=0,q[g]=0,q[p]=M>0?1:-1,u.push(q.x,q.y,q.z),f.push(Le/_),f.push(1-le/x),z+=1}}for(let le=0;le<x;le++)for(let de=0;de<_;de++){const Le=h+de+K*le,he=h+de+K*(le+1),U=h+(de+1)+K*(le+1),k=h+(de+1)+K*le;l.push(Le,he,k),l.push(he,U,k),ae+=6}a.addGroup(d,ae,I),d+=ae,h+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Er(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class so extends tn{constructor(e=1,n=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],h=[],d=[];let m=0;const v=[],g=i/2;let p=0;b(),o===!1&&(e>0&&A(!0),n>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new Tt(f,3)),this.setAttribute("normal",new Tt(h,3)),this.setAttribute("uv",new Tt(d,2));function b(){const y=new H,w=new H;let M=0;const _=(n-e)/i;for(let x=0;x<=r;x++){const I=[],N=x/r,B=N*(n-e)+e;for(let G=0;G<=s;G++){const J=G/s,O=J*l+a,K=Math.sin(O),Q=Math.cos(O);w.x=B*K,w.y=-N*i+g,w.z=B*Q,f.push(w.x,w.y,w.z),y.set(K,_,Q).normalize(),h.push(y.x,y.y,y.z),d.push(J,1-N),I.push(m++)}v.push(I)}for(let x=0;x<s;x++)for(let I=0;I<r;I++){const N=v[I][x],B=v[I+1][x],G=v[I+1][x+1],J=v[I][x+1];(e>0||I!==0)&&(u.push(N,B,J),M+=3),(n>0||I!==r-1)&&(u.push(B,G,J),M+=3)}c.addGroup(p,M,0),p+=M}function A(y){const w=m,M=new et,_=new H;let x=0;const I=y===!0?e:n,N=y===!0?1:-1;for(let G=1;G<=s;G++)f.push(0,g*N,0),h.push(0,N,0),d.push(.5,.5),m++;const B=m;for(let G=0;G<=s;G++){const O=G/s*l+a,K=Math.cos(O),Q=Math.sin(O);_.x=I*Q,_.y=g*N,_.z=I*K,f.push(_.x,_.y,_.z),h.push(0,N,0),M.x=K*.5+.5,M.y=Q*.5*N+.5,d.push(M.x,M.y),m++}for(let G=0;G<s;G++){const J=w+G,O=B+G;y===!0?u.push(O,O+1,J):u.push(O+1,O,J),x+=3}c.addGroup(p,x,y===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const ga=new H,_a=new H,Ac=new H,va=new Un;class RA extends tn{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const s=Math.pow(10,4),r=Math.cos(rr*n),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],f=new Array(3),h=new Map,d=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:v,b:g,c:p}=va;if(v.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),va.getNormal(Ac),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let b=0;b<3;b++){const A=(b+1)%3,y=f[b],w=f[A],M=va[u[b]],_=va[u[A]],x=`${y}_${w}`,I=`${w}_${y}`,N=h.get(I);N?(Ac.dot(N.normal)<=r&&(d.push(M.x,M.y,M.z),d.push(_.x,_.y,_.z)),h.set(I,null)):h.has(x)||h.set(x,{index0:c[b],index1:c[A],normal:Ac.clone()})}}for(const m of h.values())if(m){const{index0:v,index1:g}=m;ga.fromBufferAttribute(a,v),_a.fromBufferAttribute(a,g),d.push(ga.x,ga.y,ga.z),d.push(_a.x,_a.y,_a.z)}this.setAttribute("position",new Tt(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Oo extends tn{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,o=n/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,f=e/a,h=n/l,d=[],m=[],v=[],g=[];for(let p=0;p<u;p++){const b=p*h-o;for(let A=0;A<c;A++){const y=A*f-r;m.push(y,-b,0),v.push(0,0,1),g.push(A/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){const A=b+c*p,y=b+c*(p+1),w=b+1+c*(p+1),M=b+1+c*p;d.push(A,y,M),d.push(y,w,M)}this.setIndex(d),this.setAttribute("position",new Tt(m,3)),this.setAttribute("normal",new Tt(v,3)),this.setAttribute("uv",new Tt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oo(e.width,e.height,e.widthSegments,e.heightSegments)}}class ol extends tn{constructor(e=1,n=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],f=new H,h=new H,d=[],m=[],v=[],g=[];for(let p=0;p<=i;p++){const b=[],A=p/i,y=o+A*a,w=e*Math.cos(y),M=Math.sqrt(e*e-w*w);let _=0;p===0&&o===0?_=.5/n:p===i&&l===Math.PI&&(_=-.5/n);for(let x=0;x<=n;x++){const I=x/n,N=s+I*r;f.x=-M*Math.cos(N),f.y=w,f.z=M*Math.sin(N),m.push(f.x,f.y,f.z),h.copy(f).normalize(),v.push(h.x,h.y,h.z),g.push(I+_,1-A),b.push(c++)}u.push(b)}for(let p=0;p<i;p++)for(let b=0;b<n;b++){const A=u[p][b+1],y=u[p][b],w=u[p+1][b],M=u[p+1][b+1];(p!==0||o>0)&&d.push(A,y,M),(p!==i-1||l<Math.PI)&&d.push(y,w,M)}this.setIndex(d),this.setAttribute("position",new Tt(m,3)),this.setAttribute("normal",new Tt(v,3)),this.setAttribute("uv",new Tt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ol(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function _r(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(Ip(s))s.isRenderTargetTexture?(je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(Ip(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function hn(t){const e={};for(let n=0;n<t.length;n++){const i=_r(t[n]);for(const s in i)e[s]=i[s]}return e}function Ip(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function NA(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function S0(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:mt.workingColorSpace}const IA={clone:_r,merge:hn};var CA=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,LA=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ds extends Si{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=CA,this.fragmentShader=LA,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_r(e.uniforms),this.uniformsGroups=NA(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?n.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[s]={type:"m4",value:o.toArray()}:n.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new nt().setHex(s.value);break;case"v2":this.uniforms[i].value=new et().fromArray(s.value);break;case"v3":this.uniforms[i].value=new H().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ft().fromArray(s.value);break;case"m3":this.uniforms[i].value=new tt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new Dt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class PA extends Ds{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class es extends Si{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tl,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class DA extends Si{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new nt(16777215),this.specular=new nt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tl,this.normalScale=new et(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yi,this.combine=Vf,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class UA extends Si{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=IT,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class OA extends Si{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Cp={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(Lp(t)||(this.files[t]=e))},get:function(t){if(this.enabled!==!1&&!Lp(t))return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};function Lp(t){try{const e=t.slice(t.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class FA{constructor(e,n,i){const s=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const BA=new FA;class Jf{constructor(e){this.manager=e!==void 0?e:BA,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){const i=this;return new Promise(function(s,r){i.load(e,s,n,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}Jf.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ni={};class VA extends Error{constructor(e,n){super(e),this.response=n}}class GA extends Jf{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,n,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Cp.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{n&&n(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:n,onProgress:i,onError:s});return}Ni[e]=[],Ni[e].push({onLoad:n,onProgress:i,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&je("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Ni[e],f=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=h?parseInt(h):0,m=d!==0;let v=0;const g=new ReadableStream({start(p){b();function b(){f.read().then(({done:A,value:y})=>{if(A)p.close();else{v+=y.byteLength;const w=new ProgressEvent("progress",{lengthComputable:m,loaded:v,total:d});for(let M=0,_=u.length;M<_;M++){const x=u[M];x.onProgress&&x.onProgress(w)}p.enqueue(y),b()}},A=>{p.error(A)})}}});return new Response(g)}else throw new VA(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(a),h=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(h);return c.arrayBuffer().then(m=>d.decode(m))}}}).then(c=>{Cp.add(`file:${e}`,c);const u=Ni[e];delete Ni[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=Ni[e];if(u===void 0)throw this.manager.itemError(e),c;delete Ni[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class x0 extends Xt{static registerNode(e){this.prototype._lightNode=e}constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new nt(e),this.intensity=n}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}class kA extends x0{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new nt(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}toJSON(e){const n=super.toJSON(e);return n.object.groundColor=this.groundColor.getHex(),n}}const wc=new Dt,Pp=new H,Dp=new H;class zA{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new et(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ao,this._frameExtents=new et(1,1),this._viewportCount=1,this._viewports=[new Ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera;Pp.setFromMatrixPosition(e.matrixWorld),n.position.copy(Pp),Dp.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Dp),n.updateMatrixWorld(),this._updateMatrix(n,this.matrix,this._frustum)}_updateMatrix(e,n,i,s){wc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(wc,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Mo||e.reversedDepth?n.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):n.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),n.multiply(wc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ba=new H,Sa=new Xi,ei=new H;class y0 extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=Yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ba,Sa,ei),ei.x===1&&ei.y===1&&ei.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,Sa,ei.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(ba,Sa,ei),ei.x===1&&ei.y===1&&ei.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,Sa,ei.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ts=new H,Up=new et,Op=new et;class Xn extends y0{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=To*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return To*2*Math.atan(Math.tan(rr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ts.x,ts.y).multiplyScalar(-e/ts.z),ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ts.x,ts.y).multiplyScalar(-e/ts.z)}getViewSize(e,n){return this.getViewBounds(e,Up,Op),n.subVectors(Op,Up)}setViewOffset(e,n,i,s,r,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(rr*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,n-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class E0 extends y0{constructor(e=-1,n=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+n,l=s-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class HA extends zA{constructor(){super(new E0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fp extends x0{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new HA}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}const Zs=-90,Js=1;class Wu extends Xt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xn(Zs,Js,e,n);s.layers=this.layers,this.add(s);const r=new Xn(Zs,Js,e,n);r.layers=this.layers,this.add(r);const o=new Xn(Zs,Js,e,n);o.layers=this.layers,this.add(o);const a=new Xn(Zs,Js,e,n);a.layers=this.layers,this.add(a);const l=new Xn(Zs,Js,e,n);l.layers=this.layers,this.add(l);const c=new Xn(Zs,Js,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,o,a,l]=n;for(const c of n)this.remove(c);if(e===Yn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Mo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.mipmapsAutoUpdate=v,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,h,d),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class WA extends Xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class Bp{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ut(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ut(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class XA extends wo{constructor(e=10,n=10,i=4473924,s=8947848){i=new nt(i),s=new nt(s);const r=n/2,o=e/n,a=e/2,l=[],c=[];for(let h=0,d=0,m=-a;h<=n;h++,m+=o){l.push(-a,0,m,a,0,m),l.push(m,0,-a,m,0,a);const v=h===r?i:s;v.toArray(c,d),d+=3,v.toArray(c,d),d+=3,v.toArray(c,d),d+=3,v.toArray(c,d),d+=3}const u=new tn;u.setAttribute("position",new Tt(l,3)),u.setAttribute("color",new Tt(c,3));const f=new cs({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Vp extends wo{constructor(e=1){const n=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new tn;s.setAttribute("position",new Tt(n,3)),s.setAttribute("color",new Tt(i,3));const r=new cs({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,n,i){const s=new nt,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(n),s.toArray(r,6),s.toArray(r,9),s.set(i),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class YA extends ms{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Gp(t,e,n,i){const s=$A(i);switch(n){case e0:return t*e;case n0:return t*e/s.components*s.byteLength;case Hf:return t*e/s.components*s.byteLength;case Ps:return t*e*2/s.components*s.byteLength;case Wf:return t*e*2/s.components*s.byteLength;case t0:return t*e*3/s.components*s.byteLength;case fi:return t*e*4/s.components*s.byteLength;case Xf:return t*e*4/s.components*s.byteLength;case Ua:case Oa:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Fa:case Ba:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case pu:case gu:return Math.max(t,16)*Math.max(e,8)/4;case hu:case mu:return Math.max(t,8)*Math.max(e,8)/2;case _u:case vu:case Su:case xu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case bu:case Qa:case yu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Eu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Mu:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Tu:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Au:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case wu:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Ru:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Nu:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Iu:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Cu:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Lu:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Pu:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Du:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Uu:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Ou:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Fu:case Bu:case Vu:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Gu:case ku:return Math.ceil(t/4)*Math.ceil(e/4)*8;case el:case zu:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function $A(t){switch(t){case Rn:case J_:return{byteLength:1,components:1};case yo:case q_:case bi:return{byteLength:2,components:1};case kf:case zf:return{byteLength:2,components:4};case vi:case Gf:case ui:return{byteLength:4,components:1};case j_:case Q_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bf}}));typeof window<"u"&&(window.__THREE__?je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bf);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function M0(){let t=null,e=!1,n=null,i=null;function s(r,o){i=t.requestAnimationFrame(s),n(r,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function KA(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=t.SHORT;else if(c instanceof Uint32Array)d=t.UNSIGNED_INT;else if(c instanceof Int32Array)d=t.INT;else if(c instanceof Int8Array)d=t.BYTE;else if(c instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){const u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((d,m)=>d.start-m.start);let h=0;for(let d=1;d<f.length;d++){const m=f[h],v=f[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++h,f[h]=v)}f.length=h+1;for(let d=0,m=f.length;d<m;d++){const v=f[d];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var ZA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,JA=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,QA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ew=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,nw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,iw=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,sw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ow=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,aw=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,lw=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,cw=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,uw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,dw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,pw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,mw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,gw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,_w=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,vw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bw=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Sw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ew=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Mw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Aw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ww=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Rw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Nw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Iw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Uw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ow=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bw=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vw=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Gw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,kw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ww=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Yw=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$w=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Kw=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zw=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jw=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,qw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jw=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,eR=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tR=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nR=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,iR=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sR=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rR=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,oR=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,aR=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lR=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cR=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,uR=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fR=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dR=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hR=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pR=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mR=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gR=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,_R=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,vR=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bR=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,SR=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xR=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yR=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ER=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,MR=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,TR=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,AR=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wR=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,RR=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,NR=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,IR=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,CR=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,LR=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,PR=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,DR=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,UR=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,OR=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,FR=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,BR=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,VR=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,GR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kR=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zR=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,HR=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,WR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,XR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,YR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,$R=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const KR=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ZR=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qR=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,QR=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,t1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,n1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,s1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,r1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,a1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,c1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,f1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,h1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,m1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,g1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,b1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,x1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,E1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,A1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,w1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lt={alphahash_fragment:ZA,alphahash_pars_fragment:JA,alphamap_fragment:qA,alphamap_pars_fragment:jA,alphatest_fragment:QA,alphatest_pars_fragment:ew,aomap_fragment:tw,aomap_pars_fragment:nw,batching_pars_vertex:iw,batching_vertex:sw,begin_vertex:rw,beginnormal_vertex:ow,bsdfs:aw,iridescence_fragment:lw,bumpmap_pars_fragment:cw,clipping_planes_fragment:uw,clipping_planes_pars_fragment:fw,clipping_planes_pars_vertex:dw,clipping_planes_vertex:hw,color_fragment:pw,color_pars_fragment:mw,color_pars_vertex:gw,color_vertex:_w,common:vw,defaultnormal_vertex:bw,displacementmap_pars_vertex:Sw,displacementmap_vertex:xw,emissivemap_fragment:yw,emissivemap_pars_fragment:Ew,colorspace_fragment:Mw,colorspace_pars_fragment:Tw,envmap_fragment:Aw,envmap_common_pars_fragment:ww,envmap_pars_fragment:Rw,envmap_pars_vertex:Nw,envmap_physical_pars_fragment:Gw,envmap_vertex:Iw,fog_vertex:Cw,fog_pars_vertex:Lw,fog_fragment:Pw,fog_pars_fragment:Dw,gradientmap_pars_fragment:Uw,lightmap_pars_fragment:Ow,lights_lambert_fragment:Fw,lights_lambert_pars_fragment:Bw,lights_pars_begin:Vw,lights_toon_fragment:kw,lights_toon_pars_fragment:zw,lights_phong_fragment:Hw,lights_phong_pars_fragment:Ww,lights_physical_fragment:Xw,lights_physical_pars_fragment:Yw,lights_fragment_begin:$w,lights_fragment_maps:Kw,lights_fragment_end:Zw,lightprobes_pars_fragment:Jw,logdepthbuf_fragment:qw,logdepthbuf_pars_fragment:jw,logdepthbuf_pars_vertex:Qw,logdepthbuf_vertex:eR,map_fragment:tR,map_pars_fragment:nR,map_particle_fragment:iR,map_particle_pars_fragment:sR,metalnessmap_fragment:rR,metalnessmap_pars_fragment:oR,morphinstance_vertex:aR,morphcolor_vertex:lR,morphnormal_vertex:cR,morphtarget_pars_vertex:uR,morphtarget_vertex:fR,normal_fragment_begin:dR,normal_fragment_maps:hR,normal_pars_fragment:pR,normal_pars_vertex:mR,normal_vertex:gR,normalmap_pars_fragment:_R,clearcoat_normal_fragment_begin:vR,clearcoat_normal_fragment_maps:bR,clearcoat_pars_fragment:SR,iridescence_pars_fragment:xR,opaque_fragment:yR,packing:ER,premultiplied_alpha_fragment:MR,project_vertex:TR,dithering_fragment:AR,dithering_pars_fragment:wR,roughnessmap_fragment:RR,roughnessmap_pars_fragment:NR,shadowmap_pars_fragment:IR,shadowmap_pars_vertex:CR,shadowmap_vertex:LR,shadowmask_pars_fragment:PR,skinbase_vertex:DR,skinning_pars_vertex:UR,skinning_vertex:OR,skinnormal_vertex:FR,specularmap_fragment:BR,specularmap_pars_fragment:VR,tonemapping_fragment:GR,tonemapping_pars_fragment:kR,transmission_fragment:zR,transmission_pars_fragment:HR,uv_pars_fragment:WR,uv_pars_vertex:XR,uv_vertex:YR,worldpos_vertex:$R,background_vert:KR,background_frag:ZR,backgroundCube_vert:JR,backgroundCube_frag:qR,cube_vert:jR,cube_frag:QR,depth_vert:e1,depth_frag:t1,distance_vert:n1,distance_frag:i1,equirect_vert:s1,equirect_frag:r1,linedashed_vert:o1,linedashed_frag:a1,meshbasic_vert:l1,meshbasic_frag:c1,meshlambert_vert:u1,meshlambert_frag:f1,meshmatcap_vert:d1,meshmatcap_frag:h1,meshnormal_vert:p1,meshnormal_frag:m1,meshphong_vert:g1,meshphong_frag:_1,meshphysical_vert:v1,meshphysical_frag:b1,meshtoon_vert:S1,meshtoon_frag:x1,points_vert:y1,points_frag:E1,shadow_vert:M1,shadow_frag:T1,sprite_vert:A1,sprite_frag:w1},Oe={common:{diffuse:{value:new nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new et(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new nt(16777215)},opacity:{value:1},center:{value:new et(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},oi={basic:{uniforms:hn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:hn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new nt(0)},envMapIntensity:{value:1}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:hn([Oe.common,Oe.specularmap,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,Oe.lights,{emissive:{value:new nt(0)},specular:{value:new nt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:hn([Oe.common,Oe.envmap,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.roughnessmap,Oe.metalnessmap,Oe.fog,Oe.lights,{emissive:{value:new nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:hn([Oe.common,Oe.aomap,Oe.lightmap,Oe.emissivemap,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.gradientmap,Oe.fog,Oe.lights,{emissive:{value:new nt(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:hn([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,Oe.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:hn([Oe.points,Oe.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:hn([Oe.common,Oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:hn([Oe.common,Oe.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:hn([Oe.common,Oe.bumpmap,Oe.normalmap,Oe.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:hn([Oe.sprite,Oe.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distance:{uniforms:hn([Oe.common,Oe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distance_vert,fragmentShader:lt.distance_frag},shadow:{uniforms:hn([Oe.lights,Oe.fog,{color:{value:new nt(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};oi.physical={uniforms:hn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new et(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new et},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new nt(0)},specularColor:{value:new nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new et},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};const xa={r:0,b:0,g:0},R1=new Dt,T0=new tt;T0.set(-1,0,0,0,1,0,0,0,1);function N1(t,e,n,i,s,r){const o=new nt(0);let a=s===!0?0:1,l,c,u=null,f=0,h=null;function d(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){const y=b.backgroundBlurriness>0;A=e.get(A,y)}return A}function m(b){let A=!1;const y=d(b);y===null?g(o,a):y&&y.isColor&&(g(y,1),A=!0);const w=t.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||A)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function v(b,A){const y=d(A);y&&y.isCubeTexture?(c===void 0&&(c=new an(new Er(1,1,1),new Ds({name:"BackgroundCubeMaterial",uniforms:_r(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,M,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(R1.makeRotationFromEuler(A.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(T0),c.material.toneMapped=mt.getTransfer(y.colorSpace)!==Et,(u!==y||f!==y.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,u=y,f=y.version,h=t.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new an(new Oo(2,2),new Ds({name:"BackgroundMaterial",uniforms:_r(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:Ls,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=mt.getTransfer(y.colorSpace)!==Et,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||h!==t.toneMapping)&&(l.material.needsUpdate=!0,u=y,f=y.version,h=t.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function g(b,A){b.getRGB(xa,S0(t)),n.buffers.color.setClear(xa.r,xa.g,xa.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,A=1){o.set(b),a=A,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,g(o,a)},render:m,addToRenderList:v,dispose:p}}function I1(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,o=!1;function a(B,G,J,O,K){let Q=!1;const z=f(B,O,J,G);r!==z&&(r=z,c(r.object)),Q=d(B,O,J,K),Q&&m(B,O,J,K),K!==null&&e.update(K,t.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,y(B,G,J,O),K!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function l(){return t.createVertexArray()}function c(B){return t.bindVertexArray(B)}function u(B){return t.deleteVertexArray(B)}function f(B,G,J,O){const K=O.wireframe===!0;let Q=i[G.id];Q===void 0&&(Q={},i[G.id]=Q);const z=B.isInstancedMesh===!0?B.id:0;let ae=Q[z];ae===void 0&&(ae={},Q[z]=ae);let q=ae[J.id];q===void 0&&(q={},ae[J.id]=q);let le=q[K];return le===void 0&&(le=h(l()),q[K]=le),le}function h(B){const G=[],J=[],O=[];for(let K=0;K<n;K++)G[K]=0,J[K]=0,O[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:J,attributeDivisors:O,object:B,attributes:{},index:null}}function d(B,G,J,O){const K=r.attributes,Q=G.attributes;let z=0;const ae=J.getAttributes();for(const q in ae)if(ae[q].location>=0){const de=K[q];let Le=Q[q];if(Le===void 0&&(q==="instanceMatrix"&&B.instanceMatrix&&(Le=B.instanceMatrix),q==="instanceColor"&&B.instanceColor&&(Le=B.instanceColor)),de===void 0||de.attribute!==Le||Le&&de.data!==Le.data)return!0;z++}return r.attributesNum!==z||r.index!==O}function m(B,G,J,O){const K={},Q=G.attributes;let z=0;const ae=J.getAttributes();for(const q in ae)if(ae[q].location>=0){let de=Q[q];de===void 0&&(q==="instanceMatrix"&&B.instanceMatrix&&(de=B.instanceMatrix),q==="instanceColor"&&B.instanceColor&&(de=B.instanceColor));const Le={};Le.attribute=de,de&&de.data&&(Le.data=de.data),K[q]=Le,z++}r.attributes=K,r.attributesNum=z,r.index=O}function v(){const B=r.newAttributes;for(let G=0,J=B.length;G<J;G++)B[G]=0}function g(B){p(B,0)}function p(B,G){const J=r.newAttributes,O=r.enabledAttributes,K=r.attributeDivisors;J[B]=1,O[B]===0&&(t.enableVertexAttribArray(B),O[B]=1),K[B]!==G&&(t.vertexAttribDivisor(B,G),K[B]=G)}function b(){const B=r.newAttributes,G=r.enabledAttributes;for(let J=0,O=G.length;J<O;J++)G[J]!==B[J]&&(t.disableVertexAttribArray(J),G[J]=0)}function A(B,G,J,O,K,Q,z){z===!0?t.vertexAttribIPointer(B,G,J,K,Q):t.vertexAttribPointer(B,G,J,O,K,Q)}function y(B,G,J,O){v();const K=O.attributes,Q=J.getAttributes(),z=G.defaultAttributeValues;for(const ae in Q){const q=Q[ae];if(q.location>=0){let le=K[ae];if(le===void 0&&(ae==="instanceMatrix"&&B.instanceMatrix&&(le=B.instanceMatrix),ae==="instanceColor"&&B.instanceColor&&(le=B.instanceColor)),le!==void 0){const de=le.normalized,Le=le.itemSize,he=e.get(le);if(he===void 0)continue;const U=he.buffer,k=he.type,Z=he.bytesPerElement,ge=k===t.INT||k===t.UNSIGNED_INT||le.gpuType===Gf;if(le.isInterleavedBufferAttribute){const te=le.data,we=te.isInterleavedBuffer===!0?te.stride:te.itemSize,ft=le.offset;if(te.isInstancedInterleavedBuffer||te.isInstancedBufferAttribute){for(let R=0;R<q.locationSize;R++)p(q.location+R,te.meshPerAttribute);B.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let R=0;R<q.locationSize;R++)g(q.location+R);t.bindBuffer(t.ARRAY_BUFFER,U);for(let R=0;R<q.locationSize;R++)A(q.location+R,Le/q.locationSize,k,de,we*Z,(ft+Le/q.locationSize*R)*Z,ge)}else{if(le.isInstancedBufferAttribute){for(let te=0;te<q.locationSize;te++)p(q.location+te,le.meshPerAttribute);B.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let te=0;te<q.locationSize;te++)g(q.location+te);t.bindBuffer(t.ARRAY_BUFFER,U);for(let te=0;te<q.locationSize;te++)A(q.location+te,Le/q.locationSize,k,de,Le*Z,Le/q.locationSize*te*Z,ge)}}else if(z!==void 0){const de=z[ae];if(de!==void 0)switch(de.length){case 2:t.vertexAttrib2fv(q.location,de);break;case 3:t.vertexAttrib3fv(q.location,de);break;case 4:t.vertexAttrib4fv(q.location,de);break;default:t.vertexAttrib1fv(q.location,de)}}}}b()}function w(){I();for(const B in i){const G=i[B];for(const J in G){const O=G[J];for(const K in O){const Q=O[K];for(const z in Q)u(Q[z].object),delete Q[z];delete O[K]}}delete i[B]}}function M(B){if(i[B.id]===void 0)return;const G=i[B.id];for(const J in G){const O=G[J];for(const K in O){const Q=O[K];for(const z in Q)u(Q[z].object),delete Q[z];delete O[K]}}delete i[B.id]}function _(B){for(const G in i){const J=i[G];for(const O in J){const K=J[O];if(K[B.id]===void 0)continue;const Q=K[B.id];for(const z in Q)u(Q[z].object),delete Q[z];delete K[B.id]}}}function x(B){for(const G in i){const J=i[G],O=B.isInstancedMesh===!0?B.id:0,K=J[O];if(K!==void 0){for(const Q in K){const z=K[Q];for(const ae in z)u(z[ae].object),delete z[ae];delete K[Q]}delete J[O],Object.keys(J).length===0&&delete i[G]}}}function I(){N(),o=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:N,dispose:w,releaseStatesOfGeometry:M,releaseStatesOfObject:x,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:g,disableUnusedAttributes:b}}function C1(t,e,n){let i;function s(l){i=l}function r(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function L1(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(_){return!(_!==fi&&i.convert(_)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){const x=_===bi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==Rn&&_!==ui&&!x&&i.convert(_)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(je("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=n.logarithmicDepthBuffer===!0&&f===!1;n.reversedDepthBuffer===!0&&f===!1&&je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),n.logarithmicDepthBuffer===!0&&f===!0&&je("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),m=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),b=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),A=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),w=t.getParameter(t.MAX_SAMPLES),M=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:y,maxSamples:w,samples:M}}function P1(t){const e=this;let n=null,i=0,s=!1,r=!1;const o=new Pi,a=new tt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||i!==0||s;return s=h,i=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){const m=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,p=t.get(f);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{const b=r?0:i,A=b*4;let y=p.clippingState||null;l.value=y,y=u(m,h,A,d);for(let w=0;w!==A;++w)y[w]=n[w];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,d,m){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=d+v*4,b=h.matrixWorldInverse;a.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let A=0,y=d;A!==v;++A,y+=4)o.copy(f[A]).applyMatrix4(b,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}class qf extends hi{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new _0(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Er(5,5,5),r=new Ds({name:"CubemapFromEquirect",uniforms:_r(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Mn,blending:sr});r.uniforms.tEquirect.value=n;const o=new an(s,r),a=n.minFilter;return n.minFilter===rs&&(n.minFilter=En),new Wu(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,s);e.setRenderTarget(r)}}const kp=256,D1=3,U1=20,A0=256,w0=16,O1=3,F1=new H,B1=new nt;class al{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Wu(1,10,null),this._boxMesh=new an(new Er(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:o=256,position:a=F1}=r,l=this._renderer;this._setSize(o);const c=this._allocateTarget(),u=this._getSourceTarget(!0);n>0&&(u.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,h=l.autoClearColor,d=l.autoClearDepth,m=l.autoClearStencil,v=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(e.background=l.getClearColor(B1));const g=new Wu(i,s,u);return g.position.copy(a),g.update(l,e),l.autoClear=f,l.autoClearColor=h,l.autoClearDepth=d,l.autoClearStencil=m,e.background=v,n>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,n)),this._applyPMREM(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,n){return n>0?1-Math.sqrt(1-e/n):0}_setSize(e){this._cubeSize=Math.max(kp,a0(e))}_fromTexture(e,n){e.mapping===pr||e.mapping===xo?this._setSize(e.image.length===0?kp:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=n||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,n=zp(e,!1,!1),i=Math.log2(e)-D1;for(let s=0;s<=i;s++)n.texture.mipmaps.push({width:e>>s,height:e>>s});return n.texture.name="PMREM",n.texture.isPMREMTexture=!0,n}_getSourceTarget(e=!1){const n=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==n||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=zp(n,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,n,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=n;const o=e.width>>n;e.viewport.set(0,0,o,o),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let n;e.mapping===pr||e.mapping===xo?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wp()),n=this._cubemapMaterial,n.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Hp()),n=this._equirectMaterial),n.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,n)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=V1(),this._integrationMaterial=G1());const n=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(n/w0);for(let o=0;o<=i;o++){const a=al.lodToRoughness(o,i);if(o>i-O1)r.roughness.value=a,this._renderCube(e,o,this._integrationMaterial);else{const l=a>0?Math.log2(n)+.5*Math.log2(6/(A0*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(e,o,this._ggxMaterial)}}}_blur(e,n){this._blurMaterial===null&&(this._blurMaterial=k1());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(n,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function zp(t,e,n){return new qf(t,{minFilter:rs,generateMipmaps:e,type:bi,colorSpace:Eo,depthBuffer:n})}function Fo(t,e,n){return new Ds({name:t,uniforms:e,vertexShader:lt.cube_vert,fragmentShader:n,side:Mn,blending:sr,depthTest:!1,depthWrite:!1})}function V1(){return Fo("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${A0}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function G1(){return Fo("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:w0}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function k1(){return Fo("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${U1}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Hp(){return Fo("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Wp(){return Fo("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function z1(t){let e=new WeakMap,n=new WeakMap,i=null;function s(h,d=!1){return h==null?null:d?o(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===ec||d===tc)if(e.has(h)){const m=e.get(h).texture;return a(m,h.mapping)}else{const m=h.image;if(m&&m.height>0){const v=new qf(m.height);return v.fromEquirectangularTexture(t,h),e.set(h,v),h.addEventListener("dispose",c),a(v.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const d=h.mapping,m=d===ec||d===tc,v=d===pr||d===xo;if(m||v){let g=n.get(h);const p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new al(t)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),g.texture;if(g!==void 0)return g.texture;{const b=h.image;return m&&b&&b.height>0||v&&b&&l(b)?(i===null&&(i=new al(t)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,n.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function a(h,d){return d===ec?h.mapping=pr:d===tc&&(h.mapping=xo),h}function l(h){let d=0;const m=6;for(let v=0;v<m;v++)h[v]!==void 0&&d++;return d===m}function c(h){const d=h.target;d.removeEventListener("dispose",c);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function u(h){const d=h.target;d.removeEventListener("dispose",u);const m=n.get(d);m!==void 0&&(n.delete(d),m.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function H1(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&Va("WebGLRenderer: "+i+" extension not supported."),s}}}function W1(t,e,n,i){const s={},r=new WeakMap,o=new FinalizationRegistry(m=>delete s[m]);function a(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",a),delete s[m.id],o.unregister(m);const v=r.get(m);v&&(e.remove(v),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,n.memory.geometries--}function c(m,v){return s[v.id]!==void 0||(v.addEventListener("dispose",a),s[v.id]=new WeakRef(v),o.register(v,v.id,v),n.memory.geometries++),v}function u(m){const v=m.attributes;for(const g in v)e.update(v[g],t.ARRAY_BUFFER)}function f(m){const v=m.index,g=m.attributes.position;let p=0;if(g===void 0)return;const b=v!==null?v.array.length:g.array.length/3-1,A=g.count>=65535?m0:p0,y=new A(Math.ceil(b/3)*6,1),w=y.array;if(v!==null){const _=v.array;p=v.version;for(let x=0,I=0;x<b;x+=3){const N=_[x+0],B=_[x+1],G=_[x+2];w[I++]=N,w[I++]=B,w[I++]=B,w[I++]=G,w[I++]=G,w[I++]=N}}else{p=g.version;for(let _=0,x=0;_<b;_+=3){const I=_+0,N=_+1,B=_+2;w[x++]=I,w[x++]=N,w[x++]=N,w[x++]=B,w[x++]=B,w[x++]=I}}y.version=p;const M=r.get(m);M&&e.remove(M),r.set(m,y)}function h(m){const v=r.get(m);if(v){const g=m.index;g!==null&&v.version<g.version&&f(m)}else f(m);return r.get(m)}function d(){for(const m in s){const v=s[m].deref();v!==void 0&&l(v)}}return{get:c,update:u,getWireframeAttribute:h,dispose:d}}function X1(t,e,n){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,h){t.drawElements(i,h,r,f*o),n.update(h,i,1)}function c(f,h,d){d!==0&&(t.drawElementsInstanced(i,h,r,f*o,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,f,0,d);let v=0;for(let g=0;g<d;g++)v+=h[g];n.update(v,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Y1(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(r/3);break;case t.LINES:n.lines+=a*(r/2);break;case t.LINE_STRIP:n.lines+=a*(r-1);break;case t.LINE_LOOP:n.lines+=a*r;break;case t.POINTS:n.points+=a*r;break;default:vt("WebGLInfo: Unknown draw mode:",o);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function $1(t,e,n){const i=new WeakMap,s=new Ft;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==f){let N=function(){x.dispose(),i.delete(a),a.removeEventListener("dispose",N)};var d=N;h!==void 0&&h.texture.dispose();const m=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],b=a.morphAttributes.normal||[],A=a.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let w=a.attributes.position.count*y,M=1;w>e.maxTextureSize&&(M=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const _=new Float32Array(w*M*4*f),x=new f0(_,w,M,f);x.type=ui,x.needsUpdate=!0;const I=y*4;for(let B=0;B<f;B++){const G=p[B],J=b[B],O=A[B],K=w*M*4*B;for(let Q=0;Q<G.count;Q++){const z=Q*I;m===!0&&(s.fromBufferAttribute(G,Q),_[K+z+0]=s.x,_[K+z+1]=s.y,_[K+z+2]=s.z,_[K+z+3]=0),v===!0&&(s.fromBufferAttribute(J,Q),_[K+z+4]=s.x,_[K+z+5]=s.y,_[K+z+6]=s.z,_[K+z+7]=0),g===!0&&(s.fromBufferAttribute(O,Q),_[K+z+8]=s.x,_[K+z+9]=s.y,_[K+z+10]=s.z,_[K+z+11]=O.itemSize===4?s.w:1)}}h={count:f,texture:x,size:new et(w,M)},i.set(a,h),a.addEventListener("dispose",N)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const v=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:r}}function K1(t,e,n,i,s){let r=new WeakMap;function o(c){const u=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function a(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}const Z1={[z_]:"LINEAR_TONE_MAPPING",[H_]:"REINHARD_TONE_MAPPING",[W_]:"CINEON_TONE_MAPPING",[X_]:"ACES_FILMIC_TONE_MAPPING",[$_]:"AGX_TONE_MAPPING",[K_]:"NEUTRAL_TONE_MAPPING",[Y_]:"CUSTOM_TONE_MAPPING"};function J1(t,e,n,i,s,r){const o=new hi(e,n,{type:t,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let a=null,l=null,c=null;const u=new tn;u.setAttribute("position",new Tt([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new Tt([0,2,0,0,2,0],2));const f=new PA({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new an(u,f),d=new E0(-1,1,1,-1,0,1);let m=null,v=null,g=!1,p,b=null,A=[],y=!1;this.setSize=function(w,M){o.setSize(w,M),a!==null&&a.setSize(w,M),l!==null&&l.setSize(w,M);for(let _=0;_<A.length;_++){const x=A[_];x.setSize&&x.setSize(w,M)}},this.setEffects=function(w){A=w,y=A.length>0&&A[0].isRenderPass===!0;const M=o.width,_=o.height;A.length>0&&a===null&&(a=new hi(M,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}),l=new hi(M,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}));const x=s===!0&&A.some(I=>I.needsDepthTexture===!0);x!==(o.depthTexture!==null)&&(x===!0&&c===null&&(c=new gr(M,_),r===!0&&(c.format=os,c.type=mr)),o.dispose(),o.depthTexture=x?c:null,o.resolveDepthBuffer=x,o.storeMultisampledDepthBuffer=x);for(let I=0;I<A.length;I++){const N=A[I];N.setSize&&N.setSize(M,_),x&&N.needsDepthTexture===!0&&N.setDepthTexture&&N.setDepthTexture(c)}},this.begin=function(w,M){if(g||w.toneMapping===Vi&&A.length===0)return!1;if(b=M,M!==null){const _=M.width,x=M.height;(o.width!==_||o.height!==x)&&this.setSize(_,x)}return y===!1&&w.setRenderTarget(o),p=w.toneMapping,w.toneMapping=Vi,!0},this.hasRenderPass=function(){return y},this.end=function(w,M){w.toneMapping=p,g=!0;let _=o,x=a;for(let I=0;I<A.length;I++){const N=A[I];N.enabled!==!1&&(N.render(w,x,_,M),N.needsSwap!==!1&&(_=x,x=x===a?l:a))}if(m!==w.outputColorSpace||v!==w.toneMapping){m=w.outputColorSpace,v=w.toneMapping,f.defines={},mt.getTransfer(m)===Et&&(f.defines.SRGB_TRANSFER="");const I=Z1[v];I&&(f.defines[I]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=_.texture,w.setRenderTarget(b),w.render(h,d),b=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),u.dispose(),f.dispose()}}const R0=new _n,N0=new gr(1,1),I0=new v0(1),C0=new f0,L0=new cA,P0=new _0,Xp=[],Yp=[],$p=new Float32Array(16),Kp=new Float32Array(9),Zp=new Float32Array(4);function Mr(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=Xp[s];if(r===void 0&&(r=new Float32Array(s),Xp[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(r,a)}return r}function $t(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Kt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Cl(t,e){let n=Yp[e];n===void 0&&(n=new Int32Array(e),Yp[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function q1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function j1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if($t(n,e))return;t.uniform2fv(this.addr,e),Kt(n,e)}}function Q1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if($t(n,e))return;t.uniform3fv(this.addr,e),Kt(n,e)}}function eN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if($t(n,e))return;t.uniform4fv(this.addr,e),Kt(n,e)}}function tN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if($t(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Kt(n,e)}else{if($t(n,i))return;Zp.set(i),t.uniformMatrix2fv(this.addr,!1,Zp),Kt(n,i)}}function nN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if($t(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Kt(n,e)}else{if($t(n,i))return;Kp.set(i),t.uniformMatrix3fv(this.addr,!1,Kp),Kt(n,i)}}function iN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if($t(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Kt(n,e)}else{if($t(n,i))return;$p.set(i),t.uniformMatrix4fv(this.addr,!1,$p),Kt(n,i)}}function sN(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function rN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if($t(n,e))return;t.uniform2iv(this.addr,e),Kt(n,e)}}function oN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if($t(n,e))return;t.uniform3iv(this.addr,e),Kt(n,e)}}function aN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if($t(n,e))return;t.uniform4iv(this.addr,e),Kt(n,e)}}function lN(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function cN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if($t(n,e))return;t.uniform2uiv(this.addr,e),Kt(n,e)}}function uN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if($t(n,e))return;t.uniform3uiv(this.addr,e),Kt(n,e)}}function fN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if($t(n,e))return;t.uniform4uiv(this.addr,e),Kt(n,e)}}function Ll(t){return t.version===0&&(t.compareFunction=r0,t.needsUpdate=!0),t}function dN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?r=Ll(N0):r=R0,n.setTexture2D(e||r,s)}function hN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||L0,s)}function pN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_CUBE_SHADOW?r=Ll(I0):r=P0,n.setTextureCube(e||r,s)}function mN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||C0,s)}function gN(t){switch(t){case 5126:return q1;case 35664:return j1;case 35665:return Q1;case 35666:return eN;case 35674:return tN;case 35675:return nN;case 35676:return iN;case 5124:case 35670:return sN;case 35667:case 35671:return rN;case 35668:case 35672:return oN;case 35669:case 35673:return aN;case 5125:return lN;case 36294:return cN;case 36295:return uN;case 36296:return fN;case 35678:case 36198:case 36298:case 36306:case 35682:return dN;case 35679:case 36299:case 36307:return hN;case 35680:case 36300:case 36308:case 36293:return pN;case 36289:case 36303:case 36311:case 36292:return mN}}function _N(t,e){t.uniform1fv(this.addr,e)}function vN(t,e){const n=Mr(e,this.size,2);t.uniform2fv(this.addr,n)}function bN(t,e){const n=Mr(e,this.size,3);t.uniform3fv(this.addr,n)}function SN(t,e){const n=Mr(e,this.size,4);t.uniform4fv(this.addr,n)}function xN(t,e){const n=Mr(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function yN(t,e){const n=Mr(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function EN(t,e){const n=Mr(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function MN(t,e){t.uniform1iv(this.addr,e)}function TN(t,e){t.uniform2iv(this.addr,e)}function AN(t,e){t.uniform3iv(this.addr,e)}function wN(t,e){t.uniform4iv(this.addr,e)}function RN(t,e){t.uniform1uiv(this.addr,e)}function NN(t,e){t.uniform2uiv(this.addr,e)}function IN(t,e){t.uniform3uiv(this.addr,e)}function CN(t,e){t.uniform4uiv(this.addr,e)}function LN(t,e,n){const i=this.cache,s=e.length,r=Cl(n,s);$t(i,r)||(t.uniform1iv(this.addr,r),Kt(i,r));let o;this.type===t.SAMPLER_2D_SHADOW?o=Ll(N0):o=R0;for(let a=0;a!==s;++a)n.setTexture2D(e[a]||o,r[a])}function PN(t,e,n){const i=this.cache,s=e.length,r=Cl(n,s);$t(i,r)||(t.uniform1iv(this.addr,r),Kt(i,r));for(let o=0;o!==s;++o)n.setTexture3D(e[o]||L0,r[o])}function DN(t,e,n){const i=this.cache,s=e.length,r=Cl(n,s);$t(i,r)||(t.uniform1iv(this.addr,r),Kt(i,r));let o;this.type===t.SAMPLER_CUBE_SHADOW?o=Ll(I0):o=P0;for(let a=0;a!==s;++a)n.setTextureCube(e[a]||o,r[a])}function UN(t,e,n){const i=this.cache,s=e.length,r=Cl(n,s);$t(i,r)||(t.uniform1iv(this.addr,r),Kt(i,r));for(let o=0;o!==s;++o)n.setTexture2DArray(e[o]||C0,r[o])}function ON(t){switch(t){case 5126:return _N;case 35664:return vN;case 35665:return bN;case 35666:return SN;case 35674:return xN;case 35675:return yN;case 35676:return EN;case 5124:case 35670:return MN;case 35667:case 35671:return TN;case 35668:case 35672:return AN;case 35669:case 35673:return wN;case 5125:return RN;case 36294:return NN;case 36295:return IN;case 36296:return CN;case 35678:case 36198:case 36298:case 36306:case 35682:return LN;case 35679:case 36299:case 36307:return PN;case 35680:case 36300:case 36308:case 36293:return DN;case 36289:case 36303:case 36311:case 36292:return UN}}class FN{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=gN(n.type)}}class BN{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=ON(n.type)}}class VN{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,n[a.id],i)}}}const Rc=/(\w+)(\])?(\[|\.)?/g;function Jp(t,e){t.seq.push(e),t.map[e.id]=e}function GN(t,e,n){const i=t.name,s=i.length;for(Rc.lastIndex=0;;){const r=Rc.exec(i),o=Rc.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Jp(n,c===void 0?new FN(a,t,e):new BN(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new VN(a),Jp(n,f)),n=f}}}class Ga{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);GN(a,l,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,o=n.length;r!==o;++r){const a=n[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in n&&i.push(o)}return i}}function qp(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const kN=37297;let zN=0;function HN(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const jp=new tt;function WN(t){mt._getMatrix(jp,mt.workingColorSpace,t);const e=`mat3( ${jp.elements.map(n=>n.toFixed(4))} )`;switch(mt.getTransfer(t)){case nl:return[e,"LinearTransferOETF"];case Et:return[e,"sRGBTransferOETF"];default:return je("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Qp(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return n.toUpperCase()+`

`+r+`

`+HN(t.getShaderSource(e),a)}else return r}function XN(t,e){const n=WN(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const YN={[z_]:"Linear",[H_]:"Reinhard",[W_]:"Cineon",[X_]:"ACESFilmic",[$_]:"AgX",[K_]:"Neutral",[Y_]:"Custom"};function $N(t,e){const n=YN[e];return n===void 0?(je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const ya=new H;function KN(){mt.getLuminanceCoefficients(ya);const t=ya.x.toFixed(4),e=ya.y.toFixed(4),n=ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ZN(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Wr).join(`
`)}function JN(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function qN(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),o=r.name;let a=1;r.type===t.FLOAT_MAT2&&(a=2),r.type===t.FLOAT_MAT3&&(a=3),r.type===t.FLOAT_MAT4&&(a=4),n[o]={type:r.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Wr(t){return t!==""}function em(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function tm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const jN=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xu(t){return t.replace(jN,QN)}function QN(t,e){const n=lt[e];if(n===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Xu(n)}const eI=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nm(t){return t.replace(eI,tI)}function tI(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function im(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const nI={[Da]:"SHADOWMAP_TYPE_PCF",[zr]:"SHADOWMAP_TYPE_VSM"};function iI(t){return nI[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const sI={[xo]:"ENVMAP_MODE_REFRACTION"};function rI(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":sI[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const oI={[Vf]:"ENVMAP_BLENDING_MULTIPLY",[wT]:"ENVMAP_BLENDING_MIX",[RT]:"ENVMAP_BLENDING_ADD"};function aI(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":oI[t.combine]||"ENVMAP_BLENDING_NONE"}function lI(t,e,n,i){const s=t.getContext(),r=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=iI(n),c=n.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=rI(n),f=aI(n),h=ZN(n),d=JN(r),m=s.createProgram();let v,g,p=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(v=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d].filter(Wr).join(`
`),v.length>0&&(v+=`
`),g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d].filter(Wr).join(`
`),g.length>0&&(g+=`
`)):(v=[im(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+n.diffuseRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wr).join(`
`),g=[im(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",n.envMapPMREM?"#define ENVMAP_MAX_LOD "+n.envMapMaxLod+".0":"",n.envMapPMREM?"#define ENVMAP_SIZE "+n.envMapSize+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Vi?"#define TONE_MAPPING":"",n.toneMapping!==Vi?lt.tonemapping_pars_fragment:"",n.toneMapping!==Vi?$N("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,XN("linearToOutputTexel",n.outputColorSpace),KN(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Wr).join(`
`)),o=Xu(o),o=em(o,n),o=tm(o,n),a=Xu(a),a=em(a,n),a=tm(a,n),o=nm(o),a=nm(a),n.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,v=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,g=["#define varying in",n.glslVersion===rp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===rp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const b=p+v+o,A=p+g+a,y=qp(s,s.VERTEX_SHADER,b),w=qp(s,s.FRAGMENT_SHADER,A);s.attachShader(m,y),s.attachShader(m,w),n.index0AttributeName!==void 0?s.bindAttribLocation(m,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function M(N){if(t.debug.checkShaderErrors){const B=s.getProgramInfoLog(m)||"",G=s.getShaderInfoLog(y)||"",J=s.getShaderInfoLog(w)||"",O=B.trim(),K=G.trim(),Q=J.trim();let z=!0,ae=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,m,y,w);else{const q=Qp(s,y,"vertex"),le=Qp(s,w,"fragment");vt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+O+`
`+q+`
`+le)}else O!==""?je("WebGLProgram: Program Info Log:",O):(K===""||Q==="")&&(ae=!1);ae&&(N.diagnostics={runnable:z,programLog:O,vertexShader:{log:K,prefix:v},fragmentShader:{log:Q,prefix:g}})}s.deleteShader(y),s.deleteShader(w),_=new Ga(s,m),x=qN(s,m)}let _;this.getUniforms=function(){return _===void 0&&M(this),_};let x;this.getAttributes=function(){return x===void 0&&M(this),x};let I=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(m,kN)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=zN++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=y,this.fragmentShader=w,this}let cI=0;class uI{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const s=this._getShaderCacheForMaterial(e);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new fI(e),n.set(e,i)),i}}class fI{constructor(e){this.id=cI++,this.code=e,this.usedTimes=0}}function dI(t){return t===Ps||t===Qa||t===el}function hI(t,e,n,i,s,r){const o=new d0,a=new uI,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,x,I,N,B,G){const J=N.fog,O=B.geometry,K=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?N.environment:null,Q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,z=e.get(_.envMap||K,Q),ae=h[_.type];let q=i.precision;_.precision!==null&&(q=i.getMaxPrecision(_.precision),q!==_.precision&&je("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));const le=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,de=le!==void 0?le.length:0;let Le=0;O.morphAttributes.position!==void 0&&(Le=1),O.morphAttributes.normal!==void 0&&(Le=2),O.morphAttributes.color!==void 0&&(Le=3);let he,U,k,Z;if(ae){const Ue=oi[ae];he=Ue.vertexShader,U=Ue.fragmentShader}else{he=_.vertexShader,U=_.fragmentShader;const Ue=a.getVertexShaderStage(_),yt=a.getFragmentShaderStage(_);a.update(_,Ue,yt),k=Ue.id,Z=yt.id}const ge=t.getRenderTarget(),te=t.state.buffers.depth.getReversed(),we=B.isInstancedMesh===!0,ft=B.isBatchedMesh===!0,R=!!_.map,L=!!_.matcap,X=!!z,ee=X&&z.isPMREMTexture===!0,ie=!!_.aoMap,se=!!_.lightMap,be=!!_.bumpMap&&_.wireframe===!1,pe=!!_.normalMap,ve=!!_.displacementMap,re=!!_.emissiveMap,Fe=!!_.metalnessMap,xe=!!_.roughnessMap,De=_.anisotropy>0,C=_.clearcoat>0,Je=_.diffuseRoughness>0,Ye=_.dispersion>0,We=_.retroreflectivity>0,_e=_.iridescence>0,ot=_.sheen>0,Pe=_.transmission>0,Ve=De&&!!_.anisotropyMap,T=C&&!!_.clearcoatMap,S=C&&!!_.clearcoatNormalMap,W=C&&!!_.clearcoatRoughnessMap,me=Je&&!!_.diffuseRoughnessMap,fe=_e&&!!_.iridescenceMap,Ee=_e&&!!_.iridescenceThicknessMap,Ne=ot&&!!_.sheenColorMap,oe=ot&&!!_.sheenRoughnessMap,ce=!!_.specularMap,Te=!!_.specularColorMap,P=!!_.specularIntensityMap,ue=Pe&&!!_.transmissionMap,ne=Pe&&!!_.thicknessMap,Ae=!!_.gradientMap,ye=!!_.alphaMap,Me=_.alphaTest>0,Xe=!!_.alphaHash,at=!!_.extensions;let Se=Vi;_.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(Se=t.toneMapping);const $e=ee?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,rt={shaderID:ae,shaderType:_.type,shaderName:_.name,vertexShader:he,fragmentShader:U,defines:_.defines,customVertexShaderID:k,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:ft,batchingColor:ft&&B._colorsTexture!==null,instancing:we,instancingColor:we&&B.instanceColor!==null,instancingMorph:we&&B.morphTexture!==null,outputColorSpace:ge===null?t.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:mt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:R,matcap:L,envMap:X,envMapMode:X&&z.mapping,envMapPMREM:ee,envMapMaxLod:ee?$e.length-1:null,envMapSize:ee?$e[0].width:null,aoMap:ie,lightMap:se,bumpMap:be,normalMap:pe,displacementMap:ve,emissiveMap:re,normalMapObjectSpace:pe&&_.normalMapType===CT,normalMapTangentSpace:pe&&_.normalMapType===tl,packedNormalMap:pe&&_.normalMapType===tl&&dI(_.normalMap.format),metalnessMap:Fe,roughnessMap:xe,anisotropy:De,anisotropyMap:Ve,clearcoat:C,clearcoatMap:T,clearcoatNormalMap:S,clearcoatRoughnessMap:W,diffuseRoughness:Je,diffuseRoughnessMap:me,dispersion:Ye,retroreflection:We,iridescence:_e,iridescenceMap:fe,iridescenceThicknessMap:Ee,sheen:ot,sheenColorMap:Ne,sheenRoughnessMap:oe,specularMap:ce,specularColorMap:Te,specularIntensityMap:P,transmission:Pe,transmissionMap:ue,thicknessMap:ne,gradientMap:Ae,opaque:_.transparent===!1&&_.blending===no&&_.alphaToCoverage===!1,alphaMap:ye,alphaTest:Me,alphaHash:Xe,combine:_.combine,mapUv:R&&d(_.map.channel),aoMapUv:ie&&d(_.aoMap.channel),lightMapUv:se&&d(_.lightMap.channel),bumpMapUv:be&&d(_.bumpMap.channel),normalMapUv:pe&&d(_.normalMap.channel),displacementMapUv:ve&&d(_.displacementMap.channel),emissiveMapUv:re&&d(_.emissiveMap.channel),metalnessMapUv:Fe&&d(_.metalnessMap.channel),roughnessMapUv:xe&&d(_.roughnessMap.channel),anisotropyMapUv:Ve&&d(_.anisotropyMap.channel),clearcoatMapUv:T&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:S&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:me&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:fe&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:oe&&d(_.sheenRoughnessMap.channel),specularMapUv:ce&&d(_.specularMap.channel),specularColorMapUv:Te&&d(_.specularColorMap.channel),specularIntensityMapUv:P&&d(_.specularIntensityMap.channel),transmissionMapUv:ue&&d(_.transmissionMap.channel),thicknessMapUv:ne&&d(_.thicknessMap.channel),alphaMapUv:ye&&d(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(pe||De),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!O.attributes.uv&&(R||ye),fog:!!J,useFog:_.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&pe===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:te,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:Le,numSunLights:x.sun.length,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numSunLightShadows:x.sunShadowMap.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numLightProbeGrids:G.filter(Ue=>Ue.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:t.shadowMap.enabled&&I.length>0,shadowMapType:t.shadowMap.type,toneMapping:Se,decodeVideoTexture:R&&_.map.isVideoTexture===!0&&mt.getTransfer(_.map.colorSpace)===Et,decodeVideoTextureEmissive:re&&_.emissiveMap.isVideoTexture===!0&&mt.getTransfer(_.emissiveMap.colorSpace)===Et,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Oi,flipSided:_.side===Mn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:at&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&_.extensions.multiDraw===!0||ft)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return rt.vertexUv1s=l.has(1),rt.vertexUv2s=l.has(2),rt.vertexUv3s=l.has(3),l.clear(),rt}function v(_){const x=[];if(_.shaderID?x.push(_.shaderID):(x.push(_.customVertexShaderID),x.push(_.customFragmentShaderID)),_.defines!==void 0)for(const I in _.defines)x.push(I),x.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(g(x,_),p(x,_),x.push(t.outputColorSpace)),x.push(_.customProgramCacheKey),x.join()}function g(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapPMREM),_.push(x.envMapMaxLod),_.push(x.envMapSize),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.diffuseRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.numSunLights),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numSunLightShadows),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.numLightProbeGrids),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)}function p(_,x){o.disableAll(),x.instancing&&o.enable(0),x.instancingColor&&o.enable(1),x.instancingMorph&&o.enable(2),x.matcap&&o.enable(3),x.envMap&&o.enable(4),x.normalMapObjectSpace&&o.enable(5),x.normalMapTangentSpace&&o.enable(6),x.clearcoat&&o.enable(7),x.iridescence&&o.enable(8),x.alphaTest&&o.enable(9),x.vertexColors&&o.enable(10),x.vertexAlphas&&o.enable(11),x.vertexUv1s&&o.enable(12),x.vertexUv2s&&o.enable(13),x.vertexUv3s&&o.enable(14),x.vertexTangents&&o.enable(15),x.anisotropy&&o.enable(16),x.alphaHash&&o.enable(17),x.batching&&o.enable(18),x.dispersion&&o.enable(19),x.retroreflection&&o.enable(24),x.diffuseRoughness&&o.enable(25),x.batchingColor&&o.enable(20),x.gradientMap&&o.enable(21),x.packedNormalMap&&o.enable(22),x.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),x.numLightProbeGrids>0&&o.enable(22),x.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function b(_){const x=h[_.type];let I;if(x){const N=oi[x];I=IA.clone(N.uniforms)}else I=_.uniforms;return I}function A(_,x){let I=u.get(x);return I!==void 0?++I.usedTimes:(I=new lI(t,x,_,s),c.push(I),u.set(x,I)),I}function y(_){if(--_.usedTimes===0){const x=c.indexOf(_);c[x]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function w(_){a.remove(_)}function M(){a.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:b,acquireProgram:A,releaseProgram:y,releaseShaderCache:w,programs:c,dispose:M}}function pI(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function s(o,a,l){t.get(o)[a]=l}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function mI(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function sm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function rm(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function o(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function a(h,d,m,v,g,p){let b=t[e];return b===void 0?(b={id:h.id,object:h,geometry:d,material:m,materialVariant:o(h),groupOrder:v,renderOrder:h.renderOrder,z:g,group:p},t[e]=b):(b.id=h.id,b.object=h,b.geometry=d,b.material=m,b.materialVariant=o(h),b.groupOrder=v,b.renderOrder=h.renderOrder,b.z=g,b.group=p),e++,b}function l(h,d,m,v,g,p,b){b.reversedDepth===!0&&(g=-g);const A=a(h,d,m,v,g,p);m.transmission>0?i.push(A):m.transparent===!0?s.push(A):n.push(A)}function c(h,d,m,v,g,p){const b=a(h,d,m,v,g,p);m.transmission>0?i.unshift(b):m.transparent===!0?s.unshift(b):n.unshift(b)}function u(h,d){n.length>1&&n.sort(h||mI),i.length>1&&i.sort(d||sm),s.length>1&&s.sort(d||sm)}function f(){for(let h=e,d=t.length;h<d;h++){const m=t[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:u}}function gI(){let t=new WeakMap;function e(i,s){const r=t.get(i);let o;return r===void 0?(o=new rm,t.set(i,[o])):s>=r.length?(o=new rm,r.push(o)):o=r[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function _I(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new H,color:new nt};break;case"SpotLight":n={position:new H,direction:new H,color:new nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new H,color:new nt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new H,skyColor:new nt,groundColor:new nt};break;case"RectAreaLight":n={color:new nt,position:new H,halfWidth:new H,halfHeight:new H};break}return t[e.id]=n,n}}}function vI(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new et,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let bI=0;function SI(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function xI(t){const e=new _I,n=vI(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const s=new H,r=new Dt,o=new Dt;function a(c){let u=0,f=0,h=0;for(let G=0;G<9;G++)i.probe[G].set(0,0,0);let d=0,m=0,v=0,g=0,p=0,b=0,A=0,y=0,w=0,M=0,_=0,x=0,I=0,N=0;c.sort(SI);for(let G=0,J=c.length;G<J;G++){const O=c[G],K=O.color,Q=O.intensity,z=O.distance;let ae=null;if(O.shadow&&O.shadow.map&&(O.shadow.map.texture.format===Ps?ae=O.shadow.map.texture:ae=O.shadow.map.depthTexture||O.shadow.map.texture),O.isAmbientLight)u+=K.r*Q,f+=K.g*Q,h+=K.b*Q;else if(O.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(O.sh.coefficients[q],Q);N++}else if(O.isSunLight){const q=e.get(O);if(q.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){const le=O.shadow,de=n.get(O);de.shadowIntensity=le.intensity,de.shadowBias=le.bias,de.shadowNormalBias=le.normalBias,de.shadowRadius=le.radius,de.shadowMapSize.copy(le.mapSize).multiply(le.getFrameExtents()),i.sunShadow[m]=de,i.sunShadowMap[m]=ae;const Le=le.getViewportCount();for(let he=0;he<Le;he++)i.sunShadowMatrix[v+he]=le.getMatrix(he),i.sunShadowCascade[v+he]=le._cascadeData[he];v+=Le,m++}i.sun[d]=q,d++}else if(O.isDirectionalLight){const q=e.get(O);if(q.color.copy(O.color).multiplyScalar(O.intensity),O.castShadow){const le=O.shadow,de=n.get(O);de.shadowIntensity=le.intensity,de.shadowBias=le.bias,de.shadowNormalBias=le.normalBias,de.shadowRadius=le.radius,de.shadowMapSize=le.mapSize,i.directionalShadow[g]=de,i.directionalShadowMap[g]=ae,i.directionalShadowMatrix[g]=O.shadow.matrix,w++}i.directional[g]=q,g++}else if(O.isSpotLight){const q=e.get(O);q.position.setFromMatrixPosition(O.matrixWorld),q.color.copy(K).multiplyScalar(Q),q.distance=z,q.coneCos=Math.cos(O.angle),q.penumbraCos=Math.cos(O.angle*(1-O.penumbra)),q.decay=O.decay,i.spot[b]=q;const le=O.shadow;if(O.map&&(i.spotLightMap[x]=O.map,x++,le.updateMatrices(O),O.castShadow&&I++),i.spotLightMatrix[b]=le.matrix,O.castShadow){const de=n.get(O);de.shadowIntensity=le.intensity,de.shadowBias=le.bias,de.shadowNormalBias=le.normalBias,de.shadowRadius=le.radius,de.shadowMapSize=le.mapSize,i.spotShadow[b]=de,i.spotShadowMap[b]=ae,_++}b++}else if(O.isRectAreaLight){const q=e.get(O);q.color.copy(K).multiplyScalar(Q),q.halfWidth.set(O.width*.5,0,0),q.halfHeight.set(0,O.height*.5,0),i.rectArea[A]=q,A++}else if(O.isPointLight){const q=e.get(O);if(q.color.copy(O.color).multiplyScalar(O.intensity),q.distance=O.distance,q.decay=O.decay,O.castShadow){const le=O.shadow,de=n.get(O);de.shadowIntensity=le.intensity,de.shadowBias=le.bias,de.shadowNormalBias=le.normalBias,de.shadowRadius=le.radius,de.shadowMapSize=le.mapSize,de.shadowCameraNear=le.camera.near,de.shadowCameraFar=le.camera.far,i.pointShadow[p]=de,i.pointShadowMap[p]=ae,i.pointShadowMatrix[p]=O.shadow.matrix,M++}i.point[p]=q,p++}else if(O.isHemisphereLight){const q=e.get(O);q.skyColor.copy(O.color).multiplyScalar(Q),q.groundColor.copy(O.groundColor).multiplyScalar(Q),i.hemi[y]=q,y++}}A>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Oe.LTC_FLOAT_1,i.rectAreaLTC2=Oe.LTC_FLOAT_2):(i.rectAreaLTC1=Oe.LTC_HALF_1,i.rectAreaLTC2=Oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;const B=i.hash;(B.sunLength!==d||B.directionalLength!==g||B.pointLength!==p||B.spotLength!==b||B.rectAreaLength!==A||B.hemiLength!==y||B.numSunShadows!==m||B.numDirectionalShadows!==w||B.numPointShadows!==M||B.numSpotShadows!==_||B.numSpotMaps!==x||B.numLightProbes!==N)&&(i.sun.length=d,i.directional.length=g,i.spot.length=b,i.rectArea.length=A,i.point.length=p,i.hemi.length=y,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+x-I,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=N,B.sunLength=d,B.directionalLength=g,B.pointLength=p,B.spotLength=b,B.rectAreaLength=A,B.hemiLength=y,B.numSunShadows=m,B.numDirectionalShadows=w,B.numPointShadows=M,B.numSpotShadows=_,B.numSpotMaps=x,B.numLightProbes=N,i.version=bI++)}function l(c,u){let f=0,h=0,d=0,m=0,v=0,g=0;const p=u.matrixWorldInverse;for(let b=0,A=c.length;b<A;b++){const y=c[b];if(y.isSunLight){const w=i.sun[f];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(p),f++}else if(y.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),h++}else if(y.isSpotLight){const w=i.spot[m];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const w=i.rectArea[v];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),o.identity(),r.copy(y.matrixWorld),r.premultiply(p),o.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const w=i.hemi[g];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:i}}function om(t){const e=new xI(t),n=[],i=[],s=[];function r(f){u.camera=f,n.length=0,i.length=0,s.length=0}function o(f){f.isLightProbeGrid?s.push(f):n.push(f)}function a(f){i.push(f)}function l(){e.setup(n),s.sort((f,h)=>f.priority-h.priority||f.id-h.id)}function c(f){e.setupView(n,f)}const u={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function yI(t){let e=new WeakMap;function n(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new om(t),e.set(s,[a])):r>=o.length?(a=new om(t),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:n,dispose:i}}const EI=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,MI=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,TI=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],AI=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],am=new Dt,Fr=new H,Nc=new H;function wI(t,e,n){let i=new Ao;const s=new et,r=new et,o=new Ft,a=new UA,l=new OA,c={},u=n.maxTextureSize,f={[Ls]:Mn,[Mn]:Ls,[Oi]:Oi},h=new Ds({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new et},radius:{value:4}},vertexShader:EI,fragmentShader:MI}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const m=new tn;m.setAttribute("position",new ki(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new an(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Da;let p=this.type;this.render=function(M,_,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===V_&&(je("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Da);const I=t.getRenderTarget(),N=t.getActiveCubeFace(),B=t.getActiveMipmapLevel(),G=t.state;G.setBlending(sr),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const J=p!==this.type;J&&_.traverse(function(O){O.material&&(Array.isArray(O.material)?O.material.forEach(K=>K.needsUpdate=!0):O.material.needsUpdate=!0)});for(let O=0,K=M.length;O<K;O++){const Q=M[O],z=Q.shadow;if(z===void 0){je("WebGLShadowMap:",Q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const ae=z.getFrameExtents();s.multiply(ae),r.copy(z.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ae.x),s.x=r.x*ae.x,z.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ae.y),s.y=r.y*ae.y,z.mapSize.y=r.y));const q=t.state.buffers.depth.getReversed();if(z.camera._reversedDepth=q,z.map===null||J===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===zr){if(Q.isPointLight){je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new hi(s.x,s.y,{format:Ps,type:bi,minFilter:En,magFilter:En,generateMipmaps:!1}),z.map.texture.name=Q.name+".shadowMap",z.map.depthTexture=new gr(s.x,s.y,ui),z.map.depthTexture.name=Q.name+".shadowMapDepth",z.map.depthTexture.format=hs,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=en,z.map.depthTexture.magFilter=en}else Q.isPointLight?(z.map=new qf(s.x),z.map.depthTexture=new v0(s.x,vi)):(z.map=new hi(s.x,s.y),z.map.depthTexture=new gr(s.x,s.y,vi)),z.map.depthTexture.name=Q.name+".shadowMap",z.map.depthTexture.format=hs,this.type===Da?(z.map.depthTexture.compareFunction=q?s0:i0,z.map.depthTexture.minFilter=En,z.map.depthTexture.magFilter=En):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=en,z.map.depthTexture.magFilter=en);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);const le=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();Q.isPointLight!==!0&&z.updateMatrices(Q,x);const de=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:x.layers;for(let Le=0;Le<le;Le++){const he=z.getCamera(Le);if(Q.isPointLight){const U=z.camera,k=z.matrix,Z=Q.distance||U.far;Z!==U.far&&(U.far=Z,U.updateProjectionMatrix()),Fr.setFromMatrixPosition(Q.matrixWorld),U.position.copy(Fr),Nc.copy(U.position),Nc.add(TI[Le]),U.up.copy(AI[Le]),U.lookAt(Nc),U.updateMatrixWorld(),k.makeTranslation(-Fr.x,-Fr.y,-Fr.z),am.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),z._frustum.setFromProjectionMatrix(am,U.coordinateSystem,U.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)t.setRenderTarget(z.map,Le),t.clear();else{Le===0&&(t.setRenderTarget(z.map),t.clear());const U=z.getViewport(Le);o.set(r.x*U.x,r.y*U.y,r.x*U.z,r.y*U.w),G.viewport(o)}i=z.getFrustum(Le),y(_,x,he,Q,de,this.type)}z.isPointLightShadow!==!0&&this.type===zr&&b(z,x),z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,t.setRenderTarget(I,N,B)};function b(M,_){const x=e.update(v);h.defines.VSM_SAMPLES!==M.blurSamples&&(h.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new hi(s.x,s.y,{format:Ps,type:bi}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),h.uniforms.shadow_pass.value=M.map.depthTexture,h.uniforms.resolution.value.set(M.map.width,M.map.height),h.uniforms.radius.value=M.radius,t.setRenderTarget(M.mapPass),t.clear(),t.renderBufferDirect(_,null,x,h,v,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,t.setRenderTarget(M.map),t.clear(),t.renderBufferDirect(_,null,x,d,v,null)}function A(M,_,x,I){let N=null;const B=x.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(B!==void 0)N=B;else if(N=x.isPointLight===!0?l:a,t.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const G=N.uuid,J=_.uuid;let O=c[G];O===void 0&&(O={},c[G]=O);let K=O[J];K===void 0&&(K=N.clone(),O[J]=K,_.addEventListener("dispose",w)),N=K}if(N.visible=_.visible,N.wireframe=_.wireframe,I===zr?N.side=_.shadowSide!==null?_.shadowSide:_.side:N.side=_.shadowSide!==null?_.shadowSide:f[_.side],N.alphaMap=_.alphaMap,N.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,N.map=_.map,N.clipShadows=_.clipShadows,N.clippingPlanes=_.clippingPlanes,N.clipIntersection=_.clipIntersection,N.displacementMap=_.displacementMap,N.displacementScale=_.displacementScale,N.displacementBias=_.displacementBias,N.wireframeLinewidth=_.wireframeLinewidth,N.linewidth=_.linewidth,x.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const G=t.properties.get(N);G.light=x}return N}function y(M,_,x,I,N,B){if(M.visible===!1)return;if(M.layers.test(N)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&B===zr)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,M.matrixWorld);const O=e.update(M),K=M.material;if(Array.isArray(K)){const Q=O.groups;for(let z=0,ae=Q.length;z<ae;z++){const q=Q[z],le=K[q.materialIndex];if(le&&le.visible){const de=A(M,le,I,B);M.onBeforeShadow(t,M,_,x,O,de,q),t.renderBufferDirect(x,null,O,de,M,q),M.onAfterShadow(t,M,_,x,O,de,q)}}}else if(K.visible){const Q=A(M,K,I,B);M.onBeforeShadow(t,M,_,x,O,Q,null),t.renderBufferDirect(x,null,O,Q,M,null),M.onAfterShadow(t,M,_,x,O,Q,null)}}const J=M.children;for(let O=0,K=J.length;O<K;O++)y(J[O],_,x,I,N,B)}function w(M){M.target.removeEventListener("dispose",w);for(const x in c){const I=c[x],N=M.target.uuid;N in I&&(I[N].dispose(),delete I[N])}}}function RI(t,e){function n(){let P=!1;const ue=new Ft;let ne=null;const Ae=new Ft(0,0,0,0);return{setMask:function(ye){ne!==ye&&!P&&(t.colorMask(ye,ye,ye,ye),ne=ye)},setLocked:function(ye){P=ye},setClear:function(ye,Me,Xe,at,Se){Se===!0&&(ye*=at,Me*=at,Xe*=at),ue.set(ye,Me,Xe,at),Ae.equals(ue)===!1&&(t.clearColor(ye,Me,Xe,at),Ae.copy(ue))},reset:function(){P=!1,ne=null,Ae.set(-1,0,0,0)}}}function i(){let P=!1,ue=!1,ne=null,Ae=null,ye=null;return{setReversed:function(Me){if(ue!==Me){const Xe=e.get("EXT_clip_control");Me?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),ue=Me;const at=ye;ye=null,this.setClear(at)}},getReversed:function(){return ue},setTest:function(Me){Me?te(t.DEPTH_TEST):we(t.DEPTH_TEST)},setMask:function(Me){ne!==Me&&!P&&(t.depthMask(Me),ne=Me)},setFunc:function(Me){if(ue&&(Me=zT[Me]),Ae!==Me){switch(Me){case su:t.depthFunc(t.NEVER);break;case ru:t.depthFunc(t.ALWAYS);break;case ou:t.depthFunc(t.LESS);break;case So:t.depthFunc(t.LEQUAL);break;case au:t.depthFunc(t.EQUAL);break;case lu:t.depthFunc(t.GEQUAL);break;case cu:t.depthFunc(t.GREATER);break;case uu:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Ae=Me}},setLocked:function(Me){P=Me},setClear:function(Me){ye!==Me&&(ye=Me,ue&&(Me=1-Me),t.clearDepth(Me))},reset:function(){P=!1,ne=null,Ae=null,ye=null,ue=!1}}}function s(){let P=!1,ue=null,ne=null,Ae=null,ye=null,Me=null,Xe=null,at=null,Se=null;return{setTest:function($e){P||($e?te(t.STENCIL_TEST):we(t.STENCIL_TEST))},setMask:function($e){ue!==$e&&!P&&(t.stencilMask($e),ue=$e)},setFunc:function($e,rt,Ue){(ne!==$e||Ae!==rt||ye!==Ue)&&(t.stencilFunc($e,rt,Ue),ne=$e,Ae=rt,ye=Ue)},setOp:function($e,rt,Ue){(Me!==$e||Xe!==rt||at!==Ue)&&(t.stencilOp($e,rt,Ue),Me=$e,Xe=rt,at=Ue)},setLocked:function($e){P=$e},setClear:function($e){Se!==$e&&(t.clearStencil($e),Se=$e)},reset:function(){P=!1,ue=null,ne=null,Ae=null,ye=null,Me=null,Xe=null,at=null,Se=null}}}const r=new n,o=new i,a=new s;let l={};const c=new WeakMap;let u={},f={},h={},d=new WeakMap,m=[],v=null,g=!1,p=null,b=null,A=null,y=null,w=null,M=null,_=null,x=new nt(0,0,0),I=0,N=!1,B=null,G=null,J=null,O=null,K=null;const Q=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,ae=0;const q=t.getParameter(t.VERSION);q.indexOf("WebGL")!==-1?(ae=parseFloat(/^WebGL (\d)/.exec(q)[1]),z=ae>=1):q.indexOf("OpenGL ES")!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),z=ae>=2);let le=null,de={};const Le=t.getParameter(t.SCISSOR_BOX),he=t.getParameter(t.VIEWPORT),U=new Ft().fromArray(Le),k=new Ft().fromArray(he);function Z(P,ue,ne,Ae){const ye=new Uint8Array(4),Me=t.createTexture();t.bindTexture(P,Me),t.texParameteri(P,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(P,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Xe=0;Xe<ne;Xe++)P===t.TEXTURE_3D||P===t.TEXTURE_2D_ARRAY?t.texImage3D(ue,0,t.RGBA,1,1,Ae,0,t.RGBA,t.UNSIGNED_BYTE,ye):t.texImage2D(ue+Xe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ye);return Me}const ge={};ge[t.TEXTURE_2D]=Z(t.TEXTURE_2D,t.TEXTURE_2D,1),ge[t.TEXTURE_CUBE_MAP]=Z(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ge[t.TEXTURE_2D_ARRAY]=Z(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ge[t.TEXTURE_3D]=Z(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(t.DEPTH_TEST),o.setFunc(So),be(!1),pe(tp),te(t.CULL_FACE),ie(sr);function te(P){u[P]!==!0&&(t.enable(P),u[P]=!0)}function we(P){u[P]!==!1&&(t.disable(P),u[P]=!1)}function ft(P,ue){return h[P]!==ue?(t.bindFramebuffer(P,ue),h[P]=ue,P===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=ue),P===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=ue),!0):!1}function R(P,ue){let ne=m,Ae=!1;if(P){ne=d.get(ue),ne===void 0&&(ne=[],d.set(ue,ne));const ye=P.textures;if(ne.length!==ye.length||ne[0]!==t.COLOR_ATTACHMENT0){for(let Me=0,Xe=ye.length;Me<Xe;Me++)ne[Me]=t.COLOR_ATTACHMENT0+Me;ne.length=ye.length,Ae=!0}}else ne[0]!==t.BACK&&(ne[0]=t.BACK,Ae=!0);Ae&&t.drawBuffers(ne)}function L(P){return v!==P?(t.useProgram(P),v=P,!0):!1}const X={[Qs]:t.FUNC_ADD,[uT]:t.FUNC_SUBTRACT,[fT]:t.FUNC_REVERSE_SUBTRACT};X[dT]=t.MIN,X[hT]=t.MAX;const ee={[pT]:t.ZERO,[mT]:t.ONE,[gT]:t.SRC_COLOR,[G_]:t.SRC_ALPHA,[yT]:t.SRC_ALPHA_SATURATE,[ST]:t.DST_COLOR,[vT]:t.DST_ALPHA,[_T]:t.ONE_MINUS_SRC_COLOR,[k_]:t.ONE_MINUS_SRC_ALPHA,[xT]:t.ONE_MINUS_DST_COLOR,[bT]:t.ONE_MINUS_DST_ALPHA,[ET]:t.CONSTANT_COLOR,[MT]:t.ONE_MINUS_CONSTANT_COLOR,[TT]:t.CONSTANT_ALPHA,[AT]:t.ONE_MINUS_CONSTANT_ALPHA};function ie(P,ue,ne,Ae,ye,Me,Xe,at,Se,$e){if(P===sr){g===!0&&(we(t.BLEND),g=!1);return}if(g===!1&&(te(t.BLEND),g=!0),P!==cT){if(P!==p||$e!==N){if((b!==Qs||w!==Qs)&&(t.blendEquation(t.FUNC_ADD),b=Qs,w=Qs),$e)switch(P){case no:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case np:t.blendFunc(t.ONE,t.ONE);break;case ip:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case sp:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:vt("WebGLState: Invalid blending: ",P);break}else switch(P){case no:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case np:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case ip:vt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case sp:vt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:vt("WebGLState: Invalid blending: ",P);break}A=null,y=null,M=null,_=null,x.set(0,0,0),I=0,p=P,N=$e}return}ye=ye||ue,Me=Me||ne,Xe=Xe||Ae,(ue!==b||ye!==w)&&(t.blendEquationSeparate(X[ue],X[ye]),b=ue,w=ye),(ne!==A||Ae!==y||Me!==M||Xe!==_)&&(t.blendFuncSeparate(ee[ne],ee[Ae],ee[Me],ee[Xe]),A=ne,y=Ae,M=Me,_=Xe),(at.equals(x)===!1||Se!==I)&&(t.blendColor(at.r,at.g,at.b,Se),x.copy(at),I=Se),p=P,N=!1}function se(P,ue){P.side===Oi?we(t.CULL_FACE):te(t.CULL_FACE);let ne=P.side===Mn;ue&&(ne=!ne),be(ne),P.blending===no&&P.transparent===!1?ie(sr):ie(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);const Ae=P.stencilWrite;a.setTest(Ae),Ae&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),re(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?te(t.SAMPLE_ALPHA_TO_COVERAGE):we(t.SAMPLE_ALPHA_TO_COVERAGE)}function be(P){B!==P&&(P?t.frontFace(t.CW):t.frontFace(t.CCW),B=P)}function pe(P){P!==aT?(te(t.CULL_FACE),P!==G&&(P===tp?t.cullFace(t.BACK):P===lT?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):we(t.CULL_FACE),G=P}function ve(P){P!==J&&(z&&t.lineWidth(P),J=P)}function re(P,ue,ne){P?(te(t.POLYGON_OFFSET_FILL),(O!==ue||K!==ne)&&(O=ue,K=ne,o.getReversed()&&(ue=-ue,ne=-ne),t.polygonOffset(ue,ne))):we(t.POLYGON_OFFSET_FILL)}function Fe(P){P?te(t.SCISSOR_TEST):we(t.SCISSOR_TEST)}function xe(P){P===void 0&&(P=t.TEXTURE0+Q-1),le!==P&&(t.activeTexture(P),le=P)}function De(P,ue,ne){ne===void 0&&(le===null?ne=t.TEXTURE0+Q-1:ne=le);let Ae=de[ne];Ae===void 0&&(Ae={type:void 0,texture:void 0},de[ne]=Ae),(Ae.type!==P||Ae.texture!==ue)&&(le!==ne&&(t.activeTexture(ne),le=ne),t.bindTexture(P,ue||ge[P]),Ae.type=P,Ae.texture=ue)}function C(){const P=de[le];P!==void 0&&P.type!==void 0&&(t.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Je(){try{t.compressedTexImage2D(...arguments)}catch(P){vt("WebGLState:",P)}}function Ye(){try{t.compressedTexImage3D(...arguments)}catch(P){vt("WebGLState:",P)}}function We(){try{t.texSubImage2D(...arguments)}catch(P){vt("WebGLState:",P)}}function _e(){try{t.texSubImage3D(...arguments)}catch(P){vt("WebGLState:",P)}}function ot(){try{t.compressedTexSubImage2D(...arguments)}catch(P){vt("WebGLState:",P)}}function Pe(){try{t.compressedTexSubImage3D(...arguments)}catch(P){vt("WebGLState:",P)}}function Ve(){try{t.texStorage2D(...arguments)}catch(P){vt("WebGLState:",P)}}function T(){try{t.texStorage3D(...arguments)}catch(P){vt("WebGLState:",P)}}function S(){try{t.texImage2D(...arguments)}catch(P){vt("WebGLState:",P)}}function W(){try{t.texImage3D(...arguments)}catch(P){vt("WebGLState:",P)}}function me(P){return f[P]!==void 0?f[P]:t.getParameter(P)}function fe(P,ue){f[P]!==ue&&(t.pixelStorei(P,ue),f[P]=ue)}function Ee(P){U.equals(P)===!1&&(t.scissor(P.x,P.y,P.z,P.w),U.copy(P))}function Ne(P){k.equals(P)===!1&&(t.viewport(P.x,P.y,P.z,P.w),k.copy(P))}function oe(P,ue){let ne=c.get(ue);ne===void 0&&(ne=new WeakMap,c.set(ue,ne));let Ae=ne.get(P);Ae===void 0&&(Ae=t.getUniformBlockIndex(ue,P.name),t.uniformBlockBinding(ue,Ae,Ae),ne.set(P,Ae))}function ce(P,ue,ne){const ye=c.get(ue).get(P);l[ye]!==ne&&(t.bindBufferBase(t.UNIFORM_BUFFER,ye,ne),l[ye]=ne)}function Te(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},le=null,de={},h={},l={},d=new WeakMap,m=[],v=null,g=!1,p=null,b=null,A=null,y=null,w=null,M=null,_=null,x=new nt(0,0,0),I=0,N=!1,B=null,G=null,J=null,O=null,K=null,U.set(0,0,t.canvas.width,t.canvas.height),k.set(0,0,t.canvas.width,t.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:te,disable:we,bindFramebuffer:ft,drawBuffers:R,useProgram:L,setBlending:ie,setMaterial:se,setFlipSided:be,setCullFace:pe,setLineWidth:ve,setPolygonOffset:re,setScissorTest:Fe,activeTexture:xe,bindTexture:De,unbindTexture:C,compressedTexImage2D:Je,compressedTexImage3D:Ye,texImage2D:S,texImage3D:W,pixelStorei:fe,getParameter:me,updateUBOMapping:oe,uniformBlockBinding:ce,texStorage2D:Ve,texStorage3D:T,texSubImage2D:We,texSubImage3D:_e,compressedTexSubImage2D:ot,compressedTexSubImage3D:Pe,scissor:Ee,viewport:Ne,reset:Te}}function NI(t,e,n,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new et,u=new WeakMap,f=new Set;let h;const d=new WeakMap,m=new Set,v=new FinalizationRegistry(T=>m.delete(T));let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(T,S){return g?new OffscreenCanvas(T,S):il("canvas")}function b(T,S,W){let me=1;const fe=Ve(T);if((fe.width>W||fe.height>W)&&(me=W/Math.max(fe.width,fe.height)),me<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const Ee=Math.floor(me*fe.width),Ne=Math.floor(me*fe.height);h===void 0&&(h=p(Ee,Ne));const oe=S?p(Ee,Ne):h;return oe.width=Ee,oe.height=Ne,oe.getContext("2d").drawImage(T,0,0,Ee,Ne),je("WebGLRenderer: Texture has been resized from ("+fe.width+"x"+fe.height+") to ("+Ee+"x"+Ne+")."),oe}else return"data"in T&&je("WebGLRenderer: Image in DataTexture is too big ("+fe.width+"x"+fe.height+")."),T;return T}function A(T){return T.generateMipmaps}function y(T){t.generateMipmap(T)}function w(T){return T.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?t.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function M(T,S,W,me,fe,Ee=!1){if(T!==null){if(t[T]!==void 0)return t[T];je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Ne;me&&(Ne=e.get("EXT_texture_norm16"),Ne||je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let oe=S;if(S===t.RED&&(W===t.FLOAT&&(oe=t.R32F),W===t.HALF_FLOAT&&(oe=t.R16F),W===t.UNSIGNED_BYTE&&(oe=t.R8),W===t.UNSIGNED_SHORT&&Ne&&(oe=Ne.R16_EXT),W===t.SHORT&&Ne&&(oe=Ne.R16_SNORM_EXT)),S===t.RED_INTEGER&&(W===t.UNSIGNED_BYTE&&(oe=t.R8UI),W===t.UNSIGNED_SHORT&&(oe=t.R16UI),W===t.UNSIGNED_INT&&(oe=t.R32UI),W===t.BYTE&&(oe=t.R8I),W===t.SHORT&&(oe=t.R16I),W===t.INT&&(oe=t.R32I)),S===t.RG&&(W===t.FLOAT&&(oe=t.RG32F),W===t.HALF_FLOAT&&(oe=t.RG16F),W===t.UNSIGNED_BYTE&&(oe=t.RG8),W===t.UNSIGNED_SHORT&&Ne&&(oe=Ne.RG16_EXT),W===t.SHORT&&Ne&&(oe=Ne.RG16_SNORM_EXT)),S===t.RG_INTEGER&&(W===t.UNSIGNED_BYTE&&(oe=t.RG8UI),W===t.UNSIGNED_SHORT&&(oe=t.RG16UI),W===t.UNSIGNED_INT&&(oe=t.RG32UI),W===t.BYTE&&(oe=t.RG8I),W===t.SHORT&&(oe=t.RG16I),W===t.INT&&(oe=t.RG32I)),S===t.RGB_INTEGER&&(W===t.UNSIGNED_BYTE&&(oe=t.RGB8UI),W===t.UNSIGNED_SHORT&&(oe=t.RGB16UI),W===t.UNSIGNED_INT&&(oe=t.RGB32UI),W===t.BYTE&&(oe=t.RGB8I),W===t.SHORT&&(oe=t.RGB16I),W===t.INT&&(oe=t.RGB32I)),S===t.RGBA_INTEGER&&(W===t.UNSIGNED_BYTE&&(oe=t.RGBA8UI),W===t.UNSIGNED_SHORT&&(oe=t.RGBA16UI),W===t.UNSIGNED_INT&&(oe=t.RGBA32UI),W===t.BYTE&&(oe=t.RGBA8I),W===t.SHORT&&(oe=t.RGBA16I),W===t.INT&&(oe=t.RGBA32I)),S===t.RGB&&(W===t.UNSIGNED_SHORT&&Ne&&(oe=Ne.RGB16_EXT),W===t.SHORT&&Ne&&(oe=Ne.RGB16_SNORM_EXT),W===t.UNSIGNED_INT_5_9_9_9_REV&&(oe=t.RGB9_E5),W===t.UNSIGNED_INT_10F_11F_11F_REV&&(oe=t.R11F_G11F_B10F)),S===t.RGBA){const ce=Ee?nl:mt.getTransfer(fe);W===t.FLOAT&&(oe=t.RGBA32F),W===t.HALF_FLOAT&&(oe=t.RGBA16F),W===t.UNSIGNED_BYTE&&(oe=ce===Et?t.SRGB8_ALPHA8:t.RGBA8),W===t.UNSIGNED_SHORT&&Ne&&(oe=Ne.RGBA16_EXT),W===t.SHORT&&Ne&&(oe=Ne.RGBA16_SNORM_EXT),W===t.UNSIGNED_SHORT_4_4_4_4&&(oe=t.RGBA4),W===t.UNSIGNED_SHORT_5_5_5_1&&(oe=t.RGB5_A1)}return(oe===t.R16F||oe===t.R32F||oe===t.RG16F||oe===t.RG32F||oe===t.RGBA16F||oe===t.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function _(T,S){let W;return T?S===null||S===vi||S===mr?W=t.DEPTH24_STENCIL8:S===ui?W=t.DEPTH32F_STENCIL8:S===yo&&(W=t.DEPTH24_STENCIL8,je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===vi||S===mr?W=t.DEPTH_COMPONENT24:S===ui?W=t.DEPTH_COMPONENT32F:S===yo&&(W=t.DEPTH_COMPONENT16),W}function x(T,S){return A(T)===!0||T.isFramebufferTexture&&T.minFilter!==en&&T.minFilter!==En?Math.log2(Math.max(S.width,S.height))+1:T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?S.mipmaps.length:1}function I(T){const S=new WeakRef(T);i.get(T).__ref=S,m.add(S),v.register(T,S,S)}function N(T){const S=i.get(T).__ref;S!==void 0&&(m.delete(S),v.unregister(S))}function B(T){J(T.target)}function G(T){O(T.target)}function J(T){T.removeEventListener("dispose",B),N(T),Q(T),T.isVideoTexture&&u.delete(T),T.isHTMLTexture&&f.delete(T)}function O(T){T.removeEventListener("dispose",G),N(T),ae(T)}function K(){for(const T of m){const S=T.deref();S!==void 0&&(S.isRenderTarget===!0?O(S):J(S))}m.clear(),f.clear()}function Q(T){const S=i.get(T);if(S.__webglInit===void 0)return;const W=T.source,me=d.get(W);if(me){const fe=me[S.__cacheKey];fe.usedTimes--,fe.usedTimes===0&&z(T),Object.keys(me).length===0&&d.delete(W)}i.remove(T)}function z(T){const S=i.get(T);t.deleteTexture(S.__webglTexture);const W=T.source,me=d.get(W);delete me[S.__cacheKey],o.memory.textures--}function ae(T){const S=i.get(T);S.__depthDisposeCallback&&S.__depthDisposeCallback();const W=T.depthTexture;if(W&&W.renderTarget===T&&J(W),T.isWebGLCubeRenderTarget)for(let fe=0;fe<6;fe++){if(Array.isArray(S.__webglFramebuffer[fe]))for(let Ee=0;Ee<S.__webglFramebuffer[fe].length;Ee++)t.deleteFramebuffer(S.__webglFramebuffer[fe][Ee]);else t.deleteFramebuffer(S.__webglFramebuffer[fe]);S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer[fe])}else{if(Array.isArray(S.__webglFramebuffer))for(let fe=0;fe<S.__webglFramebuffer.length;fe++)t.deleteFramebuffer(S.__webglFramebuffer[fe]);else t.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&t.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let fe=0;fe<S.__webglColorRenderbuffer.length;fe++)S.__webglColorRenderbuffer[fe]&&t.deleteRenderbuffer(S.__webglColorRenderbuffer[fe]);S.__webglDepthRenderbuffer&&t.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const me=T.textures;for(let fe=0,Ee=me.length;fe<Ee;fe++){const Ne=i.get(me[fe]);Ne.__webglTexture&&(t.deleteTexture(Ne.__webglTexture),o.memory.textures--),i.remove(me[fe])}i.remove(T)}let q=0;function le(){q=0}function de(){return q}function Le(T){q=T}function he(){const T=q;return T>=s.maxTextures&&je("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+s.maxTextures),q+=1,T}function U(T){const S=[];return S.push(T.wrapS),S.push(T.wrapT),S.push(T.wrapR||0),S.push(T.magFilter),S.push(T.minFilter),S.push(T.anisotropy),S.push(T.internalFormat),S.push(T.format),S.push(T.type),S.push(T.generateMipmaps),S.push(T.mipmapsAutoUpdate),S.push(T.premultiplyAlpha),S.push(T.flipY),S.push(T.unpackAlignment),S.push(T.colorSpace),S.join()}function k(T,S){const W=i.get(T);if(T.isVideoTexture&&ot(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&W.__version!==T.version){const me=T.image;if(me===null)je("WebGLRenderer: Texture marked for update but no image data found.");else if(me.complete===!1)je("WebGLRenderer: Texture marked for update but image is incomplete");else{se(W,T,S);return}}else T.isExternalTexture&&(W.__webglTexture=T.sourceTexture?T.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,W.__webglTexture,t.TEXTURE0+S)}function Z(T,S){const W=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&W.__version!==T.version){se(W,T,S);return}else T.isExternalTexture&&(W.__webglTexture=T.sourceTexture?T.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,W.__webglTexture,t.TEXTURE0+S)}function ge(T,S){const W=i.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&W.__version!==T.version){se(W,T,S);return}n.bindTexture(t.TEXTURE_3D,W.__webglTexture,t.TEXTURE0+S)}function te(T,S){const W=i.get(T);if(T.version>0&&W.__version!==T.version){be(W,T,S);return}n.bindTexture(t.TEXTURE_CUBE_MAP,W.__webglTexture,t.TEXTURE0+S)}const we={[fu]:t.REPEAT,[Fi]:t.CLAMP_TO_EDGE,[du]:t.MIRRORED_REPEAT},ft={[en]:t.NEAREST,[NT]:t.NEAREST_MIPMAP_NEAREST,[Ko]:t.NEAREST_MIPMAP_LINEAR,[En]:t.LINEAR,[nc]:t.LINEAR_MIPMAP_NEAREST,[rs]:t.LINEAR_MIPMAP_LINEAR},R={[PT]:t.NEVER,[r0]:t.ALWAYS,[DT]:t.LESS,[i0]:t.LEQUAL,[UT]:t.EQUAL,[s0]:t.GEQUAL,[OT]:t.GREATER,[FT]:t.NOTEQUAL};function L(T,S){if(S.type===ui&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===En||S.magFilter===nc||S.magFilter===Ko||S.magFilter===rs||S.minFilter===En||S.minFilter===nc||S.minFilter===Ko||S.minFilter===rs)&&je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(T,t.TEXTURE_WRAP_S,we[S.wrapS]),t.texParameteri(T,t.TEXTURE_WRAP_T,we[S.wrapT]),(T===t.TEXTURE_3D||T===t.TEXTURE_2D_ARRAY)&&t.texParameteri(T,t.TEXTURE_WRAP_R,we[S.wrapR]),t.texParameteri(T,t.TEXTURE_MAG_FILTER,ft[S.magFilter]),t.texParameteri(T,t.TEXTURE_MIN_FILTER,ft[S.minFilter]),S.compareFunction&&(t.texParameteri(T,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(T,t.TEXTURE_COMPARE_FUNC,R[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===en||S.minFilter!==Ko&&S.minFilter!==rs||S.type===ui&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");t.texParameterf(T,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function X(T,S){let W=!1;T.__webglInit===void 0&&(T.__webglInit=!0,S.addEventListener("dispose",B),I(S));const me=S.source;let fe=d.get(me);fe===void 0&&(fe={},d.set(me,fe));const Ee=U(S);if(Ee!==T.__cacheKey){fe[Ee]===void 0&&(fe[Ee]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,W=!0),fe[Ee].usedTimes++;const Ne=fe[T.__cacheKey];Ne!==void 0&&(fe[T.__cacheKey].usedTimes--,Ne.usedTimes===0&&z(S)),T.__cacheKey=Ee,T.__webglTexture=fe[Ee].texture}return W}function ee(T,S,W){return Math.floor(Math.floor(T/W)/S)}function ie(T,S,W,me){const Ee=T.updateRanges;if(Ee.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,S.width,S.height,W,me,S.data);else{Ee.sort((P,ue)=>P.start-ue.start);let Ne=0;for(let P=1;P<Ee.length;P++){const ue=Ee[Ne],ne=Ee[P],Ae=ue.start+ue.count,ye=ee(ne.start,S.width,4),Me=ee(ue.start,S.width,4);ne.start<=Ae+1&&ye===Me&&ee(ne.start+ne.count-1,S.width,4)===ye?ue.count=Math.max(ue.count,ne.start+ne.count-ue.start):(++Ne,Ee[Ne]=ne)}Ee.length=Ne+1;const oe=n.getParameter(t.UNPACK_ROW_LENGTH),ce=n.getParameter(t.UNPACK_SKIP_PIXELS),Te=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,S.width);for(let P=0,ue=Ee.length;P<ue;P++){const ne=Ee[P],Ae=Math.floor(ne.start/4),ye=Math.ceil(ne.count/4),Me=Ae%S.width,Xe=Math.floor(Ae/S.width),at=ye,Se=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Me),n.pixelStorei(t.UNPACK_SKIP_ROWS,Xe),n.texSubImage2D(t.TEXTURE_2D,0,Me,Xe,at,Se,W,me,S.data)}T.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,oe),n.pixelStorei(t.UNPACK_SKIP_PIXELS,ce),n.pixelStorei(t.UNPACK_SKIP_ROWS,Te)}}function se(T,S,W){let me=t.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(me=t.TEXTURE_2D_ARRAY),S.isData3DTexture&&(me=t.TEXTURE_3D);const fe=X(T,S),Ee=S.source;n.bindTexture(me,T.__webglTexture,t.TEXTURE0+W);const Ne=i.get(Ee);if(Ee.version!==Ne.__version||fe===!0){if(n.activeTexture(t.TEXTURE0+W),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const Se=mt.getPrimaries(mt.workingColorSpace),$e=S.colorSpace===ss?null:mt.getPrimaries(S.colorSpace),rt=S.colorSpace===ss||Se===$e?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,rt)}n.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment);let ce=b(S.image,!1,s.maxTextureSize);ce=Pe(S,ce);const Te=r.convert(S.format,S.colorSpace),P=r.convert(S.type);let ue=M(S.internalFormat,Te,P,S.normalized,S.colorSpace,S.isVideoTexture);L(me,S);let ne;const Ae=S.mipmaps,ye=S.isVideoTexture!==!0,Me=Ne.__version===void 0||fe===!0,Xe=Ee.dataReady,at=x(S,ce);if(S.isDepthTexture)ue=_(S.format===os,S.type),Me&&(ye?n.texStorage2D(t.TEXTURE_2D,1,ue,ce.width,ce.height):n.texImage2D(t.TEXTURE_2D,0,ue,ce.width,ce.height,0,Te,P,null));else if(S.isDataTexture)if(Ae.length>0){ye&&Me&&n.texStorage2D(t.TEXTURE_2D,at,ue,Ae[0].width,Ae[0].height);for(let Se=0,$e=Ae.length;Se<$e;Se++)ne=Ae[Se],ye?Xe&&n.texSubImage2D(t.TEXTURE_2D,Se,0,0,ne.width,ne.height,Te,P,ne.data):n.texImage2D(t.TEXTURE_2D,Se,ue,ne.width,ne.height,0,Te,P,ne.data);S.generateMipmaps=!1}else ye?(Me&&n.texStorage2D(t.TEXTURE_2D,at,ue,ce.width,ce.height),Xe&&ie(S,ce,Te,P)):n.texImage2D(t.TEXTURE_2D,0,ue,ce.width,ce.height,0,Te,P,ce.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ye&&Me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,at,ue,Ae[0].width,Ae[0].height,ce.depth);for(let Se=0,$e=Ae.length;Se<$e;Se++)if(ne=Ae[Se],S.format!==fi)if(Te!==null)if(ye){if(Xe)if(S.layerUpdates.size>0){const rt=Gp(ne.width,ne.height,S.format,S.type);for(const Ue of S.layerUpdates){const yt=ne.data.subarray(Ue*rt/ne.data.BYTES_PER_ELEMENT,(Ue+1)*rt/ne.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,Se,0,0,Ue,ne.width,ne.height,1,Te,yt)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,Se,0,0,0,ne.width,ne.height,ce.depth,Te,ne.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,Se,ue,ne.width,ne.height,ce.depth,0,ne.data,0,0);else je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ye?Xe&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,Se,0,0,0,ne.width,ne.height,ce.depth,Te,P,ne.data):n.texImage3D(t.TEXTURE_2D_ARRAY,Se,ue,ne.width,ne.height,ce.depth,0,Te,P,ne.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{ye&&Me&&n.texStorage2D(t.TEXTURE_2D,at,ue,Ae[0].width,Ae[0].height);for(let Se=0,$e=Ae.length;Se<$e;Se++)ne=Ae[Se],S.format!==fi?Te!==null?ye?Xe&&n.compressedTexSubImage2D(t.TEXTURE_2D,Se,0,0,ne.width,ne.height,Te,ne.data):n.compressedTexImage2D(t.TEXTURE_2D,Se,ue,ne.width,ne.height,0,ne.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ye?Xe&&n.texSubImage2D(t.TEXTURE_2D,Se,0,0,ne.width,ne.height,Te,P,ne.data):n.texImage2D(t.TEXTURE_2D,Se,ue,ne.width,ne.height,0,Te,P,ne.data)}else if(S.isDataArrayTexture)if(ye){if(Me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,at,ue,ce.width,ce.height,ce.depth),Xe)if(S.layerUpdates.size>0){const Se=Gp(ce.width,ce.height,S.format,S.type);for(const $e of S.layerUpdates){const rt=ce.data.subarray($e*Se/ce.data.BYTES_PER_ELEMENT,($e+1)*Se/ce.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,$e,ce.width,ce.height,1,Te,P,rt)}S.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,Te,P,ce.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,ue,ce.width,ce.height,ce.depth,0,Te,P,ce.data);else if(S.isData3DTexture)ye?(Me&&n.texStorage3D(t.TEXTURE_3D,at,ue,ce.width,ce.height,ce.depth),Xe&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,Te,P,ce.data)):n.texImage3D(t.TEXTURE_3D,0,ue,ce.width,ce.height,ce.depth,0,Te,P,ce.data);else if(S.isFramebufferTexture){if(Me)if(ye)n.texStorage2D(t.TEXTURE_2D,at,ue,ce.width,ce.height);else{let Se=ce.width,$e=ce.height;for(let rt=0;rt<at;rt++)n.texImage2D(t.TEXTURE_2D,rt,ue,Se,$e,0,Te,P,null),Se>>=1,$e>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in t){const Se=t.canvas;if(Se.hasAttribute("layoutsubtree")||Se.setAttribute("layoutsubtree","true"),ce.parentNode!==Se){Se.appendChild(ce),f.add(S),Se.onpaint=$e=>{const rt=$e.changedElements;for(const Ue of f)rt.includes(Ue.image)&&(Ue.needsUpdate=!0)},Se.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,ce);else{const rt=t.RGBA,Ue=t.RGBA,yt=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,rt,Ue,yt,ce)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ae.length>0){if(ye&&Me){const Se=Ve(Ae[0]);n.texStorage2D(t.TEXTURE_2D,at,ue,Se.width,Se.height)}for(let Se=0,$e=Ae.length;Se<$e;Se++)ne=Ae[Se],ye?Xe&&n.texSubImage2D(t.TEXTURE_2D,Se,0,0,Te,P,ne):n.texImage2D(t.TEXTURE_2D,Se,ue,Te,P,ne);S.generateMipmaps=!1}else if(ye){if(Me){const Se=Ve(ce);n.texStorage2D(t.TEXTURE_2D,at,ue,Se.width,Se.height)}Xe&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Te,P,ce)}else n.texImage2D(t.TEXTURE_2D,0,ue,Te,P,ce);A(S)&&S.mipmapsAutoUpdate===!0&&y(me),Ne.__version=Ee.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function be(T,S,W){if(S.image.length!==6)return;const me=X(T,S),fe=S.source;n.bindTexture(t.TEXTURE_CUBE_MAP,T.__webglTexture,t.TEXTURE0+W);const Ee=i.get(fe);if(fe.version!==Ee.__version||me===!0){n.activeTexture(t.TEXTURE0+W);const Ne=mt.getPrimaries(mt.workingColorSpace),oe=S.colorSpace===ss?null:mt.getPrimaries(S.colorSpace),ce=S.colorSpace===ss||Ne===oe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const Te=S.isCompressedTexture||S.image[0].isCompressedTexture,P=S.image[0]&&S.image[0].isDataTexture,ue=[];for(let Ue=0;Ue<6;Ue++)!Te&&!P?ue[Ue]=b(S.image[Ue],!0,s.maxCubemapSize):ue[Ue]=P?S.image[Ue].image:S.image[Ue],ue[Ue]=Pe(S,ue[Ue]);const ne=ue[0],Ae=r.convert(S.format,S.colorSpace),ye=r.convert(S.type);let Me=M(S.internalFormat,Ae,ye,S.normalized,S.colorSpace);const Xe=S.isVideoTexture!==!0,at=Ee.__version===void 0||me===!0,Se=fe.dataReady;let $e=x(S,ne);L(t.TEXTURE_CUBE_MAP,S);let rt;if(S.isDepthTexture){if(Me=_(S.format===os,S.type),at)if(Xe)n.texStorage2D(t.TEXTURE_CUBE_MAP,1,Me,ne.width,ne.height);else for(let Ue=0;Ue<6;Ue++)n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,Me,ne.width,ne.height,0,Ae,ye,null)}else if(Te){Xe&&at&&n.texStorage2D(t.TEXTURE_CUBE_MAP,$e,Me,ne.width,ne.height);for(let Ue=0;Ue<6;Ue++){rt=ue[Ue].mipmaps;for(let yt=0;yt<rt.length;yt++){const Zt=rt[yt];S.format!==fi?Ae!==null?Xe?Se&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt,0,0,Zt.width,Zt.height,Ae,Zt.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt,Me,Zt.width,Zt.height,0,Zt.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?Se&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt,0,0,Zt.width,Zt.height,Ae,ye,Zt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt,Me,Zt.width,Zt.height,0,Ae,ye,Zt.data)}}}else{if(rt=S.mipmaps,Xe&&at){rt.length>0&&$e++;const Ue=Ve(ue[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,$e,Me,Ue.width,Ue.height)}for(let Ue=0;Ue<6;Ue++)if(P){Xe?Se&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,0,0,ue[Ue].width,ue[Ue].height,Ae,ye,ue[Ue].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,Me,ue[Ue].width,ue[Ue].height,0,Ae,ye,ue[Ue].data);for(let yt=0;yt<rt.length;yt++){const Ki=rt[yt].image[Ue].image;Xe?Se&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt+1,0,0,Ki.width,Ki.height,Ae,ye,Ki.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt+1,Me,Ki.width,Ki.height,0,Ae,ye,Ki.data)}}else{Xe?Se&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,0,0,Ae,ye,ue[Ue]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,Me,Ae,ye,ue[Ue]);for(let yt=0;yt<rt.length;yt++){const Zt=rt[yt];Xe?Se&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt+1,0,0,Ae,ye,Zt.image[Ue]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,yt+1,Me,Ae,ye,Zt.image[Ue])}}}A(S)&&S.mipmapsAutoUpdate===!0&&y(t.TEXTURE_CUBE_MAP),Ee.__version=fe.version,S.onUpdate&&S.onUpdate(S)}T.__version=S.version}function pe(T,S,W,me,fe,Ee){const Ne=r.convert(W.format,W.colorSpace),oe=r.convert(W.type),ce=M(W.internalFormat,Ne,oe,W.normalized,W.colorSpace),Te=i.get(S),P=i.get(W);if(P.__renderTarget=S,!Te.__hasExternalTextures){const ue=Math.max(1,S.width>>Ee),ne=Math.max(1,S.height>>Ee);fe===t.TEXTURE_3D||fe===t.TEXTURE_2D_ARRAY?n.texImage3D(fe,Ee,ce,ue,ne,S.depth,0,Ne,oe,null):n.texImage2D(fe,Ee,ce,ue,ne,0,Ne,oe,null)}n.bindFramebuffer(t.FRAMEBUFFER,T),_e(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,me,fe,P.__webglTexture,0,We(S)):(fe===t.TEXTURE_2D||fe>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&fe<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,me,fe,P.__webglTexture,Ee),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ve(T,S,W){if(t.bindRenderbuffer(t.RENDERBUFFER,T),S.depthBuffer){const me=S.depthTexture,fe=me&&me.isDepthTexture?me.type:null,Ee=_(S.stencilBuffer,fe),Ne=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;_e(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,We(S),Ee,S.width,S.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,We(S),Ee,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,Ee,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ne,t.RENDERBUFFER,T)}else{const me=S.textures;for(let fe=0;fe<me.length;fe++){const Ee=me[fe],Ne=r.convert(Ee.format,Ee.colorSpace),oe=r.convert(Ee.type),ce=M(Ee.internalFormat,Ne,oe,Ee.normalized,Ee.colorSpace);_e(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,We(S),ce,S.width,S.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,We(S),ce,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,ce,S.width,S.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function re(T,S,W){const me=S.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,T),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const fe=i.get(S.depthTexture);fe.__renderTarget=S;const Ee=me?S.depthTexture.image[0]:S.depthTexture.image;(!fe.__webglTexture||Ee.width!==S.width||Ee.height!==S.height)&&(Ee.width=S.width,Ee.height=S.height,S.depthTexture.needsUpdate=!0),me?te(S.depthTexture,0):k(S.depthTexture,0);const Ne=fe.__webglTexture,oe=We(S),ce=me?t.TEXTURE_CUBE_MAP_POSITIVE_X+W:t.TEXTURE_2D,Te=S.depthTexture.format===os?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(S.depthTexture.format===hs)_e(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Te,ce,Ne,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,Te,ce,Ne,0);else if(S.depthTexture.format===os)_e(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Te,ce,Ne,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,Te,ce,Ne,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Fe(T){const S=i.get(T),W=T.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==T.depthTexture){const me=T.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),me){const fe=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,me.removeEventListener("dispose",fe)};me.addEventListener("dispose",fe),S.__depthDisposeCallback=fe}S.__boundDepthTexture=me}if(T.depthTexture&&!S.__autoAllocateDepthBuffer)if(W)for(let me=0;me<6;me++)re(S.__webglFramebuffer[me],T,me);else T.texture.mipmaps.length>0?re(S.__webglFramebuffer[0],T,0):re(S.__webglFramebuffer,T,0);else if(W){S.__webglDepthbuffer=[];for(let me=0;me<6;me++)if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[me]),S.__webglDepthbuffer[me]===void 0)S.__webglDepthbuffer[me]=t.createRenderbuffer(),ve(S.__webglDepthbuffer[me],T,!1);else{const fe=T.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=S.__webglDepthbuffer[me];t.bindRenderbuffer(t.RENDERBUFFER,Ee),t.framebufferRenderbuffer(t.FRAMEBUFFER,fe,t.RENDERBUFFER,Ee)}}else if(T.texture.mipmaps.length>0?n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=t.createRenderbuffer(),ve(S.__webglDepthbuffer,T,!1);else{const fe=T.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=S.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Ee),t.framebufferRenderbuffer(t.FRAMEBUFFER,fe,t.RENDERBUFFER,Ee)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function xe(T,S,W){const me=i.get(T);S!==void 0&&pe(me.__webglFramebuffer,T,T.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),W!==void 0&&Fe(T)}function De(T){const S=T.texture,W=i.get(T),me=i.get(S);T.addEventListener("dispose",G),I(T);const fe=T.textures,Ee=T.isWebGLCubeRenderTarget===!0,Ne=fe.length>1;if(Ne||(me.__webglTexture===void 0&&(me.__webglTexture=t.createTexture()),me.__version=S.version,o.memory.textures++),Ee){W.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(S.mipmaps.length>0){W.__webglFramebuffer[oe]=[];for(let ce=0;ce<S.mipmaps.length;ce++)W.__webglFramebuffer[oe][ce]=t.createFramebuffer()}else W.__webglFramebuffer[oe]=t.createFramebuffer()}else{if(S.mipmaps.length>0){W.__webglFramebuffer=[];for(let oe=0;oe<S.mipmaps.length;oe++)W.__webglFramebuffer[oe]=t.createFramebuffer()}else W.__webglFramebuffer=t.createFramebuffer();if(Ne)for(let oe=0,ce=fe.length;oe<ce;oe++){const Te=i.get(fe[oe]);Te.__webglTexture===void 0&&(Te.__webglTexture=t.createTexture(),o.memory.textures++)}if(T.samples>0&&_e(T)===!1){W.__webglMultisampledFramebuffer=t.createFramebuffer(),W.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let oe=0;oe<fe.length;oe++){const ce=fe[oe];W.__webglColorRenderbuffer[oe]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,W.__webglColorRenderbuffer[oe]);const Te=r.convert(ce.format,ce.colorSpace),P=r.convert(ce.type),ue=M(ce.internalFormat,Te,P,ce.normalized,ce.colorSpace,T.isXRRenderTarget===!0),ne=We(T);t.renderbufferStorageMultisample(t.RENDERBUFFER,ne,ue,T.width,T.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+oe,t.RENDERBUFFER,W.__webglColorRenderbuffer[oe])}t.bindRenderbuffer(t.RENDERBUFFER,null),T.depthBuffer&&(W.__webglDepthRenderbuffer=t.createRenderbuffer(),ve(W.__webglDepthRenderbuffer,T,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Ee){n.bindTexture(t.TEXTURE_CUBE_MAP,me.__webglTexture),L(t.TEXTURE_CUBE_MAP,S);for(let oe=0;oe<6;oe++)if(S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)pe(W.__webglFramebuffer[oe][ce],T,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ce);else pe(W.__webglFramebuffer[oe],T,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);A(S)?y(t.TEXTURE_CUBE_MAP):S.mipmaps.length>0&&t.texParameteri(t.TEXTURE_CUBE_MAP,t.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),n.unbindTexture()}else if(Ne){for(let oe=0,ce=fe.length;oe<ce;oe++){const Te=fe[oe],P=i.get(Te);let ue=t.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ue=T.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ue,P.__webglTexture),L(ue,Te),pe(W.__webglFramebuffer,T,Te,t.COLOR_ATTACHMENT0+oe,ue,0),A(Te)&&y(ue)}n.unbindTexture()}else{let oe=t.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(oe=T.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(oe,me.__webglTexture),L(oe,S),S.mipmaps.length>0)for(let ce=0;ce<S.mipmaps.length;ce++)pe(W.__webglFramebuffer[ce],T,S,t.COLOR_ATTACHMENT0,oe,ce);else pe(W.__webglFramebuffer,T,S,t.COLOR_ATTACHMENT0,oe,0);A(S)?y(oe):S.mipmaps.length>0&&t.texParameteri(oe,t.TEXTURE_MAX_LEVEL,S.mipmaps.length-1),n.unbindTexture()}T.depthBuffer&&Fe(T)}function C(T){const S=T.textures;for(let W=0,me=S.length;W<me;W++){const fe=S[W];if(A(fe)&&fe.mipmapsAutoUpdate===!0){const Ee=w(T),Ne=i.get(fe).__webglTexture;n.bindTexture(Ee,Ne),y(Ee),n.unbindTexture()}}}const Je=[];function Ye(T){if(T.samples>0){if(_e(T)===!1){const S=T.textures,W=T.width,me=T.height;let fe=t.COLOR_BUFFER_BIT;const Ee=T.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ne=i.get(T),oe=S.length>1;if(oe)for(let Te=0;Te<S.length;Te++)n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),T.texture.mipmaps.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Te=0;Te<S.length;Te++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(fe|=t.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(fe|=t.STENCIL_BUFFER_BIT)),oe){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ne.__webglColorRenderbuffer[Te]);const P=i.get(S[Te]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,P,0)}t.blitFramebuffer(0,0,W,me,0,0,W,me,fe,t.NEAREST),l===!0&&(Je.length=0,Je.push(t.COLOR_ATTACHMENT0+Te),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&Je.push(Ee),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Je))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),oe)for(let Te=0;Te<S.length;Te++){n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.RENDERBUFFER,Ne.__webglColorRenderbuffer[Te]);const P=i.get(S[Te]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Te,t.TEXTURE_2D,P,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){const S=T.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[S])}}}function We(T){return Math.min(s.maxSamples,T.samples)}function _e(T){const S=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function ot(T){const S=o.render.frame;u.get(T)!==S&&(u.set(T,S),T.update())}function Pe(T,S){const W=T.colorSpace,me=T.format,fe=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||W!==Eo&&W!==ss&&(mt.getTransfer(W)===Et?(me!==fi||fe!==Rn)&&je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):vt("WebGLTextures: Unsupported texture color space:",W)),S}function Ve(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=he,this.resetTextureUnits=le,this.getTextureUnits=de,this.setTextureUnits=Le,this.setTexture2D=k,this.setTexture2DArray=Z,this.setTexture3D=ge,this.setTextureCube=te,this.rebindTextures=xe,this.setupRenderTarget=De,this.updateRenderTargetMipmap=C,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=_e,this.dispose=K}function II(t,e){function n(i,s=ss){let r;const o=mt.getTransfer(s);if(i===Rn)return t.UNSIGNED_BYTE;if(i===kf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===zf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===j_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Q_)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===J_)return t.BYTE;if(i===q_)return t.SHORT;if(i===yo)return t.UNSIGNED_SHORT;if(i===Gf)return t.INT;if(i===vi)return t.UNSIGNED_INT;if(i===ui)return t.FLOAT;if(i===bi)return t.HALF_FLOAT;if(i===e0)return t.ALPHA;if(i===t0)return t.RGB;if(i===fi)return t.RGBA;if(i===hs)return t.DEPTH_COMPONENT;if(i===os)return t.DEPTH_STENCIL;if(i===n0)return t.RED;if(i===Hf)return t.RED_INTEGER;if(i===Ps)return t.RG;if(i===Wf)return t.RG_INTEGER;if(i===Xf)return t.RGBA_INTEGER;if(i===Ua||i===Oa||i===Fa||i===Ba)if(o===Et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ua)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ua)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Oa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Fa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ba)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===hu||i===pu||i===mu||i===gu)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===hu)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pu)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mu)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gu)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_u||i===vu||i===bu||i===Su||i===xu||i===Qa||i===yu)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===_u||i===vu)return o===Et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===bu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Su)return r.COMPRESSED_R11_EAC;if(i===xu)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Qa)return r.COMPRESSED_RG11_EAC;if(i===yu)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Eu||i===Mu||i===Tu||i===Au||i===wu||i===Ru||i===Nu||i===Iu||i===Cu||i===Lu||i===Pu||i===Du||i===Uu||i===Ou)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Eu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Mu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Tu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Au)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ru)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Nu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Iu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Lu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Du)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Uu)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ou)return o===Et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Fu||i===Bu||i===Vu)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Fu)return o===Et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Bu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gu||i===ku||i===el||i===zu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Gu)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ku)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===el)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===mr?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const CI=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,LI=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PI{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new b0(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Ds({vertexShader:CI,fragmentShader:LI,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new an(new Oo(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class DI extends ms{constructor(e,n){super();const i=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,m=null;const v=typeof XRWebGLBinding<"u",g=new PI,p={},b=n.getContextAttributes();let A=null,y=null;const w=[],M=[],_=new et;let x=null,I=null;const N=new Xn;N.viewport=new Ft;const B=new Xn;B.viewport=new Ft;const G=[N,B],J=new WA;let O=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let k=w[U];return k===void 0&&(k=new cc,w[U]=k),k.getTargetRaySpace()},this.getControllerGrip=function(U){let k=w[U];return k===void 0&&(k=new cc,w[U]=k),k.getGripSpace()},this.getHand=function(U){let k=w[U];return k===void 0&&(k=new cc,w[U]=k),k.getHandSpace()};function Q(U){const k=M.indexOf(U.inputSource);if(k===-1)return;const Z=w[k];Z!==void 0&&(Z.update(U.inputSource,U.frame,c||o),Z.dispatchEvent({type:U.type,data:U.inputSource}))}function z(){s.removeEventListener("select",Q),s.removeEventListener("selectstart",Q),s.removeEventListener("selectend",Q),s.removeEventListener("squeeze",Q),s.removeEventListener("squeezestart",Q),s.removeEventListener("squeezeend",Q),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",ae);for(let U=0;U<w.length;U++){const k=M[U];k!==null&&(M[U]=null,w[U].disconnect(k))}O=null,K=null,g.reset();for(const U in p)delete p[U];if(e.setRenderTarget(A),d=null,h=null,f=null,s=null,y=null,he.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(_.width,_.height,!1),I!==null){const U=I.camera;U.fov=I.fov,U.zoom=I.zoom,U.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,i.isPresenting===!0&&je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,i.isPresenting===!0&&je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,n)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",Q),s.addEventListener("selectstart",Q),s.addEventListener("selectend",Q),s.addEventListener("squeeze",Q),s.addEventListener("squeezestart",Q),s.addEventListener("squeezeend",Q),s.addEventListener("end",z),s.addEventListener("inputsourceschange",ae),b.xrCompatible!==!0&&await n.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Z=null,ge=null,te=null;b.depth&&(te=b.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Z=b.stencil?os:hs,ge=b.stencil?mr:vi);const we={colorFormat:n.RGBA8,depthFormat:te,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(we),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new hi(h.textureWidth,h.textureHeight,{format:fi,type:Rn,depthTexture:new gr(h.textureWidth,h.textureHeight,ge,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const Z={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,n,Z),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new hi(d.framebufferWidth,d.framebufferHeight,{format:fi,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),he.setContext(s),he.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ae(U){for(let k=0;k<U.removed.length;k++){const Z=U.removed[k],ge=M.indexOf(Z);ge>=0&&(M[ge]=null,w[ge].disconnect(Z))}for(let k=0;k<U.added.length;k++){const Z=U.added[k];let ge=M.indexOf(Z);if(ge===-1){for(let we=0;we<w.length;we++)if(we>=M.length){M.push(Z),ge=we;break}else if(M[we]===null){M[we]=Z,ge=we;break}if(ge===-1)break}const te=w[ge];te&&te.connect(Z)}}function q(U,k){k===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(k.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;let k=U.near,Z=U.far;g.texture!==null&&(g.depthNear>0&&(k=g.depthNear),g.depthFar>0&&(Z=g.depthFar)),J.near=B.near=N.near=k,J.far=B.far=N.far=Z,(O!==J.near||K!==J.far)&&(s.updateRenderState({depthNear:J.near,depthFar:J.far}),O=J.near,K=J.far),J.layers.mask=U.layers.mask|6,N.layers.mask=J.layers.mask&-5,B.layers.mask=J.layers.mask&-3;const ge=U.parent,te=J.cameras;q(J,ge);for(let we=0;we<te.length;we++)q(te[we],ge);J.projectionMatrix.copy(N.projectionMatrix),J.projectionMatrixInverse.copy(N.projectionMatrixInverse),I===null&&U.isPerspectiveCamera&&(I={camera:U,fov:U.fov,zoom:U.zoom}),le(U,J,ge)};function le(U,k,Z){Z===null?U.matrix.copy(k.matrixWorld):(U.matrix.copy(Z.matrixWorld),U.matrix.invert(),U.matrix.multiply(k.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(k.projectionMatrix),U.projectionMatrixInverse.copy(k.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=To*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return J},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(U){l=U,h!==null&&(h.fixedFoveation=U),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=U)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(J)},this.getCameraTexture=function(U){return p[U]};let de=null;function Le(U,k){if(u=k.getViewerPose(c||o),m=k,u!==null){const Z=u.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let ge=!1;Z.length!==J.cameras.length&&(J.cameras.length=0,ge=!0);for(let R=0;R<Z.length;R++){const L=Z[R];let X=null;if(d!==null)X=d.getViewport(L);else{const ie=f.getViewSubImage(h,L);X=ie.viewport,R===0&&(e.setRenderTargetTextures(y,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(y))}let ee=G[R];ee===void 0&&(ee=new Xn,ee.layers.enable(R),ee.viewport=new Ft,G[R]=ee),ee.matrix.fromArray(L.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(L.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(X.x,X.y,X.width,X.height),R===0&&(J.matrix.copy(ee.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale)),ge===!0&&J.cameras.push(ee)}const te=s.enabledFeatures;if(te&&te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const R=f.getDepthInformation(Z[0]);R&&R.isValid&&R.texture&&g.init(R,s.renderState)}if(te&&te.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let R=0;R<Z.length;R++){const L=Z[R].camera;if(L){let X=p[L];X||(X=new b0,p[L]=X);const ee=f.getCameraImage(L);X.sourceTexture=ee}}}}for(let Z=0;Z<w.length;Z++){const ge=M[Z],te=w[Z];ge!==null&&te!==void 0&&te.update(ge,k,c||o)}de&&de(U,k),k.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:k}),m=null}const he=new M0;he.setAnimationLoop(Le),this.setAnimationLoop=function(U){de=U},this.dispose=function(){}}}const UI=new Dt,D0=new tt;D0.set(-1,0,0,0,1,0,0,0,1);function OI(t,e){function n(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,S0(t)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,b,A,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),h(g,p),p.isMeshPhysicalMaterial&&d(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,b,A):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,n(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Mn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,n(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Mn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,n(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,n(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const b=e.get(p),A=b.envMap,y=b.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(UI.makeRotationFromEuler(y)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(D0),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,b,A){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=A*.5,p.map&&(g.map.value=p.map,n(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,n(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,n(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,b){g.ior.value=p.ior,p.diffuseRoughness>0&&(g.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=p.diffuseRoughnessMap,n(p.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Mn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const b=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function FI(t,e,n,i){let s={},r={};function o(b,A){const y=A.program;i.uniformBlockBinding(b,y,s[b.id])}function a(b,A){let y=s[b.id];y===void 0&&(m(b),y=l(b),s[b.id]=y,b.addEventListener("dispose",g));const w=A.program;i.updateUBOMapping(b,w);const M=e.render.frame;r[b.id]!==M&&(c(b),r[b.id]=M)}function l(b){const A=t.createBuffer(),y=b.__size,w=b.usage;return t.bindBuffer(t.UNIFORM_BUFFER,A),t.bufferData(t.UNIFORM_BUFFER,y,w),t.bindBuffer(t.UNIFORM_BUFFER,null),A}function c(b){const A=s[b.id],y=b.uniforms,w=b.__cache;t.bindBuffer(t.UNIFORM_BUFFER,A);for(let M=0,_=y.length;M<_;M++){const x=y[M];if(Array.isArray(x))for(let I=0,N=x.length;I<N;I++)u(x[I],M,I,w);else u(x,M,0,w)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function u(b,A,y,w){if(h(b,A,y,w)===!0){const M=b.__offset,_=b.value;if(Array.isArray(_)){let x=0;for(let I=0;I<_.length;I++){const N=_[I],B=v(N,!0);f(N,b.__data,x),x+=B.storage/Float32Array.BYTES_PER_ELEMENT}}else f(_,b.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,M,b.__data)}}function f(b,A,y){typeof b=="number"||typeof b=="boolean"?A[y]=b:b.isMatrix3?(A[y]=b.elements[0],A[y+1]=b.elements[1],A[y+2]=b.elements[2],A[y+3]=0,A[y+4]=b.elements[3],A[y+5]=b.elements[4],A[y+6]=b.elements[5],A[y+7]=0,A[y+8]=b.elements[6],A[y+9]=b.elements[7],A[y+10]=b.elements[8],A[y+11]=0):ArrayBuffer.isView(b)?A.set(b.subarray(0,A.length-y),y):b.toArray(A,y)}function h(b,A,y,w){const M=b.value,_=A+"_"+y;if(Array.isArray(M)){w[_]===void 0&&(w[_]=[]);const x=w[_];let I=!1;for(let N=0;N<M.length;N++)d(M[N],x,N)===!0&&(I=!0);return I}return d(M,w,_)}function d(b,A,y){if(A[y]===void 0)return typeof b=="number"||typeof b=="boolean"?A[y]=b:ArrayBuffer.isView(b)?A[y]=b.slice():A[y]=b.clone(),!0;{const w=A[y];if(typeof b=="number"||typeof b=="boolean"){if(w!==b)return A[y]=b,!0}else{if(ArrayBuffer.isView(b))return!0;if(w.equals(b)===!1)return w.copy(b),!0}}return!1}function m(b){const A=b.uniforms;let y=0;const w=16;for(let _=0,x=A.length;_<x;_++){const I=Array.isArray(A[_])?A[_]:[A[_]];for(let N=0,B=I.length;N<B;N++){const G=I[N],J=Array.isArray(G.value)?G.value:[G.value],O=Array.isArray(A[_])||Array.isArray(G.value);let K=y;for(let z=0,ae=J.length;z<ae;z++){const q=J[z],le=v(q,O),de=y%w,Le=de%le.boundary,he=de+Le;y+=Le,he!==0&&w-he<le.storage&&(y+=w-he),z===0&&(K=y),y+=le.storage}const Q=G.type==="int"?Int32Array:G.type==="uint"?Uint32Array:Float32Array;G.__data=new Q((y-K)/Float32Array.BYTES_PER_ELEMENT),G.__offset=K}}const M=y%w;return M>0&&(y+=w-M),b.__size=y,b.__cache={},this}function v(b,A){const y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=16,y.storage=48):b.isMatrix4?(y.boundary=16,y.storage=64):b.isTexture?je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(y.boundary=16,y.storage=b.byteLength):je("WebGLRenderer: Unsupported uniform value type.",b),A===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function g(b){const A=b.target;A.removeEventListener("dispose",g),t.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function p(){for(const b in s)t.deleteBuffer(s[b]);s={},r={}}return{bind:o,update:a,dispose:p}}const BI=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ti=null;function VI(){return ti===null&&(ti=new AA(BI,16,16,Ps,bi),ti.name="DFG_LUT",ti.minFilter=En,ti.magFilter=En,ti.wrapS=Fi,ti.wrapT=Fi,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}class GI{constructor(e={}){const{canvas:n=GT(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=Rn}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;const v=d,g=new Set([Xf,Wf,Hf]),p=new Set([Rn,vi,yo,mr,kf,zf]),b=new Uint32Array(4),A=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]};let w=null,M=null;const _=[],x=[];let I=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let B=!1,G=null,J=null,O=null,K=null;this._outputColorSpace=Sn;let Q=0,z=0,ae=null,q=-1,le=null;const de=new Ft,Le=new Ft;let he=null;const U=new nt(0);let k=0,Z=n.width,ge=n.height,te=1,we=null,ft=null;const R=new Ft(0,0,Z,ge),L=new Ft(0,0,Z,ge);let X=!1;const ee=new Ao,ie=new Zf;let se=!1,be=!1;const pe=new Dt,ve=new H,re=new Ft,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xe=!1;function De(){return ae===null?te:1}let C=i;function Je(E,F){return n.getContext(E,F)}let Ye,We,_e,ot,Pe,Ve,T,S,W,me,fe,Ee,Ne,oe,ce,Te,P,ue,ne,Ae,ye,Me,Xe;try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Bf}`),n.addEventListener("webglcontextlost",$e,!1),n.addEventListener("webglcontextrestored",rt,!1),n.addEventListener("webglcontextcreationerror",Ue,!1),C===null){const F="webgl2";if(C=Je(F,E),C===null)throw Je(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}at()}catch(E){throw n.removeEventListener("webglcontextlost",$e,!1),n.removeEventListener("webglcontextrestored",rt,!1),n.removeEventListener("webglcontextcreationerror",Ue,!1),vt("WebGLRenderer: "+E.message),E}function at(){Ye=new H1(C),Ye.init(),ye=new II(C,Ye),We=new L1(C,Ye,e,ye),_e=new RI(C,Ye),We.reversedDepthBuffer&&h&&_e.buffers.depth.setReversed(!0),J=C.createFramebuffer(),O=C.createFramebuffer(),K=C.createFramebuffer(),ot=new Y1(C),Pe=new pI,Ve=new NI(C,Ye,_e,Pe,We,ye,ot),T=new z1(N),S=new KA(C),Me=new I1(C,S),W=new W1(C,S,ot,Me),me=new K1(C,W,S,Me,ot),ue=new $1(C,We,Ve),ce=new P1(Pe),fe=new hI(N,T,Ye,We,Me,ce),Ee=new OI(N,Pe),Ne=new gI,oe=new yI(Ye),P=new N1(N,T,_e,me,m,l),Te=new wI(N,me,We),Xe=new FI(C,ot,We,_e),ne=new C1(C,Ye,ot),Ae=new X1(C,Ye,ot),ot.programs=fe.programs,N.capabilities=We,N.extensions=Ye,N.properties=Pe,N.renderLists=Ne,N.shadowMap=Te,N.state=_e,N.info=ot}v!==Rn&&(I=new J1(v,n.width,n.height,a,s,r));const Se=new DI(N,C);this.xr=Se,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const E=Ye.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ye.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(E){E!==void 0&&(te=E,this.setSize(Z,ge,!1))},this.getSize=function(E){return E.set(Z,ge)},this.setSize=function(E,F,j=!0){if(Se.isPresenting){je("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,ge=F,n.width=Math.floor(E*te),n.height=Math.floor(F*te),j===!0&&(n.style.width=E+"px",n.style.height=F+"px"),I!==null&&I.setSize(n.width,n.height),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(Z*te,ge*te).floor()},this.setDrawingBufferSize=function(E,F,j){Z=E,ge=F,te=j,n.width=Math.floor(E*j),n.height=Math.floor(F*j),this.setViewport(0,0,E,F)},this.setEffects=function(E){if(v===Rn){vt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let F=0;F<E.length;F++)if(E[F].isOutputPass===!0){je("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(de)},this.getViewport=function(E){return E.copy(R)},this.setViewport=function(E,F,j,Y){E.isVector4?R.set(E.x,E.y,E.z,E.w):R.set(E,F,j,Y),_e.viewport(de.copy(R).multiplyScalar(De()).round())},this.getScissor=function(E){return E.copy(L)},this.setScissor=function(E,F,j,Y){E.isVector4?L.set(E.x,E.y,E.z,E.w):L.set(E,F,j,Y),_e.scissor(Le.copy(L).multiplyScalar(De()).round())},this.getScissorTest=function(){return X},this.setScissorTest=function(E){_e.setScissorTest(X=E)},this.setOpaqueSort=function(E){we=E},this.setTransparentSort=function(E){ft=E},this.getClearColor=function(E){return E.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,j=!0){let Y=0;if(E){let $=!1;if(ae!==null){const Ie=ae.texture.format;$=g.has(Ie)}if($){const Ie=ae.texture.type,Ge=p.has(Ie),Re=P.getClearColor(),Be=P.getClearAlpha(),He=Re.r,it=Re.g,dt=Re.b;Ge?(b[0]=He,b[1]=it,b[2]=dt,b[3]=Be,C.clearBufferuiv(C.COLOR,0,b)):(A[0]=He,A[1]=it,A[2]=dt,A[3]=Be,C.clearBufferiv(C.COLOR,0,A))}else Y|=C.COLOR_BUFFER_BIT}F&&(Y|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),j&&(Y|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&C.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),G=E},this.dispose=function(){n.removeEventListener("webglcontextlost",$e,!1),n.removeEventListener("webglcontextrestored",rt,!1),n.removeEventListener("webglcontextcreationerror",Ue,!1),P.dispose(),Ne.dispose(),oe.dispose(),Ve.dispose(),Pe.dispose(),T.dispose(),me.dispose(),W.dispose(),Me.dispose(),Xe.dispose(),fe.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",sd),Se.removeEventListener("sessionend",rd),gs.stop()};function $e(E){E.preventDefault(),ap("WebGLRenderer: Context Lost."),B=!0}function rt(){ap("WebGLRenderer: Context Restored."),B=!1;const E=ot.autoReset,F=Te.enabled,j=Te.autoUpdate,Y=Te.needsUpdate,$=Te.type;at(),ot.autoReset=E,Te.enabled=F,Te.autoUpdate=j,Te.needsUpdate=Y,Te.type=$}function Ue(E){vt("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function yt(E){const F=E.target;F.removeEventListener("dispose",yt),Zt(F)}function Zt(E){Ki(E),Pe.remove(E)}function Ki(E){const F=Pe.get(E).programs;F!==void 0&&(F.forEach(function(j){fe.releaseProgram(j)}),E.isShaderMaterial&&fe.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,j,Y,$,Ie){F===null&&(F=Fe);const Ge=$.isMesh&&$.matrixWorld.determinantAffine()<0,Re=B0(E,F,j,Y,$);_e.setMaterial(Y,Ge);let Be=j.index,He=1;if(Y.wireframe===!0){if(Be=W.getWireframeAttribute(j),Be===void 0)return;He=2}const it=j.drawRange,dt=j.attributes.position;let ke=it.start*He,ht=(it.start+it.count)*He;Ie!==null&&(ke=Math.max(ke,Ie.start*He),ht=Math.min(ht,(Ie.start+Ie.count)*He)),Be!==null?(ke=Math.max(ke,0),ht=Math.min(ht,Be.count)):dt!=null&&(ke=Math.max(ke,0),ht=Math.min(ht,dt.count));const kt=ht-ke;if(kt<0||kt===1/0)return;Me.setup($,Y,Re,j,Be);let Ct,Nt=ne;if(Be!==null&&(Ct=S.get(Be),Nt=Ae,Nt.setIndex(Ct)),$.isMesh)Y.wireframe===!0?(_e.setLineWidth(Y.wireframeLinewidth*De()),Nt.setMode(C.LINES)):Nt.setMode(C.TRIANGLES);else if($.isLine){let nn=Y.linewidth;nn===void 0&&(nn=1),_e.setLineWidth(nn*De()),$.isLineSegments?Nt.setMode(C.LINES):$.isLineLoop?Nt.setMode(C.LINE_LOOP):Nt.setMode(C.LINE_STRIP)}else $.isPoints?Nt.setMode(C.POINTS):$.isSprite&&Nt.setMode(C.TRIANGLES);if($.isBatchedMesh)if(Ye.get("WEBGL_multi_draw"))Nt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const nn=$._multiDrawStarts,ze=$._multiDrawCounts,un=$._multiDrawCount,_t=Be?S.get(Be).bytesPerElement:1,_s=Pe.get(Y).currentProgram.getUniforms();for(let sn=0;sn<un;sn++)_s.setValue(C,"_gl_DrawID",sn),Nt.render(nn[sn]/_t,ze[sn])}else if($.isInstancedMesh)Nt.renderInstances(ke,kt,$.count);else if(j.isInstancedBufferGeometry){const nn=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,ze=Math.min(j.instanceCount,nn);Nt.renderInstances(ke,kt,ze)}else Nt.render(ke,kt)};function id(E,F,j,Y){G!==null&&E.isNodeMaterial&&G.setObject(Y,E),se===!0&&ce.setState(E,j,!1),E.transparent===!0&&E.side===Oi&&E.forceSinglePass===!1?(E.side=Mn,E.needsUpdate=!0,Tr(E,F,Y),E.side=Ls,E.needsUpdate=!0,Tr(E,F,Y),E.side=Oi):Tr(E,F,Y)}this.compile=function(E,F,j=null){j===null&&(j=E),G!==null&&G.renderStart(E,F,j),M=oe.get(j),M.init(F),x.push(M),j.traverseVisible(function($){$.isLight&&$.layers.test(F.layers)&&(M.pushLight($),$.castShadow&&M.pushShadow($))}),E!==j&&E.traverseVisible(function($){$.isLight&&$.layers.test(F.layers)&&(M.pushLight($),$.castShadow&&M.pushShadow($))}),M.setupLights(),G!==null&&G.updateLights(M.state.lightsArray),be=this.localClippingEnabled,se=ce.init(this.clippingPlanes,be),se===!0&&ce.setGlobalState(this.clippingPlanes,F),G!==null&&Te.render(M.state.shadowsArray,j,F);const Y=new Set;return E.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Ie=$.material;if(Ie)if(Array.isArray(Ie))for(let Ge=0;Ge<Ie.length;Ge++){const Re=Ie[Ge];id(Re,j,F,$),Y.add(Re)}else id(Ie,j,F,$),Y.add(Ie)}),M=x.pop(),G!==null&&G.renderEnd(),Y},this.compileAsync=function(E,F,j=null){const Y=this.compile(E,F,j);return new Promise($=>{function Ie(){if(Y.forEach(function(Ge){const Be=Pe.get(Ge).currentProgram;(Be===void 0||Be.isReady())&&Y.delete(Ge)}),Y.size===0){$(E);return}setTimeout(Ie,10)}Ye.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let Pl=null;function O0(E){Pl&&Pl(E)}function sd(){gs.stop()}function rd(){gs.start()}const gs=new M0;gs.setAnimationLoop(O0),typeof self<"u"&&gs.setContext(self),this.setAnimationLoop=function(E){Pl=E,Se.setAnimationLoop(E),E===null?gs.stop():gs.start()},Se.addEventListener("sessionstart",sd),Se.addEventListener("sessionend",rd),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){vt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(B===!0)return;G!==null&&G.renderStart(E,F);const j=Se.enabled===!0&&Se.isPresenting===!0,Y=I!==null&&(ae===null||j)&&I.begin(N,ae);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(F),F=Se.getCamera()),E.isScene===!0&&E.onBeforeRender(N,E,F,ae),M=oe.get(E,x.length),M.init(F),M.state.textureUnits=Ve.getTextureUnits(),x.push(M),pe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?ie.setFromArrayCamera(F):ee.setFromProjectionMatrix(pe,Yn,F.reversedDepth),be=this.localClippingEnabled,se=ce.init(this.clippingPlanes,be),w=Ne.get(E,_.length),w.init(),_.push(w),this.info.render.frame++,Se.enabled===!0&&Se.isPresenting===!0){const Ge=N.xr.getDepthSensingMesh();Ge!==null&&Dl(Ge,F,-1/0,N.sortObjects)}Dl(E,F,0,N.sortObjects),w.finish(),G!==null&&G.updateLights(M.state.lightsArray),N.sortObjects===!0&&w.sort(we,ft),xe=Se.enabled===!1||Se.isPresenting===!1||Se.hasDepthSensing()===!1,xe&&P.addToRenderList(w,E),this.info.autoReset===!0&&this.info.reset(),se===!0&&ce.beginShadows();const $=M.state.shadowsArray;if(Te.render($,E,F),se===!0&&ce.endShadows(),(Y&&I.hasRenderPass())===!1){const Ge=w.opaque,Re=w.transmissive;if(M.setupLights(),F.isArrayCamera){const Be=F.cameras;if(Re.length>0)for(let He=0,it=Be.length;He<it;He++){const dt=Be[He];ad(Ge,Re,E,dt)}xe&&P.render(E);for(let He=0,it=Be.length;He<it;He++){const dt=Be[He];od(w,E,dt,dt.viewport)}}else Re.length>0&&ad(Ge,Re,E,F),xe&&P.render(E),od(w,E,F)}ae!==null&&z===0&&(Ve.updateMultisampleRenderTarget(ae),Ve.updateRenderTargetMipmap(ae)),Y&&I.end(N),E.isScene===!0&&E.onAfterRender(N,E,F),Me.resetDefaultState(),q=-1,le=null,x.pop(),x.length>0?(M=x[x.length-1],Ve.setTextureUnits(M.state.textureUnits),se===!0&&ce.setGlobalState(N.clippingPlanes,M.state.camera)):M=null,_.pop(),_.length>0?w=_[_.length-1]:w=null,G!==null&&G.renderEnd()};function Dl(E,F,j,Y){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)j=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)M.pushLight(E),E.castShadow&&M.pushShadow(E);else if(E.isSprite){const Ge=F.isArrayCamera?ie:ee;if(!E.frustumCulled||E.intersectsFrustum(Ge)){Y&&re.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pe);const Re=me.update(E),Be=E.material;Be.visible&&w.push(E,Re,Be,j,re.z,null,F)}}else if(E.isMesh||E.isLine||E.isPoints){const Ge=F.isArrayCamera?ie:ee;if(!E.frustumCulled||E.intersectsFrustum(Ge)){const Re=me.update(E),Be=E.material;if(Y&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),re.copy(E.boundingSphere.center)):(Re.boundingSphere===null&&Re.computeBoundingSphere(),re.copy(Re.boundingSphere.center)),re.applyMatrix4(E.matrixWorld).applyMatrix4(pe)),Array.isArray(Be)){const He=Re.groups;for(let it=0,dt=He.length;it<dt;it++){const ke=He[it],ht=Be[ke.materialIndex];ht&&ht.visible&&w.push(E,Re,ht,j,re.z,ke,F)}}else Be.visible&&w.push(E,Re,Be,j,re.z,null,F)}}}const Ie=E.children;for(let Ge=0,Re=Ie.length;Ge<Re;Ge++)Dl(Ie[Ge],F,j,Y)}function od(E,F,j,Y){const{opaque:$,transmissive:Ie,transparent:Ge}=E;M.setupLightsView(j),se===!0&&ce.setGlobalState(N.clippingPlanes,j),Y&&_e.viewport(de.copy(Y)),$.length>0&&Bo($,F,j),Ie.length>0&&Bo(Ie,F,j),Ge.length>0&&Bo(Ge,F,j),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function ad(E,F,j,Y){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[Y.id]===void 0){const ke=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[Y.id]=new hi(1,1,{generateMipmaps:!0,type:ke?bi:Rn,minFilter:rs,samples:Math.max(4,We.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:mt.workingColorSpace})}const Ie=M.state.transmissionRenderTarget[Y.id],Ge=Y.viewport||de;Ie.setSize(Ge.z*N.transmissionResolutionScale,Ge.w*N.transmissionResolutionScale);const Re=N.getRenderTarget(),Be=N.getActiveCubeFace(),He=N.getActiveMipmapLevel();N.setRenderTarget(Ie),N.getClearColor(U),k=N.getClearAlpha(),k<1&&N.setClearColor(16777215,.5),N.clear(),xe&&P.render(j);const it=N.toneMapping;N.toneMapping=Vi;const dt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),M.setupLightsView(Y),se===!0&&ce.setGlobalState(N.clippingPlanes,Y),Bo(E,j,Y),Ve.updateMultisampleRenderTarget(Ie),Ve.updateRenderTargetMipmap(Ie),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let ht=0,kt=F.length;ht<kt;ht++){const Ct=F[ht],{object:Nt,geometry:nn,material:ze,group:un}=Ct;if(ze.side===Oi&&Nt.layers.test(Y.layers)){const _t=ze.side;ze.side=Mn,ze.needsUpdate=!0,ld(Nt,j,Y,nn,ze,un),ze.side=_t,ze.needsUpdate=!0,ke=!0}}ke===!0&&(Ve.updateMultisampleRenderTarget(Ie),Ve.updateRenderTargetMipmap(Ie))}N.setRenderTarget(Re,Be,He),N.setClearColor(U,k),dt!==void 0&&(Y.viewport=dt),N.toneMapping=it}function Bo(E,F,j){const Y=F.isScene===!0?F.overrideMaterial:null;for(let $=0,Ie=E.length;$<Ie;$++){const Ge=E[$],{object:Re,geometry:Be,group:He}=Ge;let it=Ge.material;it.allowOverride===!0&&Y!==null&&(it=Y),Re.layers.test(j.layers)&&ld(Re,F,j,Be,it,He)}}function ld(E,F,j,Y,$,Ie){G!==null&&$.isNodeMaterial&&G.setObject(E,$),E.onBeforeRender(N,F,j,Y,$,Ie),E.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),$.onBeforeRender(N,F,j,Y,E,Ie),$.transparent===!0&&$.side===Oi&&$.forceSinglePass===!1?($.side=Mn,$.needsUpdate=!0,N.renderBufferDirect(j,F,Y,$,E,Ie),$.side=Ls,$.needsUpdate=!0,N.renderBufferDirect(j,F,Y,$,E,Ie),$.side=Oi):N.renderBufferDirect(j,F,Y,$,E,Ie),E.onAfterRender(N,F,j,Y,$,Ie)}function cd(E){let F=0;for(const j of E)j.texture!==null&&F++;return F}function Tr(E,F,j){F.isScene!==!0&&(F=Fe);const Y=Pe.get(E),$=M.state.lights,Ie=M.state.shadowsArray,Ge=$.state.version,Re=fe.getParameters(E,$.state,Ie,F,j,M.state.lightProbeGridArray),Be=fe.getProgramCacheKey(Re);let He=Y.programs;Y.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?F.environment:null,Y.fog=F.fog;const it=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;Y.envMap=T.get(E.envMap||Y.environment,it),Y.envMapRotation=Y.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,He===void 0&&(E.addEventListener("dispose",yt),He=new Map,Y.programs=He,Y.programVariants=new Map);let dt=He.get(Be);if(dt!==void 0){if(Y.currentProgram===dt&&Y.lightsStateVersion===Ge)return fd(E,Re),dt}else Re.uniforms=fe.getUniforms(E),G!==null&&E.isNodeMaterial&&G.build(E,j,Re),E.onBeforeCompile(Re,N),dt=fe.acquireProgram(Re,Be),He.set(Be,dt),Y.uniforms=Re.uniforms;const ke=Y.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(ke.clippingPlanes=ce.uniform),fd(E,Re),Y.needsLights=G0(E),Y.lightsStateVersion=Ge,Y.needsLights&&(ke.ambientLightColor.value=$.state.ambient,ke.lightProbe.value=$.state.probe,ke.sunLights.value=$.state.sun,ke.sunLightShadows.value=$.state.sunShadow,ke.directionalLights.value=$.state.directional,ke.directionalLightShadows.value=$.state.directionalShadow,ke.spotLights.value=$.state.spot,ke.spotLightShadows.value=$.state.spotShadow,ke.rectAreaLights.value=$.state.rectArea,ke.ltc_1.value=$.state.rectAreaLTC1,ke.ltc_2.value=$.state.rectAreaLTC2,ke.pointLights.value=$.state.point,ke.pointLightShadows.value=$.state.pointShadow,ke.hemisphereLights.value=$.state.hemi,ke.sunShadowMatrix.value=$.state.sunShadowMatrix,ke.sunShadowCascade.value=$.state.sunShadowCascade,ke.directionalShadowMatrix.value=$.state.directionalShadowMatrix,ke.spotLightMatrix.value=$.state.spotLightMatrix,ke.spotLightMap.value=$.state.spotLightMap,ke.pointShadowMatrix.value=$.state.pointShadowMatrix),Y.numLightProbeGrids=cd(M.state.lightProbeGridArray),Y.currentProgram=dt,Y.uniformsList=null,dt}function F0(E,F,j,Y,$){const Ie=Pe.get(E),Ge=Ie.currentProgram.id+","+Y+","+$;let Re=Ie.programVariants.get(Ge);return Re===void 0?(Re=Tr(E,F,j),Ie.programVariants.set(Ge,Re)):(Ie.currentProgram=Re,Ie.uniformsList=null,Ie.outputColorSpace=Y,Ie.toneMapping=$),Re}function ud(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=Ga.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function fd(E,F){const j=Pe.get(E);j.outputColorSpace=F.outputColorSpace,j.batching=F.batching,j.batchingColor=F.batchingColor,j.instancing=F.instancing,j.instancingColor=F.instancingColor,j.instancingMorph=F.instancingMorph,j.skinning=F.skinning,j.morphTargets=F.morphTargets,j.morphNormals=F.morphNormals,j.morphColors=F.morphColors,j.morphTargetsCount=F.morphTargetsCount,j.numClippingPlanes=F.numClippingPlanes,j.numIntersection=F.numClipIntersection,j.vertexAlphas=F.vertexAlphas,j.vertexTangents=F.vertexTangents,j.toneMapping=F.toneMapping}function B0(E,F,j,Y,$){F.isScene!==!0&&(F=Fe),Ve.resetTextureUnits();const Ie=F.fog,Ge=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?F.environment:null,Re=ae===null?N.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:mt.workingColorSpace,Be=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,He=T.get(Y.envMap||Ge,Be),it=Y.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,dt=!!j.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),ke=!!j.morphAttributes.position,ht=!!j.morphAttributes.normal,kt=!!j.morphAttributes.color;let Ct=Vi;Y.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Ct=N.toneMapping);const Nt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,nn=Nt!==void 0?Nt.length:0,ze=Pe.get(Y),un=M.state.lights;if(se===!0&&(be===!0||E!==le)){const Ot=E===le&&Y.id===q;ce.setState(Y,E,Ot)}let _t=!1,_s=!1;Y.version===ze.__version?ze.needsLights&&ze.lightsStateVersion!==un.state.version||$.isBatchedMesh&&ze.batching===!1||!$.isBatchedMesh&&ze.batching===!0||$.isBatchedMesh&&ze.batchingColor===!0&&$._colorsTexture===null||$.isBatchedMesh&&ze.batchingColor===!1&&$._colorsTexture!==null||$.isInstancedMesh&&ze.instancing===!1||!$.isInstancedMesh&&ze.instancing===!0||$.isSkinnedMesh&&ze.skinning===!1||!$.isSkinnedMesh&&ze.skinning===!0||$.isInstancedMesh&&ze.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&ze.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&ze.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&ze.instancingMorph===!1&&$.morphTexture!==null||ze.envMap!==He||Y.fog===!0&&ze.fog!==Ie||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==it||ze.vertexTangents!==dt||ze.morphTargets!==ke||ze.morphNormals!==ht||ze.morphColors!==kt||ze.morphTargetsCount!==nn||ze.numLightProbeGrids!==cd(M.state.lightProbeGridArray)?_t=!0:(ze.outputColorSpace!==Re||ze.toneMapping!==Ct)&&(_s=!0):(_t=!0,ze.__version=Y.version);let sn=ze.currentProgram;(_t===!0||_s===!0)&&(sn=_s===!0?F0(Y,F,$,Re,Ct):Tr(Y,F,$),G&&Y.isNodeMaterial&&G.onUpdateProgram(Y,sn,ze));let Vo=!1,Zi=!1,vs=!1;const gt=sn.getUniforms(),jt=ze.uniforms;if(_e.useProgram(sn.program)&&(Vo=!0,Zi=!0,vs=!0),Y.id!==q&&(q=Y.id,Zi=!0),Vo||le!==E){_e.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),gt.setValue(C,"projectionMatrix",E.projectionMatrix),gt.setValue(C,"viewMatrix",E.matrixWorldInverse);const Jt=gt.map.cameraPosition;Jt!==void 0&&Jt.setValue(C,ve.setFromMatrixPosition(E.matrixWorld)),We.logarithmicDepthBuffer&&gt.setValue(C,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&gt.setValue(C,"isOrthographic",E.isOrthographicCamera===!0),le!==E&&(le=E,Zi=!0,vs=!0)}if(ze.needsLights&&(un.state.sunShadowMap.length>0&&gt.setValue(C,"sunShadowMap",un.state.sunShadowMap,Ve),un.state.directionalShadowMap.length>0&&gt.setValue(C,"directionalShadowMap",un.state.directionalShadowMap,Ve),un.state.spotShadowMap.length>0&&gt.setValue(C,"spotShadowMap",un.state.spotShadowMap,Ve),un.state.pointShadowMap.length>0&&gt.setValue(C,"pointShadowMap",un.state.pointShadowMap,Ve)),$.isSkinnedMesh){gt.setOptional(C,$,"bindMatrix"),gt.setOptional(C,$,"bindMatrixInverse");const Ot=$.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),gt.setValue(C,"boneTexture",Ot.boneTexture,Ve))}$.isBatchedMesh&&(gt.setOptional(C,$,"batchingTexture"),gt.setValue(C,"batchingTexture",$._matricesTexture,Ve),gt.setOptional(C,$,"batchingIdTexture"),gt.setValue(C,"batchingIdTexture",$._indirectTexture,Ve),gt.setOptional(C,$,"batchingColorTexture"),$._colorsTexture!==null&&gt.setValue(C,"batchingColorTexture",$._colorsTexture,Ve));const Vn=j.morphAttributes;if((Vn.position!==void 0||Vn.normal!==void 0||Vn.color!==void 0)&&ue.update($,j,sn),(Zi||ze.receiveShadow!==$.receiveShadow)&&(ze.receiveShadow=$.receiveShadow,gt.setValue(C,"receiveShadow",$.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&F.environment!==null&&(jt.envMapIntensity.value=F.environmentIntensity),jt.dfgLUT!==void 0&&(jt.dfgLUT.value=VI()),Zi){if(gt.setValue(C,"toneMappingExposure",N.toneMappingExposure),ze.needsLights&&V0(jt,vs),Ie&&Y.fog===!0&&Ee.refreshFogUniforms(jt,Ie),Ee.refreshMaterialUniforms(jt,Y,te,ge,M.state.transmissionRenderTarget[E.id]),ze.needsLights&&ze.numLightProbeGrids>0){const Ot=y;let Jt=0;for(const yi of M.state.lightProbeGridArray)yi.texture!==null&&(Ot.textures[Jt]=yi.texture,Ot.min[Jt]=yi.boundingBox.min,Ot.max[Jt]=yi.boundingBox.max,Ot.resolution[Jt]=yi.resolution,Jt++);for(const yi in Ot)Ot[yi].length=Jt;jt.probesSH.value=Ot.textures,jt.probesMin.value=Ot.min,jt.probesMax.value=Ot.max,jt.probesResolution.value=Ot.resolution}Ga.upload(C,ud(ze),jt,Ve)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Ga.upload(C,ud(ze),jt,Ve),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&gt.setValue(C,"center",$.center),gt.setValue(C,"modelViewMatrix",$.modelViewMatrix),gt.setValue(C,"normalMatrix",$.normalMatrix),gt.setValue(C,"modelMatrix",$.matrixWorld),Y.uniformsGroups!==void 0){const Ot=Y.uniformsGroups;for(let Jt=0,yi=Ot.length;Jt<yi;Jt++){const hd=Ot[Jt];Xe.update(hd,sn),Xe.bind(hd,sn)}}return sn}function V0(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.sunLights.needsUpdate=F,E.sunLightShadows.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function G0(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return Q},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return ae},this.setRenderTargetTextures=function(E,F,j){const Y=Pe.get(E);Y.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),Pe.get(E.texture).__webglTexture=F,Pe.get(E.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:j,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){const j=Pe.get(E);j.__webglFramebuffer=F,j.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,j=0){ae=E,Q=F,z=j;let Y=null,$=!1,Ie=!1;if(E){const Re=Pe.get(E);if(Re.__useDefaultFramebuffer!==void 0){_e.bindFramebuffer(C.FRAMEBUFFER,Re.__webglFramebuffer),de.copy(E.viewport),Le.copy(E.scissor),he=E.scissorTest,_e.viewport(de),_e.scissor(Le),_e.setScissorTest(he),q=-1;return}else if(Re.__webglFramebuffer===void 0)Ve.setupRenderTarget(E);else if(Re.__hasExternalTextures)Ve.rebindTextures(E,Pe.get(E.texture).__webglTexture,Pe.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const it=E.depthTexture;if(Re.__boundDepthTexture!==it){if(it!==null&&Pe.has(it)&&(E.width!==it.image.width||E.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Ve.setupDepthRenderbuffer(E)}}const Be=E.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Ie=!0);const He=Pe.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(He[F])?Y=He[F][j]:Y=He[F],$=!0):E.samples>0&&Ve.useMultisampledRTT(E)===!1?Y=Pe.get(E).__webglMultisampledFramebuffer:Array.isArray(He)?Y=He[j]:Y=He,de.copy(E.viewport),Le.copy(E.scissor),he=E.scissorTest}else de.copy(R).multiplyScalar(te).floor(),Le.copy(L).multiplyScalar(te).floor(),he=X;if(j!==0&&(Y=J),_e.bindFramebuffer(C.FRAMEBUFFER,Y)&&_e.drawBuffers(E,Y),_e.viewport(de),_e.scissor(Le),_e.setScissorTest(he),$){const Re=Pe.get(E.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+F,Re.__webglTexture,j)}else if(Ie){const Re=F;for(let Be=0;Be<E.textures.length;Be++){const He=Pe.get(E.textures[Be]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Be,He.__webglTexture,j,Re)}}else if(E!==null&&j!==0){const Re=Pe.get(E.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Re.__webglTexture,j)}q=-1};function dd(E){const F=Pe.get(E);return(F.__readFormat!==E.format||F.__readType!==E.type)&&(F.__readFormat=E.format,F.__readType=E.type,F.__formatReadable=We.textureFormatReadable(E.format),F.__typeReadable=We.textureTypeReadable(E.type)),F}this.readRenderTargetPixels=function(E,F,j,Y,$,Ie,Ge,Re=0){if(!(E&&E.isWebGLRenderTarget)){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=Pe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ge!==void 0&&(Be=Be[Ge],Array.isArray(Be)&&(Be=Be[0])),Be){_e.bindFramebuffer(C.FRAMEBUFFER,Be);try{const He=E.textures[Re],it=He.format,dt=He.type;E.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Re);const ke=dd(He);if(ke.__formatReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ke.__typeReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-Y&&j>=0&&j<=E.height-$&&C.readPixels(F,j,Y,$,ye.convert(it),ye.convert(dt),Ie)}finally{const He=ae!==null?Pe.get(ae).__webglFramebuffer:null;_e.bindFramebuffer(C.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(E,F,j,Y,$,Ie,Ge,Re=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Be=Pe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ge!==void 0&&(Be=Be[Ge],Array.isArray(Be)&&(Be=Be[0])),Be)if(F>=0&&F<=E.width-Y&&j>=0&&j<=E.height-$){_e.bindFramebuffer(C.FRAMEBUFFER,Be);const He=E.textures[Re],it=He.format,dt=He.type;E.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Re);const ke=dd(He);if(ke.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ke.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ht=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,ht),C.bufferData(C.PIXEL_PACK_BUFFER,Ie.byteLength,C.STREAM_READ),C.readPixels(F,j,Y,$,ye.convert(it),ye.convert(dt),0),C.bindBuffer(C.PIXEL_PACK_BUFFER,null);const kt=ae!==null?Pe.get(ae).__webglFramebuffer:null;_e.bindFramebuffer(C.FRAMEBUFFER,kt);const Ct=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await kT(C,Ct,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,ht),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Ie),C.bindBuffer(C.PIXEL_PACK_BUFFER,null),C.deleteBuffer(ht),C.deleteSync(Ct),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,j=0){const Y=Math.pow(2,-j),$=Math.floor(E.image.width*Y),Ie=Math.floor(E.image.height*Y),Ge=F!==null?F.x:0,Re=F!==null?F.y:0;Ve.setTexture2D(E,0),C.copyTexSubImage2D(C.TEXTURE_2D,j,0,0,Ge,Re,$,Ie),_e.unbindTexture()},this.copyTextureToTexture=function(E,F,j=null,Y=null,$=0,Ie=0){let Ge,Re,Be,He,it,dt,ke,ht,kt;const Ct=E.isCompressedTexture?E.mipmaps[Ie]:E.image;if(j!==null)Ge=j.max.x-j.min.x,Re=j.max.y-j.min.y,Be=j.isBox3?j.max.z-j.min.z:1,He=j.min.x,it=j.min.y,dt=j.isBox3?j.min.z:0;else{const gt=Math.pow(2,-$);Ge=Math.floor(Ct.width*gt),Re=Math.floor(Ct.height*gt),E.isDataArrayTexture?Be=Ct.depth:E.isData3DTexture?Be=Math.floor(Ct.depth*gt):Be=1,He=0,it=0,dt=0}Y!==null?(ke=Y.x,ht=Y.y,kt=Y.z):(ke=0,ht=0,kt=0);const Nt=ye.convert(F.format),nn=ye.convert(F.type);let ze;F.isData3DTexture?(Ve.setTexture3D(F,0),ze=C.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Ve.setTexture2DArray(F,0),ze=C.TEXTURE_2D_ARRAY):(Ve.setTexture2D(F,0),ze=C.TEXTURE_2D),_e.activeTexture(C.TEXTURE0),_e.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,F.flipY),_e.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_e.pixelStorei(C.UNPACK_ALIGNMENT,F.unpackAlignment);const un=_e.getParameter(C.UNPACK_ROW_LENGTH),_t=_e.getParameter(C.UNPACK_IMAGE_HEIGHT),_s=_e.getParameter(C.UNPACK_SKIP_PIXELS),sn=_e.getParameter(C.UNPACK_SKIP_ROWS),Vo=_e.getParameter(C.UNPACK_SKIP_IMAGES);_e.pixelStorei(C.UNPACK_ROW_LENGTH,Ct.width),_e.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ct.height),_e.pixelStorei(C.UNPACK_SKIP_PIXELS,He),_e.pixelStorei(C.UNPACK_SKIP_ROWS,it),_e.pixelStorei(C.UNPACK_SKIP_IMAGES,dt);const Zi=E.isDataArrayTexture||E.isData3DTexture,vs=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){const gt=Pe.get(E),jt=Pe.get(F),Vn=Pe.get(gt.__renderTarget),Ot=Pe.get(jt.__renderTarget);_e.bindFramebuffer(C.READ_FRAMEBUFFER,Vn.__webglFramebuffer),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer);for(let Jt=0;Jt<Be;Jt++)Zi&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Pe.get(E).__webglTexture,$,dt+Jt),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Pe.get(F).__webglTexture,Ie,kt+Jt)),C.blitFramebuffer(He,it,He+Ge,it+Re,ke,ht,ke+Ge,ht+Re,C.DEPTH_BUFFER_BIT,C.NEAREST);_e.bindFramebuffer(C.READ_FRAMEBUFFER,null),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if($!==0||E.isRenderTargetTexture||Pe.has(E)){const gt=Pe.get(E),jt=Pe.get(F);_e.bindFramebuffer(C.READ_FRAMEBUFFER,O),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,K);for(let Vn=0;Vn<Be;Vn++)Zi?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,gt.__webglTexture,$,dt+Vn):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,gt.__webglTexture,$),vs?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,jt.__webglTexture,Ie,kt+Vn):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,jt.__webglTexture,Ie),$!==0?C.blitFramebuffer(He,it,He+Ge,it+Re,ke,ht,ke+Ge,ht+Re,C.COLOR_BUFFER_BIT,C.NEAREST):vs?C.copyTexSubImage3D(ze,Ie,ke,ht,kt+Vn,He,it,Ge,Re):C.copyTexSubImage2D(ze,Ie,ke,ht,He,it,Ge,Re);_e.bindFramebuffer(C.READ_FRAMEBUFFER,null),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else vs?E.isDataTexture||E.isData3DTexture?C.texSubImage3D(ze,Ie,ke,ht,kt,Ge,Re,Be,Nt,nn,Ct.data):F.isCompressedArrayTexture?C.compressedTexSubImage3D(ze,Ie,ke,ht,kt,Ge,Re,Be,Nt,Ct.data):C.texSubImage3D(ze,Ie,ke,ht,kt,Ge,Re,Be,Nt,nn,Ct):E.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Ie,ke,ht,Ge,Re,Nt,nn,Ct.data):E.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Ie,ke,ht,Ct.width,Ct.height,Nt,Ct.data):C.texSubImage2D(C.TEXTURE_2D,Ie,ke,ht,Ge,Re,Nt,nn,Ct);_e.pixelStorei(C.UNPACK_ROW_LENGTH,un),_e.pixelStorei(C.UNPACK_IMAGE_HEIGHT,_t),_e.pixelStorei(C.UNPACK_SKIP_PIXELS,_s),_e.pixelStorei(C.UNPACK_SKIP_ROWS,sn),_e.pixelStorei(C.UNPACK_SKIP_IMAGES,Vo),Ie===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&C.generateMipmap(ze),_e.unbindTexture()},this.initRenderTarget=function(E){Pe.get(E).__webglFramebuffer===void 0&&Ve.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Ve.setTextureCube(E,0):E.isData3DTexture?Ve.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Ve.setTexture2DArray(E,0):Ve.setTexture2D(E,0),_e.unbindTexture()},this.resetState=function(){Q=0,z=0,ae=null,_e.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=mt._getDrawingBufferColorSpace(e),n.unpackColorSpace=mt._getUnpackColorSpace()}}const lm={type:"change"},jf={type:"start"},U0={type:"end"},Ea=new Il,cm=new Pi,kI=Math.cos(70*u0.DEG2RAD),Ht=new H,bn=2*Math.PI,St={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ic=1e-6;class zI extends YA{constructor(e,n=null){super(e,n),this.state=St.NONE,this.target=new H,this.cursor=new H,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ir.ROTATE,MIDDLE:ir.DOLLY,RIGHT:ir.PAN},this.touches={ONE:tr.ROTATE,TWO:tr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new H,this._lastQuaternion=new Xi,this._lastTargetPosition=new H,this._quat=new Xi().setFromUnitVectors(e.up,new H(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Bp,this._sphericalDelta=new Bp,this._scale=1,this._panOffset=new H,this._rotateStart=new et,this._rotateEnd=new et,this._rotateDelta=new et,this._panStart=new et,this._panEnd=new et,this._panDelta=new et,this._dollyStart=new et,this._dollyEnd=new et,this._dollyDelta=new et,this._dollyDirection=new H,this._mouse=new et,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=WI.bind(this),this._onPointerDown=HI.bind(this),this._onPointerUp=XI.bind(this),this._onContextMenu=jI.bind(this),this._onMouseWheel=KI.bind(this),this._onKeyDown=ZI.bind(this),this._onTouchStart=JI.bind(this),this._onTouchMove=qI.bind(this),this._onMouseDown=YI.bind(this),this._onMouseMove=$I.bind(this),this._interceptControlDown=QI.bind(this),this._interceptControlUp=eC.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=St.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(lm),this.update(),this.state=St.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Ht.copy(n).sub(this.target),Ht.applyQuaternion(this._quat),this._spherical.setFromVector3(Ht),this.autoRotate&&this.state===St.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=bn:i>Math.PI&&(i-=bn),s<-Math.PI?s+=bn:s>Math.PI&&(s-=bn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ht.setFromSpherical(this._spherical),Ht.applyQuaternion(this._quatInverse),n.copy(this.target).add(Ht),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Ht.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new H(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new H(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ht.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ea.origin.copy(this.object.position),Ea.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ea.direction))<kI?this.object.lookAt(this.target):(cm.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ea.intersectPlane(cm,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ic||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ic||this._lastTargetPosition.distanceToSquared(this.target)>Ic?(this.dispatchEvent(lm),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?bn/60*this.autoRotateSpeed*e:bn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Ht.setFromMatrixColumn(n,0),Ht.multiplyScalar(-e),this._panOffset.add(Ht)}_panUp(e,n){this.screenSpacePanning===!0?Ht.setFromMatrixColumn(n,1):(Ht.setFromMatrixColumn(n,0),Ht.crossVectors(this.object.up,Ht)),Ht.multiplyScalar(e),this._panOffset.add(Ht)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Ht.copy(s).sub(this.target);let r=Ht.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=n-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientY),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(bn*this._rotateDelta.x/n.clientHeight),this._rotateUp(bn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-bn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(bn*this._rotateDelta.x/n.clientHeight),this._rotateUp(bn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+n.x)*.5,a=(e.pageY+n.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new et,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function HI(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function WI(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function XI(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(U0),this.state=St.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function YI(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ir.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=St.DOLLY;break;case ir.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=St.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=St.ROTATE}break;case ir.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=St.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=St.PAN}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(jf)}function $I(t){switch(this.state){case St.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case St.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case St.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function KI(t){this.enabled===!1||this.enableZoom===!1||this.state!==St.NONE||(t.preventDefault(),this.dispatchEvent(jf),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(U0))}function ZI(t){this.enabled!==!1&&this._handleKeyDown(t)}function JI(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case tr.ROTATE:if(this.enableRotate===!1){this.state=St.NONE;break}this._handleTouchStartRotate(t),this.state=St.TOUCH_ROTATE;break;case tr.PAN:if(this.enablePan===!1){this.state=St.NONE;break}this._handleTouchStartPan(t),this.state=St.TOUCH_PAN;break;default:this.state=St.NONE}break;case 2:switch(this.touches.TWO){case tr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=St.TOUCH_DOLLY_PAN;break;case tr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=St.TOUCH_DOLLY_ROTATE;break;default:this.state=St.NONE}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(jf)}function qI(t){switch(this._trackPointer(t),this.state){case St.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case St.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case St.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case St.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=St.NONE}}function jI(t){this.enabled!==!1&&t.preventDefault()}function QI(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function eC(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const tC=/^[og]\s*(.+)?/,nC=/^mtllib /,iC=/^usemtl /,sC=/^usemap /,Ma=/\s+/,um=new H,Cc=new H,fm=new H,dm=new H,Pn=new H,Ta=new nt;function rC(){const t={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,n){if(this.object&&this.object.fromDeclaration===!1){this.object.name=e,this.object.fromDeclaration=n!==!1;return}const i=this.object&&typeof this.object.currentMaterial=="function"?this.object.currentMaterial():void 0;if(this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:n!==!1,geometry:{vertices:[],normals:[],colors:[],uvs:[],hasUVIndices:!1},materials:[],smooth:!0,startMaterial:function(s,r){const o=this._finalize(!1);o&&(o.inherited||o.groupCount<=0)&&this.materials.splice(o.index,1);const a={index:this.materials.length,name:s||"",mtllib:Array.isArray(r)&&r.length>0?r[r.length-1]:"",smooth:o!==void 0?o.smooth:this.smooth,groupStart:o!==void 0?o.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(l){const c={index:typeof l=="number"?l:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return c.clone=this.clone.bind(c),c}};return this.materials.push(a),a},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(s){const r=this.currentMaterial();if(r&&r.groupEnd===-1&&(r.groupEnd=this.geometry.vertices.length/3,r.groupCount=r.groupEnd-r.groupStart,r.inherited=!1),s&&this.materials.length>1)for(let o=this.materials.length-1;o>=0;o--)this.materials[o].groupCount<=0&&this.materials.splice(o,1);return s&&this.materials.length===0&&this.materials.push({name:"",smooth:this.smooth}),r}},i&&i.name&&typeof i.clone=="function"){const s=i.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&typeof this.object._finalize=="function"&&this.object._finalize(!0)},parseVertexIndex:function(e,n){const i=parseInt(e,10);return(i>=0?i-1:i+n/3)*3},parseNormalIndex:function(e,n){const i=parseInt(e,10);return(i>=0?i-1:i+n/3)*3},parseUVIndex:function(e,n){const i=parseInt(e,10);return(i>=0?i-1:i+n/2)*2},addVertex:function(e,n,i){const s=this.vertices,r=this.object.geometry.vertices;r.push(s[e+0],s[e+1],s[e+2]),r.push(s[n+0],s[n+1],s[n+2]),r.push(s[i+0],s[i+1],s[i+2])},addVertexPoint:function(e){const n=this.vertices;this.object.geometry.vertices.push(n[e+0],n[e+1],n[e+2])},addVertexLine:function(e){const n=this.vertices;this.object.geometry.vertices.push(n[e+0],n[e+1],n[e+2])},addNormal:function(e,n,i){const s=this.normals,r=this.object.geometry.normals;r.push(s[e+0],s[e+1],s[e+2]),r.push(s[n+0],s[n+1],s[n+2]),r.push(s[i+0],s[i+1],s[i+2])},addFaceNormal:function(e,n,i){const s=this.vertices,r=this.object.geometry.normals;um.fromArray(s,e),Cc.fromArray(s,n),fm.fromArray(s,i),Pn.subVectors(fm,Cc),dm.subVectors(um,Cc),Pn.cross(dm),Pn.normalize(),r.push(Pn.x,Pn.y,Pn.z),r.push(Pn.x,Pn.y,Pn.z),r.push(Pn.x,Pn.y,Pn.z)},addColor:function(e,n,i){const s=this.colors,r=this.object.geometry.colors;s[e]!==void 0&&r.push(s[e+0],s[e+1],s[e+2]),s[n]!==void 0&&r.push(s[n+0],s[n+1],s[n+2]),s[i]!==void 0&&r.push(s[i+0],s[i+1],s[i+2])},addUV:function(e,n,i){const s=this.uvs,r=this.object.geometry.uvs;r.push(s[e+0],s[e+1]),r.push(s[n+0],s[n+1]),r.push(s[i+0],s[i+1])},addDefaultUV:function(){const e=this.object.geometry.uvs;e.push(0,0),e.push(0,0),e.push(0,0)},addUVLine:function(e){const n=this.uvs;this.object.geometry.uvs.push(n[e+0],n[e+1])},addFace:function(e,n,i,s,r,o,a,l,c){const u=this.vertices.length;let f=this.parseVertexIndex(e,u),h=this.parseVertexIndex(n,u),d=this.parseVertexIndex(i,u);if(this.addVertex(f,h,d),this.addColor(f,h,d),a!==void 0&&a!==""){const m=this.normals.length;f=this.parseNormalIndex(a,m),h=this.parseNormalIndex(l,m),d=this.parseNormalIndex(c,m),this.addNormal(f,h,d)}else this.addFaceNormal(f,h,d);if(s!==void 0&&s!==""){const m=this.uvs.length;f=this.parseUVIndex(s,m),h=this.parseUVIndex(r,m),d=this.parseUVIndex(o,m),this.addUV(f,h,d),this.object.geometry.hasUVIndices=!0}else this.addDefaultUV()},addPointGeometry:function(e){this.object.geometry.type="Points";const n=this.vertices.length;for(let i=0,s=e.length;i<s;i++){const r=this.parseVertexIndex(e[i],n);this.addVertexPoint(r),this.addColor(r)}},addLineGeometry:function(e,n){this.object.geometry.type="Line";const i=this.vertices.length,s=this.uvs.length;for(let r=0,o=e.length-1;r<o;r++)this.addVertexLine(this.parseVertexIndex(e[r],i)),this.addVertexLine(this.parseVertexIndex(e[r+1],i));for(let r=0,o=n.length-1;r<o;r++)this.addUVLine(this.parseUVIndex(n[r],s)),this.addUVLine(this.parseUVIndex(n[r+1],s))}};return t.startObject("",!1),t}class oC extends Jf{constructor(e){super(e),this.materials=null}load(e,n,i,s){const r=this,o=new GA(this.manager);o.setPriority(this.priority),o.setCache(this.cache),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{n(r.parse(a))}catch(l){s?s(l):console.error(l),r.manager.itemError(e)}},i,s)}setMaterials(e){return this.materials=e,this}parse(e){const n=new rC;e.indexOf(`\r
`)!==-1&&(e=e.replace(/\r\n/g,`
`)),e.indexOf(`\\
`)!==-1&&(e=e.replace(/\\\n/g,""));const i=e.split(`
`);let s=[];for(let a=0,l=i.length;a<l;a++){const c=i[a].trimStart();if(c.length===0)continue;const u=c.charAt(0);if(u!=="#")if(u==="v"){const f=c.split(Ma);switch(f[0]){case"v":n.vertices.push(parseFloat(f[1]),parseFloat(f[2]),parseFloat(f[3])),f.length>=7?(Ta.setRGB(parseFloat(f[4]),parseFloat(f[5]),parseFloat(f[6]),Sn),n.colors.push(Ta.r,Ta.g,Ta.b)):n.colors.push(void 0,void 0,void 0);break;case"vn":n.normals.push(parseFloat(f[1]),parseFloat(f[2]),parseFloat(f[3]));break;case"vt":n.uvs.push(parseFloat(f[1]),parseFloat(f[2]));break}}else if(u==="f"){const h=c.slice(1).trim().split(Ma),d=[];for(let v=0,g=h.length;v<g;v++){const p=h[v];if(p.length>0){const b=p.split("/");d.push(b)}}const m=d[0];for(let v=1,g=d.length-1;v<g;v++){const p=d[v],b=d[v+1];n.addFace(m[0],p[0],b[0],m[1],p[1],b[1],m[2],p[2],b[2])}}else if(u==="l"){const f=c.substring(1).trim().split(Ma);let h=[];const d=[];if(c.indexOf("/")===-1)h=f;else for(let m=0,v=f.length;m<v;m++){const g=f[m].split("/");g[0]!==""&&h.push(g[0]),g[1]!==""&&d.push(g[1])}n.addLineGeometry(h,d)}else if(u==="p"){const h=c.slice(1).trim().split(Ma);n.addPointGeometry(h)}else if((s=tC.exec(c))!==null){const f=(" "+s[0].slice(1).trim()).slice(1);n.startObject(f)}else if(iC.test(c))n.object.startMaterial(c.substring(7).trim(),n.materialLibraries);else if(nC.test(c))n.materialLibraries.push(c.substring(7).trim());else if(sC.test(c))console.warn('THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.');else if(u==="s"){if(s=c.split(" "),s.length>1){const h=s[1].trim().toLowerCase();n.object.smooth=h!=="0"&&h!=="off"}else n.object.smooth=!0;const f=n.object.currentMaterial();f&&(f.smooth=n.object.smooth)}else{if(c==="\0")continue;console.warn('THREE.OBJLoader: Unexpected line: "'+c+'"')}}n.finalize();const r=new li;if(r.materialLibraries=[].concat(n.materialLibraries),!(n.objects.length===1&&n.objects[0].geometry.vertices.length===0)===!0)for(let a=0,l=n.objects.length;a<l;a++){const c=n.objects[a],u=c.geometry,f=c.materials,h=u.type==="Line",d=u.type==="Points";let m=!1;if(u.vertices.length===0)continue;const v=new tn;v.setAttribute("position",new Tt(u.vertices,3)),u.normals.length>0&&v.setAttribute("normal",new Tt(u.normals,3)),u.colors.length>0&&(m=!0,v.setAttribute("color",new Tt(u.colors,3))),u.hasUVIndices===!0&&v.setAttribute("uv",new Tt(u.uvs,2));const g=[];for(let b=0,A=f.length;b<A;b++){const y=f[b],w=y.name+"_"+y.smooth+"_"+m;let M=n.materials[w];if(this.materials!==null){if(M=this.materials.create(y.name),h&&M&&!(M instanceof cs)){const _=new cs;Si.prototype.copy.call(_,M),_.color.copy(M.color),M=_}else if(d&&M&&!(M instanceof Hr)){const _=new Hr({size:10,sizeAttenuation:!1});Si.prototype.copy.call(_,M),_.color.copy(M.color),_.map=M.map,M=_}}M===void 0&&(h?M=new cs:d?M=new Hr({size:1,sizeAttenuation:!1}):M=new DA,M.name=y.name,M.flatShading=!y.smooth,M.vertexColors=m,n.materials[w]=M),g.push(M)}let p;if(g.length>1){for(let b=0,A=f.length;b<A;b++){const y=f[b];v.addGroup(y.groupStart,y.groupCount,b)}h?p=new wo(v,g):d?p=new Tc(v,g):p=new an(v,g)}else h?p=new wo(v,g[0]):d?p=new Tc(v,g[0]):p=new an(v,g[0]);p.name=c.name,r.add(p)}else if(n.vertices.length>0){const a=new Hr({size:1,sizeAttenuation:!1}),l=new tn;l.setAttribute("position",new Tt(n.vertices,3)),n.colors.length>0&&n.colors[0]!==void 0&&(l.setAttribute("color",new Tt(n.colors,3)),a.vertexColors=!0);const c=new Tc(l,a);r.add(c)}return r}}const aC={class:"viewport-3d-shell"},lC={class:"viewport-toolbar"},cC={class:"toolbar-left"},uC={class:"toolbar-actions"},fC={class:"vp-check"},dC={class:"vp-check"},hC={key:0,class:"vp-overlay"},pC={key:1,class:"vp-overlay error"},mC={key:2,class:"tcp-hud"},gC={class:"hud-line"},_C=360,vC=vr({__name:"RobotViewport3D",props:{snapshot:{},expanded:{type:Boolean}},emits:["toggle-expand"],setup(t,{emit:e}){const n=t,i=e,s=Qe(null),r=Qe(!0),o=Qe(null),a=Qe(!1),l=Qe(!0),c=Qe(!0),u=Qe(null),f=Vt(()=>{var k;return((k=u.value)==null?void 0:k.joint_actual)??n.snapshot.joint_actual}),h=Vt(()=>{var k;return((k=u.value)==null?void 0:k.cart_actual)??n.snapshot.cart_actual}),d=Vt(()=>{var k;return((k=u.value)==null?void 0:k.plant_online)??n.snapshot.plant_online}),m=Vt(()=>{var k;return((k=u.value)==null?void 0:k.drives_enabled)??n.snapshot.drives_on}),v=Vt(()=>{var k;return!!((k=u.value)!=null&&k.plant_fault_active)||n.snapshot.emergency_stop}),g=Vt(()=>{var k;return((k=u.value)==null?void 0:k.rtt_ms)??n.snapshot.rtt_ms}),p=Vt(()=>{var k;return((k=u.value)==null?void 0:k.sim_tick)??n.snapshot.sim_tick});let b=null,A=null,y=null,w=null,M=null,_=null,x=null;const I=[];let N=null,B=null;const G=[];let J=null,O=null,K=new H(1/0,1/0,1/0);function Q(k){for(let Z=0;Z<I.length;Z++){const ge=I[Z],te=k[Z]??0;ge.pivot.quaternion.setFromAxisAngle(ge.axis,u0.degToRad(te))}}function z(){if(!y||!N||!J||!O||(O.visible=l.value,!l.value))return;y.updateMatrixWorld(!0);const k=new H;if(N.getWorldPosition(k),k.distanceToSquared(K)>1e-6){K.copy(k),G.push(k.clone()),G.length>_C&&G.shift();const Z=new Float32Array(G.length*3);for(let ge=0;ge<G.length;ge++)Z[ge*3]=G[ge].x,Z[ge*3+1]=G[ge].y,Z[ge*3+2]=G[ge].z;J.setAttribute("position",new ki(Z,3)),J.setDrawRange(0,G.length),J.computeBoundingSphere()}}function ae(){G.length=0,K.set(1/0,1/0,1/0),J&&(J.setAttribute("position",new ki(new Float32Array(0),3)),J.setDrawRange(0,0))}function q(k){!w||!M||(k==="iso"?(w.position.set(1.15,.95,1.05),M.target.set(-.08,.36,-.35)):k==="front"?(w.position.set(-.1,.42,1.35),M.target.set(-.1,.36,-.35)):(w.position.set(-.1,1.65,-.34),M.target.set(-.1,.2,-.35)),M.update())}function le(k){return new Xi(k[1],k[2],k[3],k[0]).normalize()}function de(k){return new H(k[0]*.001,k[1]*.001,k[2]*.001)}async function Le(k,Z,ge,te){await Promise.all(ge.map(async we=>{const ft=`${Z}/${we.file}`,R=await k.loadAsync(ft),L=new nt().setRGB(we.rgba[0],we.rgba[1],we.rgba[2],Eo),X=we.rgba[3]??1,ee=new es({color:L,roughness:.36,metalness:.42,transparent:X<.99,opacity:X});R.traverse(ie=>{if(ie.isMesh){const se=ie;se.material=ee,se.castShadow=!0,se.receiveShadow=!0}}),te.add(R)}))}async function he(k,Z){var _e,ot;y=new _A,y.background=new nt("#09101f");const ge=Math.max(Z.clientWidth,320),te=Math.max(Z.clientHeight,240);w=new Xn(42,ge/te,.02,20),w.up.set(0,1,0),A=new GI({antialias:!0,powerPreference:"high-performance"}),A.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),A.setSize(ge,te),A.shadowMap.enabled=!0,A.shadowMap.type=V_,A.outputColorSpace=Sn,Z.appendChild(A.domElement),M=new zI(w,A.domElement),M.enableDamping=!0,M.dampingFactor=.08,M.minDistance=.35,M.maxDistance=4.5,q("iso"),y.add(new kA("#c7d9f8","#1e293b",.95));const we=new Fp("#ffffff",1.65);we.position.set(1.6,2.5,1.4),we.castShadow=!0,we.shadow.mapSize.set(1024,1024),we.shadow.camera.near=.2,we.shadow.camera.far=7;const ft=1.4;we.shadow.camera.left=-ft,we.shadow.camera.right=ft,we.shadow.camera.top=ft,we.shadow.camera.bottom=-ft,y.add(we);const R=new Fp("#38bdf8",.55);R.position.set(-1.5,1.2,-1.5),y.add(R);const L=new XA(3,30,"#334155","#172033");L.position.y=-.016,y.add(L);const X=new an(new Oo(4,4),new es({color:"#0c1426",roughness:.9,metalness:.05}));X.rotation.x=-Math.PI/2,X.position.y=-.017,X.receiveShadow=!0,y.add(X);const ee=new li;ee.rotation.x=-Math.PI/2,y.add(ee);const ie=new Vp(.18);if(ee.add(ie),(_e=k.environment)!=null&&_e.worktable){const Pe=k.environment.worktable,Ve=de(Pe.half_size_mm),T=new an(new Er(Ve.x*2,Ve.y*2,Ve.z*2),new es({color:"#334155",roughness:.65,metalness:.25}));T.position.copy(de(Pe.pos_mm)),T.castShadow=!0,T.receiveShadow=!0,ee.add(T);const S=new wo(new RA(T.geometry),new cs({color:"#64748b"}));T.add(S)}(ot=k.environment)!=null&&ot.target_marker_pos_mm&&(B=new an(new ol(.014,20,20),new es({color:"#f43f5e",emissive:"#be123c",emissiveIntensity:.45,transparent:!0,opacity:.72})),B.position.copy(de(k.environment.target_marker_pos_mm)),ee.add(B));const se=new oC,pe=`/robot-assets/${k.mesh_dir.replace(/^\/+/,"")}`,ve=new li;ve.position.copy(de(k.base_transform.pos_mm)),ve.quaternion.copy(le(k.base_transform.quat_wxyz)),ee.add(ve);const re=new an(new so(.095,.095,.016,32),new es({color:"#1e293b",roughness:.5,metalness:.6}));re.rotation.x=Math.PI/2,re.position.z=-.008,re.receiveShadow=!0,ve.add(re);const Fe=[Le(se,pe,k.base_visual.meshes,ve)];let xe=ve;I.length=0;for(const Pe of k.joints){const Ve=new li;Ve.name=`${Pe.body_name}_frame`,Ve.position.copy(de(Pe.pos_mm)),Ve.quaternion.copy(le(Pe.quat_wxyz)),xe.add(Ve);const T=new li;T.name=Pe.body_name,Ve.add(T);const S=new H(Pe.axis[0],Pe.axis[1],Pe.axis[2]).normalize();I.push({pivot:T,axis:S}),Fe.push(Le(se,pe,Pe.meshes,T)),xe=T}const De=new li;De.position.copy(de(k.flange_transform.pos_mm)),De.quaternion.copy(le(k.flange_transform.quat_wxyz)),xe.add(De);const C=new an(new so(.032,.032,.014,24),new es({color:"#475569",roughness:.35,metalness:.75}));C.rotation.x=Math.PI/2,C.position.z=.004,De.add(C);const Je=de(k.tcp_offset_mm),Ye=Je.length();if(Ye>1e-4){const Pe=new so(.006,.006,Ye,14),Ve=new an(Pe,new es({color:"#22c55e",roughness:.3,metalness:.4})),T=Je.clone().multiplyScalar(.5);Ve.position.copy(T),Ve.quaternion.setFromUnitVectors(new H(0,1,0),Je.clone().normalize()),De.add(Ve)}const We=new an(new ol(.011,16,16),new es({color:"#10b981",emissive:"#059669",emissiveIntensity:.65}));We.position.copy(Je),We.add(new Vp(.07)),De.add(We),N=We,J=new tn,O=new g0(J,new cs({color:"#38bdf8",transparent:!0,opacity:.85})),O.frustumCulled=!1,y.add(O),await Promise.all(Fe),Q(f.value)}function U(){const k=()=>{x=window.requestAnimationFrame(k),!(!A||!y||!w)&&(B&&(B.visible=c.value),Q(f.value),z(),M==null||M.update(),A.render(y,w))};k()}return br(async()=>{const k=s.value;if(k){try{const Z=await Gt.fetchRobotModelConfig();await he(Z,k),r.value=!1}catch(Z){r.value=!1,o.value=Z instanceof Error?Z.message:"初始化 3D 视窗失败";return}_=new ResizeObserver(Z=>{const ge=Z[0];if(!ge||!A||!w)return;const te=Math.max(Math.floor(ge.contentRect.width),100),we=Math.max(Math.floor(ge.contentRect.height),100);w.aspect=te/we,w.updateProjectionMatrix(),A.setSize(te,we)}),_.observe(k),U(),b=new qE(Z=>{u.value=Z},Z=>{a.value=Z},25),b.connect()}}),Co(()=>{b&&(b.disconnect(),b=null),x!==null&&(window.cancelAnimationFrame(x),x=null),_&&(_.disconnect(),_=null),M&&(M.dispose(),M=null),y&&(y.traverse(k=>{const Z=k;Z.geometry&&Z.geometry.dispose();const ge=Z.material;Array.isArray(ge)?ge.forEach(te=>te.dispose()):ge&&ge.dispose()}),y=null),A&&(A.dispose(),A.domElement.remove(),A=null)}),(k,Z)=>(Ke(),qe("div",aC,[D("div",lC,[D("div",cC,[Z[6]||(Z[6]=D("span",{class:"vp-title"},"🤖 3D 物理仿真视窗 (UR5e · MuJoCo 4.0.1 C FFI)",-1)),D("span",{class:ct(["stream-badge",{live:a.value}])},Ce(a.value?"MotionEngine 40Hz 直驱":"快照跟随"),3),D("span",{class:ct(["sim-pill",{online:d.value&&!v.value,fault:v.value}])},Ce(v.value?"故障/急停锁定":d.value?m.value?`闭环伺服运行中 · ${g.value.toFixed(2)}ms`:`物理就绪抱闸 · Tick #${p.value}`:"物理端等待接入"),3)]),D("div",uC,[D("label",fC,[yn(D("input",{"onUpdate:modelValue":Z[0]||(Z[0]=ge=>l.value=ge),type:"checkbox"},null,512),[[Za,l.value]]),Z[7]||(Z[7]=D("span",null,"TCP 轨迹",-1))]),D("label",dC,[yn(D("input",{"onUpdate:modelValue":Z[1]||(Z[1]=ge=>c.value=ge),type:"checkbox"},null,512),[[Za,c.value]]),Z[8]||(Z[8]=D("span",null,"目标点",-1))]),D("button",{type:"button",class:"vp-btn",onClick:ae},"清轨迹"),D("button",{type:"button",class:"vp-btn",onClick:Z[2]||(Z[2]=ge=>q("iso"))},"等轴"),D("button",{type:"button",class:"vp-btn",onClick:Z[3]||(Z[3]=ge=>q("front"))},"正视"),D("button",{type:"button",class:"vp-btn",onClick:Z[4]||(Z[4]=ge=>q("top"))},"俯视"),D("button",{type:"button",class:"vp-btn accent",onClick:Z[5]||(Z[5]=ge=>i("toggle-expand"))},Ce(t.expanded?"恢复分栏":"全屏 3D"),1)])]),D("div",{ref_key:"canvasHostRef",ref:s,class:"canvas-host"},[r.value?(Ke(),qe("div",hC,[...Z[9]||(Z[9]=[D("span",null,"⏳ 正在从后端载入 UR5e 3D 模型与网格资产...",-1)])])):o.value?(Ke(),qe("div",pC,[D("span",null,"⚠ "+Ce(o.value),1)])):Dn("",!0),o.value?Dn("",!0):(Ke(),qe("div",mC,[D("div",gC,[Z[10]||(Z[10]=D("span",{class:"hud-tag"},"TCP",-1)),D("span",null," X "+Ce(h.value.x.toFixed(1))+" · Y "+Ce(h.value.y.toFixed(1))+" · Z "+Ce(h.value.z.toFixed(1))+" mm ",1)]),Z[11]||(Z[11]=D("div",{class:"hud-hint"},"左键旋转 · 右键平移 · 滚轮缩放",-1))]))],512)]))}}),bC=xr(vC,[["__scopeId","data-v-c9b4004c"]]),SC={class:"monitor-jog-container"},xC={class:"monitor-section"},yC={class:"data-card tcp-card"},EC={class:"pose-grid"},MC={class:"coord-item"},TC={class:"coord-val"},AC={class:"coord-item"},wC={class:"coord-val"},RC={class:"coord-item"},NC={class:"coord-val"},IC={class:"coord-item"},CC={class:"coord-val"},LC={class:"coord-item"},PC={class:"coord-val"},DC={class:"coord-item"},UC={class:"coord-val"},OC={class:"data-card joints-card"},FC={class:"joints-table"},BC={class:"joint-name"},VC={class:"joint-angle"},GC={class:"torque-cell"},kC={class:"torque-val"},zC={class:"torque-bar-bg"},HC={class:"data-card io-card"},WC={class:"card-header"},XC={class:"io-mode-tag"},YC={class:"dout-grid"},$C=["disabled","title","onClick"],KC={class:"dout-name"},ZC={class:"jog-section"},JC={class:"jog-header"},qC={class:"jog-mode-switches"},jC={class:"pill-group"},QC={class:"pill-group"},eL={class:"step-size-selector"},tL=["onClick"],nL=["onClick"],iL={class:"jog-keys-container"},sL={key:0,class:"jog-axis-list"},rL={class:"axis-title"},oL={class:"axis-sub"},aL={class:"axis-buttons"},lL=["disabled","onPointerdown","onClick"],cL=["disabled","onPointerdown","onClick"],uL={key:1,class:"jog-axis-list"},fL={class:"axis-title"},dL={class:"axis-sub"},hL={class:"axis-buttons"},pL=["disabled","onPointerdown","onClick"],mL=["disabled","onPointerdown","onClick"],gL={class:"jog-status-footer"},_L={key:0,class:"warn-text"},vL={key:1,class:"warn-text"},bL={key:2,class:"tip-text"},SL={key:3,class:"tip-text"},xL=vr({__name:"MonitorAndJog",props:{snapshot:{}},setup(t){const e=t,n=Qe("CARTESIAN"),i=Qe("HOLD"),s=[1,5,10,25],r=[.5,1,5,10],o=Qe(5),a=Qe(1),l=Vt(()=>n.value==="CARTESIAN"?o.value:a.value),c=Vt(()=>e.snapshot.op_mode==="MANUAL"&&e.snapshot.drives_on&&!e.snapshot.emergency_stop&&e.snapshot.plant_online&&e.snapshot.interpreter_state!=="RUNNING"&&e.snapshot.interpreter_state!=="PAUSED");Bi(c,_=>{_||p()});let u=null;const f=Qe(null),h=Qe(null);let d=null,m=null;function v(_,x){h.value=_ instanceof Error?_.message:x}function g(_,x,I){if(!c.value||i.value!=="HOLD")return;p(),h.value=null;const N=_.currentTarget;if(N!=null&&N.setPointerCapture)try{N.setPointerCapture(_.pointerId),d=N,m=_.pointerId}catch{}const B={coord_system:n.value,axis:x,direction:I,step_size:l.value};f.value=`${x}_${I>0?"+":"-"}`,Gt.jogHold(B).then(G=>{!G.ok&&G.error&&(h.value=G.error,p())}).catch(G=>v(G,"Hold 点动指令发送失败")),u=window.setInterval(()=>{Gt.jogHold(B).then(G=>{!G.ok&&G.error&&(h.value=G.error,p())}).catch(G=>v(G,"Hold 点动续期失败"))},60)}function p(){if(d&&m!==null&&d.releasePointerCapture)try{d.releasePointerCapture(m)}catch{}d=null,m=null,u!==null&&(clearInterval(u),u=null),f.value!==null&&(f.value=null,Gt.jogStop().catch(_=>v(_,"停止点动请求失败")))}function b(_,x){if(!c.value||i.value!=="STEP")return;h.value=null;const I={coord_system:n.value,axis:_,direction:x,step_size:l.value};Gt.jogStep(I).then(N=>{!N.ok&&N.error&&(h.value=N.error)}).catch(N=>v(N,"步进点动指令发送失败"))}async function A(_){if(e.snapshot.op_mode!=="MANUAL")return;h.value=null;const x=_+1,I=e.snapshot.digital_out[_]??!1;try{const N=await Gt.setDout(x,!I);!N.ok&&N.error&&(h.value=N.error)}catch(N){v(N,`切换 DOUT[${x}] 失败`)}}const y=[{name:"X",label:"X (前后)",unit:"mm"},{name:"Y",label:"Y (左右)",unit:"mm"},{name:"Z",label:"Z (上下)",unit:"mm"},{name:"A",label:"A (绕Z)",unit:"°"},{name:"B",label:"B (绕Y)",unit:"°"},{name:"C",label:"C (绕X)",unit:"°"}],w=[{name:"J1",label:"J1 (基座)"},{name:"J2",label:"J2 (大臂)"},{name:"J3",label:"J3 (小臂)"},{name:"J4",label:"J4 (手腕旋转)"},{name:"J5",label:"J5 (手腕俯仰)"},{name:"J6",label:"J6 (法兰自转)"}];function M(){p()}return br(()=>{window.addEventListener("blur",M),window.addEventListener("pointercancel",M)}),Co(()=>{window.removeEventListener("blur",M),window.removeEventListener("pointercancel",M),p()}),(_,x)=>(Ke(),qe("div",SC,[D("div",xC,[D("div",yC,[x[10]||(x[10]=D("div",{class:"card-header"},[D("span",{class:"card-title"},"TCP 位姿 (Tool Center Point)"),D("span",{class:"unit-tag"},"mm / °")],-1)),D("div",EC,[D("div",MC,[x[4]||(x[4]=D("span",{class:"coord-label"},"X",-1)),D("span",TC,Ce(t.snapshot.cart_actual.x.toFixed(2)),1)]),D("div",AC,[x[5]||(x[5]=D("span",{class:"coord-label"},"Y",-1)),D("span",wC,Ce(t.snapshot.cart_actual.y.toFixed(2)),1)]),D("div",RC,[x[6]||(x[6]=D("span",{class:"coord-label"},"Z",-1)),D("span",NC,Ce(t.snapshot.cart_actual.z.toFixed(2)),1)]),D("div",IC,[x[7]||(x[7]=D("span",{class:"coord-label"},"A",-1)),D("span",CC,Ce(t.snapshot.cart_actual.a.toFixed(2)),1)]),D("div",LC,[x[8]||(x[8]=D("span",{class:"coord-label"},"B",-1)),D("span",PC,Ce(t.snapshot.cart_actual.b.toFixed(2)),1)]),D("div",DC,[x[9]||(x[9]=D("span",{class:"coord-label"},"C",-1)),D("span",UC,Ce(t.snapshot.cart_actual.c.toFixed(2)),1)])])]),D("div",OC,[x[11]||(x[11]=D("div",{class:"card-header"},[D("span",{class:"card-title"},"关节状态 (Joint Angles & Torques)"),D("span",{class:"unit-tag"},"deg / Nm")],-1)),D("div",FC,[(Ke(),qe(Pt,null,xn(6,I=>D("div",{key:I,class:"joint-row"},[D("span",BC,"J"+Ce(I),1),D("span",VC,Ce((t.snapshot.joint_actual[I-1]??0).toFixed(2))+"° ",1),D("div",GC,[D("span",kC,Ce((t.snapshot.joint_torque[I-1]??0).toFixed(2))+" Nm ",1),D("div",zC,[D("div",{class:"torque-bar-fill",style:hl({width:`${Math.min(100,Math.abs(t.snapshot.joint_torque[I-1]??0)*1.5)}%`})},null,4)])])])),64))])]),D("div",HC,[D("div",WC,[x[12]||(x[12]=D("span",{class:"card-title"},"数字输出 (DOUT 1..8)",-1)),D("span",XC,Ce(t.snapshot.op_mode==="MANUAL"?"手动模式可点击翻转":"自动模式只读"),1)]),D("div",YC,[(Ke(!0),qe(Pt,null,xn(t.snapshot.digital_out,(I,N)=>(Ke(),qe("button",{key:N,type:"button",class:ct(["dout-btn",{active:I,disabled:t.snapshot.op_mode!=="MANUAL"}]),disabled:t.snapshot.op_mode!=="MANUAL",title:`DOUT[${N+1}] (点击切换)`,onClick:B=>A(N)},[x[13]||(x[13]=D("span",{class:"dout-led"},null,-1)),D("span",KC,"DO "+Ce(N+1),1)],10,$C))),128))])])]),D("div",ZC,[D("div",JC,[D("div",qC,[D("div",jC,[D("button",{type:"button",class:ct(["pill-btn",{active:n.value==="CARTESIAN"}]),onClick:x[0]||(x[0]=I=>n.value="CARTESIAN")}," 笛卡尔 CARTESIAN ",2),D("button",{type:"button",class:ct(["pill-btn",{active:n.value==="JOINT"}]),onClick:x[1]||(x[1]=I=>n.value="JOINT")}," 关节 JOINT ",2)]),D("div",QC,[D("button",{type:"button",class:ct(["pill-btn",{active:i.value==="HOLD"}]),onClick:x[2]||(x[2]=I=>i.value="HOLD")}," 按住连续 (Hold) ",2),D("button",{type:"button",class:ct(["pill-btn",{active:i.value==="STEP"}]),onClick:x[3]||(x[3]=I=>i.value="STEP")}," 步进增量 (Step) ",2)])]),D("div",eL,[x[14]||(x[14]=D("span",{class:"step-label"},"步长:",-1)),n.value==="CARTESIAN"?(Ke(),qe(Pt,{key:0},xn(s,I=>D("button",{key:I,type:"button",class:ct(["step-val-btn",{active:o.value===I}]),onClick:N=>o.value=I},Ce(I)+"mm ",11,tL)),64)):(Ke(),qe(Pt,{key:1},xn(r,I=>D("button",{key:I,type:"button",class:ct(["step-val-btn",{active:a.value===I}]),onClick:N=>a.value=I},Ce(I)+"° ",11,nL)),64))])]),D("div",iL,[n.value==="CARTESIAN"?(Ke(),qe("div",sL,[(Ke(),qe(Pt,null,xn(y,I=>D("div",{key:I.name,class:"jog-axis-row"},[D("span",rL,Ce(I.name),1),D("span",oL,Ce(I.label),1),D("div",aL,[D("button",{type:"button",class:ct(["jog-btn minus",{holding:f.value===`${I.name}_-`}]),disabled:!c.value,onPointerdown:N=>g(N,I.name,-1),onPointerup:p,onPointerleave:p,onPointercancel:p,onClick:N=>b(I.name,-1)}," - "+Ce(I.name),43,lL),D("button",{type:"button",class:ct(["jog-btn plus",{holding:f.value===`${I.name}_+`}]),disabled:!c.value,onPointerdown:N=>g(N,I.name,1),onPointerup:p,onPointerleave:p,onPointercancel:p,onClick:N=>b(I.name,1)}," + "+Ce(I.name),43,cL)])])),64))])):(Ke(),qe("div",uL,[(Ke(),qe(Pt,null,xn(w,I=>D("div",{key:I.name,class:"jog-axis-row"},[D("span",fL,Ce(I.name),1),D("span",dL,Ce(I.label),1),D("div",hL,[D("button",{type:"button",class:ct(["jog-btn minus",{holding:f.value===`${I.name}_-`}]),disabled:!c.value,onPointerdown:N=>g(N,I.name,-1),onPointerup:p,onPointerleave:p,onPointercancel:p,onClick:N=>b(I.name,-1)}," - "+Ce(I.name),43,pL),D("button",{type:"button",class:ct(["jog-btn plus",{holding:f.value===`${I.name}_+`}]),disabled:!c.value,onPointerdown:N=>g(N,I.name,1),onPointerup:p,onPointerleave:p,onPointercancel:p,onClick:N=>b(I.name,1)}," + "+Ce(I.name),43,mL)])])),64))]))]),D("div",gL,[h.value?(Ke(),qe("span",_L,"⚠️ "+Ce(h.value),1)):c.value?i.value==="HOLD"?(Ke(),qe("span",bL," 💡 按住连续点动：鼠标按下即持续以 60ms 心跳运动，松开按键或移出立即停止。 ")):(Ke(),qe("span",SL," 💡 步进增量点动：每次点击沿指定方向移动 "+Ce(l.value)+" "+Ce(n.value==="CARTESIAN"?"mm":"°")+"。 ",1)):(Ke(),qe("span",vL," ⚠️ 点动未就绪：请确保处于 MANUAL 手动模式、伺服上电 (Drives ON) 且急停已复位。 "))])])]))}}),yL=xr(xL,[["__scopeId","data-v-98f27279"]]),EL={class:"log-panel-container"},ML={class:"log-toolbar"},TL={class:"filter-group"},AL=["value"],wL=["value"],RL={class:"action-group"},NL={class:"toggle-check"},IL={class:"toggle-check"},CL={class:"log-stats-bar"},LL={class:"stats-pills"},PL={class:"stat-pill warn"},DL={class:"stat-pill error"},UL={key:0,class:"log-error-banner"},OL={key:0,class:"empty-hint"},FL={class:"col-id"},BL=["title"],VL={class:"col-cat"},GL={class:"col-src"},kL={class:"col-msg"},zL=vr({__name:"LogPanel",props:{active:{type:Boolean,default:!0}},setup(t){const e=t,n=Qe("ALL"),i=Qe("ALL"),s=Qe(""),r=Qe(!0),o=Qe(!0),a=Qe([]),l=Qe(0),c=Qe(!1),u=Qe(null),f=Qe(null);let h=null,d=null;const m=["ALL","INFO","WARN","ERROR"],v=["ALL","SYSTEM","SAFETY","MOTION","FIELDBUS","COMPILER","SCRIPT"],g=Vt(()=>{let w=0,M=0;for(const _ of a.value)_.level==="WARN"?w++:_.level==="ERROR"&&M++;return{total:a.value.length,warn:w,err:M}});function p(w){const M=w.indexOf("T");return M===-1?w:w.slice(M+1,M+13)}async function b(w=!1,M=!1){w||(c.value=!0),u.value=null;try{const _=M&&l.value>0?l.value:void 0,x=await Gt.fetchLogs({level:n.value,category:i.value,q:s.value,after_id:_,limit:300});if(M&&_!==void 0){if(x.entries.length>0){const I=[...a.value,...x.entries];a.value=I.length>300?I.slice(I.length-300):I}x.latest_id<l.value&&(a.value=x.entries)}else a.value=x.entries;l.value=x.latest_id,o.value&&(!M||x.entries.length>0)&&(await ao(),f.value&&(f.value.scrollTop=f.value.scrollHeight))}catch(_){u.value=(_==null?void 0:_.message)||"获取日志失败"}finally{c.value=!1}}async function A(){try{await Gt.clearLogs(),l.value=0,a.value=[],await b(!1,!1)}catch(w){u.value=(w==null?void 0:w.message)||"清空日志失败"}}async function y(w){try{const M=await Gt.exportLogs({level:n.value,category:i.value,q:s.value,format:w});if(!M.ok){u.value=M.error||"导出日志失败";return}const _=new Blob([M.content],{type:M.contentType||"text/plain;charset=utf-8"}),x=URL.createObjectURL(_),I=document.createElement("a");I.href=x,I.download=M.filename||`bass-logs.${w==="text"?"txt":"jsonl"}`,document.body.appendChild(I),I.click(),document.body.removeChild(I),URL.revokeObjectURL(x)}catch(M){u.value=(M==null?void 0:M.message)||"导出日志失败"}}return Bi([n,i],()=>{l.value=0,b(!1,!1)}),Bi(s,()=>{d!==null&&clearTimeout(d),d=window.setTimeout(()=>{l.value=0,b(!0,!1)},300)}),Bi(()=>e.active,w=>{w&&b(!0,l.value>0)}),br(()=>{b(!1,!1),h=window.setInterval(()=>{e.active&&r.value&&b(!0,l.value>0)},1200)}),Co(()=>{h!==null&&(clearInterval(h),h=null),d!==null&&(clearTimeout(d),d=null)}),(w,M)=>(Ke(),qe("div",EL,[D("div",ML,[D("div",TL,[yn(D("select",{"onUpdate:modelValue":M[0]||(M[0]=_=>n.value=_),class:"filter-select",title:"日志级别过滤"},[(Ke(),qe(Pt,null,xn(m,_=>D("option",{key:_,value:_},Ce(_==="ALL"?"全部级别":_),9,AL)),64))],512),[[Wc,n.value]]),yn(D("select",{"onUpdate:modelValue":M[1]||(M[1]=_=>i.value=_),class:"filter-select",title:"日志模块分类"},[(Ke(),qe(Pt,null,xn(v,_=>D("option",{key:_,value:_},Ce(_==="ALL"?"全部分类":_),9,wL)),64))],512),[[Wc,i.value]]),yn(D("input",{"onUpdate:modelValue":M[2]||(M[2]=_=>s.value=_),type:"text",class:"search-input",placeholder:"搜索关键字...",onKeyup:M[3]||(M[3]=Xc(_=>b(),["enter"]))},null,544),[[Hc,s.value]]),D("button",{type:"button",class:"tool-btn",onClick:M[4]||(M[4]=_=>b())},Ce(c.value?"加载...":"🔍 查询"),1)]),D("div",RL,[D("label",NL,[yn(D("input",{"onUpdate:modelValue":M[5]||(M[5]=_=>r.value=_),type:"checkbox"},null,512),[[Za,r.value]]),M[9]||(M[9]=D("span",null,"自动刷新",-1))]),D("label",IL,[yn(D("input",{"onUpdate:modelValue":M[6]||(M[6]=_=>o.value=_),type:"checkbox"},null,512),[[Za,o.value]]),M[10]||(M[10]=D("span",null,"滚到底部",-1))]),D("button",{type:"button",class:"tool-btn export-btn",onClick:M[7]||(M[7]=_=>y("jsonl"))}," ⬇ JSONL "),D("button",{type:"button",class:"tool-btn export-btn",onClick:M[8]||(M[8]=_=>y("text"))}," ⬇ TXT "),D("button",{type:"button",class:"tool-btn clear-btn",onClick:A}," 🗑 清空 ")])]),D("div",CL,[D("span",null,"显示 "+Ce(g.value.total)+" 条记录 (最新 ID #"+Ce(l.value)+")",1),D("div",LL,[D("span",PL,"WARN: "+Ce(g.value.warn),1),D("span",DL,"ERROR: "+Ce(g.value.err),1)])]),u.value?(Ke(),qe("div",UL,"⚠ "+Ce(u.value),1)):Dn("",!0),D("div",{ref_key:"listRef",ref:f,class:"log-list"},[a.value.length===0?(Ke(),qe("div",OL,"暂无匹配的结构化日志记录")):Dn("",!0),(Ke(!0),qe(Pt,null,xn(a.value,_=>(Ke(),qe("div",{key:_.id,class:ct(["log-row",_.level.toLowerCase()])},[D("span",FL,"#"+Ce(_.id),1),D("span",{class:"col-time",title:_.timestamp_iso},Ce(p(_.timestamp_iso)),9,BL),D("span",{class:ct(["col-level",_.level.toLowerCase()])},Ce(_.level),3),D("span",VL,Ce(_.category),1),D("span",GL,Ce(_.source),1),D("span",kL,Ce(_.message),1)],2))),128))],512)]))}}),HL=xr(zL,[["__scopeId","data-v-897a80eb"]]),WL={class:"bass-app"},XL={class:"msg-prefix"},YL={class:"msg-text"},$L={class:"msg-meta"},KL={class:"editor-pane"},ZL={class:"right-workbench"},JL={class:"viewport-pane"},qL={class:"monitor-pane"},jL={class:"right-pane-tabs"},QL={class:"right-pane-body"},eP=vr({__name:"App",setup(t){const n=Qe({op_mode:"MANUAL",drives_on:!1,emergency_stop:!1,speed_override:100,interpreter_state:"IDLE",motion_state:"IDLE",active_program:"MoveSquare.rhai",current_line:0,joint_actual:[-90,-90,90,-90,-90,0],joint_torque:[0,0,0,0,0,0],cart_actual:{x:-134,y:492,z:423,a:0,b:0,c:180},digital_out:[!1,!1,!1,!1,!1,!1,!1,!1],plant_online:!1,rtt_ms:0,cycle_count:0,sim_tick:0,status_message:"系统启动中..."}),i=Qe(!1),s=Qe("monitor"),r=Qe(!1),o=Qe(null);let a=null,l=null,c=null;function u(m){n.value=m}function f(m){i.value=m}function h(m){n.value.speed_override=m}function d(m){o.value=m,c!==null&&clearTimeout(c),c=window.setTimeout(()=>{o.value=null},5e3)}return br(async()=>{try{const m=await Gt.fetchState();n.value=m}catch{}a=new JE(u,f),a.connect(),l=window.setInterval(async()=>{if(!i.value)try{const m=await Gt.fetchState();n.value=m}catch{}},2e3)}),Co(()=>{a&&(a.disconnect(),a=null),l!==null&&(clearInterval(l),l=null),c!==null&&(clearTimeout(c),c=null)}),(m,v)=>(Ke(),qe("div",WL,[mn(_M,{snapshot:n.value,"onUpdate:override":h,onActionError:d},null,8,["snapshot"]),D("div",{class:ct(["system-message-bar",{"is-error":!!o.value||n.value.interpreter_state==="ERROR"||n.value.emergency_stop||!n.value.plant_online}])},[D("span",XL,Ce(o.value?"ERR":"MSG"),1),D("span",YL,Ce(o.value||n.value.status_message||"系统就绪"),1),D("span",$L,[D("span",null,"CYCLE #"+Ce(n.value.cycle_count),1),D("span",{class:ct(["ws-pill",{live:i.value}])},Ce(i.value?"gRPC 25Hz":"gRPC 轮询"),3)])],2),D("main",{class:ct(["main-workspace",{"viewport-expanded":r.value}])},[yn(D("section",KL,[mn(oT,{snapshot:n.value},null,8,["snapshot"])],512),[[Ho,!r.value]]),D("section",ZL,[D("div",JL,[mn(bC,{snapshot:n.value,expanded:r.value,onToggleExpand:v[0]||(v[0]=g=>r.value=!r.value)},null,8,["snapshot","expanded"])]),yn(D("section",qL,[D("div",jL,[D("button",{type:"button",class:ct(["pane-tab-btn",{active:s.value==="monitor"}]),onClick:v[1]||(v[1]=g=>s.value="monitor")}," 🎛 示教监控与点动 ",2),D("button",{type:"button",class:ct(["pane-tab-btn",{active:s.value==="logs"}]),onClick:v[2]||(v[2]=g=>s.value="logs")}," 📋 日志管理 ",2)]),D("div",QL,[yn(mn(yL,{snapshot:n.value},null,8,["snapshot"]),[[Ho,s.value==="monitor"]]),yn(mn(HL,{active:s.value==="logs"},null,8,["active"]),[[Ho,s.value==="logs"]])])],512),[[Ho,!r.value]])])],2)]))}}),tP=xr(eP,[["__scopeId","data-v-68312311"]]);dS(tP).mount("#app");
