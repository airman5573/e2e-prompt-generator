import { createAttributeManager } from './lib/attributeManager.js';
import {
  initializeOverlayStyles,
  ensureHighlightOverlay,
  updateHighlightOverlayPosition,
  removeHighlightOverlay,
} from './lib/overlayManager.js';
import {
  ensureModalElements,
  getModalTextarea,
  getCopyButton,
  showModalUI,
  hideModalUI,
  MODAL_CLOSE_REQUEST_EVENT,
} from './lib/modalUI.js';
import { showSnackbar } from './lib/snackbar.js';

let inspectorEnabled = false;
let lastMousePosition = null;
const attributeManager = createAttributeManager();

const INTERACTIVE_TAG_NAMES = new Set(['A', 'BUTTON', 'INPUT', 'LABEL', 'SELECT', 'TEXTAREA']);
const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'checkbox',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'switch',
  'tab',
]);

const state = {
  mode: 'highlight',
  currentElement: null,
  currentSelector: null,
  currentAttribute: null,
  promptText: '',
  currentStepNumber: 1,
  isModalOpen: false,
  caretPosition: 0,
};

const DOUBLE_SPACE_THRESHOLD_MS = 200;

const SNAPSHOT_STORAGE_KEY = 'e2ePromptSnapshots';
const SNAPSHOT_INTERVAL_MS = 3000;
const SNAPSHOT_MAX_ENTRIES = 50;

let snapshotIntervalId = null;
let lastSnapshotSignature = null;
let lastSpaceKeyTimestamp = 0;
let pendingSpaceKeyTimeoutId = null;

function getSnapshotSignature() {
  return [
    state.promptText || '',
    state.currentStepNumber || 0,
    state.caretPosition || 0,
    state.currentSelector || '',
    state.currentAttribute || '',
  ].join('||');
}

function loadExistingSnapshots() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn('[Element Inspector] Failed to parse prompt snapshots', error);
  }

  return [];
}

function persistSnapshots(snapshots) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshots));
  } catch (error) {
    console.warn('[Element Inspector] Failed to persist prompt snapshots', error);
  }
}

function takePromptSnapshot() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const hasMeaningfulContent =
    (typeof state.promptText === 'string' && state.promptText.trim().length > 0) ||
    Boolean(state.currentSelector);

  if (!hasMeaningfulContent) {
    return;
  }

  const signature = getSnapshotSignature();
  if (signature === lastSnapshotSignature) {
    return;
  }

  const snapshot = {
    timestamp: new Date().toISOString(),
    promptText: state.promptText,
    currentStepNumber: state.currentStepNumber,
    caretPosition: state.caretPosition,
    currentSelector: state.currentSelector,
    currentAttribute: state.currentAttribute,
    mode: state.mode,
    pageUrl: window.location.href,
  };

  const snapshots = loadExistingSnapshots();
  snapshots.push(snapshot);
  if (snapshots.length > SNAPSHOT_MAX_ENTRIES) {
    snapshots.splice(0, snapshots.length - SNAPSHOT_MAX_ENTRIES);
  }

  persistSnapshots(snapshots);
  lastSnapshotSignature = signature;
}

function startPromptSnapshotTimer() {
  if (snapshotIntervalId !== null) {
    return;
  }

  snapshotIntervalId = window.setInterval(() => {
    try {
      takePromptSnapshot();
    } catch (error) {
      console.warn('[Element Inspector] Snapshot timer error', error);
    }
  }, SNAPSHOT_INTERVAL_MS);
}

function stopPromptSnapshotTimer() {
  if (snapshotIntervalId === null) {
    return;
  }

  window.clearInterval(snapshotIntervalId);
  snapshotIntervalId = null;
  lastSnapshotSignature = null;
}

function isTargetInsidePromptUI(target) {
  if (!(target instanceof Node)) {
    return false;
  }
  const overlay = document.querySelector('#e2e-prompt-overlay');
  return Boolean(overlay && overlay.contains(target));
}

function ensureCurrentElement() {
  if (state.currentElement && document.contains(state.currentElement)) {
    return state.currentElement;
  }
  state.currentElement = null;
  state.currentSelector = null;
  state.currentAttribute = null;
  return null;
}

