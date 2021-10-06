import { writable } from "svelte/store";

export const stateStore = writable({ rout: "botlist", 
                                    showmenu: false,
                                    selectbotname: "",
                                    urlhost: "",
                                    darkmodestatus: true,
                                    timerId: "",
                                    timerIdlist: ""});