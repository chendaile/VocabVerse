import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('txt2pic')
export class txt2picController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('generate-image')
  async generateImage(@Body() body: { word: string; num_images?: number }) {
    const task = await this.prisma.task.create({
      data: {
        type: 'generate_image',
        status: TaskStatus.PENDING,
        payload: {
          word: body.word,
          num_images: body.num_images || 1,
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
