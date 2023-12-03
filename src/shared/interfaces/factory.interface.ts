export interface CreateService<T, CreateDto> {
  create(dto: CreateDto): Promise<T>;
}

export interface ReadService<T> {
  findUnique(id: string | number): Promise<T>;
  findAll(): Promise<T[]>;
  findByFilter(filter: QueryFilter<T>): Promise<T[]>;
}

export interface UpdateService<T, UpdateDto> {
  update(id: string | number, dto: UpdateDto): Promise<T>;
}

export interface DeleteService<T> {
  delete(id: string | number): Promise<T>;
}

export type QueryFilter<T> = {
  [P in keyof T]?: T[P];
};

export interface CrudService<T, CreateDto, UpdateDto>
  extends CreateService<T, CreateDto>,
    ReadService<T>,
    UpdateService<T, UpdateDto>,
    DeleteService<T> {}
