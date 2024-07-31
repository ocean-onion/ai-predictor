const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const trainModel = require('./train');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let model;

// Load or train the model
(async () => {
  const modelPath = path.resolve(__dirname, 'model');
  if (fs.existsSync(`${modelPath}/model.json`)) {
    console.log('Loading existing model...');
    model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
  } else {
    console.log('Training new model...');
    model = await trainModel();
    await model.save(`file://${modelPath}`);
  }
})();

app.post('/predict', async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: 'Model is not ready yet. Please try again later.' });
  }

  try {
    const input = req.body.input;
    const tensorInput = tf.tensor2d([input]);
    const prediction = model.predict(tensorInput);
    const result = await prediction.data();
    res.json({ prediction: Array.from(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
