# create tables and indexes
#!/bin/bash

# Define table name and AWS CLI settings
ATLAS_TABLE_NAME="ca-dev-atlas"
MARKERS_TABLE_NAME="ca-dev-markers"
IMAGES_TABLE_NAME="ca-dev-images"
OWNERS_TABLE_NAME="ca-dev-owners"
AWS_PROFILE="default"
DYNAMODB_ENDPOINT="http://localhost:8000"

echo "Checking if table $ATLAS_TABLE_NAME exists..."
if aws dynamodb describe-table --table-name "$ATLAS_TABLE_NAME" --endpoint-url "$DYNAMODB_ENDPOINT" --profile "$AWS_PROFILE" >/dev/null 2>&1; then
    echo "Table $ATLAS_TABLE_NAME already exists. Skipping creation."
else
    echo "Creating table: $ATLAS_TABLE_NAME"

    aws dynamodb create-table \
        --table-name $ATLAS_TABLE_NAME \
        --attribute-definitions AttributeName=atlasId,AttributeType=S \
        --key-schema AttributeName=atlasId,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 \
        --endpoint-url "$DYNAMODB_ENDPOINT" \
        --profile "$AWS_PROFILE"

    echo "Table $ATLAS_TABLE_NAME created successfully."
fi

echo "Checking if table $MARKERS_TABLE_NAME exists..."
if aws dynamodb describe-table --table-name "$MARKERS_TABLE_NAME" --endpoint-url "$DYNAMODB_ENDPOINT" --profile "$AWS_PROFILE" >/dev/null 2>&1; then
    echo "Table $MARKERS_TABLE_NAME already exists. Skipping creation."
else
    echo "Creating table: $MARKERS_TABLE_NAME"

    aws dynamodb create-table \
        --table-name $MARKERS_TABLE_NAME \
        --attribute-definitions AttributeName=atlasId,AttributeType=S AttributeName=markerId,AttributeType=S \
        --key-schema AttributeName=atlasId,KeyType=HASH AttributeName=markerId,KeyType=RANGE \
        --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 \
        --endpoint-url "$DYNAMODB_ENDPOINT" \
        --profile "$AWS_PROFILE"

    echo "Table $MARKERS_TABLE_NAME created successfully."
fi

echo "Checking if table $IMAGES_TABLE_NAME exists..."
if aws dynamodb describe-table --table-name "$IMAGES_TABLE_NAME" --endpoint-url "$DYNAMODB_ENDPOINT" --profile "$AWS_PROFILE" >/dev/null 2>&1; then
    echo "Table $IMAGES_TABLE_NAME already exists. Skipping creation."
else
    echo "Creating table: $IMAGES_TABLE_NAME"

    aws dynamodb create-table \
        --table-name $IMAGES_TABLE_NAME \
        --attribute-definitions AttributeName=atlasId,AttributeType=S AttributeName=markerId,AttributeType=S AttributeName=imageId,AttributeType=S \
        --key-schema AttributeName=atlasId,KeyType=HASH AttributeName=imageId,KeyType=RANGE \
        --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 \
        --local-secondary-indexes '[
        {
            "IndexName": "ca-dev-local-images-table-LSI",
            "KeySchema": [
                {"AttributeName": "atlasId", "KeyType": "HASH"},
                {"AttributeName": "markerId", "KeyType": "RANGE"}
            ],
            "Projection": {
                "ProjectionType": "INCLUDE",
                "NonKeyAttributes": ["atlasId", "imageId", "comment"]
            }
        }
    ]' \
        --endpoint-url "$DYNAMODB_ENDPOINT" \
        --profile "$AWS_PROFILE"

    echo "Table $IMAGES_TABLE_NAME created successfully."
fi

if aws dynamodb describe-table --table-name "$OWNERS_TABLE_NAME" --endpoint-url "$DYNAMODB_ENDPOINT" --profile "$AWS_PROFILE" >/dev/null 2>&1; then
    echo "Table $OWNERS_TABLE_NAME already exists. Skipping creation."
else
    echo "Creating table: $OWNERS_TABLE_NAME"

    aws dynamodb create-table \
        --table-name $OWNERS_TABLE_NAME \
        --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=atlasId,AttributeType=S \
        --key-schema AttributeName=userId,KeyType=HASH AttributeName=atlasId,KeyType=RANGE \
        --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 \
        --local-secondary-indexes '[
        {
            "IndexName": "ca-dev-local-owners-table-LSI",
            "KeySchema": [
                {"AttributeName": "userId", "KeyType": "HASH"},
                {"AttributeName": "atlasId", "KeyType": "RANGE"}
            ],
            "Projection": {
                "ProjectionType": "INCLUDE",
                "NonKeyAttributes": ["atlasId", "userId"]
            }
        }
    ]' \
        --endpoint-url "$DYNAMODB_ENDPOINT" \
        --profile "$AWS_PROFILE"

    echo "Table $OWNERS_TABLE_NAME created successfully."
fi

#SECRETS MANAGER

# Configuration
SECRET_NAME="ca-dev-local-cloudfront-private-key"
SECRET_VALUE="bananas"
AWS_REGION="us-east-1"
LOCALSTACK_ENDPOINT="http://localhost:4566"

# Check if the secret already exists
SECRET_EXISTS=$(aws secretsmanager list-secrets --endpoint-url "$LOCALSTACK_ENDPOINT" --region "$AWS_REGION" --query "SecretList[?Name=='$SECRET_NAME'].Name" --output text)

if [ "$SECRET_EXISTS" == "$SECRET_NAME" ]; then
    echo "Secret $SECRET_NAME already exists. Updating value..."

    aws secretsmanager put-secret-value \
        --secret-id "$SECRET_NAME" \
        --secret-string "$SECRET_VALUE" \
        --region "$AWS_REGION" \
        --endpoint-url "$LOCALSTACK_ENDPOINT"

    echo "Secret updated successfully."
else
    echo "Secret $SECRET_NAME does not exist. Creating new secret..."

    aws secretsmanager create-secret \
        --name "$SECRET_NAME" \
        --secret-string "$SECRET_VALUE" \
        --region "$AWS_REGION" \
        --endpoint-url "$LOCALSTACK_ENDPOINT"

    echo "Secret created successfully."
fi
