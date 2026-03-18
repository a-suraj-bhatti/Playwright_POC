#!/bin/bash

# Ensure standard tools are in PATH
export PATH="/usr/bin:/bin:/usr/local/bin:$PATH"

# Fetch a Jira story and its linked test work items (description field)
# Usage: ./fetch_jira_data.sh <JIRA_ID>

if [ -z "$1" ]; then
  echo "Usage: $0 <JIRA_ID>"
  exit 1
fi

JIRA_ID="$1"
BASE_URL="https://my-test-playwright.atlassian.net"

if [ -z "$JIRA_PERSONAL_ACCESS_TOKEN" ] && [ -z "$JIRA_API_TOKEN" ]; then
  echo "Error: JIRA_PERSONAL_ACCESS_TOKEN or JIRA_API_TOKEN environment variable is not set."
  exit 1
fi

TOKEN="${JIRA_PERSONAL_ACCESS_TOKEN:-$JIRA_API_TOKEN}"

# Build auth header
if [ -n "$JIRA_EMAIL" ]; then
  # Use openssl for base64 as a more reliable tool on some macs, fallback to base64
  if command -v openssl >/dev/null 2>&1; then
    B64_AUTH=$(printf '%s' "${JIRA_EMAIL}:${TOKEN}" | openssl base64 | tr -d '\n')
  else
    B64_AUTH=$(printf '%s' "${JIRA_EMAIL}:${TOKEN}" | base64 | tr -d '\n')
  fi
  AUTH_HEADER="Basic ${B64_AUTH}"
else
  AUTH_HEADER="Bearer ${TOKEN}"
fi

# Function to parse JSON if python3 is available and license is agreed, else echo raw
parse_json() {
  local json="$1"
  local script="$2"
  # Check if python3 works (and doesn't catch on Xcode license)
  if command -v python3 >/dev/null 2>&1 && python3 -c "import sys" >/dev/null 2>&1; then
    python3 -c "$script" <<< "$json"
  else
    echo "--- RAW JSON (python3 unavailable/blocked) ---"
    echo "$json"
  fi
}

echo "======================================================"
echo " Fetching Jira Story: $JIRA_ID"
echo "======================================================"

ISSUE_RESPONSE=$(curl -s -X GET \
  -H "Authorization: $AUTH_HEADER" \
  -H "Accept: application/json" \
  "$BASE_URL/rest/api/2/issue/$JIRA_ID")

if echo "$ISSUE_RESPONSE" | grep -q '"errorMessages"'; then
  echo "Error: Failed to fetch issue $JIRA_ID"
  echo "$ISSUE_RESPONSE" | grep -o '"errorMessages":\[[^]]*\]'
  exit 1
fi

echo "--- Story Data ---"
story_script='
import sys, json
try:
    data = json.load(sys.stdin)
    fields = data.get("fields", {})
    print("ID:     ", data.get("key"))
    print("Type:   ", fields.get("issuetype", {}).get("name"))
    print("Status: ", fields.get("status", {}).get("name"))
    print("Summary:", fields.get("summary"))
    desc = fields.get("description") or "(no description)"
    print("\nDescription:\n" + str(desc))
except Exception as e:
    print("Error parsing JSON")
'
parse_json "$ISSUE_RESPONSE" "$story_script"

echo ""
echo "======================================================"
echo " Fetching linked test work items for $JIRA_ID"
echo "======================================================"

JQL="issue in linkedIssues(\"$JIRA_ID\") AND issuetype = \"QAlity Test\""

# Robust payload generation for fallback
if command -v python3 >/dev/null 2>&1 && python3 -c "import sys" >/dev/null 2>&1; then
  PAYLOAD=$(python3 -c "import sys, json; print(json.dumps({'jql': sys.argv[1], 'maxResults': 50, 'fields': ['summary', 'description', 'status', 'issuetype']}))" "$JQL")
else
  # Manual escape for shell-friendly JSON
  ESCAPED_JQL=$(echo "$JQL" | sed 's/"/\\"/g' | sed "s/'/\\'/g")
  PAYLOAD="{\"jql\": \"$ESCAPED_JQL\", \"maxResults\": 50, \"fields\": [\"summary\", \"description\", \"status\", \"issuetype\"]}"
fi

SEARCH_RESPONSE=$(curl -s -X POST \
  -H "Authorization: $AUTH_HEADER" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$BASE_URL/rest/api/3/search/jql")

if echo "$SEARCH_RESPONSE" | grep -q '"errorMessages"'; then
  echo "Error: Failed to search for linked test work items."
  echo "$SEARCH_RESPONSE" | grep -o '"errorMessages":\[[^]]*\]'
  exit 1
fi

search_script='
import sys, json
try:
    data = json.load(sys.stdin)
    issues = data.get("issues", [])
    if not issues:
        print("No linked test work items found.")
    else:
        for i, issue in enumerate(issues, 1):
            fields = issue.get("fields", {})
            print(f"\n--- Test Work Item {i} ---")
            print("ID:     ", issue.get("key"))
            print("Summary:", fields.get("summary"))
            print("Status: ", fields.get("status", {}).get("name"))
            desc = fields.get("description") or "(no description)"
            print("Description:\n" + str(desc))
except Exception as e:
    print("Error parsing JSON")
'
parse_json "$SEARCH_RESPONSE" "$search_script"
