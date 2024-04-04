import { FindManyOptions } from 'typeorm';
import { PageMetaParameters } from './page-meta.interface';

export class PageMeta {
  constructor({ pageOptions, total }: PageMetaParameters) {
    this.total = total;
    this.currentPage = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.lastPage = this.perPage === -1 ? 1 : Math.ceil(this.total / this.perPage);
    this.from = this.calculateFrom(this.currentPage, this.lastPage, this.perPage);
    this.to = this.calculateTo(this.from, this.perPage, this.total);
    this.perPage * this.currentPage > this.total ? this.total : this.perPage * this.currentPage;
  }

  readonly total: number;

  readonly currentPage: number = 1;

  readonly lastPage: number;

  readonly perPage: number;

  readonly from: number;

  readonly to: number;

  static generateFindOptions(perPage: number, page: number): FindManyOptions {
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

  private calculateFrom(currentPage: number, lastPage: number, perPage: number): number | null {
    return currentPage <= lastPage ? perPage * (currentPage - 1) + 1 : null;
  }

  private calculateTo(from: number | null, perPage: number, total: number): number | null {
    if (perPage === -1) {
      return total;
    }
    if (from) {
      return from + perPage - 1 <= total ? from + perPage - 1 : total;
    }
    return null;
  }
}
