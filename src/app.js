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
    const Route = [];

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
function detectMissingInformation(message, requestTypes) {
    const lowermessage = message.toLowerCase();
    const missingInfo = [];

    if (!lowermessage.includes("name")) {
        missingInfo.push("full_name");
    }
    if (!lowermessage.includes("phone")) {
        missingInfo.push("phone_number");
    }
    if (!lowermessage.includes("email")) {
        missingInfo.push("email address");
    }
    if (!lowermessage.includes("date_of_birth") && !lowermessage.includes("dob")) {
        missingInfo.push("date_of_birth");
    }
    if (requestTypes.includes("appointment") && lowermessage.includes("preferred_date")) {
        missingInfo.push("preferred_appointment_date");
    }
    if (requestTypes.includes("insurance") && lowermessage.includes("insurance_provider")) {
        missingInfo.push("insurance_provider");
        missingInfo.push("member_id");
    }
    return missingInfo;
}
function detectPriority(message, requestTypes) {
    const lowermessage = message.toLowerCase();

    if (
        lowermessage.includes("emergency") ||
        lowermessage.includes("urgent") ||
        lowermessage.includes("asap") ||
        lowermessage.includes("immediately") ||
        lowermessage.includes("critical") ||
        lowermessage.includes("life-threatening") ||
        lowermessage.includes("dying")
    ) {
        return "urgent";
    }
    
    if ( 
        requestTypes.includes("prescription") ||
        lowermessage.includes("as soon as possible") ||
        lowermessage.includes("soon") ||
        lowermessage.includes("quickly") ||
        lowermessage.includes("time-sensitive") ||
        lowermessage.includes("need it today") 
    ) {
        return "time sensitive";
    }

    return "normal";
}
function detectHumanReview(message, requestTypes, priority) {
    // Implementation for detecting human review requirement
    const lowermessage = message.toLowerCase();

    if (priority === "urgent") {
        return true;
    }
    if (requestTypes.includes("prescription")) {
        return true;
    }
    if (
        lowermessage.includes("diagnose") ||
        lowermessage.includes("what should i take") ||
        lowermessage.includes("medical advice")
    ) {
        return true;
    }
    return false;
}
function generateSummary(requestTypes) {
    if (requestTypes.includes("appointment") && requestTypes.includes("insurance")) {
        return "User needs help with an appoinment and insurance information";
    }
    if (requestTypes.includes("appointment")) {
        return "User needs help with an appointment";
    }
    if (requestTypes.includes("insurance")) {
        return "User needs help with insurance information";
    }
    return "User needs help with a general inquiry";
}
generateButton.addEventListener("click", function() {
    const message = messageInput.value;
    const requestTypes = dectectRequestTypes(message);
    const Route = dectectRoute(requestTypes);
    const missingInfo = detectMissingInformation(message, requestTypes);
    const priority = detectPriority(message, requestTypes);
    const humanReviewRequired = detectHumanReview(message, requestTypes, priority);
    const summary = generateSummary(requestTypes);
    console.log("Button clicked:", message);
    const intakeRecord = {
        id: "INTAKE-001",
        status: "new",
        priority: priority, 
        summary: summary,
        request_types: requestTypes,
        routes: Route,
        source_message: message,
        missing_information: missingInfo,
        human_review_required: humanReviewRequired
    };

    recordOutput.innerHTML = `
    <h2>Message Received:</h2>
    <p>Priority: ${intakeRecord.priority}</p>
    <p>Summary: ${intakeRecord.summary}</p>
    <p>Request Types: ${intakeRecord.request_types.join(", ")}</p>
    <p>Route To: ${intakeRecord.routes.join(", ")}</p>
    <p>Missing Information: ${intakeRecord.missing_information.join(", ")}</p>
    <p>${message}</p>
    <p>Human Review Required: ${intakeRecord.human_review_required ? "Yes" : "No"}</p>
    `;
});
