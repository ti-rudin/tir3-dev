import { writable } from "svelte/store";

export let darkMode;

function isDarkTheme() {
  //if (!window.matchMedia) {
  //  return false;
  //} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  //  return true;
  //}
  return localStorage.darkMode;
}

export default function dark(value = false, bodyClasses = "mode-dark") {
  if (typeof window === "undefined") return writable(value);

  if (!darkMode) {
    darkMode = writable(value || isDarkTheme());
  }

  return {
    subscribe: darkMode.subscribe,
    set: v => {
      bodyClasses.split(" ").forEach(c => {
        if (v) {
          document.body.classList.add(c);
          localStorage.darkMode = true;
        } else {
          document.body.classList.remove(c);
          localStorage.darkMode = false;
        }
      });

      darkMode.set(v);
    }
  };
}
