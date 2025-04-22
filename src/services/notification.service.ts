// import prisma from "../config/prisma.config";
// import { DatabaseError } from "../utils/errors";
// import * as commentModel from "../model/v1/comment.model";
// import * as postModel from "../model/v1/post.model";

// export enum NotificationType {
//   COMMENT = "COMMENT",
//   LIKE = "LIKE",
//   REPLY = "REPLY",
// }

// export interface CreateNotificationInput {
//   recipientId: string; // The user who will receive the notification
//   senderId: string; // The user who triggered the notification
//   postId: string; // The post related to the notification
//   type: NotificationType;
//   content: string; // Specific message content
// }

// export interface HandleCommentNotificationsInput {
//   userId: string;
//   postOwnerId: string;
//   postTitle: string;
//   postId: string;
//   parentId?: string | null;
// }

// export interface HandleLikeNotificationInput {
//   userId: string;
//   postOwnerId: string;
//   postTitle: string;
//   postId: string;
// }

// class NotificationService {
//   static async createNotification(data: CreateNotificationInput) {
//     try {
//       const notification = await prisma.notifications.create({
//         data: {
//           recipientId: data.recipientId,
//           senderId: data.senderId,
//           postId: data.postId,
//           type: data.type,
//           content: data.content,
//           isRead: false,
//         },
//       });
//       return notification;
//     } catch (error: any) {
//       throw new DatabaseError(error.message);
//     }
//   }

//   static async getUsernameById(userId: string): Promise<string> {
//     const user = await prisma.users.findUnique({ where: { id: userId } });
//     if (!user) throw new DatabaseError("User not found");
//     return user.username;
//   }

//   static async notifyCommentOnPost(
//     recipientId: string,
//     senderId: string,
//     postTitle: string,
//     postId: string
//   ) {
//     const senderUsername = await this.getUsernameById(senderId);
//     const content = `User ${senderUsername} commented on your post "${postTitle}"`;
//     return this.createNotification({
//       recipientId,
//       senderId,
//       postId,
//       type: NotificationType.COMMENT,
//       content,
//     });
//   }

//   static async notifyReplyToComment(
//     recipientId: string,
//     senderId: string,
//     commentSnippet: string,
//     postId: string
//   ) {
//     const senderUsername = await this.getUsernameById(senderId);
//     const content = `User ${senderUsername} replied to your comment "${commentSnippet}"`;
//     return this.createNotification({
//       recipientId,
//       senderId,
//       postId,
//       type: NotificationType.REPLY,
//       content,
//     });
//   }

//   static async notifyLikeOnPost(
//     recipientId: string,
//     senderId: string,
//     postTitle: string,
//     postId: string
//   ) {
//     const senderUsername = await this.getUsernameById(senderId);
//     const content = `User ${senderUsername} liked your post "${postTitle}"`;
//     return this.createNotification({
//       recipientId,
//       senderId,
//       postId,
//       type: NotificationType.LIKE,
//       content,
//     });
//   }

//   static async handleCommentNotifications(data: HandleCommentNotificationsInput) {
//     const { userId, postOwnerId, postTitle, postId, parentId } = data;

//     if (parentId) {
//       const parentComment = await commentModel.getCommentById(parentId);
//       if (parentComment && parentComment.userId !== userId) {
//         const commentSnippet = parentComment.message.slice(0, 50);
//         await this.notifyReplyToComment(
//           parentComment.userId,
//           userId,
//           commentSnippet,
//           postId
//         );
//       }
//     } else if (postOwnerId !== userId) {
//       await this.notifyCommentOnPost(postOwnerId, userId, postTitle, postId);
//     }
//   }

//   static async handleLikeNotification(data: HandleLikeNotificationInput) {
//     const { userId, postOwnerId, postTitle, postId } = data;

//     if (postOwnerId !== userId) {
//       await this.notifyLikeOnPost(postOwnerId, userId, postTitle, postId);
//     }
//   }
// }

// export default NotificationService;
