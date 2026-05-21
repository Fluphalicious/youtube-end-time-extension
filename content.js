/**
 * YouTube End Time – Safari Web Extension
 * Injects "· ends H:MMam" inside the YouTube time bubble.
 */
(function () {
  'use strict';

  const DISPLAY_ID   = 'yt-end-time-ext';
  const POLL_MS      = 500;
  const NAV_DELAY_MS = 1800;

  let intervalId  = null;
  let mutationObs = null;
  let videoEl     = null;

  function formatEndTime(date) {
    let hours  = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}:${mins}${ampm}`;
  }

  function calcEndDate() {
    const v = videoEl;
    if (!v || isNaN(v.duration) || v.duration === Infinity || v.duration <= 0) return null;
    const remainingSec = (v.duration - v.currentTime) / (v.playbackRate || 1);
    return new Date(Date.now() + remainingSec * 1000);
  }

  function getDisplay() {
    return document.getElementById(DISPLAY_ID);
  }

  function createDisplay() {
    const el = document.createElement('span');
    el.id = DISPLAY_ID;
    // Inherit YouTube's own time-display font/color — no overrides needed
    Object.assign(el.style, {
      fontWeight:    '400',
      whiteSpace:    'nowrap',
      cursor:        'default',
      userSelect:    'none',
      pointerEvents: 'none',
    });
    return el;
  }

  function injectDisplay() {
    if (getDisplay()) return true;

    // Target the duration span inside the bubble — append after it
    const duration = document.querySelector('.ytp-time-duration');
    if (!duration) return false;

    const display = createDisplay();
    duration.insertAdjacentElement('afterend', display);
    return true;
  }

  function updateDisplay() {
    videoEl = document.querySelector('video.html5-main-video') ||
              document.querySelector('video');

    let display = getDisplay();
    if (!display) {
      if (!injectDisplay()) return;
      display = getDisplay();
      if (!display) return;
    }

    const endDate = calcEndDate();
    display.textContent = endDate ? ` · ends ${formatEndTime(endDate)}` : '';
  }

  function startPolling() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateDisplay, POLL_MS);
    updateDisplay();
  }

  function stopPolling() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  function attachVideoEvents() {
    const v = document.querySelector('video.html5-main-video') ||
              document.querySelector('video');
    if (!v || v === videoEl) return;
    videoEl = v;
    ['ratechange', 'seeking', 'seeked', 'play', 'pause', 'loadedmetadata'].forEach(evt =>
      v.addEventListener(evt, updateDisplay, { passive: true })
    );
  }

  function init() {
    attachVideoEvents();
    injectDisplay();
    startPolling();
  }

  function startMutationWatch() {
    if (mutationObs) mutationObs.disconnect();
    mutationObs = new MutationObserver(() => {
      if (!getDisplay() && document.querySelector('.ytp-time-duration')) {
        attachVideoEvents();
        injectDisplay();
      }
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });
  }

  ['yt-navigate-finish', 'yt-page-data-updated', 'yt-player-updated'].forEach(evtName => {
    document.addEventListener(evtName, () => {
      setTimeout(() => {
        stopPolling();
        attachVideoEvents();
        injectDisplay();
        startPolling();
      }, NAV_DELAY_MS);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); startMutationWatch(); });
  } else {
    init();
    startMutationWatch();
  }

})();
