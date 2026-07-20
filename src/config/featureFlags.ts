import { FeatureFlags } from './types';
import { DEFAULT_FEATURE_FLAGS } from './defaults';
import { EnvReader } from './env';

export function resolveFeatureFlags(): FeatureFlags {
  return {
    enableAiAssistant: EnvReader.get('NH_FLAG_AI_ASSISTANT', String(DEFAULT_FEATURE_FLAGS.enableAiAssistant)) === 'true',
    enableKnowledgeGraph: EnvReader.get('NH_FLAG_KNOWLEDGE_GRAPH', String(DEFAULT_FEATURE_FLAGS.enableKnowledgeGraph)) === 'true',
    enableOcr: EnvReader.get('NH_FLAG_OCR', String(DEFAULT_FEATURE_FLAGS.enableOcr)) === 'true',
    enableAnalytics: EnvReader.get('NH_FLAG_ANALYTICS', String(DEFAULT_FEATURE_FLAGS.enableAnalytics)) === 'true',
    enableCollaboration: EnvReader.get('NH_FLAG_COLLABORATION', String(DEFAULT_FEATURE_FLAGS.enableCollaboration)) === 'true',
    enableAuditDashboard: EnvReader.get('NH_FLAG_AUDIT_DASHBOARD', String(DEFAULT_FEATURE_FLAGS.enableAuditDashboard)) === 'true',
    enableExperimentalUi: EnvReader.get('NH_FLAG_EXPERIMENTAL_UI', String(DEFAULT_FEATURE_FLAGS.enableExperimentalUi)) === 'true',
  };
}
