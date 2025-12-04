import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Barcode,
  Search,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Package,
  Clock,
  MapPin,
  FileText,
  Printer,
  Shield,
  X,
} from 'lucide-react';
import { DetailModal } from './DetailModal';

interface ProductInfo {
  id: string;
  name: string;
  sku: string;
  batchNumber: string;
  lotNumber: string;
  productionDate: string;
  expiryDate: string;
  formula: string;
  rawMaterials: string[];
  weight: string;
  location: string;
  quarantineStatus: string;
  lastScanned?: string;
  imageUrl?: string;
  description: string;
}

const mockDatabase: Record<string, ProductInfo> = {
  'BATCH-7264K': {
    id: 'P-001',
    name: 'Lavender Dream Soap',
    sku: 'LDS-001',
    batchNumber: 'BATCH-7264K',
    lotNumber: 'LOT-A-2024-1025',
    productionDate: '2025-10-20',
    expiryDate: '2026-10-20',
    formula: 'FORM-LAV-001',
    rawMaterials: ['Coconut Oil', 'Shea Butter', 'Lavender Essential Oil', 'Sodium Hydroxide'],
    weight: '4.5 oz',
    location: 'Warehouse A, Aisle 3, Shelf B2',
    quarantineStatus: 'Released',
    lastScanned: '2025-10-25 14:30',
    description: 'Handcrafted lavender soap with organic ingredients',
  },
  'LOT-A-2024-1025': {
    id: 'P-001',
    name: 'Lavender Dream Soap',
    sku: 'LDS-001',
    batchNumber: 'BATCH-7264K',
    lotNumber: 'LOT-A-2024-1025',
    productionDate: '2025-10-20',
    expiryDate: '2026-10-20',
    formula: 'FORM-LAV-001',
    rawMaterials: ['Coconut Oil', 'Shea Butter', 'Lavender Essential Oil', 'Sodium Hydroxide'],
    weight: '4.5 oz',
    location: 'Warehouse A, Aisle 3, Shelf B2',
    quarantineStatus: 'Released',
    lastScanned: '2025-10-25 14:30',
    description: 'Handcrafted lavender soap with organic ingredients',
  },
  'LDS-001': {
    id: 'P-001',
    name: 'Lavender Dream Soap',
    sku: 'LDS-001',
    batchNumber: 'BATCH-7264K',
    lotNumber: 'LOT-A-2024-1025',
    productionDate: '2025-10-20',
    expiryDate: '2026-10-20',
    formula: 'FORM-LAV-001',
    rawMaterials: ['Coconut Oil', 'Shea Butter', 'Lavender Essential Oil', 'Sodium Hydroxide'],
    weight: '4.5 oz',
    location: 'Warehouse A, Aisle 3, Shelf B2',
    quarantineStatus: 'Released',
    lastScanned: '2025-10-25 14:30',
    description: 'Handcrafted lavender soap with organic ingredients',
  },
};

