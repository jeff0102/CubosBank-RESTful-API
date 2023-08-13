import express from "express";
import roteador from "./rotas/rotas.mjs";
import { validarSenha, 
    obterContaPorNumeroESenha, 
    contaParaExcluir, 
    obterContaValor, 
    obterContaOeD, 
    verificarCPFExiste, 
    verificarContaExiste, 
    verificarEmailExiste,
    verificarReqMudar, } from "./intermediario/intermediarios.mjs";

const app = express();

app.use(express.json());
app.get("/contas/extrato", obterContaPorNumeroESenha)
app.get("/contas/saldo", obterContaPorNumeroESenha);
app.get("/contas", validarSenha  );
app.post("/contas", verificarReqMudar, verificarCPFExiste, verificarEmailExiste);
app.delete("/contas/:conta", contaParaExcluir);
app.post("/transacoes/depositar", obterContaValor);
app.post("/transacoes/sacar", obterContaValor);
app.post("/transacoes/transferir", obterContaOeD);
app.put("/contas/:numeroConta/usuario", verificarReqMudar, verificarContaExiste, verificarCPFExiste, verificarEmailExiste);
app.use(roteador);

export default app;

