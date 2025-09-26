import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  basePrice: z.number().min(0.01, 'Preço deve ser maior que zero'),
  image: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

export const AddProductDialog = ({ open, onOpenChange, onAddProduct }: AddProductDialogProps) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState({ size: '', price: '', stock: '' });
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      basePrice: 0,
      image: '',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    if (newVariant.size && newVariant.price && newVariant.stock) {
      const variant: ProductVariant = {
        id: crypto.randomUUID(),
        size: newVariant.size,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock),
      };
      setVariants([...variants, variant]);
      setNewVariant({ size: '', price: '', stock: '' });
    }
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const onSubmit = (data: ProductFormData) => {
    onAddProduct({
      name: data.name,
      description: data.description,
      category: data.category,
      basePrice: data.basePrice,
      image: imagePreview,
      variants,
    });
    
    // Reset form
    form.reset();
    setVariants([]);
    setNewVariant({ size: '', price: '', stock: '' });
    setImagePreview('');
  };

  const handleClose = () => {
    form.reset();
    setVariants([]);
    setNewVariant({ size: '', price: '', stock: '' });
    setImagePreview('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha as informações do produto. Você pode adicionar diferentes variações como tamanhos e preços.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Upload de Imagem */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Imagem do Produto</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Selecionar Imagem
                  </Button>
                </div>
                
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => {
                        setImagePreview('');
                        form.setValue('image', '');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Shampoo Natural" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cuidados Pessoais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva detalhadamente o produto, seus benefícios e características..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Base (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seção de Variações */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Variações do Produto</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione diferentes tamanhos, volumes ou variações do produto
                </p>
              </div>

              {/* Adicionar Nova Variação */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-sm font-medium">Tamanho/Volume</label>
                      <Input
                        placeholder="Ex: 200ml, 500ml, P, M, G"
                        value={newVariant.size}
                        onChange={(e) => setNewVariant({...newVariant, size: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preço (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newVariant.price}
                        onChange={(e) => setNewVariant({...newVariant, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estoque</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={newVariant.stock}
                        onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={addVariant} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Variações */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Variações Adicionadas:</h4>
                  <div className="space-y-2">
                    {variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{variant.size}</Badge>
                          <span className="font-medium">R$ {variant.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">
                            Estoque: {variant.stock}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Adicionar Produto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};