"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/store/useAdminStore";
import { formatINR } from "@/lib/utils";
import { Product, CategoryType } from "@/types/product";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  createdAt: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useAdminStore();

  const [adminEmail, setAdminEmail] = useState("");
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CategoryType>("Advanced Competition Dobok");
  const [newPrice, setNewPrice] = useState<number>(2999);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(3999);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("/images/kpnp-dobok-1.jpg");

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

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newPrice <= 0) {
      toast.error("Please enter a valid product title and price.");
      return;
    }

    const newProd: Product = {
      id: `kpnp-custom-${Date.now()}`,
      name: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newCategory,
      price: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      rating: 5.0,
      reviewCount: 1,
      isWTApproved: true,
      inStock: true,
      images: [newImageUrl, "/images/kpnp-dobok-chest.jpg"],
      description: newDescription || "Official KPNP Taekwondo Dobok engineered for elite competition performance.",
      fabricSpecs: "Lightweight Moisture-Wicking Poly-Blend",
      weightGsm: 210,
      availableSizes: [140, 150, 160, 170, 180, 190, 200],
      features: [
        "Elite Performance Fabric: Moisture-wicking poly-blend weave.",
        "National Pride Print: Official Indian Flag patch on sleeve.",
        "Ergonomic Fit: 180-degree freedom of movement for kicking."
      ]
    };

    addProduct(newProd);
    toast.success(`Successfully added ${newTitle} to website catalog!`);
    setNewTitle("");
    setNewDescription("");
  };

  const handleSavePriceEdit = (id: string) => {
    if (editPrice > 0) {
      updateProduct(id, { price: Number(editPrice) });
      toast.success("Updated product price in catalog!");
      setEditingProductId(null);
    }
  };

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
                <Badge variant="wtApproved" className="bg-[#FF3B30] text-white border-0 font-extrabold text-[10px]">
                  LIVE STORE
                </Badge>
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
          <TabsList className="w-full justify-start bg-white border border-slate-200 p-1.5 rounded-2xl h-auto shadow-sm">
            <TabsTrigger value="products" className="gap-2 py-2.5">
              <Package className="w-4 h-4" /> Manage Catalog ({products.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 py-2.5">
              <ShoppingBag className="w-4 h-4" /> Customer Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2 py-2.5">
              <Plus className="w-4 h-4 text-[#FF3B30]" /> Add New Uniform
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
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((product) => (
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
                            {editingProductId === product.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-24 h-8 text-xs font-bold"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSavePriceEdit(product.id)}
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
                                    setEditingProductId(product.id);
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
                              onClick={() => {
                                toggleStock(product.id);
                                toast.info(`Toggled stock status for ${product.name}`);
                              }}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                deleteProduct(product.id);
                                toast.info(`Removed ${product.name} from catalog`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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
                          <span className="text-slate-500">Shiprocket AWB Code:</span>
                          <span className="font-mono text-slate-900 font-bold">{order.awb || "Not Dispatched"}</span>
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

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Uniform Name / Title *</label>
                  <Input
                    placeholder="e.g. KPNP Elite Black Belt Dobok - Special Gold Edition"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Uniform Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                      className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                    >
                      <option value="Advanced Competition Dobok">Advanced Competition Dobok</option>
                      <option value="Black Belt Dobok">Black Belt Dobok</option>
                      <option value="Kids Dobok">Kids Dobok</option>
                      <option value="Beginner Dobok">Beginner Dobok</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Selling Price (₹) *</label>
                    <Input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Original Price (₹) *</label>
                    <Input
                      type="number"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Image URL *</label>
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Product Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Enter detailed description of uniform..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:ring-2 focus:ring-[#FF3B30]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Uniform To Website
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
