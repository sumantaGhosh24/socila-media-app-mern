import {GLOBALTYPES} from "./globalTypes";
import {postDataAPI} from "../../utils/fetchData";
import valid from "../../utils/valid";
export const login = (data) => async (dispatch) => {
  try {
    dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
    const res = await postDataAPI("login", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
    try {
      const res = await postDataAPI("refresh_token");
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });
      dispatch({type: GLOBALTYPES.ALERT, payload: {}});
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
};
export const register = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0)
    return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg});
  try {
    dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
    const res = await postDataAPI("register", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    await postDataAPI("logout");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

import {GLOBALTYPES, EditData, DeleteData} from "./globalTypes";
import {POST_TYPES} from "./postAction";
import {postDataAPI, patchDataAPI, deleteDataAPI} from "../../utils/fetchData";
import {createNotify, removeNotify} from "../actions/notifyAction";
export const createComment =
  ({post, newComment, auth, socket}) =>
  async (dispatch) => {
    const newPost = {...post, comments: [...post.comments, newComment]};
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    try {
      const data = {...newComment, postId: post._id, postUserId: post.user._id};
      const res = await postDataAPI("comment", data, auth.token);
      const newData = {...res.data.newComment, user: auth.user};
      const newPost = {...post, comments: [...post.comments, newData]};
      dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
      // Socket
      socket.emit("createComment", newPost);
      // Notify
      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply
          ? "mentioned you in a comment."
          : "has commented on your post.",
        recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const updateComment =
  ({comment, post, content, auth}) =>
  async (dispatch) => {
    const newComments = EditData(post.comments, comment._id, {
      ...comment,
      content,
    });
    const newPost = {...post, comments: newComments};
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    try {
      patchDataAPI(`comment/${comment._id}`, {content}, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const likeComment =
  ({comment, post, auth}) =>
  async (dispatch) => {
    const newComment = {...comment, likes: [...comment.likes, auth.user]};
    const newComments = EditData(post.comments, comment._id, newComment);
    const newPost = {...post, comments: newComments};
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    try {
      await patchDataAPI(`comment/${comment._id}/like`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const unLikeComment =
  ({comment, post, auth}) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: DeleteData(comment.likes, auth.user._id),
    };
    const newComments = EditData(post.comments, comment._id, newComment);
    const newPost = {...post, comments: newComments};
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    try {
      await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const deleteComment =
  ({post, comment, auth, socket}) =>
  async (dispatch) => {
    const deleteArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];
    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !deleteArr.find((da) => cm._id === da._id)
      ),
    };
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    socket.emit("deleteComment", newPost);
    try {
      deleteArr.forEach((item) => {
        deleteDataAPI(`comment/${item._id}`, auth.token);
        const msg = {
          id: item._id,
          text: comment.reply
            ? "mentioned you in a comment."
            : "has commented on your post.",
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
        };
        dispatch(removeNotify({msg, auth, socket}));
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };

import {GLOBALTYPES} from "./globalTypes";
import {getDataAPI} from "../../utils/fetchData";
export const DISCOVER_TYPES = {
  LOADING: "LOADING_DISCOVER",
  GET_POSTS: "GET_DISCOVER_POSTS",
  UPDATE_POST: "UPDATE_DISCOVER_POST",
};
export const getDiscoverPosts = (token) => async (dispatch) => {
  try {
    dispatch({type: DISCOVER_TYPES.LOADING, payload: true});
    const res = await getDataAPI(`post_discover`, token);
    dispatch({type: DISCOVER_TYPES.GET_POSTS, payload: res.data});
    dispatch({type: DISCOVER_TYPES.LOADING, payload: false});
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response.data.msg},
    });
  }
};

export const GLOBALTYPES = {
  AUTH: "AUTH",
  ALERT: "ALERT",
  THEME: "THEME",
  STATUS: "STATUS",
  MODAL: "MODAL",
  SOCKET: "SOCKET",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  CALL: "CALL",
  PEER: "PEER",
};
export const EditData = (data, id, post) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return newData;
};
export const DeleteData = (data, id) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};

import {GLOBALTYPES, DeleteData} from "../actions/globalTypes";
import {postDataAPI, getDataAPI, deleteDataAPI} from "../../utils/fetchData";
export const MESS_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  DELETE_MESSAGES: "DELETE_MESSAGES",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
  CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE",
};
export const addMessage =
  ({msg, auth, socket}) =>
  async (dispatch) => {
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg});
    const {_id, avatar, fullname, username} = auth.user;
    socket.emit("addMessage", {
      ...msg,
      user: {_id, avatar, fullname, username},
    });
    try {
      await postDataAPI("message", msg, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const getConversations =
  ({auth, page = 1}) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `conversations?limit=${page * 9}`,
        auth.token
      );
      let newArr = [];
      res.data.conversations.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.user._id) {
            newArr.push({
              ...cv,
              text: item.text,
              media: item.media,
              call: item.call,
            });
          }
        });
      });
      dispatch({
        type: MESS_TYPES.GET_CONVERSATIONS,
        payload: {newArr, result: res.data.result},
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const getMessages =
  ({auth, id, page = 1}) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.token
      );
      const newData = {...res.data, messages: res.data.messages.reverse()};
      dispatch({
        type: MESS_TYPES.GET_MESSAGES,
        payload: {...newData, _id: id, page},
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const loadMoreMessages =
  ({auth, id, page = 1}) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(
        `message/${id}?limit=${page * 9}`,
        auth.token
      );
      const newData = {...res.data, messages: res.data.messages.reverse()};
      dispatch({
        type: MESS_TYPES.UPDATE_MESSAGES,
        payload: {...newData, _id: id, page},
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const deleteMessages =
  ({msg, data, auth}) =>
  async (dispatch) => {
    const newData = DeleteData(data, msg._id);
    dispatch({
      type: MESS_TYPES.DELETE_MESSAGES,
      payload: {newData, _id: msg.recipient},
    });
    try {
      await deleteDataAPI(`message/${msg._id}`, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const deleteConversation =
  ({auth, id}) =>
  async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id});
    try {
      await deleteDataAPI(`conversation/${id}`, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };

import {GLOBALTYPES} from "./globalTypes";
import {
  postDataAPI,
  deleteDataAPI,
  getDataAPI,
  patchDataAPI,
} from "../../utils/fetchData";
export const NOTIFY_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",
  UPDATE_NOTIFY: "UPDATE_NOTIFY",
  UPDATE_SOUND: "UPDATE_SOUND",
  DELETE_ALL_NOTIFIES: "DELETE_ALL_NOTIFIES",
};
export const createNotify =
  ({msg, auth, socket}) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("notify", msg, auth.token);
      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar,
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const removeNotify =
  ({msg, auth, socket}) =>
  async (dispatch) => {
    try {
      await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, auth.token);
      socket.emit("removeNotify", msg);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const getNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("notifies", token);
    dispatch({type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies});
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response.data.msg},
    });
  }
};
export const isReadNotify =
  ({msg, auth}) =>
  async (dispatch) => {
    dispatch({
      type: NOTIFY_TYPES.UPDATE_NOTIFY,
      payload: {...msg, isRead: true},
    });
    try {
      await patchDataAPI(`/isReadNotify/${msg._id}`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const deleteAllNotifies = (token) => async (dispatch) => {
  dispatch({type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []});
  try {
    await deleteDataAPI("deleteAllNotify", token);
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response.data.msg},
    });
  }
};

import {GLOBALTYPES} from "./globalTypes";
import {imageUpload} from "../../utils/imageUpload";
import {
  postDataAPI,
  getDataAPI,
  patchDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";
import {createNotify, removeNotify} from "./notifyAction";
export const POST_TYPES = {
  CREATE_POST: "CREATE_POST",
  LOADING_POST: "LOADING_POST",
  GET_POSTS: "GET_POSTS",
  UPDATE_POST: "UPDATE_POST",
  GET_POST: "GET_POST",
  DELETE_POST: "DELETE_POST",
};
export const createPost =
  ({content, images, auth, socket}) =>
  async (dispatch) => {
    let media = [];
    try {
      dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
      if (images.length > 0) media = await imageUpload(images);
      const res = await postDataAPI(
        "posts",
        {content, images: media},
        auth.token
      );
      dispatch({
        type: POST_TYPES.CREATE_POST,
        payload: {...res.data.newPost, user: auth.user},
      });
      dispatch({type: GLOBALTYPES.ALERT, payload: {loading: false}});
      // Notify
      const msg = {
        id: res.data.newPost._id,
        text: "added a new post.",
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content,
        image: media[0].url,
      };
      dispatch(createNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const getPosts = (token) => async (dispatch) => {
  try {
    dispatch({type: POST_TYPES.LOADING_POST, payload: true});
    const res = await getDataAPI("posts", token);
    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: {...res.data, page: 2},
    });
    dispatch({type: POST_TYPES.LOADING_POST, payload: false});
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response.data.msg},
    });
  }
};
export const updatePost =
  ({content, images, auth, status}) =>
  async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter((img) => !img.url);
    const imgOldUrl = images.filter((img) => img.url);
    if (
      status.content === content &&
      imgNewUrl.length === 0 &&
      imgOldUrl.length === status.images.length
    )
      return;
    try {
      dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
      if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);
      const res = await patchDataAPI(
        `post/${status._id}`,
        {
          content,
          images: [...imgOldUrl, ...media],
        },
        auth.token
      );
      dispatch({type: POST_TYPES.UPDATE_POST, payload: res.data.newPost});
      dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}});
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const likePost =
  ({post, auth, socket}) =>
  async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, auth.user]};
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    socket.emit("likePost", newPost);
    try {
      await patchDataAPI(`post/${post._id}/like`, null, auth.token);
      // Notify
      const msg = {
        id: auth.user._id,
        text: "like your post.",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };
      dispatch(createNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const unLikePost =
  ({post, auth, socket}) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: post.likes.filter((like) => like._id !== auth.user._id),
    };
    dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
    socket.emit("unLikePost", newPost);
    try {
      await patchDataAPI(`post/${post._id}/unlike`, null, auth.token);
      // Notify
      const msg = {
        id: auth.user._id,
        text: "like your post.",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const getPost =
  ({detailPost, id, auth}) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const res = await getDataAPI(`post/${id}`, auth.token);
        dispatch({type: POST_TYPES.GET_POST, payload: res.data.post});
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: {error: err.response.data.msg},
        });
      }
    }
  };
