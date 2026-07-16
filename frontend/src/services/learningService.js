import axiosInstance from './axiosInstance';

class LearningService {
  /**
   * Fetch all published courses
   */
  async getCourses() {
    return await axiosInstance.get('/learning/courses');
  }

  /**
   * Fetch a specific course by slug
   */
  async getCourseBySlug(slug) {
    return await axiosInstance.get(`/learning/course/${slug}`);
  }

  /**
   * Fetch a specific lesson by ID
   */
  async getLesson(lessonId) {
    return await axiosInstance.get(`/learning/lesson/${lessonId}`);
  }

  /**
   * Mark a lesson as complete
   */
  async completeLesson(lessonId) {
    return await axiosInstance.post(`/learning/lesson/${lessonId}/complete`);
  }
}

export default new LearningService();
