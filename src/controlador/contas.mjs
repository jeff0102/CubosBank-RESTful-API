import bancoDeDados from "../banco-de-dados/bancodedados.mjs";
import { format } from "date-fns";

const DataAtualFormatada = () => {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss");
};

const obterContas = (req, res) => {
  return res.status(200).json(bancoDeDados.contas);
};

const obterSaldo = (req, res) => {   
  const { conta } = req; 
  return res.status(200).json({ saldo: conta.saldo });
};

const obterExtrato = (req, res) => {
  const { conta } = req;
  const extrato = {
    depositos: bancoDeDados.depositos.filter((d) => d.numero_conta === conta.numero),
    saques: bancoDeDados.saques.filter((s) => s.numero_conta === conta.numero),
    transferenciasEnviadas: bancoDeDados.transferencias.filter(
      (t) => t.numero_conta_origem === conta.numero
    ),
    transferenciasRecebidas: bancoDeDados.transferencias.filter(
      (t) => t.numero_conta_destino === conta.numero
    ),
  };

  return res.status(200).json(extrato);
};

const excluirConta = (req, res) => {
  const { contaIndex } = req;
  bancoDeDados.contas.splice(contaIndex, 1);
  return res.status(204).json({ mensagem: "Conta excluída com sucesso" });
}

const depositar = (req, res) => {
  const { conta } = req;
  const { valor } = req.body;

  conta.saldo += valor;
  bancoDeDados.depositos.push({
    data: DataAtualFormatada(),
    numero_conta: conta.numero,
    valor,
  });
  return res.status(201).json({ mensagem: "Deposito realizado com sucesso" });
};

const sacar = (req, res) => {
  const { conta } = req;
  const { valor } = req.body;

  conta.saldo -= valor;

  bancoDeDados.saques.push({
    data: DataAtualFormatada(),
    numero_conta: conta.numero,
    valor
  });
  return res.status(200).json({ mensagem: "Saque realizado com sucesso" });
};

const transferir = (req, res) => {
  const { contaO, contaD } = req;
  const { valor } = req.body;

  contaO.saldo -= valor;
  contaD.saldo += valor;


  bancoDeDados.transferencias.push({
    data: DataAtualFormatada(),
    numero_conta_origem: contaO.numero,
    numero_conta_destino: contaD.numero,
    valor
  });
  return res.status(200).json({ mensagem: "Transferência realizada com sucesso" });
};

const atualizarUsuario = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { conta } = req;

  if (nome) {
    conta.usuario.nome = nome;
  }

  if (cpf) {
    conta.usuario.cpf = cpf;
  }

  if (data_nascimento) {
    conta.usuario.data_nascimento = data_nascimento;
  }

  if (telefone) {
    conta.usuario.telefone = telefone;
  }

  if (email) {
    conta.usuario.email = email;
  }

  if (senha) {
    conta.usuario.senha = senha;
  }

  return res.status(200).json({ mensagem: "Conta atualizada com sucesso" });
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const saldoInicial = 0;

    const numerosContas = bancoDeDados.contas.map((c) => Number(c.numero));
    const numeroConta = numerosContas.length === 0 ? 1 : Math.max(...numerosContas) + 1;

    const dataNascimentoFormatada = format(new Date(data_nascimento), "yyyy-MM-dd");
  
    const novaConta = {
      numero: numeroConta.toString(),
      saldo: saldoInicial,
      usuario: {
        nome,
        cpf,
        data_nascimento: dataNascimentoFormatada,
        telefone,
        email,
        senha,
      },
    };
  
    bancoDeDados.contas.push(novaConta);
  
    return res.status(201).json(novaConta);
  };

export { obterContas,
  obterSaldo,
  obterExtrato,
  excluirConta,
  depositar, 
  sacar, 
  transferir, 
  atualizarUsuario,
  criarConta};

