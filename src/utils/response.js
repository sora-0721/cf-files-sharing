// utils/response.js

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function htmlResponse(content, status = 200) {
    return new Response(content, {
        status,
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

function errorResponse(message, status = 400) {
    return new Response(message, {
        status,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

export { jsonResponse, htmlResponse, errorResponse };
