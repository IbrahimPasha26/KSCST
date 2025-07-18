import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

export const registerTrainee = async (traineeData) => {
  try {
    const response = await api.post('/auth/trainee/register', traineeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register trainee' };
  }
};

export const registerTrainer = async (trainerData) => {
  try {
    const response = await api.post('/auth/trainer/register', trainerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register trainer' };
  }
};

export const login = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    console.debug('authService: Login response', response.data);
    return response.data;
  } catch (error) {
    console.error('authService: Login error', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to login' };
  }
};

export const getAllTrainees = async (credentials) => {
  try {
    const response = await api.get('/admin/trainees', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch trainees' };
  }
};

export const getAllTrainers = async (credentials) => {
  try {
    const response = await api.get('/admin/trainers', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch trainers' };
  }
};

export const deleteTrainee = async (id, credentials) => {
  try {
    const response = await api.delete(`/admin/trainee/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete trainee' };
  }
};

export const deleteTrainer = async (id, credentials) => {
  try {
    const response = await api.delete(`/admin/trainer/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete trainer' };
  }
};

export const approveTrainee = async (id, trainerId, credentials) => {
  try {
    const response = await api.put(`/admin/trainee/approve/${id}`, { trainerId }, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve trainee' };
  }
};

export const rejectTrainee = async (id, credentials) => {
  try {
    const response = await api.put(`/admin/trainee/reject/${id}`, {}, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject trainee' };
  }
};

export const approveTrainer = async (id, credentials) => {
  try {
    const response = await api.put(`/admin/trainer/approve/${id}`, {}, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to approve trainer' };
  }
};

export const rejectTrainer = async (id, credentials) => {
  try {
    const response = await api.put(`/admin/trainer/reject/${id}`, {}, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reject trainer' };
  }
};

export const getApprovedTrainers = async (credentials) => {
  try {
    const response = await api.get('/admin/trainers/approved', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch approved trainers' };
  }
};

export const getAllTraineeProgress = async (credentials) => {
  try {
    const response = await api.get('/admin/progress', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get all trainee progress error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch trainee progress' };
  }
};

export const deployCertificate = async (traineeId, credentials) => {
  try {
    const response = await api.post(`/admin/certificate/${traineeId}`, {}, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Deploy certificate error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to deploy certificate' };
  }
};

export const getTraineeCertificate = async (credentials) => {
  try {
    const response = await api.get('/trainee/certificate', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Suppress console logging for expected 404s
      throw { ...error.response?.data, isExpected404: true } || { message: 'No certificate found', isExpected404: true };
    }
    console.error('Get trainee certificate error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch certificate' };
  }
};

export const getTrainerProfile = async (credentials) => {
  try {
    const response = await api.get('/trainer/profile', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get trainer profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch trainer profile' };
  }
};

export const updateTrainerProfile = async (profileData, credentials) => {
  try {
    const response = await api.put('/trainer/profile', profileData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update trainer profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to update trainer profile' };
  }
};

export const getAssignedTrainees = async (credentials) => {
  try {
    const response = await api.get('/trainer/trainees', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get assigned trainees error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch assigned trainees' };
  }
};

export const getTrainerMaterials = async (credentials) => {
  try {
    const response = await api.get('/trainer/materials', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    console.debug('authService: Trainer materials response', response.data);
    return response.data;
  } catch (error) {
    console.error('Get trainer materials error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch materials' };
  }
};

export const uploadTrainingMaterial = async (formData, credentials) => {
  try {
    const response = await api.post('/trainer/materials', formData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.debug('authService: Upload material response', response.data);
    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      code: error.code,
    };
    console.error('authService: Upload material error:', errorDetails);
    throw error.response?.data || { message: 'Failed to upload training material' };
  }
};

export const updateTrainingMaterial = async (id, formData, credentials) => {
  try {
    const response = await api.put(`/trainer/materials/${id}`, formData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.debug('authService: Update material response', response.data);
    return response.data;
  } catch (error) {
    console.error('Update training material error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to update material' };
  }
};

export const deleteTrainingMaterial = async (id, credentials) => {
  try {
    const response = await api.delete(`/trainer/materials/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    console.debug('authService: Delete material response', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete training material error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to delete material' };
  }
};

export const getTrainerPlaylists = async (credentials) => {
  try {
    const response = await api.get('/trainer/playlists', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get trainer playlists error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch trainer playlists' };
  }
};

export const createPlaylist = async (playlistData, credentials) => {
  try {
    const response = await api.post('/trainer/playlists', playlistData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create playlist error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to create playlist' };
  }
};

export const updatePlaylist = async (id, playlistData, credentials) => {
  try {
    const response = await api.put(`/trainer/playlists/${id}`, playlistData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update playlist error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to update playlist' };
  }
};

export const deletePlaylist = async (id, credentials) => {
  try {
    const response = await api.delete(`/trainer/playlists/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete playlist error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to delete playlist' };
  }
};

export const getTraineeProfile = async (credentials) => {
  try {
    const response = await api.get('/trainee/profile', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get trainee profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const updateTraineeProfile = async (profileData, credentials) => {
  try {
    const response = await api.put('/trainee/profile', profileData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update trainee profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export const getTrainingMaterials = async (credentials) => {
  try {
    const response = await api.get('/trainee/materials', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get training materials error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch materials' };
  }
};

export const markMaterialProgress = async (materialId, credentials) => {
  try {
    const response = await api.post('/trainee/progress', { materialId }, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Mark material progress error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to mark progress' };
  }
};

export const getTraineeProgress = async (credentials) => {
  try {
    const response = await api.get('/trainee/progress', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get trainee progress error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch progress' };
  }
};

export const getTraineePlaylists = async (credentials) => {
  try {
    const response = await api.get('/trainee/playlists', {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get trainee playlists error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to fetch playlists' };
  }
};

export const markVideoProgress = async (progressData, credentials) => {
  try {
    const response = await api.post('/trainee/video-progress', progressData, {
      headers: {
        Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Mark video progress error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error.response?.data || { message: 'Failed to mark video progress' };
  }
};