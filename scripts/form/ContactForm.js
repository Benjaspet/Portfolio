export function sendContactWebhook() {

    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/855816877447315467/9RHNVTeYzK4xYGctpPZtD6UQiLS897BzqzfWv5iNpk4uQj33Hy7Cck72Zxe7a2-NeXjT");
    request.setRequestHeader('Content-type', 'application/json');

    const params = {

        username: "Eerie's Sanctum",
        content: document.getElementById("message").value || "No content."

    }

    request.send(JSON.stringify(params));
    window.scrollTo({top: 0, behavior: 'smooth'});

    document.getElementById("alias").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

}

export function hexToDecimal(hex) {
    return parseInt(hex.replace("#",""), 16)
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    sendContactWebhook, hexToDecimal, sleep
}