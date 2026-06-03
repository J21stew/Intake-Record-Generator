# Intake Record Generator (IRG)

A JavaScript project that can turn a message from a patient, caregiver, or client into a defined record including a summary, request type, priority, and a human review status.

## Project Goal

The goal of this project was to simulate the logic behind intake systems and AI-agent workflows. Instead of only displaying records that already exist, this project focuses on generating a structured record from a message/request.

## Core Features

- Message input field
- Example messages
- Request type delegation
- Department assignment
- MID: Identifies what key informatioin points are missing
- priority classificaiton
- Human-review flag
- Safety Guidelines Message
- Unique Record ID
- Timestamp generation
- JSON output
- Record storing system
- Copy JSON button (most recent commit)

## Disclaimer

This project doesn't provide medical advice, diagnosis, treatment recommendations, fincancial advice, insurance recommendations. It only organizes administrative information for review.

## Current Status

The current version uses rule-based JavaScript logic to generate structured intake records from sample messages. Future versions may connect this generator to a dashboard, database, API, or AI-assisted workflow.