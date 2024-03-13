import { Kafka, logLevel } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:29092"],
  logLevel: logLevel.ERROR,
});

const registry = new SchemaRegistry({ host: "http://localhost:8081" });

const consumer = kafka.consumer({ groupId: "my-group-1" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "topic1" });
  await consumer.subscribe({ topic: "topic2" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const schemaId = await registry.getRegistryId(topic, 2);
      try {
        const decodedMessage = await registry.decode(message.value!);

        // Process the decoded message
        console.log(`Received message from topic ${topic}:`, decodedMessage);
      } catch (error) {
        console.error(`Error processing message from topic ${topic}:`, error);
      }
    },
  });
};

runConsumer().catch(console.error);
