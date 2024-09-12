import { Model } from 'sequelize';
/**
 * Updates an entity in the database.
 * @param {Model} entityModel - The Sequelize model of the entity to update.
 * @param {Object} updateData - The data to update the entity with.
 * @param {number} entityId - The ID of the entity to update.
 * @returns {Promise<Model>} A promise resolved with the updated entity.
 * @throws {Error} If the entity ID is not provided or the entity is not found.
 */
declare function updateEntityInDatabase(entityModel: typeof Model, updateData: object, entityId: number): Promise<Model>;
/**
 * Creates a new entity in the database.
 * @param {Model} entityModel - The Sequelize model of the entity to create.
 * @param {Object} entityData - The data of the entity to create.
 * @returns {Promise<Model>} A promise resolved with the newly created entity.
 * @throws {Error} If the entity name or data is not provided, or if an entity with the same ID already exists.
 */
declare function createEntityInDatabase(entityModel: typeof Model, entityData: {
    id?: number;
    [key: string]: any;
}, idField: any): Promise<Model>;
/**
 * Deletes an entity from the database.
 * @param {Model} entityModel - The Sequelize model of the entity to delete.
 * @param {number} entityId - The ID of the entity to delete.
 * @returns {Promise<{ success: boolean; message: string }>} A promise resolved with an object indicating the success of the deletion.
 * @throws {Error} If the entity is not found.
 */
declare function deleteEntityFromDatabase(entityModel: typeof Model, entityId: number): Promise<{
    success: boolean;
    message: string;
}>;
export { updateEntityInDatabase, createEntityInDatabase, deleteEntityFromDatabase };
