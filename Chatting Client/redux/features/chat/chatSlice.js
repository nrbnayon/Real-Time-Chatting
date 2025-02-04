// redux\features\chat\chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axiosConfig";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/chat");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch chats");
    }
  }
);

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post("/chat", { userId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to access chat");
    }
  }
);

// New action for updating chat
export const updateChatPin = createAsyncThunk(
  "chat/updateChatPin",
  async ({ chatId, isPinned }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/chat/${chatId}`, { isPinned });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update chat");
    }
  }
);

// New action for deleting chat
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      await axios.delete(`/chat/${chatId}`);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete chat");
    }
  }
);

const initialState = {
  chats: [],
  selectedChat: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    updateChatHidden: (state, action) => {
      const { chatId, isHidden } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].isHidden = isHidden;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chats";
      })
      // Access Chat
      .addCase(accessChat.fulfilled, (state, action) => {
        const exists = state.chats.find(
          (chat) => chat._id === action.payload._id
        );
        if (!exists) {
          state.chats.unshift(action.payload);
        }
        state.selectedChat = action.payload;
      })
      // Update Chat Pin
      .addCase(updateChatPin.fulfilled, (state, action) => {
        const chatIndex = state.chats.findIndex(
          (chat) => chat._id === action.payload._id
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex] = action.payload;
        }
      })
      // Delete Chat
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
        if (state.selectedChat?._id === action.payload) {
          state.selectedChat = null;
        }
      });
  },
});

export const { selectChat, updateChatHidden } = chatSlice.actions;
export default chatSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../utils/axiosConfig";

// export const fetchChats = createAsyncThunk(
//   "chat/fetchChats",
//   async (_, { rejectWithValue }) => {
//     try {
//       console.log("Fetching chats from API");
//       const response = await axios.get("/chat");
//       console.log("Fetched chats:", response.data.data);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       return rejectWithValue(error.response?.data || "Failed to fetch chats");
//     }
//   }
// );

// export const accessChat = createAsyncThunk(
//   "chat/accessChat",
//   async (userId, { rejectWithValue }) => {
//     try {
//       console.log("Accessing chat with user:", userId);
//       const response = await axios.post("/chat", { userId });
//       console.log("Accessed chat:", response.data.data);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error accessing chat:", error);
//       return rejectWithValue(error.response?.data || "Failed to access chat");
//     }
//   }
// );

// const initialState = {
//   chats: [],
//   selectedChat: null,
//   loading: false,
//   error: null,
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     selectChat: (state, action) => {
//       console.log("Selecting chat:", action.payload._id);
//       state.selectedChat = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchChats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.chats = action.payload;
//         console.log("Chats updated in state:", state.chats);
//       })
//       .addCase(fetchChats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch chats";
//         console.error("Failed to fetch chats:", action.payload);
//       })
//       .addCase(accessChat.fulfilled, (state, action) => {
//         const exists = state.chats.find(
//           (chat) => chat._id === action.payload._id
//         );
//         if (!exists) {
//           state.chats.unshift(action.payload);
//           console.log("New chat added to state:", action.payload);
//         }
//         state.selectedChat = action.payload;
//         console.log("Selected chat updated:", state.selectedChat);
//       });
//   },
// });

// export const { selectChat } = chatSlice.actions;
// export default chatSlice.reducer;
