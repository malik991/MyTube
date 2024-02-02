import conf from "../config/viteConfiguration";
import axios from "axios";

export class DBServices {
  async updateTitleDesc({ title, description }, videoId) {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      const res = await axios.patch(
        `${conf.ServerUrl}/videos/update-title-description/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in updateTitleDesc:: ", error);
      throw error?.message;
    }
  }
  async uploadVideo({ videoFile, thumbNail, title, description }) {
    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbNail", thumbNail);
      formData.append("title", title);
      formData.append("description", description);
      const res = await axios.post(
        `${conf.ServerUrl}/videos/upload-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in upload video :: ", error);
      throw error?.message;
    }
  }
  async updateThumbnail({ thumbNail }, videoId) {
    try {
      const formData = new FormData();
      formData.append("thumbNail", thumbNail);

      const res = await axios.patch(
        `${conf.ServerUrl}/videos/update-thumbnail/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in update video thumbnail :: ", error);
      throw error?.message;
    }
  }
  async getAllVideos(
    sortBy = "createdAt",
    sortType = "desc",
    userId = null,
    page = 1
  ) {
    try {
      let url = `${conf.ServerUrl}/videos/get-all-videos`;
      // Construct query parameters
      const queryParams = new URLSearchParams({
        sortBy,
        sortType,
        page: page.toString(), // Convert page to string
      });
      // Append userId to the URL only if it's provided
      if (userId) {
        queryParams.append("userId", userId);
      }
      // Append query parameters to the URL
      url += `?${queryParams.toString()}`;
      //console.log("enter in getall videos ", url);
      // Make the request
      const res = await axios.get(url);
      return res;
    } catch (error) {
      console.error("Error in get all videos :: ", error);
      throw error?.message;
    }
  }
  // user specific videos
  async getUserVideos(page = 1) {
    try {
      let url = `${conf.ServerUrl}/videos/user-specific-videos`;
      const queryParams = new URLSearchParams({
        page: page.toString(), // Convert page to string
      });
      url += `?${queryParams.toString()}`;
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return res;
    } catch (error) {
      console.error("Error in get user specific videos :: ", error);
      throw error;
    }
  }
  // delete video
  async deleteVideo(videoId) {
    try {
      const res = await axios.delete(
        `${conf.ServerUrl}/videos/delete-video/${videoId}`
      );
      return res;
    } catch (error) {
      console.error("Error in delete video :: ", error);
      throw error?.message;
    }
  }
  //get video by id and increase the views
  async getVideoById(videoId) {
    try {
      const res = await axios.get(
        `${conf.ServerUrl}/videos/get-video/${videoId}`
      );
      return res;
    } catch (error) {
      console.error("Error in get video by id :: ", error);
      throw error?.message;
    }
  }

  // watch video views
  async getVideoViews(videoId) {
    try {
      const res = await axios.get(
        `${conf.ServerUrl}/videos/watch-video/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res;
    } catch (error) {
      console.error("Error in get video views :: ", error);
      throw error?.message;
    }
  }
  // toggle publish status of video
  async toggledPublishVideoStatus(videoId) {
    try {
      const res = await axios.get(
        `${conf.ServerUrl}/videos/publish-status/${videoId}`
      );
      return res;
    } catch (error) {
      console.error("Error in toggle publish video status :: ", error);
      throw error?.message;
    }
  }
  // create playlist
  async createPlaylist({ name, description }) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      const res = await axios.post(
        `${conf.ServerUrl}/playlist/create-play-list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in create playlist :: ", error);
      throw error?.message;
    }
  }
  // update playlist
  async updatePlaylist({ name, description }, playlistId) {
    try {
      if (!name || !playlistId) {
        return "Playlist name and id is mendatory";
      }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      const res = await axios.post(
        `${conf.ServerUrl}/playlist/update-playlist/${playlistId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in update playlist :: ", error);
      throw error?.message;
    }
  }
  // add video into playlist
  async addVideoIntoPlaylist(videoId, playlistId) {
    try {
      if (!videoId || !playlistId) {
        return "Playlist Id and video id is mendatory";
      }
      const res = await axios.post(
        `${conf.ServerUrl}/playlist/add-video-into-playlist/${videoId}/${playlistId}`
      );
      return res;
    } catch (error) {
      console.error("Error in add video into playlist :: ", error);
      throw error?.message;
    }
  }

  // get user playlists
  async getUserPlaylists() {
    try {
      const res = await axios.get(
        `${conf.ServerUrl}/videos/check-user-playlist`
      );
      return res;
    } catch (error) {
      console.error("Error in get user playlists :: ", error);
      throw error?.message;
    }
  }

  // delete playlist
  async deletePlaylist(playlistId) {
    try {
      if (!playlistId) {
        return "Playlist Id is mendatory";
      }
      const res = await axios.delete(
        `${conf.ServerUrl}/playlist/delete-playlist/${playlistId}`
      );
      return res;
    } catch (error) {
      console.error("Error in delete playlist :: ", error);
      throw error?.message;
    }
  }

  // delete video from playlist
  async deleteVideoFromPlaylist(videoId, playlistId) {
    try {
      if (!videoId || !playlistId) {
        return "Playlist Id and video id is mendatory";
      }
      const res = await axios.delete(
        `${conf.ServerUrl}/playlist/deleted-from-playlist/${videoId}/${playlistId}`
      );
      return res;
    } catch (error) {
      console.error("Error in deleting video from playlist :: ", error);
      throw error?.message;
    }
  }

  // get playlisy by id
  async getPlaylistById(playlistId) {
    try {
      if (!playlistId) {
        return "Playlist Id is mendatory";
      }
      const res = await axios.get(
        `${conf.ServerUrl}/playlist/get-playlist/${playlistId}`
      );
      return res;
    } catch (error) {
      console.error("Error in getting single playlist by id :: ", error);
      throw error?.message;
    }
  }

  // get all comments by video id
  async getCommentsByVideoId(videoId) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      const res = await axios.get(
        `${conf.ServerUrl}/comment/get-comments/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res;
    } catch (error) {
      console.error("Error in getting single playlist by id :: ", error);
      throw error;
    }
  }

  // insert a comment
  async addComment(content, videoId) {
    try {
      if (!videoId || !content) {
        return "Video Id and content of comment is mendatory";
      }
      const formData = new FormData();
      formData.append("content", content);
      const res = await axios.post(
        `${conf.ServerUrl}/comment/add-comment/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return res;
    } catch (error) {
      console.error("Error while inserting comment :: ", error);
      throw error;
    }
  }

  // get likes by video Id
  async getLikesByVideoId(videoId) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      const res = await axios.get(
        `${conf.ServerUrl}/like/liked-videos-by-videoId/v/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res;
    } catch (error) {
      console.error("Error in getting single playlist by id :: ", error);
      throw error;
    }
  }
  // toggle video likes
  async toggleVideoLikes(videoId) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      const res = await axios.post(
        `${conf.ServerUrl}/like/toggle/v/${videoId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res;
    } catch (error) {
      console.error("Error while toggle video like :: ", error);
      throw error;
    }
  }
}

const dbServiceObj = new DBServices();
export default dbServiceObj;
