# Kafka Tutorial

This repository contains a Kafka tutorial with a simple Kafka setup in a Docker file. It uses the KafkaJs library and Schema Registry to handle producing and consuming messages.

## Prerequisites

Before running this repository, make sure you have the following prerequisites installed on your local machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Node.js: [Install Node.js](https://nodejs.org/en/download/)
- Yarn: [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Getting Started

To run this repository on your local machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Robgogo/kafka-tutorial.git
   ```

2. Navigate to the project directory:

   ```bash
   cd kafka-tutorial
   ```

3. Start the Kafka setup using Docker:

   ```bash|
   # use -d flag if you don't want to see the containers running
   docker-compose up
   ```

4. Install the dependencies:

   ```bash
   yarn
   ```

5. Start the consumer:

   ```bash
   yarn start:consumer
   ```

6. Start the producer:

   ```bash
   yarn start:producer
   ```

Now you should have the Kafka tutorial up and running on your local machine. Happy learning!

Play around with the producer and consumer code, and learn.
