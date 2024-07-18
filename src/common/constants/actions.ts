export enum Actions {
  FindAll = 'findAll',
  FindOne = 'findOne',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  ValidateProducts = 'validate_products',
}

export const getActionName = (entityName: string) => {
  return {
    findAll: `${entityName}_${Actions.FindAll}`,
    findOne: `${entityName}_${Actions.FindOne}`,
    create: `${entityName}_${Actions.Create}`,
    update: `${entityName}_${Actions.Update}`,
    delete: `${entityName}_${Actions.Delete}`,
    validate_products: `${entityName}_${Actions.ValidateProducts}`,
  };
};
