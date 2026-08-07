"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import { Product } from "@/types/product";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import { TrackingTimeline } from "@/components/shipping/TrackingTimeline";
import {
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  XCircle,
  LogOut,
  TrendingUp,
  Search,
  Boxes,
  ArrowRight,
  Loader2,
  PauseCircle,
  PlayCircle,
  Save,
  Settings2,
  Truck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface ServerOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  paymentStatus: "PENDING" | "PAID";
  orderStatus: "Processing" | "Shipped" | "Delivered";
  awb: string | null;
  razorpayPaymentId?: string | null;
  courierName?: string | null;
  createdAt: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [adminEmail, setAdminEmail] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // Settings state
  const [ordersPaused, setOrdersPaused] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [trackingAwb, setTrackingAwb] = useState<string | null>(null);
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load products");
      setProducts(data.products as Product[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.email) setAdminEmail(data.email);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) setOrders(data.orders);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOrdersPaused(Boolean(data.ordersPaused));
          setPauseMessage(String(data.message ?? ""));
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // session cookie still expires server-side
    }
    router.push("/admin/login");
  };

  const handleOrderStatusChange = async (order: ServerOrder, status: string) => {
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update order status");
      setOrders((current) => current.map((o) => (o.id === order.id ? data.order : o)));
      toast.success(`Updated order status to ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order status");
    }
  };

  const handleCreateProduct = async (payload: Record<string, unknown>) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add product");
      await loadProducts();
      toast.success(`Successfully added ${payload.name} to website catalog!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add product");
      throw error;
    }
  };

  const handleUpdateProduct = async (id: string, payload: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update product");
      await loadProducts();
      setEditingProduct(null);
      toast.success("Product updated in catalog!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update product");
      throw error;
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Remove "${product.name}" from the catalog? Its inventory rows will also be deleted.`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete product");
      await loadProducts();
      toast.info(`Removed ${product.name} from catalog`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product");
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update stock status");
      await loadProducts();
      toast.info(`Stock status updated for ${product.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update stock status");
    }
  };

  const handleSavePrice = async (product: Product) => {
    if (!Number.isFinite(editPrice) || editPrice <= 0) return;
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: editPrice }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update price");
      await loadProducts();
      setEditingPriceId(null);
      toast.success("Updated product price in catalog!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update price");
    }
  };

  const handleSyncShiprocket = async (order: ServerOrder) => {
    setSyncingOrderId(order.id);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/shiprocket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sync order to Shiprocket");
      if (data.shiprocketError) throw new Error(data.shiprocketError);
      if (data.awb) {
        setOrders((current) =>
          current.map((o) =>
            o.id === order.id ? { ...o, awb: data.awb, courierName: data.courierName || o.courierName } : o
          )
        );
        toast.success(`Order pushed to Shiprocket. AWB: ${data.awb}`);
      } else {
        toast.info("Shipment already handled for this order.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sync order to Shiprocket");
    } finally {
      setSyncingOrderId(null);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersPaused, message: pauseMessage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save settings");
      setOrdersPaused(Boolean(data.ordersPaused));
      setPauseMessage(String(data.message ?? ""));
      toast.success(ordersPaused ? "Store is now paused. New orders are blocked." : "Store is live again. Orders are being accepted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] py-10 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF3B30] flex items-center justify-center text-white text-2xl font-black shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider bebas-font text-white">
                  VIPER GEARS STORE ADMIN PANEL
                </h1>
                {ordersPaused && (
                  <Badge className="bg-amber-500 text-white border-0 font-extrabold text-[10px]">
                    ORDERS PAUSED
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Logged in as: <span className="font-mono text-[#FF3B30] font-bold">{adminEmail}</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-400" /> Log Out Admin
          </Button>
        </div>

        <Link
          href="/admin/inventory"
          className="flex flex-col gap-4 rounded-3xl border border-accent/25 bg-accent/10 p-5 shadow-sm transition-colors hover:bg-accent/15 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900">Inventory management</h2>
              <p className="mt-1 text-xs text-slate-600">Manage dress stock by size, set reorder levels, and track low-stock rows in the database.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#FF3B30]">Open inventory <ArrowRight className="h-4 w-4" /></span>
        </Link>

        {/* Analytics KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase">Total Store Sales</span>
              <h3 className="text-2xl font-black text-[#FF3B30] mt-1">{formatINR(totalRevenue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF3B30] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase">Total Orders</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{orders.length} Orders</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase">Active Uniforms</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalProducts} Products</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-extrabold uppercase">Out Of Stock</span>
              <h3 className="text-2xl font-black text-red-500 mt-1">{outOfStockCount} Items</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start bg-white border border-slate-200 p-1.5 rounded-2xl h-auto shadow-sm overflow-x-auto">
            <TabsTrigger value="products" className="gap-2 py-2.5">
              <Package className="w-4 h-4" /> Manage Catalog ({products.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 py-2.5">
              <ShoppingBag className="w-4 h-4" /> Customer Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2 py-2.5">
              <Plus className="w-4 h-4 text-[#FF3B30]" /> Add New Uniform
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 py-2.5">
              <Settings2 className="w-4 h-4 text-[#FF3B30]" /> Store Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PRODUCT MANAGER */}
          <TabsContent value="products" className="space-y-4 pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                  Website Product Catalog
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search product title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-xs"
                  />
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-16 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading catalog from database...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 uppercase border-b border-slate-200 font-extrabold">
                      <tr>
                        <th className="p-3">Uniform</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Stock Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 max-w-xs leading-snug">
                                  {product.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 font-semibold text-slate-600">{product.category}</td>

                          <td className="p-3">
                            {editingPriceId === product.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-24 h-8 text-xs font-bold"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSavePrice(product)}
                                  className="h-8 px-2 bg-[#FF3B30] text-white text-[10px]"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#FF3B30] text-sm">
                                  {formatINR(product.price)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingPriceId(product.id);
                                    setEditPrice(product.price);
                                  }}
                                  className="text-slate-400 hover:text-slate-900"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => handleToggleStock(product)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all cursor-pointer ${
                                product.inStock
                                  ? "bg-red-50 text-[#FF6B61] border-red-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }`}
                            >
                              {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                            </button>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-8 px-2"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: ORDERS MANAGER */}
          <TabsContent value="orders" className="space-y-4 pt-4">
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-xs text-slate-500 shadow-sm">
                No orders yet. Orders placed on the storefront will appear here with stock auto-decremented.
              </div>
            ) : (
              orders.map((order) => {
                const parsedAddress = (() => {
                  try {
                    return JSON.parse(order.address) as Record<string, string>;
                  } catch {
                    return { street: order.address } as Record<string, string>;
                  }
                })();
                const parsedItems = (() => {
                  try {
                    return JSON.parse(order.items) as {
                      name: string;
                      size: number;
                      quantity: number;
                      lineTotal: number;
                    }[];
                  } catch {
                    return [];
                  }
                })();
                return (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <span className="text-xs font-mono text-[#FF3B30] font-black">{order.id}</span>
                        <span className="text-xs text-slate-500 ml-3">
                          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-50 text-[#FF6B61] border border-red-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          Payment: {order.paymentStatus}
                        </span>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusChange(order, e.target.value)}
                          className="h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTrackingAwb(order.awb)}
                          disabled={!order.awb}
                          className="h-8 px-2 text-[10px] font-black border-[#FF3B30] text-[#FF3B30] hover:bg-red-50 gap-1"
                          title={order.awb ? `Track AWB ${order.awb}` : "No AWB assigned yet"}
                        >
                          <Truck className="w-3.5 h-3.5" /> Track
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncShiprocket(order)}
                          disabled={syncingOrderId === order.id || Boolean(order.awb)}
                          className="h-8 px-2 text-[10px] font-black border-slate-300 text-slate-700 hover:bg-slate-100 gap-1"
                          title="Push paid order to Shiprocket and generate AWB"
                        >
                          {syncingOrderId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          Sync Shiprocket
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {parsedAddress.fullName || order.customerName} ({parsedAddress.phone || order.phone})
                        </h4>
                        <p className="text-slate-500 mt-1">
                          {parsedAddress.street}, {parsedAddress.city}, {parsedAddress.state} - {parsedAddress.pincode}
                        </p>
                        <div className="text-slate-700 font-semibold mt-2 space-y-0.5">
                          {parsedItems.map((item, index) => (
                            <p key={index}>• {item.name} ({item.size} cm) × {item.quantity}</p>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Order Amount:</span>
                          <span className="text-base font-black text-[#FF3B30]">{formatINR(order.total)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                          <span className="text-slate-500">Razorpay Payment ID:</span>
                          <span className="font-mono text-slate-900 font-bold text-[11px]">{order.razorpayPaymentId || "Prepaid"}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">Courier Partner:</span>
                          <span className="font-bold text-slate-900">{order.courierName || "Shiprocket Express"}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">Shiprocket AWB Code:</span>
                          <span className="font-mono text-slate-900 font-bold">{order.awb || "Pending AWB"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* TAB 3: ADD NEW PRODUCT */}
          <TabsContent value="add" className="pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Add New Taekwondo Uniform to Website
              </h3>
              <p className="text-xs text-slate-500 -mt-3">
                Inventory rows are created automatically for every selected size. Set their stock on the Inventory page.
              </p>
              <ProductForm submitLabel="Add Uniform To Website" onSubmit={handleCreateProduct} />
            </div>
          </TabsContent>

          {/* TAB 4: STORE SETTINGS */}
          <TabsContent value="settings" className="pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Store Order Settings
              </h3>

              <div className={`rounded-3xl border p-5 flex items-start gap-4 ${ordersPaused ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ordersPaused ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                  {ordersPaused ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        {ordersPaused ? "Orders are temporarily paused" : "Store is live and taking orders"}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {ordersPaused
                          ? "Customers will see a pause notice and cannot place new orders."
                          : "Customers can place orders normally right now."}
                      </p>
                    </div>
                    <button
                      onClick={() => setOrdersPaused(!ordersPaused)}
                      className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${ordersPaused ? "bg-[#FF3B30]" : "bg-slate-300"}`}
                      aria-label="Toggle pause orders"
                    >
                      <span
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${ordersPaused ? "left-7" : "left-1"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Pause Notice Message (shown to customers)
                </label>
                <textarea
                  rows={3}
                  value={pauseMessage}
                  onChange={(e) => setPauseMessage(e.target.value)}
                  placeholder="We are currently not accepting new orders. Please check back soon."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30]"
                />
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                variant="default"
                size="lg"
                className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg"
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editingProduct !== null} onOpenChange={(open) => { if (!open) setEditingProduct(null); }}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-base font-black uppercase tracking-wider text-slate-900">
              Edit Uniform
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              key={editingProduct.id}
              initial={editingProduct}
              submitLabel="Save Changes"
              onSubmit={(payload) => handleUpdateProduct(editingProduct.id, payload)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {trackingAwb && (
        <TrackingTimeline
          awb={trackingAwb}
          open={trackingAwb !== null}
          onOpenChange={(open) => { if (!open) setTrackingAwb(null); }}
        />
      )}
    </div>
  );
}
