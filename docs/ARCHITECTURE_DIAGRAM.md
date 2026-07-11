# Architecture Dependency Diagram

\\\mermaid
graph TD
    A[Features] --> B[Shared]
    A --> C[Providers]
    B --> D[Config]
    C --> D
    subgraph Global
        B
        C
        D
    end
    subgraph Domains
        A
    end
\\\ 
This diagram shows that domain-specific Features can depend on global Shared modules and Providers, but not the other way around.
