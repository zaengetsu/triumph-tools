import { RequestDocument } from 'graphql-request';
declare class MSTClient {
    private client;
    /**
     * Initialise le client GraphQL avec l'URL de la Gateway.
     * @param gatewayUrl L'URL de la Gateway GraphQL.
     */
    constructor(gatewayUrl: string);
    /**
     * Exécute une requête GraphQL de type query.
     * @param query Le document GraphQL à exécuter.
     * @param variables Les variables optionnelles pour la requête.
     * @returns Les données de la réponse.
     */
    query<T>(query: RequestDocument, variables?: Record<string, any>): Promise<T>;
    /**
     * Exécute une requête GraphQL de type mutation.
     * @param mutation Le document GraphQL à exécuter.
     * @param variables Les variables optionnelles pour la requête.
     * @returns Les données de la réponse.
     */
    mutation<T>(mutation: RequestDocument, variables?: Record<string, any>): Promise<T>;
}
export { MSTClient };
