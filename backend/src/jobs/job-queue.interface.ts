export interface Job {
  id: string;
  name: string;
  data: any;
  attempts: number;
  createdAt: Date;
}

export interface JobQueueService {
  add(name: string, data: any, options?: { delay?: number; attempts?: number }): Promise<string>;
  process(name: string, handler: (job: Job) => Promise<void>): void;
  getJob(id: string): Promise<Job | null>;
  removeJob(id: string): Promise<void>;
}
