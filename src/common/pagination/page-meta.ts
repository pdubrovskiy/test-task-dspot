import { FindOptions } from 'typeorm';
import { PageMetaParameters } from './page-meta.interface';

export class PageMeta {
  constructor({ pageOptions, total }: PageMetaParameters) {
    this.total = total;
    this.current_page = pageOptions.page;
    this.per_page = pageOptions.perPage;
    this.last_page = this.per_page === -1 ? 1 : Math.ceil(this.total / this.per_page);
    this.from = this.calculateFrom(this.current_page, this.last_page, this.per_page);
    this.to = this.calculateTo(this.from, this.per_page, this.total);
    this.per_page * this.current_page > this.total ? this.total : this.per_page * this.current_page;
  }

  readonly total: number;

  readonly current_page: number = 1;

  readonly last_page: number;

  readonly per_page: number;

  readonly from: number;

  readonly to: number;

  static generateFindOptions(perPage: number, page: number): FindOptions {
    const findOptions =
      perPage === -1
        ? {}
        : {
            skip: (page - 1) * perPage,
            take: perPage,
          };

    return findOptions;
  }

  static generateMeta(total: number, perPage: number, page: number) {
    const meta: PageMetaParameters = {
      total,
      pageOptions: {
        perPage,
        page,
      },
    };
    const pageMeta = new PageMeta(meta);

    return pageMeta;
  }

  private calculateFrom(current_page: number, last_page: number, per_page: number): number | null {
    return current_page <= last_page ? per_page * (current_page - 1) + 1 : null;
  }

  private calculateTo(from: number | null, per_page: number, total: number): number | null {
    if (per_page === -1) {
      return total;
    }
    if (from) {
      return from + per_page - 1 <= total ? from + per_page - 1 : total;
    }
    return null;
  }
}
