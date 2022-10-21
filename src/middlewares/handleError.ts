const port = process.argv[2];

import shell from "shelljs";

export function handleError(err, req, res, next) {
  if (err == "Error: forbidden" || err == "BaileysError: Unexpected status in 'action': Forbidden(403)") {
    console.log("Proibido: " + err);
    return res.status(500).send(JSON.stringify({ accountStatus: "error", message: 'Forbidden!' }));
  } else if (err == "TypeError: Cannot read property 'key' of undefined" ||
    err == "TypeError: Cannot read property 'message' of undefined") {
    console.log("Mensagem não existe ou foi deletada: " + err);
    return res.status(500).send(JSON.stringify({ accountStatus: "error", message: "Message has been deleted or does not exist!" }));
  } else if (err == "Error: not-authorized" || err == "BaileysError: Unexpected status in 'action': Unauthorized(401)") {
    console.log("Sem autorização: " + err);
    return res.status(500).send(JSON.stringify({ accountStatus: "error", message: 'Without authorization!' }));
  } else if (err == "Error: item-not-found") {
    console.log("Não existe: " + err);
    return res.status(500).send(JSON.stringify({ accountStatus: "error", message: 'Not exist!' }));
  } else if (err == 'Error: Connection Closed') {
    console.log("Sincronizando API: " + err);
    res.status(500).send(JSON.stringify({ accountStatus: "error", message: 'Syncing API!' }));
    return shell.exec(`pm2 -sf restart ${port} --update-env`);
  } else {
    console.log("Erro interno: " + err);
    return res.status(500).send(JSON.stringify({ error: 'Something failed!' }));
  }
}
