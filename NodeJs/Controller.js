const express = require('express');
const cors = require('cors');
const models = require('./models');
const { Sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get('/', function(req, res) {
    res.send('Olá, mundo!');
});

// Clientes

app.post('/clientes/cadastrar', async(req, res) => {
    await cliente.create(
        req.body        
    ).then(function() {
        return res.json({
            error: false,
            message: "Cliente criado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar o cliente."
        })
    });
});

app.get('/clientes', async(req, res) => {
    await cliente.findAll({
        order: [['clienteDesde', 'ASC']]
    }).then(function(clientes) {
        res.json({
            error: false,
            clientes
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os clientes."
        });
    });
});

app.get('/clientes/quantidade', async(req, res) => {
    await cliente.count('id')
    .then(function(clientes) {
        res.json({
            error: false,
            clientes
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de clientes."
        });
    });
});

app.get('/clientes/:id', async(req, res) => {
    if(!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };

    await cliente.findByPk(req.params.id, {include: [{all: true}]})
    .then(cli => {
        return res.json({
            error: false,
            cli
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o cliente."
        });
    });
});

app.get('/clientes/:id/pedidos', async(req, res) => {
    if(!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };

    await pedido.findAll({
        where: {ClienteId: req.params.id} 
    }).then(function(peds) {
        return res.json({
            error: false,            
            peds
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao encontrar pedidos."
        });
    });
});

app.put('/clientes/:id/editar', async(req, res) => {
    if(!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };

    const cli = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    await cliente.update(cli, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Cliente alterado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o cliente."
        });
    });
});

app.get('/clientes/:id/excluir', async(req, res) => {
    if(!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    };

    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente."
        });
    });
});

// Serviços

app.post('/servicos/cadastrar', async(req, res) => {
    await servico.create(
        req.body        
    ).then(function() {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar o serviço."
        })
    });    
});

app.get('/servicos', async(req, res) => {
    await servico.findAll({
        order: [['id', 'ASC']]
    }).then(function(servicos) {
        res.json({
            error: false,
            servicos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os serviços."
        });
    });
});

app.get('/servicos/quantidade', async(req, res) => {
    await servico.count('id')
    .then(function(servicos) {
        res.json({
            error: false,
            servicos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de serviços."
        });
    });
});

app.get('/servicos/:id', async(req, res) => {
    if(!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    await servico.findByPk(req.params.id)
    .then(serv => {
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o serviço."
        });
    });
});

app.get('/servicos/:id/pedidos', async(req, res) => {
    if(!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    await servico.findByPk(
        req.params.id, {include: [{all: true}]})
    .then(serv => {
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o serviço."
        });
    });
});

app.put('/servicos/:id/editar', async(req, res) => {
    if(!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    const serv = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await servico.update(serv, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o serviço."
        });
    });
});

app.get('/servicos/:id/excluir', async(req, res) => {
    if(!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    await servico.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o serviço."
        });
    });
});

// Pedidos

app.post('/pedidos/cadastrar', async(req, res) => {
    await pedido.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar o pedido."
        })
    });
});

app.get('/pedidos', async(req, res) => {
    await pedido.findAll({
        raw: true
    }).then(function(pedidos) {
        res.json({
            error: false,
            pedidos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os pedidos."
        });
    });
});

app.get('/pedidos/quantidade', async(req, res) => {
    await pedido.count('id')
    .then(function(pedidos) {
        res.json({
            error: false,
            pedidos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de pedidos."
        });
    });
});

app.get('/pedidos/:id', async(req, res) => {
    if(!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    await pedido.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped => {
        return res.json({
            error: false,
            ped
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o pedido."
        });
    });
});

app.put('/pedidos/:id/editar', async(req, res) => {
    if(!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    const ped = {
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };

    await pedido.update(ped, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o pedido."
        });
    });
});

app.get('/pedidos/:id/excluir', async(req, res) => {
    if(!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    await pedido.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Pedido excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o pedido."
        });
    });
});

// ItemPedido

app.post('/itempedido/cadastrar', async(req, res) => {
    await itempedido.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Item adicionado ao pedido com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao adicionar o item ao pedido."
        })
    });
});

app.get('/itempedido', async(req, res) => {
    await itempedido.findAll({
        order: [['PedidoId', 'ASC']]
    }).then(function(itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os itens."
        });
    });
});

app.get('/itempedido/quantidade', async(req, res) => {
    await itempedido.count('id')
    .then(function(itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de itens."
        });
    });
});

