// ==UserScript==
// @name         Mine Blocks JavaScript API
// @version      0.1.0
// @description  Allows other scripts to interact with Mine Blocks web build.
// @author       cipherzok
// @match        https://mineblocks.com/1/embed/html5/
// @match        https://zanzlanz.com/mineblocks.com/1/embed/html5/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    
    window.onerror = function () {
        console.log("Crash report blocked");
    }

    const originalMethods = {};

    const internals = {};

    function getReference(object, name) {
        const parts = name.split(".");
        parts.shift();
        const method = parts.pop();
        let target = object;
        for (const key of parts) target = target[key];
        return { target, method };
    }

    function addHook(object, name, callback) {
        const reference = getReference(object, name);
        const original = reference.target[reference.method];
        originalMethods[name] = original;
        reference.target[reference.method] = function (...args) {
            if (callback(...args)) {
                reference.target[reference.method] = originalMethods[name];
                delete originalMethods[name];
            }
            return original.apply(this, args);
        }
    }

    addHook(window, "window.Function.prototype.bind", function (Instance) {
        if (Instance && Instance.remainingSounds) {
            internals.Main = Instance.__class__;
            internals.StringMap = Instance.callOnMouseUp.__class__;
            Object.defineProperty(Instance, "game", {
                get() {
                    return internals.game;
                },
                set(value) {
                    internals.game = value;
                    listeners.newGame();
                }
            });
            console.log("Main hooked");
            return true;
        }
    });

    const identifierToId = {};
    const idToIdentifier = {};

    addHook(window, "window.Object.keys", function (blockData) {
        if (blockData.ObsidianPickaxe) {
            internals.blockData = blockData;
            for (const id in blockData) {
                const identifier = blockData[id].h.identifier;
                if (identifier) {
                    identifierToId[identifier] = id;
                    idToIdentifier[id] = identifier;
                }
            }
            delete identifierToId[" enchanted_book"];
            identifierToId.enchanted_book = "ebook";
            idToIdentifier.ebook = "enchanted_book";
            console.log("blockData hooked");
            return true;
        }
    });

    const api = {};

    const listeners = {};

    let isFirstGame = true;

    function isIntegerBetween(min, max, data) {
        return Number.isInteger(data) && min <= data && max >= data;
    }

    listeners.newGame = function () {
        console.log("[API] New game");
        if (isFirstGame) {
            api.interpretCommand = function (text) {
                if (typeof text === "string") {
                    internals.game.interpretCommand(text, true);
                } else {
                    console.log("Invalid string:", text);
                }
            }
            api.player = {
                set health(value) {
                    if (isIntegerBetween(0, 20, value)) {
                        internals.game.world.health = value
                    } else {
                        console.log("Player's health must be an whole number between 0 and 20: ", value)
                    }
                },
                get health() {
                    return internals.game.world.health;
                },
                get x() {
                    return internals.game.world.worldX;
                },
                get y() {
                    return internals.game.world.worldY;
                }
            }
            api.registerCommand = function (name, callback) {
                if (typeof name === "string") {
                    if (typeof callback === "function") {
                        commands[name] = callback;
                    }
                }
            }
            addHook(internals, "internals.game.interpretCommand", listeners.interpretCommand);
            addHook(internals, "internals.game.__proto__.interpretCommand", listeners.interpretCommand);
            isFirstGame = false;
            const event = new CustomEvent("firstGame");
            dispatchEvent(event);
        }
    }

    const commands = {};

    listeners.interpretCommand = function (text) {
        const args = text.split(" ");
        const callback = commands[args.shift()];
        if (callback) callback(...args);
    }

    window.mineBlocksApi = api;
})();