"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { products, getProductById, formatCurrency, type Product } from "@/data/products"

interface CartItem extends Product {
  quantity: number
}

export function Calculator() {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [customDiscount, setCustomDiscount] = useState<number | string>("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showTotal, setShowTotal] = useState(false)
  const [panelPercent, setPanelPercent] = useState<number>(100)

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId)
    const product = getProductById(productId)
    if (product) {
      setCustomDiscount(product.discount)
    }
  }

  const addToCart = () => {
    if (!selectedProduct) return

    const product = getProductById(selectedProduct)
    if (!product) return

    const discountValue = typeof customDiscount === "number" ? customDiscount : Number(customDiscount) || 0

    const existingItem = cart.find((item) => item.id === selectedProduct)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === selectedProduct ? { ...item, quantity: item.quantity + quantity, discount: discountValue } : item,
        ),
      )
    } else {
      setCart([...cart, { ...product, discount: discountValue, quantity }])
    }

    setSelectedProduct("")
    setQuantity(1)
    setCustomDiscount("")
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)))
  }

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setShowTotal(false)
  }

  const calculateTotal = () => {
    setShowTotal(true)
  }

  const getTotalBruto = () => {
    return cart.reduce((total, item) => total + item.value * item.quantity, 0)
  }

  const getCustoTransacao = () => {
    return cart.reduce((total, item) => {
      const discountAmount = item.value * (item.discount / 100) * item.quantity
      return total + discountAmount
    }, 0)
  }

  const getValorPainel = () => {
    const custoTransacao = getCustoTransacao()
    return custoTransacao * (panelPercent / 100)
  }

  const getValorCliente = () => {
    return getTotalBruto() - getCustoTransacao()
  }

  const getLucroVendedor = () => {
    return getCustoTransacao() - getValorPainel()
  }

  const displayDiscount = customDiscount === "" ? "" : customDiscount

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 text-[#4ade80]">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Calculadora de Itens</h1>
      </div>

      {/* Add Product Section */}
      <Card className="bg-[#252d3d] border-[#374151]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#4ade80] text-lg">Adicionar Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <label className="text-sm text-gray-300">Produto</label>
              <Select value={selectedProduct} onValueChange={handleProductSelect}>
                <SelectTrigger className="bg-[#1a1f2e] border-[#374151] text-white w-full">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="bg-[#252d3d] border-[#374151] z-50">
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      className="text-gray-200 focus:bg-[#374151] focus:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span>{product.emoji}</span>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-400">({formatCurrency(product.value)})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Quantidade</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="bg-[#1a1f2e] border-[#374151] text-white w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Desconto (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={displayDiscount}
                placeholder={selectedProduct ? "" : "-"}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === "") {
                    setCustomDiscount("")
                  } else {
                    setCustomDiscount(Math.min(100, Math.max(0, Number.parseFloat(val) || 0)))
                  }
                }}
                className="bg-[#1a1f2e] border-[#374151] text-white w-full"
                disabled={!selectedProduct}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">% Painel</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={panelPercent}
                onChange={(e) => setPanelPercent(Math.min(100, Math.max(0, Number.parseFloat(e.target.value) || 0)))}
                className="bg-[#1a1f2e] border-[#374151] text-white w-full"
              />
            </div>
          </div>

          <Button
            onClick={addToCart}
            disabled={!selectedProduct}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>

      {/* Cart Items Section */}
      <Card className="bg-[#252d3d] border-[#374151]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#4ade80] text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Itens no Carrinho
            {cart.length > 0 && (
              <span className="bg-[#4ade80] text-black text-xs font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Nenhum item no carrinho</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-[#1a1f2e] p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatCurrency(item.value)} x {item.quantity} ({item.discount}% desc.)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 bg-[#374151] border-[#4b5563] hover:bg-[#4b5563] text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 bg-[#374151] border-[#4b5563] hover:bg-[#4b5563] text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 bg-[#ef4444] hover:bg-[#dc2626]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={calculateTotal}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium"
              >
                Calcular Total
              </Button>
              <Button onClick={clearCart} className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium">
                Zerar Carrinho
              </Button>
            </div>
          )}

          {showTotal && cart.length > 0 && (
            <div className="mt-4 p-4 bg-[#1a1f2e] rounded-lg border border-[#4ade80]">
              <div className="space-y-3">
                <h3 className="text-[#4ade80] font-bold text-lg border-b border-[#374151] pb-2">Resumo</h3>

                <div className="space-y-2 pb-3 border-b border-[#374151]">
                  {cart.map((item) => {
                    const itemTotalCheio = item.value * item.quantity
                    const itemCustoTransacao = item.value * (item.discount / 100) * item.quantity
                    return (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between text-white">
                          <span>
                            {item.emoji} {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium">{formatCurrency(itemTotalCheio)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs pl-6">
                          <span>Custo transação ({item.discount}%)</span>
                          <span className="text-orange-400">- {formatCurrency(itemCustoTransacao)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-[#374151]/50 -mx-4 px-4 py-3 border-b border-[#374151]">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>VALOR TOTAL:</span>
                    <span className="text-[#fbbf24]">{formatCurrency(getTotalBruto())}</span>
                  </div>
                </div>

                <div className="flex justify-between text-gray-300 pt-2">
                  <span>Custo de Compra (desconto):</span>
                  <span className="text-orange-400">- {formatCurrency(getCustoTransacao())}</span>
                </div>

                <div className="flex justify-between text-white font-medium">
                  <span>Depositar no Painel ({panelPercent}%):</span>
                  <span className="text-[#60a5fa] text-lg">{formatCurrency(getValorPainel())}</span>
                </div>

                <div className="flex justify-between text-white font-medium">
                  <span>Lucro do Vendedor:</span>
                  <span className="text-[#a855f7] text-lg">{formatCurrency(getLucroVendedor())}</span>
                </div>

                <div className="flex justify-between text-white font-medium border-t border-[#374151] pt-3">
                  <span>Pagar ao Cliente:</span>
                  <span className="text-[#4ade80] text-lg">{formatCurrency(getValorCliente())}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
