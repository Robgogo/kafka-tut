import {
  COMPATIBILITY,
  SchemaRegistry,
  SchemaType,
} from "@kafkajs/confluent-schema-registry";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-kafka-producer",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

const topic1 = "topic1";
const topic2 = "topic2";

const schemaRegistryUrl = "http://localhost:8081";

// Register the schemas in the Schema Registry
async function registerSchemas(): Promise<[SchemaRegistry, number, number]> {
  const schemaRegistry = new SchemaRegistry({ host: schemaRegistryUrl });

  const { id: id1 } = await schemaRegistry.register(
    {
      type: SchemaType.JSON,
      schema: JSON.stringify(require("./schema.json")),
    },
    { subject: topic1, compatibility: COMPATIBILITY.NONE }
  );

  const { id: id2 } = await schemaRegistry.register(
    {
      type: SchemaType.JSON,
      schema: JSON.stringify(require("./topic2Schema.json")),
    },
    { subject: topic2, compatibility: COMPATIBILITY.FORWARD }
  );
  return [schemaRegistry, id1, id2];
}

const topic1Messages: { name: string; age: number }[] = [
  { name: "Robera", age: 29 },
  { name: "Chala", age: 45 },
  { name: "Sol", age: 28 },
  { name: "Micky", age: 50 },
];

// Produce events in topic1
async function produceEventsInTopic1(
  schemaRegistry: SchemaRegistry,
  id: number
) {
  for (const message of topic1Messages) {
    const encoded = await schemaRegistry.encode(id, message);
    await producer.send({
      topic: topic1,
      messages: [{ key: new Date().toString(), value: encoded }],
    });

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log("Waiting before next message");
        resolve();
      }, 1500)
    );
  }
}

const topic2Messages: {
  company: string;
  public: boolean;
  department: string;
}[] = [
  { company: "Klarna", public: false, department: "dd" },
  { company: "personio", public: false, department: "dd" },
  { company: "flix", public: true, department: "dd" },
];

//Produce events in topic2
async function produceEventsInTopic2(
  schemaRegistry: SchemaRegistry,
  id: number
) {
  for (const message of topic2Messages) {
    const encoded = await schemaRegistry.encode(id, message);
    await producer.send({
      topic: topic2,
      messages: [{ key: new Date().toString(), value: encoded }],
    });

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log("Waiting before next message");
        resolve();
      }, 1000)
    );
  }
}

// Start the producer and produce events
async function startProducer() {
  await producer.connect();
  const [schemaRegistry, id1, id2] = await registerSchemas();
  await produceEventsInTopic1(schemaRegistry, id1);
  await produceEventsInTopic2(schemaRegistry, id2);
  await producer.disconnect();
}

startProducer().catch((error) => {
  console.error("Error producing events:", error);
});
