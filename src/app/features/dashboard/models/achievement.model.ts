export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: AchievementCategory;
  earnedDate?: Date;
  progress?: number;
  isUnlocked: boolean;
  rarity: AchievementRarity;
}

export enum AchievementCategory {
  COURSES = 'COURSES',
  LEARNING_STREAK = 'LEARNING_STREAK',
  QUIZZES = 'QUIZZES',
  CERTIFICATES = 'CERTIFICATES',
  COMMUNITY = 'COMMUNITY',
}

export enum AchievementRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}
