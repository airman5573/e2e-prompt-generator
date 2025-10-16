/**
 * @module MouseIntentDetector
 * Detects whether the user intends to dismiss a modal based on mouse movement.
 */

const OSCILLATION_THRESHOLD = 50;

const DEFAULT_OPTIONS = Object.freeze({
  hoverReason: 'hovering modal',
  inactiveReason: 'inactive tracking',
  trackingReason: 'tracking movement',
  oscillationReason: 'oscillation detected',
});

/**
 * Normalize a mouse-like input to an {x, y} coordinate pair.
 * @param {MouseEvent|{clientX:number,clientY:number}|{x:number,y:number}} input
 * @returns {{x:number,y:number}}
 * @throws {TypeError} When the input does not provide valid coordinates.
 */
function normalizePoint(input) {
  if (!input) {
    throw new TypeError('A mouse event or coordinate object is required.');
  }

  if (typeof input.clientX === 'number' && typeof input.clientY === 'number') {
    return { x: input.clientX, y: input.clientY };
  }

  if (typeof input.x === 'number' && typeof input.y === 'number') {
    return { x: input.x, y: input.y };
  }

  throw new TypeError(
    'Unsupported point format. Expected MouseEvent, {clientX, clientY}, or {x, y}.',
  );
}

/**
 * @typedef {Object} MouseIntentOptions
 * @property {string} [hoverReason] Reason message when pointer is over the modal.
 * @property {string} [inactiveReason] Reason message when tracking is inactive.
 * @property {string} [trackingReason] Reason message while monitoring for oscillation.
 * @property {string} [oscillationReason] Reason message when oscillation is detected.
 * @property {number} [oscillationThreshold] Optional override for the oscillation displacement (px).
 */

/**
 * Represents the result of evaluating a mouse movement.
 * @typedef {Object} MouseIntentResult
 * @property {boolean} shouldClose Whether the modal should close.
 * @property {string} reason Diagnostic label indicating the matched condition.
 * @property {number} totalDistance Straight-line distance from start to current point.
 * @property {number} speed Magnitude of the latest movement vector.
 * @property {'neutral'|'oscillating'} direction Classification of the latest movement direction.
 */

/**
 * Detects mouse intent to dismiss a modal.
 *
 * Usage example:
 * ```js
 * import MouseIntentDetector from './mouseIntentDetector.js';
 *
 * const detector = new MouseIntentDetector({ oscillationThreshold: 60 });
 * const modalEl = document.querySelector('#modal');
 *
 * function onModalOpen(initialEvent) {
 *   detector.startTracking(modalEl, initialEvent);
 *   window.addEventListener('mousemove', handleMove);
 * }
 *
 * function handleMove(event) {
 *   const result = detector.evaluate(event);
 *   if (result.shouldClose) {
 *     window.removeEventListener('mousemove', handleMove);
 *     closeModal();
 *   }
 * }
 *
 * function onModalClose() {
 *   detector.stopTracking();
 *   window.removeEventListener('mousemove', handleMove);
 * }
 * ```
 */
export default class MouseIntentDetector {
  /**
   * Creates a new detector with optional configuration overrides.
   * @param {MouseIntentOptions} [options] Initial configuration.
   */
  constructor(options = {}) {
    /** @type {MouseIntentOptions} */
    this.options = { ...DEFAULT_OPTIONS };
    this.oscillationThreshold = OSCILLATION_THRESHOLD;
    this.configure(options);

    /** @private */
    this.modalElement = null;
    /** @private */
    this.initialPosition = null;
    /** @private */
    this.referencePosition = null;
    /** @private */
    this.lastPosition = null;
    /** @private */
    this.peakDisplacement = null;
    /** @private */
    this.peakMagnitude = 0;
    /** @private */
    this.peakUnitVector = null;
    /** @private */
    this.returnTravel = 0;
    /** @private */
    this.closestDistanceToReference = Number.POSITIVE_INFINITY;
    /** @private */
    this.isTracking = false;
  }

  /**
   * Updates detector configuration.
   * @param {MouseIntentOptions} [overrides] Partial overrides for thresholds and reasons.
   * @returns {void}
   */
  configure(overrides = {}) {
    if (overrides == null) {
      return;
    }

    if (typeof overrides !== 'object') {
      throw new TypeError('Configuration overrides must be an object.');
    }

    const nextOptions = { ...this.options };

    if (overrides.hoverReason !== undefined) {
      nextOptions.hoverReason = overrides.hoverReason;
    }

    if (overrides.inactiveReason !== undefined) {
      nextOptions.inactiveReason = overrides.inactiveReason;
    }

    if (overrides.trackingReason !== undefined) {
      nextOptions.trackingReason = overrides.trackingReason;
    }

    if (overrides.oscillationReason !== undefined) {
      nextOptions.oscillationReason = overrides.oscillationReason;
    }

    if (overrides.oscillationThreshold !== undefined) {
      const value = overrides.oscillationThreshold;
      if (!Number.isFinite(value) || value <= 0) {
        throw new TypeError('oscillationThreshold must be a positive finite number.');
      }
      this.oscillationThreshold = value;
    }

    this.options = nextOptions;
  }

