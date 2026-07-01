export interface IBaseRepository<T> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected items: T[] = [];

  async find(id: string): Promise<T | null> {
    const item = this.items.find((i: any) => i.id === id);
    return item || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async create(item: T): Promise<T> {
    this.items.push(item);
    return { ...item };
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const idx = this.items.findIndex((i: any) => i.id === id);
    if (idx === -1) return null;
    Object.assign(this.items[idx] as any, item);
    return this.items[idx];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.items.length;
    this.items = this.items.filter((i: any) => i.id !== id);
    return this.items.length < initialLen;
  }
}
