const messageInput = document.getElementById("message-input");
const generateButton = document.getElementById("generate-button");
const recordOutput = document.getElementById("record-output");

generateButton.addEventListener("click", function() {
    const message = messageInput.value;
    const intakeRecord = {
        id: "INTAKE-001",
        source_message: message,
        summary: message,
        status: "new",
        priority: "normal",
        human_review_required: false,
    }

    recordOutput.innerHTML = `
    <h2>Message Received:</h2>
    <p>${message}</p>
    `;
});
