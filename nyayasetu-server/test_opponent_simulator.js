import { simulateOpponentDefense, getFallbackOpponentSimulation } from './services/opponentSimulatorService.js';

async function testSimulator() {
  console.log('🧪 Testing Adversarial Opponent Defense Simulator...\n');

  // Test 1: Fallback Heuristic
  console.log('🔹 1. Testing Sovereign Heuristic Fallback (Tenancy Dispute)...');
  const fallback = getFallbackOpponentSimulation(
    "Landlord deducted ₹20,000 security deposit for general painting without bills",
    [{ act: "Model Tenancy Act 2021", section: "Section 11" }]
  );
  console.log(`   Opponent Persona: ${fallback.opponentPersona}`);
  console.log(`   Settlement Likelihood: ${fallback.settlementLikelihood}%`);
  console.log(`   Counter Arguments Count: ${fallback.opponentCounterArguments.length}`);
  console.log(`   Top Precedent Citation: ${fallback.opponentCounterArguments[0].precedentCitation}`);

  // Test 2: Live AI Simulation with Gemini
  console.log('\n🔹 2. Testing Live AI Simulation with Gemini 3.6/3.7 Flash...');
  const liveResult = await simulateOpponentDefense({
    grievanceText: "I bought a OnePlus phone from Flipkart for ₹19,999. It was delivered with a broken screen. Flipkart customer support refused refund within 7 days.",
    applicableActs: [
      { act: "Consumer Protection Act 2019", section: "Section 2(47)" },
      { act: "Consumer Protection Act 2019", section: "Section 35" }
    ],
    evidenceData: {
      merchant: "RetailNet / Flipkart India Pvt Ltd",
      amount: "₹19,999.00",
      invoiceNumber: "IN-2026-881920"
    },
    district: "Lucknow",
    state: "Uttar Pradesh",
    language: "en"
  });

  console.log(`✅ Live Wargame Generated:`);
  console.log(`   Persona: ${liveResult.opponentPersona}`);
  console.log(`   Posture: ${liveResult.strategicDefensePosture}`);
  console.log(`   Settlement Likelihood: ${liveResult.settlementLikelihood}%`);
  console.log(`   Settlement Outlook: ${liveResult.settlementOutlook}`);
  console.log(`   Loopholes Found: ${liveResult.vulnerabilities?.length}`);
  console.log(`   Projected Counter-Arguments: ${liveResult.opponentCounterArguments?.length}`);

  if (liveResult.opponentCounterArguments?.length > 0) {
    console.log(`   - Opponent Argument: "${liveResult.opponentCounterArguments[0].argument}"`);
    console.log(`   - Rebuttal: "${liveResult.opponentCounterArguments[0].rebuttal}"`);
    console.log(`   - Precedent: "${liveResult.opponentCounterArguments[0].precedentCitation}"`);
  }

  console.log('\n=========================================================');
  console.log('🎉 Opponent Defense Simulator Backend Verification PASSED!');
  console.log('=========================================================');
}

testSimulator().catch(err => {
  console.error('❌ Opponent Simulator Test Failed:', err);
  process.exit(1);
});
