import { GraphQLClient, RequestDocument } from 'graphql-request';

export class MSTClient {
  private client: GraphQLClient;

  /**
   * Initialise le client GraphQL avec l'URL de la Gateway.
   * @param gatewayUrl L'URL de la Gateway GraphQL.
   */
  constructor(gatewayUrl: string) {
    if (!gatewayUrl) {
      throw new Error("Gateway URL is required to initialize MSTClient.");
    }
    this.client = new GraphQLClient(gatewayUrl);
  }

  /**
   * Exécute une requête GraphQL de type query.
   * @param query Le document GraphQL à exécuter.
   * @param variables Les variables optionnelles pour la requête.
   * @returns Les données de la réponse.
   */
  async query<T>(query: RequestDocument, variables?: Record<string, any>): Promise<T> {
    return this.client.request<T>(query, variables);
  }

  /**
   * Exécute une requête GraphQL de type mutation.
   * @param mutation Le document GraphQL à exécuter.
   * @param variables Les variables optionnelles pour la requête.
   * @returns Les données de la réponse.
   */
  async mutation<T>(mutation: RequestDocument, variables?: Record<string, any>): Promise<T> {
    return this.client.request<T>(mutation, variables);
  }
}
