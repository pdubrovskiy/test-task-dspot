import { PageMeta } from './page-meta';

export class PageData<T> {
  constructor(content: T[], meta: PageMeta) {
    this.content = content;
    this.meta = meta;
  }

  content: T[];

  readonly meta: PageMeta;
}

export class Page<T> {
  readonly data: PageData<T>;

  readonly meta: PageMeta | null;

  constructor(data: T[], meta: PageMeta) {
    this.data = new PageData(data, meta);
    this.meta = meta;
  }
}
