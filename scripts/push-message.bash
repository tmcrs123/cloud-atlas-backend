aws --endpoint-url=http://localhost:4566 sqs send-message \
    --queue-url http://localhost:4566/000000000000/cloud-atlas-queue \
    --message-body '{"atlasId":"27fc8d85-9a9d-4ef9-8cb7-6f30fd5d7327","markerId":"f2ed9591-5a99-4ced-8788-70f50b0d9a11","imageId":"aubergine"}'
