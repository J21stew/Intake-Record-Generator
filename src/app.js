const messageInput = document.getElementById("message-input");
const generateButton = document.getElementById("generate-button");
const recordDisplay = document.getElementById("record-display");
const exampleMessage = document.querySelectorAll(".example-message");

function detectRequestTypes(message) {
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
    if (lowermessage.includes("record") || lowermessage.includes("medical history") || lowermessage.includes("lab results") || lowermessage.includes("records")) {
        RequestTypes.push("records");
    }
    if (RequestTypes.length === 0) {
        RequestTypes.push("general_question");
    }
    return RequestTypes;
}
function detectRoute(RequestTypes) {
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
    const lowerMessage = message.toLowerCase();
    const missingInfo = [];
    // This is a simple check for the presence of an "@" symbol, which is common in email addresses.
    // This is not a comprehensive email validation, but it serves as a basic indicator for missing email information.
    const hasEmail = message.includes("@");

    // Regex means "pattern detector."
    // This checks for phone numbers like:
    // 414-555-1234, 414.555.1234, 414 555 1234, or 4145551234.
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(message);

    const hasAppointmentDate =
        lowerMessage.includes("next") ||
        lowerMessage.includes("tomorrow") ||
        lowerMessage.includes("monday") ||
        lowerMessage.includes("tuesday") ||
        lowerMessage.includes("wednesday") ||
        lowerMessage.includes("thursday") ||
        lowerMessage.includes("friday") ||
        lowerMessage.includes("saturday") ||
        lowerMessage.includes("sunday") ||
        lowerMessage.includes("january") ||
        lowerMessage.includes("february") ||
        lowerMessage.includes("march") ||
        lowerMessage.includes("april") ||
        lowerMessage.includes("may") ||
        lowerMessage.includes("june") ||
        lowerMessage.includes("july") ||
        lowerMessage.includes("august") ||
        lowerMessage.includes("september") ||
        lowerMessage.includes("october") ||
        lowerMessage.includes("november") ||
        lowerMessage.includes("december");
    
    const hasBirthClue =
        lowerMessage.includes("dob") ||
        lowerMessage.includes("date of birth") ||
        lowerMessage.includes("birth date") ||
        lowerMessage.includes("born");
    
    // This is not name detection.
    // This is name-introduction phrase detection.
    const possibleName = 
        lowerMessage.includes("name") ||
        lowerMessage.includes("i'm") ||
        lowerMessage.includes("i am") ||
        lowerMessage.includes("this is"); 

    if (!possibleName) {
        missingInfo.push("full_name")
    }
    if (!hasPhone) {
        missingInfo.push("phone_number");
    }

    if (!hasEmail) {
        missingInfo.push("email_address");
    }
    if (!hasBirthClue) {
        missingInfo.push("date_of_birth");
    }

    if (requestTypes.includes("appointment") && !hasAppointmentDate) {
        missingInfo.push("preferred_appointment_date");
    }

    if (
        requestTypes.includes("insurance") &&
        !lowerMessage.includes("aetna") &&
        !lowerMessage.includes("blue cross") &&
        !lowerMessage.includes("united healthcare") &&
        !lowerMessage.includes("cigna")
    ) {
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
        return "User needs help with an appointment and insurance information";
    }
    if (requestTypes.includes("appointment")) {
        return "User needs help with an appointment";
    }
    if (requestTypes.includes("insurance")) {
        return "User needs help with insurance information";
    }
    if (requestTypes.includes("billing")) {
    return "User has a billing or invoice question";
    }
    if (requestTypes.includes("prescription")) {
        return "User needs help with a prescription or medication-related request";
    }
    if (requestTypes.includes("records")) {
        return "User needs help with records information";
    }
        return "User needs help with a general inquiry";
}
function generateRecordId() {
    return "INTAKE-" + Date.now();
}
exampleMessage.forEach(function(button) {
    button.addEventListener("click", function() {
        const exampleMessage = button.dataset.message;
        messageInput.value = exampleMessage;
    });
})

function generateIntakeRecord(message) {
    const requestTypes = detectRequestTypes(message);
    const Route = detectRoute(requestTypes);
    const missingInfo = detectMissingInformation(message, requestTypes);
    const priority = detectPriority(message, requestTypes);
    const humanReviewRequired = detectHumanReview(message, requestTypes, priority);
    const summary = generateSummary(requestTypes);
    const createdAt = new Date().toISOString();

    const intakeRecord = {
        id: generateRecordId(),
        status: "new",
        priority: priority, 
        summary: summary,
        request_types: requestTypes,
        routes: Route,
        source_message: message,
        missing_information: missingInfo,
        human_review_required: humanReviewRequired,
        safety_boundary: "Administrative support only. No medical, diagnosis, treatment, financial, or insurance advice provided.",
        created_at: createdAt
    };
    return intakeRecord;
}
// record-output = the container
// record-display = the ticket area inside the container
generateButton.addEventListener("click", function() {
    const message = messageInput.value;
    if (message.trim() === "") {
        // User-facing output should use textContent unless we intentionally need HTML.
        recordDisplay.textContent = "Please enter a message before generating a record.";
        return;
    }
    const intakeRecord = generateIntakeRecord(message);

    recordDisplay.textContent = `
    Message Received:
    Priority: ${intakeRecord.priority}
    Summary: ${intakeRecord.summary}
    Request Types: ${intakeRecord.request_types.join(", ")}
    Route To: ${intakeRecord.routes.join(", ")}
    Missing Information: ${intakeRecord.missing_information.join(", ")}
    Human Review Required: ${intakeRecord.human_review_required ? "Yes" : "No"}
    Safety Boundary: ${intakeRecord.safety_boundary}
    Created At: ${intakeRecord.created_at}
    Structured JSON:
    recordDisplay.textContent = ${JSON.stringify(intakeRecord, null, 2)}
    `;
});
