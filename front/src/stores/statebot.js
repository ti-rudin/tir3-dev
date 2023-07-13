import { writable } from "svelte/store";

export const stateStore = writable({ rout: "botlist", 
                                    showmenu: false,
                                    selectbotname: "",
                                    urlhost: "http://dev.ti-robots.ru:1880/",
                                    urlhostenv: "q",
                                    darkmodestatus: true,
                                    timerId: "",
                                    timerIdlist: ""});