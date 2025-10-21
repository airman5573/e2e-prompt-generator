(function(){"use strict";const st="attributePreferences",C=["id","class"],w={builtInAttributes:["id"],customAttributes:[]};function k(t){return typeof t=="string"?t.trim():""}function _(t){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(t)}function $(t){const n=new Set,r=[];return t.forEach(o=>{const i=o.toLowerCase();n.has(i)||(n.add(i),r.push(o))}),r}function U(t){const n=new Set(Array.isArray(t)?t.map(o=>o.toLowerCase()).filter(Boolean):[]),r=C.filter(o=>n.has(o));return r.length?r:[...w.builtInAttributes]}function lt(t){if(Array.isArray(t)){const n=[],r=[];return t.forEach(o=>{const i=k(o);if(!i)return;const s=i.toLowerCase();if(C.includes(s)){n.push(s);return}_(s)&&r.push(s)}),{builtInAttributes:U(n),customAttributes:$(r)}}if(t&&typeof t=="object"){const n=Array.isArray(t.builtInAttributes)?t.builtInAttributes:[],r=Array.isArray(t.customAttributes)?t.customAttributes:[],o=U(n.map(s=>k(s).toLowerCase()).filter(s=>C.includes(s))),i=$(r.map(s=>k(s).toLowerCase()).filter(s=>s&&_(s)).filter(s=>!C.includes(s)));return{builtInAttributes:o,customAttributes:i}}return{builtInAttributes:[...w.builtInAttributes],customAttributes:[...w.customAttributes]}}function q(t){const n=lt(t),r=n.builtInAttributes||[],o=new Set(r.map(s=>s.toLowerCase())),i=[...r];return(n.customAttributes||[]).forEach(s=>{const c=k(s);if(!c||!_(c))return;const d=c.toLowerCase();o.has(d)||(o.add(d),i.push(c))}),i.length?i:[...w.builtInAttributes]}function V(t){return typeof t!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(t):t.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function at(t){return typeof t=="string"?t.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function ct({defaults:t=w,storage:n=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:r=st}={}){let o=q(t);function i(a){return o=q(a),o}function s(a){if(!a||a.nodeType!==Node.ELEMENT_NODE)return null;for(const l of o){let u=null;if(l==="id"?u=a.id?.trim()||null:l==="class"?u=Array.from(a.classList||[]).find(Boolean)||null:u=a.getAttribute(l)?.trim()||null,u)return{attribute:l,value:u}}return null}function c(a){if(!a)return null;const{attribute:l,value:u}=a;return!l||!u?null:l==="id"?`#${V(u)}`:l==="class"?`.${V(u)}`:`[${l}="${at(u)}"]`}function d(a){const l=s(a);return l?{element:a,attribute:l.attribute,value:l.value,selector:c(l)}:null}function O(a){let l=a instanceof Element?a:null;for(;l;){const u=d(l);if(u&&u.selector)return u;l=l.parentElement}return null}function Ot(a){if(!n){const l=i(t);a?.(l,t);return}n.get([r],l=>{let u=t;chrome?.runtime?.lastError||(u=l?.[r]??t);const S=i(u);a?.(S,u)})}function _t(a,l,u){if(l!=="sync"||!a||!a[r])return;const S=a[r].newValue,Bt=i(S);u?.(Bt,S)}function zt(){return[...o]}return{updateActiveAttributes:i,getSelectorDetails:d,findElementBySelector:O,refreshFromStorage:Ot,handleStorageChange:_t,getAttributePriority:zt}}let p=null,y=null,T=null,g=null;function ut(){if(!document.querySelector("#element-inspector-highlight-style")){const t=document.createElement("style");t.id="element-inspector-highlight-style",t.textContent=`
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
    `,document.head.appendChild(t)}}function pt(){return p||(p=document.createElement("div"),p.className="__element-inspector-overlay__",document.body.appendChild(p)),p}function I(t){!p||!t||(T=t,!y&&(y=window.requestAnimationFrame(()=>{if(!p||!T){y=null;return}const n=T.getBoundingClientRect(),{top:r,left:o,width:i,height:s}=n;(!g||g.top!==r||g.left!==o||g.width!==i||g.height!==s)&&(p.style.top=`${r}px`,p.style.left=`${o}px`,p.style.width=`${i}px`,p.style.height=`${s}px`,g={top:r,left:o,width:i,height:s}),T=null,y=null})))}function L(){y&&(cancelAnimationFrame(y),y=null),T=null,g=null,p&&(p.remove(),p=null)}let h=null;const H="e2e-prompt-overlay-close-request";function M(){if(h||(h=document.querySelector("#e2e-prompt-overlay"),h))return h;const t=document.createElement("div");t.id="e2e-prompt-overlay",t.style.cssText=`
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
  `,t.addEventListener("click",d=>{d.target===t&&(d.stopPropagation(),t.dispatchEvent(new CustomEvent(H,{bubbles:!0})))});const n=document.createElement("div");n.id="e2e-prompt-modal",n.style.cssText=`
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
  `;const c=document.createElement("button");return c.id="copy-prompt-btn",c.type="button",c.textContent="복사하기",c.style.cssText=`
    padding: 10px 16px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
  `,i.appendChild(s),i.appendChild(c),n.appendChild(r),n.appendChild(o),n.appendChild(i),t.appendChild(n),document.body.appendChild(t),h=t,h}function b(){return M().querySelector("#prompt-textarea")}function j(){return M().querySelector("#copy-prompt-btn")}function K(){const t=M();t.style.display="flex"}function z(){const t=h||document.querySelector("#e2e-prompt-overlay");t&&(t.style.display="none")}function x(t,n=3e3,r="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const i=document.createElement("div");i.className="element-inspector-snackbar",i.textContent=t,i.style.backgroundColor=r,document.body.appendChild(i),window.setTimeout(()=>{i.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{i.remove()},300)},n)}let f=!1;const m=ct(),e={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},Y="e2ePromptSnapshots",dt=3e3,W=50;let v=null,B=null;function ft(){return[e.promptText||"",e.currentStepNumber||0,e.caretPosition||0,e.currentSelector||"",e.currentAttribute||""].join("||")}function mt(){if(typeof window>"u"||!window.localStorage)return[];try{const t=window.localStorage.getItem(Y);if(!t)return[];const n=JSON.parse(t);if(Array.isArray(n))return n}catch(t){console.warn("[Element Inspector] Failed to parse prompt snapshots",t)}return[]}function ht(t){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(Y,JSON.stringify(t))}catch(n){console.warn("[Element Inspector] Failed to persist prompt snapshots",n)}}function D(){if(typeof window>"u"||!window.localStorage||!(typeof e.promptText=="string"&&e.promptText.trim().length>0||!!e.currentSelector))return;const n=ft();if(n===B)return;const r={timestamp:new Date().toISOString(),promptText:e.promptText,currentStepNumber:e.currentStepNumber,caretPosition:e.caretPosition,currentSelector:e.currentSelector,currentAttribute:e.currentAttribute,mode:e.mode,pageUrl:window.location.href},o=mt();o.push(r),o.length>W&&o.splice(0,o.length-W),ht(o),B=n}function bt(){v===null&&(v=window.setInterval(()=>{try{D()}catch(t){console.warn("[Element Inspector] Snapshot timer error",t)}},dt))}function yt(){v!==null&&(window.clearInterval(v),v=null,B=null)}function gt(t){if(!(t instanceof Node))return!1;const n=document.querySelector("#e2e-prompt-overlay");return!!(n&&n.contains(t))}function E(){return e.currentElement&&document.contains(e.currentElement)?e.currentElement:(e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,null)}function X(){const t=E();if(!t){L();return}const n=m.getSelectorDetails(t);if(n){A(n.element,n);return}L(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null}function xt(){m.refreshFromStorage(()=>{X()})}xt(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((t,n)=>{m.handleStorageChange(t,n,()=>{X()})});let G=!1,J=!1;function F(){const t=M(),n=b(),r=j();return!J&&t&&(t.addEventListener(H,()=>{e.isModalOpen&&Z()}),J=!0),!G&&n&&r&&(n.addEventListener("keydown",Ct),n.addEventListener("input",kt),n.addEventListener("click",tt),n.addEventListener("keyup",tt),r.addEventListener("click",It),G=!0),{overlay:t,textarea:n,copyButton:r}}function P(t){!t||typeof t.clientX!="number"||typeof t.clientY!="number"||(t.clientX,t.clientY)}function A(t,n){if(!t||e.mode!=="highlight")return;const r=n||m.getSelectorDetails(t);!r||!r.selector||(e.currentElement=t,e.currentSelector=r.selector,e.currentAttribute=r.attribute,pt(),I(t),typeof t.scrollIntoView=="function"&&(t.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{e.currentElement===t&&I(t)},300)))}function Et(){const t=E();if(!t)return;let n=t.parentElement;for(;n;){const r=m.getSelectorDetails(n);if(r){A(n,r);return}n=n.parentElement}x("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function St(){const t=E();if(!t)return;const n=o=>{for(const i of o.children){const s=m.getSelectorDetails(i);if(s)return s;const c=n(i);if(c)return c}return null},r=n(t);r?A(r.element,r):x("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function wt(t,n,r){const o=Math.min(Math.max(n,0),t.length);return t.slice(0,o)+r+t.slice(o)}function Q(t){const n=E();if(!n){x("⚠️ 선택된 요소가 없습니다");return}const r=m.getSelectorDetails(n);if(!r||!r.selector){x("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}const{textarea:o,copyButton:i}=F();if(!o)return;e.currentSelector=r.selector,e.currentAttribute=r.attribute;const c=t?.type==="click"?`${r.selector} 클릭하면 `:`${r.selector} `;if(e.promptText===""&&e.currentStepNumber===1)e.promptText=`1. ${c}`,e.caretPosition=e.promptText.length;else{const O=typeof e.caretPosition=="number"?e.caretPosition:e.promptText.length;e.promptText=wt(e.promptText,O,c),e.caretPosition=O+c.length}o.value=e.promptText,e.mode="modal-open",e.isModalOpen=!0,i&&(i.textContent="복사하기"),K(),window.requestAnimationFrame(()=>{o.focus(),o.selectionStart=e.caretPosition,o.selectionEnd=e.caretPosition})}function R(){const t=b();t&&(t.value=e.promptText),e.mode="highlight",e.isModalOpen=!1,z()}function Tt(){const{textarea:t,copyButton:n}=F();t&&(typeof e.caretPosition!="number"&&(e.caretPosition=e.promptText.length),t.value=e.promptText,e.mode="modal-open",e.isModalOpen=!0,n&&(n.textContent="복사하기"),K(),window.requestAnimationFrame(()=>{const r=Math.min(Math.max(e.caretPosition,0),t.value.length);t.focus(),t.selectionStart=r,t.selectionEnd=r}))}function vt(){const t=b();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,t.value=e.promptText,t.focus(),t.selectionStart=e.caretPosition,t.selectionEnd=e.caretPosition)}function At(){const t=b();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.currentStepNumber+=1,e.promptText=`${e.promptText}
${e.currentStepNumber}. `,e.caretPosition=e.promptText.length,R())}function Z(){const t=b();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart,e.promptText.endsWith(" ")||(e.promptText+=" ",e.caretPosition=e.promptText.length),R())}function Ct(t){if(e.isModalOpen){if(t.key==="Enter"&&(t.metaKey||t.ctrlKey)){t.preventDefault(),vt();return}if(t.key==="Enter"&&!t.shiftKey){t.preventDefault(),At();return}t.key==="Escape"&&(t.preventDefault(),Z())}}function kt(){const t=b();t&&(e.promptText=t.value,e.caretPosition=t.selectionStart)}function tt(){const t=b();t&&(e.caretPosition=t.selectionStart)}function It(){const t=b(),n=j();if(!(!t||!n)){if(e.promptText=t.value,e.caretPosition=t.selectionStart,!navigator?.clipboard?.writeText){x("❌ 복사 실패");return}navigator.clipboard.writeText(e.promptText).then(()=>{n.textContent="복사됨!",window.setTimeout(()=>{e.isModalOpen&&R()},500),window.setTimeout(()=>{n.textContent="복사하기"},2e3)}).catch(()=>{x("❌ 복사 실패")})}}function et(t){if(!f||e.mode!=="highlight"||!(t instanceof MouseEvent)||t.button!==0||gt(t.target))return;const n=m.findElementBySelector(t.target);n&&(A(n.element,n),window.setTimeout(()=>{f&&Q({type:"click"})},0))}function nt(t){if(P(t),!f||e.mode!=="highlight")return;const n=m.findElementBySelector(t.target);if(n){if(e.currentElement===n.element){e.currentSelector=n.selector,e.currentAttribute=n.attribute,I(n.element);return}A(n.element,n)}}function rt(t){P(t),e.mode==="highlight"&&e.currentElement===t.target&&(L(),e.currentElement=null,e.currentSelector=null,e.currentAttribute=null)}function ot(t){if(!f)return;if(t.key==="Escape"&&!e.isModalOpen){t.preventDefault(),Tt();return}e.mode!=="highlight"||!E()||(t.key==="ArrowUp"?(t.preventDefault(),Et()):t.key==="ArrowDown"?(t.preventDefault(),St()):(t.code==="Space"||t.key===" ")&&(t.preventDefault(),Q(t)))}function N(){const t=E();t&&I(t)}function Lt(){document.addEventListener("mouseover",nt,!0),document.addEventListener("mouseout",rt,!0),document.addEventListener("keydown",ot,!0),document.addEventListener("mousemove",P,!0),document.addEventListener("click",et,!0),window.addEventListener("scroll",N,!0),window.addEventListener("resize",N,!0)}function Mt(){document.removeEventListener("mouseover",nt,!0),document.removeEventListener("mouseout",rt,!0),document.removeEventListener("keydown",ot,!0),document.removeEventListener("mousemove",P,!0),document.removeEventListener("click",et,!0),window.removeEventListener("scroll",N,!0),window.removeEventListener("resize",N,!0)}function Pt(){f||(ut(),F(),z(),Lt(),bt(),D(),f=!0,console.log("[Element Inspector] 활성화됨"))}function Nt(){if(!f)return;D(),yt(),Mt(),L(),z(),e.mode="highlight",e.isModalOpen=!1,e.currentElement=null,e.currentSelector=null,e.currentAttribute=null,f=!1;const t=document.querySelector(".element-inspector-snackbar");t&&t.remove(),console.log("[Element Inspector] 비활성화됨")}function it(t){t?Pt():Nt()}chrome.runtime.onMessage.addListener((t,n,r)=>{!t||!t.type||t.type==="ELEMENT_INSPECTOR_SET_STATE"&&(it(!!t.enabled),r({enabled:f}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},t=>{if(chrome.runtime.lastError)return;const n=!!t?.enabled;it(n)})}catch(t){console.warn("[Element Inspector] 상태 요청 실패",t)}})();
