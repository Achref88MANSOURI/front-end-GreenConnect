/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/src/api-config';

interface DashboardData {
  seller: {
    products: {
      total: number;
      active: number;
      outOfStock: number;
      inventoryValue: number;
    };
    sales: {
      totalOrders: number;
      totalRevenue: number;
      thisMonthRevenue: number;
      averageOrderValue: number;
    };
    topProducts: Array<{
      id: number;
      name: string;
      price: number;
      stock: number;
      category: string;
    }>;
  };
  buyer: {
    orders: {
      total: number;
      pending: number;
      completed: number;
      cancelled: number;
    };
    spending: {
      total: number;
      thisMonth: number;
      averageOrder: number;
    };
  };
  investor: {
    asInvestor: {
      totalInvestments: number;
      activeInvestments: number;
      totalInvested: number;
      totalReturns: number;
      roi: string;
      portfolioValue: number;
    };
    asProjectOwner: {
      totalProjects: number;
      activeProjects: number;
      fundedProjects: number;
      totalRaised: number;
      totalInvestors: number;
    };
  };
  equipmentOwner: {
    equipment: {
      total: number;
      available: number;
      unavailable: number;
    };
    bookings: {
      total: number;
      active: number;
      completed: number;
      cancelled: number;
    };
    earnings: {
      total: number;
      thisMonth: number;
    };
  };
  carrier: {
    isCarrier: boolean;
    carrier?: {
      companyName: string;
      averageRating: number;
      totalReviews: number;
      status: string;
      capacity: number;
    };
    deliveries?: {
      total: number;
      pending: number;
      inTransit: number;
      delivered: number;
      cancelled: number;
    };
    earnings?: {
      total: number;
      thisMonth: number;
      averagePerDelivery: number;
    };
  };
}

interface Activity {
  type: string;
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'seller' | 'buyer' | 'investor' | 'equipment' | 'carrier'>('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
    fetchRecentActivities();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setActivities(result);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of all your activities</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'seller', label: 'Selling' },
              { id: 'buyer', label: 'Buying' },
              { id: 'investor', label: 'Investments' },
              { id: 'equipment', label: 'Equipment' },
              { id: 'carrier', label: 'Deliveries' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Selling Stats */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Products Listed</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.seller.products.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.seller.products.active} available</p>
              </div>

              {/* Buying Stats */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Orders Placed</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.buyer.orders.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.buyer.orders.pending} pending</p>
              </div>

              {/* Investment Stats */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Investments</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.investor.asInvestor.totalInvestments}</p>
                <p className="mt-1 text-sm text-gray-600">ROI: {data.investor.asInvestor.roi}%</p>
              </div>

