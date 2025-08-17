import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

export const VideoModal = ({ isOpen, onClose, title, videoUrl }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
        <DialogHeader className="absolute top-4 left-4 z-10">
          <DialogTitle className="text-white bg-black/50 px-3 py-1 rounded">
            {title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-0 right-0 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        <div className="w-full h-full">
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};