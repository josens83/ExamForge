"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Discussion, Comment } from "@/types";

interface DiscussionThreadProps {
  discussion: Discussion;
  comments: Comment[];
  currentUserId: string;
  onUpvote?: (discussionId: string) => void;
  onDownvote?: (discussionId: string) => void;
  onComment?: (discussionId: string, content: string, parentId?: string) => void;
  onAcceptAnswer?: (commentId: string) => void;
  onResolve?: (discussionId: string) => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}

function CommentItem({
  comment,
  currentUserId,
  onUpvote,
  onReply,
  onAccept,
  isOP,
  depth = 0,
}: {
  comment: Comment;
  currentUserId: string;
  onUpvote?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  onAccept?: (commentId: string) => void;
  isOP: boolean;
  depth?: number;
}) {
  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-8 mt-3")}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={comment.userImage} />
        <AvatarFallback>{comment.userName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div
          className={cn(
            "p-3 rounded-lg",
            comment.isAccepted ? "bg-green-50 dark:bg-green-950 border border-green-500" : "bg-muted"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </span>
            {comment.isAccepted && (
              <Badge className="bg-green-500 text-xs">채택됨</Badge>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm">
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onUpvote?.(comment.id)}
          >
            <span>👍</span>
            <span>{comment.upvotes}</span>
          </button>
          <button
            className="text-muted-foreground hover:text-primary"
            onClick={() => onReply?.(comment.id)}
          >
            답글
          </button>
          {isOP && !comment.isAccepted && (
            <button
              className="text-green-600 hover:text-green-700"
              onClick={() => onAccept?.(comment.id)}
            >
              답변 채택
            </button>
          )}
        </div>

        {/* Nested replies */}
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            currentUserId={currentUserId}
            onUpvote={onUpvote}
            onReply={onReply}
            onAccept={onAccept}
            isOP={isOP}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}

export function DiscussionThread({
  discussion,
  comments,
  currentUserId,
  onUpvote,
  onDownvote,
  onComment,
  onAcceptAnswer,
  onResolve,
}: DiscussionThreadProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const isOP = discussion.userId === currentUserId;

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onComment?.(discussion.id, newComment, replyingTo || undefined);
    setNewComment("");
    setReplyingTo(null);
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        {/* Discussion header */}
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={discussion.userImage} />
            <AvatarFallback>{discussion.userName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{discussion.userName}</span>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(discussion.createdAt)}
              </span>
              {discussion.isPinned && (
                <Badge variant="secondary">📌 고정</Badge>
              )}
              {discussion.isResolved && (
                <Badge className="bg-green-500">✓ 해결됨</Badge>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">{discussion.title}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {discussion.content}
            </p>
          </div>
        </div>

        {/* Discussion actions */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t">
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onUpvote?.(discussion.id)}
          >
            <span>👍</span>
            <span>{discussion.upvotes}</span>
          </button>
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
            onClick={() => onDownvote?.(discussion.id)}
          >
            <span>👎</span>
            <span>{discussion.downvotes}</span>
          </button>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span>👁️</span>
            <span>{discussion.viewCount}</span>
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span>💬</span>
            <span>{discussion.commentCount}</span>
          </span>
          {isOP && !discussion.isResolved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve?.(discussion.id)}
            >
              해결됨으로 표시
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Comments */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold">답변 {comments.length}개</h3>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onUpvote={(id) => console.log("Upvote comment", id)}
              onReply={(id) => setReplyingTo(id)}
              onAccept={onAcceptAnswer}
              isOP={isOP}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              아직 답변이 없습니다. 첫 답변을 작성해보세요!
            </p>
          )}
        </div>

        {/* Comment input */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">
            {replyingTo ? "답글 작성" : "답변 작성"}
          </h4>
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <span>답글을 작성 중...</span>
              <button
                className="text-primary hover:underline"
                onClick={() => setReplyingTo(null)}
              >
                취소
              </button>
            </div>
          )}
          <Textarea
            placeholder="답변을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              {replyingTo ? "답글 작성" : "답변 작성"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
