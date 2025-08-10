// Re-export API types from shared package
export type {
  ApiResponse,
  ApiErrorResponse as ApiError,
  PaginationMeta,
  PaginatedResponse
} from '@velocards/shared-types/api';

// Additional dashboard-specific API types can be added below