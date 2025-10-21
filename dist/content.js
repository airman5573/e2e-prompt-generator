(function(){"use strict";const pe="attributePreferences",M=["id","class"],T={builtInAttributes:["id"],customAttributes:[]};function P(e){return typeof e=="string"?e.trim():""}function z(e){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(e)}function H(e){const t=new Set,o=[];return e.forEach(r=>{const l=r.toLowerCase();t.has(l)||(t.add(l),o.push(r))}),o}function K(e){const t=new Set(Array.isArray(e)?e.map(r=>r.toLowerCase()).filter(Boolean):[]),o=M.filter(r=>t.has(r));return o.length?o:[...T.builtInAttributes]}function me(e){if(Array.isArray(e)){const t=[],o=[];return e.forEach(r=>{const l=P(r);if(!l)return;const i=l.toLowerCase();if(M.includes(i)){t.push(i);return}z(i)&&o.push(i)}),{builtInAttributes:K(t),customAttributes:H(o)}}if(e&&typeof e=="object"){const t=Array.isArray(e.builtInAttributes)?e.builtInAttributes:[],o=Array.isArray(e.customAttributes)?e.customAttributes:[],r=K(t.map(i=>P(i).toLowerCase()).filter(i=>M.includes(i))),l=H(o.map(i=>P(i).toLowerCase()).filter(i=>i&&z(i)).filter(i=>!M.includes(i)));return{builtInAttributes:r,customAttributes:l}}return{builtInAttributes:[...T.builtInAttributes],customAttributes:[...T.customAttributes]}}function X(e){const t=me(e),o=t.builtInAttributes||[],r=new Set(o.map(i=>i.toLowerCase())),l=[...o];return(t.customAttributes||[]).forEach(i=>{const s=P(i);if(!s||!z(s))return;const d=s.toLowerCase();r.has(d)||(r.add(d),l.push(s))}),l.length?l:[...T.builtInAttributes]}function Y(e){return typeof e!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):e.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function he(e){return typeof e=="string"?e.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function ge({defaults:e=T,storage:t=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:o=pe}={}){let r=X(e);function l(c){return r=X(c),r}function i(c){if(!c||c.nodeType!==Node.ELEMENT_NODE)return null;for(const a of r){let u=null;if(a==="id"?u=c.id?.trim()||null:a==="class"?u=Array.from(c.classList||[]).find(Boolean)||null:u=c.getAttribute(a)?.trim()||null,u)return{attribute:a,value:u}}return null}function s(c){if(!c)return null;const{attribute:a,value:u}=c;return!a||!u?null:a==="id"?`#${Y(u)}`:a==="class"?`.${Y(u)}`:`[${a}="${he(u)}"]`}function d(c){const a=i(c);return a?{element:c,attribute:a.attribute,value:a.value,selector:s(a)}:null}function L(c){let a=c instanceof Element?c:null;for(;a;){const u=d(a);if(u&&u.selector)return u;a=a.parentElement}return null}function fe(c){if(!t){const a=l(e);c?.(a,e);return}t.get([o],a=>{let u=e;chrome?.runtime?.lastError||(u=a?.[o]??e);const w=l(u);c?.(w,u)})}function y(c,a,u){if(a!=="sync"||!c||!c[o])return;const w=c[o].newValue,Ke=l(w);u?.(Ke,w)}function D(){return[...r]}return{updateActiveAttributes:l,getSelectorDetails:d,findElementBySelector:L,refreshFromStorage:fe,handleStorageChange:y,getAttributePriority:D}}let f=null,b=null,A=null,S=null;function Ee(){if(!document.querySelector("#element-inspector-highlight-style")){const e=document.createElement("style");e.id="element-inspector-highlight-style",e.textContent=`
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
    `,document.head.appendChild(e)}}function ye(){return f||(f=document.createElement("div"),f.className="__element-inspector-overlay__",document.body.appendChild(f)),f}function N(e){!f||!e||(A=e,!b&&(b=window.requestAnimationFrame(()=>{if(!f||!A){b=null;return}const t=A.getBoundingClientRect(),{top:o,left:r,width:l,height:i}=t;(!S||S.top!==o||S.left!==r||S.width!==l||S.height!==i)&&(f.style.top=`${o}px`,f.style.left=`${r}px`,f.style.width=`${l}px`,f.style.height=`${i}px`,S={top:o,left:r,width:l,height:i}),A=null,b=null})))}function O(){b&&(cancelAnimationFrame(b),b=null),A=null,S=null,f&&(f.remove(),f=null)}let g=null;const G="e2e-prompt-overlay-close-request";function _(){if(g||(g=document.querySelector("#e2e-prompt-overlay"),g))return g;const e=document.createElement("div");e.id="e2e-prompt-overlay",e.style.cssText=`
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
  `,e.addEventListener("click",d=>{d.target===e&&(d.stopPropagation(),e.dispatchEvent(new CustomEvent(G,{bubbles:!0})))});const t=document.createElement("div");t.id="e2e-prompt-modal",t.style.cssText=`
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
  `,t.addEventListener("click",d=>d.stopPropagation());const o=document.createElement("h2");o.textContent="E2E 테스트 시나리오",o.style.cssText=`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  `;const r=document.createElement("textarea");r.id="prompt-textarea",r.setAttribute("spellcheck","false"),r.style.cssText=`
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
  `;const l=document.createElement("div");l.style.cssText=`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    gap: 12px;
  `;const i=document.createElement("span");i.textContent="Enter: 다음단계 | Cmd+Enter: 단계추가 | ESC: 현재단계유지",i.style.cssText=`
    font-size: 12px;
    color: #6b7280;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;const s=document.createElement("button");return s.id="copy-prompt-btn",s.type="button",s.textContent="복사하기",s.style.cssText=`
    padding: 10px 16px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
  `,l.appendChild(i),l.appendChild(s),t.appendChild(o),t.appendChild(r),t.appendChild(l),e.appendChild(t),document.body.appendChild(e),g=e,g}function E(){return _().querySelector("#prompt-textarea")}function W(){return _().querySelector("#copy-prompt-btn")}function J(){const e=_();e.style.display="flex"}function R(){const e=g||document.querySelector("#e2e-prompt-overlay");e&&(e.style.display="none")}function v(e,t=3e3,o="#323232"){const r=document.querySelector(".element-inspector-snackbar");r&&r.remove();const l=document.createElement("div");l.className="element-inspector-snackbar",l.textContent=e,l.style.backgroundColor=o,document.body.appendChild(l),window.setTimeout(()=>{l.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{l.remove()},300)},t)}let h=!1,$=null;const p=ge(),be=new Set(["A","BUTTON","INPUT","LABEL","SELECT","TEXTAREA"]),Se=new Set(["button","link","checkbox","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"]),n={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},Q="e2ePromptSnapshots",xe=3e3,Z=50;let C=null,U=null;function we(){return[n.promptText||"",n.currentStepNumber||0,n.caretPosition||0,n.currentSelector||"",n.currentAttribute||""].join("||")}function Te(){if(typeof window>"u"||!window.localStorage)return[];try{const e=window.localStorage.getItem(Q);if(!e)return[];const t=JSON.parse(e);if(Array.isArray(t))return t}catch(e){console.warn("[Element Inspector] Failed to parse prompt snapshots",e)}return[]}function Ae(e){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(Q,JSON.stringify(e))}catch(t){console.warn("[Element Inspector] Failed to persist prompt snapshots",t)}}function q(){if(typeof window>"u"||!window.localStorage||!(typeof n.promptText=="string"&&n.promptText.trim().length>0||!!n.currentSelector))return;const t=we();if(t===U)return;const o={timestamp:new Date().toISOString(),promptText:n.promptText,currentStepNumber:n.currentStepNumber,caretPosition:n.caretPosition,currentSelector:n.currentSelector,currentAttribute:n.currentAttribute,mode:n.mode,pageUrl:window.location.href},r=Te();r.push(o),r.length>Z&&r.splice(0,r.length-Z),Ae(r),U=t}function ve(){C===null&&(C=window.setInterval(()=>{try{q()}catch(e){console.warn("[Element Inspector] Snapshot timer error",e)}},xe))}function Ce(){C!==null&&(window.clearInterval(C),C=null,U=null)}function ke(e){if(!(e instanceof Node))return!1;const t=document.querySelector("#e2e-prompt-overlay");return!!(t&&t.contains(e))}function x(){return n.currentElement&&document.contains(n.currentElement)?n.currentElement:(n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,null)}function ee(){const e=x();if(!e){O();return}const t=p.getSelectorDetails(e);if(t){I(t.element,t);return}O(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null}function Ie(){p.refreshFromStorage(()=>{ee()})}Ie(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{p.handleStorageChange(e,t,()=>{ee()})});let te=!1,ne=!1;function m(e){if(!(e instanceof Element))return String(e);const t=[e.tagName.toLowerCase()];return e.id&&t.push(`#${e.id}`),e.classList?.length&&t.push(`.${Array.from(e.classList).join(".")}`),t.join("")}function k(e){return!e||!e.element?null:{selector:e.selector,attribute:e.attribute,value:e.value,element:m(e.element)}}function Le(e){if(!(e instanceof Element))return!1;if(be.has(e.tagName))return!0;const t=e.getAttribute("role");return t&&Se.has(t.toLowerCase())?!0:!!e.isContentEditable}function Me(e){if(!e||typeof e.composedPath!="function"){const r=e?.target;return r instanceof Element?[r]:[]}const t=new Set,o=[];for(const r of e.composedPath())!(r instanceof Element)||t.has(r)||(t.add(r),o.push(r));return o}function Pe(e){const t=$;let o=null,r=null;if(e instanceof MouseEvent?(o=e.clientX,r=e.clientY):t&&(o=t.x,r=t.y),typeof o!="number"||typeof r!="number")return[];let l=[];if(typeof document.elementsFromPoint=="function")l=document.elementsFromPoint(o,r)||[];else{const i=document.elementFromPoint?.(o,r);i&&(l=[i])}return l.filter(i=>i instanceof Element)}function re(e){const t=Me(e);e?.target instanceof Element&&!t.includes(e.target)&&t.unshift(e.target);const o=Pe(e),r=[...t];for(const i of o)r.includes(i)||r.unshift(i);const l={eventType:e?.type||"unknown",target:e?.target instanceof Element?m(e.target):String(e?.target),path:t.map(m),pointerSample:o.map(m),interactiveCandidates:[],directTargetChecked:!1,fallbackCandidates:[],result:null};for(const i of r){if(!Le(i))continue;const s=m(i);l.interactiveCandidates.push(s);const d=p.findElementBySelector(i);if(d)return l.result={stage:"interactive",...k(d)},console.log("[Element Inspector] selector resolved",l),d}if(e?.target instanceof Element){l.directTargetChecked=!0;const i=p.findElementBySelector(e.target);if(i)return l.result={stage:"direct-target",...k(i)},console.log("[Element Inspector] selector resolved",l),i}for(const i of r){const s=m(i);l.fallbackCandidates.push(s);const d=p.findElementBySelector(i);if(d)return l.result={stage:"fallback",...k(d)},console.log("[Element Inspector] selector resolved",l),d}return console.log("[Element Inspector] selector resolved",l),null}function Ne(e){if(!e)return null;const t=e.element instanceof Element?e.element:null;if(t&&document.contains(t))return{...e,element:t,rehydrated:!1};if(e.selector){const o=document.querySelector(e.selector);if(o instanceof Element){const r=p.getSelectorDetails(o);return r?{...r,rehydrated:!0}:{...e,element:o,rehydrated:!0}}}return{...e,element:null,rehydrated:!0}}function V(){const e=_(),t=E(),o=W();return!ne&&e&&(e.addEventListener(G,()=>{n.isModalOpen&&ie()}),ne=!0),!te&&t&&o&&(t.addEventListener("keydown",Re),t.addEventListener("input",$e),t.addEventListener("click",le),t.addEventListener("keyup",le),o.addEventListener("click",Ue),te=!0),{overlay:e,textarea:t,copyButton:o}}function B(e){!e||typeof e.clientX!="number"||typeof e.clientY!="number"||($={x:e.clientX,y:e.clientY})}function I(e,t){if(!e||n.mode!=="highlight")return;const o=t||p.getSelectorDetails(e);!o||!o.selector||(n.currentElement=e,n.currentSelector=o.selector,n.currentAttribute=o.attribute,ye(),N(e),typeof e.scrollIntoView=="function"&&(e.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{n.currentElement===e&&N(e)},300)))}function Oe(){const e=x();if(!e)return;let t=e.parentElement;for(;t;){const o=p.getSelectorDetails(t);if(o){I(t,o);return}t=t.parentElement}v("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function _e(){const e=x();if(!e)return;const t=r=>{for(const l of r.children){const i=p.getSelectorDetails(l);if(i)return i;const s=t(l);if(s)return s}return null},o=t(e);o?I(o.element,o):v("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function Be(e,t,o){const r=Math.min(Math.max(t,0),e.length);return e.slice(0,r)+o+e.slice(r)}function oe(e,t={}){const{skipModalDisplay:o=!1}=t,r=Ne(e?.selectorDetails),l=x();let i=null,s=r?.element instanceof Element&&document.contains(r.element)?r.element:null;if(r?.selector?(i=r,s||(s=l instanceof Element?l:null),console.log("[Element Inspector] modal using explicit details",{selector:r.selector,attribute:r.attribute,value:r.value,element:m(r.element),rehydrated:!!r.rehydrated,fallbackUsed:!r.element})):l&&(s=l,i=p.getSelectorDetails(l)),!i||!i.selector){console.log("[Element Inspector] modal failed to resolve selector",{explicitProvided:!!r,element:s?m(s):null}),v("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}n.currentElement=i.element||s||null,n.currentSelector=i.selector,n.currentAttribute=i.attribute;const L=e?.type==="click"?`${i.selector} 클릭하고 `:`${i.selector} `;if(n.promptText===""&&n.currentStepNumber===1)n.promptText=`1. ${L}`,n.caretPosition=n.promptText.length;else{const c=typeof n.caretPosition=="number"?n.caretPosition:n.promptText.length;n.promptText=Be(n.promptText,c,L),n.caretPosition=c+L.length}const{textarea:y,copyButton:D}=V();if(y&&(y.value=n.promptText),o){n.mode="highlight",n.isModalOpen=!1;return}y&&(n.mode="modal-open",n.isModalOpen=!0,D&&(D.textContent="복사하기"),J(),window.requestAnimationFrame(()=>{y.focus(),y.selectionStart=n.caretPosition,y.selectionEnd=n.caretPosition}))}function j(){const e=E();e&&(e.value=n.promptText),n.mode="highlight",n.isModalOpen=!1,R()}function Fe(){const{textarea:e,copyButton:t}=V();e&&(typeof n.caretPosition!="number"&&(n.caretPosition=n.promptText.length),e.value=n.promptText,n.mode="modal-open",n.isModalOpen=!0,t&&(t.textContent="복사하기"),J(),window.requestAnimationFrame(()=>{const o=Math.min(Math.max(n.caretPosition,0),e.value.length);e.focus(),e.selectionStart=o,e.selectionEnd=o}))}function De(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,e.value=n.promptText,e.focus(),e.selectionStart=n.caretPosition,e.selectionEnd=n.caretPosition)}function ze(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,j())}function ie(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.promptText.endsWith(" ")||(n.promptText+=" ",n.caretPosition=n.promptText.length),j())}function Re(e){if(n.isModalOpen){if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),De();return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),ze();return}e.key==="Escape"&&(e.preventDefault(),ie())}}function $e(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart)}function le(){const e=E();e&&(n.caretPosition=e.selectionStart)}function Ue(){const e=E(),t=W();if(!(!e||!t)){if(n.promptText=e.value,n.caretPosition=e.selectionStart,!navigator?.clipboard?.writeText){v("❌ 복사 실패");return}navigator.clipboard.writeText(n.promptText).then(()=>{t.textContent="복사됨!",window.setTimeout(()=>{n.isModalOpen&&j()},500),window.setTimeout(()=>{t.textContent="복사하기"},2e3)}).catch(()=>{v("❌ 복사 실패")})}}function se(e){if(!h||n.mode!=="highlight"||!(e instanceof MouseEvent)||e.button!==0||ke(e.target))return;const t=re(e);if(!t){console.log("[Element Inspector] click resolved without match",{eventType:e.type,target:e.target instanceof Element?m(e.target):String(e.target)});return}console.log("[Element Inspector] click highlight",k(t)),I(t.element,t);const o=e.ctrlKey||e.metaKey||!1;window.setTimeout(()=>{h&&oe({type:"click",selectorDetails:t},{skipModalDisplay:!o})},0)}function ce(e){if(B(e),!h||n.mode!=="highlight")return;const t=re(e);if(!t){console.log("[Element Inspector] hover resolved without match",{eventType:e.type,target:e.target instanceof Element?m(e.target):String(e.target)});return}if(console.log("[Element Inspector] hover highlight",k(t)),n.currentElement===t.element){n.currentSelector=t.selector,n.currentAttribute=t.attribute,N(t.element);return}I(t.element,t)}function ae(e){B(e),n.mode==="highlight"&&n.currentElement===e.target&&(O(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null)}function ue(e){if(!h)return;if(e.key==="Escape"&&!n.isModalOpen){e.preventDefault(),Fe();return}n.mode!=="highlight"||!x()||(e.key==="ArrowUp"?(e.preventDefault(),Oe()):e.key==="ArrowDown"?(e.preventDefault(),_e()):(e.code==="Space"||e.key===" ")&&(e.preventDefault(),oe(e)))}function F(){const e=x();e&&N(e)}function qe(){document.addEventListener("mouseover",ce,!0),document.addEventListener("mouseout",ae,!0),document.addEventListener("keydown",ue,!0),document.addEventListener("mousemove",B,!0),document.addEventListener("click",se,!0),window.addEventListener("scroll",F,!0),window.addEventListener("resize",F,!0)}function Ve(){document.removeEventListener("mouseover",ce,!0),document.removeEventListener("mouseout",ae,!0),document.removeEventListener("keydown",ue,!0),document.removeEventListener("mousemove",B,!0),document.removeEventListener("click",se,!0),window.removeEventListener("scroll",F,!0),window.removeEventListener("resize",F,!0)}function je(){h||(Ee(),V(),R(),qe(),ve(),q(),h=!0,console.log("[Element Inspector] 활성화됨"))}function He(){if(!h)return;q(),Ce(),Ve(),O(),R(),n.mode="highlight",n.isModalOpen=!1,n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,$=null,h=!1;const e=document.querySelector(".element-inspector-snackbar");e&&e.remove(),console.log("[Element Inspector] 비활성화됨")}function de(e){e?je():He()}chrome.runtime.onMessage.addListener((e,t,o)=>{!e||!e.type||e.type==="ELEMENT_INSPECTOR_SET_STATE"&&(de(!!e.enabled),o({enabled:h}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},e=>{if(chrome.runtime.lastError)return;const t=!!e?.enabled;de(t)})}catch(e){console.warn("[Element Inspector] 상태 요청 실패",e)}})();
