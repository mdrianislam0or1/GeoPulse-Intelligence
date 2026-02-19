import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { Country } from './models/Country';
import { StabilityMetrics } from './models/StabilityMetrics';

/**
 * Get stability trends for a specific country or region.
 */
const getStabilityTrends = async (params: { country_code?: string; region?: string; days?: number }) => {
  const days = params.days || 30;
  const since = new Date(Date.now() - days * 24 * 3_600_000);

  const query: any = { date: { $gte: since } };
  if (params.country_code) {
    query.country_code = params.country_code.toUpperCase();
  } else if (params.region) {
    const countries = await Country.find({ region: { $regex: params.region, $options: 'i' } }).select('iso_code');
    query.country_code = { $in: countries.map(c => c.iso_code) };
  }

  return await StabilityMetrics.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        avgScore: { $avg: '$composite_score' },
        totalArticles: { $sum: '$article_count' },
        crisisCount: { $sum: '$crisis_events' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Detect sudden sentiment shifts or crisis spikes.
 */
const detectAnomalies = async () => {
  const threshold = 20; // 20% drop in stability
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(today.getTime() - 24 * 3_600_000);

  const stats = await StabilityMetrics.aggregate([
    { $match: { date: { $in: [today, yesterday] } } },
    {
      $group: {
        _id: '$country_code',
        todayScore: { $max: { $cond: [{ $eq: ['$date', today] }, '$composite_score', 0] } },
        yesterdayScore: { $max: { $cond: [{ $eq: ['$date', yesterday] }, '$composite_score', 0] } },
      },
    },
    {
      $project: {
        country_code: '$_id',
        diff: { $subtract: ['$yesterdayScore', '$todayScore'] },
        isAnomaly: { $gt: [{ $subtract: ['$yesterdayScore', '$todayScore'] }, threshold] },
      },
    },
    { $match: { isAnomaly: true } },
  ]);

  return stats;
};

/**
 * Generate a PDF report for a country or region.
 */
const generatePDFReport = (res: Response, data: any, title: string) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=GeoPulse_Report_${Date.now()}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(25).text('GeoPulse Intelligence Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown();

  // Summary
  doc.fontSize(16).text('Stability Overview');
  doc.moveDown();
  doc.fontSize(12).text(`Total Articles Analyzed: ${data.totalArticles || 0}`);
  doc.text(`Current Stability Score: ${data.stabilityScore || 'N/A'}`);
  doc.text(`Active Crisis Events: ${data.crisisCount || 0}`);
  doc.moveDown();

  // Crisis Details
  if (data.crises && data.crises.length > 0) {
    doc.fontSize(16).text('Current Crisis Events');
    doc.moveDown();
    data.crises.forEach((c: any, i: number) => {
      doc.fontSize(12).text(`${i + 1}. ${c.title} (${c.severity.toUpperCase()})`);
      doc.fontSize(10).text(`Type: ${c.type} | Status: ${c.status}`);
      doc.moveDown(0.5);
    });
  }

  doc.end();
};

export const analyticsService = {
  getStabilityTrends,
  detectAnomalies,
  generatePDFReport,
};
