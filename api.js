const mineBlocks = {};

addHook(window, "window.Function.prototype.bind", function (object) {
    if (object && object.remainingSounds) {
        mineBlocks.Main = object;
        deleteHook(window, "window.Function.prototype.bind");
    }
});