function handleAttributePriorityUpdate() {
  const activeElement = ensureCurrentElement();
  if (!activeElement) {
    removeHighlightOverlay();
    return;
  }

  const details = attributeManager.getSelectorDetails(activeElement);
  if (details) {
    highlightElement(details.element, details);
    return;
  }

  removeHighlightOverlay();
  state.currentElement = null;
  state.currentSelector = null;
  state.currentAttribute = null;
}

function refreshAttributesFromStorage() {
  attributeManager.refreshFromStorage(() => {
    handleAttributePriorityUpdate();
  });
}

refreshAttributesFromStorage();

if (chrome?.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    attributeManager.handleStorageChange(changes, areaName, () => {
      handleAttributePriorityUpdate();
    });
  });
}

let modalListenersAttached = false;
let overlayCloseListenerAttached = false;

function describeElement(element) {
  if (!(element instanceof Element)) {
    return String(element);
  }
  const parts = [element.tagName.toLowerCase()];
  if (element.id) {
    parts.push(`#${element.id}`);
  }
  if (element.classList?.length) {
    parts.push(`.${Array.from(element.classList).join('.')}`);
  }
  return parts.join('');
}

function describeSelectorDetails(details) {
  if (!details || !details.element) {
    return null;
  }
  return {
    selector: details.selector,
    attribute: details.attribute,
    value: details.value,
    element: describeElement(details.element),
  };
}

function isInteractiveElement(node) {
  if (!(node instanceof Element)) {
    return false;
  }

  if (INTERACTIVE_TAG_NAMES.has(node.tagName)) {
    return true;
  }

  const role = node.getAttribute('role');
  if (role && INTERACTIVE_ROLES.has(role.toLowerCase())) {
    return true;
  }

  return Boolean(node.isContentEditable);
}

function extractEventPathElements(event) {
  if (!event || typeof event.composedPath !== 'function') {
    const target = event?.target;
    return target instanceof Element ? [target] : [];
  }

  const seen = new Set();
  const elements = [];

  for (const node of event.composedPath()) {
    if (!(node instanceof Element) || seen.has(node)) {
      continue;
    }
    seen.add(node);
    elements.push(node);
  }

  return elements;
}

function elementsFromPointer(event) {
  const fallback = lastMousePosition;
  let pointX = null;
  let pointY = null;

  if (event instanceof MouseEvent) {
    pointX = event.clientX;
    pointY = event.clientY;
  } else if (fallback) {
    pointX = fallback.x;
    pointY = fallback.y;
  }

  if (typeof pointX !== 'number' || typeof pointY !== 'number') {
    return [];
  }

  let elements = [];
  if (typeof document.elementsFromPoint === 'function') {
    elements = document.elementsFromPoint(pointX, pointY) || [];
  } else {
    const element = document.elementFromPoint?.(pointX, pointY);
    if (element) {
      elements = [element];
    }
  }

  return elements.filter((node) => node instanceof Element);
}

function resolveSelectorDetailsFromEvent(event) {
  const pathElements = extractEventPathElements(event);
  if (event?.target instanceof Element && !pathElements.includes(event.target)) {
    pathElements.unshift(event.target);
  }

  const pointerElements = elementsFromPointer(event);
  const combinedElements = [...pathElements];
  for (const element of pointerElements) {
    if (!combinedElements.includes(element)) {
      combinedElements.unshift(element);
    }
  }

  const debugInfo = {
    eventType: event?.type || 'unknown',
    target: event?.target instanceof Element ? describeElement(event.target) : String(event?.target),
    path: pathElements.map(describeElement),
    pointerSample: pointerElements.map(describeElement),
    interactiveCandidates: [],
    directTargetChecked: false,
    fallbackCandidates: [],
    result: null,
  };

  for (const element of combinedElements) {
    if (!isInteractiveElement(element)) {
      continue;
    }
    const described = describeElement(element);
    debugInfo.interactiveCandidates.push(described);
    const details = attributeManager.findElementBySelector(element);
    if (details) {
      debugInfo.result = {
        stage: 'interactive',
        ...describeSelectorDetails(details),
      };
      console.log('[Element Inspector] selector resolved', debugInfo);
      return details;
    }
  }

  if (event?.target instanceof Element) {
    debugInfo.directTargetChecked = true;
    const directDetails = attributeManager.findElementBySelector(event.target);
    if (directDetails) {
      debugInfo.result = {
        stage: 'direct-target',
        ...describeSelectorDetails(directDetails),
      };
      console.log('[Element Inspector] selector resolved', debugInfo);
      return directDetails;
    }
  }

  for (const element of combinedElements) {
    const described = describeElement(element);
    debugInfo.fallbackCandidates.push(described);
    const details = attributeManager.findElementBySelector(element);
    if (details) {
      debugInfo.result = {
        stage: 'fallback',
        ...describeSelectorDetails(details),
      };
      console.log('[Element Inspector] selector resolved', debugInfo);
      return details;
    }
  }

  console.log('[Element Inspector] selector resolved', debugInfo);
  return null;
}

