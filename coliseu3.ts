abstract class Item {       //1a
    protected nome: string;
    protected descricao: string;

    constructor(nome: string, descricao: string) {
        this.nome = nome;
        this.descricao = descricao;
    }

    getNome(): string {
        return this.nome;
    }

    getDescricao(): string {
        return this.descricao;
    }

    abstract aplicarBeneficios(personagem: Personagem): void;
    abstract removerBeneficios(personagem: Personagem): void;
}

class ItemInventario { //b
    private quantidade: number;
    private item: Item;

    constructor(item: Item, quantidade: number = 1) {
        this.item = item;
        this.quantidade = quantidade;
    }

    getItem(): Item {
        return this.item;
    }

    getQuantidade(): number {
        return this.quantidade;
    }

    setQuantidade(quantidade: number): void {
        this.quantidade = quantidade;
    }
}

class Arma extends Item {   //c
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }

    aplicarBeneficios(personagem: Personagem): void {
        personagem.aumentarAtaque(10);
        personagem.aumentarDefesa(5);
    }

    removerBeneficios(personagem: Personagem): void {
        personagem.diminuirAtaque(10);
        personagem.diminuirDefesa(5);
    }
}

class Pocao extends Item {  //d
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }

    aplicarBeneficios(personagem: Personagem): void {
        personagem.restaurarHP(0.5);
        personagem.restaurarMP(0.2);
    }

    removerBeneficios(personagem: Personagem): void {       




    }
}

class Inventario {  //e
    private itens: ItemInventario[];
    private quantidadeMaximaItens: number;

    constructor(quantidadeMaximaItens: number) {
        this.itens = [];
        this.quantidadeMaximaItens = quantidadeMaximaItens;
    }

    adicionarItem(item: Item, quantidade: number = 1): void {
        const itemIndex = this.itens.findIndex(itemInventario => itemInventario.getItem() === item);
        if (itemIndex !== -1) {
            this.itens[itemIndex].setQuantidade(this.itens[itemIndex].getQuantidade() + quantidade);
        } else {
            if (this.itens.length >= this.quantidadeMaximaItens) {
                throw new Error("inventario cheio");
            }
            this.itens.push(new ItemInventario(item, quantidade));
        }
    }

    getItens(): ItemInventario[] {
        return this.itens;
    }
}

class Personagem {  //h
    private nome: string;
    private HP: number;
    private MP: number;
    private forca: number;
    private defesa: number;
    private inventario: Inventario;
    private arma: Arma | null;

    constructor(nome: string, HP: number, MP: number, forca: number, defesa: number) {
        this.nome = nome;
        this.HP = HP;
        this.MP = MP;
        this.forca = forca;
        this.defesa = defesa;
        this.inventario = new Inventario(20);
        this.arma = null;
    }

    abrirInventario(): void {
        console.log("itens do inventario:");
        this.inventario.getItens().forEach((item, index) => {
            console.log(`${index + 1} - ${item.getItem().getNome()} (${item.getQuantidade()})`);
        });
        const totalItens = this.inventario.getItens().reduce((total, item) => total + item.getQuantidade(), 0);
        console.log(`total: ${totalItens}/${this.getMaximoItens()}`);
    }

    usarItem(item: Item): void {
        const itemIndex = this.inventario.getItens().findIndex(inventarioItem => inventarioItem.getItem() === item);
        if (itemIndex !== -1) {
            if (item instanceof Pocao) {
                this.inventario.getItens()[itemIndex].setQuantidade(this.inventario.getItens()[itemIndex].getQuantidade() - 1);
                item.aplicarBeneficios(this);
            }
            if (item instanceof Arma) {
                this.arma = item;
                item.aplicarBeneficios(this);
            }
        }
    }

    exibirInformacoes(): void {
        console.log(`nome: ${this.nome}`);
        console.log(`HP: ${this.HP}`);
        console.log(`MP: ${this.MP}`);
        console.log(`força: ${this.forca}`);
        console.log(`defesa: ${this.defesa}`);
        console.log(`arma equipada: ${this.arma ? this.arma.getNome() : "nenhuma"}`);
    }

    desequiparArma(): void {
        if (this.arma) {
            this.arma.removerBeneficios(this);
        }
        this.arma = null;
    }

    private getMaximoItens(): number {
        return 20;
    }

    aumentarAtaque(valor: number): void {
        this.forca += valor;
    }

    diminuirAtaque(valor: number): void {
        this.forca -= valor;
    }

    aumentarDefesa(valor: number): void {
        this.defesa += valor;
    }

    diminuirDefesa(valor: number): void {
        this.defesa -= valor;
    }

    restaurarHP(porcentagem: number): void {
        this.HP += this.HP * porcentagem;
    }

    restaurarMP(porcentagem: number): void {
        this.MP += this.MP * porcentagem;
    }

    getInventario(): Inventario {
        return this.inventario;
    }

    abrirInventarioArmas(): void {
        const armas = this.inventario.getItens().filter(itemInventario => itemInventario.getItem() instanceof Arma);
        armas.forEach((item, index) => {
            console.log(`${index + 1} - ${item.getItem().getNome()} (${item.getQuantidade()})`);
        });
    }

