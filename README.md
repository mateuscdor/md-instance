# Instalação

Antes de instalar, edite o arquivo **package.json** e mude para o Webhook/Porta/Token que irá utilizar.

- [Webhook.site](https://webhook.site)

- `npm install npm pm2 -g`
- `git clone https://github.com/barkerpedro/md-instance.git`
- `cd md-instance`
- `npm install`
- `npm start`

# Informações

Será criado a API com as seguintes informações:

- **Porta**: 11111
- **Token**: teste123
- **Webhook**: http://webhook.site/

# Funções

| Descrição                                               | Implementado |
| ------------------------------------------------------- | ------------ |
| receber mensagens                                       | ✅           |
| enviar mensagens                                        | ✅           |
| capturar qrcode (base64)                                | ✅           |
| enviar imagem (jpeg/png/webp) (url/base64)              | ✅           |
| enviar gif (gif/mp4) (url/base64)                       | ✅           |
| enviar áudio (mp3/mp4) (url/base64)                     | ✅           |
| enviar ptt (mp3/mp4/ogg) (url/base64)                   | ✅           |
| enviar video (mp4/ogg/mpeg) (url/base64)                | ✅           |
| enviar figurinha (webp/jpeg/png) (url/base64)           | ✅           |
| enviar documento (pdf/doc/txt/xls/html) (url/base64)    | ✅           |
| puxar contatos                                          | ✅           |
| puxar mensagens                                         | ✅           |
| puxar chats                                             | ✅           |
| enviar contatos                                         | ✅           |
| enviar localização                                      | ✅           |
| enviar lista                                            | ✅           |
| enviar botões (com imagem/documento/vídeo)              | ✅           |
| enviar botões com template (com imagem/documento/vídeo) | ✅           |
| checar número                                           | ✅           |
| simular '..escrevendo'                                  | ✅           |
| enviar leitura de mensagem                              | ✅           |
| mencionar número na conversa                            | ✅           |
| criar grupo                                             | ✅           |
| sair de grupo                                           | ✅           |
| puxar informações de grupo                              | ✅           |
| puxar grupos                                            | ✅           |
| puxar participantes do grupo                            | ✅           |
| puxar url de imagem de perfil/grupo                     | ✅           |
| mudar imagem de perfil/grupo                            | ✅           |
| pegar código de convite de grupo                        | ✅           |
| aceitar código de convite de grupo                      | ✅           |
| alterar código de convite de grupo                      | ✅           |
| configurar opções de grupo                              | ✅           |
| adicionar/remover participantes no grupo                | ✅           |
| promover/rebaixar participantes como admin              | ✅           |
| reiniciar instância                                     | ✅           |
| deslogar celular da instância                           | ✅           |
| encaminhar mensagens                                    | ✅           |
