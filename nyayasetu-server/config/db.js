import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js resolves MongoDB Atlas SRV records using standard public DNS servers
// Fixes local Windows ISP / router querySrv ECONNREFUSED errors
try {
  if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  }
} catch (dnsErr) {
  // Silent fallback in cloud environments
}

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nyayasetu';
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection not available (${error.message}). Running with High-Fidelity In-Memory Repository.`);
  }
};

export const getDBStatus = () => ({
  connected: isConnected,
  host: isConnected ? mongoose.connection.host : 'In-Memory Resilient Repository',
  readyState: mongoose.connection.readyState
});