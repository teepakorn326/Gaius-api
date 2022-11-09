module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  Booking.associate = (db) => {
    Booking.belongsTo(db.User, {
      as: "Renter",
      foreignKey: {
        name: "renterId",
        allowNull: false,
      },
    });
    Booking.belongsTo(db.User, {
      as: "Owner",
      foreignKey: {
        name: "ownerId",
        allowNull: false,
      },
    });
    Booking.belongsTo(db.Estate, {
      as: "Estate",
      foreignKey: {
        name: "estateId",
        allowNull: false,
      },
    });
  };

  return Booking;
};
