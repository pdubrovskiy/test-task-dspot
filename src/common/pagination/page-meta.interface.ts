export interface PageMetaParameters {
  pageOptions: PageOptions;
  total: number;
}

interface PageOptions {
  perPage: number;
  page: number;
}
