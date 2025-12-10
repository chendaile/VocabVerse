
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pool } from 'pg'; // 引入 node-postgres 的 Pool
import { TaskStatus } from '@prisma/client';

// 定义我们用于通知的数据库频道名称
const NOTIFY_CHANNEL = 'new_task_channel';

@Injectable()
export class TaskWorkerService implements OnModuleInit {
  // 创建一个日志记录器，方便调试
  private readonly logger = new Logger(TaskWorkerService.name);
  // 创建一个专用于监听通知的数据库连接池
  private pgPool: Pool;

  constructor(private readonly prisma: PrismaService) {
    // 初始化 pg 连接池。使用独立的连接池进行监听是推荐做法，
    // 因为监听连接会长期保持，不适合与 Prisma 的查询共用。
    this.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL, // 使用 .env 文件中的数据库连接字符串
    });
  }

  // 当模块初始化时，NestJS 会自动调用此方法
  async onModuleInit() {
    this.logger.log('初始化任务工作者...');

    try {
      // 从连接池获取一个客户端
      const client = await this.pgPool.connect();

      // 设置客户端的通知监听器
      client.on('notification', (msg) => {
        this.logger.log(`接收到通知，频道: ${msg.channel}`);
        // 当收到新任务通知时，调用 processPendingTask 方法处理任务
        this.processPendingTask();
      });

      // 命令客户端开始监听我们指定的频道
      await client.query(`LISTEN ${NOTIFY_CHANNEL}`);
      this.logger.log(`成功监听频道: ${NOTIFY_CHANNEL}`);

      // 为了处理在工作者离线期间可能错过的任务，在启动时也检查一次所有待处理任务
      this.processPendingTask();
    } catch (error) {
      this.logger.error('初始化监听失败', error);
    }
  }

  /**
   * 查找并处理一个待处理的任务。
   * 使用 `FOR UPDATE SKIP LOCKED` 来确保多个工作者实例（即使现在只有一个）不会同时处理同一个任务。
   */
  private async processPendingTask() {
    this.logger.log('检查待处理的任务...');

    try {
      // 在一个事务中执行查找和更新，确保原子性
      const task = await this.prisma.$transaction(async (tx) => {
        // 使用原生 SQL 查询来查找一个待处理任务并锁定它
        // FOR UPDATE SKIP LOCKED 是一种高效处理并发队列任务的 PostgreSQL 特性
        const tasks: any[] = await tx.$queryRaw`
          SELECT * FROM "Task" 
          WHERE status = 'PENDING' 
          ORDER BY "createdAt" ASC 
          LIMIT 1 
          FOR UPDATE SKIP LOCKED`;

        if (tasks.length === 0) {
          // 没有找到待处理的任务
          return null;
        }

        const taskToProcess = tasks[0];

        // 立即将任务状态更新为 "PROCESSING"，防止其他工作者再次选中
        const updatedTask = await tx.task.update({
          where: { id: taskToProcess.id },
          data: { status: TaskStatus.PROCESSING },
        });

        return updatedTask;
      });

      // 如果成功获取并锁定了任务
      if (task) {
        this.logger.log(`开始处理任务: ${task.id}`);

        // 模拟一个耗时的操作（例如，调用AI生成图片）
        await new Promise(resolve => setTimeout(resolve, 5000)); // 模拟5秒钟的工作

        // 任务处理完成后，更新状态为 "COMPLETED" 并存入结果
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            status: TaskStatus.COMPLETED,
            result: { url: `https://example.com/image_placeholder.png` }, // 这是一个模拟的结果
          },
        });

        this.logger.log(`任务 ${task.id} 处理完成。`);
      } else {
        // 如果没有找到待处理的任务
        this.logger.log('没有待处理的任务。');
      }
    } catch (error) {
      this.logger.error('处理任务时发生错误:', error);
      // 在实际应用中，这里应该将任务状态更新为 "FAILED" 并记录错误信息
    }
  }
}
