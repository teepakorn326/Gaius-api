module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define(
    "Photo",
    {
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  Photo.associate = (db) => {
    Photo.belongsTo(db.Estate, {
      as: "Estate",
      foreignKey: {
        name: "estateId",
        allowNull: false,
      },
    });
  };
  return Photo;
};
