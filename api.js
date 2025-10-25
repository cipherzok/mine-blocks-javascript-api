const internals = {};

addHook(window, "window.Function.prototype.bind", function (Instance) {
    if (Instance && Instance.remainingSounds) {
        const Main = Instance.__class__;
        Main.Instance = new Proxy(Main.Instance, {
            set(target, property, value) {
                if (property === "game") {
                    internals.game = value;
                    listeners.newGame();
                }
                target[property] = value;
                return true;
            }
        });
        internals.Main = Main;
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
        isFirstGame = false;
    }
}

window.mineBlocksApi = api;