function resolveDetailsForModal(initialDetails) {
  if (!initialDetails) {
    return null;
  }

  const candidate = initialDetails.element instanceof Element ? initialDetails.element : null;
  if (candidate && document.contains(candidate)) {
    return { ...initialDetails, element: candidate, rehydrated: false };
  }

  if (initialDetails.selector) {
    const queryElement = document.querySelector(initialDetails.selector);
    if (queryElement instanceof Element) {
      const refreshed = attributeManager.getSelectorDetails(queryElement);
      if (refreshed) {
        return { ...refreshed, rehydrated: true };
      }
      return { ...initialDetails, element: queryElement, rehydrated: true };
    }
  }

  return { ...initialDetails, element: null, rehydrated: true };
}

function ensureModalInitialized() {
  const overlay = ensureModalElements();
  const textarea = getModalTextarea();
  const copyButton = getCopyButton();

  if (!overlayCloseListenerAttached && overlay) {
    overlay.addEventListener(MODAL_CLOSE_REQUEST_EVENT, () => {
      if (state.isModalOpen) {
        handleEscape();
      }
    });
    overlayCloseListenerAttached = true;
  }

  if (!modalListenersAttached && textarea && copyButton) {
    textarea.addEventListener('keydown', handleTextareaKeyDown);
    textarea.addEventListener('input', handleTextareaInput);
    textarea.addEventListener('click', handleTextareaSelectionUpdate);
    textarea.addEventListener('keyup', handleTextareaSelectionUpdate);

    copyButton.addEventListener('click', handleCopyButtonClick);

    modalListenersAttached = true;
  }

  return { overlay, textarea, copyButton };
}

function trackMousePosition(event) {
  if (!event || typeof event.clientX !== 'number' || typeof event.clientY !== 'number') {
    return;
  }

  lastMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
}

function highlightElement(element, selectorDetails) {
  if (!element || state.mode !== 'highlight') {
    return;
  }

  const details = selectorDetails || attributeManager.getSelectorDetails(element);
  if (!details || !details.selector) {
    return;
  }

  state.currentElement = element;
  state.currentSelector = details.selector;
  state.currentAttribute = details.attribute;

  ensureHighlightOverlay();
  updateHighlightOverlayPosition(element);

  if (typeof element.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    window.setTimeout(() => {
      if (state.currentElement === element) {
        updateHighlightOverlayPosition(element);
      }
    }, 300);
  }
}

function navigateToParent() {
  const activeElement = ensureCurrentElement();
  if (!activeElement) {
    return;
  }

  let parent = activeElement.parentElement;
  while (parent) {
    const details = attributeManager.getSelectorDetails(parent);
    if (details) {
      highlightElement(parent, details);
      return;
    }
    parent = parent.parentElement;
  }

  showSnackbar('사용할 수 있는 상위 요소가 없습니다', 1200, '#ff9800');
}

