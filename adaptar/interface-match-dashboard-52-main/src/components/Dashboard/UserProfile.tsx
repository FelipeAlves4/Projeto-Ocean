import { useState } from 'react';
import { Camera, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  profileImage: string;
  plan: string;
}

export const UserProfile = () => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    profileImage: '',
    plan: 'Pro'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    setUserData({
      ...userData,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      birthDate: formData.get('birthDate') as string,
    });

    setIsEditDialogOpen(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!"
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({
          ...userData,
          profileImage: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Avatar className="w-8 h-8 border border-border hover:border-primary/50 transition-all duration-200">
              <AvatarImage src={userData.profileImage} alt="Foto do perfil" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <Popover>
              <PopoverTrigger asChild>
                <button className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs hover:bg-primary/90 transition-colors">
                  <Camera className="w-2 h-2" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Alterar foto do perfil</p>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG ou GIF. Máximo 5MB.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground">{userData.name}</p>
            <Badge 
              variant={userData.plan === 'Premium' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {userData.plan}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="ml-2 text-xs"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={userData.birthDate}
                onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};