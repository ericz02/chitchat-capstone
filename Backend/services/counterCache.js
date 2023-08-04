// counterCache.js
const counterCache = (models) => async (instance) => {
  const type = instance.constructor.name;

  if (type === "Post" || type === "Comment") {
    await Promise.all(
      Object.keys(models).map(async (key) => {
        if (models[key].options.cacheColumns) {
          const cacheColumns = models[key].options.cacheColumns(models);
          const relevantCacheColumns = cacheColumns.filter(
            (cc) => cc.model === type
          );

          await Promise.all(
            relevantCacheColumns.map(async (cacheColumn) => {
              const count = await models[cacheColumn.model].count({
                where: {
                  [cacheColumn.foreignKey]: instance[cacheColumn.foreignKey],
                  ...cacheColumn.where,
                },
              });

              // Update the count in the database
              await instance.update(
                { [cacheColumn.column]: count },
                { hooks: false }
              );

              // Update the count in the instance (virtual attribute)
              instance.setDataValue(cacheColumn.column, count);
            })
          );
        }
      })
    );
  }
};

module.exports = counterCache;
