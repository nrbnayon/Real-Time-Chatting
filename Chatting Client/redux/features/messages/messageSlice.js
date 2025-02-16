// // redux\features\messages\messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      console.log("[messageSlice] Fetching messages for chat:", chatId);
      const response = await fetch(`/api/messages/${chatId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch messages");
      }

      console.log("[messageSlice] Fetched messages:", data.data);
      return data.data;
    } catch (error) {
      console.error("[messageSlice] Error fetching messages:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ content, chatId, replyToId }, { rejectWithValue }) => {
    try {
      console.log("[messageSlice] Sending message:", {
        content,
        chatId,
        replyToId,
      });
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, chatId, replyToId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      console.log("[messageSlice] Message sent successfully:", data.data);
      return data.data;
    } catch (error) {
      console.error("[messageSlice] Error sending message:", error);
      return rejectWithValue(error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messagesByChat: {}, // Organize messages by chatId
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const { chatId } = action.payload;
      console.log("[messageSlice] Adding new message for chat:", chatId);
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }
      state.messagesByChat[chatId].push(action.payload);
    },
    updateMessage: (state, action) => {
      const { chatId, _id } = action.payload;
      console.log("[messageSlice] Updating message:", _id, "in chat:", chatId);
      if (state.messagesByChat[chatId]) {
        const index = state.messagesByChat[chatId].findIndex(
          (msg) => msg._id === _id
        );
        if (index !== -1) {
          state.messagesByChat[chatId][index] = action.payload;
        }
      }
    },
    deleteMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      console.log(
        "[messageSlice] Deleting message:",
        messageId,
        "from chat:",
        chatId
      );
      if (state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = state.messagesByChat[chatId].filter(
          (msg) => msg._id !== messageId
        );
      }
    },
    clearMessages: (state, action) => {
      const chatId = action.payload;
      console.log("[messageSlice] Clearing all messages for chat:", chatId);
      delete state.messagesByChat[chatId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        console.log("[messageSlice] Fetching messages pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        console.log("[messageSlice] Fetching messages fulfilled");
        state.loading = false;
        // Store messages by chatId
        if (action.payload?.length > 0) {
          const chatId = action.payload[0].chat;
          console.log("[messageSlice] Storing messages for chat:", chatId);
          state.messagesByChat[chatId] = action.payload;
        } else {
          console.log("[messageSlice] No messages received in payload");
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        console.log(
          "[messageSlice] Fetching messages rejected:",
          action.payload
        );
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const chatId = action.payload.chat;
        console.log("[messageSlice] Send message fulfilled for chat:", chatId);
        if (!state.messagesByChat[chatId]) {
          state.messagesByChat[chatId] = [];
        }
        state.messagesByChat[chatId].push(action.payload);
      });
  },
});

export const { addMessage, updateMessage, deleteMessage, clearMessages } =
  messageSlice.actions;

// Selectors with debugging
export const selectMessagesByChatId = (state, chatId) => {
  console.log("[messageSlice] Selecting messages for chat:", chatId);
  console.log("[messageSlice] Current state:", state.messages.messagesByChat);
  return state.messages.messagesByChat[chatId] || [];
};
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectMessagesError = (state) => state.messages.error;

export default messageSlice.reducer;
// // redux/features/messages/messageSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchMessages = createAsyncThunk(
//   "messages/fetchMessages",
//   async (chatId, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`/api/messages/${chatId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch messages");
//       }

//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const sendMessage = createAsyncThunk(
//   "messages/sendMessage",
//   async ({ content, chatId, replyToId }, { rejectWithValue }) => {
//     try {
//       const response = await fetch("/api/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content, chatId, replyToId }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to send message");
//       }

//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const messageSlice = createSlice({
//   name: "messages",
//   initialState: {
//     messagesByChat: {}, // Organize messages by chatId
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     addMessage: (state, action) => {
//       const { chatId } = action.payload;
//       if (!state.messagesByChat[chatId]) {
//         state.messagesByChat[chatId] = [];
//       }
//       state.messagesByChat[chatId].push(action.payload);
//     },
//     updateMessage: (state, action) => {
//       const { chatId, _id } = action.payload;
//       if (state.messagesByChat[chatId]) {
//         const index = state.messagesByChat[chatId].findIndex(
//           (msg) => msg._id === _id
//         );
//         if (index !== -1) {
//           state.messagesByChat[chatId][index] = action.payload;
//         }
//       }
//     },
//     deleteMessage: (state, action) => {
//       const { chatId, messageId } = action.payload;
//       if (state.messagesByChat[chatId]) {
//         state.messagesByChat[chatId] = state.messagesByChat[chatId].filter(
//           (msg) => msg._id !== messageId
//         );
//       }
//     },
//     clearMessages: (state, action) => {
//       const chatId = action.payload;
//       delete state.messagesByChat[chatId];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMessages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         // Store messages by chatId
//         if (action.payload?.length > 0) {
//           const chatId = action.payload[0].chat;
//           state.messagesByChat[chatId] = action.payload;
//         }
//       })
//       .addCase(fetchMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         const chatId = action.payload.chat;
//         if (!state.messagesByChat[chatId]) {
//           state.messagesByChat[chatId] = [];
//         }
//         state.messagesByChat[chatId].push(action.payload);
//       });
//   },
// });

// export const { addMessage, updateMessage, deleteMessage, clearMessages } =
//   messageSlice.actions;

// // Selectors
// export const selectMessagesByChatId = (state, chatId) =>
//   state.messages.messagesByChat[chatId] || [];
// export const selectMessagesLoading = (state) => state.messages.loading;
// export const selectMessagesError = (state) => state.messages.error;

// export default messageSlice.reducer;
