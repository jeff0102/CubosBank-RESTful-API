import bancoDeDados from "../banco-de-dados/bancodedados.mjs";

const validarSenha = (req, res, next) => {

  if (req.path == "/contas/saldo" || req.path == "/contas/extrato" || req.path == "/contas/:conta") {
    // Não aplicar o middleware em /saldo e /extrato
    return next();
  }
  const { senha_banco } = req.query;

    if (!senha_banco) {
      return res.status(400).json({ mensagem: "Senha ausente ou não é numérica" });
    }

    if (senha_banco !== bancoDeDados.banco.senha) {
      return res.status(401).json({ mensagem: "Senha incorreta." });
    }
    next();
};

const obterContaPorNumeroESenha = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || isNaN(numero_conta) || !senha || isNaN(senha)) {
    return res.status(400).json({ mensagem: "Conta/Senha ausentes ou não numéricas" });
  }

  const conta = bancoDeDados.contas.find((c) => c.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha errada" });
  }

  req.conta = conta;

  if (req.method === "PUT") {
    next();
  }
  next();

};

const contaParaExcluir = (req, res, next) => {
  if (req.method === "DELETE") {

  const { conta } = req.params;
  const contaIndex = bancoDeDados.contas.findIndex((c) => c.numero === conta);

  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  if (bancoDeDados.contas[contaIndex].saldo > 0) {
    return res.status(403).json({ mensagem: "Não é possível excluir contas com saldo"});
  }

  req.contaIndex = contaIndex;

  next();
  } else {
    next();
  }
};

const obterContaValor = (req, res, next) => {

  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || isNaN(numero_conta) || !valor || isNaN(valor)) {
    return res.status(400).json({ mensagem: "Conta/Valor ausentes ou não numéricos" });
  } else if (valor <= 0) {
    return res.status(400).json({ mensagem: "O valor precisa ser maior que '0'" });
  }

  const conta = bancoDeDados.contas.find((c) => c.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  req.conta = conta;

  
  if (req.path.startsWith("/") && req.method === "POST" && "senha" in req.body && "valor" in req.body) {

    if (!senha || isNaN(senha)) {
      return res.status(400).json({ mensagem: "Senha ausente ou não é numérica" });
    }
    if (conta.usuario.senha !== senha) {
      return res.status(401).json({ mensagem: "Senha errada" });
    }
    if (conta.saldo < valor) {

      return res.status(403).json({ mensagem: "Saldo insuficiente" });
    }
  }

  next();
};

const obterContaOeD = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;

  if (!numero_conta_origem || isNaN(numero_conta_origem)) {
    return res.status(400).json({ mensagem: "Conta origem inválida" });
  }

  if (!numero_conta_destino || isNaN(numero_conta_destino)) {
    return res.status(400).json({ mensagem: "Conta destino inválida" });
  }

  if (!valor || isNaN(valor) || valor <= 0) {
    return res.status(400).json({ mensagem: "Valor inválido" });
  }

  const contaOrigem = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_origem);
  const contaDestino = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_destino);

  if (!contaOrigem) {
    return res.status(404).json({ mensagem: "Conta origem não encontrada" });
  }

  if (!contaDestino) {
    return res.status(404).json({ mensagem: "Conta destino não encontrada" });
  }

  if (contaOrigem.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "Senha incorreta" });
  }

  if (contaOrigem.saldo < valor) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }

  req.contaO = contaOrigem;
  req.contaD = contaDestino;
  next();
};

const verificarContaExiste = (req, res, next) => {
  const { numeroConta } = req.params;

  const conta = bancoDeDados.contas.find((c) => c.numero === numeroConta);
  
  if (!conta) {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }

  req.conta = conta;
  next();
};

const verificarReqMudar = (req, res, next) => {

  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (req.method === "PUT") {

  if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
    return res.status(400).json({ mensagem: "Pelo menos um campo deve ser alterado" });
  }
};

  if (req.method === "POST") {

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
      return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }
  };

  next();
};

const verificarCPFExiste = (req, res, next) => {

  const { cpf } = req.body;

  if (req.method === "PUT") {

  if (cpf) {

    const contaExistente = bancoDeDados.contas.find((c) => c.usuario.cpf === cpf);

    if (contaExistente !== undefined) {
      return res.status(400).json({ mensagem: "Já existe outra conta com o mesmo CPF" });
    }
  }
}

if (req.method === "POST") {

  if (cpf) {
    const contaExistente = bancoDeDados.contas.find((c) => c.usuario.cpf === cpf);

    if (contaExistente !== undefined) {
      return res
        .status(400)
        .json({ mensagem: "Já existe outra conta com o mesmo CPF" });
    }
  }
}
  next();
}

const verificarEmailExiste = (req, res, next) => {

  if (req.method === "PUT") {
  const { email } = req.body;
  if (email) {
    const contaExistente = bancoDeDados.contas.find((c) => c.usuario.email === email);

    if (contaExistente !== undefined) {
      return res.status(400).json({ mensagem: "Já existe outra conta com o mesmo E-mail" });
    }
  }
}

if (req.method === "POST") {
  const { email } = req.body;
  if (email) {
    const contaExistente = bancoDeDados.contas.find((c) => c.usuario.email === email);

    if (contaExistente !== undefined) {
      return res.status(400).json({ mensagem: "Já existe outra conta com o mesmo E-mail" });
    }
  }
}

  next();
};


export { 
  validarSenha, 
  obterContaPorNumeroESenha, 
  contaParaExcluir, 
  obterContaValor, 
  obterContaOeD,
  verificarCPFExiste,
  verificarContaExiste,
  verificarEmailExiste,
  verificarReqMudar,
};
