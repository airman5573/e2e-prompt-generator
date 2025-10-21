(function(){"use strict";const fe="attributePreferences",L=["id","class"],w={builtInAttributes:["id"],customAttributes:[]};function M(e){return typeof e=="string"?e.trim():""}function z(e){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(e)}function j(e){const t=new Set,r=[];return e.forEach(o=>{const i=o.toLowerCase();t.has(i)||(t.add(i),r.push(o))}),r}function H(e){const t=new Set(Array.isArray(e)?e.map(o=>o.toLowerCase()).filter(Boolean):[]),r=L.filter(o=>t.has(o));return r.length?r:[...w.builtInAttributes]}function pe(e){if(Array.isArray(e)){const t=[],r=[];return e.forEach(o=>{const i=M(o);if(!i)return;const l=i.toLowerCase();if(L.includes(l)){t.push(l);return}z(l)&&r.push(l)}),{builtInAttributes:H(t),customAttributes:j(r)}}if(e&&typeof e=="object"){const t=Array.isArray(e.builtInAttributes)?e.builtInAttributes:[],r=Array.isArray(e.customAttributes)?e.customAttributes:[],o=H(t.map(l=>M(l).toLowerCase()).filter(l=>L.includes(l))),i=j(r.map(l=>M(l).toLowerCase()).filter(l=>l&&z(l)).filter(l=>!L.includes(l)));return{builtInAttributes:o,customAttributes:i}}return{builtInAttributes:[...w.builtInAttributes],customAttributes:[...w.customAttributes]}}function X(e){const t=pe(e),r=t.builtInAttributes||[],o=new Set(r.map(l=>l.toLowerCase())),i=[...r];return(t.customAttributes||[]).forEach(l=>{const c=M(l);if(!c||!z(c))return;const d=c.toLowerCase();o.has(d)||(o.add(d),i.push(c))}),i.length?i:[...w.builtInAttributes]}function Y(e){return typeof e!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):e.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function me(e){return typeof e=="string"?e.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function he({defaults:e=w,storage:t=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:r=fe}={}){let o=X(e);function i(a){return o=X(a),o}function l(a){if(!a||a.nodeType!==Node.ELEMENT_NODE)return null;for(const s of o){let u=null;if(s==="id"?u=a.id?.trim()||null:s==="class"?u=Array.from(a.classList||[]).find(Boolean)||null:u=a.getAttribute(s)?.trim()||null,u)return{attribute:s,value:u}}return null}function c(a){if(!a)return null;const{attribute:s,value:u}=a;return!s||!u?null:s==="id"?`#${Y(u)}`:s==="class"?`.${Y(u)}`:`[${s}="${me(u)}"]`}function d(a){const s=l(a);return s?{element:a,attribute:s.attribute,value:s.value,selector:c(s)}:null}function k(a){let s=a instanceof Element?a:null;for(;s;){const u=d(s);if(u&&u.selector)return u;s=s.parentElement}return null}function de(a){if(!t){const s=i(e);a?.(s,e);return}t.get([r],s=>{let u=e;chrome?.runtime?.lastError||(u=s?.[r]??e);const x=i(u);a?.(x,u)})}function F(a,s,u){if(s!=="sync"||!a||!a[r])return;const x=a[r].newValue,Xe=i(x);u?.(Xe,x)}function He(){return[...o]}return{updateActiveAttributes:i,getSelectorDetails:d,findElementBySelector:k,refreshFromStorage:de,handleStorageChange:F,getAttributePriority:He}}let f=null,b=null,T=null,y=null;function ge(){if(!document.querySelector("#element-inspector-highlight-style")){const e=document.createElement("style");e.id="element-inspector-highlight-style",e.textContent=`
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
    `,document.head.appendChild(e)}}function Ee(){return f||(f=document.createElement("div"),f.className="__element-inspector-overlay__",document.body.appendChild(f)),f}function P(e){!f||!e||(T=e,!b&&(b=window.requestAnimationFrame(()=>{if(!f||!T){b=null;return}const t=T.getBoundingClientRect(),{top:r,left:o,width:i,height:l}=t;(!y||y.top!==r||y.left!==o||y.width!==i||y.height!==l)&&(f.style.top=`${r}px`,f.style.left=`${o}px`,f.style.width=`${i}px`,f.style.height=`${l}px`,y={top:r,left:o,width:i,height:l}),T=null,b=null})))}function N(){b&&(cancelAnimationFrame(b),b=null),T=null,y=null,f&&(f.remove(),f=null)}let g=null;const K="e2e-prompt-overlay-close-request";function O(){if(g||(g=document.querySelector("#e2e-prompt-overlay"),g))return g;const e=document.createElement("div");e.id="e2e-prompt-overlay",e.style.cssText=`
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
  `,e.addEventListener("click",d=>{d.target===e&&(d.stopPropagation(),e.dispatchEvent(new CustomEvent(K,{bubbles:!0})))});const t=document.createElement("div");t.id="e2e-prompt-modal",t.style.cssText=`
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
  `,t.addEventListener("click",d=>d.stopPropagation());const r=document.createElement("h2");r.textContent="E2E 테스트 시나리오",r.style.cssText=`
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
  `;const c=document.createElement("button");return c.id="copy-prompt-btn",c.type="button",c.textContent="복사하기",c.style.cssText=`
    padding: 10px 16px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
  `,i.appendChild(l),i.appendChild(c),t.appendChild(r),t.appendChild(o),t.appendChild(i),e.appendChild(t),document.body.appendChild(e),g=e,g}function E(){return O().querySelector("#prompt-textarea")}function G(){return O().querySelector("#copy-prompt-btn")}function W(){const e=O();e.style.display="flex"}function D(){const e=g||document.querySelector("#e2e-prompt-overlay");e&&(e.style.display="none")}function A(e,t=3e3,r="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const i=document.createElement("div");i.className="element-inspector-snackbar",i.textContent=e,i.style.backgroundColor=r,document.body.appendChild(i),window.setTimeout(()=>{i.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{i.remove()},300)},t)}let h=!1,R=null;const p=he(),be=new Set(["A","BUTTON","INPUT","LABEL","SELECT","TEXTAREA"]),ye=new Set(["button","link","checkbox","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"]),n={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},J="e2ePromptSnapshots",Se=3e3,Q=50;let v=null,$=null;function xe(){return[n.promptText||"",n.currentStepNumber||0,n.caretPosition||0,n.currentSelector||"",n.currentAttribute||""].join("||")}function we(){if(typeof window>"u"||!window.localStorage)return[];try{const e=window.localStorage.getItem(J);if(!e)return[];const t=JSON.parse(e);if(Array.isArray(t))return t}catch(e){console.warn("[Element Inspector] Failed to parse prompt snapshots",e)}return[]}function Te(e){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(J,JSON.stringify(e))}catch(t){console.warn("[Element Inspector] Failed to persist prompt snapshots",t)}}function U(){if(typeof window>"u"||!window.localStorage||!(typeof n.promptText=="string"&&n.promptText.trim().length>0||!!n.currentSelector))return;const t=xe();if(t===$)return;const r={timestamp:new Date().toISOString(),promptText:n.promptText,currentStepNumber:n.currentStepNumber,caretPosition:n.caretPosition,currentSelector:n.currentSelector,currentAttribute:n.currentAttribute,mode:n.mode,pageUrl:window.location.href},o=we();o.push(r),o.length>Q&&o.splice(0,o.length-Q),Te(o),$=t}function Ae(){v===null&&(v=window.setInterval(()=>{try{U()}catch(e){console.warn("[Element Inspector] Snapshot timer error",e)}},Se))}function ve(){v!==null&&(window.clearInterval(v),v=null,$=null)}function Ce(e){if(!(e instanceof Node))return!1;const t=document.querySelector("#e2e-prompt-overlay");return!!(t&&t.contains(e))}function S(){return n.currentElement&&document.contains(n.currentElement)?n.currentElement:(n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,null)}function Z(){const e=S();if(!e){N();return}const t=p.getSelectorDetails(e);if(t){I(t.element,t);return}N(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null}function Ie(){p.refreshFromStorage(()=>{Z()})}Ie(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{p.handleStorageChange(e,t,()=>{Z()})});let ee=!1,te=!1;function m(e){if(!(e instanceof Element))return String(e);const t=[e.tagName.toLowerCase()];return e.id&&t.push(`#${e.id}`),e.classList?.length&&t.push(`.${Array.from(e.classList).join(".")}`),t.join("")}function C(e){return!e||!e.element?null:{selector:e.selector,attribute:e.attribute,value:e.value,element:m(e.element)}}function ke(e){if(!(e instanceof Element))return!1;if(be.has(e.tagName))return!0;const t=e.getAttribute("role");return t&&ye.has(t.toLowerCase())?!0:!!e.isContentEditable}function Le(e){if(!e||typeof e.composedPath!="function"){const o=e?.target;return o instanceof Element?[o]:[]}const t=new Set,r=[];for(const o of e.composedPath())!(o instanceof Element)||t.has(o)||(t.add(o),r.push(o));return r}function Me(e){const t=R;let r=null,o=null;if(e instanceof MouseEvent?(r=e.clientX,o=e.clientY):t&&(r=t.x,o=t.y),typeof r!="number"||typeof o!="number")return[];let i=[];if(typeof document.elementsFromPoint=="function")i=document.elementsFromPoint(r,o)||[];else{const l=document.elementFromPoint?.(r,o);l&&(i=[l])}return i.filter(l=>l instanceof Element)}function ne(e){const t=Le(e);e?.target instanceof Element&&!t.includes(e.target)&&t.unshift(e.target);const r=Me(e),o=[...t];for(const l of r)o.includes(l)||o.unshift(l);const i={eventType:e?.type||"unknown",target:e?.target instanceof Element?m(e.target):String(e?.target),path:t.map(m),pointerSample:r.map(m),interactiveCandidates:[],directTargetChecked:!1,fallbackCandidates:[],result:null};for(const l of o){if(!ke(l))continue;const c=m(l);i.interactiveCandidates.push(c);const d=p.findElementBySelector(l);if(d)return i.result={stage:"interactive",...C(d)},console.log("[Element Inspector] selector resolved",i),d}if(e?.target instanceof Element){i.directTargetChecked=!0;const l=p.findElementBySelector(e.target);if(l)return i.result={stage:"direct-target",...C(l)},console.log("[Element Inspector] selector resolved",i),l}for(const l of o){const c=m(l);i.fallbackCandidates.push(c);const d=p.findElementBySelector(l);if(d)return i.result={stage:"fallback",...C(d)},console.log("[Element Inspector] selector resolved",i),d}return console.log("[Element Inspector] selector resolved",i),null}function Pe(e){if(!e)return null;const t=e.element instanceof Element?e.element:null;if(t&&document.contains(t))return{...e,element:t,rehydrated:!1};if(e.selector){const r=document.querySelector(e.selector);if(r instanceof Element){const o=p.getSelectorDetails(r);return o?{...o,rehydrated:!0}:{...e,element:r,rehydrated:!0}}}return{...e,element:null,rehydrated:!0}}function q(){const e=O(),t=E(),r=G();return!te&&e&&(e.addEventListener(K,()=>{n.isModalOpen&&oe()}),te=!0),!ee&&t&&r&&(t.addEventListener("keydown",De),t.addEventListener("input",Re),t.addEventListener("click",ie),t.addEventListener("keyup",ie),r.addEventListener("click",$e),ee=!0),{overlay:e,textarea:t,copyButton:r}}function _(e){!e||typeof e.clientX!="number"||typeof e.clientY!="number"||(R={x:e.clientX,y:e.clientY})}function I(e,t){if(!e||n.mode!=="highlight")return;const r=t||p.getSelectorDetails(e);!r||!r.selector||(n.currentElement=e,n.currentSelector=r.selector,n.currentAttribute=r.attribute,Ee(),P(e),typeof e.scrollIntoView=="function"&&(e.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{n.currentElement===e&&P(e)},300)))}function Ne(){const e=S();if(!e)return;let t=e.parentElement;for(;t;){const r=p.getSelectorDetails(t);if(r){I(t,r);return}t=t.parentElement}A("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function Oe(){const e=S();if(!e)return;const t=o=>{for(const i of o.children){const l=p.getSelectorDetails(i);if(l)return l;const c=t(i);if(c)return c}return null},r=t(e);r?I(r.element,r):A("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function _e(e,t,r){const o=Math.min(Math.max(t,0),e.length);return e.slice(0,o)+r+e.slice(o)}function re(e){const t=Pe(e?.selectorDetails),r=S();let o=null,i=t?.element instanceof Element&&document.contains(t.element)?t.element:null;if(t?.selector?(o=t,i||(i=r instanceof Element?r:null),console.log("[Element Inspector] modal using explicit details",{selector:t.selector,attribute:t.attribute,value:t.value,element:m(t.element),rehydrated:!!t.rehydrated,fallbackUsed:!t.element})):r&&(i=r,o=p.getSelectorDetails(r)),!o||!o.selector){console.log("[Element Inspector] modal failed to resolve selector",{explicitProvided:!!t,element:i?m(i):null}),A("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}const{textarea:l,copyButton:c}=q();if(!l)return;n.currentElement=o.element||i||null,n.currentSelector=o.selector,n.currentAttribute=o.attribute;const k=e?.type==="click"?`${o.selector} 클릭하고 `:`${o.selector} `;if(n.promptText===""&&n.currentStepNumber===1)n.promptText=`1. ${k}`,n.caretPosition=n.promptText.length;else{const F=typeof n.caretPosition=="number"?n.caretPosition:n.promptText.length;n.promptText=_e(n.promptText,F,k),n.caretPosition=F+k.length}l.value=n.promptText,n.mode="modal-open",n.isModalOpen=!0,c&&(c.textContent="복사하기"),W(),window.requestAnimationFrame(()=>{l.focus(),l.selectionStart=n.caretPosition,l.selectionEnd=n.caretPosition})}function V(){const e=E();e&&(e.value=n.promptText),n.mode="highlight",n.isModalOpen=!1,D()}function Be(){const{textarea:e,copyButton:t}=q();e&&(typeof n.caretPosition!="number"&&(n.caretPosition=n.promptText.length),e.value=n.promptText,n.mode="modal-open",n.isModalOpen=!0,t&&(t.textContent="복사하기"),W(),window.requestAnimationFrame(()=>{const r=Math.min(Math.max(n.caretPosition,0),e.value.length);e.focus(),e.selectionStart=r,e.selectionEnd=r}))}function Fe(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,e.value=n.promptText,e.focus(),e.selectionStart=n.caretPosition,e.selectionEnd=n.caretPosition)}function ze(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,V())}function oe(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.promptText.endsWith(" ")||(n.promptText+=" ",n.caretPosition=n.promptText.length),V())}function De(e){if(n.isModalOpen){if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Fe();return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),ze();return}e.key==="Escape"&&(e.preventDefault(),oe())}}function Re(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart)}function ie(){const e=E();e&&(n.caretPosition=e.selectionStart)}function $e(){const e=E(),t=G();if(!(!e||!t)){if(n.promptText=e.value,n.caretPosition=e.selectionStart,!navigator?.clipboard?.writeText){A("❌ 복사 실패");return}navigator.clipboard.writeText(n.promptText).then(()=>{t.textContent="복사됨!",window.setTimeout(()=>{n.isModalOpen&&V()},500),window.setTimeout(()=>{t.textContent="복사하기"},2e3)}).catch(()=>{A("❌ 복사 실패")})}}function le(e){if(!h||n.mode!=="highlight"||!(e instanceof MouseEvent)||e.button!==0||Ce(e.target))return;const t=ne(e);if(!t){console.log("[Element Inspector] click resolved without match",{eventType:e.type,target:e.target instanceof Element?m(e.target):String(e.target)});return}console.log("[Element Inspector] click highlight",C(t)),I(t.element,t),window.setTimeout(()=>{h&&re({type:"click",selectorDetails:t})},0)}function se(e){if(_(e),!h||n.mode!=="highlight")return;const t=ne(e);if(!t){console.log("[Element Inspector] hover resolved without match",{eventType:e.type,target:e.target instanceof Element?m(e.target):String(e.target)});return}if(console.log("[Element Inspector] hover highlight",C(t)),n.currentElement===t.element){n.currentSelector=t.selector,n.currentAttribute=t.attribute,P(t.element);return}I(t.element,t)}function ce(e){_(e),n.mode==="highlight"&&n.currentElement===e.target&&(N(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null)}function ae(e){if(!h)return;if(e.key==="Escape"&&!n.isModalOpen){e.preventDefault(),Be();return}n.mode!=="highlight"||!S()||(e.key==="ArrowUp"?(e.preventDefault(),Ne()):e.key==="ArrowDown"?(e.preventDefault(),Oe()):(e.code==="Space"||e.key===" ")&&(e.preventDefault(),re(e)))}function B(){const e=S();e&&P(e)}function Ue(){document.addEventListener("mouseover",se,!0),document.addEventListener("mouseout",ce,!0),document.addEventListener("keydown",ae,!0),document.addEventListener("mousemove",_,!0),document.addEventListener("click",le,!0),window.addEventListener("scroll",B,!0),window.addEventListener("resize",B,!0)}function qe(){document.removeEventListener("mouseover",se,!0),document.removeEventListener("mouseout",ce,!0),document.removeEventListener("keydown",ae,!0),document.removeEventListener("mousemove",_,!0),document.removeEventListener("click",le,!0),window.removeEventListener("scroll",B,!0),window.removeEventListener("resize",B,!0)}function Ve(){h||(ge(),q(),D(),Ue(),Ae(),U(),h=!0,console.log("[Element Inspector] 활성화됨"))}function je(){if(!h)return;U(),ve(),qe(),N(),D(),n.mode="highlight",n.isModalOpen=!1,n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,R=null,h=!1;const e=document.querySelector(".element-inspector-snackbar");e&&e.remove(),console.log("[Element Inspector] 비활성화됨")}function ue(e){e?Ve():je()}chrome.runtime.onMessage.addListener((e,t,r)=>{!e||!e.type||e.type==="ELEMENT_INSPECTOR_SET_STATE"&&(ue(!!e.enabled),r({enabled:h}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},e=>{if(chrome.runtime.lastError)return;const t=!!e?.enabled;ue(t)})}catch(e){console.warn("[Element Inspector] 상태 요청 실패",e)}})();
