const messageInput = document.getElementById("message-input");
const generateButton = document.getElementById("generate-button");
const recordOutput = document.getElementById("record-output");

generateButton.addEventListener("click", function() {
    const message = messageInput.value;
    recordOutput.innerHTML = `
    <h2>Message Received:</h2>
    <p>${message}</p>
    `;
});
