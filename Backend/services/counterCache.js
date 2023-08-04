const { filter } = require("lodash");

const counterCache = (models) => async (instance) => {
  console.log("Instance:", instance);
  const type = instance.constructor.name;

  if (type === "Post" || type === "Comment") {
    // Update likesCount only for Post and Comment models
    await Promise.all(
      Object.keys(models).map(async (key) => {
        if (models[key].options.cacheColumns) {
          let cacheColumns = models[key].options.cacheColumns(models);
          cacheColumns = filter(cacheColumns, (cc) => cc.model === type);

          await Promise.all(
            cacheColumns.map(async (cacheColumn) => {
              const count = await models[cacheColumn.model].count({
                where: Object.assign(
                  {},
                  {
                    [cacheColumn.foreignKey]: instance[cacheColumn.foreignKey],
                  },
                  cacheColumn.where
                ),
              });

              await models[key].update(
                { [cacheColumn.column]: count },
                { where: { id: instance[cacheColumn.foreignKey] } }
              );
            })
          );
        }
      })
    );
  }
};

module.exports = counterCache;
