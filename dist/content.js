(function(){"use strict";const ye="attributePreferences",P=["id","class"],v={builtInAttributes:["id"],customAttributes:[]};function N(e){return typeof e=="string"?e.trim():""}function $(e){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(e)}function Y(e){const t=new Set,r=[];return e.forEach(o=>{const l=o.toLowerCase();t.has(l)||(t.add(l),r.push(o))}),r}function G(e){const t=new Set(Array.isArray(e)?e.map(o=>o.toLowerCase()).filter(Boolean):[]),r=P.filter(o=>t.has(o));return r.length?r:[...v.builtInAttributes]}function Ee(e){if(Array.isArray(e)){const t=[],r=[];return e.forEach(o=>{const l=N(o);if(!l)return;const i=l.toLowerCase();if(P.includes(i)){t.push(i);return}$(i)&&r.push(i)}),{builtInAttributes:G(t),customAttributes:Y(r)}}if(e&&typeof e=="object"){const t=Array.isArray(e.builtInAttributes)?e.builtInAttributes:[],r=Array.isArray(e.customAttributes)?e.customAttributes:[],o=G(t.map(i=>N(i).toLowerCase()).filter(i=>P.includes(i))),l=Y(r.map(i=>N(i).toLowerCase()).filter(i=>i&&$(i)).filter(i=>!P.includes(i)));return{builtInAttributes:o,customAttributes:l}}return{builtInAttributes:[...v.builtInAttributes],customAttributes:[...v.customAttributes]}}function W(e){const t=Ee(e),r=t.builtInAttributes||[],o=new Set(r.map(i=>i.toLowerCase())),l=[...r];return(t.customAttributes||[]).forEach(i=>{const s=N(i);if(!s||!$(s))return;const d=s.toLowerCase();o.has(d)||(o.add(d),l.push(s))}),l.length?l:[...v.builtInAttributes]}function J(e){return typeof e!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(e):e.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function be(e){return typeof e=="string"?e.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function Se({defaults:e=v,storage:t=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:r=ye}={}){let o=W(e);function l(c){return o=W(c),o}function i(c){if(!c||c.nodeType!==Node.ELEMENT_NODE)return null;for(const a of o){let u=null;if(a==="id"?u=c.id?.trim()||null:a==="class"?u=Array.from(c.classList||[]).find(Boolean)||null:u=c.getAttribute(a)?.trim()||null,u)return{attribute:a,value:u}}return null}function s(c){if(!c)return null;const{attribute:a,value:u}=c;return!a||!u?null:a==="id"?`#${J(u)}`:a==="class"?`.${J(u)}`:`[${a}="${be(u)}"]`}function d(c){const a=i(c);return a?{element:c,attribute:a.attribute,value:a.value,selector:s(a)}:null}function M(c){let a=c instanceof Element?c:null;for(;a;){const u=d(a);if(u&&u.selector)return u;a=a.parentElement}return null}function ge(c){if(!t){const a=l(e);c?.(a,e);return}t.get([r],a=>{let u=e;chrome?.runtime?.lastError||(u=a?.[r]??e);const A=l(u);c?.(A,u)})}function b(c,a,u){if(a!=="sync"||!c||!c[r])return;const A=c[r].newValue,Je=l(A);u?.(Je,A)}function R(){return[...o]}return{updateActiveAttributes:l,getSelectorDetails:d,findElementBySelector:M,refreshFromStorage:ge,handleStorageChange:b,getAttributePriority:R}}let f=null,S=null,C=null,x=null;function xe(){if(!document.querySelector("#element-inspector-highlight-style")){const e=document.createElement("style");e.id="element-inspector-highlight-style",e.textContent=`
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
    `,document.head.appendChild(e)}}function we(){return f||(f=document.createElement("div"),f.className="__element-inspector-overlay__",document.body.appendChild(f)),f}function O(e){!f||!e||(C=e,!S&&(S=window.requestAnimationFrame(()=>{if(!f||!C){S=null;return}const t=C.getBoundingClientRect(),{top:r,left:o,width:l,height:i}=t;(!x||x.top!==r||x.left!==o||x.width!==l||x.height!==i)&&(f.style.top=`${r}px`,f.style.left=`${o}px`,f.style.width=`${l}px`,f.style.height=`${i}px`,x={top:r,left:o,width:l,height:i}),C=null,S=null})))}function _(){S&&(cancelAnimationFrame(S),S=null),C=null,x=null,f&&(f.remove(),f=null)}let y=null;const Q="e2e-prompt-overlay-close-request";function B(){if(y||(y=document.querySelector("#e2e-prompt-overlay"),y))return y;const e=document.createElement("div");e.id="e2e-prompt-overlay",e.style.cssText=`
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
  `,e.addEventListener("click",d=>{d.target===e&&(d.stopPropagation(),e.dispatchEvent(new CustomEvent(Q,{bubbles:!0})))});const t=document.createElement("div");t.id="e2e-prompt-modal",t.style.cssText=`
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
  `,l.appendChild(i),l.appendChild(s),t.appendChild(r),t.appendChild(o),t.appendChild(l),e.appendChild(t),document.body.appendChild(e),y=e,y}function E(){return B().querySelector("#prompt-textarea")}function Z(){return B().querySelector("#copy-prompt-btn")}function ee(){const e=B();e.style.display="flex"}function U(){const e=y||document.querySelector("#e2e-prompt-overlay");e&&(e.style.display="none")}function m(e,t=3e3,r="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const l=document.createElement("div");l.className="element-inspector-snackbar",l.textContent=e,l.style.backgroundColor=r,document.body.appendChild(l),window.setTimeout(()=>{l.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{l.remove()},300)},t)}let h=!1,q=null;const p=Se(),Te=new Set(["A","BUTTON","INPUT","LABEL","SELECT","TEXTAREA"]),Ae=new Set(["button","link","checkbox","menuitem","menuitemcheckbox","menuitemradio","option","radio","switch","tab"]),n={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},te=200,ne="e2ePromptSnapshots",ve=3e3,re=50;let I=null,V=null,D=0,T=null;function Ce(){return[n.promptText||"",n.currentStepNumber||0,n.caretPosition||0,n.currentSelector||"",n.currentAttribute||""].join("||")}function Ie(){if(typeof window>"u"||!window.localStorage)return[];try{const e=window.localStorage.getItem(ne);if(!e)return[];const t=JSON.parse(e);if(Array.isArray(t))return t}catch(e){console.warn("[Element Inspector] Failed to parse prompt snapshots",e)}return[]}function ke(e){if(!(typeof window>"u"||!window.localStorage))try{window.localStorage.setItem(ne,JSON.stringify(e))}catch(t){console.warn("[Element Inspector] Failed to persist prompt snapshots",t)}}function K(){if(typeof window>"u"||!window.localStorage||!(typeof n.promptText=="string"&&n.promptText.trim().length>0||!!n.currentSelector))return;const t=Ce();if(t===V)return;const r={timestamp:new Date().toISOString(),promptText:n.promptText,currentStepNumber:n.currentStepNumber,caretPosition:n.caretPosition,currentSelector:n.currentSelector,currentAttribute:n.currentAttribute,mode:n.mode,pageUrl:window.location.href},o=Ie();o.push(r),o.length>re&&o.splice(0,o.length-re),ke(o),V=t}function Le(){I===null&&(I=window.setInterval(()=>{try{K()}catch(e){console.warn("[Element Inspector] Snapshot timer error",e)}},ve))}function Me(){I!==null&&(window.clearInterval(I),I=null,V=null)}function Pe(e){if(!(e instanceof Node))return!1;const t=document.querySelector("#e2e-prompt-overlay");return!!(t&&t.contains(e))}function w(){return n.currentElement&&document.contains(n.currentElement)?n.currentElement:(n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,null)}function oe(){const e=w();if(!e){_();return}const t=p.getSelectorDetails(e);if(t){L(t.element,t);return}_(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null}function Ne(){p.refreshFromStorage(()=>{oe()})}Ne(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{p.handleStorageChange(e,t,()=>{oe()})});let ie=!1,le=!1;function g(e){if(!(e instanceof Element))return String(e);const t=[e.tagName.toLowerCase()];return e.id&&t.push(`#${e.id}`),e.classList?.length&&t.push(`.${Array.from(e.classList).join(".")}`),t.join("")}function k(e){return!e||!e.element?null:{selector:e.selector,attribute:e.attribute,value:e.value,element:g(e.element)}}function Oe(e){if(!(e instanceof Element))return!1;if(Te.has(e.tagName))return!0;const t=e.getAttribute("role");return t&&Ae.has(t.toLowerCase())?!0:!!e.isContentEditable}function _e(e){if(!e||typeof e.composedPath!="function"){const o=e?.target;return o instanceof Element?[o]:[]}const t=new Set,r=[];for(const o of e.composedPath())!(o instanceof Element)||t.has(o)||(t.add(o),r.push(o));return r}function Be(e){const t=q;let r=null,o=null;if(e instanceof MouseEvent?(r=e.clientX,o=e.clientY):t&&(r=t.x,o=t.y),typeof r!="number"||typeof o!="number")return[];let l=[];if(typeof document.elementsFromPoint=="function")l=document.elementsFromPoint(r,o)||[];else{const i=document.elementFromPoint?.(r,o);i&&(l=[i])}return l.filter(i=>i instanceof Element)}function se(e){const t=_e(e);e?.target instanceof Element&&!t.includes(e.target)&&t.unshift(e.target);const r=Be(e),o=[...t];for(const i of r)o.includes(i)||o.unshift(i);const l={eventType:e?.type||"unknown",target:e?.target instanceof Element?g(e.target):String(e?.target),path:t.map(g),pointerSample:r.map(g),interactiveCandidates:[],directTargetChecked:!1,fallbackCandidates:[],result:null};for(const i of o){if(!Oe(i))continue;const s=g(i);l.interactiveCandidates.push(s);const d=p.findElementBySelector(i);if(d)return l.result={stage:"interactive",...k(d)},console.log("[Element Inspector] selector resolved",l),d}if(e?.target instanceof Element){l.directTargetChecked=!0;const i=p.findElementBySelector(e.target);if(i)return l.result={stage:"direct-target",...k(i)},console.log("[Element Inspector] selector resolved",l),i}for(const i of o){const s=g(i);l.fallbackCandidates.push(s);const d=p.findElementBySelector(i);if(d)return l.result={stage:"fallback",...k(d)},console.log("[Element Inspector] selector resolved",l),d}return console.log("[Element Inspector] selector resolved",l),null}function De(e){if(!e)return null;const t=e.element instanceof Element?e.element:null;if(t&&document.contains(t))return{...e,element:t,rehydrated:!1};if(e.selector){const r=document.querySelector(e.selector);if(r instanceof Element){const o=p.getSelectorDetails(r);return o?{...o,rehydrated:!0}:{...e,element:r,rehydrated:!0}}}return{...e,element:null,rehydrated:!0}}function H(){const e=B(),t=E(),r=Z();return!le&&e&&(e.addEventListener(Q,()=>{n.isModalOpen&&ae()}),le=!0),!ie&&t&&r&&(t.addEventListener("keydown",Ve),t.addEventListener("input",Ke),t.addEventListener("click",ue),t.addEventListener("keyup",ue),r.addEventListener("click",He),ie=!0),{overlay:e,textarea:t,copyButton:r}}function F(e){!e||typeof e.clientX!="number"||typeof e.clientY!="number"||(q={x:e.clientX,y:e.clientY})}function L(e,t){if(!e||n.mode!=="highlight")return;const r=t||p.getSelectorDetails(e);!r||!r.selector||(n.currentElement=e,n.currentSelector=r.selector,n.currentAttribute=r.attribute,we(),O(e),typeof e.scrollIntoView=="function"&&(e.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{n.currentElement===e&&O(e)},300)))}function Fe(){const e=w();if(!e)return;let t=e.parentElement;for(;t;){const r=p.getSelectorDetails(t);if(r){L(t,r);return}t=t.parentElement}m("사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function ze(){const e=w();if(!e)return;const t=o=>{for(const l of o.children){const i=p.getSelectorDetails(l);if(i)return i;const s=t(l);if(s)return s}return null},r=t(e);r?L(r.element,r):m("사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function Re(e,t,r){const o=Math.min(Math.max(t,0),e.length);return e.slice(0,o)+r+e.slice(o)}function ce(e,t={}){const{skipModalDisplay:r=!1}=t,o=De(e?.selectorDetails),l=w();let i=null,s=o?.element instanceof Element&&document.contains(o.element)?o.element:null;if(o?.selector?(i=o,s||(s=l instanceof Element?l:null),console.log("[Element Inspector] modal using explicit details",{selector:o.selector,attribute:o.attribute,value:o.value,element:g(o.element),rehydrated:!!o.rehydrated,fallbackUsed:!o.element})):l&&(s=l,i=p.getSelectorDetails(l)),!i||!i.selector){console.log("[Element Inspector] modal failed to resolve selector",{explicitProvided:!!o,element:s?g(s):null}),m("사용할 수 있는 속성을 찾을 수 없습니다");return}n.currentElement=i.element||s||null,n.currentSelector=i.selector,n.currentAttribute=i.attribute;const M=e?.type==="click"?`${i.selector} 클릭하고 `:`${i.selector} `;if(n.promptText===""&&n.currentStepNumber===1)n.promptText=`1. ${M}`,n.caretPosition=n.promptText.length;else{const c=typeof n.caretPosition=="number"?n.caretPosition:n.promptText.length;n.promptText=Re(n.promptText,c,M),n.caretPosition=c+M.length}const{textarea:b,copyButton:R}=H();if(b&&(b.value=n.promptText),r){n.mode="highlight",n.isModalOpen=!1;return}b&&(n.mode="modal-open",n.isModalOpen=!0,R&&(R.textContent="복사하기"),ee(),window.requestAnimationFrame(()=>{b.focus(),b.selectionStart=n.caretPosition,b.selectionEnd=n.caretPosition}))}function j(){const e=E();e&&(e.value=n.promptText),n.mode="highlight",n.isModalOpen=!1,U()}function $e(){const{textarea:e,copyButton:t}=H();e&&(typeof n.caretPosition!="number"&&(n.caretPosition=n.promptText.length),e.value=n.promptText,n.mode="modal-open",n.isModalOpen=!0,t&&(t.textContent="복사하기"),ee(),window.requestAnimationFrame(()=>{const r=Math.min(Math.max(n.caretPosition,0),e.value.length);e.focus(),e.selectionStart=r,e.selectionEnd=r}))}function Ue(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,e.value=n.promptText,e.focus(),e.selectionStart=n.caretPosition,e.selectionEnd=n.caretPosition)}function qe(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.currentStepNumber+=1,n.promptText=`${n.promptText}
${n.currentStepNumber}. `,n.caretPosition=n.promptText.length,j())}function ae(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart,n.promptText.endsWith(" ")||(n.promptText+=" ",n.caretPosition=n.promptText.length),j())}function Ve(e){if(n.isModalOpen){if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Ue();return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),qe();return}e.key==="Escape"&&(e.preventDefault(),ae())}}function Ke(){const e=E();e&&(n.promptText=e.value,n.caretPosition=e.selectionStart)}function ue(){const e=E();e&&(n.caretPosition=e.selectionStart)}function He(){const e=E(),t=Z();if(!(!e||!t)){if(n.promptText=e.value,n.caretPosition=e.selectionStart,!navigator?.clipboard?.writeText){m("복사 실패");return}navigator.clipboard.writeText(n.promptText).then(()=>{t.textContent="복사됨!",window.setTimeout(()=>{n.isModalOpen&&j()},500),window.setTimeout(()=>{t.textContent="복사하기"},2e3)}).catch(()=>{m("복사 실패")})}}function de(e){if(!h||n.mode!=="highlight"||!(e instanceof MouseEvent)||e.button!==0||Pe(e.target))return;const t=se(e);if(!t){console.log("[Element Inspector] click resolved without match",{eventType:e.type,target:e.target instanceof Element?g(e.target):String(e.target)});return}console.log("[Element Inspector] click highlight",k(t)),L(t.element,t);const r=e.ctrlKey||e.metaKey||!1;window.setTimeout(()=>{h&&ce({type:"click",selectorDetails:t},{skipModalDisplay:!r})},0)}function fe(e){if(F(e),!h||n.mode!=="highlight")return;const t=se(e);if(!t){console.log("[Element Inspector] hover resolved without match",{eventType:e.type,target:e.target instanceof Element?g(e.target):String(e.target)});return}if(console.log("[Element Inspector] hover highlight",k(t)),n.currentElement===t.element){n.currentSelector=t.selector,n.currentAttribute=t.attribute,O(t.element);return}L(t.element,t)}function pe(e){F(e),n.mode==="highlight"&&n.currentElement===e.target&&(_(),n.currentElement=null,n.currentSelector=null,n.currentAttribute=null)}function je(){const e=w();if(!e){m("선택된 요소가 없습니다",1200,"#ff9800");return}const t=typeof e.id=="string"?e.id.trim():"";if(!t){m("선택된 요소에 id가 없습니다",1200,"#ff9800");return}if(!navigator?.clipboard?.writeText){m("복사 실패");return}navigator.clipboard.writeText(t).then(()=>{m(`#${t} 복사됨`,3e3,"#4caf50")}).catch(()=>{m("복사 실패")})}function X(){T!==null&&(window.clearTimeout(T),T=null),D=0}function me(e){if(!h)return;if(e.key==="Escape"&&!n.isModalOpen){e.preventDefault(),$e();return}if(!(n.mode!=="highlight"||!w())){if(e.key==="ArrowUp")e.preventDefault(),Fe();else if(e.key==="ArrowDown")e.preventDefault(),ze();else if(e.code==="Space"||e.key===" "){if(e.repeat){e.preventDefault();return}e.preventDefault();const r=Date.now();if(T!==null&&r-D<=te){X(),je();return}X(),D=r,T=window.setTimeout(()=>{T=null,D=0,!(!h||n.mode!=="highlight")&&ce({type:"key-space"})},te)}}}function z(){const e=w();e&&O(e)}function Xe(){document.addEventListener("mouseover",fe,!0),document.addEventListener("mouseout",pe,!0),document.addEventListener("keydown",me,!0),document.addEventListener("mousemove",F,!0),document.addEventListener("click",de,!0),window.addEventListener("scroll",z,!0),window.addEventListener("resize",z,!0)}function Ye(){document.removeEventListener("mouseover",fe,!0),document.removeEventListener("mouseout",pe,!0),document.removeEventListener("keydown",me,!0),document.removeEventListener("mousemove",F,!0),document.removeEventListener("click",de,!0),window.removeEventListener("scroll",z,!0),window.removeEventListener("resize",z,!0)}function Ge(){h||(xe(),H(),U(),Xe(),Le(),K(),h=!0,console.log("[Element Inspector] 활성화됨"))}function We(){if(!h)return;K(),Me(),Ye(),_(),U(),X(),n.mode="highlight",n.isModalOpen=!1,n.currentElement=null,n.currentSelector=null,n.currentAttribute=null,q=null,h=!1;const e=document.querySelector(".element-inspector-snackbar");e&&e.remove(),console.log("[Element Inspector] 비활성화됨")}function he(e){e?Ge():We()}chrome.runtime.onMessage.addListener((e,t,r)=>{!e||!e.type||e.type==="ELEMENT_INSPECTOR_SET_STATE"&&(he(!!e.enabled),r({enabled:h}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},e=>{if(chrome.runtime.lastError)return;const t=!!e?.enabled;he(t)})}catch(e){console.warn("[Element Inspector] 상태 요청 실패",e)}})();
