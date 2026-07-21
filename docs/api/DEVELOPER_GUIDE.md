# Core API Developer Execution Guide

## Query Hook Patterns

```typescript
import { useQuery } from '@/shared/api';
import { ENDPOINT_REGISTRY } from '@/shared/api';

export function ProjectListView() {
  const { data: projects, loading, error, execute } = useQuery<Project[]>(
    ENDPOINT_REGISTRY.projects.base
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {projects?.map(p => <div key={p.id}>{p.name}</div>)}
      <button onClick={() => execute()}>Reload</button>
    </div>
  );
}
import { useMutation } from '@/shared/api';
import { ENDPOINT_REGISTRY } from '@/shared/api';

export function CreateProjectButton() {
  const { mutate, loading } = useMutation('POST', ENDPOINT_REGISTRY.projects.base);

  const handleCreate = async () => {
    try {
      await mutate({ name: 'New Microservice Migration' });
      alert('Project Registered!');
    } catch (err) {
      console.error('Save Action Rejected', err);
    }
  };

  return <button onClick={handleCreate} disabled={loading}>Create Project</button>;
}