import React from 'react';
import { Activity, Shield, Coins, Globe, ArrowRight, Bell, Lock, Zap } from 'lucide-react';
import { AppBar } from './AppBar';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
     <AppBar/>
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Monitor & <span className="text-emerald-400">Earn</span> with Every Uptime
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            The first decentralized uptime monitoring platform that rewards you for maintaining high availability. Leverage Web3 technology to earn while you monitor.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
              <span>Start Monitoring</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border border-gray-600 hover:border-emerald-400 px-8 py-4 rounded-lg font-medium transition-colors">
              View Demo
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20" id="features">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose UpTimeEarn?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="bg-emerald-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Bell className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Monitoring</h3>
              <p className="text-gray-400">24/7 uptime monitoring with instant notifications and detailed analytics</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Coins className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-gray-400">Get rewarded in crypto tokens for maintaining high uptime percentages</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Decentralized Security</h3>
              <p className="text-gray-400">Leverage blockchain technology for transparent and secure monitoring</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-800/50 py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">5M+</div>
                <div className="text-gray-400">Checks Per Day</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">10K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">50K+</div>
                <div className="text-gray-400">Tokens Earned</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already earning rewards while ensuring their services stay online.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors">
              <Zap className="h-5 w-5" />
              <span>Get Started Now</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold">UpTimeEarn</span>
            </div>
            <div className="text-gray-400">© 2024 UpTimeEarn. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

