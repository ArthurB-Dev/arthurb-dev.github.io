(function () {
  const MODE_STORAGE_KEY = 'mode';
  const PALETTE_STORAGE_KEY = 'theme-palette';

  const popup = document.getElementById('theme-settings-popup');
  const openButton = document.getElementById('theme-settings-trigger');
  const closeButton = document.getElementById('theme-settings-close');

  if (!popup || !openButton || !closeButton) {
    return;
  }

  const htmlEl = document.documentElement;
  const modeButtons = Array.from(
    document.querySelectorAll('[data-theme-mode-value]'),
  );
  const paletteButtons = Array.from(
    document.querySelectorAll('[data-theme-palette-value]'),
  );
  const modeValues = modeButtons.map((button) =>
    button.getAttribute('data-theme-mode-value'),
  );
  const paletteValues = paletteButtons.map((button) =>
    button.getAttribute('data-theme-palette-value'),
  );
  const paletteModeMap = new Map(
    paletteButtons.map((button) => {
      const paletteId = button.getAttribute('data-theme-palette-value');
      const supportedModes = (
        button.getAttribute('data-theme-supported-modes') || 'light,dark'
      )
        .split(',')
        .map((mode) => mode.trim())
        .filter((mode) => modeValues.includes(mode));

      return [
        paletteId,
        supportedModes.length > 0 ? supportedModes : modeValues,
      ];
    }),
  );

  const defaultPaletteButton = document.querySelector(
    '[data-default-theme-palette="true"]',
  );
  const preferredDefaultPalette = defaultPaletteButton
    ? defaultPaletteButton.getAttribute('data-theme-palette-value')
    : 'catppuccin';
  const defaultPalette = paletteValues.includes(preferredDefaultPalette)
    ? preferredDefaultPalette
    : paletteValues[0] || 'catppuccin';

  const defaultMode = modeValues.includes('system')
    ? 'system'
    : modeValues[0] || null;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getSessionItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setSessionItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures in restricted contexts.
    }
  }

  function removeSessionItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      // Ignore storage failures in restricted contexts.
    }
  }

  function getLocalItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setLocalItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures in restricted contexts.
    }
  }

  function getStoredMode() {
    const candidateMode =
      getSessionItem(MODE_STORAGE_KEY) || htmlEl.getAttribute('data-mode');

    if (!candidateMode) {
      return defaultMode;
    }

    return modeValues.includes(candidateMode) ? candidateMode : defaultMode;
  }

  function getStoredPalette() {
    const candidatePalette =
      getLocalItem(PALETTE_STORAGE_KEY) || htmlEl.getAttribute('data-theme');

    if (!candidatePalette) {
      return defaultPalette;
    }

    return paletteValues.includes(candidatePalette)
      ? candidatePalette
      : defaultPalette;
  }

  function syncThemeModeClass() {
    const mode = htmlEl.getAttribute('data-mode');
    if (mode === 'dark') {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
      return;
    }

    if (mode === 'light') {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
      return;
    }

    if (prefersDark.matches) {
      htmlEl.classList.add('dark');
      htmlEl.classList.remove('light');
    } else {
      htmlEl.classList.add('light');
      htmlEl.classList.remove('dark');
    }
  }

  function setMode(mode) {
    if (!modeValues.includes(mode)) {
      return;
    }

    const currentPalette = getStoredPalette();
    const supportedModes = paletteModeMap.get(currentPalette) || modeValues;

    if (!supportedModes.includes(mode)) {
      return;
    }

    if (mode === 'system') {
      htmlEl.removeAttribute('data-mode');
      removeSessionItem(MODE_STORAGE_KEY);
    } else {
      htmlEl.setAttribute('data-mode', mode);
      setSessionItem(MODE_STORAGE_KEY, mode);
    }

    syncThemeModeClass();

    if (typeof window.Theme !== 'undefined' && window.Theme.ID) {
      window.postMessage({ id: window.Theme.ID }, '*');
    }
  }

  function setPalette(palette) {
    if (!paletteValues.includes(palette)) {
      return;
    }

    htmlEl.setAttribute('data-theme', palette);
    setLocalItem(PALETTE_STORAGE_KEY, palette);
  }

  function setChecked(buttons, selectedValue, dataKey) {
    buttons.forEach((button) => {
      const value = button.getAttribute(dataKey);
      const isSelected = value === selectedValue;
      button.setAttribute('aria-checked', String(isSelected));
      button.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
  }

  function applyModeAvailability(selectedPalette) {
    const supportedModes = paletteModeMap.get(selectedPalette) || modeValues;

    modeButtons.forEach((button) => {
      const mode = button.getAttribute('data-theme-mode-value');
      const isSupported = supportedModes.includes(mode);
      button.disabled = !isSupported;
      button.setAttribute('aria-disabled', String(!isSupported));
    });

    const currentMode = getStoredMode();
    const fallbackMode =
      (currentMode && supportedModes.includes(currentMode) && currentMode) ||
      supportedModes[0] ||
      null;

    if (fallbackMode && currentMode !== fallbackMode) {
      setMode(fallbackMode);
    }
  }

  function refreshSelections() {
    const currentMode = getStoredMode();
    const currentPalette = getStoredPalette();

    applyModeAvailability(currentPalette);

    if (currentMode) {
      const safeMode = (
        paletteModeMap.get(currentPalette) || modeValues
      ).includes(currentMode)
        ? currentMode
        : (paletteModeMap.get(currentPalette) || modeValues)[0];

      if (safeMode) {
        setChecked(modeButtons, safeMode, 'data-theme-mode-value');
      }
    }

    setChecked(paletteButtons, currentPalette, 'data-theme-palette-value');
  }

  function hidePopup() {
    if (popup.hasAttribute('closing')) {
      return;
    }

    popup.toggleAttribute('closing', true);

    popup.addEventListener(
      'animationend',
      () => {
        popup.toggleAttribute('closing', false);
        popup.close();
      },
      { once: true },
    );
  }

  function showPopup() {
    refreshSelections();
    popup.showModal();
  }

  function onBackdropClick(event) {
    if (popup.hasAttribute('closing')) {
      return;
    }

    const rect = event.target.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      hidePopup();
    }
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedMode = button.getAttribute('data-theme-mode-value');
      setMode(selectedMode);
      refreshSelections();
    });
  });

  paletteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedPalette = button.getAttribute('data-theme-palette-value');
      setPalette(selectedPalette);
      refreshSelections();
    });
  });

  openButton.addEventListener('click', showPopup);
  closeButton.addEventListener('click', hidePopup);
  popup.addEventListener('click', onBackdropClick);
  popup.addEventListener('cancel', (event) => {
    event.preventDefault();
    hidePopup();
  });

  const onMediaQueryChange = () => {
    if (!htmlEl.hasAttribute('data-mode')) {
      syncThemeModeClass();
    }
  };

  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', onMediaQueryChange);
  } else if (typeof prefersDark.addListener === 'function') {
    prefersDark.addListener(onMediaQueryChange);
  }

  syncThemeModeClass();
  refreshSelections();
})();
