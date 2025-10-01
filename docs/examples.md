# Example Workflows

This document contains example workflows to help you get started with Flowtastic.

## Example 1: Simple API Workflow

This workflow demonstrates a basic API call with conditional logic.

### Visual Description

1. Trigger: Webhook
2. Action: Call external API
3. Condition: Check if API response is successful
4. Then: Send success email
5. Else: Log error
6. End: Complete workflow

### YAML Output

```yaml
name: Simple API Workflow
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: webhook
steps:
  - type: workflow_action
    actionType: api_call
    name: fetch_user_data
    parameters:
      url: https://api.example.com/users
      method: GET
  - type: workflow_condition
    condition:
      type: workflow_simple_condition
      variable: response.status
      operator: eq
      value: "200"
    then:
      - type: workflow_action
        actionType: email
        name: send_success_notification
        parameters:
          to: admin@example.com
          subject: API Call Successful
    else:
      - type: workflow_action
        actionType: function
        name: log_error
        parameters:
          level: error
          message: API call failed
  - type: workflow_end
    status: success
```

## Example 2: Scheduled Data Processing

This workflow runs on a schedule to process data.

### Visual Description

1. Trigger: Schedule (daily at midnight)
2. Action: Fetch data from database
3. Action: Process data
4. Action: Store results
5. End: Complete workflow

### YAML Output

```yaml
name: Daily Data Processing
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: schedule
  config:
    cron: "0 0 * * *"
steps:
  - type: workflow_action
    actionType: database
    name: fetch_daily_records
    parameters:
      query: SELECT * FROM records WHERE date = CURRENT_DATE
  - type: workflow_action
    actionType: function
    name: process_records
    parameters:
      function: calculateMetrics
  - type: workflow_action
    actionType: database
    name: store_metrics
    parameters:
      table: daily_metrics
      operation: insert
  - type: workflow_end
    status: success
```

## Example 3: Multi-Branch Workflow

This workflow demonstrates multiple conditional branches.

### Visual Description

1. Trigger: Manual
2. Action: Validate input data
3. Condition: Check data type
   - If type = A: Process as type A
   - If type = B: Process as type B
   - Else: Handle unknown type
4. End: Complete workflow

### YAML Output

```yaml
name: Multi-Branch Data Processor
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: manual
steps:
  - type: workflow_action
    actionType: function
    name: validate_input
    parameters:
      validator: dataTypeValidator
  - type: workflow_condition
    condition:
      type: workflow_simple_condition
      variable: data.type
      operator: eq
      value: "A"
    then:
      - type: workflow_action
        actionType: function
        name: process_type_a
        parameters:
          handler: typeAProcessor
    else:
      - type: workflow_condition
        condition:
          type: workflow_simple_condition
          variable: data.type
          operator: eq
          value: "B"
        then:
          - type: workflow_action
            actionType: function
            name: process_type_b
            parameters:
              handler: typeBProcessor
        else:
          - type: workflow_action
            actionType: function
            name: handle_unknown_type
            parameters:
              handler: unknownTypeHandler
  - type: workflow_end
    status: success
```

## Example 4: Event-Driven Notification

This workflow responds to system events and sends notifications.

### Visual Description

1. Trigger: Event (user registration)
2. Action: Create user profile
3. Action: Send welcome email
4. Action: Add to mailing list
5. Condition: Check if premium user
   - If premium: Grant premium features
6. End: Complete workflow

### YAML Output

```yaml
name: User Registration Handler
version: 1.0.0
trigger:
  type: workflow_trigger
  triggerType: event
  config:
    event: user.registered
steps:
  - type: workflow_action
    actionType: database
    name: create_user_profile
    parameters:
      table: user_profiles
      operation: insert
  - type: workflow_action
    actionType: email
    name: send_welcome_email
    parameters:
      template: welcome_email
      to: "{{user.email}}"
  - type: workflow_action
    actionType: api_call
    name: add_to_mailing_list
    parameters:
      url: https://api.mailchimp.com/3.0/lists
      method: POST
  - type: workflow_condition
    condition:
      type: workflow_simple_condition
      variable: user.subscription
      operator: eq
      value: premium
    then:
      - type: workflow_action
        actionType: function
        name: grant_premium_features
        parameters:
          features:
            - advanced_analytics
            - priority_support
    else: []
  - type: workflow_end
    status: success
```

## Tips for Building Workflows

1. **Start with a Trigger**: Every workflow must begin with a trigger block
2. **Use Descriptive Names**: Give your action blocks meaningful names
3. **Test Incrementally**: Build and test your workflow step by step
4. **Use Parameters**: Leverage parameter blocks for dynamic values
5. **Handle Errors**: Always include error handling with conditions
6. **End Properly**: Ensure your workflow has a proper end block
7. **Export Regularly**: Save your work frequently using the Save button
8. **Document**: Use the Notes feature (coming soon) to document complex logic

## Common Patterns

### Error Handling Pattern

```
Action → Condition (check for errors) → Then (handle error) → Else (continue)
```

### Retry Pattern

```
Action → Condition (check success) → Else (retry with delay) → Then (continue)
```

### Parallel Execution Pattern

```
Trigger → Multiple Actions (independent) → Join → End
```

### Chain of Actions Pattern

```
Trigger → Action 1 → Action 2 → Action 3 → End
```

## Next Steps

- Explore the block types in the toolbox
- Experiment with different combinations
- Export your workflows and examine the YAML/JSON structure
- Share your workflows with the community

For more information, visit the [main documentation](../README.md).
