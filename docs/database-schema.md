# NeuralHandoff — Database Schema

All primary keys use UUID.

---

## users
- id (PK, UUID)
- email (unique, indexed)
- hashed_password
- full_name
- is_active (boolean)
- created_at
- updated_at

---

## organizations
- id (PK, UUID)
- name
- created_at
- updated_at

---

## memberships
- id (PK, UUID)
- user_id (FK → users.id, indexed)
- organization_id (FK → organizations.id, indexed)
- role_id (FK → roles.id)
- created_at

Unique Constraint:
(user_id, organization_id)

---

## roles
- id (PK, UUID)
- name
- organization_id (FK)
- is_system_role (boolean)

---

## permissions
- id (PK, UUID)
- name (unique)

---

## role_permissions
- role_id (FK → roles.id)
- permission_id (FK → permissions.id)

Composite PK:
(role_id, permission_id)

---

## documents
- id (PK, UUID)
- organization_id (FK, indexed)
- uploaded_by (FK → users.id)
- filename
- file_type
- file_size
- storage_path
- created_at

---

## document_chunks
- id (PK, UUID)
- document_id (FK → documents.id)
- organization_id (indexed)
- content
- embedding (vector)
- chunk_index

---

## chats
- id (PK, UUID)
- organization_id (indexed)
- user_id (FK → users.id)
- title
- created_at

---

## messages
- id (PK, UUID)
- chat_id (FK → chats.id)
- role (enum: user | assistant | system)
- content
- created_at

---

## analytics_events
- id (PK, UUID)
- organization_id (indexed)
- user_id (FK)
- event_type
- metadata (JSONB)
- created_at