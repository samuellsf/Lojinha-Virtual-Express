Lojinha Virtual Express

Lojinha Virtual Express é uma aplicação simples de e-commerce que permite visualizar produtos, buscar por eles, filtrar por categoria e preço, além de adicionar ao carrinho e finalizar a compra via WhatsApp.

Funcionalidades

Busca de produtos: Pesquise por nome de produto.

Filtros: Filtre os produtos por categoria e ordene por preço (menor ou maior).

Carrinho: Adicione produtos ao carrinho e finalize a compra pelo WhatsApp.

Service Worker: A aplicação possui suporte offline básico utilizando Service Worker.

Responsivo: Layout responsivo que funciona bem em dispositivos móveis e desktops.

Tecnologias

HTML5: Estrutura básica da página.

CSS3: Estilos e responsividade.

JavaScript: Lógica da aplicação (busca, filtros, ordenação, etc.).

JSON: Dados dos produtos armazenados em arquivo JSON.

Service Worker: Para cache e funcionamento offline (opcional).

Como rodar o projeto
1. Clone este repositório:
git clone https://github.com/seu-usuario/lojinha-virtual-express.git

2. Instale o ambiente:

Este projeto não depende de frameworks ou bibliotecas externas (exceto o serviceWorker.js caso você queira usar o Service Worker). No entanto, você precisará de um servidor web para servir os arquivos localmente.

3. Execute localmente:

Se você estiver utilizando o VSCode e a extensão "Live Server", basta clicar com o botão direito no arquivo index.html e selecionar "Open with Live Server".

Ou, caso você tenha o Node.js instalado, pode instalar e rodar um servidor HTTP simples:

# Instale o http-server globalmente
npm install -g http-server

# Navegue até a pasta do projeto e inicie o servidor
cd lojinha-virtual-express
http-server


Acesse o projeto no navegador em http://127.0.0.1:5500/index.html

Estrutura do Projeto
/lojinha-virtual-express
│
├── /css                # Arquivos CSS (estilos)
│   └── style.css       # Estilos principais
│
├── /data               # Dados dos produtos
│   └── produtos.json   # Dados dos produtos (JSON)
│
├── /js                 # Arquivos JavaScript
│   ├── app.js          # Lógica principal da aplicação
│   ├── cart.js         # Lógica do carrinho de compras
│   └── serviceWorker.js # (opcional) Service Worker para cache offline
│
├── index.html          # Página principal
└── README.md           # Este arquivo

Como funciona
1. Exibição de produtos:

O arquivo produtos.json contém os dados de todos os produtos da loja. Esses dados são carregados via JavaScript e renderizados dinamicamente no HTML.

2. Filtros de produtos:

Busca: O campo de busca permite pesquisar por nome do produto.

Categoria: Um filtro de categoria permite exibir apenas produtos de uma determinada categoria.

Ordenação: É possível ordenar os produtos por preço (menor ou maior).

3. Carrinho de compras:

Quando o usuário clica em "Comprar" em um produto, o produto é adicionado ao carrinho. O carrinho de compras pode ser visualizado ao lado da lista de produtos e o total da compra é exibido.

4. Finalização da compra:

O botão Finalizar pelo WhatsApp redireciona o usuário para uma conversa no WhatsApp com o link para concluir a compra.

Como adicionar novos produtos

Abra o arquivo data/produtos.json.

Adicione um novo objeto de produto na lista com as seguintes propriedades:

id: Um identificador único para o produto.

nome: Nome do produto.

descricao: Descrição breve do produto.

preco: Preço do produto.

imagem: Caminho da imagem do produto (ex: "images/produto1.jpg").

category: Categoria do produto (ex: "Eletrônicos", "Roupas", etc).

Exemplo de produto no JSON:

{
  "id": 1,
  "nome": "Produto Exemplo",
  "descricao": "Descrição do produto exemplo.",
  "preco": 100.00,
  "imagem": "images/produto1.jpg",
  "category": "Eletrônicos"
}

Contribuições

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias ou correções!

Fork este repositório.

Crie uma branch (git checkout -b minha-nova-feature).

Faça as alterações e comite (git commit -am 'Adicionando minha nova feature').

Envie para o repositório remoto (git push origin minha-nova-feature).

Abra um pull request para que possamos revisar suas alterações.
## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
