module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      profileImage: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notEmpty: true,
        // },
      },
    },
    { underscored: true }
  );

  User.associate = (db) => {
    User.hasMany(db.Estate, {
      foreignKey: {
        name: "renterId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    User.hasMany(db.Estate, {
      foreignKey: {
        name: "ownerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    User.hasMany(db.Booking, {
      foreignKey: {
        name: "ownerId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    User.hasMany(db.Booking, {
      foreignKey: {
        name: "renterId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
  };

  return User;
};
