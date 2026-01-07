import { Injectable } from '@nestjs/common';
import { JobQueueService as IJobQueueService, Job } from './job-queue.interface';

@Injectable()
export class JobQueueService implements IJobQueueService {
  private jobs: Map<string, Job> = new Map();
  private handlers: Map<string, (job: Job) => Promise<void>> = new Map();
  private processing: Set<string> = new Set();

  async add(
    name: string,
    data: any,
    options?: { delay?: number; attempts?: number }
  ): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const job: Job = {
      id,
      name,
      data,
      attempts: 0,
      createdAt: new Date(),
    };

    this.jobs.set(id, job);

    // Process immediately if no delay, otherwise schedule
    if (!options?.delay) {
      this.processJob(job, options?.attempts || 3);
    } else {
      setTimeout(() => {
        this.processJob(job, options?.attempts || 3);
      }, options.delay);
    }

    return id;
  }

  process(name: string, handler: (job: Job) => Promise<void>): void {
    this.handlers.set(name, handler);
  }

  async getJob(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }

  async removeJob(id: string): Promise<void> {
    this.jobs.delete(id);
  }

  private async processJob(job: Job, maxAttempts: number): Promise<void> {
    if (this.processing.has(job.id)) {
      return;
    }

    const handler = this.handlers.get(job.name);
    if (!handler) {
      console.warn(`No handler found for job: ${job.name}`);
      return;
    }

    this.processing.add(job.id);

    try {
      await handler(job);
      this.jobs.delete(job.id);
    } catch (error) {
      job.attempts++;
      if (job.attempts < maxAttempts) {
        // Retry with exponential backoff
        const delay = Math.pow(2, job.attempts) * 1000;
        setTimeout(() => {
          this.processJob(job, maxAttempts);
        }, delay);
      } else {
        console.error(`Job ${job.id} failed after ${maxAttempts} attempts:`, error);
        // Keep job for manual inspection
      }
    } finally {
      this.processing.delete(job.id);
    }
  }
}
