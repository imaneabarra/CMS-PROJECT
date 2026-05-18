export const adminStats = {
  revenue: { value: '$452,800', change: '+12.4%', positive: true, label: 'Gross Revenue' },
  orders: { value: '1,245', change: '+8.2%', positive: true, label: 'Total Orders' },
  users: { value: '1.2k', change: '+5.3%', positive: true, label: 'Active Clients' },
  avgOrder: { value: '$364.50', change: '+2.1%', positive: true, label: 'Avg. Project Value' },
};

export const revenueData = [
  { month: 'Aug', revenue: 25000 },
  { month: 'Sep', revenue: 32000 },
  { month: 'Oct', revenue: 28000 },
  { month: 'Nov', revenue: 45000 },
  { month: 'Dec', revenue: 62000 },
  { month: 'Jan', revenue: 78000 },
];

export const topCollections = [
  { id: 1, name: 'Video Surveillance', revenue: '$142,500', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=80&h=80&fit=crop&q=80' },
  { id: 2, name: 'Access Control', revenue: '$98,400', image: 'https://images.unsplash.com/photo-1555864326-5cf22ef123cf?w=80&h=80&fit=crop&q=80' },
  { id: 3, name: 'IT Infrastructure', revenue: '$85,200', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop&q=80' },
];

export const systemActivity = [
  { 
    id: 1, 
    type: 'order', 
    icon: '🛍', 
    title: 'New Order #CMS-9482', 
    body: 'Corporate Project - Office 365 Deployment', 
    time: '3 minutes ago', 
    timestamp: '2024-04-30T21:45:00Z',
    description: 'A professional services order was processed for a corporate client. Implementation scheduled for next week.',
    relatedData: { orderId: 'CMS-9482', customer: 'Global Tech Solutions', amount: '$12,450', items: 15 }
  },
  { 
    id: 2, 
    type: 'stock', 
    icon: '⚠', 
    title: 'Stock Alert: Hikvision 4K Dome', 
    body: 'Inventory below threshold', 
    time: '15 minutes ago', 
    timestamp: '2024-04-30T21:33:00Z',
    description: 'Critical stock level reached for Hikvision 4K Dome cameras. Automated reorder triggered.',
    relatedData: { productId: 102, name: 'Hikvision 4K Dome', currentStock: 4, reorderPoint: 10 }
  },
  { 
    id: 3, 
    type: 'user', 
    icon: '👤', 
    title: 'New Enterprise Client', 
    body: 'Security Services Dept.', 
    time: '1 hour ago', 
    timestamp: '2024-04-30T20:45:00Z',
    description: 'New enterprise account registered. Security clearance and tax documentation verified.',
    relatedData: { userId: 'ENT-442', name: 'Metro Security Corp', email: 'procurement@metrosecurity.com', industry: 'Security Services' }
  },
  { 
    id: 4, 
    type: 'payout', 
    icon: '💳', 
    title: 'Hardware Procurement Payout', 
    body: '$28,500.00', 
    time: '3 hours ago', 
    timestamp: '2024-04-30T18:30:00Z',
    description: 'Batch payout for hardware procurement from primary distributors completed.',
    relatedData: { payoutId: 'PAY-CMS-12', amount: '$28,500.00', status: 'completed', vendor: 'IT Distribution Inc.' }
  },
];

export const adminOrders = [
  { id: 'CMS-9482', customer: 'Global Tech Solutions', product: 'IP Surveillance Bundle', amount: '$12,450', status: 'processing', date: '2024-05-08' },
  { id: 'CMS-9481', customer: 'Residential Client A', product: 'Smart Intercom System', amount: '$420', status: 'shipped', date: '2024-05-08' },
  { id: 'CMS-9480', customer: 'Logistics Center', product: 'Cisco Networking Rack', amount: '$8,200', status: 'delivered', date: '2024-05-07' },
  { id: 'CMS-9479', customer: 'Office Hub', product: 'HP LaserJet Fleet', amount: '$2,350', status: 'delivered', date: '2024-05-06' },
  { id: 'CMS-9478', customer: 'Security Firm X', product: 'ZKTeco Access Terminals', amount: '$1,840', status: 'processing', date: '2024-05-06' },
];

export const adminUsers = [
  { id: 1, name: 'Global Tech Solutions', email: 'info@globaltech.com', role: 'enterprise', orders: 5, spent: '$42,500', joined: '2024-01-15', avatar: 'GT' },
  { id: 2, name: 'Metro Security Corp', email: 'admin@metrosec.com', role: 'enterprise', orders: 2, spent: '$12,800', joined: '2024-03-22', avatar: 'MS' },
  { id: 3, name: 'Admin User', email: 'admin@gmail.com', role: 'admin', orders: 0, spent: '$0', joined: '2023-01-01', avatar: 'AU' },
  { id: 4, name: 'Residential Client A', email: 'client.a@gmail.com', role: 'client', orders: 1, spent: '$420', joined: '2024-05-01', avatar: 'RC' },
];