    getArmaByIndex(index: number): Arma | null {
        const armas = this.inventario.getItens().filter(itemInventario => itemInventario.getItem() instanceof Arma);
        return armas[index] ? (armas[index].getItem() as Arma) : null;
    }

    abrirInventarioPocoes(): void {
        const pocoes = this.inventario.getItens().filter(itemInventario => itemInventario.getItem() instanceof Pocao);
        pocoes.forEach((item, index) => {
            console.log(`${index + 1} - ${item.getItem().getNome()} (${item.getQuantidade()})`);
        });
    }

    getPocaoByIndex(index: number): Pocao | null {
        const pocoes = this.inventario.getItens().filter(itemInventario => itemInventario.getItem() instanceof Pocao);
        return pocoes[index] ? (pocoes[index].getItem() as Pocao) : null;
    }

    equiparArma(arma: Arma): void {
        this.desequiparArma();
        this.arma = arma;
        arma.aplicarBeneficios(this);
    }
}

class ItemMenu {   //f
    private opcao: number;
    private textoOpcao: string;

    constructor(opcao: number, textoOpcao: string) {
        this.opcao = opcao;
        this.textoOpcao = textoOpcao;
    }

    getOpcao(): number {
        return this.opcao;
    }

    getTextoOpcao(): string {
        return this.textoOpcao;
    }
}



class Menu {  //g
    private itensMenu: ItemMenu[];

    constructor() {
        this.itensMenu = [
            new ItemMenu(1, "equipar arma"),
            new ItemMenu(2, "tomar poção"),
            new ItemMenu(3, "adicionar arma ao inventario"),
            new ItemMenu(4, "adicionar poção ao inventario"),
            new ItemMenu(5, "imprimir info"),
            new ItemMenu(6, "desequipar arma"),
            new ItemMenu(0, "sair")
        ];
    }

    imprimirMenu(): number {
        this.itensMenu.forEach(item => {
            console.log(`${item.getOpcao()}. ${item.getTextoOpcao()}`);
        });

        const opcao = Number(prompt("escolha uma opção:"));
        return opcao;
    }
}


class Aplicacao {
    private personagem: Personagem;
    private menu: Menu;

    constructor(personagem: Personagem) {
        this.personagem = personagem;
        this.menu = new Menu();
    }

    executar(): void {
        let opcao: number;

        do {
            opcao = this.menu.imprimirMenu();

            switch (opcao) {
                case 1:
                    this.equiparArma();
                    break;
                case 2:
                    this.tomarPocao();
                    break;
                case 3:
                    this.adicionarArmaAoInventario();
                    break;
                case 4:
                    this.adicionarPocaoAoInventario();
                    break;
                case 5:
                    this.imprimirInfo();
                    break;
                case 6:
                    this.desequiparArma();
                    break;
                case 0:
                    console.log("saindo da aplicação..");
                    break;
                default:
                    console.log("opção invalida por favor tente novamente");
            }
        } while (opcao !== 0);
    }

    private equiparArma(): void {
        console.log("escolha a arma a equipar:");
        this.personagem.abrirInventarioArmas();
        const opcao = Number(prompt("escolha uma arma: "));
        const armaSelecionada = this.personagem.getArmaByIndex(opcao - 1);
        if (armaSelecionada) {
            this.personagem.equiparArma(armaSelecionada);
            console.log(`${armaSelecionada.getNome()} equipada`);
        } else {
            console.log("arma não encontrada");
        }
    }

    private tomarPocao(): void {
        console.log("escolha a poção a usar:");
        this.personagem.abrirInventarioPocoes();
        const opcao = Number(prompt("escolha uma poção: "));
        const pocaoSelecionada = this.personagem.getPocaoByIndex(opcao - 1);
        if (pocaoSelecionada) {
            this.personagem.usarItem(pocaoSelecionada);
            console.log(`${pocaoSelecionada.getNome()} utilizada`);
        } else {
            console.log("poção não encontrada");
        }
    }

    private adicionarArmaAoInventario(): void {
        const nome = prompt("informe o nome da arma ") ?? "";  //isso da "??" eu admito que fui atras no gpt pq as classes arma e poção esperavam string e podia retornar null e eu não sabia oq fazer
        const descricao = prompt("informe a descrição da arma") ?? "";
        const quantidade = Number(prompt("informe a quantidade de armas "));
        const novaArma = new Arma(nome, descricao);
        this.personagem.getInventario().adicionarItem(novaArma, quantidade);
        console.log(`${quantidade} ${nome} adicionada ao inventário`);
    }
    
    private adicionarPocaoAoInventario(): void {
        const nome = prompt("informe o nome da poção") ?? "";
        const descricao = prompt("informe a descrição da poção") ?? "";
        const quantidade = Number(prompt("informe a quantidade de poções"));
        const novaPocao = new Pocao(nome, descricao);
        this.personagem.getInventario().adicionarItem(novaPocao, quantidade);
        console.log(`${quantidade} ${nome} adicionada ao inventario`);
    }

    private imprimirInfo(): void {
        this.personagem.exibirInformacoes();
    }

    private desequiparArma(): void {
        this.personagem.desequiparArma();
        console.log("arma desequipada.");
    }
}