(function(){"use strict";const W="attributePreferences",T=["id","class"],v={builtInAttributes:["id"],customAttributes:[]};function A(t){return typeof t=="string"?t.trim():""}function z(t){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(t)}function O(t){const n=new Set,r=[];return t.forEach(o=>{const i=o.toLowerCase();n.has(i)||(n.add(i),r.push(o))}),r}function B(t){const n=new Set(Array.isArray(t)?t.map(o=>o.toLowerCase()).filter(Boolean):[]),r=T.filter(o=>n.has(o));return r.length?r:[...v.builtInAttributes]}function X(t){if(Array.isArray(t)){const n=[],r=[];return t.forEach(o=>{const i=A(o);if(!i)return;const l=i.toLowerCase();if(T.includes(l)){n.push(l);return}z(l)&&r.push(l)}),{builtInAttributes:B(n),customAttributes:O(r)}}if(t&&typeof t=="object"){const n=Array.isArray(t.builtInAttributes)?t.builtInAttributes:[],r=Array.isArray(t.customAttributes)?t.customAttributes:[],o=B(n.map(l=>A(l).toLowerCase()).filter(l=>T.includes(l))),i=O(r.map(l=>A(l).toLowerCase()).filter(l=>l&&z(l)).filter(l=>!T.includes(l)));return{builtInAttributes:o,customAttributes:i}}return{builtInAttributes:[...v.builtInAttributes],customAttributes:[...v.customAttributes]}}function D(t){const n=X(t),r=n.builtInAttributes||[],o=new Set(r.map(l=>l.toLowerCase())),i=[...r];return(n.customAttributes||[]).forEach(l=>{const u=A(l);if(!u||!z(u))return;const p=u.toLowerCase();o.has(p)||(o.add(p),i.push(u))}),i.length?i:[...v.builtInAttributes]}function F(t){return typeof t!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(t):t.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function Z(t){return typeof t=="string"?t.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function G({defaults:t=v,storage:n=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:r=W}={}){let o=D(t);function i(a){return o=D(a),o}function l(a){if(!a||a.nodeType!==Node.ELEMENT_NODE)return null;for(const s of o){let c=null;if(s==="id"?c=a.id?.trim()||null:s==="class"?c=Array.from(a.classList||[]).find(Boolean)||null:c=a.getAttribute(s)?.trim()||null,c)return{attribute:s,value:c}}return null}function u(a){if(!a)return null;const{attribute:s,value:c}=a;return!s||!c?null:s==="id"?`#${F(c)}`:s==="class"?`.${F(c)}`:`[${s}="${Z(c)}"]`}function p(a){const s=l(a);return s?{element:a,attribute:s.attribute,value:s.value,selector:u(s)}:null}function bt(a){let s=a instanceof Element?a:null;for(;s;){const c=p(s);if(c&&c.selector)return c;s=s.parentElement}return null}function yt(a){if(!n){const s=i(t);a?.(s,t);return}n.get([r],s=>{let c=t;chrome?.runtime?.lastError||(c=s?.[r]??t);const S=i(c);a?.(S,c)})}function xt(a,s,c){if(s!=="sync"||!a||!a[r])return;const S=a[r].newValue,Et=i(S);c?.(Et,S)}function gt(){return[...o]}return{updateActiveAttributes:i,getSelectorDetails:p,findElementBySelector:bt,refreshFromStorage:yt,handleStorageChange:xt,getAttributePriority:gt}}let d=null,b=null,w=null,y=null;function Q(){if(!document.querySelector("#element-inspector-highlight-style")){const t=document.createElement("style");t.id="element-inspector-highlight-style",t.textContent=`
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
    `,document.head.appendChild(t)}}function J(){return d||(d=document.createElement("div"),d.className="__element-inspector-overlay__",document.body.appendChild(d)),d}function C(t){!d||!t||(w=t,!b&&(b=window.requestAnimationFrame(()=>{if(!d||!w){b=null;return}const n=w.getBoundingClientRect(),{top:r,left:o,width:i,height:l}=n;(!y||y.top!==r||y.left!==o||y.width!==i||y.height!==l)&&(d.style.top=`${r}px`,d.style.left=`${o}px`,d.style.width=`${i}px`,d.style.height=`${l}px`,y={top:r,left:o,width:i,height:l}),w=null,b=null})))}function k(){b&&(cancelAnimationFrame(b),b=null),w=null,y=null,d&&(d.remove(),d=null)}let f=null;function L(){if(f||(f=document.querySelector("#e2e-prompt-overlay"),f))return f;const t=document.createElement("div");t.id="e2e-prompt-overlay",t.style.cssText=`
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
  `,t.addEventListener("click",p=>{p.stopPropagation(),p.preventDefault()});const n=document.createElement("div");n.id="e2e-prompt-modal",n.style.cssText=`
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
  `,n.addEventListener("click",p=>p.stopPropagation());const r=document.createElement("h2");r.textContent="E2E 테스트 시나리오",r.style.cssText=`
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
  `;const l=document.createElement("span");l.textContent="Enter: 다음단계 | Cmd+Enter: 단계추가 | ESC: 현재단계유지",l.style.cssText=`
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
  `,i.appendChild(l),i.appendChild(u),n.appendChild(r),n.appendChild(o),n.appendChild(i),t.appendChild(n),document.body.appendChild(t),f=t,f}function m(){return L().querySelector("#prompt-textarea")}function $(){return L().querySelector("#copy-prompt-btn")}function tt(){const t=L();t.style.display="flex"}function _(){const t=f||document.querySelector("#e2e-prompt-overlay");t&&(t.style.display="none")}function g(t,n=3e3,r="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const i=document.createElement("div");i.className="element-inspector-snackbar",i.textContent=t,i.style.backgroundColor=r,document.body.appendChild(i),window.setTimeout(()=>{i.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{i.remove()},300)},n)}let x=!1;const h=G(),e={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0};function E(){return e.currentElement&&document.contains(e.currentElement)?e.currentElement:(e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,null)}function R(){const t=E();if(!t){k();return}const n=h.getSelectorDetails(t);if(n){M(n.element,n);return}k(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null}function et(){h.refreshFromStorage(()=>{R()})}et(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((t,n)=>{h.handleStorageChange(t,n,()=>{R()})});let U=!1;function q(){const t=L(),n=m(),r=$();return!U&&n&&r&&(n.addEventListener("keydown",ct),n.addEventListener("input",ut),n.addEventListener("click",V),n.addEventListener("keyup",V),r.addEventListener("click",dt),U=!0),{overlay:t,textarea:n,copyButton:r}}function I(t){!t||typeof t.clientX!="number"||typeof t.clientY!="number"||(t.clientX,t.clientY)}function M(t,n){if(!t||e.mode!=="highlight")return;const r=n||h.getSelectorDetails(t);!r||!r.selector||(e.currentElement=t,e.currentSelector=r.selector,e.currentAttribute=r.attribute,J(),C(t),typeof t.scrollIntoView=="function"&&(t.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{e.currentElement===t&&C(t)},300)))}function nt(){const t=E();if(!t)return;let n=t.parentElement;for(;n;){const r=h.getSelectorDetails(n);if(r){M(n,r);return}n=n.parentElement}g("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function rt(){const t=E();if(!t)return;const n=o=>{for(const i of o.children){const l=h.getSelectorDetails(i);if(l)return l;const u=n(i);if(u)return u}return null},r=n(t);r?M(r.element,r):g("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function ot(t,n,r){const o=Math.min(Math.max(n,0),t.length);return t.slice(0,o)+r+t.slice(o)}function it(t){const n=E();if(!n){g("⚠️ 선택된 요소가 없습니다");return}const r=h.getSelectorDetails(n);if(!r||!r.selector){g("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}const{textarea:o,copyButton:i}=q();if(!o)return;e.currentSelector=r.selector,e.currentAttribute=r.attribute;const l=`${r.selector} `;if(e.promptText===""&&e.currentStepNumber===1)e.promptText=`1. ${l}`,e.caretPosition=e.promptText.length;else{const p=typeof e.caretPosition=="number"?e.caretPosition:e.promptText.length;e.promptText=ot(e.promptText,p,l),e.caretPosition=p+l.length}o.value=e.promptText,e.mode="modal-open",e.isModalOpen=!0,i&&(i.textContent="복사하기"),tt(),window.requestAnimationFrame(()=>{o.focus(),o.selectionStart=e.caretPosition,o.selectionEnd=e.caretPosition})}function N(){const t=m();t&&(t.value=e.promptText),e.mode="highlight",e.isModalOpen=!1,_()}function lt(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,t.value=e.promptText,t.focus(),t.selectionStart=e.caretPosition,t.selectionEnd=e.caretPosition)}function st(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,N())}function at(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.promptText.endsWith(" ")||(e.promptText+=" ",e.caretPosition=e.promptText.length),N())}function ct(t){if(e.isModalOpen){if(t.key==="Enter"&&(t.metaKey||t.ctrlKey)){t.preventDefault(),lt();return}if(t.key==="Enter"&&!t.shiftKey){t.preventDefault(),st();return}t.key==="Escape"&&(t.preventDefault(),at())}}function ut(){const t=m();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart)}function V(){const t=m();t&&(e.caretPosition=t.selectionStart)}function dt(){const t=m(),n=$();if(!(!t||!n)){if(e.promptText=t.value,e.caretPosition=t.selectionStart,!navigator?.clipboard?.writeText){g("❌ 복사 실패");return}navigator.clipboard.writeText(e.promptText).then(()=>{n.textContent="복사됨!",window.setTimeout(()=>{e.isModalOpen&&N()},500),window.setTimeout(()=>{n.textContent="복사하기"},2e3)}).catch(()=>{g("❌ 복사 실패")})}}function j(t){if(I(t),!x||e.mode!=="highlight")return;const n=h.findElementBySelector(t.target);if(n){if(e.currentElement===n.element){e.currentSelector=n.selector,e.currentAttribute=n.attribute,C(n.element);return}M(n.element,n)}}function H(t){I(t),e.mode==="highlight"&&e.currentElement===t.target&&(k(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null)}function K(t){!x||e.mode!=="highlight"||!E()||(t.key==="ArrowUp"?(t.preventDefault(),nt()):t.key==="ArrowDown"?(t.preventDefault(),rt()):(t.code==="Space"||t.key===" ")&&(t.preventDefault(),it()))}function P(){const t=E();t&&C(t)}function pt(){document.addEventListener("mouseover",j,!0),document.addEventListener("mouseout",H,!0),document.addEventListener("keydown",K,!0),document.addEventListener("mousemove",I,!0),window.addEventListener("scroll",P,!0),window.addEventListener("resize",P,!0)}function ft(){document.removeEventListener("mouseover",j,!0),document.removeEventListener("mouseout",H,!0),document.removeEventListener("keydown",K,!0),document.removeEventListener("mousemove",I,!0),window.removeEventListener("scroll",P,!0),window.removeEventListener("resize",P,!0)}function mt(){x||(Q(),q(),_(),pt(),x=!0,console.log("[Element Inspector] 활성화됨"))}function ht(){if(!x)return;ft(),k(),_(),e.mode="highlight",e.isModalOpen=!1,e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,x=!1;const t=document.querySelector(".element-inspector-snackbar");t&&t.remove(),console.log("[Element Inspector] 비활성화됨")}function Y(t){t?mt():ht()}chrome.runtime.onMessage.addListener((t,n,r)=>{!t||!t.type||t.type==="ELEMENT_INSPECTOR_SET_STATE"&&(Y(!!t.enabled),r({enabled:x}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},t=>{if(chrome.runtime.lastError)return;const n=!!t?.enabled;Y(n)})}catch(t){console.warn("[Element Inspector] 상태 요청 실패",t)}})();
