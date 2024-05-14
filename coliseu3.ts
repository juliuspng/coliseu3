abstract class Item {
    protected nome: string;
    protected descricao: string;

    constructor(nome: string, descricao: string) {
        this.nome = nome;
        this.descricao = descricao;
    }

    abstract aplicarBeneficios(personagem: Personagem): void;
    abstract removerBeneficios(personagem: Personagem): void;
}

class ItemInventario {
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

class Arma extends Item {
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

class Poção extends Item {
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

class Inventario {
    private itens: ItemInventario[];
    private quantidadeMaximaItens: number;

    constructor(quantidadeMaximaItens: number) {
        this.itens = [];
        this.quantidadeMaximaItens = quantidadeMaximaItens;
    }

    adicionarItem(item: Item): void {
        const itemIndex = this.itens.findIndex(itemInventario => itemInventario.getItem() === item);
        if (itemIndex !== -1) {
            this.itens[itemIndex].setQuantidade(this.itens[itemIndex].getQuantidade() + 1);
        } else {
            if (this.itens.length >= this.quantidadeMaximaItens) {
                throw new Error("inventário cheio");
            }
            this.itens.push(new ItemInventario(item));
        }
    }
}

class Personagem {
    private nome: string;
    private HP: number;
    private MP: number;
    private forca: number;
    private defesa: number;
    private inventario: ItemInventario[];
    private arma: Arma | null;

    constructor(nome: string, HP: number, MP: number, forca: number, defesa: number, inventario: ItemInventario[], arma: Arma | null) {
        this.nome = nome;
        this.HP = HP;
        this.MP = MP;
        this.forca = forca;
        this.defesa = defesa;
        this.inventario = inventario;
        this.arma = arma;
    }

    abrirInventario(): void {
        console.log("itens do inventário:");
        this.inventario.forEach((item, index) => {
            console.log(`${index + 1} - ${item.getItem().nome} (${item.getQuantidade()})`);
        });
        const totalItens = this.inventario.reduce((total, item) => total + item.getQuantidade(), 0);
        console.log(`total: ${totalItens}/${this.getMaximoItens()}`);
    }

    usarItem(item: Item): void {
        const itemIndex = this.inventario.findIndex(inventarioItem => inventarioItem.getItem() === item);
        if (itemIndex !== -1) {
            if (item instanceof Poção) {
                this.inventario[itemIndex].setQuantidade(this.inventario[itemIndex].getQuantidade() - 1);
            }
            if (item instanceof Arma) {
                this.arma = item;
            }
        }
    }

    exibirInformacoes(): void {
        console.log(`nome: ${this.nome}`);
        console.log(`hp: ${this.HP}`);
        console.log(`mp: ${this.MP}`);
        console.log(`força: ${this.forca}`);
        console.log(`defesa: ${this.defesa}`);
        console.log(`arma equipada: ${this.arma ? this.arma.nome : "nenhuma"}`);
    }

    desequiparArma(): void {
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
}


class Menu {
    imprimirMenu(): number {
        console.log("1. equipar arma;");
        console.log("2. tomar poção;");
        console.log("3. adicionar arma ao inventário;");
        console.log("4. adicionar poção ao inventário;");
        console.log("5. imprimir info;");
        console.log("6. desequipar arma;");
        console.log("0. sair;");
        
        const opcao = Number(prompt("escolha uma opção: "));
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
                    console.log("saindo da aplicação...");
                    break;
                default:
                    console.log("opção inválida. tente novamente.");
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
            console.log(`${armaSelecionada.nome} equipada.`);
        } else {
            console.log("arma não encontrada.");
        }
    }

    private tomarPocao(): void {
        console.log("escolha a poção a usar:");
        this.personagem.abrirInventarioPocoes();
        const opcao = Number(prompt("escolha uma poção: "));
        const pocaoSelecionada = this.personagem.getPocaoByIndex(opcao - 1);
        if (pocaoSelecionada) {
            this.personagem.usarItem(pocaoSelecionada);
            console.log(`${pocaoSelecionada.nome} utilizada.`);
        } else {
            console.log("poção não encontrada.");
        }
    }

    private adicionarArmaAoInventario(): void {
        const nome = prompt("informe o nome da arma: ");
        const descricao = prompt("informe a descrição da arma: ");
        const quantidade = Number(prompt("informe a quantidade de armas: "));
        const novaArma = new Arma(nome, descricao);
        this.personagem.getInventario().adicionarItem(novaArma, quantidade);
        console.log(`${quantidade} ${nome} adicionada ao inventário.`);
    }

    private adicionarPocaoAoInventario(): void {
        const nome = prompt("informe o nome da poção: ");
        const descricao = prompt("informe a descrição da poção: ");
        const quantidade = Number(prompt("informe a quantidade de poções: "));
        const novaPocao = new Poção(nome, descricao);
        this.personagem.getInventario().adicionarItem(novaPocao, quantidade);
        console.log(`${quantidade} ${nome} adicionada ao inventário.`);
    }

    private imprimirInfo(): void {
        this.personagem.exibirInformacoes();
    }

    private desequiparArma(): void {
        this.personagem.desequiparArma();
        console.log("arma desequipada.");
    }
}
