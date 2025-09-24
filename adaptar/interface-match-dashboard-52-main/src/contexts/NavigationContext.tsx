import { createContext, useContext, useState, ReactNode } from 'react';

type ActiveSection = 'recent' | 'progress' | 'financial' | 'products' | 'settings' | 'help';

interface NavigationContextType {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openAddProductModal: () => void;
  addProductModalOpen: boolean;
  setAddProductModalOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('recent');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openAddProductModal = () => {
    setActiveSection('products');
    setAddProductModalOpen(true);
    setSidebarOpen(false);
  };

  return (
    <NavigationContext.Provider value={{
      activeSection,
      setActiveSection,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      openAddProductModal,
      addProductModalOpen,
      setAddProductModalOpen
    }}>
      {children}
    </NavigationContext.Provider>
  );
};