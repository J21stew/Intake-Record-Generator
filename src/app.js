const messageInput = document.getElementById("message-input");
const generateButton = document.getElementById("generate-button");
const recordOutput = document.getElementById("record-output");

function dectectRequestTypes(message) {
    const lowermessage = message.toLowerCase();
    const RequestTypes = [];

    if (lowermessage.includes("appointment")) {
        RequestTypes.push("appointment");
    }
    if (lowermessage.includes("insurance")) {
        RequestTypes.push("insurance");
    }
    if (lowermessage.includes("bill") || lowermessage.includes("invoice")) {
        RequestTypes.push("billing");
    }
    if (lowermessage.includes("prescription") || lowermessage.includes("medication") || lowermessage.includes("refill")) {
        RequestTypes.push("prescription");
    }
    if (lowermessage.includes("records")) {
        RequestTypes.push("records");
    }
    if (RequestTypes.length === 0) {
        RequestTypes.push("general_question");
    }
    return RequestTypes;
}
function dectectRoute(RequestTypes) {
    const Route = RequestTypes;

    if (RequestTypes.includes("appointment")) {
        Route.push("scheduling_desk");
    }
    if (RequestTypes.includes("insurance")) {
        Route.push("insurance_desk");
    }
    if (RequestTypes.includes("billing")) {
        Route.push("billing_desk");
    }
    if (RequestTypes.includes("prescription")) {
        Route.push("clinical_staff_review");
    }
    if (RequestTypes.includes("records")) {
        Route.push("records_desk");
    }
    if (RequestTypes.includes("general_question")) {
        Route.push("patient_services");
    }
    return Route;
}
generateButton.addEventListener("click", function() {
    const message = messageInput.value;
    const requestTypes = dectectRequestTypes(message);
    const Route = dectectRoute(requestTypes);
  
    console.log("Button clicked:", message);
    const intakeRecord = {
        id: "INTAKE-001",
        status: "new",
        priority: "normal", 
        summary: message,
        request_types: requestTypes,
        routes: Route,
        source_message: message,
        human_review_required: false
    };

    recordOutput.innerHTML = `
    <h2>Message Received:</h2>
    <p>${message}</p>
    <p>Request Types: ${intakeRecord.request_types.join(", ")}</p>
    <p>Routes: ${intakeRecord.routes.join(", ")}</p>
    `;
});