export const deletePost =
  ({post, auth, socket}) =>
  async (dispatch) => {
    dispatch({type: POST_TYPES.DELETE_POST, payload: post});
    try {
      const res = await deleteDataAPI(`post/${post._id}`, auth.token);
      // Notify
      const msg = {
        id: post._id,
        text: "added a new post.",
        recipients: res.data.newPost.user.followers,
        url: `/post/${post._id}`,
      };
      dispatch(removeNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const savePost =
  ({post, auth}) =>
  async (dispatch) => {
    const newUser = {...auth.user, saved: [...auth.user.saved, post._id]};
    dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}});
    try {
      await patchDataAPI(`savePost/${post._id}`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const unSavePost =
  ({post, auth}) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };
    dispatch({type: GLOBALTYPES.AUTH, payload: {...auth, user: newUser}});
    try {
      await patchDataAPI(`unSavePost/${post._id}`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };

import {GLOBALTYPES, DeleteData} from "./globalTypes";
import {getDataAPI, patchDataAPI} from "../../utils/fetchData";
import {imageUpload} from "../../utils/imageUpload";
import {createNotify, removeNotify} from "../actions/notifyAction";
export const PROFILE_TYPES = {
  LOADING: "LOADING_PROFILE",
  GET_USER: "GET_PROFILE_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_ID: "GET_PROFILE_ID",
  GET_POSTS: "GET_PROFILE_POSTS",
  UPDATE_POST: "UPDATE_PROFILE_POST",
};
export const getProfileUsers =
  ({id, auth}) =>
  async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id});
    try {
      dispatch({type: PROFILE_TYPES.LOADING, payload: true});
      const res = getDataAPI(`/user/${id}`, auth.token);
      const res1 = getDataAPI(`/user_posts/${id}`, auth.token);
      const users = await res;
      const posts = await res1;
      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: users.data,
      });
      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: {...posts.data, _id: id, page: 2},
      });
      dispatch({type: PROFILE_TYPES.LOADING, payload: false});
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const updateProfileUser =
  ({userData, avatar, auth}) =>
  async (dispatch) => {
    if (!userData.fullname)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: "Please add your full name."},
      });
    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: "Your full name too long."},
      });
    if (userData.story.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: "Your story too long."},
      });
    try {
      let media;
      dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}});
      if (avatar) media = await imageUpload([avatar]);
      const res = await patchDataAPI(
        "user",
        {
          ...userData,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });
      dispatch({type: GLOBALTYPES.ALERT, payload: {success: res.data.msg}});
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const follow =
  ({users, user, auth, socket}) =>
  async (dispatch) => {
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = {...user, followers: [...user.followers, auth.user]};
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {...item, followers: [...item.followers, auth.user]};
        }
      });
    }
    dispatch({type: PROFILE_TYPES.FOLLOW, payload: newUser});
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {...auth.user, following: [...auth.user.following, newUser]},
      },
    });
    try {
      const res = await patchDataAPI(
        `user/${user._id}/follow`,
        null,
        auth.token
      );
      socket.emit("follow", res.data.newUser);
      // Notify
      const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };
      dispatch(createNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };
