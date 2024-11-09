// utils/id.js

function generateId() {
    return crypto.randomUUID().slice(0, 8);
}

export { generateId };
