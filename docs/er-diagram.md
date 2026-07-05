# NeuralHandoff — ER Diagram (Text Version)

User (1) —— (N) Membership —— (1) Organization  
Membership (N) —— (1) Role  

Role (N) —— (N) Permission (via role_permissions)

Organization (1) —— (N) Document  
Document (1) —— (N) DocumentChunk  

User (1) —— (N) Chat  
Chat (1) —— (N) Message  

Organization (1) —— (N) AnalyticsEvent  

---

Tenant Rule:
Every major entity except Permission includes organization_id.