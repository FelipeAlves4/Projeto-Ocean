import { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddProductDialog } from './AddProductDialog';
import { useNavigation } from '@/contexts/NavigationContext';

interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  category: string;
  variants: ProductVariant[];
  createdAt: Date;
}

export const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { addProductModalOpen, setAddProductModalOpen } = useNavigation();

  // Sincronizar com o estado global do modal
  useEffect(() => {
    if (addProductModalOpen) {
      setIsAddDialogOpen(true);
      setAddProductModalOpen(false);
    }
  }, [addProductModalOpen, setAddProductModalOpen]);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
    setIsAddDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciar Produtos</h2>
          <p className="text-muted-foreground">Adicione e gerencie seus produtos</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando seu primeiro produto
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Preço base:</span>
                    <span className="font-semibold">R$ {product.basePrice.toFixed(2)}</span>
                  </div>
                  
                  {product.variants.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Variações:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.variants.map((variant) => (
                          <Badge key={variant.id} variant="outline" className="text-xs">
                            {variant.size} - R$ {variant.price.toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};