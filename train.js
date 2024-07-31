const tf = require('@tensorflow/tfjs-node');

async function trainModel() {
  // Generate some synthetic training data
  const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
  const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

  // Create a more complex model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1 }));

  // Compile the model with an optimizer and loss function
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError'
  });

  // Train the model
  await model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
      }
    }
  });

  return model;
}

module.exports = trainModel;
