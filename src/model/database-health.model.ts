export default interface DatabaseHealthModel {
  isOnline: boolean;
  connectionsAvailable: string;
  openConnections: string;
  latency: string[];
  version: string;
}
