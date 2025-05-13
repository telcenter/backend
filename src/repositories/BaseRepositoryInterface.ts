export type EntityBase<EntityId> = {
    id: EntityId,
};

export type EntityCreatePayload<T extends EntityBase<any>> = Partial<Pick<T, 'id'>> & Omit<T, 'id'>;;
export type EntityUpdatePayload<T extends EntityBase<any>> = Partial<T>;

export interface BaseRepositoryInterface<EntityId, T extends EntityBase<EntityId>> {
    findAll(): Promise<T[]>;
    findById(id: EntityId): Promise<T | null>;
    create(item: EntityCreatePayload<T>): Promise<T>;
    update(id: EntityId, item: EntityUpdatePayload<T>): Promise<T | null>;
    delete(id: EntityId): Promise<boolean>;
}
