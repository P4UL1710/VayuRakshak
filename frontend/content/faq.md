---
{"title":"Architecture and project FAQ","slug":"faq","route":"/architecture","section":"aws-architecture","tags":["aws","architecture","backend","bedrock","deploy","faq","approach"],"lastUpdated":"2026-10-08","sourceType":"curated"}
---
# Architecture and project FAQ
The deployable project uses Next.js 16 and React 19 with TypeScript and Tailwind, an independent Node API, and npm workspaces. Default data providers and all consequential actions are mocks. The backend has air, weather, forecast, fire, route, calendar, messaging, device and wearable adapter contracts.

AWS design: Amplify or CloudFront hosts the frontend; API Gateway invokes Lambda; DynamoDB stores preferences, plans, policies, approvals and audit records. Step Functions validates user consent before EventBridge Scheduler schedules a device webhook. Telegram or SNS adapters deliver approved notifications. CloudWatch captures workflow logs. Amazon Bedrock is an optional future grounded explanation provider. The current diagram is a target deployment architecture, not provisioned cloud resources. Docker and separate frontend/backend deployment are supported.
