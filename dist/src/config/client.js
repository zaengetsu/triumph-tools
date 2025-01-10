import { GraphQLClient } from 'graphql-request';
class MSTClient {
    client;
    /**
     * Initialise le client GraphQL avec l'URL de la Gateway.
     * @param gatewayUrl L'URL de la Gateway GraphQL.
     */
    constructor(gatewayUrl) {
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
    async query(query, variables) {
        return this.client.request(query, variables);
    }
    /**
     * Exécute une requête GraphQL de type mutation.
     * @param mutation Le document GraphQL à exécuter.
     * @param variables Les variables optionnelles pour la requête.
     * @returns Les données de la réponse.
     */
    async mutation(mutation, variables) {
        return this.client.request(mutation, variables);
    }
}
export { MSTClient };