  /**
   * Starts tracking mouse movement for the provided modal element.
   * @param {Element} modalElement The modal element to guard.
   * @param {MouseEvent|{clientX:number,clientY:number}|{x:number,y:number}} initialPoint Initial mouse reference.
   * @returns {void}
   */
  startTracking(modalElement, initialPoint) {
    if (!(modalElement instanceof Element)) {
      throw new TypeError('modalElement must be a valid DOM Element.');
    }

    const point = normalizePoint(initialPoint);

    this.modalElement = modalElement;
    this.initialPosition = { ...point };
    this.referencePosition = { ...point };
    this.lastPosition = { ...point };
    this.#resetOscillation();
    this.isTracking = true;
  }

  /**
   * Evaluates a mouse movement and determines the user's intent.
   * @param {MouseEvent|{clientX:number,clientY:number}|{x:number,y:number}} event Mouse move event or coordinates.
   * @returns {MouseIntentResult}
   */
  evaluate(event) {
    if (!this.isTracking || !this.modalElement) {
      return {
        shouldClose: false,
        reason: this.options.inactiveReason,
        totalDistance: 0,
        speed: 0,
        direction: 'neutral',
      };
    }

    const point = normalizePoint(event);
    const currentPosition = { ...point };
    const totalDistance = this.#distanceBetween(this.initialPosition, currentPosition);
    const movementVector = this.#vectorBetween(this.lastPosition, currentPosition);
    const speed = this.#magnitude(movementVector);

    if (this.#isHovering(event)) {
      this.referencePosition = { ...currentPosition };
      this.lastPosition = currentPosition;
      this.#resetOscillation();
      return {
        shouldClose: false,
        reason: this.options.hoverReason,
        totalDistance,
        speed,
        direction: 'neutral',
      };
    }

    this.lastPosition = currentPosition;

    const displacement = this.#vectorBetween(this.referencePosition, currentPosition);
    const displacementMagnitude = this.#magnitude(displacement);

    if (!this.peakDisplacement) {
      if (displacementMagnitude >= this.oscillationThreshold) {
        this.#recordPeak(displacement, displacementMagnitude);
      }
      return {
        shouldClose: false,
        reason: this.options.trackingReason,
        totalDistance,
        speed,
        direction: 'neutral',
      };
    }

    if (displacementMagnitude > this.peakMagnitude) {
      this.#recordPeak(displacement, displacementMagnitude);
      return {
        shouldClose: false,
        reason: this.options.trackingReason,
        totalDistance,
        speed,
        direction: 'neutral',
      };
    }

    this.closestDistanceToReference = Math.min(
      this.closestDistanceToReference,
      displacementMagnitude,
    );

    if (this.peakUnitVector) {
      const projection = this.#dot(movementVector, this.peakUnitVector);
      if (projection < 0) {
        this.returnTravel += -projection;
      }
    }

    const distanceRecovered = this.peakMagnitude - this.closestDistanceToReference;
    if (this.returnTravel >= this.oscillationThreshold && distanceRecovered >= this.oscillationThreshold) {
      return {
        shouldClose: true,
        reason: this.options.oscillationReason,
        totalDistance,
        speed,
        direction: 'oscillating',
      };
    }

    return {
      shouldClose: false,
      reason: this.options.trackingReason,
      totalDistance,
      speed,
      direction: 'neutral',
    };
  }

  /**
   * Stops tracking and clears internal state.
   * @returns {void}
   */
  stopTracking() {
    this.modalElement = null;
    this.initialPosition = null;
    this.referencePosition = null;
    this.lastPosition = null;
    this.#resetOscillation();
    this.isTracking = false;
  }

  #vectorBetween(from, to) {
    if (!from || !to) {
      return { x: 0, y: 0 };
    }
    return { x: to.x - from.x, y: to.y - from.y };
  }

  #distanceBetween(a, b) {
    if (!a || !b) {
      return 0;
    }
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  #magnitude(vector) {
    return Math.hypot(vector.x, vector.y);
  }

  #dot(a, b) {
    if (!a || !b) {
      return 0;
    }
    return a.x * b.x + a.y * b.y;
  }

  #recordPeak(displacement, magnitude) {
    this.peakDisplacement = { ...displacement };
    this.peakMagnitude = magnitude;
    this.peakUnitVector = magnitude === 0
      ? null
      : { x: displacement.x / magnitude, y: displacement.y / magnitude };
    this.returnTravel = 0;
    this.closestDistanceToReference = magnitude;
  }

  #resetOscillation() {
    this.peakDisplacement = null;
    this.peakMagnitude = 0;
    this.peakUnitVector = null;
    this.returnTravel = 0;
    this.closestDistanceToReference = Number.POSITIVE_INFINITY;
  }

  #isHovering(event) {
    if (!event || !this.modalElement) {
      return false;
    }

    const target = event.target;
    if (!target) {
      return false;
    }

    if (target === this.modalElement) {
      return true;
    }

    if (target instanceof Element) {
      return this.modalElement.contains(target);
    }

    if (target.parentElement) {
      return this.modalElement.contains(target.parentElement);
    }

    return false;
  }
}
