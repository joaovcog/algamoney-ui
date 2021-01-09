import { format } from "date-fns";

export class Pessoa {
    codigo: number;
}

export class Categoria {
    codigo: number;
}

export class Lancamento {
    codigo: number;
    tipo: string = 'RECEITA';
    descricao: string;
    dataVencimento: Date;
    dataPagamento: Date;
    valor: number;
    observacao: string;
    pessoa = new Pessoa();
    categoria = new Categoria();

    static toJson(lancamento: Lancamento): any {
        return {
            ...lancamento,
            dataVencimento: format(lancamento.dataVencimento, 'yyyy-MM-dd'),
            dataPagamento: format(lancamento.dataPagamento, 'yyyy-MM-dd'),
        }
    }
}