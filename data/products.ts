// Base de dados estática dos produtos
// Para atualizar valores, basta editar este arquivo

export interface Product {
  id: string
  name: string
  value: number
  discount: number
  emoji: string
}

export const products: Product[] = [
  { id: "ps5", name: "PlayStation 5", value: 2500, discount: 15, emoji: "🎮" },
  { id: "relogio", name: "Relógio", value: 1100, discount: 15, emoji: "⌚" },
  { id: "colar", name: "Colar", value: 2400, discount: 15, emoji: "📿" },
  { id: "trofeu", name: "Trofeu", value: 1150, discount: 15, emoji: "🏆" },
  { id: "quadro", name: "Quadro", value: 20000, discount: 15, emoji: "🖼️" },
  { id: "lubrificante", name: "Lubrificante", value: 2000, discount: 15, emoji: "🧴" },
  { id: "lingerie", name: "Lingerie", value: 1500, discount: 15, emoji: "👙" },
  { id: "vibrador", name: "Vibrador", value: 2500, discount: 15, emoji: "💜" },
  { id: "chicote", name: "Chicote", value: 1850, discount: 15, emoji: "🔥" },
  { id: "camisinha", name: "Camisinha", value: 1500, discount: 15, emoji: "💊" },
  { id: "dinheiro-sujo", name: "Dinheiro Sujo", value: 1, discount: 30, emoji: "💵" },
  { id: "barra", name: "1 BARRA", value: 50000, discount: 30, emoji: "💰" },
]

// Função auxiliar para buscar produto por ID
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

// Função auxiliar para formatar moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
