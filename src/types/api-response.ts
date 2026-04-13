export type ApiResponseStatus = 'success' | 'error' | string

export interface ApiResponse<TData> {
  status: ApiResponseStatus
  message: string
  data: TData
}

export interface PaginationLink {
  url: string | null
  label: string
  page: number | null
  active: boolean
}

export interface PaginatedData<TItem> {
  current_page: number
  data: TItem[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedApiResponse<TItem> extends ApiResponse<PaginatedData<TItem>> {
  meta: PaginationMeta
}
