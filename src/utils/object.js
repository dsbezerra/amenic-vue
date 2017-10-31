export const get = (object, key) => {
    if (!object) {
        return undefined;
    }
    
    let result = object;
    const keys = key.split('.');
    
    let N = 0;
    while (N < keys.length) {
        result = result[keys[N++]]
    }

    return result;
}