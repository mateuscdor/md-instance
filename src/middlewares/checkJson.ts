import url from "url";

export function checkJsonJid(req, res, next) {
  let data = req.body;
  if (data.jid) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' field in JSON!` }));
  }
}

export function checkJsonJidGroup(req, res, next) {
  let data = req.body;
  if (data.jid) {
    if (data.jid.endsWith('@c.us') || data.jid.endsWith('@s.whatsapp.net')) {
      return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 987654321@g.us!" }));
    } else {
      return next();
    }
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' field in JSON!` }));
  }
}

export function checkJsonJidGet(req, res, next) {
  const data = url.parse(req.url, true).query;
  if (data.jid) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' field in JSON!` }));
  }
}

export function checkJsonBody(req, res, next) {
  let data = req.body;
  if (data.jid && data.body) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' or 'body:' field in JSON!` }));
  }
}

export function checkJsonCodeGroup(req, res, next) {
  let data = req.body;
  if (data.code) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'code:' field in JSON!` }));
  }
}

export function checkJsonContact(req, res, next) {
  let data = req.body;
  if (data.jid && data.displayName && data.vcard) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'displayName:' or 'vcard:' field in JSON!` }));
  }
}

export function checkJsonLocation(req, res, next) {
  let data = req.body
  if (data.jid && data.latitude && data.longitude) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'latitude:', 'longitude:' or 'address:' field in JSON!` }));
  }
}

export function checkJsonPicture(req, res, next) {
  let data = req.body;
  if (data.jid && data.resolution) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' or 'body:' field in JSON!` }));
  }
}

export function checkJsonGroupSubject(req, res, next) {
  let data = req.body;
  if (data.jid && data.subject) {
    if (data.jid.endsWith('@c.us') || data.jid.endsWith('@s.whatsapp.net')) {
      return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 987654321@g.us!" }));
    } else {
      return next();
    }
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' or 'subject:' field in JSON!` }));
  }
}

export function checkJsonGroupDescription(req, res, next) {
  let data = req.body;
  if (data.jid && data.description) {
    if (data.jid.endsWith('@c.us') || data.jid.endsWith('@s.whatsapp.net')) {
      return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 987654321@g.us!" }));
    } else {
      return next();
    }
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' or 'description:' field in JSON!` }));
  }
}

export function checkJsonGroupSettings(req, res, next) {
  let data = req.body;
  if (data.jid && data.setting) {
    if (data.jid.endsWith('@c.us') || data.jid.endsWith('@s.whatsapp.net')) {
      return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 987654321@g.us!" }));
    } else {
      return next();
    }
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:' or 'setting:' field in JSON!` }));
  }
}

export function checkJsonCreateGroup(req, res, next) {
  let data = req.body;
  if (data.subject && data.participants) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'subject:' or 'participants:' field in JSON!` }));
  }
}

export function checkJsonButtons(req, res, next) {
  let data = req.body;
  if (data.jid && data.type && data.buttons) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'type:', 'caption:', 'buttons: []' field in JSON!` }));
  }
}

export function checkJsonList(req, res, next) {
  let data = req.body;
  if (data.jid && data.sections) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'type:', 'title:', 'sections: []' field in JSON!` }));
  }
}

export function checkJsonGroupParticipantSetting(req, res, next) {
  let data = req.body;
  if (data.jid && data.participant && data.setting) {
    if (data.jid.endsWith('@c.us') || data.jid.endsWith('@s.whatsapp.net')) {
      return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 987654321@g.us!" }));
    } else {
      return next();
    }
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'participant:', 'setting:', field in JSON!` }));
  }
}

export function checkJsonCatalog(req, res, next) {
  let data = req.body;
  if (data.jid && data.text && data.matchedText && data.title) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'title:', 'text:', 'matchedText:', field in JSON!` }));
  }
}

export function checkJsonProduct(req, res, next) {
  let data = req.body;
  if (data.jid && data.body && data.footer && data.title) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'body:', 'footer:', 'title:', field in JSON!` }));
  }
}

export function checkJsonOrder(req, res, next) {
  let data = req.body;
  if (data.jid && data.orderId && data.token && data.title) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'orderId:', 'token:', 'title:', field in JSON!` }));
  }
}

export function checkJsonWebhook(req, res, next) {
  let data = req.body;
  if (data.webhook) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'webhook:' field in JSON!` }));
  }
}

export function checkJsonLink(req, res, next) {
  let data = req.body;
  if (data.jid && data.text && data.matchedText && data.canonicalUrl) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'jid:', 'text:', 'matchedText:' or 'canonicalUrl:' field in JSON!` }));
  }
}

export function checkJsonName(req, res, next) {
  let data = req.body;
  if (data.name) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'name:', field in JSON!` }));
  }
}

export function checkJsonMessageId(req, res, next) {
  let data = req.body;
  if (data.messageId) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'messageId:', field in JSON!` }));
  }
}

export function checkJsonForwardMsg(req, res, next) {
  let data = req.body;
  if (data.key && data.message) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'key:' or 'message:' field in JSON!` }));
  }
}

export function checkJsonQuoteMsg(req, res, next) {
  let data = req.body;
  if (data.text && data.key && data.message) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'text:', 'key:' or 'message:' field in JSON!` }));
  }
}

export function checkJsonDeleteMsg(req, res, next) {
  let data = req.body;
  if (data.key) {
    return next();
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: `Missing 'text:' field in JSON!` }));
  }
}
