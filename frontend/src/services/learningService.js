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
}

export default new LearningService();
