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
   * Fetch quiz for a specific lesson
   */
  async getLessonQuiz(lessonId) {
    return await axiosInstance.get(`/learning/lesson/${lessonId}/quiz`);
  }

  /**
   * Submit quiz for a specific lesson
   */
  async submitQuiz(lessonId, data) {
    return await axiosInstance.post(`/learning/lesson/${lessonId}/quiz`, data);
  }

  /**
   * Mark a lesson as complete
   */
  async completeLesson(lessonId) {
    return await axiosInstance.post(`/learning/lesson/${lessonId}/complete`);
  }
}

export default new LearningService();
