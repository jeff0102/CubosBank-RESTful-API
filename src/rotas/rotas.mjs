import express from "express";
import { obterContas, 
    obterSaldo, 
    obterExtrato, 
    excluirConta, 
    depositar, 
    sacar, 
    transferir, 
    atualizarUsuario, 
    criarConta } from "../controlador/contas.mjs";

const roteador = express();

roteador.get("/contas", obterContas)
roteador.get("/contas/saldo", obterSaldo)
roteador.get("/contas/extrato", obterExtrato)
roteador.delete("/contas/:conta", excluirConta)
roteador.post("/transacoes/depositar", depositar)
roteador.post("/transacoes/sacar", sacar)
roteador.post("/transacoes/transferir", transferir)
roteador.post("/contas", criarConta)
roteador.put("/contas/:numeroConta/usuario", atualizarUsuario )


export default roteador;