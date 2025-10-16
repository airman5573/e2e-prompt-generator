(function(){"use strict";const ot="attributePreferences",L=["id","class"],k={builtInAttributes:["id"],customAttributes:[]};function D(t){return typeof t=="string"?t.trim():""}function R(t){return/^[a-zA-Z_][a-zA-Z0-9_\-:.]*$/.test(t)}function Y(t){const e=new Set,n=[];return t.forEach(o=>{const i=o.toLowerCase();e.has(i)||(e.add(i),n.push(o))}),n}function X(t){const e=new Set(Array.isArray(t)?t.map(o=>o.toLowerCase()).filter(Boolean):[]),n=L.filter(o=>e.has(o));return n.length?n:[...k.builtInAttributes]}function it(t){if(Array.isArray(t)){const e=[],n=[];return t.forEach(o=>{const i=D(o);if(!i)return;const s=i.toLowerCase();if(L.includes(s)){e.push(s);return}R(s)&&n.push(s)}),{builtInAttributes:X(e),customAttributes:Y(n)}}if(t&&typeof t=="object"){const e=Array.isArray(t.builtInAttributes)?t.builtInAttributes:[],n=Array.isArray(t.customAttributes)?t.customAttributes:[],o=X(e.map(s=>D(s).toLowerCase()).filter(s=>L.includes(s))),i=Y(n.map(s=>D(s).toLowerCase()).filter(s=>s&&R(s)).filter(s=>!L.includes(s)));return{builtInAttributes:o,customAttributes:i}}return{builtInAttributes:[...k.builtInAttributes],customAttributes:[...k.customAttributes]}}function j(t){const e=it(t),n=e.builtInAttributes||[],o=new Set(n.map(s=>s.toLowerCase())),i=[...n];return(e.customAttributes||[]).forEach(s=>{const a=D(s);if(!a||!R(a))return;const f=a.toLowerCase();o.has(f)||(o.add(f),i.push(a))}),i.length?i:[...k.builtInAttributes]}function H(t){return typeof t!="string"?"":typeof CSS<"u"&&typeof CSS.escape=="function"?CSS.escape(t):t.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,"\\$1")}function st(t){return typeof t=="string"?t.replace(/\\/g,"\\\\").replace(/"/g,'\\"'):""}function lt({defaults:t=k,storage:e=typeof chrome<"u"?chrome.storage?.sync:null,storageKey:n=ot}={}){let o=j(t);function i(c){return o=j(c),o}function s(c){if(!c||c.nodeType!==Node.ELEMENT_NODE)return null;for(const l of o){let u=null;if(l==="id"?u=c.id?.trim()||null:l==="class"?u=Array.from(c.classList||[]).find(Boolean)||null:u=c.getAttribute(l)?.trim()||null,u)return{attribute:l,value:u}}return null}function a(c){if(!c)return null;const{attribute:l,value:u}=c;return!l||!u?null:l==="id"?`#${H(u)}`:l==="class"?`.${H(u)}`:`[${l}="${st(u)}"]`}function f(c){const l=s(c);return l?{element:c,attribute:l.attribute,value:l.value,selector:a(l)}:null}function p(c){let l=c instanceof Element?c:null;for(;l;){const u=f(l);if(u&&u.selector)return u;l=l.parentElement}return null}function y(c){if(!e){const l=i(t);c?.(l,t);return}e.get([n],l=>{let u=t;chrome?.runtime?.lastError||(u=l?.[n]??t);const M=i(u);c?.(M,u)})}function A(c,l,u){if(l!=="sync"||!c||!c[n])return;const M=c[n].newValue,It=i(M);u?.(It,M)}function q(){return[...o]}return{updateActiveAttributes:i,getSelectorDetails:f,findElementBySelector:p,refreshFromStorage:y,handleStorageChange:A,getAttributePriority:q}}let d=null,T=null,P=null,v=null;function at(){if(!document.querySelector("#element-inspector-highlight-style")){const t=document.createElement("style");t.id="element-inspector-highlight-style",t.textContent=`
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
    `,document.head.appendChild(t)}}function ct(){return d||(d=document.createElement("div"),d.className="__element-inspector-overlay__",document.body.appendChild(d)),d}function F(t){!d||!t||(P=t,!T&&(T=window.requestAnimationFrame(()=>{if(!d||!P){T=null;return}const e=P.getBoundingClientRect(),{top:n,left:o,width:i,height:s}=e;(!v||v.top!==n||v.left!==o||v.width!==i||v.height!==s)&&(d.style.top=`${n}px`,d.style.left=`${o}px`,d.style.width=`${i}px`,d.style.height=`${s}px`,v={top:n,left:o,width:i,height:s}),P=null,T=null})))}function z(){T&&(cancelAnimationFrame(T),T=null),P=null,v=null,d&&(d.remove(),d=null)}let b=null;function B(){if(b||(b=document.querySelector("#e2e-prompt-overlay"),b))return b;const t=document.createElement("div");t.id="e2e-prompt-overlay",t.style.cssText=`
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
  `,t.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault()});const e=document.createElement("div");e.id="e2e-prompt-modal",e.style.cssText=`
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
  `,e.addEventListener("click",f=>f.stopPropagation());const n=document.createElement("h2");n.textContent="E2E 테스트 시나리오",n.style.cssText=`
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
  `;const a=document.createElement("button");return a.id="copy-prompt-btn",a.type="button",a.textContent="복사하기",a.style.cssText=`
    padding: 10px 16px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
  `,i.appendChild(s),i.appendChild(a),e.appendChild(n),e.appendChild(o),e.appendChild(i),t.appendChild(e),document.body.appendChild(t),b=t,b}function E(){return B().querySelector("#prompt-textarea")}function K(){return B().querySelector("#copy-prompt-btn")}function ut(){const t=B();t.style.display="flex"}function $(){const t=b||document.querySelector("#e2e-prompt-overlay");t&&(t.style.display="none")}function S(t,e=3e3,n="#323232"){const o=document.querySelector(".element-inspector-snackbar");o&&o.remove();const i=document.createElement("div");i.className="element-inspector-snackbar",i.textContent=t,i.style.backgroundColor=n,document.body.appendChild(i),window.setTimeout(()=>{i.style.animation="snackbar-fade-out 0.3s ease-out",window.setTimeout(()=>{i.remove()},300)},e)}let w=!1,g=null,m=null,h=null;const x=lt(),r={mode:"highlight",currentElement:null,currentSelector:null,currentAttribute:null,promptText:"",currentStepNumber:1,isModalOpen:!1,caretPosition:0},dt=Promise.resolve().then(()=>Pt).then(t=>{const e=t?.default??t.MouseIntentDetector??t;if(typeof e!="function")throw new TypeError("MouseIntentDetector module did not provide a constructor.");return h=new e({distanceThreshold:280}),h}).catch(t=>(console.warn("[E2E Prompt Builder] Failed to load MouseIntentDetector",t),h=null,null));function ft(){return dt}function C(){return r.currentElement&&document.contains(r.currentElement)?r.currentElement:(r.currentElement=null,r.currentSelector=null,r.currentAttribute=null,null)}function V(){const t=C();if(!t){z();return}const e=x.getSelectorDetails(t);if(e){_(e.element,e);return}z(),r.currentElement=null,r.currentSelector=null,r.currentAttribute=null}function mt(){x.refreshFromStorage(()=>{V()})}mt(),chrome?.storage?.onChanged&&chrome.storage.onChanged.addListener((t,e)=>{x.handleStorageChange(t,e,()=>{V()})});let W=!1;function Z(){const t=B(),e=E(),n=K();return!W&&e&&n&&(e.addEventListener("keydown",xt),e.addEventListener("input",Tt),e.addEventListener("click",Q),e.addEventListener("keyup",Q),n.addEventListener("click",vt),W=!0),{overlay:t,textarea:e,copyButton:n}}function O(t){!t||typeof t.clientX!="number"||typeof t.clientY!="number"||(g={x:t.clientX,y:t.clientY})}function I(t){if(!r.isModalOpen)return;if(!h){!m&&typeof t.clientX=="number"&&typeof t.clientY=="number"&&(m={x:t.clientX,y:t.clientY});return}if(!m&&typeof t.clientX=="number"&&typeof t.clientY=="number"){m={x:t.clientX,y:t.clientY};const n=document.querySelector("#e2e-prompt-modal");if(n)try{h.stopTracking(),h.startTracking(n,m)}catch(o){console.warn("[E2E Prompt Builder] Failed to start detector on first move",o)}return}const e=h.evaluate(t);if(!(!e||!e.shouldClose)){document.removeEventListener("mousemove",I,!0),m=null;try{h.stopTracking()}catch(n){console.warn("[E2E Prompt Builder] Failed to stop detector",n)}G()}}function _(t,e){if(!t||r.mode!=="highlight")return;const n=e||x.getSelectorDetails(t);!n||!n.selector||(r.currentElement=t,r.currentSelector=n.selector,r.currentAttribute=n.attribute,ct(),F(t),typeof t.scrollIntoView=="function"&&(t.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}),window.setTimeout(()=>{r.currentElement===t&&F(t)},300)))}function pt(){const t=C();if(!t)return;let e=t.parentElement;for(;e;){const n=x.getSelectorDetails(e);if(n){_(e,n);return}e=e.parentElement}S("⚠️ 사용할 수 있는 상위 요소가 없습니다",1200,"#ff9800")}function ht(){const t=C();if(!t)return;const e=o=>{for(const i of o.children){const s=x.getSelectorDetails(i);if(s)return s;const a=e(i);if(a)return a}return null},n=e(t);n?_(n.element,n):S("⚠️ 사용할 수 있는 하위 요소가 없습니다",1200,"#ff9800")}function yt(t,e,n){const o=Math.min(Math.max(e,0),t.length);return t.slice(0,o)+n+t.slice(o)}function bt(t){const e=C();if(!e){S("⚠️ 선택된 요소가 없습니다");return}const n=x.getSelectorDetails(e);if(!n||!n.selector){S("⚠️ 사용할 수 있는 속성을 찾을 수 없습니다");return}const{textarea:o,copyButton:i}=Z();if(!o)return;r.currentSelector=n.selector,r.currentAttribute=n.attribute;const s=`${n.selector} `;if(r.promptText===""&&r.currentStepNumber===1)r.promptText=`1. ${s}`,r.caretPosition=r.promptText.length;else{const y=typeof r.caretPosition=="number"?r.caretPosition:r.promptText.length;r.promptText=yt(r.promptText,y,s),r.caretPosition=y+s.length}o.value=r.promptText,r.mode="modal-open",r.isModalOpen=!0,i&&(i.textContent="복사하기");const p=typeof MouseEvent<"u"&&t instanceof MouseEvent?{x:t.clientX,y:t.clientY}:null;p?m=p:g?m={x:g.x,y:g.y}:m=null,document.removeEventListener("mousemove",I,!0),document.addEventListener("mousemove",I,!0),ft().then(y=>{if(!y)return;const A=document.querySelector("#e2e-prompt-modal");if(!A)return;const q=g?{x:g.x,y:g.y}:null,c=m||q;try{y.stopTracking()}catch(l){console.warn("[E2E Prompt Builder] Failed to reset detector",l)}if(c)try{y.startTracking(A,c)}catch(l){console.warn("[E2E Prompt Builder] Failed to start detector",l)}}),ut(),window.requestAnimationFrame(()=>{o.focus(),o.selectionStart=r.caretPosition,o.selectionEnd=r.caretPosition})}function U(){const t=E();if(t&&(t.value=r.promptText),r.mode="highlight",r.isModalOpen=!1,document.removeEventListener("mousemove",I,!0),m=null,h)try{h.stopTracking()}catch(e){console.warn("[E2E Prompt Builder] Failed to stop detector on close",e)}$()}function Et(){const t=E();t&&(r.promptText=t.value,r.caretPosition=t.selectionStart,r.currentStepNumber+=1,r.promptText=`${r.promptText}
${r.currentStepNumber}. `,r.caretPosition=r.promptText.length,t.value=r.promptText,t.focus(),t.selectionStart=r.caretPosition,t.selectionEnd=r.caretPosition)}function gt(){const t=E();t&&(r.promptText=t.value,r.caretPosition=t.selectionStart,r.currentStepNumber+=1,r.promptText=`${r.promptText}
${r.currentStepNumber}. `,r.caretPosition=r.promptText.length,U())}function G(){const t=E();t&&(r.promptText=t.value,r.caretPosition=t.selectionStart,r.promptText.endsWith(" ")||(r.promptText+=" ",r.caretPosition=r.promptText.length),U())}function xt(t){if(r.isModalOpen){if(t.key==="Enter"&&(t.metaKey||t.ctrlKey)){t.preventDefault(),Et();return}if(t.key==="Enter"&&!t.shiftKey){t.preventDefault(),gt();return}t.key==="Escape"&&(t.preventDefault(),G())}}function Tt(){const t=E();t&&(r.promptText=t.value,r.caretPosition=t.selectionStart)}function Q(){const t=E();t&&(r.caretPosition=t.selectionStart)}function vt(){const t=E(),e=K();if(!(!t||!e)){if(r.promptText=t.value,r.caretPosition=t.selectionStart,!navigator?.clipboard?.writeText){S("❌ 복사 실패");return}navigator.clipboard.writeText(r.promptText).then(()=>{e.textContent="복사됨!",window.setTimeout(()=>{r.isModalOpen&&U()},500),window.setTimeout(()=>{e.textContent="복사하기"},2e3)}).catch(()=>{S("❌ 복사 실패")})}}function J(t){if(O(t),!w||r.mode!=="highlight")return;const e=x.findElementBySelector(t.target);if(e){if(r.currentElement===e.element){r.currentSelector=e.selector,r.currentAttribute=e.attribute,F(e.element);return}_(e.element,e)}}function tt(t){O(t),r.mode==="highlight"&&r.currentElement===t.target&&(z(),r.currentElement=null,r.currentSelector=null,r.currentAttribute=null)}function et(t){!w||r.mode!=="highlight"||!C()||(t.key==="ArrowUp"?(t.preventDefault(),pt()):t.key==="ArrowDown"?(t.preventDefault(),ht()):(t.code==="Space"||t.key===" ")&&(t.preventDefault(),bt(t)))}function N(){const t=C();t&&F(t)}function wt(){document.addEventListener("mouseover",J,!0),document.addEventListener("mouseout",tt,!0),document.addEventListener("keydown",et,!0),document.addEventListener("mousemove",O,!0),window.addEventListener("scroll",N,!0),window.addEventListener("resize",N,!0)}function St(){document.removeEventListener("mouseover",J,!0),document.removeEventListener("mouseout",tt,!0),document.removeEventListener("keydown",et,!0),document.removeEventListener("mousemove",O,!0),window.removeEventListener("scroll",N,!0),window.removeEventListener("resize",N,!0)}function Ct(){w||(at(),Z(),$(),wt(),w=!0,console.log("[Element Inspector] 활성화됨"))}function At(){if(!w)return;St(),z(),$(),document.removeEventListener("mousemove",I,!0),r.mode="highlight",r.isModalOpen=!1,r.currentElement=null,r.currentSelector=null,r.currentAttribute=null,m=null,g=null,w=!1;const t=document.querySelector(".element-inspector-snackbar");t&&t.remove(),console.log("[Element Inspector] 비활성화됨")}function nt(t){t?Ct():At()}chrome.runtime.onMessage.addListener((t,e,n)=>{!t||!t.type||t.type==="ELEMENT_INSPECTOR_SET_STATE"&&(nt(!!t.enabled),n({enabled:w}))});try{chrome.runtime.sendMessage({type:"ELEMENT_INSPECTOR_REQUEST_STATE"},t=>{if(chrome.runtime.lastError)return;const e=!!t?.enabled;nt(e)})}catch(t){console.warn("[Element Inspector] 상태 요청 실패",t)}const Mt=Object.freeze({distanceThreshold:280,speedThreshold:50,directionThreshold:.1,hoverReason:"hovering modal",distanceReason:"within threshold",towardReason:"moving toward modal",inactiveReason:"inactive tracking"});function rt(t){if(!t)throw new TypeError("A mouse event or coordinate object is required.");if(typeof t.clientX=="number"&&typeof t.clientY=="number")return{x:t.clientX,y:t.clientY};if(typeof t.x=="number"&&typeof t.y=="number")return{x:t.x,y:t.y};throw new TypeError("Unsupported point format. Expected MouseEvent, {clientX, clientY}, or {x, y}.")}class kt{constructor(e={}){this.options={...Mt},this.configure(e),this.modalElement=null,this.modalCenter=null,this.initialPosition=null,this.lastPosition=null,this.isTracking=!1}configure(e={}){if(e==null)return;if(typeof e!="object")throw new TypeError("Configuration overrides must be an object.");const{distanceThreshold:n,speedThreshold:o,directionThreshold:i,...s}=e;if(n!==void 0){if(!Number.isFinite(n)||n<0)throw new TypeError("distanceThreshold must be a non-negative finite number.");this.options.distanceThreshold=n}if(o!==void 0){if(!Number.isFinite(o)||o<0)throw new TypeError("speedThreshold must be a non-negative finite number.");this.options.speedThreshold=o}if(i!==void 0){if(!Number.isFinite(i)||i<0||i>1)throw new TypeError("directionThreshold must be between 0 and 1.");this.options.directionThreshold=i}this.options={...this.options,...s}}startTracking(e,n){if(!(e instanceof Element))throw new TypeError("modalElement must be a valid DOM Element.");const o=rt(n);this.modalElement=e,this.modalCenter=this.#e(),this.initialPosition={...o},this.lastPosition={...o},this.isTracking=!0}evaluate(e){if(!this.isTracking||!this.modalElement)return{shouldClose:!1,reason:this.options.inactiveReason,totalDistance:0,speed:0,direction:"neutral"};const o={...rt(e)};this.modalCenter=this.#e();const i=this.#r(this.initialPosition,o);if(this.#i(e))return this.lastPosition=o,{shouldClose:!1,reason:this.options.hoverReason,totalDistance:i,speed:0,direction:"neutral"};if(i<this.options.distanceThreshold)return this.lastPosition=o,{shouldClose:!1,reason:this.options.distanceReason,totalDistance:i,speed:0,direction:"neutral"};const s=this.#n(this.lastPosition,o),a=this.#t(s),f=this.#n(this.lastPosition,this.modalCenter),p=this.#o(s,f),y=a>this.options.speedThreshold,A=p==="away";return this.lastPosition=o,y&&i>this.options.distanceThreshold?{shouldClose:!0,reason:"fast move",totalDistance:i,speed:a,direction:p}:A&&i>this.options.distanceThreshold?{shouldClose:!0,reason:"opposite direction",totalDistance:i,speed:a,direction:p}:p==="toward"?{shouldClose:!1,reason:this.options.towardReason,totalDistance:i,speed:a,direction:p}:{shouldClose:!1,reason:"no close condition met",totalDistance:i,speed:a,direction:p}}stopTracking(){this.modalElement=null,this.modalCenter=null,this.initialPosition=null,this.lastPosition=null,this.isTracking=!1}#e(){if(!this.modalElement)return null;const e=this.modalElement.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height/2}}#n(e,n){return!e||!n?{x:0,y:0}:{x:n.x-e.x,y:n.y-e.y}}#r(e,n){return!e||!n?0:Math.hypot(n.x-e.x,n.y-e.y)}#t(e){return Math.hypot(e.x,e.y)}#o(e,n){const o=this.#t(e),i=this.#t(n);if(o===0||i===0)return"neutral";const a=(e.x*n.x+e.y*n.y)/(o*i);return a>this.options.directionThreshold?"toward":a<-this.options.directionThreshold?"away":"neutral"}#i(e){if(!e||!this.modalElement)return!1;const n=e.target;return n?n===this.modalElement?!0:n instanceof Element?this.modalElement.contains(n):n.parentElement?this.modalElement.contains(n.parentElement):!1:!1}}const Pt=Object.freeze(Object.defineProperty({__proto__:null,default:kt},Symbol.toStringTag,{value:"Module"}))})();
