import express from 'express';

const app = express();
app.use(express.json());

app.get('/users', (request, response) => {
  return response.json({message: 'NLW 4'});
});

app.post('/users', (request, response) => {
  const { name, password } = request.body;
  
  return response.json({message: 'dados salvos com sucesso!'})
});

app.listen(3333, () => console.log('Server is running!'));
