const { filter } = require("lodash");

const counterCache = (models) => async (instance, options, next) => {
  const type = instance.$modelOptions.name.singular;

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

  return next();
};

module.exports = counterCache;
