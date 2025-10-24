const internals = {};

const mineBlocks = {};

let isFirstGame = true;

addHook(window, "window.Function.prototype.bind", function (value) {
    if (value && value.remainingSounds) {
        internals.Instance = value;
        Object.defineProperty(internals.Instance, "game", {
            get() {
                return internals.game;
            },
            set(value) {
                internals.game = value;
                if (isFirstGame) {
                    mineBlocks.gamePrototype = internals.game.__class__.prototype;
                    listeners.firstGame();
                    isFirstGame = false;
                }
            }
        });
        return true;
    }
});

const listeners = {};

listeners.firstGame = function () {
    api.interpretCommand = function (text) {
        if (typeof text === "string") {
            internals.game.interpretCommand(text, true);
        } else {
            console.log("Invalid string:", text);
        }
    }
}

const api = {};

window.mineBlocksApi = api;