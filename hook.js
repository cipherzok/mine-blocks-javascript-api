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
        if (callback(...args)) {
            reference.target[reference.method] = originalMethods[name];
            delete originalMethods[name];
        }
        return original.apply(this, args);
    }
}