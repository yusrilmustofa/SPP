'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      this.hasMany(models.pembayaran, {
        foreignKey: "nisn",
        as: "siswa"
      })

      // relation to pembayaran (id_spp)
      this.hasMany(models.pembayaran, {
        foreignKey: "id_spp",
        as: "spp_pembayaran"
      })

      // relation to spp
      this.belongsTo(models.spp, {
        foreignKey: "id_spp",
        as: "spp"
      })

      // relation to kelas
      this.belongsTo(models.kelas, {
        foreignKey: "id_kelas",
        as: "kelas"
      })

    }
  };
  siswa.init({
    nisn: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nis: DataTypes.STRING,
    nama: DataTypes.STRING,
    id_kelas: DataTypes.INTEGER,
    alamat: DataTypes.TEXT,
    no_telp: DataTypes.STRING,
    id_spp: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'siswa',
    tableName: "siswa"
  });
  return siswa;
};