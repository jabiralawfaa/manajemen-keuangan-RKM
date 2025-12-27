// services/databaseService.js
const { testConnection, getTableInfo, getTableCounts } = require('../utils/helpers/database');

class DatabaseService {
  /**
   * Menguji koneksi ke database
   */
  static async checkConnection() {
    return await testConnection();
  }

  /**
   * Mendapatkan informasi tabel-tabel di database
   */
  static async getTableInfo() {
    return await getTableInfo();
  }

  /**
   * Mendapatkan jumlah data di setiap tabel
   */
  static async getTableCounts() {
    return await getTableCounts();
  }

  /**
   * Melakukan health check pada database
   */
  static async healthCheck() {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        return {
          status: 'error',
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        };
      }

      const tables = await this.getTableInfo();
      const counts = await this.getTableCounts();

      return {
        status: 'success',
        message: 'Database connection successful',
        tables: tables,
        tableCounts: counts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = DatabaseService;