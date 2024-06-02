import axios from 'axios';
import { BackendUrl } from '@/consts';

const authService = {
  async checkAuth() {
    const token = localStorage.getItem('token'); // 从本地存储中获取令牌
    if (!token) {
      // 如果本地存储中没有令牌，则认为用户未登录
      return { success: false };
    }

    try {
      // 发送令牌到后端进行验证
      const response = await axios.post(`${BackendUrl}/auth/check`, { token });
      // 如果验证成功，则返回用户信息
      return { success: true, user: response.data.user };
    } catch (error) {
      // 如果验证失败，则认为用户未登录
      return { success: false };
    }
  },
};

export default authService;
