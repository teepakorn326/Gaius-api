module.exports = (sequelize, DataTypes) => {
  const Estate = sequelize.define(
    "Estate",
    {
      //Estate
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: { type: DataTypes.BOOLEAN, defaultValue: false },
      mapUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      plusCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING(600),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      //detail
      type: DataTypes.ENUM(
        "Condominium",
        "Flat",
        "Dormitory",
        "Home",
        "Town house"
      ),
      size: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      unitType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      floor: DataTypes.STRING,

      building: DataTypes.STRING,
      //address
      province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      subDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      postCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      //price
      rentalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      depositPrice: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      advancePayment: {
        type: DataTypes.STRING,
      },
    },
    { underscored: true }
  );
  Estate.associate = (db) => {
    Estate.belongsTo(db.User, {
      as: "Renter",
      foreignKey: {
        name: "renterId",
      },
    });
    Estate.belongsTo(db.User, {
      as: "Owner",
      foreignKey: {
        name: "ownerId",
        allowNull: false,
      },
    }),
      Estate.hasMany(db.Photo, {
        foreignKey: {
          name: "estateId",
          allowNull: false,
        },
      });
    Estate.hasMany(db.Booking, {
      foreignKey: {
        name: "estateId",
        allowNull: false,
      },
    });
  };

  return Estate;
};
