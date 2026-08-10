export interface IBaseRepository<T> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}