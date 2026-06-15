import { Request } from 'express';
import { fn, col } from 'sequelize';
import db from '../models';
import { FileInputData, CompletionData } from '../types';

const { Conversion, File } = db;

type ToolType = 'merge' | 'split' | 'compress' | 'rotate' | 'watermark' | 'page_numbers' | 'jpg_to_pdf' | 'pdf_to_jpg';

class ConversionService {
  /**
   * Create a new conversion record
   */
  async createConversion({
    toolType,
    originalFilename,
    options = {},
    req,
  }: {
    toolType: string;
    originalFilename: string;
    options?: Record<string, unknown>;
    req?: Request;
  }) {
    const conversion = await Conversion.create({
      tool_type: toolType as ToolType,
      status: 'pending',
      original_filename: originalFilename,
      options,
      ip_address: req?.ip || req?.headers?.['x-forwarded-for'] as string || undefined,
      user_agent: req?.headers?.['user-agent'] || undefined,
    });
    return conversion;
  }

  /**
   * Record an input file for a conversion
   */
  async addInputFile(conversionId: string, { originalName, storedName, mimeType, size, filePath }: FileInputData) {
    return File.create({
      conversion_id: conversionId,
      original_name: originalName,
      stored_name: storedName,
      mime_type: mimeType,
      size,
      file_type: 'input',
      file_path: filePath,
    });
  }

  /**
   * Record an output file for a conversion
   */
  async addOutputFile(conversionId: string, { originalName, storedName, mimeType, size, filePath }: FileInputData) {
    return File.create({
      conversion_id: conversionId,
      original_name: originalName,
      stored_name: storedName,
      mime_type: mimeType,
      size,
      file_type: 'output',
      file_path: filePath,
    });
  }

  /**
   * Update conversion status to processing
   */
  async markProcessing(conversionId: string) {
    return Conversion.update(
      { status: 'processing' },
      { where: { id: conversionId } }
    );
  }

  /**
   * Mark conversion as completed with results
   */
  async markCompleted(conversionId: string, { outputFilename, outputSize, originalSize, pageCount, compressionRatio }: CompletionData) {
    const updateData: Record<string, unknown> = {
      status: 'completed',
      output_filename: outputFilename,
      completed_at: new Date(),
    };
    if (outputSize !== undefined) updateData.output_size = outputSize;
    if (originalSize !== undefined) updateData.original_size = originalSize;
    if (pageCount !== undefined) updateData.page_count = pageCount;
    if (compressionRatio !== undefined) updateData.compression_ratio = compressionRatio;

    return Conversion.update(updateData, { where: { id: conversionId } });
  }

  /**
   * Mark conversion as failed
   */
  async markFailed(conversionId: string, errorMessage: string) {
    return Conversion.update(
      {
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date(),
      },
      { where: { id: conversionId } }
    );
  }

  /**
   * Get conversion by ID
   */
  async getConversion(conversionId: string) {
    return Conversion.findByPk(conversionId, {
      include: [{ model: File, as: 'files' }],
    });
  }

  /**
   * Get recent conversions with optional filters
   */
  async getRecentConversions(limit = 10, filters: { toolType?: string; status?: string } = {}) {
    const where: Record<string, unknown> = {};
    if (filters.toolType) where.tool_type = filters.toolType;
    if (filters.status) where.status = filters.status;

    return Conversion.findAll({
      where,
      include: [{ model: File, as: 'files' }],
      order: [['created_at', 'DESC']],
      limit,
    });
  }

  /**
   * Get usage statistics
   */
  async getStats() {
    const totalConversions = await Conversion.count();
    const completedConversions = await Conversion.count({ where: { status: 'completed' } });
    const failedConversions = await Conversion.count({ where: { status: 'failed' } });

    const toolStats = await Conversion.findAll({
      attributes: [
        'tool_type',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['tool_type'],
      raw: true,
    });

    const totalSize = await File.sum('size', {
      where: { file_type: 'input' },
    });

    return {
      totalConversions,
      completedConversions,
      failedConversions,
      successRate: totalConversions > 0
        ? ((completedConversions / totalConversions) * 100).toFixed(1)
        : 0,
      totalDataProcessed: totalSize || 0,
      toolStats,
    };
  }
}

export default new ConversionService();
