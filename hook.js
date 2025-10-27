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

addHook(window, "window.Object.keys", function (blockData) {
    if (blockData.ObsidianPickaxe) {
        internals.blockData = blockData;
        console.log("blockData hooked");
        return true;
    }
});