export function BarcodeRecoverySystem() {
  const [searchMode, setSearchMode] = useState<'manual' | 'description' | 'camera'>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [foundProducts, setFoundProducts] = useState<ProductInfo[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  const handleManualSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Search by SKU, Batch, or Lot Number
    const results: ProductInfo[] = [];
    const query = searchQuery.toUpperCase();

    Object.keys(mockDatabase).forEach(key => {
      if (key.includes(query)) {
        results.push(mockDatabase[key]);
      }
    });

    // Remove duplicates
    const unique = results.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );

    setFoundProducts(unique);
    setIsSearching(false);
  };

  const handleDescriptionSearch = async () => {
    setIsSearching(true);
    
    // Simulate AI-powered search
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Simple keyword matching (in production, use AI)
    const description = productDescription.toLowerCase();
    const results: ProductInfo[] = [];

    Object.values(mockDatabase).forEach(product => {
      const matches = 
        product.name.toLowerCase().includes(description) ||
        product.description.toLowerCase().includes(description) ||
        product.rawMaterials.some(rm => rm.toLowerCase().includes(description));

      if (matches) {
        results.push(product);
      }
    });

    // Remove duplicates
    const unique = results.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );

    setFoundProducts(unique);
    setIsSearching(false);
  };

  const handlePrintNewLabel = (product: ProductInfo) => {
    setSelectedProduct(product);
    setShowPrintLabel(true);
  };

  const generateNewBarcode = (product: ProductInfo): string => {
    // Generate a new barcode with timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `${product.sku}-${timestamp}`;
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-slate-900">Barcode Recovery System</h1>
        <p className="text-slate-600 mt-1">Find products when barcodes are missing or damaged</p>
      </div>

      {/* Alert Banner */}
      <Card className="p-4 border-orange-200 bg-orange-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-900">Barcode Missing or Damaged?</div>
            <div className="text-sm text-orange-700 mt-1">
              Use this system to identify products and generate replacement labels. Choose your search method below.
            </div>
          </div>
        </div>
      </Card>

      {/* Search Mode Selector */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className={`p-6 cursor-pointer transition-all ${
            searchMode === 'manual'
              ? 'border-2 border-violet-500 bg-violet-50'
              : 'border-slate-200 hover:border-violet-300'
          }`}
          onClick={() => setSearchMode('manual')}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Manual Search</div>
              <div className="text-sm text-slate-600 mt-1">
                Search by SKU, Batch, or Lot Number
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all ${
            searchMode === 'description'
              ? 'border-2 border-violet-500 bg-violet-50'
              : 'border-slate-200 hover:border-violet-300'
          }`}
          onClick={() => setSearchMode('description')}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Description Search</div>
              <div className="text-sm text-slate-600 mt-1">
                Describe the product (AI-powered)
              </div>
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all ${
            searchMode === 'camera'
              ? 'border-2 border-violet-500 bg-violet-50'
              : 'border-slate-200 hover:border-violet-300'
          }`}
          onClick={() => setSearchMode('camera')}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Image Recognition</div>
              <div className="text-sm text-slate-600 mt-1">
                Take a photo of the product
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Interface */}
      <Card className="p-6 border-slate-200">
        {searchMode === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Enter SKU, Batch Number, or Lot Number
              </label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., LDS-001, BATCH-7264K, or LOT-A-2024-1025"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button
                  onClick={handleManualSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                💡 Tip: You can search partial numbers. Try "BATCH-" or "LOT-"
              </div>
            </div>
          </div>
        )}

        {searchMode === 'description' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900 mb-2 block">
                Describe the Product
              </label>
              <Textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="e.g., 'Purple soap with lavender scent, rectangular shape, about 4 oz' or 'Lavender soap'"
                className="min-h-[100px]"
              />
              <div className="text-xs text-slate-500 mt-2">
                💡 Tip: Be as descriptive as possible. Mention colors, scents, shapes, or ingredients.
              </div>
            </div>
            <Button
              onClick={handleDescriptionSearch}
              disabled={!productDescription.trim() || isSearching}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Search with AI
            </Button>
          </div>
        )}

        {searchMode === 'camera' && (
          <div className="space-y-4">
            <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <div className="text-slate-900 font-medium mb-2">Take a Photo</div>
              <div className="text-sm text-slate-600 mb-4">
                Our AI will analyze the image and identify the product
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <Camera className="w-4 h-4 mr-2" />
                Open Camera
              </Button>
              <div className="text-xs text-slate-500 mt-4">
                💡 Or drag and drop an image here
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Search Results */}
      {isSearching && (
        <Card className="p-12 border-slate-200">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-slate-900 font-medium">Searching database...</div>
            <div className="text-sm text-slate-600 mt-1">
              {searchMode === 'description' ? 'AI analyzing description...' : 'Looking for matches...'}
            </div>
          </div>
        </Card>
      )}

      {!isSearching && foundProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Found {foundProducts.length} {foundProducts.length === 1 ? 'Product' : 'Products'}
            </h3>
            <Button
              onClick={() => {
                setFoundProducts([]);
                setSearchQuery('');
                setProductDescription('');
              }}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>

          {foundProducts.map((product) => (
            <Card key={product.id} className="p-6 border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{product.name}</h4>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                    <span>SKU: {product.sku}</span>
                    <span>•</span>
                    <span>Batch: {product.batchNumber}</span>
                    <span>•</span>
                    <span>Lot: {product.lotNumber}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    product.quarantineStatus === 'Released'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {product.quarantineStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500">Production Date</div>
                  <div className="text-sm text-slate-900">
                    {new Date(product.productionDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Expiry Date</div>
                  <div className="text-sm text-slate-900">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Weight</div>
                  <div className="text-sm text-slate-900">{product.weight}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Last Scanned</div>
                  <div className="text-sm text-slate-900">{product.lastScanned || 'Never'}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-2">Current Location</div>
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <MapPin className="w-4 h-4 text-violet-600" />
                  {product.location}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-2">Raw Materials</div>
                <div className="flex flex-wrap gap-2">
                  {product.rawMaterials.map((material, idx) => (
                    <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handlePrintNewLabel(product)}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print New Label
                </Button>
                <Button
                  onClick={() => setSelectedProduct(product)}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isSearching && foundProducts.length === 0 && (searchQuery || productDescription) && (
        <Card className="p-12 border-slate-200">
          <div className="flex flex-col items-center justify-center text-center">
            <Package className="w-16 h-16 text-slate-300 mb-4" />
            <div className="text-slate-900 font-medium mb-2">No Products Found</div>
            <div className="text-sm text-slate-600 max-w-md">
              We couldn't find any products matching your search. Try:
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Using a different search term</li>
                <li>Searching with partial numbers</li>
                <li>Using the description search with more details</li>
                <li>Checking the physical product for any visible markings</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Print New Label Modal */}
      {showPrintLabel && selectedProduct && (
        <DetailModal
          isOpen={showPrintLabel}
          onClose={() => setShowPrintLabel(false)}
          title="Print New Barcode Label"
          subtitle={selectedProduct.name}
          actions={
            <>
              <Button variant="outline" onClick={() => setShowPrintLabel(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <Printer className="w-4 h-4 mr-2" />
                Print Label
              </Button>
            </>
          }
        >
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-green-900">Product Identified</div>
                  <div className="text-sm text-green-700 mt-1">
                    A new barcode label will be generated with all product information.
                  </div>
                </div>
              </div>
            </div>

            {/* Label Preview */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-white">
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-slate-900">{selectedProduct.name}</div>
                
                {/* Barcode Representation */}
                <div className="my-6">
                  <div className="flex justify-center gap-0.5 mb-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-black"
                        style={{ height: i % 3 === 0 ? '60px' : '50px' }}
                      />
                    ))}
                  </div>
                  <div className="font-mono text-sm">{generateNewBarcode(selectedProduct)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <div className="text-xs text-slate-500">SKU</div>
                    <div className="font-mono">{selectedProduct.sku}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Batch</div>
                    <div className="font-mono">{selectedProduct.batchNumber}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Lot</div>
                    <div className="font-mono">{selectedProduct.lotNumber}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-slate-500">Expires</div>
                    <div>{new Date(selectedProduct.expiryDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              <strong>Note:</strong> This new barcode will be linked to the existing product data in the system.
              The old barcode (if known) will be marked as replaced.
            </div>
          </div>
        </DetailModal>
      )}

      {/* Product Details Modal */}
      {selectedProduct && !showPrintLabel && (
        <DetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku}`}
          badge={
            <Badge
              variant="outline"
              className={
                selectedProduct.quarantineStatus === 'Released'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }
            >
              {selectedProduct.quarantineStatus}
            </Badge>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Product Information</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Batch Number</div>
                    <div className="text-sm text-slate-900 font-mono">{selectedProduct.batchNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Lot Number</div>
                    <div className="text-sm text-slate-900 font-mono">{selectedProduct.lotNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Formula</div>
                    <div className="text-sm text-slate-900 font-mono">{selectedProduct.formula}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Weight</div>
                    <div className="text-sm text-slate-900">{selectedProduct.weight}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Dates</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Production Date</div>
                    <div className="text-sm text-slate-900">
                      {new Date(selectedProduct.productionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Expiry Date</div>
                    <div className="text-sm text-slate-900">
                      {new Date(selectedProduct.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Last Scanned</div>
                    <div className="text-sm text-slate-900">{selectedProduct.lastScanned || 'Never'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Location</h4>
              <div className="flex items-center gap-2 text-sm text-slate-900 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-4 h-4 text-violet-600" />
                {selectedProduct.location}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Raw Materials</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.rawMaterials.map((material, idx) => (
                  <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DetailModal>
      )}
    </div>
  );
}
