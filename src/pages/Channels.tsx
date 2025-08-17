import { useState, useMemo } from 'react';
import { ChannelGrid } from '@/components/ChannelGrid';
import { VideoPlayer } from '@/components/VideoPlayer';
import { channels, Channel } from '@/data/channels';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, EyeOff } from 'lucide-react';

const Channels = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelsHidden, setChannelsHidden] = useState(false);
  const { toast } = useToast();

  const filteredChannels = useMemo(() => {
    if (channelsHidden) {
      return [];
    }

    if (!searchTerm.trim()) {
      return channels;
    }

    // Split search terms by comma and trim whitespace
    const searchTerms = searchTerm
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      return channels;
    }

    return channels.filter(channel => {
      const channelName = channel.name.toLowerCase();
      const channelCategory = channel.category?.toLowerCase() || '';
      
      // Check if any search term matches the channel name or category
      return searchTerms.some(term => 
        channelName.includes(term) || channelCategory.includes(term)
      );
    });
  }, [searchTerm, channelsHidden]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    toast({
      title: "Loading Channel",
      description: `Starting ${channel.name}...`,
    });
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-elegant border-b border-primary/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground mb-2">Live TV Channels</h1>
              <p className="text-primary-foreground/80">Watch live television and broadcasts</p>
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
          {/* Video Player */}
          <div className="w-full lg:w-2/3 flex-shrink-0">
            <div className="sticky top-6">
              <VideoPlayer
                channel={selectedChannel}
                onClose={handleClosePlayer}
              />
            </div>
          </div>

          {/* Channel List */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  All Channels
                </h2>
                <p className="text-sm text-muted-foreground">
                  {channelsHidden ? 'Channels hidden' : `${filteredChannels.length} channel${filteredChannels.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChannelsHidden(!channelsHidden)}
                className="flex items-center gap-2"
              >
                {channelsHidden ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Channels
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Channels
                  </>
                )}
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              <ChannelGrid
                channels={filteredChannels}
                onChannelSelect={handleChannelSelect}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            flameiptv
          </p>
          <div className="mt-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">💰 GCASH: 09310799262</p>
            <p className="text-xs text-muted-foreground mt-1">Support the stream</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Channels;