app.get('/itempedido/:PedidoId/:ServicoId', async(req, res) => {
    if(!await pedido.findByPk(req.params.PedidoId)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    if(!await servico.findByPk(req.params.ServicoId)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    await itempedido.findOne({where: 
        Sequelize.and(
            {ServicoId: req.params.ServicoId},
            {PedidoId: req.params.PedidoId}
        )
    })
    .then(item => {
        return res.json({
            error: false,
            item
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o pedido."
        });
    });
});

app.put('/itempedido/:PedidoId/:ServicoId/editar', async(req, res) => {
    if(!await pedido.findByPk(req.params.PedidoId)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    if(!await servico.findByPk(req.params.ServicoId)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    const item = {
        PedidoId: req.body.PedidoId,
        ServicoId: req.body.ServicoId,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    await itempedido.update(item, {
        where: Sequelize.and(
            {ServicoId: req.params.ServicoId},
            {PedidoId: req.params.PedidoId}
        )
    }).then(function(itens) {
        return res.json({
            error: false,
            message: "Item alterado com sucesso!",
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar pedido."
        });
    });
});

app.get('/itempedido/:PedidoId/:ServicoId/excluir', async(req, res) => {
    if(!await pedido.findByPk(req.params.PedidoId)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    };

    if(!await servico.findByPk(req.params.ServicoId)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    };

    await itempedido.destroy({        
        where: Sequelize.and({
            ServicoId: req.params.ServicoId, 
            PedidoId: req.params.PedidoId
        })
    }).then(function() {
        return res.json({
            error: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o item."
        });
    });
});

// Compra

app.post('/compras/cadastrar', async(req, res) => {
    await compra.create(
        req.body        
    ).then(function() {
        return res.json({
            error: false,
            message: "Compra criada com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar a compra."
        })
    });    
});

app.get('/compras', async(req, res) => {
    await compra.findAll({
        raw: true
    }).then(function(compras) {
        res.json({
            error: false,
            compras
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar as compras."
        });
    });
});

app.get('/compras/quantidade', async(req, res) => {
    await compra.count('id')
    .then(function(compras) {
        res.json({
            error: false,
            compras
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de compras."
        });
    });
});

app.get('/compras/:id', async(req, res) => {
    if(!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };

    await compra.findByPk(req.params.id, {include: [{all: true}]})
    .then(comp => {
        return res.json({
            error: false,
            comp
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar a compra."
        });
    });
});

app.put('/compras/:id/editar', async(req, res) => {
    if(!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrado."
        });
    };

    const comp = {
        data: req.body.data
    };

    await compra.update(comp, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Compra alterada com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar a compra."
        });
    });
});

app.get('/compras/:id/excluir', async(req, res) => {
    if(!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };

    await compra.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a compra."
        });
    });
});

// Produto

app.post('/produtos/cadastrar', async(req, res) => {
    await produto.create(
        req.body        
    ).then(function() {
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar o produto."
        })
    });    
});

app.get('/produtos', async(req, res) => {
    await produto.findAll({
        order: [['id', 'ASC']]
    }).then(function(produtos) {
        res.json({
            error: false,
            produtos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os produtos."
        });
    });
});

app.get('/produtos/quantidade', async(req, res) => {
    await produto.count('id')
    .then(function(produtos) {
        res.json({
            error: false,
            produtos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de produtos."
        });
    });
});

app.get('/produtos/:id', async(req, res) => {
    if(!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await produto.findByPk(req.params.id)
    .then(prod => {
        return res.json({
            error: false,
            prod
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o produto."
        });
    });
});

app.get('/produtos/:id/compras', async(req, res) => {
    if(!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await produto.findByPk(
        req.params.id, {include: [{all: true}]})
    .then(prod => {
        return res.json({
            error: false,
            prod
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o produto."
        });
    });
});

app.put('/produtos/:id/editar', async(req, res) => {
    if(!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    const prod = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await produto.update(prod, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Produto alterado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o produto."
        });
    });
});

app.get('/produtos/:id/excluir', async(req, res) => {
    if(!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await produto.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Produto excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o produto."
        });
    });
});

// ItemProduto

app.post('/itemcompra/cadastrar', async(req, res) => {
    await itemcompra.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Item adicionado à compra com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao adicionar o item à compra."
        })
    });
});

app.get('/itemcompra', async(req, res) => {
    await itemcompra.findAll({
        order: [['CompraId', 'ASC']]
    }).then(function(itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao listar os itens."
        });
    });
});

app.get('/itemcompra/quantidade', async(req, res) => {
    await itemcompra.count('id')
    .then(function(itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao exibir a quantidade de itens."
        });
    });
});

app.get('/itemcompra/:CompraId/:ProdutoId', async(req, res) => {
    if(!await compra.findByPk(req.params.CompraId)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };

    if(!await produto.findByPk(req.params.ProdutoId)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await itemcompra.findOne({where: 
        Sequelize.and(
            {CompraId: req.params.CompraId},
            {ProdutoId: req.params.ProdutoId}
        )
    })
    .then(item => {
        return res.json({
            error: false,
            item
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao buscar o pedido."
        });
    });
});

app.put('/itemcompra/:CompraId/:ProdutoId/editar', async(req, res) => {
    if(!await compra.findByPk(req.params.CompraId)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };

    if(!await produto.findByPk(req.params.ProdutoId)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    const item = {
        CompraId: req.body.CompraId,
        ProdutoId: req.body.ProdutoId,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    await itemcompra.update(item, {
        where: Sequelize.and(
            {ProdutoId: req.params.ProdutoId},
            {CompraId: req.params.CompraId}
        )
    }).then(function(itens) {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar pedido."
        });
    });
});

app.get('/itemcompra/:CompraId/:ProdutoId/excluir', async(req, res) => {
    if(!await compra.findByPk(req.params.CompraId)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    };

    if(!await produto.findByPk(req.params.ProdutoId)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await itemcompra.destroy({        
        where: Sequelize.and({
            ProdutoId: req.params.ProdutoId, 
            CompraId: req.params.CompraId
        })
    }).then(function() {
        return res.json({
            error: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o item."
        });
    });
});

// Porta

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log('Servidor ativo: http://localhost:3001');
})