function navigateToChild() {
  const activeElement = ensureCurrentElement();
  if (!activeElement) {
    return;
  }

  const findChildWithMatch = (element) => {
    for (const child of element.children) {
      const details = attributeManager.getSelectorDetails(child);
      if (details) {
        return details;
      }
      const found = findChildWithMatch(child);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const childDetails = findChildWithMatch(activeElement);
  if (childDetails) {
    highlightElement(childDetails.element, childDetails);
  } else {
    showSnackbar('사용할 수 있는 하위 요소가 없습니다', 1200, '#ff9800');
  }
}

function insertAt(text, index, value) {
  const safeIndex = Math.min(Math.max(index, 0), text.length);
  return text.slice(0, safeIndex) + value + text.slice(safeIndex);
}

function openModal(openEvent, options = {}) {
  const { skipModalDisplay = false } = options;
  const explicitDetails = resolveDetailsForModal(openEvent?.selectorDetails);
  const fallbackElement = ensureCurrentElement();

  let details = null;
  let elementForPrompt =
    explicitDetails?.element instanceof Element && document.contains(explicitDetails.element)
      ? explicitDetails.element
      : null;

  if (explicitDetails?.selector) {
    details = explicitDetails;
    if (!elementForPrompt) {
      elementForPrompt = fallbackElement instanceof Element ? fallbackElement : null;
    }
    console.log('[Element Inspector] modal using explicit details', {
      selector: explicitDetails.selector,
      attribute: explicitDetails.attribute,
      value: explicitDetails.value,
      element: describeElement(explicitDetails.element),
      rehydrated: Boolean(explicitDetails.rehydrated),
      fallbackUsed: !explicitDetails.element,
    });
  } else if (fallbackElement) {
    elementForPrompt = fallbackElement;
    details = attributeManager.getSelectorDetails(fallbackElement);
  }

  if (!details || !details.selector) {
    console.log('[Element Inspector] modal failed to resolve selector', {
      explicitProvided: Boolean(explicitDetails),
      element: elementForPrompt ? describeElement(elementForPrompt) : null,
    });
    showSnackbar('사용할 수 있는 속성을 찾을 수 없습니다');
    return;
  }

  state.currentElement = details.element || elementForPrompt || null;
  state.currentSelector = details.selector;
  state.currentAttribute = details.attribute;

  const isClickTrigger = openEvent?.type === 'click';
  const elementToken = isClickTrigger
    ? `${details.selector} 클릭하고 `
    : `${details.selector} `;
  const isFirstStep = state.promptText === '' && state.currentStepNumber === 1;

  if (isFirstStep) {
    state.promptText = `1. ${elementToken}`;
    state.caretPosition = state.promptText.length;
  } else {
    const insertionIndex =
      typeof state.caretPosition === 'number' ? state.caretPosition : state.promptText.length;
    state.promptText = insertAt(state.promptText, insertionIndex, elementToken);
    state.caretPosition = insertionIndex + elementToken.length;
  }

  const { textarea, copyButton } = ensureModalInitialized();
  if (textarea) {
    textarea.value = state.promptText;
  }

  if (skipModalDisplay) {
    state.mode = 'highlight';
    state.isModalOpen = false;
    return;
  }

  if (!textarea) {
    return;
  }

  state.mode = 'modal-open';
  state.isModalOpen = true;

  if (copyButton) {
    copyButton.textContent = '복사하기';
  }

  showModalUI();

  window.requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = state.caretPosition;
    textarea.selectionEnd = state.caretPosition;
  });
}

function closeModal() {
  const textarea = getModalTextarea();
  if (textarea) {
    textarea.value = state.promptText;
  }

  state.mode = 'highlight';
  state.isModalOpen = false;
  hideModalUI();
}

function reopenModalWithoutSelector() {
  const { textarea, copyButton } = ensureModalInitialized();
  if (!textarea) {
    return;
  }

  if (typeof state.caretPosition !== 'number') {
    state.caretPosition = state.promptText.length;
  }

  textarea.value = state.promptText;
  state.mode = 'modal-open';
  state.isModalOpen = true;

  if (copyButton) {
    copyButton.textContent = '복사하기';
  }

  showModalUI();

  window.requestAnimationFrame(() => {
    const caret = Math.min(Math.max(state.caretPosition, 0), textarea.value.length);
    textarea.focus();
    textarea.selectionStart = caret;
    textarea.selectionEnd = caret;
  });
}

function handleCommandEnter() {
  const textarea = getModalTextarea();
  if (!textarea) {
    return;
  }

  state.promptText = textarea.value;
  state.caretPosition = textarea.selectionStart;

  state.currentStepNumber += 1;
  state.promptText = `${state.promptText}\n${state.currentStepNumber}. `;
  state.caretPosition = state.promptText.length;

  textarea.value = state.promptText;
  textarea.focus();
  textarea.selectionStart = state.caretPosition;
  textarea.selectionEnd = state.caretPosition;
}

function handleEnter() {
  const textarea = getModalTextarea();
  if (!textarea) {
    return;
  }

  state.promptText = textarea.value;
  state.caretPosition = textarea.selectionStart;

  state.currentStepNumber += 1;
  state.promptText = `${state.promptText}\n${state.currentStepNumber}. `;
  state.caretPosition = state.promptText.length;

  closeModal();
}

