---
name: fetch_jira_story
description: Fetches a Jira user story and any linked "QAlity Test" work items (including their description) based on a given Jira Issue ID.
---

# Fetch Jira Story & Linked Test Work Items

This skill fetches the details of a Jira story and retrieves the descriptions of any linked work items of type "QAlity Test" to provide full context for test automation.

## Environment Variables Required

| Variable | Description |
|---|---|
| `JIRA_API_TOKEN` or `JIRA_PERSONAL_ACCESS_TOKEN` | Your Jira API Token or Personal Access Token |
| `JIRA_EMAIL` | (Jira Cloud only) Your Jira account email, used for Basic Auth alongside the API token |

## Usage

```bash
./scripts/fetch_jira_data.sh <JIRA_ID>
```

**Example:**
```bash
./scripts/fetch_jira_data.sh SCRUM-5
```

## Output & Contextual Ingestion

The script outputs structured text containing the Jira data. 

**For the Agent:**
- The `JIRA_EMAIL` and 
- You MUST ingest the output of this script as ground-truth context for the user's requirements.
- Use the **Acceptance Criteria** from the story and the **Description** from the linked test items to inform code generation, test script creation, or documentation.
- Do not make assumptions about the requirements if they are provided in the script output.
