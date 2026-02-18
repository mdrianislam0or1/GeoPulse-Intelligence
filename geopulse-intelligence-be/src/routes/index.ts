import express from 'express';
import { aiRoutes } from '../app/modules/AI/ai.module';
import { enhancedAIRoutes } from '../app/modules/AI/enhancedAI.module';
import { adminRoutes } from '../app/modules/Admin/admin.module';
import { aiHelperRoutes } from '../app/modules/AiHelper/aiHelper.routes';
import { analyticsRoutes } from '../app/modules/Analytics/analytics.module';
import { authRoutes } from '../app/modules/Auth/auth.routes';
import { categoryRoutes } from '../app/modules/Blog/Category/category.routes';
import { commentRoutes } from '../app/modules/Blog/Comment/comment.module';
import { postRoutes } from '../app/modules/Blog/Post/post.routes';
import { tagRoutes } from '../app/modules/Blog/Tag/tag.routes';
import { calendarRoutes } from '../app/modules/Calendar/calendar.module';
import { careerRoutes } from '../app/modules/Career/career.routes';
import { dashboardRoutes } from '../app/modules/Dashboard/dashboard.module';
import { codeSnippetRoutes } from '../app/modules/Learning/CodeSnippet/codeSnippet.module';
import { learningLogRoutes } from '../app/modules/Learning/LearningLog/learningLog.module';
import { noteRoutes } from '../app/modules/Learning/Note/note.module';
import { newsletterRoutes } from '../app/modules/Newsletter/newsletter.module';
import { notificationRoutes } from '../app/modules/Notification/notification.module';
import { projectRoutes } from '../app/modules/Project/project.routes';
import { systemRoutes } from '../app/modules/System/system.module';
import { apiKeyRoutes } from '../app/modules/User/apiKey.module';
import { userRoutes } from '../app/modules/User/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/api-keys',
    route: apiKeyRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/tags',
    route: tagRoutes,
  },
  {
    path: '/comments',
    route: commentRoutes,
  },
  {
    path: '/projects',
    route: projectRoutes,
  },
  {
    path: '/careers',
    route: careerRoutes,
  },
  {
    path: '/ai',
    route: enhancedAIRoutes,
  },
  {
    path: '/ai',
    route: aiRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/analytics',
    route: analyticsRoutes,
  },
  {
    path: '/calendar',
    route: calendarRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/learning/snippets',
    route: codeSnippetRoutes,
  },
  {
    path: '/learning/logs',
    route: learningLogRoutes,
  },
  {
    path: '/learning/notes',
    route: noteRoutes,
  },
  {
    path: '/newsletter',
    route: newsletterRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/system',
    route: systemRoutes,
  },
  {
    path: '/ai-helper',
    route: aiHelperRoutes,
  },


];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});


export default router;