function handleEscape() {
  const textarea = getModalTextarea();
  if (!textarea) {
    return;
  }

  state.promptText = textarea.value;
  state.caretPosition = textarea.selectionStart;

  if (!state.promptText.endsWith(' ')) {
    state.promptText += ' ';
    state.caretPosition = state.promptText.length;
  }

  closeModal();
}

function handleTextareaKeyDown(event) {
  if (!state.isModalOpen) {
    return;
  }

  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    handleCommandEnter();
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleEnter();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    handleEscape();
  }
}

function handleTextareaInput() {
  const textarea = getModalTextarea();
  if (!textarea) {
    return;
  }
  state.promptText = textarea.value;
  state.caretPosition = textarea.selectionStart;
}

function handleTextareaSelectionUpdate() {
  const textarea = getModalTextarea();
  if (!textarea) {
    return;
  }
  state.caretPosition = textarea.selectionStart;
}

function handleCopyButtonClick() {
  const textarea = getModalTextarea();
  const copyButton = getCopyButton();
  if (!textarea || !copyButton) {
    return;
  }

  state.promptText = textarea.value;
  state.caretPosition = textarea.selectionStart;

  if (!navigator?.clipboard?.writeText) {
    showSnackbar('복사 실패');
    return;
  }

  navigator.clipboard
    .writeText(state.promptText)
    .then(() => {
      copyButton.textContent = '복사됨!';
      window.setTimeout(() => {
        if (state.isModalOpen) {
          closeModal();
        }
      }, 500);

      window.setTimeout(() => {
        copyButton.textContent = '복사하기';
      }, 2000);
    })
    .catch(() => {
    showSnackbar('복사 실패');
  });
}

function handleDocumentClick(event) {
  if (!inspectorEnabled || state.mode !== 'highlight') {
    return;
  }

  if (!(event instanceof MouseEvent) || event.button !== 0) {
    return;
  }

  if (isTargetInsidePromptUI(event.target)) {
    return;
  }

  const details = resolveSelectorDetailsFromEvent(event);
  if (!details) {
    console.log('[Element Inspector] click resolved without match', {
      eventType: event.type,
      target: event.target instanceof Element ? describeElement(event.target) : String(event.target),
    });
    return;
  }

  console.log('[Element Inspector] click highlight', describeSelectorDetails(details));
  highlightElement(details.element, details);
  const shouldOpenModal = event.ctrlKey || event.metaKey || false;
  window.setTimeout(() => {
    if (!inspectorEnabled) {
      return;
    }
    openModal(
      { type: 'click', selectorDetails: details },
      { skipModalDisplay: !shouldOpenModal }
    );
  }, 0);
}

function handleMouseOver(event) {
  trackMousePosition(event);
  if (!inspectorEnabled || state.mode !== 'highlight') {
    return;
  }

  const details = resolveSelectorDetailsFromEvent(event);
  if (!details) {
    console.log('[Element Inspector] hover resolved without match', {
      eventType: event.type,
      target: event.target instanceof Element ? describeElement(event.target) : String(event.target),
    });
    return;
  }

  console.log('[Element Inspector] hover highlight', describeSelectorDetails(details));
  if (state.currentElement === details.element) {
    state.currentSelector = details.selector;
    state.currentAttribute = details.attribute;
    updateHighlightOverlayPosition(details.element);
    return;
  }

  highlightElement(details.element, details);
}

function handleMouseOut(event) {
  trackMousePosition(event);
  if (state.mode !== 'highlight') {
    return;
  }

  if (state.currentElement === event.target) {
    removeHighlightOverlay();
    state.currentElement = null;
    state.currentSelector = null;
    state.currentAttribute = null;
  }
}

function copyCurrentElementId() {
  const element = ensureCurrentElement();
  if (!element) {
    showSnackbar('선택된 요소가 없습니다', 1200, '#ff9800');
    return;
  }

  const elementId = typeof element.id === 'string' ? element.id.trim() : '';
  if (!elementId) {
    showSnackbar('선택된 요소에 id가 없습니다', 1200, '#ff9800');
    return;
  }

  if (!navigator?.clipboard?.writeText) {
    showSnackbar('복사 실패');
    return;
  }

  navigator.clipboard
    .writeText(elementId)
    .then(() => {
      showSnackbar(`#${elementId} 복사됨`, 3000, '#4caf50');
    })
    .catch(() => {
      showSnackbar('복사 실패');
    });
}

