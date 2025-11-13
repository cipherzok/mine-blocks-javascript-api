const originalMethods = {};

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
        const data = {
            cancel: false,
            finish: false,
            args: args
        }
        callback(data);
        if (data.finish) {
            reference.target[reference.method] = originalMethods[name];
            delete originalMethods[name];
        }
        if (!data.cancel) return original.apply(this, data.args);
    }
}

const internals = {};

addHook(window, "window.Function.prototype.bind", function (data) {
    const Instance = data.args[0];
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
        data.finish = true;
    }
});

const identifierToId = {};
const idToIdentifier = {};

addHook(window, "window.Object.keys", function (data) {
    const blockData = data.args[0];
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
        data.finish = true;
    }
});

const api = {};

const listeners = {};

let isFirstGame = true;

function isIntegerBetween(min, max, data) {
    return Number.isInteger(data) && min <= data && max >= data;
}

listeners.newGame = function () {
    internals.console = internals.game.console.__class__;
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
        api.print = function (text) {
            if (typeof text === "string") {
                internals.console.newLine(text);
            }
        }
        addHook(internals, "internals.game.__proto__.interpretCommand", listeners.interpretCommand);
        internals.game.interpretCommand = internals.game.__proto__.interpretCommand;
        isFirstGame = false;
        const event = new CustomEvent("firstGame");
        dispatchEvent(event);
    }
}

const commands = {};

listeners.interpretCommand = function (data) {
    const parts = data.args[0].split(" ");
    const callback = commands[parts.shift()];
    if (callback) {
        callback(...parts);
        data.cancel = true;
    }
}

window.mineBlocksApi = api;