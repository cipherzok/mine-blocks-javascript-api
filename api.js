const mineBlocks = {};

addHook(window, "window.Function.prototype.bind", function (value) {
    if (value && value.remainingSounds) {
        mineBlocks.Instance = value;
        Object.defineProperty(mineBlocks.Instance, "game", {
            get() {
                return mineBlocks.game;
            },
            set(value) {
                mineBlocks.game = value;
                console.log("[API] Game was created", mineBlocks.game);
                api.player = player;
            }
        });
        deleteHook(window, "window.Function.prototype.bind");
    }
});

function isIntegerBetween(min, max, data) {
    return Number.isInteger(data) && min <= data && max >= data;
}

const player = {
    set health(value) {
        if (isIntegerBetween(0, 20, value)) {
            mineBlocks.game.world.health = value
        } else {
            console.log("Player's health must be an whole number between 0 and 20: ", value)
        }
    },
    get health() {
        return mineBlocks.game.world.health;
    }
}

const api = {}

window.api = api;