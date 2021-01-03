/* preload.js, case 4 (extend)*/
const { contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld(
  "api", {
    invoke: async (channel, data) => {
        return await ipcRenderer.invoke(channel, data);
    },
    send: async (channel, data) => {//rendererからの送信用//
        return await ipcRenderer.send(channel, data);
    },
    on: async (channel, func) => { //rendererでの受信用, funcはコールバック関数//
        return await ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);
