// ==UserScript==
// @name         Mine Blocks Coordinates Mod
// @version      0.1.0
// @description  Displays the player's coordinates (powered by Mine Blocks JavaScript API 0.1.1).
// @author       cipherzok
// @match        https://mineblocks.com/1/embed/html5/
// @match        https://zanzlanz.com/mineblocks.com/1/embed/html5/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    addEventListener("firstGame", function () {
        const p = document.createElement("div");
        p.style.color = "white";
        p.style.zIndex = 10;
        p.style.whiteSpace = "pre-line";
        p.style.position = "absolute";
        p.style.padding = "10px"
        document.body.appendChild(p)
        setInterval(function () {
            p.textContent = "x: " + mineBlocksApi.player.x + "\ny: " + -mineBlocksApi.player.y;
        }, 1000 / 60)
    });
})();