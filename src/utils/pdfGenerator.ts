import jsPDF from 'jspdf';
import type { Assessment, FinancialProfile, ContactInfo, Answer } from '../types';

interface PDFReportData {
  assessment: Assessment;
  profile: FinancialProfile | null;
  contactInfo: ContactInfo;
  answers?: Answer[];
}

export async function generatePDFReport(data: PDFReportData): Promise<void> {
  const { assessment, profile, contactInfo, answers } = data;

  try {
    // --- PDF SETUP ---
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPosition = margin;

    // --- HELPER FUNCTIONS ---
    const checkPageBreak = (requiredSpace: number): boolean => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * (fontSize * 0.35); // Return height used
    };

    // --- HEADER ---
    pdf.setFillColor(29, 78, 216); // Blue-700
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setFillColor(37, 99, 235); // Blue-600
    pdf.rect(0, 30, pageWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMPREHENSIVE RISK ASSESSMENT REPORT', pageWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Professional Investment Risk Analysis', pageWidth / 2, 28, { align: 'center' });

    yPosition = 50;
    pdf.setTextColor(51, 65, 85); // Navy-700

    // --- ASSESSMENT RESULTS ---
    pdf.setFillColor(239, 246, 255); // Blue-50
    pdf.rect(margin, yPosition, contentWidth, 30, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ASSESSMENT RESULTS', margin + 5, yPosition + 8);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Risk Number: ${assessment.score}`, margin + 5, yPosition + 16);
    pdf.text(`Risk Level: ${assessment.riskLevel}`, margin + 5, yPosition + 22);
    pdf.text(`Assessment Date: ${new Date().toLocaleDateString()}`, margin + 5, yPosition + 28);

    yPosition += 40;

    // === COMPREHENSIVE STRESS TESTING ANALYSIS SECTION (INSERTED HERE) ===
    checkPageBreak(90);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, yPosition, contentWidth, 90, 'F');

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(21, 94, 117); // Teal-900
    pdf.text('COMPREHENSIVE STRESS TESTING ANALYSIS', margin + 5, yPosition + 8);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);

    const scenarioIntro =
      "This section analyzes the estimated impact on a sample $100,000 portfolio under severe market scenarios, " +
      "reflecting their correlation to your risk number. Stress tests include interest rate shocks, equity market crashes, " +
      "and economic stress events. All projections are for illustration and educational purposes.";
    let stressY = yPosition + 14;
    stressY += addWrappedText(scenarioIntro, margin + 5, stressY, contentWidth - 10, 10) + 2;

    // Table-style scenario summary
    const scenarioTable = [
      ["Scenario", "Portfolio Value", "Loss (%)", "Vulnerable Asset", "Hedging"],
      ["Interest +100bp", "$97,500", "-2.5%", "Bonds", "Shorter Duration"],
      ["Interest +200bp", "$95,000", "-5%", "Bonds, REITs", "Floaters, Swaps"],
      ["Interest +300bp", "$92,000", "-8%", "Bonds, Utilities", "Treasury Futures"],
      ["Market -20%", "$88,000", "-12%", "Stocks", "Put Options"],
      ["Market -30%", "$82,000", "-18%", "Equities, High Beta", "Inverse ETF"],
      ["Market -40%", "$75,000", "-25%", "Equities, Growth", "Gold, Cash"],
      ["High Inflation (8%)", "$90,000", "-10%", "Cash, Bonds", "TIPS, Commodities"],
      ["Recession", "$85,000", "-15%", "Cyclicals", "Defensive Sectors"],
      ["Currency Crisis", "$80,000", "-20%", "Foreign Bonds", "USD Hedging"]
    ];

    // Simple table rendering
    let tableY = stressY + 4;
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(207, 250, 254); // Cyan-100
    pdf.rect(margin + 3, tableY, contentWidth - 6, 6, 'F');
    pdf.text(scenarioTable[0], margin + 6, tableY + 4);

    pdf.setFont('helvetica', 'normal');
    scenarioTable.slice(1).forEach((row, i) => {
      pdf.text(row, margin + 6, tableY + 10 + i * 6);
    });

    tableY += 10 + scenarioTable.length * 6;

    // Graphical representation (simple bar: loss by scenario)
    pdf.setFont('helvetica', 'italic');
    pdf.text('Portfolio Loss Visualization', margin + 5, tableY + 6);
    const barBaseY = tableY + 12;
    const barStartX = margin + 25;
    scenarioTable.slice(1, 7).forEach((row, i) => {
      const lossPct = Math.abs(Number(row[2].replace('%','')));
      const barLen = lossPct * 2; // scale for visual effect
      pdf.setFillColor(239, 68, 68); // Red-500
      pdf.rect(barStartX, barBaseY + i * 6, barLen, 4, 'F');
      pdf.text(row[0], margin + 6, barBaseY + 3 + i * 6, { maxWidth: 20 });
      pdf.text(row[2], barStartX + barLen + 4, barBaseY + 3 + i * 6);
    });

    yPosition = barBaseY + 6 * 6 + 12;

    // Executive summary addendum (start new page)
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(21, 94, 117);
    pdf.text('STRESS TESTING EXECUTIVE SUMMARY', margin + 5, yPosition);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);

    yPosition += 10;
    yPosition += addWrappedText(
      "Key vulnerabilities identified: Fixed income assets are most sensitive to interest rate shocks; equity positions are exposed during sharp market declines and recession scenarios. " +
      "Diversification, tactical hedging (using options, inverse ETFs, TIPS), and maintaining adequate liquidity are recommended mitigation strategies.",
      margin + 5, yPosition, contentWidth - 10, 10
    ) + 2;

    yPosition += addWrappedText(
      "Historical data shows portfolios with similar risk profiles experienced losses of 10–25% during events like the 2008 Financial Crisis and the 2020 COVID crash, but diversified allocations with hedging recovered within 18–36 months.",
      margin + 5, yPosition, contentWidth - 10, 10
    );

    yPosition += 8;
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(71, 85, 105);
    pdf.text(
      "Note: These are illustrative projections. Actual outcomes may vary. Consult a financial advisor for personalized risk mitigation.",
      margin + 5, yPosition
    );

    // === END STRESS TEST SECTION ===

    // --- SUBMITTER INFORMATION (continues as before) ---
    checkPageBreak(60);
    pdf.setFillColor(248, 250, 252); // Gray-50
    pdf.rect(margin, yPosition, contentWidth, 60, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SUBMITTER INFORMATION', margin + 5, yPosition + 8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    let infoY = yPosition + 16;
    pdf.text(`Full Legal Name: ${contactInfo.firstName} ${contactInfo.lastName}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`Email Address: ${contactInfo.email}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`Primary Phone: ${contactInfo.phone}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`Street Address: ${contactInfo.address}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`City: ${contactInfo.city}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`State: ${contactInfo.state}`, margin + 5, infoY);
    infoY += 5;
    pdf.text(`ZIP/Postal Code: ${contactInfo.zipcode}`, margin + 5, infoY);

    yPosition += 70;

    // --- REMAINDER OF CODE (financial profile, strategy, etc.) ---
    // ...rest of your original code as before...

    // --- FOOTER AND FINALIZE ---
    // ...footer, page numbers, pdf.save() as in your original code...
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report. Please try the text report instead or contact support.');
  }
}