export const unfollow =
  ({users, user, auth, socket}) =>
  async (dispatch) => {
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = {...user, followers: DeleteData(user.followers, auth.user._id)};
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }
    dispatch({type: PROFILE_TYPES.UNFOLLOW, payload: newUser});
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });
    try {
      const res = await patchDataAPI(
        `user/${user._id}/unfollow`,
        null,
        auth.token
      );
      socket.emit("unFollow", res.data.newUser);
      // Notify
      const msg = {
        id: auth.user._id,
        text: "has started to follow you.",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };
      dispatch(removeNotify({msg, auth, socket}));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: err.response.data.msg},
      });
    }
  };

import {GLOBALTYPES} from "../actions/globalTypes";
import {getDataAPI} from "../../utils/fetchData";
export const SUGGES_TYPES = {
  LOADING: "LOADING_SUGGES",
  GET_USERS: "GET_USERS_SUGGES",
};
export const getSuggestions = (token) => async (dispatch) => {
  try {
    dispatch({type: SUGGES_TYPES.LOADING, payload: true});
    const res = await getDataAPI("suggestionsUser", token);
    dispatch({type: SUGGES_TYPES.GET_USERS, payload: res.data});
    dispatch({type: SUGGES_TYPES.LOADING, payload: false});
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response.data.msg},
    });
  }
};
