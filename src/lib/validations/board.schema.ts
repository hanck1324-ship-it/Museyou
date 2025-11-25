import { z } from 'zod';

export const boardPostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하여야 합니다'),
  summary: z.string().min(1, '요약을 입력해주세요').max(500, '요약은 500자 이하여야 합니다'),
  category: z.string().min(1, '카테고리를 입력해주세요'),
  tags: z.string().optional(),
  author: z.string().optional(),
  organization: z.string().optional(),
  contactEmail: z.string().email('올바른 이메일 형식이 아닙니다'),
  contactLink: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  coverImage: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  content: z.string().min(10, '본문은 최소 10자 이상이어야 합니다'),
});

export type BoardPostFormData = z.infer<typeof boardPostSchema>;

