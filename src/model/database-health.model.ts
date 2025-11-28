type DatabaseHealthModel = {
  isOnline: boolean;
  connectionsAvailable: string;
  openConnections: string;
  latency: string[];
  version: string;
};

export default DatabaseHealthModel;
