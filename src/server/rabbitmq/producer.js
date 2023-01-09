import amqplib from "amqplib";
//docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management
const exchangeName = "direct_logs";
const args = process.argv.slice(2);

export const sendMessage = async (msg,logType) => {
  console.log("hello");
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "direct", { durable: false });
  channel.publish(exchangeName, logType,Buffer.from(msg));
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};


// const sendTask = async () => {
//   const connection = await amqplib.connect("amqp://localhost");
//   const channel = await connection.createChannel();
//   await channel.assertQueue(queueName, { durable: true }); //create a queue with a queue name if it isn't already in existance
//   //queue durable? -> if rabbitMq is restared is going to recreate that queue again,durable if set to true it is going to create that queue once again
//   //assert queue it s going to check if a queue exists or not
//   channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true }); //persisten-> writes on disk
//   console.log("sent: ", msg);
//   setTimeout(() => {
//     connection.close();
//     process.exit(0);
//   }, 600);
// };