              {/* Equipment Stats */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Equipment</h3>
                <p className="mt-2 text-3xl font-bold text-orange-600">{data.equipmentOwner.equipment.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.equipmentOwner.bookings.total} bookings</p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Activities</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {activities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString()} - {activity.type}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {activity.amount} TND
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seller Tab */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.seller.sales.totalRevenue.toFixed(2)} TND</p>
                <p className="mt-1 text-sm text-gray-600">This month: {data.seller.sales.thisMonthRevenue.toFixed(2)} TND</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.seller.products.inventoryValue.toFixed(2)} TND</p>
                <p className="mt-1 text-sm text-gray-600">{data.seller.products.active} products in stock</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.seller.sales.averageOrderValue.toFixed(2)} TND</p>
                <p className="mt-1 text-sm text-gray-600">From {data.seller.sales.totalOrders} orders</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Top Products</h2>
                <Link href="/products/create" className="text-sm text-green-600 hover:text-green-700">
                  Add Product
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {data.seller.topProducts.map((product) => (
                  <div key={product.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{product.price} TND</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buyer Tab */}
        {activeTab === 'buyer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.buyer.spending.total.toFixed(2)} TND</p>
                <p className="mt-1 text-sm text-gray-600">This month: {data.buyer.spending.thisMonth.toFixed(2)} TND</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.buyer.orders.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.buyer.orders.completed} completed</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.buyer.spending.averageOrder.toFixed(2)} TND</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <p className="text-2xl font-bold text-yellow-600">{data.buyer.orders.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">{data.buyer.orders.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <p className="text-2xl font-bold text-red-600">{data.buyer.orders.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investor Tab */}
        {activeTab === 'investor' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">As Investor</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Portfolio Value</p>
                  <p className="text-2xl font-bold text-green-600">{data.investor.asInvestor.portfolioValue.toFixed(2)} TND</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Invested</p>
                  <p className="text-2xl font-bold text-blue-600">{data.investor.asInvestor.totalInvested.toFixed(2)} TND</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Returns</p>
                  <p className="text-2xl font-bold text-purple-600">{data.investor.asInvestor.totalReturns.toFixed(2)} TND</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Return on Investment (ROI)</span>
                  <span className="text-xl font-bold text-green-600">{data.investor.asInvestor.roi}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">As Project Owner</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold text-green-600">{data.investor.asProjectOwner.totalProjects}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Raised</p>
                  <p className="text-2xl font-bold text-blue-600">{data.investor.asProjectOwner.totalRaised.toFixed(2)} TND</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Investors</p>
                  <p className="text-2xl font-bold text-purple-600">{data.investor.asProjectOwner.totalInvestors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">{data.equipmentOwner.earnings.total.toFixed(2)} TND</p>
                <p className="mt-1 text-sm text-gray-600">This month: {data.equipmentOwner.earnings.thisMonth.toFixed(2)} TND</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Equipment Listed</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">{data.equipmentOwner.equipment.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.equipmentOwner.equipment.available} available</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">{data.equipmentOwner.bookings.total}</p>
                <p className="mt-1 text-sm text-gray-600">{data.equipmentOwner.bookings.active} active</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Booking Status</h2>
                <Link href="/equipment/create" className="text-sm text-green-600 hover:text-green-700">
                  Add Equipment
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">{data.equipmentOwner.bookings.active}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">{data.equipmentOwner.bookings.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <p className="text-2xl font-bold text-red-600">{data.equipmentOwner.bookings.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carrier Tab */}
        {activeTab === 'carrier' && (
          <div className="space-y-6">
            {data.carrier.isCarrier ? (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Carrier Profile</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{data.carrier.carrier?.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Rating</p>
                      <p className="font-medium">⭐ {data.carrier.carrier?.averageRating.toFixed(1)} ({data.carrier.carrier?.totalReviews} reviews)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{data.carrier.carrier?.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{data.carrier.carrier?.capacity} kg</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">{data.carrier.earnings?.total.toFixed(2)} TND</p>
                    <p className="mt-1 text-sm text-gray-600">This month: {data.carrier.earnings?.thisMonth.toFixed(2)} TND</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Deliveries</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{data.carrier.deliveries?.total}</p>
                    <p className="mt-1 text-sm text-gray-600">{data.carrier.deliveries?.delivered} completed</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Average per Delivery</h3>
                    <p className="mt-2 text-3xl font-bold text-purple-600">{data.carrier.earnings?.averagePerDelivery.toFixed(2)} TND</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Delivery Status</h2>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded">
                      <p className="text-2xl font-bold text-yellow-600">{data.carrier.deliveries?.pending}</p>
                      <p className="text-sm text-gray-600">Pending Pickup</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">{data.carrier.deliveries?.inTransit}</p>
                      <p className="text-sm text-gray-600">In Transit</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                      <p className="text-2xl font-bold text-green-600">{data.carrier.deliveries?.delivered}</p>
                      <p className="text-sm text-gray-600">Delivered</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded">
                      <p className="text-2xl font-bold text-red-600">{data.carrier.deliveries?.cancelled}</p>
                      <p className="text-sm text-gray-600">Cancelled</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Not Registered as Carrier</h3>
                <p className="text-gray-600 mb-6">Register as a carrier to start accepting deliveries</p>
                <Link
                  href="/carriers"
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Register as Carrier
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
