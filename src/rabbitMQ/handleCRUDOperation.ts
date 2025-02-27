import { Model, ModelStatic } from 'sequelize';

/**
 * Updates an entity in the database.
 * @param {Model} entityModel - The Sequelize model of the entity to update.
 * @param {Object} updateData - The data to update the entity with.
 * @param {number} entityId - The ID of the entity to update.
 * @returns {Promise<Model>} A promise resolved with the updated entity.
 * @throws {Error} If the entity ID is not provided or the entity is not found.
 */
async function updateEntityInDatabase(
  entityModel: typeof Model,
  updateData: object,
  entityId: number
): Promise<Model> {
  if (!entityId) {
    throw new Error('No entity ID provided for update.');
  }

  const entity = await (entityModel as ModelStatic<Model<{}, {}>>).findByPk(entityId);
  if (!entity) {
    throw new Error(`Entity not found with ID: ${entityId}`);
  }

  try {
    const updatedEntity = await entity.update(updateData);
    return updatedEntity;
  } catch (error: any) {
    throw new Error(`Failed to update entity: ${error.message}`);
  }
}

/**
 * Creates a new entity in the database.
 * @param {Model} entityModel - The Sequelize model of the entity to create.
 * @param {Object} entityData - The data of the entity to create.
 * @returns {Promise<Model>} A promise resolved with the newly created entity.
 * @throws {Error} If the entity name or data is not provided, or if an entity with the same ID already exists.
 */
async function createEntityInDatabase(
entityModel: typeof Model, entityData: { id?: number;[key: string]: any; }, idField: any): Promise<Model> {
  if (!entityModel) {
    throw new Error('Entity model not provided.');
  }
  if (!entityData) {
    throw new Error('Entity data not provided.');
  }

  try {
    if (entityData.id) {
      const existingEntity = await (entityModel as ModelStatic<Model<{}, {}>>).findByPk(entityData.id);
      if (existingEntity) {
        throw new Error('Entity with the same ID already exists.');
      }
    }

    const newEntity = await (entityModel as ModelStatic<Model<{}, {}>>).create(entityData);
    return newEntity;
  } catch (error: any) {
    throw new Error(`Failed to create entity: ${error.message}`);
  }
}

/**
 * Deletes an entity from the database.
 * @param {Model} entityModel - The Sequelize model of the entity to delete.
 * @param {number} entityId - The ID of the entity to delete.
 * @returns {Promise<{ success: boolean; message: string }>} A promise resolved with an object indicating the success of the deletion.
 * @throws {Error} If the entity is not found.
 */
async function deleteEntityFromDatabase(
  entityModel: typeof Model,
  entityId: number
): Promise<{ success: boolean; message: string }> {
  if (!entityId) {
    throw new Error('No entity ID provided for deletion.');
  }

  try {
    const entity = await (entityModel as ModelStatic<Model<{}, {}>>).findByPk(entityId);
    if (!entity) {
      throw new Error(`Entity not found with ID: ${entityId}`);
    }

    await entity.destroy();
    return { success: true, message: 'Entity deleted successfully' };
  } catch (error: any) {
    throw new Error(`Failed to delete entity: ${error.message}`);
  }
}

export { updateEntityInDatabase, createEntityInDatabase, deleteEntityFromDatabase };
