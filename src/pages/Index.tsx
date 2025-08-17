import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, TrendingUp, Users, Film, Tv, Radio, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie, TVShow, tmdbApi } from '@/lib/tmdb';
import { channels } from '@/data/channels';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredShows, setFeaturedShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setIsLoading(true);
      const [moviesData, showsData] = await Promise.all([
        tmdbApi.getPopularMovies(1),
        tmdbApi.getPopularTVShows(1)
      ]);
      setFeaturedMovies(moviesData.results.slice(0, 6));
      setFeaturedShows(showsData.results.slice(0, 6));
    } catch (error) {
      console.error('Failed to load featured content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const heroMovie = featuredMovies[0];
  const totalChannels = channels.length;
  const liveChannels = channels.filter(c => c.type !== 'youtube').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${tmdbApi.getImageUrl(heroMovie.backdrop_path, 'original')})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                Featured Movie
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {heroMovie.title}
              </h1>
              <p className="text-lg text-white/90 mb-6 line-clamp-3">
                {heroMovie.overview}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <Badge variant="outline" className="text-white border-white/50">
                  {new Date(heroMovie.release_date).getFullYear()}
                </Badge>
                <Badge variant="outline" className="text-white border-white/50">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {heroMovie.vote_average.toFixed(1)}
                </Badge>
              </div>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/movies')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/movies')}
                  className="text-white border-white/50 hover:bg-white/10"
                >
                  View All Movies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalChannels}+</div>
                <p className="text-sm text-muted-foreground">Live Channels</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-secondary/20 p-3 rounded-full">
                <Film className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <p className="text-sm text-muted-foreground">Movies</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-accent/20 p-3 rounded-full">
                <Tv className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <p className="text-sm text-muted-foreground">TV Shows</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Navigation */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8">Explore Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-primary/5 to-primary/10"
              onClick={() => navigate('/channels')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <Radio className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mb-2">Live TV</CardTitle>
                <CardDescription>Watch live channels and broadcasts</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10"
              onClick={() => navigate('/movies')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-secondary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                  <Film className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="mb-2">Movies</CardTitle>
                <CardDescription>Discover popular and trending movies</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-accent/5 to-accent/10"
              onClick={() => navigate('/tv-series')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-accent/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                  <Tv className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="mb-2">TV Series</CardTitle>
                <CardDescription>Binge-watch your favorite shows</CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-muted/5 to-muted/10"
              onClick={() => navigate('/comments')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-muted/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-muted/30 transition-colors">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">Comments</CardTitle>
                <CardDescription>Join the community discussion</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Movies */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Trending Movies</h2>
              <p className="text-muted-foreground">Popular movies right now</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/movies')}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 rounded" />
                  <Skeleton className="h-3 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredMovies.map((movie) => (
                <Card 
                  key={movie.id} 
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg overflow-hidden"
                  onClick={() => navigate('/movies')}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={tmdbApi.getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <Button 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/80">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured TV Shows */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular TV Shows</h2>
              <p className="text-muted-foreground">Trending series to binge-watch</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/tv-series')}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 rounded" />
                  <Skeleton className="h-3 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {featuredShows.map((show) => (
                <Card 
                  key={show.id} 
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg overflow-hidden"
                  onClick={() => navigate('/tv-series')}
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={tmdbApi.getImageUrl(show.poster_path)}
                      alt={show.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <Button 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/80">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {show.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {show.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(show.first_air_date).getFullYear()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Popular Channels Preview */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Popular Channels</h2>
              <p className="text-muted-foreground">Top live TV channels</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/channels')}>
              View All Channels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {channels.slice(0, 6).map((channel, index) => (
              <Card 
                key={`${channel.name}-${index}`}
                className="group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => navigate('/channels')}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative mb-3">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-16 h-16 mx-auto rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {channel.name}
                  </h3>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {channel.category || 'General'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;