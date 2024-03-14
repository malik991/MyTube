import conf from "../config/viteConfiguration";
import axios from "axios";
import axiosInstance from "../config/axiosInstance";

export class DBServices {
  async updateTitleDesc({ title, description, isPublished }, videoId) {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isPublished", isPublished);
      const res = await axiosInstance.patch(
        `/videos/update-title-description/${videoId}`,
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
      throw error;
    }
  }
  async uploadVideo({ videoFile, thumbNail, title, description, isPublished }) {
    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile[0]);
      formData.append("thumbNail", thumbNail[0]);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isPublished", isPublished);

      const res = await axiosInstance.post(`/videos/upload-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      console.error("Error in upload video :: ", error);
      throw error;
    }
  }
  async updateThumbnail({ thumbNail }, videoId) {
    try {
      const formData = new FormData();
      formData.append("thumbNail", thumbNail[0]);

      const res = await axiosInstance.patch(
        `/videos/update-thumbnail/${videoId}`,
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
      throw error;
    }
  }
  async getAllVideos(
    sortBy = null,
    sortType = "",
    userId = null,
    page = 1,
    query = ""
  ) {
    try {
      //console.log("quer: ", query);
      let url = `${conf.ServerUrl}/videos/get-all-videos`;
      // Construct query parameters
      const queryParams = new URLSearchParams({
        sortBy,
        sortType,
        query,
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
      let url = `/videos/user-specific-videos`;
      const queryParams = new URLSearchParams({
        page: page.toString(), // Convert page to string
      });
      url += `?${queryParams.toString()}`;
      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
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
      const res = await axiosInstance.delete(
        `/videos/delete-video/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in delete video :: ", error);
      throw error;
    }
  }
  //get video by id and increase the views
  async getVideoById(videoId) {
    try {
      const res = await axiosInstance.get(`/videos/get-video/${videoId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.error("Error in get video by id :: ", error);
      throw error;
    }
  }

  // get videos by channel or userId
  async getVideosByUserId(page = 1, channelId) {
    try {
      if (!channelId) {
        return "channel Id not present";
      }

      let url = `${conf.ServerUrl}/videos/get-channel-videos/${channelId}`;
      const queryParams = new URLSearchParams({
        page: page.toString(), // Convert page to string
      });
      url += `?${queryParams.toString()}`;
      //console.log("URL: ", url);
      const res = await axios.get(url);
      return res;
    } catch (error) {
      console.error("Error in get videos by channel/user id :: ", error);
      throw error;
    }
  }

  // watch video views
  async getVideoViews(videoId) {
    try {
      const res = await axiosInstance.get(`/videos/watch-video/${videoId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.error("Error in get video views :: ", error);
      throw error?.message;
    }
  }
  // toggle publish status of video
  async toggledPublishVideoStatus(videoId) {
    try {
      const res = await axiosInstance.patch(
        `/videos/publish-status/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in toggle publish video status :: ", error);
      throw error;
    }
  }
  // create playlist
  async createPlaylist({ name, description }) {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      const res = await axiosInstance.post(
        `/playlist/create-play-list`,
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
  async getUserPlaylist(page = 1) {
    try {
      let url = `/playlist/check-user-playlist`;
      const queryParams = new URLSearchParams({
        page: page.toString(), // Convert page to string
      });
      url += `?${queryParams.toString()}`;
      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("data in slice: ", res.data.data);
      return res.data?.data;
    } catch (error) {
      console.error("Error in get user's playlist :: ", error);
      throw error;
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
      const res = await axiosInstance.post(
        `/playlist/update-playlist/${playlistId}`,
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
      const res = await axiosInstance.post(
        `/playlist/add-video-into-playlist/${videoId}/${playlistId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in add video into playlist :: ", error);
      throw error;
    }
  }

  // delete playlist
  async deletePlaylist(playlistId) {
    try {
      if (!playlistId) {
        return "Playlist Id is mendatory";
      }
      const res = await axiosInstance.delete(
        `/playlist/delete-playlist/${playlistId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in delete playlist :: ", error);
      throw error;
    }
  }

  // delete video from playlist
  async deleteVideoFromPlaylist(videoId, playlistId) {
    try {
      if (!videoId || !playlistId) {
        return "Playlist Id and video id is mendatory";
      }
      const res = await axiosInstance.delete(
        `/playlist/deleted-from-playlist/${videoId}/${playlistId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in deleting video from playlist :: ", error);
      throw error;
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
  async getCommentsByVideoId(videoId, page = 1) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      let url = `/comment/main-parent-comments/${videoId}`;
      const queryParams = new URLSearchParams({
        page: page.toString(),
      });
      url += `?${queryParams.toString()}`;
      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.error("Error in getting video comments :: ", error);
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
      const res = await axiosInstance.post(
        `/comment/add-comment/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while inserting comment :: ", error);
      throw error;
    }
  }

  // update comment
  async updateComment(contentId, content) {
    try {
      if (!contentId || !content) {
        return "content Id and content of comment is mendatory";
      }
      const formData = new FormData();
      formData.append("content", content);
      const res = await axiosInstance.put(
        `/comment/edit-comment/${contentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while update comment :: ", error);
      throw error;
    }
  }

  // add reply
  async addReply(
    parentCommentId = "64f017c3678dde20ab9ec8b0",
    replyContent,
    parentReplyId
  ) {
    try {
      // if (!parentCommentId || !replyContent) {
      //   return "content Id and content of comment is mendatory";
      // }
      const formData = new FormData();
      formData.append("replyContent", replyContent);
      formData.append("parentReplyId", parentReplyId);
      const res = await axiosInstance.post(
        `/comment/reply-comment/${parentCommentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while reply to comment :: ", error);
      throw error;
    }
  }

  // get nested replies
  async getNestedReplies(parentReplyId) {
    try {
      if (!parentReplyId) {
        return "Parent Reply Id is mendatory";
      }
      let url = `/comment/nested-comments/${parentReplyId}`;

      const res = await axiosInstance.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    } catch (error) {
      console.error("Error in getting nested replies :: ", error);
      throw error;
    }
  }

  // delete comment
  async deleteComment(contentId) {
    try {
      if (!contentId) {
        return "comment Id is mendatory";
      }
      const res = await axiosInstance.delete(
        `/comment/delete-comment/${contentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error in delete comment :: ", error);
      throw error;
    }
  }

  // get total likes by comment id
  async getLikesByCommentId(contentId) {
    try {
      if (!contentId) {
        return "Comment Id is mendatory";
      }
      const res = await axiosInstance.get(
        `/like/liked-comments-by-commentId/${contentId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while getting Totle likes by comment id :: ", error);
      throw error;
    }
  }

  // get likes by video Id
  async getLikesByVideoId(videoId) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      const res = await axiosInstance.get(
        `/like/liked-videos-by-videoId/v/${videoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while getting likes by video ID :: ", error);
      throw error;
    }
  }
  // toggle video likes
  async toggleVideoLikes(videoId) {
    try {
      if (!videoId) {
        return "Video Id is mendatory";
      }
      const res = await axiosInstance.post(
        `/like/toggle/v/${videoId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while toggle video like :: ", error);
      throw error;
    }
  }

  // toggle comment likes
  async toggleCommentLikes(contentId) {
    try {
      if (!contentId) {
        return "comment Id is mendatory";
      }
      const res = await axiosInstance.post(
        `/like/toggle/c/${contentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error while toggle comment like :: ", error);
      throw error;
    }
  }
}

const dbServiceObj = new DBServices();
export default dbServiceObj;
