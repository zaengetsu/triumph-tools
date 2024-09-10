#!/bin/bash

# Function to create a microservice with the specified structure
create_microservice() {
  SERVICE_NAME=$1

  echo "Creating microservice: $SERVICE_NAME"

  # Create directories
  mkdir -p $SERVICE_NAME/src/{models,rabbitMQ,interfaces/graphql/resolvers,shared}
  mkdir -p $SERVICE_NAME/tests/{unit,integration}
  mkdir -p $SERVICE_NAME/{docs,scripts}

  # Create files
  touch $SERVICE_NAME/{microservice.mjs,Dockerfile,.env,package.json,tsconfig.json,README.md}

  # Create default files in models
  touch $SERVICE_NAME/src/models/UserModel.ts

  # Create default files in rabbitMQ
  touch $SERVICE_NAME/src/rabbitMQ/RabbitMQHandler.ts

  # Create GraphQL structure
  touch $SERVICE_NAME/src/interfaces/graphql/{UserSchema.graphql}
  touch $SERVICE_NAME/src/interfaces/graphql/resolvers/UserResolver.ts

  # Create shared folder
  touch $SERVICE_NAME/src/shared/Helper.ts

  # Provide some content to the main entry file
  echo '// Entry point for the microservice' > $SERVICE_NAME/microservice.mjs
}

# Prompt user for microservice name
read -p "Enter the name of the microservice: " MICRO_NAME

# Create the microservice structure
create_microservice $MICRO_NAME

echo "Microservice structure created successfully!"
