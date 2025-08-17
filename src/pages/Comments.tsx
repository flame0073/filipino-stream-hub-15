import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MessageCircle, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: Timestamp;
  parentId?: string;
  replies?: Comment[];
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const COMMENTS_PER_PAGE = 20;

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        allComments.push({ id: doc.id, ...doc.data() } as Comment);
      });
      
      // Organize comments into threads
      const commentMap = new Map<string, Comment>();
      const topLevelComments: Comment[] = [];
      
      // First pass: create a map of all comments
      allComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      // Second pass: organize into parent-child relationships
      allComments.forEach(comment => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
          const parent = commentMap.get(comment.parentId)!;
          parent.replies!.push(commentMap.get(comment.id)!);
        } else if (!comment.parentId) {
          topLevelComments.push(commentMap.get(comment.id)!);
        }
      });
      
      // Sort replies by timestamp (oldest first for better thread reading)
      topLevelComments.forEach(comment => {
        if (comment.replies) {
          comment.replies.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        }
      });
      
      setComments(topLevelComments);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await addDoc(collection(db, 'comments'), {
        name: name.trim(),
        message: message.trim(),
        timestamp: Timestamp.now(),
      });
      
      setMessage('');
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyName.trim() || !replyMessage.trim() || !replyingTo) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setReplyLoading(true);
    
    try {
      await addDoc(collection(db, 'comments'), {
        name: replyName.trim(),
        message: replyMessage.trim(),
        timestamp: Timestamp.now(),
        parentId: replyingTo,
      });
      
      setReplyMessage('');
      setReplyingTo(null);
      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    } finally {
      setReplyLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={isReply ? "ml-8 mt-3" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} bg-primary/10 rounded-full flex items-center justify-center`}>
            <User className={`${isReply ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold text-foreground ${isReply ? 'text-sm' : ''}`}>
                {comment.name}
              </h4>
              <span className="text-sm text-muted-foreground">
                {formatDate(comment.timestamp)}
              </span>
            </div>
            <p className={`text-foreground whitespace-pre-wrap ${isReply ? 'text-sm' : ''}`}>
              {comment.message}
            </p>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(comment.id);
                  // Only set name if empty to avoid focus issues
                  if (!replyName.trim()) {
                    setReplyName(name || '');
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Comments</h1>
            </div>
            <p className="text-muted-foreground">Share your thoughts about flameiptv</p>
          </div>

          {/* Comment Form */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Leave a Comment</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Write your comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reply Form - Separate component to avoid nesting issues */}
          {replyingTo && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Reply to Comment</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReplySubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your name"
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                      className="w-full"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit"
                      size="sm" 
                      disabled={replyLoading}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {replyLoading ? 'Posting...' : 'Post Reply'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Comments ({comments.length})
            </h2>
            
            {comments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Paginated Comments */}
                {(() => {
                  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
                  const endIndex = startIndex + COMMENTS_PER_PAGE;
                  const paginatedComments = comments.slice(startIndex, endIndex);
                  
                  return paginatedComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ));
                })()}
                
                {/* Pagination */}
                {comments.length > COMMENTS_PER_PAGE && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {(() => {
                          const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
                          const pages = [];
                          
                          // Always show first page
                          if (totalPages > 0) {
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink 
                                  onClick={() => setCurrentPage(1)}
                                  isActive={currentPage === 1}
                                  className="cursor-pointer"
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          // Show ellipsis if needed
                          if (currentPage > 3) {
                            pages.push(
                              <PaginationItem key="ellipsis1">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          
                          // Show current page and adjacent pages
                          for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink 
                                  onClick={() => setCurrentPage(i)}
                                  isActive={currentPage === i}
                                  className="cursor-pointer"
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          // Show ellipsis if needed
                          if (currentPage < totalPages - 2) {
                            pages.push(
                              <PaginationItem key="ellipsis2">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          
                          // Always show last page if more than 1 page
                          if (totalPages > 1) {
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink 
                                  onClick={() => setCurrentPage(totalPages)}
                                  isActive={currentPage === totalPages}
                                  className="cursor-pointer"
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          
                          return pages;
                        })()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(comments.length / COMMENTS_PER_PAGE)))}
                            className={currentPage >= Math.ceil(comments.length / COMMENTS_PER_PAGE) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;