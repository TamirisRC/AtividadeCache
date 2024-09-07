class DatabaseInterface {
  async connect() {
      throw new Error("Method 'connect()' must be implemented.");
  }

  async getConnection() {
      throw new Error("Method 'getConnection()' must be implemented.");
  }
}

export default DatabaseInterface;
