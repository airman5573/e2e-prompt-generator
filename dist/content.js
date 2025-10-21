(function(){"use strict";const nt="attributePreferences",A=["id","class"],w={builtInAttributes:["id"],customAttributes:[]};function C(t){return typeof t=="string"?t.trim():""}function _(t){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(t)}function F(t){const n=new Set,r=[];return t.forEach(o=>{const i=o.toLowerCase();n.has(i)||(n.add(i),r.push(o))}),r}function R(t){const n=new Set(Array.isArray(t)?t.map(o=>o.toLowerCase()).filter(Boolean):[]),r=A.filter(o=>n.has(o));return r.length?r:[...w.builtInAttributes]}function rt(t){if(Array.isArray(t)){const n=[],r=[];return t.forEach(o=>{const i=C(o);if(!i)return;const s=i.toLowerCase();if(A.includes(s)){n.push(s);return}_(s)&&r.push(s)}),{builtInAttributes:R(n),customAttributes:F(r)}}if(t&&typeof t=="object"){const n=Array.isArray(t.builtInAttributes)?t.builtInAttributes:[],r=Array.isArray(t.customAttributes)?t.customAttributes:[],o=R(n.map(s=>C(s).toLowerCase()).filter(s=>A.includes(s))),i=F(r.map(s=>C(s).toLowerCase()).filter(s=>s&&_(s)).filter(s=>!A.includes(s)));return{builtInAttributes:o,customAttributes:i}}return{builtInAttributes:[...w.builtInAttributes],customAttributes:[...w.customAttributes]}}function $(t){const n=rt(t),r=n.builtInAttributes||[],o=new Set(r.map(s=>s.toLowerCase())),i=[...r];return(n.customAttributes||[]).forEach(s=>{const u=C(s);if(!u||!_(u))return;const d=u.toLowerCase();o.has(d)||(o.add(d),i.push(u))}),i.length?i:[...w.builtInAttributes]}function U(t){return typeof t!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(t):t.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function ot(t){return typeof t=="string"?t.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function it({defaults:t=w,storage:n=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:r=nt}={}){let o=$(t);function i(a){return o=$(a),o}function s(a){if(!a||a.nodeType!==Node.ELEMENT_NODE)return null;for(const l of o){let c=null;if(l==="id"?c=a.id?.trim()||null:l==="class"?c=Array.from(a.classList||[]).find(Boolean)||null:c=a.getAttribute(l)?.trim()||null,c)return{attribute:l,value:c}}return null}function u(a){if(!a)return null;const{attribute:l,value:c}=a;return!l||!c?null:l==="id"?`#${U(c)}`:l==="class"?`.${U(c)}`:`[${l}="${ot(c)}"]`}function d(a){const l=s(a);return l?{element:a,attribute:l.attribute,value:l.value,selector:u(l)}:null}function kt(a){let l=a instanceof Element?a:null;for(;l;){const c=d(l);if(c&&c.selector)return c;l=l.parentElement}return null}function Mt(a){if(!n){const l=i(t);a?.(l,t);return}n.get([r],l=>{let c=t;chrome?.runtime?.lastError||(c=l?.[r]??t);const S=i(c);a?.(S,c)})}function Pt(a,l,c){if(l!=="sync"||!a||!a[r])return;const S=a[r].newValue,_t=i(S);c?.(_t,S)}function Nt(){return[...o]}return{updateActiveAttributes:i,getSelectorDetails:d,findElementBySelector:kt,refreshFromStorage:Mt,handleStorageChange:Pt,getAttributePriority:Nt}}let p=null,b=null,v=null,y=null;function st(){if(!document.querySelector("#element-inspector-highlight-style")){const t=document.createElement("style");t.id="element-inspector-highlight-style",t.textContent=`
      .__element-inspector-overlay__ {
        position: fixed !important;
        pointer-events: none !important;
        z-index: 999998 !important;
        border: 3px solid red !important;
        background-color: rgba(255, 0, 0, 0.1) !important;
        box-sizing: border-box !important;
        will-change: transform !important;
        transition: none !important;
      }
      .element-inspector-snackbar {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #323232;
        color: white;
        padding: 14px 24px;
        border-radius: 4px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 2147483647;
        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
        animation: snackbar-fade-in 0.3s ease-out;
      }
      @keyframes snackbar-fade-in {
        from {
          opacity: 0;
          transform: translate(-50%, -40%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      @keyframes snackbar-fade-out {
        from {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -40%);
        }
      }
    `,document.head.appendChild(t)}}function lt(){return p||(p=document.createElement("div"),p.className="__element-inspector-overlay__",document.body.appendChild(p)),p}function I(t){!p||!t||(v=t,!b&&(b=window.requestAnimationFrame(()=>{if(!p||!v){b=null;return}const n=v.getBoundingClientRect(),{top:r,left:o,width:i,height:s}=n;(!y||y.top!==r||y.left!==o||y.width!==i||y.height!==s)&&(p.style.top=`${r}px`,p.style.left=`${o}px`,p.style.width=`${i}px`,p.style.height=`${s}px`,y={top:r,left:o,width:i,height:s}),v=null,b=null})))}function L(){b&&(cancelAnimationFrame(b),b=null),v=null,y=null,p&&(p.remove(),p=null)}let f=null;const q="e2e-prompt-overlay-close-request";function k(){if(f||(f=document.querySelector("#e2e-prompt-overlay"),f))return f;const t=document.createElement("div");t.id="e2e-prompt-overlay",t.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(17, 24, 39, 0.45);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    padding: 24px;
    box-sizing: border-box;
  `,t.addEventListener("click",d=>{d.target===t&&(d.stopPropagation(),t.dispatchEvent(new CustomEvent(q,{bubbles:!0})))});const n=document.createElement("div");n.id="e2e-prompt-modal",n.style.cssText=`
    width: 420px;
    max-width: 80vw;
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 20px 48px rgba(15, 23, 42, 0.25);
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `,n.addEventListener("click",d=>d.stopPropagation());const r=document.createElement("h2");r.textContent="E2E 테스트 시나리오",r.style.cssText=`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  `;const o=document.createElement("textarea");o.id="prompt-textarea",o.setAttribute("spellcheck","false"),o.style.cssText=`
    width: 100%;
    min-height: 200px;
    max-height: 60vh;
    resize: vertical;
    padding: 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #111827;
    background: #f9fafb;
    box-sizing: border-box;
    outline: none;
  `;const i=document.createElement("div");i.style.cssText=`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    gap: 12px;
  `;const s=document.createElement("span");s.textContent="Enter: 다음단계 | Cmd+Enter: 단계추가 | ESC: 현재단계유지",s.style.cssText=`
    font-size: 12px;
    color: #6b7280;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;const u=document.createElement("button");return u.id="copy-prompt-btn",u.type="button",u.textContent="복사하기",u.style.cssText=`
    padding: 10px 16px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
  `,i.appendChild(s),i.appendChild(u),n.appendChild(r),n.appendChild(o),n.appendChild(i),t.appendChild(n),document.body.appendChild(t),f=t,f}function m(){return k().querySelector("#prompt-textarea")}function V(){return k().querySelector("#copy-prompt-btn")}function at(){const t=k();t.style.display="flex"}function O(){const t=f||document.querySelector("#e2e-prompt-overlay");t&&(t.style.display="none")}function x(t,n=3e3,r="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const i=document.createElement("div");i.className="element-inspector-snackbar",i.textContent=t,i.style.backgroundColor=r,document.body.appendChild(i),window.setTimeout(()=>{i.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{i.remove()},300)},n)}let g=!1;const h=it(),e={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},H="e2ePromptSnapshots",ct=3e3,j=50;let T=null,z=null;function ut(){return[e.promptText||"",e.currentStepNumber||0,e.caretPosition||0,e.currentSelector||"",e.currentAttribute||""].join("||")}function pt(){if(typeof window>"u"||!window.localStorage)return[];try{const t=window.localStorage.getItem(H);if(!t)return[];const n=JSON.parse(t);if(Array.isArray(n))return n}catch(t){console.warn("[Element Inspector] Failed to parse prompt snapshots",t)}return[]}function dt(t){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(H,JSON.stringify(t))}catch(n){console.warn("[Element Inspector] Failed to persist prompt snapshots",n)}}function B(){if(typeof window>"u"||!window.localStorage||!(typeof e.promptText=="string"&&e.promptText.trim().length>0||!!e.currentSelector))return;const n=ut();if(n===z)return;const r={timestamp:new Date().toISOString(),promptText:e.promptText,currentStepNumber:e.currentStepNumber,caretPosition:e.caretPosition,currentSelector:e.currentSelector,currentAttribute:e.currentAttribute,mode:e.mode,pageUrl:window.location.href},o=pt();o.push(r),o.length>j&&o.splice(0,o.length-j),dt(o),z=n}function ft(){T===null&&(T=window.setInterval(()=>{try{B()}catch(t){console.warn("[Element Inspector] Snapshot timer error",t)}},ct))}function mt(){T!==null&&(window.clearInterval(T),T=null,z=null)}function E(){return e.currentElement&&document.contains(e.currentElement)?e.currentElement:(e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,null)}function K(){const t=E();if(!t){L();return}const n=h.getSelectorDetails(t);if(n){P(n.element,n);return}L(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null}function ht(){h.refreshFromStorage(()=>{K()})}ht(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((t,n)=>{h.handleStorageChange(t,n,()=>{K()})});let Y=!1,X=!1;function G(){const t=k(),n=m(),r=V();return!X&&t&&(t.addEventListener(q,()=>{e.isModalOpen&&J()}),X=!0),!Y&&n&&r&&(n.addEventListener("keydown",wt),n.addEventListener("input",vt),n.addEventListener("click",Q),n.addEventListener("keyup",Q),r.addEventListener("click",Tt),Y=!0),{overlay:t,textarea:n,copyButton:r}}function M(t){!t||typeof t.clientX!="number"||typeof t.clientY!="number"||(t.clientX,t.clientY)}function P(t,n){if(!t||e.mode!=="highlight")return;const r=n||h.getSelectorDetails(t);!r||!r.selector||(e.currentElement=t,e.currentSelector=r.selector,e.currentAttribute=r.attribute,lt(),I(t),typeof t.scrollIntoView=="function"&&(t.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{e.currentElement===t&&I(t)},300)))}function bt(){const t=E();if(!t)return;let n=t.parentElement;for(;n;){const r=h.getSelectorDetails(n);if(r){P(n,r);return}n=n.parentElement}x("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function yt(){const t=E();if(!t)return;const n=o=>{for(const i of o.children){const s=h.getSelectorDetails(i);if(s)return s;const u=n(i);if(u)return u}return null},r=n(t);r?P(r.element,r):x("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function gt(t,n,r){const o=Math.min(Math.max(n,0),t.length);return t.slice(0,o)+r+t.slice(o)}function xt(t){const n=E();if(!n){x("⚠️ 선택된 요소가 없습니다");return}const r=h.getSelectorDetails(n);if(!r||!r.selector){x("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}const{textarea:o,copyButton:i}=G();if(!o)return;e.currentSelector=r.selector,e.currentAttribute=r.attribute;const s=`${r.selector} `;if(e.promptText===""&&e.currentStepNumber===1)e.promptText=`1. ${s}`,e.caretPosition=e.promptText.length;else{const d=typeof e.caretPosition=="number"?e.caretPosition:e.promptText.length;e.promptText=gt(e.promptText,d,s),e.caretPosition=d+s.length}o.value=e.promptText,e.mode="modal-open",e.isModalOpen=!0,i&&(i.textContent="복사하기"),at(),window.requestAnimationFrame(()=>{o.focus(),o.selectionStart=e.caretPosition,o.selectionEnd=e.caretPosition})}function D(){const t=m();t&&(t.value=e.promptText),e.mode="highlight",e.isModalOpen=!1,O()}function Et(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,t.value=e.promptText,t.focus(),t.selectionStart=e.caretPosition,t.selectionEnd=e.caretPosition)}function St(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,D())}function J(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.promptText.endsWith(" ")||(e.promptText+=" ",e.caretPosition=e.promptText.length),D())}function wt(t){if(e.isModalOpen){if(t.key==="Enter"&&(t.metaKey||t.ctrlKey)){t.preventDefault(),Et();return}if(t.key==="Enter"&&!t.shiftKey){t.preventDefault(),St();return}t.key==="Escape"&&(t.preventDefault(),J())}}function vt(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart)}function Q(){const t=m();t&&(e.caretPosition=t.selectionStart)}function Tt(){const t=m(),n=V();if(!(!t||!n)){if(e.promptText=t.value,e.caretPosition=t.selectionStart,!navigator?.clipboard?.writeText){x("❌ 복사 실패");return}navigator.clipboard.writeText(e.promptText).then(()=>{n.textContent="복사됨!",window.setTimeout(()=>{e.isModalOpen&&D()},500),window.setTimeout(()=>{n.textContent="복사하기"},2e3)}).catch(()=>{x("❌ 복사 실패")})}}function W(t){if(M(t),!g||e.mode!=="highlight")return;const n=h.findElementBySelector(t.target);if(n){if(e.currentElement===n.element){e.currentSelector=n.selector,e.currentAttribute=n.attribute,I(n.element);return}P(n.element,n)}}function Z(t){M(t),e.mode==="highlight"&&e.currentElement===t.target&&(L(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null)}function tt(t){!g||e.mode!=="highlight"||!E()||(t.key==="ArrowUp"?(t.preventDefault(),bt()):t.key==="ArrowDown"?(t.preventDefault(),yt()):(t.code==="Space"||t.key===" ")&&(t.preventDefault(),xt()))}function N(){const t=E();t&&I(t)}function At(){document.addEventListener("mouseover",W,!0),document.addEventListener("mouseout",Z,!0),document.addEventListener("keydown",tt,!0),document.addEventListener("mousemove",M,!0),window.addEventListener("scroll",N,!0),window.addEventListener("resize",N,!0)}function Ct(){document.removeEventListener("mouseover",W,!0),document.removeEventListener("mouseout",Z,!0),document.removeEventListener("keydown",tt,!0),document.removeEventListener("mousemove",M,!0),window.removeEventListener("scroll",N,!0),window.removeEventListener("resize",N,!0)}function It(){g||(st(),G(),O(),At(),ft(),B(),g=!0,console.log("[Element Inspector] 활성화됨"))}function Lt(){if(!g)return;B(),mt(),Ct(),L(),O(),e.mode="highlight",e.isModalOpen=!1,e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,g=!1;const t=document.querySelector(".element-inspector-snackbar");t&&t.remove(),console.log("[Element Inspector] 비활성화됨")}function et(t){t?It():Lt()}chrome.runtime.onMessage.addListener((t,n,r)=>{!t||!t.type||t.type==="ELEMENT_INSPECTOR_SET_STATE"&&(et(!!t.enabled),r({enabled:g}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},t=>{if(chrome.runtime.lastError)return;const n=!!t?.enabled;et(n)})}catch(t){console.warn("[Element Inspector] 상태 요청 실패",t)}})();
