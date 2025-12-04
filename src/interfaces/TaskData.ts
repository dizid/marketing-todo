/**
 * TaskData Type Definitions
 *
 * Comprehensive TypeScript interfaces for all task-related data structures.
 * Used throughout the application for type safety and IDE autocompletion.
 *
 * @file src/interfaces/TaskData.ts
 * @since 2025-12-04
 */

/**
 * Individual form field value
 */
export type FormFieldValue = string | number | boolean | string[] | null | undefined;

/**
 * Form data object containing all field values
 * Dynamic object where keys are field IDs and values are field values
 */
export interface FormData {
  [fieldId: string]: FormFieldValue;
}

/**
 * AI-generated output
 * Can be a single string or null if not generated yet
 */
export type AIOutput = string | null;

/**
 * Single saved item from a task (e.g., a generated post, email template, etc.)
 */
export interface SavedItem {
  id: string | number;
  title?: string;
  content?: string;
  createdAt?: string;
  [key: string]: any; // Allow task-specific fields
}

/**
 * Array of saved items
 */
export type SavedItems = SavedItem[];

/**
 * Complete task data structure
 * This is what gets saved to the database for each task
 */
export interface TaskData {
  /** Form field values filled by user */
  formData: FormData;

  /** AI-generated content (if applicable to task) */
  aiOutput: AIOutput;

  /** Items saved by user from AI output or manual entry */
  savedItems: SavedItems;
}

/**
 * Task with ID (for database storage)
 */
export interface TaskDataWithId extends TaskData {
  taskId: string;
}

/**
 * Field mapping between task fields and canonical/global fields
 * Used for field inheritance from project settings
 */
export interface FieldMapping {
  /** MiniApp field ID (from form) */
  miniAppFieldId: string;

  /** Canonical field name (from projectData.settings) */
  canonicalFieldName: string;

  /** Whether this is an inherited field (for display) */
  isInherited?: boolean;

  /** Current override value (if user overrode inherited value) */
  overrideValue?: FormFieldValue;
}

/**
 * Task-level field mappings configuration
 */
export interface TaskFieldMappings {
  [miniAppFieldId: string]: string; // miniAppFieldId -> canonicalFieldName
}

/**
 * Form field definition from task config
 */
export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'email' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  value?: FormFieldValue;
  options?: Array<{ label: string; value: any }>;
  globalFieldName?: string; // Link to canonical field
  help?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  [key: string]: any;
}

/**
 * Task configuration (from task config files)
 */
export interface TaskConfig {
  id: string;
  title: string;
  description: string;
  miniApp: string; // Name of MiniApp component to render
  formFields?: FormFieldConfig[];
  fieldMappings?: TaskFieldMappings;
  aiConfig?: {
    prompt: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Inheritance metadata for a single field
 * Tracks which fields are inherited vs overridden
 */
export interface FieldInheritanceInfo {
  fieldId: string;
  canonicalFieldName?: string;
  isInherited: boolean;
  isOverridden: boolean;
  inheritedValue?: FormFieldValue;
  overrideValue?: FormFieldValue;
  currentValue: FormFieldValue; // Either override or inherited
  source: 'inherited' | 'override' | 'local' | 'default';
}

/**
 * Complete inheritance metadata for a task
 */
export interface TaskInheritanceMetadata {
  [fieldId: string]: FieldInheritanceInfo;
}

/**
 * Field override (user's custom value for inherited field)
 */
export interface FieldOverride {
  taskId: string;
  fieldId: string;
  value: FormFieldValue;
  createdAt: string;
  updatedAt: string;
}

/**
 * Collection of field overrides for a task
 */
export type FieldOverrides = FieldOverride[];

/**
 * Save event payload emitted by MiniApps
 * This is what gets passed up through @save events
 */
export interface SaveEventPayload {
  formData: FormData;
  aiOutput?: AIOutput;
  savedItems?: SavedItems;
}

/**
 * Save request to API
 * Complete data needed for database persistence
 */
export interface SaveRequest {
  projectId: string;
  taskId: string;
  data: TaskData;
  version?: number; // For conflict detection
}

/**
 * Save response from API
 */
export interface SaveResponse {
  success: boolean;
  data?: TaskData;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  version?: number; // Updated version after save
}

/**
 * Validation error for form field
 */
export interface ValidationError {
  fieldId: string;
  message: string;
  type: 'required' | 'format' | 'custom' | 'custom';
}

/**
 * Validation result for entire form
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: Array<{ fieldId: string; message: string }>;
}

/**
 * Props for MiniAppShell component
 */
export interface MiniAppShellProps {
  taskId: string;
  taskConfig: TaskConfig;
  taskData: TaskData;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

/**
 * Props for individual MiniApp components
 */
export interface MiniAppProps {
  taskConfig: TaskConfig;
  taskData: TaskData;
  onSave?: (data: SaveEventPayload) => void;
  onError?: (error: Error) => void;
}

/**
 * Save state tracking for UI feedback
 */
export interface SaveState {
  isSaving: boolean;
  lastSaveTime?: Date;
  lastError?: Error;
  isDirty: boolean;
  pendingSave?: SaveEventPayload;
}

/**
 * Task with complete metadata for frontend use
 */
export interface TaskWithMetadata {
  id: string;
  config: TaskConfig;
  data: TaskData;
  inheritance?: TaskInheritanceMetadata;
  saveState?: SaveState;
  validation?: ValidationResult;
}

/**
 * Form state as managed by composables
 */
export interface ComposableFormState {
  formData: FormData;
  inheritance: TaskInheritanceMetadata;
  overrides: FieldOverrides;
  validation: ValidationResult;
  isDirty: boolean;
  isSubmitting: boolean;
}

/**
 * Project-wide data structure (from projectStore)
 */
export interface ProjectData {
  /** Canonical fields from onboarding (inherited by tasks) */
  settings: {
    productName?: string;
    productDescription?: string;
    targetAudience?: string;
    primaryGoal?: string;
    targetTimeline?: string;
    marketingBudget?: string;
    teamSize?: string;
    techStack?: string;
    currentStage?: string;
    productType?: string;
    [key: string]: any;
  };

  /** Task-specific data keyed by taskId */
  taskData: {
    [taskId: string]: TaskData;
  };

  /** Field overrides per task */
  taskFieldOverrides?: {
    [taskId: string]: FieldOverrides;
  };

  [key: string]: any;
}

/**
 * Complete project model
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  data: ProjectData;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Conflict detection for concurrent edits
 */
export interface ConflictDetection {
  hasConflict: boolean;
  version: number;
  expectedVersion: number;
  remoteData?: TaskData;
  localData: TaskData;
  resolution?: 'local' | 'remote' | 'manual';
}

/**
 * Return type for store actions
 */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Async operation result with loading state
 */
export interface AsyncOpResult<T = any> {
  loading: boolean;
  data?: T;
  error?: Error;
  lastUpdated?: Date;
}

/**
 * Helper function to create empty TaskData
 */
export function createEmptyTaskData(): TaskData {
  return {
    formData: {},
    aiOutput: null,
    savedItems: []
  };
}

/**
 * Helper function to create empty FormData
 */
export function createEmptyFormData(): FormData {
  return {};
}

/**
 * Type guard: Check if object is valid TaskData
 */
export function isTaskData(obj: any): obj is TaskData {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.formData &&
    typeof obj.formData === 'object' &&
    Array.isArray(obj.savedItems)
  );
}

/**
 * Type guard: Check if object is valid SaveEventPayload
 */
export function isSaveEventPayload(obj: any): obj is SaveEventPayload {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.formData &&
    typeof obj.formData === 'object'
  );
}
