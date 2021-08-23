function sendContactWebhook() {

    if (!document.getElementById("alias").value) {
        return alert("You did not include your username.");
    }

    if (!document.getElementById("email").value) {
        return alert("Please include your email address.");
    }

    if (!document.getElementById("message").value) {
        return alert("You must include a message.");
    }

    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/855816877447315467/9RHNVTeYzK4xYGctpPZtD6UQiLS897BzqzfWv5iNpk4uQj33Hy7Cck72Zxe7a2-NeXjT");
    request.setRequestHeader('Content-type', 'application/json');

    const embed = {

        author: {
            name: `Sender: ${document.getElementById("alias").value}`,
        },
        title: "New message!",
        description: document.getElementById("message").value || "No content.",
        footer: {
            text: `Email: ${document.getElementById("email").value} | Discord: ${document.getElementById("discord").value || "not specified"}`
        },
        color: hexToDecimal("#51c0f0")

    }

    const params = {

        username: "Eerie's Sanctum",
        content: "",
        embeds: [embed]

    }

    request.send(JSON.stringify(params));
    window.scrollTo({top: 0, behavior: 'smooth'});

    document.getElementById("alias").value = "";
    document.getElementById("email").value = "";
    document.getElementById("discord").value = "";
    document.getElementById("message").value = "";

}

function hexToDecimal(hex) {
    return parseInt(hex.replace("#",""), 16)
}