function resetSpaceKeyDetectionState() {
  if (pendingSpaceKeyTimeoutId !== null) {
    window.clearTimeout(pendingSpaceKeyTimeoutId);
    pendingSpaceKeyTimeoutId = null;
  }
  lastSpaceKeyTimestamp = 0;
}

function handleKeyDown(event) {
  if (!inspectorEnabled) {
    return;
  }

  if (event.key === 'Escape' && !state.isModalOpen) {
    event.preventDefault();
    reopenModalWithoutSelector();
    return;
  }

  if (state.mode !== 'highlight') {
    return;
  }

  const activeElement = ensureCurrentElement();
  if (!activeElement) {
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    navigateToParent();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    navigateToChild();
  } else if (event.code === 'Space' || event.key === ' ') {
    if (event.repeat) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const now = Date.now();
    if (
      pendingSpaceKeyTimeoutId !== null &&
      now - lastSpaceKeyTimestamp <= DOUBLE_SPACE_THRESHOLD_MS
    ) {
      resetSpaceKeyDetectionState();
      copyCurrentElementId();
      return;
    }

    resetSpaceKeyDetectionState();
    lastSpaceKeyTimestamp = now;
    pendingSpaceKeyTimeoutId = window.setTimeout(() => {
      pendingSpaceKeyTimeoutId = null;
      lastSpaceKeyTimestamp = 0;

      if (!inspectorEnabled || state.mode !== 'highlight') {
        return;
      }

      openModal({ type: 'key-space' });
    }, DOUBLE_SPACE_THRESHOLD_MS);
  }
}

function handleScrollOrResize() {
  const activeElement = ensureCurrentElement();
  if (activeElement) {
    updateHighlightOverlayPosition(activeElement);
  }
}

function attachEventListeners() {
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout', handleMouseOut, true);
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('mousemove', trackMousePosition, true);
  document.addEventListener('click', handleDocumentClick, true);
  window.addEventListener('scroll', handleScrollOrResize, true);
  window.addEventListener('resize', handleScrollOrResize, true);
}

function detachEventListeners() {
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('keydown', handleKeyDown, true);
  document.removeEventListener('mousemove', trackMousePosition, true);
  document.removeEventListener('click', handleDocumentClick, true);
  window.removeEventListener('scroll', handleScrollOrResize, true);
  window.removeEventListener('resize', handleScrollOrResize, true);
}

function enableInspector() {
  if (inspectorEnabled) {
    return;
  }

  initializeOverlayStyles();
  ensureModalInitialized();
  hideModalUI();
  attachEventListeners();
  startPromptSnapshotTimer();
  takePromptSnapshot();
  inspectorEnabled = true;
  console.log('[Element Inspector] 활성화됨');
}

function disableInspector() {
  if (!inspectorEnabled) {
    return;
  }

  takePromptSnapshot();
  stopPromptSnapshotTimer();
  detachEventListeners();
  removeHighlightOverlay();
  hideModalUI();
  resetSpaceKeyDetectionState();
  state.mode = 'highlight';
  state.isModalOpen = false;
  state.currentElement = null;
  state.currentSelector = null;
  state.currentAttribute = null;
  lastMousePosition = null;
  inspectorEnabled = false;

  const snackbar = document.querySelector('.element-inspector-snackbar');
  if (snackbar) {
    snackbar.remove();
  }

  console.log('[Element Inspector] 비활성화됨');
}

function setInspectorState(enabled) {
  if (enabled) {
    enableInspector();
  } else {
    disableInspector();
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) {
    return;
  }

  if (message.type === 'ELEMENT_INSPECTOR_SET_STATE') {
    setInspectorState(Boolean(message.enabled));
    sendResponse({ enabled: inspectorEnabled });
  }
});

try {
  chrome.runtime.sendMessage({ type: 'ELEMENT_INSPECTOR_REQUEST_STATE' }, (response) => {
    if (chrome.runtime.lastError) {
      return;
    }

    const enabled = Boolean(response?.enabled);
    setInspectorState(enabled);
  });
} catch (error) {
  console.warn('[Element Inspector] 상태 요청 실패', error);
}
