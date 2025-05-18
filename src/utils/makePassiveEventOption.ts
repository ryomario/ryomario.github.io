"use client"

// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;
class Options implements AddEventListenerOptions {
  get passive() {
    passiveSupported = true;
    return false;
  }
}
try {
  const options = new Options()
  const callback = () => {}
  window.addEventListener("toggle", callback, options);
  window.removeEventListener("toggle", callback);
} catch {
  passiveSupported = false;
}

function makePassiveEventOption(passive: boolean) {
  return passiveSupported ? { passive } : passive;
}

export default makePassiveEventOption;