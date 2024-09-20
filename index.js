const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

// Preparamos as informações de acesso ao banco de dados
const dbUrl = 'mongodb+srv://admin:KJsim29sjakjm437A@cluster0.zt1ly.mongodb.net'
const dbName = 'mongodb-intro-e-implementacao'

// Declaramos a função main()
async function main() {
  // Reaçozamos a conexão com bando de dados
  const client = new MongoClient(dbUrl)
  console.log("Conectando ao banco de dados...")
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')

  const db = client.db(dbName)
  const collection = db.collection('personagem')

  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  const lista = ['Java', 'Kotlin', 'Android']
  //              0       1         2

  // Endpoint Read All [GET] /personagens
  app.get('/personagem', async function (req, res) {
    // Acessamos a lista de itens na collection do MongoDB
    const itens = await collection.find().toArray()
    res.send(itens)
  })

  // // Endpoint Count [GET] /personagem/count
  // app.get("/personagem/count", function (req, res) {
  //   const totalItens = lista.length;
  //   res.send('Número total de itens: ' + totalItens);
  // });

  // Endpoint Read by ID [GET] /personagem/:id
  app.get('/personagem/:id', async function (req, res) {
    // Acessamos o parâmetro de rota ID
    const id = req.params.id

    // Acessa o item na collection usando o ID 
    const item = await collection.findOne( { _id: new ObjectId(id) } )
    // Checamos se o item está obtido é existente
    if (!item) {
      return res.status(404).send('Item não encontrado.')
    }

    // Enviamos o item como resposta
    res.send(item)
  })


  // Sinalizo para o Express que estamos usando JSON no Body
  app.use(express.json())

  // Endpoint Create [POST] /personagem
  app.post('/personagem', async function (req, res) {
    // Acessamos o Body da Requisição
    const novoItem = req.body

    // Checar se o `nome` está presente no body
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }

    // // Checar se o novoItem está na lista ou não
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Esse item já existe na lista.')
    // }

    // Adicionamos na collection
    await collection.insertOne(novoItem)

    // Exibimos mensagem de sucesso
    res.status(201).send(novoItem)
  })

  // Endpoint Update [PUT] /personagem/:id
  app.put('/personagem/:id', function (req, res) {
    // Acessamos o ID dos parâmetros de rota
    const id = req.params.id

    // Checamos se o item ID - 1 está na lista
    // Exibendo uma mensagem caso contrario 
    if (!lista[id - 1]) {
      return res.status(404).send('Item não encontrado.')
    }


    // acessamos o Body da requisição
    const body = req.body

    // Acessamos a propriedade 'nome' do body
    const novoItem = body.nome

    // Checar se o `nome` está presente no body
    if (!novoItem) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }

    // Checar se o novoItem está na lista ou não
    if (lista.includes(novoItem)) {
      return res.status(409).send('Esse item já existe na lista.')
    }

    // Atualizamos na liste o novoItem pelo ID - 1
    lista[id - 1] = novoItem

    //Enviamos uma mensagem de sucesso
    res.status(201).send('Item atualizado com sucesso' + id + ' - ' + novoItem)
  })

  // Endpoint Delete [DELETE] /personagem/:id
  app.delete('/personagem/:id', async function (req, res) {
    // Acessamos o parâmetro de rota
    const id = req.params.id

    // Checamos se o item ID - 1 está na lista
    // Exibendo uma mensagem caso contrario 
    // if (!lista[id - 1]) {
    //   return res.status(404).send('Item não encontrado.')
    // }

    //Remover o item da colletion usando o ID
    await collection.deleteOne( {_id: new ObjectId(id)} )

    // Enviamos uma mensagem de sucesso
    res.send('Item removido com sucesso: ' + id)
  })

  app.listen(3000)
}

main()