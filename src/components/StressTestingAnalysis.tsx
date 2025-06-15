import React, { useState } from 'react';
import { TrendingDown, AlertTriangle, Shield, BarChart3, DollarSign, Activity } from 'lucide-react';
import type { Assessment } from '../types';

interface StressTestingAnalysisProps {
  assessment: Assessment;
  portfolioValue?: number;
}

interface StressScenario {
  name: string;
  description: string;
  impact: number;
  recoveryTime: string;
  vulnerability: 'Low' | 'Medium' | 'High';
}

interface AssetAllocation {
  stocks: number;
  bonds: number;
  alternatives: number;
  cash: number;
}

export function StressTestingAnalysis({ assessment, portfolioValue = 100000 }: StressTestingAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'allocation' | 'summary'>('scenarios');
  
  // Determine asset allocation based on risk level
  const getAllocation = (): AssetAllocation => {
    switch (assessment.riskLevel) {
      case 'Conservative':
        return { stocks: 30, bonds: 50, alternatives: 10, cash: 10 };
      case 'Moderate':
        return { stocks: 60, bonds: 30, alternatives: 8, cash: 2 };
      case 'Aggressive':
        return { stocks: 80, bonds: 15, alternatives: 5, cash: 0 };
    }
  };

  const allocation = getAllocation();

  // Calculate stress test scenarios
  const getStressScenarios = (): StressScenario[] => {
    const baseMultiplier = assessment.riskLevel === 'Conservative' ? 0.6 : 
                          assessment.riskLevel === 'Moderate' ? 0.8 : 1.0;

    return [
      {
        name: 'Interest Rate Shock (+100bp)',
        description: 'Sudden 1% interest rate increase',
        impact: Math.round(-3.5 * baseMultiplier * 100) / 100,
        recoveryTime: '6-12 months',
        vulnerability: assessment.riskLevel === 'Conservative' ? 'Medium' : 'Low'
      },
      {
        name: 'Interest Rate Shock (+200bp)',
        description: 'Sudden 2% interest rate increase',
        impact: Math.round(-7.2 * baseMultiplier * 100) / 100,
        recoveryTime: '12-18 months',
        vulnerability: assessment.riskLevel === 'Conservative' ? 'High' : 'Medium'
      },
      {
        name: 'Interest Rate Shock (+300bp)',
        description: 'Sudden 3% interest rate increase',
        impact: Math.round(-11.8 * baseMultiplier * 100) / 100,
        recoveryTime: '18-24 months',
        vulnerability: 'High'
      },
      {
        name: 'Market Crash (-20%)',
        description: 'Moderate equity market decline',
        impact: Math.round(-12 * (allocation.stocks / 100) * baseMultiplier * 100) / 100,
        recoveryTime: '12-18 months',
        vulnerability: assessment.riskLevel === 'Aggressive' ? 'High' : 'Medium'
      },
      {
        name: 'Market Crash (-30%)',
        description: 'Severe equity market decline',
        impact: Math.round(-18 * (allocation.stocks / 100) * baseMultiplier * 100) / 100,
        recoveryTime: '24-36 months',
        vulnerability: 'High'
      },
      {
        name: 'Market Crash (-40%)',
        description: 'Extreme equity market decline (2008-style)',
        impact: Math.round(-24 * (allocation.stocks / 100) * baseMultiplier * 100) / 100,
        recoveryTime: '36-48 months',
        vulnerability: 'High'
      },
      {
        name: 'High Inflation (>6%)',
        description: 'Sustained high inflation environment',
        impact: Math.round(-8.5 * baseMultiplier * 100) / 100,
        recoveryTime: '24-36 months',
        vulnerability: assessment.riskLevel === 'Conservative' ? 'High' : 'Medium'
      },
      {
        name: 'Recession Scenario',
        description: '2 quarters negative GDP growth',
        impact: Math.round(-15 * baseMultiplier * 100) / 100,
        recoveryTime: '18-30 months',
        vulnerability: 'High'
      },
      {
        name: 'Currency Crisis',
        description: 'Major currency devaluation event',
        impact: Math.round(-6.8 * baseMultiplier * 100) / 100,
        recoveryTime: '12-24 months',
        vulnerability: 'Medium'
      }
    ];
  };

  const scenarios = getStressScenarios();

  const getVulnerabilityColor = (vulnerability: string) => {
    switch (vulnerability) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > -5) return 'text-green-600';
    if (impact > -15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Stress Testing Analysis</h2>
          <p className="text-blue-100">
            Comprehensive analysis of portfolio performance under adverse market conditions
          </p>
          <div className="mt-4 text-blue-100">
            <span className="font-medium">Sample Portfolio Value: {formatCurrency(portfolioValue)}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'scenarios', label: 'Stress Scenarios', icon: TrendingDown },
              { id: 'allocation', label: 'Asset Allocation', icon: BarChart3 },
              { id: 'summary', label: 'Executive Summary', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interest Rate Scenarios */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Interest Rate Shocks
                  </h3>
                  <div className="space-y-3">
                    {scenarios.slice(0, 3).map((scenario, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVulnerabilityColor(scenario.vulnerability)}`}>
                            {scenario.vulnerability}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Portfolio Impact:</span>
                            <div className={`font-semibold ${getImpactColor(scenario.impact)}`}>
                              {scenario.impact}% ({formatCurrency(portfolioValue * (scenario.impact / 100))})
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Recovery Time:</span>
                            <div className="font-semibold text-gray-900">{scenario.recoveryTime}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Crash Scenarios */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Market Crash Scenarios
                  </h3>
                  <div className="space-y-3">
                    {scenarios.slice(3, 6).map((scenario, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVulnerabilityColor(scenario.vulnerability)}`}>
                            {scenario.vulnerability}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Portfolio Impact:</span>
                            <div className={`font-semibold ${getImpactColor(scenario.impact)}`}>
                              {scenario.impact}% ({formatCurrency(portfolioValue * (scenario.impact / 100))})
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Recovery Time:</span>
                            <div className="font-semibold text-gray-900">{scenario.recoveryTime}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Economic Stress Events */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Economic Stress Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.slice(6).map((scenario, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVulnerabilityColor(scenario.vulnerability)}`}>
                          {scenario.vulnerability}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <div className={`font-semibold ${getImpactColor(scenario.impact)}`}>
                            {scenario.impact}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Recovery:</span>
                          <div className="font-semibold text-gray-900">{scenario.recoveryTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Asset Allocation Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Asset Allocation</h3>
                  <div className="space-y-4">
                    {Object.entries(allocation).map(([asset, percentage]) => (
                      <div key={asset} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{asset}</span>
                          <span className="text-sm font-semibold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              asset === 'stocks' ? 'bg-blue-500' :
                              asset === 'bonds' ? 'bg-green-500' :
                              asset === 'alternatives' ? 'bg-purple-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(portfolioValue * (percentage / 100))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Exposure Analysis */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Exposure by Asset Class</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium text-blue-600 mb-2">Equity Exposure ({allocation.stocks}%)</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Market volatility risk</li>
                        <li>• Economic downturn sensitivity</li>
                        <li>• Sector concentration risk</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium text-green-600 mb-2">Fixed Income Exposure ({allocation.bonds}%)</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Interest rate sensitivity</li>
                        <li>• Credit risk exposure</li>
                        <li>• Inflation erosion risk</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-medium text-purple-600 mb-2">Alternative Assets ({allocation.alternatives}%)</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Liquidity constraints</li>
                        <li>• Correlation breakdown risk</li>
                        <li>• Complexity and transparency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hedging Strategies */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Hedging Strategies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Interest Rate Protection</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Floating rate bonds</li>
                      <li>• Treasury Inflation-Protected Securities (TIPS)</li>
                      <li>• Short-duration bond funds</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Market Downside Protection</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Put options on major indices</li>
                      <li>• Inverse ETFs for hedging</li>
                      <li>• Volatility-based instruments</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">Diversification Enhancement</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• International exposure</li>
                      <li>• Commodity allocations</li>
                      <li>• Real estate investment trusts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Executive Summary
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="mb-4">
                    Based on your <strong>{assessment.riskLevel}</strong> risk profile with a risk score of <strong>{assessment.score}</strong>, 
                    our comprehensive stress testing analysis reveals the following key findings for a ${portfolioValue.toLocaleString()} portfolio:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-red-600 mb-2">Key Vulnerabilities</h4>
                      <ul className="text-sm space-y-1">
                        {assessment.riskLevel === 'Conservative' ? (
                          <>
                            <li>• High sensitivity to interest rate increases</li>
                            <li>• Inflation erosion of fixed-income returns</li>
                            <li>• Limited growth potential in low-rate environment</li>
                          </>
                        ) : assessment.riskLevel === 'Moderate' ? (
                          <>
                            <li>• Moderate equity market exposure</li>
                            <li>• Balanced but not optimized for extreme scenarios</li>
                            <li>• Interest rate sensitivity in bond allocation</li>
                          </>
                        ) : (
                          <>
                            <li>• High equity market correlation risk</li>
                            <li>• Significant drawdown potential in market crashes</li>
                            <li>• Extended recovery periods during downturns</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-600 mb-2">Mitigation Strategies</h4>
                      <ul className="text-sm space-y-1">
                        {assessment.riskLevel === 'Conservative' ? (
                          <>
                            <li>• Incorporate TIPS for inflation protection</li>
                            <li>• Consider floating-rate instruments</li>
                            <li>• Add modest equity allocation for growth</li>
                          </>
                        ) : assessment.riskLevel === 'Moderate' ? (
                          <>
                            <li>• Implement systematic rebalancing</li>
                            <li>• Add alternative investments for diversification</li>
                            <li>• Consider tactical hedging strategies</li>
                          </>
                        ) : (
                          <>
                            <li>• Implement downside protection strategies</li>
                            <li>• Diversify across global markets</li>
                            <li>• Consider volatility-based hedging</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">Worst-Case Scenario Analysis</h4>
                  <p className="mb-4">
                    In the most severe stress scenario (40% market crash combined with rising rates), your portfolio could experience 
                    a maximum drawdown of approximately <strong className="text-red-600">
                      {Math.round(scenarios.reduce((max, s) => Math.min(max, s.impact), 0))}%
                    </strong>, representing a potential loss of <strong className="text-red-600">
                      {formatCurrency(portfolioValue * (scenarios.reduce((max, s) => Math.min(max, s.impact), 0) / 100))}
                    </strong>.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-2">Recovery Projections</h4>
                  <p className="mb-4">
                    Historical analysis suggests that portfolios with similar risk profiles typically recover from major market 
                    disruptions within <strong>24-48 months</strong>, assuming normal market conditions resume and no additional 
                    major shocks occur during the recovery period.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-2">Immediate Action Items</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Review and potentially adjust asset allocation based on stress test results</li>
                    <li>Implement recommended hedging strategies appropriate for your risk level</li>
                    <li>Establish or review emergency fund adequacy (6-12 months expenses)</li>
                    <li>Consider professional portfolio stress testing on a quarterly basis</li>
                    <li>Develop a written investment policy statement including stress scenarios</li>
                  </ol>
                </div>
              </div>

              {/* Historical Context */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Historical Performance Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-3">2008 Financial Crisis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Decline:</span>
                        <span className="font-semibold text-red-600">-37%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recovery Time:</span>
                        <span className="font-semibold">49 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Portfolio Impact:</span>
                        <span className="font-semibold text-red-600">
                          {Math.round(-22 * (allocation.stocks / 100) * 100) / 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-3">2020 COVID Crash</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Decline:</span>
                        <span className="font-semibold text-red-600">-34%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recovery Time:</span>
                        <span className="font-semibold">5 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Your Portfolio Impact:</span>
                        <span className="font-semibold text-red-600">
                          {Math.round(-20 * (allocation.stocks / 100) * 100) / 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}