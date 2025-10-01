import type { Idea, Vote } from '../entities/index.js';

export interface IIdeasRepository {
  findAll(): Promise<Idea[]>;
  findById(id: number): Promise<Idea | null>;
  incrementVoteCount(id: number): Promise<Idea>;
}

export interface IVotesRepository {
  create(ideaId: number, ipAddress: string): Promise<Vote>;
  countByIpAddress(ipAddress: string): Promise<number>;
  existsByIdeaAndIp(ideaId: number, ipAddress: string): Promise<boolean>;
  findByIpAddress(ipAddress: string): Promise<Vote[]>;
}
