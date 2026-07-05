# NeuralHandoff — API Contract

Base URL:
`/api/v1`

All protected routes require:
Authorization: Bearer <JWT>

---

## Auth

POST /auth/register  
POST /auth/login  
POST /auth/refresh  
GET  /auth/me  

Status Codes:
200 OK
201 Created
400 Bad Request
401 Unauthorized

---

## Organizations

POST   /organizations  
GET    /organizations  
GET    /organizations/{id}  
PATCH  /organizations/{id}  
DELETE /organizations/{id}  

---

## Members

GET    /organizations/{id}/members  
POST   /organizations/{id}/invite  
PATCH  /memberships/{id}  
DELETE /memberships/{id}  

---

## Documents

POST   /documents/upload  
GET    /documents  
GET    /documents/{id}  
DELETE /documents/{id}  

---

## Chat

POST   /chat  
POST   /chat/{id}/message  
GET    /chat  
DELETE /chat/{id}  

---

## Analytics

GET /analytics/overview  
GET /analytics/usage  