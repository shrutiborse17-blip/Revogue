import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductListingModal } from './components/ProductListingModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CreatorClosetsPage } from './pages/CreatorClosetsPage';
import { RevogueMatchPage } from './pages/RevogueMatchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PhpWtlLabPage } from './pages/PhpWtlLabPage';
import { AboutPage } from './pages/AboutPage';

import { Product, Order, Category } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [marketplaceFilter, setMarketplaceFilter] = useState<any>(null);
  const [creatorFilterHandle, setCreatorFilterHandle] = useState<string | undefined>(undefined);

  // Modal States
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    productId: number;
    orderId: number;
    title?: string;
  }>({
    isOpen: false,
    productId: 0,
    orderId: 0
  });

  // Report Modal State
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    productId?: number;
    sellerId?: number;
    title?: string;
  }>({
    isOpen: false
  });

  // Search Bar Trigger
  const [categories, setCategories] = useState<Category[]>([]);

  React.useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories || []));
  }, []);

  // Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.product_id);
    setCurrentTab('product-detail');
  };

  const handleNavigate = (tab: string, filter?: any) => {
    if (filter) {
      if (filter.handle) {
        setCreatorFilterHandle(filter.handle);
      } else {
        setMarketplaceFilter(filter);
      }
    } else {
      setMarketplaceFilter(null);
      setCreatorFilterHandle(undefined);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReceipt = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const handleOpenReview = (productId: number, orderId: number, title?: string) => {
    setReviewModalData({
      isOpen: true,
      productId,
      orderId,
      title
    });
  };

  const handleOpenReport = (productId?: number, sellerId?: number, title?: string) => {
    setReportModalData({
      isOpen: true,
      productId,
      sellerId,
      title
    });
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product.product_id);
    setCurrentTab('checkout');
  };

  const handleOrderComplete = (order: Order) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
    setCurrentTab('buyer-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* Global Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={tab => handleNavigate(tab)}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenSearch={() => handleNavigate('marketplace')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={(tab, filter) => handleNavigate(tab, filter)}
            onSelectProduct={handleSelectProduct}
            onOpenSellModal={() => setIsSellModalOpen(true)}
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplacePage
            initialFilter={marketplaceFilter}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'product-detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => handleNavigate('marketplace')}
            onSelectProduct={handleSelectProduct}
            onOpenReportModal={handleOpenReport}
            onBuyNow={handleBuyNow}
            onOpenReview={handleOpenReview}
          />
        )}

        {currentTab === 'creators' && (
          <CreatorClosetsPage
            initialHandle={creatorFilterHandle}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'match' && (
          <RevogueMatchPage
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onBack={() => handleNavigate('marketplace')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {currentTab === 'buyer-dashboard' && (
          <BuyerDashboardPage
            onOpenReceipt={handleOpenReceipt}
            onOpenReview={handleOpenReview}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'seller-dashboard' && (
          <SellerDashboardPage
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'wtl-lab' && (
          <PhpWtlLabPage />
        )}

        {currentTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer setCurrentTab={tab => handleNavigate(tab)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onCheckout={() => setCurrentTab('checkout')}
        onContinueShopping={() => handleNavigate('marketplace')}
      />

      {/* Product Listing Modal (Sell an Item) */}
      <ProductListingModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        categories={categories}
        onSuccess={() => {
          alert('Piece submitted successfully! It has been placed in the moderation queue.');
          if (currentTab === 'seller-dashboard') {
            window.location.reload();
          }
        }}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData(prev => ({ ...prev, isOpen: false }))}
        productId={reviewModalData.productId}
        orderId={reviewModalData.orderId}
        productTitle={reviewModalData.title}
        onSuccess={() => {
          alert('Review posted! Thank you for maintaining community trust.');
        }}
      />

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={reportModalData.isOpen}
        onClose={() => setReportModalData({ isOpen: false })}
        productId={reportModalData.productId}
        sellerId={reportModalData.sellerId}
        title={reportModalData.title}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
