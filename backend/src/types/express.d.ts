import { ProjectMember } from '../projects/project-member.entity';

declare global {
  namespace Express {
    interface Request {
      projectMembership?: ProjectMember;
    }
  }
}