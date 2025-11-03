// ==UserScript==
// @name         Mine Blocks New Commands Mod
// @version      0.1.0
// @description  Adds new chat commands to Mine Blocks (powered by Mine Blocks JavaScript API 0.1.0).
// @author       cipherzok
// @match        https://mineblocks.com/1/embed/html5/
// @match        https://zanzlanz.com/mineblocks.com/1/embed/html5/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener("firstGame", function () {
        mineBlocksApi.registerCommand("greet", (name = "Nobody") => {
            console.log("Hello, " + name + "! :D");
            mineBlocksApi.interpretCommand("give diamond");
        });
    });
})();