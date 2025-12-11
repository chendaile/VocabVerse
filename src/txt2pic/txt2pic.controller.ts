import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('txt2pic')
export class txt2picController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('generate-image')
  async generateImage(@Body() body: { prompt: string; num_images?: number }) {
    const prompt = body?.prompt?.trim();
    if (!prompt) {
      throw new BadRequestException('prompt 不能为空');
    }
    const numImages = body?.num_images ?? 1;

    const task = await this.prisma.task.create({
      data: {
        type: 'generate_image',
        prompt,
        status: TaskStatus.PENDING,
        payload: {
          // payload 仍可用于存储其他额外信息
          num_images: numImages,
        },
      },
    });

    // Notify the worker that a new task is available
    await this.prisma.$queryRawUnsafe('NOTIFY new_task_channel;');

    return {
      taskId: task.id,
      status: task.status,
      message: 'Image generation task has been accepted. Please poll for status.',
    };
  }

  @Get('images/status/:taskId')
  async getImageStatus(@Param('taskId') taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      taskId: task.id,
      status: task.status,
      result: task.result,
      error: task.error,
    };
  }
}
